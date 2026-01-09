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
以下將神經網路的實體結構由小到大，從概念到程式碼邏輯逐一解析。

### 神經元節點 Neuron Node

- **概念:** 神經元並非獨立物件，它是針對上一層所有輸入的一組評分標準。
- **型態:** `Array<Float>` 一維陣列/向量
- **語意:** 陣列長度等於上一層傳來的特徵數量。
- **程式碼表示:**
    ```javascript
    const node1Weights = [w11, w12, w13]; // 長度 = 上一層特徵數
    const node2Weights = [w21, w22, w23];
    ```

### 權重矩陣 Weights Matrix

- **概念:** 當多個神經元並聯運算時，它們組成一個二維陣列。
- **型態:** `Array<Array<Float>>` 二維陣列/矩陣
- **意義:** 第 $i$ 層的權重決定了如何將上一層的資訊轉換到下一層。
- **維度解讀:** 假設形狀為 N 乘 M。
    - **N 代表橫列 Rows:** 代表這一層有 N 個神經元 Nodes。
    - **M 代表直行 Columns:** 代表上一層傳來了 M 個特徵 Inputs。
    - **直觀理解:** 矩陣的每一列 Row 就是一個神經元，它包含了一組針對所有輸入的評分標準。
- **程式碼表示:**
    ```javascript
    const weightsMatrix = [
        node1Weights, // 橫列 Row 0
        node2Weights  // 橫列 Row 1
    ];
    ```

### 層 Layer

- **概念:** 這是一個容器，包含了一組神經元。
- **結構:** 每一層都有自己的 `weights` 權重矩陣 和 `biases` 偏差陣列。
- **深度 Depth:** 指的是這個 `Layers` 陣列的長度。長度越長，網路越深。
- **程式碼表示:**
    ```javascript
    const layer1 = {
        weights: weightsMatrix,
        biases: [b1, b2] // 每個神經元分配一個偏差
    };
    ```

### 神經網路 Neural Network Model

- **概念:** 數據依照陣列索引順序傳遞，形成多層接力的計算流程。
- **資料流 Data Flow:**
    - **Input Layer:** 原始資料，如圖片像素。
    - **Hidden Layers:** 中間層，負責提取特徵，如線條 -> 形狀 -> 物體。
    - **Output Layer:** 最終結果，如機率值。
- **程式碼表示:**
    ```javascript
    const neuralNetwork = [layer1, layer2, layer3];
    ```

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

## 核心操作 Core Operations

---

神經網路的所有行為都由以下四個基本操作組成。這些操作是獨立且可複用的邏輯單元。

### 前向傳播 Forward Propagation

- **目的:** 將輸入數據透過網路層層轉換，產出預測結果。
- **接力賽機制:**
    - $Layer_1$ 的輸出 $\rightarrow$ 變成 $Layer_2$ 的輸入。
    - $Layer_2$ 的輸出 $\rightarrow$ 變成 $Layer_3$ 的輸入。
    - 重複此過程直到最後一層。
- **輸入與輸出:**
    - **Input:** 原始數據 $x$
    - **Output:** 最終預測 Final Prediction

### 計算損失 Calculate Loss

- **目的:** 量化預測結果與正確答案的差距。
- **邏輯:** 使用損失函數評估誤差大小。
- **輸入與輸出:**
    - **Input:** Prediction, True Label
    - **Output:** Error Loss 誤差數值

### 反向傳播 Backpropagation

這是訓練中最複雜但也最核心的演算法，本質是微積分中的 **連鎖律 Chain Rule** 的程式實作。

- **目的:** 計算每一層權重對最終誤差的貢獻程度。
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
- **輸入與輸出:**
    - **Input:** Loss 誤差值, Cached Layer Outputs 前向傳播時的緩存
    - **Output:** `Gradients` 包含每一層的 `weight_grad` 和 `bias_grad`

### 更新權重 Update Weights

- **目的:** 根據梯度調整權重和偏差，使模型逐步改進。
- **邏輯:** 將權重往梯度的反方向移動一小步。
- **程式公式:** `w = w - learning_rate * gradient`
- **輸入與輸出:**
    - **Input:** Gradients 梯度, Learning Rate 學習率
    - **Output:** 更新後的模型權重

## 運作模式 Operation Modes

---

神經網路有兩種主要運作模式，它們使用不同的核心操作組合來達成不同的目的。

### 訓練模式 Training Mode

- **目的:** 調整權重參數，使模型學會如何預測。
- **執行流程:**
    - 前向傳播 Forward Propagation
    - 計算損失 Calculate Loss
    - 反向傳播 Backpropagation
    - 更新權重 Update Weights
- **必要輸入:**
    - **數據 Data:** 訓練樣本，例如圖片。
    - **標籤 Label:** 正確答案，例如「這是貓」。
- **資源需求:**
    - **記憶體:** 高。需要緩存每一層的輸出供反向傳播使用。
    - **運算量:** 高。需要執行完整的四個步驟。
- **迴圈執行:** 通常重複執行數千到數萬次，每次都更新權重。

### 推論模式 Inference Mode

- **目的:** 使用已訓練好的模型進行預測。
- **執行流程:**
    - 前向傳播 Forward Propagation
- **必要輸入:**
    - **數據 Data:** 使用者輸入，例如一張新照片。
    - **無需標籤:** 因為我們不知道答案，這正是要預測的目標。
- **資源需求:**
    - **記憶體:** 低。不需要緩存中間值。
    - **運算量:** 低。只執行一次前向傳播。
- **單次執行:** 每次推論只執行一次，立即返回結果。

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
