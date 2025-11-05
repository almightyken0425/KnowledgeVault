# GitHub 日常開發流程 (使用 GitHub Desktop)

這份文件將引導您完成一個標準的開發週期：從建立一個新功能分支，到最後成功將程式碼合併回主線 (main)。我們將使用 GitHub Desktop 這個圖形化工具來操作。

---

🎬 **流程一：開始新工作（建立分支）**
假設您要修復一個 bug 或開發一個新功能。

### 1. 確保您的 main 是最新的
在開始任何新工作前，先確保您本地的 `main` 分支和 GitHub 遠端（`origin`）是一致的。

1.  在 GitHub Desktop，切換到 `main` 分支。
2.  點擊右上角的「Fetch origin」按鈕。
3.  如果按鈕變成了「Pull origin」（代表遠端有您沒有的更新），請務必按下它，將 `main` 更新到最新。

### 2. 建立新分支 (New Branch)
您要開始工作了，所以要「拉出一條新的時間線」。

1.  點擊頂端的「Current Branch」按鈕（目前顯示 `main`）。
2.  點擊「New Branch」按鈕。
3.  **命名分支**： 給分支一個有意義的名稱，例如 `fix/login-bug` 或 `feature/user-profile`。
4.  點擊「Create Branch」。

### 3. 發布分支 (Publish Branch)
建立分支後，它只存在您的電腦上。最好立刻「發布」，讓 GitHub 遠端也知道這條分支的存在（這也是一種備份）。

-   點擊頂端的「Publish branch」按鈕。

---

🎬 **流程二：執行工作（修改與提交）**

### 4. 修改程式碼
1.  離開 GitHub Desktop，打開您的 VS Code 或其他編輯器。
2.  開始撰寫您的程式碼、修改檔案。
3.  完成一個小段落後（例如：完成了登入按鈕的 UI），儲存檔案。

### 5. 提交變更 (Commit)
1.  回到 GitHub Desktop。
2.  您會在左側「Changes」欄位看到所有被修改的檔案。
3.  勾選您「這一次」想打包的檔案。
4.  在左下角，填寫「Commit Message」（提交訊息）：
    -   **Summary (標題)**： 必填，簡潔說明您「做了什麼」（例如：`feat: 增加登入按鈕 UI`）。
    -   **Description (描述)**： 選填，但建議填寫更詳細的說明。
5.  點擊藍色的「Commit to `fix/login-bug`」按鈕。

> **提示**： 您的功能可能需要好幾個 Commits 才能完成。您可以重複步驟 4 和 5，直到您覺得這個分支的任務（例如 `fix/login-bug`）完全搞定了。

---

🎬 **流程三：發起請求（Push 與 PR）**

### 6. 推送變更 (Push)
您在步驟 5 做的所有 Commits 目前都還在本地電腦。您需要把這些「進度」上傳到 GitHub。

-   點擊頂端的「Push origin」按鈕（它旁邊可能會有個數字，代表您有多少個本地 commits 還沒上傳）。

### 7. 建立合併請求 (Create Pull Request)
這是關鍵一步！ 您的所有程式碼都已經安全上傳到 GitHub 上的 `fix/login-bug` 分支了。

現在，您要正式「請求」專案維護者（可能就是您自己）把 `fix/login-bug` 合併回 `main`。

-   當您 Push 之後，GitHub Desktop 通常會立刻在頂端顯示一個黃色提示框，上面寫著「`fix/login-bug` had recent pushes」並提供一個「Create Pull Request」按鈕。
-   請點擊「Create Pull Request」按鈕。

---

🎬 **流程四：審核與合併（在網站上）**

### 8. 填寫 PR 說明（在 GitHub 網站）
點擊按鈕後，GitHub Desktop 會自動在您的瀏覽器中打開 GitHub 網站的「New Pull Request」頁面。

1.  它會自動幫您填好：`base: main`（要併入的目標）← `compare: fix/login-bug`（您的來源）。
2.  您需要填寫 PR 的標題和描述。
    > **重要**： 這裡的標題/描述是給「審核者」看的，目的是說明您「為什麼」做這些修改，以及如何測試。這跟 Commit Message（說明您「如何」做的）不同。
3.  填寫完畢後，點擊網站上的「Create Pull Request」綠色按鈕。

恭喜！您已經成功發出了 PR！

### 流程的終點：
發出 PR 後，流程就暫時離開 GitHub Desktop 了：

1.  **審核 (Review)**： 您的隊友（或您自己）會在 GitHub 網站上查看您的 PR，逐行檢查程式碼，也許會留下評論要求修改。
2.  **（若需修改）**： 如果被要求修改，您就回到步驟 4，在同一個分支（`fix/login-bug`）上繼續修改、Commit、然後 Push。您的 PR 會自動更新。
3.  **合併 (Merge)**： 一旦審核通過，審核者會在 GitHub 網站上按下「Merge Pull Request」按鈕。

大功告成： 您的程式碼正式進入 `main` 分支了！

### 最後的清理動作 (在 Desktop)：
1.  切換回 `main` 分支。
2.  Pull origin（把剛剛合併的最新 `main` 拉回來）。
3.  刪除 `fix/login-bug` 本地分支（因為它功成身退了）。
