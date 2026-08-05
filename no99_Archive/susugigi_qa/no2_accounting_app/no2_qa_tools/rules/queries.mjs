// Canned query 樣板。一個樣板涵蓋一整類同構檢驗點，不是一條一個 SQL。
//
// 共通規則：
//   識別子（表名欄名）全部走 sqlite.mjs 的白名單再插值，絕不字串拼接輸入。
//   值一律參數綁定。
//   零筆是訊號、不是通過，回傳端要自行標 UNRESOLVABLE。
//
// covers 欄是該樣板涵蓋的手測 DB 面檢驗點數，供 coverage 子指令算分母。

import {
  listTables, listColumns, tableIdent, columnIdent, hasColumn,
  queryAll, queryOne, softDeletableTables, disableableTables, ownerScopedTables,
} from '../lib/sqlite.mjs'
import { classifyTombstone, decodeAmount, decodeTimestamp, MILLIS_FLOOR, MAX_STORAGE_AMOUNT } from '../lib/decode.mjs'

const NAME_LIMIT = 60
const NOTE_LIMIT = 200

// ---------- 基底健檢：這兩支不過，其餘綠燈全部降級為條件成立 ----------

export const schemaShape = {
  id: 'schema-shape',
  purpose: '哪幾張表帶軟刪欄、哪幾張不帶，兼抓 migration 沒跑到的欄位缺漏',
  covers: 4,
  base: true,
  run({ db }) {
    const tables = listTables(db)
    const rows = tables.map(t => {
      const cols = listColumns(db, t).map(c => c.name)
      return {
        table: t,
        columns: cols.length,
        softDeletable: cols.includes('deleted_on'),
        disableable: cols.includes('disabled_on'),
        ownerScoped: cols.includes('user_id'),
        hasUpdatedOn: cols.includes('updated_on'),
      }
    })
    const version = queryOne(db, 'PRAGMA main.user_version')
    return { rows, userVersion: version?.user_version ?? null, tableCount: tables.length }
  },
}

export const ownerScope = {
  id: 'owner-scope',
  purpose: '九表的 user_id 分佈；無帳號整改後應恰好一個匿名 uid',
  covers: 10,
  base: true,
  run({ db }) {
    const rows = []
    for (const t of ownerScopedTables(db)) {
      const table = tableIdent(db, t)
      for (const r of queryAll(db, `SELECT user_id AS uid, COUNT(*) AS n FROM ${table} GROUP BY user_id`)) {
        rows.push({ table: t, uid: r.uid, rows: r.n })
      }
    }
    // users 表沒有 user_id 欄，它的 id 就是 uid，要另寫一段。
    if (listTables(db).includes('users')) {
      for (const r of queryAll(db, 'SELECT id AS uid, COUNT(*) AS n FROM users GROUP BY id')) {
        rows.push({ table: 'users', uid: r.uid, rows: r.n })
      }
    }
    const distinct = new Set(rows.map(r => r.uid).filter(v => v !== null && v !== undefined))
    return { rows, distinctUids: [...distinct], singleOwner: distinct.size <= 1 }
  },
}

export const referentialIntegrity = {
  id: 'referential-integrity',
  purpose: '孤兒引用與跨身分引用的全庫一次掃',
  covers: 3,
  base: true,
  run({ db }) {
    const links = [
      ['transactions', 'account_id', 'accounts'],
      ['transactions', 'category_id', 'categories'],
      ['transactions', 'schedule_id', 'schedules'],
      ['transfers', 'account_from_id', 'accounts'],
      ['transfers', 'account_to_id', 'accounts'],
      ['transfers', 'schedule_id', 'schedules'],
      ['settings', 'user_id', 'users'],
      ['schedules', 'user_id', 'users'],
    ]
    const tables = listTables(db)
    const findings = []
    for (const [child, fk, parent] of links) {
      if (!tables.includes(child) || !tables.includes(parent)) continue
      if (!hasColumn(db, child, fk)) continue
      const c = tableIdent(db, child)
      const col = columnIdent(db, child, fk)
      const p = tableIdent(db, parent)
      const orphans = queryOne(
        db,
        `SELECT COUNT(*) AS n FROM ${c} WHERE ${col} IS NOT NULL
           AND ${col} NOT IN (SELECT id FROM ${p})`,
      )
      if (orphans && orphans.n > 0) findings.push({ child, fk, parent, orphans: orphans.n })
    }
    return { findings, clean: findings.length === 0 }
  },
}

// ---------- 寫入與差異 ----------

