# 區塊與鏈結構 Block and Chain Structure

## 區塊結構定義 Block Structure Definition

- **區塊頭 Block Header:**
    - **內容 Content:**
        - **parentHash:** 父區塊雜湊，指向前一個區塊。
        - **stateRoot:** 世界狀態樹根，執行完本區塊所有交易後的狀態快照。
        - **transactionsRoot:** 交易樹根，本區塊包含的所有交易雜湊。
        - **receiptsRoot:** 收據樹根，交易執行結果的索引。
        - **logsBloom:** 布隆過濾器，用於快速檢索事件日誌。
        - **difficulty:** 挖礦難度，PoS 後為 0 或特殊用途。
        - **number:** 區塊高度，這是第幾個區塊。
        - **gasLimit:** 燃料上限，本區塊允許消耗的最大運算量。
        - **gasUsed:** 實際燃料，本區塊實際消耗的運算量。
        - **timestamp:** 時間戳記，出塊時間。
        - **extraData:** 額外資訊，驗證者可寫入的任意資料。
        - **mixHash:** 隨機數相關，用於 PoS 共識機制的隨機性驗證。
        - **baseFeePerGas:** 基礎費率，EIP-1559 機制下的最低 Gas 單價。
- **區塊體 Block Body:**
    - **內容 Content:**
        - **Transactions:** 交易列表，包含本區塊的所有交易。
        - **Ommers/Uncles:** 叔塊列表，PoS 後已廢棄。
    - **邏輯演示 Demo Code:**
        ```json
        {
          "block_header": {
            "parent_hash": "0xabc...123",
            "state_root": "0xdef...456",
            "transactions_root": "0x789...012",
            "receipts_root": "0x345...678",
            "logs_bloom": "0x00...00",
            "difficulty": 0,
            "number": 15000000,
            "gas_limit": 30000000,
            "gas_used": 15000000,
            "timestamp": 1654321098,
            "extra_data": "0x...",
            "mix_hash": "0x...",
            "base_fee_per_gas": 20000000000
          },
          "transactions": [
            {
              "type": "EIP-1559",
              "from": "0x123...",
              "to": "0x456...",
              "value": 1000000000000000000,
              "data": "0x",
              "nonce": 5,
              "gas_limit": 21000,
              "max_fee_per_gas": 50000000000,
              "max_priority_fee_per_gas": 2000000000,
              "v": 1,
              "r": "0x...",
              "s": "0x..."
            }
          ]
        }
        ```

---

## 與比特幣區塊結構的對比 Comparison with Bitcoin

| 欄位       | 比特幣          | 以太坊           | 差異說明                 |
| ---------- | --------------- | ---------------- | ------------------------ |
| 父區塊指標 | prev_block_hash | parentHash       | 名稱不同，功能相同       |
| 交易樹根   | merkle_root     | transactionsRoot | 名稱不同，功能相同       |
| 狀態樹根   | 無              | stateRoot        | 以太坊特有，記錄世界狀態 |
| 收據樹根   | 無              | receiptsRoot     | 以太坊特有，記錄執行結果 |
| 日誌過濾器 | 無              | logsBloom        | 以太坊特有，快速檢索事件 |
| 難度目標   | bits            | difficulty       | PoS 後以太坊為 0         |
| 隨機數     | nonce           | mixHash          | 用途不同，以太坊用於 PoS |
| Gas 機制   | 無              | gasLimit/gasUsed | 以太坊特有資源計價       |
| 基礎費率   | 無              | baseFeePerGas    | EIP-1559 特有            |

---

## 關鍵欄位詳解 Key Fields Explanation

### stateRoot - 世界狀態樹根

- **定義 Definition:** 執行完本區塊所有交易後，全網最新的賬戶狀態快照雜湊。
- **作用 Purpose:**
    - **輕節點驗證:** 輕節點可透過 stateRoot 驗證賬戶狀態，而不需下載整個狀態樹。
    - **狀態回滾:** 允許回滾到任意歷史區塊的狀態。
