# 檢驗點：啟動與身分

> **機械跟進已完成，語意跟進未完成。** 122 條中 32 條已退場。現役 90 條裡仍有 54 條的斷言或前置寫著帳號語彙，換詞與斷言改寫尚未做。跟進進度見索引。

檢驗點清單分冊。欄位定義、自檢方式與全冊索引見 `../no0_index.md`。

- 域碼：C-BT
- 涵蓋：冷啟與落點解析、登入登出、換帳號、登入後初始化、帳號刪除、User 表

---

## 資料模型：User 表

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-BT-001 | User 表 `id` 對應 Auth UID | DB | T2 | P1 | `no1_data_models` | `src/database/models/User.ts` | 已登入 | — | — | 現役 |
| C-BT-002 | 登入時更新 `lastLoginAt` | DB | T2 | P2 | `no1_data_models` | `src/services/userService.ts::initializeNewUser` | 登出後重新登入 | — | — | 現役 |
| C-BT-003 | User 表兩個 IAP 欄為棄用殘欄、任何路徑恆為 Null | DB | T3 | P1 | `no1_data_models` | `src/database/schema.ts` | 已登入且已購買 | — | — | 現役 |
| C-BT-004 | User 表無 `deletedOn` 欄、不參與軟刪 | DB | T2 | P2 | `no1_data_models` | `src/database/schema.ts` | 已登入 | — | — | 現役 |

---

## 畫面：登入

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-BT-005 | 登入畫面顯示品牌標誌 | UI | T1 | P2 | `no1_login_screen` | `src/screens/Auth/LoginScreen.tsx` | 登出態 | — | — | 退場 |
| C-BT-006 | Google 與 Apple 登入按鈕並排顯示 | UI | T1 | P1 | `no1_login_screen` | `src/screens/Auth/LoginScreen.tsx` | 登出態於 iOS | — | — | 退場 |
| C-BT-007 | 登入按鈕僅含提供者圖示、無文字標籤 | UI | T1 | P2 | `no1_login_screen` | `src/screens/Auth/LoginScreen.tsx` | 登出態 | — | — | 退場 |
| C-BT-008 | Apple 登入按鈕僅 iOS 平台顯示 | UI | T3 | P1 | `no1_login_screen` | `src/screens/Auth/LoginScreen.tsx` | Android 裝置登出態 | — | — | 退場 |
| C-BT-009 | 登入載入中被點按鈕顯示載入狀態 | UI | T1 | P1 | `no1_login_screen` | `src/screens/Auth/LoginScreen.tsx` | 登出態 | — | — | 退場 |
| C-BT-010 | 登入載入中兩鈕皆不可點按 | UI | T1 | P1 | `no1_login_screen` | `src/screens/Auth/LoginScreen.tsx` | 登出態 | — | — | 退場 |
| C-BT-011 | 頁尾條款引導文字與其下兩連結相連成完整語意 | UI | T1 | P2 | `no1_login_screen` | `src/screens/Auth/LoginScreen.tsx` | 登出態 | — | — | 退場 |
| C-BT-012 | 頁尾條款引導文字不重複條款名稱 | UI | T1 | P2 | `no1_login_screen` | `src/screens/Auth/LoginScreen.tsx` | 登出態 | — | — | 退場 |
| C-BT-013 | 頁尾顯示使用條款與隱私政策兩連結 | UI | T1 | P2 | `no1_login_screen` | `src/screens/Auth/LoginScreen.tsx` | 登出態 | — | — | 退場 |
| C-BT-014 | 頁尾顯示版權文字 | UI | T1 | P2 | `no1_login_screen` | `src/screens/Auth/LoginScreen.tsx` | 登出態 | — | — | 退場 |
| C-BT-015 | 點按使用條款連結開啟外部頁面 | UI | T1 | P2 | `no1_login_screen` | `src/screens/Auth/LoginScreen.tsx` | 登出態 | — | — | 退場 |
| C-BT-016 | 點按隱私政策連結開啟外部頁面 | UI | T1 | P2 | `no1_login_screen` | `src/screens/Auth/LoginScreen.tsx` | 登出態 | — | — | 退場 |

---

