# 檢驗點：交易與轉帳

檢驗點清單分冊。欄位定義、自檢方式與全冊索引見 `../no0_index.md`。

- 域碼：C-TX
- 涵蓋：交易編輯器、轉帳編輯器、計算機鍵盤與運算、交易與轉帳核心邏輯、兩表欄位

---

## 資料模型：Transactions 表

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-TX-001 | 交易 `accountId` 與 `categoryId` 皆為必填 | DB | T2 | P0 | `no1_data_models` | `src/database/schema.ts` | 已建交易 | — | — | 現役 |
| C-TX-002 | 交易金額以固定倍率縮放的整數儲存、與幣別無關 | DB | T2 | P0 | `no1_data_models` | `src/utils/currencyUtils.ts::encodeStorageAmount` | 已建交易 | — | `src/services/transactionLogic.test.ts`（uses the SAME ×10000 scale regardless of magnitude (currency-independent)） | 現役 |
| C-TX-003 | 交易 `date` 為使用者可編輯的發生日 | UI | T1 | P1 | `no1_data_models` | `src/components/EditorDateRecurringRow.tsx` | 進交易編輯器 | — | — | 現役 |
| C-TX-004 | 交易備註達 200 字元上限時輸入不再更新 | UI | T1 | P2 | `no1_data_models` | `src/constants/limits.ts::NOTE_MAX_LENGTH` | 進交易編輯器 | — | — | 現役 |
| C-TX-005 | 交易備註寫入時去除前後空白 | DB | T2 | P2 | `no1_data_models` | `src/database/models/Transaction.ts` | 備註前後帶空白後存檔 | — | — | 現役 |
| C-TX-006 | 排程產生的交易寫入 `scheduleId` 與 `scheduleInstanceDate` | DB | T3 | P1 | `no1_data_models` | `src/services/recurringLogic.ts` | 已有排程且跨過實例時刻 | — | — | 現役 |
| C-TX-007 | 手動建立的交易 `scheduleId` 為 Null | DB | T2 | P2 | `no1_data_models` | `src/services/transactionLogic.ts::createTransaction` | 手動新增一筆交易 | — | — | 現役 |

---

## 資料模型：Transfers 表

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-TX-008 | 轉帳 `accountFromId` 與 `accountToId` 皆為必填 | DB | T2 | P0 | `no1_data_models` | `src/database/schema.ts` | 已建轉帳 | — | — | 現役 |
| C-TX-009 | 轉出與轉入金額各自以固定倍率縮放的整數儲存、與幣別無關 | DB | T2 | P0 | `no1_data_models` | `src/database/models/Transfer.ts` | 已建轉帳 | — | — | 現役 |
| C-TX-010 | `impliedRate` 存主單位對主單位匯率 | DB | T2 | P1 | `no1_data_models` | `src/database/models/Transfer.ts` | 已建跨幣別轉帳 | — | — | 現役 |
| C-TX-011 | `impliedRate` 同步至雲端時欄名轉 `impliedRateScaled` | FB | T2 | P1 | `no1_data_models` | `src/services/syncEngine.ts` | 已建跨幣別轉帳並上傳 | — | — | 現役 |
| C-TX-012 | 轉帳備註達 200 字元上限時輸入不再更新 | UI | T1 | P2 | `no1_data_models` | `src/constants/limits.ts::NOTE_MAX_LENGTH` | 進轉帳編輯器 | — | — | 現役 |
| C-TX-013 | 轉帳備註寫入時去除前後空白 | DB | T2 | P2 | `no1_data_models` | `src/database/models/Transfer.ts` | 備註前後帶空白後存檔 | — | — | 現役 |
| C-TX-014 | 手動建立的轉帳 `scheduleId` 為 Null | DB | T2 | P2 | `no1_data_models` | `src/services/transferLogic.ts::createTransfer` | 手動新增一筆轉帳 | — | — | 現役 |

---

