# 交易建立 Transaction Creation

## 交易資料結構 Transaction Data Structure

- **序列化 Serialization:** 所有的交易欄位最終會被編碼成一串十六進位 Hex String，不包含任何人名明文，例如 `020000...`。
- **版本號 Version:** 指定該交易遵循的協議版本，前 4 個 Bytes。
- **輸入列表 Inputs:**
    - **來源參照 Previous Output:** 包含指向上一筆交易的 `TxID` 與該交易的第幾個輸出索引 `Vout`。
    - **解鎖腳本 ScriptSig:** 包含使用者的數位簽名與公鑰，證明擁有該筆資產的使用權。
- **輸出列表 Outputs:**
    - **金額 Value:** 轉移給接收方的比特幣數量，單位為 Satoshis。
    - **鎖定腳本 ScriptPubKey:** 定義下一位接收者必須滿足什麼條件才能花費這筆資金，通常是驗證接收者的公鑰雜湊 Address。
- **鎖定時間 Locktime:** 指定交易最早可被寫入區塊的時間或區塊高度，未到期前節點不會打包。

---

## 數位簽名機制 Digital Signature Mechanism

- **私鑰簽署 Signing:** 發送方使用自己的私鑰對交易摘要進行加密運算，生成獨一無二的數位簽章。
- **數學特性 Math Properties:** 簽章相依於交易內容，若交易被修改過，簽章立即失效。
- **公鑰驗證 Verification:** 網路上的任何節點均可用發送方的公鑰來驗證簽章是否正確，而無須知道私鑰。

---

## 交易廣播 Transaction Broadcasting

- **構建完成 Construction:** 錢包軟體將輸入、輸出打包並完成簽名，序列化為 Raw Transaction Hex String。
- **傳播 Propagation:**
    - **JSON-RPC:** 錢包透過 HTTP POST 發送 `sendrawtransaction` 請求給節點。
    - **節點發現 Discovery:** 若無特定節點，錢包會透過 DNS Seeds 或基礎設施服務商 如 Infura 尋找可用節點 IP。
- **初步檢查 Initial Check:** 收到的節點會解開 `ScriptSig` 驗證簽名，並確認 `TxID` 指向的 UTXO 是否存在且未被花費，通過後才轉發給更多鄰居。

---