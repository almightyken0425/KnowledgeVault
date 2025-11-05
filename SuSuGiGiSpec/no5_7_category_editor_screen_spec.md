# 5.7. 類別編輯器畫面 (CategoryEditorScreen)

_(本文件定義新增/編輯「類別」畫面的 UI、流程與邏輯)_

## 1. 畫面目標 (Screen Objective)

- 提供一個統一的介面，讓使用者可以**新增**一個新類別，或**編輯**一個現有類別的名稱與圖示。
- 確保所有自訂類別都映射到一個標準類別，以便於報表聚合。

## 2. UI 佈局與元件 (UI Layout & Components)

此畫面通常以 Modal 形式從底部彈出，佔據整個螢幕。

- **2.1. 頂部導航列 (Top Navigation Bar):**
    - **左側:** 「關閉」或「取消」按鈕。
    - **中間:** 畫面標題，根據模式顯示「新增類別」或「編輯類別」。
    - **右側:** 「儲存」按鈕，僅在所有必填欄位都有效時才可點擊。

- **2.2. 核心欄位區 (Core Fields Area):**
    - **類別名稱 (`Name`):**
        - **UI:** 一個文字輸入框 (`TextInput`)。此為**必填項**。
    - **圖示 (`Icon`):**
        - **UI:** 一個顯示當前所選圖示的區域，點擊後導航至 `IconPickerScreen` (5.10)。此為**必填項**。
    - **類別類型 (`CategoryType`):**
        - **UI:** 一個顯示「支出」或「收入」的唯讀欄位。
        - **邏輯:** 在「新增」模式下，此值由 `CategoryListScreen` 的分頁決定；在「編輯」模式下，此欄位**不可修改**。
    - **標準類別映射 (`StandardCategoryId`):**
        - **UI:** 一個選擇器，點擊後彈出 `StandardCategory.json` 中對應 `CategoryType` 的標準類別列表。
        - **邏輯:** 使用者必須選擇一個標準類別進行映射。此為**必填項**。

- **2.3. 刪除按鈕區 (Delete Button Area):**
    - **UI:** 紅色的「刪除此類別」按鈕，僅在「編輯」模式下顯示。

## 3. 核心邏輯

- **3.1. 模式判斷 (Mode Detection):**
    - 畫面載入時，檢查導航參數中是否傳入 `categoryId`。
    - **若有 `categoryId` (編輯模式):** 從 `DataContext` 讀取該類別的資料並填入表單。
    - **若無 `categoryId` (新增模式):** 檢查導航參數中傳入的 `categoryType` ('expense' 或 'income') 來決定 UI 狀態。

- **3.2. 儲存邏輯 (Save Logic):**
    - **新增模式:**
        - **(付費牆檢查)** 檢查目前使用者自訂類別數量是否已達免費版上限 (10個)。若已達上限，則導航至 `PaywallScreen` (5.15) 而非儲存。
        - 若未達上限，則呼叫 `firestoreService.addCategory()` 建立新記錄。
    - **編輯模式:**
        - 呼叫 `firestoreService.updateCategory()` 更新記錄。
    - 儲存成功後，關閉畫面並導航返回 `CategoryListScreen`。

- **3.3. 刪除邏輯 (Delete Logic):**
    - 點擊「刪除」按鈕時，彈出確認對話框。
    - 使用者確認後，呼叫 `firestoreService.deleteCategory()` (軟刪除，設定 `DeletedOn`)。
    - 刪除成功後，關閉畫面並導航返回 `CategoryListScreen`。

## 4. 狀態管理 (State Management)

- 使用 `useState` 或表單管理庫來管理以下狀態：
    - `name: string`
    - `iconId: number`
    - `standardCategoryId: number | null`

## 5. 導航 (Navigation)

- **進入:** 從 `CategoryListScreen` (5.6) 的「新增」按鈕或列表項目點擊進入。
- **退出:** 點擊「關閉/取消」按鈕，或在「儲存/刪除」成功後，呼叫 `navigation.goBack()`。
