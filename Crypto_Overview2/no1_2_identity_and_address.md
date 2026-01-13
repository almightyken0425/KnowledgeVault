# 身份與地址生成 Identity and Address Generation

## 身份核心 Identity Core

- **私鑰 Private Key:**
    - **定義 Definition:** 依據創世協議規範，任何介於 1 到 $2^{256}-1$ 之間的 256 位元無號整數。
    - **來源 Source:** 透過任何具備高熵值的隨機過程 Random Process 生成。
        - **軟體生成:** 一般使用密碼學安全隨機數產生器 CSPRNG。
        - **物理生成:** 手動拋硬幣 256 次或擲骰子所產生的結果亦符合協議定義，即非程式產出亦可。
- **公鑰 Public Key:**
    - **定義 Definition:** 用於驗證數位簽章的公開識別碼。
    - **來源 Source:** 由私鑰經過橢圓曲線加密演算法 Elliptic Curve Cryptography 單向運算導出。
        - **數學生成:** 使用私鑰作為純量，與橢圓曲線生成點 G 進行點乘運算。
        - **物理性質:** 由於離散對數問題的困難性，此運算在數學上不可逆。
    - **邏輯演示 Demo Code:**
        ```python
        # 1. 生成私鑰 (256 bits random integer)
        # 範圍: 1 ~ 2^256
        private_key = CSPRNG(bits=256)
        
        # 2. 導出公鑰 (Elliptic Curve Multiplication)
        # K = k * G (G 是橢圓曲線上的生成點)
        public_key = secp256k1.multiply(GeneratorPoint_G, private_key)
        ```

---

## 地址生成 Address Generation

- **協議層 Protocol Layer - 雜湊 Hashing:**
    - **定義:** 創世協議規定必須將公鑰轉為雜湊值 Public Key Hash。
    - **運算:** SHA256 -> RIPEMD160。
- **應用層 Client Layer - 編碼 Encoding:**
    - **定義:** 為了防呆與易讀性，客戶端軟體將雜湊值再次編碼為人類可讀字串。
    - **標準:** Base58Check 即將雜湊結果添加校驗碼 Checksum 後進行 Base58 編碼。
    - **邏輯演示 Demo Code:**
        ```python
        # 1. 協議層: 雙重雜湊生成 Public Key Hash
        sha256_hash = SHA256(public_key)
        pub_key_hash = RIPEMD160(sha256_hash)
        
        # 2. 應用層: 計算校驗碼並編碼為 Address
        checksum = SHA256(SHA256(pub_key_hash)).first_4_bytes()
        address = Base58Encode(pub_key_hash + checksum)
        ```

---

## 錢包本質 Wallet Essence

- **定義 Definition:** 客戶端軟體用於儲存私鑰與公鑰對 Key Pairs 的本地資料庫檔案如 wallet.dat。
- **運作機制 Mechanism:**
    - **掃描 Scan:** 錢包依據公鑰導出的地址，去區塊鏈帳本上掃描對應的 UTXO。
    - **餘額 Balance:** 將掃描到的所有 UTXO 金額加總，顯示為使用者的餘額。
    - **簽署 Sign:** 當使用者發起交易時，調用存儲的私鑰進行簽名。
