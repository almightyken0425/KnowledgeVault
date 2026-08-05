# 檢驗點：訂閱與配額

> **機械跟進已完成，語意跟進未完成。** 111 條中 11 條已退場。現役 100 條裡仍有 62 條寫著帳號語彙，相關斷言待改寫。訂閱真相已移至 StoreKit、隨 Apple ID 走。跟進進度見索引。

檢驗點清單分冊。欄位定義、自檢方式與全冊索引見 `../no0_index.md`。

- 域碼：C-SB
- 涵蓋：付費牆呈現與購買恢復、授權解析與離線快取、補寫與購買驗證、訂閱閘控、雲端寫入配額

---

## 資料模型：執行期訂閱狀態

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-SB-001 | 執行期訂閱等級值域僅 LEVEL_0 至 LEVEL_2 | LOG | T4 | P2 | `no1_data_models` | `src/constants/entitlements.ts::PlanTier` | 不適用 | 值域為負向不變式、無法窮舉觸發 | — | 現役 |
| C-SB-002 | 訂閱就緒標記初值為否、首次解析前不判定授權 | LOG | T2 | P1 | `no1_data_models` | `src/contexts/PremiumContext.tsx` | 冷啟後對賬 QA PREMIUM loaded | — | — | 現役 |
| C-SB-003 | 線上更新或離線回退任一完成後訂閱就緒標記轉為是 | LOG | T2 | P1 | `no1_data_models` | `src/contexts/PremiumContext.tsx` | 冷啟後對賬 QA PREMIUM loaded | — | — | 現役 |
| C-SB-004 | 登出後訂閱就緒標記維持為是、不再等待解析 | LOG | T2 | P2 | `no1_data_models` | `src/contexts/PremiumContext.tsx` | 登出後對賬 QA PREMIUM loaded afterLogout=true | — | — | 現役 |
| C-SB-005 | 登出時當前訂閱等級即時降為 LEVEL_0 | LOG | T3 | P1 | `no6_premium_logic` | `src/contexts/PremiumContext.tsx` | 付費帳號登入後登出 | — | — | 現役 |

---

## 資料模型：離線授權快取

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-SB-006 | 本地授權快取以帳號為範圍、他帳號讀不到 | LOG | T3 | P1 | `no1_data_models` | `src/services/premiumStatusCache.ts` | 兩帳號輪流登入後對賬 QA PREMIUM cacheRead | — | `src/services/premiumStatusCache.test.ts`（does NOT leak one account cache to another） | 退場 |
| C-SB-007 | 快取無到期日時視為無期限、維持快取等級 | LOG | T4 | P2 | `no1_data_models` | `src/constants/limits.ts::checkIsPremium` | 不適用 | 現有商品皆帶到期日、無 Null 案例可佈置 | `src/constants/limits.test.ts`（treats null expiry as unlimited (Lifetime)） | 現役 |
| C-SB-008 | 快取到期日早於或等於當下時視為失效 | LOG | T3 | P1 | `no1_data_models` | `src/constants/limits.ts::checkIsPremium` | 付費帳號離線且系統時鐘已越過到期日 | — | `src/constants/limits.test.ts`（is not premium once now reaches or passes expiry） | 現役 |
| C-SB-009 | 快取到期日晚於當下時維持付費等級 | LOG | T3 | P1 | `no1_data_models` | `src/constants/limits.ts::checkIsPremium` | 付費帳號離線後對賬 QA PREMIUM resolve | — | `src/constants/limits.test.ts`（is premium while now is before expiry） | 現役 |
| C-SB-010 | 快取等級欄非數字時整筆視為無快取 | LOG | T4 | P2 | — | `src/services/premiumStatusCache.ts::loadPremiumCache` | 不適用 | 需手改本機儲存層、無 App 內入口 | — | 退場 |
| C-SB-011 | 不採用無帳號範圍的舊版裝置層快取 | LOG | T4 | P2 | — | `src/services/premiumStatusCache.ts::loadPremiumCache` | 不適用 | 需手改本機儲存層、無 App 內入口 | `src/services/premiumStatusCache.test.ts`（load reads only the account-scoped key, never a bare device-level key） | 退場 |
| C-SB-012 | 帳號識別碼為空時快取不讀不寫 | LOG | T4 | P2 | — | `src/services/premiumStatusCache.ts` | 不適用 | 空識別碼路徑無手動入口 | `src/services/premiumStatusCache.test.ts`（no-ops on empty uid (no read, no write)） | 退場 |

