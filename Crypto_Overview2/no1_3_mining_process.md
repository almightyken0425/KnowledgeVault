# 挖礦流程 Mining Process

## 記憶體池管理 Mempool Management

- **交易驗證 Validation:** 礦工節點收到交易後，首先驗證其數位簽名與輸入有效性。
- **暫存 Pending:** 合規的交易被放入當地的記憶體池 Mempool，等待被打包。
- **手續費優先 Fee Priority:** 礦工通常會優先選擇手續費率較高的交易，以最大化自身利益。

---

## 區塊組裝 Block Assembly

- **建構候選區塊 Candidate Block:** 礦工從 Mempool 中挑選數千筆交易。
- **Coinbase 交易:** 礦工在區塊開頭創建一筆特殊交易，將獎勵發送給自己的錢包地址。
- **計算 Merkle Root:** 礦工將所有選中的交易進行雜湊運算，生成唯一的 Merkle Root 放入區塊頭。

---

## 工作量證明 Proof of Work

- **雜湊競賽 Hashing Race:** 礦工不斷變更區塊頭中的隨機數 Nonce，並對整個區塊頭進行 SHA256 運算。
- **難度目標 Difficulty Target:** 運算出的 Hash 值必須小於目前網路規定的難度目標 Bits 才算成功。
- **耗能特性 Energy Cost:** 此過程需要消耗大量電力與硬體算力，確保攻擊成本極高。
- **成功出塊 Success:** 一旦找到符合條件的 Nonce，礦工立即向全網廣播這個新區塊。

---

## 區塊傳播 Block Propagation

- **驗證與轉發 Verify and Relay:** 其他節點收到新區塊後，驗證其 Hash 是否符合難度，且內部交易是否合法。
- **更新帳本 Ledger Update:** 驗證通過後，節點將新區塊連接至本地的區塊鏈末端，並從自己的 Mempool 中移除已被打包的交易。
- **新一輪競賽 Next Round:** 全網礦工放棄當前的候選區塊，基於這個新區塊的 Hash 開始下一輪的挖掘工作。

---

**文件結束**
