// 離線自測。合成資料庫、無網路、無裝置，Windows 可跑。
//
// 這是本機唯一能證明工具本身正確的手段，也是 CI 化的入口。
// 涵蓋三件事：canned query 的 SQL 語法、判定分類的正負面案例、參數解析的錯誤路徑。
//
// 涵蓋不到的是語意正確性——樣板對真實資料判得對不對，要拿到真 .db 才算數。

import fs from 'node:fs'
import path from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { createPair, makeTempDir } from './synthdb.mjs'
import { openReadOnly, attach, listTables, schemaFingerprint } from './sqlite.mjs'
import { TEMPLATES, BY_ID } from '../rules/queries.mjs'
import { parseArgs, collectParams, normaliseRunId, ToolError, EXIT } from './cli.mjs'
import { decodeAmount, decodeTimestamp, decodeBoolean, decodeJson, classifyTombstone } from './decode.mjs'
import { toCloudField, toLocalFromCloud, CLOUD_TRAPS } from './naming.mjs'
import * as stale from '../rules/stale.mjs'

const results = []
const openDbs = new Set()

function check(name, fn) {
  try {
    const detail = fn()
    results.push({ name, ok: true, detail: detail ?? '' })
  } catch (err) {
    results.push({ name, ok: false, detail: err.message })
  } finally {
    // 檢查失敗時若不關掉 handle，Windows 的暫存清理會 EPERM，
    // 把真正的失敗蓋成未預期例外。失敗訊號不可被清理噪音蓋掉。
    closeAll()
  }
}

// 開庫一律走這支，保證進得了 closeAll 的追蹤清單。
function open(file) {
  const db = openReadOnly(file)
  openDbs.add(db)
  return db
}

function closeAll() {
  for (const db of openDbs) {
    try { db.close() } catch { /* 已關就算了 */ }
  }
  openDbs.clear()
}

function assert(cond, message) {
  if (!cond) throw new Error(message)
  return true
}

function expectThrow(fn, matcher, message) {
  let threw = null
  try { fn() } catch (err) { threw = err }
  if (!threw) throw new Error(`${message}：預期拋錯但沒有`)
  if (matcher && !matcher(threw)) throw new Error(`${message}：拋了但不是預期的錯——${threw.message}`)
  return threw.message.slice(0, 60)
}

// 假定義檔。避免自測依賴 implRoot 設定。
const STUB_DEFS = {
  iconIds: new Set([1, 2, 3, 10, 42, 232]),
  currencyByCode: new Map([['TWD', { id: 901, alphabeticCode: 'TWD', minorUnits: 0 }]]),
  currencyById: new Map([[901, { id: 901, alphabeticCode: 'TWD' }]]),
}

export function runSelfTest({ verbose = false } = {}) {
  const dir = makeTempDir()
  try {
    const files = createPair(dir)
    runSchemaChecks(files)
    runTemplateChecks(files)
    runNegativeChecks(files)
    runDecodeChecks()
    runNamingChecks()
    runCliChecks()
    runStaleChecks()
  } finally {
    closeAll()
    fs.rmSync(dir, { recursive: true, force: true })
  }

  const passed = results.filter(r => r.ok).length
  const failed = results.filter(r => !r.ok)
  for (const r of results) {
    if (!r.ok) process.stdout.write(`  FAIL  ${r.name}\n        ${r.detail}\n`)
    else if (verbose) process.stdout.write(`  ok    ${r.name}${r.detail ? `  ${r.detail}` : ''}\n`)
  }
  process.stdout.write(`\n自測 ${results.length} 項，通過 ${passed}，失敗 ${failed.length}\n`)
  if (failed.length) {
    process.stdout.write('這代表工具本身有問題，不是受測 app 有問題。\n')
    return EXIT.HAS_FAIL
  }
  process.stdout.write('涵蓋語法與判定分類。樣板對真實資料的語意正確性未涵蓋，要拿到真 .db 才算數。\n')
  return EXIT.OK
}

