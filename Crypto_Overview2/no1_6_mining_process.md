# 請求處理與確認 Request Processing and Confirmation

## 伺服器端處理 Server Side Processing

- **礦工角色 Miner:** 將礦工視為區塊鏈網路的後端伺服器 Backend Server。
- **核心任務 Core Task:** 負責接收、排序並最終確認來自全網使用者的狀態變更請求 Transaction Request。

---

## 請求佇列 Transaction Queue Mempool

- **概念 Concept:** 記憶體池 Mempool 運作機制如同訊息佇列 Message Queue。
- **請求驗證 Validation:** 交易進入 Queue 之前，必須通過數位簽章與 UTXO 餘額的雙重檢查。
- **優先順序 Prioritization:** 礦工依據每筆交易願意支付的手續費率 Fee Rate 進行排序，高價者優先處理。

---

## 批次打包 Batch Processing Block Assembly

- **批次處理 Batch Idea:** 區塊鏈不會逐筆確認交易，而是累積一定數量的請求後一次性打包處理。
- **打包步驟 Assembly Steps:**
    - **選擇 Select:** 從 Mempool 中取出約 2000 至 3000 筆高優先級交易。
    - **指紋建構 Merkle Tree:** 將這些交易進行雜湊運算，生成唯一的 Merkle Root。
    - **獎勵交易 Coinbase:** 在區塊頭部建立一筆將區塊獎勵發送給礦工自己的特殊交易。

---

## 運算證明 Computational Proof PoW

- **寫入權限 Write Permission:** 伺服器必須提交足夠的「工作量證明」才能獲得將資料寫入全域資料庫的權限。
- **雜湊競賽 Hashing Race:**
    - **準備 Headers:** 組合 Version, Previous Hash, Merkle Root, Timestamp, Bits。
    - **暴力破解 Brute Force:** 不斷調整隨機數 Nonce，對區塊頭進行 SHA256 運算，直到算出的 Hash 值小於難度目標。

---

## 狀態更新 State Update Propagation

- **廣播 Broadcast:** 一旦算出合規的 Nonce，礦工立即向全網廣播這個新區塊，宣告請求處理完成。
- **確認 Confirmation:**
    - **驗證 Verify:** 其他節點收到區塊後驗證 PoW 與內部交易正確性。
    - **更新 Update:** 驗證通過後，節點將新區塊寫入本地資料庫，相關交易狀態正式轉為已確認 Confirmed。