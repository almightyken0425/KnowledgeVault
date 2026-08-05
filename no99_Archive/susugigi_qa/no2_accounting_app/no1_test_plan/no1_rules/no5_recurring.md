# 檢驗點：定期交易

檢驗點清單分冊。欄位定義、自檢方式與全冊索引見 `../no0_index.md`。

- 域碼：C-RC
- 涵蓋：Schedules 表、定期設定區、建立與單筆轉排程、更新與刪除排程、復原與撤銷、補產生實例

---

## 資料模型：Schedules 表

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-RC-001 | 排程 `frequency` 值域限每日每週每月每年四值 | DB | T2 | P1 | `no1_data_models` | `src/services/recurringLogic.ts::Frequency` | 已建排程 | — | — | 現役 |
| C-RC-002 | 排程 `interval` 數值上限 999 | UI | T1 | P2 | `no1_data_models` | `src/constants/limits.ts::INTERVAL_MAX_DIGITS` | 已登入 | — | `src/constants/limits.intervalSafety.test.ts`（the max interval is 999 at the current digit cap） | 現役 |
| C-RC-003 | 上限值 `interval` 在每種頻率下皆推出合法日期 | DB | T4 | P1 | — | `src/constants/limits.ts::INTERVAL_MAX_DIGITS` | 不適用 | 需跨多期時間流逝、手動無法構造 | `src/constants/limits.intervalSafety.test.ts`（the largest interval produces a valid date on every frequency） | 現役 |
| C-RC-004 | 排程 `startOn` 為開始時點、含日期與時刻 | DB | T2 | P1 | `no1_data_models` | `src/database/models/Schedule.ts` | 已建排程 | — | — | 現役 |
| C-RC-005 | 排程 `endOn` 為 Null 代表無結束日 | DB | T2 | P1 | `no1_data_models` | `src/database/schema.ts` | 建立無結束日排程 | — | — | 現役 |
| C-RC-006 | `isTransfer` 為 true 代表轉帳排程、false 代表收支排程 | DB | T2 | P1 | `no1_data_models` | `src/database/models/Schedule.ts` | 分別建兩型排程 | — | — | 現役 |
| C-RC-007 | 收支排程僅寫三個收支範本欄、四個轉帳範本欄留 Null | DB | T2 | P1 | `no1_data_models` | `src/services/recurringLogic.ts::createSchedule` | 已建收支排程 | — | — | 現役 |
| C-RC-008 | 轉帳排程僅寫四個轉帳範本欄、三個收支範本欄留 Null | DB | T2 | P1 | `no1_data_models` | `src/services/recurringLogic.ts::createSchedule` | 已建轉帳排程 | — | — | 現役 |
| C-RC-009 | 排程範本備註長度上限 200 字元 | UI | T1 | P2 | `no1_data_models` | `src/constants/limits.ts::NOTE_MAX_LENGTH` | 已登入 | — | — | 現役 |
| C-RC-010 | 排程範本備註寫入時去除前後空白 | DB | T2 | P2 | `no1_data_models` | `src/database/models/Schedule.ts` | 備註前後帶空白的定期交易已建立 | — | — | 現役 |
| C-RC-011 | 建立排程時排程列即帶更新戳記、不留 0 | DB | T2 | P1 | `no1_data_models` | `src/services/recurringLogic.ts::createSchedule` | 已建排程 | — | — | 現役 |

---

