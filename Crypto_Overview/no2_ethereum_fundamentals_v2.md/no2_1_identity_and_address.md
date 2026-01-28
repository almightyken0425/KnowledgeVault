# 身份與地址生成 Identity and Address Generation

## 身份核心 Identity Core

- **私鑰 Private Key:**
    - **定義 Definition:** 依據創世協議規範，任何介於 1 到 $2^{256}-1$ 之間的 256 位元無號整數。
    - **來源 Source:** 透過任何具備高熵值的隨機過程 Random Process 生成。
        - **軟體生成:** 一般使用密碼學安全隨機數產生器 CSPRNG。
        - **物理生成:** 手動拋硬幣 256 次或擲骰子所產生的結果亦符合協議定義，即非程式產出亦可。
    - **橢圓曲線:** 與比特幣相同，使用 secp256k1 曲線。
- **公鑰 Public Key:**
    - **定義 Definition:** 用於驗證數位簽章的公開識別碼。
    - **來源 Source:** 由私鑰經過橢圓曲線加密演算法 Elliptic Curve Cryptography 單向運算導出。
        - **數學生成:** 使用私鑰作為純量，與橢圓曲線生成點 G 進行點乘運算。
        - **物理性質:** 由於離散對數問題的困難性，此運算在數學上不可逆。
    - **邏輯演示 Demo Code:**
        ```python
        # 1. 生成私鑰 256 bits random integer
        # 範圍: 1 ~ 2^256-1
        private_key = CSPRNG(bits=256)
        
        # 2. 導出公鑰 Elliptic Curve Multiplication
        # K = k * G，G 是橢圓曲線上的生成點
        public_key = secp256k1.multiply(GeneratorPoint_G, private_key)
        ```
        
---

## 地址 Address

以太坊有兩種地址類型，生成方式不同：

### EOA 地址 EOA Address

- **定義 Definition:** 由私鑰控制的外部賬戶地址。
- **協議層 Protocol Layer - 雜湊 Hashing:**
    - **運算:** Keccak256 單次雜湊公鑰。
    - **差異:** 與比特幣的 SHA256 + RIPEMD160 雙重雜湊不同，以太坊僅使用 Keccak256 一次。
- **應用層 Client Layer - 編碼 Encoding:**
    - **格式:** 十六進位字串，40 個字元，加上 `0x` 前綴。
    - **校驗和:** EIP-55 混合大小寫校驗和機制。
- **邏輯演示 Demo Code:**
    ```python
    # 1. 協議層: 取得公鑰的 Keccak256 雜湊
    # 公鑰為 64 bytes，去除 0x04 前綴
    public_key_bytes = public_key[1:]  # 移除未壓縮格式的 0x04 前綴
    keccak_hash = Keccak256(public_key_bytes)
    
    # 2. 應用層: 取最後 20 bytes 作為地址
    address_bytes = keccak_hash[-20:]  # 160 bits = 20 bytes
    address_hex = "0x" + address_bytes.hex()
    # 結果: 0x742d35cc6634c0532925a3b844bc9e7595f0beb
    
    # 3. 應用層: EIP-55 校驗和編碼
    address_hash = Keccak256(address_hex[2:].lower())
    checksum_address = "0x"
    for i, char in enumerate(address_hex[2:]):
        if int(address_hash.hex()[i], 16) >= 8:
            checksum_address += char.upper()
        else:
            checksum_address += char.lower()
    # 結果: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
    ```

### 合約地址 Contract Address

- **定義 Definition:** 由智能合約代碼控制的賬戶地址，無私鑰。
- **生成時機:** 部署合約時，由部署交易決定。
- **生成方法1 - 傳統部署:**
    - **公式:** `address = keccak256(rlp([sender_address, nonce]))[-20:]`
    - **特徵:** 地址依賴於部署者的 nonce，可預測但不可重複。
- **生成方法2 - 確定性部署 EIP-1014:**
    - **公式:** `address = keccak256(0xFF + sender_address + salt + keccak256(bytecode))[-20:]`
    - **特徵:** 地址僅依賴於 bytecode 和 salt，可在部署前確定地址。
    - **用途:** Layer 2、跨鏈場景，需要提前知道合約地址。
- **邏輯演示 Demo Code:**
    ```python
    # CREATE: 傳統方法
    sender_address = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
    nonce = 5
    rlp_encoded = rlp.encode([bytes.fromhex(sender_address[2:]), nonce])
    contract_address = "0x" + keccak256(rlp_encoded)[-20:].hex()
    
    # CREATE2: 確定性方法
    sender_address = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
    salt = "0x0000000000000000000000000000000000000000000000000000000000000001"
    bytecode_hash = keccak256(bytecode)
    data = bytes.fromhex("FF") + \
           bytes.fromhex(sender_address[2:]) + \
           bytes.fromhex(salt[2:]) + \
           bytecode_hash
    contract_address = "0x" + keccak256(data)[-20:].hex()
    ```

