# 賬戶模型與狀態 Account Model and State

## 賬戶模型定義 Account Model Definition

- **本質 Essence:** 以太坊採用賬戶模型 Account Model，而非比特幣的 UTXO 模型。
- **核心概念 Core Concept:**
    - **賬戶 Account:** 世界狀態中的基本單位，每個地址對應一個賬戶。
    - **世界狀態 World State:** 所有賬戶狀態的集合，存儲在 State Trie 中。
    - **狀態轉換 State Transition:** 交易執行導致賬戶狀態的變化。

---

## 賬戶狀態結構 Account State Structure

每個賬戶在世界狀態中包含四個欄位：

```python
{
    "account_state": {
        "nonce": 5,                    // 序號: EOA 為已發送交易數，合約為已創建合約數
        "balance": 1000000000000000000, // 餘額: 單位為 Wei，1 ETH = 10^18 Wei
        "storage_root": "0xabc...def",  // 儲存根: 合約儲存樹的 Merkle Root，EOA 為空
        "code_hash": "0x123...456"      // 代碼雜湊: 合約 Bytecode 的 Keccak256 Hash，EOA 為空雜湊
    }
}
```

### 欄位說明

- **nonce:**
    - **EOA:** 從 0 開始，每發送一筆交易遞增 1，用於防止重放攻擊。
    - **合約:** 從 1 開始，每創建一個子合約遞增 1，用於計算 CREATE 的合約地址。
- **balance:**
    - **直接讀取:** 與 UTXO 模型不同，餘額直接儲存在賬戶狀態中。
    - **精度:** 256 bits 無號整數，最大值約 $10^{77}$ Wei。
- **storage_root:**
    - **合約專用:** 指向該合約的 Storage Trie 根節點。
    - **Storage Trie:** 儲存合約的 state variables，鍵值對映射。
    - **EOA:** 無 storage，此欄位為空 Merkle Root。
- **code_hash:**
    - **合約專用:** 合約 Bytecode 的 Keccak256 雜湊值。
    - **不可變:** 合約部署後，代碼不能修改，因此 code_hash 永久不變。
    - **EOA:** 無代碼，此欄位為空字串的雜湊 `keccak256("")`。

---

## 兩種賬戶類型 Two Account Types

### 外部擁有賬戶 EOA Externally Owned Account

- **特徵 Characteristics:**
    - **私鑰控制:** 由私鑰持有者完全控制。
    - **可發起交易:** 可以簽署並發送交易到網路。
    - **無代碼:** `code_hash` 為空，不能執行邏輯。
    - **無儲存:** `storage_root` 為空，不能儲存資料。
- **用途 Usage:**
    - 使用者的錢包地址
    - 發起轉帳或呼叫合約
- **範例 Example:**
    ```python
    eoa_account = {
        "nonce": 12,
        "balance": 5000000000000000000,  # 5 ETH
        "storage_root": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",  # 空 Trie
        "code_hash": "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470"   # keccak256("")
    }
    ```

### 合約賬戶 Contract Account

- **特徵 Characteristics:**
    - **無私鑰:** 不由私鑰控制，而由代碼邏輯控制。
    - **不可主動發起交易:** 只能被 EOA 或其他合約呼叫時執行。
    - **有代碼:** `code_hash` 指向不可變的 Bytecode。
    - **有儲存:** `storage_root` 指向可變的 Storage Trie。
- **用途 Usage:**
    - 智能合約的部署後地址
    - DeFi 協議如 Uniswap、Aave
    - ERC-20 代幣合約
- **範例 Example:**
    ```python
    contract_account = {
        "nonce": 3,  # 已創建 3 個子合約
        "balance": 10000000000000000000,  # 10 ETH，合約持有的 ETH
        "storage_root": "0xdef456...",    # 合約狀態變數的 Storage Trie
        "code_hash": "0x789abc..."        # 合約 Bytecode 的雜湊
    }
    ```

---

## 世界狀態 World State

- **定義 Definition:** 所有賬戶地址到賬戶狀態的映射 Mapping from Address to Account State。
- **資料結構 Data Structure:** Merkle Patricia Trie MPT。
- **State Root:** 世界狀態的 Merkle Root，存儲在區塊頭的 `state_root` 欄位。
- **特性 Properties:**
    - **確定性 Deterministic:** 相同的交易序列必定產生相同的 State Root。
    - **可驗證 Verifiable:** 輕節點可透過 Merkle Proof 驗證某個賬戶的狀態。
    - **高效更新 Efficient Updates:** 只需更新受影響的分支，不需重建整棵樹。

### State Trie 結構示意

```
State Root (Block Header)
    |
    └─ State Trie
        ├─ Address 0x123... → Account State
        │   ├─ nonce: 5
        │   ├─ balance: 10 ETH
        │   ├─ storage_root: → Storage Trie
        │   │   ├─ Slot 0: Value A
        │   │   └─ Slot 1: Value B
        │   └─ code_hash: 0xabc...
        │
        ├─ Address 0x456... → Account State
        │   ├─ nonce: 2
        │   ├─ balance: 3 ETH
        │   ├─ storage_root: Empty
        │   └─ code_hash: Empty
        │
        └─ ...
```

---

## 與比特幣 UTXO 模型的對比 Comparison with Bitcoin UTXO Model

