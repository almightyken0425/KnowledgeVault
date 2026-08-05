# 檢驗點：資料層與同步

> **機械跟進已完成，語意跟進未完成。** 69 條中 6 條已退場，重置本機資料整段改由清除所有資料承載。現役 63 條裡仍有 11 條寫著帳號語彙。跟進進度見索引。

檢驗點清單分冊。欄位定義、自檢方式與全冊索引見 `../no0_index.md`。

- 域碼：C-DA
- 涵蓋：本機查詢入口、重置本機資料、交易備份閘控與路由、備份上傳與水位、離線行為

---

## 邏輯：本機查詢入口

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-DA-001 | 本機資料庫保存所有曾登入帳號的資料 | DB | T3 | P1 | `no23_local_database_logic` | `src/services/localDbService.ts` | 兩測試帳號輪流登入後各建資料 | — | — | 現役 |
| C-DA-002 | 清單查詢一律以帳號限定範圍、不回其他帳號記錄 | DB | T3 | P0 | `no23_local_database_logic` | `src/services/localDbService.ts` | 雙帳號各建資料後切換 | — | `src/services/localDbService.test.ts`（never issues an unscoped selector query） | 現役 |
| C-DA-003 | 單筆帳戶與類別查詢查無記錄時回空值 | LOG | T4 | P2 | `no23_local_database_logic` | `src/services/localDbService.ts` | 不適用 | 單筆查詢無獨立操作入口 | — | 現役 |
| C-DA-004 | 單筆查詢不套帳號限定與軟刪停用排除 | LOG | T4 | P2 | `no23_local_database_logic` | `src/services/localDbService.ts` | 不適用 | 單筆查詢無獨立操作入口 | — | 現役 |
| C-DA-005 | 帳戶管理清單排除軟刪記錄、仍納入停用記錄 | UI+DB | T2 | P1 | `no23_local_database_logic` | `src/services/localDbService.ts::getAccounts` | 有停用與已刪帳戶各一 | — | — | 現役 |
| C-DA-006 | 帳戶管理清單依排序值遞增排列 | UI | T1 | P1 | `no23_local_database_logic` | `src/services/localDbService.ts::getAccounts` | 拖拉調整帳戶順序後重進 | — | — | 現役 |
| C-DA-007 | 帳戶選擇器清單排除軟刪與停用記錄 | UI+DB | T2 | P1 | `no23_local_database_logic` | `src/services/localDbService.ts::getAccountsForSelector` | 有停用與已刪帳戶各一時開選擇器 | — | `src/services/localDbService.test.ts`（getAccountsForSelector filters by the caller user_id） | 現役 |
| C-DA-008 | 帳戶選擇器清單依排序值遞增排列 | UI | T1 | P1 | `no23_local_database_logic` | `src/services/localDbService.ts::getAccountsForSelector` | 拖拉調整帳戶順序後開選擇器 | — | — | 現役 |
| C-DA-009 | 類別管理清單排除軟刪記錄、仍納入停用記錄 | UI+DB | T2 | P1 | `no23_local_database_logic` | `src/services/localDbService.ts::getCategories` | 有停用與已刪類別各一 | — | — | 現役 |
| C-DA-010 | 類別管理清單依排序值遞增排列 | UI | T1 | P1 | `no23_local_database_logic` | `src/services/localDbService.ts::getCategories` | 拖拉調整類別順序後重進 | — | — | 現役 |
| C-DA-011 | 類別選擇器清單排除軟刪與停用記錄 | UI+DB | T2 | P1 | `no23_local_database_logic` | `src/services/localDbService.ts::getCategoriesForSelector` | 有停用與已刪類別各一時開選擇器 | — | `src/services/localDbService.test.ts`（getCategoriesForSelector filters by the caller user_id） | 現役 |
| C-DA-012 | 類別選擇器清單依排序值遞增排列 | UI | T1 | P1 | `no23_local_database_logic` | `src/services/localDbService.ts::getCategoriesForSelector` | 拖拉調整類別順序後開選擇器 | — | — | 現役 |
| C-DA-013 | 搜尋只比對備註欄 | UI | T1 | P1 | `no4_search_screen` | `src/services/localDbService.ts::searchTransactions` | 記一筆備註與類別名不同的交易 | — | — | 現役 |
| C-DA-014 | 搜尋關鍵字內的百分號與底線視為字面字元 | UI | T1 | P2 | — | `src/services/localDbService.ts::escapeNoteSearchTerm` | 備註為 50%_off 與 50XYoff 各記一筆 | — | `src/services/localDbService.test.ts`（actually escapes "50%_off" — clause differs from the unescaped-naive form） | 現役 |
| C-DA-015 | 已軟刪的交易不列入搜尋結果 | UI | T1 | P1 | `no23_local_database_logic` | `src/services/localDbService.ts::searchTransactions` | 刪一筆帶關鍵字的交易後重搜 | — | `src/services/localDbService.test.ts`（%s carries user_id + deleted_on on the right table — searchTransactions 例） | 現役 |
| C-DA-016 | 已軟刪的轉帳不列入搜尋結果 | UI | T1 | P1 | `no23_local_database_logic` | `src/services/localDbService.ts::searchTransfers` | 刪一筆帶關鍵字的轉帳後重搜 | — | `src/services/localDbService.test.ts`（%s carries user_id + deleted_on on the right table — searchTransfers 例） | 現役 |