## 畫面：定期設定區

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-RC-012 | 傳入定期規則為空時啟用開關初始為關 | UI | T1 | P1 | `no7_recurring_setting_screen` | `src/components/RecurringOptions.tsx` | 新增交易已展開定期 | — | — | 現役 |
| C-RC-013 | 規則為空時設定內容區不可操作、顯示元件預設值 | UI | T1 | P1 | `no7_recurring_setting_screen` | `src/components/RecurringOptions.tsx` | 新增交易已展開定期 | — | — | 現役 |
| C-RC-014 | 傳入規則非空時啟用開關初始為開 | UI | T1 | P1 | `no7_recurring_setting_screen` | `src/components/RecurringOptions.tsx` | 已有排程產生的交易 | — | — | 現役 |
| C-RC-015 | 規則非空時內容區依規則顯示頻率、間隔與結束條件 | UI | T1 | P1 | `no7_recurring_setting_screen` | `src/components/RecurringOptions.tsx` | 已有排程產生的交易 | — | — | 現役 |
| C-RC-016 | 頻率選項列提供每日每週每月每年四項 | UI | T1 | P1 | `no7_recurring_setting_screen` | `src/components/RecurringOptions.tsx` | 定期開關已開 | — | — | 現役 |
| C-RC-017 | 間隔單位文字依當前頻率顯示日週月年 | UI | T1 | P2 | `no7_recurring_setting_screen` | `src/components/RecurringOptions.tsx` | 定期開關已開 | — | — | 現役 |
| C-RC-018 | 結束條件選項列提供永不與於指定日期兩項 | UI | T1 | P1 | `no7_recurring_setting_screen` | `src/components/RecurringOptions.tsx` | 定期開關已開 | — | — | 現役 |
| C-RC-019 | 結束日期選擇器採 Date-only 模式 | UI | T1 | P1 | `no7_recurring_setting_screen` | `src/components/RecurringOptions.tsx` | 結束條件為於指定日期 | — | — | 現役 |
| C-RC-020 | 結束日期選擇器初始顯示既有規則的結束日期 | UI | T1 | P1 | `no7_recurring_setting_screen` | `src/components/RecurringOptions.tsx` | 已有帶結束日的排程交易 | — | `src/components/RecurringOptions.test.tsx`（mount 即有 endOn 時 picker 用既存值） | 現役 |
| C-RC-021 | 無既有結束日期時選擇器初始顯示今天 | UI | T1 | P1 | `no7_recurring_setting_screen` | `src/components/RecurringOptions.tsx` | 新增交易已展開定期 | — | — | 現役 |
| C-RC-022 | 結束日期非同步載入完成後選擇器補顯示為該日期 | UI | T1 | P1 | — | `src/components/RecurringOptions.tsx` | 已有帶結束日的排程交易 | — | `src/components/RecurringOptions.test.tsx`（endOn async 載入後 picker 補同步） | 現役 |
| C-RC-023 | 已手動選過日期時後到的結束日期不覆蓋選擇器顯示值 | UI | T1 | P2 | — | `src/components/RecurringOptions.tsx` | 已有帶結束日的排程交易 | — | `src/components/RecurringOptions.test.tsx`（使用者已手動選日，稍後載入不得蓋掉手選日期） | 現役 |
| C-RC-024 | 結束日期以日期物件傳入時選擇器仍顯示同一時點 | UI | T4 | P2 | — | `src/components/RecurringOptions.tsx` | 不適用 | 型別混入無手動入口 | `src/components/RecurringOptions.test.tsx`（endOn 混入 Date 物件時同步仍正規化為該時間） | 現役 |
| C-RC-025 | 結束日期可選任意過去或未來日期、無上下限 | UI | T1 | P2 | `no7_recurring_setting_screen` | `src/components/RecurringOptions.tsx` | 結束日期選擇器已開啟 | — | — | 現役 |
| C-RC-026 | 結束條件為永不時結束日期選擇器不可點按 | UI | T1 | P1 | `no7_recurring_setting_screen` | `src/components/RecurringOptions.tsx` | 結束條件為永不 | — | — | 現役 |
| C-RC-027 | 切換啟用開關為開時啟用內容區並回傳當前規則 | UI | T1 | P1 | `no7_recurring_setting_screen` | `src/components/RecurringOptions.tsx::handleToggle` | 新增交易已展開定期 | — | — | 現役 |
| C-RC-028 | 切換啟用開關為關時停用內容區並回傳清空狀態 | UI | T1 | P1 | `no7_recurring_setting_screen` | `src/components/RecurringOptions.tsx::handleToggle` | 定期開關已開 | — | — | 現役 |
| C-RC-029 | 開關關閉後再開啟時頻率與間隔沿用關閉前的值 | UI | T1 | P2 | — | `src/components/RecurringOptions.tsx::handleToggle` | 定期開關已改過頻率與間隔 | — | — | 現役 |
| C-RC-030 | 點按頻率選項更新當前頻率 | UI | T1 | P1 | `no7_recurring_setting_screen` | `src/components/RecurringOptions.tsx::renderFrequencyOption` | 定期開關已開 | — | — | 現役 |
| C-RC-031 | 間隔輸入僅接受數字字元、非數字不更新 | UI | T1 | P1 | `no7_recurring_setting_screen` | `src/components/RecurringOptions.tsx::handleIntervalChange` | 定期開關已開 | — | — | 現役 |
| C-RC-032 | 間隔輸入開頭為 0 時不更新 | UI | T1 | P2 | `no7_recurring_setting_screen` | `src/components/RecurringOptions.tsx::handleIntervalChange` | 間隔欄已清空 | — | — | 現役 |
| C-RC-033 | 間隔輸入達三位數上限即時阻擋 | UI | T1 | P2 | `no7_recurring_setting_screen` | `src/components/RecurringOptions.tsx::handleIntervalChange` | 定期開關已開 | — | — | 現役 |
| C-RC-034 | 點按永不選項時清除結束日期 | UI | T1 | P1 | `no7_recurring_setting_screen` | `src/components/RecurringOptions.tsx::handleEndConditionChange` | 結束條件為於指定日期 | — | — | 現役 |
| C-RC-035 | 點按永不選項時選擇器顯示的日期保留不變 | UI | T1 | P2 | `no7_recurring_setting_screen` | `src/components/RecurringOptions.tsx::handleEndConditionChange` | 結束條件為於指定日期且已選過日期 | — | — | 現役 |
| C-RC-036 | 點按於指定日期選項時結束日期設為選擇器當下顯示值 | UI | T1 | P1 | `no7_recurring_setting_screen` | `src/components/RecurringOptions.tsx::handleEndConditionChange` | 結束條件為永不 | — | `src/components/RecurringOptions.test.tsx`（載入後再點「特定日期」回寫原 endOn、不覆寫成今天） | 現役 |
| C-RC-037 | 結束條件為於指定日期時改日期同步更新結束日期 | UI | T1 | P1 | `no7_recurring_setting_screen` | `src/components/RecurringOptions.tsx::onDateChange` | 結束條件為於指定日期 | — | — | 現役 |
| C-RC-038 | 結束條件為永不時改日期後結束日期維持為空 | UI | T1 | P1 | `no7_recurring_setting_screen` | `src/components/RecurringOptions.tsx::onDateChange` | 結束條件為永不 | — | — | 現役 |

