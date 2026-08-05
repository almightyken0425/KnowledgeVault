# 檢驗點：帳戶類別與合併

檢驗點清單分冊。欄位定義、自檢方式與全冊索引見 `../no0_index.md`。

- 域碼：C-EN
- 涵蓋：Accounts 與 Categories 兩表欄位、兩實體的清單與編輯器、兩實體核心邏輯、合併編輯器與合併及其復原

---

## 資料模型：帳戶 Accounts

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-EN-001 | 帳戶列標記資料擁有者、為必填 | DB | T2 | P0 | `no1_data_models` | `src/database/models/Account.ts` | 已登入並建帳戶 | — | — | 現役 |
| C-EN-002 | 帳戶名稱寫入時去除前後空白 | DB | T2 | P2 | `no1_data_models` | `src/database/models/Account.ts` | 建帳戶時名稱前後帶空白 | — | — | 現役 |
| C-EN-003 | 帳戶幣別欄存 ISO 字母代碼 | DB | T2 | P1 | `no1_data_models` | `src/database/schema.ts` | 已登入並建帳戶 | — | — | 現役 |
| C-EN-004 | 帳戶排程欄為棄用殘欄、任何路徑恆為 Null | DB | T2 | P2 | `no1_data_models` | `src/database/schema.ts` | 已登入並建帳戶 | — | — | 現役 |
| C-EN-005 | 帳戶軟刪寫入刪除戳記並同時前移更新戳記 | DB | T2 | P0 | `no1_data_models` | `src/utils/auditStamp.ts::stampSoftDelete` | 刪除一個帳戶 | — | — | 現役 |
| C-EN-006 | 帳戶與類別的軟刪採刪除戳記墓碑、列仍留在本機表內 | DB | T2 | P0 | — | `src/database/models/SoftDeletableModel.ts` | 刪除一個帳戶與一個類別 | — | — | 現役 |
| C-EN-007 | 帳戶與類別的任一寫入路徑皆前移更新戳記 | DB | T2 | P0 | `no1_data_models` | `src/utils/auditStamp.ts::stampUpdate` | 改一次帳戶名稱與一次類別名稱 | — | `src/services/auditStamp.guard.test.ts`（除 auditStamp.ts 外，src 內無裸 .updatedOn / .deletedOn 賦值） | 現役 |
| C-EN-008 | 帳戶與類別的預設圖示定義域不重疊 | DB | T4 | P2 | — | `src/constants/seedDefaults.ts` | 不適用 | 防禦性不變式、無外顯入口 | `src/constants/seedDefaults.test.ts`（account and category default icon domains never overlap (defensive)） | 現役 |

---

## 資料模型：類別 Categories

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-EN-009 | 類別列標記資料擁有者、為必填 | DB | T2 | P0 | `no1_data_models` | `src/database/models/Category.ts` | 已登入並建類別 | — | — | 現役 |
| C-EN-010 | 類別名稱寫入時去除前後空白 | DB | T2 | P2 | `no1_data_models` | `src/database/models/Category.ts` | 建類別時名稱前後帶空白 | — | — | 現役 |
| C-EN-011 | 類別型別欄值域限支出或收入 | DB | T2 | P1 | `no1_data_models` | `src/database/schema.ts` | 已登入並建類別 | — | — | 現役 |
| C-EN-012 | 類別軟刪寫入刪除戳記並同時前移更新戳記 | DB | T2 | P0 | `no1_data_models` | `src/utils/auditStamp.ts::stampSoftDelete` | 刪除一個類別 | — | — | 現役 |

---

## 畫面：類別清單

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-EN-013 | 類別清單分支出區與收入區兩區顯示 | UI | T1 | P1 | `no9_category_list_screen` | `src/screens/Categories/CategoryListScreen.tsx` | 已有兩型類別 | — | — | 現役 |
| C-EN-014 | 類別清單項目顯示圖示與名稱 | UI | T1 | P1 | `no9_category_list_screen` | `src/screens/Categories/CategoryListScreen.tsx` | 已有類別 | — | — | 現役 |
| C-EN-015 | 類別清單兩分區各依排序值遞增排列 | UI | T1 | P2 | — | `src/screens/Categories/CategoryListScreen.tsx` | 已有三個以上支出類別 | — | — | 現役 |
| C-EN-016 | 已停用類別於清單以停用樣式呈現 | UI | T1 | P1 | `no9_category_list_screen` | `src/screens/Categories/CategoryListScreen.tsx` | 已有停用類別 | — | — | 現役 |
| C-EN-017 | 類別清單導覽列含返回、標題、合併、新增 | UI | T1 | P2 | `no9_category_list_screen` | `src/screens/Categories/CategoryListScreen.tsx` | 進類別清單 | — | — | 現役 |
| C-EN-018 | 點按類別清單合併按鈕以類別模式進入合併編輯器 | UI | T1 | P1 | `no9_category_list_screen` | `src/screens/Categories/CategoryListScreen.tsx` | 進類別清單 | — | — | 現役 |
| C-EN-019 | 新增類別遭配額禁止時導向付費牆 | UI | T1 | P1 | `no9_category_list_screen` | `src/screens/Categories/CategoryListScreen.tsx::handleAddPress` | 免費帳號類別數已達上限 | — | — | 現役 |
| C-EN-020 | 新增類別允許時進入類別編輯器且不帶類型參數 | UI | T1 | P1 | `no9_category_list_screen` | `src/screens/Categories/CategoryListScreen.tsx` | 免費帳號類別未達上限 | — | — | 現役 |
| C-EN-021 | 點按類別清單項目進入類別編輯器 | UI | T1 | P1 | `no9_category_list_screen` | `src/screens/Categories/CategoryListScreen.tsx` | 已有類別 | — | — | 現役 |
| C-EN-022 | 拖拉類別項目依所在分區寫回新順序 | UI+DB | T2 | P1 | `no9_category_list_screen` | `src/screens/Categories/CategoryListScreen.tsx::handleReorder` | 支出區有兩個以上類別 | — | — | 現役 |

---

