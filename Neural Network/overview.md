# 神經網路內部運算：開發者視角

這份指南將數學公式 $y = f(Wx + b)$ 轉譯為程式碼邏輯。

核心概念是將神經網路視為一個巨大的 **狀態機 State Machine**：

- **權重** $w$ **與偏差** $b$ 是這個物件內部的 **State 狀態**。
- **輸入** $x$ 是函數的 **Arguments 參數**。
- **訓練 Training** 是不斷呼叫函數來 **更新 Write** 內部的 State。
- **推論 Inference** 是呼叫函數來 **讀取 Read** 內部的 State 並產出結果。

## 資料結構定義 Data Structures

---

在深度學習 Deep Learning 中，我們不再只有一組權重，而是有多組權重組成 **層 Layers**。

- **層 Layer**
    - **概念:** 這是一個容器，包含了一組神經元。
    - **結構:** 每一層都有自己的 `weights` 權重矩陣 和 `biases` 偏差陣列。
    - **深度 Depth:** 指的是這個 `Layers` 陣列的長度。長度越長，網路越深。
- **權重 Weights - 矩陣視角**
    - **型態:** `Array<Array<Float>>` 二維陣列/矩陣
    - **意義:** 第 $i$ 層的權重決定了如何將上一層的資訊轉換到下一層。
- **輸入/輸出流 Data Flow**
    - **Input Layer:** 原始資料，如圖片像素。
    - **Hidden Layers:** 中間層，負責提取特徵，如線條 -> 形狀 -> 物體。
    - **Output Layer:** 最終結果，如機率值。

## 核心函數庫 Core Functions

---

這是神經網路運作的基礎工具函式，訓練與推論都會共用這些邏輯。

### 矩陣運算 Matrix Operation

單層神經網路只做一次內積，多層神經網路則是做矩陣乘法。

- **函數簽名:** `processLayer(inputs, layerWeights, layerBiases)`
- **邏輯:**
    - 輸入是一個向量 $x$，例如 100 個特徵。
    - 這一層有 $N$ 個神經元，例如 50 個。
    - 每個神經元都跟輸入向量做一次 `dotProduct`。
    - **結果:** 產生一個長度為 50 的新向量 New Features。

### 激活函數 Activation Function

負責引入非線性邏輯的開關。

- **函數簽名:** `relu(value)`
- **邏輯:**
    - `if (value > 0) return value`
    - `else return 0`

## 運作流程：訓練模式 Training Mode

---

這是學習的過程，目的是找出最佳的 $w$ 和 $b$。

### 步驟一：前向傳播 Forward Propagation

- **接力賽機制:**
    - $Layer_1$ 的輸出 $\rightarrow$ 變成 $Layer_2$ 的輸入。
    - $Layer_2$ 的輸出 $\rightarrow$ 變成 $Layer_3$ 的輸入。
    - ... 直到最後一層。
- **Output:** Final Prediction

### 步驟二：計算損失 Calculate Loss

- 確認預測結果與正確答案差多少。
- **Input:** Prediction, True Label
- **Output:** Error Loss

### 步驟三：計算梯度 Backpropagation

這是訓練中最複雜但也最核心的演算法，本質是微積分中的 **連鎖律 Chain Rule** 的程式實作。

- **反向迴圈 Backward Loop:**
    - 程式從最後一層 Last Layer 開始，使用 `for` 迴圈倒著走到第一層。
    - **邏輯:** 要修正第 $i$ 層的錯誤，必須先知道第 $i+1$ 層回傳了多少誤差。
- **關鍵運算 1：誤差回傳 Error Propagation**
    - **目的:** 計算這一層的輸出對最終誤差貢獻了多少。
    - **程式邏輯:** `CurrentLayerError = NextLayerError * Weights_Transposed`。
    - **轉置矩陣 Transpose:** 這裡必須將權重矩陣轉置，$3 \times 2$ 變 $2 \times 3$，才能將誤差從寬度維度推回到高度維度。
- **關鍵運算 2：激活函數導數 Activation Derivative**
    - **目的:** 還原開關的影響。如果前向傳播時 ReLU 輸出為 0 開關關閉，則該神經元不應傳遞任何梯度。
    - **程式邏輯:** `if (Output <= 0) Gradient = 0` else `Gradient = CurrentLayerError`。
