# Gas 機制規範 Gas Mechanism Specification

## Gas 核心定義 Gas Core Definition

- **角色 Role:** 資源計價單位 Resource Pricing Unit。
- **目的 Purpose:** 防止濫用與無限迴圈，確保網路可持續運作。
- **本質 Essence:** 將運算成本量化為數值，使用者需支付對應費用

。

---

## Gas 參數 Gas Parameters

### Gas Limit

- **定義 Definition:** 交易願意消耗的運算量上限。
- **設定 Setting:** 由交易發送者指定。
- **用途 Usage:** 防止交易消耗過多資源。
- **範例 Example:**
    ```python
    # 簡單轉帳
    tx = {
        "gas_limit": 21000,  # 固定值
        ...
    }
    
    # 複雜合約呼叫
    tx = {
        "gas_limit": 500000,  # 估算值加安全邊際
        ...
    }
    ```

### Gas Price / Base Fee

- **Legacy Transaction Gas Price:**
    - **定義:** 每單位 Gas 願意支付的費用，單位為 Wei。
    - **設定:** 由使用者指定，越高越優先。
- **EIP-1559 Base Fee:**
    - **定義:** 協議動態調整的最低 Gas 單價，會被燃燒。
    - **設定:** 由協議自動計算，無法指定。
    - **調整機制:**
        ```python
        target_gas = parent_block.gas_limit / 2
        gas_used_delta = parent_block.gas_used - target_gas
        base_fee_delta = parent_block.base_fee * gas_used_delta / target_gas / 8
        new_base_fee = parent_block.base_fee + base_fee_delta
        ```

### Max Fee Per Gas & Max Priority Fee Per Gas

- **Max Fee Per Gas:**
    - **定義:** 願意支付的每單位 Gas 最高總費用。
    - **包含:** Base Fee + Priority Fee。
- **Max Priority Fee Per Gas:**
    - **定義:** 願意支付給驗證者的小費上限。
    - **用途:** 激勵驗證者優先打包此交易。
- **實際費用計算:**
    ```python
    actual_base_fee = block.base_fee_per_gas
    actual_priority_fee = min(
        tx.max_priority_fee_per_gas,
        tx.max_fee_per_gas - actual_base_fee
    )
    actual_gas_price = actual_base_fee + actual_priority_fee
    ```

### Gas Used

- **定義 Definition:** 交易實際消耗的運算量。
- **計算 Calculation:** 執行完交易後統計。
- **退款 Refund:**
    ```python
    gas_refund = tx.gas_limit - gas_used
    refund_amount = gas_refund * actual_gas_price
    sender.balance += refund_amount
    ```

---

## EIP-1559 費用機制 EIP-1559 Fee Mechanism

### Base Fee 燃燒機制

- **目的 Purpose:** 減少 ETH 供應量，使 ETH 具有通縮特性。
- **流程 Process:**
    ```python
    # 交易執行後
    base_fee_amount = gas_used * block.base_fee_per_gas
    # Base Fee 被燃燒，直接銷毀
    total_supply -= base_fee_amount
    
    # Priority Fee 給驗證者
    priority_fee_amount = gas_used * actual_priority_fee
    validator.balance += priority_fee_amount
    ```

### 費用拆分示意

```
交易總費用 = Gas Used * (Base Fee + Priority Fee)
    |
    ├─ Base Fee 部分 → 燃燒銷毀
    └─ Priority Fee 部分 → 給驗證者
```

---

## Gas 估算 Gas Estimation

### eth_estimateGas API

```python
# 呼叫節點 API 估算 Gas
estimated_gas = w

eb3.eth.estimate_gas({
    'from': sender_address,
    'to': recipient_address,
    'value': amount,
    'data': data
})

# 加上安全邊際
tx.gas_limit = int(estimated_gas * 1.2)
```

### 標準 Gas 成本

| 操作            | Gas 成本      | 說明                |
| --------------- | ------------- | ------------------- |
| 簡單轉帳        | 21000         | 無 data 的 ETH 轉移 |
| ERC-20 Transfer | ~65000        | 呼叫 transfer 函數  |
| Uniswap Swap    | ~150000       | 複雜的 DeFi 操作    |
| NFT Mint        | ~50000-200000 | 依合約複雜度而異    |

---

## Gas 與 EVM 執行的關係

每個 Opcode 都有固定的 Gas 成本：

```python
opcode_gas_costs = {
    0x01: 3,      # ADD
    0x02: 5,      # MUL
    0x54: 2100,   # SLOAD
    0x55: 20000,  # SSTORE (首次寫入)
    0xF1: 0,      # CALL (基礎成本，實際動態計算)
    ...
}
```

**執行範例:**
```python
# Bytecode: PUSH1 0x02 PUSH1 0x03 ADD
gas_used = 0
gas_used += 3  # PUSH1
gas_used += 3  # PUSH1
gas_used += 3  # ADD
# 總計: 9 Gas
```

---

## 與比特幣交易費的對比

| 特性     | 比特幣           | 以太坊                                |
| -------- | ---------------- | ------------------------------------- |
| 計價方式 | Satoshi per byte | Gas * Gas Price                       |
| 費用決定 | 交易大小         | 運算複雜度                            |
| 估算難度 | 簡單             | 複雜                                  |
| 費用機制 | 全給礦工         | Base Fee 燃燒 + Priority Fee 給驗證者 |
| 動態調整 | 無               | EIP-1559 自動調整 Base Fee            |

---

## Gas 優化技巧 Gas Optimization Tips

### 減少 Storage 寫入

```solidity
// 昂貴: 多次 SSTORE
function bad() public {
    value1 = 100;  // SSTORE
    value2 = 200;  // SSTORE
    value3 = 300;  // SSTORE
}

// 優化: 批量寫入
function good() public {
    uint temp1 = 100;
    uint temp2 = 200;
    uint temp3 = 300;
    value1 = temp1;
    value2 = temp2;
    value3 = temp3;
}
```

### 使用事件替代 Storage

```solidity
// 昂貴: 儲存歷史記錄
mapping(uint => Transaction) public history;

// 優化: 發出事件
event TransactionExecuted(uint indexed id, address indexed user, uint amount);
```
