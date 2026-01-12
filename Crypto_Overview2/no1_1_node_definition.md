# 節點定義 Node Definition

## 節點基本定義 Node Basic Definition

- **實體基礎 Physical Basis:** 節點是任何一台運行著區塊鏈客戶端軟體 如 Bitcoin Core 的電腦或伺服器。
- **角色定位 Role:** 它們是構成去中心化網路的細胞，共同維護帳本的真實性。
- **運作狀態 Operational Status:** 一旦軟體連上網路並開始與 peers 清單中的其他電腦交換數據，該設備即成為節點。
- **許可性 Permissionless:** 只要軟體符合協議規範 例如正確的序列化格式，任何人都可自行開發客戶端加入網路，無須官方許可。

---

## 節點啟用程序 Node Activation

- **軟體取得 Software Acquisition:** 參與者從官方網站或開源庫下載編譯好的客戶端程式。
- **初始化 Initialization:** 啟動程式後，軟體建立本地資料庫目錄，並載入預設的協議參數。
- **創世載入 Genesis Loading:** 軟體從原始碼中讀取硬編碼的創世區塊 Block Height 0，這是鏈上唯一沒有父區塊的信任基石。
- **身份轉換 Identity Transition:** 軟體開始依據硬編碼的種子節點列表尋找鄰居，正式加入 P2P 網路。
- **初始下載 Initial Block Download:** 新節點需花費數天至數週從其他節點下載並驗證過去所有的歷史區塊，確保帳本資料正確無誤。

---

## 核心職責 Node Core Responsibilities

- **驗證 Validation:**
    - **守門員 Gatekeeper:** 節點執行協議規則，拒絕任何格式錯誤或簽章無效的資料進入區塊鏈。
    - **拒絕機制 Rejection Component:** 不合規的交易在進入鏈上之前就會被節點直接丟棄，無法被寫入區塊。
- **路由 Routing:**
    - 協助廣播交易與區塊給周圍的鄰居節點，確保資訊在全網擴散。
- **儲存 Storage:**
    - **全節點 Full Node:** 需準備足夠容量的硬碟 例如 500GB 以上 以儲存從創世區塊至今的完整帳本。
    - **輕節點 Light Node:** 為了輕量化 如手機 App，只儲存區塊頭與與自己相關的資料，查詢餘額需向全節點請求。
- **挖礦 Mining:**
    - 投入算力競爭出塊權，此非所有節點必備功能。
- **錢包 Wallet:**
    - 管理使用者的私鑰與餘額查詢。

---

**文件結束**