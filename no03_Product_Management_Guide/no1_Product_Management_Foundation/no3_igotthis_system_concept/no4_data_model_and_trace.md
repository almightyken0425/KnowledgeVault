# 資料模型與追溯

> 本篇回答工單如何對應 branch、追溯鏈如何成形。建議先讀所有權檔位篇與組織與泛型結構篇。

## 通則

- 本篇描述單一 `Management<T>` 內部的運作
- 本質是把 Git 的心智模型移植到產品管理
- 每張工單等於一條 branch，merge 等於回寫真相
- 檔位 A 無 branch 也無 merge，寫入即生效
- 檔位 C 的真相是 git 的 main，系統只持有 commit 指標
- 兩檔位的推導細節見所有權檔位篇
- 全鏈總覽圖畫的是單一 Container 的六個領域，多 Container 時各開一套

---

## 全鏈總覽圖

- 全鏈拆成兩張圖：需求到決策一張，執行到上線一張
- 需求到決策圖回答需求如何收斂成產品決策

```mermaid
flowchart TD
    subgraph REQ["requirement 資料庫 檔位 A"]
        RA["Requirement 甲"]
        RB["Requirement 乙"]
        RC["Requirement 丙"]
    end
    subgraph RM["roadmap repo 檔位 C"]
        PD["Product 單對應一條 branch"]
        TR["main 已決策的產品樣貌"]
    end
    RA -->|"N 對 1"| PD
    RB -->|"N 對 1"| PD
    RC -->|"N 對 1"| PD
    PD -->|"PM 在 git merge 即決策定案"| TR
```

- requirement 資料庫無 repo 掛勾，真相與異動塌成同一物件
- WishList 是需求列表，一列一張 Requirement 單
- 單內含 title、description、自定義欄位
- 一張 Product 單可收多個 requirement
- 一個 requirement 只能連一張 Product 單，要多連就拆單
- Product 單的內容是修改 roadmap 文件
- merge 後系統持有新的 commit 指標
- 執行到上線圖回答決策如何落到檔位 C 四領域的 git

```mermaid
flowchart TD
    RC["roadmap commit"]
    subgraph PMO["專案管理階段"]
        EP["Epic 跨領域工作容器"]
        SM["spec 母單與子單"]
        DM["design 母單與子單"]
        VM["dev 母單與子單"]
        QM["qa 母單與子單"]
    end
    subgraph GITS["檔位 C 四領域的 git"]
        SG["spec git 的 main"]
        DG["design git 的 main"]
        VG["dev git 的 main"]
        QG["qa git 的 main"]
    end
    RC -->|"Epic 錨定 roadmap commit 可多錨"| EP
    EP --> SM
    EP --> DM
    EP --> VM
    EP --> QM
    SM -->|"上線 merge"| SG
    DM -->|"上線 merge"| DG
    VM -->|"上線 merge"| VG
    QM -->|"上線 merge"| QG
```

- Development List 收多個 Epic 拖放排 priority，排序越前越優先
- Epic 是 scope 跨領域的工作容器，不綁單一領域
- 錨點有值 → 有對應的產品決策，如一個要上線的功能
- 錨點為空 → 無對應決策，如發版回歸、例行維護
- 施工依據錨定 commit 當下的 roadmap 內容
- 母單與子單同型，差別只在有無父單
- branch 是自定義欄位，團隊自訂填在母單還是子單
- dev git 依專案拆分，泛型寫法是 `Dev[Project]`
- 功能上線後，Epic 底下所有 Task 的 branch merge 進各 git 的 main
- 各 git 由負責人自行 merge，系統只顯示進度、不協調
- 四領域 git 的 main 是線上實際狀態，內容系統不解析
- 對照 roadmap main 是已決策的產品樣貌，兩者語意不同

---

## 各領域的 repo 與工件

- 真相本體在各領域掛勾 repo 的 main，系統只持有指向
- repo 掛勾由檔位決定
  - 檔位 A：不掛 repo，異動列本身即真相
  - 檔位 C：掛一個使用者 repo，工單以 commit 指標指向
- 範例共六條
  - WishList：需求收單池，單一 Wish 可以不處理
    - 檔位 A，實體是資料庫裡的需求列表，一列一張單
    - 單內含 title、description、自定義欄位
    - description 支援 markdown 與截圖
  - Roadmap：檔位 C，實體是使用者 roadmap repo 內的 roadmap 文件
    - 內容形式是使用者的文件約定，系統不解析、不持有
    - PM 在本機編輯，系統只持有 commit 指標
  - Spec：檔位 C，實體是使用者 repo 內的規格文件
    - 分幾層由使用者寫文件時自訂，系統不切分
    - 改動內容寫在工單的 description
  - Design：檔位 C，實體是 html、css、JS 做的 mockup code
    - 工件 git 原生可 diff、可 merge，不依賴 Figma 檔
    - repo 內怎麼分層是使用者的目錄約定，系統不持有
  - DevFE、DevBE 與 `Dev[Project]`：檔位 C，開發側真相
    - 拆分由團隊決定：by service、by code 專案、by 前後端
  - Quality：檔位 C，qa git 只放回歸測試流程文件
    - 高度整理過的流程，每次 production 更新改一版
    - 功能測試案例不進 git，寫在該 Epic 的 QA 單裡
    - 兩者不共用：功能測試的前提與步驟與回歸測試不同