---

## 邏輯：重置本機資料

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-DA-017 | 重置資料軟刪全部具墓碑欄的資料表 | DB | T2 | P0 | `no23_local_database_logic` | `src/services/localDbService.ts::resetAllData` | 各表皆有資料後清除資料庫 | — | `src/services/localDbService.test.ts`（SOFT_DELETABLE_TABLES is exactly the schema tables carrying a deleted_on column） | 退場 |
| C-DA-018 | 重置資料僅標記當前帳號紀錄、不動其他帳號 | DB | T3 | P0 | `no23_local_database_logic` | `src/services/localDbService.ts::resetAllData` | 雙帳號各建資料後重置其一 | — | `src/services/localDbService.test.ts`（queries every soft-deletable table scoped to the caller user_id, never the rest） | 退場 |
| C-DA-019 | 重置資料採軟刪除、紀錄仍留在本機 | DB | T2 | P1 | `no23_local_database_logic` | `src/services/localDbService.ts::resetAllData` | 清除資料庫後對賬列是否仍在 | — | `src/services/localDbService.test.ts`（queries every soft-deletable table scoped to the caller user_id, never the rest） | 退場 |
| C-DA-020 | 重置資料的軟刪除傳播雲端刪除標記 | FB | T2 | P0 | `no23_local_database_logic` | `src/services/localDbService.ts::resetAllData` | 清除資料庫後備份再查 Firestore | — | — | 退場 |
| C-DA-021 | 重置資料不動使用者、設定、貨幣顯示三表 | DB | T2 | P1 | `no23_local_database_logic` | `src/services/localDbService.ts::resetAllData` | 清除資料庫後對賬三表 | — | `src/services/localDbService.test.ts`（SOFT_DELETABLE_TABLES is exactly the schema tables carrying a deleted_on column） | 退場 |
| C-DA-022 | 重置資料後主題與語系等偏好維持原值 | UI | T1 | P1 | `no23_local_database_logic` | `src/services/localDbService.ts::resetAllData` | 改過偏好後清除資料庫 | — | — | 現役 |

---

