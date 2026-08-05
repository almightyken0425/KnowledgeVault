#!/usr/bin/env node
// 檢驗點清單的維護工具。停雙寫的執行者。
//
// 十五冊是唯一來源。衍生物由 generate 產、由 check 把關。
// 沒有執行者的「機械生成」宣告只是註解——這支就是那個執行者。
//
// 用法：node bin/checklist.mjs <子指令> [選項]

import fs from 'node:fs'
import path from 'node:path'
import { EXIT, parseArgs, normaliseRunId, main, isDebug, bail } from '../lib/cli.mjs'
import { assertNodeVersion, resolveImplRoot, loadConfig, TOOLS_ROOT } from '../lib/env.mjs'
import { parseAllBooks, parseScenarios } from '../lib/checklist.mjs'
import {
  buildAll, replaceBlock, extractBlock, listBlocks,
  loadScenarioData, bootstrapScenarioData,
} from '../lib/generate.mjs'
import { runAll } from '../lib/checks.mjs'
import { loadFixes, planFixes, buildRetirementRegistry, renderRetirementTable } from '../lib/apply.mjs'
import { rewriteAll } from '../lib/serialize.mjs'
import { runChecklistSelfTest } from '../lib/checklist-selftest.mjs'

const PLAN_DIR_DEFAULT = path.resolve(TOOLS_ROOT, '..', 'no1_test_plan')
const SCENARIO_DATA_NAME = 'no7_scenarios.data.json'

const SUBCOMMANDS = ['check', 'generate', 'stat', 'bootstrap', 'blocks', 'apply-fixes', 'self-test', 'help']
const FLAGS = ['json', 'debug', 'help', 'verbose', 'write', 'advisory', 'gate']
const OPTIONS = ['plan-dir', 'rules-dir', 'impl-root', 'spec-dir', 'out', 'baseline', 'fixes', 'retired-in']

const BASELINE_DEFAULT = path.join(TOOLS_ROOT, 'rules', 'check_baseline.json')

await main(async () => {
  assertNodeVersion()
  const argv = process.argv.slice(2)
  const sub = argv[0] && !argv[0].startsWith('--') ? argv[0] : 'help'
  if (!SUBCOMMANDS.includes(sub)) {
    bail(`不認得的子指令 ${sub}。`, EXIT.BAD_ENV, `可用：${SUBCOMMANDS.join('、')}。`)
  }
  const { opts } = parseArgs(argv.slice(1), { flags: FLAGS, options: OPTIONS })
  if (opts.help || sub === 'help') return printHelp()

  switch (sub) {
    case 'check': return cmdCheck(opts)
    case 'generate': return cmdGenerate(opts)
    case 'stat': return cmdStat(opts)
    case 'bootstrap': return cmdBootstrap(opts)
    case 'blocks': return cmdBlocks(opts)
    case 'apply-fixes': return cmdApplyFixes(opts)
    case 'self-test': return runChecklistSelfTest({ verbose: Boolean(opts.verbose) })
  }
}, { debug: isDebug() })

function planDir(opts) {
  const dir = opts['plan-dir'] ? path.resolve(opts['plan-dir']) : PLAN_DIR_DEFAULT
  if (!fs.existsSync(dir)) {
    bail(`找不到清單目錄 ${dir}。`, EXIT.BAD_ENV, '用 --plan-dir 指到 no1_test_plan/。')
  }
  return dir
}

function rulesDir(opts) {
  const dir = opts['rules-dir'] ? path.resolve(opts['rules-dir']) : path.join(planDir(opts), 'no1_rules')
  if (!fs.existsSync(dir)) bail(`找不到分冊目錄 ${dir}。`, EXIT.BAD_ENV, '用 --rules-dir 指定。')
  return dir
}

function scenarioDataPath(opts) {
  return path.join(planDir(opts), SCENARIO_DATA_NAME)
}

function optionalImplRoot(opts) {
  try { return resolveImplRoot(opts) } catch { return null }
}

function loadScenariosIfPresent(opts) {
  const file = scenarioDataPath(opts)
  return fs.existsSync(file) ? loadScenarioData(file) : null
}

