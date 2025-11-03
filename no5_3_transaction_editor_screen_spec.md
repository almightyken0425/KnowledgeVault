# 5.3. 交易編輯器畫面 (TransactionEditorScreen)

_(本文件定義新增/編輯「收支」交易畫面的 UI、流程與邏輯)_

## 1. 畫面目標 (Screen Objective)

- 提供一個統一的介面，讓使用者可以**新增**、**編輯**或**刪除**一筆「收入」或「支出」交易。
- 作為建立**定期收支**排程的入口。
- 處理編輯由定期排程所產生的交易時的特殊邏輯。

## 2. UI 佈局與元件 (UI Layout & Components)

此畫面通常以 Modal 形式從底部彈出，佔據整個螢幕。

- **2.1. 頂部導航列 (Top Navigation Bar):**
    - **左側:** 「關閉」或「取消」按鈕。
    - **中間 (可點擊標題):**
        - **UI:** 顯示「支出」或「收入」，旁邊帶有向下小箭頭 (Chevron) 圖示，暗示這是一個可點擊的按鈕。
        - **邏輯:** 點擊後直接切換收支類型。在「編輯」模式下此按鈕應被鎖定。
    - **右側:**
        - **定期交易按鈕:** 一個循環圖示的按鈕。
        - **邏輯:**
            - **(付費牆檢查)** 點擊時，檢查使用者 `isPremiumUser` 狀態。
            - **若為免費版使用者:** 導航至 `PaywallScreen` (`5.12`)。
            - **若為付費版使用者:** 開啟 `ScheduleModal` 進行設定。

- **2.2. 日期選擇區 (Date Area):**
    - **位置:** 位於導航列正下方。
    - **元件:** `DatePicker.tsx`。
    - **邏輯:** 點擊後開啟日期選擇器。預設日期邏輯見 `3.1`。此為**必填項**。

- **2.3. 金額顯示區 (Amount Display Area):**
    - **位置:** 位於日期選擇區下方。
    - **UI:** 一個大型的金額**輸入框** (`TextInput`)。點擊後會彈出**作業系統原生的數字鍵盤 (numpad)**。
    - **邏輯:** 輸入的數值會直接更新至 `AmountCents` 狀態。應設定 `keyboardType` 為 `decimal-pad` 或 `numeric`。

- **2.4. 核心欄位區 (Core Fields Area):**
    - **位置:** 位於金額顯示區下方。
    - **UI:** 一個列表。
    - **項目:**
        - **類別 (Category):**
            - **元件:** `CategorySelector.tsx`。
            - **UI:** 可以是滾輪選擇器 (Wheel Picker)。若類別過多，點擊後應彈出 Modal 列表供使用者搜尋和選擇。
            - **邏輯:** 列表會根據中間標題的收支類型進行過濾。選擇後返回 `CategoryId`。此為**必填項**。
        - **帳戶 (Account):**
            - **元件:** `AccountSelector.tsx`。
            - **UI:** 同上，可以是滾輪選擇器或彈出 Modal。
            - **邏輯:** 列表應優先顯示 `IsPrimary` 帳戶，其餘帳戶按 `SortOrder` 排序。選擇後返回 `AccountId`。此為**必填項**。
        - **備註 (Note):**
            - **UI:** 一個簡單的文字輸入框。
            - **邏輯:** 允許使用者輸入文字，對應 `Transactions` 表的 `Note` 欄位。

- **2.5. 表單提交區 (Form Submission Area):**
    - **位置:** 位於核心欄位區下方。
    - **UI:**
        - **刪除按鈕:** 紅色的「刪除此交易」按鈕，僅在「編輯」模式下顯示。
        - **儲存按鈕:** 主要顏色的「儲存」按鈕，僅在所有必填欄位都有效時才可點擊。

## 3. 核心邏輯