## 邏輯：備份閘控與路由

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-DA-023 | 備份為單向上傳、無取回介面 | FB | T2 | P1 | `no19_transaction_backup_logic` | `src/services/syncEngine.ts` | 手改 Firestore 後重啟 | — | — | 現役 |
| C-DA-024 | 備份不使用即時監聽 | LOG | T4 | P2 | `no19_transaction_backup_logic` | `src/services/syncEngine.ts` | 不適用 | 監聽與否無外顯判準 | — | 現役 |
| C-DA-025 | 備份不分訂閱等級一律執行、含免費帳號 | FB | T2 | P0 | `no19_transaction_backup_logic` | `src/services/runBackup.ts::runBackup` | 免費帳號記一筆後備份 | — | — | 現役 |
| C-DA-026 | 備份不受分析同意設定影響 | FB | T2 | P1 | `no19_transaction_backup_logic` | `src/services/runBackup.ts::runBackup` | 關閉分析同意後備份 | — | — | 現役 |
| C-DA-027 | 備份進行中的第二次觸發回同一次結果、不另起一輪上傳 | LOG | T4 | P1 | `no19_transaction_backup_logic` | `src/services/syncEngine.ts::syncEngine` | 不適用 | 並行時序無法手動構造 | `src/services/syncEngine.test.ts`（single-flight gate：in-flight 的第二次 sync() 拿到同一 promise、底層只跑一輪、完成後 lock 清空可重觸發） | 現役 |
| C-DA-028 | 備份成功跑完一輪後解除進行中旗標、可再次觸發 | LOG | T4 | P1 | `no19_transaction_backup_logic` | `src/services/syncEngine.ts::syncEngine` | 不適用 | 需觀察內部旗標、無畫面判準 | `src/services/syncEngine.test.ts`（single-flight gate：in-flight 的第二次 sync() 拿到同一 promise、底層只跑一輪、完成後 lock 清空可重觸發） | 現役 |
| C-DA-029 | 備份於閘控早退時解除進行中旗標、可再次觸發 | LOG | T4 | P1 | `no19_transaction_backup_logic` | `src/services/syncEngine.ts::syncEngine` | 不適用 | 需觀察內部旗標、無畫面判準 | — | 現役 |
| C-DA-030 | 備份拋錯時解除進行中旗標、可再次觸發 | LOG | T4 | P1 | — | `src/services/syncEngine.ts::syncEngine` | 不適用 | 需觀察內部旗標、無畫面判準 | — | 現役 |
| C-DA-031 | 無登入帳號時備份直接返回 | LOG | T2 | P1 | `no19_transaction_backup_logic` | `src/services/syncEngine.ts::runSync` | 登出態觸發備份後對賬 QA BACKUP skip reason=no_user | — | — | 現役 |
| C-DA-032 | 距上次備份起始未滿 5 分鐘時跳過 | LOG | T2 | P1 | `no19_transaction_backup_logic` | `src/services/syncEngine.ts::runSync` | 連續兩次觸發備份後對賬 QA BACKUP skip reason=cooldown | — | — | 現役 |
| C-DA-033 | 備份把本次起始時間記為裝置層級冷卻時間戳 | LOG | T2 | P1 | `no19_transaction_backup_logic` | `src/services/syncEngine.ts::runSync` | 觸發備份後對賬 QA BACKUP cooldownStamp | — | — | 現役 |
| C-DA-034 | 冷卻時間戳跨 App 重啟不重置 | LOG | T2 | P1 | `no19_transaction_backup_logic` | `src/services/syncEngine.ts::runSync` | 備份後立刻冷啟再觸發、對賬 QA BACKUP skip reason=cooldown | — | — | 現役 |
| C-DA-035 | 冷卻時間戳跨帳號切換不重置 | LOG | T3 | P1 | `no19_transaction_backup_logic` | `src/services/syncEngine.ts::runSync` | 備份後換帳號立刻觸發、對賬 QA BACKUP skip reason=cooldown | — | — | 現役 |
| C-DA-036 | 備份前委派配額檢查讀取寫入允許旗標 | LOG | T2 | P1 | `no19_transaction_backup_logic` | `src/services/syncEngine.ts::runSync` | 觸發備份後對賬 QA QUOTA gate | — | — | 現役 |
| C-DA-037 | 寫入禁止時整段跳過本次上傳 | LOG | T4 | P1 | `no19_transaction_backup_logic` | `src/services/syncEngine.ts::runSync` | 不適用 | 配額耗盡狀態無法手動佈置 | `src/services/syncEngine.test.ts`（skips backup entirely when the write quota is exhausted） | 現役 |
| C-DA-038 | 當前帳號無設定列時跳過本次備份 | LOG | T4 | P2 | — | `src/services/syncEngine.ts::runSync` | 不適用 | 設定列缺失無手動佈置入口 | `src/services/syncEngine.test.ts`（skips backup when the user has no Settings row yet） | 現役 |
| C-DA-039 | 探測遠端以查交易集合最多取一筆判定 | LOG | T3 | P1 | `no19_transaction_backup_logic` | `src/services/syncEngine.ts::detectRemoteUserData` | 全新帳號觸發備份後對賬 QA BACKUP probe | — | — | 現役 |
| C-DA-040 | 探測只查單一集合、不遍歷其餘集合 | LOG | T3 | P2 | `no19_transaction_backup_logic` | `src/services/syncEngine.ts::detectRemoteUserData` | 全新帳號觸發備份後對賬 QA BACKUP probe | — | — | 現役 |
| C-DA-041 | 探測失敗時保守視為遠端無資料 | LOG | T3 | P1 | `no19_transaction_backup_logic` | `src/services/syncEngine.ts::detectRemoteUserData` | 探測瞬間斷網、對賬 QA BACKUP mode | — | `src/services/syncEngine.test.ts`（R-IE-093: 遠端探測拋錯時 catch 回 false，照走 InitialBackup 並蓋戳） | 現役 |
| C-DA-042 | 探測失敗仍照常上傳本機資料、不中斷備份 | FB | T3 | P1 | `no19_transaction_backup_logic` | `src/services/syncEngine.ts::runInitialBackup` | 探測瞬間斷網後查 Firestore | — | `src/services/syncEngine.test.ts`（R-OF-004: 探測失敗不中斷、轉全量備份把本地資料照常上傳） | 現役 |
| C-DA-043 | 同步水位為空且遠端無資料時走初次完整上傳 | LOG | T3 | P1 | `no19_transaction_backup_logic` | `src/services/syncEngine.ts::runSync` | 清空雲端後觸發備份、對賬 QA BACKUP mode | — | `src/services/syncEngine.test.ts`（never-synced user with empty remote runs InitialBackup and stamps its own watermark） | 現役 |
| C-DA-044 | 同步水位為空但遠端已有資料時走全量增量、不另走初次上傳 | LOG | T3 | P1 | `no19_transaction_backup_logic` | `src/services/syncEngine.ts::runSync` | sqlite 清空水位且雲端留有資料後觸發備份 | — | `src/services/syncEngine.test.ts`（never-synced user whose remote already has data does a full Delta, not a separate Initial） | 現役 |
| C-DA-045 | 同步水位非空時直接走增量、不探測遠端 | LOG | T2 | P1 | `no19_transaction_backup_logic` | `src/services/syncEngine.ts::runSync` | 備份過後再觸發備份、對賬 QA BACKUP mode | — | `src/services/syncEngine.test.ts`（already-synced user goes straight to Delta without probing remote） | 現役 |
| C-DA-046 | 同步水位各帳號獨立、不繼承同機他帳號的水位 | DB | T3 | P0 | `no19_transaction_backup_logic` | `src/services/syncEngine.ts::runSync` | 甲帳號備份過後換乙帳號首次備份 | — | `src/services/syncEngine.test.ts`（does not inherit another account's watermark (multi-account isolation)） | 現役 |
| C-DA-047 | 舊版裝置層級戳記一次性採用為該帳號水位、採用後移除舊鍵 | DB | T4 | P1 | — | `src/services/syncEngine.ts::adoptLegacySyncState` | 不適用 | 舊版鍵值無手動佈置入口 | `src/services/syncEngine.test.ts`（adopts a legacy device watermark instead of re-uploading the whole DB） | 現役 |
| C-DA-048 | 舊版戳記為零或無效值時不採用、照走初次完整上傳 | DB | T4 | P1 | — | `src/services/syncEngine.ts::adoptLegacySyncState` | 不適用 | 舊版鍵值無手動佈置入口 | `src/services/syncEngine.test.ts`（does not adopt a falsy/zero legacy watermark (the @date setter would coerce it to null)） | 現役 |

