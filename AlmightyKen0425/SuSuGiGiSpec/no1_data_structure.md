# 1. 資料結構

_(本文件定義 App 的核心資料模型與靜態定義)_

## 1. 使用者自訂資料結構 (未來 DB Table)

_(現況: 這些是 App 的核心動態資料，將儲存在 Firestore 中並與 UserId 關聯。)_

### 1.1. 帳戶 (Accounts)

- **欄位:**
    
    - `Id`: String (UUID/GUID) - Primary Key
        
    - `UserId`: String (Email) - Foreign Key (Users), Not Null, Index
        
    - `Name`: String - Not Null
        
    - `Icon`: Number - Foreign Key (IconDefinitions)
        
    - `InitialBalanceCents`: BigInt - Not Null, Default 0
        
    - `CurrencyId`: Number - Foreign Key (Currencies), Not Null
        
    - `StandardAccountTypeId`: Number | Null - Foreign Key (StandardAccountTypes), Nullable
        
    - `IsPrimary`: Boolean - Not Null, Default false (每個 UserId 應只有一個為 true。App 首次啟動為新用戶建立第一個帳戶時，應將其設為 true。當使用者將其他帳戶設為主要時，App 需確保舊的主要帳戶 IsPrimary 被設為 false)
        
    - `SortOrder`: Number - Not Null, Default 0 (用於使用者自訂排序，數字越小越前面)
        
    - `CreatedOn`: Number (Unix Timestamp ms) - Not Null (資料建立的系統時間)
        
    - `DisabledOn`: Number | Null (Unix Timestamp ms) - Nullable
        
    - `DeletedOn`: Number | Null (Unix Timestamp ms) - Nullable, Index (用於軟刪除)
        
    - `LocalHashCode`: String | Null - (用於同步)
        
    - `RemoteHashCode`: String | Null - (用於同步)
        

### 1.2. 類別 (Categories)

- **欄位:**
    
    - `Id`: String (UUID/GUID) - Primary Key
        
    - `UserId`: String (Email) - Foreign Key (Users), Not Null, Index
        
    - `Name`: String - Not Null
        
    - `Icon`: Number - Foreign Key (IconDefinitions)
        
    - `CategoryType`: Number - Not Null (0: 收入, 1: 支出)
        
    - `StandardCategoryId`: Number | Null - Foreign Key (StandardCategory), Nullable (關聯到標準類別)
        
    - `SortOrder`: Number - Not Null, Default 0 (用於使用者自訂排序，數字越小越前面)
        
    - `CreatedOn`: Number (Unix Timestamp ms) - Not Null
        
    - `DisabledOn`: Number | Null (Unix Timestamp ms) - Nullable
        
    - `DeletedOn`: Number | Null (Unix Timestamp ms) - Nullable, Index
        
    - `LocalHashCode`: String | Null
        
    - `RemoteHashCode`: String | Null
        

### 1.3. 交易紀錄 (Transactions)

- **欄位:**
    
    - `Id`: String (UUID/GUID) - Primary Key
        
    - `UserId`: String (Email) - Foreign Key (Users), Not Null, Index
        
    - `CategoryId`: String - Foreign Key (Categories), Not Null
        
    - `AccountId`: String - Foreign Key (Accounts), Not Null
        
    - `AmountCents`: BigInt - Not Null (支出為正值，收入也為正值，由 CategoryType 決定收支)
        
    - `TransactionDate`: Number (Unix Timestamp ms) - Not Null (交易發生日，由使用者選擇，用於報表統計)
        
    - `CreatedOn`: Number (Unix Timestamp ms) - Not Null (資料建立的系統時間)
        
    - `Note`: String | Null - Nullable (用於搜尋)
        
    - `ScheduleId`: String | Null - Foreign Key (Schedules), Nullable (標記此筆為定期交易產生)
        
    - `ScheduleInstanceDate`: Number | Null (Unix Timestamp ms) - Nullable (標記此筆交易對應的排程日期錨點，此欄位永不應被使用者修改，僅供系統檢查重複用)
        
    - `DeletedOn`: Number | Null (Unix Timestamp ms) - Nullable, Index
        
    - `LocalHashCode`: String | Null
        
    - `RemoteHashCode`: String | Null
        

### 1.4. 轉帳紀錄 (Transfers)

- **欄位:**
    
    - `Id`: String (UUID/GUID) - Primary Key
        
    - `UserId`: String (Email) - Foreign Key (Users), Not Null, Index
        
    - `AccountFromId`: String - Foreign Key (Accounts), Not Null
        
    - `AccountToId`: String - Foreign Key (Accounts), Not Null
        
    - `AmountFromCents`: BigInt - Not Null (轉出帳戶的金額，以該帳戶幣別計)
        
    - `AmountToCents`: BigInt - Not Null (轉入帳戶的金額，以該帳戶幣別計)
        
    - `ImpliedRateScaled`: Number | Null - Nullable (儲存換算後的隱含匯率 * 1,000,000，僅供參考)
        
    - `TransactionDate`: Number (Unix Timestamp ms) - Not Null (轉帳發生日，用於報表篩選)
        
    - `CreatedOn`: Number (Unix Timestamp ms) - Not Null (資料建立的系統時間)
        
    - `Note`: String | Null - Nullable (用於搜尋)
        
    - `ScheduleId`: String | Null - Foreign Key (Schedules), Nullable
        
    - `ScheduleInstanceDate`: Number | Null (Unix Timestamp ms) - Nullable
        
    - `DeletedOn`: Number | Null (Unix Timestamp ms) - Nullable, Index
        
    - `LocalHashCode`: String | Null
        
    - `RemoteHashCode`: String | Null
        

