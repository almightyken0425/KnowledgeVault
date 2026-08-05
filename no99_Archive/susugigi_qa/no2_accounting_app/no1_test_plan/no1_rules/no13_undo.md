# 檢驗點：復原

檢驗點清單分冊。欄位定義、自檢方式與全冊索引見 `../no0_index.md`。

- 域碼：C-UD
- 涵蓋：復原列元件與出現時機、復原等待狀態機、各編輯器的復原路徑

---

## 畫面：復原列

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-UD-001 | 復原列覆蓋於編輯器關閉後返回的目的畫面底部 | UI | T1 | P1 | `undo_bar_policy` | `src/navigation/AppNavigator.tsx::NavigatorContent` | 已有可用帳戶與類別 | — | — | 現役 |
| C-UD-002 | 自不同畫面觸發的復原列皆顯示於畫面底部同一位置 | UI | T1 | P2 | `undo_bar_policy` | `src/navigation/AppNavigator.tsx::NavigatorContent` | 已有可用帳戶與類別 | — | — | 現役 |
| C-UD-003 | 復原段並列倒數數字與復原標籤 | UI | T1 | P2 | `undo_bar_policy` | `src/components/FloatingActionBar.tsx` | 復原列顯示中 | — | — | 現役 |
| C-UD-004 | 點按倒數數字處與點按復原標籤處同樣觸發復原 | UI | T1 | P2 | `undo_bar_policy` | `src/components/FloatingActionBar.tsx` | 復原列顯示中 | — | — | 現役 |
| C-UD-005 | 復原標籤不隨操作類型變動 | UI | T1 | P2 | `undo_bar_policy` | `src/components/FloatingActionBar.tsx` | 已有可用帳戶與類別，且已有一筆既有交易 | — | — | 現役 |
| C-UD-006 | 取消段排在復原段之後 | UI | T1 | P2 | `undo_bar_policy` | `src/components/FloatingActionBar.tsx` | 復原列顯示中 | — | — | 現役 |
| C-UD-007 | 倒數數字自 4 起每秒遞減 | UI | T1 | P1 | `no11_undo_logic` | `src/contexts/UndoContext.tsx::beginCountdown` | 復原列顯示中 | — | — | 現役 |

---

## 畫面：出現時機

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-UD-008 | 交易編輯器新增、編輯、刪除成功後皆顯示復原列 | UI | T1 | P1 | `undo_bar_policy` | `src/screens/Transactions/TransactionEditorScreen.tsx` | 已有可用帳戶與類別，且已有一筆既有交易 | — | — | 現役 |
| C-UD-009 | 轉帳編輯器新增、編輯、刪除成功後皆顯示復原列 | UI | T1 | P1 | `undo_bar_policy` | `src/screens/Transactions/TransferEditorScreen.tsx` | 已有兩個可用帳戶，且已有一筆既有轉帳 | — | — | 現役 |
| C-UD-010 | 帳戶編輯器新增、編輯、刪除成功後皆顯示復原列 | UI | T1 | P1 | `undo_bar_policy` | `src/screens/Accounts/AccountEditorScreen.tsx` | 已有一個既有帳戶 | — | — | 現役 |
| C-UD-011 | 類別編輯器新增、編輯、刪除成功後皆顯示復原列 | UI | T1 | P1 | `undo_bar_policy` | `src/screens/Categories/CategoryEditorScreen.tsx` | 已有一個既有類別 | — | — | 現役 |
| C-UD-012 | 合併編輯器完成合併後顯示復原列 | UI | T1 | P1 | `undo_bar_policy` | `src/screens/Merge/MergeEditorScreen.tsx::handleSave` | 已有兩個各有交易的同型帳戶 | — | — | 現役 |
| C-UD-013 | 交易編輯器建立定期排程成功後顯示復原列 | UI | T1 | P1 | `undo_bar_policy` | `src/screens/Transactions/TransactionEditorScreen.tsx::handleSave` | 已有可用帳戶與類別 | — | — | 現役 |
| C-UD-014 | 交易編輯器將既有交易轉為定期排程後顯示復原列 | UI | T1 | P1 | `undo_bar_policy` | `src/screens/Transactions/TransactionEditorScreen.tsx::handleSave` | 已有一筆非定期的既有交易 | — | — | 現役 |
| C-UD-015 | 定期交易編輯選僅此一筆或此筆及未來皆顯示復原列 | UI | T1 | P1 | `undo_bar_policy` | `src/screens/Transactions/TransactionEditorScreen.tsx::handleSave` | 已有定期排程產生的交易 | — | — | 現役 |
| C-UD-016 | 定期交易刪除選僅此一筆或此筆及未來皆顯示復原列 | UI | T1 | P1 | `undo_bar_policy` | `src/screens/Transactions/TransactionEditorScreen.tsx::handleDelete` | 已有定期排程產生的交易 | — | — | 現役 |
| C-UD-017 | 轉帳編輯器建立定期排程成功後顯示復原列 | UI | T1 | P1 | `undo_bar_policy` | `src/screens/Transactions/TransferEditorScreen.tsx::handleSave` | 已有兩個可用帳戶 | — | — | 現役 |
| C-UD-018 | 轉帳編輯器將既有轉帳轉為定期排程後顯示復原列 | UI | T1 | P1 | `undo_bar_policy` | `src/screens/Transactions/TransferEditorScreen.tsx::handleSave` | 已有一筆非定期的既有轉帳 | — | — | 現役 |
| C-UD-019 | 定期轉帳編輯選僅此一筆或此筆及未來皆顯示復原列 | UI | T1 | P1 | `undo_bar_policy` | `src/screens/Transactions/TransferEditorScreen.tsx::handleSave` | 已有定期排程產生的轉帳 | — | — | 現役 |
| C-UD-020 | 定期轉帳刪除選僅此一筆或此筆及未來皆顯示復原列 | UI | T1 | P1 | `undo_bar_policy` | `src/screens/Transactions/TransferEditorScreen.tsx::handleDelete` | 已有定期排程產生的轉帳 | — | — | 現役 |