## 邏輯：登入與登出

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-BT-017 | 兩登入門共用單一登入管線 | LOG | T3 | P1 | `no2_login_logout_logic` | `src/contexts/AuthContext.tsx::signIn` | 分別以兩門登入後對賬 log | — | `src/contexts/AuthContext.providerDispatch.test.tsx`（signIn('apple') 走 Apple、不碰 Google）、`src/contexts/AuthContext.providerDispatch.test.tsx`（signIn('google') 走 Google、不碰 Apple） | 退場 |
| C-BT-018 | Google 門走 Google 程序、不碰 Apple | LOG | T3 | P1 | `no2_login_logout_logic` | `src/contexts/AuthContext.tsx::signIn` | 以 Google 登入後對賬 log | — | `src/contexts/AuthContext.providerDispatch.test.tsx`（signIn('google') 走 Google、不碰 Apple） | 退場 |
| C-BT-019 | Apple 門走 Apple 面板、不碰 Google | LOG | T3 | P1 | `no2_login_logout_logic` | `src/contexts/AuthContext.tsx::signIn` | 以 Apple 登入後對賬 log | — | `src/contexts/AuthContext.providerDispatch.test.tsx`（signIn('apple') 走 Apple、不碰 Google） | 退場 |
| C-BT-020 | 兩門帳號各自獨立、不連結不合併 | DB | T3 | P0 | `no2_login_logout_logic` | `src/contexts/AuthContext.tsx::signIn` | 同一 email 分別以兩門登入過 | — | — | 退場 |
| C-BT-021 | 認證程序遭取消時顯示登入失敗提示且不續行 | UI | T1 | P1 | `no2_login_logout_logic` | `src/contexts/AuthContext.tsx::signIn` | 登出態 | — | — | 退場 |
| C-BT-022 | 連線或認證失敗時顯示登入失敗提示 | UI | T3 | P1 | `no2_login_logout_logic` | `src/contexts/AuthContext.tsx::signIn` | 斷網 | — | — | 現役 |
| C-BT-023 | Firebase Auth 驗證失敗時顯示登入失敗提示 | UI | T4 | P1 | `no2_login_logout_logic` | `src/contexts/AuthContext.tsx::signIn` | 不適用 | 憑證有效但後端拒絕的情境無法佈置 | — | 現役 |
| C-BT-024 | 登入成功後執行登入後初始化 | LOG | T2 | P1 | `no2_anonymous_bootstrap_logic` | `src/contexts/AuthContext.tsx::runPostAuth` | 登入後對賬 log | — | — | 現役 |
| C-BT-025 | 登入成功後依啟動模式導航至初始落點 | UI | T1 | P1 | `no1_login_screen` | `src/navigation/AppNavigator.tsx` | 登出態 | — | — | 退場 |
| C-BT-026 | 登入成功且付費牆攔截時導航至付費牆 | UI | T1 | P1 | `no1_login_screen` | `src/navigation/AppNavigator.tsx` | 免費帳號已佈置超額資料 | — | — | 退場 |
| C-BT-027 | 登出保留本地帳務資料、不執行清除 | DB | T2 | P0 | `no2_login_logout_logic` | `src/contexts/AuthContext.tsx::signOut` | 已有交易資料 | — | — | 退場 |
| C-BT-028 | 登出觸發 Firebase Auth 登出並清除本地憑證 | LOG | T2 | P1 | `no2_login_logout_logic` | `src/contexts/AuthContext.tsx::signOut` | 登出後對賬 log | — | — | 退場 |
| C-BT-029 | Firebase 登出失敗仍將本地登入狀態清為登出 | UI | T3 | P1 | — | `src/contexts/AuthContext.tsx::signOut` | 斷網 | — | — | 現役 |
| C-BT-030 | 重新登入同帳號時上傳本機偏好至雲端 | FB | T2 | P1 | `no2_login_logout_logic` | `src/services/userService.ts::syncUserToFirestore` | 登出後以同帳號登入 | — | `src/services/userService.test.ts`（existing doc: merges profile + current local preferences into ONE update） | 退場 |
| C-BT-031 | 重新登入同帳號時委派交易備份 | LOG | T2 | P1 | `no2_login_logout_logic` | `src/contexts/AuthContext.tsx::runPostAuth` | 登出後以同帳號登入 | — | `src/contexts/AuthContext.backupTrigger.test.tsx`（login path delegates one backup） | 退場 |
| C-BT-032 | 偵測不同帳號時明示詢問保留或清除、不自動清除 | UI | T3 | P0 | `no2_login_logout_logic` | `src/services/userService.ts::detectAccountSwitch` | 本機已有他帳號資料 | — | — | 退場 |
| C-BT-033 | 選擇清除時硬重置本機資料庫、不分 userId | DB | T3 | P0 | `no2_login_logout_logic` | `src/contexts/AuthContext.tsx::deleteUserAccount` | 換帳號並選清除 | — | — | 退場 |
| C-BT-034 | 換帳號清除採硬重置、不傳播雲端刪除標記 | DB+FB | T3 | P0 | `no2_login_logout_logic` | `src/contexts/AuthContext.tsx::deleteUserAccount` | 換帳號並選清除 | — | — | 退場 |
| C-BT-035 | 選擇清除時連帶清前一帳號授權快取 | LOG | T3 | P1 | `no2_login_logout_logic` | `src/services/premiumStatusCache.ts` | 前帳號為付費、換帳號選清除 | — | `src/contexts/AuthContext.backupTrigger.test.tsx`（clear choice wipes exactly the previous account cache） | 退場 |
| C-BT-036 | 清除前一帳號快取時不動當前帳號快取 | LOG | T3 | P1 | `no2_login_logout_logic` | `src/services/premiumStatusCache.ts` | 兩帳號皆有授權快取 | — | `src/contexts/AuthContext.backupTrigger.test.tsx`（clear choice wipes exactly the previous account cache） | 退場 |
| C-BT-037 | 選擇保留時前一帳號授權快取不動 | LOG | T3 | P1 | `no2_login_logout_logic` | `src/services/premiumStatusCache.ts` | 前帳號為付費、換帳號選保留 | — | `src/contexts/AuthContext.backupTrigger.test.tsx`（keep choice leaves the previous account cache untouched） | 退場 |
| C-BT-038 | 選擇保留時本機資料原樣續用 | DB | T3 | P0 | `no2_login_logout_logic` | `src/contexts/AuthContext.tsx::runPostAuth` | 換帳號並選保留 | — | — | 退場 |
| C-BT-039 | 清除後重建新帳號的 User 與 Settings | DB | T3 | P1 | `no2_anonymous_bootstrap_logic` | `src/services/userService.ts::initializeNewUser` | 換帳號並選清除 | — | — | 現役 |