export const writeDeltaCount = {
  id: 'write-delta-count',
  purpose: '動作前後全表列數與 updated_on 差值，判有沒有寫、寫幾筆',
  covers: 38,
  needsBaseline: true,
  run({ db, baselineAlias }) {
    const rows = []
    for (const t of listTables(db)) {
      const table = tableIdent(db, t)
      if (!hasColumn(db, t, 'updated_on')) continue
      const inserted = queryOne(db, `SELECT COUNT(*) AS n FROM ${table} WHERE id NOT IN (SELECT id FROM ${baselineAlias}.${table})`)
      const mutated = queryOne(
        db,
        `SELECT COUNT(*) AS n FROM ${table} cur JOIN ${baselineAlias}.${table} base ON base.id = cur.id
           WHERE COALESCE(cur.updated_on, -1) <> COALESCE(base.updated_on, -1)`,
      )
      const softDeleted = hasColumn(db, t, 'deleted_on')
        ? queryOne(
            db,
            `SELECT COUNT(*) AS n FROM ${table} cur JOIN ${baselineAlias}.${table} base ON base.id = cur.id
               WHERE cur.deleted_on IS NOT NULL AND base.deleted_on IS NULL`,
          )
        : { n: 0 }
      const total = queryOne(db, `SELECT COUNT(*) AS n FROM ${table}`)
      rows.push({
        table: t,
        inserted: inserted?.n ?? 0,
        mutated: mutated?.n ?? 0,
        softDeleted: softDeleted?.n ?? 0,
        total: total?.n ?? 0,
      })
    }
    const touched = rows.filter(r => r.inserted || r.mutated || r.softDeleted)
    return { rows, touched, zeroWrite: touched.length === 0 }
  },
}

export const rowFieldRoundtrip = {
  id: 'row-field-roundtrip',
  purpose: '編輯後復原是否逐欄寫回更新前的值',
  covers: 5,
  needsBaseline: true,
  run({ db, baselineAlias, params }) {
    const t = requireParam(params, 'table')
    const table = tableIdent(db, t)
    // 復原比對必須忽略 updated_on，否則每列都判成有變。
    const ignore = new Set(['updated_on', '_status', '_changed', ...(params.ignore ?? '').split(',').filter(Boolean)])
    const cols = listColumns(db, t).map(c => c.name).filter(c => !ignore.has(c))
    const diffs = []
    for (const col of cols) {
      const c = columnIdent(db, t, col)
      const n = queryOne(
        db,
        `SELECT COUNT(*) AS n FROM ${table} cur JOIN ${baselineAlias}.${table} base ON base.id = cur.id
           WHERE cur.${c} IS NOT base.${c}`,
      )
      if (n && n.n > 0) diffs.push({ column: col, rowsDiffering: n.n })
    }
    return { table: t, comparedColumns: cols.length, diffs, identical: diffs.length === 0 }
  },
}

export const undoRestoreDiff = {
  id: 'undo-restore-diff',
  purpose: '刪前、刪後、復原後三點墓碑轉移分類',
  covers: 14,
  needsBaseline: true,
  needsPostUndo: true,
  run({ db, baselineAlias, postUndoAlias, params }) {
    const t = requireParam(params, 'table')
    const table = tableIdent(db, t)
    if (!hasColumn(db, t, 'deleted_on')) {
      return { table: t, skipped: true, reason: `表 ${t} 無 deleted_on 欄，不適用墓碑判定` }
    }
    const rows = queryAll(
      db,
      `SELECT b.id AS id,
              b.deleted_on AS before_del,
              a.deleted_on AS after_del,
              u.deleted_on AS undo_del
         FROM ${baselineAlias}.${table} b
         LEFT JOIN ${table} a ON a.id = b.id
         LEFT JOIN ${postUndoAlias}.${table} u ON u.id = b.id`,
    )
    const buckets = { RESTORED_OK: [], STILL_DELETED: [], WRONGLY_REVIVED: [], UNTOUCHED: [] }
    for (const r of rows) {
      const wasAlive = r.before_del === null
      const deletedByAction = r.after_del !== null
      const aliveAfterUndo = r.undo_del === null
      if (wasAlive && deletedByAction) buckets[aliveAfterUndo ? 'RESTORED_OK' : 'STILL_DELETED'].push(r.id)
      else if (!wasAlive && aliveAfterUndo) buckets.WRONGLY_REVIVED.push(r.id)
      else buckets.UNTOUCHED.push(r.id)
    }
    return { table: t, buckets, counts: Object.fromEntries(Object.entries(buckets).map(([k, v]) => [k, v.length])) }
  },
}

// ---------- 軟刪與連帶 ----------

export const softDeleteTombstone = {
  id: 'soft-delete-tombstone',
  purpose: '墓碑不變式：列仍在、deleted_on 非空、且 deleted_on 等於 updated_on',
  covers: 10,
  run({ db }) {
    const perTable = []
    const mismatches = []
    for (const t of softDeletableTables(db)) {
      const table = tableIdent(db, t)
      const rows = queryAll(db, `SELECT id, deleted_on, updated_on FROM ${table} WHERE deleted_on IS NOT NULL`)
      let ok = 0
      for (const r of rows) {
        const verdict = classifyTombstone(r)
        if (verdict === 'TOMBSTONE_OK') ok++
        else mismatches.push({ table: t, id: r.id, verdict, deleted_on: r.deleted_on, updated_on: r.updated_on })
      }
      perTable.push({ table: t, tombstones: rows.length, ok })
    }
    // 兩欄不等代表該列永不進增量備份，是靜默資料遺失訊號，獨立聚合。
    return { perTable, mismatches, clean: mismatches.length === 0 }
  },
}

