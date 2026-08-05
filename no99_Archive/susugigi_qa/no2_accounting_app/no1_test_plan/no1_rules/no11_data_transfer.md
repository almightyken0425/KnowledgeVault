# 檢驗點：資料轉移

> **語意跟進未完成。** 132 條無一退場，但 9 條寫著帳號語彙。涉及換帳號與他人帳號的前置已不可佈置，待重判。跟進進度見索引。

檢驗點清單分冊。欄位定義、自檢方式與全冊索引見 `../no0_index.md`。

- 域碼：C-XF
- 涵蓋：資料管理畫面、匯入精靈四步流程、欄位掃描與候選、日期解析、匯入執行、匯出、範本與說明檔

---

## 畫面：資料管理

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-XF-001 | 資料管理列表分匯入、匯出、清除三組 | UI | T1 | P2 | `no14_data_management_screen` | `src/screens/Settings/DataManagementScreen.tsx` | 已登入 | — | — | 現役 |
| C-XF-002 | 資料管理列表不顯示分組標題文字 | UI | T1 | P2 | `no14_data_management_screen` | `src/screens/Settings/DataManagementScreen.tsx` | 已登入 | — | — | 現役 |
| C-XF-003 | 點按匯入收入支出導航至匯入精靈交易模式 | UI | T1 | P1 | `no14_data_management_screen` | `src/screens/Settings/DataManagementScreen.tsx` | 已登入 | — | — | 現役 |
| C-XF-004 | 點按匯入轉帳導航至匯入精靈轉帳模式 | UI | T1 | P1 | `no14_data_management_screen` | `src/screens/Settings/DataManagementScreen.tsx` | 已登入 | — | — | 現役 |
| C-XF-005 | 匯出進行中阻擋重複觸發直到完成 | UI | T1 | P1 | `no14_data_management_screen` | `src/screens/Settings/DataManagementScreen.tsx` | 已有交易資料 | — | — | 現役 |
| C-XF-006 | 點按匯出收入支出以交易類型匯出 | UI | T1 | P1 | `no14_data_management_screen` | `src/screens/Settings/DataManagementScreen.tsx` | 已有交易資料 | — | — | 現役 |
| C-XF-007 | 點按匯出轉帳以轉帳類型匯出 | UI | T1 | P1 | `no14_data_management_screen` | `src/screens/Settings/DataManagementScreen.tsx` | 已有轉帳資料 | — | — | 現役 |
| C-XF-008 | 無資料可匯出時顯示無資料對話框 | UI | T3 | P1 | `no14_data_management_screen` | `src/screens/Settings/DataManagementScreen.tsx` | 全新帳號且無任何紀錄 | — | — | 現役 |
| C-XF-009 | 取消分享面板時不顯示匯出失敗對話框 | UI | T1 | P2 | — | `src/screens/Settings/DataManagementScreen.tsx` | 已有交易資料且分享面板已開啟 | — | — | 現役 |
| C-XF-010 | 匯出失敗時顯示匯出失敗對話框 | UI | T4 | P2 | `no14_data_management_screen` | `src/screens/Settings/DataManagementScreen.tsx` | 不適用 | 寫檔失敗情境無手動入口 | — | 現役 |
| C-XF-011 | 點按清除資料庫顯示確認對話框 | UI | T1 | P0 | `no14_data_management_screen` | `src/screens/Settings/DataManagementScreen.tsx` | 已登入 | — | — | 現役 |
| C-XF-012 | 確認清除成功後顯示已清除並提示重啟 App | UI | T3 | P1 | `no14_data_management_screen` | `src/screens/Settings/DataManagementScreen.tsx` | 可棄用的測試帳號 | — | — | 現役 |
| C-XF-013 | 清除確認對話框點取消不執行清除、不寫入 | UI+DB | T2 | P0 | — | `src/screens/Settings/DataManagementScreen.tsx` | 已有交易資料 | — | — | 現役 |
| C-XF-014 | 清除失敗時顯示清除失敗對話框 | UI | T4 | P2 | `no14_data_management_screen` | `src/screens/Settings/DataManagementScreen.tsx` | 不適用 | 清除失敗無手動入口 | — | 現役 |

---

