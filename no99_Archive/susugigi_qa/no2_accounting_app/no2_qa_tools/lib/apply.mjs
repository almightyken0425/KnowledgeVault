// 批次改的套用層。吃一份指令檔，把改動落到分冊。
//
// 為什麼要指令檔而不是直接改：
//   改 86 條分散在十五冊，手改必錯、也無從 review。
//   指令檔讓「改什麼」與「怎麼改」分開——改什麼可以逐條看、怎麼改由程式保證一致。
//   指令檔進版控，之後回頭問「這條為什麼退場」查得到。
//
// 四種指令，全部以檢驗點 ID 為鍵：
//   retire            設狀態為退場，記理由與後繼
//   implAnchor        改 impl 錨
//   specAnchor        改 spec 錨
//   automation        改自動化欄；填 — 代表退回手測

import fs from 'node:fs'
import { bail, EXIT } from './cli.mjs'
import { STATUS_RETIRED, EMPTY } from './checklist.mjs'

export function loadFixes(file) {
  if (!fs.existsSync(file)) {
    bail(`找不到指令檔 ${file}。`, EXIT.BAD_ENV, '用 --fixes 指定，或先建一份。')
  }
  let data
  try {
    data = JSON.parse(fs.readFileSync(file, 'utf8'))
  } catch (err) {
    bail(`指令檔不是合法 JSON：${err.message}`, EXIT.BAD_ENV, `檢查 ${file}。`)
  }
  return data
}

// 把指令檔攤平成 ID 到改動的映射，同時抓出衝突。
export function planFixes(fixes, rowById) {
  const plan = new Map()
  const problems = []

  const touch = (id, patch, source) => {
    if (!rowById.has(id)) {
      problems.push({ id, why: `清單裡沒有這個 ID，指令來自 ${source}` })
      return
    }
    if (!plan.has(id)) plan.set(id, { id, patch: {}, sources: [] })
    const entry = plan.get(id)
    for (const [k, v] of Object.entries(patch)) {
      if (k in entry.patch && entry.patch[k] !== v) {
        problems.push({ id, why: `${k} 被兩道指令給了不同值：${entry.patch[k]} 與 ${v}` })
      }
      entry.patch[k] = v
    }
    entry.sources.push(source)
  }

  for (const item of fixes.retire ?? []) {
    if (!item.reason) problems.push({ id: (item.ids ?? []).join(','), why: 'retire 指令缺 reason' })
    for (const id of item.ids ?? []) {
      touch(id, { status: STATUS_RETIRED }, `retire:${item.reason}`)
      plan.get(id) && (plan.get(id).retire = { reason: item.reason, supersededBy: item.supersededBy ?? null })
    }
  }
  for (const item of fixes.implAnchor ?? []) {
    for (const id of item.ids ?? []) touch(id, { implAnchor: item.to }, 'implAnchor')
  }
  for (const item of fixes.specAnchor ?? []) {
    for (const id of item.ids ?? []) touch(id, { specAnchor: item.to }, 'specAnchor')
  }
  for (const item of fixes.automation ?? []) {
    for (const id of item.ids ?? []) touch(id, { automation: item.to ?? EMPTY }, 'automation')
  }

  // 退場列不必再改錨與自動化欄——改了也沒人看，還會讓 diff 變吵。
  for (const entry of plan.values()) {
    if (entry.patch.status === STATUS_RETIRED) {
      for (const k of ['implAnchor', 'specAnchor', 'automation']) {
        if (k in entry.patch) {
          problems.push({ id: entry.id, why: `已標退場、不該同時改 ${k}；擇一` })
        }
      }
    }
  }

  return { plan, problems }
}

// 退場登記。理由與後繼不進分冊表格，避免每列多三欄 — 號。
export function buildRetirementRegistry(plan, rowById, { retiredIn }) {
  const entries = []
  for (const e of [...plan.values()].filter(x => x.retire)) {
    const row = rowById.get(e.id)
    entries.push({
      id: e.id,
      assertion: row.assertion,
      book: row.book,
      priority: row.priority,
      reason: e.retire.reason,
      supersededBy: e.retire.supersededBy,
      retiredIn,
    })
  }
  entries.sort((a, b) => a.id.localeCompare(b.id))
  return { retiredIn, entries }
}

// 退場登記的人讀版。生成區內容，不是整份檔。
export function renderRetirementTable(registry) {
  const lines = [
    '| 檢驗點 | P | 分冊 | 斷言 | 退場理由 | 後繼 |',
    '| --- | --- | --- | --- | --- | --- |',
  ]
  for (const e of registry.entries) {
    lines.push(`| ${e.id} | ${e.priority} | \`${e.book}\` | ${e.assertion} | ${e.reason} | ${e.supersededBy ?? EMPTY} |`)
  }
  if (!registry.entries.length) lines.push('| — | — | — | 尚無退場條目 | — | — |')
  return lines.join('\n')
}