---

## 邏輯：登入後初始化

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-BT-040 | 本機無此帳號 Users 與 Settings 時建立本機使用者資料 | DB | T3 | P1 | `no3_post_auth_logic` | `src/services/userService.ts::initializeNewUser` | 全新帳號 | — | — | 現役 |
| C-BT-041 | 雲端使用者文件不存在時建立該文件 | FB | T3 | P1 | `no3_post_auth_logic` | `src/services/userService.ts::syncUserToFirestore` | 全新帳號 | — | `src/services/userService.test.ts`（seeds the first-login Firestore doc from the actual local Settings） | 現役 |
| C-BT-042 | 雲端文件偏好取本機實際值、非寫死預設 | FB | T3 | P1 | `no3_post_auth_logic` | `src/services/userService.ts::syncUserToFirestore` | 改過偏好且雲端文件已刪 | — | `src/services/userService.test.ts`（seeds the first-login Firestore doc from the actual local Settings (currency id→code), not hardcoded values） | 現役 |
| C-BT-043 | 雲端使用者文件已存在時併入本機偏好更新 | FB | T2 | P1 | `no3_post_auth_logic` | `src/services/userService.ts::syncUserToFirestore` | 既有帳號重新登入 | — | `src/services/userService.test.ts`（merges profile + current local preferences into ONE update, no set()） | 現役 |
| C-BT-044 | 登入後不讀取套用雲端偏好 | FB | T2 | P1 | `no3_post_auth_logic` | `src/services/userService.ts::syncUserToFirestore` | 手改 Firestore 偏好後未登入 | — | — | 現役 |
| C-BT-045 | 雲端使用者文件建立不分訂閱等級、無條件執行 | FB | T2 | P1 | `no3_post_auth_logic` | `src/services/userService.ts::syncUserToFirestore` | 免費帳號全新登入 | — | — | 現役 |
| C-BT-046 | 登入不等待 IAP 服務回應 | LOG | T2 | P1 | `no3_post_auth_logic` | `src/contexts/AuthContext.tsx::runPostAuth` | 登入後對賬 log 時序 | — | — | 現役 |
| C-BT-047 | 同 uid 重新觸發不重跑冷啟工作 | LOG | T4 | P1 | — | `src/contexts/AuthContext.tsx::runPostAuth` | 不適用 | token refresh 時序無法手動控制 | `src/contexts/AuthContext.tokenRefreshGuard.test.tsx`（same-uid re-trigger (token refresh) does not re-run cold-start work） | 現役 |
| C-BT-048 | 冷啟雙發僅執行一次登入後初始化 | LOG | T4 | P1 | — | `src/contexts/AuthContext.tsx::runPostAuth` | 不適用 | 冷啟雙發時序無法手動重現 | `src/contexts/AuthContext.tokenRefreshGuard.test.tsx`（two same-uid triggers fired back-to-back (cold-start double emit) only run post-auth once） | 現役 |
| C-BT-049 | 冷啟雙發期間維持載入態、不閃登入頁 | UI | T4 | P1 | — | `src/contexts/AuthContext.tsx::runPostAuth` | 不適用 | 冷啟雙發時序無法手動重現 | `src/contexts/AuthContext.tokenRefreshGuard.test.tsx`（cold-start double emit keeps isLoading true until post-auth resolves (no retry-screen flash)） | 現役 |
| C-BT-050 | 不同 uid 觸發仍走完整登入後初始化 | LOG | T3 | P1 | — | `src/contexts/AuthContext.tsx::runPostAuth` | 換帳號登入後對賬 log | — | `src/contexts/AuthContext.tokenRefreshGuard.test.tsx`（different-uid trigger (new identity) still runs full post-auth flow） | 現役 |
| C-BT-051 | 登出後同 uid 重新登入視為真登入、重跑初始化 | LOG | T2 | P1 | — | `src/contexts/AuthContext.tsx::runPostAuth` | 登出後以同帳號登入 | — | `src/contexts/AuthContext.tokenRefreshGuard.test.tsx`（sign-out then same-uid re-emit is treated as a real new identity, not skipped） | 現役 |

