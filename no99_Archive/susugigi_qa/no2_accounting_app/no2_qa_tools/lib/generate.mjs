// 衍生物生成器。十五冊是唯一來源，其餘檔案由它生成。
//
// 生成區以標記包住，標記外的散文手寫、不動。
//   <!-- GENERATED:<區塊 id> -->
//   ...生成內容...
//   <!-- /GENERATED:<區塊 id> -->
//
// 這個做法讓散文與生成內容共存，且 check 子指令驗得出「落檔內容等於重新生成」。
// 舊做法是整份手抄加一句「機械生成，不手抄」的宣告，宣告沒有執行者就只是註解。

import fs from 'node:fs'
import path from 'node:path'
import { bail, EXIT } from './cli.mjs'
import { parseAllBooks, parseScenarios, parseAutomation, splitAnchor, byBookNumber, EMPTY } from './checklist.mjs'

export const BLOCK_OPEN = id => `<!-- GENERATED:${id} -->`
export const BLOCK_CLOSE = id => `<!-- /GENERATED:${id} -->`

// 分冊檔名到人讀名稱。索引表要印。
const BOOK_LABEL = {
  'no1_boot_identity.md': '啟動與身分',
  'no2_subscription_quota.md': '訂閱與配額',
  'no3_entities_merge.md': '帳戶類別與合併',
  'no4_transactions.md': '交易與轉帳',
  'no5_recurring.md': '定期交易',
  'no6_home_screen.md': '首頁畫面',
  'no7_report_period.md': '報表與期間狀態',
  'no8_search.md': '搜尋',
  'no9_currency.md': '幣別與匯率',
  'no10_settings.md': '設定與偏好',
  'no11_data_transfer.md': '資料轉移',
  'no12_data_sync.md': '資料層與同步',
  'no13_undo.md': '復原',
  'no14_shared_ui.md': '共用 UI 元件',
  'no15_cross_cutting.md': '橫切',
}

// ---------- 各生成區 ----------

// 退場列不進任何 pivot。留在分冊裡供追溯，但不參與統計與反查。
// 不濾就會讓已死的行為繼續灌統計、繼續出現在反查表，等於沒退場。
const active = rows => rows.filter(r => !r.retired)

// no0_index.md 的分冊索引表。條數、P0、已自動化、Spec 未載四欄全部現算。
export function genBookIndex(allRows) {
  const rows = active(allRows)
  const byBook = groupBy(rows, r => r.book)
  const books = [...byBook.keys()].sort(byBookNumber)
  const lines = [
    '| 分冊 | 域碼 | 條數 | P0 | 已自動化 | Spec 未載 |',
    '| --- | --- | --- | --- | --- | --- |',
  ]
  let total = 0, totalP0 = 0, totalAuto = 0, totalGap = 0
  for (const book of books) {
    const list = byBook.get(book)
    const domain = list[0].domain
    const p0 = list.filter(r => r.priority === 'P0').length
    const auto = list.filter(r => r.automated).length
    const gap = list.filter(r => r.specAnchor === EMPTY).length
    total += list.length; totalP0 += p0; totalAuto += auto; totalGap += gap
    lines.push(`| \`${book}\` ${BOOK_LABEL[book] ?? ''} | \`${domain}\` | ${list.length} | ${p0} | ${auto} | ${gap} |`)
  }
  lines.push(`| **合計** | ${books.length} 域 | **${total}** | **${totalP0}** | **${totalAuto}** | **${totalGap}** |`)
  return lines.join('\n')
}

// no2_spec_gaps.md 的候選清單。spec 錨為空者，依 P 由高至低、同 P 內未自動化者優先。
export function genSpecGaps(allRows) {
  const gaps = active(allRows).filter(r => r.specAnchor === EMPTY)
  const sorted = [...gaps].sort((a, b) =>
    a.priority.localeCompare(b.priority)
    || Number(a.automated) - Number(b.automated)
    || a.id.localeCompare(b.id))
  const lines = [
    '| 檢驗點 | P | 分冊 | 行為 | impl 錨 | 自動化 |',
    '| --- | --- | --- | --- | --- | --- |',
  ]
  for (const r of sorted) {
    // 自動化欄在本表只要有無、不要細節。細節查分冊，貼全字串會把表撐爆。
    const auto = r.automated ? '有' : EMPTY
    lines.push(`| ${r.id} | ${r.priority} | \`${r.book}\` | ${r.assertion} | ${r.implAnchor} | ${auto} |`)
  }
  return lines.join('\n')
}

