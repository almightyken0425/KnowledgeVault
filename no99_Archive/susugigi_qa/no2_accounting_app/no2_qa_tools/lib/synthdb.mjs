// 合成資料庫產生器，供 --self-test 用。
//
// 照 impl 的 src/database/schema.ts v9 建九表，欄名逐字對齊。
// 目的是離線驗證 canned query 的語法與 diff 分類邏輯，不需裝置、不需網路。
// 語意正確性要真資料才算數，這裡只保證 SQL 跑得動且分類邏輯對。

import { DatabaseSync } from 'node:sqlite'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

// WatermelonDB 的每張表都有 id、_status、_changed 三個隱藏欄。
const INTERNAL = 'id TEXT PRIMARY KEY, _status TEXT, _changed TEXT'

export const SCHEMA_V9 = {
  users: `${INTERNAL}, email TEXT, display_name TEXT, photo_url TEXT, last_login_at INTEGER,
          iap_entitlements_json TEXT, iap_active_purchases_json TEXT, created_at INTEGER, updated_on INTEGER`,
  settings: `${INTERNAL}, user_id TEXT, language TEXT, base_currency_id INTEGER, time_zone TEXT,
             theme TEXT, launch_mode TEXT, analytics_consent INTEGER, week_start TEXT,
             home_time_granularity TEXT, home_group_mode TEXT, home_selected_account_ids TEXT,
             created_at INTEGER, updated_on INTEGER, last_synced_at INTEGER`,
  accounts: `${INTERNAL}, user_id TEXT, name TEXT, icon_id INTEGER, currency_code TEXT,
             sort_order INTEGER, schedule_id TEXT, disabled_on INTEGER,
             created_at INTEGER, updated_on INTEGER, deleted_on INTEGER`,
  categories: `${INTERNAL}, user_id TEXT, name TEXT, type TEXT, icon_id INTEGER, sort_order INTEGER,
               disabled_on INTEGER, created_at INTEGER, updated_on INTEGER, deleted_on INTEGER`,
  transactions: `${INTERNAL}, user_id TEXT, account_id TEXT, category_id TEXT, amount INTEGER,
                 date INTEGER, note TEXT, schedule_id TEXT, schedule_instance_date INTEGER,
                 created_at INTEGER, updated_on INTEGER, deleted_on INTEGER`,
  transfers: `${INTERNAL}, user_id TEXT, account_from_id TEXT, account_to_id TEXT,
              amount_from INTEGER, amount_to INTEGER, date INTEGER, implied_rate REAL, note TEXT,
              schedule_id TEXT, schedule_instance_date INTEGER,
              created_at INTEGER, updated_on INTEGER, deleted_on INTEGER`,
  currency_rates: `${INTERNAL}, user_id TEXT, currency_from_id INTEGER, currency_to_id INTEGER,
                   rate REAL, date INTEGER, created_at INTEGER, updated_on INTEGER, deleted_on INTEGER`,
  schedules: `${INTERNAL}, user_id TEXT, frequency TEXT, interval INTEGER, start_on INTEGER,
              end_on INTEGER, is_transfer INTEGER, template_amount INTEGER, template_category_id TEXT,
              template_account_id TEXT, template_amount_from INTEGER, template_account_from_id TEXT,
              template_amount_to INTEGER, template_account_to_id TEXT, template_note TEXT,
              created_at INTEGER, updated_on INTEGER, deleted_on INTEGER`,
  currency_configs: `${INTERNAL}, user_id TEXT, currency_id INTEGER, decimal_places INTEGER,
                     use_thousands_unit INTEGER, created_at INTEGER, updated_on INTEGER`,
}

const UID = 'anon-uid-1'
const T0 = 1754300000000

export function makeTempDir(prefix = 'qa-selftest-') {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix))
}

export function createSynthDb(file, { variant = 'baseline' } = {}) {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  if (fs.existsSync(file)) fs.rmSync(file)
  const db = new DatabaseSync(file)
  for (const [table, cols] of Object.entries(SCHEMA_V9)) db.exec(`CREATE TABLE ${table} (${cols})`)
  db.exec('PRAGMA user_version = 9')
  seed(db, variant)
  db.close()
  return file
}

