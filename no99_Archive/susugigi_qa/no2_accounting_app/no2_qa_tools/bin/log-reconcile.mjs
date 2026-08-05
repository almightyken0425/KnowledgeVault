#!/usr/bin/env node
// runtime log 對賬。掃 impl 的 QA marker、比對清單要求、錄製與判定執行期事件。
//
// RN 0.79 的 JS console 走 CDP、不進 Metro 終端 log，所以 record 要接 WebSocket。
// 但 scan-impl、drift、dead、parse 全是純檔案作業，Windows 完整可跑。
//
// 用法：node bin/log-reconcile.mjs <子指令> [選項]

import fs from 'node:fs'
import path from 'node:path'
import { EXIT, parseArgs, requireOption, normaliseRunId, main, isDebug, bail } from '../lib/cli.mjs'
import { assertNodeVersion, resolveImplRoot, loadConfig, ensureRunDir, TOOLS_ROOT } from '../lib/env.mjs'
import { scanImpl, foldEmissions, scanChecklist, computeDrift, parseRecording, parseMarkerText } from '../lib/markers.mjs'
import { createReport, record as rec, renderText, renderJson, exitCodeFor, VERDICT } from '../lib/report.mjs'

// LOG 面手測分母。
const DENOMINATOR = 87
const DENOM_NOTE = 'LOG 面手測條數；與索引的 1481 與 456 不同口徑'

const RULES_DIR_DEFAULT = path.join(TOOLS_ROOT, '..', 'no1_test_plan', 'no1_rules')

const SUBCOMMANDS = ['scan-impl', 'drift', 'dead', 'parse', 'record', 'reconcile', 'self-test', 'help']
const FLAGS = ['json', 'debug', 'help', 'verbose', 'include-tests', 'reload-on-connect']
const OPTIONS = ['run-id', 'impl-root', 'rules-dir', 'out', 'jsonl', 'metro-url', 'seconds', 'filter']

await main(async () => {
  assertNodeVersion()
  const argv = process.argv.slice(2)
  const sub = argv[0] && !argv[0].startsWith('--') ? argv[0] : 'help'
  if (!SUBCOMMANDS.includes(sub)) {
    bail(`不認得的子指令 ${sub}。`, EXIT.BAD_ENV, `可用：${SUBCOMMANDS.join('、')}。`)
  }
  const { opts } = parseArgs(argv.slice(1), { flags: FLAGS, options: OPTIONS })
  if (opts.help || sub === 'help') return printHelp()
  const runId = normaliseRunId(opts['run-id'])

  switch (sub) {
    case 'scan-impl': return cmdScanImpl(opts)
    case 'drift': return cmdDrift(opts)
    case 'dead': return cmdDead(opts)
    case 'parse': return cmdParse(opts)
    case 'record': return cmdRecord(opts, runId)
    case 'reconcile': return cmdReconcile(opts, runId)
    case 'self-test': return selfTest(Boolean(opts.verbose))
  }
}, { debug: isDebug() })

function implSrc(opts) {
  return path.join(resolveImplRoot(opts), 'src')
}

function rulesDir(opts) {
  const dir = opts['rules-dir'] ? path.resolve(opts['rules-dir']) : path.resolve(RULES_DIR_DEFAULT)
  if (!fs.existsSync(dir)) {
    bail(`找不到檢驗點分冊目錄 ${dir}。`, EXIT.BAD_ENV, '用 --rules-dir 指到 no1_test_plan/no1_rules/。')
  }
  return dir
}