// no4_impl_anchor_index.md 的反查表。錨以完整字串為鍵，含成員段。
export function genImplAnchorIndex(allRows) {
  const byAnchor = groupBy(active(allRows), r => r.implAnchor)
  const entries = [...byAnchor.entries()]
    .map(([anchor, list]) => ({
      anchor,
      total: list.length,
      p0: list.filter(r => r.priority === 'P0').length,
      automated: list.filter(r => r.automated).length,
      manual: list.filter(r => r.manual).length,
      // ID 依全域序號排，不依傳入順序。同一份來源餵不同順序要生出一樣的東西。
      ids: [...list].sort(bySeq).map(r => r.id),
    }))
    .sort((a, b) => b.total - a.total || a.anchor.localeCompare(b.anchor))
  const lines = [
    '| impl 錨 | 總數 | P0 | 已自動化 | 需手測 | 檢驗點 |',
    '| --- | --- | --- | --- | --- | --- |',
  ]
  for (const e of entries) {
    lines.push(`| ${e.anchor} | ${e.total} | ${e.p0} | ${e.automated} | ${e.manual} | ${e.ids.join(', ')} |`)
  }
  return lines.join('\n')
}

// no6_test_to_checkpoint.md 的反向表。
// 舊版手抄漏算：一條檢驗點由多對測試共同覆蓋時只採計第一對，
// categoryLogic.test.ts 因此少算 C-UI-106。現算逐對展開，不再漏。
export function genTestToCheckpoint(allRows) {
  const byTest = new Map()
  for (const r of active(allRows)) {
    if (!r.automated) continue
    for (const pair of parseAutomation(r.automation)) {
      if (!byTest.has(pair.file)) byTest.set(pair.file, new Map())
      byTest.get(pair.file).set(r.id, r)
    }
  }
  const entries = [...byTest.entries()]
    .map(([file, idMap]) => {
      const list = [...idMap.values()].sort(bySeq)
      return {
        file,
        count: list.length,
        p0: list.filter(r => r.priority === 'P0').length,
        ids: list.map(r => r.id),
      }
    })
    .sort((a, b) => b.count - a.count || a.file.localeCompare(b.file))
  const lines = [
    '| 測試檔 | 守住條數 | 其中 P0 | 檢驗點 |',
    '| --- | --- | --- | --- |',
  ]
  for (const e of entries) {
    lines.push(`| \`${e.file}\` | ${e.count} | ${e.p0} | ${e.ids.join(', ')} |`)
  }
  return lines.join('\n')
}

// no7_scenarios.md 的單場步驟表。斷言文字自十五冊取，場次檔不再自存一份。
export function genScenarioSteps(scenarioCode, membership, rowById) {
  const steps = membership.steps
  const lines = [
    '| # | 操作或判定 | cover | 面 | 級 | P |',
    '| --- | --- | --- | --- | --- | --- |',
  ]
  const missing = []
  steps.forEach((coverId, idx) => {
    const row = rowById.get(coverId)
    if (!row) { missing.push(coverId); return }
    // ⏸ 由面欄推導，不另存：面含 DB、LOG 或 FB 就是對賬點。
    const mark = needsCheckpoint(row.surface) ? ' ⏸' : ''
    lines.push(`| ${idx + 1} | ${row.assertion}${mark} | \`${row.id}\` | ${row.surface} | ${row.tier} | ${row.priority} |`)
  })
  if (missing.length) {
    bail(
      `場次 ${scenarioCode} 引用了十五冊裡不存在的檢驗點：${missing.join('、')}。`,
      EXIT.HAS_FAIL,
      '刪檢驗點時要同步改場次成員資格，或該 ID 打錯了。',
    )
  }
  return lines.join('\n')
}

