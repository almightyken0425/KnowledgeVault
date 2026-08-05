// 三套欄名並列：清單斷言用的概念名、本機 sqlite 的底線名、Firestore 的雲端名。
//
// 存在理由是雲端側有三處誤導性改名，照字面直覺對賬會多除或少除一次倍率。
// 本表逐項標註來源行，改 impl 時回頭核對。
//
// 來源：impl 的 src/services/syncEngine.ts 上傳映射，與 src/database/schema.ts 表定義。

// 概念名 → 本機欄名。清單斷言寫駝峰，sqlite 存底線。
export const LOCAL_COLUMN = {
  lastLoginAt: 'last_login_at',
  displayName: 'display_name',
  photoUrl: 'photo_url',
  iconId: 'icon_id',
  sortOrder: 'sort_order',
  currencyCode: 'currency_code',
  scheduleId: 'schedule_id',
  disabledOn: 'disabled_on',
  deletedOn: 'deleted_on',
  updatedOn: 'updated_on',
  createdAt: 'created_at',
  lastSyncedAt: 'last_synced_at',
  userId: 'user_id',
  baseCurrencyId: 'base_currency_id',
  timeZone: 'time_zone',
  launchMode: 'launch_mode',
  weekStart: 'week_start',
  analyticsConsent: 'analytics_consent',
  homeTimeGranularity: 'home_time_granularity',
  homeGroupMode: 'home_group_mode',
  homeSelectedAccountIds: 'home_selected_account_ids',
  impliedRate: 'implied_rate',
  accountFromId: 'account_from_id',
  accountToId: 'account_to_id',
  amountFrom: 'amount_from',
  amountTo: 'amount_to',
  useThousandsUnit: 'use_thousands_unit',
}

// 本機欄名 → 雲端欄名。只列「名字不同」的，同名不列。
// 四項全部逐行核對過 syncEngine.ts 的上傳組裝段。
export const CLOUD_RENAME = {
  transactions: {
    amount: { cloud: 'amountCents', note: '名字寫 Cents，值仍是 ×10000 的 storage 整數，不是分' },
    date: { cloud: 'transactionDate', note: '雲端存 Timestamp、本機存毫秒整數' },
    icon_id: { cloud: 'icon', note: '' },
  },
  transfers: {
    date: { cloud: 'transactionDate', note: '雲端存 Timestamp、本機存毫秒整數' },
    implied_rate: { cloud: 'impliedRateScaled', note: '名字寫 Scaled，值是主單位比值、未縮放' },
  },
  accounts: {
    icon_id: { cloud: 'icon', note: '' },
    currency_code: { cloud: 'currencyId', note: '轉數字 id；查無代碼時整欄省略、不寫 fallback' },
  },
  categories: {
    icon_id: { cloud: 'icon', note: '' },
  },
}

// 對賬時最容易踩的三個坑，報表要主動提示。
export const CLOUD_TRAPS = [
  'amountCents 不是分，是 ×10000 的 storage 整數。除 100 會少除兩位。',
  'impliedRateScaled 沒有縮放，是主單位比值。再除倍率會多除一次。',
  'accounts.currencyId 在幣別代碼查無時整欄省略。對這欄套必填會製造假 FAIL。',
]

export function toLocalColumn(concept) {
  return LOCAL_COLUMN[concept] ?? concept
}

export function toCloudField(table, localColumn) {
  const entry = CLOUD_RENAME[table]?.[localColumn]
  return entry ? entry.cloud : localColumn
}

export function renameNote(table, localColumn) {
  return CLOUD_RENAME[table]?.[localColumn]?.note ?? ''
}

// 反查用。拿雲端欄名找回本機欄名，Firestore 對賬報告需要。
export function toLocalFromCloud(table, cloudField) {
  const map = CLOUD_RENAME[table] ?? {}
  for (const [local, entry] of Object.entries(map)) {
    if (entry.cloud === cloudField) return local
  }
  return cloudField
}