---

## 邏輯：復原等待狀態機

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-UD-021 | 復原列顯示約 4 秒無互動後自動關閉 | UI | T1 | P1 | `undo_bar_policy` | `src/contexts/UndoContext.tsx::beginCountdown` | 復原列顯示中 | — | — | 現役 |
| C-UD-022 | 倒數自復原列露出後起算、觸發它的編輯器仍開啟時不遞減 | UI | T1 | P1 | `no11_undo_logic` | `src/navigation/AppNavigator.tsx::NavigatorContent` | 已有定期排程產生的交易 | — | — | 現役 |
| C-UD-023 | 復原列顯示中切換畫面不重置倒數 | UI | T1 | P2 | — | `src/contexts/UndoContext.tsx::beginCountdown` | 復原列顯示中 | — | — | 現役 |
| C-UD-024 | 連續兩次寫入操作只留一列復原列且倒數重新自 4 起算 | UI | T1 | P1 | `undo_bar_policy` | `src/contexts/UndoContext.tsx::showUndo` | 復原列顯示中 | — | — | 現役 |
| C-UD-025 | 點按復原段執行復原並關閉復原列 | UI+DB | T2 | P0 | `no11_undo_logic` | `src/contexts/UndoContext.tsx::executeUndo` | 新增交易的復原列顯示中 | — | — | 現役 |
| C-UD-026 | 點按取消段關閉復原列且不執行復原 | UI+DB | T2 | P0 | `no11_undo_logic` | `src/contexts/UndoContext.tsx::closeUndo` | 新增交易的復原列顯示中 | — | — | 現役 |
| C-UD-027 | 倒數歸零自動關閉時不執行復原 | UI+DB | T2 | P0 | `no11_undo_logic` | `src/contexts/UndoContext.tsx::beginCountdown` | 新增交易的復原列顯示中 | — | — | 現役 |
| C-UD-028 | 復原列關閉後同一操作不再可復原 | UI | T1 | P2 | `no11_undo_logic` | `src/contexts/UndoContext.tsx::closeUndo` | 復原列已自動關閉 | — | — | 現役 |
| C-UD-029 | 復原執行失敗時顯示復原失敗提示並關閉復原列 | UI | T4 | P1 | `no11_undo_logic` | `src/contexts/UndoContext.tsx::executeUndo` | 不適用 | 復原動作失敗無手動入口 | — | 現役 |
| C-UD-030 | 復原成功後首頁列表重新查詢 | UI | T1 | P1 | `no11_undo_logic` | `src/screens/Home/HomeScreen.tsx` | 自首頁新增交易的復原列顯示中 | — | — | 現役 |
| C-UD-031 | 復原成功後搜尋頁以當前關鍵字重新查詢 | UI | T1 | P1 | `no11_undo_logic` | `src/screens/Search/SearchScreen.tsx` | 搜尋結果中刪除一筆交易的復原列顯示中 | — | — | 現役 |

---

