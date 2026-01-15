# 以太坊創世協議規範 Ethereum Genesis Protocol Specification

---

## 規範目標 Specification Goals

- 說明在以太坊網路啟動之前必須完成的協議定義與硬編碼參數
- 確立去中心化世界計算機的數位憲法與不可變規則
- 區分協議層定義與軟體實作層的職責範疇

---

## 核心定義 Core Definitions

- **協議代碼 Protocol Code:** 在創世區塊誕生前即存在的源代碼與規範文件，定義網路運作規則
- **載體 Implementation:** 實現協議規範的節點軟體，如 Geth、Nethermind、Besu 等，任何人都可依規範自行開發
- **角色 Role:** 作為去中心化世界計算機的憲法，規定節點如何驗證交易、執行智能合約、達成共識
- **與比特幣差異:** 以太坊協議支援圖靈完備的智能合約，而非僅限於價值轉移

---

## 區塊結構規範 Block Structure Specification

### Block Header 區塊頭

- **parentHash:** 父區塊雜湊值，確保區塊鏈的連續性與不可篡改性
- **ommersHash:** ⚡ 叔塊雜湊值 - **以太坊獨有**，用於獎勵孤兒區塊礦工
- **beneficiary:** 礦工或驗證者地址，接收區塊獎勵
- **stateRoot:** ⚡ 全局狀態樹根雜湊值 - **以太坊獨有**，追蹤所有帳戶狀態
- **transactionsRoot:** 交易樹根雜湊值，類似比特幣的 Merkle Root
- **receiptsRoot:** ⚡ 交易收據樹根雜湊值 - **以太坊獨有**，記錄執行結果與日誌
- **logsBloom:** ⚡ 日誌布隆過濾器 - **以太坊獨有**，快速檢索事件日誌
- **difficulty:** 當前難度值，PoW 時代使用，PoS 後為 0
- **number:** 區塊高度，從 0 開始遞增
- **gasLimit:** ⚡ 區塊 Gas 上限 - **以太坊獨有**，限制區塊內可執行的計算量
- **gasUsed:** ⚡ 實際消耗 Gas - **以太坊獨有**，記錄該區塊實際執行成本
- **timestamp:** 時間戳記，記錄區塊產生時間
- **extraData:** 額外資料欄位，礦工可寫入任意訊息
- **mixHash:** PoW 雜湊值，PoS 後棄用
- **nonce:** PoW 隨機數，PoS 後為 0

### Block Body 區塊體

- **transactions[]:** 交易列表
  - ⚡ **與比特幣差異:** 以太坊交易可包含智能合約呼叫的 `data` 欄位
  - ⚡ **與比特幣差異:** 單發送者 `from` 而非多輸入 `inputs`
- **ommers[]:** ⚡ 叔塊列表 - **以太坊獨有**，PoW 時代獎勵叔塊

---

## 創世區塊設定 Genesis Block Configuration

### 創世參數 Genesis Parameters

- **區塊編號 Block Number:** `0` - 鏈上第一個區塊
- **時間戳記 Timestamp:** `2015-07-30 15:26:13 UTC` - 主網啟動時間
- **父區塊雜湊 Parent Hash:** `0x0000...0000` - 64 個零
- **難度 Difficulty:** `17179869184` - 初始挖礦難度
- **Gas Limit:** ⚡ `5000` - **以太坊獨有**，創世區塊 Gas 上限
- **Extra Data:** `0x11bbe8db4e347b4e8c937c1c8370e4b5ed33adb3db69cbdb7a38e1e50b1b82fa`
  - 內容為 Vitalik Buterin 的簽名
- **Nonce:** `0x0000000000000042` - PoW 隨機數
- **Hard Coded Hash:** 軟體內建創世區塊雜湊值，作為所有後續區塊的信任根基

### 創世狀態 Genesis State

- **預分配帳戶 Pre-allocated Accounts:** ⚡ **以太坊獨有** - 眾籌參與者的初始餘額
  - 約 6000 萬 ETH 分配給 ICO 參與者
  - 約 1200 萬 ETH 預留給早期貢獻者與基金會
- **狀態編碼 State Encoding:** ⚡ **以太坊獨有** - 初始帳戶餘額直接寫入創世 State Root

---

## 帳戶模型定義 Account Model Definition

⚡ **以太坊獨有** - 比特幣使用 UTXO 模型，以太坊使用帳戶模型

### 帳戶類型 Account Types

