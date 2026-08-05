# 檢驗點：橫切

檢驗點清單分冊。欄位定義、自檢方式與全冊索引見 `../no0_index.md`。

- 域碼：C-XC
- 涵蓋：跨實體儲存不變式、殺掉重開的狀態恢復、時區與跨日語意
- 不收：無單一歸屬以外的跨域後果。前一版橫切冊的跨域交互段已由各功能域分冊承載，此處不重列
- 不收：已由功能域分冊收下的單域行為。金額值域驗證歸 `no4_transactions` 與 `no14_shared_ui`、補產生冪等與截止點歸 `no5_recurring`、匯入日期解析與匯出時間欄歸 `no11_data_transfer`

---

## 資料模型：審計欄與軟刪墓碑

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-XC-001 | 六個可軟刪資料表皆備 `deletedOn` 欄 | DB | T2 | P0 | `no1_data_models` | `src/database/schema.ts` | 已登入且六表皆有紀錄 | — | — | 現役 |
| C-XC-002 | Settings 與 CurrencyConfig 兩表無 `deletedOn` 欄、不參與軟刪 | DB | T2 | P2 | `no1_data_models` | `src/database/schema.ts` | 已登入 | — | — | 現役 |
| C-XC-003 | 刪除的紀錄仍留在本機資料表、僅以 `deletedOn` 標記 | DB | T2 | P0 | `no23_local_database_logic` | `src/database/models/SoftDeletableModel.ts` | 刪一筆交易 | — | — | 現役 |
| C-XC-004 | 軟刪同時寫入 `deletedOn` 並前移 `updatedOn` | DB | T2 | P0 | `no1_data_models` | `src/utils/auditStamp.ts::stampSoftDelete` | 刪一筆交易 | — | `src/services/auditStamp.guard.test.ts`（stampSoftDelete 同時設 deletedOn 與 updatedOn） | 現役 |
| C-XC-005 | 復原刪除清空 `deletedOn` 並前移 `updatedOn` | DB | T2 | P0 | `no1_data_models` | `src/utils/auditStamp.ts::stampRestore` | 刪一筆後點復原 | — | `src/services/auditStamp.guard.test.ts`（stampRestore 清 deletedOn 並 bump updatedOn） | 現役 |
| C-XC-006 | 任何寫入路徑皆前移 `updatedOn`、使該列落進增量上傳窗 | DB | T2 | P0 | `no1_data_models` | `src/utils/auditStamp.ts::stampUpdate` | 改一筆既有紀錄 | — | `src/services/auditStamp.guard.test.ts`（stampUpdate 只 bump updatedOn） | 現役 |
| C-XC-007 | 可軟刪六表的 `createdAt` 建立後不再變動 | DB | T2 | P2 | `no1_data_models` | `src/database/models/SoftDeletableModel.ts` | 建立後再改同一筆 | — | — | 現役 |

---

## 資料模型：金額與時間標準

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-XC-008 | 金額欄以固定倍率縮放為整數存放、不隨幣別變動 | DB | T2 | P0 | `no1_data_models` | `src/utils/currencyUtils.ts::toStorageAmount` | 不同小數位幣別各記一筆 | — | — | 現役 |
| C-XC-009 | 縮放整數上限為系統安全整數上界 | DB | T4 | P2 | `no1_data_models` | `src/utils/currencyUtils.ts::MAX_STORAGE_AMOUNT` | 不適用 | 上界值無法經正常輸入觸達 | `src/utils/currencyUtils.storageMax.test.ts`（MAX_STORAGE_AMOUNT stays within JS safe-integer range） | 現役 |
| C-XC-010 | 金額輸入位數上限確保縮放後不超上界 | UI | T1 | P1 | `no1_data_models` | `src/utils/currencyUtils.ts::maxDisplayAmount` | 已登入 | — | `src/utils/currencyUtils.storageMax.test.ts`（the capped input encodes within MAX_STORAGE_AMOUNT） | 現役 |
| C-XC-011 | 所有時間欄位存 UTC Unix 毫秒時間戳 | DB | T2 | P2 | `no1_data_models` | `src/utils/timeHelper.ts::getCurrentTimestamp` | 已登入並建任一紀錄 | — | — | 現役 |