export const cascadeSoftDelete = {
  id: 'cascade-soft-delete',
  purpose: '父刪連帶子軟刪、先前已刪的子列不被覆蓋、其他父的子列不被動到',
  covers: 7,
  run({ db, params }) {
    const childTable = requireParam(params, 'child')
    const fk = requireParam(params, 'fk')
    const parentId = requireParam(params, 'parentId')
    const parentStamp = params.parentStamp === undefined ? null : Number(params.parentStamp)
    const child = tableIdent(db, childTable)
    const col = columnIdent(db, childTable, fk)
    const rows = queryAll(
      db,
      `SELECT id, deleted_on, updated_on FROM ${child} WHERE ${col} = ?`,
      [parentId],
    )
    const killedThisBatch = []
    const killedEarlier = []
    const alive = []
    for (const r of rows) {
      if (r.deleted_on === null) alive.push(r.id)
      else if (parentStamp !== null && Number(r.deleted_on) === parentStamp) killedThisBatch.push(r.id)
      else killedEarlier.push({ id: r.id, deleted_on: r.deleted_on })
    }
    const others = queryOne(
      db,
      `SELECT COUNT(*) AS n FROM ${child} WHERE ${col} IS NOT ? AND deleted_on IS NULL`,
      [parentId],
    )
    return {
      childTable, fk, parentId, parentStamp,
      killedThisBatch, killedEarlier, alive,
      otherParentsAliveRows: others?.n ?? 0,
      cascadeComplete: alive.length === 0,
    }
  },
}

export const disabledVsDeleted = {
  id: 'disabled-vs-deleted',
  purpose: '停用與軟刪三態分離，停用不刪歷史',
  covers: 2,
  run({ db }) {
    const out = []
    for (const t of disableableTables(db)) {
      const table = tableIdent(db, t)
      const rows = queryAll(
        db,
        `SELECT
            SUM(CASE WHEN deleted_on IS NULL AND disabled_on IS NULL THEN 1 ELSE 0 END) AS active,
            SUM(CASE WHEN deleted_on IS NULL AND disabled_on IS NOT NULL THEN 1 ELSE 0 END) AS disabled,
            SUM(CASE WHEN deleted_on IS NOT NULL THEN 1 ELSE 0 END) AS deleted
          FROM ${table}`,
      )
      const counts = rows[0] ?? {}
      // 判停用不刪歷史，要附該實體的未刪交易數。
      const historyCol = t === 'accounts' ? 'account_id' : t === 'categories' ? 'category_id' : null
      let historyRows = null
      if (historyCol && listTables(db).includes('transactions') && hasColumn(db, 'transactions', historyCol)) {
        const hc = columnIdent(db, 'transactions', historyCol)
        const h = queryOne(
          db,
          `SELECT COUNT(*) AS n FROM transactions WHERE deleted_on IS NULL
             AND ${hc} IN (SELECT id FROM ${table} WHERE disabled_on IS NOT NULL)`,
        )
        historyRows = h?.n ?? 0
      }
      out.push({ table: t, ...counts, disabledEntityLiveTransactions: historyRows })
    }
    return { rows: out }
  },
}

// ---------- 欄位不變式 ----------

export const requiredField = {
  id: 'required-field',
  purpose: '必填欄資料不變式；WatermelonDB 不發 NOT NULL，只能資料掃描',
  covers: 5,
  run({ db, params }) {
    const spec = params.required ?? DEFAULT_REQUIRED
    const violations = []
    for (const [t, cols] of Object.entries(spec)) {
      if (!listTables(db).includes(t)) continue
      const table = tableIdent(db, t)
      for (const colName of cols) {
        if (!hasColumn(db, t, colName)) {
          violations.push({ table: t, column: colName, kind: 'COLUMN_MISSING', rows: null })
          continue
        }
        const c = columnIdent(db, t, colName)
        // 空字串與 NULL 同視為違反。
        const n = queryOne(db, `SELECT COUNT(*) AS n FROM ${table} WHERE ${c} IS NULL OR TRIM(CAST(${c} AS TEXT)) = ''`)
        if (n && n.n > 0) violations.push({ table: t, column: colName, kind: 'EMPTY_VALUE', rows: n.n })
      }
    }
    return { violations, clean: violations.length === 0 }
  },
}

const DEFAULT_REQUIRED = {
  accounts: ['user_id', 'name', 'currency_code'],
  categories: ['user_id', 'name', 'type'],
  transactions: ['user_id', 'account_id', 'category_id', 'amount', 'date'],
  transfers: ['user_id', 'account_from_id', 'account_to_id', 'amount_from', 'amount_to', 'date'],
}