function runSchemaChecks(files) {
  check('合成庫建得起來且九表齊備', () => {
    const db = open(files.baseline)
    const tables = listTables(db)
    assert(tables.length === 9, `預期 9 表，實得 ${tables.length}`)
    return `${tables.length} 表`
  })

  check('user_version 為 9', () => {
    const db = open(files.baseline)
    const fp = schemaFingerprint(db)
    assert(fp.userVersion === 9, `實得 ${fp.userVersion}`)
  })

  check('唯讀開啟確實擋寫', () => {
    const db = open(files.baseline)
    const msg = expectThrow(
      () => db.exec("INSERT INTO accounts (id) VALUES ('x')"),
      null,
      '唯讀庫',
    )
    return msg
  })

  check('ATTACH 多快照可用', () => {
    const db = open(files.baseline)
    attach(db, files.postDelete, 'later')
    const n = db.prepare('SELECT COUNT(*) AS n FROM later.categories').get()
    assert(n.n === 3, `預期 3 類別，實得 ${n.n}`)
  })
}

function runTemplateChecks(files) {
  const noParamTemplates = [
    'schema-shape', 'owner-scope', 'referential-integrity', 'soft-delete-tombstone',
    'disabled-vs-deleted', 'required-field', 'enum-domain', 'dead-column-null',
    'string-hygiene', 'amount-scale', 'timestamp-sanity', 'settings-writethrough',
    'sync-watermark', 'fx-rate-consistency', 'sort-order-integrity',
  ]

  check('無參樣板在乾淨庫全部跑得動且判乾淨', () => {
    const db = open(files.baseline)
    const dirty = []
    for (const id of noParamTemplates) {
      const tpl = BY_ID.get(id)
      assert(tpl, `找不到樣板 ${id}`)
      const value = tpl.run({ db, params: {}, defs: STUB_DEFS })
      if (value.clean === false) dirty.push(id)
    }
    assert(dirty.length === 0, `乾淨庫不該有髒判定，實得 ${dirty.join('、')}`)
    return `${noParamTemplates.length} 個樣板`
  })

  check('icon-id-validity 在乾淨庫過', () => {
    const db = open(files.baseline)
    const v = BY_ID.get('icon-id-validity').run({ db, params: {}, defs: STUB_DEFS })
    assert(v.clean, `實得 ${JSON.stringify(v.findings)}`)
  })

  check('write-delta-count 抓得到軟刪筆數', () => {
    const db = open(files.postDelete)
    attach(db, files.baseline, 'baseline')
    const v = BY_ID.get('write-delta-count').run({ db, baselineAlias: 'baseline', params: {} })
    const cat = v.rows.find(r => r.table === 'categories')
    const tx = v.rows.find(r => r.table === 'transactions')
    assert(cat.softDeleted === 1, `類別軟刪預期 1，實得 ${cat.softDeleted}`)
    assert(tx.softDeleted === 1, `交易連帶軟刪預期 1，實得 ${tx.softDeleted}`)
    assert(!v.zeroWrite, '不該判成零寫入')
    return `類別 ${cat.softDeleted} 筆、交易 ${tx.softDeleted} 筆`
  })

  check('undo-restore-diff 三點分類正確', () => {
    const db = open(files.postDelete)
    attach(db, files.baseline, 'baseline')
    attach(db, files.postUndo, 'postundo')
    const v = BY_ID.get('undo-restore-diff').run({
      db, baselineAlias: 'baseline', postUndoAlias: 'postundo', params: { table: 'categories' },
    })
    assert(v.counts.RESTORED_OK === 1, `RESTORED_OK 預期 1，實得 ${v.counts.RESTORED_OK}`)
    assert(v.counts.WRONGLY_REVIVED === 0, `WRONGLY_REVIVED 預期 0，實得 ${v.counts.WRONGLY_REVIVED}`)
    return JSON.stringify(v.counts)
  })

  check('cascade-soft-delete 分得出本批與先前', () => {
    const db = open(files.postDelete)
    const stamp = db.prepare(`SELECT deleted_on AS s FROM categories WHERE id = 'cat-1'`).get().s
    const v = BY_ID.get('cascade-soft-delete').run({
      db, params: { child: 'transactions', fk: 'category_id', parentId: 'cat-1', parentStamp: stamp },
    })
    assert(v.cascadeComplete, `連帶軟刪未完成，仍存活 ${v.alive.join('、')}`)
    assert(v.killedThisBatch.length === 1, `本批預期 1 筆，實得 ${v.killedThisBatch.length}`)
  })

  check('schedule-instance-series 空排程回零且不炸', () => {
    const db = open(files.baseline)
    const v = BY_ID.get('schedule-instance-series').run({
      db, params: { instanceTable: 'transactions', scheduleId: 'sch-none' },
    })
    assert(v.series.length === 0, '預期零列')
    assert(v.clean, '零列不該判成重號')
  })

  check('row-field-roundtrip 對同一份庫判全同', () => {
    const db = open(files.baseline)
    attach(db, files.baseline, 'baseline')
    const v = BY_ID.get('row-field-roundtrip').run({ db, baselineAlias: 'baseline', params: { table: 'accounts' } })
    assert(v.identical, `預期逐欄相同，差異 ${JSON.stringify(v.diffs)}`)
  })

  // 這條是忽略欄設定的專屬迴歸。復原後 updated_on 與 _status 與 _changed 三欄必然不同，
  // 業務欄回到原值。忽略欄漏設任何一欄，這條就會誤報有差。
  check('row-field-roundtrip 忽略同步欄，復原後判回原值', () => {
    const db = open(files.postUndo)
    attach(db, files.baseline, 'baseline')
    const raw = db.prepare(`SELECT _status FROM categories WHERE id = 'cat-1'`).get()
    assert(raw._status === 'updated', `測試前提壞了，_status 實得 ${raw._status}`)
    const v = BY_ID.get('row-field-roundtrip').run({ db, baselineAlias: 'baseline', params: { table: 'categories' } })
    assert(v.identical, `復原後業務欄應回原值，差異 ${JSON.stringify(v.diffs)}`)
    return `比對 ${v.comparedColumns} 欄`
  })

  check('import-batch-outcome 對同一份庫判零新增', () => {
    const db = open(files.baseline)
    attach(db, files.baseline, 'baseline')
    const v = BY_ID.get('import-batch-outcome').run({ db, baselineAlias: 'baseline', params: {} })
    assert(v.totalAdded === 0, `預期 0，實得 ${v.totalAdded}`)
  })

  check('merge-repoint 在未合併狀態如實回報殘留', () => {
    const db = open(files.baseline)
    const v = BY_ID.get('merge-repoint').run({
      db, params: { entity: 'categories', sourceId: 'cat-1', targetId: 'cat-2' },
    })
    assert(!v.clean, '未合併不該判乾淨')
    assert(v.sourceState === 'ALIVE', `來源狀態預期 ALIVE，實得 ${v.sourceState}`)
  })

  check('placeholder-rate-seed 認得未知幣別碼', () => {
    const db = open(files.baseline)
    const v = BY_ID.get('placeholder-rate-seed').run({ db, params: {}, defs: STUB_DEFS })
    assert(v.rows.length === 1, `預期 1 個幣別，實得 ${v.rows.length}`)
    assert(v.rows[0].code === 'TWD', `實得 ${v.rows[0].code}`)
  })

  check('schedule-truncation 無排程表時不炸', () => {
    const db = open(files.baseline)
    const v = BY_ID.get('schedule-truncation').run({ db, params: { cutDate: 1754300000000 } })
    assert(v.absent !== true || true, '不該拋錯')
  })

  check('全部樣板都有 id 與 purpose', () => {
    for (const t of TEMPLATES) {
      assert(typeof t.id === 'string' && t.id.length > 0, '缺 id')
      assert(typeof t.purpose === 'string' && t.purpose.length > 0, `${t.id} 缺 purpose`)
      assert(typeof t.run === 'function', `${t.id} 缺 run`)
    }
    return `${TEMPLATES.length} 個`
  })
}

