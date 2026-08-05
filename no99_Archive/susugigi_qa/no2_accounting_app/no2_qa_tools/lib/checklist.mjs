// 檢驗點清單的 parser 與序列化器。
//
// 存在理由是停止雙寫。斷言字串目前住在十五冊與場次檔兩處、逐字相同；
// 改一條要同步兩處、沒有任何機制檢查。有了 parser 與 generator，
// 十五冊成為唯一來源，其餘檔案由它生成。
//
// 硬規則：所有取值以表頭名解析，禁止位置索引。
// 欄會加，位置索引一加欄就靜默讀錯欄且不報錯，與舊腳本零列報綠同型失敗。

import fs from 'node:fs'
import path from 'node:path'
import { bail, EXIT } from './cli.mjs'

// 十欄，順序固定但取值不靠順序。
export const BOOK_COLUMNS = [
  'ID', '斷言', '面', '級', 'P', 'spec 錨', 'impl 錨', '前置', '不可測原因', '自動化',
]

export const SCENARIO_COLUMNS = ['#', '操作或判定', 'cover', '面', '級', 'P']

// 欄名到程式用鍵的映射。改欄名只動這裡。
// 解析與序列化共用同一份，兩邊各自維護一份必然會漂。
export const BOOK_KEY_ORDER = {
  'ID': 'id',
  '斷言': 'assertion',
  '面': 'surface',
  '級': 'tier',
  'P': 'priority',
  'spec 錨': 'specAnchor',
  'impl 錨': 'implAnchor',
  '前置': 'precondition',
  '不可測原因': 'untestableReason',
  '自動化': 'automation',
  '狀態': 'status',
}

const BOOK_KEY = BOOK_KEY_ORDER

// 狀態欄值域。缺欄時視為現役，讓尚未加欄的分冊照常解析。
export const STATUS_ACTIVE = '現役'
export const STATUS_RETIRED = '退場'
export const STATUS_VALUES = new Set([STATUS_ACTIVE, STATUS_RETIRED])

const SURFACE_VALUES = new Set(['UI', 'DB', 'LOG', 'FB', '實機'])
const TIER_VALUES = new Set(['T1', 'T2', 'T3', 'T4'])
const PRIORITY_VALUES = new Set(['P0', 'P1', 'P2'])

const EMPTY = '—'

// 段標題形態為 `## <分類>：<名稱>`，分類三種。
const SECTION_RE = /^##\s+(資料模型|畫面|邏輯)：(.+)$/

export function parseBook(file) {
  const text = fs.readFileSync(file, 'utf8')
  const lines = text.split('\n')
  const book = path.basename(file)
  const rows = []
  const sections = []

  let header = null
  let section = null
  let order = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    const sec = line.match(SECTION_RE)
    if (sec) {
      section = { kind: sec[1], name: sec[2].trim(), title: `${sec[1]}：${sec[2].trim()}` }
      sections.push({ ...section, book, line: i + 1 })
      header = null
      continue
    }

    if (!line.startsWith('|')) continue
    const cells = splitRow(line)

    // 表頭以欄名認，不以位置認。認到就記下該表的欄序。
    if (cells[0] === 'ID' && cells.includes('斷言')) {
      header = cells
      assertHeader(header, BOOK_COLUMNS, file, i + 1)
      continue
    }
    if (/^-+$/.test(cells[0] ?? '')) continue
    if (!header) continue
    if (!/^C-[A-Z]{2}-\d{3}$/.test(cells[0])) continue

    const row = {}
    for (let c = 0; c < header.length; c++) {
      const key = BOOK_KEY[header[c]]
      if (key) row[key] = cells[c] ?? ''
    }
    // 狀態欄缺席時視為現役，讓尚未加欄的分冊照常解析。
    const status = row.status && row.status !== EMPTY ? row.status : STATUS_ACTIVE
    const retired = status === STATUS_RETIRED
    rows.push({
      ...row,
      status,
      retired,
      book,
      line: i + 1,
      order: order++,
      section: section?.title ?? '',
      sectionKind: section?.kind ?? '',
      domain: row.id.split('-')[1],
      // 退場列不計入自動化與手測。計進去會污染所有分母與統計。
      automated: !retired && row.automation !== EMPTY && row.automation !== '',
      manual: !retired && row.automation === EMPTY && row.tier !== 'T4',
    })
  }

  if (!rows.length) {
    bail(
      `分冊 ${book} 解析到零列。`,
      EXIT.ZERO_ROWS,
      '零列不是通過，多半是表頭改了或檔案指錯。檢查表頭是否仍以 ID 欄起頭。',
    )
  }
  return { book, file, rows, sections }
}

