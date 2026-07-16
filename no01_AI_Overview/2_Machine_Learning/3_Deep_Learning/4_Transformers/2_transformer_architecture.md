# Transformer Architecture 變形金剛架構

2017 年 Google 發表的論文 "Attention Is All You Need" 正式提出了這個架構。它不需要任何 RNN 或 CNN，完全依賴 Attention 機制來處理語言。

核心概念是 **編碼與解碼 Encoder and Decoder**：
> 一個負責讀懂輸入內容，另一個負責根據理解來生成輸出內容。

## 完整架構

標準的 Transformer 包含兩個主要部分：

### 編碼器 Encoder
**負責理解與萃取特徵。**
- 它看得到整句話。不論是前面的字還是後面的字，都在它的視野範圍內。
- **雙向性 Bidirectional:** 因為能同時看到前後文，所以對語義的理解非常深刻。
- **代表模型:** **BERT**。專精於閱讀測驗、情感分析、分類任務。

### 解碼器 Decoder
**負責生成與預測下一個字。**
- 它只能看到前面的字。為了防止作弊，它在訓練時會遮住後面的字 Masked Attention。
- **單向性 Unidirectional:** 只能往後看，模擬人類寫作是逐字產生的過程。
- **代表模型:** **GPT**。專精於文章生成、對話、故事創作。

## 為什麼它能統治 AI 界？

### 可堆疊性 Scalability
Transformer 的結構允許我們瘋狂地堆疊層數。
- 只要堆得越多層 Depth
- 只要加寬每一層的神經元 Width
- 只要給它夠多的資料 Data

它就能展現出 **湧現能力 Emergent Abilities**，這是在小模型上看不到的智慧火花。

## 總結

- **Encoder:** 是一種 **理解者**，適合做判斷題。
- **Decoder:** 是一種 **創作者**，適合做申論題。
- **Encoder-Decoder:** 像是 **翻譯官**，先讀懂原文 Encoder，再寫出譯文 Decoder。
這就是現代大語言模型 LLM 的前世今生。
