# 廣告追蹤與歸因

## 角色定位

追蹤設定不正確，廣告費等同在黑暗中燒。理解追蹤碼的工作原理，才能設計出站方需要的後台功能，以及確認串接是否正確。

---

## 兩種追蹤方案

### Client-Side 追蹤

- 追蹤代碼跑在玩家的瀏覽器端
- 玩家完成特定行為時，瀏覽器直接向 Meta 等廣告平台發送事件
- 優點：實作簡單，標準化程度高
- 缺點：Ad Blocker 和瀏覽器隱私設定可能阻擋追蹤，導致數據丟失

### Server-Side 追蹤

- 追蹤事件由後端伺服器直接發送給廣告平台，不依賴瀏覽器
- 優點：不受 Ad Blocker 影響，數據更完整
- 缺點：實作複雜，需要正確傳遞用戶識別資訊才能準確歸因

業界建議兩者並行，Server-Side 為主、Client-Side 補充，利用 eventID 去重，避免同一個事件被計算兩次。

---

## 核心識別參數

### Pixel ID

- Meta 廣告帳號的識別碼，用來告訴 Meta 這個事件歸屬於哪個廣告帳戶
- 站方可能同時與多個廣告商合作，每個廣告商有不同的 Pixel ID
- 同一個頁面可以同時初始化多個 Pixel ID

### Click ID

- 玩家從廣告點擊進入落地頁時，Meta 在 URL 上附加的參數，通常是 fbclid
- 用來追蹤這個玩家是從哪個廣告來的
- Click ID 有時效性，需要在玩家完成轉換前完成歸因

---

## Meta Pixel 的實作邏輯

### 基本安裝

- 將 Pixel 基本代碼加入網站每個頁面的 `<head>` 區塊
- 基本安裝後，Pixel 會自動追蹤頁面造訪和網域

### 標準事件

常見的標準事件和博弈平台的對應場景：

- PageView：玩家到達任意頁面
- CompleteRegistration：玩家完成帳號註冊
- Purchase：玩家完成首次存款

觸發標準事件時，如果同時使用 Server-Side 追蹤，要加上 eventID 參數，讓兩端的重複事件可以被識別和去重。

### 多 Pixel 管理

當同一個頁面需要同時使用多個 Pixel ID 時，有兩種處理方式：

```javascript
// 方案一：分開 init，後續 track 會對兩個 Pixel 都觸發
fbq('init', 'PIXEL-A');
fbq('init', 'PIXEL-B');
fbq('track', 'PageView'); // 同時觸發 A 和 B

// 方案二：用 trackSingle 精確控制，只觸發指定 Pixel
fbq('trackSingle', 'PIXEL-A', 'Purchase', { value: 100, currency: 'TWD' });
fbq('trackSingleCustom', 'PIXEL-B', 'CustomEvent', {});
```

方案一適合大多數事件都要對所有 Pixel 觸發的情境。
方案二適合需要精確控制某個事件只發給特定廣告商的情境。

---

## 後台設定需求

### Pixel ID 管理

- 後台要能設定一個或多個 Pixel ID
- 可以設定主要 Pixel ID，在多個 Pixel ID 中選一個作為主要歸因來源
- 不同代理可以對應不同的 Pixel ID

### 玩家流程中的追蹤邏輯

**登入前**

- 後台有設定 Pixel ID 時，將所有 Pixel ID 塞進 Cookie
- URL 的 querystring 有 Pixel ID 時，優先使用 querystring 的值
- 沒有 querystring 時，查 Cookie，選取最後更新的或後台設定為主要的
- 初始化：Cookie 有幾組 Pixel ID 就 init 幾組
- 換頁時不清除 querystring，確保 Pixel ID 在整個使用流程中傳遞

**玩家註冊時**

- 記錄玩家的 Pixel ID
- querystring 有值時用 querystring 的值
- 後台有設定主要 Pixel ID 時，記錄主要的那個

**登入後**

- 查詢玩家帳號記錄的 Pixel ID 和 Click ID
- 前端已有值和後端值不一樣時，兩組都發送事件
- 在送出 PageView 事件之前先向後端確認正確的 ID

---

## 歸因問題的常見情境

**Meta 廣告連結不允許設定跳轉連結**

- 部分廣告格式不支援帶參數的落地頁 URL
- 導致 Click ID 無法從廣告連結傳遞到落地頁
- 解法：使用 Meta 的 Conversions API，透過 Server-Side 補充歸因資訊

**玩家在不同裝置上操作**

- 玩家在手機看廣告，在電腦完成註冊
- Click ID 在手機端記錄，電腦端沒有
- 解法：依賴帳號登入狀態跨裝置傳遞識別資訊

---

## PM 需要確認的串接要點

- Pixel 基本代碼是否安裝在所有頁面
- 關鍵事件是否有正確觸發，用 Meta Pixel Helper 瀏覽器擴充功能確認
- Server-Side 和 Client-Side 的事件是否有設定 eventID 去重
- Click ID 是否在玩家整個流程中正確傳遞，不在換頁時丟失
- 多個 Pixel ID 的情境下，init 邏輯是否正確
- 玩家完成首存時，Purchase 事件是否有正確觸發，以及帶上正確的金額