---

## 地址格式對比 Address Format Comparison

| 特徵     | 比特幣 Bitcoin     | 以太坊 Ethereum      |
| -------- | ------------------ | -------------------- |
| 雜湊算法 | SHA256 + RIPEMD160 | Keccak256            |
| 地址長度 | 25-34 字元 Base58  | 42 字元 含 0x 前綴   |
| 校驗和   | Base58Check 內建   | EIP-55 大小寫混合    |
| 編碼格式 | Base58             | 十六進位 Hexadecimal |
| 合約地址 | 不支援             | 支援，CREATE/CREATE2 |

---

## 錢包本質 Wallet Essence

- **定義 Definition:** 客戶端軟體用於儲存私鑰與公鑰對 Key Pairs 的本地資料庫或加密檔案。
- **Keystore 格式:**
    - **標準:** JSON 格式，包含加密的私鑰與解密參數。
    - **加密:** 使用密碼 Password 進行 AES-128-CTR 加密。
    - **邏輯演示 Demo Code:**
        ```python
        # Keystore 檔案結構示意
        keystore = {
            "version": 3,
            "id": "unique-uuid",
            "address": "742d35cc6634c0532925a3b844bc9e7595f0beb",
            "crypto": {
                "ciphertext": "encrypted_private_key",
                "cipherparams": {"iv": "initialization_vector"},
                "cipher": "aes-128-ctr",
                "kdf": "scrypt",  # 金鑰導出函數
                "kdfparams": {
                    "dklen": 32,
                    "salt": "random_salt",
                    "n": 262144,
                    "r": 8,
                    "p": 1
                },
                "mac": "message_authentication_code"
            }
        }
        ```
- **運作機制 Mechanism:**
    - **解鎖 Unlock:** 使用者輸入密碼，透過 KDF 導出解密金鑰，解密 Keystore 取得私鑰。
    - **掃描 Scan:** 錢包依據地址，向節點查詢賬戶狀態 balance, nonce, storage。
    - **餘額 Balance:** 直接讀取賬戶的 balance 欄位，無需掃描 UTXO。
    - **簽署 Sign:** 當使用者發起交易時，調用私鑰進行 ECDSA 簽名，產生 v, r, s 三個值。

---

## HD 錢包 Hierarchical Deterministic Wallet

- **定義 Definition:** 使用分層確定性 BIP-32/39/44 標準，從單一種子 Seed 導出無限數量的私鑰。
- **種子生成 Seed Generation:**
    - **助記詞 Mnemonic:** 12 或 24 個英文單字，符合 BIP-39 標準。
    - **熵值 Entropy:** 128 或 256 bits 隨機數。
    - **邏輯演示 Demo Code:**
        ```python
        # 1. 生成助記詞
        entropy = CSPRNG(bits=128)  # 128 bits 熵值
        mnemonic = bip39.to_mnemonic(entropy)
        # 結果: "witch collapse practice feed shame open despair creek road again ice least"
        
        # 2. 導出種子
        seed = bip39.to_seed(mnemonic, passphrase="")  # 可選的額外密碼短語
        
        # 3. 導出主私鑰
        master_key = bip32.from_seed(seed)
        
        # 4. 導出以太坊路徑的私鑰 BIP-44
        # m/44'/60'/0'/0/0
        # 44': BIP-44 標準
        # 60': 以太坊的 coin_type
        # 0': 第一個賬戶
        # 0: 外部鏈
        # 0: 第一個地址
        eth_private_key = master_key.derive("m/44'/60'/0'/0/0")
        ```
- **路徑標準 Derivation Path:**
    - **格式:** `m / purpose' / coin_type' / account' / change / address_index`
    - **以太坊:** `m/44'/60'/0'/0/0`
    - **比特幣:** `m/44'/0'/0'/0/0`

---

## 與比特幣的差異總結 Differences from Bitcoin

| 特性        | 比特幣             | 以太坊                         |
| ----------- | ------------------ | ------------------------------ |
| 橢圓曲線    | secp256k1          | secp256k1 相同                 |
| 雜湊算法    | SHA256 + RIPEMD160 | Keccak256                      |
| 地址長度    | 可變 25-34 字元    | 固定 42 字元                   |
| 地址編碼    | Base58Check        | 十六進位 Hexadecimal           |
| 校驗和      | 內建於 Base58Check | EIP-55 大小寫混合              |
| 合約地址    | 無                 | 有，CREATE/CREATE2             |
| 賬戶狀態    | 無，僅 UTXO        | 有，nonce/balance/storage/code |
| HD 錢包路徑 | m/44'/0'/0'/0/0    | m/44'/60'/0'/0/0               |
