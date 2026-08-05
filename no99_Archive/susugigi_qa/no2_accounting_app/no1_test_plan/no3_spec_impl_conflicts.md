# Spec 與 Impl 矛盾登記

## 文件定位

- Spec 明載而 impl 未實作、或兩邊說法不符的清單
- 與 `no2_spec_gaps.md` 的差別：缺口是 Spec 沒寫，矛盾是 Spec 寫了但與 impl 不符
- **本檔手動維護**，不從分冊機械生成。矛盾的判定需要語意比對，機械抽不出來
- 本檔只登記、不仲裁。仲裁動 Spec 或動 impl，另開主題

---

## 為何重要

這些條目的檢驗點斷言**已照 impl 實況改寫**，所以照清單手測會通過。

但 Spec 仍寫著另一件事。任何人拿 Spec 當真相去改 impl，或拿 impl 當真相去改 Spec，都會踩到。

第一版清單曾寫「未發現硬矛盾」，那是錯的——只掃了 screen 層 Spec、未逐條對照 impl 實碼。本版由獨立代理逐冊查證，初判 39 條，其中八列前後空白相關經追查為誤判並撤銷，現存 31 條。撤銷理由另立一段說明。

---

## 處置狀態

| 狀態 | 意義 |
| --- | --- |
| 待仲裁 | 尚未決定改 Spec 還是改 impl |
| 已仲裁 | 決定了方向，尚未動工 |
| 已修 | Spec 或 impl 已改，本列可刪 |

本輪產出全為待仲裁。

---

## 矛盾清單

ID 欄標 `⚠` 者為重建前編號、該冊後續重排過，查對應條目請以行為描述為準。

