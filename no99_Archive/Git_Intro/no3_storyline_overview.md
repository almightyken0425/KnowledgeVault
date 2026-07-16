# 版本故事線概覽

- 本文件從版本故事線切入。
- 目的是建立宏觀視野。
- 說明 Git 核心操作如何協同運作。
- 最終建構清晰的專案歷史。
- 歷史須可追溯。

### 故事線中的關鍵角色

- **Commit:**
    - 專案在某個時間點的快照。
    - 又稱存檔點，例如 `C0`、`C1`。
- **Branch:**
    - 一條獨立的開發故事線。
    - 永遠指向最新的存檔點。
    - 常見名稱如 `main`、`feature`。
- **commit 指令:**
    - 建立一個新的存檔點。
    - 讓目前故事線前進一步。
- **merge 指令:**
    - 合併故事線的進度。
    - 目標是另一條故事線。
- **Remote:**
    - 雲端倉庫的別名。
    - 預設名稱為 `origin`。
- **push 指令:**
    - 將本機存檔點上傳到雲端倉庫。
- **pull 指令與 fetch 指令:**
    - 從雲端倉庫下載最新存檔點。

## 版本故事線的全貌 The Big Picture

- Git 所有操作。
- 最終都在維護版本故事線。
- 故事線可能不只一條。
- 以下展示故事線的完整過程。
- 從開始、分岔到合併。

### 故事線範例：一個功能的完整生命週期

- 目的是展示本機與雲端的互動。
- 用兩張圖分別表示故事線狀態。
- 一張圖對應開發者本機 Local。
- 另一張圖對應 GitHub 遠端 Remote。

```
初始狀態。
本機與雲端倉庫完全同步。

   本機 Local：
   C0 -- C1 -- C2  main

   雲端倉庫 GitHub Remote：
   C0 -- C1 -- C2  main


本機開發。
開發者建立 feature 分支。
新增存檔點 C3 與 C5。
main 分支因緊急修復。
新增存檔點 C4。

   本機 Local：
   C0 -- C1 -- C2 -- C4  main
                \
                 C3 -- C5  feature

   雲端倉庫 GitHub Remote：
   尚未收到任何更新，保持原樣。
   C0 -- C1 -- C2  main


推送 push 指令。
本機兩條故事線推送到 GitHub。
與團隊分享進度。

   本機 Local：
   狀態不變。
   C0 -- C1 -- C2 -- C4  main
                \
                 C3 -- C5  feature

   雲端倉庫 GitHub Remote：
   已接收更新，現在與本機同步。
   C0 -- C1 -- C2 -- C4  main
                \
                 C3 -- C5  feature


合併 merge 指令。
feature 分支開發完成。
透過 Pull Request 在 GitHub 上合併回 main 分支。

   本機 Local：
   尚未同步。
   不知道遠端發生了合併。
   C0 -- C1 -- C2 -- C4  main
                \
                 C3 -- C5  feature

   雲端倉庫 GitHub Remote：
   main 故事線產生新的合併節點 C6。
   C0 -- C1 -- C2 -- C4 -- C6  main
                \         /
                 C3 -- C5  feature


拉取 pull 指令。
取得遠端 main 最新進度。
同步回本機。

   本機 Local：
   更新後，main 指標移動到 C6。
   C0 -- C1 -- C2 -- C4 -- C6  main
                \         /
                 C3 -- C5  feature

   雲端倉庫 GitHub Remote：
   狀態不變。
   C0 -- C1 -- C2 -- C4 -- C6  main
                \         /
                 C3 -- C5  feature
```

---

## 常見情境：推送被拒絕 Push Rejection

- 執行 `git push` 時。
- 最常遇到推送被拒絕。
- 這通常不是真正的錯誤。
- 這是 Git 的保護機制。
- 目的是防止覆蓋工作。
- 保護對象是團隊成員的成果。

### 發生情境：遠端倉庫進度超前本機

- 最常發生於本機埋頭工作時。
- 另一名開發者已推送成果。
- 推送到遠端同一分支。