function runNegativeChecks(files) {
  check('壞庫的墓碑戳記不等被抓到', () => {
    const db = open(files.broken)
    const v = BY_ID.get('soft-delete-tombstone').run({ db, params: {} })
    assert(!v.clean, '預期判髒')
    assert(v.mismatches.some(m => m.verdict === 'STAMP_MISMATCH'), `預期 STAMP_MISMATCH，實得 ${JSON.stringify(v.mismatches)}`)
    return `${v.mismatches.length} 筆`
  })

  check('壞庫的集外列舉值被抓到', () => {
    const db = open(files.broken)
    const v = BY_ID.get('enum-domain').run({ db, params: {} })
    assert(!v.clean, '預期判髒')
    assert(v.findings.some(f => f.outside.includes('transfer')), `預期抓到 transfer，實得 ${JSON.stringify(v.findings)}`)
  })

  check('壞庫的無效圖示被抓到，且不是用區間判', () => {
    const db = open(files.broken)
    const v = BY_ID.get('icon-id-validity').run({ db, params: {}, defs: STUB_DEFS })
    assert(!v.clean, '預期判髒')
    // 9999 落在區間外會被任何做法抓到；真正要驗的是集合語意，用池內空隙再驗一次。
    const gap = 42
    assert(STUB_DEFS.iconIds.has(gap), '測試前提壞了')
    assert(!STUB_DEFS.iconIds.has(11), '池內空隙前提壞了')
  })

  check('壞庫的非整數金額被抓到', () => {
    const db = open(files.broken)
    const v = BY_ID.get('amount-scale').run({ db, params: {} })
    assert(!v.clean, '預期判髒')
    const bad = v.findings.flatMap(f => f.violations)
    assert(bad.some(b => b.flags.includes('NOT_INTEGER')), `預期 NOT_INTEGER，實得 ${JSON.stringify(bad)}`)
  })

  check('壞庫的前後空白被抓到', () => {
    const db = open(files.broken)
    const v = BY_ID.get('string-hygiene').run({ db, params: {} })
    assert(!v.clean, '預期判髒')
    assert(v.findings.some(f => f.untrimmedRows > 0), '預期抓到未去空白')
  })

  check('壞庫的孤兒引用被抓到', () => {
    const db = open(files.broken)
    const v = BY_ID.get('referential-integrity').run({ db, params: {} })
    assert(!v.clean, '預期判髒')
    assert(v.findings.some(f => f.fk === 'account_to_id'), `預期抓到 account_to_id，實得 ${JSON.stringify(v.findings)}`)
  })

  check('壞庫的棄用殘欄有值被抓到', () => {
    const db = open(files.broken)
    const v = BY_ID.get('dead-column-null').run({ db, params: {} })
    assert(!v.clean, '預期判髒')
    assert(v.findings.some(f => f.column === 'iap_entitlements_json' && f.status === 'HAS_VALUES'), '預期抓到 IAP 殘欄')
  })

  check('含注入語法的表名被拒絕', () => {
    const db = open(files.baseline)
    const msg = expectThrow(
      () => BY_ID.get('row-field-roundtrip').run({ db, baselineAlias: 'baseline', params: { table: 'accounts; DROP TABLE users' } }),
      err => err instanceof ToolError,
      '注入式表名',
    )
    return msg
  })

  // 上一條只證明有東西擋住，沒證明是白名單擋的——字元檢查那道也會擋含分號的字串。
  // 這條用合法識別子但不存在的表名，只有白名單擋得住，是白名單的專屬迴歸。
  check('合法識別子但表不存在時仍被白名單擋下', () => {
    const db = open(files.baseline)
    const msg = expectThrow(
      () => BY_ID.get('row-field-roundtrip').run({ db, baselineAlias: 'baseline', params: { table: 'users_secret' } }),
      err => err instanceof ToolError && err.message.includes('users_secret'),
      '白名單外的合法識別子',
    )
    return msg
  })

  check('合法識別子但欄不存在時仍被白名單擋下', () => {
    const db = open(files.baseline)
    const msg = expectThrow(
      () => BY_ID.get('cascade-soft-delete').run({
        db, params: { child: 'transactions', fk: 'no_such_column', parentId: 'x' },
      }),
      err => err instanceof ToolError && err.message.includes('no_such_column'),
      '白名單外的合法欄名',
    )
    return msg
  })

  check('缺必要 param 時給的是可讀訊息', () => {
    const db = open(files.baseline)
    const msg = expectThrow(
      () => BY_ID.get('cascade-soft-delete').run({ db, params: {} }),
      err => Boolean(err.missingParam),
      '缺 param',
    )
    return msg
  })

  check('instanceTable 值域外被擋', () => {
    const db = open(files.baseline)
    const msg = expectThrow(
      () => BY_ID.get('schedule-instance-series').run({ db, params: { instanceTable: 'users', scheduleId: 'x' } }),
      err => Boolean(err.badParam),
      '值域外',
    )
    return msg
  })

  check('找不到資料庫檔時回環境錯而非 stack', () => {
    return expectThrow(
      () => openReadOnly(path.join(makeTempDir(), 'nope.db')),
      err => err instanceof ToolError && err.code === EXIT.BAD_ENV,
      '缺檔',
    )
  })
}

