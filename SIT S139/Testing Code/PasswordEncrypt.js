console.log("--- 檔案開始執行 ---"); // 加上這行來確認檔案有被讀取

const crypto = require('crypto');

// ---
// 1. 在這裡設定你的明文密碼和金鑰
const PLAINTEXT_PASSWORD = "asdf1234";
const SECRET_KEY = "UgLQOi741DXlJkvfGhr1/2/ytiKUBq/gcs7qYvUI8Zc=";
// ---

function encryptPassword() {
    try {
        console.log(`[開始加密]
  明文密碼: ${PLAINTEXT_PASSWORD}
  祕密金鑰: ${SECRET_KEY}`);

        // 2.  derive 256-bit key using SHA-256 of secret key
        // 產生一個 32-byte (256-bit) 的金鑰 Buffer
        const derivedKey = crypto.createHash('sha256').update(SECRET_KEY, 'utf8').digest();
        console.log(`  > 衍伸金鑰 (Hex): ${derivedKey.toString('hex')}`);

        // 3. generate random 12-byte IV
        const iv = crypto.randomBytes(12);
        console.log(`  > 隨機 IV (Hex): ${iv.toString('hex')}`);

        // 4. encrypt using AES-GCM
        //
        // *** 使用相容性較好的寫法 ***
        // 將 Tag Length (16 bytes = 128 bits) 作為選項傳入
        //
        const cipher = crypto.createCipheriv('aes-256-gcm', derivedKey, iv, {
            authTagLength: 16
        });

        // 5. 進行加密
        let encrypted = cipher.update(PLAINTEXT_PASSWORD, 'utf8');
        encrypted = Buffer.concat([encrypted, cipher.final()]);

        // 6. 取得 16-byte 的認證標籤 (Tag)
        const tag = cipher.getAuthTag();
        console.log(`  > 密文 (Hex): ${encrypted.toString('hex')}`);
        console.log(`  > 認證標籤 (Hex): ${tag.toString('hex')}`);

        // 7. prepend IV to ciphertext (and append tag)
        // 根據文件，最終格式是 IV + 密文 + Tag
        // (GCM 的標準做法)
        const combined = Buffer.concat([iv, encrypted, tag]);

        // 8. encode to Base64
        const finalBase64 = combined.toString('base64');

        console.log(`\n[加密完成]
  > 最終 Base64 (IV + 密文 + Tag):
--------------------------------------------------
${finalBase64}
--------------------------------------------------`);
        
        return finalBase64;

    } catch (error) {
        console.error("加密失敗:", error);
    }
}

// 執行加密
encryptPassword();