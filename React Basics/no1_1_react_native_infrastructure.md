# React Native 基礎建設層次 Infrastructure Layers

## 核心層次定義

- **原始碼編譯 Compiling:**
    - **比喻:** 蓋廚房結構
    - **技術:** Xcode Build / Gradle Build
    - **影響:** 若失敗，App 無法產生執行檔，無法安裝。
    - **解決:** Expo Go 預先編譯好通用執行檔。

- **原生依賴 Dependencies:**
    - **比喻:** 購買特殊廚具
    - **技術:** Native Libraries e.g. Camera SDK, Bluetooth SDK
    - **影響:** 若缺少，JS 呼叫對應功能時會閃退或報錯。
    - **解決:** Expo Go 內建標準套件集合。

- **憑證與簽章 Signing:**
    - **比喻:** 營業執照與衛生檢查
    - **技術:** Code Signing, Certificates, Provisioning Profiles
    - **影響:** 若無效，iOS 拒絕安裝 App，或特定功能如 iCloud 失效。
    - **解決:** Expo EAS Build 自動管理憑證。

- **環境配置 Configuration:**
    - **比喻:** 水電配置圖與秘密配方
    - **技術:** Info.plist / AndroidManifest.xml / .env
    - **影響:** App 名稱錯誤、連錯資料庫、找不到 API Key。
    - **解決:** `app.json` 與 `app.config.js` 統一管理。

- **橋接溝通 Bridge:**
    - **比喻:** 外場服務生 傳菜口
    - **技術:** React Native Bridge / JSI JavaScript Interface
    - **影響:** JS 按鈕點擊後，原生層無反應。
    - **解決:** Expo 確保橋接層穩定性。

---

## Expo Go 與 Development Build

- **Expo Go 標準版:**
    - **定位:** 預先蓋好的「自助餐廳」。
    - **特點:** 內含標準原生套件，只需載入 JS 代碼即可運作。
    - **限制:** 無法使用非標準的原生套件。

- **Development Build 自建版:**
    - **定位:** 自行搭建的「專屬餐廳」。
    - **特點:** 可安裝任何原生套件，需自行編譯與簽章。
    - **限制:** 需在手機上安裝專屬 App 才能預覽 對應 `exp+<slug>://` URL Scheme。

---

**文件結束**