| 檢驗點 | 分冊 | Spec 載明 | impl 實際 | 狀態 |
| --- | --- | --- | --- | --- |
| C-CU-035 | `no9_currency` | no22_currency_rate_list_screen 佈局段：IF 尚未設定任何匯率，顯示空狀態提示 | CurrencyRateListScreen.tsx 的空狀態條件是 getCurrencyPairs 回空、即無外幣帳戶；有外幣帳戶但無真實匯率時 ensureRate 已種 1.0 佔位，列表照樣列出一行 1.0000，永遠不進空狀態 | 待仲裁 |
| C-CU-041 | `幣別與匯率` | spec no23_currency_rate_editor_screen 幣別選擇 modal 段寫「IF 無搜尋結果: 依 list_policy 空狀態顯示」；list_policy.md 空狀態節明列 title 取 common.no_results、description 取「{searchQuery}」 | CurrencyRateEditorScreen.tsx 的 ListEmptyComponent 是裸 Text 渲染 settings.currency_no_result（en.json 值為 No currency found），無 title、無 searchQuery description，該檔也未 import ListEmptyState | 待仲裁 |
| C-DA-027 | `no12_data_sync` | no19_transaction_backup_logic 的 runBackup 寫「IF 備份已在進行中: RETURN」，第二次觸發直接返回 | syncEngine.ts 的 sync() single-flight gate 把在途的同一個 Promise 回給第二次觸發，呼叫端會 await 到第一輪的結果而非立即空返回。spec 也未載旗標於早退與拋錯路徑一律由 finally 解除（本輪新增的 C-DA-030 因此 spec 錨填 —） | 待仲裁 |
| C-DA-052 | `no12_data_sync` | no19_transaction_backup_logic 的 runInitialBackup 與 runDeltaBackup 兩節皆寫「寫入完成後更新 Settings 表 lastSyncedAt 為當下時間」，字面指向上傳結束時刻。 | impl 蓋的是本次 sync 起始時間戳。syncEngine.ts:135 `const now = getCurrentTimestamp();` 在 cooldown 判定前取值，:191/:198/:202 一路當 stampAt 傳下，:310 與 :336 皆為 `markSynced(settings, stampAt)`；:180-184 註解自陳 now is the watermark stamp, NOT a post-push clock，理由是上傳期間被改的列不能被日後 Delta 跳過。 | 待仲裁 |
| C-DA-054 | `no12_data_sync` | no19_transaction_backup_logic 的 runInitialBackup 與 runDeltaBackup 皆寫「寫入完成後更新 Settings 表 lastSyncedAt 為當下時間」，即上傳結束時間 | syncEngine.ts::runSync 在 getLocalChanges 之前捕獲 now，並以該起始時間蓋水位（原始碼註解明寫 the watermark stamp, NOT a post-push clock），理由是上傳期間被改的列不會被之後的 Delta 漏掉。spec 未載此設計，且現有 jest 用固定時鐘、無法區分起訖，等於未鎖 | 待仲裁 |
| C-EN-022 | `no3_entities_merge` | no14_category_logic「reorderCategories 重排類別 → 輸入: 類別類型 + 有序的類別識別碼清單」 | reorderCategories 只收一段有序 id 陣列，無 type 參數；分區歸屬由呼叫端（CategoryListScreen 的兩個 AutoDragSortableView）各自傳自己那段 id 決定 | 待仲裁 |
| C-EN-055 | `no3_entities_merge` | no10_category_editor_screen「點按刪除按鈕 → IF 操作失敗: 顯示錯誤提示」 | CategoryEditorScreen 的 handleDelete onPress 全段無 try/catch，刪除失敗為未捕捉 rejection、不彈提示也不返回；帳戶側 AccountEditorScreen 同位置有 catch + Alert(account.error_delete)，兩側不對稱 | 待仲裁 |
| C-EN-097 | `no3_entities_merge` | no13_merge_editor_screen「點按完成按鈕: IF 帳戶模式 呼叫 mergeAccounts / IF 類別模式 呼叫 mergeCategories」，未載任何確認步驟 | 點完成後先固定跳確認對話框（取消 / 合併兩選項），按下合併鍵才執行；且無 mergeAccounts / mergeCategories 兩函式，實作是單一 performMerge 以 mode 參數分流 | 待仲裁 |
| C-HM-014 | `no6_home_screen` | no2_home_screen.md L80「各側分組依金額由小至大排列，金額較小者鄰近起點，金額較大者鄰近交會點」，未對其他聚合分組另設例外 | buildChartData 把其他聚合片固定 push 到陣列末位（homeReportLogic.ts `if (otherAmount > 0) { pData.push({ name: t('period.other') ... }) }`），computeBidirectionalSliceInfo 支出側依陣列順序自交會點往 12 點起點累加、收入側 reverse 後自起點往交會點累加，兩側末位皆最鄰近起點。四個以上分組時其他聚合金額可大於次大分組，卻仍被排在最鄰近起點處，違反 spec 的「小者鄰近起點」 | 待仲裁 |
| C-HM-015 | `no6_home_screen` | no2_home_screen L80：各側分組依金額由小至大排列，金額較小者鄰近起點、金額較大者鄰近交會點。全篇未提任何「其他」聚合分組的存在 | src/services/homeReportLogic.ts::buildChartData 先依金額由大到小排序，取 splitIndex 筆為 top slice，其餘一律累加成單一 Other slice 並 push 至 pData 末位。該 Other 不參與金額排序，金額可大於次大分組仍固定落在最鄰近起點處 | 待仲裁 |
| C-RP-008 | `no7_report_period` | no22_home_period_state_logic getPeriodDates：時間粒度為全部時「起訖涵蓋全部時間範圍」 | src/utils/timeHelper.ts::getPeriodDates 的 else 分支寫死 new Date(2000,0,1) 至 new Date(2100,11,31)，該對起訖直接進 PeriodDataStore 的 getTransactionsInPeriod / getTransfersInPeriod，以 Q.gte(startMs) 與 Q.lte(endMs) 硬夾，1999 年與 2101 年的紀錄查不出來 | 待仲裁 |
| C-RP-085 | `no7_report_period` | no22_home_period_state_logic clearPeriodReportCache 清空時機列「語系、時區、主要貨幣或週起始日變更後」 | 只有 setLanguage 與 setWeekStart 顯式呼叫 periodDataStore.clearCache('pref_change')；setTimeZone 完全不清，setBaseCurrencyId 的註解自陳改走 currency_rates 訂閱加快取鍵含 baseCurrencyCode 的雙重涵蓋、刻意不清 | 待仲裁 |
| C-SB-042 | `訂閱與配額` | no26_paywall_screen 互動段「點按訂閱按鈕 → IF 操作成功: 呼叫 refreshStatus / 關閉 Modal」，把 refreshStatus 列為購買成功的動作之一 | 購買成功路徑不呼叫 refreshStatus，只關頁。PaywallScreen.tsx:60-67 的成功 effect 條件為 purchasing && serverTier > baselineTierRef.current，body 僅清旗標與 navigation.goBack()；handlePurchase（159-185）只 await iapService.requestPurchase。購買成立後的送驗在 PremiumContext.tsx:178-191 的 purchase listener 直接呼 verifyTransaction，非 reconcile | 待仲裁 |
| C-SB-043 | `no2_subscription_quota` | no26_paywall_screen 互動段「點按訂閱按鈕」的 IF 操作成功分支明列兩個動作：呼叫 refreshStatus、關閉 Modal | PaywallScreen.tsx 購買路徑不呼叫 refreshStatus。handlePurchase 只記 baselineTierRef 後 iapService.requestPurchase，升級由 iapService 的 handlePurchaseUpdate 走 entitlementService.verifyTransaction 完成，關閉付費牆由 serverTier 升過 baseline 的 effect 觸發。全檔 refreshStatus 僅一處呼叫、在 handleRestore（第 203 行），即恢復購買路徑 | 待仲裁 |
| C-SR-019 / C-SR-020 ⚠ | `no8_search` | no4_search_screen「圖示一律採主色，不依收支正負著色」 | 交易與轉帳圖示採主色，但查無所屬類別時退為問號圖示加次要色，不是一律主色 | 待仲裁 |
| C-SR-025 | `no8_search` | no4_search_screen「含關鍵字 highlight」，線框圖標 Note(hl) | 備註為單一純文字節點，無切段、無 term 比對，樣式只有字級與次要色；全 src grep highlight 無任何文字高亮實作 | 待仲裁 |
| C-SR-026 | `no8_search` | no4_search_screen 金額顯示「一律採主文字色」 | 金額用品牌主色最深階 primary[900]，與主文字色 text.primary（neutral[900]）不同色，對標首頁 txAmount | 待仲裁 |
| C-ST-092 | `no10_settings` | no5_settings_management.md 的 setCurrencyFormat：紀錄存在時「更新該紀錄的 decimalPlaces 與 useThousandsUnit」，兩欄無條件同時更新，未載部分更新語意 | settingsLogic.ts::setCurrencyFormat 以 `updates.decimal_places !== undefined` / `updates.use_thousands_unit !== undefined` 逐欄守衛，只更新呼叫端實際傳入的欄位；create 分支也以 undefined 判定回填預設（null / false）。resetCurrencyFormat 即依賴此部分更新語意，只傳 decimal_places 而保留 useThousandsUnit | 待仲裁 |
| C-ST-114 | `no10_settings` | no18_preference_upload_logic.md L61-69：uploadAllPreferences 全量上傳本機偏好，供 PostAuthLogic 的 handlePostAuth 與 LoginLogoutLogic 的 handleReLogin 同帳號分支呼叫 | uploadAllPreferences 在 src/services/userService.ts:262 有實作，但無任何 production 呼叫端；登入路徑改由 syncUserToFirestore 把 profile 與偏好併成單次 update 完成，全量上傳實際上只被測試呼叫。斷言已照 impl 改寫為 T4，前置填不適用、不可測原因記無 production 呼叫端 | 待仲裁 |
| C-UD-041 | `no13_undo` | no16_merge_logic.md:52-53 明載「快照於合併執行前由呼叫端擷取，經復原邏輯的合併撤銷資料帶入」；no11_undo_logic.md showUndo 輸入段亦載「合併撤銷資料…承載受影響記錄的識別碼快照，供還原使用」 | 快照確實在合併前擷取，但還原不經合併撤銷資料欄位傳遞——UndoAction.mergeData 全 src 無任何讀取端，revertMerge 的參數由 MergeEditorScreen.handleSave 的 revertAction 閉包直接帶入；mergeData 欄位另缺 deletedScheduleIds，若日後有人改由該欄位還原會漏還原被軟刪的定期排程 | 待仲裁 |
| C-UD-045 | `no13_undo` | no16_merge_logic:53「快照於合併執行前由呼叫端擷取，經復原邏輯的合併撤銷資料帶入」，no11_undo_logic:16-18 showUndo 輸入段同載「合併撤銷資料，僅合併操作帶入，承載受影響記錄的識別碼快照，供還原使用」 | UndoContext.tsx:12 的 mergeData 全 src 零讀取端——僅型別宣告與 MergeEditorScreen.tsx:204 的寫入，executeUndo（:89-111）只呼叫 currentAction.revertAction()。實際還原參數走 MergeEditorScreen.tsx:213-226 的閉包直接餵給 revertMerge。mergeData 型別另缺 deletedScheduleIds（閉包有傳、型別沒有），日後若真改由該欄位還原會漏還原被軟刪的定期排程 | 待仲裁 |
| C-UI-050 | `no14_shared_ui` | list_policy.md:90 與 :110 模式 D 停用按下回饋，避免與拖拉手勢衝突 | 模式 D 列項實作了按下變底色的視覺回饋 | 待仲裁 |
| C-UI-068 | `no14_shared_ui` | search_policy.md:27-28 placeholder 文案 = 搜尋，各搜尋畫面共用同一通用文案、不逐畫面特化 | 七個搜尋入口分用三組 i18n key，文案三種並存 | 待仲裁 |
| C-UI-077 | `no14_shared_ui` | search_policy.md:32-34 容器變體兩種共用同一搜尋列結構與互動行為；:49-50 其餘搜尋畫面進入時不 autoFocus | 匯率編輯器幣別選擇 modal 的搜尋框是該畫面自建的 TextInput、不 import BottomSearchBar，且帶 autoFocus | 待仲裁 |
| C-UI-097 | `no14_shared_ui` | date_picker_policy.md:109 觸發器與標題列文字依使用者語系格式顯示 | 標題列為硬拼的年 / 月數字模板，不經 Intl 也不讀 language；只有觸發器與月份格標籤是語系驅動 | 待仲裁 |
| C-UI-099 | `no14_shared_ui` | date_picker_policy.md:112 時間依使用者偏好以 24 小時制或 12 小時制顯示 | 12 小時制在 impl 完全不存在，連偏好欄位都沒有；時制固定 24 小時兩位數 | 待仲裁 |
| C-UI-100 | `no14_shared_ui` | date_picker_policy.md:118-121 可選範圍由呼叫畫面指定上下限、超出範圍的日期不可選 | CalendarDialog 沒有上下限 props，日格也無 disabled 判斷，任何一日皆可點選 | 待仲裁 |
| C-XF-040 | `no11_data_transfer` | no15_import_wizard_screen 線框圖寫「日期 *」「金額 *」，佈局段「欄位對應列表」明列必填標記為列的組成 | 欄位對應列只渲染一個 Text 顯示 field.label，無星號、無第二個 Text、styles 無 required 樣式；required 只作 getValidColumnsForField 的門檻參數；en.json 的 field_* label 內無星號 | 待仲裁 |
| C-XF-042 | `no11_data_transfer` | no15_import_wizard_screen「IF 無符合格式的可用欄位: 顯示無符合格式的欄位提示」 | 候選為空時 SearchableDropdown 展開後只是空的清單面板，無任何提示文字；收合態顯示的是 import.select_column 佔位字，非缺欄提示 | 待仲裁 |
| C-XF-060 | `no11_data_transfer` | no15_import_wizard_screen 點按送出「IF 操作中: 顯示載入狀態」 | isProcessing 唯一效果是讓導航列右動作 disabled，無任何載入指示元件；ImportScreen 未 import ActivityIndicator，四個步驟元件皆無載入分支 | 待仲裁 |
| C-XF-061 | `no11_data_transfer` | no2_screens/no15_import_wizard_screen.md 第 300 至 303 行：點按送出 → 呼叫 executeImport → IF 操作中：顯示載入狀態 | src/screens/Settings/ImportScreen.tsx 未 import ActivityIndicator、四步元件無任何載入分支；isProcessing（第 340 行）只在第 627 行併進 nextDisabled 讓右動作變灰，畫面全程無載入指示 | 待仲裁 |

