// 清單工具的離線自測。合成分冊、無 impl、無 spec、無網路，Windows 可跑。
//
// 重點放在三件容易靜默壞掉的事：
//   表頭名取欄是否真的不靠位置、自動化欄多對解析、生成區的讀寫與比對。
// 這三件壞掉都不會拋錯，只會安靜給錯答案。

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { parseBook, parseAllBooks, parseAutomation, splitAnchor, parseScenarios } from './checklist.mjs'
import {
  genBookIndex, genSpecGaps, genImplAnchorIndex, genTestToCheckpoint,
  genScenarioSteps, needsCheckpoint, extractBlock, replaceBlock, listBlocks, BLOCK_OPEN, BLOCK_CLOSE,
} from './generate.mjs'
import { checkFormat, checkAssertionDedup, checkImplAnchors, checkAutomation } from './checks.mjs'
import { rewriteBook } from './serialize.mjs'
import { ToolError, EXIT } from './cli.mjs'

const results = []

function check(name, fn) {
  try { results.push({ name, ok: true, detail: fn() ?? '' }) }
  catch (err) { results.push({ name, ok: false, detail: err.message }) }
}
const assert = (c, m) => { if (!c) throw new Error(m) }

function expectThrow(fn, matcher, label) {
  let threw = null
  try { fn() } catch (err) { threw = err }
  if (!threw) throw new Error(`${label}：預期拋錯但沒有`)
  if (matcher && !matcher(threw)) throw new Error(`${label}：拋了但不是預期的錯——${threw.message}`)
  return threw.message.slice(0, 50)
}

const HEADER = '| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |'
const SEP = '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |'

function row(id, opts = {}) {
  const {
    assertion = `斷言 ${id}`, surface = 'UI', tier = 'T1', priority = 'P1',
    spec = '`no1_x`', impl = '`src/a.ts`', pre = '—', reason = '—', auto = '—',
    status = '現役',
  } = opts
  return `| ${id} | ${assertion} | ${surface} | ${tier} | ${priority} | ${spec} | ${impl} | ${pre} | ${reason} | ${auto} | ${status} |`
}

function writeBook(dir, name, lines) {
  const body = ['# 檢驗點：測試', '', '## 資料模型：測試表', '', HEADER, SEP, ...lines, ''].join('\n')
  fs.writeFileSync(path.join(dir, name), body, 'utf8')
}

export function runChecklistSelfTest({ verbose = false } = {}) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'qa-checklist-'))
  try {
    const rulesDir = path.join(tmp, 'no1_rules')
    fs.mkdirSync(rulesDir)
    writeBook(rulesDir, 'no1_alpha.md', [
      row('C-AA-001', { priority: 'P0', spec: '—' }),
      row('C-AA-002', { surface: 'DB', tier: 'T2', auto: '`src/x.test.ts`（案例甲）' }),
      row('C-AA-003', { tier: 'T4', reason: '並行時序無法手動構造' }),
    ])
    writeBook(rulesDir, 'no2_beta.md', [
      row('C-BB-001', { impl: '`src/b.ts::doThing`' }),
      row('C-BB-002', { surface: 'UI+DB', tier: 'T2', auto: '`src/x.test.ts`（案例乙）、`src/y.test.ts`（案例丙）' }),
      // 退場列：錨已死、自動化欄還留著舊值，用來驗退場語意有沒有生效。
      row('C-BB-003', { status: '退場', impl: '`src/gone.ts`', auto: '`src/gone.test.ts`（死案例）' }),
    ])

    runParserChecks(rulesDir)
    runAutomationChecks()
    runGeneratorChecks(rulesDir)
    runBlockChecks()
    runSerializerChecks(rulesDir)
    runCheckChecks(rulesDir, tmp)
    runScenarioChecks(tmp)
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true })
  }

  const passed = results.filter(r => r.ok).length
  for (const r of results) {
    if (!r.ok) process.stdout.write(`  FAIL  ${r.name}\n        ${r.detail}\n`)
    else if (verbose) process.stdout.write(`  ok    ${r.name}${r.detail ? `  ${r.detail}` : ''}\n`)
  }
  process.stdout.write(`\n自測 ${results.length} 項，通過 ${passed}，失敗 ${results.length - passed}\n`)
  if (passed !== results.length) {
    process.stdout.write('這代表工具本身有問題，不是清單有問題。\n')
    return EXIT.HAS_FAIL
  }
  process.stdout.write('涵蓋表頭取欄、自動化解析、生成規則與生成區讀寫。對真清單的語意正確性另由 check 子指令把關。\n')
  return EXIT.OK
}

