# 交易建立 Transaction Creation

## 請求本質 The Request Essence

- **定義 Definition:** 交易本質上是一次向世界狀態機發送的狀態變更 API 請求 State Change Request，可以是簡單的 ETH 轉帳，也可以是呼叫智能合約函數。

---

## API 封包結構 Packet Structure

```python
# API 請求封包示意
rpc_request = {
    # HTTP Header: 標準的通訊協定標頭
    "http_header": {
        "content_type": "application/json"
    },

    # RPC Envelope: JSON-RPC 2.0 封裝格式
    "rpc_envelope": {
        "jsonrpc": "2.0",                     # JSON-RPC 版本
        "method": "eth_sendRawTransaction",   # 方法: 呼叫節點的發送交易功能
        "params": ["0x<RLP Encoded Hex>"],    # 參數: 內含核心 Payload 這才是協議真正處理的對象
        "id": 1                               # 識別碼: 用於追蹤請求的回應
    }
}
```

---

## Payload 定義 Payload Definition

```python
# 交易物件結構示意 - Legacy Transaction Type 0
tx_object = {
    # 交易標頭: 讓節點判斷是否接受此交易的基本參數
    "header": {
        "nonce": 5,                         # 序號: 發送者的交易計數器，防止重放攻擊
        "gas_price": 20000000000,           # Gas 單價: 願意支付的每單位 Gas 費用，單位為 Wei
        "gas_limit": 21000,                 # Gas 上限: 此交易最多可消耗的運算量
        "chain_id": 1                       # 鏈 ID: 主網為 1，防止跨鏈重放攻擊
    },

    # 交易主體: 描述資產的去向與操作
    "body": {
        "to": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",   # 目標地址: 接收者地址或合約地址，若為空則部署新合約
        "value": 1000000000000000000,       # 轉移金額: 要轉移的 ETH 數量，單位為 Wei，1 ETH = 10^18 Wei
        "data": "0x"                        # 輸入資料: 若為合約呼叫則包含 Method ID 與參數，簡單轉帳則為空
    },

    # 數位簽章: 證明交易發起人的身份
    "signature": {
        "v": 37,                            # 恢復識別碼: 用於從簽章還原公鑰，包含 chain_id 資訊
        "r": "0x28ef61340bd939bc2195fe537567866003e1a15d3c71ff63e1590620aa636276",  # 簽章 r 值
        "s": "0x67cbe9d8997f761aecb703304b3800ccf555c9f3dc64214b297fb1966a3b6d83"   # 簽章 s 值
    }
}
```

---

## 關鍵欄位溯源與生成 Data Provenance and Generation

這張表解釋了 JSON 中每一個數值具體是從哪裡來的，以及經過了什麼運算。

### 交易序號 Nonce

這確保交易的順序性與唯一性。

- **來源 Source Internal State:** 錢包查詢發送者地址在區塊鏈上的當前交易計數。
- **原始資料 Raw Data:** 整數值，從 0 開始遞增。
- **處理程序 Process Query:**
    - **API 查詢:** 錢包呼叫 `eth_getTransactionCount` 取得該地址已發送的交易總數。
    - **本地追蹤:** 若有多筆待處理交易，錢包需自行遞增追蹤。
- **目的與位置 Target:** 填入 `header.nonce`。

**邏輯演示 Demo Code:**

```python
# 查詢: 取得當前 nonce 值
current_nonce = web3.eth.get_transaction_count(sender_address, 'pending')

# 若有多筆待發送交易，需要手動遞增
tx_object['header']['nonce'] = current_nonce + pending_tx_count
```

### 目標地址 To Address

這就是你要轉帳或呼叫的對象。

- **來源 Source UI:** 使用者在錢包介面的接收地址欄位輸入了 `0x742d35...`。
- **原始資料 Raw Data:** 十六進位字串，40 個字元加上 `0x` 前綴。
- **處理程序 Process Validation:**
    - **格式檢查:** 錢包驗證地址長度為 42 字元且符合十六進位格式。
    - **校驗和驗證:** 可選的 EIP-55 混合大小寫校驗和檢查。
- **目的與位置 Target:** 填入 `body.to`。

**特殊情況:**
- **部署合約:** 若 `to` 為空 `null`，則 `data` 欄位必須包含合約的 Bytecode，交易執行後會創建新合約。

