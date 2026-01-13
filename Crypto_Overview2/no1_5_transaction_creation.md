# 交易建立 Transaction Creation

## 請求本質 The Request Essence

- **定義 Definition:** 交易本質上是一次向去中心化資料庫發送的狀態變更請求 State Change Request。
- **特性 Characteristics:**
    - **離線構建 Offline Construction:** 請求封包的建立與簽名完全在客戶端本地完成，無需網路連接。
    - **不可否認 Non-repudiation:** 透過數學簽章機制，確保請求一旦發出便無法被偽造或抵賴。

---

## API 封包結構 Packet Structure

- **HTTP Header:**
    - `Content-Type`: `application/json`
- **RPC Envelope:** 採用 JSON-RPC 2.0 標準格式封裝。
    - `method`: `sendrawtransaction`
    - `params`: `["<Signed Hex String>"]` 核心交易資料的存放位置。
    - `id`: Client 端生成的唯一識別碼。
- **Payload:** 即上述 `params` 中的十六進位字串，它是區塊鏈協議真正處理的對象。

---

## Payload 定義 Payload Definition

**交易標頭 Transaction Header:**

- **Version:** 協議版本號，由錢包軟體依據當前網路規範自動填入。
    - **來源:** 依據網路協議規範填入，如主網預設為 1 或軟分叉升級後可能變更為 2。
- **Locktime:** 鎖定時間，限制交易最早可被執行的區塊高度或時間點。

**交易主體 Transaction Body:**

- **Inputs 輸入:** 描述資產來源。
    - `Previous TxID`: 上一筆交易的 Hash ID。
    - `Vout`: 該資產在上一筆交易輸出列表中的索引位置。
    - `ScriptSig`: 包含數位簽章與公鑰的解鎖腳本。
- **Outputs 輸出:** 描述資產去向。
    - `Value`: 轉移金額，單位 Satoshi。
    - `ScriptPubKey`: 定義接收條件的鎖定腳本。

---

## 欄位來源與生成 Field Generation

- **Inputs 來源:**
    - **前置作業 - 索引查詢 Index Lookup:**
        - **挑戰:** 區塊鏈原始資料如 blk.dat 像沒目錄的日記本，無法直接逆推尋找我要花哪筆錢。
        - **解法:** 節點軟體維護高效能 Key Value 資料庫如 LevelDB 將 TxID 對映到 Block Location。
        - **流程:** 錢包軟體透過這個索引，瞬間查到某筆 TxID 及其 Output 狀態。
    - `TxID/Vout`: 錢包軟體掃描本地的 UTXO Set 資料庫，找出屬於使用者的可用餘額。
    - `ScriptSig`: 解鎖腳本，由下列核心元件組合而成。
        - **數位簽章 Digital Signature:**
            - **定義:** 針對該筆交易內容的加密證明。
            - **來源:** 由 **私鑰** 配合 **交易摘要** 共同運算生成的動態數值，隨交易內容不同而改變。
        - **公鑰 Public Key:**
            - **定義:** 用於驗證上述簽章的公開金鑰。
            - **來源:** 僅由 **私鑰** 單向導出的靜態數值，固定不變且與交易內容無關。
- **Outputs 來源:**
    - `ScriptPubKey`: 將接收者的地址 Address 透過 Base58 解碼後，填入標準的鎖定腳本模板中。
- **序列化 Serialization:**
    - 所有的上述欄位依照協議規定的位元組順序 Byte Order 緊密排列，最終編碼為一串 Hex String。

---

## 用戶端發送 Client Dispatch Online

- **端點發現 Endpoint Discovery:**
    - **DNS Seeds:** 查詢協議內建的域名以獲取種子節點列表。
    - **Hardcoded:** 預設連線至基礎設施服務商節點如 Infura 或本地節點 Localhost。
- **傳輸方法 Method:**
    - 使用 HTTP POST 將 JSON-RPC 封包發送至目標節點的 RPC Port。

---

## 伺服器回應 Server Response

- **同步回應 Sync Response:** 針對 Mempool 狀態的回應。
    - **200 OK:** 若 Result 回傳 TxID 代表節點驗證簽名與格式無誤，已將交易加入記憶體池等待打包。
    - **Error:** 簽章無效、格式錯誤或雙重花費 Double Spend，請求被拒絕。
- **非同步確認 Async Confirmation:** 針對 Mining 狀態的確認。
    - 真正的「寫入成功」並非發生在 HTTP 回應當下，而是需等待礦工將交易打包進區塊，並被網路確認之後。

---

## 雜湊識別碼生命週期 TxID Lifecycle

### 生成與定義 Generation and Definition

- **隱式存在 Implicit Existence:**
    - **TxID** 並非交易結構中的一個明確欄位。
    - **生成方式:** 它是將整筆 **交易資料 Version 加 Inputs 加 Outputs 加 Locktime** 進行雜湊運算 `DoubleSHA256(RawTx)` 所得到的結果。
    - **邏輯演示 Demo Code:**
        ```python
        def calculate_txid(tx):
            # 1. 序列化: 將所有欄位依序拼成一串二進位資料
            raw_tx = (
                serialize(tx.version) +
                serialize(tx.inputs) +
                serialize(tx.outputs) +
                serialize(tx.locktime)
            )
            
            # 2. 雙重雜湊: 對這串資料進行兩次 SHA256 運算
            txid = SHA256(SHA256(raw_tx))
            
            return txid # 這就是下一筆交易用來引用我的 ID
        ```

### 引用機制 Referencing Mechanism

- **輸出的定位 Output Referencing:**
    - 因為 Output 沒有自己的 ID，所以我們用 **哪一筆交易 TxID** 的 **第幾個產出物 Vout Index** 來唯一鎖定它。
- **輸入的宣告 Input Declaration:**
    - 在填寫 `inputs` 時，欄位中的 `Previous TxID` 即是指向上述計算出來的歷史交易雜湊，作為資金來源憑證。

---

