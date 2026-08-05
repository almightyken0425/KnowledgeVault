# QA 工具

## 文件定位

- 檢驗點清單的執行面配套，分對賬與清單維護兩類
- 判準本體在 `rules/`，共用模組在 `lib/`，進入點在 `bin/`
- 與清單的接點是檢驗點 ID，不另建平行編號

---

## 四支工具

### 對賬三支

執行回歸時用。各對應一個驗證面，面欄的定義見清單索引。

| 工具 | 對應面 | 分母 | 職責 |
| --- | --- | --- | --- |
| `bin/db-reconcile.mjs` | `DB` | 230 | 本機 sqlite 快照、多點 diff、樣板判定 |
| `bin/log-reconcile.mjs` | `LOG` | 87 | QA marker 掃描、三向漂移、CDP 錄製與判定 |
| `bin/fb-reconcile.mjs` | `FB` | 19 | Firestore 讀取與雲端六集合對賬 |

分母各面獨立。DB 面 230 是 389 條扣掉已 jest 覆蓋的 159 條。這三個數與清單索引的 1481 與 456 不同口徑，報表頂端一律寫明，不混用。

### 清單維護一支

改清單時用。停雙寫的執行者。

| 工具 | 職責 |
| --- | --- |
| `bin/checklist.mjs` | 分冊解析、衍生物生成、七項機械自檢、提交閘門 |

十五冊是唯一來源，其餘檔案的表格由它生成。改斷言只改分冊一處，跑 `generate --write` 即同步；手改生成區會被 `check` 擋下。

搬遷無損驗過：同一份分冊生成出來的 963 步場次表與原手抄檔逐字零差，`no0_index` 與 `no2_spec_gaps` 兩份也逐字相同。唯一的內容差是修掉一處手抄錯——`categoryLogic.test.ts` 原記 16 條、實為 17 條，漏 `C-UI-106`。成因是一條檢驗點由多對測試共同覆蓋時只採計第一對。

---

## 環境需求

- Node v22.5 以上。`node:sqlite` 的 `DatabaseSync` 與全域 `WebSocket` 在該版本才穩定內建
- 零 npm 依賴。不裝套件、不編原生模組、不新增相依
- 執行機為 macOS 加 iOS simulator；開發機為 Windows

### 哪些子指令在 Windows 跑得動

取檔是人工前置、與平台無關，所以絕大多數子指令兩邊都跑得動。

- 全部跑得動：`db-reconcile` 除 `pull` 外的每一個子指令，只要手上有 `.db` 檔
- 全部跑得動：`log-reconcile` 的 `scan-impl`、`drift`、`dead`、`parse`、`self-test`
- 全部跑得動：`fb-reconcile` 的 `traps` 與 `self-test`
- 全部跑得動：`checklist` 的每一個子指令。純檔案作業，與平台無關
- 需要 macOS：`db-reconcile pull`，因為要 `xcrun simctl` 找 app 容器
- 需要 Metro 與 app 在跑：`log-reconcile record`
- 需要憑證與外網：`fb-reconcile` 的其餘子指令

平台不符時給的是完整句子加下一步建議，不是 stack。

---

## 設定

- 複製 `config.example.json` 成 `config.json` 後填值。`config.json` 含本機絕對路徑、不進 git
- `implRoot` 指到 impl git 根目錄，用來解 `assets/definitions/` 的幣別與圖示定義
- 也可改用 `--impl-root` 參數或環境變數 `SUSUGIGI_IMPL_ROOT`
- Firestore 憑證放 `serviceAccountKey.json`，已在 gitignore 內
- 場次產出落 `runs/<run-id>/`，含真實使用者資料的資料庫快照，已在 gitignore 內

---

## 共通約定

### 退出碼

四支一致，不可各自解讀。