function cmdScanImpl(opts) {
  const emissions = scanImpl(implSrc(opts), { includeTests: Boolean(opts['include-tests']) })
  const folded = foldEmissions(emissions)
  if (!emissions.length) {
    process.stderr.write('掃到零個 QA marker。這不是通過，多半是 --impl-root 指錯。\n')
    process.stderr.write('下一步：確認 implRoot 指到 impl git 根目錄、底下有 src/。\n')
    return EXIT.ZERO_ROWS
  }
  if (opts.json) {
    process.stdout.write(`${JSON.stringify({ emissions: emissions.length, markers: folded }, null, 1)}\n`)
    return EXIT.OK
  }
  const unguarded = emissions.filter(e => !e.devGuarded)
  process.stdout.write(`impl 內 QA marker 發射點 ${emissions.length} 處，摺疊成 ${folded.length} 個 marker\n`)
  process.stdout.write(`前綴 ${new Set(folded.map(f => f.prefix)).size} 種\n\n`)
  for (const m of folded) {
    process.stdout.write(`  ${m.key.padEnd(28)} ${m.siteCount} 處  欄位 ${m.fields.join(',') || '無'}\n`)
    if (opts.verbose) for (const s of m.sites) process.stdout.write(`      ${s.file}:${s.line}\n`)
  }
  if (unguarded.length) {
    process.stdout.write(`\n!! 未包在 __DEV__ 內的發射點 ${unguarded.length} 處，release build 不會被消除\n`)
    for (const e of unguarded) process.stdout.write(`   ${e.file}:${e.line}  ${e.raw}\n`)
  }
  return EXIT.OK
}

function cmdDrift(opts) {
  const folded = foldEmissions(scanImpl(implSrc(opts)))
  const wanted = scanChecklist(rulesDir(opts))
  const d = computeDrift(wanted, folded)

  if (opts.json) {
    process.stdout.write(`${JSON.stringify({ implMarkers: folded.length, checklistRefs: wanted.length, ...d }, null, 1)}\n`)
    return d.missing.length ? EXIT.HAS_FAIL : EXIT.OK
  }

  process.stdout.write('marker 三向漂移\n')
  process.stdout.write(`impl ${folded.length} 個 marker，清單引用 ${wanted.length} 處\n\n`)

  process.stdout.write(`清單要求但 impl 對不上 ${d.missing.length} 處\n`)
  for (const m of d.missing) {
    process.stdout.write(`  ${m.id}  ${m.kind}  ${m.raw}\n`)
    if (m.lostFields) process.stdout.write(`      少了欄位 ${m.lostFields.join(',')}，impl 現有 ${m.implFields.join(',')}\n`)
  }

  process.stdout.write(`\n清單只寫前綴、沒寫事件 ${d.prefixOnly.length} 處\n`)
  process.stdout.write('  前綴級比對抓不到事件改名，這批要升級成前綴加事件加欄位三段。\n')
  const byPrefix = {}
  for (const p of d.prefixOnly) (byPrefix[p.prefix] ||= []).push(p.id)
  for (const [prefix, ids] of Object.entries(byPrefix)) {
    process.stdout.write(`  QA ${prefix}  ${ids.length} 條：${ids.slice(0, 8).join(' ')}${ids.length > 8 ? ' …' : ''}\n`)
  }

  process.stdout.write(`\nimpl 有、清單零引用 ${d.dead.length} 個\n`)
  for (const e of d.dead) process.stdout.write(`  ${e.key.padEnd(28)} ${e.sites[0].file}:${e.sites[0].line}\n`)

  process.stdout.write(`\n同名多發射點 ${d.multiSite.length} 個\n`)
  process.stdout.write('  一名多義，清單的 marker 欄不分段就會假陰性。\n')
  for (const e of d.multiSite) process.stdout.write(`  ${e.key.padEnd(28)} ${e.siteCount} 處\n`)

  return d.missing.length ? EXIT.HAS_FAIL : EXIT.OK
}

function cmdDead(opts) {
  const folded = foldEmissions(scanImpl(implSrc(opts)))
  const wanted = scanChecklist(rulesDir(opts))
  const { dead, prefixCoveredOnly } = computeDrift(wanted, folded)
  if (opts.json) {
    process.stdout.write(`${JSON.stringify({ dead, prefixCoveredOnly }, null, 1)}\n`)
    return EXIT.OK
  }
  process.stdout.write(`impl 有、清單完全沒提的 marker ${dead.length} 個\n`)
  for (const e of dead) process.stdout.write(`  ${e.key.padEnd(28)} ${e.sites.map(s => `${s.file}:${s.line}`).join('  ')}\n`)
  process.stdout.write(`\n前綴被提過、事件沒被提的 ${prefixCoveredOnly.length} 個\n`)
  for (const e of prefixCoveredOnly) process.stdout.write(`  ${e.key.padEnd(28)} ${e.siteCount} 處\n`)
  process.stdout.write('\n這是待補清單，不是錯誤。每次 impl 動 marker 就重跑一次。\n')
  return EXIT.OK
}

