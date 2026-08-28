# 共識機制 Consensus Mechanism

---

## 角色定義 Role Definition

### 網路級真相確立 Network-Level Truth Establishment

- **定位 Position:** 共識機制是區塊鏈網路的自動仲裁者 Autonomous Arbiter。
- **本質 Nature:** 這不是礦工之間的直接對戰，而是全網節點的自由心證與自動收斂。
- **目標 Goal:** 在去中心化環境中，讓所有誠實節點對 哪條鏈是真相 達成一致。

---

## 區塊競爭情境 Block Competition Scenario

### 同時出塊 Simultaneous Block Discovery

#### 發生情境 Scenario

- **時間重疊:** 兩個或多個礦工幾乎同時找到有效的 Nonce 並廣播各自的候選區塊。
- **網路延遲:** 全網節點因地理位置與網路速度不同，會先後收到不同的區塊。
- **暫時性分叉:** 網路出現多條有效但互相競爭的分支。
- **礦工無決定權:** 礦工只負責廣播，獎勵歸屬由網路共識決定，不是礦工可以控制的。

#### 最長鏈原則 Longest Chain Rule

- **共識規則:** 節點始終信任**累積工作量最大**的鏈，通常即最長的鏈。
- **自動收斂:** 當下一個區塊被挖出並延伸其中一條分支時，該分支成為新的主鏈。
- **全網一致:** 所有誠實節點都會切換到最長鏈，實現去中心化共識。

#### 孤兒塊 Orphan Block

- **定義 Definition:** 被網路拋棄的有效區塊，即競爭失敗的分支上的區塊。
- **產生原因:** 該區塊所屬的分支未能延續，被更長的鏈超越。
- **交易命運:**
    - **一般交易:** 孤兒塊內的交易會重新回到 Mempool，等待下次被打包。
    - **Coinbase 交易:** 該區塊的 Coinbase 獎勵交易會**完全消失**，礦工獎勵失效。

---

## 節點的共識形成 Node Consensus Formation

### 分叉同步與過濾 Fork Synchronization and Filtering

#### 同步邏輯 Synchronization Logic

- **有效區塊都會同步:** 只要區塊的 PoW 有效且交易合法，節點會接收並暫存該區塊。
- **追蹤多條分支:** 節點內部維護一個區塊樹結構，同時記錄多個有效但競爭的分支。
- **不是立刻寫入主鏈:** 節點會將競爭區塊暫存，直到確定哪條分支是最長鏈。

#### 過濾機制 Filtering Mechanism

- **驗證階段 Validation Phase:**
    - **PoW 驗證:** 檢查區塊 Hash 是否真的小於 Target。
    - **交易驗證:** 確認區塊內每筆交易的簽名、UTXO 有效性、Coinbase 金額合法性。
    - **無效區塊拒絕:** PoW 不符或交易非法的區塊立刻丟棄，不會同步給其他節點。
- **選擇階段 Selection Phase:**
    - **多分支暫存:** 對於多個有效但競爭的區塊，節點暫存所有分支。
    - **主鏈標記:** 只將最長鏈標記為主鏈，顯示給錢包與外部查詢。
    - **鏈重組 Chain Reorganization:** 當更長的分支出現時，節點會切換主鏈，稱為 reorg。

#### 節點處理流程 Node Processing Flow

```python
def handle_new_block(block):
    # 驗證階段: 檢查區塊有效性
    if not verify_pow(block):
        reject_block(block)
        return
    
    if not verify_transactions(block):
        reject_block(block)
        return
    
    # 暫存區塊
    store_block_in_tree(block)
    
    # 選擇階段: 計算累積工作量
    current_chain_work = get_chain_work(main_chain)
    new_chain_work = get_chain_work(block.chain)
    
    # IF 新分支的累積工作量更大
    if new_chain_work > current_chain_work:
        # 執行鏈重組
        reorganize_chain(main_chain, block.chain)
        # 將孤兒塊的交易放回 Mempool
        reprocess_orphaned_transactions()
```

---

## 經濟安全與確定性 Economic Security and Finality

### 確認數的意義 Confirmation Count Meaning

#### 物理可能 vs 經濟可行 Physical Possibility vs Economic Feasibility

- **物理上:** 即使已有 6 個確認，數學上仍可能產生更長的競爭鏈推翻現有主鏈。
- **經濟上:** 攻擊者需要控制超過 50% 算力並秘密挖更多區塊，成本極高，幾乎不可行。
- **共識基礎:** 區塊鏈的安全性建立在經濟不可行性上，而非物理不可能性上。

#### 確認數級別 Confirmation Levels

- **1 個確認:** 交易在某個區塊中，但該區塊可能被孤立。
- **6 個確認:** 該區塊之上又疊了 5 個區塊，鏈重組的機率極低。
    - **計算:** 要推翻 6 個區塊，攻擊者需要控制超過 50% 算力並秘密挖 7 個區塊。
    - **經濟安全:** 這在經濟上幾乎不可行，交易被視為不可逆。
- **交易所與商家:** 通常要求 6 個確認後才認定收款，防止雙花攻擊 Double Spending。

### 礦工獎勵的不確定性 Mining Reward Uncertainty

#### 獎勵歸屬由網路決定 Reward Attribution by Network

- **非礦工決定:** 礦工無法決定自己的區塊是否被網路接受，這是整個網路共識的結果。
- **暴露期風險:** 剛挖出的區塊隨時可能被更長的鏈超越，獎勵並非立刻確定。

#### 孤兒塊的獎勵失效 Orphan Block Reward Invalidation

- **Coinbase 消失:** 如果礦工的區塊最終成為孤兒塊，該區塊內的 Coinbase 交易會完全消失。
- **獎勵無法使用:** 礦工無法花費孤兒塊的 Coinbase 獎勵，等同於白做工。

#### Coinbase 成熟期限制 Coinbase Maturity Restriction

- **規則來源:** 創世協議規定，Coinbase 獎勵必須等 100 個區塊後才能被花費。
- **目的 Purpose:**
    - **降低孤兒塊風險:** 100 個區塊後，該 Coinbase 所屬區塊幾乎不可能被重組。
    - **強制風險暴露期:** 礦工必須承擔 100 個區塊的不確定性，無法立刻提現。
- **驗證機制:** 節點在驗證交易時，會檢查 Coinbase Input 是否已達成熟期，未成熟的交易會被拒絕。

#### 視覺化理解 Visual Understanding

```
區塊高度:  100    101    102    103    104    105    106
           |------|------|------|------|------|------|
           A      A'(孤兒)
                  |
礦工 M 挖出區塊 A' 在高度 101
收到 6.25 BTC Coinbase 獎勵，但：

- IF 區塊 A' 成為孤兒塊: 獎勵消失，交易回 Mempool
- IF 區塊 A' 在主鏈上: 仍需等到高度 201 才能花費獎勵
```

---
