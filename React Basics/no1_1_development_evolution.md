# App 開發演進史

本文將透過 **開發階段 Development Stage**、**開發運行 Development Runtime**、**打包建置 Build** 與 **正式運行 Production Runtime** 四個維度，講述 Mobile App 開發技術的演進故事。

---

## 原生開發 Native Development

故事的起點，是 iOS 與 Android 兩大陣營分治的時代。

### 開發階段 Development Stage

在這個階段，開發者必須為了兩個平台，組建兩支完全不同的軍隊。

- **iOS 陣營:**
  - **語言:** Swift 或 Objective-C
  - **核心環境:** 由 Xcode 處理
  - **套件管理:** CocoaPods / Swift Package Manager
  - **IDE:** Xcode
  - **作業系統:** 必須是 macOS
  - **建置工具:** Xcode Build System
- **Android 陣營:**
  - **語言:** Kotlin 或 Java
  - **核心環境:** JDK Java Development Kit
  - **套件管理:** Gradle
  - **IDE:** Android Studio
  - **作業系統:** Windows, macOS 或 Linux
  - **建置工具:** Gradle
- **特點:** 
  - **高牆:** 兩邊的程式碼完全無法共用。
  - **高成本:** 需要維護兩套程式碼、兩套工具鏈、兩個開發團隊。

### 開發運行 Development Runtime

在這個階段，運行等同於完整編譯後的執行。

#### 核心角色 Roles

- **開發者:** 觸發編譯與運行的發起者。
- **IDE (Xcode/Android Studio):** 負責協調編譯器、連結器，並將 App 安裝至目標裝置。
- **模擬器/實機 (Simulator/Device):** 接收並執行完整安裝包的目標環境。

#### 機制 Mechanism - 完整重編譯 Full Recompilation

- **情境:** 工程師修改了一行程式碼。
- **流程:**
  - **Compile:** 編譯器重新編譯修改的檔案。
  - **Link:** 連結器重新連結所有模組。
  - **Install:** IDE 解除安裝舊版 App，安裝新版 App。
  - **Launch:** 作業系統重新啟動 App，所有記憶體狀態歸零。
- **特點:** 回饋循環 Feedback Loop 較長，修改介面後無法即時看到結果。

#### 流程圖 Flowchart

```mermaid
graph LR
    Dev[Developer<br/>Modify Code] -->|Click Run| IDE
    IDE -->|Compile & Link| App_Binary[App Binary]
    App_Binary -->|Re-install| Device[Simulator/Device]
    Device -->|Restart App| Launch[App Running<br/>State Reset]
```

### 打包建置 Build

在這個階段，原始碼會被轉換成一個可安裝的壓縮檔。

#### 核心角色 Roles

- **編譯器 Compiler:**
  - **職責:** 翻譯官。
  - **行為:** 將人類寫的高階語言 Swift / Kotlin 翻譯成機器能執行的低階語言 機器碼 / Bytecode。
- **連結器 Linker:**
  - **職責:** 組裝工。
  - **行為:** 將編譯好的多個檔案，以及專案依賴的第三方函式庫，全部串接再一起，形成一個完整的執行檔。
- **打包工具 Packager:**
  - **職責:** 裝箱員。
  - **行為:** 將執行檔、圖片、設定檔等所有資源，封裝成一個符合作業系統規範的安裝包 ipa / apk。

#### 流程圖 Flowchart

```mermaid
graph LR
    Source[Source Code<br/>Swift/Kotlin] --> Compiler
    Compiler -->|Machine Code/Bytecode| Linker
    Lib[Libraries] --> Linker
    Linker -->|Executable| Packager
    Res[Resources] --> Packager
    Packager --> Artifact[Installer<br/>IPA/APK]
```

#### 產物結構 Artifacts

