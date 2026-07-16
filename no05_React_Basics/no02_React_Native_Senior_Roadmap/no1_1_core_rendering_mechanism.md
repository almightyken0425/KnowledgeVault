# 核心渲染理論與跨平台機制

## 角色定義

- **React:** 應用程式的**大腦與決策引擎**。它負責管理狀態、運算邏輯，並決定畫面應該長什麼樣子產生 Virtual DOM，但它本身**沒有能力**在螢幕上畫出任何像素。
- **React Native:** 應用程式的**首席翻譯官與外交部長**。它負責接收 React 產生出來的藍圖，並即時翻譯成 iOS 與 Android 作業系統聽得懂的語言，指揮各自系統的原生畫筆將畫面畫出來。

## 運作邏輯 跨平台開發環境

### 為什麼一套代碼可以跑在雙平台？
傳統原生開發中，iOS 工程師寫 Swift 呼叫 `UIView`，Android 工程師寫 Kotlin 呼叫 `android.view.View`。

React Native 的核心突破，在於建立了一套**非同步通訊橋樑 The Bridge** 與新的 **Fabric 渲染架構**。我們在 JavaScript 層撰寫的代碼，實際上是透過這座橋樑，發送建造指令給原生底層。

### 關鍵指令溯源與生成 The Render Pipeline

這就是 JSX 從代碼變成螢幕畫素的完整生命週期：

- **開發者層 JSX 輸入:**
   開發者輸入 `<View style={{ width: 100 }} />`
- **編譯層 Babel 轉換:**
   JSX 被轉換為純 JavaScript 函式呼叫 `React.createElement(View, { style: { width: 100 } })`
- **邏輯層 Virtual DOM:**
   React 接收後建立一個輕量級的 JavaScript 物件，描述這個視圖的樣貌。
- **通訊層 The Bridge 或是 Fabric:**
   這個物件結構被序列化成 JSON 或是透過 C++ JSI 直接呼叫，傳遞給原生層。例如發送指令：`["UIManager", "createView", [nodeId, "RCTView", rootId, {width: 100}]]`
- **原生實作層 Native Layout:**
   - **iOS 接手:** 收到指令，實例化出一個真正的 Objective-C `UIView`。
   - **Android 接手:** 收到指令，實例化出一個真正的 Java `ViewGroup`。
- **顯示層 Screen Pixels:**
   系統 GPU 將這些原生 View 渲染成螢幕上你看得到的像素。

> **結論:** 我們在寫的從來就不是在螢幕上畫圖，我們是在寫給翻譯官的藍圖指示。

## 結構規範 JSX 編寫規則

### 為什麼要用 JSX？
JSX 是一種在 JavaScript 中直接寫出類似 HTML 結構的語法擴充。
**設計動機:** 因為 UI 的呈現本來就是階層式樹狀的，如果全用純 JS `createElement` 函式層層包疊會難以閱讀，JSX 將視覺結構與邏輯結合在一起。

### React VS React Native 核心渲染差異

最常見的新手錯誤，就是在 React Native 裡面使用了網頁開發的 HTML 標籤。

| 特性         | Web 也就是 React DOM                      | Mobile 也就是 React Native                                      |
| :----------- | :---------------------------------------- | :-------------------------------------------------------------- |
| **底層引擎** | 瀏覽器 Browser Engine                     | 行動裝置原生系統 iOS 或是 Android                               |
| **容器元件** | `<div>`, `<span>`, `<section>` 等網頁標籤 | 取代為 `<View>`、`<SafeAreaView>` 等原生映射元件                |
| **文字元件** | `<p>`, `<h1>`, `<span>`                   | 必須且只能包裹在單一 `<Text>` 中                                |
| **點擊互動** | `<button onClick={...}>`                  | `<TouchableOpacity onPress={...}>` 等觸控元件                   |
| **樣式系統** | CSS 檔案或 Inline CSS，支援所有 CSS3 屬性 | JavaScript StyleSheet 物件，支援彈性佈局 Flexbox 的**特定子集** |

### 邊界清晰化與錯誤預防

- **必須 Must:** 所有的純文字都必須被 `<Text>` 包裹。若有文字裸露在 `<View>` 中，程式將直接崩潰。
- **必須 Must:** JSX 的根層級 Return 的最外層**只能由一個元件包裝**。若需回傳多個平等的區塊，必須使用 Fragment `<>...</>` 包裹。
- **禁止 Must Not:** 嚴禁使用 `-` kebab-case 定義樣式屬性，所有的 CSS 屬性在 React Native 皆被轉換為 CamelCase 例如 `backgroundColor` 而非 `background-color`。

## 邏輯演示 Demo Code

這是一段整合上述規則，符合 React Native 要求的基礎 JSX 結構：

```javascript
import React from 'react';
# 1. 協議層: 必須從 react-native 引入原生層映射元件
import { View, Text, StyleSheet } from 'react-native';

export default function WelcomeScreen() {
  # 2. 應用層: 遵循 JSX 規則，最外層只允許單一入口
  return (
    <View style={styles.container}>
      {/* 3. 錯誤預防: 文字必須在 Text 元件內 */}
      <Text style={styles.title}>歡迎進入 React Native</Text>
      
      {/* 4. 結構拆解: 透過 View 進行彈性佈局分組 */}
      <View style={styles.card}>
        <Text>這是用原生元件渲染出來的卡片！</Text>
      </View>
    </View>
  );
}

# 5. 編譯時定義: 樣式採用 CamelCase JSON 格式，不支援傳統 CSS 單位
const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 24, // 數值在 RN 中代表 dp Density-independent Pixels 
    fontWeight: 'bold',
    marginBottom: 20,
  }
});
```
