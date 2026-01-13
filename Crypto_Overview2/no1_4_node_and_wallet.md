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

---

## 節點 Node 基礎設施 Infrastructure

### 定義 Definition

- **實體基礎 Physical Basis:** 節點是任何一台運行著區塊鏈客戶端軟體如 Bitcoin Core 的電腦或伺服器。
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
- **與節點關係:** 礦機只負責算數學，但算完後必須透過 **節點 Node** 將結果打包並廣播出去。這就是為什麼說礦工必須依賴節點。

---

## 三者互動關係 Interaction

- **前後端架構:**
    - **Wallet 即前端:** 發起交易請求。
    - **Node 即後端:** 驗證交易、廣播交易、查帳。
    - **Miner 即生產端:** 收錄交易到新區塊、執行 PoW、回傳給 Node 廣播。