function seed(db, variant) {
  const ins = (table, cols, values) => {
    const q = cols.map(() => '?').join(', ')
    db.prepare(`INSERT INTO ${table} (${cols.join(', ')}) VALUES (${q})`).run(...values)
  }

  ins('users', ['id', 'last_login_at', 'created_at', 'updated_on'], [UID, T0, T0, T0])
  ins(
    'settings',
    ['id', 'user_id', 'language', 'base_currency_id', 'time_zone', 'theme', 'launch_mode',
      'analytics_consent', 'week_start', 'created_at', 'updated_on', 'last_synced_at'],
    ['set-1', UID, 'zh-Hant', 901, 'Asia/Taipei', 'dark', 'expense', null, null, T0, T0, T0],
  )

  // 三個本幣帳戶，icon_id 取自 IconDefinition.json 的真實 id。
  const accounts = [
    ['acc-1', 'Cash', 1, 'TWD', 0, null],
    ['acc-2', 'Bank', 2, 'TWD', 1, null],
    ['acc-3', 'Card', 3, 'TWD', 2, null],
  ]
  for (const [id, name, icon, code, order, disabled] of accounts) {
    ins(
      'accounts',
      ['id', 'user_id', 'name', 'icon_id', 'currency_code', 'sort_order', 'disabled_on', 'created_at', 'updated_on', 'deleted_on'],
      [id, UID, name, icon, code, order, disabled, T0, T0, null],
    )
  }

  const categories = [
    ['cat-1', 'Food', 'expense', 0],
    ['cat-2', 'Rent', 'expense', 1],
    ['cat-3', 'Salary', 'income', 0],
  ]
  for (const [id, name, type, order] of categories) {
    ins(
      'categories',
      ['id', 'user_id', 'name', 'type', 'icon_id', 'sort_order', 'disabled_on', 'created_at', 'updated_on', 'deleted_on'],
      [id, UID, name, type, 1, order, null, T0, T0, null],
    )
  }

  // 金額一律 ×10000 的整數。1200000 等於顯示 120。
  const txs = [
    ['tx-1', 'acc-1', 'cat-1', 1200000, T0, 'lunch'],
    ['tx-2', 'acc-2', 'cat-2', 150000000, T0, 'rent'],
    ['tx-3', 'acc-1', 'cat-3', 400000000, T0, null],
  ]
  for (const [id, acc, cat, amount, date, note] of txs) {
    ins(
      'transactions',
      ['id', 'user_id', 'account_id', 'category_id', 'amount', 'date', 'note', 'schedule_id',
        'schedule_instance_date', 'created_at', 'updated_on', 'deleted_on'],
      [id, UID, acc, cat, amount, date, note, null, null, T0, T0, null],
    )
  }

  // 同幣別轉帳，implied_rate 必須為 NULL。
  ins(
    'transfers',
    ['id', 'user_id', 'account_from_id', 'account_to_id', 'amount_from', 'amount_to', 'date',
      'implied_rate', 'note', 'schedule_id', 'schedule_instance_date', 'created_at', 'updated_on', 'deleted_on'],
    ['tf-1', UID, 'acc-1', 'acc-2', 500000, 500000, T0, null, null, null, null, T0, T0, null],
  )

  ins(
    'currency_configs',
    ['id', 'user_id', 'currency_id', 'decimal_places', 'use_thousands_unit', 'created_at', 'updated_on'],
    ['cc-1', UID, 901, 0, 0, T0, T0],
  )

  // WatermelonDB 的同步狀態欄。真實庫這兩欄會隨每次寫入變動，
  // 合成庫若留全 NULL，diff 的忽略欄設定就測不出來——差異根本造不出來。
  for (const table of Object.keys(SCHEMA_V9)) {
    db.exec(`UPDATE ${table} SET _status = 'synced', _changed = ''`)
  }

  if (variant === 'baseline') return

  if (variant === 'post-delete') {
    // 軟刪 cat-1 並連帶軟刪其交易，兩欄戳記同值才算合格墓碑。
    const stamp = T0 + 1000
    db.prepare('UPDATE categories SET deleted_on = ?, updated_on = ? WHERE id = ?').run(stamp, stamp, 'cat-1')
    db.prepare('UPDATE transactions SET deleted_on = ?, updated_on = ? WHERE category_id = ?').run(stamp, stamp, 'cat-1')
    return
  }

  if (variant === 'post-undo') {
    // 復原後墓碑清空，updated_on 仍前移，_status 轉 updated。
    // 三欄同時變動才逼得出 row-field-roundtrip 的忽略欄設定：
    // 業務欄回到原值、這三欄不會，忽略欄漏設就會誤報有差。
    const stamp = T0 + 2000
    db.prepare(`UPDATE categories SET deleted_on = NULL, updated_on = ?, _status = 'updated', _changed = 'deleted_on' WHERE id = ?`).run(stamp, 'cat-1')
    db.prepare(`UPDATE transactions SET deleted_on = NULL, updated_on = ?, _status = 'updated', _changed = 'deleted_on' WHERE category_id = ?`).run(stamp, 'cat-1')
    return
  }

  if (variant === 'broken') {
    // 蓄意壞值，供負面案例斷言：戳記不等、集外列舉、無效圖示、非整數金額、跨幣別無匯率。
    db.prepare('UPDATE categories SET deleted_on = ?, updated_on = ? WHERE id = ?').run(T0 + 10, T0 + 99, 'cat-2')
    db.prepare(`UPDATE categories SET type = 'transfer' WHERE id = ?`).run('cat-3')
    db.prepare('UPDATE accounts SET icon_id = ? WHERE id = ?').run(9999, 'acc-3')
    db.prepare('UPDATE transactions SET amount = ? WHERE id = ?').run(1200000.5, 'tx-1')
    db.prepare(`UPDATE accounts SET name = ? WHERE id = ?`).run('  Padded  ', 'acc-2')
    db.prepare('UPDATE transfers SET account_to_id = ? WHERE id = ?').run('acc-missing', 'tf-1')
    db.prepare('UPDATE users SET iap_entitlements_json = ? WHERE id = ?').run('{"tier":1}', UID)
  }
}

export function createPair(dir) {
  return {
    baseline: createSynthDb(path.join(dir, 'baseline.db'), { variant: 'baseline' }),
    postDelete: createSynthDb(path.join(dir, 'post-delete.db'), { variant: 'post-delete' }),
    postUndo: createSynthDb(path.join(dir, 'post-undo.db'), { variant: 'post-undo' }),
    broken: createSynthDb(path.join(dir, 'broken.db'), { variant: 'broken' }),
  }
}
