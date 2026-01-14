# 帳戶模型與身份 Account Model and Identity

---

## 角色定義 Role Definition

### 以太坊帳戶 Ethereum Account
- **狀態容器 State Container:** 帳戶是以太坊全局狀態的最小單位，如同銀行帳戶，直接持有餘額與資料。
- **互動主體 Interaction Subject:** 所有的交易必然由一個帳戶發起，所有的狀態變更都發生在帳戶之內。
- **地址標識 Address Identification:** 每個帳戶由一個 20 bytes 的地址唯一標識。

### 帳戶模型譬喻 Metaphor
- **銀行存摺 Bankbook:** 帳戶模型如同銀行體系，系統直接記錄每個帳戶的當前餘額 `Balance`。交易是「從 A 扣除，加到 B」。
- **對比現金 Cash:** 比特幣 UTXO 如同實體現金交易，你持有的不是餘額，而是一堆「未花費的鈔票」。

---

## 帳戶結構定義 Account Structure Definition

### 帳戶狀態欄位 Account State Fields
無論是哪種類型的帳戶，在以太坊全局狀態樹 (World State Trie) 中都包含四個核心欄位：

- **`nonce` (計數器):**
    - **用途:** 記錄該帳戶發出的交易數量（如果是合約帳戶則為創建的合約數量）。
    - **目的:** 防止重放攻擊 (Replay Attack)，確保交易順序。
- **`balance` (餘額):**
    - **用途:** 該帳戶持有的 Wei 數量。
    - **格式:** 256-bit 整數。
- **`storageRoot` (儲存根):**
    - **用途:** 指向該帳戶儲存內容的 Merkle Patricia Trie 根雜湊。
    - **預設:** 空值 (Keccak256(RLP("")))。
- **`codeHash` (代碼雜湊):**
    - **用途:** 指向該帳戶關聯的 EVM 代碼的雜湊值。
    - **EOA:** 此欄位為空字串的雜湊。
    - **合約:** 此欄位為不可變的合約代碼雜湊。

### 帳戶類型 Account Types

| 特性          | 外部帳戶 (EOA)     | 合約帳戶 (Contract) |
| :------------ | :----------------- | :------------------ |
| **控制者**    | 私鑰 (Private Key) | 智能合約代碼 (Code) |
| **創建方式**  | 生成私鑰即可       | 透過交易部署        |
| **Code Hash** | 空字串雜湊         | 實際代碼雜湊        |
| **Storage**   | 空                 | 有持久化儲存空間    |
| **主動性**    | 可主動發起交易     | 僅能被動回應呼叫    |
| **費用**      | 支付 Gas           | 消耗 Gas            |

---

## 身份與地址生成 Identity and Address Generation

### 私鑰與公鑰 Private Key and Public Key
以太坊使用橢圓曲線密碼學 (ECDSA) 的 `secp256k1` 曲線，與比特幣相同。

- **私鑰 k:** 256-bit 隨機數。
- **公鑰 K:** 透過橢圓曲線乘法生成 $K = k \times G$。
- **格式:** 64 bytes (非壓縮格式)。

### 地址推導流程 Address Derivation Process
地址並非直接是公鑰，而是經過雜湊與截斷處理：

- **來源 Source:** 公鑰 (Public Key) - 64 bytes
- **處理程序 Process:**
    - 1. 計算公鑰的 Keccak-256 雜湊
    - 2. 取雜湊值的最後 20 bytes (160 bits)
- **目的 Target:** 以太坊地址 (Address)

#### 邏輯演示 Demo Code
```python
# 1. 準備公鑰 (移除 '04' 前綴的非壓縮公鑰)
public_key_bytes = bytes.fromhex("...") 

# 2. Keccak-256 雜湊
# 注意: 以太坊使用 Keccak-256 而非標準 SHA3-256
hash_bytes = keccak.new(digest_bits=256, data=public_key_bytes).digest()

# 3. 截斷取後 20 bytes
address_bytes = hash_bytes[-20:]

# 4. 格式化為 Hex 字串 (EIP-55 checksum 處理前)
address_hex = '0x' + address_bytes.hex()
```

