# 錢包與簽名器 Wallet and Signer

## 錢包核心定義 Wallet Core Definition

- **定義 Definition:** 儲存私鑰與管理賬戶的軟體或硬體工具。
- **Keystore:** JSON 格式加密檔案，使用密碼保護私鑰。
- **HD Wallet:** 分層確定性錢包，使用 BIP-32/39/44 標準從助記詞導出多個私鑰。

---

## 錢包類型 Wallet Types

### 瀏覽器錢包 Browser Wallet

- **MetaMask:** 最廣泛使用的瀏覽器擴充套件錢包。
- **功能:** 管理私鑰、簽署交易、與 DApp 互動。

### 硬體錢包 Hardware Wallet

- **Ledger:** 法國公司，支援多種加密貨幣。
- **Trezor:** 捷克公司，開源硬體錢包。
- **安全性:** 私鑰永不離開裝置，抗惡意軟體攻擊。

### 智能合約錢包 Smart Contract Wallet

- **多簽錢包 Multi-Sig:** Gnosis Safe，需多個簽名才能執行交易。
- **社交恢復 Social Recovery:** Argent，透過信任的聯絡人恢復錢包。
- **無 Gas 交易:** 支援 Meta-Transaction，由第三方支付 Gas。

---

## 交易簽名 Transaction Signing

### EIP-155 防重放攻擊

```python
# EIP-155: 將 chain_id 納入簽名
message_hash = keccak256(rlp.encode([
    nonce,
    gas_price,
    gas_limit,
    to,
    value,
    data,
    chain_id,  # 加入 chain_id
    0,
    0
]))

v, r, s = ecdsa_sign(message_hash, private_key)
v_adjusted = v + (chain_id * 2 + 35)  # EIP-155 調整
```

### EIP-712 結構化資料簽名

```python
# EIP-712: 簽署可讀的結構化資料
domain = {
    "name": "Uniswap V3",
    "version": "1",
    "chainId": 1,
    "verifyingContract": "0x..."
}

message = {
    "owner": "0x...",
    "spender": "0x...",
    "value": 1000,
    "nonce": 5,
    "deadline": 1234567890
}

structured_data = encode_eip712(domain, message)
signature = ecdsa_sign(keccak256(structured_data), private_key)
```

---

## 與比特幣錢包的對比

| 特性         | 比特幣          | 以太坊           |
| ------------ | --------------- | ---------------- |
| 賬戶模型     | UTXO 掃描       | 直接讀取 balance |
| HD 路徑      | m/44'/0'/0'/0/0 | m/44'/60'/0'/0/0 |
| 智能合約錢包 | 不支援          | 原生支援         |
| 結構化簽名   | 無              | EIP-712          |
