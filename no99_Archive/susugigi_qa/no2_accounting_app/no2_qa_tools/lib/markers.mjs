// QA marker 的掃描、解析與三向漂移比對。
//
// marker 的識別是三段而非一段：前綴、事件、欄位。
//   QA BACKUP skip reason=reentry
//   ^^ ^^^^^^ ^^^^ ^^^^^^^^^^^^^^
//   固定 前綴   事件  欄位
//
// 同一個「前綴加事件」可以有多個發射點、欄位組不同。
// 清單若只登記前綴，逐字比對必然假陰性——這正是現行清單的漂移之一。
//
// 全部走原始碼掃描與檔案解析，不需裝置，Windows 完整可跑。

import fs from 'node:fs'
import path from 'node:path'

// 發射點一律包在 __DEV__ 內，release build 應被 dead-code 消除。
const EMIT_RE = /console\.(log|warn|info)\(\s*([`'"])(QA\s+[A-Z][A-Z0-9]{1,}\s+[^`'"]*)\2/g
const MARKER_RE = /^QA\s+([A-Z][A-Z0-9]+)\s+([A-Za-z][A-Za-z0-9_]*)\s*(.*)$/
const FIELD_RE = /([A-Za-z][A-Za-z0-9_]*)=(\$\{[^}]*\}|[^\s]*)/g

export function scanImpl(srcRoot, { includeTests = false } = {}) {
  const files = walk(srcRoot).filter(f =>
    /\.(ts|tsx|js|jsx)$/.test(f) && (includeTests || !/\.test\.(ts|tsx|js|jsx)$/.test(f)))
  const emissions = []
  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8')
    const lines = text.split('\n')
    for (let i = 0; i < lines.length; i++) {
      EMIT_RE.lastIndex = 0
      let m
      while ((m = EMIT_RE.exec(lines[i])) !== null) {
        const parsed = parseMarkerText(m[3])
        if (!parsed) continue
        emissions.push({
          ...parsed,
          file: path.relative(srcRoot, file).split(path.sep).join('/'),
          line: i + 1,
          devGuarded: isDevGuarded(lines, i),
          interpolated: m[2] === '`',
        })
      }
    }
  }
  return emissions
}

// __DEV__ 常寫在前一行的 if，不是與 console.log 同一行。
// 只看同一行會把合格的發射點誤報成未防護，往回看幾行才判得準。
// 這是保守判定：看不到就當未防護，寧可誤報也不漏報。
const GUARD_LOOKBACK = 4

function isDevGuarded(lines, index) {
  for (let i = index; i >= Math.max(0, index - GUARD_LOOKBACK); i--) {
    if (/__DEV__/.test(lines[i])) return true
    // 遇到區塊結尾就停，避免把上一個區塊的守衛算進來。
    if (i < index && /^\s*\}/.test(lines[i])) break
  }
  return false
}

export function parseMarkerText(raw) {
  const text = String(raw).trim()
  const m = text.match(MARKER_RE)
  if (!m) return null
  const [, prefix, event, rest] = m
  const fields = []
  FIELD_RE.lastIndex = 0
  let f
  while ((f = FIELD_RE.exec(rest)) !== null) fields.push(f[1])
  return { prefix, event, key: `${prefix} ${event}`, fields, raw: text }
}

// 同名多發射點要摺疊成一個 key、保留全部發射點，否則覆蓋率會重複計數。
export function foldEmissions(emissions) {
  const byKey = new Map()
  for (const e of emissions) {
    if (!byKey.has(e.key)) byKey.set(e.key, { key: e.key, prefix: e.prefix, event: e.event, sites: [], fields: new Set() })
    const entry = byKey.get(e.key)
    entry.sites.push({ file: e.file, line: e.line, fields: e.fields, devGuarded: e.devGuarded, interpolated: e.interpolated })
    for (const f of e.fields) entry.fields.add(f)
  }
  return [...byKey.values()]
    .map(e => ({ ...e, fields: [...e.fields].sort(), siteCount: e.sites.length }))
    .sort((a, b) => a.key.localeCompare(b.key))
}