| 碼 | 意義 |
| --- | --- |
| `0` | 全判定完成且無 FAIL |
| `1` | 有 FAIL |
| `2` | 環境或參數不符 |
| `3` | 跑得完但零筆可判 |
| `4` | 未預期例外 |

### 裁決五態

| 裁決 | 意義 |
| --- | --- |
| `PASS` | 該條真的有實際值支撐 |
| `FAIL` | 判準成立且證據指向不符 |
| `UNRESOLVABLE` | 判準成立但本場證據不足 |
| `STALE` | 前置已隨無帳號整改作廢 |
| `NO_CRITERION` | 清單根本沒給判準 |

四類非 `PASS` 各自聚合成段，不混在逐條清單裡讓執行者自己數。

### 禁止靜默報綠

查不到、連不上、解析到零筆、篩選後零條，一律非零退出碼。`PASS` 只在該條真的帶得出實際值時才給，帶不出來自動降級為 `UNRESOLVABLE`。

零筆報成通過是最危險的失敗模式。它讓人以為驗過了，實際什麼都沒驗。

### 安全模型

- 值走參數綁定，識別子走執行期反查的白名單再插值。SQLite 綁不了識別子，這是唯一安全解
- 對賬路徑一律唯讀開啟，寫入另有獨立子指令與多道確認
- schema 與 marker 皆執行期反查、不寫死。與清單對不上時報漂移，不報 FAIL

---

## 常用流程

### 本機資料對賬

```bash
node bin/db-reconcile.mjs snapshot <db-path> --label baseline --run-id r1
node bin/db-reconcile.mjs snapshot <db-path> --label post-action --run-id r1
node bin/db-reconcile.mjs diff --baseline baseline --current post-action --run-id r1
node bin/db-reconcile.mjs run --current post-action --baseline baseline --run-id r1
```

### marker 漂移檢查

```bash
node bin/log-reconcile.mjs scan-impl --impl-root <impl git 根目錄>
node bin/log-reconcile.mjs drift --impl-root <impl git 根目錄>
```

### 清單維護

改分冊之後跑這兩步，順序不可顛倒。

```bash
node bin/checklist.mjs generate --write
node bin/checklist.mjs check --impl-root <impl git 根目錄> --spec-dir <spec 目錄>
```

提交閘門裝一次即可，之後每次 commit 自動跑。

```bash
sh hooks/install.sh
```

### 自測

四支各有離線自測，不需裝置與網路。改動工具後先跑這個。

```bash
node bin/db-reconcile.mjs self-test
node bin/log-reconcile.mjs self-test
node bin/fb-reconcile.mjs self-test
node bin/checklist.mjs self-test
```

---

## 自測涵蓋什麼與不涵蓋什麼

涵蓋的是工具本身正確：canned query 的 SQL 語法、判定分類的正負面案例、參數解析的錯誤路徑、唯讀與白名單是否真的擋得住。自測全綠代表工具沒壞，不代表受測 app 沒問題。

不涵蓋的是語意正確性：樣板對真實資料判得對不對，要拿到真 `.db` 才算數。整條端到端鏈路、CDP 交握、對真 Firestore 的一切，都要在執行機上驗。

自測本身跑過突變測試把關。對賬側刻意改壞金額倍率、墓碑判定、識別子白名單、忽略欄設定、作廢名單，五種突變都被抓到；清單側刻意改壞表頭取欄、頓號解析、檢查點推導、分冊排序、零列守衛、生成區替換，六種突變也都被抓到。

---

## 清單漂移的處置

清單尚未跟進無帳號整改，作廢名單持於 `rules/stale.mjs`。

```bash
node bin/db-reconcile.mjs stale --why
```

作廢條目標 `STALE` 而非 `FAIL`。判成 `FAIL` 會讓缺陷登記灌滿清單自己的問題，掩蓋真正的 app 缺陷。

名單只是子集。清單整體的跟進缺口見清單索引的抽取基線段，身分面與訂閱面的結果一律標條件成立。
