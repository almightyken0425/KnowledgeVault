// 無帳號整改後已作廢的檢驗點名單。
//
// 用途是讓對賬報告把這些條標 STALE，而不是判成 FAIL。
// 判成 FAIL 會讓 findings 灌滿清單自己的問題，掩蓋真正的 app 缺陷。
//
// 名單來源是機械掃描的結果，不是人工判斷：
//   錨檔不存在   impl 錨指向的檔案已隨無帳號整改刪除
//   錨成員不存在 檔還在、export 或具名函式已消失
//   spec 錨不存在 spec 側同批刪檔
//
// 本名單只是子集。清單本身尚未跟進整改，逐冊波動度見清單索引的抽取基線段。
// 任何一輪對賬的身分面與訂閱面結果都要標條件成立。

export const BASELINE = {
  extractedAt: '2026-08-04',
  qualityCommit: '5276f7e',
  implHead: '1863dd9',
  specHead: 'bdb8a94',
  notFollowedUp: ['5bdf0d8', 'ef28cf9', '22befff'],
}

// impl 錨檔已不存在。整條的判準落點消失，不可執行。
export const ANCHOR_FILE_GONE = {
  'src/screens/Auth/LoginScreen.tsx': {
    reason: '登入牆已拔除，無登入頁',
    ids: ['C-BT-005', 'C-BT-006', 'C-BT-007', 'C-BT-008', 'C-BT-009', 'C-BT-010',
      'C-BT-011', 'C-BT-012', 'C-BT-013', 'C-BT-014', 'C-BT-015', 'C-BT-016'],
  },
  'src/services/premiumStatusCache.ts': {
    reason: '訂閱真相移至 StoreKit，本機授權快取整支移除',
    ids: ['C-DA-067', 'C-BT-035', 'C-BT-036', 'C-BT-037', 'C-BT-083',
      'C-SB-006', 'C-SB-010', 'C-SB-011', 'C-SB-012', 'C-SB-059'],
  },
  'src/services/entitlementTier.ts': {
    reason: '授權等級解析改走 StoreKit，原模組移除',
    ids: ['C-SB-061', 'C-SB-062', 'C-SB-063', 'C-SB-064', 'C-SB-065'],
  },
}

// 檔還在、成員沒了。行為多半改寫而非消失，屬待改寫而非純作廢。
export const ANCHOR_MEMBER_GONE = [
  { id: 'C-DA-017', anchor: 'src/services/localDbService.ts::resetAllData', reason: '本機重置改寫為全資料清除路徑' },
  { id: 'C-DA-018', anchor: 'src/services/localDbService.ts::resetAllData', reason: '同上' },
  { id: 'C-DA-019', anchor: 'src/services/localDbService.ts::resetAllData', reason: '同上' },
  { id: 'C-DA-020', anchor: 'src/services/localDbService.ts::resetAllData', reason: '同上' },
  { id: 'C-DA-021', anchor: 'src/services/localDbService.ts::resetAllData', reason: '同上' },
  { id: 'C-DA-022', anchor: 'src/services/localDbService.ts::resetAllData', reason: '同上' },
  { id: 'C-BT-032', anchor: 'src/services/userService.ts::detectAccountSwitch', reason: '無帳號可換，換帳號偵測移除' },
  { id: 'C-BT-070', anchor: 'src/services/firebase.ts::getAppleAuthorizationCode', reason: 'Apple 登入門移除' },
  { id: 'C-SB-055', anchor: 'src/services/entitlementService.ts::subscribeEntitlement', reason: '授權訂閱來源改 StoreKit' },
  { id: 'C-SB-066', anchor: 'src/services/entitlementService.ts::subscribeEntitlement', reason: '同上' },
]

// spec 錨檔已刪。spec 側同批改動見 spec git 的 7a3a059。
export const SPEC_ANCHOR_GONE = {
  no2_login_logout_logic: { reason: '登入登出邏輯規格刪除，取代者為 no2_anonymous_bootstrap_logic', count: 21 },
  no1_login_screen: { reason: '登入畫面規格刪除，取代者為 no28_offline_retry_screen', count: 14 },
}

// fixture 層級的結構性失效。整場不可跑，不是逐步重判。
export const DEAD_FIXTURES = [
  { fixture: 'F9', name: '雙帳號', scenario: 'S34', reason: '一走 Apple 門一走 Google 門，兩門皆不存在' },
  { fixture: 'F10', name: '可棄用帳號', scenario: 'S35', reason: '另備測試帳號的佈置不可達' },
]

// 需重寫口徑、非整條作廢的 fixture。
export const REWRITE_FIXTURES = [
  { fixture: 'F0', name: '空庫', reason: '定義寫全新登入的帳號，要改為首開匿名身分' },
  { fixture: 'F8', name: '付費帳號', reason: '定義寫帳號登入，要改為 Apple ID 名下有有效訂閱' },
]

const staleSet = new Set([
  ...Object.values(ANCHOR_FILE_GONE).flatMap(e => e.ids),
  ...ANCHOR_MEMBER_GONE.map(e => e.id),
])

export function isStale(id) {
  return staleSet.has(id)
}

export function staleReason(id) {
  for (const [anchor, entry] of Object.entries(ANCHOR_FILE_GONE)) {
    if (entry.ids.includes(id)) return `${entry.reason}（錨 ${anchor} 已不存在）`
  }
  const member = ANCHOR_MEMBER_GONE.find(e => e.id === id)
  if (member) return `${member.reason}（錨 ${member.anchor} 的成員已不存在）`
  return ''
}

export function staleIds() {
  return [...staleSet].sort()
}

export function summary() {
  return {
    baseline: BASELINE,
    anchorFileGone: Object.values(ANCHOR_FILE_GONE).reduce((a, e) => a + e.ids.length, 0),
    anchorMemberGone: ANCHOR_MEMBER_GONE.length,
    specAnchorGone: Object.values(SPEC_ANCHOR_GONE).reduce((a, e) => a + e.count, 0),
    deadFixtures: DEAD_FIXTURES.length,
    rewriteFixtures: REWRITE_FIXTURES.length,
    totalStaleIds: staleSet.size,
  }
}