---

## 畫面：帳號刪除確認

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-BT-052 | 未訂閱時說明段兩顆按鈕、無管理訂閱選項 | UI | T1 | P1 | `no16_preference_screen` | `src/screens/Settings/PreferenceScreen.tsx` | 免費帳號 | — | — | 現役 |
| C-BT-053 | 訂閱中說明段換成含扣款警語的文案 | UI | T3 | P0 | `no16_preference_screen` | `src/screens/Settings/PreferenceScreen.tsx` | 付費帳號 | — | — | 現役 |
| C-BT-054 | 訂閱中多一顆直達訂閱管理的按鈕 | UI | T3 | P1 | `no16_preference_screen` | `src/screens/Settings/PreferenceScreen.tsx` | 付費帳號 | — | — | 現役 |
| C-BT-055 | 說明段預告帳號、雲端備份與本機資料永久刪除 | UI | T1 | P0 | `no16_preference_screen` | `src/screens/Settings/PreferenceScreen.tsx` | 已登入 | — | — | 現役 |
| C-BT-056 | 說明段點取消不進最終確認、不刪除 | UI | T1 | P0 | `no16_preference_screen` | `src/screens/Settings/PreferenceScreen.tsx` | 已登入 | — | — | 現役 |
| C-BT-057 | 確認繼續後出最終確認段、確認鍵為破壞性樣式 | UI | T1 | P0 | `no16_preference_screen` | `src/screens/Settings/PreferenceScreen.tsx` | 已登入 | — | — | 現役 |
| C-BT-058 | 刪除成功時顯示完成訊息 | UI | T3 | P1 | `no16_preference_screen` | `src/screens/Settings/PreferenceScreen.tsx` | 可棄用的測試帳號 | — | — | 現役 |
| C-BT-059 | 撤銷未完成時改顯示手動撤銷引導、不報成功 | UI | T4 | P1 | `no16_preference_screen` | `src/screens/Settings/PreferenceScreen.tsx` | 不適用 | 撤銷失敗情境無法佈置 | — | 現役 |
| C-BT-060 | Apple 面板取消時靜默收場、不彈錯誤 | UI | T3 | P1 | `no16_preference_screen` | `src/screens/Settings/PreferenceScreen.tsx` | Apple 門測試帳號 | — | — | 現役 |
| C-BT-061 | 其餘失敗時顯示刪除失敗提示 | UI | T3 | P1 | `no16_preference_screen` | `src/screens/Settings/PreferenceScreen.tsx` | 斷網 | — | — | 現役 |
| C-BT-062 | 刪除進行中偏好設定該組按鈕全部不可點按 | UI | T1 | P1 | `no16_preference_screen` | `src/screens/Settings/PreferenceScreen.tsx` | 刪除流程進行中 | — | — | 現役 |
| C-BT-063 | 刪除進行中刪除帳號另顯示進度指示 | UI | T1 | P1 | `no16_preference_screen` | `src/screens/Settings/PreferenceScreen.tsx` | 刪除流程進行中 | — | — | 現役 |

---

