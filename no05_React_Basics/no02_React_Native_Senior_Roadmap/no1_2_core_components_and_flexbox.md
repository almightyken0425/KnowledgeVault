# 核心基礎元件與 Flexbox 佈局

## 角色定義

- **基礎元件 Core Components:** 應用程式的**積木**。React Native 提供了最基礎、不帶任何商業邏輯的預設積木，例如裝東西的箱子 `<View>`、印字的白紙 `<Text>`、相框 `<Image>`。
- **Flexbox 佈局:** 應用程式的**空間規劃師**。它決定了這些積木在螢幕上要怎麼排列、對齊、以及分配剩下的空間。

## 運作邏輯 核心基礎元件

傳統網頁開發有上百種 HTML 標籤，例如 `div`, `span`, `p`, `img` 等，但在 React Native 中，我們通常只需要認識最核心的 3 個基礎元件，就能建構出 90% 的 UI 結構。

### 關鍵元件溯源追蹤

| 來源 JSX 標籤 | Web 對應 參考用   | 核心職責                                                                                      | 關鍵屬性                 | 原生實體化目標                             |
| :------------ | :---------------- | :-------------------------------------------------------------------------------------------- | :----------------------- | :----------------------------------------- |
| `<View>`      | `<div>`           | 作為**容器**，可以用來群組化其他元件、切割版面或加上背景顏色。本質上是為了 Flexbox 排版而生。 | `style`                  | iOS: `UIView`<br>Android: `ViewGroup`      |
| `<Text>`      | `<p>` 或 `<span>` | 渲染並**顯示文字**。所有非標籤內的文字都**必須**包在 `<Text>` 內，支援字體樣式設定。          | `style`, `numberOfLines` | iOS: `UITextView`<br>Android: `TextView`   |
| `<Image>`     | `<img>`           | **載入圖片**。支援從本地專案 `require('./a.png')` 或遠端網路 `{uri: '...'}` 載入。            | `source`, `resizeMode`   | iOS: `UIImageView`<br>Android: `ImageView` |

## 結構規範 Flexbox 排版策略

### 為什麼使用 Flexbox？
在手機開發中，我們會遇到成千上萬種不同尺寸與比例的螢幕。
**設計動機:** Flexbox 彈性方塊是一種一維的版面配置模型。我們不需要寫死元件在螢幕上的 X 座標和 Y 座標，而是告訴系統這些元件之間的對齊關係，讓系統在不同的螢幕上彈性適應。

### React Native Flexbox 與 Web CSS 的關鍵差異

雖然概念相同，但 React Native 的 Flexbox 規則有些微不同，這是最常踩雷的地方：

- **預設主軸 Main Axis 不同:**
   - Web 預設的 `flexDirection` 是 `row` 橫向由左至右排。
   - **React Native 預設的 `flexDirection` 是 `column` 直向由上至下排。**
- **預設佔用空間不同:**
   - Web 預設高度是由內容撐開。
   - React Native 預設的容器如果要填滿剩下的所有空間，需要明確指定 `flex: 1`。
- **沒有 CSS Grid 支援:**
   - 在 React Native 的 StyleSheet 中，佈局完全依賴 Flexbox，不支援 CSS Grid 或 Float 等傳統網頁佈局。

### 邊界清晰化與排版原則

- **主軸 Main Axis 與 交叉軸 Cross Axis:**
  - 主軸由 `flexDirection` 決定 定義 `row` 或 `column`。
  - 交叉軸永遠與主軸**垂直**。
- **對齊分配:**
  - `justifyContent`: 負責子元件在**主軸**上的排列與分配剩餘空間 例如置中、均分。
  - `alignItems`: 負責子元件在**交叉軸**上的對齊方式 例如靠上、置中。
- **推薦 Should:**
  - 建議將排版邏輯 Flexbox 定義在 `StyleSheet` 內建構，不要將大量樣式直接寫在 Inline Style 中，避免每次渲染都重新產生新的樣式物件。

## 邏輯演示 Demo Code

這是一段示範如何運用 `<View>`, `<Text>`, `<Image>` 以及 `Flexbox` 建立一張 **使用者資訊卡片** 的標準案例：

```javascript
import React from 'react';
# 1. 協議層: 從 react-native 抽取核心元件與樣式構造器
import { View, Text, Image, StyleSheet } from 'react-native';

export default function UserProfileCard() {
  # 2. 結構層: 善用 View 分割版面
  return (
    <View style={styles.cardContainer}>
      {/* 左側: 大頭貼相框 */}
      <Image 
        style={styles.avatar} 
        source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }} 
        resizeMode="cover"
      />
      
      {/* 右側: 資訊文字區塊 */}
      <View style={styles.infoContainer}>
        <Text style={styles.nameText} numberOfLines={1}>React Native 開發者</Text>
        <Text style={styles.bioText}>準備邁向 Senior 之路</Text>
      </View>
    </View>
  );
}

# 3. 樣式層: 使用 StyleSheet.create 集中管理佈局
const styles = StyleSheet.create({
  cardContainer: {
    # 改變主軸方向: 我們希望頭像和文字是呈水平左右排列的
    flexDirection: 'row',
    
    # 交叉軸對齊: 在垂直方向上，兩者居中對齊
    alignItems: 'center',
    
    # 增加內距、背景色與陰影來營造卡片感
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginHorizontal: 20,
    marginVertical: 10,
    elevation: 3, // Android 陰影
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30, // 圓形巧思：圓角設為長寬的一半
  },
  infoContainer: {
    # 要求此區塊佔滿剩下的所有水平空間
    flex: 1,
    marginLeft: 16, // 左邊界，拉開與大頭貼的距離
    # 這個內部 View 的主軸方向保持預設的 'column' (上下排列兩行字)
    justifyContent: 'center',
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  bioText: {
    fontSize: 14,
    color: '#666666',
  }
});
```