// 退場登記缺席時傳 null，生成器出空表而非拋錯。
// 尚未有任何退場的 repo 也要跑得動。
function loadRetirementIfPresent(opts) {
  const file = path.join(planDir(opts), 'no8_retirement.data.json')
  if (!fs.existsSync(file)) return null
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'))
  } catch (err) {
    bail(`退場登記不是合法 JSON：${err.message}`, EXIT.BAD_ENV, `檢查 ${file}。`)
  }
}

// ---------- check ----------

function cmdCheck(opts) {
  const dir = planDir(opts)
  const cfg = loadConfig()
  const { checks, rows } = runAll({
    rulesDir: rulesDir(opts),
    planDir: dir,
    implRoot: optionalImplRoot(opts),
    specDir: opts['spec-dir'] ? path.resolve(opts['spec-dir']) : cfg.specRoot ?? null,
    scenariosData: loadScenariosIfPresent(opts),
    retirementData: loadRetirementIfPresent(opts),
    ignoreZeroAnchor: cfg.ignoreZeroAnchor ?? [],
  })

  const baseline = opts.gate ? loadBaseline(opts) : null
  const verdicts = checks.map(c => ({ check: c, ...gateVerdict(c, baseline) }))

  if (opts.json) {
    process.stdout.write(`${JSON.stringify({ rows: rows.length, gate: Boolean(opts.gate), checks, verdicts: verdicts.map(v => ({ id: v.check.id, blocking: v.blocking, accepted: v.accepted })) }, null, 1)}\n`)
    return verdicts.some(v => v.blocking) ? EXIT.HAS_FAIL : EXIT.OK
  }

  process.stdout.write(`清單自檢  ${rows.length} 列${opts.gate ? '  gate 模式' : ''}\n\n`)
  let failed = 0
  for (const { check: c, blocking, accepted } of verdicts) {
    const tag = c.skipped ? '略過'
      : c.advisory ? '參考'
      : c.ok ? '通過'
      : blocking ? '不過'
      : `債務 ${c.findings.length}/${accepted}`
    if (blocking) failed++
    process.stdout.write(`[${tag}] ${c.id}  ${c.note}\n`)
    // 在基準內的債務不列細項。pre-commit 每次都印四十行已知債務，
    // 人就會學會忽略整段輸出，真正該看的擋下訊息也一起被忽略。
    const isAcceptedDebt = opts.gate && !blocking && !c.ok && !c.advisory
    if (isAcceptedDebt && !opts.verbose) continue
    if (c.findings.length && (!c.advisory || opts.advisory || opts.verbose)) {
      const show = opts.verbose ? c.findings : c.findings.slice(0, 12)
      for (const f of show) process.stdout.write(`        ${f.id}  ${f.at}  ${f.why}\n`)
      if (show.length < c.findings.length) {
        process.stdout.write(`        …另 ${c.findings.length - show.length} 項，加 --verbose 看全部\n`)
      }
    } else if (c.findings.length) {
      process.stdout.write(`        ${c.findings.length} 項，加 --advisory 看清單\n`)
    }
  }
  process.stdout.write(`\n${checks.length} 項自檢，擋下 ${failed} 項\n`)
  if (opts.gate) {
    const debt = verdicts.filter(v => !v.blocking && !v.check.ok && !v.check.advisory)
    if (debt.length) {
      process.stdout.write(`已知債務 ${debt.length} 項在基準內、放行；基準檔為 ${path.basename(baselinePath(opts))}\n`)
      process.stdout.write('債務只准變少。數量超過基準就會擋下，因為那代表又漂移了。\n')
    }
  }
  return failed ? EXIT.HAS_FAIL : EXIT.OK
}

function baselinePath(opts) {
  return opts.baseline ? path.resolve(opts.baseline) : BASELINE_DEFAULT
}

function loadBaseline(opts) {
  const file = baselinePath(opts)
  if (!fs.existsSync(file)) {
    bail(`gate 模式需要基準檔 ${file}。`, EXIT.BAD_ENV, '用 --baseline 指定，或先建一份。')
  }
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'))
  } catch (err) {
    bail(`基準檔不是合法 JSON：${err.message}`, EXIT.BAD_ENV, `檢查 ${file}。`)
  }
}

