#!/usr/bin/env node
// 本機 sqlite 對賬。吃人工拉出的 .db 檔，以唯讀快照與多點 diff 判定 DB 面檢驗點。
//
// 設計前提：開發機是 Windows、執行機是 macOS 加 iOS simulator。
// 取檔是人工前置、與平台無關，所以除了 pull 之外每個子指令在 Windows 都跑得動。
//
// 禁止靜默報綠：查不到、連不上、解析到零筆一律非零退出碼。
//
// 用法：node bin/db-reconcile.mjs <子指令> [選項]
//       node bin/db-reconcile.mjs --help

import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import {
  EXIT, parseArgs, collectParams, requireOption, requireOneOf,
  normaliseRunId, main, isDebug, bail,
} from '../lib/cli.mjs'
import {
  assertNodeVersion, assertMacForSimulator, resolveImplRoot, loadDefinitions,
  ensureRunDir, RUNS_ROOT, silenceSqliteWarning,
} from '../lib/env.mjs'
import { openReadOnly, attach, listTables, listColumns, schemaFingerprint, tableIdent, queryAll } from '../lib/sqlite.mjs'
import { TEMPLATES, BY_ID, totalCovers } from '../rules/queries.mjs'
import * as stale from '../rules/stale.mjs'
import { createReport, record, warn, markBaseUncertain, renderText, renderJson, exitCodeFor, VERDICT } from '../lib/report.mjs'
import { runSelfTest } from '../lib/selftest.mjs'

// DB 面手測分母。389 條 DB 面扣掉 159 條已有 jest 覆蓋。
// 這個數與清單索引的 1481 與 456 不同口徑，報表頂端一律寫明。
const DENOMINATOR = 230
const DENOM_NOTE = 'DB 面 389 條扣除已 jest 覆蓋的 159 條；與索引的 1481 與 456 不同口徑'

const SUBCOMMANDS = [
  'snapshot', 'pull', 'schema', 'query', 'diff', 'run', 'stale', 'coverage', 'self-test', 'help',
]

const FLAGS = ['json', 'debug', 'help', 'only-p0', 'include-deleted', 'verbose', 'why', 'yes-write']
const OPTIONS = [
  'run-id', 'impl-root', 'out', 'label', 'baseline', 'current', 'post-undo',
  'table', 'ignore-cols', 'ids', 'domain', 'bundle-id', 'param', 'rules-dir', 'log-jsonl',
]

silenceSqliteWarning()

await main(async () => {
  assertNodeVersion()
  const argv = process.argv.slice(2)
  const sub = argv[0] && !argv[0].startsWith('--') ? argv[0] : 'help'
  if (!SUBCOMMANDS.includes(sub)) {
    bail(`不認得的子指令 ${sub}。`, EXIT.BAD_ENV, `可用：${SUBCOMMANDS.join('、')}。`)
  }
  const { opts, positionals } = parseArgs(argv.slice(1), { flags: FLAGS, options: OPTIONS })
  if (opts.help || sub === 'help') return printHelp()

  const runId = normaliseRunId(opts['run-id'])
  const ctx = { opts, positionals, runId, params: collectParams(opts.param) }

  switch (sub) {
    case 'snapshot': return cmdSnapshot(ctx)
    case 'pull': return cmdPull(ctx)
    case 'schema': return cmdSchema(ctx)
    case 'query': return cmdQuery(ctx)
    case 'diff': return cmdDiff(ctx)
    case 'run': return cmdRun(ctx)
    case 'stale': return cmdStale(ctx)
    case 'coverage': return cmdCoverage(ctx)
    case 'self-test': return runSelfTest({ verbose: Boolean(opts.verbose) })
  }
}, { debug: isDebug() })

// ---------- 快照 ----------

function snapshotDir(runId, label) {
  return ensureRunDir(runId, 'snapshots', label)
}

function labelDbPath(runId, label) {
  return path.join(RUNS_ROOT, runId, 'snapshots', label, 'watermelon.db')
}