```
初始狀態。
本機與遠端都同步在 C2。

   本機 Local：    C1 -- C2  main
   雲端倉庫 GitHub Remote：  C1 -- C2  main


同事推送。
其他開發者完成 C3。
成功推送到遠端。
此刻，遠端倉庫進度已超前本機。

   本機 Local：    C1 -- C2  main
   雲端倉庫 GitHub Remote：  C1 -- C2 -- C3  main


本機完成工作。
在本機完成 C4，準備推送。

   本機 Local：    C1 -- C2 -- C4  main
   雲端倉庫 GitHub Remote：  C1 -- C2 -- C3  main


推送被拒絕。
開發者執行 git push 指令。
Git 發現遠端 main 停在 C3。
本機 main 停在 C4。
兩者已從 C2 分岔。
若允許推送，遠端的 C3 會被覆蓋。
Git 因此拒絕推送。
提示這是一次非快轉更新 non-fast-forward。
```

### 解決推送被拒絕

- 解決方式是先拉取遠端變更。
- 再與本機變更合併。
- 最後一起推送。
- 拉取並合併:
    - 執行 `git pull` 指令。
    - Git 下載遠端的 C3。
    - 自動與本機 C4 合併。
    - 產生新的合併節點 C5。
- 再次推送:
    - 本機歷史 C5 已包含遠端歷史 C3。
    - 執行 `git push` 指令。
    - 即可成功推送。

### 更佳實踐：使用分支處理遠端變更

- 直接在 main 分支執行 git pull。
- 用於解決衝突。
- 會在 main 故事線產生合併提交。
- 稱為 merge commit。
- 團隊頻繁這樣做 → main 歷史變複雜。
- 更專業的做法是保持 main 乾淨線性。
- push 被拒絕時。
- 建議採用以下流程。

```
初始狀態。
推送被拒絕後。

   本機 Local：    C1 -- C2 -- C4  main
   雲端倉庫 GitHub Remote：  C1 -- C2 -- C3  main
```

- 建立新分支:
    ```bash
    # 從目前進度 C4 建立新分支 my-feature
    git branch my-feature
    ```
    - 此操作在 C4 建立新分支指標 `my-feature`。
    - 將本機修改隔離出來。
    ```
    本機 Local：
    C1 -- C2 -- C4  main, my-feature
    ```
- 更新本機 main 分支:
    ```bash
    # 切換回 main 分支
    git checkout main
    # 拉取遠端最新進度
    # 使用 rebase 模式保持歷史線性
    # 效果等同於 git reset --hard origin/main
    git pull --rebase
    ```
    - 執行後，本機 main 同步遠端 main。
    - 同步進度為 C1-C2-C3。
    - 本機修改 C4 保留在 `my-feature` 分支。
    ```
    本機 Local：
                 C4  my-feature
                /
    C1 -- C2 -- C3  main
    ```
- 重新應用變更:
    - 此時基於乾淨的 main 分支。
    - 可選擇合併 my-feature 變更回來。
    - 或推送 my-feature 到遠端發起 Pull Request。
    - 以下範例使用 rebase。
    - 疊加變更到最新 main。
    ```bash
    # 切換到功能分支 my-feature
    git checkout my-feature
    # 將 my-feature 變更，重新在 main 上播放一次
    git rebase main
    ```
    - 執行後，Git 建立新存檔點 `C4'`。
    - 包含 C4 的所有修改。
    - 基底改為 C3，不再是 C2。
    ```
    本機 Local：
    C1 -- C2 -- C3  main -- C4'  my-feature
    ```
    - 現在 `my-feature` 分支包含遠端最新進度。
    - 同時包含本機修改。
    - 歷史紀錄維持線性。
    - 可安全將 main 分支快轉到 `C4'`。
    - 最後一次性推送到遠端。
- 避免在 main 分支直接解決衝突。
- 修改先移至臨時分支。
- main 與遠端同步後，再處理修改。
- 團隊協作建議獨立分支開發。