## 畫面：交易編輯器

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-TX-015 | 交易編輯器標題依型別顯示支出或收入 | UI | T1 | P1 | `no5_transaction_editor_screen` | `src/screens/Transactions/TransactionEditorScreen.tsx::getTitle` | 分別開支出與收入編輯器 | — | — | 現役 |
| C-TX-016 | 交易編輯器必填欄位未填妥時完成按鈕不可點按 | UI | T1 | P1 | `no5_transaction_editor_screen` | `src/screens/Transactions/TransactionEditorScreen.tsx` | 進新增交易留空金額 | — | — | 現役 |
| C-TX-017 | 交易編輯器日期選擇區採 Datetime 模式 | UI | T1 | P1 | `no5_transaction_editor_screen` | `src/components/EditorDateRecurringRow.tsx` | 進交易編輯器 | — | — | 現役 |
| C-TX-018 | 交易屬排程時定期切換按鈕呈啟用視覺 | UI | T1 | P1 | `no5_transaction_editor_screen` | `src/components/EditorDateRecurringRow.tsx` | 開啟排程產生的交易 | — | — | 現役 |
| C-TX-019 | 交易不屬排程時定期切換按鈕呈停用視覺 | UI | T1 | P1 | `no5_transaction_editor_screen` | `src/components/EditorDateRecurringRow.tsx` | 開啟一般交易 | — | — | 現役 |
| C-TX-020 | 點按定期切換按鈕切換定期設定區展開收合 | UI | T1 | P1 | `no5_transaction_editor_screen` | `src/screens/Transactions/TransactionEditorScreen.tsx` | 進交易編輯器 | — | — | 現役 |
| C-TX-021 | 定期設定區展開時嵌入定期選項元件 | UI | T1 | P1 | `no5_transaction_editor_screen` | `src/screens/Transactions/TransactionEditorScreen.tsx` | 展開定期設定區 | — | — | 現役 |
| C-TX-022 | 金額輸入框與其幣別標示由同一 group box 包住 | UI | T1 | P2 | `no5_transaction_editor_screen` | `src/screens/Transactions/TransactionEditorScreen.tsx` | 進交易編輯器 | — | — | 現役 |
| C-TX-023 | 交易編輯器金額達位數上限時輸入不再更新 | UI | T1 | P1 | `no5_transaction_editor_screen` | `src/hooks/useCalculator.ts::handleKey` | 進交易編輯器 | — | — | 現役 |
| C-TX-024 | 交易編輯器帳戶選擇器與類別選擇器並排 | UI | T1 | P2 | `no5_transaction_editor_screen` | `src/screens/Transactions/TransactionEditorScreen.tsx` | 進交易編輯器 | — | — | 現役 |
| C-TX-025 | 交易編輯模式顯示刪除按鈕 | UI | T1 | P1 | `no5_transaction_editor_screen` | `src/screens/Transactions/TransactionEditorScreen.tsx` | 開啟既有交易 | — | — | 現役 |
| C-TX-026 | 金額輸入框聚焦時顯示計算機鍵盤 | UI | T1 | P1 | `no5_transaction_editor_screen` | `src/screens/Transactions/TransactionEditorScreen.tsx::handleAmountFocus` | 進交易編輯器點金額 | — | — | 現役 |
| C-TX-027 | 備註輸入框聚焦時收起計算機鍵盤並浮現系統鍵盤 | UI | T1 | P1 | `no5_transaction_editor_screen` | `src/screens/Transactions/TransactionEditorScreen.tsx::handleNoteFocus` | 點備註輸入框 | — | — | 現役 |
| C-TX-028 | 交易編輯模式進入時依當前內容顯示各欄位 | UI | T1 | P1 | `no5_transaction_editor_screen` | `src/screens/Transactions/TransactionEditorScreen.tsx::loadTransaction` | 開啟既有交易 | — | — | 現役 |
| C-TX-029 | 開啟既有收入交易時型別維持收入、原樣存回金額仍為正 | UI+DB | T2 | P0 | `no5_transaction_editor_screen` | `src/screens/Transactions/TransactionEditorScreen.tsx::loadTransaction` | 已有一筆收入交易 | — | — | 現役 |
| C-TX-030 | 交易屬排程時定期規則帶入該排程頻率間隔結束日 | UI | T1 | P1 | `no5_transaction_editor_screen` | `src/screens/Transactions/TransactionEditorScreen.tsx::loadTransaction` | 開啟排程產生的交易 | — | — | 現役 |
| C-TX-031 | 交易不屬排程時定期規則為空 | UI | T1 | P1 | `no5_transaction_editor_screen` | `src/screens/Transactions/TransactionEditorScreen.tsx::loadTransaction` | 開啟一般交易 | — | — | 現役 |
| C-TX-032 | 新增交易時定期規則為空 | UI | T1 | P1 | `no5_transaction_editor_screen` | `src/screens/Transactions/TransactionEditorScreen.tsx` | 進新增交易 | — | — | 現役 |
| C-TX-033 | 交易編輯器定期設定區預設為收合 | UI | T1 | P1 | `no5_transaction_editor_screen` | `src/screens/Transactions/TransactionEditorScreen.tsx` | 進交易編輯器 | — | — | 現役 |
| C-TX-034 | 交易編輯器金額輸入框預設聚焦 | UI | T1 | P1 | `no5_transaction_editor_screen` | `src/screens/Transactions/TransactionEditorScreen.tsx` | 進交易編輯器 | — | — | 現役 |
| C-TX-139 | 交易編輯器新增模式日期欄預設為今天 | UI | T1 | P1 | `no2_home_screen` | `src/screens/Transactions/TransactionEditorScreen.tsx` | 已有可用帳戶與類別 | — | — | 現役 |
| C-TX-140 | 轉帳編輯器新增模式日期欄預設為今天 | UI | T1 | P1 | `no2_home_screen` | `src/screens/Transactions/TransferEditorScreen.tsx` | 已有兩個以上可用帳戶 | — | — | 現役 |

---

## 畫面：定期設定區結束日選擇器

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-TX-035 | 定期結束日載入完成後補同步至結束日選擇器 | UI | T4 | P1 | `no7_recurring_setting_screen` | `src/components/RecurringOptions.tsx` | 不適用 | 載入時序無法手動控制 | `src/components/RecurringOptions.test.tsx`（endOn async 載入後 picker 補同步） | 現役 |
| C-TX-036 | 載入後點按於指定日期回寫原結束日、不覆寫成今天 | UI | T1 | P1 | `no7_recurring_setting_screen` | `src/components/RecurringOptions.tsx` | 開啟有結束日的排程交易 | — | `src/components/RecurringOptions.test.tsx`（載入後再點「特定日期」回寫原 endOn、不覆寫成今天） | 現役 |
| C-TX-037 | 已手選結束日時稍後載入不覆蓋手選值 | UI | T4 | P1 | — | `src/components/RecurringOptions.tsx` | 不適用 | 載入時序無法手動控制 | `src/components/RecurringOptions.test.tsx`（使用者已手動選日，稍後載入不得蓋掉手選日期） | 現役 |

