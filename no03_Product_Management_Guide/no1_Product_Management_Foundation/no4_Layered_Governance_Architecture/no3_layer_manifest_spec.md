# 層宣告檔規格

> G1 層宣告檔的欄位設計。原則：身分與呈現分離，編號是呈現、id 是身分。

---

## 實體形式

- 獨立的 yaml 檔，放工作區的治理目錄，與註冊表相鄰
- 機器可讀優先。人類閱讀版由衍生或直接讀 yaml
- 全工作區僅此一份

---

## 欄位設計

每個工件層一條宣告：

```yaml
layers:
  - id: spec                      # 穩定識別碼，一經發出永不改
    seq: 3                        # 排序編號，可變
    dir: no3_product_specs        # 目錄名，可變，僅此處宣告
    display: Module Spec git      # 人類可讀名
    git_boundary: standalone      # standalone 獨立 git / parent 頂層 git 內目錄 / workspace 工作區級目錄
    granularity: module           # module 依模組拆分 / product 整產品一份
    worktree_prefix: spec         # 獨立 git 層的 worktree 目錄前綴
    remote_naming: "<Product>-Spec-<ModulePascal>"   # remote repo 命名模板
    upstream: [design, planning]  # 向上連鎖，引用層 id
    downstream: [impl]            # 向下連鎖，引用層 id
```

- 層的有無不在此宣告。哪些產品有哪些層由形態宣告表達，宣告檔只管層的定義
- ModulePascal 的推導式：模組 id 去掉 `no<seq>_` 前綴後轉 Pascal 命名，如 `no1_liquid_glass_header` 推導為 `LiquidGlassHeader`
- 頂層 Product git 本身也佔一條宣告，git_boundary 標 parent 自身、worktree_prefix 標 product，供 worktree 反查規則生成

---

## 身分與呈現分離

- **id 是身分：** 其他文件、衍生物、連鎖欄位引用層時一律用 id。id 一經發出永不改，如同資料庫主鍵
- **seq 與 dir 是呈現：** 重編號只改這兩欄。由 dir 推導的東西跟著檢核器同步，引用 id 的地方零變動
- 反例：引用層時寫目錄名。編號一變全部失效，正是重編號代價高昂的直接原因
- id 命名避開 stage 名稱，理由見治理堆疊文件的字義切分

---

## 編號的推導規則

- dir 由 seq 加 slug 組成，格式如 `no<seq>_<slug>`
- 歸檔類容器可用固定高位編號表達恆排最後，不佔連號
- 編號空洞是否允許屬工作區政策，宣告檔忠實記錄現況即可。追求連號時改 seq 重排，改動仍只在宣告檔

---

## 層內子結構

parent 層內若有受編號管理的子容器，用 children 宣告：

```yaml
  - id: planning
    seq: 2
    dir: no2_product_planning
    git_boundary: parent
    granularity: product
    children:
      - { id: requirements, seq: 1, slug: requirements }
      - { id: product_map,  seq: 2, slug: product_map }
      - { id: roadmap,      seq: 3, slug: dev_roadmap }
```

- 子容器的編號同受宣告檔管，重編號時一併只改此處
- 未宣告 children 的層，層內結構自治，檢核器不管
- 衍生物引用子容器同樣用 id，如 product_map，不用目錄名

---

## git 邊界與粒度

| git_boundary | granularity | 情境 |
| --- | --- | --- |
| standalone | module | 如規格、實作層，各模組一個獨立 git |
| standalone | product | 如整產品共用一個獨立 git 的層 |
| parent | product | 如提案、規劃、歸檔，頂層 git 直接追蹤 |
| parent | module | 如整合 Product Map 按模組分目錄 |
| workspace | product | 如專案管理文件，位於產品目錄外、由工作區根 git 追蹤 |

- 情境欄為示意，權威清單見各工作區的宣告檔
- standalone 層才需要 worktree_prefix 與 remote_naming，其餘留空
- workspace 層的路徑錨點是工作區根而非產品 repo，如 `<工作區根>/project/<產品>/`。專案管理因此能入模型，不必在註冊表開特例欄位

---

## 連鎖欄位

upstream 與 downstream 宣告層級粒度的檢查連鎖：

- 引用 id 不引用目錄名
- 路由文件要呈現連鎖表時，由宣告檔讀出成表，或由檢核器比對兩者一致
- 子容器粒度的連鎖，如整合 Product Map 對模組各層，仍寫在路由文件、列為檢核對象
- 檔案級決議流向的仲裁與跟隨放註冊表的 sub_mapping，規格見註冊流程文件

---

## 沿革區

宣告檔內保留帶日期的沿革區，記錄每次結構變更：

```yaml
history:
  - date: 2026-05-15
    change: 四層 git 重構，spec 與 impl 讓號給 design
  - date: 2026-07-21
    change: spec 與 design 對調、新增 quality 與 release、專案管理遷出
```

層結構變更史的唯一落點就是這裡。查一份檔能重建完整演化史，各 repo 說明文件不再維護結構沿革副本。
