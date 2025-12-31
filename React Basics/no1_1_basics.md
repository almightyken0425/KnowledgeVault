# App 生命週期

## 開發階段 - XCode vs AndroidStudio vs Expo

開發階段是指從建立專案、撰寫程式碼、進行測試預覽，一直到準備打包上架的整個過程。在這個階段，開發者所使用的工具鏈 Toolchain 組合，將直接決定專案的開發效率、團隊成員所需的技能、以及整體的開發成本。

> [!NOTE] 核心差異概覽
>
> - **iOS / Android 原生開發**：需要為兩個平台，**分別**維護兩套獨立、複雜且重量級的**原生工具鏈**。開發者必須直接面對並操作 `Xcode` 和 `Android Studio` 這兩個龐大的 IDE。
> - **Expo 開發 React Native**：將開發流程**統一**到一套以 `Node.js` 為核心的、輕量且高效的 **JavaScript 工具鏈**中。開發者絕大多數時間都在 `VS Code` 中工作，由 Expo 的工具來處理與原生平台的複雜互動。

|**層次 / 目的**|**原生 iOS 開發**|**原生 Android 開發**|**用 Expo 開發 React Native**|
|---|---|---|---|
|**作業系統需求**|**macOS** 硬性要求|macOS, Windows, Linux|macOS, Windows, Linux|
|**核心執行環境**|由 Xcode 處理|**JDK** Java Development Kit|**Node.js**|
|**整合開發環境 IDE**|**Xcode** 數十 GB|**Android Studio** 數十 GB|**VS Code** 輕量級|
|**主要程式語言**|Swift / Objective-C|Kotlin / Java|**JavaScript / TypeScript**|
|**套件/依賴管理器**|**CocoaPods** / Swift PM|**Gradle**|**npm**|
|**UI 框架**|UIKit / SwiftUI|Jetpack Compose / XML|**React Native**|
|**核心開發工具**|Xcode Build System|Android Build System|**Expo SDK & Expo CLI**|
|**打包/編譯工具**|**Xcode 編譯器**|**Gradle**|**Metro** 用於 JS 打包|
|**開發預覽工具**|iOS 模擬器|Android 模擬器|**Expo Go** 手機 App / 模擬器|
|**建置/上架工具**|**Xcode** 手動打包|**Android Studio** 手動打包|**EAS CLI** 雲端自動化服務|

> [!NOTE] 核心概念：抽象化 Abstraction 與 Node.js 的角色
> - Expo 最大的價值在於**抽象化**。它像一個專業的專案經理，將 `Xcode` 和 `Android Studio` 的所有複雜性 例如原生專案設定、編譯流程、憑證管理 都隱藏起來，為開發者提供了一套更簡單、更統一的指令介面 `Expo CLI`。
> - `Node.js` 則是實現這層抽象化的**基礎平台**。因為所有 Expo 的開發工具 `Metro`, `Expo CLI`, `EAS CLI` 本身都是運行在 `Node.js` 環境中的 JavaScript 應用程式。這使得開發者可以從頭到尾都停留在一個熟悉的 JavaScript 生態系中，而不需要頻繁地在三個完全不同的開發環境 JS, Xcode, Android Studio 之間切換。

## 運行階段 - Runtime - iOS vs Android vs ReactNative

當 App 在使用者的手機上啟動並運行時，其內部的 `執行環境 Runtime` 決定了程式碼如何被執行、畫面如何被繪製。不同技術路徑的 App，其 Runtime 機制有著根本性的差異。

> [!NOTE] 核心差異概覽
> - **iOS / Android 原生 App**：各自是一個**單一、直接**的執行體系。程式碼都是對應平台的母語，指令可以直接下達給作業系統。
> - **React Native App**：是一個**雙軌、協同**的執行體系，由 **JavaScript 世界**和**原生世界**同時運作，並透過一座橋樑 Bridge 進行溝通。