---

## 畫面：轉帳編輯器

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-TX-038 | 轉帳編輯器轉出金額輸入框預設聚焦 | UI | T1 | P1 | `no6_transfer_editor_screen` | `src/screens/Transactions/TransferEditorScreen.tsx` | 進轉帳編輯器 | — | — | 現役 |
| C-TX-039 | 點按轉出金額輸入框聚焦並顯示計算機鍵盤 | UI | T1 | P1 | `no6_transfer_editor_screen` | `src/screens/Transactions/TransferEditorScreen.tsx::handleFieldFocus` | 進轉帳編輯器 | — | — | 現役 |
| C-TX-040 | 跨幣別轉帳點按轉入金額輸入框可聚焦並顯示計算機鍵盤 | UI | T1 | P1 | `no6_transfer_editor_screen` | `src/screens/Transactions/TransferEditorScreen.tsx::handleFieldFocus` | 兩側選不同幣別帳戶 | — | — | 現役 |
| C-TX-041 | 同幣別轉帳點按轉入金額輸入框無反應 | UI | T1 | P1 | `no6_transfer_editor_screen` | `src/screens/Transactions/TransferEditorScreen.tsx` | 兩側選同幣別帳戶 | — | — | 現役 |
| C-TX-042 | 同幣別轉帳轉入金額自動跟隨轉出金額 | UI | T1 | P0 | `no6_transfer_editor_screen` | `src/screens/Transactions/TransferEditorScreen.tsx` | 兩側選同幣別帳戶 | — | — | 現役 |
| C-TX-043 | 同幣別轉帳轉入金額以次要色呈現停用態 | UI | T1 | P2 | `no6_transfer_editor_screen` | `src/screens/Transactions/TransferEditorScreen.tsx::getAmountColor` | 兩側選同幣別帳戶 | — | — | 現役 |
| C-TX-044 | 轉帳編輯器金額達位數上限時輸入不再更新 | UI | T1 | P1 | `no6_transfer_editor_screen` | `src/hooks/useCalculator.ts::handleKey` | 進轉帳編輯器 | — | — | 現役 |
| C-TX-045 | 轉出與轉入帳戶相同時帳戶 group box 外框轉錯誤狀態色 | UI | T1 | P1 | `no6_transfer_editor_screen` | `src/components/DualPickerBox.tsx` | 兩側選同一帳戶 | — | — | 現役 |
| C-TX-046 | 計算機按鍵結果即時顯示於聚焦的金額輸入框 | UI | T1 | P1 | `no6_transfer_editor_screen` | `src/screens/Transactions/TransferEditorScreen.tsx::handleCalculatorPress` | 進轉帳編輯器按數字 | — | — | 現役 |
| C-TX-047 | 轉帳編輯模式顯示刪除按鈕 | UI | T1 | P1 | `no6_transfer_editor_screen` | `src/screens/Transactions/TransferEditorScreen.tsx` | 開啟既有轉帳 | — | — | 現役 |

---

## 畫面：計算機鍵盤

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-TX-048 | 計算機鍵盤含數字鍵與小數點鍵 | UI | T1 | P1 | `no5_transaction_editor_screen` | `src/components/CalculatorKeypad.tsx` | 進交易編輯器 | — | — | 現役 |
| C-TX-049 | 計算機鍵盤含加減乘除與等號鍵 | UI | T1 | P1 | `no5_transaction_editor_screen` | `src/components/CalculatorKeypad.tsx` | 進交易編輯器 | — | — | 現役 |
| C-TX-050 | 計算機鍵盤含退格鍵 | UI | T1 | P1 | `no5_transaction_editor_screen` | `src/components/CalculatorKeypad.tsx` | 進交易編輯器 | — | — | 現役 |

---

