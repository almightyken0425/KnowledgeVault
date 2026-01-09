# Crypto_Overview 詳細架構規劃書

本文件為 `Crypto_Overview` 的執行藍圖。我們將加密貨幣知識體系分為四大層次 (Fundamentals, Blockchain Core, Smart Contracts, Applications)，並詳細規劃了每個檔案應包含的子章節內容。

---

## 1. 1_Fundamentals (基礎設施)
> **核心概念:** 密碼學與分散式系統的基石。在理解「幣」之前，必須先理解「安全」。

### `1_cryptography_basics.md`
**目標:** 解釋數學如何取代信用。
- **## 雜湊函數 Hash Functions**
    - **原理:** 單向性 (One-way)、抗碰撞性 (Collision Resistance)。
    - **SHA-256:** 比特幣的指紋產生器。
    - **應用:** 將任意長度的資料壓縮成固定長度的字串 (Digest)。
- **## 非對稱加密 Asymmetric Encryption**
    - **公鑰與私鑰:** 公鑰是信箱地址 (Public)，私鑰是信箱鑰匙 (Secret)。
    - **橢圓曲線密碼學 (ECC):** 為什麼比特幣使用 secp256k1 而不是 RSA。
- **## 數位簽章 Digital Signatures**
    - **簽署 (Signing):** 用私鑰證明「這是我發出的」。
    - **驗證 (Verification):** 所有人可以用公鑰確認「這真的是他發出的」。

### `2_distributed_ledger.md`
**目標:** 解釋去中心化的帳本如何達成共識。
- **## 拜占庭將軍問題 The Byzantine Generals Problem**
    - **情境:** 在有叛徒的情況下，分散的節點如何達成一致？
    - **解決方案:** 分散式帳本技術 (DLT) 的核心挑戰。
- **## 去中心化網路 P2P Network**
    - **無中心伺服器:** 每個節點都是平等的，既是客戶端也是伺服器。
    - **廣播機制:** 交易如何在網路中傳播 (Gossip Protocol)。
- **## 雙花攻擊 Double Spending**
    - **數位資產的特性:** 複製檔案太容易 (Ctrl+C, Ctrl+V)。
    - **解決方案:** 帳本的時間戳記與不可篡改性。

---

## 2. 2_Blockchain_Core (核心技術)
> **核心概念:** 以比特幣為例，解析區塊鏈運作的機械原理。

### 2_Blockchain_Core / 1_Bitcoin_Network (區塊鏈 1.0)

#### `1_bitcoin_whitepaper.md`
**目標:** 回歸中本聰的初衷。
- **## 點對點電子現金 P2P Electronic Cash**
    - **願景:** 不需要銀行的價值傳輸系統。
- **## 區塊鏈結構 The Blockchain Structure**
    - **Block Header:** 包含前一個區塊的 Hash (形成鏈)。
    - **Merkle Tree:** 快速驗證區塊內是否包含某筆交易。
- **## UTXO 模型 vs 帳戶模型**
    - **UTXO (Unspent Transaction Output):** 鈔票找零的概念 (比特幣)。
    - **Account Model:** 銀行帳戶餘額的概念 (以太坊)。

#### `2_mining_and_halving.md`
**目標:** 理解比特幣的經濟與安全模型。
- **## 工作量證明 Proof of Work (PoW)**
    - **挖礦 Mining:** 透過消耗電力尋找 Nonce 值，以換取記帳權。
    - **難度調整:** 每 2016 個區塊調整一次，確保平均 10 分鐘出塊。
- **## 減半機制 The Halving**
    - **供給曲線:** 每 21 萬個區塊產量減半。
    - **數位黃金:** 總量上限 2100 萬顆的稀缺性邏輯。

### 2_Blockchain_Core / 2_Consensus_Mechanisms (共識演算法)

#### `1_pow_vs_pos.md`
**目標:** 比較兩大主流共識機制。
- **## Proof of Work (PoW)**
    - **本質:** 物理世界的能源錨定 (Energy-backed)。
    - **優缺:** 極度安全與去中心化，但能源消耗巨大。
- **## Proof of Stake (PoS)**
    - **本質:** 虛擬世界的資本錨定 (Capital-backed)。
    - **機制:** 驗證者 (Validator)、質押 (Staking)、罰沒 (Slashing)。
    - **優缺:** 環保、效能高，但有富者恆富的中心化疑慮。

#### `2_dpos_and_others.md`
**目標:** 介紹追求效能的變體。
- **## DPoS (Delegated Proof of Stake)**
    - **代議民主:** 持幣者投票選出超級節點 (Super Representatives)。
    - **案例:** EOS, Tron, BSC。
- **## PoH (Proof of History)**
    - **Solana:** 用時間戳記來加速共識達成。

---

## 3. 3_Smart_Contracts_&_VM (智慧與擴容)
> **核心概念:** 區塊鏈 2.0，從記帳計算機進化為「世界電腦」。