- **關鍵運算 3：計算權重梯度 Compute Gradients**
    - **目的:** 算出這一層的 $w$ 具體該加多少或減多少。
    - **程式邏輯:** `WeightGradient = Input_Transposed * Delta`。這裡的 Input 是指前向傳播時，上一層傳給我的值。
- **Output:** `Gradients` 包含每一層的 `weight_grad` 和 `bias_grad`。

### 步驟四：更新權重 Update

- 修改每一層的內部 State。

## 運作流程：推論模式 Inference Mode

---

這是模型上線使用的過程，例如：使用者在 App 中上傳一張圖片，AI 回傳結果。結構比訓練簡單非常多。

### 關鍵特徵

- **結構簡化:** 只執行前向傳播。
- **資源需求:** 因為不需要計算梯度 Gradient 也不需要儲存中間產物，記憶體消耗極低。
- **輸入差異:** 只有 $x$ 使用者輸入，沒有 Label 因為我們不知道答案。

### 執行步驟

- **步驟一：載入模型 Load State**
    - 讀取整個 `Layers` 結構，包含多層的 $w$ 和 $b$。
- **步驟二：多層前向傳播 Multi-Layer Forward**
    - `CurrentData = UserInput`
    - `For each Layer in Model:`
        - `CurrentData = processLayer(CurrentData, Layer)`
        - `CurrentData = Activation(CurrentData)`
    - 將計算結果不斷傳遞給下一層
- **步驟三：輸出結果 Output**
    - 迴圈結束後的 `CurrentData` 就是最終預測。

## 虛擬程式碼實作 Pseudo-code

---

以下代碼展示了 **深度神經網路 Deep Neural Network** 的推論引擎實作。

```
// --- 多層模型結構 (Deep Model Artifact) ---
// 這裡展示一個 3 層的神經網路
const SAVED_MODEL = {
    layers: [
        // 第一層 (Hidden Layer 1): 把 100 個特徵變成 50 個特徵
        { weights: [[...], ...], bias: [...] },

        // 第二層 (Hidden Layer 2): 把 50 個特徵變成 10 個特徵
        { weights: [[...], ...], bias: [...] },

        // 第三層 (Output Layer): 把 10 個特徵變成 1 個結果 (例如：是貓的機率)
        { weights: [[...], ...], bias: [...] }
    ]
};

// --- 深度推論引擎 ---
class DeepInferenceEngine {
    constructor(modelData) {
        this.layers = modelData.layers;
    }

    // 單一神經元的運算
    dotProduct(inputs, neuronWeights) {
        let sum = 0;
        for (let i = 0; i < inputs.length; i++) {
            sum += inputs[i] * neuronWeights[i];
        }
        return sum;
    }

    activation(z) {
        return Math.max(0, z); // ReLU
    }

    // --- 處理單一層 (Process Single Layer) ---
    // 這就是「矩陣運算」的邏輯版
    runLayer(inputs, layerConfig) {
        let layerOutputs = [];

        // 這一層有幾個神經元，就跑幾次
        // 例如 Layer 1 有 50 個神經元，這裡會產生 50 個新數值
        for (let neuronWeights of layerConfig.weights) {
            let z = this.dotProduct(inputs, neuronWeights);
            z += layerConfig.bias; // 簡化寫法，假設 bias 對應單一神經元
            layerOutputs.push(this.activation(z));
        }

        return layerOutputs;
    }

    // --- 推論主程式 (The Loop) ---
    predict(userInput) {
        // 1. 初始化：目前的數據就是使用者的原始輸入
        let currentData = userInput;

        // 2. 接力賽迴圈：一層一層往下傳
        for (let i = 0; i < this.layers.length; i++) {
            // 將上一層的 currentData 丟進去算，得到新的 currentData
            currentData = this.runLayer(currentData, this.layers[i]);
        }

        // 3. 迴圈結束，最後手上的 currentData 就是最終答案
        return currentData;
    }
}

// --- 使用範例 ---
const aiEngine = new DeepInferenceEngine(SAVED_MODEL);
const userPhotoFeatures = [0.5, -0.2, ...]; // 原始 100 維特徵

// 數據流動：100維 -> 50維 -> 10維 -> 1維
const result = aiEngine.predict(userPhotoFeatures);

```
