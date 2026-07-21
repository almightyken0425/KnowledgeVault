# 單點註冊流程

> G3 註冊表的設計與新增流程。目標：登記一次，其餘推導。

---

## 註冊表條目設計

```yaml
products:
  - id: ExampleApp
    profile: full_app             # 引用形態 id
    repo:
      path: <工作區根>/product/ExampleApp
      remote: <git 主機>/ExampleApp.git
    modules:
      - id: no1_main_app
        display: Main App
        # profile 省略代表沿用產品形態；要偏差時擇一使用：
        # profile: backend_service        整組換形態
        # layers_add: [quality]           在沿用基礎上加層
        # layers_remove: [design]         在沿用基礎上減層
        repos:
          spec:    { remote: <git 主機>/ExampleApp-Spec-MainApp.git }
          design:  { remote: <git 主機>/ExampleApp-Design-MainApp.git, shell: true }
        product_map_paths:              # 不可推導、需登記：本模組引用的整合圖 Product Map 子路徑
          - product_map/main_app/
        sub_mapping:                    # 檔案級決議流向，規格見下節
          - arbiter: design
            followers: [impl]
            globs:
              design: project/foundations/tokens.jsx
              impl: src/constants/theme.ts
```

推導與登記的分界：

- 各層路徑不寫。由層宣告檔的 dir 加模組 id 推導：`<repo.path>/<layer.dir>/<module.id>/`
- workspace 邊界層如專案管理，路徑同樣由宣告檔推導，錨點為工作區根
- remote 照宣告檔的 remote_naming 模板推導，實際值仍記錄供比對，歷史命名可能偏離模板
- repos 缺項代表該層未建。形態宣告該不該建，缺項加形態算出待辦
- `shell: true` 標記空殼 repo：repo 存在、內容留白屬預期，盤點工具不列缺漏
- product_map_paths 值常是不規則的檔案級路徑，無法推導，屬需登記欄位

---

## sub_mapping 規格

檔案級決議流向，細化層宣告檔的預設連鎖：

- arbiter 與 followers 的值域是層宣告檔的層 id，不寫死欄位名
- globs 是以層 id 為 key 的 map，值為該層 git 內的路徑樣式
- 新增一個工件層時 schema 零改動，新層 id 直接可用

---

## 新產品註冊流程

登記一次，其餘由檢核器帶出：

- 在註冊表加一條產品，選形態、填 repo 座標
- 跑檢核器。檢核器依形態列出該建的實體目錄、該 init 的 git、該建的 remote、該寫的說明文件
- 照清單建完，再跑一次檢核器確認全綠

對照舊法：註冊表、實體目錄、多份說明文件各登記一次，SOP 靠人記，漏一處就是配對缺口。新法把缺項清單變成檢核器的輸出，人只負責執行。

---

## 新模組與新層的註冊

- **新模組：** 註冊表該產品下加一條模組，沿用或覆寫形態，跑檢核器補實體
- **模組升級：** 純概念模組進入實作，改模組形態，檢核器列出新增層的建置待辦
- **全域新層：** 層宣告檔加一條，相關形態加引用，檢核器列出所有受影響實例的補建與衍生物同步待辦

三種情境共用同一個迴圈：改宣告、跑檢核、照清單補、再檢核。

---

## 盤點狀態的推導

盤點工具的狀態判定由形態與 repos 的矩陣推導，取代硬編碼狀態表：

- 形態說該有、repos 有 → 正常
- 形態說該有、repos 缺 → 待建
- 形態說該有、repos 標 shell → 空殼屬正常
- 形態沒說、實存 → drift 警示

---

## 說明文件的角色轉變

各 repo 說明文件在此架構下只承載三件事：

- 本 repo 是哪個產品哪個模組的哪一層，引用層 id
- 本 repo 特有的撰寫規範與注意事項
- 指向註冊表與層宣告檔作為配對真相

結構性資訊如對側路徑清單、層清單、沿革，一律指向宣告檔，不再各自維護副本。副本會過期，指針不會。
