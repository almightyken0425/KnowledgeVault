// 清單機械自檢。每項回 { id, ok, findings, note }，由 CLI 彙總成退出碼。
//
// 舊做法是 no0_index.md 用散文寫「改動後逐一執行」，其中三項只有文字沒有指令。
// 沒有指令的檢查等於沒有檢查——本輪 27 條錨檔不存在、26 條引已刪測試檔
// 全部躲在那三項裡。本檔把每一項都落成可跑、可回非零退出碼的東西。
//
// 檢查器自身防呆三條，缺一不可：
//   零列匹配即 FAIL、列數量級斷言、欄以表頭名取。
//   舊腳本靜默報綠的體質不准複製。

import fs from 'node:fs'
import path from 'node:path'
import { parseAllBooks, parseAutomation, splitAnchor, stripCode, EMPTY, STATUS_VALUES } from './checklist.mjs'
import { buildAll, extractBlock, listBlocks } from './generate.mjs'

const SURFACE_VALUES = new Set(['UI', 'DB', 'LOG', 'FB', '實機'])
const TIER_VALUES = new Set(['T1', 'T2', 'T3', 'T4'])
const PRIORITY_VALUES = new Set(['P0', 'P1', 'P2'])

// 退場列的錨與自動化欄不再要求成立——那正是它退場的原因。
// 但退場列仍要通過格式與去重，ID 不回收、列不移出。
const skipRetired = rows => rows.filter(r => !r.retired)

// 列數量級斷言。低於此數代表解析壞了，不是清單真的縮水。
const MIN_ROWS = 500

export function checkFormat(rows) {
  const findings = []
  const seen = new Map()
  for (const r of rows) {
    if (!/^C-[A-Z]{2}-\d{3}$/.test(r.id)) findings.push({ id: r.id, at: `${r.book}:${r.line}`, why: 'ID 格式不符' })
    if (seen.has(r.id)) findings.push({ id: r.id, at: `${r.book}:${r.line}`, why: `ID 重號，先出現於 ${seen.get(r.id)}` })
    else seen.set(r.id, `${r.book}:${r.line}`)

    for (const s of String(r.surface).split('+')) {
      if (!SURFACE_VALUES.has(s.trim())) findings.push({ id: r.id, at: `${r.book}:${r.line}`, why: `面欄值非法 ${s.trim()}` })
    }
    if (!TIER_VALUES.has(r.tier)) findings.push({ id: r.id, at: `${r.book}:${r.line}`, why: `級欄值非法 ${r.tier}` })
    if (!PRIORITY_VALUES.has(r.priority)) findings.push({ id: r.id, at: `${r.book}:${r.line}`, why: `P 欄值非法 ${r.priority}` })

    // T4 一律前置填不適用、不可測原因非空；非 T4 反之。
    if (r.tier === 'T4' && r.untestableReason === EMPTY) {
      findings.push({ id: r.id, at: `${r.book}:${r.line}`, why: 'T4 的不可測原因欄不得為空' })
    }
    if (r.tier !== 'T4' && r.untestableReason !== EMPTY) {
      findings.push({ id: r.id, at: `${r.book}:${r.line}`, why: '非 T4 不得填不可測原因' })
    }
    if (!STATUS_VALUES.has(r.status)) {
      findings.push({ id: r.id, at: `${r.book}:${r.line}`, why: `狀態欄值非法 ${r.status}` })
    }
  }
  const retired = rows.filter(r => r.retired).length
  return {
    id: '格式',
    ok: findings.length === 0,
    findings,
    note: `${rows.length} 列、欄位齊備、值域合法、ID 唯一；現役 ${rows.length - retired}、退場 ${retired}`,
  }
}