export const enumDomain = {
  id: 'enum-domain',
  purpose: '欄位實際出現值攤成集合與允許集合比對',
  covers: 8,
  run({ db, params }) {
    const spec = params.enums ?? DEFAULT_ENUMS
    const findings = []
    for (const [t, cols] of Object.entries(spec)) {
      if (!listTables(db).includes(t)) continue
      const table = tableIdent(db, t)
      for (const [colName, allowed] of Object.entries(cols)) {
        if (!hasColumn(db, t, colName)) continue
        const c = columnIdent(db, t, colName)
        const rows = queryAll(db, `SELECT DISTINCT ${c} AS v FROM ${table} WHERE ${c} IS NOT NULL`)
        const seen = rows.map(r => String(r.v))
        const outside = seen.filter(v => !allowed.includes(v))
        findings.push({ table: t, column: colName, allowed, seen, outside, clean: outside.length === 0 })
      }
    }
    return { findings, clean: findings.every(f => f.clean) }
  },
}

const DEFAULT_ENUMS = {
  categories: { type: ['expense', 'income'] },
}

export const deadColumnNull = {
  id: 'dead-column-null',
  purpose: '棄用殘欄與條件式空值恆為 Null',
  covers: 8,
  run({ db, params }) {
    const spec = params.deadColumns ?? DEFAULT_DEAD_COLUMNS
    const findings = []
    for (const [t, cols] of Object.entries(spec)) {
      if (!listTables(db).includes(t)) continue
      const table = tableIdent(db, t)
      for (const colName of cols) {
        if (!hasColumn(db, t, colName)) {
          findings.push({ table: t, column: colName, status: 'COLUMN_ABSENT', nonNullRows: 0 })
          continue
        }
        const c = columnIdent(db, t, colName)
        const n = queryOne(db, `SELECT COUNT(*) AS n FROM ${table} WHERE ${c} IS NOT NULL`)
        findings.push({
          table: t, column: colName,
          status: (n?.n ?? 0) === 0 ? 'ALL_NULL' : 'HAS_VALUES',
          nonNullRows: n?.n ?? 0,
        })
      }
    }
    return { findings, clean: findings.every(f => f.status !== 'HAS_VALUES') }
  },
}

const DEFAULT_DEAD_COLUMNS = {
  users: ['iap_entitlements_json', 'iap_active_purchases_json'],
  accounts: ['schedule_id'],
}

export const stringHygiene = {
  id: 'string-hygiene',
  purpose: '字串欄前後空白已去除、長度不超上限',
  covers: 7,
  run({ db, params }) {
    const importMode = params.importMode === 'true' || params.importMode === true
    const spec = params.strings ?? DEFAULT_STRINGS
    const findings = []
    for (const [t, cols] of Object.entries(spec)) {
      if (!listTables(db).includes(t)) continue
      const table = tableIdent(db, t)
      for (const [colName, limit] of Object.entries(cols)) {
        if (!hasColumn(db, t, colName)) continue
        const c = columnIdent(db, t, colName)
        const untrimmed = queryOne(db, `SELECT COUNT(*) AS n FROM ${table} WHERE ${c} IS NOT NULL AND ${c} <> TRIM(${c})`)
        const over = queryOne(db, `SELECT COUNT(*) AS n FROM ${table} WHERE ${c} IS NOT NULL AND LENGTH(${c}) > ?`, [limit])
        findings.push({
          table: t, column: colName, limit,
          untrimmedRows: untrimmed?.n ?? 0,
          overLimitRows: over?.n ?? 0,
          // 匯入路徑超長是截斷不是拒絕，兩種場次判準不同。
          overLimitIsExpected: importMode,
        })
      }
    }
    const clean = findings.every(f => f.untrimmedRows === 0 && (f.overLimitRows === 0 || f.overLimitIsExpected))
    return { findings, clean, importMode }
  },
}

const DEFAULT_STRINGS = {
  accounts: { name: NAME_LIMIT },
  categories: { name: NAME_LIMIT },
  transactions: { note: NOTE_LIMIT },
  transfers: { note: NOTE_LIMIT },
}

export const amountScale = {
  id: 'amount-scale',
  purpose: '金額必為 ×10000 整數且不超安全整數上限',
  covers: 8,
  run({ db }) {
    const spec = {
      transactions: ['amount'],
      transfers: ['amount_from', 'amount_to'],
      schedules: ['template_amount', 'template_amount_from', 'template_amount_to'],
    }
    const findings = []
    for (const [t, cols] of Object.entries(spec)) {
      if (!listTables(db).includes(t)) continue
      const table = tableIdent(db, t)
      for (const colName of cols) {
        if (!hasColumn(db, t, colName)) continue
        const c = columnIdent(db, t, colName)
        const rows = queryAll(db, `SELECT id, ${c} AS v FROM ${table} WHERE ${c} IS NOT NULL`)
        const bad = []
        for (const r of rows) {
          const d = decodeAmount(r.v)
          if (!d.ok) bad.push({ id: r.id, raw: r.v, flags: d.flags })
        }
        findings.push({ table: t, column: colName, rows: rows.length, violations: bad })
      }
    }
    return { findings, clean: findings.every(f => f.violations.length === 0), scale: 10000, cap: MAX_STORAGE_AMOUNT }
  },
}