## 畫面：匯入精靈導航

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-XF-015 | 匯入精靈標題隨步驟切換為四種文案 | UI | T3 | P2 | `no15_import_wizard_screen` | `src/screens/Settings/ImportScreen.tsx` | 備妥可走完四步的合法 CSV | — | — | 現役 |
| C-XF-016 | 選擇檔案步驟左動作為關閉 | UI | T1 | P1 | `header_policy` | `src/screens/Settings/ImportScreen.tsx` | 已進匯入精靈 | — | — | 現役 |
| C-XF-017 | 其餘步驟左動作為返回 | UI | T1 | P1 | `header_policy` | `src/screens/Settings/ImportScreen.tsx` | 已在欄位對應步驟 | — | — | 現役 |
| C-XF-018 | 預覽步驟右動作為送出 | UI | T1 | P1 | `header_policy` | `src/screens/Settings/ImportScreen.tsx` | 已在預覽步驟 | — | — | 現役 |
| C-XF-019 | 其餘步驟右動作為前進 | UI | T1 | P1 | `header_policy` | `src/screens/Settings/ImportScreen.tsx` | 已進匯入精靈 | — | — | 現役 |
| C-XF-020 | 當前步驟驗證未通過時右動作不可點按 | UI | T1 | P1 | `header_policy` | `src/screens/Settings/ImportScreen.tsx` | 已進匯入精靈且未選檔案 | — | — | 現役 |
| C-XF-021 | 匯入精靈步驟導航由導航列承載、無底部導航列 | UI | T1 | P2 | `header_policy` | `src/screens/Settings/ImportScreen.tsx` | 已進匯入精靈 | — | — | 現役 |
| C-XF-022 | 點按關閉關閉 Modal | UI | T1 | P1 | `no15_import_wizard_screen` | `src/screens/Settings/ImportScreen.tsx` | 已進匯入精靈 | — | — | 現役 |
| C-XF-023 | 點按返回回到上一步驟 | UI | T1 | P1 | `no15_import_wizard_screen` | `src/screens/Settings/ImportScreen.tsx` | 已在欄位對應步驟 | — | — | 現役 |
| C-XF-024 | 點按前進進到下一步驟 | UI | T3 | P1 | `no15_import_wizard_screen` | `src/screens/Settings/ImportScreen.tsx` | 已選好合法 CSV | — | — | 現役 |

---

## 畫面：選擇檔案步驟

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-XF-025 | 來源時區區塊含標題與解析說明文字 | UI | T1 | P2 | `no15_import_wizard_screen` | `src/screens/Settings/ImportScreen.tsx` | 已進匯入精靈 | — | — | 現役 |
| C-XF-026 | 來源時區選擇器常駐展開、不另跳畫面 | UI | T1 | P1 | `no15_import_wizard_screen` | `src/screens/Settings/ImportScreen.tsx` | 已進匯入精靈 | — | — | 現役 |
| C-XF-027 | 來源時區預設帶使用者目前偏好時區 | UI | T1 | P1 | `no15_import_wizard_screen` | `src/screens/Settings/ImportScreen.tsx` | 偏好時區已改為非預設值 | — | — | 現役 |
| C-XF-028 | 已選擇檔案時顯示檔案名稱 | UI | T3 | P1 | `no15_import_wizard_screen` | `src/screens/Settings/ImportScreen.tsx` | 裝置上備有合法 CSV | — | — | 現役 |
| C-XF-029 | 已選擇檔案時選擇檔案按鈕改為重新選擇文案 | UI | T3 | P2 | — | `src/screens/Settings/ImportScreen.tsx` | 裝置上備有合法 CSV | — | — | 現役 |
| C-XF-030 | 選擇非 CSV 檔案時顯示僅支援 CSV 對話框 | UI | T3 | P1 | `no15_import_wizard_screen` | `src/screens/Settings/ImportScreen.tsx` | 裝置上備有非 CSV 檔 | — | — | 現役 |
| C-XF-031 | 取消系統檔案選擇器時不顯示任何對話框 | UI | T1 | P2 | — | `src/screens/Settings/ImportScreen.tsx` | 已進匯入精靈 | — | — | 現役 |
| C-XF-032 | 選擇損壞的 CSV 後點按前進才顯示讀取失敗對話框 | UI | T3 | P1 | `no15_import_wizard_screen` | `src/screens/Settings/ImportScreen.tsx` | 裝置上備有損壞的 CSV | — | — | 現役 |
| C-XF-033 | 點按下載範本開啟系統分享面板 | UI | T1 | P1 | `no15_import_wizard_screen` | `src/screens/Settings/ImportScreen.tsx` | 已進匯入精靈 | — | — | 現役 |
| C-XF-034 | 點按下載說明開啟系統分享面板 | UI | T1 | P1 | `no15_import_wizard_screen` | `src/screens/Settings/ImportScreen.tsx` | 已進匯入精靈 | — | — | 現役 |
| C-XF-035 | 取消分享面板時不顯示下載失敗對話框 | UI | T1 | P2 | — | `src/screens/Settings/ImportScreen.tsx` | 已進匯入精靈 | — | — | 現役 |
| C-XF-036 | 下載操作失敗時顯示下載失敗對話框 | UI | T4 | P2 | `no15_import_wizard_screen` | `src/screens/Settings/ImportScreen.tsx` | 不適用 | 分享失敗情境無手動入口 | — | 現役 |
| C-XF-037 | 選擇來源時區更新匯入解析所用時區 | UI+DB | T3 | P0 | `no15_import_wizard_screen` | `src/screens/Settings/ImportScreen.tsx` | 備有日期無偏移後綴的 CSV | — | — | 現役 |