- **EOA 外部帳戶 Externally Owned Account:**
  - 由私鑰控制
  - 可主動發起交易
- **合約帳戶 Contract Account:**
  - 由智能合約代碼控制
  - 僅能被動回應呼叫

### 帳戶狀態欄位 Account State Fields

- **nonce:** 交易計數器，防止重放攻擊
- **balance:** 以太幣餘額，單位為 Wei
- **storageRoot:** 該帳戶儲存樹的根雜湊值
- **codeHash:** 該帳戶關聯的 EVM 代碼雜湊值

---

## 經濟模型設定 Economic Model Configuration

### ETH 供應機制 ETH Supply Mechanism

- **供應總量 Total Supply:** ⚡ **無固定上限** - 與比特幣 2100 萬 BTC 不同
- **發行方式 Issuance:**
  - 創世預售：約 7200 萬 ETH 一次性發行
  - 區塊獎勵：動態調整
  - ⚡ EIP-1559 燃燒：部分交易費用永久銷毀 - **以太坊獨有**

### 區塊獎勵演進 Block Reward Evolution

- **初始獎勵 Initial Reward:** `5 ETH/區塊` - 2015-2017
- **Byzantium 拜占庭:** `3 ETH/區塊` - 2017-2019
- **Constantinople 君士坦丁堡:** `2 ETH/區塊` - 2019-2022
- **The Merge PoS 轉型:** ⚡ `~0.6 ETH/區塊` - **以太坊獨有**，轉為 PoS 後大幅降低

### 最小單位 Minimum Unit

- **Wei:** 以太幣最小單位
- **換算:** `1 ETH = 10¹⁸ Wei`
- **其他單位:** Gwei (10⁹ Wei)、Finney (10¹⁵ Wei)

---

## Gas 機制定義 Gas Mechanism Definition

⚡ **以太坊獨有** - 比特幣僅按交易字節大小收費

### Gas 基礎規則 Gas Fundamental Rules

- **定義 Definition:** 協議定義的計算單位，衡量 EVM 執行成本
- **設計目的 Design Purpose:**
  - 防止無窮迴圈癱瘓網路
  - 防止垃圾攻擊與資源濫用
  - 公平分配有限的計算與儲存資源
  - 激勵驗證者處理交易

### Gas 協議規則 Gas Protocol Rules

- **Opcode 成本:** 每個 EVM 操作碼都有協議定義的 Gas 成本
- **Gas Limit:** 交易必須設定 Gas 上限
- **超限處理:** 超過上限即終止執行並 Revert
- **不退還原則:** 消耗的 Gas 無論成功與否都不退還

### EIP-1559 改革 EIP-1559 Reform

⚡ **以太坊獨有** - 2021 年 London 硬分叉引入

- **Base Fee:** 動態調整的基礎費用，會被燃燒
- **Priority Fee:** 給驗證者的小費
- **Max Fee:** 使用者願意支付的最高費用

---

## 共識規則設定 Consensus Rules Configuration

### PoW Ethash 階段 PoW Ethash Phase

- **共識演算法 Consensus Algorithm:** ⚡ Ethash - **以太坊獨有**，記憶體密集型算法
  - **與比特幣差異:** 比特幣使用 SHA256
- **目標出塊時間 Target Block Time:** `~12-14 秒`
  - **與比特幣差異:** 比特幣為 10 分鐘
- **難度調整算法 Difficulty Adjustment:** 每個區塊動態調整
  - **與比特幣差異:** 比特幣每 2016 區塊調整一次
- **ASIC 抗性 ASIC Resistance:** ⚡ **以太坊獨有** - 設計為記憶體密集，抵抗 ASIC

### 難度炸彈 Difficulty Bomb

⚡ **以太坊獨有** - 強制網路升級機制

- **定義 Definition:** 協議內建的指數增長難度
- **目的 Purpose:** 強制網路升級至 PoS，防止 PoW 鏈永久存在
- **機制 Mechanism:** 難度公式包含指數增長項，最終使出塊時間趨近無限大

### PoS Beacon Chain 階段 PoS Beacon Chain Phase

⚡ **以太坊獨有** - 從 PoW 轉為 PoS

- **質押要求 Staking Requirement:** `32 ETH` 成為驗證者
- **驗證者職責 Validator Duties:** 提案區塊與驗證其他驗證者的區塊
- **Slashing 懲罰:** 違規者損失部分或全部質押
- **最終性 Finality:** 提供經濟最終性保證，需銷毀至少 1/3 質押才能回滾