- **3.1. 模式判斷與預設值 (Mode Detection & Defaults):**
    - 畫面載入時，檢查導航參數中是否傳入 `transactionId`。
    - **若有 `transactionId` (編輯模式):**
        - 從 `DataContext` (本地資料快取) 中讀取該筆交易的完整資料，填入表單。
        - 鎖定中間的「收支類型切換」按鈕。
        - 顯示「刪除按鈕」(`2.5`)。
    - **若無 `transactionId` (新增模式):**
        - **日期預設值:**
            - 檢查導航參數中是否傳入 `defaultDate` (來自 `HomeScreen` 的報表日期)。若有，則使用該日期。
            - 若無，則預設為「今天」(基於使用者裝置時區)。
        - **其他預設值:** **類別**與**帳戶**皆應預選其列表中 `SortOrder` 最高（數字最小）的項目。

- **3.2. 儲存邏輯 (Save Logic):**
    - 點擊「儲存」按鈕時，組合表單所有狀態 (`CategoryId`, `AccountId`, `AmountCents` 等)。
    - **新增模式:**
        - **如果未設定重複規則:** 直接呼叫 `firestoreService.addTransaction()` 建立一筆新記錄。
        - **如果設定了重複規則 ([付費功能]):**
            - 呼叫 `firestoreService.addSchedule()` 建立一筆 `Schedules` 記錄。
            - **立即**為 `StartOn` 日期產生第一筆交易實例。
    - **編輯模式:**
        - **檢查是否為定期交易產生:** 檢查該筆交易的 `ScheduleId` 是否有值。
        - **普通交易:** 直接呼叫 `firestoreService.updateTransaction()` 更新記錄。
        - **定期交易產生:**
            - 彈出對話框，提供選項：「僅此一筆」、「此筆及未來所有」。
            - **「僅此一筆」:** 直接修改當前這筆 `Transaction`。
            - **「此筆及未來所有」:** 呼叫 `firestoreService.updateFutureSchedule()`，將原 `Schedule` 的 `EndOn` 設為此交易日期的前一個週期，並根據新內容創建一個新的 `Schedule`。
    - 儲存成功後，關閉畫面並導航返回前一頁 (通常是 `HomeScreen`)。

- **3.3. 刪除邏輯 (Delete Logic):**
    - 僅在「編輯」模式下可用。
    - **檢查是否為定期交易產生:** 檢查該筆交易的 `ScheduleId` 和 `ScheduleInstanceDate` 是否有值。
    - **普通交易:** 直接呼叫 `firestoreService.deleteTransaction()` (軟刪除，設定 `DeletedOn`)。
    - **定期交易產生:**
        - 彈出對話框，提供選項：「僅此一筆」、「此筆及未來所有」(邏輯遵循 `no2_core_feature.md` 7.1 節)。
        - **「僅此一筆」:** 軟刪除當前這筆 `Transaction`。
        - **「此筆及未來所有」:** 呼叫 `firestoreService.deleteFutureSchedule()`，將對應 `Schedule` 的 `EndOn` 設為此交易日期的前一個週期日期。
    - 刪除成功後，關閉畫面並導航返回。

## 4. 狀態管理 (State Management)

- 使用 `useState` 或表單管理庫來管理以下狀態：
    - `transactionType: 'expense' | 'income'`
    - `amountCents: bigint` (來自金額輸入框)
    - `categoryId: string | null` (來自類別選擇器)
    - `accountId: string | null` (來自帳戶選擇器)
    - `transactionDate: number` (來自日期選擇器)
    - `note: string` (來自備註輸入框)
    - `schedule: Schedule | null` (來自定期交易 Modal)

## 5. 導航 (Navigation)

- **進入:**
    - 從 `HomeScreen` 的 FAB 或列表項點擊進入。
    - 可選參數:
        - `transactionId?: string` (用於編輯模式)
        - `defaultDate?: number` (用於預設日期，當 `HomeScreen` 粒度為 `daily` 時傳入)
- **退出:**
    - 點擊「關閉/取消」按鈕，或在「儲存/刪除」成功後，呼叫 `navigation.goBack()`。