## 邏輯：帳號刪除編排

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-BT-064 | 裝置離線時擲網路錯誤並中止、不進任何副作用 | LOG | T3 | P0 | `no24_delete_user_account_logic` | `src/contexts/AuthContext.tsx::deleteUserAccount` | 斷網 | — | `src/contexts/AuthContext.deleteUserAccount.test.tsx`（離線 fail-fast） | 現役 |
| C-BT-065 | 流程開頭設起記憶體刪除旗標 | LOG | T2 | P0 | `no24_delete_user_account_logic` | `src/services/accountDeletionState.ts::isAccountDeletionInFlight` | 觸發刪除後對賬 log | — | `src/contexts/AuthContext.deleteUserAccount.test.tsx`（成功編排） | 現役 |
| C-BT-066 | 記憶體旗標使交易備份即時跳過 | LOG | T2 | P0 | `no24_delete_user_account_logic` | `src/services/syncEngine.ts::runSync` | 刪除流程進行中觸發前景恢復 | — | — | 現役 |
| C-BT-067 | 記憶體旗標使授權補驗即時跳過 | LOG | T2 | P0 | `no24_delete_user_account_logic` | `src/contexts/PremiumContext.tsx` | 刪除流程進行中觸發前景恢復 | — | — | 現役 |
| C-BT-068 | 流程結束不論成敗一律解除記憶體旗標 | LOG | T2 | P0 | `no24_delete_user_account_logic` | `src/contexts/AuthContext.tsx::deleteUserAccount` | 刪除失敗後對賬 log | — | `src/contexts/AuthContext.deleteUserAccount.test.tsx`（記憶體旗標仍解除） | 現役 |
| C-BT-069 | 等待進行中的交易備份收斂後才往下 | LOG | T2 | P0 | `no24_delete_user_account_logic` | `src/contexts/AuthContext.tsx::deleteUserAccount` | 刪除前先觸發過備份 | — | `src/contexts/AuthContext.deleteUserAccount.test.tsx`（成功編排：記憶體旗標 → sync → 持久旗標 → callable(零參數) → 升階 done → 硬刪 → signOut → 解旗標） | 現役 |
| C-BT-070 | Apple 門以刷新模式喚起原生授權 | LOG | T3 | P0 | `no24_delete_user_account_logic` | `src/services/firebase.ts::getAppleAuthorizationCode` | Apple 門測試帳號 | — | — | 退場 |
| C-BT-071 | Apple 門取得的授權碼帶進刪除請求 | LOG | T3 | P0 | `no24_delete_user_account_logic` | `src/services/accountDeletionService.ts` | Apple 門測試帳號 | — | — | 現役 |
| C-BT-072 | Google 門不喚 Apple 面板、請求內容為空物件 | LOG | T3 | P1 | `no24_delete_user_account_logic` | `src/services/accountDeletionService.ts` | Google 門測試帳號 | — | `src/services/accountDeletionService.test.ts`（零參數呼叫：payload 恆為空物件、timeout 比後端 300s 多留餘裕） | 現役 |
| C-BT-073 | Apple 重新授權遭取消時清旗標並靜默中止 | LOG | T3 | P1 | `no24_delete_user_account_logic` | `src/contexts/AuthContext.tsx::deleteUserAccount` | Apple 門測試帳號 | — | — | 現役 |
| C-BT-074 | Apple 取碼非取消失敗時降級為不附碼續行 | LOG | T4 | P0 | `no24_delete_user_account_logic` | `src/contexts/AuthContext.tsx::deleteUserAccount` | 不適用 | 取碼失敗情境無法佈置 | — | 現役 |
| C-BT-075 | 持久旗標於委派伺服器前一刻才寫入 | LOG | T2 | P0 | `no24_delete_user_account_logic` | `src/contexts/AuthContext.tsx::deleteUserAccount` | 觸發刪除後對賬 log 順序 | — | `src/contexts/AuthContext.deleteUserAccount.test.tsx`（成功編排：記憶體旗標 → sync → 持久旗標 → callable(零參數) → 升階 done → 硬刪 → signOut → 解旗標） | 現役 |
| C-BT-076 | 委派結果不明時持久旗標維持已送出並擲錯 | LOG | T3 | P0 | `no24_delete_user_account_logic` | `src/contexts/AuthContext.tsx::deleteUserAccount` | 刪除中途斷網 | — | `src/contexts/AuthContext.deleteUserAccount.test.tsx`（callable 結果不明（網路類）：持久旗標保留給中斷復原、記憶體旗標仍解除） | 現役 |
| C-BT-077 | 結果不明類錯誤映射為網路類錯誤碼 | LOG | T3 | P1 | `no24_delete_user_account_logic` | `src/services/accountDeletionService.ts` | 刪除中途斷網 | — | `src/services/accountDeletionService.test.ts`（結果不明類（unavailable / deadline-exceeded）映射 auth/network-request-failed） | 現役 |
| C-BT-078 | 伺服器明確失敗時清持久旗標、本機零副作用 | LOG+DB | T3 | P0 | `no24_delete_user_account_logic` | `src/contexts/AuthContext.tsx::deleteUserAccount` | 伺服器回明確失敗 | — | `src/contexts/AuthContext.deleteUserAccount.test.tsx`（callable 明確失敗：本機零副作用） | 現役 |
| C-BT-079 | 伺服器明確失敗映射為刪除失敗錯誤碼 | LOG | T3 | P1 | `no24_delete_user_account_logic` | `src/services/accountDeletionService.ts` | 伺服器回明確失敗 | — | `src/services/accountDeletionService.test.ts`（伺服器明確業務失敗（failed-precondition）映射 auth/delete-account-failed） | 現役 |
| C-BT-080 | 伺服器成功後持久旗標升為已完成階段 | LOG | T3 | P0 | `no24_delete_user_account_logic` | `src/contexts/AuthContext.tsx::deleteUserAccount` | 可棄用的測試帳號 | — | `src/contexts/AuthContext.deleteUserAccount.test.tsx`（成功編排） | 現役 |
| C-BT-081 | 本機硬刪成功後清除最後登入帳號紀錄 | DB | T3 | P1 | `no24_delete_user_account_logic` | `src/contexts/AuthContext.tsx::deleteUserAccount` | 可棄用的測試帳號 | — | `src/contexts/AuthContext.deleteUserAccount.test.tsx`（成功編排） | 現役 |
| C-BT-082 | 本機硬刪失敗時保留旗標與最後登入紀錄、仍登出 | LOG+DB | T4 | P1 | `no24_delete_user_account_logic` | `src/contexts/AuthContext.tsx::deleteUserAccount` | 不適用 | 本機刪除失敗無手動入口 | `src/contexts/AuthContext.deleteUserAccount.test.tsx`（本機硬刪失敗：持久旗標保留、記憶體旗標仍解除、仍 signOut 收尾） | 現役 |
| C-BT-083 | 刪除完成後清除該帳號的本地授權快取 | LOG | T3 | P1 | `no24_delete_user_account_logic` | `src/services/premiumStatusCache.ts` | 可棄用的付費測試帳號 | — | — | 退場 |
| C-BT-084 | 刪除完成後觸發登出並回到登入畫面 | UI | T3 | P1 | `no24_delete_user_account_logic` | `src/contexts/AuthContext.tsx::deleteUserAccount` | 可棄用的測試帳號 | — | — | 現役 |
| C-BT-085 | 刪除逾時設定比後端上限多留餘裕 | LOG | T4 | P1 | — | `src/services/accountDeletionService.ts` | 不適用 | 逾時情境無法手動佈置 | `src/services/accountDeletionService.test.ts`（timeout 比後端 300s 多留餘裕） | 現役 |
| C-BT-086 | 撤銷未完成旗標缺欄或非布林時收斂為 false | LOG | T4 | P2 | — | `src/services/accountDeletionService.ts` | 不適用 | 異常回應無手動入口 | `src/services/accountDeletionService.test.ts`（appleRevokeFailed 缺欄或非 boolean 收斂為 false） | 現役 |