---

## 工單模型

- 工單回答正在改什麼
- 所有工單同一型別，差別只在兩個欄位
  - scope：跨領域的工作容器，或綁定單一領域
  - parent：有無父單
- 工作容器即 Epic，scope 跨領域
  - 可錨定 roadmap commit，錨點欄位允許為空
  - 錨點有值：有對應的產品決策，典型是一個要上線的功能
  - 錨點為空：無對應決策，如發版回歸、例行維護
  - 不另設型別欄位，避免與錨點狀態不同步
  - 皆進 Development List 排 priority，因為都佔人力
- 勞動單位即 Task，scope 綁單一領域
  - 泛型形式是 `Task<T>`
  - Spec、Design、Dev、QA 是同一型別的四次實例化，非四個型別
  - 母單與子單同型，差別只在有無父單
- 排序是工單上的持久欄位，不是查詢時算出來的
- Product 單：PM 開立，上承 requirement
  - 本體是 roadmap 側的一條 branch
- 掛載規則
  - Task 一定掛在工作容器底下 → 禁止孤兒工單
  - Task 之間可互掛為 subtask
  - 不同層級不可掛前後順序 → 依賴只存在同層 → 排程檢查可控
- 排程依賴與追溯關聯是兩種邊，不可混用
  - 追溯走 ref 型別欄位，排程走同層的前後順序邊

---

## 兩種真相的語意

- 本節只涉及帶 repo 掛勾的領域
- merge 時機是領域約定，不由檔位推導
- roadmap 在決策時 merge → main 是已決策的產品樣貌
- 其餘四域在上線時 merge → main 是線上實際狀態
- 效果：查 spec main 看到線上行為，查 roadmap main 看到決策方向
- 追溯出貨規格不看 roadmap main 當下狀態，看 Epic 錨定的 commit
- 錨定 commit 即該功能的決策依據，不需要另記已上線指標
- 出貨當時的規格文件本體，由該 Epic 底下 Task 的 commit 承載

---

## Git 從隱喻升級為實作

- 概念定調：Git 不是類比，是系統的實作基礎
- 對照表對五個帶 git 的領域字面成立

| 模型概念 | git 對應 | 語意 |
|---|---|---|
| 真相 | 各域 git 的 main | 產品現在是什麼 |
| 工單 | 各域 git 的 branch | 正在改什麼 |
| 回寫 | merge | merge 過的內容即真相 |
| 版本與快照 | commit | diff 與歷史由 git 原生承載 |

- 設計含義：spec 像程式碼一樣被版本管理，字面為真
- 檔位 A 完全不適用，無 branch 也無 merge

---

## TraceMap 追溯鏈

- 每類工單強制連到上一層工單
- 血緣鏈：Requirement → Product 單 → roadmap commit → Epic → 各域母子單 → branch 與 commit
- Epic 可錨定多個 roadmap commit → 追溯圖是分層 DAG，不是單親樹
- 血緣圖回答追溯 DAG 長什麼樣、錨點為空的 Epic 收在哪

```mermaid
flowchart TD
    R1["Requirement 甲"]
    R2["Requirement 乙"]
    PD["Product 單"]
    RC["roadmap commit"]
    E1["Epic 有錨點"]
    E0["Epic 錨點為空"]
    SM["spec 母單"]
    SC["spec 子單"]
    SB["spec branch 與 commit"]
    VM["dev 母單"]
    VB["dev branch 與 commit"]
    QM["qa 單"]
    QB["qa branch 與 commit"]
    R1 --> PD
    R2 --> PD
    PD -->|"merge 產生"| RC
    RC -->|"錨定"| E1
    E1 --> SM
    SM --> SC
    SC --> SB
    E1 --> VM
    VM --> VB
    E0 --> QM
    QM --> QB
```

- 錨點為空的 Epic，追溯鏈在此處收束，不往上接 Product 單
  - 這是刻意的容器，不是斷鏈
  - 不屬於任何決策的工作有處可掛，孤兒工單維持禁止
- 往上走：這個 bug 違反哪條原始 spec
- 往下走：這條需求落到哪些改動
- 追溯精度統一為 commit 級
  - 檔位 A 例外，精度到資料列 id
  - 要看條目得自行打開該 commit，系統不解析內容
- TraceMap 不是附加功能，是整個模型的骨架

---

## 與 JIRA 單軌模型的差異

- JIRA 一切皆 issue → 只有工作資料庫 → 單子關閉後知識埋進封存
- spec 放 wiki → 與工單無結構鏈結 → 真相過期無人知
- IGotThis 拆成三問
  - 現在是什麼：repo 掛勾指向的 main 回答
  - 改了什麼：工單回答
  - 為何而改、由誰而改：TraceMap 回答
- 系統對每個帶 repo 的領域持有強制掛勾與 ref 欄位，內容本體留在 git
  - 差異在有沒有這條強制指標，不在誰持有內容
- 一條需求從開單到上線的逐段旅程，見端到端流程篇