| 特性     | 比特幣 UTXO 模型    | 以太坊賬戶模型          |
| -------- | ------------------- | ----------------------- |
| 基本單位 | UTXO 未花費交易輸出 | Account 賬戶            |
| 餘額儲存 | 隱式，掃描 UTXO     | 顯式，賬戶 balance 欄位 |
| 交易輸入 | 引用過去的 UTXO     | 直接從 sender 賬戶扣款  |
| 交易輸出 | 創建新的 UTXO       | 直接加到 receiver 賬戶  |
| 找零     | 明確的找零 UTXO     | 無需找零，餘額自動更新  |
| 狀態模型 | 無全局狀態          | 有世界狀態 World State  |
| 可重放性 | UTXO 只能花費一次   | Nonce 防止重放          |
| 合約支持 | 不支援              | 原生支援                |

### 譬喻對比 Metaphor Comparison

#### 比特幣 UTXO 模型 - 鑄造金幣
- **初始狀態:** 你有一顆 10 BTC 的金幣 UTXO。
- **交易行為:** 為了支付 3 BTC 給對方，將這顆 10 BTC 金幣丟進火爐銷毀 Input。
- **產出結果:** 鑄造一顆 3 BTC 金幣給對方 Output 1 加上一顆 7 BTC 金幣找零給自己 Output 2。
- **結論:** 舊的金幣被銷毀，新的金幣被創造。

#### 以太坊賬戶模型 - 銀行帳戶
- **初始狀態:** 你的賬戶餘額為 10 ETH。
- **交易行為:** 為了支付 3 ETH 給對方，發送一筆交易。
- **產出結果:** 你的賬戶餘額減少 3 ETH 變為 7 ETH，對方賬戶餘額增加 3 ETH。
- **結論:** 沒有創建或銷毀任何東西，只是更新了賬戶的數字。

---

## 餘額計算 Balance Calculation

### 比特幣的餘額計算
```python
# 比特幣: 掃描整個區塊鏈的 UTXO Set
my_balance = 0
for utxo in blockchain.utxo_set:
    if utxo.address == my_address:
        my_balance += utxo.value
# 需要掃描大量 UTXO
```

### 以太坊的餘額計算
```python
# 以太坊: 直接讀取賬戶狀態
account_state = world_state.get(my_address)
my_balance = account_state.balance
# 單次讀取即可
```

---

## 狀態轉換 State Transition

- **定義 Definition:** 交易執行導致世界狀態的變化。
- **公式 Formula:** `State' = Transition(State, Transaction)`
- **流程 Process:**
    ```python
    # 交易執行前
    sender_account = {
        "nonce": 5,
        "balance": 10 ETH,
        "storage_root": ...,
        "code_hash": ...
    }
    
    receiver_account = {
        "nonce": 0,
        "balance": 3 ETH,
        "storage_root": ...,
        "code_hash": ...
    }
    
    # 執行交易: 轉帳 2 ETH，Gas 費用 0.001 ETH
    transaction = {
        "from": sender_address,
        "to": receiver_address,
        "value": 2 ETH,
        "gas_used": 21000,
        "gas_price": 50 Gwei
    }
    
    # 交易執行後
    sender_account' = {
        "nonce": 6,  # 遞增
        "balance": 7.999 ETH,  # 減少 2 + 0.001 Gas
        "storage_root": ...,  # 不變
        "code_hash": ...  # 不變
    }
    
    receiver_account' = {
        "nonce": 0,  # 不變
        "balance": 5 ETH,  # 增加 2
        "storage_root": ...,  # 不變
        "code_hash": ...  # 不變
    }
    
    # 更新世界狀態
    world_state[sender_address] = sender_account'
    world_state[receiver_address] = receiver_account'
    
    # 重新計算 State Root
    new_state_root = calculate_merkle_root(world_state)
    ```

---

## State Trie 驗證 State Trie Verification

- **Merkle Proof:** 輕節點可透過 Merkle Proof 驗證某個賬戶的狀態，而不需下載整個狀態樹。
- **流程 Process:**
    ```python
    # 輕節點想驗證 0x123... 的餘額是否為 10 ETH
    
    # 1. 向全節點請求 Merkle Proof
    proof = full_node.get_account_proof("0x123...")
    
    # 2. 驗證 Proof
    # proof 包含從葉節點到根節點的所有中間節點雜湊
    is_valid = verify_merkle_proof(
        leaf_data=account_state,
        proof=proof,
        root=block_header.state_root
    )
    
    # 3. 若驗證成功，則確認該賬戶狀態確實存在於此區塊的世界狀態中
    if is_valid:
        print(f"確認餘額: {account_state.balance} Wei")
    ```

---

## 合約儲存 Contract Storage

- **定義 Definition:** 合約賬戶的狀態變數儲存在 Storage Trie 中。
- **結構 Structure:** 256-bit 鍵 Slot 映射到 256-bit 值 Value。
- **範例 Example:**
    ```solidity
    // Solidity 合約
    contract SimpleStorage {
        uint256 public value;  // 儲存在 Slot 0
        address public owner;  // 儲存在 Slot 1
    }
    ```
    
    ```python
    # 對應的 Storage Trie
    storage_trie = {
        "0x0000000000000000000000000000000000000000000000000000000000000000": value,  # Slot 0
        "0x0000000000000000000000000000000000000000000000000000000000000001": owner   # Slot 1
    }
    ```

---

## 關鍵差異總結 Key Differences Summary

| 層面     | 比特幣         | 以太坊                 |
| -------- | -------------- | ---------------------- |
| 帳本模型 | UTXO 模型      | 賬戶模型               |
| 基本單位 | 交易輸出       | 賬戶狀態               |
| 餘額儲存 | 隱式，需掃描   | 顯式，直接讀取         |
| 全局狀態 | 無             | 有，World State        |
| 合約支持 | 無             | 原生，Contract Account |
| 狀態樹   | 無             | Merkle Patricia Trie   |
| 重放保護 | UTXO 唯一性    | Nonce 遞增             |
| 複雜度   | 低，僅處理貨幣 | 高，處理通用計算       |