### 3_Smart_Contracts_&_VM / 1_Ethereum_EVM

#### `1_smart_contract_concept.md`
**目標:** 雖然我們在寫 Code，但我們其實在寫法律。
- **## 世界電腦 The World Computer**
    - **圖靈完備 (Turing Complete):** 理論上可以執行任何計算邏輯。
    - **程式碼即法律 (Code is Law):** 不可篡改、自動執行的合約。
- **## EVM (Ethereum Virtual Machine)**
    - **堆疊式架構 (Stack-based):** 智能合約的運行環境。
    - **Bytecode:** Solidity 編譯後的機器碼。
- **## Gas Fee 機制**
    - **停機問題 (Halting Problem):** 防止無窮迴圈癱瘓網路。
    - **競價市場:** 區塊空間是有限資源。

#### `2_token_standards.md`
**目標:** 定義數位資產的介面標準。
- **## ERC-20 (Fungible Token)**
    - **同質化代幣:** 每一顆代幣都一樣 (如 USDT, UNI)。
    - **核心介面:** `transfer`, `approve`, `transferFrom` (授權轉帳模式)。
- **## ERC-721 (Non-Fungible Token)**
    - **非同質化代幣:** 每一顆都有唯一 ID (NFT)。
    - **應用:** 數位藝術品、遊戲裝備、身份憑證。

### 3_Smart_Contracts_&_VM / 2_Layer_2_Scaling

#### `1_scaling_trilemma.md`
**目標:** 為什麼區塊鏈這麼慢？
- **## 不可能三角 The Blockchain Trilemma**
    - **三選二:** 無法同時達成 去中心化、安全性、可擴展性。
- **## 擴容路徑**
    - **Layer 1:** Sharding (分片)。
    - **Layer 2:** Rollups (捲積)，Off-chain execution, On-chain data。

#### `2_rollups_concept.md`
**目標:** 以太坊擴容的終極方案。
- **## Optimistic Rollups (樂觀捲積)**
    - **機制:** 預設大家都是好人。
    - **詐欺證明 (Fraud Proof):** 有人舉報才驗證，退款期長 (7天)。
- **## ZK-Rollups (零知識捲積)**
    - **機制:** 用數學證明自己沒說謊。
    - **有效性證明 (Validity Proof):** 即時驗證，技術難度極高。

---

## 4. 4_Applications_Web3 (應用層)
> **核心概念:** 金融、藝術與組織的去中心化重構。

### 4_Applications_Web3 / 1_DeFi_Protocols

#### `1_dex_amm.md`
**目標:** 沒人上班的銀行與證交所。
- **## 訂單簿 (Order Book) vs 自動做市商 (AMM)**
    - **XY=K 模型:** Uniswap V2 的恆定乘積公式。
    - **流動性池 (Liquidity Pool):** 人人都可以當莊家賺手續費。
- **## 無常損失 Impermanent Loss**
    - **風險:** 當幣價劇烈波動時，當流動性提供者 (LP) 反而虧錢的數學原理。

#### `2_lending_mechanisms.md`
**目標:** 去中心化借貸的運作原理。
- **## 超額抵押 Over-collateralization**
    - **信任問題:** 匿名網路上沒有信用分數，只能由資產擔保。
    - **案例:** 抵押 150 元的 ETH，借出 100 元的 USDC。
- **## 清算機制 Liquidation**
    - **維持率:** 當抵押品價值下跌，任何人都能執行清算並獲利。
- **## 閃電貸 Flash Loans**
    - **區塊鏈特技:** 在同一個區塊內完成借款與還款，無須抵押，僅需支付手續費 (常見於套利、駭客攻擊)。

#### `3_stablecoins.md`
**目標:** 避險資產的分類。
- **## 法幣抵押 Fiat-backed**
    - **USDT/USDC:** 中心化機構託管美金，1:1 發行。風險在於銀行。
- **## 加密貨幣抵押 Crypto-backed**
    - **DAI:** 抵押 ETH 生成。透過超額抵押維持穩定。
- **## 算法穩定幣 Algorithmic**
    - **UST:** 試圖透過套利機制維持錨定，但有死亡螺旋 (Death Spiral) 風險。

### 4_Applications_Web3 / 2_Web3_Frontiers

#### `1_nft_and_metaverse.md`
**目標:** 數位所有權的延伸。
- **## PFP 與 數位藝術**
    - BAYC, Punk 的社群價值與 Veblen Goods 效應。
- **## GameFi & Metaverse**
    - Play-to-Earn 機制與虛擬地產。

#### `2_dao_governance.md`
**目標:** 新型態的人類協作組織。
- **## 鏈上治理 On-chain Governance**
    - 代幣加權投票 vs 二次房投票 (Quadratic Voting)。
- **## 治理攻擊**
    - 閃電貸借票攻擊提案。