## 畫面：帳戶清單

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-EN-023 | 帳戶清單單區顯示、不分幣別分群 | UI | T1 | P1 | `no11_account_list_screen` | `src/screens/Accounts/AccountListScreen.tsx` | 已有多幣別帳戶 | — | — | 現役 |
| C-EN-024 | 帳戶清單項目顯示圖示與名稱 | UI | T1 | P1 | `no11_account_list_screen` | `src/screens/Accounts/AccountListScreen.tsx` | 已有帳戶 | — | — | 現役 |
| C-EN-025 | 帳戶清單項目以幣別代碼為副標 | UI | T1 | P2 | — | `src/screens/Accounts/AccountListScreen.tsx` | 已有多幣別帳戶 | — | — | 現役 |
| C-EN-026 | 帳戶清單依排序值遞增排列 | UI | T1 | P2 | — | `src/services/localDbService.ts::getAccounts` | 已有三個以上帳戶 | — | — | 現役 |
| C-EN-027 | 已停用帳戶於清單以停用樣式呈現 | UI | T1 | P1 | `no11_account_list_screen` | `src/screens/Accounts/AccountListScreen.tsx` | 已有停用帳戶 | — | — | 現役 |
| C-EN-028 | 帳戶清單導覽列含返回、標題、合併、新增 | UI | T1 | P2 | `no11_account_list_screen` | `src/screens/Accounts/AccountListScreen.tsx` | 進帳戶清單 | — | — | 現役 |
| C-EN-029 | 點按帳戶清單合併按鈕以帳戶模式進入合併編輯器 | UI | T1 | P1 | `no11_account_list_screen` | `src/screens/Accounts/AccountListScreen.tsx` | 進帳戶清單 | — | — | 現役 |
| C-EN-030 | 新增帳戶遭配額禁止時導向付費牆 | UI | T1 | P1 | `no11_account_list_screen` | `src/screens/Accounts/AccountListScreen.tsx::handleAddPress` | 免費帳號帳戶數已達上限 | — | — | 現役 |
| C-EN-031 | 新增帳戶允許時進入帳戶編輯器 | UI | T1 | P1 | `no11_account_list_screen` | `src/screens/Accounts/AccountListScreen.tsx` | 免費帳號帳戶未達上限 | — | — | 現役 |
| C-EN-032 | 點按帳戶清單項目進入帳戶編輯器 | UI | T1 | P1 | `no11_account_list_screen` | `src/screens/Accounts/AccountListScreen.tsx` | 已有帳戶 | — | — | 現役 |
| C-EN-033 | 拖拉帳戶項目寫回新順序 | UI+DB | T2 | P1 | `no11_account_list_screen` | `src/screens/Accounts/AccountListScreen.tsx::handleReorder` | 已有兩個以上帳戶 | — | — | 現役 |

---

## 畫面：類別編輯器

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-EN-034 | 類別編輯器新增模式標題為新增類別 | UI | T1 | P2 | `no10_category_editor_screen` | `src/screens/Categories/CategoryEditorScreen.tsx` | 點類別清單新增 | — | — | 現役 |
| C-EN-035 | 類別編輯器編輯模式標題為編輯類別 | UI | T1 | P2 | `no10_category_editor_screen` | `src/screens/Categories/CategoryEditorScreen.tsx` | 點既有類別 | — | — | 現役 |
| C-EN-036 | 類別名稱為空或僅含空白時完成按鈕不可點按 | UI | T1 | P1 | `no10_category_editor_screen` | `src/screens/Categories/CategoryEditorScreen.tsx` | 進新增類別留空名稱 | — | — | 現役 |
| C-EN-037 | 類別類型選擇器收合時顯示當前類型與展開指示器 | UI | T1 | P2 | `no10_category_editor_screen` | `src/components/SearchableDropdown.tsx` | 進類別編輯器 | — | — | 現役 |
| C-EN-038 | 類別類型選項為支出與收入兩項 | UI | T1 | P1 | `no10_category_editor_screen` | `src/screens/Categories/CategoryEditorScreen.tsx` | 展開類型選擇器 | — | — | 現役 |
| C-EN-039 | 新增模式類別類型預設選中支出 | UI | T1 | P1 | `no10_category_editor_screen` | `src/screens/Categories/CategoryEditorScreen.tsx` | 自類別清單點新增 | — | — | 現役 |
| C-EN-040 | 編輯模式類別類型呈停用樣式且點按無反應 | UI | T1 | P1 | `no10_category_editor_screen` | `src/screens/Categories/CategoryEditorScreen.tsx` | 點既有類別 | — | — | 現役 |
| C-EN-041 | 切換類別類型時保留已選圖示與已輸入名稱 | UI | T1 | P2 | `no10_category_editor_screen` | `src/screens/Categories/CategoryEditorScreen.tsx::handleTypeChange` | 新增模式已填名稱且選過圖示 | — | — | 現役 |
| C-EN-042 | 選擇與當前相同的類型時僅收合選擇器 | UI | T1 | P2 | `no10_category_editor_screen` | `src/screens/Categories/CategoryEditorScreen.tsx::handleTypeChange` | 展開後選當前類型 | — | — | 現役 |
| C-EN-043 | 類別圖示網格僅含標籤含類別的圖示 | UI | T1 | P1 | `no10_category_editor_screen` | `src/utils/iconSelection.ts::filterCategoryIcons` | 進類別編輯器 | — | `src/utils/iconSelection.test.ts`（只回傳含 category tag 的圖示，排除 account（不分支出/收入）） | 現役 |
| C-EN-044 | 類別圖示池不分收支型別 | UI | T1 | P2 | `no10_category_editor_screen` | `src/utils/iconSelection.ts::filterCategoryIcons` | 新增模式已切過類型 | — | — | 現役 |
| C-EN-045 | 新增模式類別圖示預設選取網格第一筆 | UI | T1 | P2 | `no10_category_editor_screen` | `src/screens/Categories/CategoryEditorScreen.tsx` | 進新增類別 | — | `src/constants/seedDefaults.test.ts`（category default derives to the first category icon (import == manual)） | 現役 |
| C-EN-046 | 編輯模式顯示停用此類別開關 | UI | T1 | P1 | `no10_category_editor_screen` | `src/screens/Categories/CategoryEditorScreen.tsx` | 點既有類別 | — | — | 現役 |
| C-EN-047 | 編輯模式帶入既有類別的停用狀態 | UI | T1 | P1 | `no10_category_editor_screen` | `src/screens/Categories/CategoryEditorScreen.tsx` | 點既有停用類別 | — | — | 現役 |
| C-EN-048 | 載入既有類別失敗時提示錯誤並返回上一頁 | UI | T4 | P2 | — | `src/screens/Categories/CategoryEditorScreen.tsx` | 不適用 | 讀取失敗無手動入口 | — | 現役 |
| C-EN-049 | 新增類別點完成後顯示復原列並返回上一頁 | UI+DB | T2 | P1 | `no10_category_editor_screen` | `src/screens/Categories/CategoryEditorScreen.tsx` | 進新增類別填妥名稱 | — | — | 現役 |
| C-EN-050 | 編輯類別點完成後顯示復原列並返回上一頁 | UI+DB | T2 | P1 | `no10_category_editor_screen` | `src/screens/Categories/CategoryEditorScreen.tsx` | 點既有類別並改名 | — | — | 現役 |
| C-EN-051 | 確認刪除類別後顯示復原列並返回上一頁 | UI+DB | T2 | P0 | `no10_category_editor_screen` | `src/screens/Categories/CategoryEditorScreen.tsx` | 進類別編輯模式 | — | — | 現役 |
| C-EN-052 | 類別刪除失敗時無錯誤提示、停留原頁 | UI | T4 | P1 | `no10_category_editor_screen` | `src/screens/Categories/CategoryEditorScreen.tsx` | 不適用 | 刪除失敗無手動入口 | — | 現役 |