export const timestampSanity = {
  id: 'timestamp-sanity',
  purpose: 'UTC 毫秒、updated_on 不早於 created_at、created_at 不再變、updated_on 不倒退',
  covers: 8,
  run({ db, baselineAlias = null }) {
    const findings = []
    for (const t of listTables(db)) {
      if (!hasColumn(db, t, 'updated_on') || !hasColumn(db, t, 'created_at')) continue
      const table = tableIdent(db, t)
      const secondsLike = queryOne(
        db,
        `SELECT COUNT(*) AS n FROM ${table}
           WHERE (created_at > 0 AND created_at < ?) OR (updated_on > 0 AND updated_on < ?)`,
        [MILLIS_FLOOR, MILLIS_FLOOR],
      )
      const inverted = queryOne(db, `SELECT COUNT(*) AS n FROM ${table} WHERE updated_on < created_at`)
      const entry = {
        table: t,
        looksLikeSeconds: secondsLike?.n ?? 0,
        updatedBeforeCreated: inverted?.n ?? 0,
        createdAtMutated: null,
        updatedOnWentBack: null,
      }
      // 這兩項要 baseline 才成立；無 baseline 時降級標註而非略過。
      if (baselineAlias) {
        const mutated = queryOne(
          db,
          `SELECT COUNT(*) AS n FROM ${table} cur JOIN ${baselineAlias}.${table} base ON base.id = cur.id
             WHERE COALESCE(cur.created_at, -1) <> COALESCE(base.created_at, -1)`,
        )
        const back = queryOne(
          db,
          `SELECT COUNT(*) AS n FROM ${table} cur JOIN ${baselineAlias}.${table} base ON base.id = cur.id
             WHERE cur.updated_on < base.updated_on`,
        )
        entry.createdAtMutated = mutated?.n ?? 0
        entry.updatedOnWentBack = back?.n ?? 0
      }
      findings.push(entry)
    }
    return {
      findings,
      baselineAvailable: Boolean(baselineAlias),
      clean: findings.every(f =>
        f.looksLikeSeconds === 0 && f.updatedBeforeCreated === 0 &&
        (f.createdAtMutated ?? 0) === 0 && (f.updatedOnWentBack ?? 0) === 0),
    }
  },
}

export const iconIdValidity = {
  id: 'icon-id-validity',
  purpose: '帳戶與類別的 icon_id 落在有效池；池是稀疏集合、不是區間',
  covers: 2,
  needsDefinitions: true,
  run({ db, defs }) {
    const findings = []
    for (const t of ['accounts', 'categories']) {
      if (!listTables(db).includes(t) || !hasColumn(db, t, 'icon_id')) continue
      const table = tableIdent(db, t)
      // 含已軟刪列一併查，載入層 fallback 沒擋住的話這裡看得到。
      const rows = queryAll(db, `SELECT id, icon_id FROM ${table} WHERE icon_id IS NOT NULL`)
      const invalid = rows.filter(r => !defs.iconIds.has(Number(r.icon_id)))
      findings.push({ table: t, rows: rows.length, invalid })
    }
    return { findings, poolSize: defs.iconIds.size, clean: findings.every(f => f.invalid.length === 0) }
  },
}

export const sortOrderIntegrity = {
  id: 'sort-order-integrity',
  purpose: '拖拉後順序、新建接續 MAX 加一、同分區無重號',
  covers: 3,
  run({ db, params }) {
    const expectOrder = params.expectOrder ? String(params.expectOrder).split(',') : null
    const findings = []
    const specs = [
      { table: 'categories', partition: 'type' },
      { table: 'accounts', partition: null },
    ]
    for (const { table: t, partition } of specs) {
      if (!listTables(db).includes(t) || !hasColumn(db, t, 'sort_order')) continue
      const table = tableIdent(db, t)
      const partCol = partition && hasColumn(db, t, partition) ? columnIdent(db, t, partition) : null
      const groupExpr = partCol ?? `'all'`
      const dupes = queryAll(
        db,
        `SELECT ${groupExpr} AS part, sort_order AS ord, COUNT(*) AS n
           FROM ${table} WHERE deleted_on IS NULL
          GROUP BY ${groupExpr}, sort_order HAVING COUNT(*) > 1`,
      )
      const maxima = queryAll(
        db,
        `SELECT ${groupExpr} AS part, MAX(sort_order) AS maxOrder, COUNT(*) AS n
           FROM ${table} WHERE deleted_on IS NULL GROUP BY ${groupExpr}`,
      )
      const entry = { table: t, partition, duplicates: dupes, maxima, orderMatches: null }
      // 期望順序 SQL 自己不知道，未提供時只判重號與 MAX。
      if (expectOrder) {
        const actual = queryAll(
          db,
          `SELECT id FROM ${table} WHERE deleted_on IS NULL ORDER BY sort_order ASC`,
        ).map(r => String(r.id))
        entry.orderMatches = JSON.stringify(actual) === JSON.stringify(expectOrder)
        entry.actualOrder = actual
      }
      findings.push(entry)
    }
    return { findings, clean: findings.every(f => f.duplicates.length === 0 && f.orderMatches !== false) }
  },
}