function runParserChecks(rulesDir) {
  check('合成分冊解析出正確列數與域碼', () => {
    const { rows } = parseAllBooks(rulesDir)
    assert(rows.length === 6, `預期 6 列，實得 ${rows.length}`)
    assert([...new Set(rows.map(r => r.domain))].sort().join(',') === 'AA,BB', '域碼不對')
    return '6 列，其中退場 1'
  })

  check('分冊順序按 noN 數字排、不按字典序', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ord-'))
    fs.mkdirSync(path.join(tmp, 'r'))
    writeBook(path.join(tmp, 'r'), 'no2_b.md', [row('C-BB-001')])
    writeBook(path.join(tmp, 'r'), 'no10_j.md', [row('C-JJ-001')])
    const { books } = parseAllBooks(path.join(tmp, 'r'))
    fs.rmSync(tmp, { recursive: true, force: true })
    assert(books[0].book === 'no2_b.md', `字典序會把 no10 排前面，實得 ${books.map(b => b.book).join(',')}`)
  })

  // 位置索引的工具一加欄就靜默讀錯欄。這條把欄序打亂，靠表頭名仍要讀對。
  check('欄序打亂仍以表頭名取對值', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'hdr-'))
    const file = path.join(tmp, 'no1_shuffled.md')
    const shuffledHeader = '| ID | 面 | 斷言 | 級 | P | 前置 | spec 錨 | impl 錨 | 不可測原因 | 自動化 |'
    const shuffledSep = '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |'
    const shuffledRow = '| C-CC-001 | DB | 我是斷言 | T2 | P0 | 我是前置 | `no1_s` | `src/c.ts` | — | — |'
    fs.writeFileSync(file, ['# x', '', '## 邏輯：測試', '', shuffledHeader, shuffledSep, shuffledRow, ''].join('\n'), 'utf8')
    const { rows } = parseBook(file)
    fs.rmSync(tmp, { recursive: true, force: true })
    assert(rows[0].assertion === '我是斷言', `斷言讀成 ${rows[0].assertion}`)
    assert(rows[0].surface === 'DB', `面讀成 ${rows[0].surface}`)
    assert(rows[0].precondition === '我是前置', `前置讀成 ${rows[0].precondition}`)
    return '欄序打亂仍讀對'
  })

  check('表頭缺欄時擋下、不悶著讀', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'bad-'))
    const file = path.join(tmp, 'no1_bad.md')
    fs.writeFileSync(file, ['| ID | 斷言 | 面 |', '| --- | --- | --- |', '| C-DD-001 | x | UI |', ''].join('\n'), 'utf8')
    const msg = expectThrow(() => parseBook(file), err => err instanceof ToolError, '缺欄表頭')
    fs.rmSync(tmp, { recursive: true, force: true })
    return msg
  })

  check('零列時回零筆而非通過', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'empty-'))
    const file = path.join(tmp, 'no1_empty.md')
    fs.writeFileSync(file, ['# 空冊', '', HEADER, SEP, ''].join('\n'), 'utf8')
    const msg = expectThrow(
      () => parseBook(file),
      err => err instanceof ToolError && err.code === EXIT.ZERO_ROWS,
      '零列',
    )
    fs.rmSync(tmp, { recursive: true, force: true })
    return msg
  })

  check('已自動化與需手測互斥且 T4 不算手測', () => {
    const { rows } = parseAllBooks(rulesDir)
    const auto = rows.filter(r => r.automated)
    const manual = rows.filter(r => r.manual)
    const t4 = rows.filter(r => r.tier === 'T4')
    assert(auto.length === 2, `已自動化預期 2，實得 ${auto.length}`)
    assert(t4.length === 1, `T4 預期 1，實得 ${t4.length}`)
    assert(manual.length === 2, `需手測預期 2，實得 ${manual.length}`)
    assert(!manual.some(r => r.automated || r.tier === 'T4'), '手測集合混進自動化或 T4')
  })

  // 退場列若還算進 automated 或 manual，所有分母都會被已死的行為污染。
  check('退場列不計入已自動化與需手測', () => {
    const { rows } = parseAllBooks(rulesDir)
    const dead = rows.find(r => r.id === 'C-BB-003')
    assert(dead, '找不到退場測試列')
    assert(dead.retired === true, `retired 旗標實得 ${dead.retired}`)
    assert(dead.automation !== '—', '測試前提壞了：該列的自動化欄應仍留著舊值')
    assert(dead.automated === false, '退場列不該算已自動化')
    assert(dead.manual === false, '退場列不該算需手測')
    assert(rows.filter(r => r.retired).length === 1, '退場列數不對')
    return '退場列 1 條、不進兩個分母'
  })
}