export function needsCheckpoint(surface) {
  return /DB|LOG|FB/.test(String(surface ?? ''))
}

// 場次總表。步數、P0 數、檢查點數全部現算。
export function genScenarioSummary(scenarioMeta, rowById) {
  const lines = [
    '| 場 | 名稱 | fixture | 步數 | P0 | merge 必跑 |',
    '| --- | --- | --- | --- | --- | --- |',
  ]
  let totalSteps = 0, totalP0 = 0, mustRun = 0
  const fixtures = new Set()
  for (const s of scenarioMeta) {
    const rows = s.steps.map(id => rowById.get(id)).filter(Boolean)
    const p0 = rows.filter(r => r.priority === 'P0').length
    // merge 必跑的判準：場內含 P0。
    const must = p0 > 0
    totalSteps += rows.length; totalP0 += p0; if (must) mustRun++
    fixtures.add(s.fixture)
    lines.push(`| ${s.code} | ${s.name} | \`${s.fixture}\` ${s.fixtureLabel} | ${rows.length} | ${p0} | ${must ? '✅' : '—'} |`)
  }
  lines.push(`| **合計** | 共 ${scenarioMeta.length} 場 | ${fixtures.size} 套 fixture | **${totalSteps}** | **${totalP0}** | ${mustRun} 場 |`)
  return lines.join('\n')
}

// ---------- 標記區塊的讀寫 ----------

export function extractBlock(text, id) {
  const open = BLOCK_OPEN(id)
  const close = BLOCK_CLOSE(id)
  const start = text.indexOf(open)
  if (start === -1) return null
  const from = start + open.length
  const end = text.indexOf(close, from)
  if (end === -1) {
    bail(`生成區塊 ${id} 只有開頭沒有結尾。`, EXIT.BAD_ENV, `補上 ${close} 這一行。`)
  }
  return { start, from, end, content: text.slice(from, end).replace(/^\n/, '').replace(/\n$/, '') }
}

export function replaceBlock(text, id, content) {
  const block = extractBlock(text, id)
  if (!block) {
    bail(`檔案內找不到生成區塊 ${id}。`, EXIT.BAD_ENV, `在該落點加上 ${BLOCK_OPEN(id)} 與 ${BLOCK_CLOSE(id)} 兩行。`)
  }
  return `${text.slice(0, block.from)}\n${content}\n${text.slice(block.end)}`
}

export function listBlocks(text) {
  const out = []
  const RE = /<!-- GENERATED:([^\s>]+) -->/g
  let m
  while ((m = RE.exec(text)) !== null) out.push(m[1])
  return out
}

// ---------- 場次成員資格資料 ----------

// 場次成員資格是唯一無法自十五冊推導的原始資訊：哪一場、第幾步、對應哪條檢驗點。
// 其餘欄位全部推導，所以這份資料只存 code、名稱、fixture 與 ID 序列。
export function loadScenarioData(file) {
  if (!fs.existsSync(file)) {
    bail(
      `找不到場次成員資格資料 ${file}。`,
      EXIT.BAD_ENV,
      '先跑 bootstrap 子指令自現行場次檔抽出一份。',
    )
  }
  let data
  try {
    data = JSON.parse(fs.readFileSync(file, 'utf8'))
  } catch (err) {
    bail(`場次資料不是合法 JSON：${err.message}`, EXIT.BAD_ENV, `檢查 ${file}。`)
  }
  if (!Array.isArray(data.scenarios) || !data.scenarios.length) {
    bail('場次資料的 scenarios 為空。', EXIT.ZERO_ROWS, '零場不是通過，多半是 bootstrap 抽錯。')
  }
  return data
}

// 自現行場次檔抽出成員資格，一次性。抽完場次檔就改由生成器產步驟表。
export function bootstrapScenarioData(scenariosFile) {
  const scenarios = parseScenarios(scenariosFile)
  const text = fs.readFileSync(scenariosFile, 'utf8')
  const out = scenarios.map(s => {
    // 場標題形態為 `## S01 <fixture 分類>／<冊名>…`，fixture 代號在場首說明列。
    const block = sectionText(text, s.code)
    const fx = block.match(/fixture\s+`?(F\d+)`?\s*([^：:]*)/)
    return {
      code: s.code,
      name: s.title,
      fixture: fx ? fx[1] : 'F?',
      fixtureLabel: fx ? fx[2].trim() : '',
      steps: s.steps.map(st => st.cover),
    }
  })
  return { generatedFrom: path.basename(scenariosFile), scenarios: out }
}

