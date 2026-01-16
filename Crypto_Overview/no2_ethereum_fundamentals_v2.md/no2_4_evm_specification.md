# EVM 虛擬機規範 EVM Specification

## EVM 核心定義 EVM Core Definition

- **角色 Role:** 智能合約的執行環境 Execution Environment。
- **本質 Essence:** 堆疊式虛擬機 Stack-based Virtual Machine，圖靈完備 Turing Complete。
- **載體 Platform:** 每個執行層客戶端如 Geth、Erigon 都內建 EVM 實作。
- **位置 Location:** EVM 不是獨立軟體，而是嵌入在節點軟體中的模組。

---

## EVM 執行環境 Execution Environment

EVM 執行合約時，維護三個主要的記憶體區域：

### Stack 堆疊

- **定義 Definition:** 後進先出 LIFO 資料結構，用於臨時儲存操作數。
- **容量 Capacity:** 最大 1024 個元素，每個元素為 256-bit 字。
- **用途 Usage:** 所有運算都在堆疊上進行。
- **範例 Example:**
    ```python
    # PUSH1 0x02  # 推入 2 到堆疊
    stack = [2]
    
    # PUSH1 0x03  # 推入 3 到堆疊
    stack = [2, 3]
    
    # ADD  # 彈出兩個元素，相加後推入結果
    a = stack.pop()  # 3
    b = stack.pop()  # 2
    result = a + b   # 5
    stack = [5]
    ```

### Memory 記憶體

- **定義 Definition:** 線性位元組陣列，用於臨時儲存資料。
- **容量 Capacity:** 動態擴展，但擴展會消耗 Gas。
- **特性 Properties:**
    - **揮發性 Volatile:** 交易執行完畢後清空。
    - **可讀寫 Read/Write:** 可隨機存取任意位置。
- **範例 Example:**
    ```python
    # MSTORE offset=0x00, value=0x1234  # 將 0x1234 存入 Memory[0x00]
    memory[0x00:0x20] = 0x0000...1234  # 32 bytes
    
    # MLOAD offset=0x00  # 從 Memory[0x00] 載入 32 bytes
    value = memory[0x00:0x20]  # 0x0000...1234
    ```

### Storage 永久儲存

- **定義 Definition:** 合約賬戶的持久化儲存，存於 Storage Trie。
- **容量 Capacity:** 2^256 個 Slot，每個 Slot 為 256-bit。
- **特性 Properties:**
    - **持久化 Persistent:** 交易執行完畢後保留。
    - **昂貴 Expensive:** 讀寫 Storage 的 Gas 成本遠高於 Memory。
- **範例 Example:**
    ```python
    # SSTORE key=0x00, value=0x1234  # 將 0x1234 存入 Storage[0x00]
    storage[0x00] = 0x1234
    
    # SLOAD key=0x00  # 從 Storage[0x00] 載入值
    value = storage[0x00]  # 0x1234
    ```

---

## Op codes 操作碼 Opcodes

EVM 指令集包含約 140 個 Opcodes，每個 Opcode 為 1 byte。

### 算術運算 Arithmetic Operations

| Opcode | Mnemonic | Stack Input | Stack Output | Gas Cost | Description |
| ------ | -------- | ----------- | ------------ | -------- | ----------- |
| 0x01   | ADD      | a, b        | a + b        | 3        | 加法        |
| 0x02   | MUL      | a, b        | a * b        | 5        | 乘法        |
| 0x03   | SUB      | a, b        | a - b        | 3        | 減法        |
| 0x04   | DIV      | a, b        | a / b        | 5        | 除法        |
| 0x06   | MOD      | a, b        | a % b        | 5        | 取餘數      |
| 0x08   | ADDMOD   | a, b, N     | a + b % N    | 8        | 模加法      |

**範例 Example:**
```python
# Bytecode: 0x600260030160005260206000F3
# 解析:
# PUSH1 0x02  # 推入 2
# PUSH1 0x03  # 推入 3
# ADD         # 相加，結果 5
# PUSH1 0x00  # 推入 0 (Memory offset)
# MSTORE      # 將 5 存入 Memory[0x00]
# PUSH1 0x20  # 推入 32 (return 長度)
# PUSH1 0x00  # 推入 0 (Memory offset)
# RETURN      # 返回 Memory[0x00:0x20]
```

