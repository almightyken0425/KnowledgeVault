# 開發計劃 (順序)

_(本文件定義 MVP 範圍內功能的建議開發階段與優先級)_

## Phase 0: 基礎建設 (Setup)

- [ ] 建立 Expo (React Native) 專案。
    
- [ ] 實作 `src/types/index.ts` (根據資料結構定義文件)。
    
- [ ] 建立 `assets/definitions/` 並置入所有標準 JSON 檔案。
    
- [ ] 建立 `src/utils/` (格式化、圖標、時間輔助)。
    
- [ ] 建立 `src/constants/` (主題色)。
    
- [ ] 建立 `src/locales/` 並設定 `i18n.ts` (MVP 階段)。
    
- [ ] 引入狀態管理 (Zustand/Redux) 或決定使用 Context (MVP 階段)。
    

## Phase 1: 認證與後端 (Auth & Backend)

- [ ] 設定 Firebase 專案 (Auth & Firestore)。
    
- [ ] 實作 `src/services/firebase.ts`。
    
- [ ] 實作 `AuthContext` / `useAuth` Hook。
    
- [ ] 建立 `LoginScreen.tsx` (UI + Google 登入邏輯)。
    
- [ ] 建立 App 導航 (`AppNavigator.tsx`)，根據登入狀態切換 `LoginScreen` 或 App 主體。
    
- [ ] 實作 `firestoreService.ts` (用於讀寫使用者資料)。
    
- [ ] 實作「首次登入建立預設資料」的邏輯。
    

## Phase 2: 核心資料管理 (Data Management)

- [ ] 建立 `DataContext` / `useData` Hook (用於獲取和緩存 Firestore 資料)。
    
- [ ] 建立 `AccountManagement/` 畫面 (CRUD 介面，處理拖拉排序邏輯、免費版限制)。
    
- [ ] 建立 `IconPickerScreen.tsx`。
    
- [ ] 建立 `CategoryManagement/` 畫面 (CRUD 介面，實作 Icon 選擇器、`StandardCategoryId` 映射、免費版限制)。
    
- [ ] 建立 `CurrencyRateListScreen.tsx` (手動輸入匯率介面)。
    
- [ ] 建立 `CurrencyRateEditorScreen.tsx`。
    
- [ ] 實作 `PreferenceScreen.tsx` (偏好設定 UI - 時區/基礎貨幣/語系)。
    
- [ ] 實作 `SettingsScreen.tsx` (主頁及登出按鈕)。
    

## Phase 3: 核心記帳流程 (Core Action)

- [ ] 建立 `src/screens/TransactionEditor/components/` (帳戶/類別選擇器, 金額輸入框)。
    
- [ ] 建立 `TransactionEditorScreen.tsx` (收支表單 UI，串接 `firestoreService`)。
    
- [ ] 建立 `TransferEditorScreen.tsx` (同幣別 + 跨幣別轉帳 UI，串接 `firestoreService`)。
    

## Phase 4: 首頁儀表板 (Dashboard)

- [ ] 建立 `HomeScreen.tsx` 基礎佈局 (控制列、內容區、Footer 記帳按鈕)。
    
- [ ] 實作狀態 (State) 管理 (時間區間、所選帳戶、視圖模式)。
    
- [ ] 實作資料查詢與計算邏輯 (從 `DataContext` 讀取、篩選、聚合)。
    
- [ ] 實作「摘要視圖」 (圓餅圖、總計、可滾動摘要列表)。
    
- [ ] 實作「列表視圖」 (按日期分組 **及** 按類別分組)。
    
- [ ] 串接所有互動功能 (視圖切換、時間滑動/點擊、帳戶篩選、點擊列表項目跳轉編輯)。
    
- [ ] 串接 FAB 到 `TransactionEditorScreen`。
    

## Phase 5: MVP 進階功能 (MVP Features)

- [ ] 實作 **`定期交易 (Schedules)`** 建立介面 (Modal/Sheet) (付費功能)。
    
- [ ] 實作 App 啟動時的定期交易產生邏輯。
        
- [ ] 實作交易列表點擊後的「僅此一筆 / 未來所有」編輯/刪除邏輯。
    
- [ ] 實作 `SearchScreen.tsx` (搜尋 `Note` 欄位)。
    
- [ ] 實作 `ImportScreen.tsx` (CSV 匯入交易邏輯)。
    
- [ ] 實作**付費牆 (PaywallScreen)**。
    
- [ ] 串接 **RevenueCat** (或類似服務) 處理 App Store / Google Play 訂閱。
    
- [ ] 在所有付費功能點（建立第 4 個帳戶、第 11 個類別、開啟多幣別、定期交易等）加入付費牆檢查。
    

## Phase 6: 測試與打包 (Testing & Release)

- [ ] 完整測試所有功能（特別是認證、同步、付費流程、資料準確性）。
    
- [ ] 準備 App Icon、啟動畫面。
    
- [ ] 準備 App Store / Google Play 上架資料（含隱私權政策、訂閱項目設定）。
    
- [ ] 打包並提交審核。