---

## 畫面：欄位對應步驟

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-XF-038 | 欄位對應列表每個系統欄位一列 | UI | T1 | P1 | `no15_import_wizard_screen` | `src/screens/Settings/ImportScreen.tsx` | 已在欄位對應步驟 | — | — | 現役 |
| C-XF-039 | 欄位對應列表依匯入模式切換系統欄位清單 | UI | T3 | P1 | `no15_import_wizard_screen` | `src/screens/Settings/ImportScreen.tsx` | 兩模式各備有合法 CSV | — | — | 現役 |
| C-XF-040 | 欄位對應列只顯示系統欄位名稱、不顯示必填標記 | UI | T1 | P1 | `no15_import_wizard_screen` | `src/screens/Settings/ImportScreen.tsx` | 已在欄位對應步驟 | — | — | 現役 |
| C-XF-041 | 欄位選擇器收合態顯示目前對應的 CSV 欄位 | UI | T1 | P1 | `no15_import_wizard_screen` | `src/components/SearchableDropdown.tsx` | 已在欄位對應步驟 | — | — | 現役 |
| C-XF-042 | 無符合格式的可用欄位時選擇器展開為空清單、不顯示提示 | UI | T1 | P1 | `no15_import_wizard_screen` | `src/components/SearchableDropdown.tsx` | 已在欄位對應步驟且該必填欄含非法值 | — | — | 現役 |
| C-XF-043 | 選擇 CSV 欄位更新該系統欄位的對應 | UI | T1 | P1 | `no15_import_wizard_screen` | `src/screens/Settings/ImportScreen.tsx` | 已在欄位對應步驟 | — | — | 現役 |

---

## 畫面：內容比對步驟

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-XF-044 | 內容比對帳戶段每個名稱加幣別一列 | UI | T1 | P1 | `no15_import_wizard_screen` | `src/screens/Settings/ImportScreen.tsx` | 已在內容比對步驟 | — | — | 現役 |
| C-XF-045 | 同名不同幣別的帳戶各自獨立一列 | UI | T3 | P0 | `no15_import_wizard_screen` | `src/screens/Settings/ImportScreen.tsx` | 備有同名不同幣別帳戶的 CSV | — | — | 現役 |
| C-XF-046 | 與既有帳戶相符時動作選擇器提供沿用、新建、跳過 | UI | T3 | P1 | `no15_import_wizard_screen` | `src/screens/Settings/ImportScreen.tsx` | 備有含既有帳戶名的 CSV | — | — | 現役 |
| C-XF-047 | 無相符帳戶時動作選擇器僅提供新建與跳過 | UI | T3 | P1 | `no15_import_wizard_screen` | `src/screens/Settings/ImportScreen.tsx` | 備有含全新帳戶名的 CSV | — | — | 現役 |
| C-XF-048 | 相符項預設帶入沿用、不相符項預設帶入新建 | UI | T3 | P1 | `no15_import_wizard_screen` | `src/screens/Settings/ImportScreen.tsx` | 備有既有與全新帳戶名並存的 CSV | — | — | 現役 |
| C-XF-049 | 交易模式顯示支出類別段與收入類別段 | UI | T3 | P1 | `no15_import_wizard_screen` | `src/screens/Settings/ImportScreen.tsx` | 備有收支各一列的交易 CSV | — | — | 現役 |
| C-XF-050 | 同名但分屬收支的類別分別列於兩段 | UI | T3 | P0 | `no15_import_wizard_screen` | `src/screens/Settings/ImportScreen.tsx` | 備有同名類別分屬收支的 CSV | — | — | 現役 |
| C-XF-051 | 轉帳模式不顯示類別段 | UI | T3 | P1 | `no15_import_wizard_screen` | `src/screens/Settings/ImportScreen.tsx` | 備有合法轉帳 CSV | — | — | 現役 |
| C-XF-052 | 該段無任何項目時不顯示該段標題 | UI | T3 | P2 | — | `src/screens/Settings/ImportScreen.tsx` | 備有全為支出的交易 CSV | — | — | 現役 |
| C-XF-053 | 選擇比對動作更新該帳戶或類別的匯入動作 | UI | T1 | P1 | `no15_import_wizard_screen` | `src/screens/Settings/ImportScreen.tsx` | 已在內容比對步驟 | — | — | 現役 |