---

## 畫面：帳戶編輯器

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-EN-053 | 帳戶編輯器新增模式標題為新增帳戶 | UI | T1 | P2 | `no12_account_editor_screen` | `src/screens/Accounts/AccountEditorScreen.tsx` | 點帳戶清單新增 | — | — | 現役 |
| C-EN-054 | 帳戶編輯器編輯模式標題為編輯帳戶 | UI | T1 | P2 | `no12_account_editor_screen` | `src/screens/Accounts/AccountEditorScreen.tsx` | 點既有帳戶 | — | — | 現役 |
| C-EN-055 | 帳戶名稱為空或僅含空白時完成按鈕不可點按 | UI | T1 | P1 | `no12_account_editor_screen` | `src/screens/Accounts/AccountEditorScreen.tsx` | 進新增帳戶留空名稱 | — | — | 現役 |
| C-EN-056 | 幣別選擇器收合時顯示當前幣別與展開指示器 | UI | T1 | P2 | `no12_account_editor_screen` | `src/components/SearchableDropdown.tsx` | 進帳戶編輯器 | — | — | 現役 |
| C-EN-057 | 幣別項目顯示字母代碼與幣別名稱 | UI | T1 | P2 | `no12_account_editor_screen` | `src/screens/Accounts/AccountEditorScreen.tsx` | 展開幣別選擇器 | — | — | 現役 |
| C-EN-058 | 輸入幣別搜尋文字即時篩選清單 | UI | T1 | P1 | `no12_account_editor_screen` | `src/components/SearchableDropdown.tsx` | 展開幣別選擇器 | — | — | 現役 |
| C-EN-059 | 新增模式幣別初始為使用者主要貨幣 | UI | T1 | P1 | `no12_account_editor_screen` | `src/screens/Accounts/AccountEditorScreen.tsx` | 主要貨幣已改為非預設值 | — | — | 現役 |
| C-EN-060 | 編輯模式幣別呈停用樣式、不可展開修改 | UI | T1 | P1 | `no12_account_editor_screen` | `src/screens/Accounts/AccountEditorScreen.tsx` | 點既有帳戶 | — | — | 現役 |
| C-EN-061 | 帳戶圖示網格僅含標籤含帳戶的圖示 | UI | T1 | P1 | `no12_account_editor_screen` | `src/utils/iconCatalog.ts::getIconsByTag` | 進帳戶編輯器 | — | — | 現役 |
| C-EN-062 | 新增模式帳戶圖示預設選取網格第一筆 | UI | T1 | P2 | `no12_account_editor_screen` | `src/screens/Accounts/AccountEditorScreen.tsx` | 進新增帳戶 | — | — | 現役 |
| C-EN-063 | 編輯模式顯示停用此帳戶開關 | UI | T1 | P1 | `no12_account_editor_screen` | `src/screens/Accounts/AccountEditorScreen.tsx` | 點既有帳戶 | — | — | 現役 |
| C-EN-064 | 編輯模式帶入既有帳戶的停用狀態 | UI | T1 | P1 | `no12_account_editor_screen` | `src/screens/Accounts/AccountEditorScreen.tsx` | 點既有停用帳戶 | — | — | 現役 |
| C-EN-065 | 載入既有帳戶失敗時提示錯誤並返回上一頁 | UI | T4 | P2 | — | `src/screens/Accounts/AccountEditorScreen.tsx` | 不適用 | 讀取失敗無手動入口 | — | 現役 |
| C-EN-066 | 新增帳戶點完成後顯示復原列並返回上一頁 | UI+DB | T2 | P1 | `no12_account_editor_screen` | `src/screens/Accounts/AccountEditorScreen.tsx` | 進新增帳戶填妥名稱 | — | — | 現役 |
| C-EN-067 | 編輯帳戶點完成後顯示復原列並返回上一頁 | UI+DB | T2 | P1 | `no12_account_editor_screen` | `src/screens/Accounts/AccountEditorScreen.tsx` | 點既有帳戶並改名 | — | — | 現役 |
| C-EN-068 | 確認刪除帳戶後顯示復原列並返回上一頁 | UI+DB | T2 | P0 | `no12_account_editor_screen` | `src/screens/Accounts/AccountEditorScreen.tsx` | 進帳戶編輯模式 | — | — | 現役 |
| C-EN-069 | 帳戶刪除失敗時顯示錯誤提示、停留原頁 | UI | T4 | P1 | `no12_account_editor_screen` | `src/screens/Accounts/AccountEditorScreen.tsx` | 不適用 | 刪除失敗無手動入口 | — | 現役 |

---