---

## 邏輯：本機硬刪與中斷復原

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-BT-087 | 硬刪依綱要推導帶帳號欄位的資料表清單 | DB | T3 | P0 | `no24_delete_user_account_logic` | `src/services/localDbService.ts::destroyUserData` | 可棄用的測試帳號且各表皆有資料 | — | `src/services/localDbService.destroyUserData.test.ts`（凡帶 user_id 欄的表全數納入、users 表不在內） | 現役 |
| C-BT-088 | 使用者資料表無帳號欄位、以識別碼取那一列 | DB | T3 | P1 | `no24_delete_user_account_logic` | `src/services/localDbService.ts::destroyUserData` | 可棄用的測試帳號 | — | `src/services/localDbService.destroyUserData.test.ts`（users 表以 id=uid 找到那列一併硬刪） | 現役 |
| C-BT-089 | 硬刪全部命中列收進單一批次寫入 | DB | T4 | P0 | `no24_delete_user_account_logic` | `src/services/localDbService.ts::destroyUserData` | 不適用 | 需觀察交易邊界、無畫面判準 | `src/services/localDbService.destroyUserData.test.ts`（全部刪除收進單一批次寫入） | 現役 |
| C-BT-090 | 硬刪不逐筆標記刪除、不傳播雲端刪除標記 | DB+FB | T3 | P0 | `no24_delete_user_account_logic` | `src/services/localDbService.ts::destroyUserData` | 可棄用的測試帳號 | — | — | 現役 |
| C-BT-091 | 硬刪保留裝置上其他帳號的資料列 | DB | T3 | P0 | `no24_delete_user_account_logic` | `src/services/localDbService.ts::destroyUserData` | 雙帳號各有資料 | — | `src/services/localDbService.destroyUserData.test.ts`（只硬刪目標 uid 的列，他帳號的列一列不動） | 現役 |
| C-BT-092 | 使用者列已不存在時重跑硬刪不擲錯 | DB | T2 | P1 | `no24_delete_user_account_logic` | `src/services/localDbService.ts::destroyUserData` | 刪除中斷後補跑收尾 | — | `src/services/localDbService.destroyUserData.test.ts`（users 列不存在（重跑收尾）不擲錯、其餘照刪——冪等） | 現役 |
| C-BT-093 | 旗標相符且憑證刷新回報帳號不存在時補跑收尾並登出 | LOG | T4 | P0 | `no24_delete_user_account_logic` | `src/contexts/AuthContext.tsx::runPostAuth` | 不適用 | 中斷時序無法手動構造 | `src/contexts/AuthContext.deletionRecovery.test.tsx`（旗標相符 + 刷新 user-not-found（帳號已刪）：先升 done 再補收尾 + signOut、跳過 runPostAuth；null 事件重生） | 現役 |
| C-BT-094 | 補跑收尾時跳過登入後初始化、不重建雲端文件 | LOG | T4 | P0 | `no24_delete_user_account_logic` | `src/contexts/AuthContext.tsx::runPostAuth` | 不適用 | 中斷時序無法手動構造 | `src/contexts/AuthContext.deletionRecovery.test.tsx`（跳過 runPostAuth） | 現役 |
| C-BT-095 | 憑證刷新成功時清旗標並走正常流程 | LOG | T4 | P0 | `no24_delete_user_account_logic` | `src/contexts/AuthContext.tsx::runPostAuth` | 不適用 | 中斷時序無法手動構造 | `src/contexts/AuthContext.deletionRecovery.test.tsx`（旗標相符 + 刷新成功（帳號仍在）：清旗標、照走 runPostAuth） | 現役 |
| C-BT-096 | 刷新以其他原因失敗時保留旗標並跳過本輪 | LOG | T4 | P0 | `no24_delete_user_account_logic` | `src/contexts/AuthContext.tsx::runPostAuth` | 不適用 | 中斷時序無法手動構造 | `src/contexts/AuthContext.deletionRecovery.test.tsx`（網路無法判定：不清旗標、不硬刪） | 現役 |
| C-BT-097 | 每次啟動至多提示一次需要網路完成刪除 | UI | T4 | P1 | `no24_delete_user_account_logic` | `src/contexts/AuthContext.tsx::runPostAuth` | 不適用 | 中斷時序無法手動構造 | — | 現役 |
| C-BT-098 | 登出態且旗標為已完成時直接補跑本機收尾 | LOG | T4 | P0 | `no24_delete_user_account_logic` | `src/contexts/AuthContext.tsx::runPostAuth` | 不適用 | 中斷時序無法手動構造 | `src/contexts/AuthContext.deletionRecovery.test.tsx`（登出態 + done 旗標：補跑本機收尾） | 現役 |
| C-BT-099 | 登出態且旗標為已送出時絕不補刪本機資料 | LOG+DB | T4 | P0 | `no24_delete_user_account_logic` | `src/contexts/AuthContext.tsx::runPostAuth` | 不適用 | 中斷時序無法手動構造 | `src/contexts/AuthContext.deletionRecovery.test.tsx`（登出態 + sent 旗標：絕不補刪） | 現役 |
| C-BT-100 | 旗標與登入帳號不符時不動旗標、照走正常流程 | LOG | T4 | P1 | `no24_delete_user_account_logic` | `src/contexts/AuthContext.tsx::runPostAuth` | 不適用 | 中斷時序無法手動構造 | `src/contexts/AuthContext.deletionRecovery.test.tsx`（旗標與登入 uid 不符） | 現役 |

