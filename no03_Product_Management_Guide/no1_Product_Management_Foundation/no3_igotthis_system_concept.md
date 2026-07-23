# IGotThis 管理系統構想解讀

> 解讀 IGotThis 構想大綱。目標是一套涵蓋 roadmap、spec、project、design、dev、QA 的開發團隊管理系統。大綱來源為 PM 的 mindmap 盤點與後續口述補充，本文件記錄其設計意圖、資料模型、git 落地架構、風險與待決事項。

## 構想定位

- IGotThis 是自建管理系統的構想
- 落地形態：外連 GitHub 或 GitLab，是疊在 git hosting 之上的管理層
- requirement、product 與 roadmap、spec、design、dev、qa 六域各自有 git
- 六 git 是 per product，公司有幾個產品就開幾套
- 目標：產品開發的全部工件進同一套資料模型，追溯不再靠人腦
- 發展路徑：先內部自用驗證，跑順後商品化
- 在 Product Management 決策框架中的位置：
  - 決策框架的流程終點停在規格開發
  - IGotThis 承載框架中上游的產出物，如 Product Map 層級與需求池
  - 同時把框架未覆蓋的下游納入：排程、成本、開發追蹤、品質
- 定性：框架產出物的儲存層，加上框架下游的執行層
- 它不承載框架各層的判斷過程本身

---

## 現況與痛點

### 工具現況

- Priority List：個別 excel 檔維護
- Spec：按 feature 拆分，工具無版本控制
- Design：Figma
- Scope：Redmine 與 JIRA
- Timeline：以工期表達，個別 excel 檔維護，人工同步回 Priority List

### 痛點清單

- bug 發生時追不到原始 spec → 只能請 RD 翻 code 或問資深成員
- 施工時長無法管理 RD 績效，偷懶難以辨識
- 施工時長被灌水
- excel 之間人工同步 → 必然漏
- 沒有甘特圖
- branch 與 commit 對不到工單

### 根因歸納

- 真相分散：spec、priority、timeline、design 各自活在不同工具
- 工具之間無結構性鏈結 → 追溯靠人腦 → 人一走知識就斷

---

## 核心資料模型：雙軌設計

構想中份量最重的部分，本質是把 Git 的心智模型移植到產品管理。

```
通則：每個 git 的 main = 真相，每張工單 = 一條 branch，merge = 回寫真相
下圖是單一產品的六 git。多產品時每個產品各開一套

[requirement git]
    真相：WishList 需求列表，一個 table 檔（csv 或 db，格式未定）
    工單：Requirement 單 (.list)，異動 WishList
      Req A ─┐
      Req B ─┼─ N 對 1：一張 product 單可收多個 requirement
      Req C ─┘          一個 requirement 只能連一張 product 單，要多連就拆單
         │
         ▼
[product / roadmap git]
    工單：Product 單 = 一條 branch
          內容是修改多個 base layer 實例（如 Promotion、Wallet、Notice）
         │
         │ merge = 決策定案、回寫真相
         ▼
    真相：main = 已決策的產品樣貌（Product → Module → Feature 層級）
          被改的每個實例記錄 branch + commit
         │
         │ Epic 錨定實例的 commit，可多錨，依當時內容施工
         ▼
[專案管理階段]
    Development List：多個 epic 拖放排 priority，越上面越優先
    Epic (.epic) = 一個要上線的功能
      ├─ spec   母單 ─ 子單… ──▶ spec git 的 branch
      ├─ design 母單 ─ 子單… ──▶ design git 的 branch
      ├─ dev    母單 ─ 子單… ──▶ dev[project] git 的 branch
      └─ qa     母單 ─ 子單… ──▶ qa git 的 branch
         母單與子單都是 (.task)，branch 是自定義欄位
         團隊自訂 branch 欄位填在母單還是子單
         │
         │ 功能上線
         ▼
[spec git｜design git｜dev[project] git｜qa git]
    epic 底下所有 task 的 branch merge 進各 git 的 main
    下游四 git 的 main = 線上實際狀態
    對照：product git 的 main = 已決策方向，兩種 main 語意不同
```

### SourceOfTruth 真相軌

- 名詞世界，回答產品現在是什麼
- 型別：
  - `.list`：扁平集合，如 WishList
  - `.layer`：深度可自定的遞迴層級
- 範例軌道：
  - WishList：需求收單池，單一 Wish 可以不處理
    - 實體是 requirement git 裡的需求列表 table 檔
    - 檔案格式未定案，csv 或 db 檔
  - Product：Product → Module → Feature，層數可自定
  - Design：Token → Component → Screen
    - 實體是 html、css、JS 做的 mockup code
    - 設計工件 git 原生可 diff、可 merge，不依賴 Figma 檔
  - DevFE、DevBE、`Dev[Project]`：開發側真相
    - 拆分由團隊決定：by service、by code 專案、by 前後端
  - Quality：qa git 放測試案例文件，按功能分檔，層級劃分未定案

