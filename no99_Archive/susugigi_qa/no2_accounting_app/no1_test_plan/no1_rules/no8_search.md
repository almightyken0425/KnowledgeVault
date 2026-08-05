# 檢驗點：搜尋

檢驗點清單分冊。欄位定義、自檢方式與全冊索引見 `../no0_index.md`。

- 域碼：C-SR
- 涵蓋：搜尋畫面外框與搜尋列、空狀態、結果列表與列版型、搜尋查詢與過濾、觸發時機、結果導航

---

## 畫面：頁面外框與搜尋列

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-SR-001 | 搜尋畫面以 Modal 形式呈現 | UI | T1 | P2 | `no4_search_screen` | `src/navigation/AppNavigator.tsx` | 點首頁搜尋入口 | — | — | 現役 |
| C-SR-002 | 搜尋畫面導航列左側含關閉按鈕 | UI | T1 | P2 | `no4_search_screen` | `src/navigation/AppNavigator.tsx` | 進搜尋頁 | — | — | 現役 |
| C-SR-003 | 搜尋畫面導航列中央顯示搜尋標題 | UI | T1 | P2 | `no4_search_screen` | `src/navigation/AppNavigator.tsx` | 進搜尋頁 | — | — | 現役 |
| C-SR-004 | 點按關閉按鈕關閉搜尋畫面 | UI | T1 | P1 | `no4_search_screen` | `src/navigation/AppNavigator.tsx` | 進搜尋頁 | — | — | 現役 |
| C-SR-005 | 進搜尋頁時搜尋框自動取得焦點 | UI | T1 | P1 | `search_policy` | `src/screens/Search/SearchScreen.tsx` | 進搜尋頁 | — | — | 現役 |
| C-SR-006 | 搜尋頁結果清單開始捲動時收起鍵盤 | UI | T1 | P2 | `search_policy` | `src/screens/Search/SearchScreen.tsx` | 搜尋到多筆結果且鍵盤開啟 | — | — | 現役 |
| C-SR-007 | 搜尋頁捲動期間點按結果列仍可命中該列 | UI | T1 | P2 | `search_policy` | `src/screens/Search/SearchScreen.tsx` | 搜尋到多筆結果 | — | — | 現役 |
| C-SR-008 | 結果清單末列可捲至搜尋列上方 | UI | T1 | P2 | — | `src/screens/Search/SearchScreen.tsx` | 搜尋到滿一頁以上的結果 | — | — | 現役 |

---

## 畫面：空狀態

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-SR-009 | 搜尋框為空時顯示輸入關鍵字提示 | UI | T1 | P1 | `no4_search_screen` | `src/screens/Search/SearchScreen.tsx` | 進搜尋頁 | — | — | 現役 |
| C-SR-010 | 無符合結果時顯示找不到結果提示 | UI | T1 | P1 | `no4_search_screen` | `src/screens/Search/SearchScreen.tsx` | 搜尋不存在的關鍵字 | — | — | 現役 |
| C-SR-011 | 無結果提示副標回顯當前搜尋關鍵字 | UI | T1 | P2 | `no4_search_screen` | `src/screens/Search/SearchScreen.tsx` | 搜尋不存在的關鍵字 | — | — | 現役 |
| C-SR-012 | 搜尋執行期間不顯示任何空狀態提示 | UI | T4 | P2 | — | `src/screens/Search/SearchScreen.tsx` | 不適用 | 查詢執行僅數百毫秒、無穩定觀察窗 | — | 現役 |

---

## 畫面：結果列表容器

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-SR-013 | 搜尋結果外層由群組卡片包覆 | UI | T1 | P2 | `no4_search_screen` | `src/components/list/ListGroupCard.tsx` | 搜尋到結果 | — | — | 現役 |
| C-SR-014 | 結果各列間以細線分隔 | UI | T1 | P2 | `no4_search_screen` | `src/screens/Search/SearchScreen.tsx::createStyles` | 搜尋到多筆結果 | — | — | 現役 |
| C-SR-015 | 結果首列上緣不顯示分隔線 | UI | T1 | P2 | `no4_search_screen` | `src/components/list/ListGroupCard.tsx` | 搜尋到多筆結果 | — | — | 現役 |

---