function cmdSnapshot({ opts, positionals, runId }) {
  const src = positionals[0]
  if (!src) {
    bail('snapshot 需要一個資料庫檔路徑。', EXIT.BAD_ENV, '用法：snapshot <db-path> --label baseline')
  }
  const label = requireOption(opts, 'label', '例如 --label baseline 或 --label post-action。')
  if (!/^[A-Za-z0-9._-]+$/.test(label)) {
    bail(`--label 只接受英數與 . _ - 三種符號，收到 ${label}。`, EXIT.BAD_ENV, '換一個不含路徑分隔符的短標籤。')
  }
  const resolved = path.resolve(src)
  if (!fs.existsSync(resolved)) {
    bail(`找不到來源資料庫 ${resolved}。`, EXIT.BAD_ENV, '在 Mac 上取出 app 容器內的 watermelon.db 再指過來。')
  }

  const dir = snapshotDir(runId, label)
  const dest = path.join(dir, 'watermelon.db')
  fs.copyFileSync(resolved, dest)
  // WatermelonDB 會留 -wal 與 -shm，漏抄會讀到落後狀態。
  const sidecars = []
  for (const ext of ['-wal', '-shm']) {
    const s = `${resolved}${ext}`
    if (fs.existsSync(s)) {
      fs.copyFileSync(s, `${dest}${ext}`)
      sidecars.push(ext)
    }
  }

  const db = openReadOnly(dest)
  const fp = schemaFingerprint(db)
  const counts = {}
  for (const t of fp.tables) counts[t] = queryAll(db, `SELECT COUNT(*) AS n FROM ${tableIdent(db, t)}`)[0]?.n ?? 0
  db.close()

  const total = Object.values(counts).reduce((a, b) => a + b, 0)
  const meta = {
    label, runId,
    source: resolved,
    sourceMtime: fs.statSync(resolved).mtime.toISOString(),
    sidecars,
    schema: fp,
    rowCounts: counts,
    totalRows: total,
  }
  fs.writeFileSync(path.join(dir, 'meta.json'), JSON.stringify(meta, null, 1), 'utf8')

  process.stdout.write(`快照已存 ${dest}\n`)
  process.stdout.write(`表 ${fp.tables.length} 張，總列數 ${total}，user_version ${fp.userVersion}\n`)
  if (sidecars.length) process.stdout.write(`一併複製 ${sidecars.join(' 與 ')}\n`)
  if (total === 0) {
    process.stderr.write('快照零列。這不是通過，多半是抄到還沒寫入的空庫。\n')
    process.stderr.write('下一步：在 app 內做一次寫入操作、等它落盤，再重抄。\n')
    return EXIT.ZERO_ROWS
  }
  return EXIT.OK
}

function cmdPull({ opts, runId }) {
  assertMacForSimulator('pull')
  const bundleId = requireOption(opts, 'bundle-id', '例如 --bundle-id com.example.app。')
  const label = requireOption(opts, 'label', '例如 --label baseline。')
  let container
  try {
    container = execFileSync('xcrun', ['simctl', 'get_app_container', 'booted', bundleId, 'data'], { encoding: 'utf8' }).trim()
  } catch (err) {
    bail(`找不到 app 容器：${err.message}`, EXIT.BAD_ENV, '確認模擬器已開機、app 已安裝並至少啟動過一次。')
  }
  const found = findDbFile(path.join(container, 'Documents'))
  if (!found) {
    bail('容器內找不到 watermelon.db。', EXIT.BAD_ENV, 'app 需先啟動過一次讓資料庫生成。')
  }
  return cmdSnapshot({ opts: { ...opts, label }, positionals: [found], runId })
}

function findDbFile(dir) {
  if (!fs.existsSync(dir)) return null
  const stack = [dir]
  while (stack.length) {
    const cur = stack.pop()
    for (const entry of fs.readdirSync(cur, { withFileTypes: true })) {
      const p = path.join(cur, entry.name)
      if (entry.isDirectory()) stack.push(p)
      else if (entry.name === 'watermelon.db') return p
    }
  }
  return null
}

// ---------- schema ----------

