# 節點與錢包 Node and Wallet

---

## 角色演化 Role Evolution

### 協議定義 vs 角色實作 Protocol vs Implementation

- **協議定義 Protocol:**
    - 創世協議 Genesis Code 僅定義了抽象的資料結構 如 Block, Tx 和共識規則 如 PoW 難度。
    - 它**並沒有**定義節點、錢包或礦工這些具體的軟體實體。
- **角色實作 Implementation:**
    - 下列的三大角色 Node, Wallet, Miner 是為了維持上述協議運作、方便人類參與網路，而自然演化出來的分工形態。
    - 它們是生態系中的**參與者**，而非協議本身的**基本元素**。

### 軟體實現層級 Software Implementation Levels

- **三層架構 Three-Layer Architecture:**
    - **協議規範層 Protocol Layer:**
        - 創世協議定義的資料結構如 Block、Transaction 與共識規則如 PoW、難度調整。
        - 這是所有軟體必須遵循的數位憲法。
    - **軟體實現層 Implementation Layer:**
        - 依據協議規範開發的具體程式碼實現。
        - 可由任何人使用任何語言自行開發，只要符合協議規範即可。
    - **硬體載體層 Hardware Layer:**
        - 運行軟體的物理設備，如個人電腦、伺服器、ASIC 礦機、手機等。

- **軟體類型 Software Types:**
    - **全節點軟體 Full Node Software:**
        - **範例:** Bitcoin Core、btcd、libbitcoin。
        - **功能組合:** 節點驗證 + 錢包管理 + 挖礦介面。
        - **特點:** 完整實現協議規範，儲存完整區塊鏈，任何人可依規範自行開發。
    - **輕錢包 Light Wallet:**
        - **範例:** Electrum、Trust Wallet、MetaMask。
        - **功能組合:** 僅錢包金鑰管理與交易構建功能。
        - **特點:** 不儲存完整區塊鏈，需連接第三方節點查詢 UTXO 與廣播交易。
    - **專業挖礦軟體 Mining Software:**
        - **範例:** CGMiner、BFGMiner、NiceHash Miner。
        - **功能組合:** 僅控制硬體執行雜湊運算。
        - **特點:** 需連接全節點軟體獲取區塊模板與提交結果。

- **功能與軟體的對應關係 Mapping:**
    - **功能角色:** Node、Wallet、Miner 是抽象的功能分類，用於描述職責。
    - **軟體實現:** 一個軟體可包含一種或多種功能角色，例如 Bitcoin Core 同時具備三種功能。
    - **彈性組合:** 使用者可依需求選擇不同軟體組合，例如：
        - 普通用戶：輕錢包 Electrum 連接公共節點。
        - 礦工：專業挖礦軟體 CGMiner + 自建全節點 Bitcoin Core。
        - 開發者：自建全節點 btcd 進行區塊鏈開發。

---

## 節點 Node 基礎設施 Infrastructure

### 定義 Definition

- **實體基礎 Physical Basis:** 節點是任何一台運行著實現協議規範的節點軟體的電腦或伺服器，如 Bitcoin Core、btcd、libbitcoin 等。
- **角色定位 Role:** 它們是構成去中心化網路的細胞，共同維護帳本的真實性。
- **許可性 Permissionless:** 只要軟體符合協議規範，任何人都可自行加入網路，沒有官方許可。

### 核心職責 Responsibilities

- **驗證 Validation:**
    - **守門員 Gatekeeper:** 節點執行協議規則，拒絕任何格式錯誤或簽章無效的資料進入區塊鏈。
- **路由 Routing:**
    - 協助廣播交易與區塊給周圍的鄰居節點，確保資訊在全網擴散。
