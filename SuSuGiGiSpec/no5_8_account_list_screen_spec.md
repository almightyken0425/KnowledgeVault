# 設定 - 帳戶列表 (AccountListScreen)

_(本文件定義「帳戶管理」列表畫面的 UI、流程與邏輯)_

## 畫面目標 (Screen Objective)

- 提供一個讓使用者可以**查看**、**排序**和**管理**所有帳戶的介面。
- 顯示各帳戶的目前餘額。
- 作為新增、編輯或刪除特定帳戶的入口。

## UI 佈局與元件 (UI Layout & Components)

- **頂部導航列 (Top Navigation Bar):**
    - **左側:** 「返回」按鈕，導航回設定主頁 (`SettingsScreen`)。
    - **中間:** 畫面標題，顯示「帳戶管理」。
    - **右側:** 「新增」按鈕（一個 `+` 圖示），點擊後導航至帳戶編輯器畫面 (`AccountEditorScreen`) 的「新增」模式。

- **頁面主體 (Body):**
    - **帳戶列表 (Account List):**
        - **UI:** 一個可滾動的列表 (`DraggableFlatList`)，顯示所有未被刪除的帳戶。
        - **排序與顯示:**
            - 列表應根據 `SortOrder` 欄位排序顯示。
            - **項目內容 (每筆):**
                - 左側：帳戶圖示 (`Icon`)。
                - 中間 (垂直排列):
                    - 上方：帳戶名稱 (`Name`)。
                    - 下方：帳戶類型 (`StandardAccountType`)，如果有的話。
                - 右側：帳戶餘額 (`Balance`)，需格式化並顯示幣別。
                - 最右側：拖拉排序的圖示 (Drag Handle)。
            - **空狀態 (Empty State):** 如果沒有任何帳戶，則顯示提示文字，例如「您尚未建立任何帳戶」。

## 核心邏輯

- **資料載入邏輯:**
    - 畫面載入時，從 `DataContext` 讀取所有 `Accounts`。
    - 根據 `SortOrder` 欄位對帳戶進行初始排序。
    - 計算並顯示每個帳戶的當前餘額。

- **互動邏輯:**
    - **點擊列表項目:** 導航至帳戶編輯器畫面 (`AccountEditorScreen`) 的「編輯」模式，並傳入該帳戶的 `accountId`。
    - **拖拉排序:**
        - 使用者可以長按並拖拉列表中的任何帳戶來重新排序。
        - 拖拉結束後，App 必須更新所有受影響帳戶的 `SortOrder` 欄位，並將變動儲存至 `firestoreService`。
    - **點擊頂部「新增」按鈕:**
        - 導航至帳戶編輯器畫面 (`AccountEditorScreen`) 的「新增」模式。

- **付費牆檢查:**
    - 在點擊頂部「新增」按鈕並導航之前，應先檢查 `isPremiumUser` 狀態以及目前帳戶的總數。
    - 如果使用者是免費版且帳戶數量已達上限 (3個)，則應直接導航至付費牆畫面 (`PaywallScreen`)，而非帳戶編輯器畫面 (`AccountEditorScreen`)。

## 狀態管理 (State Management)

- 使用 `useState` 管理從 `DataContext` 讀取的帳戶列表：
    - `accounts: Account[]`

## 導航 (Navigation)

- **進入:** 從設定主頁 (`SettingsScreen`) 的「帳戶管理」項目點擊進入。
- **退出:** 點擊頂部導航列的「返回」按鈕。
- **導出:**
    - 點擊列表項目或頂部「新增」按鈕，導航至帳戶編輯器畫面 (`AccountEditorScreen`)。
    - (可能) 點擊「新增」按鈕時，若觸發付費牆，則導航至付費牆畫面 (`PaywallScreen`)。