// 自檢驗點清單的前置欄抽出被要求的 marker。
// 清單多半只寫前綴，所以事件段可能缺——缺就標 PREFIX_ONLY，這本身是漂移。
export function scanChecklist(rulesDir) {
  if (!fs.existsSync(rulesDir)) return []
  const wanted = []
  for (const file of fs.readdirSync(rulesDir).filter(f => f.endsWith('.md'))) {
    const text = fs.readFileSync(path.join(rulesDir, file), 'utf8')
    for (const line of text.split('\n')) {
      if (!/^\|\s*C-/.test(line)) continue
      const cols = line.split('|').map(s => s.trim())
      const id = cols[1]
      const surface = cols[3]
      const pre = cols[8] ?? ''
      const auto = cols[10] ?? ''
      const hits = pre.match(/QA\s+[A-Z][A-Z0-9]+(?:\s+[A-Za-z][A-Za-z0-9_]*)?(?:\s+[A-Za-z][A-Za-z0-9_]*=\S+)*/g)
      if (!hits) continue
      for (const hit of hits) {
        const parsed = parseMarkerText(hit)
        const prefixOnly = !parsed
        const prefix = prefixOnly ? (hit.match(/QA\s+([A-Z][A-Z0-9]+)/)?.[1] ?? '') : parsed.prefix
        wanted.push({
          id, book: file, surface,
          automated: auto !== '—' && auto !== '',
          raw: hit.trim(),
          prefix,
          event: prefixOnly ? null : parsed.event,
          fields: prefixOnly ? [] : parsed.fields,
          prefixOnly,
        })
      }
    }
  }
  return wanted
}

// 三向漂移。清單要的、impl 有的、兩邊對不上的。
export function computeDrift(wanted, folded) {
  const implKeys = new Set(folded.map(e => e.key))
  const implPrefixes = new Set(folded.map(e => e.prefix))
  const wantedKeys = new Set()
  const wantedPrefixes = new Set()

  const missing = []
  const prefixOnly = []
  for (const w of wanted) {
    wantedPrefixes.add(w.prefix)
    if (w.prefixOnly) {
      prefixOnly.push(w)
      if (!implPrefixes.has(w.prefix)) missing.push({ ...w, kind: 'PREFIX_MISSING' })
      continue
    }
    wantedKeys.add(w.key ?? `${w.prefix} ${w.event}`)
    const key = `${w.prefix} ${w.event}`
    if (!implKeys.has(key)) {
      missing.push({ ...w, kind: implPrefixes.has(w.prefix) ? 'EVENT_MISSING' : 'PREFIX_MISSING' })
      continue
    }
    const entry = folded.find(e => e.key === key)
    const lostFields = w.fields.filter(f => !entry.fields.includes(f))
    if (lostFields.length) missing.push({ ...w, kind: 'FIELDS_CHANGED', lostFields, implFields: entry.fields })
  }

  // impl 有、清單零引用。這是待補清單，不是錯誤。
  const dead = folded.filter(e => !wantedKeys.has(e.key) && !wantedPrefixes.has(e.prefix))
  const prefixCoveredOnly = folded.filter(e => !wantedKeys.has(e.key) && wantedPrefixes.has(e.prefix))

  // 同名多發射點在清單裡完全沒體現，逐字比對必然假陰性。
  const multiSite = folded.filter(e => e.siteCount > 1)

  return { missing, prefixOnly, dead, prefixCoveredOnly, multiSite }
}

// 錄下來的 JSONL 逐行解析。每行一個 console 事件。
export function parseRecording(file) {
  if (!fs.existsSync(file)) return { events: [], malformed: 0 }
  const events = []
  let malformed = 0
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed) continue
    let obj
    try { obj = JSON.parse(trimmed) } catch { malformed++; continue }
    const parsed = parseMarkerText(obj.text ?? '')
    if (!parsed) { malformed++; continue }
    const fields = {}
    FIELD_RE.lastIndex = 0
    let f
    const rest = String(obj.text).slice(String(obj.text).indexOf(parsed.event) + parsed.event.length)
    while ((f = FIELD_RE.exec(rest)) !== null) fields[f[1]] = f[2]
    events.push({ ...parsed, fields, ts: obj.ts ?? null })
  }
  return { events, malformed }
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
