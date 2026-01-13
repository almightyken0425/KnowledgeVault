# 交易建立 Transaction Creation

## 請求本質 The Request Essence

- **定義 Definition:** 交易本質上是一次向去中心化資料庫發送的狀態變更 API 請求 State Change Request。

---

## API 封包結構 Packet Structure

```python
# API 請求封包示意
rpc_request = {
    # HTTP Header: 標準的通訊協定標頭
    "http_header": {
        "content_type": "application/json"
    },

    # RPC Envelope: JSON-RPC 封裝格式
    "rpc_envelope": {
        "method": "sendrawtransaction",     # 方法: 呼叫節點的發送交易功能
        "params": ["<Signed Hex String>"],  # 參數: 內含核心 Payload 這才是協議真正處理的對象
        "id": "unique_id_1"                 # 識別碼: 用於追蹤請求的回應
    }
}
```

---

## Payload 定義 Payload Definition

```python
# 交易物件結構示意
tx_object = {
    # 交易標頭: 讓節點判斷是否接受此交易的基本參數
    "header": {
        "version": 1,                       # 協議版本: 由錢包軟體依據當前網路規範自動填入
        "locktime": 0                       # 鎖定時間: 限制交易最早可被執行的區塊高度或時間點
    },

    # 交易主體: 描述資產的來源與去向
    "body": {
        # 資產來源: 引用自己過去的 UTXO 並提供解鎖證明
        "inputs": [
            {
                "txid": "prev_tx_hash_001", # 引用指標: 來源交易ID即指向過去某筆交易的 Hash
                "vout": 0,                  # 引用索引: 該資產在上一筆交易輸出列表中的位置
                "script_sig": "3045...01"   # 解鎖腳本: 包含數位簽章與公鑰證明擁有權
            },
            {
                "txid": "prev_tx_hash_002", # 引用指標: 另一筆來源交易
                "vout": 1,                  # 引用索引: 該交易的第二個輸出
                "script_sig": "3046...02"   # 解鎖腳本: 對應此 UTXO 的簽章
            }
        ],
        # 資產去向: 分配金額給接收者與找零地址
        "outputs": [
            {
                "value": 5000000,           # 轉移金額: 單位為 Satoshi
                "script_pub_key": "OP_DUP..." # 鎖定腳本: 定義接收者地址與解鎖條件
            }
        ]
    }
}
```

---

## 關鍵欄位溯源與生成 Data Provenance and Generation

這張表解釋了 JSON 中每一個數值具體是從哪裡來的，以及經過了什麼運算。

### 輸出鎖 Lock ScriptPubKey

這就是你要轉帳的對象。

- **來源 Source UI:** 使用者在錢包介面的 接收地址 欄位輸入了 `1A1z...`。
- **原始資料 Raw Data:** Base58 編碼的字串。
- **處理程序 Process Address Decoding:**
    - **Base58Check 解碼:** 錢包將字串還原為 20 bytes 的 公鑰雜湊 Public Key Hash。
    - **腳本包裝:** 錢包自動在前後加上標準 OpCodes。
- **目的與位置 Target:** 填入 `body.outputs[0].script_pub_key`。

**邏輯演示 Demo Code:**

這些 OP 開頭的常數即 **堆疊語言操作碼 Script Opcodes**，由協議定義，用於控制驗證流程。

```python
# 1. 解碼: 將地址還原為 20-byte Hash
pub_key_hash = base58_decode(address_string)

# 2. 拼裝: 加上鎖定腳本的操作碼
script_pub_key = (
    OP_DUP +          # 指令 複製堆疊頂端的公鑰
    OP_HASH160 +      # 指令 對公鑰進行 Hash 運算
    pub_key_hash +    # 資料 填入接收者的公鑰指紋
    OP_EQUALVERIFY +  # 指令 檢查 Hash 是否一致
    OP_CHECKSIG       # 指令 驗證數位簽章是否正確
)
```

### 輸入源 Source TxID and Vout

這就是你要花的那筆錢。

- **來源 Source Internal DB:** 錢包軟體掃描本地的 UTXO Set 或查詢索引資料庫。
- **原始資料 Raw Data:** 一列表包含 `txid` 與 `vout` 的未花費交易輸出。
- **處理程序 Process Coin Selection:**
    - **演算法:** 錢包根據使用者輸入的轉帳金額如 5 BTC，自動挑選總合大於 5 BTC 的數個 UTXO。
- **目的與位置 Target:** 填入 `body.inputs` 陣列中。

**邏輯演示 Demo Code:**