---

## 畫面：付費牆呈現

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-SB-013 | 付費牆以全螢幕 Modal 呈現 | UI | T1 | P2 | `no26_paywall_screen` | `src/navigation/AppNavigator.tsx` | 免費帳號 | — | — | 現役 |
| C-SB-014 | 付費牆單頁滿版呈現 | UI | T1 | P2 | `no26_paywall_screen` | `src/screens/Paywall/PaywallScreen.tsx` | 免費帳號 | — | — | 現役 |
| C-SB-015 | 付費牆內容高度超出可視高度時整頁可垂直捲動 | UI | T3 | P1 | `no26_paywall_screen` | `src/screens/Paywall/PaywallScreen.tsx` | 免費帳號且系統字級放到最大 | — | — | 現役 |
| C-SB-016 | 付費牆捲動時各區塊維持完整可及、不裁切 | UI | T3 | P1 | `no26_paywall_screen` | `src/screens/Paywall/PaywallScreen.tsx` | 免費帳號且系統字級放到最大，對賬 QA PAYWALL overflow | — | — | 現役 |
| C-SB-017 | 功能列表各條目置中對齊 | UI | T1 | P2 | `no26_paywall_screen` | `src/screens/Paywall/PaywallScreen.tsx` | 免費帳號 | — | — | 現役 |
| C-SB-018 | 功能列表呈現帳戶與類別無上限能力 | UI | T1 | P1 | `no26_paywall_screen` | `src/screens/Paywall/PaywallScreen.tsx` | 免費帳號 | — | — | 現役 |
| C-SB-019 | 功能文案不寫死上限數值、由常數插值 | UI | T4 | P2 | — | `src/screens/Paywall/PaywallScreen.tsx` | 不適用 | 需比對原始碼、無畫面判準 | `src/screens/Paywall/paywallPricing.test.ts`（does not bake the literal cap value into the copy） | 現役 |
| C-SB-020 | 方案載入中顯示載入狀態 | UI | T1 | P1 | `no26_paywall_screen` | `src/screens/Paywall/PaywallScreen.tsx::loadProducts` | 免費帳號且方案尚未載入完成 | — | — | 現役 |
| C-SB-021 | 預設選取年度方案 | UI | T1 | P1 | `no26_paywall_screen` | `src/screens/Paywall/PaywallScreen.tsx::loadProducts` | 免費帳號 | — | — | 現役 |
| C-SB-022 | 年度方案顯示動態年度價格 | UI | T1 | P1 | `no26_paywall_screen` | `src/screens/Paywall/PaywallScreen.tsx` | 免費帳號且已選取年費方案 | — | — | 現役 |
| C-SB-023 | 年度方案顯示優惠標示 | UI | T1 | P2 | `no26_paywall_screen` | `src/screens/Paywall/PaywallScreen.tsx` | 免費帳號 | — | — | 現役 |
| C-SB-024 | 月度方案顯示動態月度價格 | UI | T1 | P1 | `no26_paywall_screen` | `src/screens/Paywall/PaywallScreen.tsx` | 免費帳號且已選取月費方案 | — | — | 現役 |
| C-SB-025 | 商店查無該方案時該方案分段不渲染 | 實機+UI | T3 | P2 | — | `src/screens/Paywall/PaywallScreen.tsx::renderSegment` | 商店設定只留一個有效方案 | — | — | 現役 |
| C-SB-026 | 年費攤月價以年價除以 12 計算 | UI | T1 | P1 | — | `src/screens/Paywall/paywallPricing.ts::perMonthEquivalent` | 免費帳號且已選取年費方案 | — | `src/screens/Paywall/paywallPricing.test.ts`（divides a yearly amount across 12 months） | 現役 |
| C-SB-027 | 整數價格顯示 0 位小數、非整數顯示幣別小數位 | UI | T1 | P2 | — | `src/screens/Paywall/paywallPricing.ts::displayDecimals` | 免費帳號 | — | `src/screens/Paywall/paywallPricing.test.ts`（shows whole numbers as 0 decimals and sub-unit amounts with the currency fraction） | 現役 |
| C-SB-028 | 零小數幣別不生出多餘小數位 | 實機+UI | T3 | P2 | — | `src/screens/Paywall/paywallPricing.ts::displayDecimals` | 商店帳號設在日圓或韓圜地區 | — | `src/screens/Paywall/paywallPricing.test.ts`（never sprouts spurious decimals on a zero-decimal currency (JPY/KRW)） | 現役 |
| C-SB-029 | 幣別代碼無法解析時小數位退回兩位 | UI | T4 | P2 | — | `src/screens/Paywall/paywallPricing.ts::currencyFractionDigits` | 不適用 | 無法解析的幣別代碼無手動入口 | `src/screens/Paywall/paywallPricing.test.ts`（reads minor-unit digits from Intl currency data） | 現役 |
| C-SB-030 | 訂閱按鈕於未選方案時不可點按 | 實機+UI | T3 | P1 | `no26_paywall_screen` | `src/screens/Paywall/PaywallScreen.tsx` | 商店查無任何有效方案 | — | — | 現役 |
| C-SB-031 | 訂閱按鈕於購買處理中時不可點按 | 實機+UI | T3 | P1 | `no26_paywall_screen` | `src/screens/Paywall/PaywallScreen.tsx` | 購買處理中 | — | — | 現役 |
| C-SB-032 | 訂閱按鈕處理中顯示載入狀態 | 實機+UI | T3 | P1 | `no26_paywall_screen` | `src/screens/Paywall/PaywallScreen.tsx` | 購買處理中 | — | — | 現役 |
| C-SB-033 | 自動續訂揭露區含週期與每期價格說明 | UI | T1 | P1 | `no26_paywall_screen` | `src/screens/Paywall/PaywallScreen.tsx` | 免費帳號 | — | — | 現役 |
| C-SB-034 | 揭露區載明到期前自動續訂可隨時取消 | UI | T1 | P1 | `no26_paywall_screen` | `src/screens/Paywall/PaywallScreen.tsx` | 免費帳號 | — | — | 現役 |
| C-SB-035 | 揭露區載明款項向 Apple ID 帳戶收取 | UI | T1 | P1 | `no26_paywall_screen` | `src/screens/Paywall/PaywallScreen.tsx` | 免費帳號 | — | — | 現役 |
| C-SB-036 | 未選到方案時揭露區整塊不顯示 | 實機+UI | T3 | P2 | — | `src/screens/Paywall/PaywallScreen.tsx` | 商店查無任何有效方案 | — | — | 現役 |
| C-SB-037 | 頁尾含恢復購買、使用條款、隱私政策三連結 | UI | T1 | P2 | `no26_paywall_screen` | `src/screens/Paywall/PaywallScreen.tsx` | 免費帳號 | — | — | 現役 |
| C-SB-038 | 付費牆點按使用條款連結開啟外部頁面 | UI | T1 | P2 | `no26_paywall_screen` | `src/screens/Paywall/PaywallScreen.tsx` | 免費帳號 | — | — | 現役 |
| C-SB-039 | 付費牆點按隱私政策連結開啟外部頁面 | UI | T1 | P2 | `no26_paywall_screen` | `src/screens/Paywall/PaywallScreen.tsx` | 免費帳號 | — | — | 現役 |