---

## 邏輯：建立排程與單筆轉排程

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-RC-039 | 建立排程於排程表寫入一筆新記錄 | DB | T2 | P0 | `no10_recurring_transactions_logic` | `src/services/recurringLogic.ts::createSchedule` | 新增交易開定期後已完成 | — | — | 現役 |
| C-RC-040 | 建立排程同時產生首筆實例 | DB | T2 | P0 | `no10_recurring_transactions_logic` | `src/services/recurringLogic.ts::createSchedule` | 新增交易開定期後已完成 | — | — | 現役 |
| C-RC-041 | 收支排程首筆走建立交易、帶入排程識別與實例日 | DB | T2 | P0 | `no10_recurring_transactions_logic` | `src/services/recurringLogic.ts::createSchedule` | 新增交易開定期後已完成 | — | — | 現役 |
| C-RC-042 | 轉帳排程首筆走建立轉帳、帶入排程識別與實例日 | DB | T2 | P0 | `no10_recurring_transactions_logic` | `src/services/recurringLogic.ts::createSchedule` | 新增轉帳開定期後已完成 | — | — | 現役 |
| C-RC-043 | 建立排程當下即補產生起始日至當前時刻之間已到期的實例 | DB | T2 | P0 | — | `src/services/recurringLogic.ts::createSchedule` | 交易日期設在過去且開定期後已完成 | — | — | 現役 |
| C-RC-044 | 建立時補產生失敗不外拋、排程與首筆實例仍成立 | DB | T4 | P1 | — | `src/services/recurringLogic.ts::createSchedule` | 不適用 | 補產生失敗無手動入口 | — | 現役 |
| C-RC-045 | 單筆轉排程順序固定為先建排程後刪原紀錄 | DB | T2 | P0 | `no10_recurring_transactions_logic` | `src/services/recurringLogic.ts::convertToSchedule` | 既有交易開定期後已完成 | — | `src/services/recurringLogic.convertToSchedule.test.ts`（createSchedule 成功 → 才刪原交易（先建後刪）） | 現役 |
| C-RC-046 | 轉帳單筆轉排程刪除的是原轉帳紀錄 | DB | T2 | P0 | `no10_recurring_transactions_logic` | `src/services/recurringLogic.ts::convertToSchedule` | 既有轉帳開定期後已完成 | — | `src/services/recurringLogic.convertToSchedule.test.ts`（transfer 路徑：成功 → 刪原轉帳） | 現役 |
| C-RC-047 | 轉排程建立失敗時原紀錄保持完好 | DB | T4 | P0 | `no10_recurring_transactions_logic` | `src/services/recurringLogic.ts::convertToSchedule` | 不適用 | 建立失敗無手動入口 | `src/services/recurringLogic.convertToSchedule.test.ts`（createSchedule 失敗 → 原交易不被刪（關掉資料遺失視窗）） | 現役 |
| C-RC-048 | 轉排程刪除原紀錄失敗時不回滾已建排程 | DB | T4 | P0 | `no10_recurring_transactions_logic` | `src/services/recurringLogic.ts::convertToSchedule` | 不適用 | 刪除失敗無手動入口 | `src/services/recurringLogic.convertToSchedule.test.ts`（排程已建後刪除失敗 → 容忍、不外拋，並回傳新排程（undo 依賴）） | 現役 |

