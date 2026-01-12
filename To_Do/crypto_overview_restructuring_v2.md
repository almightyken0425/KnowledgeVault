# Crypto_Overview 重構計畫 V2 (名詞與動詞篇)

本計畫旨在重構 Crypto Overview 的敘事結構，從「基礎定義 (Nouns)」開始，再進入「動態流程 (Verbs)」。

## 核心重構邏輯

**舊結構:** 依照技術堆疊 (基礎 -> 核心 -> 智能合約)
**新結構:** 依照學習路徑 (元素定義 -> 運作流程 -> 宏觀共識)

1.  **先解釋「零件」:** 什麼是 Block, Key, Hash?
2.  **再解釋「運轉」:** 發起一筆交易時，這些零件如何互動?

---

## 建議資料夾結構與檔案規劃

### 1. 1_Primitives (基礎元素 / 名詞)
> **目標:** 定義區塊鏈世界中的名詞 (Nouns)。不做過多動態流程描述，專注於靜態結構與定義。

-   **`1_cryptography_basics.md`** (原 `3_hash_functions.md`, `2_digital_signatures.md` 整合)
    -   **Hash Function:** 數位指紋、不可逆性、SHA-256。
    -   **Public/Private Keys:** 非對稱加密原理 (鎖與鑰匙)。
    -   **Digital Signature:** 簽章與驗證 (Verify)。
-   **`2_data_structures.md`** (原 `2_blockchain_structure.md` 拆分用)
    -   **Block Header:** Metadata (ParentHash, MerkleRoot, Nonce, Timestamp, Version, Difficulty)。
    -   **Block Body:** Transaction List。
    -   **The Chain:** Hash Pointer 的連結機制。
-   **`3_network_participants.md`** (新增/重組)
    -   **Wallet (Address):** 錢包地址是怎麼來的 (Pub Key Hash)。
    -   **Nodes (節點):** 帳本的維護者。
    -   **Miners (礦工):** 記帳權的競爭者。

### 2. 2_Transaction_Lifecycle (交易的一生 / 動詞)
> **目標:** 以「一筆交易」為主角，跑完區塊鏈的運作流程。

-   **`1_initiation_and_propagation.md`** (新增)
    -   **Action:** User 發起交易 -> 簽署 (Sign)。
    -   **Network:** 廣播 (Broadcast) -> 記憶體池 (Mempool)。
-   **`2_mining_and_pow.md`** (原 `1_decentralization_pow.md` 改寫)
    -   **Mining (挖礦):** 從 Mempool 撈取交易，驗證合法性。
    -   **Merkle Tree:** 構建 Merkle Root。
    -   **PoW (Puzzle):** 尋找 Nonce (Block Header Hash < Target)。
    -   **Block Creation:** 出塊成功。
-   **`3_confirmation_and_consensus.md`**
    -   **Verification:** 其他節點收到新區塊 -> 驗證 PoW 與交易 -> 寫入本地帳本。
    -   **Consensus:** 最長鏈原則 (Longest Chain Rule) 解決分叉。
    -   **Finality:** 確認數 (Confirmations)。

### 3. 3_Network_Consensus (共識與演進 / 規則)
> **目標:** 討論系統層面的規則與變化。

-   **`1_forks_and_upgrades.md`** (原 `3_forks_soft_hard.md`)
    -   軟分叉 vs 硬分叉。
-   **`2_beyond_pow.md`** (原 `4_proof_of_stake.md`)
    -   PoS (權益證明) 介紹。

---

## 遷移執行步驟

1.  確認此新架構無誤。
2.  建立新的資料夾結構 (`1_Primitives`, `2_Transaction_Lifecycle`...)。
3.  將舊檔案內容依據新主題搬移並改寫。
    -   **保留** 既有知識點。
    -   **重組** 敘事順序。