function cmdSchema({ opts, positionals, runId }) {
  const label = positionals[0] ?? opts.label
  if (!label) bail('schema 需要一個快照 label。', EXIT.BAD_ENV, '用法：schema <label> [--diff <label2>]')
  const db = openReadOnly(labelDbPath(runId, label))
  const fp = schemaFingerprint(db)
  const rows = fp.tables.map(t => {
    const cols = listColumns(db, t).map(c => c.name)
    return {
      table: t,
      columns: cols.length,
      softDeletable: cols.includes('deleted_on'),
      disableable: cols.includes('disabled_on'),
      ownerScoped: cols.includes('user_id'),
    }
  })
  db.close()

  if (opts.json) {
    process.stdout.write(`${JSON.stringify({ label, ...fp, rows }, null, 1)}\n`)
    return EXIT.OK
  }
  process.stdout.write(`快照 ${label}  user_version ${fp.userVersion}  表 ${fp.tables.length} 張\n\n`)
  for (const r of rows) {
    const tags = [r.softDeletable ? '軟刪' : '', r.disableable ? '可停用' : '', r.ownerScoped ? '綁身分' : '']
      .filter(Boolean).join(' ')
    process.stdout.write(`  ${r.table.padEnd(18)} ${String(r.columns).padStart(3)} 欄  ${tags}\n`)
  }
  return rows.length ? EXIT.OK : EXIT.ZERO_ROWS
}

// ---------- query ----------

function cmdQuery({ opts, positionals, runId, params }) {
  const templateId = positionals[0]
  if (!templateId) {
    bail('query 需要一個樣板代號。', EXIT.BAD_ENV, `可用樣板：${TEMPLATES.map(t => t.id).join('、')}。`)
  }
  const tpl = BY_ID.get(templateId)
  if (!tpl) {
    bail(`不認得的樣板 ${templateId}。`, EXIT.BAD_ENV, `可用樣板：${TEMPLATES.map(t => t.id).join('、')}。`)
  }
  const label = opts.label ?? 'current'
  const db = openReadOnly(labelDbPath(runId, label))
  const ctx = buildTemplateContext(db, { opts, runId, params })
  let result
  try {
    result = tpl.run(ctx)
  } catch (err) {
    if (err.missingParam || err.badParam) bail(err.message, EXIT.BAD_ENV, '參數用 --param k=v 傳，可重複。')
    throw err
  }
  db.close()
  process.stdout.write(`${JSON.stringify({ template: tpl.id, purpose: tpl.purpose, result }, null, 1)}\n`)
  return EXIT.OK
}

function buildTemplateContext(db, { opts, runId, params }) {
  const ctx = { db, params }
  if (opts.baseline) {
    attach(db, labelDbPath(runId, opts.baseline), 'baseline')
    ctx.baselineAlias = 'baseline'
  }
  if (opts['post-undo']) {
    attach(db, labelDbPath(runId, opts['post-undo']), 'postundo')
    ctx.postUndoAlias = 'postundo'
  }
  // 定義檔只在需要時載，免得沒設 implRoot 的機器連 schema 都看不了。
  Object.defineProperty(ctx, 'defs', {
    get() {
      if (!ctx._defs) ctx._defs = loadDefinitions(resolveImplRoot(opts))
      return ctx._defs
    },
  })
  return ctx
}

// ---------- diff ----------