## 邏輯：計算機運算

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-TX-051 | 除以零得非有限值時清空回 0 | UI | T1 | P0 | — | `src/hooks/useCalculator.ts::compute` | 交易編輯器輸入除以 0 | — | `src/hooks/useCalculator.test.tsx`（除以零得 Infinity 時清空回 0、不留非有限值） | 現役 |
| C-TX-052 | 正常除法得正確結果 | UI | T1 | P1 | — | `src/hooks/useCalculator.ts::compute` | 交易編輯器算除法 | — | `src/hooks/useCalculator.test.tsx`（正常除法仍得正確結果） | 現役 |
| C-TX-053 | 首個運算子按下時顯示保留原數 | UI | T1 | P1 | — | `src/hooks/useCalculator.ts::handleKey` | 輸入數字後按加號 | — | `src/hooks/useCalculator.test.tsx`（首個運算子按下時顯示保留原數） | 現役 |
| C-TX-054 | 連鎖運算子按下即結算並顯示中間結果 | UI | T1 | P1 | — | `src/hooks/useCalculator.ts::handleKey` | 連續按兩次運算 | — | `src/hooks/useCalculator.test.tsx`（連鎖運算子按下即結算並顯示中間結果） | 現役 |
| C-TX-055 | 連鎖運算由左至右累計 | UI | T1 | P1 | — | `src/hooks/useCalculator.ts::handleKey` | 連續三段運算 | — | `src/hooks/useCalculator.test.tsx`（連鎖運算左到右累計） | 現役 |
| C-TX-056 | 連按運算子視為更正、不吃掉暫存運算元 | UI | T1 | P2 | — | `src/hooks/useCalculator.ts::handleKey` | 連按加號再按減號 | — | `src/hooks/useCalculator.test.tsx`（連按運算子視為更正、不吃掉暫存運算元） | 現役 |
| C-TX-057 | 運算子後直接按等號時複製運算元 | UI | T1 | P2 | — | `src/hooks/useCalculator.ts::handleKey` | 按加號後直接按等號 | — | `src/hooks/useCalculator.test.tsx`（運算子後直接 = 複製運算元） | 現役 |
| C-TX-058 | 連按等號重複上次運算 | UI | T1 | P2 | — | `src/hooks/useCalculator.ts::handleKey` | 完成一次運算後連按等號 | — | `src/hooks/useCalculator.test.tsx`（連按 = 重複上次運算） | 現役 |
| C-TX-059 | 重複等號套用到新輸入的數字 | UI | T1 | P2 | — | `src/hooks/useCalculator.ts::handleKey` | 運算後輸入新數字再按等號 | — | `src/hooks/useCalculator.test.tsx`（重複 = 套用到新輸入的數字） | 現役 |
| C-TX-060 | 除零後重複等號時記憶一併清空、不重播壞運算 | UI | T1 | P1 | — | `src/hooks/useCalculator.ts::resetAll` | 除以 0 後按等號 | — | `src/hooks/useCalculator.test.tsx`（除零後重複 = 記憶一併清空、不重播壞運算） | 現役 |
| C-TX-061 | 載入既有金額後按數字鍵為接續、不取代 | UI | T1 | P1 | — | `src/hooks/useCalculator.ts::setValue` | 開啟既有交易後按數字 | — | `src/hooks/useCalculator.test.tsx`（載入既有值後數字鍵接續不取代） | 現役 |
| C-TX-062 | 載入既有金額後按退格再按數字鍵仍接續 | UI | T1 | P2 | — | `src/hooks/useCalculator.ts::setValue` | 開啟既有交易按退格再按數字 | — | `src/hooks/useCalculator.test.tsx`（載入既有值後 ⌫ 再數字鍵接續） | 現役 |
| C-TX-063 | 等號後按退格進入編輯、數字鍵接續 | UI | T1 | P2 | — | `src/hooks/useCalculator.ts::handleKey` | 運算後按退格再按數字 | — | `src/hooks/useCalculator.test.tsx`（= 後 ⌫ 進入編輯、數字鍵接續） | 現役 |
| C-TX-064 | 等號後直接按數字鍵起新數字 | UI | T1 | P2 | — | `src/hooks/useCalculator.ts::handleKey` | 運算後直接按數字 | — | `src/hooks/useCalculator.test.tsx`（= 後直接數字鍵仍起新數字） | 現役 |
| C-TX-065 | 未按等號的算式於點完成時先結算再存檔 | UI+DB | T2 | P0 | — | `src/hooks/useCalculator.ts::flush` | 交易編輯器輸入 5 加 3 後直接點完成 | — | — | 現役 |
| C-TX-066 | 幣別小數位為 0 時小數點鍵無作用 | UI | T1 | P2 | — | `src/hooks/useCalculator.ts::handleKey` | 帳戶幣別小數位設為 0 | — | — | 現役 |
| C-TX-067 | 小數位達幣別上限時後續數字鍵不更新 | UI | T1 | P2 | — | `src/hooks/useCalculator.ts::handleKey` | 帳戶幣別小數位設為 2 | — | — | 現役 |
| C-TX-068 | 運算結果依幣別小數位四捨五入 | UI | T1 | P2 | — | `src/hooks/useCalculator.ts::compute` | 帳戶幣別小數位設為 0 | — | — | 現役 |

---