```python
selected_inputs = []
current_value = 0

# 遍歷錢包內所有可用餘額
for utxo in my_utxo_set:
    # 挑選金幣直到湊滿目標金額
    if current_value < target_amount:
        selected_inputs.append({
            "txid": utxo.txid,
            "vout": utxo.vout
        })
        current_value += utxo.value
```

### 解鎖證 Witness ScriptSig

這就是你的私章。

- **來源 Source Keystore:** 儲存在錢包安全區如 Secure Enclave 中的 私鑰 Private Key。
- **原始資料 Raw Data:** `k Client Random` 與 `PrivKey`。
- **處理程序 Process Digital Signing:**
    - **摘要:** 將組裝好的 `tx_object` 不含 script_sig 進行 DoubleSHA256。
    - **簽署:** 使用 `PrivKey` 對摘要進行 ECDSA 運算，生成 `r, s` 簽章對。
- **目的與位置 Target:** 填入 `body.inputs[x].script_sig`。

**邏輯演示 Demo Code:**

```python
# 序列化: 將欄位不含 ScriptSig 轉為二進位
raw_bin = (
    serialize(tx_object['header']['version']) +
    serialize(tx_object['body']['inputs']) + 
    serialize(tx_object['body']['outputs']) +
    serialize(tx_object['header']['locktime'])
)

# 數位簽章: 產生解鎖腳本
# 將序列化後的交易資料 Hash 搭配私鑰進行 ECDSA 簽名運算
sig = ecdsa_sign(sha256(raw_bin), private_key)

# 將簽章填回 Input 中
tx_object['body']['inputs'][0]['script_sig'] = sig
```

---

## API 參數生成 Params Generation

當所有欄位包含 script_sig 都準備就緒後，最後一步就是將其轉換為 API 所需的 hex 字串：

- **序列化 Serialization:**
    - 將 Tx Object 依照協議規定的位元組順序 Byte Order 緊密排列，形成一串無間隔的 **二進位資料 Binary Stream**。
- **十六進位編碼 Hex Encoding:**
    - 將上述二進位資料轉換為人類可讀的 **十六進位字串 Hex String**。
    - **結果:** 這個字串就是最終填入 API `params` 中的 `<Signed Hex String>`。

**邏輯演示 Demo Code:**

```python
# 最終序列化: 包含簽章的完整資料
signed_bin = (
    serialize(tx_object['header']['version']) +
    serialize(tx_object['body']['inputs']) +  # 此時已含 ScriptSig
    serialize(tx_object['body']['outputs']) +
    serialize(tx_object['header']['locktime'])
)

# 編碼: 轉為 Hex String
payload_hex = to_hex(signed_bin) # 即 Base16 標準編碼
# payload_hex 即為填入 API params 的最終值

# 補充: 錢包在此時即可算出 TxID
# 用途: 僅用於本地資料庫追蹤，如顯示 Pending 用，不需傳給節點
txid = sha256(sha256(signed_bin))
```

---

## 用戶端發送 Client Dispatch Online

- **端點發現 Endpoint Discovery:**
    - **DNS Seeds:** 查詢協議內建的域名以獲取種子節點列表。
    - **Hardcoded:** 預設連線至基礎設施服務商節點如 Infura 或本地節點 Localhost。
- **傳輸方法 Method:**
    - 使用 HTTP POST 將 JSON-RPC 封包發送至目標節點的 RPC Port。

---

## 狀態確認 Status Confirmation

交易送出後，確認流程分為兩個階段：

### 第一階段 - 同步回應 Sync Response
- **Mempool Entry:**
    - 節點收到 API 請求後，驗證簽名與餘額，若通過則放入 Mempool 並回傳 HTTP 200 OK。
    - **含義:** 交易合法且已進入候機室，但尚未起飛。
- **Mempool 即 Memory Pool:**
    - 節點用於暫存 合法但尚未上鏈 交易的記憶體池。
- **雙重花費檢查 Double Spend Check:**
    - **問題:** 若離線產生了兩筆花費相同 UTXO 的交易，誰會被接受？
    - **機制:** 節點收到交易時，會檢查該 UTXO 是否已存在於 Mempool 或 UTXO Set 中。若已存在，後到的交易會被直接拒絕 Error。

### 第二階段 - 非同步確認 Async Confirmation
- **Block Mining:**
    - 需等待數分鐘，直到礦工將 Mempool 中的交易打包進區塊並廣播。
    - **含義:** 交易已寫入區塊鏈帳本，真正完成資產轉移。
- **查詢方式:**
    - 客戶端需透過另一個 API 如 `gettransaction` 來輪詢交易是否已被收錄及其確認數。