// gate 模式的判定：blocking 清單內一律零容忍；其餘拿實際數與基準比，
// 不超過就放行、超過就擋。用意是擋新漂移、不讓既有債務卡死每次 commit。
function gateVerdict(check, baseline) {
  if (check.ok || check.advisory || check.skipped) return { blocking: false, accepted: null }
  if (!baseline) return { blocking: true, accepted: null }
  if ((baseline.blocking ?? []).includes(check.id)) return { blocking: true, accepted: 0 }
  const accepted = baseline.accepted?.[check.id]?.count
  if (accepted === undefined) return { blocking: true, accepted: null }
  return { blocking: check.findings.length > accepted, accepted }
}

// ---------- generate ----------

function cmdGenerate(opts) {
  const dir = planDir(opts)
  const { blocks } = buildAll({ rulesDir: rulesDir(opts), scenariosData: loadScenariosIfPresent(opts), retirementData: loadRetirementIfPresent(opts) })
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'))

  const plan = []
  for (const file of files) {
    const abs = path.join(dir, file)
    const text = fs.readFileSync(abs, 'utf8')
    for (const id of listBlocks(text)) {
      if (blocks[id] === undefined) {
        bail(`檔 ${file} 有生成區 ${id}，生成器不認得。`, EXIT.BAD_ENV, '區塊 id 打錯，或生成器少了對應規則。')
      }
      const cur = extractBlock(text, id)
      plan.push({ file, abs, id, changed: cur.content.trim() !== blocks[id].trim() })
    }
  }

  if (!plan.length) {
    process.stderr.write(`${dir} 底下零個生成區。這不是通過，是標記還沒插進去。\n`)
    process.stderr.write('下一步：在各衍生檔的表格落點插入 GENERATED 標記，再重跑。\n')
    return EXIT.ZERO_ROWS
  }

  const changed = plan.filter(p => p.changed)
  if (!opts.write) {
    process.stdout.write(`生成區 ${plan.length} 個，其中 ${changed.length} 個與來源不同步\n\n`)
    for (const p of changed) process.stdout.write(`  ${p.file}  ${p.id}\n`)
    if (!changed.length) process.stdout.write('  全部已同步。\n')
    process.stdout.write('\n加 --write 實際寫入。\n')
    return EXIT.OK
  }

  const byFile = new Map()
  for (const p of changed) {
    if (!byFile.has(p.abs)) byFile.set(p.abs, fs.readFileSync(p.abs, 'utf8'))
    byFile.set(p.abs, replaceBlock(byFile.get(p.abs), p.id, blocks[p.id]))
  }
  for (const [abs, text] of byFile) fs.writeFileSync(abs, text, 'utf8')
  process.stdout.write(`已更新 ${byFile.size} 個檔、${changed.length} 個生成區\n`)
  for (const p of changed) process.stdout.write(`  ${p.file}  ${p.id}\n`)
  return EXIT.OK
}

// ---------- stat ----------

function cmdStat(opts) {
  const { rows, books } = parseAllBooks(rulesDir(opts))
  // 除了總列數與退場數，其餘一律只算現役。
  // 混算會讓已死的行為繼續灌統計，退場就等於白做。
  const live = rows.filter(r => !r.retired)
  const s = {
    列: rows.length,
    分冊: books.length,
    現役: live.length,
    退場: rows.length - live.length,
    P0: live.filter(r => r.priority === 'P0').length,
    已自動化: live.filter(r => r.automated).length,
    手動不可測: live.filter(r => r.tier === 'T4').length,
    需手測: live.filter(r => r.manual).length,
    Spec未載: live.filter(r => r.specAnchor === '—').length,
  }
  if (opts.json) { process.stdout.write(`${JSON.stringify(s, null, 1)}\n`); return EXIT.OK }
  for (const [k, v] of Object.entries(s)) process.stdout.write(`  ${k.padEnd(12)} ${v}\n`)
  return EXIT.OK
}

