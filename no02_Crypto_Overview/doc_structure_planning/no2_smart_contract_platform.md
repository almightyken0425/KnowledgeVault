# 第二階段：以太坊基礎 Ethereum Fundamentals

---

## 階段目標 Stage Objective

深入探討以太坊作為通用智能合約平台的底層技術，依循五層金字塔結構，從協議基礎逐層建構至共識治理，確保知識有堅實的地基。

---

## 結構概述 Structure Overview

### 從比特幣到以太坊的演進

- **比特幣定位:** 去中心化價值轉移系統
- **以太坊突破:** 去中心化通用計算平台
- **核心創新:** 從有限腳本到圖靈完備 EVM
- **狀態管理:** 從無狀態 UTXO 到有狀態 Account Model

### 文件組織原則

- **遵循五層金字塔:** Layer 1 協議規範 → Layer 5 共識治理
- **由下而上建構:** 先定義協議，再描述實作與運作
- **資料溯源追蹤:** 每個欄位從來源到目標的完整路徑
- **多視角敘事:** 協議視角、節點視角、使用者視角、攻擊者視角

---

## Layer 1: 協議規範 Protocol Specification

**目標:** 定義以太坊協議的核心規範與不可變規則

### no1_1_ethereum_protocol.md - 以太坊創世協議規範

- **協議定義與願景**
  - 世界計算機概念
  - 與比特幣協議的根本差異
  - 無需許可與抗審查特性
  
- **創世區塊設定**
  - 創世參數硬編碼
  - 預分配帳戶與初始狀態
  - 時間戳記與初始難度
  
- **經濟模型規範**
  - ETH 供應機制與無固定上限
  - 區塊獎勵演進歷史
  - EIP-1559 燃燒機制
  
- **共識規則基礎**
  - PoW 到 PoS 的演進路徑
  - 難度炸彈機制
  - 出塊時間與難度調整
  
- **網路通訊規則**
  - Chain ID 與魔法數字
  - P2P 通訊協議
  - 種子節點與網路發現

### no1_2_evm_protocol_spec.md - EVM 協議層規範

- **EVM 作為協議核心組成**
  - 確定性執行保證
  - 平台無關性設計
  - 安全隔離與沙盒機制
  
- **指令集架構定義**
  - Opcodes 範圍與分類
  - 堆疊機器設計原理
  - 操作碼協議規範
  
- **Gas 計費協議規範**
  - Gas 成本表的協議定義
  - 反映計算成本的設計原則
  - 防止攻擊的經濟機制
  
- **圖靈完備性與停機問題**
  - 圖靈完備的意義與代價
  - Gas Limit 作為停機解決方案
  - 與比特幣 Script 的對比

---

## Layer 2: 資料結構與角色 Data Structure & Roles

**目標:** 介紹協議本身定義的抽象職責與資料結構

### no2_1_account_model.md - 帳戶模型與身份

- **帳戶模型定義**
  - EOA 外部帳戶 vs 合約帳戶
  - 帳戶狀態欄位: balance, nonce, codeHash, storageRoot
  - 地址生成機制與 Keccak256
  
- **與 UTXO 模型對比**
  - 銀行帳戶 vs 現金交易譬喻
  - 狀態儲存 vs 輸出追蹤
  - 重放攻擊防護: Nonce vs 輸入引用
  
- **身份與密碼學**
  - 私鑰與公鑰生成
  - 地址推導流程
  - ECDSA 簽名機制

### no2_2_transaction_structure.md - 交易資料結構

- **交易格式規範**
  - 基本欄位定義與用途
  - 簽名欄位: v, r, s
  - EIP-155 重放攻擊保護
  
- **交易類型演進**
  - Legacy 交易格式
  - EIP-2718 類型化交易
  - EIP-1559 新交易格式
  
- **關鍵欄位溯源**
  - nonce 從帳戶狀態讀取
  - gasPrice 使用者設定與網路建議
  - data 欄位的 ABI 編碼過程

### no2_3_block_and_state.md - 區塊與狀態結構

- **區塊結構定義**
  - Block Header 欄位詳解
  - Block Body 組成
  - 與比特幣區塊的差異
  
- **World State 概念**
  - 全局狀態樹的定位與作用
  - State Root 在 Block Header 中的關鍵角色
  - 狀態轉換函數概念
  
- **Merkle Patricia Trie 機制**
  - 結構設計與特性
  - 高效狀態證明
  - Storage Trie 與 State Trie 的關係

---

## Layer 3: 軟體實作角色 Software Implementation Roles

**目標:** 介紹非協議定義但實際運作時必須的軟體角色

### no3_1_node_types.md - 節點類型與職責