- **計算 Calculation:**
    ```python
    # 執行所有交易
    for tx in block.transactions:
        execute_transaction(tx, world_state)
    
    # 計算新的 State Root
    new_state_root = calculate_merkle_patricia_root(world_state)
    block.header.state_root = new_state_root
    ```

### receiptsRoot - 收據樹根

- **定義 Definition:** 交易執行後的結果如 Log、Event 的索引。
- **收據內容 Receipt Content:**
    - **status:** 交易執行狀態，1 成功，0 失敗。
    - **cumulativeGasUsed:** 本區塊累計消耗的 Gas。
    - **logsBloom:** 本交易產生的事件日誌的布隆過濾器。
    - **logs:** 本交易產生的事件日誌列表。
- **邏輯演示 Demo Code:**
    ```python
    transaction_receipt = {
        "status": 1,
        "cumulative_gas_used": 21000,
        "logs_bloom": "0x00...00",
        "logs": [
            {
                "address": "0xContractAddress",
                "topics": ["0xEventSignatureHash", "0xIndexedParam1"],
                "data": "0xNonIndexedData"
            }
        ]
    }
    ```

### logsBloom - 布隆過濾器

- **定義 Definition:** 用於快速檢索智能合約產生的事件日誌。
- **原理 Principle:**
    - **布隆過濾器:** 一種概率型資料結構，可快速判斷元素是否可能存在。
    - **誤判:** 可能誤報存在，但不會漏報。
- **用途 Usage:**
    - 輕節點可快速過濾出包含特定事件的區塊，再深入查詢。

### baseFeePerGas - EIP-1559 基礎費率

- **定義 Definition:** 協議動態調整的最低 Gas 單價，會被燃燒。
- **調整機制 Adjustment Mechanism:**
    - **目標 Gas:** 每個區塊的目標 Gas 使用量為 gasLimit 的 50%。
    - **調整公式:** 若實際使用超過目標，baseFee 上升；若低於目標，baseFee 下降。
    ```python
    # EIP-1559 Base Fee 調整公式
    target_gas = block.gas_limit / 2
    gas_used_delta = block.gas_used - target_gas
    base_fee_delta = parent_base_fee * gas_used_delta / target_gas / 8
    new_base_fee = parent_base_fee + base_fee_delta
    ```

---

## 鏈式結構 Chain Structure

### 連結機制 Chaining Mechanism

- **Hash Pointer:** 每個區塊頭都包含 `parentHash`，這使得任何對歷史區塊的修改都會導致後續所有區塊的 Hash 改變，進而無效。
- **邏輯演示 Demo Code:**
    ```python
    # 區塊 N
    block_n = {
        "header": {
            "parent_hash": "0x000...N-1",
            "number": N,
            ...
        }
    }
    block_n_hash = keccak256(rlp.encode(block_n.header))
    
    # 區塊 N+1
    block_n_plus_1 = {
        "header": {
            "parent_hash": block_n_hash,  # 指向前一個區塊
            "number": N + 1,
            ...
        }
    }
    
    # 若修改區塊 N 的任何內容
    block_n.header.state_root = "0x...modified"
    new_block_n_hash = keccak256(rlp.encode(block_n.header))
    # new_block_n_hash != block_n_hash
    # 則區塊 N+1 的 parent_hash 不匹配，無效
    ```

### 高度 Block Height

- **定義 Definition:** 區塊在鏈上的序列編號，創世區塊高度為 0。
- **功能 Function:**
    - **時間順序:** 表示區塊的時間順序。
    - **確認數:** 交易所在區塊的高度與當前鏈尖的高度差，即為確認數。
    - **最長鏈原則:** PoW 時代使用最長鏈，PoS 時代使用 LMD-GHOST 分叉選擇。

---

## 狀態轉換 State Transition