---

## 邏輯：冷啟與落點解析

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-BT-101 | 啟動時讀取本地快取的登入狀態 | LOG | T2 | P1 | `no1_app_bootstrap_logic` | `src/contexts/AuthContext.tsx` | 冷啟後對賬 log | — | — | 現役 |
| C-BT-102 | 啟動時未登入導航至登入畫面 | UI | T1 | P1 | `no1_app_bootstrap_logic` | `src/navigation/AppNavigator.tsx` | 登出態 | — | — | 現役 |
| C-BT-103 | 啟動時已登入依啟動模式導航至初始落點 | UI | T1 | P1 | `no1_app_bootstrap_logic` | `src/navigation/AppNavigator.tsx` | 已登入 | — | — | 現役 |
| C-BT-104 | 啟動模式為首頁時落點首頁且不攔截 | UI | T1 | P1 | `no1_app_bootstrap_logic` | `src/navigation/AppNavigator.tsx` | 啟動模式設為首頁 | — | — | 現役 |
| C-BT-105 | 啟動模式為支出且放行時落點支出編輯器 | UI | T1 | P1 | `no1_app_bootstrap_logic` | `src/navigation/AppNavigator.tsx` | 啟動模式設為支出 | — | — | 現役 |
| C-BT-106 | 啟動模式為收入且放行時落點收入編輯器 | UI | T1 | P1 | `no1_app_bootstrap_logic` | `src/navigation/AppNavigator.tsx` | 啟動模式設為收入 | — | — | 現役 |
| C-BT-107 | 啟動模式為轉帳且放行時落點轉帳編輯器 | UI | T1 | P1 | `no1_app_bootstrap_logic` | `src/navigation/AppNavigator.tsx` | 啟動模式設為轉帳 | — | — | 現役 |
| C-BT-108 | 啟動模式指向編輯器且閘控禁止時改落首頁並攔截 | UI | T1 | P1 | `no1_app_bootstrap_logic` | `src/navigation/AppNavigator.tsx` | 免費帳號已佈置超額資料且啟動模式設為支出 | — | — | 現役 |
| C-BT-109 | 啟動判定攔截時先落初始落點再導向付費牆 | UI | T1 | P1 | `no1_app_bootstrap_logic` | `src/navigation/AppNavigator.tsx` | 免費帳號已佈置超額資料 | — | — | 現役 |
| C-BT-110 | 訂閱受限僅攔截當次啟動、不改寫啟動模式設定值 | DB | T2 | P2 | `no1_app_bootstrap_logic` | `src/navigation/AppNavigator.tsx` | 免費帳號已佈置超額資料且啟動模式非首頁 | — | — | 現役 |
| C-BT-111 | 啟動等待訂閱狀態就緒後才解析落點 | LOG | T4 | P1 | `no1_app_bootstrap_logic` | `src/navigation/AppNavigator.tsx` | 不適用 | 就緒時序無法手動控制 | — | 現役 |