---

## 邏輯：更新與刪除排程

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-RC-049 | 更新排程選僅此一筆時排程表不變動 | DB | T2 | P0 | `no10_recurring_transactions_logic` | `src/services/recurringLogic.ts::updateSchedule` | 排程交易已改金額 | — | — | 現役 |
| C-RC-050 | 更新排程選此筆及未來時原排程 `endOn` 設為前一週期 | DB | T2 | P0 | `no10_recurring_transactions_logic` | `src/services/recurringLogic.ts::updateSchedule` | 排程交易已改金額 | — | — | 現役 |
| C-RC-051 | 前一週期依排程頻率與間隔自此筆日期往前推一個週期單位 | DB | T3 | P0 | `no10_recurring_transactions_logic` | `src/services/recurringLogic.ts::previousPeriod` | 每月排程已有多筆實例 | — | — | 現役 |
| C-RC-052 | 更新排程選此筆及未來時軟刪自此筆實例日期起的實例 | DB | T3 | P0 | `no10_recurring_transactions_logic` | `src/services/recurringLogic.ts::updateSchedule` | 排程已有多筆未來實例 | — | — | 現役 |
| C-RC-053 | 更新排程依新內容建立新排程、`startOn` 為此筆日期 | DB | T2 | P0 | `no10_recurring_transactions_logic` | `src/services/recurringLogic.ts::updateSchedule` | 排程交易已改頻率 | — | — | 現役 |
| C-RC-054 | 更新排程建立的新排程自此筆日期依新規則補產生至當前時刻 | DB | T2 | P0 | `no10_recurring_transactions_logic` | `src/services/recurringLogic.ts::updateSchedule` | 實例日期在過去的排程交易已改頻率 | — | — | 現役 |
| C-RC-055 | 刪除排程選僅此一筆時只刪該筆紀錄 | DB | T2 | P0 | `no10_recurring_transactions_logic` | `src/services/recurringLogic.ts::deleteSchedule` | 排程交易已開啟 | — | — | 現役 |
| C-RC-056 | 刪除排程選此筆及未來時原排程 `endOn` 設為前一週期 | DB | T2 | P0 | `no10_recurring_transactions_logic` | `src/services/recurringLogic.ts::deleteSchedule` | 排程交易已開啟 | — | — | 現役 |
| C-RC-057 | 刪除排程選此筆及未來時軟刪自此筆實例日期起的實例 | DB | T3 | P0 | `no10_recurring_transactions_logic` | `src/services/recurringLogic.ts::deleteSchedule` | 排程已有多筆未來實例 | — | — | 現役 |