---

## 畫面：購買與恢復互動

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-SB-040 | 付費牆點按關閉按鈕關閉 Modal | UI | T1 | P1 | `no26_paywall_screen` | `src/navigation/AppNavigator.tsx` | 免費帳號 | — | — | 現役 |
| C-SB-041 | 點按訂閱方案切換選取該方案 | UI | T1 | P1 | `no26_paywall_screen` | `src/screens/Paywall/PaywallScreen.tsx::renderSegment` | 免費帳號 | — | — | 現役 |
| C-SB-042 | 點按訂閱按鈕向平台發起選定方案的購買 | 實機+LOG | T3 | P1 | `no26_paywall_screen` | `src/screens/Paywall/PaywallScreen.tsx::handlePurchase` | 實機 sandbox 免費帳號 | — | — | 現役 |
| C-SB-043 | 購買後授權等級升過發起當下的基準才關閉付費牆 | 實機+UI | T3 | P1 | `no26_paywall_screen` | `src/screens/Paywall/PaywallScreen.tsx` | 實機 sandbox 免費帳號完成一次購買 | — | — | 現役 |
| C-SB-044 | 已達付費者再次發起購買不因既有等級誤判成功 | UI | T4 | P1 | — | `src/screens/Paywall/PaywallScreen.tsx` | 不適用 | 付費帳號無付費牆入口、重複購買無法佈置 | — | 現役 |
| C-SB-045 | 購買失敗且非使用者取消時顯示購買失敗對話框 | 實機+UI | T3 | P1 | `no26_paywall_screen` | `src/screens/Paywall/PaywallScreen.tsx` | 實機 sandbox 且商店設定為購買失敗 | — | — | 現役 |
| C-SB-046 | 使用者取消購買時不顯示失敗對話框 | 實機+UI | T3 | P1 | `no26_paywall_screen` | `src/screens/Paywall/PaywallScreen.tsx` | 實機 sandbox 免費帳號 | — | — | 現役 |
| C-SB-047 | 非本頁發起的平台購買錯誤不彈對話框 | UI | T4 | P1 | — | `src/screens/Paywall/PaywallScreen.tsx` | 不適用 | 閒置時平台重投舊失敗交易無法佈置 | — | 現役 |
| C-SB-048 | 購買逾九十秒仍未升級時解除載入狀態並顯示購買失敗對話框 | UI | T4 | P1 | — | `src/screens/Paywall/PaywallScreen.tsx` | 不適用 | 購買成立而後端驗證失敗的情境無法佈置 | — | 現役 |
| C-SB-049 | 點按恢復購買查詢可還原購買並送後端驗證 | 實機+LOG | T3 | P1 | `no26_paywall_screen` | `src/screens/Paywall/PaywallScreen.tsx::handleRestore` | 已購買帳號於重裝後的裝置 | — | — | 現役 |
| C-SB-050 | 恢復購買查到購買且當前帳號達付費時顯示恢復成功對話框 | 實機+UI | T3 | P1 | `no26_paywall_screen` | `src/screens/Paywall/PaywallScreen.tsx` | 已購買帳號於重裝後的裝置 | — | — | 現役 |
| C-SB-051 | 恢復購買查無可還原購買時顯示無可還原提示 | 實機+UI | T3 | P1 | `no26_paywall_screen` | `src/screens/Paywall/PaywallScreen.tsx::handleRestore` | 未購買的實機 sandbox 帳號 | — | — | 現役 |
| C-SB-052 | 查到購買但當前帳號逾十秒未達付費時顯示無可還原提示 | 實機+UI | T3 | P1 | `no26_paywall_screen` | `src/screens/Paywall/PaywallScreen.tsx` | 購買歸屬他帳號、當前登入另一帳號 | — | — | 現役 |
| C-SB-053 | 恢復購買操作失敗時顯示恢復失敗對話框 | 實機+UI | T3 | P1 | `no26_paywall_screen` | `src/screens/Paywall/PaywallScreen.tsx::handleRestore` | 實機 sandbox 帳號且斷網 | — | — | 現役 |
| C-SB-054 | 操作處理中再點恢復購買不發起第二次 | 實機+UI | T3 | P1 | — | `src/screens/Paywall/PaywallScreen.tsx::handleRestore` | 購買處理中 | — | — | 現役 |

