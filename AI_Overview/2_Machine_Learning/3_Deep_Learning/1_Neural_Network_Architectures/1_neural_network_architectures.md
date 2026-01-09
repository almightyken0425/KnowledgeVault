# Neural Network Architectures

核心概念是將神經網路視為一個巨大的 **狀態機 State Machine**：

- **權重** $w$ **與偏差** $b$ 是這個物件內部的 **State 狀態**。
- **輸入** $x$ 是函數的 **Arguments 參數**。
- **訓練 Training** 是不斷呼叫函數來 **更新 Write** 內部的 State。
- **推論 Inference** 是呼叫函數來 **讀取 Read** 內部的 State 並產出結果。

## 資料結構定義 Data Structures

---

在深度學習 Deep Learning 中，我們不再只有一組權重，而是有多組權重組成 **層 Layers**。
以下將神經網路的實體結構由小到大，從概念到程式碼邏輯逐一解析。

### 輸入數據 Input Data

- **概念:** 輸入是神經網路的起點，是待處理的原始資訊。
- **型態:** `Array<Float>` 一維陣列/向量
- **語意:** 陣列長度代表特徵數量，例如一張 28x28 的灰階圖片會被展平成 784 個數值。
- **程式碼表示:**
    ```javascript
    const singleInput = [x1, x2, x3, ..., xM]; // 單筆資料，M 個特徵
    ```
- **視覺化:**
    ```
    [ x1 | x2 | x3 | ... | xM ]
    ```

### 神經元節點 Neuron Node

- **概念:** 神經元並非獨立物件，它是針對上一層所有輸入的一組評分標準。
- **型態:** `Array<Float>` 一維陣列/向量
- **語意:** 陣列長度等於上一層傳來的特徵數量。
- **程式碼表示:**
    ```javascript
    const node1Weights = [w11, w12, w13]; // 長度 = 上一層特徵數
    const node2Weights = [w21, w22, w23];
    ```