---

## 畫面：預覽與執行

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-XF-054 | 預覽摘要顯示共匯入紀錄數 | UI | T1 | P1 | `no15_import_wizard_screen` | `src/screens/Settings/ImportScreen.tsx` | 已在預覽步驟 | — | — | 現役 |
| C-XF-055 | 預覽摘要顯示將新建帳戶數 | UI | T1 | P1 | `no15_import_wizard_screen` | `src/screens/Settings/ImportScreen.tsx` | 已在預覽步驟 | — | — | 現役 |
| C-XF-056 | 交易模式預覽摘要顯示將新建類別數 | UI | T1 | P1 | `no15_import_wizard_screen` | `src/screens/Settings/ImportScreen.tsx` | 交易模式已在預覽步驟 | — | — | 現役 |
| C-XF-057 | 轉帳模式預覽摘要不顯示將新建類別數 | UI | T1 | P1 | `no15_import_wizard_screen` | `src/screens/Settings/ImportScreen.tsx` | 轉帳模式已在預覽步驟 | — | — | 現役 |
| C-XF-058 | 預覽摘要顯示將略過紀錄數 | UI | T3 | P1 | `no15_import_wizard_screen` | `src/screens/Settings/ImportScreen.tsx` | 備有含將略過列的 CSV | — | — | 現役 |
| C-XF-059 | 預覽的將略過紀錄數與匯入結果的略過筆數一致 | UI | T3 | P0 | — | `src/screens/Settings/ImportScreen.tsx` | 備有含超界金額列的 CSV | — | `src/services/importService.rowSkip.test.ts`（ImportScreen 預覽計數呼叫 getRowSkipReason、不再自抄 parseDate 判定） | 現役 |
| C-XF-060 | 送出執行期間右動作不可點按 | UI | T3 | P1 | — | `src/screens/Settings/ImportScreen.tsx` | 備有數千列的大檔 | — | — | 現役 |
| C-XF-061 | 送出執行期間畫面不顯示載入指示 | UI | T3 | P1 | `no15_import_wizard_screen` | `src/screens/Settings/ImportScreen.tsx` | 備有數千列的大檔 | — | — | 現役 |
| C-XF-062 | 匯入成功顯示已匯入與略過筆數對話框 | UI | T1 | P1 | `no15_import_wizard_screen` | `src/screens/Settings/ImportScreen.tsx` | 已在預覽步驟 | — | — | 現役 |
| C-XF-063 | 匯入成功對話框點確認關閉 Modal | UI | T1 | P1 | `no15_import_wizard_screen` | `src/screens/Settings/ImportScreen.tsx` | 已在預覽步驟 | — | — | 現役 |
| C-XF-064 | 匯入失敗時顯示匯入失敗對話框 | UI | T4 | P2 | `no15_import_wizard_screen` | `src/screens/Settings/ImportScreen.tsx` | 不適用 | 寫入層失敗情境無手動入口 | — | 現役 |

---