---

## 邏輯：授權解析

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-SB-055 | 登入後訂閱後端授權記錄、即時更新本機訂閱等級 | LOG | T3 | P1 | `no6_premium_logic` | `src/services/entitlementService.ts::subscribeEntitlement` | 付費帳號登入後對賬 QA PREMIUM entitlement | — | — | 現役 |
| C-SB-056 | 有授權記錄時寫入當前帳號的本地授權快取 | LOG | T3 | P1 | `no6_premium_logic` | `src/contexts/PremiumContext.tsx` | 付費帳號登入後對賬 QA PREMIUM cacheWrite | — | — | 現役 |
| C-SB-057 | 無授權記錄或連線失敗時以本地快取推定等級、不直接降為 LEVEL_0 | LOG | T3 | P1 | `no6_premium_logic` | `src/contexts/PremiumContext.tsx` | 付費帳號斷網後重啟並對賬 QA PREMIUM resolve | — | — | 現役 |
| C-SB-058 | 授權解析讀寫快取皆帶當前帳號 | LOG | T3 | P1 | `no6_premium_logic` | `src/contexts/PremiumContext.tsx` | 兩帳號輪流登入後對賬 QA PREMIUM cacheRead | — | — | 現役 |
| C-SB-059 | 無本地授權快取時推定為 LEVEL_0 | LOG | T3 | P1 | `no6_premium_logic` | `src/services/premiumStatusCache.ts::resolveTierFromCache` | 清除本機快取後斷網重啟 | — | `src/services/premiumStatusCache.test.ts`（drops to LEVEL_0 when there is no cache） | 退場 |
| C-SB-060 | 無授權記錄而非連線失敗時觸發補寫 | LOG | T3 | P1 | `no6_premium_logic` | `src/contexts/PremiumContext.tsx::reconcile` | 刪除後端授權記錄後重啟並對賬 QA PREMIUM reconcile | — | — | 現役 |
| C-SB-061 | 授權來自後端即時回報時直接採其等級、不自行以到期日推翻 | LOG | T3 | P1 | `no6_premium_logic` | `src/services/entitlementTier.ts::resolveEntitlementTier` | 付費帳號連網登入後對賬 QA PREMIUM resolve | — | `src/services/entitlementTier.test.ts`（線上快照採信後端 tier，即使到期日已過（後端權威、寬限期）） | 退場 |
| C-SB-062 | 後端回報降級的授權記錄時照實降為 LEVEL_0 | LOG | T3 | P1 | `no6_premium_logic` | `src/services/entitlementTier.ts::resolveEntitlementTier` | 退款生效後重啟 | — | `src/services/entitlementTier.test.ts`（線上快照的降級文件照實回 LEVEL_0） | 退場 |
| C-SB-063 | 授權來自離線副本且到期日早於或等於當下時降為 LEVEL_0 | LOG | T3 | P1 | `no6_premium_logic` | `src/services/entitlementTier.ts::resolveEntitlementTier` | 付費帳號斷網且系統時鐘已越過到期日 | — | `src/services/entitlementTier.test.ts`（離線副本已過期降 LEVEL_0（FINDING-13 核心：不再無限期）） | 退場 |
| C-SB-064 | 授權來自離線副本且未過期時採其等級 | LOG | T3 | P1 | `no6_premium_logic` | `src/services/entitlementTier.ts::resolveEntitlementTier` | 付費帳號斷網重啟 | — | `src/services/entitlementTier.test.ts`（離線副本未過期維持付費 tier） | 退場 |
| C-SB-065 | 離線授權副本無到期日時視為無期限、維持付費等級 | LOG | T4 | P2 | `no6_premium_logic` | `src/services/entitlementTier.ts::resolveEntitlementTier` | 不適用 | 現有商品皆帶到期日、無 Null 案例可佈置 | `src/services/entitlementTier.test.ts`（離線副本無到期日視為無期限，維持付費（R-OF-008）） | 退場 |
| C-SB-066 | 授權記錄欄位型別不符時收斂為 LEVEL_0 與無到期日 | LOG | T4 | P2 | — | `src/services/entitlementService.ts::subscribeEntitlement` | 不適用 | 需手改後端授權文件型別、無 App 內入口 | — | 退場 |
| C-SB-067 | 登出時解除後端授權記錄訂閱 | LOG | T4 | P1 | `no6_premium_logic` | `src/contexts/PremiumContext.tsx` | 不適用 | 解除訂閱無 log 埋點、需讀原始碼 | — | 現役 |
| C-SB-068 | 清理後遲到的無授權回呼不寫入快取 | LOG | T4 | P1 | — | `src/contexts/PremiumContext.tsx` | 不適用 | 回呼時序無法手動控制 | — | 現役 |
| C-SB-069 | 清理後遲到的帶授權回呼不寫入快取 | LOG | T4 | P1 | — | `src/contexts/PremiumContext.tsx` | 不適用 | 回呼時序無法手動控制 | — | 現役 |

