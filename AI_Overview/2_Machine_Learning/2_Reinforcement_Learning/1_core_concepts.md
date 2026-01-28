# Reinforcement Learning 強化學習

這是機器學習中最接近 **生物學習方式** 的分支。

核心概念是 **試錯 Trial and Error**：
> 透過與環境的互動，根據獲得的獎勵或懲罰，一步步學會做出最好的決策。

## 核心類比 Dog Training

想像你在訓練一隻小狗：
- 你發出指令 坐下。
- 小狗嘗試動作：牠可能轉圈圈、跳起來，或者坐下。
- **回饋：**
    - 如果牠轉圈圈，你什麼都不做 No Reward。
    - 如果牠坐下，你給牠一塊餅乾 Positive Reward。
- 隨著時間過去，小狗的大腦會連結 坐下 與 餅乾，以後聽到指令就會立刻坐下。

## 五大關鍵要素

### Agent 代理人
也就是 **主角**，負責做決策的 AI 模型。
例如：超級瑪利歐遊戲中的瑪利歐，或是 AlphaGo 的下棋程式。

### Environment 環境
Agent 所在的 **世界**，它定義了規則與邊界。
例如：遊戲關卡、圍棋棋盤、真實世界的馬路。

### State 狀態 $S$
Agent 當下所處的情況。
例如：畫面上怪物的目前位置、棋盤上黑白子的分佈。
    
### Action 行動 $A$
Agent 在某個狀態下可以採取的動作。
例如：往右跳、往下蹲、在天元下子。

### Reward 獎勵 $R$
環境給予 Agent 的即時回饋分數。
- **正分:** 吃到金幣、贏了棋局。
- **負分:** 被烏龜撞死、撞到牆壁。
- **目標:** 最大化長期累積的獎勵總和。

## 運作迴圈 The Loop

強化學習的過程就是一個無止盡的迴圈：

- **觀察 Observation:** Agent 觀察當前的 State。
- **決策 Decision:** Agent 根據 Policy 選擇一個 Action。
- **行動 Action:** Agent 在 Environment 中執行該 Action。
- **回饋 Feedback:** Environment 變換到新的 State 並給予 Agent 一個 Reward。
- **學習 Learning:** Agent 根據 Reward 更新大腦，修正未來的決策策略。

## 困難挑戰

### 延遲獎勵 Delayed Reward
有時候你做了一個正確的決定，但獎勵要在很久以後才會出現。
例如：在圍棋開局下了一步好棋，可能要過 100 手之後才看出它的價值。Agent 必須學會將功勞歸功於很久以前的那個決定，這就是 **信用分配 Credit Assignment** 問題。

### 探索與利用 Exploration vs Exploitation
- **利用:** 總是走已知的安全路線，確保拿到基本分。
- **探索:** 嘗試未知的新路線，雖然可能踩雷，但也可能發現捷徑。
Agent 必須在這兩者之間取得平衡。
