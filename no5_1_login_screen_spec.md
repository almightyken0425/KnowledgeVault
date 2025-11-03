# 5.1. 登入畫面 (LoginScreen)

_(本文件定義登入畫面的 UI、流程與邏輯)_

## 1. UI 佈局

- **視覺中心:** App Logo 或名稱 (例如 "速速記記")。
    
- **價值主張 (Value Prop):** 簡短的標語，強調 App 的核心價值 (例如：「輕鬆記帳，雲端同步」)。
    
- **登入按鈕:** 一個醒目的「**使用 Google 登入**」按鈕 (包含 Google Logo 和文字)。
    
- **政策連結:** 頁面底部必須有指向「服務條款」和「隱私權政策」的純文字連結。
    

## 2. 核心互動與流程

1. **App 啟動:** App 啟動時，`AppNavigator` (或 `AuthContext`) 檢查使用者是否已有有效的登入狀態 (例如，本地有 Firebase Auth 的 token)。
    
2. **判斷導航:**
    
    - **若已登入:** 直接導航至 `HomeScreen` (5.2)。
        
    - **若未登入:** 顯示此 `LoginScreen` (5.1)。
        
3. **使用者點擊「使用 Google 登入」:**
    
    - 觸發 `authService.signInWithGoogle()` 函數。
        
4. **認證流程 (呼叫 `authService`):**
    
    - App 呼叫 Firebase Authentication SDK，彈出 Google 帳號選擇視窗。
        
    - 使用者選擇帳號並同意授權。
        
5. **認證成功:**
    
    - Firebase Auth 返回使用者憑證，`authService` 從中獲取 `UserId` (Email)。
        
    - `authService` 觸發「首次登入流程」 (定義於 `2. 核心功能規格.md` 4. 節)：
        
        - 檢查 Firestore 該 `UserId` 是否有資料。
            
        - **(新用戶)** 建立預設資料 (幣別、時區、帳戶、類別) 並上傳 Firestore (數量需符合免費版限制)。
            
        - **(舊用戶)** 觸發 `firestoreService` 開始下載/同步資料。
            
    - `AuthContext` 狀態更新為「已登入」。
        
6. **導航:** `AppNavigator` 偵測到登入狀態改變，自動導航至 `HomeScreen` (5.2)。
    

## 3. 錯誤處理

- **使用者取消登入:** (例如關閉 Google 選擇視窗) - 停留在登入畫面，可選顯示一個非侵入性提示 (Toast) "登入已取消"。
    
- **網路錯誤:** 登入過程中若無網路，應顯示錯誤提示 (例如 "請檢查網路連線")。
    
- **認證失敗 (來自 Google/Firebase):** 顯示通用的錯誤提示 (例如 "登入失敗，請稍後再試")。