## 邏輯：交易編輯器存檔與刪除分流

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-TX-069 | 排程交易全部欄位與規則皆未變時不寫入直接返回 | UI+DB | T2 | P1 | `no5_transaction_editor_screen` | `src/screens/Transactions/TransactionEditorScreen.tsx::handleSave` | 開啟排程交易不改任何欄位點完成 | — | — | 現役 |
| C-TX-070 | 排程交易未變時不顯示定期編輯模式對話框 | UI | T1 | P1 | `no5_transaction_editor_screen` | `src/screens/Transactions/TransactionEditorScreen.tsx::handleSave` | 開啟排程交易不改點完成 | — | — | 現役 |
| C-TX-071 | 交易定期規則清空視同與開啟時相同 | UI | T1 | P1 | `no5_transaction_editor_screen` | `src/screens/Transactions/TransactionEditorScreen.tsx::handleSave` | 開啟排程交易關掉定期後點完成 | — | — | 現役 |
| C-TX-072 | 交易定期規則變動時對話框僅提供此筆及未來 | UI | T1 | P1 | `no5_transaction_editor_screen` | `src/screens/Transactions/showRecurringModeDialog.ts::showRecurringModeDialog` | 開啟排程交易改頻率後點完成 | — | — | 現役 |
| C-TX-073 | 交易定期規則變動時對話框訊息說明僅能套用至此筆及未來 | UI | T1 | P1 | `no5_transaction_editor_screen` | `src/screens/Transactions/TransactionEditorScreen.tsx::handleSave` | 開啟排程交易改頻率後點完成 | — | — | 現役 |
| C-TX-074 | 交易僅一般欄位變動時對話框提供僅此一筆與此筆及未來 | UI | T1 | P1 | `no5_transaction_editor_screen` | `src/screens/Transactions/showRecurringModeDialog.ts::showRecurringModeDialog` | 開啟排程交易改金額後點完成 | — | — | 現役 |
| C-TX-075 | 交易選擇任一定期編輯模式後呼叫更新排程 | UI+DB | T2 | P0 | `no5_transaction_editor_screen` | `src/services/recurringLogic.ts::updateSchedule` | 開啟排程交易改金額後選模式 | — | — | 現役 |
| C-TX-076 | 一般交易設定定期規則後新增模式建立排程 | UI+DB | T2 | P0 | `no5_transaction_editor_screen` | `src/services/recurringLogic.ts::createSchedule` | 新增交易並開定期後點完成 | — | — | 現役 |
| C-TX-077 | 一般交易設定定期規則後編輯模式轉為排程 | UI+DB | T2 | P0 | `no5_transaction_editor_screen` | `src/services/recurringLogic.ts::convertToSchedule` | 開啟一般交易開定期後點完成 | — | — | 現役 |
| C-TX-078 | 免費帳號未超上限時新增交易經配額閘控放行並寫入 | UI+DB | T2 | P1 | `no5_transaction_editor_screen` | `src/services/subscriptionGateLogic.ts::canUserPerformAction` | 免費帳號且帳戶與類別數未超免費上限 | — | — | 現役 |
| C-TX-079 | 新增交易遭配額禁止時導向付費牆且不寫入 | UI+DB | T3 | P1 | `no5_transaction_editor_screen` | `src/services/subscriptionGateLogic.ts::canUserPerformAction` | 免費帳號經匯入使帳戶數超過免費上限 | — | — | 現役 |
| C-TX-080 | 編輯一般交易點完成呼叫更新交易 | UI+DB | T2 | P0 | `no5_transaction_editor_screen` | `src/services/transactionLogic.ts::updateTransaction` | 開啟一般交易改金額後點完成 | — | — | 現役 |
| C-TX-081 | 交易編輯器寫入成功後顯示復原列並返回上一頁 | UI | T1 | P1 | `no5_transaction_editor_screen` | `src/screens/Transactions/TransactionEditorScreen.tsx::handleSave` | 新增一筆交易 | — | — | 現役 |
| C-TX-082 | 交易編輯器寫入失敗時顯示錯誤提示 | UI | T4 | P2 | `no5_transaction_editor_screen` | `src/screens/Transactions/TransactionEditorScreen.tsx::handleSave` | 不適用 | 寫入失敗無手動入口 | — | 現役 |
| C-TX-083 | 刪除排程交易顯示定期刪除模式對話框 | UI | T1 | P1 | `no5_transaction_editor_screen` | `src/screens/Transactions/TransactionEditorScreen.tsx::handleDelete` | 開啟排程交易點刪除 | — | — | 現役 |
| C-TX-084 | 交易選擇任一定期刪除模式後呼叫刪除排程 | UI+DB | T2 | P0 | `no5_transaction_editor_screen` | `src/services/recurringLogic.ts::deleteSchedule` | 開啟排程交易點刪除選模式 | — | — | 現役 |
| C-TX-085 | 刪除一般交易顯示刪除確認對話框 | UI | T1 | P1 | `no5_transaction_editor_screen` | `src/screens/Transactions/TransactionEditorScreen.tsx::handleDelete` | 開啟一般交易點刪除 | — | — | 現役 |
| C-TX-086 | 確認刪除一般交易後呼叫刪除交易 | UI+DB | T2 | P0 | `no5_transaction_editor_screen` | `src/services/transactionLogic.ts::deleteTransaction` | 開啟一般交易確認刪除 | — | — | 現役 |
| C-TX-087 | 交易編輯器刪除成功後顯示復原列並返回上一頁 | UI | T1 | P1 | `no5_transaction_editor_screen` | `src/screens/Transactions/TransactionEditorScreen.tsx::handleDelete` | 刪除一筆交易 | — | — | 現役 |

---

