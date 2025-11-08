# 帳戶編輯器畫面 (AccountEditorScreen)

_(本文件定義新增/編輯「帳戶」畫面的 UI、流程與邏輯)_

## 畫面目標 (Screen Objective)

- 提供一個統一的介面，讓使用者可以**新增**一個新帳戶，或**編輯**一個現有帳戶的名稱、圖示等屬性。
- 處理新增外幣帳戶時的匯率輸入流程 _[付費功能]_。

## UI 佈局與元件 (UI Layout & Components)

此畫面通常以 Modal 形式從底部彈出，佔據整個螢幕。

- **頂部導航列 (Top Navigation Bar):**
    - **左側:** 「關閉」或「取消」按鈕。
    - **中間:** 畫面標題，根據模式顯示「新增帳戶」或「編輯帳戶」。
    - **右側:** 「儲存」按鈕，僅在所有必填欄位都有效時才可點擊。

- **核心欄位區 (Core Fields Area):**
    - **帳戶名稱 (`Name`):**
        - **UI:** 一個文字輸入框 (`TextInput`)。此為**必填項**。
    - **圖示 (`Icon`):**
        - **UI:** 一個顯示當前所選圖示的區域，點擊後導航至圖標選擇器畫面 (`IconPickerScreen`)。此為**必填項**。
    - **幣別 (`CurrencyId`):**
        - **UI:** 一個選擇器，點擊後彈出貨幣列表 (`Currency.json`)。
        - **邏輯:** 在「編輯」模式下，此欄位**不可修改**。在「新增」模式下，若選擇非基礎貨幣，需觸發匯率輸入流程。此為**必填項**。
    - **初始餘額 (`InitialBalanceCents`):**
        - **UI:** 一個金額輸入框。
        - **邏輯:** 此欄位**僅在「新增」模式下顯示**。
    - **標準帳戶類型 (`StandardAccountTypeId`):**
        - **UI:** 一個選擇器，點擊後彈出 `StandardAccountType.json` 的列表。
        - **邏輯:** 允許使用者將帳戶歸類 (例如：現金、銀行、投資)。

- **刪除按鈕區 (Delete Button Area):**
    - **UI:** 紅色的「刪除此帳戶」按鈕，僅在「編輯」模式下顯示。

## 核心邏輯

- **模式判斷 (Mode Detection):**
    - 畫面載入時，檢查導航參數中是否傳入 `accountId`。
    - **若有 `accountId` (編輯模式):** 從 `DataContext` 讀取該帳戶的資料並填入表單。
    - **若無 `accountId` (新增模式):** 準備一個空的表單。

- **儲存邏輯 (Save Logic):**
    - **新增模式:**
        - **(付費牆檢查)** 檢查目前使用者帳戶數量是否已達免費版上限 (3個)。若已達上限，則導航至付費牆畫面 (`PaywallScreen`)。
        - **(付費牆檢查 - 多幣別)** 若使用者選擇了非基礎貨幣，檢查 `isPremiumUser` 狀態。若為免費版，導航至 付費牆畫面 (`PaywallScreen`)。
        - **(匯率輸入流程 - 多幣別)** 若使用者為付費版且選擇了非基礎貨幣，在儲存前，必須：
            1.  彈出一個對話框或介面，提示使用者輸入該貨幣對基礎貨幣的**初始匯率** (例如 "1 USD = ? TWD")。
            2.  此匯率輸入為**必填項**。
        - **儲存操作:**
            - 若涉及匯率輸入，將該匯率記錄與帳戶資料在一個批次 (batch) 操作中，分別呼叫 `firestoreService.addCurrencyRate()` 和 `firestoreService.addAccount()` 儲存。
            - 若不涉及，則直接呼叫 `firestoreService.addAccount()` 建立新記錄。
    - **編輯模式:**
        - 呼叫 `firestoreService.updateAccount()` 更新記錄。
    - **儲存成功後:** 關閉畫面並導航返回帳戶列表畫面 (`AccountListScreen`)。

- **刪除邏輯 (Delete Logic):**
    - 點擊「刪除」按鈕時，彈出確認對話框。
    - 使用者確認後，呼叫 `firestoreService.deleteAccount()` (軟刪除，設定 `DeletedOn`)。
    - 刪除成功後，關閉畫面並導航返回帳戶列表畫面 (`AccountListScreen`)。

## 狀態管理 (State Management)

- 使用 `useState` 或表單管理庫來管理以下狀態：
    - `name: string`
    - `iconId: number`
    - `currencyId: number`
    - `initialBalanceCents: bigint`
    - `standardAccountTypeId: number | null`

## 導航 (Navigation)

- **進入:** 從帳戶列表畫面 (`AccountListScreen`) 的「新增」按鈕或列表項目點擊進入。
- **退出:** 點擊「關閉/取消」按鈕，或在「儲存/刪除」成功後，呼叫 `navigation.goBack()`。