---

## 邏輯：補寫與購買驗證

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-SB-070 | 帳號刪除進行中時補寫直接返回、不重寫授權 | LOG | T2 | P0 | `no6_premium_logic` | `src/contexts/PremiumContext.tsx::reconcile` | 刪除流程進行中觸發前景恢復，對賬 QA PREMIUM reconcile | — | — | 現役 |
| C-SB-071 | 帳號刪除進行中時購買更新回呼直接返回、不送驗證 | LOG | T4 | P0 | `no6_premium_logic` | `src/contexts/PremiumContext.tsx` | 不適用 | 刪除流程中回補延遲交易的時序無法佈置 | — | 現役 |
| C-SB-072 | 補寫只挑 LEVEL_1 方案的購買逐筆送驗 | 實機+LOG | T3 | P1 | `no6_premium_logic` | `src/contexts/PremiumContext.tsx::reconcile` | 實機已持有訂閱，對賬 QA PREMIUM reconcile | — | — | 現役 |
| C-SB-073 | 補寫查詢失敗時不更新等級、由快取維持 | 實機+LOG | T3 | P1 | `no6_premium_logic` | `src/contexts/PremiumContext.tsx::reconcile` | 付費帳號斷網後觸發前景恢復 | — | — | 現役 |
| C-SB-074 | 購買憑證送後端驗證、本機不自行推定等級 | 實機+LOG | T3 | P0 | `no6_premium_logic` | `src/services/entitlementService.ts::verifyTransaction` | 實機 sandbox 完成一次購買 | — | — | 現役 |
| C-SB-075 | 待處理購買不送驗證也不向平台確認交易 | LOG | T4 | P1 | `no6_premium_logic` | `src/services/iapService.ts::handlePurchaseUpdate` | 不適用 | 家長核准的延遲購買無法佈置 | `src/services/iapService.finishTransaction.guard.test.ts`（neither grants nor finishes a pending (deferred) purchase） | 現役 |
| C-SB-076 | 每筆已完成購買都向平台確認交易、與是否帶交易識別碼無關 | 實機+LOG | T3 | P1 | `no6_premium_logic` | `src/services/iapService.ts::handlePurchaseUpdate` | 實機 sandbox 完成一次購買 | — | `src/services/iapService.finishTransaction.guard.test.ts`（finishes a completed purchase even when transactionId is missing） | 現役 |
| C-SB-077 | 確認交易擲錯時仍通知授權更新、不阻斷送驗 | LOG | T4 | P1 | `no6_premium_logic` | `src/services/iapService.ts::handlePurchaseUpdate` | 不適用 | 確認交易失敗無手動觸發入口 | `src/services/iapService.finishTransaction.guard.test.ts`（still notifies entitlement when finishTransaction throws） | 現役 |
| C-SB-078 | 恢復購買查到的每筆購買皆通知授權更新 | 實機+LOG | T3 | P2 | — | `src/services/iapService.ts::restorePurchases` | 已購買帳號於重裝後的裝置 | — | — | 現役 |
| C-SB-079 | 平台購買查詢失敗時向上擲錯、不以空結果冒充查無購買 | 實機+LOG | T3 | P1 | — | `src/services/iapService.ts` | 實機 sandbox 帳號且斷網 | — | — | 現役 |
| C-SB-080 | 正式版建置一律走真實購買、不啟用模擬模式 | LOG | T4 | P0 | — | `src/services/iapService.ts` | 不適用 | 正式版建置無法在測試機上驗證 | — | 現役 |
| C-SB-081 | 正式版建置時模擬訂閱等級設定為無作用 | LOG | T4 | P0 | — | `src/contexts/PremiumContext.tsx::setMockTier` | 不適用 | 正式版建置無法在測試機上驗證 | — | 現役 |

