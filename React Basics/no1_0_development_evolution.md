# App 開發演進史

本文將透過 **開發階段 Development** 與 **運行階段 Runtime** 兩個維度，講述 Mobile App 開發技術的演進故事。

---

## 第一階段 原生開發 Native Development

故事的起點，是兩個平行的宇宙。iOS 與 Android 各自擁有獨立的生態系，互不相通。

### 開發階段 Development Stage

在這個階段，開發者必須為了兩個平台，組建兩支完全不同的軍隊。

- **iOS 陣營:**
    - **語言:** Swift 或 Objective-C
    - **IDE:** Xcode
    - **作業系統:** 必須是 macOS
    - **建置工具:** Xcode Build System

- **Android 陣營:**
    - **語言:** Kotlin 或 Java
    - **IDE:** Android Studio
    - **作業系統:** Windows, macOS 或 Linux
    - **建置工具:** Gradle

**特點:**
- **高牆:** 兩邊的程式碼完全無法共用。
- **高成本:** 需要維護兩套程式碼、兩套工具鏈、兩個開發團隊。

### 運行階段 Runtime Stage

當 App 被安裝到使用者的手機上執行時，它是如何運作的？

- **編譯 Compiler:**
    - 在開發者的電腦上，原始碼 Swift/Kotlin 經過 **編譯器** 的翻譯，變成了機器看得懂的 **機器碼 Machine Code** 或 **Bytecode**。
    - 這些機器碼被打包成安裝檔 .ipa 或 .apk。

- **執行 Execution:**
    - 使用者開啟 App 時，作業系統直接載入並執行這些機器碼。
    - **iOS:** 程式碼直接呼叫 **UIKit** 或 **SwiftUI** 來繪製畫面。
    - **Android:** 程式碼直接呼叫 **Android SDK** 來繪製畫面。

- **與硬體溝通:**
    - 像是相機、GPS 等功能，程式碼都是直接透過作業系統提供的 **API** 進行呼叫，中間沒有任何阻礙。

**特點:**
- **極致效能:** 因為是直接與系統溝通，沒有中間人，效能最好。
- **完全存取:** 可以使用原廠提供的所有最新功能。

---

## 關鍵名詞與轉折

在進入下一階段前，我們必須先釐清幾個關鍵概念，這也是技術演進的核心解決對象。

- **開發階段 Development:**
    - 指的是 **Compile Time**，也就是工程師寫程式、除錯、打包的過程。
    - 核心痛點:** 跨平台開發時，工具鏈太複雜且不統一。

- **運行階段 Runtime:**
    - 指的是 **Run Time**，也就是 App 在使用者手上執行的過程。
    - 核心痛點:** 非原生語言 JavaScript 如何驅動原生的畫面？

---

## 第二階段 React Native 的誕生

為了打破兩個平行宇宙的高牆，React Native 出現了。它的願景是 **Learn Once, Write Anywhere**。

### 開發階段 Development Stage

React Native 引入了網頁開發的模式來開發 App。

- **統一語言:** 使用 JavaScript 或 TypeScript 來撰寫商業邏輯與畫面邏輯。
- **Metro Bundler:**
    - 這是一個專為 React Native 設計的打包工具。
    - 它的工作類似於網頁開發中的 Webpack。
    - 它負責將所有的 JS 程式碼打包成一個單一的檔案，稱為 **JS Bundle**。

**特點:**
- **邏輯共用:** 絕大多數的商業邏輯可以在雙平台間共用。
- **熱更新 Fast Refresh:** 修改 JS 程式碼後，不需要重新編譯整個 App，手機畫面可以即時更新。

### 運行階段 Runtime Stage

這是 React Native 最神奇的地方。一個不會寫原生語言的 JS 檔案，是如何控制手機的？

- **雙軌制:**
    - React Native App 的內部其實同時運行著兩個世界:**
        - **Native World:** 原生世界，負責 UI 繪製與硬體操作。
        - **JS World:** JavaScript 世界，負責商業邏輯。

- **JS 引擎 JS Engine:**
    - App 啟動時，會在其內部啟動一個 **JavaScript 引擎** 例如 Hermes。
    - 這個引擎負責載入並執行 **JS Bundle**。

- **核心機制 The Bridge 橋樑:**
    - 當 JS 程式碼寫著 `<View>` 時，它並不是真的在畫圖。
    - 它透過 **Bridge** 發送一個 JSON 訊息給 Native World。
    - **訊息內容:** 嘿，幫我畫一個長寬 100x100 的紅色方塊。
    - **Native World 回應:** 收到，呼叫 iOS 的 `UIView` 或 Android 的 `android.view.View` 來繪製。

**特點:**
- **原生渲染:** 雖然是用 JS 寫，但最終使用者看到的、摸到的，都是貨真價實的原生元件，而非網頁。
- **非同步溝通:** JS 與 Native 之間的溝通是非同步的，這保證了介面的流暢度，但也帶來了架構上的複雜性。

---

## 第三階段 Expo 的整合

React Native 雖然解決了 **程式碼共用** 的問題，但沒有解決 **工具鏈複雜** 的問題。開發者仍然需要安裝 Xcode 和 Android Studio 來處理原生的編譯設定。Expo 則是為了徹底解決這個問題而生。

### 開發階段 Development Stage

Expo 將開發體驗提升到了 **Managed Workflow** 託管模式 的層次。

- **工具鏈統一:**
    - 開發者不再需要接觸 Xcode 或 Android Studio。
    - 所有的開發操作都透過 **Expo CLI** 在終端機完成。
    - 核心環境變成了 **Node.js**。

- **Expo Go:**
    - 這是一個已經預先安裝好所有常見 Native Module 的 App 殼層。
    - 開發時，手機不需要重新編譯 App，只需要透過 Expo Go 載入電腦上的 JS Bundle 即可預覽。

**特點:**
- **降低門檻:** 只要會寫 JavaScript 就能開發 App，不需要懂 iOS/Android 的原生設定。
- **開發速度:** 省去了大量的原生編譯時間。

### 運行階段 Runtime Stage

在運行階段，Expo 其實就是一個 **高度優化且整合過後的 React Native 環境**。

- **Expo SDK:**
    - Expo 提供了一套統整過的 API，例如 `expo-camera`。
    - 開發者呼叫 `expo-camera`，Expo SDK 自動在底層幫你處理 iOS 與 Android 的權限與呼叫差異。
    - 這讓 **Bridge** 的兩端溝通變得更標準化、更穩定。

- **EAS Expo Application Services:**
    - 這是 Expo 提供的雲端服務。
    - 當 App 需要發布時，開發者不需要在這個地端電腦進行編譯。
    - 而是將程式碼上傳到雲端，由 EAS 的伺服器代為執行 Xcode 與 Gradle 的編譯工作，最後回傳安裝檔。

**總結:**
- **Native:** 一切親力親為，掌控度最高，成本最高。
- **React Native:** 邏輯共用，透過 Bridge 溝通，兼顧效率與體驗。
- **Expo:** 隱藏底層複雜度，提供類似網頁開發的極速體驗，是目前最推薦的開發方式。