function cmdParse(opts) {
  const file = requireOption(opts, 'jsonl', '例如 --jsonl runs/<run-id>/log.jsonl。')
  const { events, malformed } = parseRecording(path.resolve(file))
  if (!events.length) {
    process.stderr.write(`解析到零個 marker，來源 ${path.resolve(file)}。\n`)
    process.stderr.write('下一步：確認錄製檔非空、且每行是含 text 欄的 JSON。\n')
    return EXIT.ZERO_ROWS
  }
  const byKey = {}
  for (const e of events) (byKey[e.key] ||= []).push(e)
  if (opts.json) {
    process.stdout.write(`${JSON.stringify({ events, malformed }, null, 1)}\n`)
    return EXIT.OK
  }
  process.stdout.write(`錄製檔 marker ${events.length} 筆，無法解析 ${malformed} 行\n\n`)
  for (const [key, list] of Object.entries(byKey)) {
    process.stdout.write(`  ${key.padEnd(28)} ${list.length} 次\n`)
    if (opts.verbose) for (const e of list) process.stdout.write(`      ${JSON.stringify(e.fields)}\n`)
  }
  return EXIT.OK
}

async function cmdRecord(opts, runId) {
  const metro = opts['metro-url'] ?? loadConfig().metroUrl ?? 'http://localhost:8081'
  const seconds = Number(opts.seconds ?? 60)
  if (!Number.isFinite(seconds) || seconds <= 0) {
    bail(`--seconds 需為正數，收到 ${opts.seconds}。`, EXIT.BAD_ENV, '例如 --seconds 30。')
  }
  if (typeof WebSocket === 'undefined') {
    bail('此 Node 版本無全域 WebSocket。', EXIT.BAD_ENV, '需 Node v22.5 以上。')
  }

  let targets
  try {
    const res = await fetch(`${metro}/json/list`, { signal: AbortSignal.timeout(5000) })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    targets = await res.json()
  } catch (err) {
    bail(
      `連不上 Metro 的 CDP 端點 ${metro}：${err.message}`,
      EXIT.BAD_ENV,
      'Metro 要在跑、app 要已啟動並連上 debugger。本機若無 simulator，這個子指令跑不了。',
    )
  }

  // vm 為 don't use 的是合成頁，接了收不到東西。
  const usable = (targets ?? []).filter(t => t.webSocketDebuggerUrl && t.vm !== "don't use")
  if (!usable.length) {
    bail('沒有可接的 CDP 目標。', EXIT.BAD_ENV, 'app 需先連上 debugger；重載 app 後再試。')
  }
  const target = usable.find(t => /hermes|react/i.test(t.title ?? '')) ?? usable[0]

  const dir = ensureRunDir(runId)
  const outFile = opts.out ? path.resolve(opts.out) : path.join(dir, 'log.jsonl')
  const filter = opts.filter ?? 'QA '
  const stream = fs.createWriteStream(outFile, { flags: 'a' })
  let captured = 0

  await new Promise((resolve, reject) => {
    const ws = new WebSocket(target.webSocketDebuggerUrl)
    const timer = setTimeout(() => { try { ws.close() } catch { /* 已關 */ } }, seconds * 1000)
    ws.addEventListener('open', () => {
      // Runtime.enable 會補送已緩衝的訊息，冷啟 marker 靠這個才收得到。
      ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }))
      if (opts['reload-on-connect']) ws.send(JSON.stringify({ id: 2, method: 'Page.reload' }))
      process.stderr.write(`已接上 ${target.title ?? target.id}，錄製 ${seconds} 秒，過濾 ${filter}\n`)
    })
    ws.addEventListener('message', ev => {
      let msg
      try { msg = JSON.parse(ev.data) } catch { return }
      if (msg.method !== 'Runtime.consoleAPICalled') return
      const text = (msg.params?.args ?? []).map(argToText).join(' ')
      if (!text.startsWith(filter)) return
      captured++
      stream.write(`${JSON.stringify({ ts: msg.params?.timestamp ?? null, text })}\n`)
    })
    ws.addEventListener('error', err => { clearTimeout(timer); reject(new Error(`CDP 連線失敗：${err.message ?? 'unknown'}`)) })
    ws.addEventListener('close', () => { clearTimeout(timer); resolve() })
  })

  stream.end()
  process.stdout.write(`錄製結束，寫入 ${outFile}，擷取 ${captured} 筆\n`)
  if (captured === 0) {
    process.stderr.write('擷取零筆。這不是通過，可能是 app 沒動作、或 marker 被 release build 消除。\n')
    return EXIT.ZERO_ROWS
  }
  return EXIT.OK
}