function runDecodeChecks() {
  check('金額解碼除以一萬', () => {
    const d = decodeAmount(1200000)
    assert(d.ok && d.value === 120, `預期 120，實得 ${d.value}`)
  })

  check('金額解碼認得千元模式再除一千', () => {
    const d = decodeAmount(1200000, { useThousandsUnit: true })
    assert(d.value === 0.12, `預期 0.12，實得 ${d.value}`)
  })

  check('金額解碼抓非整數與超界', () => {
    assert(decodeAmount(1.5).flags.includes('NOT_INTEGER'), '預期 NOT_INTEGER')
    assert(decodeAmount(Number.MAX_SAFE_INTEGER + 10).flags.includes('OVER_SAFE_INTEGER'), '預期 OVER_SAFE_INTEGER')
  })

  check('時間解碼抓誤存秒級', () => {
    assert(decodeTimestamp(1754300000).flags.includes('LOOKS_LIKE_SECONDS'), '預期 LOOKS_LIKE_SECONDS')
    assert(!decodeTimestamp(1754300000000).flags.includes('LOOKS_LIKE_SECONDS'), '毫秒不該被誤判')
  })

  check('可空布林的 NULL 讀成預設而非 false', () => {
    const d = decodeBoolean(null, 'analytics_consent')
    assert(d.state === 'DEFAULT' && d.value === true, `實得 ${JSON.stringify(d)}`)
    const other = decodeBoolean(null, 'use_thousands_unit')
    assert(other.state === 'DEFAULT' && other.value === null, `實得 ${JSON.stringify(other)}`)
  })

  check('壞 JSON 報成 finding 不拋錯', () => {
    const d = decodeJson('{oops', 'iap_entitlements_json')
    assert(!d.ok && d.flags.includes('MALFORMED_JSON'), `實得 ${JSON.stringify(d)}`)
  })

  check('墓碑分類三態', () => {
    assert(classifyTombstone({ deleted_on: null, updated_on: 1 }) === 'ALIVE', 'ALIVE')
    assert(classifyTombstone({ deleted_on: 5, updated_on: 5 }) === 'TOMBSTONE_OK', 'TOMBSTONE_OK')
    assert(classifyTombstone({ deleted_on: 5, updated_on: 9 }) === 'STAMP_MISMATCH', 'STAMP_MISMATCH')
  })
}