- **節點分類與職責**
  - 全節點 Full Node: 完整驗證與狀態儲存
  - 輕節點 Light Node: SPV 驗證
  - 歸檔節點 Archive Node: 歷史狀態儲存
  - 驗證者節點 Validator Node: PoS 出塊與驗證
  
- **三層架構區分**
  - 協議定義: 規則是什麼
  - 軟體實作: Geth, Nethermind, Besu, Erigon
  - 硬體載體: 伺服器、個人電腦、雲端實例
  
- **與比特幣節點對比**
  - EVM 執行需求
  - 狀態儲存成本差異
  - 同步模式差異

### no3_2_wallet_architecture.md - 錢包架構與實作

- **錢包定義與職責**
  - 私鑰管理與簽名職責
  - 交易構造與廣播
  - 與節點的 JSON-RPC 互動
  
- **錢包分類**
  - 熱錢包 vs 冷錢包
  - HD 錢包 BIP-32/44 標準
  - 硬體錢包與多簽錢包
  
- **主流實作範例**
  - MetaMask 瀏覽器錢包
  - Ledger 硬體錢包
  - Rainbow、Argent 移動錢包

---

## Layer 4: 運作流程 Runtime Flow

**目標:** 描述系統從啟動到持續運作的完整流程

### no4_1_transaction_lifecycle.md - 交易生命週期

- **交易創建流程**
  - 使用者操作到交易物件構造
  - 欄位填充與來源追溯
  - 私鑰簽名過程
  
- **廣播與傳播**
  - JSON-RPC 提交至節點
  - P2P 網路廣播機制
  - Mempool 機制與交易池管理
  
- **交易打包與確認**
  - 驗證者選擇交易邏輯
  - Gas Price 優先級排序
  - 區塊打包與狀態更新
  - 確認數與最終性

### no4_2_contract_deployment.md - 合約部署流程

- **合約創建交易**
  - to 欄位為 null 的特殊交易
  - data 欄位包含 Deployment Bytecode
  - Constructor 執行與參數傳遞
  
- **部署代碼與運行代碼**
  - Deployment Bytecode vs Runtime Bytecode
  - Constructor 執行後的代碼提取
  - 合約地址計算: CREATE vs CREATE2
  
- **部署成本分析**
  - 代碼儲存成本
  - Constructor 執行 Gas 消耗
  - 優化策略與最佳實踐

### no4_3_evm_execution.md - EVM 執行流程

- **執行上下文建立**
  - msg.sender, msg.value, msg.data
  - tx.origin 與呼叫鏈追蹤
  - block 相關環境變數
  
- **Bytecode 載入與執行**
  - Opcode 逐步執行流程
  - Stack/Memory/Storage 操作追蹤
  - Gas 消耗逐步累積
  
- **Revert 與 Return 機制**
  - 狀態回滾機制
  - Gas 退還規則
  - Receipt 與 Logs 生成

### no4_4_state_transition.md - 狀態轉換機制

- **全局狀態更新**
  - 交易執行前後的狀態對比
  - State Root 重新計算
  - Merkle Proof 驗證
  
- **Receipt 與 Logs**
  - Receipt Trie 結構
  - Event Logs 機制
  - Bloom Filter 快速檢索
  
- **狀態同步機制**
  - 快照同步 vs 完整同步
  - State Trie 增量更新
  - 節點間狀態一致性保證

---

## Layer 5: 共識與治理 Consensus & Governance

**目標:** 闡述系統的核心價值與規則修改機制

### no5_1_consensus_evolution.md - 共識機制演進

- **PoW Ethash 機制**
  - Ethash 演算法原理
  - 與 Bitcoin SHA256 的差異
  - ASIC 抗性設計
  
- **The Merge 轉型**
  - 從 PoW 到 PoS 的動機
  - Beacon Chain 合併過程
  - 難度炸彈的最終作用
  
- **PoS 驗證者機制**
  - 32 ETH 質押要求
  - 區塊提案與驗證職責
  - Slashing 懲罰機制
  - 獎勵結構變化
  
- **實際案例分析**
  - The Merge 事件時間線
  - 能源消耗降低 99.95%
  - 對生態的影響

### no5_2_eip_governance.md - EIP 治理機制

- **EIP 提案流程**
  - 提案類型: Core, Networking, Interface, ERC
  - 從 Draft 到 Final 的生命週期
  - 社群討論與核心開發者角色
  
- **硬分叉決策機制**
  - 向後相容性評估
  - 測試網驗證流程
  - 主網激活協調
  
- **歷史案例研究**
  - DAO Fork 爭議與 ETC 分裂
  - EIP-1559 費用改革推進
  - The Merge 多年準備過程
  
