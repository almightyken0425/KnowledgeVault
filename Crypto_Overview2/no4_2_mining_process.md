# 挖礦流程 Mining Process

---

## 角色定義 Role Definition

### 伺服器端處理 Server Side Processing

- **定位 Position:** 礦工即區塊鏈網路的後端處理者 Backend Processor。
- **任務 Task:** 從 Mempool 中撈取未確認交易，將其打包並蓋上 PoW 工作量證明戳章，最終寫入全域帳本。
- **目標 Goal:** 爭取區塊獎勵 Coinbase Reward 與交易手續費 Transaction Fees。

---

## 第一步 候選區塊組裝 Candidate Block Assembly

### 交易選取 Transaction Selection

- **來源 Source:** 礦工從本地節點的 **Mempool** 中選取一組待處理交易。
- **策略 Strategy:** 這是**利潤最大化**的問題。
    - **優先:** 手續費率 Fee Rate 高的交易。
        - **來源:** 由 Input 總額減去 Output 總額計算得出，即使用者自願支付的競標費。
    - **限制:** 區塊大小上限如 1MB 或 4MB Weight。
        - **來源:** 由創世協議 Genesis Code 中的共識規則所定義，即這場比賽的規格書。
- **區塊主體 Body:** 選定後的交易列表即構成區塊的主體 Block Body。

### 獎勵交易 Coinbase Transaction

- **定義 Definition:** 這是區塊中的第一筆交易 Index 0。
- **特點 Feature:** 它沒有 Input，憑空產生新的比特幣支付給礦工自己。
- **含義 Meaning:** 這是礦工領薪水的單據。

---

## 第二步 指紋建構 Merkle Root Construction

為了將成千上萬筆交易壓縮進由 80 bytes 組成的區塊頭 Block Header，我們需要計算一個代表性的指紋。

### Merkle Tree 邏輯

- **兩兩雜湊 Pairwise Hashing:** 將交易 ID 兩兩分組進行 Hash，不斷向上收斂。
- **樹根 Root:** 最終剩下的一個 Hash 值即為 **Merkle Root**。
- **特性 Property:** 任何一筆交易被修改，都會導致 Root 劇烈變化，破壞區塊完整性。

### 邏輯演示 Demo Code

```python
def calculate_merkle_root(tx_list):
    # 遞迴終止條件: 只剩一個 Hash 時即為 Root
    if len(tx_list) == 1:
        return tx_list[0]
    
    new_level = []
    # 兩兩一組進行雜湊
    for i in range(0, len(tx_list), 2):
        left = tx_list[i]
        # 若是奇數個，最後一個與自己做 Hash
        right = tx_list[i+1] if i+1 < len(tx_list) else left
        
        # 雜湊運算
        combined = sha256(sha256(left + right))
        new_level.append(combined)
        
    # 遞迴計算下一層
    return calculate_merkle_root(new_level)
```

---

## 第三步 運算競賽 Proof of Work

這是挖礦的核心，目的是尋找一個隨機數 Nonce，使得區塊頭的雜湊值小於目標值 Target。

### 區塊頭結構 Block Header

區塊頭是 PoW 運算的唯一標的，包含六大欄位：

- **版本 Version:** 區塊版本號。
- **前區塊雜湊 Previous Block Hash:** 連結上一個區塊的 Hash，形成鏈狀結構。
- **交易指紋 Merkle Root:** 上一步算出的交易總摘要。
- **時間戳 Timestamp:** 當下時間。
- **難度目標 Bits:** 定義當前 mining 的難度 Target。
    - **含義:** Target 是一個 256-bit 的門檻數值，區塊 Hash 必須小於此值才有效。
    - **調整機制:** 每 2016 個區塊自動調整，維持平均 10 分鐘出塊。
    - **難度關係:** Target 越小，難度越高。
- **隨機數 Nonce:** 礦工唯一可以隨意更改的欄位，用來試誤。
    - **定義:** Number used ONCE，範圍 0 到 2³² - 1。
    - **作用:** 不斷遞增嘗試，直到找到符合條件的 Hash。

### 暴力破解 Brute Force

- **謎題 Puzzle:** 找到一個 Nonce，使得 `SHA256 Block Header` < `Target`。
- **視覺化理解:**
    ```
    Target:    0000000000FFFF000000000000000000...
    成功 Hash: 0000000000A3B2000000000000000000... ✓ 小於
    失敗 Hash: 0000000001234A000000000000000000... ✗ 大於
    ```
- **機率 Probability:** 就像擲 2²⁵⁶ 面的骰子，要求結果小於指定數字，極其困難。
- **算力決定速度:** 礦工每秒嘗試數十億次 Nonce，誰先找到誰就贏得記帳權。

### 邏輯演示 Demo Code

```python
def mining_loop(header, target):
    nonce = 0
    while True:
        # 更新 Header 中的 Nonce
        header.nonce = nonce
        
        # 計算區塊頭雜湊值
        block_hash = sha256(sha256(serialize(header)))
        
        # 檢查是否符合難度目標
        if int(block_hash, 16) < target:
            print(f"Found valid nonce: {nonce}")
            print(f"Block Hash: {block_hash}")
            return block_header # 挖礦成功
            
        # 失敗，nonce 加一再試一次
        nonce += 1
```

---

## 第四步 廣播與驗證 Propagation and Validation

也就是各方角色的最後一哩路，將 `no1_4` 與 `no1_5` 的邏輯閉環。

### 廣播 Propagation

- **礦工 Miner:** 找到 Nonce 後，立刻將這顆 **候選區塊** 透過節點廣播給全網。
- **宣告 Declare:** 向世界證明「我付出了算力，我有權記這筆帳」。

### 驗證 Verification

- **節點 Node:** 收到新區塊後的 SOP。
    - **驗證 PoW:** 算一次 Hash 看是否真的小於 Target。
    - **驗證交易:** 確認區塊內每一筆交易都合法。
    - **更新帳本:**
        - 將區塊寫入 **原始帳本 blk.dat**。
        - 更新 **索引資料庫 Index DB**，建立 TxID 對映。
        - 從本地 Mempool 移除已打包的交易。

### 確認 Confirmed

- **錢包 Wallet:** 透過 `gettransaction` 查詢節點，發現交易已有 Confirmations，顯示於 UI，交易完成。