### ChangeRequest 異動軌

- 動詞世界，回答正在改什麼
- 型別：
  - `.list`：Requirement 專用，直接異動 WishList
  - `.epic`：一個要上線的功能，可錨定多個實例的 commit，明定不屬於 SourceOfTruth
  - `.task`：勞動單位；Spec、Design、Dev、QA 皆為 task 的具名變體
- 補充新增的環節：Product 單
  - PM 開立，上承 requirement，本體是 product git 的一條 branch
- 掛載規則：
  - task 一定掛在 epic 底下 → 禁止孤兒工單
  - task 之間可互掛為 subtask
  - 不同層級不可掛前後順序 → 依賴只存在同層 → 排程檢查可控

### TraceMap 追溯鏈

- 每類工單強制連到上一層工單
- 血緣鏈：Requirement → Product 單 → Epic → 各域母子單 → branch 與 commit
- epic 可錨定多個實例 → 追溯圖是分層 DAG，不是單親樹
- 往上走：這個 bug 違反哪條原始 spec
- 往下走：這條需求落到哪些改動
- TraceMap 不是附加功能，是整個模型的骨架

### Git 從隱喻升級為實作

- 補充概念定調：Git 不是類比，是系統的實作基礎
- SourceOfTruth ↔ 各域 git 的 main
- ChangeRequest ↔ 各域 git 的 branch
- 回寫 ↔ merge：merge 過的內容即真相
- 版本與快照 ↔ commit：diff 與歷史由 git 原生承載
- 設計含義：spec 像程式碼一樣被版本管理，字面為真

### 與 JIRA 單軌模型的差異

- JIRA 一切皆 issue → 只有工作資料庫 → 單子關閉後知識埋進封存
- spec 放 wiki → 與工單無結構鏈結 → 真相過期無人知
- IGotThis 拆成三問：
  - 真相軌回答現在是什麼
  - 異動軌回答改了什麼
  - TraceMap 回答為何而改、由誰而改

---

## 端到端流程

補充概念定義的完整流程，分需求、決策、執行三段。整體架構圖見核心資料模型章節。

### 需求段

- 任何角色在 requirement 開單，提出修改需求
- 單的實體：對需求列表 table 檔的一次異動
- bug 也在此階段開單，靠 requirement 的類型欄位區分 feature 與 bug
- bug 急修走 severity 分流：
  - P0 與 P1 走快速通道：直接開 epic，錨定該功能上線時的 commit，事後補 product 單
  - P2 以下與 feature 同流程，走完整鏈
- severity 判定：
  - 依固定判定表初判，開單者自行照表選級
  - 判定表以影響範圍分級，如全站不可用、主要功能失效、有替代路徑
  - PM 覆核，可改判
  - 覆核存在的理由：無覆核則急件浮報，快速通道變成繞流程的門
- 快速通道的補單：
  - 快速 epic 未關聯補開的 product 單即不可結案
  - 擋的是結案不是修復，急修速度不受影響
- PM 到 product 與 roadmap git 開單，關連對應的 requirement
- 基數規則：
  - 一張 product 單可關連多個 requirement
  - 一個 requirement 只能關連一張 product 單
  - 發現需要連到多張 → 拆 requirement

### 決策段

- 一張 product 單即 product git 的一條 branch
- branch 內容：修改多個 base layer 實例
- base layer 實例：Product 真相軌某層節點的實體，如 Promotion 這個 feature
- commit merge 後，每個被改的實例記錄 branch 與 commit
- merge 即決策定案 → 進入專案管理階段

### 執行段

- 專案管理階段涵蓋 spec、design、dev、qa
- 開 epic：一個 epic 是一個要上線的功能
- epic 錨定 base layer 實例記錄的 commit，可一次錨定多個實例
- 施工依據錨定當下的 commit 內容
- product main 後續前進時，PM 可把錨點 re-anchor 到新 commit
- re-anchor 後施工範圍跟著新版本調整
- 錨點漂移系統不主動提示，由 PM 自行盯 product main 動態
- 多個 epic 組成 development list，管理 epic 之間的 priority
- 各域開母單與子單，全部掛在 epic 底下
- 母子單範例，epic 為 promotion 新類型：
  - spec 母單：promotion 新類型
  - spec 子單：promotion setting 新類型、promotion 相關 report
  - design、dev、qa 有同構的母單與子單
- task 與 branch 的對應靠自定義欄位承載
- 團隊自訂 branch 欄位填在母單還是子單
- 功能上線後，epic 底下所有 task 的 branch merge 進各 git 的 main

### 兩種 main 的語意