### 1.5. 貨幣匯率 (CurrencyRates)

- **欄位:**
    
    - `Id`: String (UUID/GUID) - Primary Key
        
    - `UserId`: String (Email) - Foreign Key (Users), Not Null (因為是手動輸入)
        
    - `CurrencyFromId`: Number - Foreign Key (Currencies), Not Null
        
    - `CurrencyToId`: Number - Foreign Key (Currencies), Not Null
        
    - `RateCents`: BigInt - Not Null (儲存匯率 * 1,000,000 後的整數)
        
    - `RateDate`: Number (Unix Timestamp ms) - Not Null (匯率生效日期，儲存該日 00:00:00 UTC)
        
    - `CreatedOn`: Number (Unix Timestamp ms) - Not Null
        
    - `DeletedOn`: Number | Null (Unix Timestamp ms) - Nullable, Index
        
    - `LocalHashCode`: String | Null
        
    - `RemoteHashCode`: String | Null
        

### 1.6. 定期交易排程 (Schedules)

- **欄位:**
    
    - `Id`: String (UUID/GUID) - Primary Key
        
    - `UserId`: String (Email) - Foreign Key (Users), Not Null
        
    - `ScheduleType`: String - Not Null (e.g., 'daily', 'weekly', 'monthly', 'yearly')
        
    - `StartOn`: Number (Unix Timestamp ms) - Not Null (排程開始日期，基於使用者時區的 00:00:00 轉存 UTC)
        
    - `EndOn`: Number | Null (Unix Timestamp ms) - Nullable (排程結束日期)
        
    - `IsTransfer`: Boolean - Not Null (true: 轉帳排程, false: 收支排程)
        
    - `TemplateAmountCents`: BigInt | Null (收支金額)
        
    - `TemplateCategoryId`: String | Null (收支類別 ID)
        
    - `TemplateAccountId`: String | Null (收支帳戶 ID)
        
    - `TemplateAmountFromCents`: BigInt | Null (轉出金額)
        
    - `TemplateAccountFromId`: String | Null (轉出帳戶 ID)
        
    - `TemplateAmountToCents`: BigInt | Null (轉入金額)
        
    - `TemplateAccountToId`: String | Null (轉入帳戶 ID)
        
    - `TemplateNote`: String | Null
        
    - `CreatedOn`: Number (Unix Timestamp ms) - Not Null
        
    - `DeletedOn`: Number | Null (Unix Timestamp ms) - Nullable, Index
        
    - `LocalHashCode`: String | Null
        
    - `RemoteHashCode`: String | Null
        

### 1.7. 使用者設定 (Settings)

- **說明:** 用於儲存使用者特定的偏好設定，採用 Key-Value 結構。
    
- **欄位:**
    
    - `Id`: String (UUID/GUID) - Primary Key
        
    - `UserId`: String (Email) - Foreign Key (Users), Not Null
        
    - `SettingKey`: String - Not Null (e.g., 'baseCurrencyId', 'timeZone', 'language', 'isPremiumUser', 'lastRecurringCheckDate')
        
    - `SettingValue`: String - Not Null (儲存 JSON 字串或簡單值)
        
    - `UpdatedAt`: Number (Unix Timestamp ms)
        

## 2. App 標準定義資料 (Definitions)

_(現況: 這些是 App 內建的靜態參考資料，將打包在 App 中或從遠端載入。)_

### 2.1. 標準收支類別 (StandardCategory)

- **說明:** 統一管理標準的收支大類，使用者自訂類別需映射到此。
- **檔案:** `assets/definitions/StandardCategory.json`
- **欄位:**
    - `id`: `Number`
    - `CategoryType`: `Number` - (0: 收入, 1: 支出)
    - `translationKey`: `String`
    - `defaultName`: `String`
    

### 2.2. 標準帳戶類型 (StandardAccountType)

- **說明:** 定義帳戶的金融本質分類 (支付、投資、貸款、其他)。
- **檔案:** `assets/definitions/StandardAccountType.json`
- **欄位:**
    - `id`: `Number`
    - `translationKey`: `String`
    - `defaultName`: `String`
    

### 2.3. 圖標定義 (IconDefinition)

- **說明:** 定義 App 內預選的 Feather 圖標及其適用場景 (expense, income, account, general, ui)。使用者資料中只儲存 `id`。
- **檔案:** `assets/definitions/IconDefinition.json`
- **欄位:**
    - `id`: `Number`
    - `featherName`: `String`
    - `types`: `Array<String>`
    - `tags`: `Array<String> | Null` - Optional
    

### 2.4. 貨幣 (Currencies)

- **說明:** 定義支援的貨幣及其基本資訊。
- **檔案:** `assets/definitions/Currency.json`
- **欄位:**
    - `Id`: `Number` - ISO Numeric
    - `Name`: `String`
    - `AlphabeticCode`: `String` - ISO Alpha
    - `NumericCode`: `Number`
    - `MinorUnits`: `Number`
    - `Symbol`: `String | Null`
    

## 3. 時間格式標準

- **儲存標準:**
    - 所有在資料結構中與時間相關的欄位 (如 `TransactionDate`, `CreatedOn`, `DeletedOn`, `RateDate`, `StartOn`, `EndOn`, `ScheduleInstanceDate`) **必須** 儲存為 **UTC Unix Timestamp (毫秒)** (`number` 型別)。
- **計算與顯示標準:**
    - 所有時間的計算（如判斷「今天」、報表區間）和顯示，都**必須**基於使用者在 `Settings` 中設定的**「主要時區 (timeZone)」** 來進行轉換。