// ---------- 領域樣板 ----------

export const settingsWritethrough = {
  id: 'settings-writethrough',
  purpose: '單列 settings 全欄快照加 updated_on',
  covers: 20,
  run({ db }) {
    if (!listTables(db).includes('settings')) return { rows: [], absent: true }
    const rows = queryAll(db, 'SELECT * FROM settings')
    // 四欄可空，NULL 一律標 DEFAULT，不讀成 0 或 false。
    const nullable = ['week_start', 'home_time_granularity', 'home_group_mode', 'analytics_consent']
    const decoded = rows.map(r => {
      const out = { ...r }
      for (const c of nullable) if (c in out && out[c] === null) out[c] = 'DEFAULT'
      return out
    })
    return { rows: decoded, count: rows.length, singleRow: rows.length === 1 }
  },
}

export const syncWatermark = {
  id: 'sync-watermark',
  purpose: 'last_synced_at 移動方向，加各表待上傳筆數',
  covers: 5,
  run({ db, baselineAlias = null }) {
    if (!listTables(db).includes('settings') || !hasColumn(db, 'settings', 'last_synced_at')) {
      return { absent: true }
    }
    const cur = queryOne(db, 'SELECT last_synced_at AS w FROM settings LIMIT 1')
    const watermark = cur?.w ?? null
    let baseline = null
    if (baselineAlias) {
      const b = queryOne(db, `SELECT last_synced_at AS w FROM ${baselineAlias}.settings LIMIT 1`)
      baseline = b?.w ?? null
    }
    const pending = []
    for (const t of listTables(db)) {
      if (!hasColumn(db, t, 'updated_on')) continue
      const table = tableIdent(db, t)
      const n = queryOne(db, `SELECT COUNT(*) AS n FROM ${table} WHERE updated_on > COALESCE(?, 0)`, [watermark])
      pending.push({ table: t, pendingRows: n?.n ?? 0 })
    }
    // NULL 是從未上傳、不可當 0 比大小，先分態再比值。
    let movement = 'UNKNOWN'
    if (baselineAlias) {
      if (baseline === null && watermark === null) movement = 'BOTH_NEVER_SYNCED'
      else if (baseline === null) movement = 'FIRST_SYNC'
      else if (watermark === null) movement = 'WATERMARK_CLEARED'
      else movement = watermark > baseline ? 'ADVANCED' : watermark === baseline ? 'UNCHANGED' : 'WENT_BACK'
    }
    return { watermark, baseline, movement, pending, totalPending: pending.reduce((a, p) => a + p.pendingRows, 0) }
  },
}

export const fxRateConsistency = {
  id: 'fx-rate-consistency',
  purpose: '跨幣別 implied_rate 等於兩腿比值、同幣別為 Null',
  covers: 7,
  run({ db }) {
    if (!listTables(db).includes('transfers')) return { absent: true }
    const rows = queryAll(
      db,
      `SELECT t.id, t.amount_from, t.amount_to, t.implied_rate,
              af.currency_code AS from_code, at.currency_code AS to_code
         FROM transfers t
         LEFT JOIN accounts af ON af.id = t.account_from_id
         LEFT JOIN accounts at ON at.id = t.account_to_id
        WHERE t.deleted_on IS NULL`,
    )
    const violations = []
    for (const r of rows) {
      const sameCurrency = r.from_code !== null && r.from_code === r.to_code
      if (sameCurrency) {
        if (r.implied_rate !== null) violations.push({ id: r.id, kind: 'SAME_CURRENCY_RATE_SET', implied: r.implied_rate })
        continue
      }
      if (r.implied_rate === null) {
        violations.push({ id: r.id, kind: 'CROSS_CURRENCY_RATE_NULL' })
        continue
      }
      const from = Number(r.amount_from)
      const to = Number(r.amount_to)
      if (!from) { violations.push({ id: r.id, kind: 'ZERO_FROM_AMOUNT' }); continue }
      // 兩腿同倍率縮放，比值不受 ×10000 影響。
      const expected = to / from
      if (Math.abs(expected - Number(r.implied_rate)) > 1e-7) {
        violations.push({ id: r.id, kind: 'RATE_MISMATCH', expected, actual: r.implied_rate })
      }
    }
    return { rows: rows.length, violations, clean: violations.length === 0 }
  },
}

