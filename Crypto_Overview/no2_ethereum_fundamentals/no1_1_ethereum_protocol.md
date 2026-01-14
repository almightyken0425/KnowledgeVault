# 以太坊創世協議規範 Ethereum Genesis Protocol Specification

---

## 協議定位 Protocol Positioning

### 以太坊協議的本質 Nature of Ethereum Protocol

- **協議層 Protocol Layer:** 定義以太坊網路運作規則的源代碼與規範，在創世區塊前即硬編碼存在
- **數位憲法 Digital Constitution:** 作為去中心化世界計算機的根本法則，規定所有節點必須遵守的驗證與執行規則
- **協議 vs 軟體實作 Protocol vs Software Implementation:** 協議本身是規範，Geth、Nethermind、Besu 等是遵循協議規範的不同軟體實作

### 協議定義的範疇 Protocol Definition Scope

**協議層定義:**
- 創世區塊參數與初始狀態
- 經濟模型與代幣發行規則
- 共識機制基礎規範
- 網路通訊協議與魔法數字
- 硬分叉升級歷史與規則演進

**非協議層內容:**
- 帳戶模型與交易結構 → 資料結構定義範疇
- 節點與錢包實作 → 軟體實作範疇
- 交易生命週期與執行流程 → 系統運作流程範疇

---

## 協議願景與設計哲學 Protocol Vision and Design Philosophy

### 世界計算機願景 World Computer Vision

以太坊協議的核心願景是創建一個全球共享的去中心化計算平台。

- **無需許可 Permissionless:** 協議不限制誰可以參與網路，任何人都可部署合約或成為節點
- **抗審查 Censorship-Resistant:** 協議設計確保已部署的程式無法被任何單一實體關閉或審查
- **確定性執行 Deterministic Execution:** 協議保證相同輸入在所有節點產生相同輸出
- **經濟安全 Economic Security:** 透過 Gas 機制與質押經濟確保網路安全與資源公平分配

### 與比特幣協議的根本差異 Fundamental Differences from Bitcoin

| 維度         | 比特幣協議 Bitcoin Protocol | 以太坊協議 Ethereum Protocol  |
| ------------ | --------------------------- | ----------------------------- |
| **設計目標** | 去中心化電子現金系統        | 去中心化通用計算平台          |
| **資料模型** | UTXO 模型 - 輸出導向        | 帳戶模型 - 狀態導向           |
| **計算能力** | Script - 非圖靈完備         | EVM - 圖靈完備                |
| **狀態管理** | 無狀態 - 僅追蹤 UTXO Set    | 有狀態 - 追蹤 World State     |
| **應用範疇** | 價值轉移與簡單條件          | 任意複雜邏輯與狀態儲存        |
| **共識機制** | PoW SHA256 至今不變         | PoW Ethash → PoS Beacon Chain |

### 協議解決的核心問題 Core Problems Solved

**比特幣協議的限制:**
- Script 語言刻意設計為非圖靈完備，禁止迴圈與遞迴，無法執行複雜業務邏輯
- 無法儲存狀態，無法記住歷史資訊如投票記錄、資產所有權變更
- 應用場景受限於價值轉移與有限的條件腳本

**以太坊協議的設計突破:**
- 圖靈完備的 EVM 支援迴圈、遞迴與任意複雜運算
- 帳戶模型直接儲存狀態，每個帳戶都有持久化的餘額與儲存空間
- 可實現 DeFi 金融協議、NFT 數位資產、DAO 治理組織等複雜應用

---

## 創世協議硬編碼參數 Genesis Protocol Hard-Coded Parameters

### 創世區塊不可變設定 Genesis Block Immutable Configuration

**編譯時 Compile Time 確定的協議參數:**

創世區塊的完整配置在以太坊協議源代碼中硬編碼，在網路啟動前即確定且永不改變。

- **區塊編號 Block Number:** `0` - 鏈上第一個區塊
- **時間戳記 Timestamp:** `2015-07-30 15:26:13 UTC` - 主網啟動時間
- **父區塊雜湊 Parent Hash:** `0x0000000000000000000000000000000000000000000000000000000000000000`
- **難度 Difficulty:** `17179869184` - 初始挖礦難度
- **Gas Limit:** `5000` - 創世區塊 Gas 上限
- **Extra Data:** `0x11bbe8db4e347b4e8c937c1c8370e4b5ed33adb3db69cbdb7a38e1e50b1b82fa` - Vitalik 的簽名
- **Nonce:** `0x0000000000000042` - PoW 隨機數

