# EVM 虛擬機規範 Ethereum Virtual Machine Specification

---

## EVM 作為協議的核心組成 EVM as Core Component of Protocol

### EVM 在協議中的定位 EVM's Role in Protocol

- **協議的一部分 Part of Protocol:** EVM 不是附加功能，而是以太坊協議的核心規範。
- **共識關鍵 Consensus Critical:** 所有節點必須執行相同的 EVM 規範，否則無法達成共識。
- **確定性保證 Deterministic Guarantee:** 相同輸入必須產生相同輸出，這是協議的鐵律。

### 為什麼需要虛擬機？Protocol Design Decision

- **平台無關性 Platform Independence:**
    - 節點可能運行在不同作業系統與硬體上
    - EVM 確保所有節點執行結果完全一致
    
- **安全隔離 Security Isolation:**
    - 合約代碼在沙盒環境中執行
    - 無法直接存取宿主系統資源
    
- **可驗證性 Verifiability:**
    - 任何節點都能獨立驗證執行結果
    - 無需信任其他節點的執行過程

---

## EVM 架構規範 EVM Architecture Specification

### 堆疊機器設計 Stack Machine Design

EVM 採用堆疊機器架構，所有運算透過操作堆疊完成。

- **架構選擇 Architecture Choice:**
    - 堆疊機器 vs 暫存器機器
    - 堆疊機器更簡單，易於形式化驗證
    - 適合確定性執行要求

- **堆疊特性 Stack Characteristics:**
    - LIFO 後進先出結構
    - 最大深度 1024 個元素
    - 每個元素 256-bit 即 32 bytes
    - 僅能操作頂部 16 個元素

---

## 指令集架構 Instruction Set Architecture

### Opcodes 定義 Opcodes Definition

協議定義了約 140 個操作碼 Opcodes，範圍 `0x00` 到 `0xFF`。

#### 算術與邏輯運算類 Arithmetic and Logic

- **0x01 ADD:** 加法運算
- **0x02 MUL:** 乘法運算
- **0x03 SUB:** 減法運算
- **0x04 DIV:** 除法運算
- **0x06 MOD:** 取模運算
- **0x10 LT:** 小於比較
- **0x11 GT:** 大於比較
- **0x14 EQ:** 等於比較
- **0x16 AND:** 位元 AND 運算
- **0x17 OR:** 位元 OR 運算

#### 堆疊操作類 Stack Operations

- **0x50 POP:** 彈出頂部元素
- **0x60-0x7F PUSH1-PUSH32:** 將常數壓入堆疊
- **0x80-0x8F DUP1-DUP16:** 複製第 n 個元素
- **0x90-0x9F SWAP1-SWAP16:** 交換元素位置

#### 記憶體操作類 Memory Operations

- **0x51 MLOAD:** 從 Memory 讀取 32 bytes
- **0x52 MSTORE:** 將 32 bytes 寫入 Memory
- **0x53 MSTORE8:** 將 1 byte 寫入 Memory

#### 儲存操作類 Storage Operations

- **0x54 SLOAD:** 從 Storage 讀取
- **0x55 SSTORE:** 寫入到 Storage

#### 控制流程類 Control Flow

- **0x56 JUMP:** 無條件跳轉
- **0x57 JUMPI:** 條件跳轉
- **0x5B JUMPDEST:** 跳轉目標標記
- **0x00 STOP:** 停止執行
- **0xF3 RETURN:** 返回資料並停止
- **0xFD REVERT:** 回滾狀態並返回錯誤

#### 環境資訊類 Environmental Information

- **0x30 ADDRESS:** 當前合約地址
- **0x33 CALLER:** 呼叫者地址
- **0x34 CALLVALUE:** 轉移的 ETH 金額
- **0x35 CALLDATALOAD:** 讀取交易 data
- **0x42 TIMESTAMP:** 區塊時間戳
- **0x43 NUMBER:** 區塊高度

#### 合約操作類 Contract Operations

- **0xF0 CREATE:** 創建新合約
- **0xF1 CALL:** 呼叫另一個合約
- **0xF4 DELEGATECALL:** 委託呼叫
- **0xFA STATICCALL:** 靜態呼叫
- **0xFF SELFDESTRUCT:** 銷毀合約

---

## Gas 成本表 Gas Cost Table

### 協議定義的 Gas 成本 Protocol-Defined Gas Costs

每個 Opcode 都有協議寫死的 Gas 成本，這是共識的一部分。

| 類別 Category  | Opcode        | Gas 成本 Gas Cost                    |
| -------------- | ------------- | ------------------------------------ |
| **基本運算**   | ADD, SUB, MUL | 3 Gas                                |
| **除法取模**   | DIV, MOD      | 5 Gas                                |
| **雜湊運算**   | SHA3          | 30 + 6 Gas/word                      |
| **記憶體讀取** | MLOAD         | 3 Gas                                |
| **記憶體寫入** | MSTORE        | 3 Gas                                |
| **儲存讀取**   | SLOAD         | 200 Gas (冷) / 100 Gas (熱)          |
| **儲存寫入**   | SSTORE        | 20,000 Gas (新增) / 5,000 Gas (修改) |
| **跳轉**       | JUMP, JUMPI   | 8 Gas                                |
| **交易基本**   | Transaction   | 21,000 Gas                           |
| **合約創建**   | CREATE        | 32,000 Gas                           |
| **合約呼叫**   | CALL          | 700 Gas + 轉帳成本                   |

