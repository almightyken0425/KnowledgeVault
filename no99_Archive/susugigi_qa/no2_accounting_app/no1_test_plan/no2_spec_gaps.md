# Spec 缺口候選登記

## 文件定位

- impl 有行為、Spec 未載的清單
- 本檔只登記、不修 Spec。仲裁另開主題
- 檢驗點照 impl 實際行為抽，不因 Spec 未載而略過
- 自各分冊的 spec 錨欄機械生成，不手抄

---

## 排序與優先

依 P 由高至低、同 P 內未自動化者優先。

**P0 且未自動化者為雙重缺口**——Spec 未載且無機器把關，回歸時全靠手動場次，優先補。

---

## 候選清單

<!-- GENERATED:spec-gaps -->
| 檢驗點 | P | 分冊 | 行為 | impl 錨 | 自動化 |
| --- | --- | --- | --- | --- | --- |
| C-DA-065 | P0 | `no12_data_sync.md` | 斷網下新增交易本機立即成功且畫面不卡 | `src/services/transactionLogic.ts` | — |
| C-EN-006 | P0 | `no3_entities_merge.md` | 帳戶與類別的軟刪採刪除戳記墓碑、列仍留在本機表內 | `src/database/models/SoftDeletableModel.ts` | — |
| C-EN-078 | P0 | `no3_entities_merge.md` | 編輯模式儲存前找不到原記錄時中止、不做半套更新 | `src/screens/Accounts/AccountEditorScreen.tsx` | — |
| C-EN-123 | P0 | `no3_entities_merge.md` | 復原刪除類別依快照還原同一批交易、不重查 | `src/services/categoryLogic.ts::restoreCategoryCascade` | — |
| C-EN-144 | P0 | `no3_entities_merge.md` | 復原刪除帳戶依快照還原同一批交易與轉帳、不重查 | `src/services/accountLogic.ts::restoreAccountCascade` | — |
| C-EN-157 | P0 | `no3_entities_merge.md` | 帳戶合併軟刪模板指向來源帳戶的未刪定期排程 | `src/services/mergeService.ts::buildSourceScheduleSoftDeletes` | — |
| C-EN-158 | P0 | `no3_entities_merge.md` | 類別合併軟刪模板指向來源類別的未刪定期排程 | `src/services/mergeService.ts::buildSourceScheduleSoftDeletes` | — |
| C-EN-159 | P0 | `no3_entities_merge.md` | 合併的搬移、排程軟刪與來源軟刪於單一批次提交 | `src/services/mergeService.ts::performMerge` | — |
| C-RC-043 | P0 | `no5_recurring.md` | 建立排程當下即補產生起始日至當前時刻之間已到期的實例 | `src/services/recurringLogic.ts::createSchedule` | — |
| C-RC-092 | P0 | `no5_recurring.md` | 結束日當日的實例照常產生、不因時刻先後被截掉 | `src/services/recurringLogic.ts::doGenerateMissingInstances` | — |
| C-SB-080 | P0 | `no2_subscription_quota.md` | 正式版建置一律走真實購買、不啟用模擬模式 | `src/services/iapService.ts` | — |
| C-SB-081 | P0 | `no2_subscription_quota.md` | 正式版建置時模擬訂閱等級設定為無作用 | `src/contexts/PremiumContext.tsx::setMockTier` | — |
| C-TX-065 | P0 | `no4_transactions.md` | 未按等號的算式於點完成時先結算再存檔 | `src/hooks/useCalculator.ts::flush` | — |
| C-TX-097 | P0 | `no4_transactions.md` | 跨幣別轉帳兩側未按等號的算式於點完成時各自結算 | `src/screens/Transactions/TransferEditorScreen.tsx::handleSave` | — |
| C-UD-046 | P0 | `no13_undo.md` | 合併的復原不復活合併前已刪除的轉帳 | `src/screens/Merge/MergeEditorScreen.tsx::handleSave` | — |
| C-XC-012 | P0 | `no15_cross_cutting.md` | 復原倒數中殺掉 App 後被刪紀錄維持已刪態 | `src/contexts/UndoContext.tsx::UndoProvider` | — |
| C-XF-013 | P0 | `no11_data_transfer.md` | 清除確認對話框點取消不執行清除、不寫入 | `src/screens/Settings/DataManagementScreen.tsx` | — |
| C-CU-061 | P0 | `no9_currency.md` | 已軟刪的匯率記錄不參與換算 | `src/services/currencyService.ts::resolveCurrencyRate` | 有 |
| C-CU-062 | P0 | `no9_currency.md` | 幣別對只剩軟刪墓碑時換算落回 1、不取已刪匯率 | `src/services/currencyService.ts::resolveCurrencyRate` | 有 |
| C-CU-075 | P0 | `no9_currency.md` | 編輯器兩金額比值換回外幣對主要貨幣的儲存匯率 | `src/services/currencyService.ts::ratePairToStoredRate` | 有 |
| C-CU-107 | P0 | `no9_currency.md` | 千分位模式重開編輯器金額欄回填原輸入值 | `src/utils/currencyUtils.ts::encodeStorageAmount` | 有 |
| C-EN-121 | P0 | `no3_entities_merge.md` | 類別與其交易的軟刪於單一批次提交 | `src/services/categoryLogic.ts::deleteCategoryCascade` | 有 |
| C-EN-142 | P0 | `no3_entities_merge.md` | 帳戶與其紀錄的軟刪於單一批次提交 | `src/services/accountLogic.ts::deleteAccountCascade` | 有 |
| C-EN-164 | P0 | `no3_entities_merge.md` | 復原合併一併還原合併時軟刪的定期排程 | `src/services/mergeService.ts::revertMerge` | 有 |
| C-EN-166 | P0 | `no3_entities_merge.md` | 復原合併於單一批次提交、不半套套用 | `src/services/mergeService.ts::revertMerge` | 有 |
| C-SB-100 | P0 | `no2_subscription_quota.md` | 無帳號識別碼時保守回傳禁止、不退回無範圍計數 | `src/services/subscriptionGateLogic.ts::canUserPerformAction` | 有 |
| C-TX-051 | P0 | `no4_transactions.md` | 除以零得非有限值時清空回 0 | `src/hooks/useCalculator.ts::compute` | 有 |
| C-XF-059 | P0 | `no11_data_transfer.md` | 預覽的將略過紀錄數與匯入結果的略過筆數一致 | `src/screens/Settings/ImportScreen.tsx` | 有 |
| C-BT-029 | P1 | `no1_boot_identity.md` | Firebase 登出失敗仍將本地登入狀態清為登出 | `src/contexts/AuthContext.tsx::signOut` | — |
| C-DA-030 | P1 | `no12_data_sync.md` | 備份拋錯時解除進行中旗標、可再次觸發 | `src/services/syncEngine.ts::syncEngine` | — |
| C-DA-057 | P1 | `no12_data_sync.md` | 批次寫入逾時時中止本次備份、不永久掛住 | `src/services/syncEngine.ts::pushBatches` | — |
| C-EN-098 | P1 | `no3_entities_merge.md` | 合併執行中完成按鈕不可點按 | `src/screens/Merge/MergeEditorScreen.tsx` | — |
| C-EN-099 | P1 | `no3_entities_merge.md` | 點按完成後顯示合併確認對話框、含取消與合併兩選項 | `src/screens/Merge/MergeEditorScreen.tsx` | — |
| C-EN-100 | P1 | `no3_entities_merge.md` | 合併確認對話框點取消時不執行合併、零寫入 | `src/screens/Merge/MergeEditorScreen.tsx` | — |
| C-EN-141 | P1 | `no3_entities_merge.md` | 刪除帳戶不重複軟刪已刪除的交易 | `src/services/accountLogic.ts::deleteAccountCascade` | — |
| C-RC-044 | P1 | `no5_recurring.md` | 建立時補產生失敗不外拋、排程與首筆實例仍成立 | `src/services/recurringLogic.ts::createSchedule` | — |
| C-RP-051 | P1 | `no7_report_period.md` | 換帳號後首頁顯示狀態重設為預設、不殘留前一帳號的值 | `src/contexts/HomeFilterContext.tsx` | — |
| C-RP-067 | P1 | `no7_report_period.md` | 換帳號後不把新選取寫進前一帳號的設定列 | `src/contexts/HomeFilterContext.tsx` | — |
| C-RP-091 | P1 | `no7_report_period.md` | 清空期間進行中的查詢結果不寫回快取 | `src/stores/PeriodDataStore.ts::fetch` | — |
| C-SB-044 | P1 | `no2_subscription_quota.md` | 已達付費者再次發起購買不因既有等級誤判成功 | `src/screens/Paywall/PaywallScreen.tsx` | — |
| C-SB-047 | P1 | `no2_subscription_quota.md` | 非本頁發起的平台購買錯誤不彈對話框 | `src/screens/Paywall/PaywallScreen.tsx` | — |
| C-SB-048 | P1 | `no2_subscription_quota.md` | 購買逾九十秒仍未升級時解除載入狀態並顯示購買失敗對話框 | `src/screens/Paywall/PaywallScreen.tsx` | — |
| C-SB-054 | P1 | `no2_subscription_quota.md` | 操作處理中再點恢復購買不發起第二次 | `src/screens/Paywall/PaywallScreen.tsx::handleRestore` | — |
| C-SB-068 | P1 | `no2_subscription_quota.md` | 清理後遲到的無授權回呼不寫入快取 | `src/contexts/PremiumContext.tsx` | — |
| C-SB-069 | P1 | `no2_subscription_quota.md` | 清理後遲到的帶授權回呼不寫入快取 | `src/contexts/PremiumContext.tsx` | — |
| C-SB-079 | P1 | `no2_subscription_quota.md` | 平台購買查詢失敗時向上擲錯、不以空結果冒充查無購買 | `src/services/iapService.ts` | — |
| C-ST-096 | P1 | `no10_settings.md` | 偏好寫入不等待雲端回應、離線仍即時返回 | `src/contexts/PreferenceContext.tsx::updateSetting` | — |
| C-UI-089 | P1 | `no14_shared_ui.md` | 上下滑翻頁只改標題列年月、不改已選日期 | `src/components/CalendarDialog.tsx` | — |
| C-UI-092 | P1 | `no14_shared_ui.md` | 選月保留原本的日、超出該月天數時夾到該月最後一日 | `src/components/CalendarDialog.tsx` | — |
| C-XC-013 | P1 | `no15_cross_cutting.md` | 復原倒數中殺掉 App 後復原列不重現 | `src/contexts/UndoContext.tsx::UndoProvider` | — |
| C-XC-015 | P1 | `no15_cross_cutting.md` | 匯入新建的帳戶與類別收進單一批次寫入 | `src/services/importService.ts::executeImport` | — |
| C-XF-060 | P1 | `no11_data_transfer.md` | 送出執行期間右動作不可點按 | `src/screens/Settings/ImportScreen.tsx` | — |
| C-XF-087 | P1 | `no11_data_transfer.md` | 匯入不為新建帳戶種入佔位匯率 | `src/services/importService.ts::executeImport` | — |
| C-XF-092 | P1 | `no11_data_transfer.md` | 轉帳兩腿金額以絕對值儲存 | `src/services/importService.ts::executeImport` | — |
| C-XF-098 | P1 | `no11_data_transfer.md` | 同幣別轉帳缺轉入金額時轉入金額沿用轉出金額 | `src/services/importService.ts::executeImport` | — |
| C-BT-047 | P1 | `no1_boot_identity.md` | 同 uid 重新觸發不重跑冷啟工作 | `src/contexts/AuthContext.tsx::runPostAuth` | 有 |
| C-BT-048 | P1 | `no1_boot_identity.md` | 冷啟雙發僅執行一次登入後初始化 | `src/contexts/AuthContext.tsx::runPostAuth` | 有 |
| C-BT-049 | P1 | `no1_boot_identity.md` | 冷啟雙發期間維持載入態、不閃登入頁 | `src/contexts/AuthContext.tsx::runPostAuth` | 有 |
| C-BT-050 | P1 | `no1_boot_identity.md` | 不同 uid 觸發仍走完整登入後初始化 | `src/contexts/AuthContext.tsx::runPostAuth` | 有 |
| C-BT-051 | P1 | `no1_boot_identity.md` | 登出後同 uid 重新登入視為真登入、重跑初始化 | `src/contexts/AuthContext.tsx::runPostAuth` | 有 |
| C-BT-085 | P1 | `no1_boot_identity.md` | 刪除逾時設定比後端上限多留餘裕 | `src/services/accountDeletionService.ts` | 有 |
| C-CU-071 | P1 | `no9_currency.md` | 該幣別對只剩軟刪墓碑時重新種入佔位 | `src/services/currencyService.ts::ensureRate` | 有 |
| C-CU-077 | P1 | `no9_currency.md` | 幣別對清單排除已軟刪帳戶的幣別 | `src/services/currencyService.ts::getCurrencyPairs` | 有 |
| C-CU-090 | P1 | `no9_currency.md` | 幣別符號固定依英語系慣例、不隨 app 語系變 | `src/utils/formatters.ts::formatCurrencyValue` | 有 |
| C-CU-091 | P1 | `no9_currency.md` | 數字分組與小數分隔符依 app 語系 | `src/utils/formatters.ts::formatCurrencyValue` | 有 |
| C-CU-101 | P1 | `no9_currency.md` | 未知幣別代碼不擲錯、降級顯示代碼與數值 | `src/utils/formatters.ts::formatCurrencyValue` | 有 |
| C-CU-102 | P1 | `no9_currency.md` | 小數位參數獨立於 ISO 小數位生效 | `src/utils/formatters.ts::formatCurrencyValue` | 有 |
| C-DA-047 | P1 | `no12_data_sync.md` | 舊版裝置層級戳記一次性採用為該帳號水位、採用後移除舊鍵 | `src/services/syncEngine.ts::adoptLegacySyncState` | 有 |
| C-DA-048 | P1 | `no12_data_sync.md` | 舊版戳記為零或無效值時不採用、照走初次完整上傳 | `src/services/syncEngine.ts::adoptLegacySyncState` | 有 |
| C-DA-059 | P1 | `no12_data_sync.md` | 備份失敗時把冷卻時間戳回拉成 30 秒短退避 | `src/services/syncEngine.ts::runSync` | 有 |
| C-DA-061 | P1 | `no12_data_sync.md` | 備份失敗不外拋、不影響觸發端 | `src/services/runBackup.ts::runBackup` | 有 |
| C-DA-062 | P1 | `no12_data_sync.md` | 離線時整段跳過備份、不探測遠端也不寫冷卻時間戳 | `src/services/syncEngine.ts::runSync` | 有 |
| C-EN-091 | P1 | `no3_entities_merge.md` | 來源尚未就緒時目標暫不自動選取、待來源定後才選 | `src/utils/pickerAutoSelect.ts::resolveAutoPick` | 有 |
| C-EN-107 | P1 | `no3_entities_merge.md` | 新建類別排序值取同型未刪最大值加一 | `src/utils/sortOrder.ts::nextSortOrder` | 有 |
| C-EN-109 | P1 | `no3_entities_merge.md` | 計算類別排序最大值時排除軟刪列 | `src/services/categoryLogic.ts::createCategory` | 有 |
| C-EN-118 | P1 | `no3_entities_merge.md` | 類別與其交易的軟刪共用同一時間戳 | `src/services/categoryLogic.ts::deleteCategoryCascade` | 有 |
| C-EN-120 | P1 | `no3_entities_merge.md` | 刪除類別不重複軟刪已刪除的交易 | `src/services/categoryLogic.ts::deleteCategoryCascade` | 有 |
| C-EN-124 | P1 | `no3_entities_merge.md` | 新建帳戶排序值取未刪最大值加一 | `src/utils/sortOrder.ts::nextSortOrder` | 有 |
| C-EN-126 | P1 | `no3_entities_merge.md` | 計算帳戶排序最大值時排除軟刪列 | `src/services/accountLogic.ts::createAccount` | 有 |
| C-EN-131 | P1 | `no3_entities_merge.md` | 佔位匯率於帳戶寫入完成後才種、不巢狀 | `src/services/accountLogic.ts::createAccount` | 有 |
| C-EN-139 | P1 | `no3_entities_merge.md` | 帳戶與其紀錄的軟刪共用同一時間戳 | `src/services/accountLogic.ts::deleteAccountCascade` | 有 |
| C-EN-153 | P1 | `no3_entities_merge.md` | 合併不重新戳記已軟刪的轉出紀錄 | `src/services/mergeService.ts::performMerge` | 有 |
| C-EN-154 | P1 | `no3_entities_merge.md` | 合併不二次軟刪已刪除的自轉帳 | `src/services/mergeService.ts::performMerge` | 有 |
| C-EN-155 | P1 | `no3_entities_merge.md` | 合併排除已軟刪的交易、不納入搬移 | `src/services/mergeService.ts::performMerge` | 有 |
| C-EN-165 | P1 | `no3_entities_merge.md` | 快照同時列出自轉帳於兩清單時仍完整復原 | `src/services/mergeService.ts::revertMerge` | 有 |
| C-RC-003 | P1 | `no5_recurring.md` | 上限值 `interval` 在每種頻率下皆推出合法日期 | `src/constants/limits.ts::INTERVAL_MAX_DIGITS` | 有 |
| C-RC-022 | P1 | `no5_recurring.md` | 結束日期非同步載入完成後選擇器補顯示為該日期 | `src/components/RecurringOptions.tsx` | 有 |
| C-RC-087 | P1 | `no5_recurring.md` | 錨定日號取起始時點的本地日曆日 | `src/services/recurringLogic.ts::doGenerateMissingInstances` | 有 |
| C-RP-012 | P1 | `no7_report_period.md` | 帳戶或分類查無定義的交易仍列入報表計算、僅明確停用者剔除 | `src/stores/PeriodDataStore.ts::buildPeriodReport` | 有 |
| C-RP-026 | P1 | `no7_report_period.md` | 已選端自身停用時該轉帳仍列入報表計算 | `src/services/transferDisplayLogic.ts::resolveTransferDisplay` | 有 |
| C-RP-066 | P1 | `no7_report_period.md` | 寫入進行中改回原值仍補排落地、不固化中間值 | `src/contexts/HomeFilterContext.tsx` | 有 |
| C-RP-068 | P1 | `no7_report_period.md` | 快取鍵含主要貨幣、改主要貨幣不命中原快取 | `src/stores/PeriodDataStore.ts::getCacheKey` | 有 |
| C-RP-069 | P1 | `no7_report_period.md` | 快取鍵含匯率版本、匯率載入或編輯後不命中原快取 | `src/stores/PeriodDataStore.ts::getCacheKey` | 有 |
| C-SB-026 | P1 | `no2_subscription_quota.md` | 年費攤月價以年價除以 12 計算 | `src/screens/Paywall/paywallPricing.ts::perMonthEquivalent` | 有 |
| C-SR-038 | P1 | `no8_search.md` | 關鍵字中的 % 與 _ 視為字面字元、不當萬用字元 | `src/services/localDbService.ts::escapeNoteSearchTerm` | 有 |
| C-TX-037 | P1 | `no4_transactions.md` | 已手選結束日時稍後載入不覆蓋手選值 | `src/components/RecurringOptions.tsx` | 有 |
| C-TX-052 | P1 | `no4_transactions.md` | 正常除法得正確結果 | `src/hooks/useCalculator.ts::compute` | 有 |
| C-TX-053 | P1 | `no4_transactions.md` | 首個運算子按下時顯示保留原數 | `src/hooks/useCalculator.ts::handleKey` | 有 |
| C-TX-054 | P1 | `no4_transactions.md` | 連鎖運算子按下即結算並顯示中間結果 | `src/hooks/useCalculator.ts::handleKey` | 有 |
| C-TX-055 | P1 | `no4_transactions.md` | 連鎖運算由左至右累計 | `src/hooks/useCalculator.ts::handleKey` | 有 |
| C-TX-060 | P1 | `no4_transactions.md` | 除零後重複等號時記憶一併清空、不重播壞運算 | `src/hooks/useCalculator.ts::resetAll` | 有 |
| C-TX-061 | P1 | `no4_transactions.md` | 載入既有金額後按數字鍵為接續、不取代 | `src/hooks/useCalculator.ts::setValue` | 有 |
| C-XF-097 | P1 | `no11_data_transfer.md` | 轉出與轉入解析為同一帳戶的列略過 | `src/services/importService.ts::getRowSkipReason` | 有 |
| C-CU-104 | P2 | `no9_currency.md` | 交易列與焦點卡金額幣別段縮小、數字段大字 | `src/components/InlineAmount.tsx` | — |
| C-CU-105 | P2 | `no9_currency.md` | 首頁環形圖中央金額幣別段在上、數字段在下 | `src/screens/Home/components/AnimatedBalance.tsx` | — |
| C-DA-063 | P2 | `no12_data_sync.md` | 網路狀態未知時視為連線中、不誤擋備份 | `src/utils/networkState.ts::isOffline` | — |
| C-EN-015 | P2 | `no3_entities_merge.md` | 類別清單兩分區各依排序值遞增排列 | `src/screens/Categories/CategoryListScreen.tsx` | — |
| C-EN-025 | P2 | `no3_entities_merge.md` | 帳戶清單項目以幣別代碼為副標 | `src/screens/Accounts/AccountListScreen.tsx` | — |
| C-EN-026 | P2 | `no3_entities_merge.md` | 帳戶清單依排序值遞增排列 | `src/services/localDbService.ts::getAccounts` | — |
| C-EN-048 | P2 | `no3_entities_merge.md` | 載入既有類別失敗時提示錯誤並返回上一頁 | `src/screens/Categories/CategoryEditorScreen.tsx` | — |
| C-EN-065 | P2 | `no3_entities_merge.md` | 載入既有帳戶失敗時提示錯誤並返回上一頁 | `src/screens/Accounts/AccountEditorScreen.tsx` | — |
| C-HM-015 | P2 | `no6_home_screen.md` | 其他聚合分組恆列於最鄰近起點處、不依金額入序 | `src/services/homeReportLogic.ts::buildChartData` | — |
| C-HM-043 | P2 | `no6_home_screen.md` | 左輔助欄日期文字的日與月順序依語系決定 | `src/screens/Home/components/TxDateBadge.tsx` | — |
| C-HM-061 | P2 | `no6_home_screen.md` | 報表載入失敗時整頁顯示錯誤文字與重試按鈕 | `src/screens/Home/PeriodPage.tsx` | — |
| C-HM-062 | P2 | `no6_home_screen.md` | 點按重試清除錯誤文字、該頁回到載入態 | `src/screens/Home/PeriodPage.tsx` | — |
| C-RC-029 | P2 | `no5_recurring.md` | 開關關閉後再開啟時頻率與間隔沿用關閉前的值 | `src/components/RecurringOptions.tsx::handleToggle` | — |
| C-RC-082 | P2 | `no5_recurring.md` | 最後一筆實例缺實例日時改取其交易日期 | `src/services/recurringLogic.ts::doGenerateMissingInstances` | — |
| C-RP-019 | P2 | `no7_report_period.md` | 分組內各筆紀錄依日期由新到舊排序 | `src/stores/PeriodDataStore.ts::buildPeriodReport` | — |
| C-SB-025 | P2 | `no2_subscription_quota.md` | 商店查無該方案時該方案分段不渲染 | `src/screens/Paywall/PaywallScreen.tsx::renderSegment` | — |
| C-SB-036 | P2 | `no2_subscription_quota.md` | 未選到方案時揭露區整塊不顯示 | `src/screens/Paywall/PaywallScreen.tsx` | — |
| C-SB-078 | P2 | `no2_subscription_quota.md` | 恢復購買查到的每筆購買皆通知授權更新 | `src/services/iapService.ts::restorePurchases` | — |
| C-SB-101 | P2 | `no2_subscription_quota.md` | 非法動作識別碼回傳禁止 | `src/services/subscriptionGateLogic.ts::canUserPerformAction` | — |
| C-SR-008 | P2 | `no8_search.md` | 結果清單末列可捲至搜尋列上方 | `src/screens/Search/SearchScreen.tsx` | — |
| C-SR-012 | P2 | `no8_search.md` | 搜尋執行期間不顯示任何空狀態提示 | `src/screens/Search/SearchScreen.tsx` | — |
| C-SR-021 | P2 | `no8_search.md` | 查無所屬類別的交易結果圖示改顯問號並採次要色 | `src/screens/Search/SearchScreen.tsx::renderRow` | — |
| C-SR-023 | P2 | `no8_search.md` | 查無所屬類別的交易結果中段顯示未分類文字 | `src/screens/Search/SearchScreen.tsx::renderRow` | — |
| C-SR-029 | P2 | `no8_search.md` | 結果金額的幣別符號字級小於數字 | `src/components/InlineAmount.tsx` | — |
| C-SR-043 | P2 | `no8_search.md` | 關鍵字前後空白不影響搜尋結果 | `src/screens/Search/SearchScreen.tsx::performSearch` | — |
| C-ST-005 | P2 | `no10_settings.md` | `launchMode` 為空字串或集外值時載入回退首頁 | `src/contexts/PreferenceContext.tsx` | — |
| C-ST-007 | P2 | `no10_settings.md` | `weekStart` 為 Null 或集外值時載入回退跟隨語系 | `src/contexts/PreferenceContext.tsx` | — |
| C-ST-010 | P2 | `no10_settings.md` | `analyticsConsent` 為 Null 時本機讀取視為已同意 | `src/contexts/PreferenceContext.tsx` | — |
| C-ST-011 | P2 | `no10_settings.md` | 既有 `language` 為未支援標籤時載入正規化為支援語系 | `src/contexts/PreferenceContext.tsx` | — |
| C-ST-029 | P2 | `no10_settings.md` | 限時內連點版本號七次解鎖除錯工具區 | `src/screens/Settings/SettingsScreen.tsx` | — |
| C-ST-030 | P2 | `no10_settings.md` | 除錯工具區含主題設定入口並顯示當前主題名稱 | `src/screens/Settings/SettingsScreen.tsx` | — |
| C-ST-031 | P2 | `no10_settings.md` | 正式版建置不顯示除錯工具區且主題設定路由不存在 | `src/navigation/AppNavigator.tsx` | — |
| C-ST-043 | P2 | `no10_settings.md` | 登出按鈕同採破壞性樣式紅字 | `src/screens/Settings/PreferenceScreen.tsx` | — |
| C-ST-079 | P2 | `no10_settings.md` | 時區無搜尋結果時顯示找不到結果空狀態 | `src/screens/Settings/TimeZoneSettingScreen.tsx` | — |
| C-ST-087 | P2 | `no10_settings.md` | 切換至未定義主題識別碼時不寫入、維持原主題 | `src/contexts/PreferenceContext.tsx::setThemeId` | — |
| C-ST-097 | P2 | `no10_settings.md` | 未登入時偏好寫入不執行 | `src/contexts/PreferenceContext.tsx::updateSetting` | — |
| C-TX-066 | P2 | `no4_transactions.md` | 幣別小數位為 0 時小數點鍵無作用 | `src/hooks/useCalculator.ts::handleKey` | — |
| C-TX-067 | P2 | `no4_transactions.md` | 小數位達幣別上限時後續數字鍵不更新 | `src/hooks/useCalculator.ts::handleKey` | — |
| C-TX-068 | P2 | `no4_transactions.md` | 運算結果依幣別小數位四捨五入 | `src/hooks/useCalculator.ts::compute` | — |
| C-UD-023 | P2 | `no13_undo.md` | 復原列顯示中切換畫面不重置倒數 | `src/contexts/UndoContext.tsx::beginCountdown` | — |
| C-UD-039 | P2 | `no13_undo.md` | 新增外幣帳戶的復原不撤銷連帶種入的佔位匯率 | `src/screens/Accounts/AccountEditorScreen.tsx::handleSave` | — |
| C-UI-053 | P2 | `no14_shared_ui.md` | 群組卡片外殼不於子項間插入分隔線、細線由各列自帶上緣 | `src/components/list/ListGroupCard.tsx` | — |
| C-UI-054 | P2 | `no14_shared_ui.md` | 群組卡片外殼圓角裁掉首列的上緣細線 | `src/components/list/ListGroupCard.tsx` | — |
| C-UI-055 | P2 | `no14_shared_ui.md` | 群組卡片列表首列去上緣細線並套上緣圓角、末列套下緣圓角 | `src/components/list/GroupedListCard.tsx` | — |
| C-UI-079 | P2 | `no14_shared_ui.md` | 搜尋輸入框字元上限 100 | `src/components/BottomSearchBar.tsx` | — |
| C-UI-099 | P2 | `no14_shared_ui.md` | 月份格標籤依語系顯示月份簡稱 | `src/components/CalendarDialog.tsx` | — |
| C-XC-023 | P2 | `no15_cross_cutting.md` | 時區設定值非法時退回裝置時區、期間推導不中斷 | `src/utils/timeHelper.ts::safeToZonedTime` | — |
| C-XF-009 | P2 | `no11_data_transfer.md` | 取消分享面板時不顯示匯出失敗對話框 | `src/screens/Settings/DataManagementScreen.tsx` | — |
| C-XF-029 | P2 | `no11_data_transfer.md` | 已選擇檔案時選擇檔案按鈕改為重新選擇文案 | `src/screens/Settings/ImportScreen.tsx` | — |
| C-XF-031 | P2 | `no11_data_transfer.md` | 取消系統檔案選擇器時不顯示任何對話框 | `src/screens/Settings/ImportScreen.tsx` | — |
| C-XF-035 | P2 | `no11_data_transfer.md` | 取消分享面板時不顯示下載失敗對話框 | `src/screens/Settings/ImportScreen.tsx` | — |
| C-XF-052 | P2 | `no11_data_transfer.md` | 該段無任何項目時不顯示該段標題 | `src/screens/Settings/ImportScreen.tsx` | — |
| C-XF-085 | P2 | `no11_data_transfer.md` | 新建帳戶與類別的排序值接續既有最大值 | `src/services/importService.ts::executeImport` | — |
| C-XF-086 | P2 | `no11_data_transfer.md` | 新建帳戶與類別名稱超過長度上限時截斷 | `src/services/importService.ts::executeImport` | — |
| C-BT-086 | P2 | `no1_boot_identity.md` | 撤銷未完成旗標缺欄或非布林時收斂為 false | `src/services/accountDeletionService.ts` | 有 |
| C-CU-008 | P2 | `no9_currency.md` | 掛載時選取值無命中則採純字母序 | `src/hooks/useFrozenSelectionOrder.ts::useFrozenSelectionOrder` | 有 |
| C-CU-056 | P2 | `no9_currency.md` | 反向記錄匯率為零時換算係數回零、不做除以零 | `src/services/currencyService.ts::resolveRateFromRecord` | 有 |
| C-CU-065 | P2 | `no9_currency.md` | 未知幣別代碼換算直接回原值、不擲錯 | `src/contexts/CurrencyContext.tsx::convertAmount` | 有 |
| C-CU-092 | P2 | `no9_currency.md` | 印地語系採印度式分組 | `src/utils/formatters.ts::formatCurrencyValue` | 有 |
| C-CU-095 | P2 | `no9_currency.md` | 負號只插在第一個數字前、分隔符不受影響 | `src/utils/formatters.ts::insertMinusAfterSymbol` | 有 |
| C-CU-096 | P2 | `no9_currency.md` | 非 ASCII 數字語系仍命中第一個十進位數字 | `src/utils/formatters.ts::insertMinusAfterSymbol` | 有 |
| C-CU-097 | P2 | `no9_currency.md` | 金額切分為幣別段與數字段兩部分 | `src/utils/formatters.ts::splitCurrencyParts` | 有 |
| C-CU-098 | P2 | `no9_currency.md` | 負號隨數字段走、不黏在幣別段 | `src/utils/formatters.ts::splitCurrencyParts` | 有 |
| C-CU-099 | P2 | `no9_currency.md` | 切分只在第一個數字前、分隔符不受影響 | `src/utils/formatters.ts::splitCurrencyParts` | 有 |
| C-CU-100 | P2 | `no9_currency.md` | 未知幣別降級格式仍能正確切分並去尾端空白 | `src/utils/formatters.ts::splitCurrencyParts` | 有 |
| C-CU-103 | P2 | `no9_currency.md` | 未指定語系時退回當前 app 語系 | `src/utils/formatters.ts::formatCurrencyValue` | 有 |
| C-CU-109 | P2 | `no9_currency.md` | 匯率非正數或非有限時顯示替代符號、不印無限大 | `src/utils/currencyUtils.ts::formatExchangeRate` | 有 |
| C-DA-014 | P2 | `no12_data_sync.md` | 搜尋關鍵字內的百分號與底線視為字面字元 | `src/services/localDbService.ts::escapeNoteSearchTerm` | 有 |
| C-DA-038 | P2 | `no12_data_sync.md` | 當前帳號無設定列時跳過本次備份 | `src/services/syncEngine.ts::runSync` | 有 |
| C-EN-008 | P2 | `no3_entities_merge.md` | 帳戶與類別的預設圖示定義域不重疊 | `src/constants/seedDefaults.ts` | 有 |
| C-EN-094 | P2 | `no3_entities_merge.md` | 同一清單內手動選到相同項時不自動跳開 | `src/utils/pickerAutoSelect.ts::resolveAutoPick` | 有 |
| C-EN-108 | P2 | `no3_entities_merge.md` | 型別分區為空時新建類別排序值起始 0 | `src/utils/sortOrder.ts::nextSortOrder` | 有 |
| C-EN-116 | P2 | `no3_entities_merge.md` | 重排類別僅寫入位置有變的列 | `src/services/categoryLogic.ts::reorderCategories` | 有 |
| C-EN-125 | P2 | `no3_entities_merge.md` | 無帳戶時新建帳戶排序值起始 0 | `src/utils/sortOrder.ts::nextSortOrder` | 有 |
| C-EN-135 | P2 | `no3_entities_merge.md` | 重排帳戶僅寫入位置有變的列 | `src/services/accountLogic.ts::reorderAccounts` | 有 |
| C-RC-023 | P2 | `no5_recurring.md` | 已手動選過日期時後到的結束日期不覆蓋選擇器顯示值 | `src/components/RecurringOptions.tsx` | 有 |
| C-RC-024 | P2 | `no5_recurring.md` | 結束日期以日期物件傳入時選擇器仍顯示同一時點 | `src/components/RecurringOptions.tsx` | 有 |
| C-RP-027 | P2 | `no7_report_period.md` | 轉帳金額查無帳戶幣別時以主要貨幣為後備 | `src/services/transferDisplayLogic.ts::resolveTransferDisplay` | 有 |
| C-RP-031 | P2 | `no7_report_period.md` | 色票序列用盡時回到第一個色票 | `src/services/homeReportLogic.ts::pickChartColor` | 有 |
| C-RP-033 | P2 | `no7_report_period.md` | 無分組溢出截止點時不產出其他分組 | `src/services/homeReportLogic.ts::buildChartData` | 有 |
| C-RP-034 | P2 | `no7_report_period.md` | 該類型金額總和非正數時圖表分組清單為空 | `src/services/homeReportLogic.ts::buildChartData` | 有 |
| C-RP-036 | P2 | `no7_report_period.md` | 分類查無定義時圖表區塊名稱顯示未分類 | `src/services/homeReportLogic.ts::buildChartData` | 有 |
| C-RP-047 | P2 | `no7_report_period.md` | 新偵測帳戶已在保留清單內時不重複加入 | `src/contexts/reconcileAccountSelection.ts::reconcileAccountSelection` | 有 |
| C-SB-019 | P2 | `no2_subscription_quota.md` | 功能文案不寫死上限數值、由常數插值 | `src/screens/Paywall/PaywallScreen.tsx` | 有 |
| C-SB-027 | P2 | `no2_subscription_quota.md` | 整數價格顯示 0 位小數、非整數顯示幣別小數位 | `src/screens/Paywall/paywallPricing.ts::displayDecimals` | 有 |
| C-SB-028 | P2 | `no2_subscription_quota.md` | 零小數幣別不生出多餘小數位 | `src/screens/Paywall/paywallPricing.ts::displayDecimals` | 有 |
| C-SB-029 | P2 | `no2_subscription_quota.md` | 幣別代碼無法解析時小數位退回兩位 | `src/screens/Paywall/paywallPricing.ts::currencyFractionDigits` | 有 |
| C-ST-092 | P2 | `no10_settings.md` | 設定貨幣格式僅更新傳入的欄位、未傳入者不動 | `src/services/settingsLogic.ts::setCurrencyFormat` | 有 |
| C-ST-116 | P2 | `no10_settings.md` | 全量上傳在本機無 Settings 列時不執行 | `src/services/userService.ts::uploadAllPreferences` | 有 |
| C-TX-056 | P2 | `no4_transactions.md` | 連按運算子視為更正、不吃掉暫存運算元 | `src/hooks/useCalculator.ts::handleKey` | 有 |
| C-TX-057 | P2 | `no4_transactions.md` | 運算子後直接按等號時複製運算元 | `src/hooks/useCalculator.ts::handleKey` | 有 |
| C-TX-058 | P2 | `no4_transactions.md` | 連按等號重複上次運算 | `src/hooks/useCalculator.ts::handleKey` | 有 |
| C-TX-059 | P2 | `no4_transactions.md` | 重複等號套用到新輸入的數字 | `src/hooks/useCalculator.ts::handleKey` | 有 |
| C-TX-062 | P2 | `no4_transactions.md` | 載入既有金額後按退格再按數字鍵仍接續 | `src/hooks/useCalculator.ts::setValue` | 有 |
| C-TX-063 | P2 | `no4_transactions.md` | 等號後按退格進入編輯、數字鍵接續 | `src/hooks/useCalculator.ts::handleKey` | 有 |
| C-TX-064 | P2 | `no4_transactions.md` | 等號後直接按數字鍵起新數字 | `src/hooks/useCalculator.ts::handleKey` | 有 |
| C-UI-062 | P2 | `no14_shared_ui.md` | 空狀態未指定圖示時採預設放大鏡 | `src/components/list/ListEmptyState.tsx` | 有 |
| C-UI-063 | P2 | `no14_shared_ui.md` | 空狀態圖示傳空值時不渲染圖示 | `src/components/list/ListEmptyState.tsx` | 有 |
| C-XF-103 | P2 | `no11_data_transfer.md` | 帳戶查無時幣別欄退回使用者主要貨幣 | `src/services/exportService.ts` | 有 |
<!-- /GENERATED:spec-gaps -->