## 畫面：兩編輯器共用

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-EN-070 | 編輯器名稱欄達 60 字元上限即時阻擋、輸入不再更新 | UI | T1 | P2 | `no1_data_models` | `src/components/EditorNameField.tsx` | 進任一編輯器 | — | — | 現役 |
| C-EN-071 | 圖示網格常駐顯示、無折疊狀態 | UI | T1 | P2 | `no12_account_editor_screen` | `src/components/IconPickerGrid.tsx` | 進任一編輯器 | — | — | 現役 |
| C-EN-072 | 點按圖示即時更新選取樣式 | UI | T1 | P1 | `no12_account_editor_screen` | `src/components/IconPickerGrid.tsx` | 進任一編輯器 | — | — | 現役 |
| C-EN-073 | 圖示網格為空時預設選取內建後備圖示 | UI | T4 | P2 | `no10_category_editor_screen` | `src/utils/iconSelection.ts::getDefaultId` | 不適用 | 圖示池為空無法佈置 | `src/utils/iconSelection.test.ts`（清單為空時退回 fallback） | 現役 |
| C-EN-074 | 點按編輯器關閉按鈕返回上一頁 | UI | T1 | P1 | `no10_category_editor_screen` | `src/navigation/headerItems.tsx::headerCloseItem` | 進任一編輯器 | — | — | 現役 |
| C-EN-075 | 點按刪除按鈕顯示刪除確認對話框 | UI | T1 | P1 | `no12_account_editor_screen` | `src/screens/Accounts/AccountEditorScreen.tsx::handleDelete` | 進任一編輯模式 | — | — | 現役 |
| C-EN-076 | 刪除確認對話框點取消時不執行刪除 | UI+DB | T2 | P1 | `no12_account_editor_screen` | `src/screens/Accounts/AccountEditorScreen.tsx` | 進任一編輯模式 | — | — | 現役 |
| C-EN-077 | 儲存失敗時顯示錯誤提示、停留原頁 | UI | T4 | P2 | `no10_category_editor_screen` | `src/screens/Categories/CategoryEditorScreen.tsx` | 不適用 | 寫入失敗無手動入口 | — | 現役 |
| C-EN-078 | 編輯模式儲存前找不到原記錄時中止、不做半套更新 | DB | T4 | P0 | — | `src/screens/Accounts/AccountEditorScreen.tsx` | 不適用 | 記錄消失時序無法手動構造 | — | 現役 |

---