function cmdDiff({ opts, runId }) {
  const baselineLabel = requireOption(opts, 'baseline', '例如 --baseline baseline。')
  const currentLabel = requireOption(opts, 'current', '例如 --current post-action。')
  const ignore = new Set(['_status', '_changed', ...String(opts['ignore-cols'] ?? '').split(',').filter(Boolean)])

  const db = openReadOnly(labelDbPath(runId, currentLabel))
  attach(db, labelDbPath(runId, baselineLabel), 'baseline')

  const tables = opts.table ? [tableIdent(db, opts.table)] : listTables(db)
  const out = []
  for (const t of tables) {
    const table = tableIdent(db, t)
    const cols = listColumns(db, t).map(c => c.name)
    const softDeletable = cols.includes('deleted_on')
    const inserted = queryAll(db, `SELECT id FROM ${table} WHERE id NOT IN (SELECT id FROM baseline.${table})`)
    const removed = queryAll(db, `SELECT id FROM baseline.${table} WHERE id NOT IN (SELECT id FROM ${table})`)
    const compare = cols.filter(c => c !== 'id' && !ignore.has(c))
    const changedExpr = compare.map(c => `cur."${c}" IS NOT base."${c}"`).join(' OR ') || '0'
    const changed = queryAll(
      db,
      `SELECT cur.id FROM ${table} cur JOIN baseline.${table} base ON base.id = cur.id WHERE ${changedExpr}`,
    )
    let softDeleted = []
    let restored = []
    if (softDeletable) {
      softDeleted = queryAll(
        db,
        `SELECT cur.id FROM ${table} cur JOIN baseline.${table} base ON base.id = cur.id
           WHERE cur.deleted_on IS NOT NULL AND base.deleted_on IS NULL`,
      )
      restored = queryAll(
        db,
        `SELECT cur.id FROM ${table} cur JOIN baseline.${table} base ON base.id = cur.id
           WHERE cur.deleted_on IS NULL AND base.deleted_on IS NOT NULL`,
      )
    }
    const total = queryAll(db, `SELECT COUNT(*) AS n FROM ${table}`)[0]?.n ?? 0
    out.push({
      table: t,
      inserted: inserted.map(r => r.id),
      // 實體刪列在軟刪架構下不該出現，出現即異常。
      hardRemoved: removed.map(r => r.id),
      fieldChanged: changed.map(r => r.id),
      softDeleted: softDeleted.map(r => r.id),
      restored: restored.map(r => r.id),
      untouched: total - inserted.length - changed.length,
      comparedColumns: compare.length,
    })
  }
  db.close()

  const touched = out.filter(r =>
    r.inserted.length || r.hardRemoved.length || r.fieldChanged.length || r.softDeleted.length || r.restored.length)

  if (opts.json) {
    process.stdout.write(`${JSON.stringify({ baseline: baselineLabel, current: currentLabel, tables: out, touched: touched.length }, null, 1)}\n`)
  } else {
    process.stdout.write(`diff ${baselineLabel} → ${currentLabel}\n`)
    process.stdout.write(`忽略欄：${[...ignore].join('、') || '無'}\n\n`)
    if (!touched.length) process.stdout.write('全表零變動。\n')
    for (const r of touched) {
      process.stdout.write(`  ${r.table}\n`)
      if (r.inserted.length) process.stdout.write(`    新增 ${r.inserted.length}：${r.inserted.join(' ')}\n`)
      if (r.fieldChanged.length) process.stdout.write(`    欄位變動 ${r.fieldChanged.length}：${r.fieldChanged.join(' ')}\n`)
      if (r.softDeleted.length) process.stdout.write(`    軟刪 ${r.softDeleted.length}：${r.softDeleted.join(' ')}\n`)
      if (r.restored.length) process.stdout.write(`    復原 ${r.restored.length}：${r.restored.join(' ')}\n`)
      if (r.hardRemoved.length) process.stdout.write(`    !! 實體刪列 ${r.hardRemoved.length}：${r.hardRemoved.join(' ')}\n`)
    }
  }
  return EXIT.OK
}

// ---------- run ----------