---

## 邏輯：復原與撤銷

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-RC-058 | 復原排程實例將 `endOn` 寫回截斷前的值 | DB | T2 | P0 | `no10_recurring_transactions_logic` | `src/services/recurringLogic.ts::restoreScheduleInstances` | 已選此筆及未來刪除 | — | `src/services/recurringLogic.restoreScheduleInstances.test.ts`（restores endOn and un-deletes every affected instance in one write, one batch） | 現役 |
| C-RC-059 | 截斷前無結束日時復原將 `endOn` 寫回空值 | DB | T2 | P0 | `no10_recurring_transactions_logic` | `src/services/recurringLogic.ts::restoreScheduleInstances` | 無結束日排程已選此筆及未來刪除 | — | `src/services/recurringLogic.restoreScheduleInstances.test.ts`（accepts a null original endOn (no end date) without un-deleting nothing extra） | 現役 |
| C-RC-060 | 復原排程實例清除快照內每筆實例的軟刪標記 | DB | T2 | P0 | `no10_recurring_transactions_logic` | `src/services/recurringLogic.ts::restoreScheduleInstances` | 已選此筆及未來刪除 | — | `src/services/recurringLogic.restoreScheduleInstances.test.ts`（restores endOn and un-deletes every affected instance in one write, one batch） | 現役 |
| C-RC-061 | 復原依截斷前擷取的快照、不於復原時重查實例 | DB | T2 | P0 | `no10_recurring_transactions_logic` | `src/services/recurringLogic.ts::restoreScheduleInstances` | 已自刪一筆實例後選此筆及未來刪除 | — | — | 現役 |
| C-RC-062 | 復原不復活使用者先前自行刪除的實例 | DB | T2 | P0 | `no10_recurring_transactions_logic` | `src/services/recurringLogic.ts::getScheduleInstancesFrom` | 已自刪一筆實例後選此筆及未來刪除 | — | — | 現役 |
| C-RC-063 | 復原排程實例全部變更單次原子提交 | DB | T4 | P0 | `no10_recurring_transactions_logic` | `src/services/recurringLogic.ts::restoreScheduleInstances` | 不適用 | 需觀察交易邊界、無畫面判準 | `src/services/recurringLogic.restoreScheduleInstances.test.ts`（mid-loop 失敗整筆未套用：endOn 不動、零實例復活、不落任何 batch（FINDING-08）） | 現役 |
| C-RC-064 | 撤銷排程建立軟刪排程本體與其名下未刪實例 | DB | T2 | P0 | `no10_recurring_transactions_logic` | `src/services/recurringLogic.ts::revertScheduleCreation` | 定期交易已建立 | — | `src/services/recurringLogic.revertGuards.test.ts`（R-RC-042: 撤銷排程建立：單一 write 單一 batch 軟刪排程本體與全部實例） | 現役 |
| C-RC-065 | 撤銷排程建立為單次原子提交 | DB | T4 | P0 | `no10_recurring_transactions_logic` | `src/services/recurringLogic.ts::revertScheduleCreation` | 不適用 | 需觀察交易邊界、無畫面判準 | `src/services/recurringLogic.revertGuards.test.ts`（R-RC-042: 注入 batch 失敗整筆未套用：排程與實例零軟刪、不落任何 batch（FINDING-08）） | 現役 |
| C-RC-066 | 撤銷單筆轉排程清除原紀錄的軟刪標記 | DB | T2 | P0 | `no10_recurring_transactions_logic` | `src/services/recurringLogic.ts::revertConvertToSchedule` | 一般交易已轉排程 | — | `src/services/recurringLogic.revertGuards.test.ts`（R-RC-045: 復活原紀錄 + 撤掉新排程與實例：單一 write 單一 batch） | 現役 |
| C-RC-067 | 撤銷單筆轉排程軟刪新排程與其名下實例 | DB | T2 | P0 | `no10_recurring_transactions_logic` | `src/services/recurringLogic.ts::revertConvertToSchedule` | 一般交易已轉排程 | — | `src/services/recurringLogic.revertGuards.test.ts`（R-RC-045: 復活原紀錄 + 撤掉新排程與實例：單一 write 單一 batch） | 現役 |
| C-RC-068 | 撤銷單筆轉排程為單次原子提交、無雙亡中間態 | DB | T4 | P0 | `no10_recurring_transactions_logic` | `src/services/recurringLogic.ts::revertConvertToSchedule` | 不適用 | 需觀察交易邊界、無畫面判準 | `src/services/recurringLogic.revertGuards.test.ts`（R-RC-045: 注入 batch 失敗零套用：原紀錄未復活時新排程也未刪（無雙亡中間態）） | 現役 |
| C-RC-069 | 原紀錄未被軟刪時撤銷轉排程不擲錯、該紀錄維持有效 | DB | T4 | P1 | `no10_recurring_transactions_logic` | `src/services/recurringLogic.ts::revertConvertToSchedule` | 不適用 | 正向刪除失敗情境無法佈置 | `src/services/recurringLogic.revertGuards.test.ts`（R-RC-046: 原紀錄未軟刪（正向刪除曾容忍失敗）時 revert 不拋、紀錄維持有效） | 現役 |
| C-RC-070 | 撤銷排程更新將原排程 `endOn` 寫回截斷前值 | DB | T2 | P0 | `no10_recurring_transactions_logic` | `src/services/recurringLogic.ts::revertScheduleUpdate` | 已選此筆及未來更新 | — | `src/services/recurringLogic.revertGuards.test.ts`（R-RC-050: 復原 endOn + 復活快照實例 + 撤掉新排程：單一 batch，快照輸入不重查） | 現役 |
| C-RC-071 | 撤銷排程更新清除快照內實例的軟刪標記 | DB | T2 | P0 | `no10_recurring_transactions_logic` | `src/services/recurringLogic.ts::revertScheduleUpdate` | 已選此筆及未來更新 | — | `src/services/recurringLogic.revertGuards.test.ts`（R-RC-050: 復原 endOn + 復活快照實例 + 撤掉新排程：單一 batch，快照輸入不重查） | 現役 |
| C-RC-072 | 撤銷排程更新於有新排程時軟刪新排程與其實例 | DB | T2 | P0 | `no10_recurring_transactions_logic` | `src/services/recurringLogic.ts::revertScheduleUpdate` | 已選此筆及未來更新 | — | `src/services/recurringLogic.revertGuards.test.ts`（R-RC-050: 復原 endOn + 復活快照實例 + 撤掉新排程：單一 batch，快照輸入不重查） | 現役 |
| C-RC-073 | 撤銷排程更新為單次原子提交、不留半套 | DB | T4 | P0 | `no10_recurring_transactions_logic` | `src/services/recurringLogic.ts::revertScheduleUpdate` | 不適用 | 需觀察交易邊界、無畫面判準 | `src/services/recurringLogic.revertGuards.test.ts`（R-RC-050: 注入 batch 失敗零套用：endOn 不動、快照實例仍 tombstone、新排程未刪（不留半套）） | 現役 |