|**比較項目**|**iOS 原生 App**|**Android 原生 App**|**React Native App**|
|---|---|---|---|
|**啟動與執行**|**直接執行機器碼**： iOS 系統直接載入並執行由 `Xcode` 的 `編譯器` 從 Swift/Objective-C 預先編譯好的機器碼。|**在 ART 中執行 Bytecode**： Android 系統啟動 **ART Android Runtime** 這個虛擬機，來執行由 Kotlin/Java 預先編譯好的 Bytecode。|**間接啟動 JS 引擎**： 1. 系統先啟動 App 的原生外殼。 2. 外殼接著啟動內建的 **JavaScript 引擎** 通常是 Hermes。 3. JS 引擎再載入並執行 JavaScript `bundle` 檔案。|
|**UI 渲染**|**直接呼叫 UIKit/SwiftUI**： Swift 程式碼直接呼叫 iOS 的原生 UI 框架 UIKit 或 SwiftUI 來繪製 `UIView` 等元件。過程沒有中間人。|**直接呼叫 Android Views/Compose**： Kotlin 程式碼直接呼叫 Android 的原生 UI 框架 傳統的 Views 或現代的 Jetpack Compose 來繪製 `android.view.View` 等元件。|**透過「橋樑」溝通**： JS 中的 `<View>` 會被轉換成一個 JSON 訊息，透過 **Bridge** 從 **JavaScript 世界**傳到**原生世界**。原生端收到訊息後，在 iOS 上呼叫 UIKit 建立 `UIView`；在 Android 上呼叫 Android Views 建立 `android.view.View`。|
|**業務邏輯**|**在原生層執行**： 所有計算都在編譯後的機器碼中運行，直接利用 CPU 效能，速度最快。|**在 ART 中執行**： 所有計算都在 ART 虛擬機中運行，經過高度優化，效能極佳。|**在 JavaScript 引擎中執行**： 所有計算都在 JS 引擎 Hermes 中完成。對於絕大多數業務邏輯，速度都非常快。|
|**原生功能**|**直接呼叫原生框架**： 程式碼直接 `import` 並呼叫 Apple 提供的原生框架 例如 `AVFoundation` 存取相機。|**直接呼叫原生函式庫**： 程式碼直接 `import` 並呼叫 Google 提供的原生函式庫 例如 `android.hardware.camera2` 存取相機。|**透過橋樑請求**： JS 程式碼發送一個打開相機的請求**跨越 Bridge**。原生端的模組收到後，在 iOS 上呼叫 `AVFoundation`，在 Android 上呼叫 `android.hardware.camera2`。|

> [!NOTE] React Native 的核心架構：Bridge (橋樑)
> 
> - React Native 的 `執行環境 Runtime` 核心就是這座 **Bridge**。它是一個訊息傳遞系統，負責在 App 內部的兩個獨立世界 JavaScript 和 原生 之間非同步地來回溝通。
>     
> - 原生 App 的優勢在於**不存在**這個需要來回溝通的 Bridge，因此效能極致。
>     
> - React Native 的優勢在於將**同一套**業務邏輯放在 JavaScript 世界，透過 Bridge 與兩個不同平台 iOS 和 Android 的原生世界溝通，實現跨平台開發。

---

# **Runtime & RuntimeEnviornment**

## **Runtime 運行階段 - 一個時間概念**

**定義：Runtime 運行階段，是指程式碼從靜態的文字檔，轉變為一個在作業系統中正在運作的程序 Process 的整個生命週期。**

### 程式碼的生命週期：

#### 靜態的原始碼 Source Code

- **定義**：指儲存在硬碟上的 `.tsx`、`.swift` 或 `.kt` 等程式碼檔案。
    
- **本質**：在此狀態下，程式碼是**靜態的純文字**。它本身沒有任何行為。
    

#### 運作中的程序 Running Process

- **定義**：當 App 啟動時，作業系統會在記憶體中建立一個正在運作的實體，即為一個程序。
    
- **本質**：**Runtime 就是這個程序從啟動到關閉的整個過程**。在此階段，程式碼是**動態的**，正在被 CPU actively 執行。
    

---

### **Runtime 期間的關鍵活動**

在一個 App 的 Runtime 期間，會發生以下核心活動：

- **指令被執行**：CPU 開始讀取或已被 `編譯器` 翻譯好的指令並執行計算。
    
- **記憶體被管理**：程序會向作業系統申請記憶體空間，用來儲存變數、物件及各種狀態。
    
- **事件被監聽與回應**：程序進入等待迴圈，監聽外部事件 如使用者的觸控點擊、網路傳來的資料等，並根據程式碼邏輯做出回應。
    
- **UI 被渲染與更新**：程序呼叫作業系統的 API，在螢幕上繪製出介面元件，並在狀態改變時更新它們。
    
- **與外部世界互動**：程序透過作業系統提供的 API，去存取硬體 相機、GPS、讀寫檔案或發送網路請求。
    

---

## **Runtime Environment 執行環境 - 一個系統概念**