- **視覺化:**
    ```
    ┌─────┐
    │ w11 │ <- #1
    ├─────┤
    │ w12 │ <- #2
    ├─────┤
    │ w13 │ <- #3
    └─────┘
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
- **視覺化:**
    ```
         N1    N2
         ↓     ↓
    ┌─────┬─────┐
    │ w11 │ w21 │ <- #1
    ├─────┼─────┤
    │ w12 │ w22 │ <- #2
    ├─────┼─────┤
    │ w13 │ w23 │ <- #3
    └─────┴─────┘
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
- **視覺化:**
    ```
    ┌───────────────────────────────┐
    │ Layer 1                       │
    ├───────────────────────────────┤
    │ weights: [3×2]                │
    │      N1    N2                 │
    │ ┌─────┬─────┐                 │
    │ │ w11 │ w21 │                 │
    │ │ w12 │ w22 │                 │
    │ │ w13 │ w23 │                 │
    │ └─────┴─────┘                 │
    │                               │
    │ biases: [b1, b2]              │
    └───────────────────────────────┘
    
    多層組合：
    [
      { weights: [3×2], biases: [2] },  // Layer 1
      { weights: [2×4], biases: [4] },  // Layer 2
      { weights: [4×1], biases: [1] }   // Layer 3
    ]
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
- **視覺化:**
    ```
    [
      ┌─────────┐   ┌─────────┐   ┌─────────┐
      │ Layer 1 │ , │ Layer 2 │ , │ Layer 3 │
      └─────────┘   └─────────┘   └─────────┘
    ]
    ```



## 核心操作 Core Operations

---

神經網路的所有行為都由以下四個基本操作組成。這些操作是獨立且可複用的邏輯單元。

### 前向傳播 Forward Propagation

- **目的:** 將輸入數據透過網路層層轉換，產出預測結果。
- **輸入與輸出:**
    - **Input:** 原始數據 $x$
    - **Process:** 數據依序通過 Neural Network Model 中的每一個 Layer。
        - **矩陣運算:** 執行 `processLayer(inputs, layerWeights, layerBiases)`。
            - 每個神經元與輸入向量做 `dotProduct`，產生新特徵向量。
        - **激活函數:** 執行 `activation(result)` (如 ReLU)。
            - 引入非線性邏輯：`if (val > 0) return val else return 0`。
        - **接力傳遞:** 這一層的輸出成為下一層的輸入。
        - **狀態緩存:** (訓練模式) 緩存輸出供反向傳播使用。
    - **Output:** 最終預測 Final Prediction
- **視覺化:**
    ```
    Input      Layer 1 (3x2)     Output 1     Layer 2 (2x4)                Output 2    Layer 3 (4x1)   Final
    
    ┌────┐     ┌─────┬─────┐      ┌────┐      ┌─────┬─────┬─────┬─────┐   ┌────┐       ┌─────┐
    │ x1 │────→│ w11 │ w21 │      │    │      │ w11 │ w21 │ w31 │ w41 │   │    │       │ w11 │
    ├────┤     ├─────┼─────┤  ==> │ h1 │────→ ├─────┼─────┼─────┼─────┤ =>│ h2 │────→  ├─────┤  ===>  ┌────┐
    │ x2 │────→│ w12 │ w22 │      │    │      │ w12 │ w22 │ w32 │ w42 │   │    │       │ w12 │        │ y1 │
    ├────┤     ├─────┼─────┤      └────┘      └─────┴─────┴─────┴─────┘   └────┘       ├─────┤        └────┘
    │ x3 │────→│ w13 │ w23 │                                                           │ w13 │
    └────┘     └─────┴─────┘                                                           ├─────┤
                                                                                       │ w14 │
                                                                                       └─────┘
    ```

### 計算損失 Calculate Loss

- **目的:** 量化預測結果與正確答案的差距。
- **輸入與輸出:**
    - **Input:** Prediction 預測結果來自前向傳播, True Label 正確答案
    - **Process:** 使用損失函數計算預測值與真實值的誤差。
        - 常見損失函數：Mean Squared Error 均方誤差, Cross-Entropy 交叉熵。
        - 函數會輸出一個數值，數值越大代表預測越不準確。
    - **Output:** Loss 誤差數值，用於指導後續的權重調整
- **視覺化:**
    ```
          Prediction [0.8]
                 │
                 ▼
             ┌───────┐
             │ Error │ <── Loss Function (MSE)
             └───────┘       = (0.8 - 1.0)^2
                 ▲
                 │
          True Label [1.0]
    ```

### 反向傳播 Backpropagation

這是訓練中最複雜但也最核心的演算法，本質是微積分中的 **連鎖律 Chain Rule** 的程式實作。

- **目的:** 計算每一層權重對最終誤差的貢獻程度。
- **輸入與輸出:**
    - **Input:** Loss 誤差值, Cached Layer Outputs 前向傳播時緩存的每一層輸出
    - **Process:** 從最後一層開始，反向遍歷 Neural Network Model 的每一個 Layer。
        - 對每一層執行三個關鍵運算：
        - **誤差回傳:** `CurrentLayerError = NextLayerError * Weights_Transposed`。透過轉置矩陣將誤差從下一層傳回本層。
        - **激活函數導數:** 若前向傳播時 ReLU 輸出為 0，該神經元梯度為 0，否則保留誤差值。
        - **計算權重梯度:** `WeightGradient = Input_Transposed * Delta`。利用前向傳播時緩存的輸入值計算每個權重的調整方向。
        - 逐層往前傳遞誤差，直到回到第一層。
    - **Output:** Gradients 梯度集合，包含每一層的 `weight_grad` 和 `bias_grad`
- **視覺化:**
    ```
       Error        Layer 3        Layer 2        Layer 1
      (Start)     (Gradient)     (Gradient)     (Gradient)
    
         E   ────→  Grad 3  ────→  Grad 2  ────→  Grad 1
                     │              │              │
                     ▼              ▼              ▼
                   w3_adj         w2_adj         w1_adj
    ```

### 更新權重 Update Weights

- **目的:** 根據梯度調整權重和偏差，使模型逐步改進。
- **輸入與輸出:**
    - **Input:** Gradients 梯度來自反向傳播, Learning Rate 學習率超參數
    - **Process:** 遍歷 Neural Network Model 中的每一個 Layer，更新其權重與偏差。
        - 對每一層的每個權重執行：`w = w - learning_rate * gradient`。
        - 將權重往梯度的反方向移動一小步。
        - Learning Rate 控制步伐大小：太大可能錯過最優解，太小則訓練緩慢。
    - **Output:** 更新後的 Neural Network Model，其內部所有 Layer 的權重與偏差已調整
- **視覺化:**
    ```
      Old Weight      Gradient
         (w)            (g)
          │              │
          │         × Learning Rate (0.01)
          │              │
          ▼              ▼
       ┌────────────────────┐
       │  w_new = w - 0.01g │  (Stepping Down)
       └────────────────────┘
                  │
                  ▼
              New Weight
    ```

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