### 創世狀態與初始分配 Genesis State and Initial Allocation

**預分配帳戶 Pre-allocated Accounts:**

協議定義了創世時的初始狀態分配，總計約 7200 萬 ETH。

- **眾籌參與者 Crowdsale Participants:** 約 6000 萬 ETH 分配給 ICO 參與者
- **早期貢獻者與基金會 Early Contributors & Foundation:** 約 1200 萬 ETH 預留
- **狀態編碼 State Encoding:** 初始帳戶餘額直接寫入創世 State Root

**系統內名詞 vs 系統外技術:**
- **ETH** - 協議定義的原生代幣單位
- **Wei** - 協議定義的最小單位，1 ETH = 10¹⁸ Wei
- **Keccak256** - 系統外技術，協議使用的雜湊演算法

---

## 經濟模型協議規範 Economic Model Protocol Specification

### ETH 供應協議規則 ETH Supply Protocol Rules

**與比特幣的核心差異:**

| 特性           | 比特幣 Bitcoin         | 以太坊 Ethereum          |
| -------------- | ---------------------- | ------------------------ |
| **總供應上限** | 2100 萬 BTC 硬編碼上限 | 無固定上限               |
| **發行方式**   | 僅區塊獎勵             | 創世預售 + 區塊獎勵      |
| **通膨模型**   | 固定減半週期至 2140 年 | 動態調整 + EIP-1559 燃燒 |
| **供應趨勢**   | 通縮 - 逼近上限        | 可能通縮 - 視燃燒量      |

**協議定義的發行機制:**

- **創世預售 Genesis Presale:** 約 7200 萬 ETH 一次性發行
- **區塊獎勵 Block Reward:** 協議規定每個區塊給予驗證者的 ETH 獎勵
- **EIP-1559 燃燒機制:** 協議規定部分交易費用被永久銷毀

### 區塊獎勵演進歷史 Block Reward Evolution History

協議透過硬分叉多次調整區塊獎勵，反映網路需求與共識轉型。

- **初始協議 Initial Protocol:** `5 ETH/區塊` - 2015-2017
- **Byzantium 拜占庭 EIP-649:** `3 ETH/區塊` - 2017-2019
- **Constantinople 君士坦丁堡 EIP-1234:** `2 ETH/區塊` - 2019-2022
- **The Merge PoS 轉型:** `~0.6 ETH/區塊` - 2022 至今

**設計動機 Design Rationale:**
- 降低通膨率減緩供應增長
- 為 PoS 轉型做準備，降低 PoW 挖礦激勵
- PoS 後獎勵降低反映能源成本下降

### Gas 機制協議基礎 Gas Mechanism Protocol Foundation

**協議層定義 Protocol Layer Definition:**

Gas 機制是協議的核心經濟規範，解決圖靈完備性帶來的停機問題。

- **Gas 定義 Gas Definition:** 協議定義的計算單位，衡量 EVM 執行成本
- **設計目的 Design Purpose:**
  - 防止無窮迴圈癱瘓網路
  - 防止垃圾攻擊與資源濫用
  - 公平分配有限的計算與儲存資源
  - 激勵驗證者處理交易

- **協議規則 Protocol Rules:**
  - 每個 EVM Opcode 都有協議定義的 Gas 成本
  - 交易必須設定 Gas Limit 上限
  - 超過上限即終止執行並 Revert
  - 消耗的 Gas 無論成功與否都不退還

**常見誤解 Common Misconception:**
- ❌ 錯誤: Gas 是一種可交易的代幣
- ✅ 正確: Gas 是計量單位，使用者支付的是 `Gas Used × Gas Price` 的 ETH

---

## 共識機制協議規範 Consensus Mechanism Protocol Specification

### PoW Ethash 協議定義 PoW Ethash Protocol Definition

**Proof of Work 階段協議規則 2015-2022:**

- **共識演算法 Consensus Algorithm:** Ethash - 協議定義的 PoW 演算法
- **目標出塊時間 Target Block Time:** `~12-14 秒` - 協議設定的平均出塊間隔
- **難度調整機制 Difficulty Adjustment:** 協議定義的動態調整公式，維持穩定出塊