### 輸入資料 Data

這定義了要執行的操作。

- **來源 Source UI:** 使用者選擇的操作類型與參數。
- **原始資料 Raw Data:** 依操作類型而異。
- **處理程序 Process Encoding:**
    - **簡單轉帳:** `data = "0x"` 空資料。
    - **合約呼叫:** 
        - **Function Selector:** 函數簽名的 Keccak256 雜湊前 4 bytes。
        - **ABI Encoding:** 將參數依照 ABI 規範編碼為十六進位。
- **目的與位置 Target:** 填入 `body.data`。

**邏輯演示 Demo Code:**

```python
# 範例: 呼叫 ERC20 的 transfer 函數
function_signature = "transfer(address,uint256)"

# 計算 Function Selector
function_selector = keccak256(function_signature.encode())[:4]

# ABI 編碼參數
recipient_address_padded = pad_left(recipient_address, 32)  # 補齊到 32 bytes
amount_padded = pad_left(amount, 32)

# 組合完整的 data
tx_object['body']['data'] = (
    "0x" + 
    function_selector.hex() + 
    recipient_address_padded.hex() + 
    amount_padded.hex()
)
```

### Gas 參數 Gas Parameters

這決定了交易的優先級與成本上限。

- **來源 Source Estimation:** 錢包透過節點估算或使用固定值。
- **原始資料 Raw Data:** 整數值。
- **處理程序 Process Estimation:**
    - **Gas Limit:** 呼叫 `eth_estimateGas` 取得預估值，或使用標準值如簡單轉帳 21000。
    - **Gas Price:** 呼叫 `eth_gasPrice` 取得當前網路建議值，或讓使用者自訂。
- **目的與位置 Target:** 填入 `header.gas_limit` 與 `header.gas_price`。

**邏輯演示 Demo Code:**

```python
# 估算 Gas Limit
estimated_gas = web3.eth.estimate_gas({
    'from': sender_address,
    'to': recipient_address,
    'value': amount,
    'data': data
})

# 加上安全邊際
tx_object['header']['gas_limit'] = int(estimated_gas * 1.2)

# 取得建議 Gas Price
tx_object['header']['gas_price'] = web3.eth.gas_price
```

### 數位簽章 Digital Signature

這就是你的私鑰授權證明。

- **來源 Source Keystore:** 儲存在錢包安全區的私鑰 Private Key。
- **原始資料 Raw Data:** 256-bit 私鑰。
- **處理程序 Process Signing:**
    - **RLP 編碼:** 將交易欄位不含簽章依照 RLP 格式編碼。
    - **雜湊:** 對 RLP 編碼結果進行 Keccak256 雜湊。
    - **ECDSA 簽署:** 使用私鑰對雜湊值簽名，產生 r, s, v 三個值。
- **目的與位置 Target:** 填入 `signature.v`, `signature.r`, `signature.s`。

**邏輯演示 Demo Code:**

```python
# 1. RLP 編碼: 將交易欄位序列化
# Legacy Transaction 的 RLP 編碼順序
rlp_data = rlp.encode([
    tx_object['header']['nonce'],
    tx_object['header']['gas_price'],
    tx_object['header']['gas_limit'],
    bytes.fromhex(tx_object['body']['to'][2:]),  # 移除 0x
    tx_object['body']['value'],
    bytes.fromhex(tx_object['body']['data'][2:]),
    tx_object['header']['chain_id'],  # EIP-155: 加入 chain_id
    0,  # 空的 r
    0   # 空的 s
])

# 2. 雜湊: 對 RLP 資料進行 Keccak256
message_hash = keccak256(rlp_data)

# 3. 簽署: 使用 ECDSA 簽名
v, r, s = ecdsa_sign(message_hash, private_key)

# 4. EIP-155: 調整 v 值以包含 chain_id
v_adjusted = v + (tx_object['header']['chain_id'] * 2 + 35)

# 填入簽章
tx_object['signature']['v'] = v_adjusted
tx_object['signature']['r'] = "0x" + r.hex()
tx_object['signature']['s'] = "0x" + s.hex()
```

---

## API 參數生成 Params Generation

當所有欄位包含簽章都準備就緒後，最後一步就是將其轉換為 API 所需的 RLP 編碼字串：