## 邏輯：各編輯器的復原路徑

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-UD-032 | 新增交易的復原刪除剛建立的那筆交易 | DB | T2 | P0 | `no11_undo_logic` | `src/screens/Transactions/TransactionEditorScreen.tsx::handleSave` | 新增交易的復原列顯示中 | — | — | 現役 |
| C-UD-033 | 編輯交易的復原寫回更新前的金額、日期、帳戶、類別與備註 | DB | T2 | P0 | `no11_undo_logic` | `src/screens/Transactions/TransactionEditorScreen.tsx::handleSave` | 編輯既有交易的復原列顯示中 | — | — | 現役 |
| C-UD-034 | 刪除交易的復原使該筆交易重新出現 | DB | T2 | P0 | `no11_undo_logic` | `src/screens/Transactions/TransactionEditorScreen.tsx::handleDelete` | 刪除交易的復原列顯示中 | — | — | 現役 |
| C-UD-035 | 新增轉帳的復原刪除剛建立的那筆轉帳 | DB | T2 | P0 | `no11_undo_logic` | `src/screens/Transactions/TransferEditorScreen.tsx::handleSave` | 新增轉帳的復原列顯示中 | — | — | 現役 |
| C-UD-036 | 編輯轉帳的復原寫回更新前的兩腿金額、日期、兩端帳戶與備註 | DB | T2 | P0 | `no11_undo_logic` | `src/screens/Transactions/TransferEditorScreen.tsx::handleSave` | 編輯既有轉帳的復原列顯示中 | — | — | 現役 |
| C-UD-037 | 刪除轉帳的復原使該筆轉帳重新出現 | DB | T2 | P0 | `no11_undo_logic` | `src/screens/Transactions/TransferEditorScreen.tsx::handleDelete` | 刪除轉帳的復原列顯示中 | — | — | 現役 |
| C-UD-038 | 新增帳戶的復原刪除剛建立的帳戶 | DB | T2 | P0 | `no11_undo_logic` | `src/screens/Accounts/AccountEditorScreen.tsx::handleSave` | 新增帳戶的復原列顯示中 | — | — | 現役 |
| C-UD-039 | 新增外幣帳戶的復原不撤銷連帶種入的佔位匯率 | DB | T2 | P2 | — | `src/screens/Accounts/AccountEditorScreen.tsx::handleSave` | 新增非主要貨幣帳戶的復原列顯示中 | — | — | 現役 |
| C-UD-040 | 編輯帳戶的復原寫回更新前的名稱、圖示與啟用狀態 | DB | T2 | P0 | `no11_undo_logic` | `src/screens/Accounts/AccountEditorScreen.tsx::handleSave` | 編輯既有帳戶的復原列顯示中 | — | — | 現役 |
| C-UD-041 | 刪除帳戶的復原使該帳戶與其交易轉帳一併重新出現 | DB | T2 | P0 | `no11_undo_logic` | `src/screens/Accounts/AccountEditorScreen.tsx::handleDelete` | 刪除有交易與轉帳的帳戶的復原列顯示中 | — | — | 現役 |
| C-UD-042 | 新增類別的復原刪除剛建立的類別 | DB | T2 | P0 | `no11_undo_logic` | `src/screens/Categories/CategoryEditorScreen.tsx::handleSave` | 新增類別的復原列顯示中 | — | — | 現役 |
| C-UD-043 | 編輯類別的復原寫回更新前的名稱、圖示與啟用狀態 | DB | T2 | P0 | `no11_undo_logic` | `src/screens/Categories/CategoryEditorScreen.tsx::handleSave` | 編輯既有類別的復原列顯示中 | — | — | 現役 |
| C-UD-044 | 刪除類別的復原使該類別與其交易一併重新出現 | DB | T2 | P0 | `no11_undo_logic` | `src/screens/Categories/CategoryEditorScreen.tsx::handleDelete` | 刪除有交易的類別的復原列顯示中 | — | — | 現役 |
| C-UD-045 | 合併的復原依合併前擷取的受影響記錄快照還原 | DB | T2 | P0 | `no16_merge_logic` | `src/screens/Merge/MergeEditorScreen.tsx::handleSave` | 合併兩個各有交易帳戶的復原列顯示中 | — | — | 現役 |
| C-UD-046 | 合併的復原不復活合併前已刪除的轉帳 | DB | T2 | P0 | — | `src/screens/Merge/MergeEditorScreen.tsx::handleSave` | 來源帳戶有已刪除轉帳的合併復原列顯示中 | — | — | 現役 |