### EIP-55 混合大小寫校驗 Checksum
為了防止地址輸入錯誤，EIP-55 定義了大小寫混用的檢查機制。

- **機制:** 將地址的小寫形式進行雜湊，若某位對應的雜湊位元大於等於 8，則該位地址轉為大寫。
- **範例:**
    - 一般: `0x5aaeb6053f3e94c9b9a09f33669435e7ef1beaed`
    - 校驗: `0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed`

---

## 與 UTXO 模型的系統性對比 Systematic Comparison

### 資料結構差異 Data Structure Differences

| 維度         | UTXO 模型 (Bitcoin)            | 帳戶模型 (Ethereum)         |
| :----------- | :----------------------------- | :-------------------------- |
| **基本單位** | 未花費交易輸出 (Coin 碎片)     | 帳戶 (Account)              |
| **餘額計算** | 必須掃描並加總所有 UTXO        | 直接讀取 `balance` 欄位     |
| **狀態轉移** | 銷毀舊 UTXO，創建新 UTXO       | 更新帳戶內的數值            |
| **交易結構** | 多輸入 Inputs → 多輸出 Outputs | 單發送者 From → 單接收者 To |
| **並行處理** | 高 (不同 UTXO 可並行處理)      | 低 (同一帳戶交易需依序執行) |

### 交易重放防護 Replay Protection

- **UTXO 方式:**
    - 依賴「輸入引用」。
    - 每個 UTXO 只能被花費一次，花費後即不存在，天然防止重放。
- **帳戶模型方式:**
    - 依賴 `nonce`。
    - 每個交易必須包含一個順序號。
    - 節點只接受 `tx.nonce == account.nonce` 的交易，隨後 `account.nonce` 加 1。
    - 舊交易因 nonce 過小無效，未來交易因 nonce 過大排隊。

### 智能合約適配性 Smart Contract Adaptability

- **UTXO 挑戰:**
    - 無狀態特性難以實作複雜邏輯。
    - 必須在每個 Output 攜帶所有必要狀態，極不靈活。
    - 類似「每次去銀行都要把所有存摺銷戶再開新戶」。
- **帳戶模型優勢:**
    - 狀態持久化，適合記錄合約變數 (如 Token 餘額、投票數)。
    - 代碼與數據分離，邏輯清晰。
    - 類似「銀行存摺持續有效，僅更新餘額」。

---

## 狀態儲存機制 State Storage Mechanism

### 狀態樹 State Trie
以太坊的所有帳戶資料並不直接寫在區塊裡，而是儲存在一棵巨大的 Merkle Patricia Trie (MPT) 中。

- **Key:** Sha3(Address)
- **Value:** RLP([nonce, balance, storageRoot, codeHash])
- **Root:** 最終的 State Root 雜湊值儲存在 Block Header 中。

### 儲存樹 Storage Trie
每個合約帳戶還擁有自己獨立的 Storage Trie，用於儲存合約的持久化變數。

- **連結:** 帳戶狀態中的 `storageRoot` 欄位即為此樹的根雜湊。
- **結構:** 也是 Merkle Patricia Trie。
- **資料:** 智能合約定義的狀態變數 (如 ERC-20 的 `balances` 映射)。

---

## 常見誤解 Common Misconceptions

- **誤解:** 地址是在區塊鏈上註冊生成的。
    - **澄清:** 地址是離線數學計算生成的。只要你有私鑰，地址就存在。唯有當該地址收到第一筆轉帳時，它才在 State Trie 中佔有空間。
- **誤解:** 以太坊交易由多個 From 地址發起。
    - **澄清:** 以太坊協議層交易只有一個 `from` (由簽名恢復)。如果要實現多簽，必須透過智能合約層主要。
- **誤解:** 刪除智能合約代碼可以釋放所有空間。
    - **澄清:** `SELFDESTRUCT` (已計畫棄用) 雖然清除狀態，但歷史區塊仍保留痕跡，歸檔節點仍存有完整歷史。

---