// ---------- bootstrap ----------

function cmdBootstrap(opts) {
  const dir = planDir(opts)
  const scenariosFile = path.join(dir, 'no7_scenarios.md')
  if (!fs.existsSync(scenariosFile)) {
    bail(`找不到場次檔 ${scenariosFile}。`, EXIT.BAD_ENV, '確認 --plan-dir 指對。')
  }
  const data = bootstrapScenarioData(scenariosFile)
  const total = data.scenarios.reduce((a, s) => a + s.steps.length, 0)
  if (!total) {
    process.stderr.write('抽出零步。這不是通過，多半是場次檔表頭改了。\n')
    return EXIT.ZERO_ROWS
  }
  const out = opts.out ? path.resolve(opts.out) : scenarioDataPath(opts)
  if (!opts.write) {
    process.stdout.write(`將抽出 ${data.scenarios.length} 場、${total} 步的成員資格\n`)
    process.stdout.write(`落點 ${out}\n\n加 --write 實際寫入。\n`)
    return EXIT.OK
  }
  fs.writeFileSync(out, `${JSON.stringify(data, null, 1)}\n`, 'utf8')
  process.stdout.write(`已寫入 ${out}，${data.scenarios.length} 場、${total} 步\n`)
  return EXIT.OK
}

// ---------- blocks ----------

function cmdBlocks(opts) {
  const dir = planDir(opts)
  const { blocks } = buildAll({ rulesDir: rulesDir(opts), scenariosData: loadScenariosIfPresent(opts), retirementData: loadRetirementIfPresent(opts) })
  const known = Object.keys(blocks)
  const placed = new Map()
  for (const file of fs.readdirSync(dir).filter(f => f.endsWith('.md'))) {
    for (const id of listBlocks(fs.readFileSync(path.join(dir, file), 'utf8'))) placed.set(id, file)
  }
  process.stdout.write(`生成器認得 ${known.length} 個區塊，落檔已插入 ${placed.size} 個\n\n`)
  for (const id of known) {
    const where = placed.get(id)
    process.stdout.write(`  ${where ? '✓' : '·'} ${id.padEnd(28)} ${where ?? '尚未插入標記'}\n`)
  }
  const orphan = [...placed.keys()].filter(id => !known.includes(id))
  if (orphan.length) {
    process.stdout.write(`\n落檔有、生成器不認得 ${orphan.length} 個\n`)
    for (const id of orphan) process.stdout.write(`  ✗ ${id}  ${placed.get(id)}\n`)
    return EXIT.HAS_FAIL
  }
  return EXIT.OK
}

// ---------- apply-fixes ----------