## 邏輯：欄位掃描與候選

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-XF-065 | 掃描各欄判斷日期、金額、幣別、文字四型合規性 | UI | T3 | P1 | `no21_data_transfer_logic` | `src/services/importService.ts::validateAllColumns` | 備有混型欄位的 CSV | — | — | 現役 |
| C-XF-066 | 必填欄位候選須整欄全數值合格 | UI | T3 | P0 | `no21_data_transfer_logic` | `src/services/importService.ts::scanColumnCompliance` | 備有必填欄含一格空值的 CSV | — | `src/services/importService.columnCandidates.test.ts`（含空值的必填金額欄不入候選、不自動帶入） | 現役 |
| C-XF-067 | 必填欄含任一非法值時該欄不入候選 | UI | T3 | P0 | `no21_data_transfer_logic` | `src/services/importService.ts::scanColumnCompliance` | 備有必填欄含非法值的 CSV | — | `src/services/importService.columnCandidates.test.ts`（非空不合規值仍使欄位失格，optional 也不收） | 現役 |
| C-XF-068 | 可選欄位候選容許空值 | UI | T3 | P1 | `no21_data_transfer_logic` | `src/services/importService.ts::scanColumnCompliance` | 備有備註欄含空值的 CSV | — | `src/services/importService.columnCandidates.test.ts`（optional text 候選含 note 欄） | 現役 |
| C-XF-069 | 低於儲存精度的金額使該欄不入候選 | UI | T3 | P1 | `no21_data_transfer_logic` | `src/services/importService.ts::isValidAmount` | 備有金額欄含 0.00001 的 CSV | — | — | 現役 |
| C-XF-070 | 超出儲存上限的金額仍入候選、留待執行階段逐列略過 | UI | T3 | P1 | `no21_data_transfer_logic` | `src/services/importService.ts::isValidAmount` | 備有金額欄含超界值的 CSV | — | `src/services/importService.columnCandidates.test.ts`（超界金額通過守門尺，整欄非空即入候選） | 現役 |
| C-XF-071 | 金額欄不接受逗號千分位與貨幣符號 | UI | T3 | P1 | `no15_import_wizard_screen` | `src/utils/amountValidation.ts::parseAmount` | 備有帶千分位金額的 CSV | — | — | 現役 |
| C-XF-072 | 依合規結果為每個系統欄位建議最相符的 CSV 欄位 | UI | T3 | P1 | `no21_data_transfer_logic` | `src/services/importService.ts::suggestColumnMapping` | 備有標頭與系統欄位相近的 CSV | — | `src/services/importService.columnCandidates.test.ts`（suggestColumnMapping 自動帶入 note） | 現役 |

---

## 邏輯：日期解析

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-XF-073 | 日期帶時區偏移後綴時以內嵌偏移解讀 | DB | T3 | P0 | `no21_data_transfer_logic` | `src/services/importService.ts::parseDate` | 備有帶偏移後綴日期的 CSV | — | `src/services/importService.parseDate.test.ts`（字串自帶 +08:00：以該偏移解讀） | 現役 |
| C-XF-074 | 日期無內嵌偏移時依所選來源時區解析 | DB | T3 | P0 | `no21_data_transfer_logic` | `src/services/importService.ts::parseDate` | 備有無偏移後綴日期的 CSV | — | `src/services/importService.parseDate.test.ts`（無偏移時沿用外部來源時區（外來檔行為不變）） | 現役 |
| C-XF-075 | 日期僅有日期時時間定為零時零分零秒 | DB | T3 | P1 | `no15_import_wizard_screen` | `src/services/importService.ts::parseDate` | 備有僅帶日期的 CSV | — | — | 現役 |
| C-XF-076 | 日期非真實存在的列匯入時略過 | DB | T3 | P1 | `no21_data_transfer_logic` | `src/services/importService.ts::getRowSkipReason` | 備有含二月三十日之類日期的 CSV | — | `src/services/importService.rowSkip.test.ts`（日期值域非法 / 掉位年份 / epoch 整點 → INVALID_DATE） | 現役 |
| C-XF-077 | 一九七零年起點及更早的日期列匯入時略過 | DB | T3 | P2 | `no21_data_transfer_logic` | `src/services/importService.ts::getRowSkipReason` | 備有一九六九年日期的 CSV | — | `src/services/importService.rowSkip.test.ts`（日期不可儲存 → INVALID_DATE） | 現役 |

---

## 邏輯：內容分析

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-XF-078 | 帳戶以名稱加幣別為比對單位 | DB | T3 | P0 | `no21_data_transfer_logic` | `src/services/importService.ts::analyzeImportContent` | 備有同名不同幣別帳戶的 CSV | — | `src/services/importService.guard.test.ts`（同名帳戶不同幣別視為不同帳戶（各自 name:currency 複合鍵）） | 現役 |
| C-XF-079 | 類別以名稱加收支類型為比對單位 | DB | T3 | P0 | `no21_data_transfer_logic` | `src/services/importService.ts::analyzeImportContent` | 備有同名類別分屬收支的 CSV | — | — | 現役 |
| C-XF-080 | 既有資料限當前使用者的活躍紀錄 | DB | T3 | P0 | `no21_data_transfer_logic` | `src/services/importService.ts::analyzeImportContent` | 他帳號已有同名帳戶 | — | `src/services/importService.guard.test.ts`（同名帳戶跨帳號時只認當前使用者那筆） | 現役 |
| C-XF-081 | 既有資料排除已軟刪項 | DB | T2 | P1 | `no21_data_transfer_logic` | `src/services/importService.ts::analyzeImportContent` | 已刪除同名帳戶 | — | `src/services/importService.guard.test.ts`（排除已軟刪除的同名帳戶） | 現役 |
| C-XF-082 | 將被略過的列不列入帳戶與類別萃取 | DB | T3 | P1 | `no21_data_transfer_logic` | `src/services/importService.ts::analyzeImportContent` | 備有新帳戶只出現在將略過列的 CSV | — | `src/services/importService.rowSkip.test.ts`（新帳戶唯一一列日期值域非法 → 不進新建清單（不建空殼帳戶）） | 現役 |