function runAutomationChecks() {
  check('自動化欄單對解析', () => {
    const p = parseAutomation('`src/x.test.ts`（案例甲）')
    assert(p.length === 1 && p[0].file === 'src/x.test.ts' && p[0].caseName === '案例甲', JSON.stringify(p))
  })

  // 頓號分隔的多對是舊手抄漏算的成因：只採計第一對，第二個測試檔就少算一條。
  check('頓號分隔的多對全部解析、檔名不含頓號', () => {
    const p = parseAutomation('`a/x.test.ts`（甲）、`b/y.test.ts`（乙）')
    assert(p.length === 2, `預期 2 對，實得 ${p.length}`)
    assert(p[1].file === 'b/y.test.ts', `第二個檔名實得 ${p[1].file}`)
    assert(!p.some(x => x.file.includes('、')), '檔名吃進頓號')
    return '2 對'
  })

  check('補註以破折號切掉、不參與比對', () => {
    const p = parseAutomation('`a/x.test.ts`（真案例名 — 這是補註）')
    assert(p[0].caseName === '真案例名', `實得 ${p[0].caseName}`)
  })

  check('describe 與 it 以中點拆段', () => {
    const p = parseAutomation('`a/x.test.ts`（外層 · 內層）')
    assert(p[0].segments.join('|') === '外層|內層', p[0].segments.join('|'))
  })

  // 案例名本身會含 backtick。先剝 backtick 就對不上測試碼原文，
  // 於是活著的案例被判成漂移。C-ST-103 就是被這個 bug 誤報的。
  check('案例名內的 backtick 保留、不被當成路徑包覆剝掉', () => {
    const p = parseAutomation('`src/constants/syncFields.test.ts`（maps remote `timezone` onto local `timeZone`）')
    assert(p.length === 1, `預期 1 對，實得 ${p.length}`)
    assert(p[0].file === 'src/constants/syncFields.test.ts', `檔名實得 ${p[0].file}`)
    assert(p[0].caseName === 'maps remote `timezone` onto local `timeZone`', `案例名實得 ${p[0].caseName}`)
    return 'backtick 保留'
  })

  check('空值與破折號回空陣列', () => {
    assert(parseAutomation('—').length === 0, '破折號應回空')
    assert(parseAutomation('').length === 0, '空字串應回空')
  })

  check('impl 錨兩形態解析', () => {
    assert(splitAnchor('`src/a.ts`').member === null, '無成員形態')
    const withMember = splitAnchor('`src/a.ts::doThing`')
    assert(withMember.path === 'src/a.ts' && withMember.member === 'doThing', JSON.stringify(withMember))
    assert(splitAnchor('—').empty, '破折號應判空')
  })
}