- product git 在決策時 merge → main 是已決策的產品樣貌
- spec、design、dev、qa 在上線時 merge → main 是線上實際狀態
- 效果：查 spec main 看到線上行為，查 product main 看到決策方向
- 追溯出貨規格不看 product main 當下狀態，看 epic 錨定的 commit
- 錨定版本即該功能的規格依據，不需要另記已上線指標

### 反向流

- 決策推翻不走特殊流程，一律回需求段走新循環
- 推翻本身是新 requirement → 新 product 單 revert 決策
- 已上線的功能要動，再開新 epic 施工
- 反悔也是變更，同軌留痕，TraceMap 不留洞

---

## 功能構想與痛點對應

### 對應矩陣

- 全解：
  - 沒有甘特圖 → Gantt 功能直接補上，加依賴檢查與紅線警示
  - 人工同步會漏 → 單一資料模型後，同步環節整個消失
  - Priority List 靠 excel 維護 → Development List 拖放排序承接
  - 追原始 spec → epic 錨定 commit，出貨時點快照由 git 承載
  - branch 與 commit 對不到工單 → 工單即 branch，關聯是機制本身
- 全解的殘留細節：
  - bug 追溯要看 spec git 哪個 commit，與 product 錨點的對齊規則待定
- 績效類痛點的裁決：
  - 系統不做個人記點排名，只記客觀事實
  - severity、來源、commit 關聯、工時全留存
  - 報表預設團隊視角，個人判斷由主管質性進行
  - 理由：指標變目標就失真，灌水痛點即證據
  - 工時採人工填報，系統不做真實性驗證

### 功能清單

- Development List，與 Gantt 合併為同一面板：
  - 一體兩投影：拖放清單加時間軸
  - 清單：多個 epic 拖放排 priority，越上面優先級越高
  - 時間軸：同一批 epic 與 task 的排程投影
  - 展開 epic 可見母子單與 epic 內的 subtask 前後關係
  - 不同 epic 的 subtask 在資料結構上不互相關聯
  - 逐 task 可開關排序檢查，異常顯示紅線，可強制系統重排
  - 疊圖維度可選 Product Layer，也可只顯示特定 Layer
  - 一次開發可牽動多個平行 Layer，如 Promotion 重構動到 Promotion、Wallet、Notice
  - 人員撞期屬管理政策，不是系統硬約束
  - 面板提供篩選：找出同一時段持有多張工單的人
  - 語意分工：清單承載意圖排序，時間軸承載推導排程，紅線呈現兩者矛盾
- 成本計算表：
  - 以人與 Product 兩個維度彙總
  - Product 維度是公司底下的不同產品，施工環境完全切開
  - 不切到模組層：共用元件被改時，成本歸屬講不清
  - 人可跨產品，工時跟著 task 走，task 屬於哪個產品就記哪個產品
  - AI 產出的 task 不計工時，成本表不涵蓋 AI 施工代價
  - 計算 BurnDownRate，納入休假與國定假日
  - 工時來源：人工填報，由執行者自行填寫每張 task 花費
  - 不採系統推算，狀態時間差含等待與阻塞，不等於工作量
- TraceMap：每類工單連上一層
- 自定義產品層次：層級名稱與深度可配置
- 自定義表單：
  - 結構分 Epic、Task，欄位名稱與值類型可配置
  - Requirement 也可自定義欄位，如類型欄位區分 feature 與 bug
  - branch 欄位填在母單或子單，由團隊自定義
- 使用者管理：
  - 國家、地區、聯絡方式、role
  - 人不綁定單一產品，可同時支援多個產品
- 工作日設定：按國家與縣市
- AI Workflow：
  - 各角色提需求 → 資料拉到 local → AI 產出結論並施工
  - 輸入包含 code base 與 spec base
  - 產出邊界：AI 只產 branch 與 commit，merge 一律由人 review 後執行
  - 理由：merge 即回寫真相，該由人把關
  - AI 產出的 task 標記為 AI 產出，工時欄留空

---

## 與市面工具的對照

### 市面成熟功能

- Gantt 與依賴重排：ClickUp、Monday、MS Project 皆現成
- 自定義表單與自定義階層：JIRA、Azure DevOps 皆可配置
- branch 與 commit 關聯工單：JIRA smart commit、Linear、Azure DevOps 原生支援
- 測試管理：TestRail、Xray、Azure Test Plans
- 假日與工時：Tempo 生態

### 真差異化

- 真相軌與異動軌的實體分離：市面工具只有工單，沒有系統現況的真相庫
- spec 結構化分層並與工單機制性連動：現有工具的 spec 是自由文本
- TraceMap 級的強制追溯：一般 PM 工具靠人工紀律，合規級 ALM 工具昂貴且體驗差
- 結構化 spec 餵 AI 施工：spec 結構化程度決定 AI 品質，現成工具沒有結構化 spec
- 上一版列的前提已由 git 架構滿足：回寫即 merge、版本由 commit 承載