---

## 邏輯：核心背景任務

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-BT-112 | 啟動時已登入先執行核心背景任務 | LOG | T2 | P1 | `no1_app_bootstrap_logic` | `src/contexts/AuthContext.tsx::runPostAuth` | 冷啟後對賬 QA BOOT delegate | — | — | 現役 |
| C-BT-113 | 核心背景任務非同步執行、不阻塞啟動主流程 | LOG | T4 | P2 | `no1_app_bootstrap_logic` | `src/contexts/AuthContext.tsx::runPostAuth` | 不適用 | 阻塞與否無外顯判準 | `src/contexts/AuthContext.backupNonBlocking.test.tsx`（R-BS-004: bootstrap settles even when the delegated backup never settles） | 現役 |
| C-BT-114 | 啟動核心背景任務委派交易備份 | LOG | T2 | P1 | `no1_app_bootstrap_logic` | `src/contexts/AuthContext.tsx::runPostAuth` | 冷啟後對賬 QA BOOT delegate | — | — | 現役 |
| C-BT-115 | 啟動時不重複判斷備份冷卻、閘控由備份自管 | LOG | T2 | P2 | `no1_app_bootstrap_logic` | `src/services/syncEngine.ts::runSync` | 連續兩次冷啟後對賬 QA BACKUP skip | — | — | 現役 |
| C-BT-116 | 雲端授權文件不存在時向 IAP 服務補查憑證 | 實機+LOG | T3 | P1 | `no6_premium_logic` | `src/contexts/PremiumContext.tsx` | 實機且雲端無授權文件 | — | — | 現役 |
| C-BT-117 | 啟動時圖示引用查無定義的帳戶自癒為首個帳戶圖示 | DB | T3 | P1 | `no1_app_bootstrap_logic` | `src/services/cleanupInvalidIconIds.ts::cleanupInvalidIconIds` | sqlite 注入不存在的圖示 id | — | `src/services/cleanupInvalidIconIds.test.ts`（resets invalid account iconIds to the first pool icon and stamps the update） | 現役 |
| C-BT-118 | 啟動時圖示自癒涵蓋已軟刪除的帳戶與類別 | DB | T2 | P2 | `no1_app_bootstrap_logic` | `src/services/cleanupInvalidIconIds.ts::cleanupInvalidIconIds` | 對已軟刪列注入壞圖示 id | — | — | 現役 |
| C-BT-119 | 圖示顯示清單為空時改用內建後備圖示 | DB | T4 | P2 | `no1_app_bootstrap_logic` | `src/services/cleanupInvalidIconIds.ts::cleanupInvalidIconIds` | 不適用 | 圖示池為空無法佈置 | — | 現役 |
| C-BT-120 | 圖示引用全數有效時不執行任何寫入 | DB | T2 | P2 | `no1_app_bootstrap_logic` | `src/services/cleanupInvalidIconIds.ts::cleanupInvalidIconIds` | 已登入且圖示引用皆有效 | — | `src/services/cleanupInvalidIconIds.test.ts`（no-ops without a write when every row is valid） | 現役 |
| C-BT-121 | 前景恢復且已登入時委派交易備份 | LOG | T2 | P1 | `no1_app_bootstrap_logic` | `src/contexts/PremiumContext.tsx` | 切背景再回前景後對賬 QA BOOT delegate | — | — | 現役 |
| C-BT-122 | 前景恢復觸發訂閱狀態重新刷新 | LOG | T2 | P2 | `no1_app_bootstrap_logic` | `src/contexts/PremiumContext.tsx` | 切背景再回前景後對賬 QA PREMIUM reconcile | — | — | 現役 |
