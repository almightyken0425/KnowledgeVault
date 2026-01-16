# 智能合約互動 Contract Interaction

## 合約呼叫本質 Call Essence

- **定義 Definition:** 發送交易到合約地址，`data` 包含 Function Selector + ABI 編碼參數。

---

## Function Selector

```python
# Function Selector = Keccak256(函數簽名)[:4]
function_signature = "transfer(address,uint256)"
function_selector = keccak256(function_signature.encode())[:4]
# 結果: 0xa9059cbb
```

---

## ABI 編碼 ABI Encoding

### 靜態類型編碼

```python
# transfer(address recipient, uint256 amount)
recipient = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
amount = 1000000000000000000  # 1 ETH

# ABI 編碼
recipient_padded = pad_left(recipient, 32)
amount_padded = pad_left(amount, 32)

data = function_selector + recipient_padded + amount_padded
```

### 動態類型編碼

```python
# function setValues(uint256[] memory values)
values = [100, 200,  300]

# ABI 編碼
offset = 32  # 動態陣列的偏移量
length = 3
data = function_selector + \
       pad_left(offset, 32) + \
       pad_left(length, 32) + \
       pad_left(100, 32) + \
       pad_left(200, 32) + \
       pad_left(300, 32)
```

---

## 讀取 vs 寫入 Read vs Write

### eth_call 讀取

```python
# 本地執行，不消耗 Gas，不上鏈
result = web3.eth.call({
    'to': contract_address,
    'data': function_selector + args
})
```

### eth_sendRawTransaction 寫入

```python
# 發送交易，消耗 Gas，狀態上鏈
tx_hash = eth_sendRawTransaction(signed_tx)
```

---

## Event Logs 事件日誌

```solidity
event Transfer(address indexed from, address indexed to, uint256 value);

emit Transfer(msg.sender, recipient, amount);
```

查詢事件:
```python
logs = web3.eth.get_logs({
    'address': contract_address,
    'topics': [keccak256("Transfer(address,address,uint256)")]
})
```
