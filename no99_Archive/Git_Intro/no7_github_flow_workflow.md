# GitHub Flow 完整工作流程

- 本文件說明標準開發週期。
- 範圍：
  - 建立分支開始。
  - 到合併回主線 main 結束。
- 操作工具：GitHub Desktop 圖形化介面。

---

## 開始新工作：建立分支

- 情境：開發者要修復 bug。
  - 或者：開發新功能。

### 確保 main 是最新的

- 目的：確認本地 main 與遠端 origin 一致。
- 時機：開始任何新工作之前。
- 在 GitHub Desktop 切換到 `main` 分支。
- 點擊 `Fetch origin` 按鈕。
- 按鈕變成 `Pull origin`：
  - 代表遠端有本地缺少的更新。
  - 按下按鈕，把 main 更新到最新。

### 建立新分支 New Branch

- 時機：開發者要開始新工作。
- 目的：拉出一條新的時間線。
- 點擊 `Current Branch` 按鈕。
  - 按鈕目前顯示 `main`。
- 點擊 `New Branch` 按鈕。
- 分支命名要有意義。
  - 範例：
    - `fix/login-bug`
    - `feature/user-profile`
- 點擊 `Create Branch` 按鈕。

### 發布分支 Publish Branch

- 建立分支後：
  - 分支只存在本地電腦。
- 建議立刻發布分支。
  - 效果：
    - GitHub 遠端得知分支存在。
    - 形同一種備份。
- 點擊 `Publish branch` 按鈕。

---

## 執行工作：修改與提交

### 修改程式碼

- 離開 GitHub Desktop。
- 打開慣用的程式碼編輯器。
- 開始撰寫程式碼、修改檔案。
- 完成一個小段落後，儲存檔案。
  - 範例：登入按鈕 UI 完成即存檔。

### 提交變更 Commit

- 回到 GitHub Desktop。
- Changes 欄位列出所有被修改的檔案。
- 勾選這一次要打包的檔案。
- 填寫 Commit Message 提交訊息。
  - Summary 標題：
    - 必填欄位。
    - 簡潔說明本次修改內容。
    - 範例：`feat: 增加登入按鈕 UI`。
  - Description 描述：
    - 選填欄位。
    - 建議填寫更詳細的說明。
- 點擊 `Commit to fix/login-bug` 按鈕。
- 單一功能可能需要多次 commit。
- 修改與提交可重複執行。
  - 直到分支任務完全完成。
  - 範例任務：`fix/login-bug`。

---

## 發起請求：Push 與 PR

### 推送變更 Push

- 先前的 commits 目前都在本地電腦。
- 需要把這些進度上傳到 GitHub。
- 點擊 `Push origin` 按鈕。
  - 此按鈕顯示未上傳的 commits 數量。

### 建立合併請求 Create Pull Request

- 這是關鍵步驟。
- 所有程式碼已上傳到 `fix/login-bug` 分支。
- 目的：
  - 請求合併 `fix/login-bug` 到 `main`。
  - 對象：專案維護者。
    - 專案維護者可能是開發者本人。
- Push 完成後，GitHub Desktop 顯示提示框。
  - 提示文字：`fix/login-bug had recent pushes`。
  - 提示框提供 `Create Pull Request` 按鈕。
- 點擊 `Create Pull Request` 按鈕。

---

## 審核與合併：在網站上

### 填寫 PR 說明：在 GitHub 網站

- 點擊按鈕後：
  - GitHub Desktop 自動開啟瀏覽器。
- 瀏覽器顯示 New Pull Request 頁面。
- 頁面自動帶入兩個欄位。
  - `base: main`：合併目標分支。
  - `compare: fix/login-bug`：來源分支。
- 需要手動填寫 PR 標題與描述。
  - 標題與描述給審核者閱讀。
  - 目的：說明修改原因與測試方式。
  - 這跟 Commit Message 用途不同。
    - Commit Message 說明如何完成修改。
- 填寫完畢後，點擊 `Create Pull Request` 按鈕。
- PR 發出成功。

### 流程的終點

- 發出 PR 後，流程暫時離開 GitHub Desktop。
- 三個階段依序發生：
  - **審核 Review：**
    - 隊友或開發者本人查看 PR。
    - 在 GitHub 網站逐行檢查程式碼。
    - 可能留下評論，要求修改。
  - **若需修改：**
    - 開發者回到修改程式碼的階段。
    - 在同一分支 `fix/login-bug` 繼續修改、Commit、Push。
    - PR 自動更新。
  - **合併 Merge：**
    - 審核通過後：
      - 審核者按下 `Merge Pull Request` 按鈕。
- 合併完成後，程式碼進入 `main` 分支。

### 最後的清理動作：在 Desktop

- 切換回 `main` 分支。
- 執行 Pull origin。
  - 把剛合併完成的 main 拉回本地。
- 刪除 `fix/login-bug` 本地分支。
  - 原因：分支已完成階段性任務。