### 儲存操作 Storage Operations

| Opcode | Mnemonic | Stack Input | Stack Output | Gas Cost   | Description     |
| ------ | -------- | ----------- | ------------ | ---------- | --------------- |
| 0x54   | SLOAD    | key         | value        | 2100       | 從 Storage 讀取 |
| 0x55   | SSTORE   | key, value  | -            | 20000/5000 | 寫入 Storage    |

**Gas 成本說明:**
- **SSTORE 首次寫入:** 20000 Gas，從零值改為非零值。
- **SSTORE 修改:** 5000 Gas，從非零值改為其他非零值。
- **SSTORE 刪除:** 退還 15000 Gas，從非零值改為零值。

### 流程控制 Control Flow

| Opcode | Mnemonic | Stack Input | Stack Output | Gas Cost | Description  |
| ------ | -------- | ----------- | ------------ | -------- | ------------ |
| 0x56   | JUMP     | dest        | -            | 8        | 無條件跳轉   |
| 0x57   | JUMPI    | dest, cond  | -            | 10       | 條件跳轉     |
| 0x5B   | JUMPDEST | -           | -            | 1        | 跳轉目標標記 |
| 0x00   | STOP     | -           | -            | 0        | 停止執行     |
| 0xF3   | RETURN   | offset, len | -            | 0        | 返回資料     |
| 0xFD   | REVERT   | offset, len | -            | 0        | 回滾狀態     |

**範例 Example:**
```python
# IF-ELSE 邏輯
# IF condition:
#     result = 100
# ELSE:
#     result = 200

# Bytecode:
PUSH1 condition  # 推入條件
PUSH1 0x10       # ELSE 分支的位置
JUMPI            # 若條件為 true，跳到 0x10

# THEN 分支
PUSH1 100
PUSH1 0x00
MSTORE
PUSH1 0x20
PUSH1 0x00
RETURN

# ELSE 分支 (0x10)
JUMPDEST
PUSH1 200
PUSH1 0x00
MSTORE
PUSH1 0x20
PUSH1 0x00
RETURN
```

### 環境資訊 Environmental Information

| Opcode | Mnemonic     | Stack Output     | Gas Cost | Description     |
| ------ | ------------ | ---------------- | -------- | --------------- |
| 0x33   | CALLER       | msg.sender       | 2        | 交易發送者地址  |
| 0x34   | CALLVALUE    | msg.value        | 2        | 附帶的 ETH 數量 |
| 0x35   | CALLDATALOAD | data[i]          | 3        | 讀取輸入資料    |
| 0x3A   | GASPRICE     | tx.gasprice      | 2        | Gas 單價        |
| 0x41   | COINBASE     | block.coinbase   | 2        | 驗證者地址      |
| 0x42   | TIMESTAMP    | block.timestamp  | 2        | 區塊時間戳      |
| 0x43   | NUMBER       | block.number     | 2        | 區塊高度        |
| 0x44   | DIFFICULTY   | block.difficulty | 2        | 區塊難度        |

**範例 Example:**
```solidity
// Solidity 合約
function withdraw() public {
    require(msg.sender == owner);
    payable(msg.sender).transfer(address(this).balance);
}

// 對應的 Opcodes
CALLER           // 取得 msg.sender
PUSH20 owner     // 推入 owner 地址
EQ               // 比較是否相等
PUSH1 revert_loc // 若不相等，跳到 revert
JUMPI
...              // 執行轉帳邏輯
```

### 合約呼叫 Contract Calls

| Opcode | Mnemonic     | Stack Input                                              | Gas Cost | Description    |
| ------ | ------------ | -------------------------------------------------------- | -------- | -------------- |
| 0xF1   | CALL         | gas, addr, value, argsOffset, argsLen, retOffset, retLen | 動態     | 呼叫其他合約   |
| 0xF4   | DELEGATECALL | gas, addr, argsOffset, argsLen, retOffset, retLen        | 動態     | 委託呼叫       |
| 0xFA   | STATICCALL   | gas, addr, argsOffset, argsLen, retOffset, retLen        | 動態     | 靜態呼叫       |
| 0xF0   | CREATE       | value, offset, len                                       | 32000    | 創建新合約     |
| 0xF5   | CREATE2      | value, offset, len, salt                                 | 32000    | 確定性創建合約 |