---

## 邏輯：備份上傳與水位

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-DA-049 | 備份上傳帳戶、類別、收支、轉帳、匯率、排程六張表 | FB | T2 | P0 | `no19_transaction_backup_logic` | `src/services/syncEngine.ts::pushBatches` | 六張表皆有資料後備份再查 Firestore | — | — | 現役 |
| C-DA-050 | 初次完整上傳讀取本機全部資料、不受水位限制 | FB | T3 | P1 | `no19_transaction_backup_logic` | `src/services/syncEngine.ts::runInitialBackup` | 清空雲端後備份再查 Firestore | — | — | 現役 |
| C-DA-051 | 上傳依集合分批寫入、每批 500 筆 | LOG | T3 | P2 | `no19_transaction_backup_logic` | `src/services/syncEngine.ts::pushBatches` | 匯入逾 500 筆後備份、對賬 QA BACKUP batch | — | — | 現役 |
| C-DA-052 | 上傳後委派配額累計上傳筆數 | LOG | T2 | P2 | `no19_transaction_backup_logic` | `src/services/syncEngine.ts::pushBatches` | 觸發備份後對賬 QA QUOTA add | — | `src/services/syncEngine.test.ts`（R-OF-004: 探測失敗不中斷、轉全量備份把本地資料照常上傳） | 現役 |
| C-DA-053 | 上傳採冪等寫入、全量重傳不生重複紀錄 | FB | T3 | P1 | `no19_transaction_backup_logic` | `src/services/syncEngine.ts::pushBatches` | 清水位後全量重傳再對賬雲端筆數 | — | — | 現役 |
| C-DA-054 | 上傳完成後把同步水位蓋為本次備份起始時間、不是上傳結束時間 | DB+LOG | T2 | P1 | `no19_transaction_backup_logic` | `src/services/syncEngine.ts::runSync` | 備份後對賬 sqlite lastSyncedAt 與 QA BACKUP cooldownStamp 是否同值 | — | — | 現役 |
| C-DA-055 | 增量上傳以同步水位為篩選基準讀取變更 | LOG | T2 | P1 | `no19_transaction_backup_logic` | `src/services/syncEngine.ts::getLocalChanges` | 備份後改一筆再備份 | — | — | 現役 |
| C-DA-056 | 增量無任何變更時跳過上傳且不前移水位 | LOG+DB | T3 | P1 | `no19_transaction_backup_logic` | `src/services/syncEngine.ts::runDeltaBackup` | 無變更時等冷卻過後再備份、對賬 QA BACKUP done uploaded=0 lastSyncedAt=unchanged | — | — | 現役 |
| C-DA-057 | 批次寫入逾時時中止本次備份、不永久掛住 | LOG | T4 | P1 | — | `src/services/syncEngine.ts::pushBatches` | 不適用 | 逾時情境無法手動佈置 | — | 現役 |
| C-DA-058 | 備份失敗時記錄錯誤 log | LOG | T3 | P1 | `no19_transaction_backup_logic` | `src/services/syncEngine.ts::runSync` | 上傳進行中切斷網路、對賬 QA BACKUP error | — | — | 現役 |
| C-DA-059 | 備份失敗時把冷卻時間戳回拉成 30 秒短退避 | LOG | T4 | P1 | — | `src/services/syncEngine.ts::runSync` | 不適用 | 上傳失敗時序無法手動構造 | `src/services/syncEngine.test.ts`（push 失敗時把 cooldown 戳記回拉成短退避，而非整段 5 分鐘（#20 C）） | 現役 |
| C-DA-060 | 上傳失敗時同步水位不前移 | DB | T4 | P0 | `no19_transaction_backup_logic` | `src/services/syncEngine.ts` | 不適用 | 上傳失敗時序無法手動構造 | `src/services/syncEngine.test.ts`（R-IE-105: 批次寫入拋 resource-exhausted 時 sync() resolve 不外拋、cooldown 戳記短退避） | 現役 |
| C-DA-061 | 備份失敗不外拋、不影響觸發端 | LOG | T4 | P1 | — | `src/services/runBackup.ts::runBackup` | 不適用 | 上傳失敗時序無法手動構造 | `src/services/syncEngine.test.ts`（R-IE-105: 批次寫入拋 resource-exhausted 時 sync() resolve 不外拋、cooldown 戳記短退避） | 現役 |