## 邏輯：轉帳編輯器存檔與刪除分流

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-TX-088 | 排程轉帳全部欄位與規則皆未變時不寫入直接返回 | UI+DB | T2 | P1 | `no6_transfer_editor_screen` | `src/screens/Transactions/TransferEditorScreen.tsx::handleSave` | 開啟排程轉帳不改任何欄位點完成 | — | — | 現役 |
| C-TX-089 | 排程轉帳未變時不顯示定期編輯模式對話框 | UI | T1 | P1 | `no6_transfer_editor_screen` | `src/screens/Transactions/TransferEditorScreen.tsx::handleSave` | 開啟排程轉帳不改點完成 | — | — | 現役 |
| C-TX-090 | 轉帳定期規則清空視同與開啟時相同 | UI | T1 | P1 | `no6_transfer_editor_screen` | `src/screens/Transactions/TransferEditorScreen.tsx::handleSave` | 開啟排程轉帳關掉定期後點完成 | — | — | 現役 |
| C-TX-091 | 排程轉帳定期規則變動時對話框僅提供此筆及未來 | UI | T1 | P1 | `no6_transfer_editor_screen` | `src/screens/Transactions/TransferEditorScreen.tsx::handleSave` | 開啟排程轉帳改頻率後點完成 | — | — | 現役 |
| C-TX-092 | 轉帳定期規則變動時對話框訊息說明僅能套用至此筆及未來 | UI | T1 | P1 | `no6_transfer_editor_screen` | `src/screens/Transactions/TransferEditorScreen.tsx::handleSave` | 開啟排程轉帳改頻率後點完成 | — | — | 現役 |
| C-TX-093 | 轉帳僅一般欄位變動時對話框提供僅此一筆與此筆及未來 | UI | T1 | P1 | `no6_transfer_editor_screen` | `src/screens/Transactions/showRecurringModeDialog.ts::showRecurringModeDialog` | 開啟排程轉帳改金額後點完成 | — | — | 現役 |
| C-TX-094 | 轉帳選擇任一定期編輯模式後呼叫更新排程 | UI+DB | T2 | P0 | `no6_transfer_editor_screen` | `src/services/recurringLogic.ts::updateSchedule` | 開啟排程轉帳改金額後選模式 | — | — | 現役 |
| C-TX-095 | 一般轉帳設定定期規則後新增模式建立排程 | UI+DB | T2 | P0 | `no6_transfer_editor_screen` | `src/services/recurringLogic.ts::createSchedule` | 新增轉帳並開定期後點完成 | — | — | 現役 |
| C-TX-096 | 一般轉帳設定定期規則後編輯模式轉為排程 | UI+DB | T2 | P0 | `no6_transfer_editor_screen` | `src/services/recurringLogic.ts::convertToSchedule` | 開啟一般轉帳開定期後點完成 | — | — | 現役 |
| C-TX-097 | 跨幣別轉帳兩側未按等號的算式於點完成時各自結算 | UI+DB | T2 | P0 | — | `src/screens/Transactions/TransferEditorScreen.tsx::handleSave` | 兩側選不同幣別帳戶且各輸入算式 | — | — | 現役 |
| C-TX-098 | 免費帳號未超上限時新增轉帳經配額閘控放行並寫入 | UI+DB | T2 | P1 | `no6_transfer_editor_screen` | `src/services/subscriptionGateLogic.ts::canUserPerformAction` | 免費帳號且帳戶與類別數未超免費上限 | — | — | 現役 |
| C-TX-099 | 新增轉帳遭配額禁止時導向付費牆且不寫入 | UI+DB | T3 | P1 | `no6_transfer_editor_screen` | `src/services/subscriptionGateLogic.ts::canUserPerformAction` | 免費帳號經匯入使帳戶數超過免費上限 | — | — | 現役 |
| C-TX-100 | 編輯一般轉帳點完成呼叫更新轉帳 | UI+DB | T2 | P0 | `no6_transfer_editor_screen` | `src/services/transferLogic.ts::updateTransfer` | 開啟一般轉帳改金額後點完成 | — | — | 現役 |
| C-TX-101 | 轉帳編輯器寫入成功後顯示復原列並返回上一頁 | UI | T1 | P1 | `no6_transfer_editor_screen` | `src/screens/Transactions/TransferEditorScreen.tsx::handleSave` | 新增一筆轉帳 | — | — | 現役 |
| C-TX-102 | 轉帳編輯器寫入失敗時顯示錯誤提示 | UI | T4 | P2 | `no6_transfer_editor_screen` | `src/screens/Transactions/TransferEditorScreen.tsx::handleSave` | 不適用 | 寫入失敗無手動入口 | — | 現役 |
| C-TX-103 | 刪除排程轉帳顯示定期刪除模式對話框 | UI | T1 | P1 | `no6_transfer_editor_screen` | `src/screens/Transactions/TransferEditorScreen.tsx::handleDelete` | 開啟排程轉帳點刪除 | — | — | 現役 |
| C-TX-104 | 轉帳選擇任一定期刪除模式後呼叫刪除排程 | UI+DB | T2 | P0 | `no6_transfer_editor_screen` | `src/services/recurringLogic.ts::deleteSchedule` | 開啟排程轉帳點刪除選模式 | — | — | 現役 |
| C-TX-105 | 刪除一般轉帳顯示刪除確認對話框 | UI | T1 | P1 | `no6_transfer_editor_screen` | `src/screens/Transactions/TransferEditorScreen.tsx::handleDelete` | 開啟一般轉帳點刪除 | — | — | 現役 |
| C-TX-106 | 確認刪除一般轉帳後呼叫刪除轉帳 | UI+DB | T2 | P0 | `no6_transfer_editor_screen` | `src/services/transferLogic.ts::deleteTransfer` | 開啟一般轉帳確認刪除 | — | — | 現役 |
| C-TX-107 | 轉帳編輯器刪除成功後顯示復原列並返回上一頁 | UI | T1 | P1 | `no6_transfer_editor_screen` | `src/screens/Transactions/TransferEditorScreen.tsx::handleDelete` | 刪除一筆轉帳 | — | — | 現役 |