- **定義 Definition:** 交易執行導致世界狀態的變化，這是以太坊的核心機制。
- **公式 Formula:** `State(n+1) = Transition(State(n), Block(n+1))`
- **流程 Process:**
    ```python
    # 初始狀態
    state_n = load_state(block_n.header.state_root)
    
    # 執行區塊 N+1 的所有交易
    for tx in block_n_plus_1.transactions:
        # 1. 驗證交易簽名
        verify_signature(tx)
        
        # 2. 扣除 Gas 費用
        sender = state_n.accounts[tx.from]
        sender.balance -= tx.gas_limit * tx.gas_price
        sender.nonce += 1
        
        # 3. 執行交易
        if tx.to == null:
            # 部署合約
            contract_address = deploy_contract(tx.data, state_n)
        elif state_n.accounts[tx.to].code_hash != empty:
            # 呼叫合約
            execute_evm(tx.data, state_n.accounts[tx.to], state_n)
        else:
            # 簡單轉帳
            receiver = state_n.accounts[tx.to]
            receiver.balance += tx.value
        
        # 4. 退還未使用的 Gas
        gas_refund = tx.gas_limit - gas_used
        sender.balance += gas_refund * tx.gas_price
    
    # 計算新的 State Root
    state_n_plus_1_root = calculate_merkle_root(state_n)
    block_n_plus_1.header.state_root = state_n_plus_1_root
    ```

---

## 區塊結構解構 Block Deconstruction

- **Block 包含 Transactions:**
    - 每個區塊包含一個交易列表。
- **Transactions 修改 Accounts:**
    - 每筆交易執行後，修改相關賬戶的狀態。
- **Accounts 組成 World State:**
    - 所有賬戶的狀態構成世界狀態。
- **World State 儲存在 State Trie:**
    - 世界狀態以 Merkle Patricia Trie 的形式儲存。

```
Block
  ├─ Block Header
  │   ├─ stateRoot → State Trie
  │   ├─ transactionsRoot → Transactions Trie
  │   └─ receiptsRoot → Receipts Trie
  │
  └─ Block Body
      └─ Transactions
          ├─ Tx 1: 修改 Account A 和 Account B
          ├─ Tx 2: 部署 Contract C
          └─ Tx 3: 呼叫 Contract C
```

---

## 三棵 Merkle Tree The Three Merkle Trees

### Transactions Trie

- **內容:** 本區塊的所有交易。
- **鍵 Key:** 交易索引 Transaction Index。
- **值 Value:** RLP 編碼的交易資料。

### Receipts Trie

- **內容:** 本區塊的所有交易收據。
- **鍵 Key:** 交易索引 Transaction Index。
- **值 Value:** RLP 編碼的收據資料。

### State Trie

- **內容:** 全網的所有賬戶狀態。
- **鍵 Key:** 賬戶地址 Account Address。
- **值 Value:** RLP 編碼的賬戶狀態如 nonce, balance, storageRoot, codeHash。

---

## 與比特幣的關鍵差異 Key Differences from Bitcoin

| 特性       | 比特幣              | 以太坊                       |
| ---------- | ------------------- | ---------------------------- |
| 狀態模型   | 無全局狀態，僅 UTXO | 有世界狀態 World State       |
| 狀態樹     | 無                  | State Trie、Storage Trie     |
| 交易執行   | 簡單的 Script 驗證  | 圖靈完備的 EVM 執行          |
| 收據機制   | 無                  | Receipts Trie 記錄執行結果   |
| 事件日誌   | 無                  | Logs、LogsBloom 支援事件檢索 |
| Gas 機制   | 無，僅交易費        | 精細的 Gas 計價與燃燒        |
| 區塊頭欄位 | 6 個                | 15+ 個                       |
| 複雜度     | 低                  | 高                           |

---

## 輕節點驗證 Light Client Verification

- **比特幣輕節點 SPV:**
    - 僅下載區塊頭，透過 Merkle Proof 驗證交易是否包含在區塊中。
- **以太坊輕節點:**
    - 除了驗證交易，還可透過 State Proof 驗證賬戶狀態。
- **State Proof 流程:**
    ```python
    # 輕節點想驗證賬戶 0x123... 的餘額
    
    # 1. 向全節點請求 State Proof
    proof = full_node.get_state_proof("0x123...", block_number)
    
    # 2. 驗證 Proof
    is_valid = verify_merkle_proof(
        leaf_data=account_state,
        proof=proof,
        root=block_header.state_root
    )
    
    # 3. 確認餘額
    if is_valid:
        print(f"賬戶餘額: {account_state.balance} Wei")
    ```