---

## 邏輯：訂閱閘控

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-SB-082 | 受閘控的動作識別碼恰為四項建立動作 | LOG | T4 | P1 | `no17_subscription_gate_logic` | `src/services/subscriptionGateLogic.ts::ACTION_IDS` | 不適用 | 閘控無 log 埋點、清單需讀原始碼 | `src/services/subscriptionGateLogic.test.ts`（matches the four quota action ids defined in spec no17） | 現役 |
| C-SB-083 | 定期交易、匯入匯出、匯率與備份不受閘控 | LOG | T4 | P1 | `no17_subscription_gate_logic` | `src/services/subscriptionGateLogic.ts::ACTION_IDS` | 不適用 | 閘控無 log 埋點、清單需讀原始碼 | `src/services/subscriptionGateLogic.test.ts`（does not gate features available to all tiers） | 現役 |
| C-SB-084 | LEVEL_1 以上一律允許、不查總數 | UI | T3 | P1 | `no17_subscription_gate_logic` | `src/services/subscriptionGateLogic.ts::canUserPerformAction` | 付費帳號已有 3 個帳戶 | — | — | 現役 |
| C-SB-085 | 免費帳號帳戶總數上限 3 個 | UI | T1 | P1 | `no17_subscription_gate_logic` | `src/constants/limits.ts::MAX_FREE_ACCOUNTS` | 免費帳號 | — | `src/screens/Paywall/paywallPricing.test.ts`（keeps the documented free-tier caps） | 現役 |
| C-SB-086 | 免費帳號類別總數上限 7 個 | UI | T1 | P1 | `no17_subscription_gate_logic` | `src/constants/limits.ts::MAX_FREE_CATEGORIES` | 免費帳號 | — | `src/screens/Paywall/paywallPricing.test.ts`（keeps the documented free-tier caps） | 現役 |
| C-SB-087 | 帳戶總數未達上限時允許新增帳戶 | UI | T1 | P1 | `no17_subscription_gate_logic` | `src/services/subscriptionGateLogic.ts::canUserPerformAction` | 免費帳號已有 2 個帳戶 | — | `src/services/subscriptionGateLogic.test.ts`（allows LEVEL_0 createAccount under the cap） | 現役 |
| C-SB-088 | 帳戶總數達上限時擋新增帳戶 | UI | T1 | P1 | `no17_subscription_gate_logic` | `src/services/subscriptionGateLogic.ts::canUserPerformAction` | 免費帳號已有 3 個帳戶 | — | `src/services/subscriptionGateLogic.test.ts`（blocks LEVEL_0 createAccount at the cap） | 現役 |
| C-SB-089 | 類別總數未達上限時允許新增類別 | UI | T1 | P1 | `no17_subscription_gate_logic` | `src/services/subscriptionGateLogic.ts::canUserPerformAction` | 免費帳號已有 6 個類別 | — | `src/services/subscriptionGateLogic.test.ts`（soft-deleted categories do not consume quota (createCategory)） | 現役 |
| C-SB-090 | 類別總數達上限時擋新增類別 | UI | T1 | P1 | `no17_subscription_gate_logic` | `src/services/subscriptionGateLogic.ts::canUserPerformAction` | 免費帳號已有 7 個類別 | — | `src/services/subscriptionGateLogic.test.ts`（at the cap, create gates block but transaction/transfer gates stay open (asymmetric boundary)） | 現役 |
| C-SB-091 | 帳戶與類別總數等於上限時仍允許新增交易 | UI | T1 | P0 | `no17_subscription_gate_logic` | `src/services/subscriptionGateLogic.ts::canUserPerformAction` | 免費帳號帳戶恰 3 個且類別恰 7 個 | — | `src/services/subscriptionGateLogic.test.ts`（allows LEVEL_0 createTransaction at exactly the account and category caps） | 現役 |
| C-SB-092 | 帳戶與類別總數等於上限時仍允許新增轉帳 | UI | T1 | P0 | `no17_subscription_gate_logic` | `src/services/subscriptionGateLogic.ts::canUserPerformAction` | 免費帳號帳戶恰 3 個且類別恰 7 個 | — | `src/services/subscriptionGateLogic.test.ts`（allows LEVEL_0 createTransfer at exactly the account and category caps） | 現役 |
| C-SB-093 | 帳戶總數超過上限時連帶擋新增交易 | UI | T3 | P0 | `no17_subscription_gate_logic` | `src/services/subscriptionGateLogic.ts::canUserPerformAction` | 免費帳號匯入使帳戶超過 3 個 | — | `src/services/subscriptionGateLogic.test.ts`（blocks LEVEL_0 createTransaction when accounts exceed the cap (import overshoot)） | 現役 |
| C-SB-094 | 類別總數超過上限時連帶擋新增轉帳 | UI | T3 | P0 | `no17_subscription_gate_logic` | `src/services/subscriptionGateLogic.ts::canUserPerformAction` | 免費帳號匯入使類別超過 7 個 | — | `src/services/subscriptionGateLogic.test.ts`（blocks LEVEL_0 createTransfer when categories exceed the cap (import overshoot)） | 現役 |
| C-SB-095 | 匯入不經配額判斷、可使總數超過上限 | UI+DB | T2 | P1 | `no17_subscription_gate_logic` | `src/services/importService.ts` | 免費帳號匯入超標資料 | — | — | 現役 |
| C-SB-096 | 已停用的列仍計入配額、停用不退還額度 | UI | T1 | P1 | `no17_subscription_gate_logic` | `src/services/localDbService.ts::countActiveAccounts` | 免費帳號已有 3 個帳戶並停用其一 | — | — | 現役 |
| C-SB-097 | 僅軟刪除的列排除於配額計數 | UI | T1 | P1 | `no17_subscription_gate_logic` | `src/services/localDbService.ts::countActiveAccounts` | 免費帳號已有 3 個帳戶並刪除其一 | — | `src/services/localDbService.test.ts`（countActiveAccounts filters by caller user_id and excludes soft-deleted） | 現役 |
| C-SB-098 | 配額計數只算當前帳號的列 | UI | T3 | P1 | `no17_subscription_gate_logic` | `src/services/localDbService.ts::countActiveAccounts` | 同機兩帳號各有帳戶 | — | `src/services/localDbService.test.ts`（countActiveAccounts filters by caller user_id and excludes soft-deleted） | 現役 |
| C-SB-099 | 選擇器排除停用列不影響配額計數 | UI | T1 | P2 | `no17_subscription_gate_logic` | `src/services/localDbService.ts` | 免費帳號已有 3 個帳戶並停用其一 | — | — | 現役 |
| C-SB-100 | 無帳號識別碼時保守回傳禁止、不退回無範圍計數 | LOG | T4 | P0 | — | `src/services/subscriptionGateLogic.ts::canUserPerformAction` | 不適用 | 未登入時無建立入口、無手動路徑 | `src/services/subscriptionGateLogic.test.ts`（blocks createAccount when no userId is supplied） | 現役 |
| C-SB-101 | 非法動作識別碼回傳禁止 | LOG | T4 | P2 | — | `src/services/subscriptionGateLogic.ts::canUserPerformAction` | 不適用 | 非法識別碼無手動入口 | — | 現役 |
| C-SB-102 | 閘控禁止時導向付費牆、不開啟目標畫面 | UI | T1 | P1 | `no11_account_list_screen` | `src/navigation/AppNavigator.tsx::handleGlobalNavigation` | 免費帳號已有 3 個帳戶 | — | — | 現役 |