## 畫面：合併編輯器

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-EN-079 | 合併編輯器的實體模式由呼叫端於導航時指定 | UI | T1 | P1 | `no13_merge_editor_screen` | `src/screens/Merge/MergeEditorScreen.tsx` | 分別自帳戶與類別清單進入 | — | — | 現役 |
| C-EN-080 | 合併編輯器導覽列含關閉、合併標題、完成 | UI | T1 | P2 | `no13_merge_editor_screen` | `src/screens/Merge/MergeEditorScreen.tsx` | 進合併編輯器 | — | — | 現役 |
| C-EN-081 | 雙選擇器並排同框、中間以箭頭表示方向 | UI | T1 | P2 | `no13_merge_editor_screen` | `src/components/DualPickerBox.tsx` | 進合併編輯器 | — | — | 現役 |
| C-EN-082 | 兩選擇器皆常駐顯示、不另彈出選擇清單 | UI | T1 | P2 | `no13_merge_editor_screen` | `src/components/EntitySelector.tsx` | 進合併編輯器 | — | — | 現役 |
| C-EN-083 | 目標項目圖示以主色強調、表示保留端 | UI | T1 | P2 | `no13_merge_editor_screen` | `src/screens/Merge/MergeEditorScreen.tsx` | 進合併編輯器 | — | — | 現役 |
| C-EN-084 | 來源與目標圖示分別對齊下方選擇器欄位 | UI | T1 | P2 | `no13_merge_editor_screen` | `src/screens/Merge/MergeEditorScreen.tsx` | 進合併編輯器 | — | — | 現役 |
| C-EN-085 | 帳戶合併的兩選擇器皆不列出已停用帳戶 | UI | T1 | P1 | `no13_merge_editor_screen` | `src/services/localDbService.ts::getAccountsForSelector` | 已有停用帳戶 | — | `src/services/localDbService.test.ts`（getAccountsForSelector filters by the caller user_id） | 現役 |
| C-EN-086 | 類別合併的兩選擇器皆不列出已停用類別 | UI | T1 | P1 | `no13_merge_editor_screen` | `src/services/localDbService.ts::getCategoriesForSelector` | 已有停用類別 | — | `src/services/localDbService.test.ts`（getCategoriesForSelector filters by the caller user_id） | 現役 |
| C-EN-087 | 來源初始為清單第一項 | UI | T1 | P1 | `no13_merge_editor_screen` | `src/utils/pickerAutoSelect.ts::resolveAutoPick` | 進合併編輯器 | — | `src/utils/pickerAutoSelect.test.ts`（picks the first item when there is no sibling to avoid (avoidId undefined)） | 現役 |
| C-EN-088 | 類別模式目標僅列與來源同型別的項目 | UI | T1 | P1 | `no13_merge_editor_screen` | `src/components/CategorySelector.tsx` | 兩型類別皆存在時進類別合併 | — | — | 現役 |
| C-EN-089 | 帳戶模式目標僅列與來源同幣別的項目 | UI | T1 | P1 | `no13_merge_editor_screen` | `src/components/AccountSelector.tsx` | 已有多幣別帳戶時進帳戶合併 | — | — | 現役 |
| C-EN-090 | 目標初始為相容清單中第一個不等於來源的項目 | UI | T1 | P1 | `no13_merge_editor_screen` | `src/utils/pickerAutoSelect.ts::resolveAutoPick` | 進合併編輯器 | — | `src/utils/pickerAutoSelect.test.ts`（picks the first item that is not the avoided id — the to=second default） | 現役 |
| C-EN-091 | 來源尚未就緒時目標暫不自動選取、待來源定後才選 | UI | T4 | P1 | — | `src/utils/pickerAutoSelect.ts::resolveAutoPick` | 不適用 | 來源未就緒僅存在於渲染瞬間、無畫面判準 | `src/utils/pickerAutoSelect.test.ts`（defers while the sibling is not ready yet (avoidId null)） | 現役 |
| C-EN-092 | 變更來源致目標不相容時目標自動改挑相容首項 | UI | T1 | P1 | `no13_merge_editor_screen` | `src/utils/pickerAutoSelect.ts::resolveAutoPick` | 多幣別帳戶下進帳戶合併 | — | `src/utils/pickerAutoSelect.test.ts`（re-picks first-not-avoided when the value fell out of the list (type/currency switch)） | 現役 |
| C-EN-093 | 相容清單僅來源一項時目標維持為來源 | UI | T1 | P1 | `no13_merge_editor_screen` | `src/utils/pickerAutoSelect.ts::resolveAutoPick` | 某幣別僅有一個帳戶 | — | `src/utils/pickerAutoSelect.test.ts`（returns the lone item when the only compatible option is the avoided id） | 現役 |
| C-EN-094 | 同一清單內手動選到相同項時不自動跳開 | UI | T1 | P2 | — | `src/utils/pickerAutoSelect.ts::resolveAutoPick` | 兩側選同一項 | — | `src/utils/pickerAutoSelect.test.ts`（keeps a value equal to the source — collision stays for the red frame, no jump） | 現役 |
| C-EN-095 | 來源與目標相同時雙選擇器外框以錯誤色標示 | UI | T1 | P1 | `no13_merge_editor_screen` | `src/components/DualPickerBox.tsx` | 兩側選同一項 | — | — | 現役 |
| C-EN-096 | 來源與目標相同時完成按鈕不可點按 | UI | T1 | P1 | `no13_merge_editor_screen` | `src/screens/Merge/MergeEditorScreen.tsx` | 兩側選同一項 | — | — | 現役 |
| C-EN-097 | 來源或目標未選擇時完成按鈕不可點按 | UI | T1 | P1 | `no13_merge_editor_screen` | `src/screens/Merge/MergeEditorScreen.tsx` | 該實體全部項目皆已停用 | — | — | 現役 |
| C-EN-098 | 合併執行中完成按鈕不可點按 | UI | T4 | P1 | — | `src/screens/Merge/MergeEditorScreen.tsx` | 不適用 | 合併瞬間完成、無法手動攔截該區間 | — | 現役 |
| C-EN-099 | 點按完成後顯示合併確認對話框、含取消與合併兩選項 | UI | T1 | P1 | — | `src/screens/Merge/MergeEditorScreen.tsx` | 兩側選不同項 | — | — | 現役 |
| C-EN-100 | 合併確認對話框點取消時不執行合併、零寫入 | UI+DB | T2 | P1 | — | `src/screens/Merge/MergeEditorScreen.tsx` | 兩側選不同項 | — | — | 現役 |
| C-EN-101 | 來源與目標不相容時提示錯誤、不進確認對話框 | UI | T4 | P0 | `no13_merge_editor_screen` | `src/screens/Merge/MergeEditorScreen.tsx::handleSave` | 不適用 | 目標清單已預過濾、無手動入口 | — | 現役 |
| C-EN-102 | 確認合併前先擷取受影響記錄的識別碼快照 | DB | T4 | P0 | `no16_merge_logic` | `src/screens/Merge/MergeEditorScreen.tsx` | 不適用 | 需觀察合併前後查詢順序、無畫面判準 | — | 現役 |
| C-EN-103 | 帳戶模式確認合併後執行帳戶合併 | UI+DB | T2 | P0 | `no13_merge_editor_screen` | `src/services/mergeService.ts::performMerge` | 同幣別兩帳戶各有交易 | — | — | 現役 |
| C-EN-104 | 類別模式確認合併後執行類別合併 | UI+DB | T2 | P0 | `no13_merge_editor_screen` | `src/services/mergeService.ts::performMerge` | 同型兩類別各有交易 | — | — | 現役 |
| C-EN-105 | 合併成功後顯示復原列並返回上一頁 | UI | T1 | P1 | `no13_merge_editor_screen` | `src/screens/Merge/MergeEditorScreen.tsx` | 兩側選不同項 | — | — | 現役 |
| C-EN-106 | 合併失敗時顯示錯誤提示、停留原頁 | UI | T4 | P2 | `no13_merge_editor_screen` | `src/screens/Merge/MergeEditorScreen.tsx` | 不適用 | 合併寫入失敗無手動入口 | — | 現役 |

---