---

## 邏輯：補產生實例

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-RC-074 | 補產生於登入或啟動後執行 | LOG | T2 | P1 | `no10_recurring_transactions_logic` | `src/contexts/AuthContext.tsx::runPostAuth` | 冷啟後對賬 QA BOOT delegate task=generateMissingInstances | — | — | 現役 |
| C-RC-075 | 前景恢復不觸發補產生 | DB | T3 | P1 | `no1_app_bootstrap_logic` | `src/contexts/PremiumContext.tsx` | 背景期間已跨過下一實例時刻 | — | — | 現役 |
| C-RC-076 | 補產生截止點為當下絕對時刻、不依時區日界 | DB | T2 | P0 | `no1_app_bootstrap_logic` | `src/services/recurringLogic.ts::doGenerateMissingInstances` | 已佈置當日稍晚才到期的排程 | — | `src/services/recurringLogic.test.ts`（does not pre-generate a later-today instance (now-cutoff, timezone-proof)） | 現役 |
| C-RC-077 | 補產生僅處理當前使用者的排程 | DB | T3 | P0 | `no10_recurring_transactions_logic` | `src/services/recurringLogic.ts::doGenerateMissingInstances` | 雙帳號各有到期排程 | — | — | 現役 |
| C-RC-078 | 補產生排除已軟刪的排程 | DB | T3 | P0 | `no10_recurring_transactions_logic` | `src/services/recurringLogic.ts::doGenerateMissingInstances` | 已撤銷排程建立且時鐘跨過下一期 | — | — | 現役 |
| C-RC-079 | 單筆排程失敗時跳過該筆、不中斷其餘排程 | DB | T4 | P1 | `no10_recurring_transactions_logic` | `src/services/recurringLogic.ts::doGenerateMissingInstances` | 不適用 | 單筆排程失敗無手動入口 | — | 現役 |
| C-RC-080 | 已有實例時自最後一筆實例往後推算 | DB | T3 | P0 | `no10_recurring_transactions_logic` | `src/services/recurringLogic.ts::doGenerateMissingInstances` | 時鐘已越過下一實例時刻 | — | — | 現役 |
| C-RC-081 | 查最後一筆實例時含已軟刪的實例 | DB | T3 | P0 | `no10_recurring_transactions_logic` | `src/services/recurringLogic.ts::doGenerateMissingInstances` | 最後一筆實例已刪除且時鐘跨過下一期 | — | — | 現役 |
| C-RC-082 | 最後一筆實例缺實例日時改取其交易日期 | DB | T4 | P2 | — | `src/services/recurringLogic.ts::doGenerateMissingInstances` | 不適用 | 實例日缺值無手動入口 | — | 現役 |
| C-RC-083 | 尚無實例時自 `startOn` 起算 | DB | T2 | P0 | `no10_recurring_transactions_logic` | `src/services/recurringLogic.ts::doGenerateMissingInstances` | 起始日在過去且名下無實例的排程 | — | — | 現役 |
| C-RC-084 | 每月與每年推算時日號錨定 `startOn` 原始日號 | DB | T3 | P0 | `no10_recurring_transactions_logic` | `src/services/recurringLogic.ts::doGenerateMissingInstances` | 起始日 31 號的每月排程已跨多月 | — | `src/services/recurringLogic.test.ts`（每月 31 號排程：短月夾短但不固化，回到原始日號（非永久漂移）） | 現役 |
| C-RC-085 | 目標月天數不足時日號夾到該月最後一天 | DB | T3 | P0 | `no10_recurring_transactions_logic` | `src/services/recurringLogic.ts::doGenerateMissingInstances` | 31 號每月排程已跨過 2 月 | — | `src/services/recurringLogic.test.ts`（每月 31 號排程：短月夾短但不固化，回到原始日號（非永久漂移）） | 現役 |
| C-RC-086 | 夾短僅當期生效、下一期仍從原始日號重推 | DB | T3 | P0 | `no10_recurring_transactions_logic` | `src/services/recurringLogic.ts::doGenerateMissingInstances` | 2 月 29 日起始的每年排程已跨過閏年 | — | `src/services/recurringLogic.test.ts`（2/29 起始：非閏年夾為 2/28 不固化，下一個閏年回到 2/29） | 現役 |
| C-RC-087 | 錨定日號取起始時點的本地日曆日 | DB | T4 | P1 | — | `src/services/recurringLogic.ts::doGenerateMissingInstances` | 不適用 | 時區基準無外顯判準 | `src/services/recurringLogic.test.ts`（originalDay 取 startOn 的 local 日曆日，與實例推進同基準（local-time 契約）） | 現役 |
| C-RC-088 | 錨定規則同時適用起點推算與迴圈內推算 | DB | T3 | P0 | `no10_recurring_transactions_logic` | `src/services/recurringLogic.ts::doGenerateMissingInstances` | 最後實例日號為被夾短值且已再跨期 | — | — | 現役 |
| C-RC-089 | 已產生的漂移實例不回溯改寫 | DB | T3 | P1 | `no10_recurring_transactions_logic` | `src/services/recurringLogic.ts::doGenerateMissingInstances` | 已有漂移日號的舊實例且已再跨期 | — | — | 現役 |
| C-RC-090 | 實例日期晚於當前時刻時結束該排程迴圈 | DB | T3 | P0 | `no10_recurring_transactions_logic` | `src/services/recurringLogic.ts::doGenerateMissingInstances` | 時鐘已跨多期 | — | — | 現役 |
| C-RC-091 | 實例日期晚於結束日時結束該排程迴圈 | DB | T3 | P0 | `no10_recurring_transactions_logic` | `src/services/recurringLogic.ts::doGenerateMissingInstances` | 已設結束日且時鐘跨過該日 | — | — | 現役 |
| C-RC-092 | 結束日當日的實例照常產生、不因時刻先後被截掉 | DB | T2 | P0 | — | `src/services/recurringLogic.ts::doGenerateMissingInstances` | 結束日設為今天且當日實例尚未產生 | — | — | 現役 |
| C-RC-093 | 同排程同實例日期已存在紀錄時不重複產生 | DB | T2 | P0 | `no10_recurring_transactions_logic` | `src/services/recurringLogic.ts::doGenerateMissingInstances` | 已反覆冷啟 | — | `src/services/recurringLogic.test.ts`（a repeat call is idempotent — second run adds nothing） | 現役 |
| C-RC-094 | 已軟刪的實例視為已存在、不重建 | DB | T2 | P0 | `no10_recurring_transactions_logic` | `src/services/recurringLogic.ts::doGenerateMissingInstances` | 已刪除某筆已產生的實例 | — | — | 現役 |
| C-RC-095 | 補產生的實例帶入交易日期、排程識別與實例日 | DB | T3 | P1 | `no10_recurring_transactions_logic` | `src/services/recurringLogic.ts::doGenerateMissingInstances` | 時鐘已跨期 | — | — | 現役 |
| C-RC-096 | 重複或並行呼叫時同排程同實例日至多產生一筆 | DB | T4 | P0 | `no10_recurring_transactions_logic` | `src/services/recurringLogic.ts::generateMissingInstances` | 不適用 | 並行時序無法手動構造 | `src/services/recurringLogic.test.ts`（concurrent calls never double-write (in-flight Promise lock)） | 現役 |