- **鏈上 vs 鏈下治理**
  - 以太坊的鏈下治理模式
  - 核心開發者與社群平衡
  - 與其他鏈的治理對比

### no5_3_gas_mechanism.md - Gas 機制深度分析

- **Gas 設計哲學**
  - 資源計費的必要性
  - 防止無窮迴圈與 DoS 攻擊
  - 公平分配有限計算資源
  
- **EIP-1559 改革機制**
  - Base Fee 動態調整算法
  - Priority Fee 礦工小費
  - Max Fee 與費用上限保護
  - ETH 燃燒與通縮效應
  
- **MEV 問題與解決方案**
  - Maximal Extractable Value 定義
  - 搶先交易與三明治攻擊
  - Flashbots 與 MEV-Boost
  - PBS Proposer-Builder Separation
  
- **經濟模型分析**
  - 費用燃燒導致的供應變化
  - PoS 質押收益計算
  - 網路安全性的經濟保障

---

## 文件數量統計 Document Statistics

### Layer 分佈

- **Layer 1 協議規範:** 2 份文件
- **Layer 2 資料結構:** 3 份文件
- **Layer 3 軟體實作:** 2 份文件
- **Layer 4 運作流程:** 4 份文件
- **Layer 5 共識治理:** 3 份文件
- **總計:** 14 份文件

### 與比特幣對比

| 層級    | 比特幣 | 以太坊 | 差異原因                     |
| ------- | ------ | ------ | ---------------------------- |
| Layer 1 | 1 份   | 2 份   | EVM 需獨立協議規範文件       |
| Layer 2 | 2 份   | 3 份   | 帳戶模型、交易、區塊狀態分離 |
| Layer 3 | 1 份   | 2 份   | 節點與錢包複雜度提升         |
| Layer 4 | 2 份   | 4 份   | 合約部署、EVM 執行、狀態轉換 |
| Layer 5 | 2 份   | 3 份   | PoS 演進、EIP 治理、Gas 深度 |

---

## 核心撰寫原則 Core Writing Principles

### 資料溯源追蹤範例

交易 data 欄位的完整溯源鏈:

```
使用者操作: DApp 介面點擊 Swap 按鈕
  ↓ 前端函數選擇器生成
Function Selector: keccak256("swap(uint256,address)")[:4]
  ↓ ABI 編碼參數
Encoded Parameters: amount + recipient address
  ↓ 組合完整 data
Complete Data Field: selector + encoded params
  ↓ 填入交易物件
Target: tx_object['data']
```

### 對比式學習強化

每份文件都應適當對比以太坊與比特幣的差異:

- **帳戶模型 vs UTXO:** 銀行帳戶 vs 現金交易
- **有狀態 vs 無狀態:** World State vs UTXO Set
- **圖靈完備 vs 有限腳本:** 任意計算 vs 條件驗證
- **動態 Gas vs 固定費用:** 按運算計費 vs 按字節計費
- **PoS vs PoW:** 質押驗證 vs 算力競爭

### 譬喻與視覺化建議

- **帳戶模型:** 像銀行帳戶系統，餘額直接記錄
- **World State:** 全球共享的資料庫快照
- **EVM:** 去中心化的沙盒計算環境
- **Gas:** 計算資源的燃料費
- **Mempool:** 交易候機室
- **State Trie:** 可驗證的索引樹結構

---

## 與第一階段的關聯 Connection to Stage 1

### 技術演進脈絡

- **第一階段比特幣:** 去中心化價值轉移的底層機制
- **第二階段以太坊:** 從價值轉移擴展至通用計算平台
- **核心突破:** 圖靈完備 EVM 實現可程式化區塊鏈

### 知識繼承與延伸

- **繼承概念:** 區塊鏈、P2P 網路、密碼學、共識機制
- **創新擴展:** 帳戶模型、全局狀態、智能合約、Gas 機制
- **比較學習:** 透過對比強化對兩種系統的深層理解

---

## 驗證檢查清單 Verification Checklist

### 結構完整性

- [ ] 五層金字塔結構完整
- [ ] 每層都有足夠的文件數量
- [ ] 層與層之間的依賴關係清晰
- [ ] 沒有循環引用

### 撰寫品質

- [ ] 每份文件都有角色定義或機制定位章節
- [ ] 所有系統內名詞首次出現時提供中英對照
- [ ] 所有抽象概念都配有譬喻或視覺化說明
- [ ] 所有關鍵流程都提供 Demo Code 或邏輯演示

### 格式規範

- [ ] 絕對禁止編號列表
- [ ] 絕對禁止星號列表
- [ ] 絕對禁止括號與引號
- [ ] 使用反引號標記技術術語
- [ ] 所有主要章節前都有水平分隔線

---
