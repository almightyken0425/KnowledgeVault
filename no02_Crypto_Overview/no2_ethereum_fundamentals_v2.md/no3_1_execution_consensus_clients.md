# 執行層與共識層客戶端 Execution and Consensus Layer Clients

## 客戶端架構 Client Architecture

- **雙層架構 Dual-Layer Architecture:** The Merge 後，以太坊節點由兩個獨立客戶端組成。
- **執行層 EL Execution Layer:** 負責交易執行、狀態管理、EVM 運算。
- **共識層 CL Consensus Layer:** 負責 PoS 驗證、區塊提議、最終性確認。
- **Engine API:** EL 與 CL 之間的通訊橋樑，使用 JSON-RPC。

---

## 執行層客戶端 Execution Layer Clients

### 主流客戶端

- **Geth:** Go 語言實作，最廣泛使用，由以太坊基金會維護。
- **Erigon:** Go 語言，優化效能與儲存效率。
- **Nethermind:** C# 語言，跨平台支援。
- **Besu:** Java 語言，企業級支援。

### 執行層職責

- **交易執行:** 執行交易中的 EVM 代碼，更新世界狀態。
- **狀態管理:** 維護 State Trie、Storage Trie，計算 stateRoot。
- **Mempool 管理:** 暫存待處理交易，提供給共識層選擇。
- **RPC 服務:** 提供 JSON-RPC API 供 DApp 互動。

---

## 共識層客戶端 Consensus Layer Clients

### 主流客戶端

- **Prysm:** Go 語言實作，由 Prysmatic Labs 開發。
- **Lighthouse:** Rust 語言，由 Sigma Prime 開發。
- **Teku:** Java 語言，由 Consensys 開發。
- **Nimbus:** Nim 語言，輕量級實作。
- **Lodestar:** TypeScript 語言，適合開發與研究。

### 共識層職責

- **區塊提議:** 驗證者被選中時，構建新區塊。
- **Attestation 投票:** 驗證者對區塊進行投票。
- **分叉選擇:** 使用 LMD-GHOST 算法選擇正確的鏈。
- **最終性確認:** 使用 Casper FFG 確認區塊不可逆。

---

## Engine API 通訊

```python
# CL 告訴 EL 要執行哪些交易
engine_newPayloadV1({
    "parentHash": "0x...",
    "stateRoot": "0x...",
    "transactions": ["0x...", "0x..."],
    ...
})

# CL 告訴 EL 哪一條鏈是正確的
engine_forkchoiceUpdatedV1({
    "headBlockHash": "0x...",
    "safeBlockHash": "0x...",
    "finalizedBlockHash": "0x..."
})
```

---

## 節點類型 Node Types

### 全節點 Full Node

- **定義:** 下載並驗證所有區塊，維護完整狀態。
- **儲存:** 需要數百 GB 空間。
- **用途:** 完全自主驗證，不依賴他人。

### 輕節點 Light Node

- **定義:** 僅下載區塊頭，透過 Merkle Proof 驗證。
- **儲存:** 僅需數 GB。
- **用途:** 資源受限設備如手機。

### 歸檔節點 Archive Node

- **定義:** 保存所有歷史狀態，可查詢任意區塊的狀態。
- **儲存:** 需要數 TB 空間。
- **用途:** 區塊鏈瀏覽器、分析工具。

---

## 與比特幣節點的對比

| 特性       | 比特幣      | 以太坊       |
| ---------- | ----------- | ------------ |
| 客戶端架構 | 單一客戶端  | 雙層 EL + CL |
| 狀態儲存   | 僅 UTXO Set | 完整世界狀態 |
| 儲存需求   | ~500 GB     | ~1 TB        |
| 輕節點支援 | SPV         | Light Client |