---

## 邏輯：匯入執行

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-XF-083 | 依比對結果建立標記為新建的帳戶與類別 | DB | T3 | P0 | `no21_data_transfer_logic` | `src/services/importService.ts::executeImport` | 備有含新帳戶的 CSV | — | — | 現役 |
| C-XF-084 | 同名不同幣別的帳戶各自建立、採該列幣別 | DB | T3 | P0 | `no21_data_transfer_logic` | `src/services/importService.ts::executeImport` | 備有同名不同幣別帳戶的 CSV | — | — | 現役 |
| C-XF-085 | 新建帳戶與類別的排序值接續既有最大值 | DB | T3 | P2 | — | `src/services/importService.ts::executeImport` | 已有數個帳戶且備有含新帳戶的 CSV | — | — | 現役 |
| C-XF-086 | 新建帳戶與類別名稱超過長度上限時截斷 | DB | T3 | P2 | — | `src/services/importService.ts::executeImport` | 備有超長帳戶名的 CSV | — | — | 現役 |
| C-XF-087 | 匯入不為新建帳戶種入佔位匯率 | DB | T3 | P1 | — | `src/services/importService.ts::executeImport` | 備有含新外幣帳戶的 CSV | — | — | 現役 |
| C-XF-088 | 逐列依匯入模式建立交易或轉帳紀錄 | DB | T3 | P0 | `no21_data_transfer_logic` | `src/services/importService.ts::executeImport` | 備有合法 CSV | — | — | 現役 |
| C-XF-089 | 匯入不沿用來源 id、每列配新主鍵 | DB | T3 | P0 | `no21_data_transfer_logic` | `src/services/importService.ts::executeImport` | 已匯出過自家 CSV | — | `src/services/importService.guard.test.ts`（createTransaction / createTransfer 呼叫不帶 id 欄位） | 現役 |
| C-XF-090 | 幣別代碼大小寫不敏感 | DB | T3 | P1 | `no15_import_wizard_screen` | `src/services/importService.ts::executeImport` | 備有小寫幣別代碼的 CSV | — | — | 現役 |
| C-XF-091 | 匯入金額以固定四位小數精度儲存 | DB | T3 | P1 | `no15_import_wizard_screen` | `src/utils/currencyUtils.ts::toStorageAmount` | 備有五位小數金額的 CSV | — | — | 現役 |
| C-XF-092 | 轉帳兩腿金額以絕對值儲存 | DB | T3 | P1 | — | `src/services/importService.ts::executeImport` | 備有負值轉出金額的轉帳 CSV | — | — | 現役 |
| C-XF-093 | 帳戶動作選跳過的列略過 | DB | T2 | P1 | `no21_data_transfer_logic` | `src/services/importService.ts::executeImport` | 已在內容比對步驟把某帳戶設為跳過 | — | — | 現役 |
| C-XF-094 | 類別動作選跳過的列略過 | DB | T2 | P1 | `no21_data_transfer_logic` | `src/services/importService.ts::executeImport` | 已在內容比對步驟把某類別設為跳過 | — | — | 現役 |
| C-XF-095 | 金額超出可儲存範圍的列略過 | DB | T3 | P1 | `no21_data_transfer_logic` | `src/services/importService.ts::getRowSkipReason` | 備有含超界金額列的 CSV | — | `src/services/importService.rowSkip.test.ts`（from_amount / to_amount 超過儲存上限 → UNSTORABLE_AMOUNT） | 現役 |
| C-XF-096 | 跨幣別轉帳缺轉入金額的列略過 | DB | T3 | P1 | `no21_data_transfer_logic` | `src/services/importService.ts::getRowSkipReason` | 備有跨幣別缺轉入金額列的 CSV | — | `src/services/importService.rowSkip.test.ts`（跨幣別缺 to_amount → CROSS_CURRENCY_NO_TO_AMOUNT（AXIS4-26）） | 現役 |
| C-XF-097 | 轉出與轉入解析為同一帳戶的列略過 | DB | T3 | P1 | — | `src/services/importService.ts::getRowSkipReason` | 備有轉出轉入同名同幣別列的 CSV | — | `src/services/importService.rowSkip.test.ts`（轉出轉入同名同幣別 → SAME_ACCOUNT） | 現役 |
| C-XF-098 | 同幣別轉帳缺轉入金額時轉入金額沿用轉出金額 | DB | T3 | P1 | — | `src/services/importService.ts::executeImport` | 備有同幣別缺轉入金額列的 CSV | — | — | 現役 |
| C-XF-099 | 略過的列計入略過筆數、其餘列照常匯入 | UI+DB | T3 | P1 | `no21_data_transfer_logic` | `src/services/importService.ts::executeImport` | 備有合法列與將略過列並存的 CSV | — | — | 現役 |