function cmdApplyFixes(opts) {
  const dir = planDir(opts)
  const { books, rows } = parseAllBooks(rulesDir(opts))
  const rowById = new Map(rows.map(r => [r.id, r]))
  const fixesFile = opts.fixes ? path.resolve(opts.fixes) : path.join(TOOLS_ROOT, 'rules', 'p2_fixes.json')
  const fixes = loadFixes(fixesFile)
  const { plan, problems } = planFixes(fixes, rowById)

  if (problems.length) {
    process.stderr.write(`指令檔有 ${problems.length} 個問題，一個都不套用。
`)
    for (const p of problems) process.stderr.write(`  ${p.id}  ${p.why}
`)
    return EXIT.HAS_FAIL
  }
  if (!plan.size) {
    process.stderr.write(`指令檔零筆改動：${fixesFile}
下一步：確認 retire、implAnchor、specAnchor、automation 四種鍵至少有一種非空。
`)
    return EXIT.ZERO_ROWS
  }

  const byKind = { retire: 0, implAnchor: 0, specAnchor: 0, automation: 0 }
  for (const e of plan.values()) {
    if (e.patch.status) byKind.retire++
    if (e.patch.implAnchor) byKind.implAnchor++
    if (e.patch.specAnchor) byKind.specAnchor++
    if (e.patch.automation) byKind.automation++
  }

  if (!opts.write) {
    process.stdout.write(`將改 ${plan.size} 條檢驗點
`)
    process.stdout.write(`  退場 ${byKind.retire}｜impl 錨 ${byKind.implAnchor}｜spec 錨 ${byKind.specAnchor}｜自動化欄 ${byKind.automation}

`)
    for (const e of [...plan.values()].sort((a, b) => a.id.localeCompare(b.id))) {
      const row = rowById.get(e.id)
      process.stdout.write(`  ${e.id}  ${row.book}
`)
      for (const [k, v] of Object.entries(e.patch)) {
        process.stdout.write(`      ${k}: ${String(row[k]).slice(0, 60)} → ${String(v).slice(0, 60)}
`)
      }
    }
    process.stdout.write('\n加 --write 實際寫入。\n')
    return EXIT.OK
  }

  const report = rewriteAll(books, r => (plan.has(r.id) ? { ...r, ...plan.get(r.id).patch } : null), { write: true })
  const touched = report.reduce((a, x) => a + (x.changed ?? 0), 0)

  // 退場登記另存，理由與後繼不塞進分冊表格。
  const retiredIn = opts['retired-in'] ?? 'unknown'
  const registry = buildRetirementRegistry(plan, rowById, { retiredIn })
  const regFile = path.join(dir, 'no8_retirement.data.json')
  const prior = fs.existsSync(regFile) ? JSON.parse(fs.readFileSync(regFile, 'utf8')) : { entries: [] }
  const merged = { retiredIn, entries: dedupeById([...(prior.entries ?? []), ...registry.entries]) }
  fs.writeFileSync(regFile, `${JSON.stringify(merged, null, 1)}
`, 'utf8')

  process.stdout.write(`已改 ${touched} 條，分冊 ${report.filter(x => x.changed).length} 冊
`)
  process.stdout.write(`退場登記 ${merged.entries.length} 筆，寫入 ${path.basename(regFile)}
`)
  process.stdout.write('下一步：跑 generate --write 讓衍生物跟上，再跑 check。\n')
  return EXIT.OK
}

function dedupeById(list) {
  const m = new Map()
  for (const e of list) m.set(e.id, e)
  return [...m.values()].sort((a, b) => a.id.localeCompare(b.id))
}

function printHelp() {
  process.stdout.write(`checklist — 檢驗點清單維護，停雙寫的執行者

用法：node bin/checklist.mjs <子指令> [選項]

子指令
  check [--verbose] [--advisory]  跑全部機械自檢，任一不過回退出碼 1
  generate [--write]              重生所有生成區；不加 --write 只列差異
  blocks                          列出生成器認得的區塊與落檔插入狀態
  stat [--json]                   清單統計
  apply-fixes [--write]           依指令檔批次改分冊：退場、改錨、改自動化欄
  bootstrap [--write]             自現行場次檔抽出成員資格，一次性
  self-test [--verbose]           離線自測，不需 impl 與 spec

選項
  --plan-dir <path>   清單目錄，預設同 repo 的 no1_test_plan/
  --rules-dir <path>  分冊目錄，預設 <plan-dir>/no1_rules/
  --impl-root <path>  impl git 根目錄；缺則錨點與自動化兩項略過
  --spec-dir <path>   spec 目錄；缺則覆蓋項略過
  --fixes <path>      apply-fixes 的指令檔，預設 rules/p2_fixes.json
  --retired-in <ref>  退場登記的來源標記，例如 branch 名
  --json              輸出 JSON

自檢七項
  格式          十欄齊備、面級 P 值域合法、ID 無重號、T4 欄位一致
  斷言去重      無完全相同、無去標點後相同
  Spec 覆蓋     每份 spec 至少被一條檢驗點引用
  impl 錨       錨檔存在、錨成員在該檔內找得到
  自動化欄      測試檔存在、案例名逐字可尋（字串級，非語意級）
  零錨 impl 檔  impl 有、清單零錨的檔，待補清單、不算不過
  生成物同步    落檔的生成區內容等於重新生成

退出碼
  0 全過   1 有不過   2 環境或參數不符   3 零筆可判   4 未預期例外
`)
  return EXIT.OK
}
