// node:sqlite 的唯讀存取層與識別子安全插值。
//
// 安全模型分兩層，兩層都不可繞過：
//   值   走參數綁定，SQLite 的 ? 佔位。
//   識別子 表名欄名不能綁定，改走執行期反查的白名單再插值。
//
// schema 一律執行期反查，不寫死。清單與現況對不上時報漂移、不報 FAIL。
// 對賬路徑一律 readOnly 開啟，寫入只在獨立子指令且另有確認。

import { DatabaseSync } from 'node:sqlite'
import path from 'node:path'
import fs from 'node:fs'
import { bail, EXIT } from './cli.mjs'

// WatermelonDB 自帶的內部欄，diff 預設忽略。
export const INTERNAL_COLUMNS = new Set(['_status', '_changed'])

// ATTACH 與 open 都要正斜線路徑，Windows 的反斜線在 SQL 字面值裡會被當逃逸。
export function toSqlitePath(p) {
  return path.resolve(p).split(path.sep).join('/')
}

export function openReadOnly(dbPath) {
  const resolved = path.resolve(dbPath)
  if (!fs.existsSync(resolved)) {
    bail(`找不到資料庫檔 ${resolved}。`, EXIT.BAD_ENV, '確認路徑，或先跑 snapshot 子指令把檔案複製進 runs/。')
  }
  try {
    return new DatabaseSync(resolved, { readOnly: true })
  } catch (err) {
    bail(`開啟資料庫失敗：${err.message}`, EXIT.BAD_ENV, '確認檔案不是空檔、也不是還在寫入中的 -wal。')
  }
}

// 多快照比對用。alias 自己也是識別子，同樣要限字元。
export function attach(db, dbPath, alias) {
  assertSafeAlias(alias)
  const resolved = toSqlitePath(dbPath)
  if (!fs.existsSync(path.resolve(dbPath))) {
    bail(`要 ATTACH 的資料庫檔不存在：${resolved}。`, EXIT.BAD_ENV, '確認 --baseline 指到的 label 真的做過 snapshot。')
  }
  if (resolved.includes("'")) {
    bail(`資料庫路徑含單引號，無法安全 ATTACH：${resolved}。`, EXIT.BAD_ENV, '把檔案移到不含單引號的路徑再跑。')
  }
  db.exec(`ATTACH DATABASE '${resolved}' AS ${alias}`)
  return alias
}

function assertSafeAlias(alias) {
  if (!/^[A-Za-z][A-Za-z0-9_]*$/.test(alias)) {
    bail(`ATTACH 別名 ${alias} 含非法字元。`, EXIT.BAD_ENV, '別名限英數與底線、且需字母開頭。')
  }
}

// 執行期反查真實表清單。這是識別子白名單的唯一來源。
export function listTables(db, schema = 'main') {
  assertSafeAlias(schema)
  const rows = db
    .prepare(`SELECT name FROM ${schema}.sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name`)
    .all()
  return rows.map(r => r.name)
}

// notnull 是 SQLite 保留字，加 AS 別名會直接語法錯誤。整列取回再於 JS 側改名。
export function listColumns(db, table, schema = 'main') {
  assertSafeAlias(schema)
  const rows = db.prepare('SELECT * FROM pragma_table_info(?, ?)').all(table, schema)
  return rows.map(r => ({ name: r.name, type: r.type, notNull: Boolean(r.notnull) }))
}

// 全庫 schema 指紋。跨快照比對用，也是其他樣板的前置健檢。
export function schemaFingerprint(db, schema = 'main') {
  const tables = listTables(db, schema)
  const shape = {}
  for (const t of tables) shape[t] = listColumns(db, t, schema).map(c => c.name)
  const userVersion = db.prepare(`PRAGMA ${schema}.user_version`).get()
  return { tables, shape, userVersion: userVersion?.user_version ?? null }
}

// 識別子插值的唯一合法入口。不在白名單就直接中止，不做模糊比對。
export function safeIdent(name, whitelist, label) {
  if (!whitelist.includes(name)) {
    bail(
      `${label} ${name} 不在本資料庫的實際清單內。`,
      EXIT.BAD_ENV,
      `實際可用：${whitelist.join('、')}。`,
    )
  }
  // 白名單本身來自 sqlite_master，仍再過一次字元檢查，防呆勝過信任。
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) {
    bail(`${label} ${name} 含非法字元，拒絕插值。`, EXIT.BAD_ENV, '這通常代表資料庫被人工改過表名。')
  }
  return name
}

export function tableIdent(db, table, schema = 'main') {
  return safeIdent(table, listTables(db, schema), '表名')
}

export function columnIdent(db, table, column, schema = 'main') {
  const cols = listColumns(db, table, schema).map(c => c.name)
  return safeIdent(column, cols, `表 ${table} 的欄名`)
}

export function hasColumn(db, table, column, schema = 'main') {
  return listColumns(db, table, schema).some(c => c.name === column)
}

// 零筆是訊號不是通過。呼叫端拿到 rows.length === 0 要自行決定退出碼 3。
export function queryAll(db, sql, params = []) {
  try {
    return db.prepare(sql).all(...params)
  } catch (err) {
    bail(`SQL 執行失敗：${err.message}`, EXIT.UNEXPECTED, `語句為 ${sql.slice(0, 200)}`)
  }
}

export function queryOne(db, sql, params = []) {
  const rows = queryAll(db, sql, params)
  return rows.length ? rows[0] : null
}

// 六張軟刪表與兩張停用表由執行期反查決定，不寫死清單。
export function softDeletableTables(db, schema = 'main') {
  return listTables(db, schema).filter(t => hasColumn(db, t, 'deleted_on', schema))
}

export function disableableTables(db, schema = 'main') {
  return listTables(db, schema).filter(t => hasColumn(db, t, 'disabled_on', schema))
}

export function ownerScopedTables(db, schema = 'main') {
  return listTables(db, schema).filter(t => hasColumn(db, t, 'user_id', schema))
}