## 邏輯：類別核心邏輯

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-EN-107 | 新建類別排序值取同型未刪最大值加一 | DB | T2 | P1 | — | `src/utils/sortOrder.ts::nextSortOrder` | 同型已有類別 | — | `src/services/categoryLogic.test.ts`（sets sortOrder = same-type max + 1, ignoring the other type） | 現役 |
| C-EN-108 | 型別分區為空時新建類別排序值起始 0 | DB | T2 | P2 | — | `src/utils/sortOrder.ts::nextSortOrder` | 收入區為空 | — | `src/services/categoryLogic.test.ts`（starts at 0 when the type section is empty） | 現役 |
| C-EN-109 | 計算類別排序最大值時排除軟刪列 | DB | T2 | P1 | — | `src/services/categoryLogic.ts::createCategory` | 已刪掉排序值最大的類別 | — | `src/services/categoryLogic.test.ts`（ignores soft-deleted rows when computing the max） | 現役 |
| C-EN-110 | 新建類別時關閉啟用開關則寫入停用戳記 | DB | T2 | P1 | `no1_data_models` | `src/services/categoryLogic.ts::createCategory` | 新增類別時關閉啟用開關 | — | `src/services/categoryLogic.test.ts`（stamps disabledOn when created disabled） | 現役 |
| C-EN-111 | 建立類別遇名稱過長時驗證失敗、不寫入 | DB | T3 | P2 | `no14_category_logic` | `src/services/categoryLogic.ts::createCategory` | 匯入檔含超長類別名稱 | — | `src/services/categoryLogic.test.ts`（R-CM-033: throws ValidationError NAME_TOO_LONG when the trimmed name exceeds NAME_MAX_LENGTH） | 現役 |
| C-EN-112 | 類別名稱長度以去除前後空白後計算 | DB | T3 | P2 | `no14_category_logic` | `src/services/categoryLogic.ts::createCategory` | 匯入檔含前後帶空白的滿長類別名稱 | — | `src/services/categoryLogic.test.ts`（R-CM-033: compares the TRIMMED length — surrounding whitespace does not count against the limit） | 現役 |
| C-EN-113 | 更新類別只改名稱、圖示與停用狀態、型別不動 | DB | T2 | P0 | `no14_category_logic` | `src/services/categoryLogic.ts::updateCategory` | 編輯既有類別 | — | `src/services/categoryLogic.test.ts`（updates the editable fields and leaves type untouched） | 現役 |
| C-EN-114 | 重新啟用類別時停用戳記清為 Null | DB | T2 | P1 | `no14_category_logic` | `src/services/categoryLogic.ts::updateCategory` | 已有停用類別 | — | `src/services/categoryLogic.test.ts`（clears disabledOn when re-enabled） | 現役 |
| C-EN-115 | 重排類別批次改寫每個移動列的排序值 | DB | T2 | P1 | `no14_category_logic` | `src/services/categoryLogic.ts::reorderCategories` | 支出區有三個以上類別 | — | `src/services/categoryLogic.test.ts`（rewrites sortOrder to the new index for every moved row in one batch） | 現役 |
| C-EN-116 | 重排類別僅寫入位置有變的列 | DB | T4 | P2 | — | `src/services/categoryLogic.ts::reorderCategories` | 不適用 | 需觀察寫入集合、無畫面判準 | `src/services/categoryLogic.test.ts`（writes only the rows whose index changed） | 現役 |
| C-EN-117 | 刪除類別連帶軟刪其全部未刪交易 | DB | T2 | P0 | `no14_category_logic` | `src/services/categoryLogic.ts::deleteCategoryCascade` | 該類別下已有交易 | — | `src/services/categoryLogic.test.ts`（soft-deletes the category and every related live transaction with the same timestamp） | 現役 |
| C-EN-118 | 類別與其交易的軟刪共用同一時間戳 | DB | T2 | P1 | — | `src/services/categoryLogic.ts::deleteCategoryCascade` | 該類別下已有交易 | — | `src/services/categoryLogic.test.ts`（soft-deletes the category and every related live transaction with the same timestamp） | 現役 |
| C-EN-119 | 刪除類別不動其他類別的交易 | DB | T2 | P0 | `no14_category_logic` | `src/services/categoryLogic.ts::deleteCategoryCascade` | 兩個類別各有交易 | — | `src/services/categoryLogic.test.ts`（does not touch transactions of other categories or already-deleted transactions） | 現役 |
| C-EN-120 | 刪除類別不重複軟刪已刪除的交易 | DB | T2 | P1 | — | `src/services/categoryLogic.ts::deleteCategoryCascade` | 該類別下有已刪交易 | — | `src/services/categoryLogic.test.ts`（does not touch transactions of other categories or already-deleted transactions） | 現役 |
| C-EN-121 | 類別與其交易的軟刪於單一批次提交 | DB | T4 | P0 | — | `src/services/categoryLogic.ts::deleteCategoryCascade` | 不適用 | 需觀察交易邊界、無畫面判準 | `src/services/categoryLogic.test.ts`（commits the category and transaction soft-deletes in a single batch） | 現役 |
| C-EN-122 | 類別無交易時仍正常軟刪該類別 | DB | T2 | P1 | `no14_category_logic` | `src/services/categoryLogic.ts::deleteCategoryCascade` | 有一個無交易的類別 | — | `src/services/categoryLogic.test.ts`（soft-deletes the category even when it has no transactions） | 現役 |
| C-EN-123 | 復原刪除類別依快照還原同一批交易、不重查 | DB | T2 | P0 | — | `src/services/categoryLogic.ts::restoreCategoryCascade` | 刪除前該類別下已有先前刪掉的交易 | — | — | 現役 |

---