**與比特幣 PoW 的差異:**

| 特性          | 比特幣 PoW        | 以太坊 PoW          |
| ------------- | ----------------- | ------------------- |
| **演算法**    | SHA256            | Ethash              |
| **目標時間**  | 10 分鐘           | 12-14 秒            |
| **調整週期**  | 2016 區塊         | 每個區塊            |
| **ASIC 抗性** | 無 - 被 ASIC 主導 | 有 - 記憶體密集設計 |

### 難度炸彈協議機制 Difficulty Bomb Protocol Mechanism

**協議設計的強制升級機制:**

- **定義 Definition:** 協議內建的指數增長難度，隨時間自動增加挖礦難度
- **設計目的 Design Purpose:** 強制網路升級至 PoS，防止 PoW 鏈永久存在
- **機制 Mechanism:** 難度公式包含指數增長項，最終使出塊時間趨近無限大

**演進歷史 Evolution History:**
- **Homestead:** 首次引入難度炸彈概念
- **Byzantium, Constantinople, Muir Glacier 等:** 多次透過硬分叉延遲炸彈
- **The Merge:** 難度炸彈完成使命，PoW 鏈停止出塊

### The Merge PoS 協議轉型 The Merge PoS Protocol Transition

**歷史性協議變更 - 2022 年 9 月 15 日:**

以太坊協議從 PoW 完全轉換至 PoS，這是區塊鏈史上最重大的共識機制轉型。

**PoS 協議基礎規範:**
- **質押要求 Staking Requirement:** 協議規定需質押 `32 ETH` 成為驗證者
- **驗證者職責 Validator Duties:** 提案區塊與驗證其他驗證者的區塊
- **Slashing 懲罰 Slashing Penalty:** 協議定義的懲罰機制，違規者損失部分或全部質押
- **獎勵結構 Reward Structure:** 協議規定驗證者獲得區塊獎勵與交易費用

**轉型影響 Transition Impact:**
- **能源消耗 Energy Consumption:** 降低約 99.95%
- **發行率 Issuance Rate:** 年通膨率從約 4.3% 降至約 0.5%
- **最終性 Finality:** PoS 提供更強的經濟最終性保證

---

## 網路通訊協議規範 Network Communication Protocol Specification

### Chain ID 與網路識別 Chain ID and Network Identification

**協議層魔法數字 Protocol-Level Magic Numbers:**

Chain ID 是協議定義的網路識別碼，確保交易只在特定網路有效。

- **主網 Mainnet:** `Chain ID = 1` - 協議硬編碼的主網標識
- **測試網 Testnets:**
  - **Sepolia:** `Chain ID = 11155111`
  - **Holesky:** `Chain ID = 17000`
  - **Goerli:** `Chain ID = 5` - 已棄用

**EIP-155 重放攻擊保護:**
- 協議要求交易簽名包含 Chain ID
- 防止一個網路的交易在另一個網路重放
- 這是協議層的安全保護，非軟體實作層

### P2P 通訊協議規範 P2P Communication Protocol Specification

**協議定義的網路通訊規則:**

- **P2P 協議 P2P Protocol:** DevP2P - 以太坊協議定義的點對點通訊協議
- **預設端口 Default Ports:** `TCP/UDP 30303` - 協議建議但非強制
- **節點發現 Node Discovery:** Kademlia DHT 協議用於發現對等節點

**種子節點 Bootnodes:**
- 協議內建初始節點列表，硬編碼於客戶端源代碼
- 幫助新節點首次加入網路並發現其他對等節點
- 主網種子節點由以太坊基金會與社群維護

### RPC 協議接口 RPC Protocol Interface

**應用層通訊協議:**

- **JSON-RPC:** 協議定義的標準 API 接口
- **預設端口 Default Ports:**
  - HTTP: `8545`
  - WebSocket: `8546`
- **協議方法 Protocol Methods:** `eth_sendTransaction`, `eth_call`, `eth_getBlockByNumber` 等

---

## 協議演進與硬分叉歷史 Protocol Evolution and Hard Fork History

### 硬分叉治理機制 Hard Fork Governance Mechanism

**協議升級的方式:**

以太坊透過硬分叉升級協議，這是鏈下治理機制，並非鏈上自動化。