export function parseAllBooks(rulesDir) {
  if (!fs.existsSync(rulesDir)) {
    bail(`找不到分冊目錄 ${rulesDir}。`, EXIT.BAD_ENV, '用 --rules-dir 指到 no1_test_plan/no1_rules/。')
  }
  const files = fs.readdirSync(rulesDir).filter(f => f.endsWith('.md')).sort(byBookNumber)
  const books = files.map(f => parseBook(path.join(rulesDir, f)))
  const rows = books.flatMap(b => b.rows)
  if (!rows.length) bail('全部分冊合計零列。', EXIT.ZERO_ROWS, '檢查 --rules-dir 是否指對。')
  // 全域序號。生成器排 ID 清單時要按檔序，不能按傳入陣列的順序，
  // 否則同一份來源餵進去的順序不同就生出不同結果。
  rows.forEach((r, i) => { r.seq = i })
  return { books, rows, sections: books.flatMap(b => b.sections) }
}

// 檔名的 noN 前綴要按數字排，不是字典序——no10 會排到 no2 前面。
export function byBookNumber(a, b) {
  const na = Number(a.match(/^no(\d+)/)?.[1] ?? 0)
  const nb = Number(b.match(/^no(\d+)/)?.[1] ?? 0)
  return na - nb
}

export function parseScenarios(file) {
  const text = fs.readFileSync(file, 'utf8')
  const lines = text.split('\n')
  const scenarios = []
  let current = null
  let header = null

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const head = line.match(/^##\s+(S\d+)\s+(.*)$/)
    if (head) {
      current = { code: head[1], title: head[2].trim(), steps: [], line: i + 1 }
      scenarios.push(current)
      header = null
      continue
    }
    if (!line.startsWith('|') || !current) continue
    const cells = splitRow(line)
    if (cells[0] === '#' && cells.includes('cover')) {
      header = cells
      assertHeader(header, SCENARIO_COLUMNS, file, i + 1)
      continue
    }
    if (/^-+$/.test(cells[0] ?? '')) continue
    if (!header || !/^\d+$/.test(cells[0])) continue

    const get = name => cells[header.indexOf(name)] ?? ''
    const rawStep = get('操作或判定')
    current.steps.push({
      step: Number(cells[0]),
      text: rawStep.replace(/\s*⏸$/, '').trim(),
      checkpoint: /⏸\s*$/.test(rawStep),
      cover: stripCode(get('cover')),
      surface: get('面'),
      tier: get('級'),
      priority: get('P'),
      line: i + 1,
    })
  }
  return scenarios
}

// markdown 表列拆欄。首尾的空欄是分隔線造成的，去掉。
export function splitRow(line) {
  const parts = line.split('|')
  if (parts.length < 3) return []
  return parts.slice(1, -1).map(s => s.trim())
}

function assertHeader(actual, expected, file, lineNo) {
  const missing = expected.filter(c => !actual.includes(c))
  if (missing.length) {
    bail(
      `${path.basename(file)}:${lineNo} 的表頭缺欄：${missing.join('、')}。`,
      EXIT.BAD_ENV,
      `預期欄名為 ${expected.join('、')}。表頭改了就要同步改 parser 的欄名映射。`,
    )
  }
}

export function stripCode(s) {
  return String(s ?? '').replace(/`/g, '').trim()
}

// impl 錨與 spec 錨的解析。impl 錨兩形態：檔路徑、檔路徑加成員。
export function splitAnchor(raw) {
  const value = stripCode(raw)
  if (!value || value === EMPTY) return { path: null, member: null, empty: true }
  const idx = value.indexOf('::')
  if (idx === -1) return { path: value, member: null, empty: false }
  return { path: value.slice(0, idx), member: value.slice(idx + 2), empty: false }
}

// 自動化欄可含多對，以頓號分隔。案例名的修飾兩種：
//   ` · ` 串接 describe 與 it，兩者都要才定位得到
//   ` — ` 之後是覆蓋範圍補註，不參與逐字比對
export function parseAutomation(raw) {
  const value = String(raw ?? '').trim()
  if (!value || value === EMPTY) return []
  const out = []
  // 案例名本身可能含頓號，所以先切出 `路徑`（案例名） 的配對，不整串切。
  // 路徑字元類必須排除頓號：多對並列時 `）、src/...` 的頓號會被吃進檔名，
  // 生出 `、src/services/categoryLogic.test.ts` 這種假檔名、且真檔名少算一次。
  //
  // 不可先剝 backtick。案例名本身會含 backtick，例如
  // maps remote `timezone` onto local `timeZone`；先剝就對不上測試碼原文。
  // 只有路徑那段的包覆 backtick 該去掉，所以放進 pattern 由 regex 吃掉。
  const PAIR = /`?([^\s、（）`]+\.(?:test|spec)\.(?:ts|tsx|js|jsx))`?\s*（([^）]*)）/g
  let m
  while ((m = PAIR.exec(value)) !== null) {
    const file = m[1]
    const caseName = m[2].split(' — ')[0].trim()
    out.push({ file, caseName, segments: caseName.split(' · ').map(s => s.trim()).filter(Boolean) })
  }
  return out
}

export function isEmptyCell(v) {
  const s = stripCode(v)
  return s === '' || s === EMPTY
}

export { EMPTY }