## 邏輯：帳戶核心邏輯

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-EN-124 | 新建帳戶排序值取未刪最大值加一 | DB | T2 | P1 | — | `src/utils/sortOrder.ts::nextSortOrder` | 已有帳戶 | — | `src/services/accountLogic.test.ts`（sets sortOrder = non-deleted max + 1 and seeds the rate after the write (non-nested)） | 現役 |
| C-EN-125 | 無帳戶時新建帳戶排序值起始 0 | DB | T2 | P2 | — | `src/utils/sortOrder.ts::nextSortOrder` | 空庫尚無帳戶 | — | `src/services/accountLogic.test.ts`（starts at 0 for the first account and ignores soft-deleted rows in the max） | 現役 |
| C-EN-126 | 計算帳戶排序最大值時排除軟刪列 | DB | T2 | P1 | — | `src/services/accountLogic.ts::createAccount` | 已刪掉排序值最大的帳戶 | — | `src/services/accountLogic.test.ts`（starts at 0 for the first account and ignores soft-deleted rows in the max） | 現役 |
| C-EN-127 | 新建帳戶時關閉啟用開關則寫入停用戳記 | DB | T2 | P1 | `no1_data_models` | `src/services/accountLogic.ts::createAccount` | 新增帳戶時關閉啟用開關 | — | `src/services/accountLogic.test.ts`（stamps disabledOn when created disabled） | 現役 |
| C-EN-128 | 建立帳戶遇名稱過長時驗證失敗、不寫入也不種匯率 | DB | T3 | P2 | `no15_account_logic` | `src/services/accountLogic.ts::createAccount` | 匯入檔含超長帳戶名稱 | — | `src/services/accountLogic.test.ts`（R-CM-070: throws ValidationError NAME_TOO_LONG when the trimmed name exceeds NAME_MAX_LENGTH） | 現役 |
| C-EN-129 | 帳戶名稱長度以去除前後空白後計算 | DB | T3 | P2 | `no15_account_logic` | `src/services/accountLogic.ts::createAccount` | 匯入檔含前後帶空白的滿長帳戶名稱 | — | `src/services/accountLogic.test.ts`（R-CM-070: compares the TRIMMED length — surrounding whitespace does not count against the limit） | 現役 |
| C-EN-130 | 建立帳戶時幣別非主要貨幣則種入佔位匯率 | DB | T2 | P0 | `no15_account_logic` | `src/services/currencyService.ts::ensureRateForNewAccount` | 建立一個外幣帳戶 | — | — | 現役 |
| C-EN-131 | 佔位匯率於帳戶寫入完成後才種、不巢狀 | DB | T4 | P1 | — | `src/services/accountLogic.ts::createAccount` | 不適用 | 需觀察寫入巢狀、無畫面判準 | `src/services/accountLogic.test.ts`（sets sortOrder = non-deleted max + 1 and seeds the rate after the write (non-nested)） | 現役 |
| C-EN-132 | 更新帳戶只改名稱、圖示與停用狀態、幣別不動 | DB | T2 | P0 | `no12_account_editor_screen` | `src/services/accountLogic.ts::updateAccount` | 編輯既有帳戶 | — | `src/services/accountLogic.test.ts`（updates the editable fields and leaves currencyCode untouched） | 現役 |
| C-EN-133 | 重新啟用帳戶時停用戳記清為 Null | DB | T2 | P1 | `no1_data_models` | `src/services/accountLogic.ts::updateAccount` | 已有停用帳戶 | — | `src/services/accountLogic.test.ts`（clears disabledOn when re-enabled） | 現役 |
| C-EN-134 | 重排帳戶批次改寫每個移動列的排序值 | DB | T2 | P1 | `no15_account_logic` | `src/services/accountLogic.ts::reorderAccounts` | 已有三個以上帳戶 | — | `src/services/accountLogic.test.ts`（rewrites sortOrder to the new index for every moved row in one batch） | 現役 |
| C-EN-135 | 重排帳戶僅寫入位置有變的列 | DB | T4 | P2 | — | `src/services/accountLogic.ts::reorderAccounts` | 不適用 | 需觀察寫入集合、無畫面判準 | `src/services/accountLogic.test.ts`（writes only the rows whose index changed） | 現役 |
| C-EN-136 | 刪除帳戶連帶軟刪其全部未刪交易 | DB | T2 | P0 | `no15_account_logic` | `src/services/accountLogic.ts::deleteAccountCascade` | 該帳戶下已有交易 | — | — | 現役 |
| C-EN-137 | 刪除帳戶連帶軟刪以其為轉出方的轉帳 | DB | T2 | P0 | `no15_account_logic` | `src/services/accountLogic.ts::deleteAccountCascade` | 該帳戶有轉出紀錄 | — | — | 現役 |
| C-EN-138 | 刪除帳戶連帶軟刪以其為轉入方的轉帳 | DB | T2 | P0 | `no15_account_logic` | `src/services/accountLogic.ts::deleteAccountCascade` | 該帳戶有轉入紀錄 | — | — | 現役 |
| C-EN-139 | 帳戶與其紀錄的軟刪共用同一時間戳 | DB | T2 | P1 | — | `src/services/accountLogic.ts::deleteAccountCascade` | 該帳戶下已有交易與轉帳 | — | `src/services/accountLogic.test.ts`（soft-deletes the account plus all its transactions and transfers in one batch） | 現役 |
| C-EN-140 | 刪除帳戶不動其他帳戶的交易 | DB | T2 | P0 | `no15_account_logic` | `src/services/accountLogic.ts::deleteAccountCascade` | 兩個帳戶各有交易 | — | — | 現役 |
| C-EN-141 | 刪除帳戶不重複軟刪已刪除的交易 | DB | T2 | P1 | — | `src/services/accountLogic.ts::deleteAccountCascade` | 該帳戶下有已刪交易 | — | — | 現役 |
| C-EN-142 | 帳戶與其紀錄的軟刪於單一批次提交 | DB | T4 | P0 | — | `src/services/accountLogic.ts::deleteAccountCascade` | 不適用 | 需觀察交易邊界、無畫面判準 | `src/services/accountLogic.test.ts`（soft-deletes the account plus all its transactions and transfers in one batch） | 現役 |
| C-EN-143 | 帳戶無紀錄時仍正常軟刪該帳戶 | DB | T2 | P1 | `no15_account_logic` | `src/services/accountLogic.ts::deleteAccountCascade` | 有一個無紀錄的帳戶 | — | `src/services/accountLogic.test.ts`（still soft-deletes the account when it has no transactions or transfers） | 現役 |
| C-EN-144 | 復原刪除帳戶依快照還原同一批交易與轉帳、不重查 | DB | T2 | P0 | — | `src/services/accountLogic.ts::restoreAccountCascade` | 刪除前該帳戶下已有先前刪掉的交易 | — | — | 現役 |

---