- **儲存與索引 Storage and Indexing:**
    - **原始帳本 Raw Ledger:** 完整保存從創世區塊至今的所有區塊資料如 blk.dat。
    - **索引資料庫 Index Database:**
        - **目的:** 解決原始區塊鏈資料難以檢索的問題。
        - **結構:**
            - **Key - 交易識別碼 TxID:**
                - **定義:** 交易資料的雙重雜湊 `DoubleSHA256 RawTx`。
                - **性質:** 簽名當下即由錢包自主產生 Independence，不需等待挖礦。
                - **Demo Code:**
                    ```python
                    def calculate_txid(signed_hex):
                        # 還原: 將 API 傳入的 Hex String 解析為物件
                        tx = deserialize(from_hex(signed_hex))

                        # 序列化: 將所有欄位依序拼成一串二進位資料
                        raw_tx = (
                            serialize(tx.version) +
                            serialize(tx.inputs) +
                            serialize(tx.outputs) +
                            serialize(tx.locktime)
                        )
                        # 雙重雜湊: 對這串資料進行兩次 SHA256 運算
                        return SHA256(SHA256(raw_tx))
                    ```
            - **Value - 位置指標 Location:**
                - 包含 `Block Height` 即第幾塊 與 `Position Offset` 即第幾 byte。
        - **功能:** 
            - 支援錢包瞬間查詢餘額 即 UTXO Lookup。
            - 支援防範雙重花費 即 Double Spend Check。
        - **建置時機 Timing:**
            - **生成:** 簽名時即由內容確定，即各方皆可獨立計算。
            - **索引:** 節點驗證區塊後更新 LevelDB。

---

## 錢包 Wallet 使用者介面 User Interface

### 定義 Definition

- **非帳本 Non-Ledger:** 錢包通常不儲存完整區塊鏈，但 Full Node 除外，它只是一個管理工具。
- **本質 Essence:** 它是 **鑰匙圈 Keychan** 與 **介面 Interface** 的結合體。

### 核心功能 Functions

- **金鑰管理 Key Management:**
    - 安全生成、儲存使用者的私鑰與公鑰。
    - 負責對交易進行數位簽章，證明資產所有權。
- **餘額與交易 Balance and Transaction:**
    - **餘額掃描:** 透過節點的 **索引資料庫**，掃描所有屬於該錢包地址的 UTXO，加總計算出餘額。
    - **交易構建:** 協助使用者填寫輸入與輸出，生成符合協議的交易封包並傳送給節點。

---

## 礦工 Miner 生產者 Producer

### 定義 Definition

- **角色定位 Role:** 專門負責執行 **工作量證明 PoW** 以爭取記帳權的角色。
- **執行者 Executor:** 為了爭取協議定義的區塊獎勵，而使用特殊硬體執行雜湊運算的營運單位。

### 實體區分 Distinction

- **礦工 Miner:** 指操作者或營運單位 Entity。
- **礦機 Mining Rig:** 指專門用來執行雜湊運算的特殊硬體 如 ASIC。
- **與節點關係:**
    - **運算分離 Computation Separation:** 現代礦工通常使用專業挖礦軟體如 CGMiner 控制 ASIC 礦機進行雜湊運算。
    - **節點依賴 Node Dependency:** 挖礦軟體需連接全節點軟體如 Bitcoin Core 來：
        - 獲取區塊模板與待處理交易列表。
        - 提交找到的有效 Nonce 與候選區塊。
        - 透過節點廣播新區塊給全網。
    - **分工原因 Division Rationale:** ASIC 礦機僅能執行 SHA256 雜湊運算，無法執行完整的協議驗證邏輯，例如交易合法性檢查、UTXO 驗證等。

---

## 三者互動關係 Interaction

- **前後端架構:**
    - **Wallet 即前端:** 發起交易請求。
    - **Node 即後端:** 驗證交易、廣播交易、查帳。
    - **Miner 即生產端:** 收錄交易到新區塊、執行 PoW、回傳給 Node 廣播。

---

## 全節點架構 Full Node Architecture

### 定義 Definition

- **高層次組合 High-Level Composition:** 全節點是將上述三大功能角色整合於單一軟體的完整實現。
- **自給自足 Self-Sufficient:** 全節點不依賴任何第三方服務，可獨立參與區塊鏈網路的所有活動。
- **最大化去中心化 Maximized Decentralization:** 運行全節點是對網路去中心化程度的最大貢獻。

### 核心特徵 Core Features

- **完整功能 Full Functionality:**
    - **節點功能:** 驗證、廣播、路由、儲存帳本。
    - **錢包功能:** 金鑰管理、餘額查詢、交易構建。
    - **挖礦介面:** 提供區塊模板給專業挖礦軟體，或使用內建挖礦功能。