---

## Gas 消耗機制 Gas Consumption

每個 Opcode 都有固定的 Gas 成本，防止無限迴圈與資源濫用。

### 基本 Gas 成本

- **算術運算:** 3-8 Gas
- **儲存操作:** 2100-20000 Gas
- **記憶體擴展:** 動態計算，按平方增長
- **日誌記錄:** 375 Gas + 8 Gas per byte

### 範例計算 Example Calculation

```python
# 合約代碼
def add(a, b):
    return a + b

# 對應 Bytecode
PUSH1 a      # 3 Gas
PUSH1 b      # 3 Gas
ADD          # 3 Gas
PUSH1 0x00   # 3 Gas
MSTORE       # 3 Gas + Memory 擴展成本
PUSH1 0x20   # 3 Gas
PUSH1 0x00   # 3 Gas
RETURN       # 0 Gas

# 總計: 約 21 Gas + Memory 成本
```

---

## 執行流程 Execution Flow

```python
def execute_evm(bytecode, calldata, caller, value, gas_limit):
    # 初始化執行環境
    stack = []
    memory = bytearray()
    storage = load_contract_storage(contract_address)
    pc = 0  # Program Counter
    gas_remaining = gas_limit
    
    # 逐個執行 Opcode
    while pc < len(bytecode):
        opcode = bytecode[pc]
        
        # 檢查 Gas 是否充足
        gas_cost = get_opcode_gas_cost(opcode)
        if gas_remaining < gas_cost:
            raise OutOfGasError()
        gas_remaining -= gas_cost
        
        # 執行 Opcode
        if opcode == 0x01:  # ADD
            a = stack.pop()
            b = stack.pop()
            stack.push((a + b) % 2**256)
            pc += 1
        
        elif opcode == 0x54:  # SLOAD
            key = stack.pop()
            value = storage[key]
            stack.push(value)
            pc += 1
        
        elif opcode == 0x56:  # JUMP
            dest = stack.pop()
            pc = dest
        
        elif opcode == 0xF3:  # RETURN
            offset = stack.pop()
            length = stack.pop()
            return_data = memory[offset:offset+length]
            return return_data, gas_remaining
        
        # ... 其他 Opcodes
    
    return None, gas_remaining
```

---

## 與比特幣 Script 的對比 Comparison with Bitcoin Script

| 特性         | 比特幣 Script  | 以太坊 EVM      |
| ------------ | -------------- | --------------- |
| 圖靈完備     | 否，刻意限制   | 是，支援迴圈    |
| 執行環境     | 無狀態         | 有狀態 Storage  |
| Opcodes 數量 | 約 100 個      | 約 140 個       |
| Gas 機制     | 無，僅交易費   | 精細的 Gas 計價 |
| 用途         | 驗證交易合法性 | 執行任意邏輯    |
| 複雜度       | 低             | 高              |
| 範例應用     | 多簽、時間鎖   | DeFi、NFT、DAO  |

---

## EVM 的限制與安全 Limitations and Security

### Gas Limit 防止無限迴圈

```solidity
// 危險: 可能無限執行
function dangerousLoop() public {
    while (true) {
        // 執行邏輯
    }
}
// Gas Limit 會在執行一定次數後耗盡，交易失敗
```

### Revert 機制保護狀態

```solidity
// 若條件不滿足，回滾所有狀態變更
function transfer(address to, uint amount) public {
    require(balance[msg.sender] >= amount);
    balance[msg.sender] -= amount;
    balance[to] += amount;
}
```

### Reentrancy Attack 重入攻擊

```solidity
// 脆弱合約
function withdraw() public {
    uint amount = balances[msg.sender];
    msg.sender.call{value: amount}("");  // 危險: 先轉帳
    balances[msg.sender] = 0;             // 後更新餘額
}

// 攻擊者可在 call 的回調中再次呼叫 withdraw，重複提取
```

**防禦 Defense:**
```solidity
// Checks-Effects-Interactions Pattern
function withdraw() public {
    uint amount = balances[msg.sender];
    balances[msg.sender] = 0;             // 先更新狀態
    msg.sender.call{value: amount}("");  // 後執行外部呼叫
}
```