---

## 統計

- 候選 205 條，佔全清單 1481 條的 14%
- 其中 108 條已有 jest 覆蓋、97 條無
- **P0 雙重缺口 17 條**：Spec 未載且無機器把關

### P0 雙重缺口清單

| 檢驗點 | 分冊 | 行為 |
| --- | --- | --- |
| C-DA-065 | `no12_data_sync.md` | 斷網下新增交易本機立即成功且畫面不卡 |
| C-EN-006 | `no3_entities_merge.md` | 帳戶與類別的軟刪採刪除戳記墓碑、列仍留在本機表內 |
| C-EN-078 | `no3_entities_merge.md` | 編輯模式儲存前找不到原記錄時中止、不做半套更新 |
| C-EN-123 | `no3_entities_merge.md` | 復原刪除類別依快照還原同一批交易、不重查 |
| C-EN-144 | `no3_entities_merge.md` | 復原刪除帳戶依快照還原同一批交易與轉帳、不重查 |
| C-EN-157 | `no3_entities_merge.md` | 帳戶合併軟刪模板指向來源帳戶的未刪定期排程 |
| C-EN-158 | `no3_entities_merge.md` | 類別合併軟刪模板指向來源類別的未刪定期排程 |
| C-EN-159 | `no3_entities_merge.md` | 合併的搬移、排程軟刪與來源軟刪於單一批次提交 |
| C-RC-043 | `no5_recurring.md` | 建立排程當下即補產生起始日至當前時刻之間已到期的實例 |
| C-RC-092 | `no5_recurring.md` | 結束日當日的實例照常產生、不因時刻先後被截掉 |
| C-SB-080 | `no2_subscription_quota.md` | 正式版建置一律走真實購買、不啟用模擬模式 |
| C-SB-081 | `no2_subscription_quota.md` | 正式版建置時模擬訂閱等級設定為無作用 |
| C-TX-065 | `no4_transactions.md` | 未按等號的算式於點完成時先結算再存檔 |
| C-TX-097 | `no4_transactions.md` | 跨幣別轉帳兩側未按等號的算式於點完成時各自結算 |
| C-UD-046 | `no13_undo.md` | 合併的復原不復活合併前已刪除的轉帳 |
| C-XC-012 | `no15_cross_cutting.md` | 復原倒數中殺掉 App 後被刪紀錄維持已刪態 |
| C-XF-013 | `no11_data_transfer.md` | 清除確認對話框點取消不執行清除、不寫入 |