---

## 智能合約規範 Smart Contract Specification

⚡ **以太坊獨有** - 比特幣僅有有限的 Script 語言

### EVM 虛擬機 EVM Virtual Machine

- **圖靈完備 Turing Complete:** 支援迴圈、遞迴與任意複雜運算
- **堆疊機器 Stack Machine:** 最大深度 1024 個元素，每個元素 256-bit
- **沙盒執行 Sandbox Execution:** 合約代碼在隔離環境中執行
- **確定性 Deterministic:** 相同輸入保證相同輸出

### 合約部署 Contract Deployment

- **部署交易 Deployment Transaction:** `to` 欄位為 `null`
- **Constructor:** 合約初始化函數，僅執行一次
- **地址計算 Address Calculation:**
  - CREATE: `keccak256(sender, nonce)`
  - CREATE2: `keccak256(0xff, sender, salt, init_code_hash)`

---

## 網路通訊規則 Network Communication Rules

### Chain ID 網路識別 Chain ID Identification

⚡ **以太坊獨有** - EIP-155 重放攻擊保護

- **主網 Mainnet:** `Chain ID = 1`
- **測試網 Testnets:**
  - Sepolia: `Chain ID = 11155111`
  - Holesky: `Chain ID = 17000`
  - Goerli: `Chain ID = 5` (已棄用)
- **用途 Purpose:** 確保交易只在特定網路有效，防止跨鏈重放

### P2P 通訊協議 P2P Communication Protocol

- **協議 Protocol:** DevP2P - 以太坊點對點通訊協議
- **預設端口 Default Ports:** `TCP/UDP 30303`
- **節點發現 Node Discovery:** Kademlia DHT 協議

### RPC 接口 RPC Interface

- **JSON-RPC:** 協議定義的標準 API
- **預設端口 Default Ports:**
  - HTTP: `8545`
  - WebSocket: `8546`

### 種子節點 Bootnodes

- 協議內建初始節點列表，硬編碼於客戶端源代碼
- 幫助新節點首次加入網路並發現其他對等節點
- 主網種子節點由以太坊基金會與社群維護

---

## 硬分叉歷史 Hard Fork History

⚡ **以太坊特點** - 頻繁透過硬分叉升級協議

### 主要硬分叉里程碑 Major Hard Forks

- **Frontier (2015-07-30):** 主網啟動，初始協議版本
- **Homestead (2016-03-14):** 穩定主網，移除金絲雀合約
- **DAO Fork (2016-07-20):** 處理 The DAO 事件，導致 ETC 分裂
- **Byzantium (2017-10-16):** 區塊獎勵降至 3 ETH
- **Constantinople (2019-02-28):** 區塊獎勵降至 2 ETH
- **Istanbul (2019-12-08):** Gas 成本調整
- **Berlin (2021-04-15):** EIP-2929 引入冷/熱存取
- **London (2021-08-05):** ⚡ EIP-1559引入，改變費用市場
- **The Merge (2022-09-15):** ⚡ PoW → PoS 轉型，協議史上最重大變更
- **Shanghai (2023-04-12):** ⚡ 允許提取質押的 ETH

---

## 以太坊 vs 比特幣協議對比總結

### 設計哲學差異

| 維度         | 比特幣 Bitcoin      | 以太坊 Ethereum       |
| ------------ | ------------------- | --------------------- |
| **設計目標** | 去中心化電子現金    | 去中心化計算平台      |
| **資料模型** | UTXO 模型           | 帳戶模型 ⚡            |
| **計算能力** | Script - 非圖靈完備 | EVM - 圖靈完備 ⚡      |
| **狀態管理** | 無狀態              | 有狀態 - State Trie ⚡ |
| **Gas 機制** | 無 - 按字節收費     | 有 - 按運算收費 ⚡     |
| **供應上限** | 2100 萬 BTC         | 無固定上限 ⚡          |
| **共識演進** | 始終 PoW            | PoW → PoS ⚡           |
| **出塊時間** | 10 分鐘             | 12-14 秒 ⚡            |

### 以太坊獨有特性清單

- ⚡ 帳戶模型
- ⚡ 全局狀態樹
- ⚡ 智能合約
- ⚡ EVM 虛擬機
- ⚡ Gas 機制
- ⚡ 叔塊獎勵
- ⚡ 交易收據與日誌
- ⚡ EIP-1559 費用燃燒
- ⚡ PoS 權益證明
- ⚡ 難度炸彈

---
