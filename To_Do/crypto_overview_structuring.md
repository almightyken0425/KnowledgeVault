# Crypto_Overview 架構規劃書

本文件旨在規劃 `Crypto_Overview` 的目錄與檔案結構，目標是建立一個邏輯嚴密、由淺入深的加密貨幣知識體系，比照 `AI_Overview` 的成功模式。

## 整體結構邏輯

我們將加密貨幣知識分為四個層次：
1.  **1_Fundamentals**: 類似 `Rule_Based`，這是所有一切的數學與邏輯基礎。
2.  **2_Blockchain_Core**: 類似 `Machine_Learning`，這是區塊鏈運作的核心引擎。
3.  **3_Smart_Contracts_&_VM**: 類似 `Deep_Learning`，這是讓區塊鏈擁有「智慧」與「可程式化」能力的進化。
4.  **4_Applications_Web3**: 類似 `Generative_Models/LLM`，這是技術成熟後的大爆發應用層。

---

## 詳細目錄與檔案規劃

### 1_Fundamentals (基礎設施)
> **核心概念:** 密碼學與分散式系統的基石。

- **`1_cryptography_basics.md`**
    - **內容:** 雜湊函數 (Hash) 的不可逆性、公私鑰加密 (Asymmetric Encryption) 的原理、數位簽章 (Digital Signature) 如何證明身份。
- **`2_distributed_ledger.md`**
    - **內容:** 去中心化 (Decentralization) 的意義、分散式帳本技術 (DLT)、P2P 網路如何運作、雙花攻擊 (Double Spending) 問題。

### 2_Blockchain_Core (核心技術)
> **核心概念:** 如何在沒有中心化管理者的情況下達成共識。

- **1_Bitcoin_Network** (區塊鏈 1.0)
    - **`1_bitcoin_whitepaper.md`**: 中本聰的願景、區塊鏈式結構、UTXO 帳本模型。
    - **`2_mining_and_halving.md`**: 工作量證明 (PoW) 的細節、難度調整、減半機制與數位稀缺性。
- **2_Consensus_Mechanisms** (共識演算法)
    - **`1_pow_vs_pos.md`**: 詳細比較 Proof of Work (算力競爭) 與 Proof of Stake (質押權益)，探討能源消耗與安全性。
    - **`2_dpos_and_others.md`**: 介紹 DPoS (委託權益)、PoH (歷史證明) 等追求效能的變體。

### 3_Smart_Contracts_&_VM (智慧與擴容)
> **核心概念:** 區塊鏈 2.0，從記帳計算機進化為世界電腦。

- **1_Ethereum_EVM** (以太坊生態)
    - **`1_smart_contract_concept.md`**: 「程式碼即法律」(Code is Law) 的概念、EVM 虛擬機、Gas Fee 機制。
    - **`2_token_standards.md`**: 代幣標準詳解，ERC-20 (貨幣) 與 ERC-721 (NFT) 的介面定義。
- **2_Layer_2_Scaling** (擴容方案)
    - **`1_scaling_trilemma.md`**: 區塊鏈不可能三角 (去中心化、安全、效能)。
    - **`2_rollups_concept.md`**: Optimistic Rollups 與 ZK-Rollups 的原理 (鏈下計算、鏈上驗證)。

### 4_Applications_Web3 (應用層)
> **核心概念:** 價值網路的實際應用，DeFi 與擁有權經濟。

- **1_DeFi_Protocols** (去中心化金融)
    - **`1_dex_amm.md`**: 去中心化交易所 (DEX) 與自動做市商 (AMM) 演算法 (XY=K 模型)。
    - **`2_lending_mechanisms.md`**: 借貸協議的超額抵押機制與清算邏輯。
    - **`3_stablecoins.md`**: 法幣抵押 (USDT/USDC) vs 算法穩定幣 (DAI) 的穩定機制。
- **2_Web3_Frontiers** (前沿領域)
    - **`1_nft_and_metaverse.md`**: 數位資產所有權的變革、元宇宙經濟系統。
    - **`2_dao_governance.md`**: 去中心化自治組織 (DAO) 的治理模式與智能合約投票。

---

## 執行步驟建議

1.  建立上述目錄結構。
2.  依照編號順序，逐一撰寫 Markdown 文件。
3.  保持嚴格的格式規範 (無括號、無全形引號)。