## 邏輯：合併

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-EN-145 | 跨幣別帳戶合併中止且零寫入 | DB | T4 | P0 | `no16_merge_logic` | `src/services/mergeService.ts::performMerge` | 不適用 | 畫面已擋跨幣別、無手動入口 | `src/services/mergeService.test.ts`（aborts an account merge across different currencies and writes nothing） | 現役 |
| C-EN-146 | 跨型別類別合併中止且零寫入 | DB | T4 | P0 | `no16_merge_logic` | `src/services/mergeService.ts::performMerge` | 不適用 | 畫面已擋跨型別、無手動入口 | `src/services/mergeService.test.ts`（aborts a category merge across different types and writes nothing） | 現役 |
| C-EN-147 | 同幣別兩帳戶合併後來源帳戶被軟刪 | DB | T2 | P0 | `no16_merge_logic` | `src/services/mergeService.ts::performMerge` | 同幣別兩帳戶 | — | `src/services/mergeService.test.ts`（passes the guard and reaches the batch for a same-currency account merge） | 現役 |
| C-EN-148 | 同型兩類別合併後來源類別被軟刪 | DB | T2 | P0 | `no16_merge_logic` | `src/services/mergeService.ts::performMerge` | 同型兩類別 | — | `src/services/mergeService.test.ts`（passes the guard and reaches the batch for a same-type category merge） | 現役 |
| C-EN-149 | 帳戶合併將來源的未刪交易改指目標 | DB | T2 | P0 | `no16_merge_logic` | `src/services/mergeService.ts::performMerge` | 來源帳戶有交易 | — | `src/services/mergeService.deletedFilter.test.ts`（excludes a soft-deleted transaction from the account move (AXIS4-21)） | 現役 |
| C-EN-150 | 帳戶合併將以來源為轉出方的轉帳改指目標 | DB | T2 | P0 | `no16_merge_logic` | `src/services/mergeService.ts::performMerge` | 來源帳戶有轉出紀錄 | — | `src/services/mergeService.deletedFilter.test.ts`（still moves an active outbound transfer onto the target (no regression)） | 現役 |
| C-EN-151 | 帳戶合併將以來源為轉入方的轉帳改指目標 | DB | T2 | P0 | `no16_merge_logic` | `src/services/mergeService.ts::performMerge` | 來源帳戶有轉入紀錄 | — | — | 現役 |
| C-EN-152 | 合併後轉出入同為目標的冗餘轉帳被軟刪 | DB | T2 | P0 | `no16_merge_logic` | `src/services/mergeService.ts::performMerge` | 兩帳戶間已有互轉紀錄 | — | `src/services/mergeService.revertSelfTransfer.test.ts`（fully reverts with the mutually exclusive snapshot the screen now produces (R-XD-010 round trip)） | 現役 |
| C-EN-153 | 合併不重新戳記已軟刪的轉出紀錄 | DB | T2 | P1 | — | `src/services/mergeService.ts::performMerge` | 來源帳戶有已刪轉帳 | — | `src/services/mergeService.deletedFilter.test.ts`（does not re-stamp or bump a soft-deleted outbound transfer (AXIS4-21)） | 現役 |
| C-EN-154 | 合併不二次軟刪已刪除的自轉帳 | DB | T2 | P1 | — | `src/services/mergeService.ts::performMerge` | 兩帳戶間有已刪互轉紀錄 | — | `src/services/mergeService.deletedFilter.test.ts`（does not soft-delete an already-deleted self-transfer a second time (AXIS4-11 source-of-revival)） | 現役 |
| C-EN-155 | 合併排除已軟刪的交易、不納入搬移 | DB | T2 | P1 | — | `src/services/mergeService.ts::performMerge` | 來源帳戶有已刪交易 | — | `src/services/mergeService.deletedFilter.test.ts`（excludes a soft-deleted transaction from the account move (AXIS4-21)） | 現役 |
| C-EN-156 | 類別合併將來源的未刪交易改指目標 | DB | T2 | P0 | `no16_merge_logic` | `src/services/mergeService.ts::performMerge` | 來源類別有交易 | — | — | 現役 |
| C-EN-157 | 帳戶合併軟刪模板指向來源帳戶的未刪定期排程 | DB | T2 | P0 | — | `src/services/mergeService.ts::buildSourceScheduleSoftDeletes` | 來源帳戶為某定期排程的模板帳戶 | — | — | 現役 |
| C-EN-158 | 類別合併軟刪模板指向來源類別的未刪定期排程 | DB | T2 | P0 | — | `src/services/mergeService.ts::buildSourceScheduleSoftDeletes` | 來源類別為某定期排程的模板類別 | — | — | 現役 |
| C-EN-159 | 合併的搬移、排程軟刪與來源軟刪於單一批次提交 | DB | T4 | P0 | — | `src/services/mergeService.ts::performMerge` | 不適用 | 需觀察交易邊界、無畫面判準 | — | 現役 |

---

## 邏輯：復原合併

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-EN-160 | 復原合併清空來源的刪除戳記、來源重新出現 | DB | T2 | P0 | `no16_merge_logic` | `src/services/mergeService.ts::revertMerge` | 剛完成一次合併 | — | `src/services/mergeService.revertSelfTransfer.test.ts`（fully reverts with the mutually exclusive snapshot the screen now produces (R-XD-010 round trip)） | 現役 |
| C-EN-161 | 復原合併依快照將交易改回來源 | DB | T2 | P0 | `no16_merge_logic` | `src/services/mergeService.ts::revertMerge` | 剛完成一次來源有交易的合併 | — | `src/services/mergeService.revertSelfTransfer.test.ts`（fully reverts with the mutually exclusive snapshot the screen now produces (R-XD-010 round trip)） | 現役 |
| C-EN-162 | 帳戶模式復原合併依快照將轉帳兩方改回來源 | DB | T2 | P0 | `no16_merge_logic` | `src/services/mergeService.ts::revertMerge` | 剛完成一次來源有轉出入紀錄的帳戶合併 | — | `src/services/mergeService.revertSelfTransfer.test.ts`（fully reverts with the mutually exclusive snapshot the screen now produces (R-XD-010 round trip)） | 現役 |
| C-EN-163 | 帳戶模式復原合併恢復被軟刪的冗餘轉帳 | DB | T2 | P0 | `no16_merge_logic` | `src/services/mergeService.ts::revertMerge` | 剛完成一次有冗餘轉帳的帳戶合併 | — | `src/services/mergeService.revertSelfTransfer.test.ts`（fully reverts with the mutually exclusive snapshot the screen now produces (R-XD-010 round trip)） | 現役 |
| C-EN-164 | 復原合併一併還原合併時軟刪的定期排程 | DB | T2 | P0 | — | `src/services/mergeService.ts::revertMerge` | 剛完成一次來源為排程模板的合併 | — | `src/services/mergeService.revertSelfTransfer.test.ts`（fully reverts with the mutually exclusive snapshot the screen now produces (R-XD-010 round trip)） | 現役 |
| C-EN-165 | 快照同時列出自轉帳於兩清單時仍完整復原 | DB | T4 | P1 | — | `src/services/mergeService.ts::revertMerge` | 不適用 | 舊版快照格式無法佈置 | `src/services/mergeService.revertSelfTransfer.test.ts`（fully reverts even when the snapshot lists a self-transfer in both from/to and deleted lists (legacy overlap)） | 現役 |
| C-EN-166 | 復原合併於單一批次提交、不半套套用 | DB | T4 | P0 | — | `src/services/mergeService.ts::revertMerge` | 不適用 | 需觀察交易邊界、無畫面判準 | `src/services/mergeService.revertSelfTransfer.test.ts`（commits the whole revert in a single batch so a pre-batch throw cannot half-apply） | 現役 |

---