function sectionText(text, code) {
  const start = text.indexOf(`## ${code} `)
  if (start === -1) return ''
  const next = text.indexOf('\n## ', start + 1)
  return text.slice(start, next === -1 ? undefined : next)
}

// ---------- 整體組裝 ----------

// 退場登記的兩張表。理由與後繼存 no8_retirement.data.json，斷言與分冊自分冊取。
// 分成兩處的理由：理由文字長，塞進分冊表格會讓每列多兩欄破折號、可讀性崩掉。
export function genRetirementTable(allRows, registry) {
  const byId = new Map(allRows.map(r => [r.id, r]))
  const entries = (registry?.entries ?? []).filter(e => byId.has(e.id))
  const lines = [
    '| 檢驗點 | P | 分冊 | 斷言 | 退場理由 | 後繼 |',
    '| --- | --- | --- | --- | --- | --- |',
  ]
  if (!entries.length) {
    lines.push(`| ${EMPTY} | ${EMPTY} | ${EMPTY} | 尚無退場條目 | ${EMPTY} | ${EMPTY} |`)
    return lines.join('\n')
  }
  for (const e of [...entries].sort((a, b) => a.id.localeCompare(b.id))) {
    const row = byId.get(e.id)
    lines.push(`| ${e.id} | ${row.priority} | \`${row.book}\` | ${row.assertion} | ${e.reason} | ${e.supersededBy ?? EMPTY} |`)
  }
  return lines.join('\n')
}

export function genRetirementSummary(allRows, registry) {
  const byId = new Map(allRows.map(r => [r.id, r]))
  const entries = (registry?.entries ?? []).filter(e => byId.has(e.id))
  const lines = ['| 退場理由 | 條數 |', '| --- | --- |']
  if (!entries.length) {
    lines.push(`| ${EMPTY} | ${EMPTY} |`)
    return lines.join('\n')
  }
  const byReason = groupBy(entries, e => e.reason)
  const sorted = [...byReason.entries()].sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]))
  for (const [reason, list] of sorted) lines.push(`| ${reason} | ${list.length} |`)
  lines.push(`| **合計** | **${entries.length}** |`)
  return lines.join('\n')
}

export function buildAll({ rulesDir, scenariosData, retirementData }) {
  const { rows } = parseAllBooks(rulesDir)
  // 場次只認現役列。退場列若還留在成員資格裡，生成會拋錯提醒去清。
  const rowById = new Map(active(rows).map(r => [r.id, r]))
  const blocks = {
    'book-index': genBookIndex(rows),
    'spec-gaps': genSpecGaps(rows),
    'impl-anchor-index': genImplAnchorIndex(rows),
    'test-to-checkpoint': genTestToCheckpoint(rows),
    'retirement-table': genRetirementTable(rows, retirementData),
    'retirement-summary': genRetirementSummary(rows, retirementData),
  }
  if (scenariosData) {
    blocks['scenario-summary'] = genScenarioSummary(scenariosData.scenarios, rowById)
    for (const s of scenariosData.scenarios) {
      blocks[`scenario-steps:${s.code}`] = genScenarioSteps(s.code, s, rowById)
    }
  }
  return { rows, rowById, blocks }
}

// 全域序號缺席時退回 ID 字典序，讓合成資料的測試也有確定序。
function bySeq(a, b) {
  const sa = a.seq ?? Number.MAX_SAFE_INTEGER
  const sb = b.seq ?? Number.MAX_SAFE_INTEGER
  return sa - sb || a.id.localeCompare(b.id)
}

function groupBy(list, keyFn) {
  const map = new Map()
  for (const item of list) {
    const k = keyFn(item)
    if (!map.has(k)) map.set(k, [])
    map.get(k).push(item)
  }
  return map
}
