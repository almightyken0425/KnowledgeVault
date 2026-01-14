# 第四階段：Layer 2 擴展方案

## 階段目標

探討區塊鏈擴展性問題與各類 Layer 2 解決方案，理解如何在保持安全性與去中心化的前提下提升吞吐量。

---

## 核心主題

### 擴展性挑戰

- 區塊鏈三難困境：去中心化、安全性、擴展性
- TPS 吞吐量限制分析
- 交易延遲與確認時間問題
- 區塊大小與儲存成本權衡
- 節點同步與網路頻寬考量
- Layer 1 vs Layer 2 擴展思路

### 狀態通道 State Channels

- 狀態通道基本原理
- 開啟與關閉流程
- 鏈下交易機制
- 多重簽名與時間鎖
- 爭議解決機制
- 路由與網路拓撲
- Lightning Network 閃電網路案例
- Raiden Network 雷電網路案例
- Payment Channel vs State Channel 差異

### Rollups 卷積技術

- Rollups 核心概念
- 資料可用性問題
- Optimistic Rollups 樂觀卷積
  - 詐欺證明機制
  - 挑戰期與提款延遲
  - Optimism、Arbitrum 案例
- ZK-Rollups 零知識卷積
  - 有效性證明機制
  - zkSNARK vs zkSTARK
  - zkSync、StarkNet 案例
- Rollups 比較與選擇考量

### 側鏈技術 Sidechains

- 側鏈架構與定義
- 雙向錨定機制
- 聯合簽名與多簽橋
- 獨立共識與安全性假設
- Polygon、Ronin 等案例分析
- 側鏈 vs Layer 2 差異

### Plasma 架構

- Plasma 設計理念
- 子鏈與父鏈關係
- Exit 機制與挑戰期
- Mass Exit 問題
- Plasma 發展現狀

---

## 預計文件清單

- **no8_1_scalability_challenge.md** - 擴展性挑戰
- **no8_2_state_channels.md** - 狀態通道
- **no8_3_rollups.md** - Rollups 卷積技術
- **no8_4_sidechains.md** - 側鏈技術

---

## 學習重點

- 理解區塊鏈三難困境的本質
- 掌握狀態通道的運作原理與適用場景
- 深入了解 Optimistic Rollups 與 ZK-Rollups 的差異
- 理解側鏈與 Layer 2 的安全性假設差異
- 能夠評估不同擴展方案的優缺點

---

## 與前階段的關聯

第一階段探討比特幣的基礎架構，第二階段引入以太坊的智能合約能力，本階段則聚焦於如何在保持去中心化與安全性的前提下，突破 Layer 1 的性能瓶頸。

---

**文件結束**