export const mergeRepoint = {
  id: 'merge-repoint',
  purpose: '合併後來源側未刪引用歸零、目標側增量相符、來源軟刪',
  covers: 8,
  run({ db, params }) {
    const entityTable = requireParam(params, 'entity')
    const sourceId = requireParam(params, 'sourceId')
    const targetId = requireParam(params, 'targetId')
    const links = entityTable === 'accounts'
      ? [['transactions', 'account_id'], ['transfers', 'account_from_id'], ['transfers', 'account_to_id']]
      : [['transactions', 'category_id']]
    const rows = []
    for (const [child, fk] of links) {
      if (!listTables(db).includes(child) || !hasColumn(db, child, fk)) continue
      const c = tableIdent(db, child)
      const col = columnIdent(db, child, fk)
      const src = queryOne(db, `SELECT COUNT(*) AS n FROM ${c} WHERE ${col} = ? AND deleted_on IS NULL`, [sourceId])
      const tgt = queryOne(db, `SELECT COUNT(*) AS n FROM ${c} WHERE ${col} = ? AND deleted_on IS NULL`, [targetId])
      rows.push({ child, fk, sourceLiveRefs: src?.n ?? 0, targetLiveRefs: tgt?.n ?? 0 })
    }
    const ent = tableIdent(db, entityTable)
    const source = queryOne(db, `SELECT id, deleted_on, updated_on FROM ${ent} WHERE id = ?`, [sourceId])
    const sourceState = source ? classifyTombstone(source) : 'ROW_MISSING'
    // 模板指向來源的排程也要一併軟刪。
    let scheduleLeftovers = null
    if (listTables(db).includes('schedules')) {
      const cols = listColumns(db, 'schedules').map(c => c.name)
      const tmplCols = cols.filter(c => c.startsWith('template_') && c.endsWith('_id'))
      let n = 0
      for (const tc of tmplCols) {
        const col = columnIdent(db, 'schedules', tc)
        const r = queryOne(db, `SELECT COUNT(*) AS n FROM schedules WHERE ${col} = ? AND deleted_on IS NULL`, [sourceId])
        n += r?.n ?? 0
      }
      scheduleLeftovers = n
    }
    return {
      entityTable, sourceId, targetId, rows, sourceState, scheduleLeftovers,
      // 原子性判不出來，只判最終狀態。
      atomicityNote: '本樣板只判最終狀態，合併過程的原子性無法自資料層還原',
      clean: rows.every(r => r.sourceLiveRefs === 0) && sourceState === 'TOMBSTONE_OK' && (scheduleLeftovers ?? 0) === 0,
    }
  },
}

export const scheduleInstanceSeries = {
  id: 'schedule-instance-series',
  purpose: '依 schedule_id 拉實例序列，含間隔、邊界與重號偵測',
  covers: 23,
  run({ db, params }) {
    const instanceTable = requireOneOfParam(params, 'instanceTable', ['transactions', 'transfers'])
    const scheduleId = requireParam(params, 'scheduleId')
    const table = tableIdent(db, instanceTable)
    if (!hasColumn(db, instanceTable, 'schedule_id')) {
      return { skipped: true, reason: `表 ${instanceTable} 無 schedule_id 欄` }
    }
    const dateCol = hasColumn(db, instanceTable, 'schedule_instance_date') ? 'schedule_instance_date' : 'date'
    const dc = columnIdent(db, instanceTable, dateCol)
    const series = queryAll(
      db,
      `SELECT id, ${dc} AS instanceDate, deleted_on,
              ${dc} - LAG(${dc}) OVER (ORDER BY ${dc}) AS gapMs
         FROM ${table} WHERE schedule_id = ? ORDER BY ${dc} ASC`,
      [scheduleId],
    )
    // 重號是這一域最值錢的單查詢，獨立輸出。
    const dupes = queryAll(
      db,
      `SELECT schedule_id, ${dc} AS instanceDate, COUNT(*) AS n
         FROM ${table} WHERE schedule_id = ?
        GROUP BY schedule_id, ${dc} HAVING COUNT(*) > 1`,
      [scheduleId],
    )
    return {
      instanceTable, scheduleId, dateColumn: dateCol,
      series, duplicates: dupes,
      live: series.filter(r => r.deleted_on === null).length,
      deleted: series.filter(r => r.deleted_on !== null).length,
      clean: dupes.length === 0,
    }
  },
}

export const scheduleTruncation = {
  id: 'schedule-truncation',
  purpose: '此筆及未來的切點語意：舊排程收尾、切點後實例軟刪、新排程自切點起',
  covers: 12,
  run({ db, params }) {
    const cutDate = Number(requireParam(params, 'cutDate'))
    const oldId = params.oldScheduleId ?? null
    const newId = params.newScheduleId ?? null
    if (!listTables(db).includes('schedules')) return { absent: true }
    const out = { cutDate, oldScheduleId: oldId, newScheduleId: newId }
    if (oldId) {
      out.oldSchedule = queryOne(db, 'SELECT id, start_on, end_on, deleted_on FROM schedules WHERE id = ?', [oldId])
      out.instancesAfterCut = countInstances(db, oldId, cutDate, '>=')
      out.liveInstancesAfterCut = countInstances(db, oldId, cutDate, '>=', true)
      out.instancesBeforeCut = countInstances(db, oldId, cutDate, '<', true)
    }
    if (newId) {
      out.newSchedule = queryOne(db, 'SELECT id, start_on, end_on, deleted_on FROM schedules WHERE id = ?', [newId])
      out.newStartsAtCut = out.newSchedule ? Number(out.newSchedule.start_on) === cutDate : null
    }
    out.clean = (out.liveInstancesAfterCut ?? 0) === 0 && (out.newStartsAtCut ?? true)
    return out
  },
}

