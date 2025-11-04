# 5.5. 設定主頁 (SettingsScreen)

_(本文件定義「設定」主畫面的 UI、流程與邏輯)_

## 1. 畫面目標 (Screen Objective)

- 提供一個中心化的入口，讓使用者可以存取所有與帳戶、資料和偏好設定相關的功能。
- 提供登出和升級至付費版的路徑。

## 2. UI 佈局與元件 (UI Layout & Components)

- **2.1. 頂部導航列 (Top Navigation Bar):**
    - **左側:** 「返回」或「關閉」按鈕，將使用者導航回 `HomeScreen`。
    - **中間:** 畫面標題，顯示「設定」。

- **2.2. 設定列表 (Settings List):**
    - **UI:** 一個分組列表 (`SectionList`)，將相關的設定項目組織在一起。
    - **項目:**
        - **第一組：資料管理 (Data Management)**
            - **帳戶管理:**
                - **UI:** 包含圖示和「帳戶管理」文字。
                - **導航:** 點擊後導航至 `AccountListScreen` (5.8)。
            - **類別管理:**
                - **UI:** 包含圖示和「類別管理」文字。
                - **導航:** 點擊後導航至 `CategoryListScreen` (5.6)。
            - **匯率管理:**
                - **UI:** 包含圖示和「匯率管理」文字，並在右側顯示一個 "Premium" 標籤。
                - **導航:** 點擊後導航至 `CurrencyListScreen` (5.11)。

        - **第二組：偏好設定 (Preferences)**
            - **偏好設定:**
                - **UI:** 包含圖示和「偏好設定」文字。
                - **導航:** 點擊後導航至 `PreferenceScreen` (5.14)，用於設定基礎貨幣、時區、語系。

        - **第三組：升級 (Upgrade)**
            - **升級至 Premium:**
                - **UI:** 一個醒目的項目，包含圖示和「升級至 Premium」文字。
                - **邏輯:** 此項目**僅對免費版使用者顯示**。
                - **導航:** 點擊後導航至 `PaywallScreen` (5.17)。

        - **第四組：帳號 (Account)**
            - **登出:**
                - **UI:** 紅色的「登出」文字按鈕。
                - **邏輯:** 點擊後觸發登出流程 (見 `3.2`)。

## 3. 核心邏輯

- **3.1. 付費功能處理 (Premium Feature Handling):**
    - 畫面載入時，從 `DataContext` 或 `AuthContext` 讀取 `isPremiumUser` 狀態。
    - **「匯率管理」項目:** 對於免費版使用者，雖然此項目可見，但在點擊導航至 `CurrencyListScreen` 之前，應先檢查會員狀態，若為免費版則直接導向 `PaywallScreen`。
    - **「升級至 Premium」項目:** 根據 `isPremiumUser` 狀態動態顯示或隱藏。

- **3.2. 登出邏輯 (Logout Logic):**
    - 點擊「登出」按鈕時，彈出一個確認對話框（例如：「您確定要登出嗎？」）。
    - 使用者確認後，呼叫 `authService.signOut()`。
    - `AuthContext` 應監聽認證狀態的變化。當偵測到使用者已登出時，`AppNavigator` 會自動將畫面切換回 `LoginScreen` (5.1)。

## 4. 導航 (Navigation)

- **進入:** 從 `HomeScreen` (5.2) 的頂部導航列點擊「設定」圖示進入。
- **退出:** 點擊頂部導航列的「返回/關閉」按鈕，返回 `HomeScreen`。
