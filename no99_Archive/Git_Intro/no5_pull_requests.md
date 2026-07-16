# Pull Request：團隊協作的核心

- 分支開發完成後
- 準備合併回 main 分支
- 合併動作透過 Pull Request 進行
- 動作發生在 GitHub 上
- 本文件說明：
  - Pull Request PR 的定義
  - Pull Request 的協作角色

---

## Pull Request PR 的定義

- Pull Request PR 是合併申請書的比喻
- 開發者 Dave 在 feature/login 分支
- Dave 完成了登入功能
- Dave 不會直接合併程式碼到 main 分支
- 直接合併可能：
  - 引入未經測試的 Bug
  - 與團隊目標不符
- Dave 在 GitHub 上發起 Pull Request
- 發起 PR 等同於提交合併申請書
- 申請書內容包含以下項目：
  - 登入功能已完成的說明
  - feature/login 分支的所有修改
  - 請審查者檢查程式碼
  - 確認無誤後合併到 main 分支
  - 合併動作交給專案維護者執行
- PR 的核心目的：
  - 提供討論的平台
  - 提供審查的平台
  - 提供測試的平台
- 核心目的的達成時機：
  - 程式碼正式進入主線之前

### Pull Request 的故事線

- PR 完整流程分為本機端與遠端 GitHub 端
- 以下圖示對照兩端的進度差異

```
本地開發：
開發者從同步好的 main 分支 C2 出發，
建立新的功能分支 feature/login，
新增存檔點 C3 與 C4，
完成登入功能。

本機環境 Local：
C1 -- C2  main
      \
       C3 -- C4  feature/login

GitHub 遠端 Remote：
尚未收到任何更新，
維持原有進度。
C1 -- C2  main


推送分支並發起 PR：
開發者將 feature/login 分支推送到遠端，
在 GitHub 上發起從 feature/login 到 main 的 Pull Request。
main 分支已前進到 C5，
原因是其他修改先合併了。

本機環境 Local：
狀態不變。
C1 -- C2  main
      \
       C3 -- C4  feature/login

GitHub 遠端 Remote：
已接收 feature/login 分支，
main 分支也前進了。
C1 -- C2 -- C5  main
      \
       C3 -- C4  feature/login


在 GitHub 上合併 PR：
團隊審查並批准後，
動作發生在 GitHub 網站上，
專案維護者點擊 Merge 按鈕。

本機環境 Local：
尚未同步，
不知道遠端已完成合併。
C1 -- C2  main
      \
       C3 -- C4  feature/login

GitHub 遠端 Remote：
main 故事線產生新的合併節點 C6。
C1 -- C2 -- C5 ------ C6  main
      \             /
       C3 -------- C4  feature/login


同步回本地：
所有團隊成員執行 git pull，
遠端 main 分支有最新進度，
進度同步回本機，
最新進度包含合併後的 C6，
準備下一次開發。
```

---

## 處理 PR 中的合併衝突 Merge Conflicts

- 推送被拒絕與合併衝突：
  - 情境類似
  - 成因不同
- 推送被拒絕：
  - 發生在開發者直接推送
  - 推送目標是過時的共享分支
- 合併衝突：
  - 發生在 PR 發起之後
  - GitHub 會發現：
    - 衝突位於功能分支與 main 分支之間
    - 衝突是無法自動合併的程式碼
- 團隊協作中常見情況：
  - 開發者發起 PR 時
  - GitHub 顯示衝突訊息：
    - `This branch has conflicts that must be resolved`
  - Merge 按鈕呈現灰色
  - 按鈕無法點擊

### 衝突發生的原因

- 衝突常發生於功能開發期間
- 開發者從 main 分支切出
- 開發新功能
- 開發期間，其他開發者的程式碼
- 已先合併回 main 分支
- 若雙方修改的檔案位置相同
- 就會產生衝突

