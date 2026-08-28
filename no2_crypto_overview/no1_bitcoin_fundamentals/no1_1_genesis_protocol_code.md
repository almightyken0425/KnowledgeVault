# 創世協議規範

## 規範目標

- 說明在區塊鏈網路啟動之前必須完成的代碼定義。
- 確立去中心化網路運作的數位憲法與不可變規則。

---

## 核心定義

- **協議代碼:** 在創世區塊誕生前即存在的源代碼，通常以 C++ 或 Go 等語言編寫。
- **載體:** 實現協議規範的節點軟體，如 Bitcoin Core、btcd 等，任何人都可依規範自行開發。
- **角色:** 作為網路節點的 DNA，規定節點如何驗證交易、達成共識與傳播區塊。

---

## 創世區塊設定

```json
{
  // 創世區塊: 區塊高度 0,寫死於源代碼中的第一個區塊
  "genesis_block": {
    "height": 0,                       // 區塊高度: 鏈上第一個區塊
    "timestamp": 1231006505,           // 時間戳記: 標記區塊鏈正式啟動的歷史時刻
    "coinbase_message": "The Times 03/Jan/2009 Chancellor on brink of second bailout for banks",
                                       // 創世訊息: 寫入 Coinbase 交易中的任意文字,用於證明區塊創建的時間與背景
    "block_hash": "000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f"
                                       // Hard Coded Hash: 軟體內建創世區塊的雜湊值,作為所有後續區塊的信任根基
  }
}
```

---

## 經濟模型設定

```json
{
  // 經濟模型: 定義貨幣發行與分配規則
  "economics": {
    "max_supply": 21000000,            // 供應總量: 寫死貨幣發行的上限,2100 萬顆
    "initial_reward": 50,              // 區塊獎勵: 定義初始每個區塊產生的新幣數量,50 BTC
    "halving_interval": 210000,        // 減半週期: 每 210000 個區塊獎勵減半,確保通貨緊縮模型
    "satoshi_per_btc": 100000000       // 最小單位: 1 BTC = 10^8 Satoshi,定義貨幣可分割的最小小數點位數
  }
}
```

---

## 共識規則設定

```json
{
  // 共識規則: 定義挖礦與區塊驗證的核心規則
  "consensus": {
    "target_block_time": 600,          // 目標出塊時間: 系統動態調整難度以維持的平均出塊間隔,600 秒
    "difficulty_adjustment_interval": 2016,
                                       // 難度調整週期: 每 2016 個區塊調整一次挖礦難度
    "pow_algorithm": "SHA256",         // 共識機制: 指定使用的共識演算法,SHA256 工作量證明
    "max_block_size": 1000000          // 區塊大小限制: 每個區塊允許容納的最大數據量,1 MB
  }
}
```

---

## 網路通訊規則

```json
{
  // 網路通訊: 定義節點間的通訊協議與參數
  "network": {
    "magic_bytes": "0xD9B4BEF9",      // 魔法數字: 一組用於識別特定區塊鏈網路數據包的唯一十六進位代碼
    "default_port": 8333,              // 通訊端口: 節點預設監聽與建立 P2P 連線的通訊埠
    "dns_seeds": [                     // 種子節點: 軟體內建的初始 DNS 列表,用於幫助新節點首次加入網路
      "seed.bitcoin.sipa.be",
      "dnsseed.bluematt.me",
      "dnsseed.bitcoin.dashjr.org"
    ]
  }
}
```

---