---

## 邏輯：交易核心

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-TX-108 | 千分位模式啟用時輸入金額先乘一千 | DB | T2 | P0 | `no9_transaction_logic` | `src/services/transactionLogic.ts::normalizeTransactionAmount` | 幣別開啟千分位後記一筆 | — | `src/services/transactionLogic.test.ts`（multiplies rawInput by 1000 before the ×10000 scale） | 現役 |
| C-TX-109 | 支出型別金額取絕對值後轉為負值 | DB | T2 | P0 | `no9_transaction_logic` | `src/services/transactionLogic.ts::normalizeTransactionAmount` | 記一筆支出後對賬 | — | `src/services/transactionLogic.test.ts`（makes expense negative） | 現役 |
| C-TX-110 | 收入型別金額取絕對值維持正值 | DB | T2 | P0 | `no9_transaction_logic` | `src/services/transactionLogic.ts::normalizeTransactionAmount` | 記一筆收入後對賬 | — | `src/services/transactionLogic.test.ts`（makes income positive） | 現役 |
| C-TX-111 | 建立交易缺任一必填欄位時驗證失敗 | DB | T4 | P0 | `no9_transaction_logic` | `src/services/transactionLogic.ts::createTransaction` | 不適用 | 畫面已擋、無手動入口 | `src/services/validationGuards.test.ts`（R-TX-072 create rejects a missing required field） | 現役 |
| C-TX-112 | 建立交易金額等於 0 時驗證失敗 | DB | T4 | P0 | `no9_transaction_logic` | `src/services/transactionLogic.ts::createTransaction` | 不適用 | 畫面已擋、無手動入口 | `src/services/validationGuards.test.ts`（R-TX-073 create rejects a zero amount） | 現役 |
| C-TX-113 | 建立交易金額超出可儲存範圍時驗證失敗 | DB | T3 | P1 | `no9_transaction_logic` | `src/services/transactionLogic.ts::createTransaction` | 經匯入注入超界金額 | — | — | 現役 |
| C-TX-114 | 更新交易的必填與金額驗證與建立一致 | DB | T4 | P0 | `no9_transaction_logic` | `src/services/transactionLogic.ts::updateTransaction` | 不適用 | 畫面已擋、無手動入口 | `src/services/validationGuards.test.ts`（R-TX-077 update rejects a zero amount） | 現役 |
| C-TX-115 | 更新交易未帶排程欄位時保留記錄原值 | DB | T2 | P0 | `no9_transaction_logic` | `src/services/transactionLogic.ts::updateTransaction` | 編輯排程產生的交易後對賬 | — | `src/services/transactionLogic.updateSchedule.test.ts`（R-TX-081: 未帶排程欄位（一般編輯）時保留既有 schedule 連結） | 現役 |
| C-TX-116 | 更新交易有帶排程欄位才改寫該欄 | DB | T2 | P0 | `no9_transaction_logic` | `src/services/transactionLogic.ts::updateTransaction` | 一般交易轉排程後對賬 | — | `src/services/transactionLogic.updateSchedule.test.ts`（R-TX-081: 帶排程欄位時改寫 scheduleId 與 scheduleInstanceDate） | 現役 |
| C-TX-117 | 刪除交易採軟刪除、不實體刪列 | DB | T2 | P0 | `no9_transaction_logic` | `src/services/transactionLogic.ts::deleteTransaction` | 刪一筆交易後對賬 | — | — | 現役 |

---