```
C1 -- C2 -- C5  main
      \
       C3 -- C4  feature/login

說明：
feature/login 分支包含 C4，
嘗試合併回 main 時，
Git 發現 main 已前進到 C5。
若 C4 與 C5 修改同一檔案同一行，
衝突就會發生。
```

- PR 作者將功能分支合併回 main 分支時
- Git 無法決定保留哪一方的修改
- 決定權交還給 PR 作者

### 衝突解決責任

- 衝突解決責任通常屬於 PR 作者
- PR 作者拉回最新進度：
  - 來源：
    - main 分支
  - 目標：
    - 自己的功能分支
- 在本機電腦解決衝突
- 解決後將結果推送到遠端

#### 解決流程

- 衝突發生時的狀態：
  - PR 試圖將 C4 合併到 main
  - main 已存在 C5
  - C5 與 C4 衝突

```
GitHub 遠端 Remote：
C1 -- C2 -- C5  main
      \
       C3 -- C4  feature/login
```

- 切換到功能分支
- 拉下最新的 main 分支

```bash
# 確認位於功能分支
git checkout feature/login
# 合併遠端 main 分支到目前分支
git merge origin/main
```

- 執行後
- Git 在本機報告檔案衝突
- 在本機解決衝突：
  - 開啟衝突檔案
  - 檔案內有衝突標記
  - 標記包含 `<<<<<<< HEAD`、`=======`、`>>>>>>>`
  - 手動編輯檔案
  - 刪除衝突標記
  - 保留最終版本
  - 儲存檔案後執行 `git add <衝突檔案>`
  - 執行結果加入暫存區
  - 執行 `git commit`
  - 建立解決衝突的存檔點 C7
- 推送解決後的結果到遠端：

```bash
git push origin feature/login
```

- 推送成功後
- GitHub 偵測衝突已解決
- PR 頁面上的 Merge 按鈕恢復可用

---

## 在 Pull Request 中的角色與協作

- PR 不只是程式碼檢查的場所
- PR 是團隊溝通的橋樑
- 團隊成員包含：
  - 產品經理
  - 設計師
  - 開發者
- 不同角色可以從各自專業角度協作

### 參與 PR 的方式

- 審查者收到通知：
  - 開發者發起 PR
  - PR 指定審查者 Reviewer
  - 審查者收到 GitHub 通知
- 審查者進入 PR 頁面：
  - 點擊通知連結
  - 進入 PR 專屬頁面

### PR 審查重點

- 標題與描述 Title & Description：
  - 好的 PR 標題清晰易懂
  - 範例：
    - 實作使用者登入功能
  - 描述包含：
    - 變更目的
    - 解決的問題
  - 描述可能附上：
    - 設計圖
    - 需求文件連結
- 查看檔案變更 Files changed 標籤頁：
  - 這是審查中最重要的部分
  - 點擊 Files changed
  - 可看到所有檔案的具體變更
  - 綠色背景代表新增的內容
  - 紅色背景代表刪除的內容
  - 審查者不需要熟悉程式碼
  - 判斷修改是否符合預期：
    - 依據：
      - 檔名
      - 文字變更
    - 範例：
      - 按鈕文字是否正確
      - 新畫面檔案是否已加入
- 參與討論與審查 Conversation 標籤頁：
  - **留下評論**：
    - 對某個變更有疑問時
    - 點擊對應程式碼行數的 `+` 號
    - 點擊後留下評論
    - 例如按鈕文字應為註冊
    - 不應該是登記
  - **批准變更**：
    - 確認修改符合團隊目標
    - 點擊 Review changes 按鈕
    - 選擇 Approve 並提交
    - 此動作代表審查者的認可
    - 認可角度包含產品、設計、技術

### 總結

- 閱讀並參與 Pull Request
- 這是確保開發成果的方法
- 成果符合團隊目標
- Pull Request 把抽象需求
- 轉化為具體的程式碼變更
- 團隊溝通建立在共同基礎上
- 基礎是可視化的