**定義：Runtime Environment 是支撐程式碼得以經歷其 Runtime 運行階段 所需的完整支援系統。**

如果說 **Runtime** 是舞台上正在上演的話劇本身，那麼 **Runtime Environment** 就是讓這齣話劇得以演出的整個劇院 包含舞台、燈光、音響和後台工作人員。

好的，沒問題。您調整的階層是正確的，只是 Markdown 的縮排和項目符號格式需要統一，才能正確地顯示出巢狀結構。

我已經為您重新整理好格式，您可以直接複製貼上。

---

### 執行環境的兩個核心元件 - 引擎與 API

#### **引擎 Engine：程式碼的執行核心**

- 引擎是執行環境的大腦，其根本職責是**讀取、理解並執行**程式碼。
    
- **對於編譯型語言 例如 Swift, Java**： 在程式進入**運行階段 Runtime** **之前**，`編譯器` 就已將原始碼完整地翻譯成低階**機器碼**。因此，在運行階段，其引擎可以被理解為就是**電腦的 CPU 本身**，直接執行這些預先翻譯好的指令。
    
- **對於直譯或即時編譯語言 例如 JavaScript**： 程式在進入**運行階段 Runtime** 時，仍是高階的程式碼。因此，它需要一個**軟體形式的引擎**來進行即時的翻譯。例如，**V8 引擎**會在運行階段讀取 JavaScript 程式碼，將其轉換成機器碼，再交給 CPU 執行。

##### 編譯器 Compiler

- **定義**：一個專門的翻譯程式。
    
- **輸入**：開發者撰寫的高階程式語言，人類可讀的原始碼，例如 Swift, Java。
    
- **輸出**：電腦中央處理器 CPU 能直接執行的低階機器碼，由 0 和 1 組成。
    

###### 為什麼需要編譯器？

- **語言隔閡**：CPU 無法理解人類撰寫的程式碼。對 CPU 而言，`let name = "Bili"` 只是一串無意義的文字。
    
- **執行需求**：CPU 只看得懂由 0 和 1 組成的特定指令集，也就是機器碼。
    
- **角色**：編譯器就是 bridging this gap 的橋樑，負責將人類的邏輯翻譯成機器的指令。
    

> [!NOTE] 核心功能：程式碼的翻譯與建置
> 
> - **翻譯 (Translate)**：逐行讀取原始碼，分析語法、檢查錯誤，並產生等效的機器碼。
>     
> - **建置 (Build)**：將所有翻譯後的檔案，以及專案所需的其他資源，連結並打包成一個完整的可執行檔 例如 iOS 的 `.app` 或 Windows 的 `.exe`。
>     

#### **API：與外部世界溝通的橋樑**

- API 是執行環境的手腳，它是一系列由環境預先提供的**指令與工具集合**，讓程式碼可以與外部世界互動。
    
- **API 決定了環境的能力**：一個執行環境能做什麼，完全取決於它提供了哪些 API。這也是為什麼同一份 JavaScript 程式碼，在不同環境中會有截然不同的行為：
    
    - **瀏覽器執行環境**：提供 **Web API** 如 `document.getElementById()`，賦予了 JavaScript **控制網頁元素**的能力。
        
    - **`Node.js` 執行環境**：提供 **Node.js API** 如 `fs.readFile()`，賦予了 JavaScript **讀寫電腦檔案**的能力。
        
- 因此，**API 是一個執行環境能力邊界的最終定義者**。

---

# 基礎概念 Fundamental Concepts

## Application, 伺服器 Server & 客戶端 Client

- **Application 應用程式**：一個提供特定功能的獨立軟體。例如文書處理器、小算盤、手機 App 本身。
    
- **客戶端 Client**：**提出要求**的一方。通常是一個帶有使用者介面 UI 的 Application。
    
- **伺服器 Server**：**提供服務**的一方。它本身也是一個 Application，但其核心功能是透過網路回應客戶端的請求。
    

> [!NOTE] 關鍵區別 一個 Application **扮演**伺服器的角色，是因為它透過**網路**提供服務；如果它不這麼做，它就是一個獨立的或客戶端的 Application。



### 核心互動：請求 Request 與 回應 Response

- **請求 Request**：客戶端 Application 發出請求，索取特定資源。
    
- **處理 Process**：伺服器 Application 持續監聽，收到請求後進行處理。
    
- **回應 Response**：伺服器 Application 將處理結果打包成回應，傳回給客戶端。
    