## 畫面：結果列版型

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-SR-016 | 結果列採上下兩列排版 | UI | T1 | P2 | `no4_search_screen` | `src/screens/Search/SearchScreen.tsx::renderRow` | 搜尋到結果 | — | — | 現役 |
| C-SR-017 | 結果列上列左側圖示置於外框內 | UI | T1 | P2 | `no4_search_screen` | `src/screens/Search/SearchScreen.tsx::createStyles` | 搜尋到結果 | — | — | 現役 |
| C-SR-018 | 交易結果上列左側顯示類別圖示 | UI | T1 | P1 | `no4_search_screen` | `src/screens/Search/SearchScreen.tsx::renderRow` | 搜尋到交易 | — | — | 現役 |
| C-SR-019 | 轉帳結果上列左側顯示轉帳圖示 | UI | T1 | P1 | `no4_search_screen` | `src/screens/Search/SearchScreen.tsx::renderRow` | 搜尋到轉帳 | — | — | 現役 |
| C-SR-020 | 結果列圖示不依收支正負著色 | UI | T1 | P2 | `no4_search_screen` | `src/screens/Search/SearchScreen.tsx::renderRow` | 搜尋到收支各一筆 | — | — | 現役 |
| C-SR-021 | 查無所屬類別的交易結果圖示改顯問號並採次要色 | UI | T3 | P2 | — | `src/screens/Search/SearchScreen.tsx::renderRow` | sqlite 注入不存在的類別 id | — | — | 現役 |
| C-SR-022 | 交易結果上列中段顯示類別名稱 | UI | T1 | P1 | `no4_search_screen` | `src/screens/Search/SearchScreen.tsx::renderRow` | 搜尋到交易 | — | — | 現役 |
| C-SR-023 | 查無所屬類別的交易結果中段顯示未分類文字 | UI | T3 | P2 | — | `src/screens/Search/SearchScreen.tsx::renderRow` | sqlite 注入不存在的類別 id | — | — | 現役 |
| C-SR-024 | 轉帳結果上列中段顯示兩帳戶名稱與方向箭頭 | UI | T1 | P1 | `no4_search_screen` | `src/screens/Search/SearchScreen.tsx::renderRow` | 搜尋到轉帳 | — | — | 現役 |
| C-SR-025 | 結果列下列左為備註、右為日期 | UI | T1 | P1 | `no4_search_screen` | `src/screens/Search/SearchScreen.tsx::renderRow` | 搜尋到帶備註的紀錄 | — | — | 現役 |
| C-SR-026 | 備註以純文字單行顯示、命中的關鍵字不加標示 | UI | T1 | P1 | `no4_search_screen` | `src/screens/Search/SearchScreen.tsx::renderRow` | 搜尋備註中的字串 | — | — | 現役 |

---

## 畫面：結果金額

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-SR-027 | 結果金額色與首頁逐筆列表金額色一致 | UI | T1 | P2 | `no4_search_screen` | `src/screens/Search/SearchScreen.tsx::renderRow` | 首頁與搜尋頁皆可見同一筆紀錄 | — | — | 現役 |
| C-SR-028 | 結果金額不依收支正負著色 | UI | T1 | P2 | `no4_search_screen` | `src/screens/Search/SearchScreen.tsx::renderRow` | 搜尋到收支各一筆 | — | — | 現役 |
| C-SR-029 | 結果金額的幣別符號字級小於數字 | UI | T1 | P2 | — | `src/components/InlineAmount.tsx` | 搜尋到結果 | — | — | 現役 |
| C-SR-030 | 交易收入結果不顯示正負號 | UI | T1 | P1 | `no4_search_screen` | `src/utils/formatters.ts::formatCurrencyValue` | 搜尋到收入 | — | — | 現役 |
| C-SR-031 | 交易支出結果於幣別符號與數字間顯示負號 | UI | T1 | P1 | `no4_search_screen` | `src/utils/formatters.ts::insertMinusAfterSymbol` | 搜尋到支出 | — | — | 現役 |
| C-SR-032 | 轉帳結果不顯示正負號 | UI | T1 | P1 | `no4_search_screen` | `src/screens/Search/SearchScreen.tsx::renderRow` | 搜尋到轉帳 | — | — | 現役 |
| C-SR-033 | 跨幣別轉帳結果並列來源與目的金額 | UI | T1 | P1 | `no4_search_screen` | `src/screens/Search/SearchScreen.tsx::renderRow` | 搜尋到跨幣別轉帳 | — | — | 現役 |
| C-SR-034 | 同幣別轉帳結果顯示單一金額 | UI | T1 | P1 | `no4_search_screen` | `src/screens/Search/SearchScreen.tsx::renderRow` | 搜尋到同幣別轉帳 | — | — | 現役 |
| C-SR-035 | 排程實例結果金額左側並列循環圖示 | UI | T1 | P1 | `no4_search_screen` | `src/screens/Search/SearchScreen.tsx::renderRow` | 搜尋到排程實例 | — | — | 現役 |
| C-SR-036 | 結果列循環圖示採停用態前景色 | UI | T1 | P2 | `no4_search_screen` | `src/components/RecurringChip.tsx` | 搜尋到排程實例 | — | — | 現役 |

---

