# 以太坊創世協議規範

## 規範目標

- 定義去中心化世界電腦的作業系統核心規則。
- 確立狀態轉換邏輯與智能合約執行環境的不可變標準。

## 核心定義

- **協議本質:** 一個交易驅動的狀態機 Transaction-based State Machine。與比特幣的帳本不同，它維護的是全網運算後的最終狀態。
- **載體:** 執行層客戶端如 Geth 與共識層客戶端如 Prysm 的組合，兩者透過 Engine API 協作。
- **角色:** 作為應用程式 DApp 的底層基礎設施，提供運算 EVM 與儲存 State Trie 資源。

## 區塊結構規範

```json
{
  // 區塊頭: 輕節點驗證與狀態鎖定的核心
  "block_header": {
    "parent_hash": "0xabc...123",      // 父區塊雜湊: 連結上一區塊，形成鏈條
    "state_root": "0xdef...456",       // 世界狀態樹根: 執行完本區塊所有交易後，全網最新的帳戶餘額與變數快照雜湊
    "transactions_root": "0x789...012",// 交易樹根: 本區塊包含的所有交易雜湊
    "receipts_root": "0x345...678",    // 收據樹根: 交易執行後的結果如 Log 與 Event 的索引
    "logs_bloom": "0x00...00",         // 布隆過濾器: 用於快速檢索智能合約產生的事件日誌
    "difficulty": 0,                   // 挖礦難度: 在 PoS 機制下此值為 0 或被用作其他用途如 RANDOM
    "number": 15000000,                // 區塊高度: 這是第幾個區塊
    "gas_limit": 30000000,             // 燃料上限: 本區塊允許消耗的最大運算量
    "gas_used": 15000000,              // 實際燃料: 本區塊實際消耗的運算量
    "timestamp": 1654321098,           // 時間戳記: 出塊時間 Slot Time
    "extra_data": "0x...",             // 額外資訊: 驗證者可寫入的任意資料
    "mix_hash": "0x...",               // 隨機數相關: 用於 PoS 共識機制的隨機性驗證
    "base_fee_per_gas": "20 Gwei"      // 基礎費率: EIP-1559 機制下的最低 Gas 單價
  },
  // 區塊體: 實際存放交易資料的容器
  "transactions": [
    {
      "type": "Contract Call",         // 交易類型: 呼叫合約或轉帳
      "to": "0xContract...",           // 目標地址: 若為空則代表部署新合約
      "value": 1000,                   // 附帶金額: 轉移的 ETH 數量以 Wei 為單位
      "data": "0xa9059cbb...",         // 輸入資料: 呼叫合約的 Method ID 與參數 Input Data
      "gas_price": "50 Gwei",          // 願付單價: 使用者支付的手續費費率
      "v": "0x...",                    // 數位簽章 v: 恢復識別碼
      "r": "0x...",                    // 數位簽章 r: 簽章的 r 值
      "s": "0x..."                     // 數位簽章 s: 簽章的 s 值
    }
  ]
}

```

## 創世區塊設定

```json
{
  // 創世區塊: 網路啟動的第一個狀態快照
  "genesis": {
    "config": {
      "chain_id": 1,                   // 鏈 ID: 主網為 1，測試網為其他數字，防止重放攻擊
      "homestead_block": 1150000,      // 硬分叉高度: 歷史上升級協議的區塊高度紀錄
      "eip1559_block": 12965000,       // 倫敦升級: 啟動 Gas 燃燒機制的區塊高度
      "terminal_total_difficulty": "5875000..." // 合併閾值: 從 PoW 切換到 PoS 的觸發點 The Merge
    },
    "alloc": {                         // 初始分配: 創世時預先寫入狀態機的帳戶餘額 Crowdsale
      "0x000d83cf...": { "balance": "1000000000000000000" },
      "0x001d3f1e...": { "balance": "2000000000000000000" }
    },
    "timestamp": "0x0",                // 啟動時間
    "gasLimit": "0x1388"               // 初始 Gas 限制
  }
}

```

## 經濟模型設定

```json
{
  // 經濟模型: 定義資源計價與貨幣政策
  "economics": {
    "currency_unit": "Wei",            // 最小單位: 1 ETH = 10^18 Wei
    "resource_model": "Gas",           // 資源計價: 防止無限迴圈與資源濫用的計費單位
    "fee_mechanism": "EIP-1559",       // 費率機制: 將手續費拆分為 Base Fee (銷毀) 與 Priority Fee (小費)
    "issuance_policy": "Dynamic",      // 發行政策: 無固定上限，根據質押總量動態調整發行率
    "deflationary_force": "Fee Burn"   // 通縮機制: 網路越擁塞，銷毀的 ETH 越多，可能導致總供應量下降
  }
}

```

## 共識規則設定 Post-Merge

```json
{
  // 共識規則: 定義 PoS 驗證與最終性
  "consensus": {
    "algorithm": "Casper FFG",         // 共識演算法: 結合 LMD-GHOST 選擇分叉 與 Casper 確認最終性
    "slot_time": 12,                   // 時隙: 每一區塊產生的固定時間間隔，單位為秒
    "epoch_length": 32,                // 紀元: 包含 32 個 Slot，作為驗證者洗牌與最終性確認的週期
    "validator_stake": "32 ETH",       // 質押門檻: 成為驗證者所需的最低保證金
    "finality_condition": "2 Epochs",  // 最終性條件: 經過兩個紀元確認後，區塊被視為不可逆
    "slashing_conditions": [           // 罰沒條件: 違反協議規則將導致質押金被沒收
      "Double Signing",                // 雙重簽名: 在同一高度簽署兩個不同的區塊
      "Surround Vote"                  // 環繞投票: 違反 Casper 投票規則
    ]
  }
}

```

## 網路通訊規則

```json
{
  // 網路通訊: 定義執行層與共識層的通訊協議
  "network": {
    "p2p_protocol": "DevP2P",          // 節點通訊: 用於交易廣播與狀態同步的底層協議
    "discovery_port": 30303,           // 探索端口: 預設監聽埠
    "engine_api": {                    // 引擎 API: 執行層 EL 與共識層 CL 之間的溝通橋樑
      "port": 8551,                    // 認證端口: 僅允許本地受信任的 CL 連接
      "functions": [
        "engine_newPayloadV1",         // 傳遞執行負載: CL 告訴 EL 要執行哪些交易
        "engine_forkchoiceUpdatedV1"   // 更新分叉選擇: CL 告訴 EL 哪一條鏈是正確的
      ]
    },
    "bootnodes": [                     // 引導節點: 寫入客戶端中的初始連線列表
      "enode://d860a01f96...",
      "enode://22a8232c3a..."
    ]
  }
}

```