---

## 已撤銷：前後空白修剪

曾登記八列 trim 相關矛盾，全數誤判、已從清單移除。原判斷只掃 service 層、未追到 model 層。

**定案：名稱與備註落庫前一律去除前後空白，Spec 所載為真。**

依據 `@nozbe/watermelondb` 0.28.0 的 `decorators/text/index.js`，`@text` 的 setter 為 `_setRaw(columnName, 'string' === typeof value ? value.trim() : null)`，檔頭註解亦明載 on set, all strings are trimmed。五個欄位皆掛 `@text`：`Account.name`、`Category.name`、`Transaction.note`、`Transfer.note`、`Schedule.templateNote`。全 src 的寫入點皆為 model 屬性賦值，無 `_setRaw` 或 dirtyRaw 繞過；`syncEngine` 只上行寫 Firestore、不回寫本機列。

impl 自身亦互證：`accountLogic.ts::assertNameWithinLimit` 註解寫 checks the trimmed length to match what @text stores，其 jest 案例名為 compares the TRIMMED length。

| 撤銷條目 | 原登記理由 | 現況 |
| --- | --- | --- |
| C-RC-010 兩列 | `recurringLogic.ts` 無 trim 呼叫 | `Schedule.templateNote` 的 `@text` 修剪 |
| C-TX-005 兩列 | `transactionLogic.ts` 無 trim 呼叫 | `Transaction.note` 的 `@text` 修剪 |
| C-TX-013 兩列 | `transferLogic.ts` 無 trim 呼叫 | `Transfer.note` 的 `@text` 修剪 |
| 名稱與備註各一列（重建前編號） | `accountLogic.ts` 直寫原字串 | `Account.name` 與 `Category.name` 的 `@text` 修剪 |

**教訓：** 判定 impl 是否做某項資料清理，service 層無呼叫不等於未發生。WatermelonDB 的欄位 decorator 是寫入路徑的一部分，必須連 model 定義一起看。

**待補：** 本次以套件原始碼與寫入點全掃定案，未經 sqlite 實測。要補實測時建一個名稱前後帶空白的帳戶，查該列 `name` 欄位實際值。

---

## 附帶：Spec 自認未定義

第一版清單有四條句尾是「須明定」，屬 Spec 待決策而非可判定行為。本版已將它們移出檢驗點清單，不佔 ID、不標級與 P。

| 主題 | 第一版 ID |
| --- | --- |
| 刪除帳戶或類別後其排程續產與否 | C-XD-003 |
| 合併帳戶或類別後排程範本欄是否轉指目標 | C-XD-004 |
| 復原刪除致總數超上限的容忍行為 | C-XD-008 |
| 換帳號清除前未上傳變更是否先行備份 | C-XD-014 |

這四項補進 Spec 後，再以正常流程抽成檢驗點。