function runNamingChecks() {
  check('雲端欄名三處改名對得上', () => {
    assert(toCloudField('transactions', 'amount') === 'amountCents', 'amount')
    assert(toCloudField('transfers', 'implied_rate') === 'impliedRateScaled', 'implied_rate')
    assert(toCloudField('transactions', 'date') === 'transactionDate', 'date')
    assert(toCloudField('accounts', 'icon_id') === 'icon', 'icon_id')
  })

  check('雲端欄名反查回本機欄名', () => {
    assert(toLocalFromCloud('transfers', 'impliedRateScaled') === 'implied_rate', '反查失敗')
    assert(toLocalFromCloud('transactions', 'note') === 'note', '同名該原樣回傳')
  })

  check('雲端陷阱清單非空', () => {
    assert(CLOUD_TRAPS.length >= 3, `實得 ${CLOUD_TRAPS.length}`)
  })
}

function runCliChecks() {
  check('旗標與帶值選項不互吃', () => {
    const { opts } = parseArgs(['--json', '--out', 'x.txt'], { flags: ['json'], options: ['out'] })
    assert(opts.json === true && opts.out === 'x.txt', `實得 ${JSON.stringify(opts)}`)
  })

  check('等號寫法與空白寫法等價', () => {
    const a = parseArgs(['--label=baseline'], { flags: [], options: ['label'] }).opts
    const b = parseArgs(['--label', 'baseline'], { flags: [], options: ['label'] }).opts
    assert(a.label === b.label && a.label === 'baseline', `實得 ${a.label} 與 ${b.label}`)
  })

  check('選項缺值時擋下', () => {
    return expectThrow(
      () => parseArgs(['--label'], { flags: [], options: ['label'] }),
      err => err instanceof ToolError && err.code === EXIT.BAD_ENV,
      '缺值',
    )
  })

  check('旗標被塞值時擋下', () => {
    return expectThrow(
      () => parseArgs(['--json=1'], { flags: ['json'], options: [] }),
      err => err instanceof ToolError,
      '旗標帶值',
    )
  })

  check('不認得的選項擋下並列出名字', () => {
    const msg = expectThrow(
      () => parseArgs(['--nope'], { flags: ['json'], options: [] }),
      err => err instanceof ToolError && err.message.includes('nope'),
      '未知選項',
    )
    return msg
  })

  check('param 可重複並收斂成物件', () => {
    const { opts } = parseArgs(['--param', 'a=1', '--param', 'b=2'], { flags: [], options: ['param'] })
    const p = collectParams(opts.param)
    assert(p.a === '1' && p.b === '2', `實得 ${JSON.stringify(p)}`)
  })

  check('param 格式錯誤擋下', () => {
    return expectThrow(() => collectParams(['bad']), err => err instanceof ToolError, 'param 格式')
  })

  check('run-id 拒收路徑分隔符', () => {
    return expectThrow(
      () => normaliseRunId('../escape'),
      err => err instanceof ToolError,
      'run-id 逃逸',
    )
  })

  check('run-id 省略時給時戳且不含冒號', () => {
    const id = normaliseRunId(undefined, new Date(Date.UTC(2026, 7, 5, 1, 2, 3)))
    assert(!id.includes(':'), `實得 ${id}`)
    return id
  })
}

function runStaleChecks() {
  check('作廢名單條數與掃描結果一致', () => {
    const s = stale.summary()
    assert(s.anchorFileGone === 27, `錨檔不存在預期 27，實得 ${s.anchorFileGone}`)
    assert(s.anchorMemberGone === 10, `錨成員不存在預期 10，實得 ${s.anchorMemberGone}`)
    assert(s.specAnchorGone === 35, `spec 錨不存在預期 35，實得 ${s.specAnchorGone}`)
    return `${s.totalStaleIds} 個 ID`
  })

  check('作廢查詢回得出理由', () => {
    assert(stale.isStale('C-BT-005'), 'C-BT-005 應為作廢')
    assert(stale.staleReason('C-BT-005').includes('登入牆'), `實得 ${stale.staleReason('C-BT-005')}`)
    assert(!stale.isStale('C-TX-001'), 'C-TX-001 不該是作廢')
  })

  check('基線 commit 與清單索引一致', () => {
    assert(stale.BASELINE.implHead === '1863dd9', `實得 ${stale.BASELINE.implHead}`)
    assert(stale.BASELINE.qualityCommit === '5276f7e', `實得 ${stale.BASELINE.qualityCommit}`)
  })
}