## 邏輯：搜尋查詢與比對

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-SR-037 | 搜尋僅比對備註欄、不比對類別與帳戶名稱 | UI | T1 | P1 | `no4_search_screen` | `src/services/localDbService.ts::searchTransactions` | 佈置類別名含關鍵字但備註不含的交易 | — | `src/services/localDbService.test.ts`（escapes the term for: %s — LIKE clause 綁死 note 欄、交易與轉帳兩側皆覆蓋） | 現役 |
| C-SR-038 | 關鍵字中的 % 與 _ 視為字面字元、不當萬用字元 | UI | T1 | P1 | — | `src/services/localDbService.ts::escapeNoteSearchTerm` | 備註為 `50%_off` 與 `50XYoff` 各一筆 | — | `src/services/localDbService.test.ts`（actually escapes "50%_off" — clause differs from the unescaped-naive form） | 現役 |
| C-SR-039 | 已軟刪的交易與轉帳不列入搜尋結果 | UI | T1 | P1 | `no23_local_database_logic` | `src/services/localDbService.ts::searchTransactions` | 刪除一筆帶關鍵字的交易後重搜 | — | `src/services/localDbService.test.ts`（%s carries user_id + deleted_on on the right table — searchTransactions 與 searchTransfers 兩例） | 現役 |
| C-SR-040 | 其他帳號的紀錄不列入搜尋結果 | UI+DB | T3 | P0 | `no23_local_database_logic` | `src/services/localDbService.ts::searchTransfers` | 雙帳號各建同關鍵字紀錄後切換 | — | `src/services/localDbService.test.ts`（%s carries user_id + deleted_on on the right table — searchTransactions 與 searchTransfers 兩例） | 現役 |
| C-SR-041 | 交易與轉帳各自最多顯示 50 筆 | UI | T1 | P1 | `no4_search_screen` | `src/services/localDbService.ts::searchTransactions` | 佈置超過 50 筆同關鍵字紀錄 | — | — | 現役 |
| C-SR-042 | 搜尋結果依日期由新至舊排序 | UI | T1 | P1 | `no4_search_screen` | `src/screens/Search/SearchScreen.tsx::performSearch` | 搜尋到跨日多筆結果 | — | — | 現役 |
| C-SR-043 | 關鍵字前後空白不影響搜尋結果 | UI | T1 | P2 | — | `src/screens/Search/SearchScreen.tsx::performSearch` | 搜尋到結果 | — | — | 現役 |
| C-SR-044 | 清空搜尋框後結果清空並回到輸入關鍵字提示 | UI | T1 | P1 | `no4_search_screen` | `src/screens/Search/SearchScreen.tsx::performSearch` | 搜尋到結果後清空搜尋框 | — | — | 現役 |

---

## 邏輯：停用紀錄過濾

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-SR-045 | 所屬帳戶已停用的交易不列入搜尋結果 | UI | T1 | P1 | `no4_search_screen` | `src/screens/Search/SearchScreen.tsx::performSearch` | 停用有交易的帳戶後搜尋 | — | — | 現役 |
| C-SR-046 | 所屬類別已停用的交易不列入搜尋結果 | UI | T1 | P1 | `no4_search_screen` | `src/screens/Search/SearchScreen.tsx::performSearch` | 停用有交易的類別後搜尋 | — | — | 現役 |
| C-SR-047 | 來源或目的帳戶已停用的轉帳不列入搜尋結果 | UI | T1 | P1 | `no4_search_screen` | `src/screens/Search/SearchScreen.tsx::performSearch` | 停用轉帳一端帳戶後搜尋 | — | — | 現役 |
| C-SR-048 | 停用紀錄較多時結果可能少於各自 50 筆上限 | UI | T1 | P2 | `no4_search_screen` | `src/screens/Search/SearchScreen.tsx::performSearch` | 佈置逾 50 筆並停用部分帳戶 | — | — | 現役 |

---

## 邏輯：搜尋觸發時機

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-SR-049 | 輸入搜尋文字後延遲自動觸發搜尋 | UI | T1 | P1 | `no4_search_screen` | `src/screens/Search/SearchScreen.tsx` | 搜尋頁逐字輸入 | — | — | 現役 |
| C-SR-050 | 返回搜尋頁且搜尋框非空時重新執行搜尋 | UI | T1 | P1 | `no4_search_screen` | `src/screens/Search/SearchScreen.tsx` | 搜尋後開編輯器改資料再返回 | — | — | 現役 |
| C-SR-051 | 復原完成且搜尋框非空時重新執行搜尋 | UI | T1 | P1 | `no4_search_screen` | `src/screens/Search/SearchScreen.tsx` | 搜尋後刪一筆再點復原 | — | — | 現役 |

---

## 邏輯：結果導航

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-SR-052 | 點按交易結果導航至交易編輯器 | UI | T1 | P1 | `no4_search_screen` | `src/screens/Search/SearchScreen.tsx::handlePressItem` | 搜尋到交易後點列 | — | — | 現役 |
| C-SR-053 | 點按轉帳結果導航至轉帳編輯器 | UI | T1 | P1 | `no4_search_screen` | `src/screens/Search/SearchScreen.tsx::handlePressItem` | 搜尋到轉帳後點列 | — | — | 現役 |