function argToText(a) {
  if (a == null) return ''
  if (a.type === 'string') return a.value ?? ''
  if (a.value !== undefined) return String(a.value)
  return a.description ?? ''
}

function cmdReconcile(opts, runId) {
  const file = requireOption(opts, 'jsonl', '例如 --jsonl runs/<run-id>/log.jsonl。')
  const { events } = parseRecording(path.resolve(file))
  const folded = foldEmissions(scanImpl(implSrc(opts)))
  const wanted = scanChecklist(rulesDir(opts))
  const seen = new Set(events.map(e => e.key))
  const seenPrefix = new Set(events.map(e => e.prefix))

  const report = createReport({ tool: 'log-reconcile', runId, denominator: DENOMINATOR, denominatorNote: DENOM_NOTE })
  const implKeys = new Set(folded.map(e => e.key))

  for (const w of wanted) {
    if (w.automated) continue
    if (w.prefixOnly) {
      rec(report, {
        id: w.id, verdict: seenPrefix.has(w.prefix) ? VERDICT.PASS : VERDICT.UNRESOLVABLE,
        assertion: w.raw,
        evidence: seenPrefix.has(w.prefix) ? events.filter(e => e.prefix === w.prefix).slice(0, 3) : null,
        detail: seenPrefix.has(w.prefix) ? '清單只寫前綴，僅能證明前綴出現過' : '本場未錄到此前綴',
      })
      continue
    }
    const key = `${w.prefix} ${w.event}`
    if (!implKeys.has(key)) {
      rec(report, { id: w.id, verdict: VERDICT.STALE, assertion: w.raw, evidence: null, detail: 'impl 已無此 marker' })
      continue
    }
    rec(report, {
      id: w.id,
      verdict: seen.has(key) ? VERDICT.PASS : VERDICT.FAIL,
      assertion: w.raw,
      evidence: seen.has(key) ? events.filter(e => e.key === key).slice(0, 3) : null,
      detail: seen.has(key) ? '' : '本場未錄到此 marker',
    })
  }

  const text = opts.json ? renderJson(report) : renderText(report)
  process.stdout.write(`${text}\n`)
  return exitCodeFor(report)
}

