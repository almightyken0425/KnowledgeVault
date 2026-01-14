# 交易生命週期 Transaction Lifecycle

---

## 流程概覽 Process Overview

交易是以太坊狀態轉換的唯一驅動者。從使用者點擊錢包按鈕到區塊鏈狀態更新，經歷了一系列精密定義的流程。

### 核心階段 Core Stages
- **構造 Construction:** 應用層組裝交易參數
- **簽署 Signing:** 使用私鑰生成數位簽章
- **傳播 Propagation:** 透過 P2P 網路廣播至 Mempool
- **打包 Packing:** 驗證者選擇交易並執行
- **確認 Confirmation:** 區塊廣播並達成共識

---

## 步驟一：交易構造 Transaction Construction

使用者或 DApp 構造一個原始交易物件 (Unsigned Transaction Object)。

### 關鍵欄位溯源 Data Provenance Tracking
以下追蹤一個 DeFi Swap 交易中，關鍵欄位的生成源頭：

| 欄位 Field    | 來源 Source | 處理程序 Process                       | 目的 Target          |
| :------------ | :---------- | :------------------------------------- | :------------------- |
| **Nonce**     | 節點查詢    | `eth_getTransactionCount(fromAddress)` | 確保交易順序與防重放 |
| **Gas Price** | 網路估算    | `eth_gasPrice` 或 `eth_maxFeePerGas`   | 設定願付的費率       |
| **To**        | UI 輸入     | Uniswap Router 合約地址                | 指定互動對象         |
| **Value**     | UI 輸入     | 使用者輸入金額 (如 1 ETH) → 轉為 Wei   | 轉移原生代幣數量     |
| **Data**      | 應用邏輯    | ABI Encoding (詳見下文)                | 指定呼叫函數與參數   |

### Data 欄位生成詳解 Data Field Generation

以呼叫 Uniswap `swap(uint256 amount)` 為例：

```
1. 函數簽名: "swap(uint256)"
2. 函數選擇器: Keccak256("swap(uint256)") 的前 4 bytes
   result = 0x12345678

3. 參數編碼: 將 amount (如 100) 編碼為 32 bytes
   result = 0x0000...0064

4. 組合 Data: 0x12345678 + 0000...0064
   Target = tx_object['data']
```

---

## 步驟二：數位簽署 Digital Signing

### 簽署目的 Signing Purpose
- **認證 Authentication:** 證明交易確實由私鑰持有者發起
- **完整性 Integrity:** 確保交易內容未被竄改
- **防抵賴 Non-repudiation:** 發送者無法否認該交易

### EIP-155 簽署流程 Signing Process

#### 邏輯演示 Demo Code
```python
# 1. RLP 編碼原始交易 (包含 Chain ID 防止重放)
# 結構: [nonce, gasPrice, gasLimit, to, value, data, chainId, 0, 0]
raw_tx_list = [5, 20000000000, 21000, '0x...', 1000, '0x', 1, 0, 0]
encoded_bytes = rlp.encode(raw_tx_list)

# 2. 計算雜湊
# 使用 Keccak-256
tx_hash = keccak.new(digest_bits=256, data=encoded_bytes).digest()

# 3. ECDSA 簽名
# 使用 secp256k1 曲線
signature = private_key.sign_msg_hash(tx_hash)

# 4. 提取 v, r, s
# r, s: 簽名座標值
# v: 恢復 ID (Recovery ID) + Chain ID 計算值
v = signature.v
r = signature.r
s = signature.s
```

---

## 步驟三：廣播與傳播 Setup and Propagation

### 提交至節點 Submission
錢包透過 JSON-RPC `eth_sendRawTransaction` 將簽名後的二進位交易發送給連接的節點 (如 Infura, Alchemy 或本地節點)。

### Mempool 交易池機制
- **驗證:** 接收節點首先驗證簽名有效性、Nonce 是否正確、餘額是否足夠。
- **進入池:** 驗證通過後，交易進入該節點的 Mempool (Pending Transactions)。
- **P2P 廣播:** 節點將該交易廣播給相鄰節點，擴散至全網 Mempool。

### 交易池競爭 Competition
- Mempool 是有限的 (例如 Geth 預設 4096 筆)。
- 當 Mempool 滿時，低 Gas Price 的交易會被丟棄 (Evicted)。
- **譬喻:** Mempool 就像拍賣場，驗證者從中挑選出價最高的請求。

---

## 步驟四：打包與執行 Packing and Execution

### 驗證者工作 Validator Workflow
1. **排序:** 驗證者從 Mempool 選擇一組交易，通常按 `Max Priority Fee` (小費) 從高到低排序。
2. **依序執行:** EVM 依序執行每筆交易。
    - 扣除 Gas。
    - 修改 State Trie (餘額變動、儲存更新)。
    - 生成 Receipt (日誌、執行狀態)。
3. **狀態根更新:** 所有交易執行完畢後，計算新的 State Root。
4. **組裝區塊:** 將交易列表、新 State Root、Receipts Root 填入 Block Header。

### 狀態轉換 State Transition
$$ \sigma_{t+1} \equiv \Upsilon(\sigma_t, T) $$
- $\sigma_t$: 當前區塊狀態
- $T$: 交易列表
- $\Upsilon$: 狀態轉換函數 (EVM)
- $\sigma_{t+1}$: 新區塊狀態

---

## 步驟五：確認與最終性 Confirmation and Finality

### 區塊廣播 Block Propagation
- 驗證者將新區塊廣播至網路。
- 其他節點收到區塊後，**重新執行**區塊內的所有交易，驗證計算出的 State Root 是否與 Header 中的一致。

### 最終性 Finality
- **PoW (舊):** 概率性最終。隨著後續區塊增加，回滾機率指數下降。
- **PoS (新):**
    - **Justified:** 區塊獲得 2/3 驗證者投票。
    - **Finalized:** Justified區塊的下一個區塊也 Justified 後，前一個區塊變為 Finalized。
    - **意義:** Finalized 的區塊被視為不可逆，除非銷毀至少 1/3 的總質押 ETH。

---

## 常見誤解 Common Misconceptions

- **誤解:** 交易發送後立即上鏈。
    - **澄清:** 交易首先進入 Mempool，可能因為 Gas 過低而卡在 Mempool 數小時甚至被丟棄，此時鏈上無任何記錄。
- **誤解:** 交易失敗不扣手續費。
    - **澄清:** 只要交易被驗證者打包並執行，無論最終是 Success 還是 Revert (如 Swap 滑點過大)，已消耗的 Gas 都必須支付，因為驗證者付出了計算資源。
- **誤解:** 錢包可以直接查詢交易狀態。
    - **澄清:** 錢包其實是詢問節點。如果交易還沒打包，節點只能在 Mempool 中找；如果已打包，則在區塊中找。

---
