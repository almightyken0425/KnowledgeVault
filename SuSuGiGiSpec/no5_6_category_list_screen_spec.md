# 5.6. 設定 - 類別列表 (CategoryListScreen)

_(本文件定義「類別管理」列表畫面的 UI、流程與邏輯)_

## 1. 畫面目標 (Screen Objective)

- 提供一個讓使用者可以**查看**、**排序**和**管理**所有自訂「收入」與「支出」類別的介面。
- 作為新增、編輯或刪除特定類別的入口。

## 2. UI 佈局與元件 (UI Layout & Components)

- **2.1. 頂部導航列 (Top Navigation Bar):**
    - **左側:** 「返回」按鈕，導航回 `SettingsScreen` (5.5)。
    - **中間:** 畫面標題，顯示「類別管理」。
    - **右側:** 「新增」按鈕 (+)，點擊後導航至 `CategoryEditorScreen` (5.7) 的「新增」模式。

- **2.2. 分頁標籤 (Tab View):**
    - **UI:** 在導航列下方，提供兩個分頁：「支出」和「收入」。
    - **邏輯:** 預設選中「支出」分頁。切換分頁會改變下方列表顯示的內容。

- **2.3. 類別列表 (Category List):**
    - **UI:** 一個可滾動的列表 (`DraggableFlatList`)，顯示當前選中分頁對應的類別。
    - **項目內容 (每筆):**
        - 左側：類別圖示 (`Icon`)。
        - 中間：類別名稱 (`Name`)。
        - 右側：拖拉排序的圖示 (Drag Handle)。
    - **空狀態 (Empty State):** 如果該分頁下沒有任何類別，則顯示提示文字，例如「您尚未建立任何支出類別，點擊右上角『+』新增一個吧！」。

## 3. 核心邏輯

- **3.1. 資料載入邏輯:**
    - 畫面載入時，從 `DataContext` 讀取所有 `Categories`。
    - 根據 `CategoryType` (0: 收入, 1: 支出) 將類別分別篩選至兩個不同的陣列中，並根據 `SortOrder` 欄位進行初始排序。

- **3.2. 互動邏輯:**
    - **點擊列表項目:** 導航至 `CategoryEditorScreen` (5.7) 的「編輯」模式，並傳入該類別的 `categoryId`。
    - **拖拉排序:**
        - 使用者可以長按並拖拉列表中的項目來重新排序。
        - 拖拉結束後，App 必須更新受影響類別的 `SortOrder` 欄位，並將變動儲存至 `firestoreService`。
    - **點擊「新增」按鈕:**
        - 根據當前所在的分頁（「支出」或「收入」），導航至 `CategoryEditorScreen` (5.7) 時，需傳入對應的 `categoryType` 參數。

- **3.3. 付費牆檢查 (Paywall Check):**
    - 在點擊「新增」按鈕並導航之前，應先檢查 `isPremiumUser` 狀態以及目前自訂類別的總數。
    - 如果使用者是免費版且類別數量已達上限 (10個)，則應直接導航至 `PaywallScreen` (5.16)，而非 `CategoryEditorScreen`。

## 4. 狀態管理 (State Management)

- 使用 `useState` 管理從 `DataContext` 讀取並分組的類別列表：
    - `expenseCategories: Category[]`
    - `incomeCategories: Category[]`
- 使用 `useState` 管理當前選中的分頁索引 `tabIndex: number`。

## 5. 導航 (Navigation)

- **進入:** 從 `SettingsScreen` (5.5) 的「類別管理」項目點擊進入。
- **退出:** 點擊頂部導航列的「返回」按鈕。
- **導出:**
    - 點擊列表項目或「新增」按鈕，導航至 `CategoryEditorScreen` (5.7)。
    - (可能) 點擊「新增」按鈕時，若觸發付費牆，則導航至 `PaywallScreen` (5.16)。