### Gas 成本設計原則 Gas Cost Design Principles

- **反映計算成本 Reflect Computational Cost:**
    - Storage 操作最貴，因為永久儲存於所有節點
    - Memory 操作較便宜，僅暫存於執行期間
    - Stack 操作最便宜，僅影響當前執行

- **防止攻擊 Attack Prevention:**
    - 每個操作都要付費，防止無限迴圈
    - 昂貴的 Storage 成本防止狀態爆炸

---

## 記憶體模型 Memory Model

EVM 提供三層記憶體，成本與生命週期各不相同。

### Stack 堆疊

- **特性 Characteristics:**
    - LIFO 結構
    - 最多 1024 個元素
    - 元素大小 256-bit
    - 僅能操作頂部 16 個

- **成本 Cost:** 每次操作 3 Gas（最便宜）
- **生命週期 Lifecycle:** 函數執行期間

### Memory 記憶體

- **特性 Characteristics:**
    - 線性位元組陣列
    - 動態擴展
    - 以 32 bytes 為單位存取

- **成本 Cost:**
    - 初始存取 3 Gas
    - 擴展成本二次方增長：`(size / 32)² / 512`

- **生命週期 Lifecycle:** 交易執行期間

### Storage 儲存

- **特性 Characteristics:**
    - 持久化鍵值對
    - 2²⁵⁶ 個槽位
    - 每槽 32 bytes

- **成本 Cost:**
    - 首次寫入（0 → 非 0）：20,000 Gas
    - 修改（非 0 → 非 0）：5,000 Gas
    - 清空（非 0 → 0）：退還 15,000 Gas

- **生命週期 Lifecycle:** 永久儲存

---

## 執行上下文 Execution Context

### 環境參數 Environmental Parameters

當合約執行時，EVM 提供以下上下文資訊：

- **交易相關 Transaction Context:**
    - `msg.sender`: 直接呼叫者地址
    - `msg.value`: 轉移的 ETH 金額（Wei）
    - `msg.data`: 交易 data 欄位
    - `msg.sig`: 函數選擇器（data 前 4 bytes）
    - `tx.origin`: 交易原始發起者（EOA）

- **區塊相關 Block Context:**
    - `block.timestamp`: 當前區塊時間戳
    - `block.number`: 當前區塊高度
    - `block.difficulty`: 當前難度（PoS 後為 0）
    - `block.gaslimit`: 當前區塊 Gas 上限
    - `block.coinbase`: 礦工/驗證者地址

### 呼叫堆疊限制 Call Stack Limit

- **深度限制 Depth Limit:** 最大呼叫深度 1024 層
- **超出處理 Overflow Handling:** 超過深度限制，交易失敗並 Revert
- **設計目的 Design Purpose:** 防止堆疊攻擊與無限遞迴

---

## 圖靈完備性與停機問題 Turing Completeness and Halting Problem

### 圖靈完備的意義 Meaning of Turing Completeness

- **定義 Definition:** EVM 可執行任意複雜的運算邏輯，包含迴圈與遞迴。
- **與比特幣 Script 對比:**
    - Bitcoin Script: 刻意設計為非圖靈完備，無迴圈
    - EVM: 圖靈完備，可執行任意邏輯

### 停機問題與 Gas 解決方案 Halting Problem and Gas Solution

- **停機問題 Halting Problem:**
    - 無法預先判斷程式是否會停止執行
    - 可能陷入無限迴圈

- **Gas 機制的作用 Gas Mechanism Role:**
    - 強制設定執行上限（Gas Limit）
    - 超過上限即終止執行
    - 防止網路癱瘓

---

## EVM 規範的演進 EVM Specification Evolution

### EIP 改進提案 Ethereum Improvement Proposals

EVM 規範透過 EIP 持續演進：

- **EIP-150:** Gas 成本調整，防止 DoS 攻擊
- **EIP-158:** 清理空帳戶，降低狀態膨脹
- **EIP-1283:** SSTORE Gas 成本優化
- **EIP-1884:** SLOAD Gas 成本調整
- **EIP-2929:** Gas 成本增加（冷/熱存取）
- **EIP-3529:** 降低 SELFDESTRUCT 退款

### 向後相容性 Backward Compatibility

- **舊合約繼續運作 Old Contracts Continue:** Gas 成本調整不會破壞舊合約邏輯
- **硬分叉升級 Hard Fork Upgrades:** 透過硬分叉引入新規範
- **測試網驗證 Testnet Validation:** 先在測試網驗證再部署主網

---