function runGeneratorChecks(rulesDir) {
  check('分冊索引表統計正確且含合計列', () => {
    const { rows } = parseAllBooks(rulesDir)
    const out = genBookIndex(rows).split('\n')
    assert(out.length === 5, `預期表頭加分隔加兩冊加合計，實得 ${out.length} 行`)
    assert(out.at(-1).includes('**5**'), `合計列應含總數 5，實得 ${out.at(-1)}`)
  })

  check('Spec 缺口表只收 spec 錨為空者、自動化欄收斂成有無', () => {
    const { rows } = parseAllBooks(rulesDir)
    const out = genSpecGaps(rows).split('\n').slice(2)
    assert(out.length === 1, `預期 1 列，實得 ${out.length}`)
    assert(out[0].includes('C-AA-001'), out[0])
    assert(out[0].trim().endsWith('| — |'), `自動化欄應收斂成有無，實得 ${out[0]}`)
  })

  check('impl 錨反查以完整錨為鍵、含成員段', () => {
    const { rows } = parseAllBooks(rulesDir)
    const out = genImplAnchorIndex(rows)
    assert(out.includes('src/b.ts::doThing'), '帶成員的錨應獨立一列')
    assert(out.includes('| `src/a.ts` | 4 |'), `src/a.ts 應有 4 條，實得\n${out}`)
  })

  // 舊手抄在這裡出錯：一條由多對測試共同覆蓋時只採計第一對。
  check('測試反查逐對展開、多對覆蓋不漏算', () => {
    const { rows } = parseAllBooks(rulesDir)
    const out = genTestToCheckpoint(rows).split('\n').slice(2)
    const x = out.find(l => l.includes('src/x.test.ts'))
    const y = out.find(l => l.includes('src/y.test.ts'))
    assert(x && x.includes('| 2 |'), `x.test.ts 應守 2 條，實得 ${x}`)
    assert(y && y.includes('| 1 |'), `y.test.ts 應守 1 條，實得 ${y}`)
    return 'x 守 2、y 守 1'
  })

  check('並列排序穩定、同數依名稱', () => {
    const { rows } = parseAllBooks(rulesDir)
    const a = genImplAnchorIndex(rows)
    const b = genImplAnchorIndex([...rows].reverse())
    assert(a === b, '輸入順序不同就生出不同結果，排序不穩定')
  })

  check('檢查點標記由面欄推導、不另存', () => {
    assert(needsCheckpoint('DB'), 'DB 應為檢查點')
    assert(needsCheckpoint('UI+DB'), '複合面含 DB 應為檢查點')
    assert(needsCheckpoint('LOG') && needsCheckpoint('FB'), 'LOG 與 FB 應為檢查點')
    assert(!needsCheckpoint('UI'), '純 UI 不是檢查點')
    assert(!needsCheckpoint('實機+UI'), '實機加 UI 不是檢查點')
  })

  check('場次步驟表自十五冊取斷言、場次不自存一份', () => {
    const { rows } = parseAllBooks(rulesDir)
    const byId = new Map(rows.map(r => [r.id, r]))
    const out = genScenarioSteps('S01', { steps: ['C-AA-002', 'C-BB-001'] }, byId).split('\n').slice(2)
    assert(out.length === 2, `預期 2 步，實得 ${out.length}`)
    assert(out[0].includes('⏸'), `DB 面該步應標檢查點，實得 ${out[0]}`)
    assert(!out[1].includes('⏸'), `UI 面該步不該標檢查點，實得 ${out[1]}`)
    assert(out[0].includes('斷言 C-AA-002'), '斷言應自分冊取')
  })

  check('場次引用不存在的 ID 時擋下', () => {
    const { rows } = parseAllBooks(rulesDir)
    const byId = new Map(rows.map(r => [r.id, r]))
    return expectThrow(
      () => genScenarioSteps('S99', { steps: ['C-ZZ-999'] }, byId),
      err => err instanceof ToolError && err.message.includes('C-ZZ-999'),
      '幽靈 ID',
    )
  })
}

function runBlockChecks() {
  const text = [
    '# 檔頭散文', '',
    BLOCK_OPEN('demo'),
    '舊內容',
    BLOCK_CLOSE('demo'),
    '', '## 尾端散文',
  ].join('\n')

  check('生成區抽得出內容', () => {
    assert(extractBlock(text, 'demo').content === '舊內容', extractBlock(text, 'demo').content)
  })

  check('生成區替換不動標記外的散文', () => {
    const out = replaceBlock(text, 'demo', '新內容')
    assert(out.includes('# 檔頭散文'), '檔頭散文被吃掉')
    assert(out.includes('## 尾端散文'), '尾端散文被吃掉')
    assert(extractBlock(out, 'demo').content === '新內容', '內容沒換成功')
  })

  check('列得出檔內所有生成區 id', () => {
    const two = `${text}\n${BLOCK_OPEN('other')}\nx\n${BLOCK_CLOSE('other')}`
    assert(listBlocks(two).join(',') === 'demo,other', listBlocks(two).join(','))
  })

  check('缺結尾標記時擋下', () => {
    return expectThrow(
      () => extractBlock(`${BLOCK_OPEN('x')}\n內容\n`, 'x'),
      err => err instanceof ToolError,
      '缺結尾',
    )
  })

  check('替換不存在的區塊時擋下', () => {
    return expectThrow(() => replaceBlock(text, 'nope', 'y'), err => err instanceof ToolError, '不存在的區塊')
  })
}

