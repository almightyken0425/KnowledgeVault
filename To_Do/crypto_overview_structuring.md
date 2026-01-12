# Crypto_Overview 詳細架構規劃書

本文件為 `Crypto_Overview` 的執行藍圖。
我們參考了 **3Blue1Brown** 在 "But how does bitcoin actually work?" 影片中的優異架構，將知識體系重縮如下：
**Ledger (帳本) → Signatures (簽章) → Decentralization (去中心化) → PoW (共識) → Blockchain (不可篡改)**

這是一條從「為什麼需要它」到「它是如何運作」的完美邏輯鏈。

## 資料夾結構 ASCII 圖

```text
KnowledgeVault/
└── Crypto_Overview/
    ├── 1_Fundamentals/ (信任的基石)
    │   ├── 1_ledger_is_currency.md   (帳本即貨幣)
    │   ├── 2_digital_signatures.md   (身份與授權)
    │   └── 3_hash_functions.md       (數位指紋)
    │
    ├── 2_Blockchain_Core/ (運作的引擎)
    │   ├── 1_decentralization_pow.md (去中心化的代價)
    │   ├── 2_blockchain_structure.md (信任鏈條)
    │   ├── 3_forks_soft_hard.md      (軟分叉與硬分叉)
    │   └── 4_proof_of_stake.md       (權益證明)
    │
    ├── 3_Smart_Contracts_&_VM/ (可程式化的進化)
    │   ├── 1_Ethereum_EVM/
    │   │   ├── 1_smart_contract_concept.md
    │   │   └── 2_token_standards.md
    │   └── 2_Layer_2_Scaling/
    │       ├── 1_scaling_trilemma.md
    │       ├── 2_rollups_concept.md
    │       └── 3_blockchain_layers.md
    │
    └── 4_Applications_Web3/ (價值網路的應用)
        ├── 1_DeFi_Protocols/
        │   ├── 1_dex_amm.md
        │   ├── 2_lending_mechanisms.md
        │   └── 3_stablecoins.md
        └── 2_Web3_Frontiers/
            ├── 1_nft_and_metaverse.md
            └── 2_dao_governance.md
```

---

## 1. 1_Fundamentals (基礎設施)
> **核心概念:** 參考 3B1B 邏輯，從「帳本」出發，解釋為什麼我們需要密碼學。

### `1_ledger_is_currency.md`
**目標:** 建立 "The history of transactions IS the currency" 的核心觀念。
- **## 帳本哲學 The Ledger Philosophy**
    - **問題:** 如果大家都有一本帳本，誰的是真的？
    - **概念:** 錢不是物理實體，只是帳本上的一行紀錄。沒有「硬幣」，只有「交易紀錄」。

### `2_digital_signatures.md`
**目標:** 解決「身份認證」問題 (Identity)。
- **## 公私鑰加密 Public/Private Keys**
    - **直觀理解:** 公鑰是「存錢筒的孔」，私鑰是「打開存錢筒的鑰匙」。
- **## 數位簽章 Digital Signatures**
    - **不可否認性 (Non-repudiation):** 證明「這筆交易真的是我發起的」且「內容未被竄改」。
    - **數學原理:** 橢圓曲線 (ECC) 的簡單概念。

### `3_hash_functions.md`
**目標:** 解決「資料完整性」問題 (Integrity)。
- **## 數位指紋 Digital Fingerprint**
    - **SHA-256:** 輸入任何東西，都會輸出一個獨一無二的 256 位元字串。
    - **特性:** 不可逆、抗碰撞。這也是區塊鏈 id (TxID, BlockHash) 的來源。

---

## 2. 2_Blockchain_Core (核心技術)
> **核心概念:** 解決「去中心化後的信任」問題。

### `1_decentralization_pow.md`
**目標:** 解決「雙花」與「共識」問題 (Consensus)。
- **## 雙花問題 Double Spending**
    - **挑戰:** 沒有銀行 (中心管理者)，我怎麼知道這筆錢沒被花過兩次？
- **## 工作量證明 Proof of Work (PoW)**
    - **3B1B 核心解釋:** 用「計算力」來投票。為什麼要解「毫無意義的數學謎題」？因為這是證明你投入了真實資源 (能源/時間) 的唯一方法。
    - **Nonce 與 Difficulty:** 挖礦的數學本質。

### `2_blockchain_structure.md`
**目標:** 解決「竄改歷史」問題 (Immutability)。
- **## 區塊鏈條 Chain of Blocks**
    - **機制:** 每個區塊都包含前一個區塊的 Hash。
    - **效應:** 改了第 1 塊的任何一個字，第 100 塊的 Hash 就會變，整個鏈都會斷掉。