- **EIP 提案流程 EIP Proposal Process:** Ethereum Improvement Proposal 是協議變更的正式流程
- **社群共識 Community Consensus:** 核心開發者、礦工/驗證者、用戶共同決定
- **向後不相容 Backward Incompatible:** 硬分叉改變協議規則，舊節點無法驗證新區塊

### 重要硬分叉里程碑 Major Hard Fork Milestones

**協議演進時間線:**

- **Frontier 前沿 2015-07-30:** 主網啟動，初始協議版本
- **Homestead 家園 2016-03-14:** 穩定主網，移除金絲雀合約
- **DAO Fork 2016-07-20:** 處理 The DAO 事件，爭議性硬分叉導致 ETC 分裂
- **Byzantium 拜占庭 2017-10-16:** 區塊獎勵降至 3 ETH，引入難度炸彈延遲
- **Constantinople 君士坦丁堡 2019-02-28:** 區塊獎勵降至 2 ETH，進一步優化
- **Istanbul 伊斯坦堡 2019-12-08:** Gas 成本調整，提升安全性
- **Berlin 柏林 2021-04-15:** Gas 成本改革，EIP-2929 引入冷/熱存取
- **London 倫敦 2021-08-05:** EIP-1559 引入，改變費用市場機制
- **The Merge 合併 2022-09-15:** PoW → PoS 轉型，協議史上最重大變更
- **Shanghai 上海 2023-04-12:** 允許提取質押的 ETH，完成 PoS 基礎設施

### DAO Fork 爭議案例 DAO Fork Controversy Case

**協議不可變性 vs 社群干預:**

DAO Fork 是以太坊歷史上最具爭議的協議變更，展現了鏈下治理的兩難。

- **事件背景 Background:** 2016 年 The DAO 智能合約被駭客攻擊，損失約 360 萬 ETH
- **社群分裂 Community Split:** 
  - **支持硬分叉:** 認為應修改協議回滾交易，保護投資者
  - **反對硬分叉:** 認為協議應不可變，Code is Law
- **結果 Result:** 硬分叉執行，主鏈回滾 The DAO 交易，反對者繼續原鏈形成 Ethereum Classic

**協議哲學啟示 Protocol Philosophy Insight:**
- 協議本身是規則，但規則由社群共識決定
- 不可變性是理想，但面對重大事件可能妥協
- 鏈下治理機制既是優勢也可能是風險

---

## 協議層與其他層的分界 Protocol Layer Boundary

### 文件架構說明 Document Architecture
本文件體系依據五層金字塔架構組織：
1. **Layer 1 協議規範:** 定義規則 (本文件範疇)
2. **Layer 2 資料結構:** 定義數據格式
3. **Layer 3 軟體實作:** 定義客戶端行為
4. **Layer 4 運作流程:** 定義動態過程
5. **Layer 5 共識治理:** 定義演進機制

### 協議層明確定義 Protocol Layer Definition

**協議層包含 Protocol Layer Includes:**
- 創世區塊參數與初始狀態
- 區塊獎勵與代幣發行規則
- 共識機制規範 - Ethash PoW, Beacon Chain PoS
- Gas 計費基礎規則
- 網路識別碼 Chain ID
- 硬分叉歷史與規則演進

**協議層不包含 Protocol Layer Excludes:**
- 帳戶模型詳細結構 → Layer 2 資料結構
- 交易格式詳細定義 → Layer 2 資料結構
- 區塊與狀態樹結構 → Layer 2 資料結構
- 節點與錢包實作 → Layer 3 軟體實作
- 交易生命週期 → Layer 4 運作流程
- EVM 執行流程 → Layer 4 運作流程

### 術語一致性 Terminology Consistency

| 中文術語 | 英文術語           | 層級定位 | 首次詳細定義文件                 |
| -------- | ------------------ | -------- | -------------------------------- |
| 以太幣   | Ether, ETH         | Layer 1  | 本文件                           |
| Wei      | Wei                | Layer 1  | 本文件                           |
| 區塊獎勵 | Block Reward       | Layer 1  | 本文件                           |
| Chain ID | Chain ID           | Layer 1  | 本文件                           |
| 帳戶模型 | Account Model      | Layer 2  | `no2_1_account_model.md`         |
| 交易格式 | Transaction Format | Layer 2  | `no2_2_transaction_structure.md` |
| 全局狀態 | World State        | Layer 2  | `no2_3_block_and_state.md`       |

---