- **iOS - IPA (.ipa):**
  - 本質是一個 zip 壓縮檔。
  - **Payload/**: 核心資料夾。
    - **MyApp.app**: 應用程式本體。
      - **Mach-O:** 編譯後的機器碼執行檔。
      - **Assets.car:** 圖片與圖示資源。
      - **Info.plist:** App 的身分證與設定檔。
      - **_CodeSignature:** 數位簽章，確保 App 未被竄改。
- **Android - APK (.apk):**
  - 本質也是一個 zip 壓縮檔。
  - **classes.dex:** 編譯後的 Bytecode，由 ART 虛擬機執行。
  - **AndroidManifest.xml:** App 的身分證與權限宣告。
  - **res/**: 圖片與排版資源。
  - **lib/**: 針對不同 CPU 架構 arm64 / x86 的原生函式庫。
  - **META-INF/:** 數位簽章資訊。

### 正式運行 Production Runtime

#### 核心角色 Roles

- **作業系統 (OS Loader):** 負責載入 App 到記憶體。
- **Runtime Library (UIKit/Android SDK):** 系統內建的動態連結函式庫，負責繪圖與硬體操作。
- **CPU:** 直接執行 App 的機器碼指令。

#### 機制 Mechanism - 直接執行 Direct Execution

- **情境:** 使用者點擊 App Icon。
- **流程:**
  - **Load:** OS 將 App 的執行檔 Mach-O / ELF 載入記憶體。
  - **Assets:** 載入必要的圖片與資源。
  - **Execute:** CPU 開始執行 Entry Point 的指令。
  - **System Call:** 程式碼直接呼叫系統 API 繪製畫面。

#### 流程圖 Flowchart

```mermaid
graph TD
    Icon[User Tap Icon] --> OS[OS Loader]
    OS -->|Load Binary| Mem[Memory]
    Mem -->|CPU Execute| Code[Native Code]
    Code -->|Direct Call| SysAPI[System API<br/>UIKit/Android SDK]
    SysAPI -->|Draw| Screen
```

---

## React Native 開發

Facebook 提出了解決方案，試圖用 JavaScript 來操控原生世界。

### 開發階段 Development Stage

React Native 引入了網頁開發的模式來開發 App。

- **統一語言:** 使用 JavaScript 或 TypeScript 來撰寫商業邏輯與畫面邏輯。
- **核心工具鏈:** Node.js, Yarn / npm。
- **編輯器:** VS Code。
- **特點:** 
  - **邏輯共用:** 絕大多數的商業邏輯可以在雙平台間共用。
  - **學習曲線:** 開發者只需熟悉 JavaScript 生態系。

### 開發運行 Development Runtime

React Native 引入了網頁開發的熱更新體驗。

#### 核心角色 Roles

- **Metro Bundler:** 運作於電腦上的打包伺服器，負責即時將 JS 編譯成 Bundle。
- **Debug App:** 運作於手機上的原生殼層，內含 JS 引擎與 WebSocket Client。
- **HMR Client:** 負責接收異動程式碼並動態替換模組的腳本。

#### 機制 Mechanism - 熱更新 Fast Refresh

- **情境:** 工程師修改了 JS 檔案。
- **流程:**
  - **Watch:** Metro 監聽到檔案異動。
  - **Delta Bundle:** Metro 僅打包異動部分的程式碼 Delta。
  - **Push:** 透過 WebSocket 將 Delta 傳送給手機。
  - **HMR:** 手機端的 HMR Client 接收後，僅替換該模組，並保留 Component State。
  - **Render:** React 元件重新計算 VDOM，透過 Bridge 發送指令給原生層，即時更新 UIKit / Android View。
- **特點:** 畫面不需要重啟，狀態保留，開發體驗極快。

#### 流程圖 Flowchart

```mermaid
graph LR
    File[Modify File] -->|\Delta Change| Metro[Metro Bundler]
    Metro -->|WebSocket| App[Debug App]
    App -->|HMR Swap| JS[JS Engine]
    JS -->|Bridge JSON| Native[Native UI]
    Native -->|Update| Screen[Real Screen<br/>UIKit/Android]
```

### 打包建置 Build

React Native 的 Build 變成了混合式的過程，產物結構也發生了變化。

#### 混合式結構 Hybrid Structure

最終的安裝包 ipa / apk 不再只是純粹的原生程式，而是包裹了 JS 引擎與 JS 程式碼的容器。

- **原生部分 Native Shell:**
  - **行為:** 依然由 Xcode / Gradle 編譯。
  - **內容:** 包含了 App 的啟動程式、React Native 的核心 C++ / Java / Obj-C 程式碼，以及少數的第三方原生套件。
- **JS 部分 JavaScript Bundle:**
  - **行為:** 由 Metro Bundler 打包。
  - **內容:** 所有的業務邏輯 JS 程式碼、React 框架程式碼，被合併成單一檔案。

#### 流程圖 Flowchart

```mermaid
graph TD
    subgraph Native_Side [Native Side]
        NS[Native Source<br/>Java/Obj-C] --> N_Comp[Compiler]
    end
    subgraph JS_Side [JS Side]
        JS[JS Source<br/>TS/JS] --> Metro[Metro Bundler]
        Metro -->|bundle| JS_Bundle[main.jsbundle]
    end
    N_Comp --> Hybrid_Packager[Hybrid Packager]
    JS_Bundle --> Hybrid_Packager
    Hybrid_Packager --> Hybrid_Artifact[Hybrid App<br/>Native Shell + JS Bundle]
```

#### 產物結構變化 Artifacts Change

- **iOS IPA 內新增:**
  - `main.jsbundle`: 這是 App 的靈魂，即編譯後的 JS 程式碼。
  - `assets/`: JS 程式碼中引用的圖片等資源。
- **Android APK 內新增:**
  - `assets/index.android.bundle`: 同樣是 JS 程式碼。
  - `files/` 或 `drawable/`: JS 依賴的靜態資源。

### 正式運行 Production Runtime

#### 核心角色 Roles

- **Native Thread (Main):** 負責 UI 渲染與使用者互動。
- **JS Thread:** 負責執行業務邏輯、API 呼叫、狀態管理。
- **Bridge / JSI:** 負責兩個 Thread 之間的序列化溝通。

#### 機制 Mechanism - 雙軌非同步 Dual Thread Async

- **情境:** 使用者開啟 App。
- **流程:**
  - **Init:** Native Thread 啟動，初始化 Native Modules。
  - **Load Bundle:** 啟動 JS Thread，載入並執行 `main.jsbundle`。
  - **Render Command:** JS Thread 計算出佈局，透過 Bridge 傳送 JSON 指令給 Native Thread。
  - **Draw:** Native Thread 收到指令，呼叫系統 API 繪製 UI。

#### 流程圖 Flowchart

```mermaid
graph TD
    subgraph App_Process [App Process]
        NT[Native Thread] <-->|Bridge / JSI| JT[JS Thread]
        JT -->|Load| Bundle[JS Bundle]
    end
    NT -->|Draw| Screen
    User[User Input] -->|Touch Event| NT
```

---

## Expo 整合 當代主流

Expo 並非新技術，而是 React Native 的 **最佳實踐與託管平台**，它解決了 RN 建置過於複雜的問題。

### 開發階段 Development Stage

Expo 將開發體驗提升到了 **託管模式 Managed Workflow** 的層次。

- **工具鏈統一:**
  - 開發者不再需要接觸 Xcode 或 Android Studio。
  - 所有的開發操作都透過 **Expo CLI** 在終端機完成。
  - 核心環境變成了 **Node.js**。
- **設定與配置:**
  - 透過 `app.json` 或 `app.config.js` 統一管理雙平台的設定 權限、App Icon、Splash Screen。
- **特點:**
  - 只要會寫 JavaScript 就能開發 App，不需要懂 iOS / Android 的原生設定。

### 開發運行 Development Runtime - Expo Go

#### 核心角色 Roles

- **Expo Go App:** 官方預先編譯好的通用原生殼層，內含大量常見的 SDK 模組。
- **Expo CLI / Metro:** 負責啟動開發伺服器與 Tunnel 服務。
- **Manifest Service:** 負責告訴 Expo Go 要去哪裡下載 JS Bundle。

#### 機制 Mechanism - 動態串流 Dynamic Streaming

- **情境:** 開發者啟動專案 `npx expo start`。
- **流程:**
  - **Scan:** 手機開啟 Expo Go，掃描電腦上的 QR Code。
  - **Connect:** Expo Go 取得 Manifest，得知電腦的 IP 位置 或是透過 Tunnel URL。
  - **Stream:** 手機向電腦下載 JS Bundle 執行，而非重新安裝 App。
  - **Update:** 修改程式碼時，一樣透過 HMR 進行熱更新。
- **特點:** 就像寫網頁一樣，寫一行程式，手機立刻透過網路更新，完全跳過了原生編譯的痛苦。

#### 流程圖 Flowchart

```mermaid
graph LR
    PC[Computer<br/>Metro Server] -->|JS Bundle| Network
    Network -->|Download| ExpoGo[Expo Go App]
    ExpoGo -->|Run| JS_Engine
```

### 打包建置 Build - EAS Build

Expo 將最讓開發者頭痛的本機環境建置搬到了雲端，並引入了 **Prebuild** 預建置 的概念。

#### 核心角色 Roles

- **EAS CLI:**
  - **職責:** 指揮官。
  - **行為:** 讀取 `eas.json` 設定，將原始碼打包上傳至雲端，並監控建置進度。
- **Prebuild (CNG):**
  - **職責:** 建築師 (Continuous Native Generation)。
  - **行為:** 在雲端，根據 `app.json` 的設定，暫時性地「生成」出 iOS (`ios/`) 與 Android (`android/`) 的原生專案資料夾。這意味著你永遠不需要將這些龐大的原生檔案加入 git 版控。
- **EAS Build Worker:**
  - **職責:** 工人。
  - **行為:** 在雲端的 Mac / Linux 機器上，執行標準的 Xcode / Gradle 建置指令，產出最終安裝檔。

#### 流程圖 Flowchart

```mermaid
graph TD
    Client[Dev Computer<br/>Source Code] -->|EAS CLI| Cloud[Expo Cloud EAS]
    
    subgraph Cloud_Prebuild [Cloud: Prebuild CNG]
        Config[app.json] --> CNG[CNG Engine]
        CNG -->|Generate| Native_Proj[Native Project<br/>ios/ & android/]
    end
    
    subgraph Cloud_Build [Cloud: Build]
        Native_Proj --> Worker[EAS Worker]
        Worker -->|Xcode/Gradle| Artifact[Standalone App]
    end
    
    Cloud -->|Download Link| Client
```

#### 產物結構 Artifacts - Standalone App

Expo 的最終產物也是標準的 IPA / APK，但其內涵與 Expo Go 不同。

- **精簡化殼層 Slim Shell:**
  - 不同於 Expo Go 包山包海，EAS Build 出來的 App **只包含**你專案真正有用到的 Native Modules。
  - 體積大幅縮小，啟動速度更快。
- **OTA 機制:**
  - 內建 `expo-updates` 模組，讓 App 具備在啟動時檢查並下載最新 JS Bundle 的能力，實現空中更新。

### 正式運行 Production Runtime - Standalone App

#### 核心角色 Roles

- **Slim Binary:** 精簡化的原生執行檔，僅包含必要的 Native Modules。
- **expo-updates:** 負責檢查、下載、快取新的 JS Bundle 的管理模組。
- **EAS Update Server:** 存放新的 JS Bundle 版本的雲端主機。

#### 機制 Mechanism - 空中更新 Over-the-Air Update

- **情境:** 開發者發布了緊急 JS 修正 Bug Fix。
- **流程:**
  - **Check:** App 啟動時 預設行為，立刻詢問 EAS Server 是否有新版本。
  - **Download:** 若有新版，背景下載新的 JS Bundle 與資源。
  - **Swap:** 下載完成後，下次啟動時直接替換使用新的 Bundle。
  - **Launch:** 這個過程完全不需要經過 App Store / Google Play 的審核。

#### 流程圖 Flowchart

```mermaid
graph TD
    Launcher[App Launch] -->|Check Update| UpdateSDK[expo-updates]
    UpdateSDK -->|Query| Cloud[EAS Update Server]
    Cloud -->|New Bundle| UpdateSDK
    UpdateSDK -->|Replace Cache| Storage
    Storage -->|Load JS| App_Run
```

---

## 總結比較表

| 階段 | 開發階段 Dev Stage | 開發運行 Dev Runtime | 打包建置 Build | 正式運行 Prod Runtime |
| :--- | :--- | :--- | :--- | :--- |
| **Native** | **雙軌並行** 維護兩套 Code/IDE | **慢** 重編譯/重啟 | **本地** 依賴本機 OS 環境 | **原生核心** 機器碼直通 |
| **React Native** | **統一語言** JS/TS, VS Code | **快** Fast Refresh | **混合** 原生編譯 + JS 打包 | **雙軌制** JS 引擎 + Bridge |
| **Expo** | **託管模式** Expo CLI, Config | **極速** Expo Go 串流 | **雲端 EAS** 跨平台自動化 | **獨立 App** Standalone + OTA |