function countInstances(db, scheduleId, cutDate, op, liveOnly = false) {
  let total = 0
  for (const t of ['transactions', 'transfers']) {
    if (!listTables(db).includes(t) || !hasColumn(db, t, 'schedule_id')) continue
    const table = tableIdent(db, t)
    const dateCol = hasColumn(db, t, 'schedule_instance_date') ? 'schedule_instance_date' : 'date'
    const dc = columnIdent(db, t, dateCol)
    const liveClause = liveOnly ? 'AND deleted_on IS NULL' : ''
    const cmp = op === '>=' ? '>=' : '<'
    const r = queryOne(db, `SELECT COUNT(*) AS n FROM ${table} WHERE schedule_id = ? AND ${dc} ${cmp} ? ${liveClause}`, [scheduleId, cutDate])
    total += r?.n ?? 0
  }
  return total
}

export const importBatchOutcome = {
  id: 'import-batch-outcome',
  purpose: '匯入前後的新增列比對，四類實體各幾筆',
  covers: 10,
  needsBaseline: true,
  run({ db, baselineAlias }) {
    const targets = ['accounts', 'categories', 'transactions', 'transfers']
    const rows = []
    for (const t of targets) {
      if (!listTables(db).includes(t)) continue
      const table = tableIdent(db, t)
      const added = queryAll(
        db,
        `SELECT id FROM ${table} WHERE NOT EXISTS (SELECT 1 FROM ${baselineAlias}.${table} b WHERE b.id = ${table}.id)`,
      )
      rows.push({ table: t, added: added.length, ids: added.map(r => r.id) })
    }
    return { rows, totalAdded: rows.reduce((a, r) => a + r.added, 0) }
  },
}

export const placeholderRateSeed = {
  id: 'placeholder-rate-seed',
  purpose: '建外幣帳戶種佔位匯率、匯入建帳戶不種、復原不撤已種的那筆',
  covers: 3,
  needsDefinitions: true,
  run({ db, defs, params }) {
    if (!listTables(db).includes('currency_rates')) return { absent: true }
    const baseCode = params.baseCurrency ?? null
    const accounts = queryAll(db, 'SELECT id, currency_code FROM accounts WHERE deleted_on IS NULL')
    // 需要 Currency.json 把代碼轉數字 id 才 join 得起來，轉換在 JS 側做完再綁參數。
    const seen = new Set()
    const rows = []
    for (const a of accounts) {
      const code = a.currency_code
      if (!code || seen.has(code)) continue
      seen.add(code)
      const def = defs.currencyByCode.get(code)
      if (!def) { rows.push({ code, status: 'UNKNOWN_CURRENCY_CODE', rates: null }); continue }
      // 欄名是 currency_from_id 與 currency_to_id，不是 from_currency_id。
      const n = queryOne(
        db,
        'SELECT COUNT(*) AS n FROM currency_rates WHERE deleted_on IS NULL AND (currency_from_id = ? OR currency_to_id = ?)',
        [def.id, def.id],
      )
      rows.push({ code, currencyId: def.id, rates: n?.n ?? 0, isBase: baseCode ? code === baseCode : null })
    }
    return { rows, baseCurrency: baseCode }
  },
}

// ---------- 註冊表 ----------

export const TEMPLATES = [
  schemaShape, ownerScope, referentialIntegrity,
  writeDeltaCount, rowFieldRoundtrip, undoRestoreDiff,
  softDeleteTombstone, cascadeSoftDelete, disabledVsDeleted,
  requiredField, enumDomain, deadColumnNull, stringHygiene,
  amountScale, timestampSanity, iconIdValidity, sortOrderIntegrity,
  settingsWritethrough, syncWatermark, fxRateConsistency,
  mergeRepoint, scheduleInstanceSeries, scheduleTruncation,
  importBatchOutcome, placeholderRateSeed,
]

export const BY_ID = new Map(TEMPLATES.map(t => [t.id, t]))

export function totalCovers() {
  return TEMPLATES.reduce((a, t) => a + (t.covers ?? 0), 0)
}

function requireParam(params, name) {
  const v = params?.[name]
  if (v === undefined || v === '') {
    const err = new Error(`此樣板需要 --param ${name}=<值>。`)
    err.missingParam = name
    throw err
  }
  return v
}

function requireOneOfParam(params, name, allowed) {
  const v = requireParam(params, name)
  if (!allowed.includes(v)) {
    const err = new Error(`--param ${name} 只接受 ${allowed.join(' 或 ')}，收到 ${v}。`)
    err.badParam = name
    throw err
  }
  return v
}