- **## 最長鏈原則 Longest Chain Rule**
    - **真理:** 當出現分叉時，永遠相信最長 (累積工作量最大) 的那一條。

### `3_forks_soft_hard.md`
**目標:** 區塊鏈如何升級？什麼是「分叉」？
- **## 軟分叉 (Soft Fork):** 
    - **向下相容:** 舊的節點還能用，只是不能用新功能 (如 SegWit)。
    - **不分裂:** 網路還是一條鏈。
- **## 硬分叉 (Hard Fork):**
    - **不相容:** 舊的節點必須強制更新，否則就被踢出網路。
    - **分裂:** 社群意見不合時會導致分裂 (如 BTC vs BCH, ETH vs ETC)。

### `4_proof_of_stake.md`
**目標:** 以太坊的進化 (The Merge)。
- **## 能源的迷思:** 
    - PoW 吃電，PoS (權益證明) 幾乎不耗電。
- **## 質押 (Staking) 取代 算力:**
    - 不用買顯卡，改用「抵押錢」來保證我不作惡。
    - **罰沒 (Slashing):** 作惡就沒收你的押金。

---

## 3. 3_Smart_Contracts_&_VM (智慧與擴容)
> **核心概念:** 以太坊將區塊鏈從「計算機」升級為「智慧型手機」。

### 3_Smart_Contracts_&_VM / 1_Ethereum_EVM

#### `1_smart_contract_concept.md`
**目標:** 程式碼即法律 (Code is Law)。
- **## EVM 與 圖靈完備**
    - **差異:** 比特幣只能做加減法，以太坊可以寫迴圈 (Loop)。
- **## Gas Fee**
    - **經濟學:** 防止程式跑無窮迴圈的煞車機制。

#### `2_token_standards.md`
**目標:** 資產通證化。
- **## ERC-20 vs ERC-721**
    - **貨幣 (Fungible):** 每一塊錢都一樣。
    - **收藏品 (Non-Fungible):** 每一張畫都獨一無二。

### 3_Smart_Contracts_&_VM / 2_Layer_2_Scaling
> **核心概念:** 從單一網路擴展到多層網路架構。

#### `1_scaling_trilemma.md`
**目標:** 為什麼區塊鏈這麼慢？
- **## 不可能三角**
    - 安全、去中心化、效能，只能選二。

#### `2_rollups_concept.md`
**目標:** Layer 2 擴容。
- **## Rollups 原理**
    - 把 100 筆交易打包成 1 筆上鏈。
    - **Optimistic vs ZK:** 驗證方式的差異 (事後抓更 vs 當下檢查)。

#### `3_blockchain_layers.md`
**目標:** "不同的網路" 是什麼意思？
- **## Layer 1 (L1):** 結算層 (Bitcoin, Ethereum, Solana)。負責最終安全性。
- **## Layer 2 (L2):** 執行層 (Optimism, Arbitrum)。負責速度與低費率。
- **## 測試網 (Testnet):** RD 的遊樂場 (Sepolia)。假的幣，真的邏輯。
- **## EVM vs Non-EVM:** 就像 Android vs iOS。

---

## 4. 4_Applications_Web3 (應用層)
> **核心概念:** 金融與社會的重構。

### 4_Applications_Web3 / 1_DeFi_Protocols

#### `1_dex_amm.md`
**目標:** 人人都能當莊家的交易所。
- **## 自動做市商 AMM**
    - **XY=K 公式:** 無需掛單簿的交易數學。
    - **流動性提供者 (LP):** 賺取手續費與承擔無常損失。

#### `2_lending_mechanisms.md`
**目標:** 全球化的當鋪。
- **## 超額抵押**
    - 既然沒有信用分數，那就用資產說話。
- **## 閃電貸 Flash Loans**
    - 區塊鏈特有的金融工具 (借款還款在同一筆交易完成)。

#### `3_stablecoins.md`
**目標:** 連結現實價值的橋樑 (USDT, DAI)。
- **## 法幣抵押 Fiat-backed:** 銀行裡有真的美金 (USDT/USDC)。
- **## 加密與算法 Crypto-backed:** 用程式碼維持 1 美元 (DAI, UST)。

### 4_Applications_Web3 / 2_Web3_Frontiers

#### `1_nft_and_metaverse.md`
**目標:** 數位資產所有權。
- **## 數位稀缺性**
    - 為什麼一張 JPG 可以賣這麼貴？ (社群、賦能、炫耀財)。

#### `2_dao_governance.md`
**目標:** 沒有老闆的公司。
- **## 鏈上治理**
    - 用代幣投票決定協議的未來。