### 關鍵特徵：透過網路溝通的獨立程式

- 客戶端和伺服器是兩個獨立的 Application，常在不同的裝置上運行。
    
- 它們之間唯一的溝通方式是**網路** 例如 Wi-Fi 或 Internet。
    
- 伺服器 Application 通常是無頭 Headless 的，沒有自己的使用者介面。
    

### 具體例子

#### 網頁瀏覽

- **客戶端 Application**：瀏覽器 Chrome, Safari。
    
- **伺服器 Application**：Google 網站主機上運行的後端程式。
    
- **流程**：瀏覽器**請求** `google.com` 的網頁，伺服器**回應**網頁內容。
    

#### React Native 開發

- **客戶端 Application**：手機上的 `Expo Go` App。
    
- **伺服器 Application**：電腦上運行的 `Metro`。
    
- **流程**：`Expo Go` 透過 Wi-Fi **請求**程式碼，`Metro` **回應**打包好的程式碼檔案。

---

## 整合開發環境 IDE vs. 程式碼編輯器 Code Editor

這兩者都是開發者用來寫程式的工具，但它們的設計理念和功能範疇有根本性的不同。



### 整合開發環境 IDE - Integrated Development Environment

- **定義**：一個功能全面、重量級的 All-in-One 開發軟體。
    
- **核心特徵**：
    
    - **內建編譯器與建置系統 Compiler & Build System**：這是 IDE 最關鍵的特徵。它本身就包含了將程式碼轉換成可執行應用程式的所有必要工具。
        
    - **功能整合**：將程式碼編輯、偵錯 Debugging、模擬器、效能分析等所有開發階段的功能，全部整合在一個應用程式中。
        
    - **平台專用性**：通常專為特定的平台或語言生態系設計。
        
- **例子**：
    
    - `Xcode`：專為 Apple 平台 iOS, macOS 開發。
        
    - `Android Studio`：專為 Android 平台開發。

#### 編譯器 Compiler

- **定義**：一個專門的翻譯程式。
    
- **輸入**：開發者撰寫的高階程式語言，人類可讀的原始碼，例如 Swift, Java。
    
- **輸出**：電腦中央處理器 CPU 能直接執行的低階機器碼，由 0 和 1 組成。
    

##### 為什麼需要編譯器？

- **語言隔閡**：CPU 無法理解人類撰寫的程式碼。對 CPU 而言，`let name = "Bili"` 只是一串無意義的文字。
    
- **執行需求**：CPU 只看得懂由 0 和 1 組成的特定指令集，也就是機器碼。
    
- **角色**：編譯器就是 bridging this gap 的橋樑，負責將人類的邏輯翻譯成機器的指令。
    

> [!NOTE] 核心功能：程式碼的翻譯與建置
> 
> - **翻譯 Translate**：逐行讀取原始碼，分析語法、檢查錯誤，並產生等效的機器碼。
>     
> - **建置 Build**：將所有翻譯後的檔案，以及專案所需的其他資源，連結並打包成一個完整的可執行檔，例如 iOS 的 `.app` 或 Windows 的 `.exe`。
>     

### 程式碼編輯器 Code Editor

- **定義**：一個輕量級、專注於文字編輯的工具。
    
- **核心特徵**：
    
    - **專注編輯**：核心功能是提供快速、流暢的程式碼撰寫體驗。
        
    - **不含編譯器**：它本身無法將程式碼轉換成應用程式，而是需要呼叫外部的工具 如 Node.js 或 Xcode 的命令列工具 來完成這項工作。
        
    - **高度可擴充**：透過安裝擴充套件 Extensions，可以增加對不同語言的支援和各種輔助功能。
        
    - **通用性**：天生設計為跨平台，可用於開發幾乎任何語言的專案。
        
- **例子**：
    
    - `VS Code` Visual Studio Code

 
#### 通用程式碼編輯器 Universal Code Editor

##### VS Code Visual Studio Code

- **定義**：一個輕量級、高效能，且專注於**文字編輯**的工具。它是開發者日常撰寫、瀏覽、修改所有專案程式碼的主要工作區。
    