function cmdRun({ opts, runId, params }) {
  const currentLabel = opts.current ?? 'current'
  const baselineLabel = opts.baseline ?? null
  const db = openReadOnly(labelDbPath(runId, currentLabel))
  const ctx = buildTemplateContext(db, { opts: { ...opts, baseline: baselineLabel }, runId, params })

  const report = createReport({ tool: 'db-reconcile', runId, denominator: DENOMINATOR, denominatorNote: DENOM_NOTE })

  // 基底健檢先跑。不過就把整輪綠燈降級為條件成立。
  for (const tpl of TEMPLATES.filter(t => t.base)) {
    const result = safeRun(tpl, ctx)
    if (result.error) { warn(report, `${tpl.id} 無法執行：${result.error}`); continue }
    const ok = tpl.id === 'owner-scope' ? result.value.singleOwner
      : tpl.id === 'referential-integrity' ? result.value.clean
      : result.value.tableCount > 0
    if (!ok) markBaseUncertain(report, `${tpl.id} 未過`)
    record(report, {
      id: `BASE/${tpl.id}`,
      verdict: ok ? VERDICT.PASS : VERDICT.FAIL,
      assertion: tpl.purpose,
      evidence: result.value,
    })
  }

  for (const tpl of TEMPLATES.filter(t => !t.base)) {
    if (tpl.needsBaseline && !baselineLabel) {
      record(report, {
        id: `TPL/${tpl.id}`, verdict: VERDICT.UNRESOLVABLE, assertion: tpl.purpose,
        evidence: null, detail: '需要 --baseline 才判得出來',
      })
      continue
    }
    if (tpl.needsPostUndo && !opts['post-undo']) {
      record(report, {
        id: `TPL/${tpl.id}`, verdict: VERDICT.UNRESOLVABLE, assertion: tpl.purpose,
        evidence: null, detail: '需要 --post-undo 才判得出來',
      })
      continue
    }
    const result = safeRun(tpl, ctx)
    if (result.error) {
      record(report, {
        id: `TPL/${tpl.id}`, verdict: VERDICT.UNRESOLVABLE, assertion: tpl.purpose,
        evidence: null, detail: result.error,
      })
      continue
    }
    const value = result.value
    if (value?.absent || value?.skipped) {
      record(report, {
        id: `TPL/${tpl.id}`, verdict: VERDICT.UNRESOLVABLE, assertion: tpl.purpose,
        evidence: null, detail: value.reason ?? '本快照無對應表',
      })
      continue
    }
    const clean = value?.clean
    record(report, {
      id: `TPL/${tpl.id}`,
      verdict: clean === undefined ? VERDICT.UNRESOLVABLE : clean ? VERDICT.PASS : VERDICT.FAIL,
      assertion: tpl.purpose,
      evidence: value,
      detail: clean === undefined ? '本樣板只出資料、判定要人工比對期望值' : '',
    })
  }

  // 已隨無帳號整改作廢的條目標 STALE，不進 FAIL。
  const wanted = opts.ids ? String(opts.ids).split(',').map(s => s.trim()) : stale.staleIds()
  for (const id of wanted.filter(i => stale.isStale(i))) {
    record(report, { id, verdict: VERDICT.STALE, assertion: '', evidence: null, detail: stale.staleReason(id) })
  }

  db.close()
  emit(report, opts)
  return exitCodeFor(report)
}

function safeRun(tpl, ctx) {
  try {
    return { value: tpl.run(ctx) }
  } catch (err) {
    if (err.missingParam || err.badParam) return { error: err.message }
    return { error: `${err.message}` }
  }
}

function emit(report, opts) {
  const text = opts.json ? renderJson(report) : renderText(report)
  if (opts.out) {
    fs.mkdirSync(path.dirname(path.resolve(opts.out)), { recursive: true })
    fs.writeFileSync(path.resolve(opts.out), `${text}\n`, 'utf8')
    process.stdout.write(`報告已寫入 ${path.resolve(opts.out)}\n`)
    return
  }
  process.stdout.write(`${text}\n`)
}

// ---------- stale 與 coverage ----------

