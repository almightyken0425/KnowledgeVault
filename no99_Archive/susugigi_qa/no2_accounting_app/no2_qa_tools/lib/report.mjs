// 裁決聚合與輸出。三支工具共用同一組裁決值域與報表骨架。
//
// 裁決五態，四類非 PASS 各自聚合成段，不混在逐條清單裡讓人自己數：
//   PASS          該條真的有實際值支撐
//   FAIL          判準成立且證據指向不符
//   UNRESOLVABLE  判準成立但本場證據不足
//   STALE         前置已隨無帳號整改作廢
//   NO_CRITERION  清單根本沒給判準
//
// 禁止靜默報綠：零筆可判要回退出碼 3，不是 0。

import { EXIT } from './cli.mjs'

export const VERDICT = {
  PASS: 'PASS',
  FAIL: 'FAIL',
  UNRESOLVABLE: 'UNRESOLVABLE',
  STALE: 'STALE',
  NO_CRITERION: 'NO_CRITERION',
}

const ORDER = [VERDICT.FAIL, VERDICT.UNRESOLVABLE, VERDICT.STALE, VERDICT.NO_CRITERION, VERDICT.PASS]

export function createReport({ tool, runId, denominator, denominatorNote }) {
  return {
    tool,
    runId,
    denominator,
    denominatorNote,
    entries: [],
    warnings: [],
    baseUncertain: false,
  }
}

// evidence 是實際值，缺它的 PASS 不算數。
export function record(report, { id, verdict, assertion = '', evidence = null, detail = '' }) {
  if (verdict === VERDICT.PASS && evidence === null) {
    report.warnings.push(`${id} 標 PASS 但沒帶實際值，降級為 UNRESOLVABLE。`)
    verdict = VERDICT.UNRESOLVABLE
    detail = detail ? `${detail}；缺實際值` : '缺實際值'
  }
  report.entries.push({ id, verdict, assertion, evidence, detail })
  return report
}

export function warn(report, message) {
  report.warnings.push(message)
}

// 基底健檢失敗時整輪綠燈都只算條件成立，報表頂端要講清楚。
export function markBaseUncertain(report, reason) {
  report.baseUncertain = true
  report.warnings.push(`基底健檢未過：${reason}。本輪 PASS 一律只算條件成立。`)
}

export function tally(report) {
  const counts = Object.fromEntries(ORDER.map(v => [v, 0]))
  for (const e of report.entries) counts[e.verdict] = (counts[e.verdict] ?? 0) + 1
  return counts
}

export function exitCodeFor(report) {
  if (report.entries.length === 0) return EXIT.ZERO_ROWS
  const counts = tally(report)
  if (counts[VERDICT.FAIL] > 0) return EXIT.HAS_FAIL
  return EXIT.OK
}

export function renderText(report) {
  const counts = tally(report)
  const lines = []
  lines.push(`${report.tool} 對賬報告  run-id ${report.runId}`)
  lines.push(`分母 ${report.denominator}：${report.denominatorNote}`)
  lines.push(`判定 ${report.entries.length} 條  ` + ORDER.map(v => `${v} ${counts[v]}`).join('  '))

  if (report.baseUncertain) {
    lines.push('')
    lines.push('!! 基底健檢未過，以下 PASS 一律只算條件成立。')
  }
  if (report.warnings.length) {
    lines.push('')
    lines.push(`警示 ${report.warnings.length} 項`)
    for (const w of report.warnings) lines.push(`  - ${w}`)
  }

  for (const verdict of ORDER) {
    const group = report.entries.filter(e => e.verdict === verdict)
    if (!group.length) continue
    lines.push('')
    lines.push(`## ${verdict}  ${group.length} 條`)
    for (const e of group) {
      lines.push(`  ${e.id}  ${e.assertion}`)
      if (e.detail) lines.push(`      ${e.detail}`)
      if (e.evidence !== null && verdict !== VERDICT.PASS) {
        lines.push(`      實際值 ${formatEvidence(e.evidence)}`)
      }
    }
  }

  if (report.entries.length === 0) {
    lines.push('')
    lines.push('零條可判。這不是通過，是沒跑到東西。')
    lines.push('下一步：確認 --ids 或 --domain 篩選條件、以及快照真的有資料。')
  }
  return lines.join('\n')
}

function formatEvidence(ev) {
  if (typeof ev === 'string') return ev
  try {
    const s = JSON.stringify(ev)
    return s.length > 300 ? `${s.slice(0, 300)}…` : s
  } catch {
    return String(ev)
  }
}

export function renderJson(report) {
  return JSON.stringify({ ...report, counts: tally(report) }, null, 1)
}