---

## 邏輯：殺掉重開的狀態恢復

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-XC-012 | 復原倒數中殺掉 App 後被刪紀錄維持已刪態 | DB | T2 | P0 | — | `src/contexts/UndoContext.tsx::UndoProvider` | 刪一筆後倒數中殺 App 重開 | — | — | 現役 |
| C-XC-013 | 復原倒數中殺掉 App 後復原列不重現 | UI | T1 | P1 | — | `src/contexts/UndoContext.tsx::UndoProvider` | 刪一筆後倒數中殺 App 重開 | — | — | 現役 |
| C-XC-014 | 匯入送出前殺掉 App 後無新增的帳戶與類別紀錄 | DB | T2 | P1 | `no21_data_transfer_logic` | `src/screens/Settings/ImportScreen.tsx` | 走到預覽步驟殺 App 重開 | — | — | 現役 |
| C-XC-015 | 匯入新建的帳戶與類別收進單一批次寫入 | DB | T4 | P1 | — | `src/services/importService.ts::executeImport` | 不適用 | 需觀察交易邊界、無畫面判準 | — | 現役 |
| C-XC-016 | 匯入的交易逐列寫入，中途殺 App 後已寫入列保留、其餘不補 | DB | T3 | P1 | `no21_data_transfer_logic` | `src/services/importService.ts::executeImport` | 匯入大檔並於寫入中殺 App | — | — | 現役 |
| C-XC-017 | 匯入完成對話框出現後殺 App，紀錄筆數與對話框摘要一致 | DB | T2 | P1 | `no21_data_transfer_logic` | `src/screens/Settings/ImportScreen.tsx` | 匯入完成對話框出現時殺 App | — | — | 現役 |
| C-XC-018 | 編輯器填寫中殺 App 後不留未存檔的紀錄 | DB | T2 | P1 | `no5_transaction_editor_screen` | `src/screens/Transactions/TransactionEditorScreen.tsx` | 編輯器填一半殺 App 重開 | — | — | 現役 |
| C-XC-019 | 備份上傳中殺 App 後同步水位不前移 | DB | T2 | P0 | `no19_transaction_backup_logic` | `src/services/syncEngine.ts::markSynced` | 備份中殺 App 重開後對賬 sqlite | — | — | 現役 |
| C-XC-020 | 備份中斷後重開自未前移的水位重傳中斷區間 | FB | T2 | P0 | `no19_transaction_backup_logic` | `src/services/syncEngine.ts::runSync` | 備份中殺 App 重開後再備份 | — | — | 現役 |
| C-XC-021 | 首頁篩選三值變更後殺 App 重開仍保留 | UI | T1 | P1 | `no22_home_period_state_logic` | `src/contexts/HomeFilterContext.tsx::HomeFilterProvider` | 改首頁篩選後殺 App 重開 | — | — | 現役 |

---

## 邏輯：時區與跨日語意

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-XC-022 | 期間邊界指派依所選時區換算，同一紀錄換時區後可落在不同期 | UI | T1 | P0 | `no22_home_period_state_logic` | `src/utils/timeHelper.ts::deriveNavigableOffsets` | 改時區後看同一紀錄落在哪期 | — | `src/utils/timeHelper.deriveNavigableOffsets.test.ts`（boundary assignment is timezone-aware (same inputs, different zone)） | 現役 |
| C-XC-023 | 時區設定值非法時退回裝置時區、期間推導不中斷 | UI+LOG | T3 | P2 | — | `src/utils/timeHelper.ts::safeToZonedTime` | sqlite 注入非法時區字串後重啟、對賬 `[timeHelper] Invalid timezone` | — | — | 現役 |
| C-XC-024 | 切換時區後重跑補產生不多產實例 | DB | T2 | P0 | `no10_recurring_transactions_logic` | `src/services/recurringLogic.ts::doGenerateMissingInstances` | 改時區後重啟並對賬實例筆數 | — | — | 現役 |
