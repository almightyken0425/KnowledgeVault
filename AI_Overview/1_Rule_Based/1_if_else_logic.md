# Rule-Based Logic: 決定論 AI

這是人工智慧的最原始形式，甚至常被認為 **不是 AI**。但它是現代軟體工程的基石，也是理解 Machine Learning 的重要對照組。

核心概念是 **決定論 Determinism**：
> 給定相同的輸入，永遠產生相同的輸出。沒有機率，沒有猜測，沒有黑盒子。

## 核心架構

最常見的形式就是 **If-Else 敘述** 或 **決策樹 Decision Tree**。

### 程式碼表示

```javascript
// 規則由人類專家 寫死 Hardcoded
function decideAction(temperature, isRaining) {
    if (isRaining) {
        return "Take Umbrella";
    } else if (temperature > 30) {
        return "Turn on AC"; // 規則 1
    } else {
        return "Open Window"; // 規則 2
    }
}
```

### 視覺化 Flowchart

```
      Start
        │
   [Is Raining?] ── Yes ──> [Take Umbrella]
        │
        No
        │
 [Temp > 30°C?] ── Yes ──> [Turn on AC]
        │
        No
        │
        ▼
  [Open Window]
```

## 與 Machine Learning 的決定性差異

| 特性             | Rule-Based If-Else          | Machine Learning                  |
| :--------------- | :-------------------------- | :-------------------------------- |
| **邏輯來源**     | **人類** 由工程師撰寫規則   | **數據** 由模型自行從歷史資料歸納 |
| **維護方式**     | 修改程式碼 重寫 If          | 重新訓練 餵入新數據               |
| **處理未見情況** | **崩潰** Undefined Behavior | **泛化** 根據機率猜測最可能的結果 |
| **透明度**       | **白箱** 完全透明           | **黑箱** 難以解釋權重意義         |

## 優缺點分析

### 優點 Pros
1.  **可解釋性 Explainability:** 100% 透明。銀行審核貸款如果拒絕你，Rule-Based 系統可以精確告訴你是因為 **年收入 < 50萬**。
2.  **絕對控制:** 不會有 **AI 幻覺** 或種族歧視問題，除非規則本身就是歧視的。
3.  **效能極致:** 運算極快，通常只是幾個 CPU 指令，不需要 GPU。

### 缺點 Cons
1.  **維護災難:** 當變數從 2 個變成 2000 個，If-Else 會變成無法維護的 **義大利麵條代碼 Spaghetti Code**。
2.  **無法處理感知問題:** 你無法寫出一組 If-Else 規則來定義 **什麼是貓**，例如貓有耳朵？狗也有。貓有鬍鬚？老鼠也有。
3.  **零適應性:** 環境一變，例如溫度單位從攝氏變華氏，規則全毀。

## 適用場景 Use Cases

這類系統在需要 **高精確度** 與 **零容錯** 的領域仍然是霸主：

- **金融核心交易:** `if (balance < amount) reject()`。
- **權限控管 RBAC:** `if (user.role !== 'admin') deny()`。
- **稅務計算:** 依照法律條文逐條執行的邏輯。