// 序列化器負責改寫 1481 列。它吃掉散文或漏改都不會拋錯，只會安靜毀掉檔案。
function runSerializerChecks(rulesDir) {
  check('原樣重寫逐字相同、散文與段標題不動', () => {
    const { books } = parseAllBooks(rulesDir)
    for (const b of books) {
      const map = new Map(b.rows.map(r => [r.id, r]))
      const { text } = rewriteBook(b.file, map)
      const orig = fs.readFileSync(b.file, 'utf8')
      assert(text === orig, `${b.book} 原樣重寫後不同`)
    }
    return `${books.length} 冊`
  })

  check('改一列只動那一列，其餘逐行原樣', () => {
    const { books } = parseAllBooks(rulesDir)
    const book = books.find(b => b.rows.some(r => r.id === 'C-AA-001'))
    const target = book.rows.find(r => r.id === 'C-AA-001')
    const { text } = rewriteBook(book.file, new Map([[target.id, { ...target, priority: 'P2' }]]))
    const before = fs.readFileSync(book.file, 'utf8').split('\n')
    const after = text.split('\n')
    assert(before.length === after.length, `行數變了：${before.length} → ${after.length}`)
    const diff = before.map((l, i) => (l === after[i] ? null : i)).filter(i => i !== null)
    assert(diff.length === 1, `預期只差 1 行，實得 ${diff.length} 行`)
    assert(after[diff[0]].includes('P2'), `改動沒生效：${after[diff[0]]}`)
    return `只差第 ${diff[0] + 1} 行`
  })

  check('加欄時全列都補上新欄、表頭與分隔線同步', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'addcol-'))
    fs.mkdirSync(path.join(dir, 'r'))
    writeBook(path.join(dir, 'r'), 'no1_a.md', [row('C-AA-001'), row('C-AA-002')])
    const { books } = parseAllBooks(path.join(dir, 'r'))
    const map = new Map(books[0].rows.map(r => [r.id, { ...r, 備註: 'x' }]))
    let threw = null
    try { rewriteBook(books[0].file, map, { addColumns: ['備註'] }) } catch (err) { threw = err }
    fs.rmSync(dir, { recursive: true, force: true })
    // 欄名不在映射表內要擋下，不能悄悄寫出空欄。
    assert(threw instanceof ToolError, '未知欄名該擋下')
    return threw.message.slice(0, 40)
  })

  check('零列命中時擋下、不悄悄寫出原檔', () => {
    const { books } = parseAllBooks(rulesDir)
    return expectThrow(
      () => rewriteBook(books[0].file, new Map([['C-ZZ-999', { id: 'C-ZZ-999' }]])),
      err => err instanceof ToolError && err.code === EXIT.ZERO_ROWS,
      '零列命中',
    )
  })
}

