# 新專案的工作流程

## 流程總覽

- 教學情境：
    - 在本機建立新專案
    - 發布專案到 GitHub
- 操作方式：
    - CLI 命令列
    - GUI 圖形化介面
- 開發流程涵蓋以下階段：
    - **git init 建立本地倉庫**
        - 開發者在電腦建立專案資料夾
        - 指令把資料夾轉換為本地倉庫
    - **git commit 存檔到本地倉庫**
        - 開發者寫程式碼後執行 commit
        - commit 在本地倉庫建立存檔點
    - **建立雲端空倉庫**
        - 開發者在 GitHub 網站建立同名倉庫
        - 該倉庫維持完全空的狀態
    - **git push 發布到雲端**
        - 本地倉庫連同存檔點整個上傳
        - 上傳目標是 GitHub 雲端倉庫
        - 專案完成備份
        - 可分享給其他開發者

---

## Git 安裝前置

- 本機須已安裝 Git
- 安裝步驟屬於另一篇教學主題

---

## 在本機建立 Git 儲存庫

- 目的：
    - 資料夾轉換為 Git 本地倉庫

### CLI 命令列方式

- 建立專案資料夾並進入：
    ```bash
    mkdir my-new-project
    cd my-new-project
    ```
- 初始化 Git 儲存庫：
    ```bash
    git init
    ```
    - 指令建立 `.git` 隱藏資料夾
    - 代表本地倉庫已完成初始化

### GUI 圖形化介面方式，以 GitHub Desktop 為例

- 打開 GitHub Desktop
- 選擇 `Create a New Repository on your hard drive...`
- 填寫專案名稱和本地路徑
- 點擊 `Create Repository`
- GUI 工具自動：
    - 建立資料夾
    - 執行 git init

---

## 完成起始提交

- 目的：
    - 建立專案的起始歷史節點 Commit

### CLI 命令列方式

- **撰寫程式碼**
    - 建立初始檔案，例如 `index.html`
- **挑選變更**
    - 執行 `git add .`
    - 新檔案放入暫存區
- **建立歷史節點**
    - 執行 `git commit -m "Initial commit"`

### GUI 圖形化介面方式

- **撰寫程式碼**
    - 使用編輯器建立 `index.html`
- **查看變更**
    - GUI 工具顯示 `index.html` 於變更清單
- **提交**
    - 訊息欄位輸入 Initial commit
    - 點擊 `Commit to main` 按鈕
    - GUI 工具自動完成 add 與 commit 動作

---

## 在 GitHub 上建立空的遠端儲存庫

- 目的：
    - 雲端建立本地倉庫的對應倉庫

### 網站介面 Web UI 方式

- 前往 GitHub 並登入
- 點擊 `+` 號
- 選擇 `New repository`
- 命名儲存庫
- 建議與本地資料夾同名
- 不勾選：
    - Add a README file
    - Add .gitignore
    - Choose a license
- 空儲存庫才能推送起始提交
- 點擊 `Create repository`
- 建立後的頁面顯示儲存庫網址
- 網址格式為 HTTPS 或 SSH
- 複製網址供後續使用

### GUI 圖形化介面方式

- GUI 工具通常合併建立與發布
- GitHub Desktop 不需預先於網站建立儲存庫
- 點擊 `Publish repository` 即自動建立

---

## 連接並發布到 GitHub

- 目的：
    - 本地倉庫連接遠端倉庫
    - 上傳本地成果至 GitHub

### CLI 命令列方式

- **連接遠端**
    ```bash
    git remote add origin <儲存庫網址>
    ```
- **推送成果**
    ```bash
    git push -u origin main
    ```

### GUI 圖形化介面方式

- GitHub Desktop 顯示 `Publish repository` 按鈕
- 點擊該按鈕
- 跳出視窗可：
    - 設定儲存庫名稱
    - 選擇是否設為私有
- 點擊 `Publish Repository`
    - GUI 工具自動：
        - 建立遠端儲存庫
        - 推送本地 Commit
    - 建立與推送一次完成

---

## 完成後的檢查

- GitHub 網站可見：
    - 剛建立的專案
    - 起始提交紀錄
- CLI 與 GUI 方式結果相同