---

## 邏輯：匯出

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-XF-100 | 匯出讀取當前使用者對應類型的紀錄 | DB | T3 | P0 | `no21_data_transfer_logic` | `src/services/exportService.ts` | 雙帳號各有資料 | — | `src/services/exportService.test.ts`（transactions 匯出只含當前使用者的列、不夾帶他帳號） | 現役 |
| C-XF-101 | 匯出排除已軟刪的紀錄 | DB | T2 | P0 | `no21_data_transfer_logic` | `src/services/exportService.ts` | 已刪除一筆帶備註的交易 | — | `src/services/exportService.test.ts`（transactions 匯出不含已軟刪除的列） | 現役 |
| C-XF-102 | 匯出附上帳戶與類別名稱 | UI | T1 | P1 | `no21_data_transfer_logic` | `src/services/exportService.ts` | 已有交易資料 | — | — | 現役 |
| C-XF-103 | 帳戶查無時幣別欄退回使用者主要貨幣 | UI | T1 | P2 | — | `src/services/exportService.ts` | 交易所屬帳戶已被軟刪 | — | `src/services/exportService.test.ts`（transactions：帳戶查無 → currency 欄＝注入的 base（非寫死 TWD）） | 現役 |
| C-XF-104 | 匯出檔不含 id 欄 | UI | T1 | P1 | `no21_data_transfer_logic` | `src/services/exportService.ts` | 已有交易資料 | — | `src/services/exportService.test.ts`（transactions 匯出的 CSV header 無 id 欄） | 現役 |
| C-XF-105 | 匯出時間欄帶 UTC 偏移輸出、自我描述時區 | UI | T1 | P0 | `no21_data_transfer_logic` | `src/services/exportService.ts::toExportDatetime` | 已有交易資料 | — | — | 現役 |
| C-XF-106 | 匯出金額以儲存精度輸出、不以幣別小數位截斷 | UI | T1 | P0 | `no21_data_transfer_logic` | `src/services/exportService.ts` | 已記一筆帶子單位金額的交易 | — | — | 現役 |
| C-XF-107 | 匯出金額去除尾隨零 | UI | T1 | P2 | `no21_data_transfer_logic` | `src/services/exportService.ts::trimZeros` | 已有交易資料 | — | — | 現役 |
| C-XF-108 | 匯出欄位標頭與順序與下載範本同源 | UI | T3 | P1 | `no21_data_transfer_logic` | `src/services/exportService.ts` | 已有交易資料且已下載範本 | — | — | 現役 |
| C-XF-109 | 交易匯出檔名為交易前綴附時間戳 | UI | T1 | P2 | `no21_data_transfer_logic` | `src/services/exportService.ts::exportToCsv` | 已有交易資料 | — | — | 現役 |
| C-XF-110 | 轉帳匯出檔名為轉帳前綴附時間戳 | UI | T1 | P2 | `no21_data_transfer_logic` | `src/services/exportService.ts::exportToCsv` | 已有轉帳資料 | — | — | 現役 |
| C-XF-111 | 匯出成功觸發系統分享面板 | UI | T1 | P1 | `no21_data_transfer_logic` | `src/services/exportService.ts::exportToCsv` | 已有交易資料 | — | — | 現役 |
| C-XF-112 | 匯出檔可原樣重匯 | UI+DB | T2 | P0 | `no21_data_transfer_logic` | `src/services/exportService.ts::exportToCsv` | 已有交易資料 | — | — | 現役 |
| C-XF-113 | 原樣重匯還原同一絕對時刻 | DB | T2 | P0 | `no21_data_transfer_logic` | `src/services/importService.ts::parseDate` | 已匯出且來源時區改為他值 | — | `src/services/importService.parseDate.test.ts`（round-trip：匯出 UTC+偏移 → 匯入還原同一絕對時間（不受來源時區影響）） | 現役 |

---

