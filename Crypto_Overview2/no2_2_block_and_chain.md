# 區塊與鏈結構 Block and Chain Structure

## 區塊結構定義 Block Structure Definition

- **區塊頭 Block Header:**
    - **內容 Content:**
        - **Version:** 協議版本。
        - **PrevBlockHash:** 指向前一個區塊的雜湊指標，形成鏈條的關鍵。
        - **MerkleRoot:** 所有交易的數位指紋匯總。
        - **Time:** 時間戳記。
        - **Bits:** 當前難度目標。
        - **Nonce:** 用於工作量證明的計數器。
- **區塊體 Block Body:**
    - **內容 Content:**
        - **TxCount:** 交易總數量 VarInt。
        - **Coinbase Transaction:** 第一筆特殊交易，用於獎勵礦工即無 Input 並憑空產生 Output UTXO。
        - **Transaction List:** 其餘的一般交易列表。
    - **結構解構 Deconstruction:**
        - **Block** 包含 **Transactions**。
        - **Transactions** 包含 **Outputs**。
        - **Outputs** 即為 **UTXOs** 指在被花費之前。
        - **結論:** UTXO 並非直接寫在區塊上的欄位，而是藏在 Transaction List 裡面的 Output 資訊。
    - **邏輯演示 Demo Code:**
        ```json
        {
          // 區塊頭: 確保安全性與排序的 Metadata
          "block_header": {
            "version": 1,                       // 協議版本: 軟體升級與分叉的依據
            "prev_block_hash": "0000...abc",    // 鏈結指標: 指向前一個區塊雜湊，確保不可竄改
            "merkle_root": "ea34...567",        // 交易指紋: 全體交易的 Merkle Tree Root Hash
            "time": 1234567890,                 // 時間戳記: 區塊產生的當下時間
            "bits": 486604799,                  // 難度目標: 用於 PoW 計算的目標值
            "nonce": 2083236893                 // 隨機數: 礦工不斷嘗試調整的計數器
          },
          // 區塊體: 實際存放資料的容器
          "tx_count": 2,                        // 交易總數: 用於確認讀取範圍 VarInt
          "transactions": [
            {
              "type": "Coinbase",               // 交易類型: 第一筆特殊交易 Miner Reward
              "inputs": [
                {
                  "txid": "0000...0000",        // 來源交易ID: Coinbase 指向全零
                  "vout": "ffffffff"            // 來源索引: 特殊標記表示無輸入
                }
              ],
              "outputs": [
                {
                  "value": 0.1,                  // 金額: 憑空產生的挖礦獎勵
                  "address": "MinerAddress"     // 收款人: 礦工自己的地址
                }
              ]
            },
            {
              "type": "Normal",                 // 交易類型: 一般轉帳
              "inputs": [
                {
                  "txid": "prev_tx_hash_1",     // 引用指標 1: 來自過去的 0.3 BTC 即小金幣 A
                  "vout": 0                     // 引用索引
                },
                {
                  "txid": "prev_tx_hash_2",     // 引用指標 2: 來自過去的 0.2 BTC 即小金幣 B
                  "vout": 1                     // 引用索引
                }
              ],
              "outputs": [
                {
                  "value": 0.4,                 // 金額: 支付目標湊滿 0.5 支付 0.4
                  "address": "ReceiverAddress"  // 收款人
                },
                {
                  "value": 0.09,                // 金額: 找零扣除 0.01 手續費
                  "address": "ChangeAddress"    // 找零
                }
              ]
            }
          ]
        }
        ```

---

## 衍生概念與邏輯 Derived Concepts and Logic

### 鏈式結構 Chain Structure

- **連結機制 Chaining Mechanism:**
    - **Hash Pointer:** 每個區塊頭都包含 `PrevBlockHash`，這使得任何對歷史區塊的修改都會導致後續所有區塊的 Hash 改變，進而無效。
- **高度 Block Height:**
    - **定義 Definition:** 區塊在鏈上的序列編號，創世區塊高度為 0。
    - **功能 Function:** 用於表示時間順序與確認主要鏈即最長鏈原則。

### 狀態模型 State Model

- **UTXO 模型 Unspent Transaction Output:**
    - **拆解 Analysis:**
        - **Transaction Output:** 每一筆交易產生的產出物即比特幣鈔票。
        - **Unspent:** 尚未被當作下一筆交易 Input 來源的產出物即尚未花掉。
    - **譬喻 Metaphor 鎔鑄金幣:**
        - **初始狀態:** 你有一顆 10oz 的金幣即 UTXO。
        - **交易行為:** 為了支付 3oz 給對方，將這顆 10oz 金幣丟進火爐銷毀即 Input。
        - **產出結果:** 鑄造一顆 3oz 金幣給對方即 Output 1 加上一顆 7oz 金幣找零給自己即 Output 2。
    - **結論 Conclusion:**
        - **狀態轉換:** 舊的金幣被銷毀而新的金幣被創造。
        - **餘額計算:** 軟體負責計算目前世上所有屬於你的金幣即 UTXO 之總重量。