function selfTest(verbose) {
  const cases = []
  const t = (name, fn) => {
    try { cases.push({ name, ok: true, detail: fn() ?? '' }) }
    catch (err) { cases.push({ name, ok: false, detail: err.message }) }
  }
  const assert = (c, m) => { if (!c) throw new Error(m) }

  t('單引號 marker 解析出前綴事件欄位', () => {
    const p = parseMarkerText('QA BACKUP skip reason=reentry')
    assert(p.prefix === 'BACKUP' && p.event === 'skip', JSON.stringify(p))
    assert(p.fields.includes('reason'), JSON.stringify(p.fields))
  })

  t('模板字面值的內插欄位也抓得到', () => {
    const p = parseMarkerText('QA BACKUP cooldownStamp stampMs=${now} storage=device')
    assert(p.event === 'cooldownStamp', p.event)
    assert(p.fields.join(',') === 'stampMs,storage', p.fields.join(','))
  })

  t('非 QA 開頭不誤判', () => {
    assert(parseMarkerText('hello world') === null, '不該解析成 marker')
    assert(parseMarkerText('QA lower case') === null, '前綴須大寫')
  })

  t('同名多發射點摺疊成一個 key', () => {
    const folded = foldEmissions([
      { key: 'BACKUP skip', prefix: 'BACKUP', event: 'skip', fields: ['reason'], file: 'a.ts', line: 1 },
      { key: 'BACKUP skip', prefix: 'BACKUP', event: 'skip', fields: ['reason', 'sinceLastMs'], file: 'b.ts', line: 2 },
    ])
    assert(folded.length === 1, `預期 1，實得 ${folded.length}`)
    assert(folded[0].siteCount === 2, `預期 2 處，實得 ${folded[0].siteCount}`)
    assert(folded[0].fields.join(',') === 'reason,sinceLastMs', folded[0].fields.join(','))
  })

  t('漂移能分辨事件消失與欄位改變', () => {
    const folded = foldEmissions([{ key: 'BACKUP skip', prefix: 'BACKUP', event: 'skip', fields: ['reason'], file: 'a.ts', line: 1 }])
    const d = computeDrift([
      { id: 'C-X-001', prefix: 'BACKUP', event: 'skip', fields: ['reason'], prefixOnly: false, raw: 'QA BACKUP skip reason=x' },
      { id: 'C-X-002', prefix: 'BACKUP', event: 'gone', fields: [], prefixOnly: false, raw: 'QA BACKUP gone' },
      { id: 'C-X-003', prefix: 'BACKUP', event: 'skip', fields: ['newField'], prefixOnly: false, raw: 'QA BACKUP skip newField=1' },
    ], folded)
    const kinds = d.missing.map(m => m.kind).sort()
    assert(kinds.join(',') === 'EVENT_MISSING,FIELDS_CHANGED', kinds.join(','))
  })

  t('錄製檔零筆時回零筆而非通過', () => {
    const { events, malformed } = parseRecording(path.join(TOOLS_ROOT, 'no-such-file.jsonl'))
    assert(events.length === 0 && malformed === 0, '應回空')
  })

  const passed = cases.filter(c => c.ok).length
  for (const c of cases) {
    if (!c.ok) process.stdout.write(`  FAIL  ${c.name}\n        ${c.detail}\n`)
    else if (verbose) process.stdout.write(`  ok    ${c.name}\n`)
  }
  process.stdout.write(`\n自測 ${cases.length} 項，通過 ${passed}，失敗 ${cases.length - passed}\n`)
  return passed === cases.length ? EXIT.OK : EXIT.HAS_FAIL
}

function printHelp() {
  process.stdout.write(`log-reconcile — runtime log 對賬

用法：node bin/log-reconcile.mjs <子指令> [選項]

子指令
  scan-impl [--verbose]            掃 impl 的 QA marker，摺疊同名多發射點
  drift                            清單要的與 impl 有的三向比對
  dead                             impl 有、清單零引用的 marker，待補清單
  parse --jsonl <file>             解析錄製檔，統計各 marker 出現次數
  record [--seconds N]             接 Metro 的 CDP 錄製，需 app 在跑
  reconcile --jsonl <file>         以錄製檔判定 LOG 面檢驗點
  self-test [--verbose]            離線自測，Windows 可跑

選項
  --impl-root <path>   impl git 根目錄
  --rules-dir <path>   檢驗點分冊目錄，預設同 repo 的 no1_test_plan/no1_rules/
  --metro-url <url>    預設 http://localhost:8081
  --jsonl <file>       錄製檔
  --json               輸出 JSON
  --verbose            列出發射點位置

平台
  scan-impl、drift、dead、parse、self-test 純檔案作業，Windows 可跑。
  record 需要 Metro 與 app 在跑，本機無 simulator 時跑不了。
`)
  return EXIT.OK
}