## 邏輯：轉帳核心

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-TX-118 | 建立轉帳缺任一必填欄位時驗證失敗 | DB | T4 | P0 | `no8_transfer_logic` | `src/services/transferLogic.ts::createTransfer` | 不適用 | 畫面已擋、無手動入口 | `src/services/validationGuards.test.ts`（R-TX-083 create rejects a missing required field） | 現役 |
| C-TX-119 | 建立轉帳兩側金額任一未大於 0 時驗證失敗 | DB | T4 | P0 | `no8_transfer_logic` | `src/services/transferLogic.ts::createTransfer` | 不適用 | 畫面已擋、無手動入口 | `src/services/validationGuards.test.ts`（R-TX-084 create rejects a non-positive amount） | 現役 |
| C-TX-120 | 建立轉帳金額超出可儲存範圍時驗證失敗 | DB | T3 | P1 | `no8_transfer_logic` | `src/services/transferLogic.ts::createTransfer` | 經匯入注入超界金額 | — | — | 現役 |
| C-TX-121 | 建立轉帳兩側帳戶相同時驗證失敗 | DB | T4 | P0 | `no8_transfer_logic` | `src/services/transferLogic.ts::createTransfer` | 不適用 | 畫面已擋、無手動入口 | `src/services/validationGuards.test.ts`（R-TX-086 create rejects the same account on both legs） | 現役 |
| C-TX-122 | 更新轉帳的必填、金額與同帳戶驗證與建立一致 | DB | T4 | P0 | `no8_transfer_logic` | `src/services/transferLogic.ts::updateTransfer` | 不適用 | 畫面已擋、無手動入口 | `src/services/validationGuards.test.ts`（R-TX-099 update rejects the same account on both legs） | 現役 |
| C-TX-123 | 跨幣別轉帳隱含匯率為轉入除以轉出 | DB | T2 | P0 | `no8_transfer_logic` | `src/services/transferLogic.ts::createTransfer` | 建跨幣別轉帳後對賬 | — | — | 現役 |
| C-TX-124 | 同幣別轉帳 `impliedRate` 為空值 | DB | T2 | P0 | `no8_transfer_logic` | `src/services/transferLogic.ts::createTransfer` | 建同幣別轉帳後對賬 | — | — | 現役 |
| C-TX-125 | 同幣別轉帳不補錄任何匯率記錄 | DB | T2 | P0 | `no8_transfer_logic` | `src/services/transferLogic.ts::createTransfer` | 建同幣別轉帳後查匯率表 | — | `src/services/transferLogic.test.ts`（writes no rate row for a same-currency transfer） | 現役 |
| C-TX-126 | 跨幣別任一幣別碼無法解析時中止全部寫入 | DB | T3 | P0 | `no8_transfer_logic` | `src/services/transferLogic.ts::createTransfer` | sqlite 注入未知幣別碼帳戶 | — | `src/services/transferLogic.test.ts`（aborts with INVALID_CURRENCY for an unknown currency and writes no rate row） | 現役 |
| C-TX-127 | 跨幣別轉帳補錄正向匯率記錄 | DB | T2 | P0 | `no8_transfer_logic` | `src/services/transferLogic.ts::createTransfer` | 建跨幣別轉帳後查匯率表 | — | `src/services/transferLogic.test.ts`（records the real numeric id for a currency outside the old switch (AED→784, not 901)） | 現役 |
| C-TX-128 | 跨幣別轉帳補錄反向匯率記錄、值為倒數 | DB | T2 | P0 | `no8_transfer_logic` | `src/services/transferLogic.ts::createTransfer` | 建跨幣別轉帳後查匯率表 | — | `src/services/transferLogic.test.ts`（records USD→JPY rate as the main-unit value (151.5), not 100× off） | 現役 |
| C-TX-129 | 補錄兩筆匯率生效時點皆為轉帳 `date` 值 | DB | T2 | P0 | `no8_transfer_logic` | `src/services/transferLogic.ts::createTransfer` | 建跨幣別轉帳後查匯率表 | — | — | 現役 |
| C-TX-130 | 更新轉帳以更新後金額重算隱含匯率 | DB | T2 | P0 | `no8_transfer_logic` | `src/services/transferLogic.ts::updateTransfer` | 改跨幣別轉帳金額後對賬 | — | — | 現役 |
| C-TX-131 | 隱含匯率變動時補錄新的正反兩筆匯率 | DB | T2 | P0 | `no8_transfer_logic` | `src/services/transferLogic.ts::updateTransfer` | 改跨幣別轉帳金額後查匯率表 | — | `src/services/transferLogic.test.ts`（改金額（隱含匯率變動）補錄正反兩筆匯率） | 現役 |
| C-TX-132 | 交易日期變動時補錄新的正反兩筆匯率 | DB | T2 | P0 | `no8_transfer_logic` | `src/services/transferLogic.ts::updateTransfer` | 改跨幣別轉帳日期後查匯率表 | — | `src/services/transferLogic.test.ts`（改日期補錄正反兩筆匯率） | 現役 |
| C-TX-133 | 幣別對變動時金額日期不變仍補錄新的正反兩筆匯率 | DB | T2 | P0 | `no8_transfer_logic` | `src/services/transferLogic.ts::updateTransfer` | 換對手帳戶到不同幣別後查匯率表 | — | `src/services/transferLogic.test.ts`（換幣別對（金額日期不變）補錄正反兩筆匯率） | 現役 |
| C-TX-134 | 金額日期帳戶皆未變動時不補錄匯率 | DB | T2 | P0 | `no8_transfer_logic` | `src/services/transferLogic.ts::updateTransfer` | 開啟跨幣別轉帳不改欄位存檔後查匯率表 | — | `src/services/transferLogic.test.ts`（帳戶、金額、日期皆未變動時不補錄匯率（方案 b 不過度 append）） | 現役 |
| C-TX-135 | 更新至未知幣別帳戶時中止、原記錄一欄不改 | DB | T3 | P0 | `no8_transfer_logic` | `src/services/transferLogic.ts::updateTransfer` | sqlite 注入未知幣別碼帳戶後改對手帳戶 | — | `src/services/transferLogic.test.ts`（R-TX-102: 改到未知幣別帳戶即 INVALID_CURRENCY 中止，transfer 未更新、零 rate row） | 現役 |
| C-TX-136 | 更新轉帳未帶排程欄位時保留記錄原值 | DB | T2 | P0 | `no8_transfer_logic` | `src/services/transferLogic.ts::updateTransfer` | 編輯排程產生的轉帳後對賬 | — | — | 現役 |
| C-TX-137 | 刪除轉帳採軟刪除、不實體刪列 | DB | T2 | P0 | `no8_transfer_logic` | `src/services/transferLogic.ts::deleteTransfer` | 刪一筆轉帳後對賬 | — | — | 現役 |
| C-TX-138 | 刪除轉帳不刪除任何已產生的匯率記錄 | DB | T2 | P1 | `no8_transfer_logic` | `src/services/transferLogic.ts::deleteTransfer` | 刪跨幣別轉帳後查匯率表 | — | — | 現役 |