---

## 邏輯：離線行為

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-DA-062 | 離線時整段跳過備份、不探測遠端也不寫冷卻時間戳 | LOG | T3 | P1 | — | `src/services/syncEngine.ts::runSync` | 斷網後觸發備份 | — | `src/services/syncEngine.test.ts`（離線時整段跳過 sync（NetInfo gate），不探測遠端、不寫戳記（#02 A）） | 現役 |
| C-DA-063 | 網路狀態未知時視為連線中、不誤擋備份 | LOG | T4 | P2 | — | `src/utils/networkState.ts::isOffline` | 不適用 | 探測未完成的瞬時狀態無法手動構造 | — | 現役 |
| C-DA-064 | 恢復連線後下次備份以增量補上傳離線期間變更 | FB | T3 | P0 | `no19_transaction_backup_logic` | `src/services/syncEngine.ts::runDeltaBackup` | 斷網記幾筆後恢復連線再備份 | — | — | 現役 |
| C-DA-065 | 斷網下新增交易本機立即成功且畫面不卡 | UI+DB | T3 | P0 | — | `src/services/transactionLogic.ts` | 斷網後記一筆 | — | — | 現役 |
| C-DA-066 | 離線時偏好變更只寫本機、雲端寫入失敗僅記 log 不阻塞畫面 | DB+LOG | T3 | P1 | `no18_preference_upload_logic` | `src/services/userService.ts::uploadPreferences` | 斷網改偏好後對賬本機與 QA PREF error uiBlocked=false | — | — | 現役 |
| C-DA-067 | 離線時付費帳號依本地授權快取維持等級、不降級 | LOG | T3 | P0 | `no6_premium_logic` | `src/services/premiumStatusCache.ts::resolveTierFromCache` | 付費帳號斷網重啟 | — | — | 退場 |
| C-DA-068 | 離線時 CSV 匯入照常完成、純本機操作 | UI+DB | T3 | P1 | `no21_data_transfer_logic` | `src/services/importService.ts::executeImport` | 斷網後執行匯入 | — | — | 現役 |
| C-DA-069 | 離線時 CSV 匯出照常完成、純本機操作 | UI+DB | T3 | P1 | `no21_data_transfer_logic` | `src/services/exportService.ts::exportToCsv` | 斷網後執行匯出 | — | — | 現役 |