function cmdStale({ opts }) {
  const s = stale.summary()
  if (opts.json) {
    process.stdout.write(`${JSON.stringify({ ...stale, summary: s }, null, 1)}\n`)
    return EXIT.OK
  }
  process.stdout.write('無帳號整改作廢名單\n')
  process.stdout.write(`抽取基線 impl ${s.baseline.implHead}、spec ${s.baseline.specHead}、清單 ${s.baseline.qualityCommit}\n`)
  process.stdout.write(`未跟進的上游 commit：${s.baseline.notFollowedUp.join('、')}\n\n`)

  process.stdout.write(`錨檔不存在 ${s.anchorFileGone} 條\n`)
  for (const [anchor, entry] of Object.entries(stale.ANCHOR_FILE_GONE)) {
    process.stdout.write(`  ${anchor}  ${entry.ids.length} 條\n`)
    if (opts.why) process.stdout.write(`      ${entry.reason}\n`)
    process.stdout.write(`      ${entry.ids.join(' ')}\n`)
  }
  process.stdout.write(`\n錨成員不存在 ${s.anchorMemberGone} 條\n`)
  for (const e of stale.ANCHOR_MEMBER_GONE) {
    process.stdout.write(`  ${e.id}  ${e.anchor}${opts.why ? `\n      ${e.reason}` : ''}\n`)
  }
  process.stdout.write(`\nspec 錨不存在 ${s.specAnchorGone} 條\n`)
  for (const [spec, e] of Object.entries(stale.SPEC_ANCHOR_GONE)) {
    process.stdout.write(`  ${spec}  ${e.count} 條${opts.why ? `\n      ${e.reason}` : ''}\n`)
  }
  process.stdout.write(`\nfixture 結構性失效 ${s.deadFixtures} 套\n`)
  for (const f of stale.DEAD_FIXTURES) process.stdout.write(`  ${f.fixture} ${f.name}  場次 ${f.scenario}  ${f.reason}\n`)
  process.stdout.write(`\nfixture 待重寫口徑 ${s.rewriteFixtures} 套\n`)
  for (const f of stale.REWRITE_FIXTURES) process.stdout.write(`  ${f.fixture} ${f.name}  ${f.reason}\n`)

  process.stdout.write('\n本名單只是子集。清單整體尚未跟進整改，身分面與訂閱面結果一律標條件成立。\n')
  return EXIT.OK
}

function cmdCoverage({ opts }) {
  const covered = totalCovers()
  const rows = TEMPLATES.map(t => ({ id: t.id, covers: t.covers ?? 0, base: Boolean(t.base) }))
    .sort((a, b) => b.covers - a.covers)
  if (opts.json) {
    process.stdout.write(`${JSON.stringify({ denominator: DENOMINATOR, note: DENOM_NOTE, covered, templates: rows }, null, 1)}\n`)
    return EXIT.OK
  }
  process.stdout.write(`DB 面樣板覆蓋\n分母 ${DENOMINATOR}：${DENOM_NOTE}\n`)
  process.stdout.write(`樣板 ${rows.length} 個，宣稱覆蓋 ${covered} 條，缺口 ${DENOMINATOR - covered} 條\n\n`)
  for (const r of rows) {
    process.stdout.write(`  ${String(r.covers).padStart(3)}  ${r.id}${r.base ? '  [基底健檢]' : ''}\n`)
  }
  process.stdout.write('\n覆蓋數是樣板宣稱值，不是逐條驗證過的對應。逐條對應待清單跟進整改後補。\n')
  return EXIT.OK
}

function printHelp() {
  process.stdout.write(`db-reconcile — 本機 sqlite 對賬

用法：node bin/db-reconcile.mjs <子指令> [選項]

子指令
  snapshot <db-path> --label <name>   複製 .db 進 runs/ 並驗證可讀，連 -wal 與 -shm 一起抄
  pull --bundle-id <id> --label <n>   macOS 專用，自模擬器容器找出 .db 後轉呼叫 snapshot
  schema <label> [--json]             反查表名欄名、軟刪欄分佈與 user_version
  query <template> [--param k=v]      跑單一樣板，印原始結果
  diff --baseline <a> --current <b>   逐列分類成新增、欄位變動、軟刪、復原
  run [--baseline <a>] [--json]       跑全部樣板，輸出裁決報告
  stale [--why]                       印無帳號整改作廢名單，不連任何資料庫
  coverage                            樣板覆蓋統計
  self-test [--verbose]               離線自測，合成資料庫，Windows 可跑

全域選項
  --run-id <id>      產出落點，預設 UTC 時戳
  --impl-root <path> 解 Currency.json 與 IconDefinition.json 用
  --json             輸出 JSON
  --out <file>       報告寫檔
  --debug            印 stack

退出碼
  0 全判定且無 FAIL   1 有 FAIL   2 環境或參數不符   3 零筆可判   4 未預期例外

樣板清單
${TEMPLATES.map(t => `  ${t.id.padEnd(26)} ${t.purpose}`).join('\n')}
`)
  return EXIT.OK
}