- **RLP 編碼 RLP Encoding:**
    - **定義:** Recursive Length Prefix 是以太坊的標準序列化格式。
    - **規則:** 將陣列與字串轉換為緊密排列的二進位資料，並在前方加上長度前綴。
- **十六進位編碼 Hex Encoding:**
    - 將 RLP 編碼後的二進位資料轉換為 `0x` 開頭的十六進位字串。
    - **結果:** 這個字串就是最終填入 API `params` 中的 `<RLP Encoded Hex>`。

**邏輯演示 Demo Code:**

```python
# 最終 RLP 編碼: 包含簽章的完整交易
signed_rlp_data = rlp.encode([
    tx_object['header']['nonce'],
    tx_object['header']['gas_price'],
    tx_object['header']['gas_limit'],
    bytes.fromhex(tx_object['body']['to'][2:]),
    tx_object['body']['value'],
    bytes.fromhex(tx_object['body']['data'][2:]),
    tx_object['signature']['v'],
    bytes.fromhex(tx_object['signature']['r'][2:]),
    bytes.fromhex(tx_object['signature']['s'][2:])
])

# 編碼: 轉為 Hex String
payload_hex = "0x" + signed_rlp_data.hex()
# payload_hex 即為填入 API params 的最終值

# 補充: 計算交易 Hash TxHash
# 用途: 用於追蹤交易狀態
tx_hash = "0x" + keccak256(signed_rlp_data).hex()
```

---

## 用戶端發送 Client Dispatch Online

- **端點發現 Endpoint Discovery:**
    - **公共節點: **連接至基礎設施服務商如 Infura, Alchemy, QuickNode。
    - **本地節點:** 連接至本地運行的 Geth 或 Erigon 節點。
    - **連線方式:** HTTP/HTTPS, WebSocket, IPC。
- **傳輸方法 Method:**
    - 使用 HTTP POST 將 JSON-RPC 請求發送至目標節點的 RPC Port，預設為 8545。

**邏輯演示 Demo Code:**

```python
import requests

# 發送交易
response = requests.post(
    'https://mainnet.infura.io/v3/YOUR_API_KEY',
    json={
        "jsonrpc": "2.0",
        "method": "eth_sendRawTransaction",
        "params": [payload_hex],
        "id": 1
    }
)

# 取得交易 Hash
result = response.json()
tx_hash = result['result']  # 即交易的唯一識別碼
```

---

## 狀態確認 Status Confirmation

交易送出後，確認流程分為兩個階段：

### 第一階段 - 同步回應 Sync Response
- **Mempool Entry:**
    - 節點收到 API 請求後，驗證簽名、nonce、餘額與 Gas，若通過則放入 Mempool 並回傳交易 Hash。
    - **含義:** 交易合法且已進入交易池，但尚未被打包進區塊。
- **Mempool 即 Transaction Pool:**
    - 節點用於暫存合法但尚未上鏈交易的記憶體池。
- **Nonce 衝突檢查:**
    - **問題:** 若發送了兩筆使用相同 nonce 的交易會如何？
    - **機制:** 只有 Gas Price 更高的交易會被保留，較低的會被替換 Replace。使用者可透過此機制加速或取消交易。

### 第二階段 - 非同步確認 Async Confirmation
- **Block Inclusion:**
    - 需等待 12 秒左右一個 Slot Time，驗證者會選擇 Mempool 中 Gas Price 最高的交易打包進區塊。
    - **含義:** 交易已寫入區塊鏈，狀態已更新。
- **最終性確認:**
    - **建議:** 等待至少 2 個 Epoch 約 12.8 分鐘後，交易才能被視為最終確認 Finalized。
    - **查詢方式:** 客戶端透過 `eth_getTransactionReceipt` 查詢交易收據，檢查 `status` 是否為 `1` 成功或 `0` 失敗。

**邏輯演示 Demo Code:**

```python
import time

# 等待交易被打包
while True:
    receipt = web3.eth.get_transaction_receipt(tx_hash)
    
    if receipt is not None:
        # 檢查交易狀態
        if receipt['status'] == 1:
            print("交易成功")
            print(f"區塊高度: {receipt['blockNumber']}")
            print(f"Gas 使用: {receipt['gasUsed']}")
            break
        else:
            print("交易失敗")
            break
    
    time.sleep(2)  # 每 2 秒查詢一次
```