### build vs buy 判斷準則

- 兩個以上現成工具已成熟的功能 → 用現成，自建無護城河
- 價值來自統一資料模型與 schema 強制 → 值得自建，但自建資料層與薄層工具
- 市場真空且與自身 workflow 綁定 → 值得自建且要快，如 spec 餵 AI

### 與 git hosting 的分工

- hosting 原生就有：branch 建立 API、merge webhook、protected branch、commit 比對
- IGotThis 要自建的三層：
  - branch 欄位與 hosting 實際 branch 的對應驗證，命名本身不強制
  - webhook 回寫 handler：merge 事件發生 → 反查工單 → 寫回真相
  - 上線時的跨 repo merge 協調器
- hosting 沒有跨 repo 原子 merge，協調器是整合工程最大的一塊
- 選型訊號：
  - GitLab 原生 epic、依賴、group 權限繼承，對映度高，關鍵能力綁 Premium
  - GitHub 需以 Projects 與 sub-issues 拼裝，權限能力綁 Enterprise
  - 需要 on-prem 落地時 GitLab self-managed 較成熟，此前提會翻轉選型

---

## 設計風險

### 組態複雜度

- 自定義層次加自定義表單 → 全部報表要寫成泛型才能運作
- 中途改層次定義時，既有工單如何遷移未定義

### 其他風險

- 強制重排會覆寫人工排程，且無排程版本快照可回復
- 縣市級颱風假無可靠 API → 需人工當日登錄
- AI Workflow 一行的工程量超過其餘功能總和，宜標記為第二階段
- AI task 不計工時 → AI 比重升高時，成本表與 BurnDownRate 逐漸失真
- Problems 的 Design 與 QA 兩節空白 → 需求訪談有缺口，對應構件有過度設計風險

---

## 與決策框架的銜接

### 概念對應

- WishList ↔ 需求層的需求池
- 單一 Wish 可不處理 ↔ 落地層的保留待未來時機
- Product 真相軌的層級 ↔ 整合層產出的 Product Map
- TraceMap ↔ 各層產出物之間的追溯關係
- Epic 與 Task ↔ 落地層 Roadmap 的交付單位

### 未被制度化的部分

- 框架各層的判斷活動無對應欄位：三論證、效益風險評估、含金量排序、外部因素篩選
- 落地層四因素只有資源限制被成本計算表覆蓋
- 結論：IGotThis 制度化了產出物與追溯，尚未制度化判斷

### 依框架標準的自我檢核

- 大綱結構本身就是需求層模板的實例：
  - SetUp ↔ 問題出現前用什麼方式處理
  - Problems ↔ 問題根源
  - Solution ↔ 評估方案
- 依框架標準的三個缺口：
  - 方案發散只有自建一案，未評估既有工具擴充
  - 逐方案的效益與風險兩節空白
  - 提案層整層跳過，尤其不可取代性論證
- 依框架自身邏輯，IGotThis 尚未通過 Go 與 No-Go 閘門

### 用語待統一

- Requirement 一詞雙義：框架指問題分析單位，大綱指異動軌型別
- Product Layer 與 Product Map 實質相同、名詞不同
- base layer 實例、真相節點、Product Layer 三詞疑似同物，需定名
- product 與 roadmap 合稱一個 git，與框架的 Product Map 及 Roadmap 對應待定名
- Product Map 要求的優先順序屬性，大綱未說存放在哪
- MVC 管理 Spec 的 MVC 未定義，需與規格寫作政策的分層對齊命名

---

## 待決事項

### 資料模型

- branch 粒度已定為自定義欄位，殘留：TraceMap 與上線收斂要同時支援母單與子單兩種掛法
- branch 欄位漏填或填錯的偵測機制
- WishList table 檔案格式未定案：csv 可 diff，db 檔進 git 難 diff 與 merge
- severity 判定表的實際級距內容待展開
- subtask 互掛的環偵測規則
- Timeline 現況以工期表達，工期制與日期制排程對 Gantt 設計含義不同

### 產品決策

- hosting 選型：GitHub 還是 GitLab，付費級距與 on-prem 需求會翻轉結論
- build vs buy：全工件版本化是市面沒有的能力，素材增強，但論證仍未寫
- 遷移策略：Redmine、JIRA、excel 既有資料怎麼搬，過渡期如何避免雙軌漏同步
- Figma 在流程中的角色：mockup 進 git 後，Figma 是上游草稿還是退場
- 權限模型：角色乘六 git 乘產品數的權限矩陣，加上跨產品人員的可見範圍
- repo 數量隨產品線性成長，命名與分組規則待定