export function checkAssertionDedup(rows) {
  const findings = []
  const exact = new Map()
  const stripped = new Map()
  for (const r of rows) {
    const a = r.assertion
    // 去標點後相同也算重複。換句話說的重複條是前一版分冊軸的主要病灶。
    // 兩張表都要在寫入自己之前先查，先寫再查會查到自己、永遠判不出重複。
    const key = a.replace(/[，。、；：「」『』（）\s`]/g, '')
    const exactHit = exact.get(a)
    const strippedHit = stripped.get(key)

    if (exactHit !== undefined) {
      findings.push({ id: r.id, at: `${r.book}:${r.line}`, why: `斷言與 ${exactHit} 完全相同` })
    } else if (strippedHit !== undefined) {
      findings.push({ id: r.id, at: `${r.book}:${r.line}`, why: `去標點後與 ${strippedHit} 相同` })
    }

    if (exactHit === undefined) exact.set(a, r.id)
    if (strippedHit === undefined) stripped.set(key, r.id)
  }
  return { id: '斷言去重', ok: findings.length === 0, findings, note: `${rows.length} 條斷言互不重複` }
}

export function checkSpecCoverage(allRows, specDir) {
  if (!specDir || !fs.existsSync(specDir)) {
    return { id: 'Spec 覆蓋', ok: true, findings: [], note: '未指定 spec 目錄，略過', skipped: true }
  }
  const rows = skipRetired(allRows)
  const referenced = new Set(rows.map(r => stripCode(r.specAnchor)).filter(v => v && v !== EMPTY))
  const files = walk(specDir)
    .filter(f => f.endsWith('.md') && path.basename(f) !== 'CLAUDE.md')
    .map(f => path.basename(f, '.md'))
  const findings = files.filter(f => !referenced.has(f)).map(f => ({ id: f, at: 'spec', why: '無任何檢驗點引用' }))
  return { id: 'Spec 覆蓋', ok: findings.length === 0, findings, note: `${files.length} 份 spec、被引用 ${files.length - findings.length} 份` }
}

// 成員比對要擋掉兩種假陽性，缺一不可。
//
// 一、子字串。signIn 會被 signInAnonymously 匹配到、signOut 被 signOutSilently 匹配到，
//     已刪除的成員因此被判成還在。JS 識別子含 $ 與底線，不能用 \b，要自己寫前後界。
// 二、字串與註解內的同名字。QA marker 寫成 'QA BOOT anonymous signIn start'，
//     signIn 在字串裡被空白包住、剛好通過識別子邊界，於是又被判成還在。
//
// 解法是先把註解與字串內容抽掉再比。不是完整的 JS 剖析，
// 但對「這個名字是不是真的以程式碼形式出現」這個問題已經夠準。
function stripLiterals(text) {
  return text
    .replace(/\/\*[\s\S]*?\*\//g, ' ')          // 區塊註解
    .replace(/(^|[^:])\/\/[^\n]*/g, '$1 ')      // 行註解，避開 URL 的 ://
    .replace(/`(?:[^`\\]|\\.)*`/g, ' ')         // 模板字面值
    .replace(/'(?:[^'\\\n]|\\.)*'/g, ' ')       // 單引號字串
    .replace(/"(?:[^"\\\n]|\\.)*"/g, ' ')       // 雙引號字串
}

function hasIdentifier(text, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`(?<![A-Za-z0-9_$])${escaped}(?![A-Za-z0-9_$])`).test(stripLiterals(text))
}

// 舊自檢第四項。只有文字沒有指令，錨失效全躲在這裡。
export function checkImplAnchors(allRows, implRoot) {
  if (!implRoot || !fs.existsSync(implRoot)) {
    return { id: 'impl 錨', ok: true, findings: [], note: '未指定 impl 目錄，略過', skipped: true }
  }
  const rows = skipRetired(allRows)
  const findings = []
  const cache = new Map()
  for (const r of rows) {
    const a = splitAnchor(r.implAnchor)
    if (a.empty) { findings.push({ id: r.id, at: `${r.book}:${r.line}`, why: 'impl 錨為空' }); continue }
    const abs = path.join(implRoot, a.path)
    if (!fs.existsSync(abs)) {
      findings.push({ id: r.id, at: `${r.book}:${r.line}`, why: `錨檔不存在 ${a.path}` })
      continue
    }
    if (!a.member) continue
    if (!cache.has(abs)) cache.set(abs, fs.readFileSync(abs, 'utf8'))
    if (!hasIdentifier(cache.get(abs), a.member)) {
      findings.push({ id: r.id, at: `${r.book}:${r.line}`, why: `錨成員不存在 ${a.path}::${a.member}` })
    }
  }
  return { id: 'impl 錨', ok: findings.length === 0, findings, note: `${rows.length} 條錨的路徑與成員皆存在` }
}

// 舊自檢第五項。案例名逐字比對，測試碼的單引號逃逸比對前還原。
// 明標字串級：只能證明字串存在，證明不了該案例真的斷言了這條行為。
export function checkAutomation(allRows, implRoot) {
  if (!implRoot || !fs.existsSync(implRoot)) {
    return { id: '自動化欄', ok: true, findings: [], note: '未指定 impl 目錄，略過', skipped: true }
  }
  const rows = skipRetired(allRows)
  const findings = []
  const cache = new Map()
  let pairs = 0
  for (const r of rows) {
    if (!r.automated) continue
    const parsed = parseAutomation(r.automation)
    if (!parsed.length) {
      findings.push({ id: r.id, at: `${r.book}:${r.line}`, why: `自動化欄非空但解析不出配對：${r.automation}` })
      continue
    }
    for (const pair of parsed) {
      pairs++
      const abs = path.join(implRoot, pair.file)
      if (!fs.existsSync(abs)) {
        findings.push({ id: r.id, at: `${r.book}:${r.line}`, why: `測試檔不存在 ${pair.file}` })
        continue
      }
      if (!cache.has(abs)) cache.set(abs, fs.readFileSync(abs, 'utf8').replace(/\\'/g, "'"))
      const text = cache.get(abs)
      for (const seg of pair.segments) {
        if (!text.includes(seg)) {
          findings.push({ id: r.id, at: `${r.book}:${r.line}`, why: `案例名在 ${pair.file} 內找不到：${seg}` })
        }
      }
    }
  }
  return {
    id: '自動化欄',
    ok: findings.length === 0,
    findings,
    note: `${pairs} 對測試檔與案例名逐字可尋；字串級保證，非語意級`,
  }
}

// 新增第七項。impl 有、清單零錨的檔，是抓新行為缺口的唯一機制。
// 錨反查按定義撈不到住在新檔裡的行為——這是增量機制新行為召回為零的成因。
export function checkZeroAnchorFiles(allRows, implRoot, { ignore = [] } = {}) {
  if (!implRoot || !fs.existsSync(implRoot)) {
    return { id: '零錨 impl 檔', ok: true, findings: [], note: '未指定 impl 目錄，略過', skipped: true }
  }
  const rows = skipRetired(allRows)
  const anchored = new Set(rows.map(r => splitAnchor(r.implAnchor).path).filter(Boolean))
  const src = path.join(implRoot, 'src')
  const ignoreRe = ignore.map(p => new RegExp(p))
  const files = walk(src)
    .filter(f => /\.(ts|tsx)$/.test(f) && !/\.(test|spec)\.(ts|tsx)$/.test(f))
    .map(f => path.relative(implRoot, f).split(path.sep).join('/'))
    .filter(f => !ignoreRe.some(re => re.test(f)))
  const findings = files.filter(f => !anchored.has(f)).map(f => ({ id: f, at: 'impl', why: '清單零錨，可能是未覆蓋的新行為' }))
  return {
    id: '零錨 impl 檔',
    ok: true,                     // 這項是待補清單、不是錯誤，恆 ok、只出數字
    advisory: true,
    findings,
    note: `impl ${files.length} 個原始檔，其中 ${findings.length} 個無任何檢驗點指向`,
  }
}

// 新增第八項。停雙寫的把關：落檔的生成區內容必須等於重新生成。
export function checkGeneratedBlocks({ rulesDir, planDir, scenariosData, retirementData }) {
  const { blocks } = buildAll({ rulesDir, scenariosData, retirementData })
  const findings = []
  let checked = 0
  const files = fs.readdirSync(planDir).filter(f => f.endsWith('.md'))
  for (const file of files) {
    const abs = path.join(planDir, file)
    const text = fs.readFileSync(abs, 'utf8')
    for (const id of listBlocks(text)) {
      checked++
      const block = extractBlock(text, id)
      const expected = blocks[id]
      if (expected === undefined) {
        findings.push({ id, at: file, why: '檔內有此生成區、生成器卻不認得這個 id' })
        continue
      }
      if (block.content.trim() !== expected.trim()) {
        findings.push({ id, at: file, why: '落檔內容與重新生成不一致，請跑 generate' })
      }
    }
  }
  // 生成器認得的區塊若一個都沒被落檔引用，代表標記沒插進去。
  if (checked === 0) {
    findings.push({ id: '(全部)', at: planDir, why: '零個生成區。標記尚未插入，這不是通過' })
  }
  const note = findings.length === 0
    ? `${checked} 個生成區與來源一致`
    : `${checked} 個生成區，其中 ${findings.length} 個與來源不一致`
  return { id: '生成物同步', ok: findings.length === 0, findings, note }
}

export function runAll({ rulesDir, planDir, implRoot, specDir, scenariosData, retirementData, ignoreZeroAnchor }) {
  const { rows } = parseAllBooks(rulesDir)
  if (rows.length < MIN_ROWS) {
    return {
      rows,
      checks: [{
        id: '列數量級', ok: false,
        findings: [{ id: '(全部)', at: rulesDir, why: `只解析到 ${rows.length} 列，低於下限 ${MIN_ROWS}` }],
        note: '解析壞了，其餘檢查的結果不可信',
      }],
    }
  }
  const checks = [
    checkFormat(rows),
    checkAssertionDedup(rows),
    checkSpecCoverage(rows, specDir),
    checkImplAnchors(rows, implRoot),
    checkAutomation(rows, implRoot),
    checkZeroAnchorFiles(rows, implRoot, { ignore: ignoreZeroAnchor }),
    checkGeneratedBlocks({ rulesDir, planDir, scenariosData, retirementData }),
  ]
  return { rows, checks }
}

function walk(dir) {
  if (!fs.existsSync(dir)) return []
  const out = []
  const stack = [dir]
  while (stack.length) {
    const cur = stack.pop()
    for (const entry of fs.readdirSync(cur, { withFileTypes: true })) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue
      const p = path.join(cur, entry.name)
      if (entry.isDirectory()) stack.push(p)
      else out.push(p)
    }
  }
  return out
}