---

## 邏輯：雲端寫入配額

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-SB-103 | 每日雲端寫入上限 2000 次 | LOG | T4 | P2 | `no12_quota_management_logic` | `src/services/quotaService.ts` | 不適用 | 單日達 2000 次寫入無法人工佈置 | — | 現役 |
| C-SB-104 | 寫入配額於 UTC 跨日時歸零並更新記錄日期 | LOG | T3 | P2 | `no12_quota_management_logic` | `src/services/quotaService.ts::resetIfNewDay` | 系統時鐘已跨 UTC 日界，對賬 QA QUOTA reset | — | — | 現役 |
| C-SB-105 | 檢查配額時先觸發跨日重置檢查 | LOG | T3 | P2 | `no12_quota_management_logic` | `src/services/quotaService.ts::checkQuota` | 系統時鐘已跨 UTC 日界，對賬 QA QUOTA reset 早於 QA QUOTA gate | — | — | 現役 |
| C-SB-106 | 寫入配額用盡時整段跳過本次備份 | LOG | T4 | P1 | `no19_transaction_backup_logic` | `src/services/syncEngine.ts::runSync` | 不適用 | 配額用盡狀態無法人工佈置 | `src/services/syncEngine.test.ts`（skips backup entirely when the write quota is exhausted） | 現役 |
| C-SB-107 | 累加計數以本次寫入的文件總數為單位 | LOG | T2 | P1 | `no12_quota_management_logic` | `src/services/syncEngine.ts::pushBatches` | 匯入多筆後觸發備份，對賬 QA QUOTA add | — | — | 現役 |
| C-SB-108 | 批次寫入失敗時不累加寫入計數 | LOG | T4 | P1 | `no12_quota_management_logic` | `src/services/syncEngine.ts::pushBatches` | 不適用 | 批次寫入失敗無手動入口 | `src/services/syncEngine.test.ts`（R-IE-105: 批次寫入拋 resource-exhausted 時 sync() resolve 不外拋、cooldown 戳記短退避） | 現役 |
| C-SB-109 | 遠端存在性探測的讀取不計入寫入計數 | LOG | T2 | P2 | `no12_quota_management_logic` | `src/services/syncEngine.ts::detectRemoteUserData` | 觸發備份後對賬 QA QUOTA exempt kind=read | — | — | 現役 |
| C-SB-110 | 遠端存在性探測每次至多一讀 | LOG | T2 | P2 | `no12_quota_management_logic` | `src/services/syncEngine.ts::detectRemoteUserData` | 觸發備份後對賬 QA BACKUP probe | — | — | 現役 |
| C-SB-111 | 寫入配額只計交易備份的批次寫入 | LOG | T2 | P1 | `no12_quota_management_logic` | `src/services/syncEngine.ts::pushBatches` | 改偏好後對賬 QA QUOTA exempt kind=preference | — | — | 現役 |