- **核心特徵**：
    
    - **專注編輯**：其首要目標是提供快速、流暢且無干擾的程式碼撰寫體驗。
        
    - **通用性**：天生設計為跨平台（可在 macOS, Windows, Linux 上運行），可用於開發幾乎任何語言的專案。
        
    - **不含編譯器**：VS Code 本身無法將程式碼轉換成可執行的應用程式。它透過內建的終端機 (Terminal)，去呼叫並執行外部的工具（例如 `Node.js` 或 `Xcode` 的命令列工具）來完成編譯與建置的工作。
        
    - **高度可擴充**：這是 VS Code 最強大的特點。它本身很輕巧，但可以透過安裝「擴充套件」來無限擴展其功能。
        


##### VS Code 擴充套件 Extensions

- **定義**：這些是安裝在 VS Code 應用程式上的外掛程式。
    
- **核心目的**：它們的目的是賦予 VS Code **理解**特定程式語言和框架的能力，將其從一個普通的文字編輯器，轉變為一個智慧的開發環境。
    
- **具體功能**：
    
    - **語法顏色與自動完成**：讓 VS Code 看得懂 `.tsx` 語法，為不同程式碼上色，並提供智慧的程式碼提示。
        
    - **程式碼排版**：例如 `Prettier` 套件，可以在您存檔時自動將程式碼排版整齊。
        
    - **錯誤檢查**：即時檢查程式碼中是否有明顯的語法錯誤或潛在問題，並畫上底線。
        

> [!NOTE] 核心關係：工作檯與工具配件
> 
> - `VS Code` 就像一個**萬用工作檯**，提供了最基礎的工作空間。
>     
> - **擴充套件** 則像是您為這個工作檯添購的各式專用工具配件 鑽頭、量尺、夾具，讓它能勝任更專業、更複雜的工作。
>     
> - 重要的是，這些擴充套件純粹是**輔助開發者的工具**，它們**不會**被打包進您最終的 App 成品中。

---

## 開發環境的基石 The Foundation

### Node.js：JavaScript 的心臟

#### 執行環境 Runtime Environment

- **普遍定義**：一個能讓特定程式語言的程式碼成功運行的完整支援系統。
    
- **必要組成**：任何一個執行環境，都必須包含兩個核心元件：
    
    - **引擎 Engine**：負責讀取、理解、並執行程式碼的大腦。
        
    - **一組可用的 API Application Programming Interface**：由環境提供的一系列預先寫好的工具或指令，讓程式碼能與外部世界 如作業系統、網路、硬體 互動的手腳。
        


#### 將概念應用於 JavaScript

- **JavaScript 的執行環境**也遵循這個規則，它必須由 **JavaScript 引擎** 和 **一組 API** 構成。
    
- **JavaScript 引擎**是固定的，例如 V8 引擎。
    
- 但**搭配的 API** 是可變的，這也導致了 JavaScript 有兩種截然不同的執行環境。
    

##### 1. 瀏覽器執行環境 Browser Runtime

- **引擎**：V8 在 Chrome 中 或其他。
    
- **搭配的 API**：**Web API**。這是一套專門用來控制**網頁**的工具，例如：
    
    - `document`：用來操作網頁上的 HTML 元素。
        
    - `window`：代表整個瀏覽器視窗。
        
- **結果**：在這個環境下，JavaScript 是一個**前端**語言，專門用來打造互動式的網頁。
    

##### 2. Node.js 執行環境 Node.js Runtime

- **引擎**：同樣是 **V8**。Node.js 的創作者將 V8 引擎從 Chrome 瀏覽器中獨立出來。
    
- **搭配的 API**：**Node.js API**。創作者為獨立的 V8 引擎，編寫了一套**全新的 API**，這套 API 的目的是用來控制**電腦作業系統**。例如：
    
    - `fs File System`：用來讀寫電腦硬碟上的檔案。
        
    - `http`：用來建立網路伺服器。
        
- **結果**：在這個環境下，JavaScript 是一個**後端/系統**語言，可以用來開發伺服器、管理檔案、運行開發工具。
    

#### 最終定義：Node.js

基於以上的解構，我們可以得出 Node.js 的精確定義：

- **Node.js 是一個 JavaScript 的執行環境 Runtime Environment。它將 Google 的 V8 引擎與一套專為伺服器和系統層級操作而設計的 API Node.js API 相結合，使得 JavaScript 這門語言得以首次脫離瀏覽器，直接在電腦作業系統上運行，從而具備了開發後端應用與系統工具的能力。**
    

> [!NOTE] 核心公式 **Node.js = V8 引擎 + 一套全新的 OS API**
> 
> 這個組合創造了一個全新的、非瀏覽器的 JavaScript 執行場域。所有 React Native 的開發工具，都是在這個場域中運行的應用程式。