## 邏輯：範本與說明

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-XF-114 | 範本含欄位標頭與範例列 | UI | T3 | P1 | `no21_data_transfer_logic` | `src/services/templateService.ts::generateTemplate` | 已下載範本 | — | — | 現役 |
| C-XF-115 | 交易範本標頭為六欄定序 | UI | T3 | P1 | `no15_import_wizard_screen` | `src/services/templateService.ts::generateTransactionTemplate` | 已下載交易範本 | — | — | 現役 |
| C-XF-116 | 轉帳範本標頭為八欄定序 | UI | T3 | P1 | `no15_import_wizard_screen` | `src/services/templateService.ts::generateTransferTemplate` | 已下載轉帳範本 | — | — | 現役 |
| C-XF-117 | 範本範例值符合欄位格式、可直接作匯入輸入 | UI+DB | T3 | P1 | `no15_import_wizard_screen` | `src/services/templateService.ts::generateTemplate` | 已下載範本 | — | — | 現役 |
| C-XF-118 | 交易範本檔名為交易範本命名 | UI | T3 | P2 | `no21_data_transfer_logic` | `src/services/templateService.ts::shareTemplate` | 已下載交易範本 | — | — | 現役 |
| C-XF-119 | 轉帳範本檔名為轉帳範本命名 | UI | T3 | P2 | `no21_data_transfer_logic` | `src/services/templateService.ts::shareTemplate` | 已下載轉帳範本 | — | — | 現役 |
| C-XF-120 | 說明檔各欄位標明必填或可選 | UI | T3 | P1 | `no21_data_transfer_logic` | `src/services/templateService.ts::generateInstructions` | 已下載說明 | — | — | 現役 |
| C-XF-121 | 說明檔載明必填欄須整欄有值且格式合法、否則無法匯入 | UI | T3 | P1 | `no21_data_transfer_logic` | `src/services/templateService.ts::generateInstructions` | 已下載說明 | — | — | 現役 |
| C-XF-122 | 說明檔載明可選欄容許空值 | UI | T3 | P2 | `no21_data_transfer_logic` | `src/services/templateService.ts::generateInstructions` | 已下載說明 | — | — | 現役 |
| C-XF-123 | 說明檔載明日期非真實或超出可儲存範圍的列略過 | UI | T3 | P1 | `no21_data_transfer_logic` | `src/services/templateService.ts::generateInstructions` | 已下載說明 | — | — | 現役 |
| C-XF-124 | 說明檔載明金額超出可儲存範圍的列略過 | UI | T3 | P1 | `no21_data_transfer_logic` | `src/services/templateService.ts::generateInstructions` | 已下載說明 | — | — | 現役 |
| C-XF-125 | 說明檔交易模式載明金額正值為收入、負值為支出 | UI | T3 | P1 | `no21_data_transfer_logic` | `src/services/templateService.ts::generateInstructions` | 已下載交易說明 | — | — | 現役 |
| C-XF-126 | 說明檔載明帳戶以名稱加幣別比對 | UI | T3 | P1 | `no21_data_transfer_logic` | `src/services/templateService.ts::generateInstructions` | 已下載說明 | — | — | 現役 |
| C-XF-127 | 說明檔轉帳模式載明跨幣別缺轉入金額的列略過 | UI | T3 | P1 | `no21_data_transfer_logic` | `src/services/templateService.ts::generateInstructions` | 已下載轉帳說明 | — | — | 現役 |
| C-XF-128 | 說明檔載明含逗號的文字欄須以雙引號包覆 | UI | T3 | P1 | `no21_data_transfer_logic` | `src/services/templateService.ts::generateInstructions` | 已下載說明 | — | — | 現役 |
| C-XF-129 | 說明檔載明名稱前後空白會被忽略 | UI | T3 | P2 | `no21_data_transfer_logic` | `src/services/templateService.ts::generateInstructions` | 已下載說明 | — | — | 現役 |
| C-XF-130 | 說明檔載明日期可加時區偏移後綴與其效果 | UI | T3 | P1 | `no21_data_transfer_logic` | `src/services/templateService.ts::generateInstructions` | 已下載說明 | — | — | 現役 |
| C-XF-131 | 交易說明檔名為交易說明命名 | UI | T3 | P2 | `no21_data_transfer_logic` | `src/services/templateService.ts::shareInstructions` | 已下載交易說明 | — | — | 現役 |
| C-XF-132 | 轉帳說明檔名為轉帳說明命名 | UI | T3 | P2 | `no21_data_transfer_logic` | `src/services/templateService.ts::shareInstructions` | 已下載轉帳說明 | — | — | 現役 |