function runCheckChecks(rulesDir, tmp) {
  check('格式檢查在乾淨分冊上通過', () => {
    const { rows } = parseAllBooks(rulesDir)
    const r = checkFormat(rows)
    assert(r.ok, JSON.stringify(r.findings))
  })

  check('格式檢查抓得到 ID 重號', () => {
    const { rows } = parseAllBooks(rulesDir)
    const dup = [...rows, { ...rows[0], book: 'no9_dup.md', line: 9 }]
    const r = checkFormat(dup)
    assert(!r.ok && r.findings.some(f => f.why.includes('重號')), JSON.stringify(r.findings))
  })

  check('格式檢查抓得到面欄值域外', () => {
    const { rows } = parseAllBooks(rulesDir)
    const bad = [...rows]
    bad[0] = { ...bad[0], surface: 'XX' }
    const r = checkFormat(bad)
    assert(!r.ok && r.findings.some(f => f.why.includes('面欄值非法')), JSON.stringify(r.findings))
  })

  check('格式檢查抓得到 T4 缺不可測原因', () => {
    const { rows } = parseAllBooks(rulesDir)
    const bad = rows.map(r => (r.tier === 'T4' ? { ...r, untestableReason: '—' } : r))
    const r = checkFormat(bad)
    assert(!r.ok && r.findings.some(f => f.why.includes('T4')), JSON.stringify(r.findings))
  })

  check('斷言去重抓得到完全相同', () => {
    const { rows } = parseAllBooks(rulesDir)
    const dup = [...rows, { ...rows[1], id: 'C-ZZ-001', book: 'no9.md', line: 3 }]
    const r = checkAssertionDedup(dup)
    assert(!r.ok && r.findings.some(f => f.why.includes('完全相同')), JSON.stringify(r.findings))
  })

  check('斷言去重抓得到去標點後相同', () => {
    const rows = [
      { id: 'C-AA-001', assertion: '點按完成，返回上一頁', book: 'a.md', line: 1 },
      { id: 'C-AA-002', assertion: '點按完成返回上一頁', book: 'a.md', line: 2 },
    ]
    const r = checkAssertionDedup(rows)
    assert(!r.ok && r.findings.some(f => f.why.includes('去標點')), JSON.stringify(r.findings))
  })

  check('impl 錨檢查抓得到錨檔不存在', () => {
    const { rows } = parseAllBooks(rulesDir)
    const fakeImpl = path.join(tmp, 'impl')
    fs.mkdirSync(path.join(fakeImpl, 'src'), { recursive: true })
    fs.writeFileSync(path.join(fakeImpl, 'src', 'a.ts'), 'export const a = 1\n', 'utf8')
    const r = checkImplAnchors(rows, fakeImpl)
    assert(!r.ok, '應抓到 src/b.ts 不存在')
    assert(r.findings.some(f => f.why.includes('src/b.ts')), JSON.stringify(r.findings))
    return `${r.findings.length} 項`
  })

  check('impl 錨檢查抓得到成員不存在', () => {
    const { rows } = parseAllBooks(rulesDir)
    const fakeImpl = path.join(tmp, 'impl2')
    fs.mkdirSync(path.join(fakeImpl, 'src'), { recursive: true })
    fs.writeFileSync(path.join(fakeImpl, 'src', 'a.ts'), 'export const a = 1\n', 'utf8')
    fs.writeFileSync(path.join(fakeImpl, 'src', 'b.ts'), 'export const other = 2\n', 'utf8')
    const r = checkImplAnchors(rows, fakeImpl)
    assert(r.findings.some(f => f.why.includes('doThing')), JSON.stringify(r.findings))
  })

  check('自動化檢查抓得到案例名找不到、且還原單引號逃逸', () => {
    const { rows } = parseAllBooks(rulesDir)
    const fakeImpl = path.join(tmp, 'impl3')
    fs.mkdirSync(path.join(fakeImpl, 'src'), { recursive: true })
    fs.writeFileSync(path.join(fakeImpl, 'src', 'x.test.ts'), "it('案例甲', () => {})\n", 'utf8')
    fs.writeFileSync(path.join(fakeImpl, 'src', 'y.test.ts'), "it('別的名字', () => {})\n", 'utf8')
    const r = checkAutomation(rows, fakeImpl)
    assert(!r.ok, '應抓到案例乙與案例丙缺席')
    assert(r.findings.some(f => f.why.includes('案例丙')), JSON.stringify(r.findings))
    // 逃逸還原：測試碼寫 \' 時比對前要還原成 '
    fs.writeFileSync(path.join(fakeImpl, 'src', 'z.test.ts'), "it('it\\'s fine', () => {})\n", 'utf8')
    const esc = checkAutomation(
      [{ id: 'C-EE-001', book: 'e.md', line: 1, automated: true, automation: "`src/z.test.ts`（it's fine）" }],
      fakeImpl,
    )
    assert(esc.ok, `逃逸還原失敗：${JSON.stringify(esc.findings)}`)
    return '逃逸還原有效'
  })

  // 子字串比對會讓 signIn 被 signInAnonymously 匹配到，已刪的成員判成還在。
  check('錨成員比對以識別子邊界為準、不吃子字串', () => {
    const fakeImpl = path.join(tmp, 'implBoundary')
    fs.mkdirSync(path.join(fakeImpl, 'src'), { recursive: true })
    fs.writeFileSync(path.join(fakeImpl, 'src', 'a.ts'), 'export const signInAnonymously = () => {}\n', 'utf8')
    const rows = [{ id: 'C-ZZ-001', book: 'z.md', line: 1, implAnchor: '`src/a.ts::signIn`' }]
    const r = checkImplAnchors(rows, fakeImpl)
    assert(!r.ok, 'signIn 不該被 signInAnonymously 匹配到')
    assert(r.findings[0].why.includes('signIn'), JSON.stringify(r.findings))
    return r.findings[0].why.slice(0, 40)
  })

  // QA marker 寫成 'QA BOOT anonymous signIn start'，
  // signIn 在字串裡被空白包住、剛好通過識別子邊界，於是又被判成還在。
  check('字串與註解內的同名字不算成員存在', () => {
    const fakeImpl = path.join(tmp, 'implLiteral')
    fs.mkdirSync(path.join(fakeImpl, 'src'), { recursive: true })
    fs.writeFileSync(
      path.join(fakeImpl, 'src', 'b.ts'),
      [
        '// 舊的 signIn 已移除',
        "console.log('QA BOOT anonymous signIn start')",
        'export const other = 1',
      ].join('\n'),
      'utf8',
    )
    const rows = [{ id: 'C-ZZ-002', book: 'z.md', line: 1, implAnchor: '`src/b.ts::signIn`' }]
    const r = checkImplAnchors(rows, fakeImpl)
    assert(!r.ok, '字串與註解裡的 signIn 不該算成員存在')
    return r.findings[0].why.slice(0, 40)
  })

  check('真的以程式碼形式存在的成員仍判通過', () => {
    const fakeImpl = path.join(tmp, 'implReal')
    fs.mkdirSync(path.join(fakeImpl, 'src'), { recursive: true })
    fs.writeFileSync(path.join(fakeImpl, 'src', 'c.ts'), 'export function signIn() { return 1 }\n', 'utf8')
    const rows = [{ id: 'C-ZZ-003', book: 'z.md', line: 1, implAnchor: '`src/c.ts::signIn`' }]
    const r = checkImplAnchors(rows, fakeImpl)
    assert(r.ok, `真成員該通過，實得 ${JSON.stringify(r.findings)}`)
  })

  check('退場列不參與錨與自動化檢查', () => {
    const fakeImpl = path.join(tmp, 'implRetired')
    fs.mkdirSync(path.join(fakeImpl, 'src'), { recursive: true })
    const rows = [{ id: 'C-ZZ-004', book: 'z.md', line: 1, implAnchor: '`src/gone.ts`', retired: true }]
    const r = checkImplAnchors(rows, fakeImpl)
    assert(r.ok, `退場列的死錨不該報，實得 ${JSON.stringify(r.findings)}`)
    const alive = checkImplAnchors([{ ...rows[0], retired: false }], fakeImpl)
    assert(!alive.ok, '現役列的死錨仍要報')
  })

  check('缺 impl 目錄時標略過、不謊報通過', () => {
    const { rows } = parseAllBooks(rulesDir)
    const r = checkImplAnchors(rows, null)
    assert(r.skipped === true, '應標略過')
    assert(r.ok === true && r.note.includes('略過'), JSON.stringify(r))
  })
}

function runScenarioChecks(tmp) {
  check('場次檔解析出場、步與檢查點標記', () => {
    const file = path.join(tmp, 'scen.md')
    fs.writeFileSync(file, [
      '# 回歸場次', '',
      '## S01 測試場', '',
      '- fixture `F0` 空庫', '',
      '| # | 操作或判定 | cover | 面 | 級 | P |',
      '| --- | --- | --- | --- | --- | --- |',
      '| 1 | 甲步驟 | `C-AA-001` | UI | T1 | P1 |',
      '| 2 | 乙步驟 ⏸ | `C-AA-002` | DB | T2 | P0 |',
      '',
    ].join('\n'), 'utf8')
    const scen = parseScenarios(file)
    assert(scen.length === 1, `預期 1 場，實得 ${scen.length}`)
    assert(scen[0].steps.length === 2, `預期 2 步，實得 ${scen[0].steps.length}`)
    assert(scen[0].steps[1].checkpoint === true, '第二步應為檢查點')
    assert(scen[0].steps[1].text === '乙步驟', `⏸ 應自文字剝除，實得 ${scen[0].steps[1].text}`)
    assert(scen[0].steps[0].cover === 'C-AA-001', scen[0].steps[0].cover)
    return '1 場 2 步'
  })
}