- **完整儲存 Full Storage:**
    - 下載並儲存從創世區塊至今的完整區塊鏈資料。
    - 儲存需求：比特幣全節點目前需要 500GB+ 儲存空間。
- **獨立驗證 Independent Validation:**
    - 獨立驗證每一筆交易與每一個區塊，不信任任何第三方。
    - 執行完整的協議規則檢查，包括簽名驗證、UTXO 驗證、難度驗證等。
- **軟體範例 Software Examples:**
    - Bitcoin Core、btcd、libbitcoin。

---

## 輕節點架構 Light Node Architecture

### 定義 Definition

- **簡化實現 Simplified Implementation:** 輕節點僅實現區塊鏈驗證的基礎功能，不儲存完整區塊鏈。
- **依賴全節點 Dependency on Full Nodes:** 需要連接全節點來獲取區塊資訊與廣播交易。
- **便利性優先 Convenience-First:** 為行動裝置與一般使用者設計，降低技術門檻與資源需求。

### 核心特徵 Core Features

- **簡化功能 Light Functionality:**
    - **節點功能:** 僅驗證區塊頭，不驗證完整區塊內容。
    - **錢包功能:** 金鑰管理、餘額查詢、交易構建。
    - **挖礦介面:** 無。
- **最小化儲存 Minimal Storage:**
    - 僅儲存區塊頭 Block Headers，不下載完整區塊內容。
    - 儲存需求：通常僅需數 MB 至數十 MB。
- **部分驗證 Partial Validation:**
    - 驗證區塊頭的 PoW 難度是否符合要求。
    - 無法驗證區塊內交易的合法性，需信任全節點提供的資訊。
- **軟體範例 Software Examples:**
    - 大多數手機錢包如 Trust Wallet、Exodus Mobile。

---

## SPV 節點架構 SPV Node Architecture

### 定義 Definition

- **簡化支付驗證 Simplified Payment Verification:** SPV 是輕節點的一種特定實現方式，由中本聰在白皮書中提出。
- **Merkle 證明 Merkle Proof:** 利用 Merkle Tree 特性，只需區塊頭就能驗證交易是否存在於區塊中。
- **信任假設 Trust Assumption:** 假設多數算力是誠實的，最長鏈即為真實鏈。

### 核心特徵 Core Features

- **SPV 功能 SPV Functionality:**
    - **節點功能:** 僅驗證交易存在性，不驗證交易合法性。
    - **錢包功能:** 金鑰管理、餘額查詢、交易構建。
    - **挖礦介面:** 無。
- **區塊頭儲存 Header-Only Storage:**
    - 下載並驗證區塊頭鏈，確認 PoW 連續性。
    - 儲存需求：區塊頭 80 bytes × 區塊數量，如比特幣約 60MB。
- **Merkle 路徑驗證 Merkle Path Validation:**
    - 向全節點請求特定交易的 Merkle Proof。
    - 驗證交易 TxID 是否真的被包含在某個區塊的 Merkle Root 中。
    - 無法驗證 UTXO 是否已被花費，需信任全節點不會欺騙。
- **軟體範例 Software Examples:**
    - Electrum SPV 模式、早期 Bitcoin Wallet for Android。

---

## 節點類型比較 Node Type Comparison

| 特性         | 全節點 Full Node         | 輕節點 Light Node    | SPV 節點 SPV Node            |
| ------------ | ------------------------ | -------------------- | ---------------------------- |
| **儲存需求** | 500GB+ 完整區塊鏈        | 數 MB 至數十 MB      | 約 60MB 區塊頭               |
| **驗證能力** | 完整驗證所有交易與區塊   | 僅驗證區塊頭 PoW     | 驗證交易存在性，不驗證合法性 |
| **信任模型** | 完全自主，不信任任何人   | 需信任連接的全節點   | 假設多數算力誠實             |
| **功能組合** | 節點 + 錢包 + 挖礦介面   | 簡化節點 + 錢包      | SPV 驗證 + 錢包              |
| **網路貢獻** | 最大化去中心化與安全性   | 不貢獻驗證能力       | 不貢獻驗證能力               |
| **適用場景** | 礦工、開發者、注重安全者 | 一般行動裝置使用者   | 注重隱私與輕量的使用者       |
| **軟體範例** | Bitcoin Core、btcd       | Trust Wallet、Exodus | Electrum SPV 模式            |