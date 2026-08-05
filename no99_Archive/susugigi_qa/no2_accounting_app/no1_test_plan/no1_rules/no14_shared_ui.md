# 檢驗點：共用 UI 元件

檢驗點清單分冊。欄位定義、自檢方式與全冊索引見 `../no0_index.md`。

- 域碼：C-UI
- 涵蓋：不綁單一 screen 的共用政策——導航列、輸入欄、刪除鈕、列表與群組卡片、列表空狀態、搜尋列、日期選擇器

---

## 畫面：導航列

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-UI-001 | 模式 A 列表頁依序含返回鍵、標題、動作元件 | UI | T1 | P2 | `header_policy` | `src/navigation/AppNavigator.tsx` | 自設定主頁進偏好設定 | — | — | 現役 |
| C-UI-002 | 設定主頁與資料管理等模式 A 頁右側無動作元件 | UI | T1 | P2 | `header_policy` | `src/navigation/AppNavigator.tsx` | 進設定主頁 | — | — | 現役 |
| C-UI-003 | 帳戶清單與類別清單右側含新增鍵 | UI | T1 | P2 | `header_policy` | `src/navigation/headerItems.tsx::headerButtonItem` | 進帳戶清單 | — | — | 現役 |
| C-UI-004 | 帳戶清單與類別清單右側含合併鍵 | UI | T1 | P2 | `header_policy` | `src/navigation/headerItems.tsx::headerButtonItem` | 進類別清單 | — | — | 現役 |
| C-UI-005 | 推入式畫面返回鍵覆寫為自訂返回圖示 | UI | T1 | P2 | `header_policy` | `src/navigation/headerItems.tsx::headerBackItem` | 自設定主頁進偏好設定 | — | — | 現役 |
| C-UI-006 | 模式 C 表單 modal 依序含關閉、標題、完成動作 | UI | T1 | P1 | `header_policy` | `src/screens/Accounts/AccountEditorScreen.tsx` | 進帳戶編輯器 | — | — | 現役 |
| C-UI-007 | 模式 C 必填欄位未滿足時完成動作不可點按 | UI | T1 | P1 | `header_policy` | `src/navigation/headerItems.tsx::headerCheckmarkItem` | 進帳戶編輯器新增模式 | — | — | 現役 |
| C-UI-008 | 模式 D 首頁篩選含關閉與標題、動作元件留空 | UI | T1 | P2 | `header_policy` | `src/navigation/AppNavigator.tsx` | 進首頁篩選 | — | — | 現役 |
| C-UI-009 | 付費牆僅含關閉動作、不設畫面標題 | UI | T1 | P2 | `header_policy` | `src/navigation/AppNavigator.tsx` | 進付費牆 | — | — | 現役 |
| C-UI-010 | 模式 E 首頁依序含篩選、品牌名、搜尋、設定四元件 | UI | T1 | P1 | `header_policy` | `src/navigation/AppNavigator.tsx` | 進首頁 | — | — | 現役 |
| C-UI-011 | 導航列自訂按鈕僅顯示圖示、不含任何文字 | UI | T1 | P2 | `header_policy` | `src/navigation/headerItems.tsx::headerButtonItem` | 進帳戶清單 | — | — | 現役 |
| C-UI-012 | 導航列標題為唯一顯示文字的元件 | UI | T1 | P2 | `header_policy` | `src/navigation/AppNavigator.tsx` | 進設定主頁 | — | — | 現役 |
| C-UI-013 | 模式 B 編輯頁為預留、無畫面採用 | UI | T4 | P2 | `header_policy` | `src/navigation/AppNavigator.tsx` | 不適用 | 無畫面採用、無驗證標的 | — | 現役 |

---

## 畫面：輸入欄位

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-UI-014 | 名稱輸入達字元上限後續輸入不更新欄位 | UI | T1 | P1 | `input_field_policy` | `src/components/EditorNameField.tsx` | 進帳戶編輯器 | — | — | 現役 |
| C-UI-015 | 名稱達上限採靜默阻擋、不顯示錯誤訊息 | UI | T1 | P2 | `input_field_policy` | `src/components/EditorNameField.tsx` | 帳戶編輯器已輸入至名稱上限 | — | — | 現役 |
| C-UI-016 | 備註輸入達字元上限後續輸入不更新欄位 | UI | T1 | P1 | `input_field_policy` | `src/screens/Transactions/TransactionEditorScreen.tsx` | 進交易編輯器 | — | — | 現役 |
| C-UI-017 | 金額輸入達位數上限後續按鍵不更新欄位 | UI | T1 | P1 | `input_field_policy` | `src/hooks/useCalculator.ts::useCalculator` | 進交易編輯器 | — | — | 現役 |
| C-UI-018 | 名稱僅輸入空白時完成動作不可點按 | UI | T1 | P1 | `input_field_policy` | `src/screens/Accounts/AccountEditorScreen.tsx` | 帳戶編輯器名稱只填空白 | — | — | 現役 |
| C-UI-019 | 輸入既有名稱時畫面不顯示撞名警告 | UI | T1 | P2 | `input_field_policy` | `src/screens/Accounts/AccountEditorScreen.tsx` | 已有一個同名帳戶 | — | — | 現役 |
| C-UI-020 | 輸入既有名稱不使完成動作不可點按 | UI | T1 | P2 | `input_field_policy` | `src/screens/Accounts/AccountEditorScreen.tsx` | 已有一個同名帳戶 | — | — | 現役 |
| C-UI-021 | 名稱達字元上限不使完成動作不可點按 | UI | T1 | P2 | `input_field_policy` | `src/screens/Accounts/AccountEditorScreen.tsx` | 帳戶編輯器已輸入至名稱上限 | — | — | 現役 |
| C-UI-022 | 交易金額為 0 時完成動作不可點按 | UI | T1 | P1 | `input_field_policy` | `src/screens/Transactions/TransactionEditorScreen.tsx` | 交易編輯器金額留 0 | — | — | 現役 |
| C-UI-023 | 轉帳任一側金額未大於 0 時完成動作不可點按 | UI | T1 | P1 | `input_field_policy` | `src/screens/Transactions/TransferEditorScreen.tsx` | 轉帳編輯器轉出金額留 0 | — | — | 現役 |
| C-UI-024 | 轉帳兩側選同一帳戶時完成動作不可點按 | UI | T1 | P1 | `input_field_policy` | `src/screens/Transactions/TransferEditorScreen.tsx` | 轉帳編輯器兩側選同一帳戶 | — | — | 現役 |
| C-UI-025 | 金額超出可儲存範圍不進完成動作條件、留給存檔驗證 | UI | T3 | P2 | `input_field_policy` | `src/screens/Transactions/TransactionEditorScreen.tsx` | 經匯入佈置超界金額的交易 | — | — | 現役 |

---

## 畫面：刪除按鈕

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-UI-026 | 刪除按鈕標籤固定為刪除、不帶實體名稱 | UI | T1 | P2 | `delete_button_policy` | `src/components/DeleteButton.tsx` | 進帳戶編輯器編輯模式 | — | — | 現役 |
| C-UI-027 | 刪除按鈕標籤不隨所在畫面改變 | UI | T1 | P2 | `delete_button_policy` | `src/components/DeleteButton.tsx` | 四個編輯器各有一筆可編輯資料 | — | — | 現役 |
| C-UI-028 | 四個編輯器僅編輯模式顯示刪除按鈕 | UI | T1 | P1 | `delete_button_policy` | `src/screens/Categories/CategoryEditorScreen.tsx` | 類別清單至少有一筆類別 | — | — | 現役 |
| C-UI-029 | 刪除按鈕置於編輯器頁尾 | UI | T1 | P2 | `delete_button_policy` | `src/screens/Categories/CategoryEditorScreen.tsx` | 進類別編輯器編輯模式 | — | — | 現役 |
| C-UI-030 | 點按刪除按鈕觸發所在畫面對應的刪除流程 | UI | T1 | P1 | `delete_button_policy` | `src/screens/Accounts/AccountEditorScreen.tsx::handleDelete` | 進帳戶編輯器編輯模式 | — | — | 現役 |
| C-UI-031 | 資料管理的清空資料庫為紅字列項、不使用共用刪除按鈕 | UI | T1 | P2 | `delete_button_policy` | `src/screens/Settings/DataManagementScreen.tsx` | 進資料管理 | — | — | 現役 |
| C-UI-032 | 合併編輯器無獨立刪除按鈕 | UI | T1 | P2 | `delete_button_policy` | `src/screens/Merge/MergeEditorScreen.tsx` | 進合併編輯器 | — | — | 現役 |

---

## 畫面：列表模式 A 與 B

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-UI-033 | 模式 A 列項顯示主標與副標兩行 | UI | T1 | P2 | `list_policy` | `src/components/list/ListItem.tsx` | 進貨幣清單 | — | `src/components/list/ListItem.test.tsx`（renders title and subtitle） | 現役 |
| C-UI-034 | 模式 A 列項未給副標時只顯主標一行 | UI | T1 | P2 | `list_policy` | `src/components/list/ListItem.tsx` | 進設定主頁 | — | — | 現役 |
| C-UI-035 | 模式 A 列項於列尾顯示值文字與後綴箭頭 | UI | T1 | P2 | `list_policy` | `src/components/list/ListItem.tsx` | 進偏好設定 | — | `src/components/list/ListItem.test.tsx`（renders value and chevron when set） | 現役 |
| C-UI-036 | 模式 A 點按列項跳轉下層畫面或開啟 modal | UI | T1 | P1 | `list_policy` | `src/components/list/ListItem.tsx` | 進設定主頁 | — | — | 現役 |
| C-UI-037 | 模式 A 與 B 列項按住時底色變化 | UI | T1 | P2 | `list_policy` | `src/components/list/ListItem.tsx` | 進設定主頁 | — | — | 現役 |
| C-UI-038 | 停用列按住時不出現底色變化 | UI | T1 | P2 | `list_policy` | `src/components/list/ListItem.tsx` | 清單含一列停用項 | — | — | 現役 |
| C-UI-039 | 停用列主標轉弱化色、整列是否弱化由引用畫面決定 | UI | T1 | P2 | `list_policy` | `src/components/list/ListItem.tsx` | 類別清單含停用類別 | — | — | 現役 |
| C-UI-040 | B-1 單列選中時列尾顯示勾選圖示 | UI | T1 | P1 | `list_policy` | `src/components/list/SelectionListItem.tsx` | 進語言設定 | — | `src/components/list/SelectionListItem.test.tsx`（renders checkmark when selected） | 現役 |
| C-UI-041 | B-1 選中僅勾選圖示採主色、列文字不變色 | UI | T1 | P2 | `list_policy` | `src/components/list/SelectionListItem.tsx` | 進語言設定 | — | — | 現役 |
| C-UI-042 | B-1 多選用法不變更列尾樣式 | UI | T4 | P2 | `list_policy` | `src/components/list/SelectionListItem.tsx` | 不適用 | 無畫面採多選用法、無驗證標的 | — | 現役 |
| C-UI-043 | B-2 網格選中時右上顯示勾選覆蓋圖示 | UI | T3 | P2 | `list_policy` | `src/components/list/SelectionGridItem.tsx` | debug 版進主題設定 | — | `src/components/list/SelectionGridItem.test.tsx`（shows checkmark overlay when selected） | 現役 |
| C-UI-044 | B-2 網格未選中時不渲染覆蓋圖示 | UI | T3 | P2 | `list_policy` | `src/components/list/SelectionGridItem.tsx` | debug 版進主題設定 | — | `src/components/list/SelectionGridItem.test.tsx`（shows checkmark overlay when selected） | 現役 |
| C-UI-045 | 首頁篩選帳戶格以選中未選中的視覺差異標示、不用覆蓋圖示 | UI | T1 | P2 | `list_policy` | `src/screens/Home/HomeFilterScreen.tsx` | 進首頁篩選 | — | — | 現役 |
| C-UI-046 | 首頁篩選點按帳戶格切換該格選取狀態 | UI | T1 | P1 | `list_policy` | `src/contexts/HomeFilterContext.tsx::toggleAccount` | 已有兩個以上帳戶 | — | — | 現役 |
| C-UI-047 | 首頁篩選僅剩一個選取帳戶時該格不可點按 | UI | T1 | P1 | `list_policy` | `src/screens/Home/HomeFilterScreen.tsx` | 首頁篩選僅剩一個選取帳戶 | — | — | 現役 |

---

## 畫面：列表模式 D 與群組卡片

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-UI-048 | 帳戶清單與類別清單長按拖拉可重排 | UI | T1 | P1 | `list_policy` | `src/screens/Accounts/AccountListScreen.tsx` | 帳戶清單至少兩列 | — | — | 現役 |
| C-UI-049 | 模式 D 點按整列導向該筆編輯器 | UI | T1 | P1 | `list_policy` | `src/screens/Accounts/AccountListScreen.tsx` | 進帳戶清單 | — | — | 現役 |
| C-UI-050 | 模式 D 列項按住時底色變化 | UI | T1 | P2 | `list_policy` | `src/components/list/ReorderableListItem.tsx` | 進帳戶清單 | — | — | 現役 |
| C-UI-051 | 模式 D 列項自左而右為前置圖示與主標 | UI | T1 | P2 | `list_policy` | `src/components/list/ReorderableListItem.tsx` | 進帳戶清單 | — | — | 現役 |
| C-UI-052 | 模式 D 列項給副標時於主標下方加顯副標 | UI | T1 | P2 | `list_policy` | `src/components/list/ReorderableListItem.tsx` | 進帳戶清單 | — | `src/components/list/ReorderableListItem.test.tsx`（renders subtitle when provided） | 現役 |
| C-UI-053 | 群組卡片外殼不於子項間插入分隔線、細線由各列自帶上緣 | UI | T1 | P2 | — | `src/components/list/ListGroupCard.tsx` | 進設定主頁 | — | — | 現役 |
| C-UI-054 | 群組卡片外殼圓角裁掉首列的上緣細線 | UI | T1 | P2 | — | `src/components/list/ListGroupCard.tsx` | 進設定主頁 | — | — | 現役 |
| C-UI-055 | 群組卡片列表首列去上緣細線並套上緣圓角、末列套下緣圓角 | UI | T1 | P2 | — | `src/components/list/GroupedListCard.tsx` | 進貨幣清單 | — | — | 現役 |
| C-UI-056 | 列表分區未給標題時不渲染標題列 | UI | T1 | P2 | `list_policy` | `src/components/list/ListSection.tsx` | 進類別清單 | — | — | 現役 |
| C-UI-057 | 搜尋結果列表為 Custom 版面、仍套用共用空狀態 | UI | T1 | P2 | `list_policy` | `src/screens/Search/SearchScreen.tsx` | 搜尋頁輸入查無結果的字串 | — | — | 現役 |

---

## 畫面：列表空狀態

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-UI-058 | 含搜尋的列表查無結果時顯示空狀態 | UI | T1 | P1 | `list_policy` | `src/components/list/ListEmptyTransition.tsx` | 貨幣清單輸入查無結果的字串 | — | — | 現役 |
| C-UI-059 | 空狀態顯示標題、描述為選配 | UI | T1 | P2 | `list_policy` | `src/components/list/ListEmptyState.tsx` | 貨幣清單輸入查無結果的字串 | — | `src/components/list/ListEmptyState.test.tsx`（renders title and description）、`src/components/list/ListEmptyState.test.tsx`（renders title only） | 現役 |
| C-UI-060 | 搜尋無結果空狀態標題採共用無結果文案、描述為引號包住的搜尋字串 | UI | T1 | P1 | `list_policy` | `src/screens/Settings/CurrencyListScreen.tsx` | 貨幣清單輸入查無結果的字串 | — | — | 現役 |
| C-UI-061 | 搜尋頁未輸入關鍵字時顯示引導文案、非無結果文案 | UI | T1 | P2 | `list_policy` | `src/screens/Search/SearchScreen.tsx` | 進搜尋頁 | — | — | 現役 |
| C-UI-062 | 空狀態未指定圖示時採預設放大鏡 | UI | T1 | P2 | — | `src/components/list/ListEmptyState.tsx` | 貨幣清單輸入查無結果的字串 | — | `src/components/list/ListEmptyState.test.tsx`（renders default magnify icon when icon prop omitted） | 現役 |
| C-UI-063 | 空狀態圖示傳空值時不渲染圖示 | UI | T4 | P2 | — | `src/components/list/ListEmptyState.tsx` | 不適用 | 無畫面傳空值、無手動入口 | `src/components/list/ListEmptyState.test.tsx`（omits icon when icon prop is null） | 現役 |
| C-UI-064 | 搜尋查詢進行中不顯示空狀態 | UI | T4 | P2 | `list_policy` | `src/screens/Search/SearchScreen.tsx` | 不適用 | 查詢瞬間完成、無法人工捕捉 | — | 現役 |
| C-UI-065 | 列表與空狀態兩態切換以淡入淡出互換、不硬切 | UI | T1 | P2 | `list_policy` | `src/components/list/ListEmptyTransition.tsx` | 貨幣清單逐字輸入至查無結果 | — | — | 現役 |
| C-UI-066 | 群組卡片列表於空狀態時不渲染卡片底色 | UI | T1 | P2 | `list_policy` | `src/components/list/GroupedListCard.tsx` | 貨幣清單輸入查無結果的字串 | — | — | 現役 |
| C-UI-067 | 兩態切換期間舊態不接受點按 | UI | T4 | P2 | `list_policy` | `src/components/list/ListEmptyTransition.tsx` | 不適用 | 切換動畫瞬時、無法手動命中 | `src/components/list/ListEmptyTransition.test.tsx`（list layer pointerEvents auto when not empty） | 現役 |

---

## 畫面：搜尋列

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-UI-068 | 搜尋列依序含前綴放大鏡、輸入框、後綴清除鍵 | UI | T1 | P2 | `search_policy` | `src/components/BottomSearchBar.tsx` | 進搜尋頁 | — | — | 現役 |
| C-UI-069 | 各搜尋畫面的輸入提示文字未統一、共三種文案 | UI | T1 | P2 | `search_policy` | `src/components/BottomSearchBar.tsx` | 三個搜尋畫面皆可進入 | — | — | 現役 |
| C-UI-070 | 清除鍵僅於輸入框編輯中顯示 | UI | T1 | P2 | `search_policy` | `src/components/BottomSearchBar.tsx` | iOS 裝置進貨幣清單 | — | — | 現役 |
| C-UI-071 | 點按清除鍵清空輸入並重新觸發篩選 | UI | T1 | P1 | `search_policy` | `src/components/BottomSearchBar.tsx` | 貨幣清單已輸入關鍵字 | — | — | 現役 |
| C-UI-072 | 搜尋列固定於畫面底部、捲動列表不隱藏 | UI | T1 | P1 | `search_policy` | `src/components/BottomSearchBar.tsx` | 貨幣清單結果長於一螢幕 | — | — | 現役 |
| C-UI-073 | 搜尋列隨鍵盤上推、鍵盤收起落回底部 | UI | T1 | P1 | `search_policy` | `src/components/BottomSearchBar.tsx` | 進貨幣清單 | — | — | 現役 |
| C-UI-074 | 逐字輸入即時觸發引用畫面篩選 | UI | T1 | P1 | `search_policy` | `src/components/BottomSearchBar.tsx` | 進貨幣清單 | — | `src/components/BottomSearchBar.test.tsx`（triggers onChangeText） | 現役 |
| C-UI-075 | 搜尋頁進入時輸入框自動聚焦 | UI | T1 | P1 | `search_policy` | `src/screens/Search/SearchScreen.tsx` | 自首頁點搜尋入口 | — | — | 現役 |
| C-UI-076 | 貨幣、語言與時區設定進入時輸入框不自動聚焦 | UI | T1 | P1 | `search_policy` | `src/screens/Settings/CurrencyListScreen.tsx` | 進貨幣清單 | — | — | 現役 |
| C-UI-077 | 幣別選擇 modal 的搜尋框固定於 modal 頂部、隨 modal 開關出現消失 | UI | T1 | P2 | `search_policy` | `src/screens/Settings/CurrencyRateEditorScreen.tsx` | 進匯率編輯器新增模式 | — | — | 現役 |
| C-UI-078 | 幣別選擇 modal 的搜尋框為該畫面自建、不共用底部搜尋列元件 | UI | T1 | P2 | `search_policy` | `src/screens/Settings/CurrencyRateEditorScreen.tsx` | 進匯率編輯器新增模式 | — | — | 現役 |
| C-UI-079 | 搜尋輸入框字元上限 100 | UI | T1 | P2 | — | `src/components/BottomSearchBar.tsx` | 搜尋頁貼入超長字串 | — | — | 現役 |

---

## 畫面：日期選擇器

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-UI-080 | 交易與轉帳的記錄日期採日期加時間模式 | UI | T1 | P1 | `date_picker_policy` | `src/components/EditorDateRecurringRow.tsx` | 進交易編輯器 | — | — | 現役 |
| C-UI-081 | 定期結束日期採純日期模式 | UI | T1 | P1 | `date_picker_policy` | `src/components/RecurringOptions.tsx` | 交易編輯器展開定期設定 | — | — | 現役 |
| C-UI-082 | 日期加時間觸發器顯示日期與時間兩段文字 | UI | T1 | P1 | `date_picker_policy` | `src/components/CalendarDialog.tsx` | 進交易編輯器 | — | — | 現役 |
| C-UI-083 | 純日期觸發器僅顯示日期文字 | UI | T1 | P1 | `date_picker_policy` | `src/components/CalendarDialog.tsx` | 定期設定結束條件選指定日期 | — | — | 現役 |
| C-UI-084 | 點按觸發器彈出 dialog 並停在日選擇子模式 | UI | T1 | P1 | `date_picker_policy` | `src/components/CalendarDialog.tsx` | 進交易編輯器 | — | — | 現役 |
| C-UI-085 | 日選擇子模式點標題列切至月選擇子模式 | UI | T1 | P2 | `date_picker_policy` | `src/components/CalendarDialog.tsx` | 交易編輯器已開日期 dialog | — | — | 現役 |
| C-UI-086 | 月選擇子模式點標題列切回日選擇子模式 | UI | T1 | P2 | `date_picker_policy` | `src/components/CalendarDialog.tsx` | 日期 dialog 已切到月選擇子模式 | — | — | 現役 |
| C-UI-087 | 日期格上下滑單月一頁、放手吸附整頁 | UI | T1 | P2 | `date_picker_policy` | `src/components/CalendarDialog.tsx` | 交易編輯器已開日期 dialog | — | — | 現役 |
| C-UI-088 | 月份格上下滑單年一頁、放手吸附整頁 | UI | T1 | P2 | `date_picker_policy` | `src/components/CalendarDialog.tsx` | 日期 dialog 已切到月選擇子模式 | — | — | 現役 |
| C-UI-089 | 上下滑翻頁只改標題列年月、不改已選日期 | UI | T1 | P1 | — | `src/components/CalendarDialog.tsx` | 交易編輯器已開日期 dialog | — | — | 現役 |
| C-UI-090 | 點按某一日即選定該日並反映到觸發器 | UI | T1 | P1 | `date_picker_policy` | `src/components/CalendarDialog.tsx` | 交易編輯器已開日期 dialog | — | — | 現役 |
| C-UI-091 | 點按某月選定該月並停留月選擇子模式 | UI | T1 | P2 | `date_picker_policy` | `src/components/CalendarDialog.tsx` | 日期 dialog 已切到月選擇子模式 | — | — | 現役 |
| C-UI-092 | 選月保留原本的日、超出該月天數時夾到該月最後一日 | UI | T1 | P1 | — | `src/components/CalendarDialog.tsx` | 交易日期為 1 月 31 日 | — | — | 現役 |
| C-UI-093 | 日期加時間模式轉動時間滾輪選定時與分 | UI | T1 | P1 | `date_picker_policy` | `src/components/CalendarDialog.tsx` | 交易編輯器已開日期 dialog | — | — | 現役 |
| C-UI-094 | 純日期模式 dialog 不含時間滾輪 | UI | T1 | P1 | `date_picker_policy` | `src/components/CalendarDialog.tsx` | 定期設定已開結束日 dialog | — | — | 現役 |
| C-UI-095 | 點按 dialog 外部關閉 dialog | UI | T1 | P1 | `date_picker_policy` | `src/components/CalendarDialog.tsx` | 交易編輯器已開日期 dialog | — | — | 現役 |
| C-UI-096 | 任一選擇立即生效、dialog 無確認與取消按鈕 | UI | T1 | P1 | `date_picker_policy` | `src/components/CalendarDialog.tsx` | 交易編輯器已開日期 dialog | — | — | 現役 |
| C-UI-097 | 觸發器日期文字依語系格式顯示 | UI | T1 | P2 | `date_picker_policy` | `src/utils/formatters.ts::formatDate` | 語系切為日文後進交易編輯器 | — | — | 現役 |
| C-UI-098 | dialog 標題列為斜線串接的年月數字、不隨語系改變 | UI | T1 | P2 | `date_picker_policy` | `src/components/CalendarDialog.tsx` | 語系切為日文後開交易日期 dialog | — | — | 現役 |
| C-UI-099 | 月份格標籤依語系顯示月份簡稱 | UI | T1 | P2 | — | `src/components/CalendarDialog.tsx` | 語系切為日文後切到月選擇子模式 | — | — | 現役 |
| C-UI-100 | 時間一律以 24 小時制兩位數顯示、無時制偏好可切 | UI | T1 | P2 | `date_picker_policy` | `src/utils/formatters.ts::formatTime` | 系統時制設為 12 小時制 | — | — | 現役 |
| C-UI-101 | 日期選擇器無可選範圍上下限、任何一日皆可點按 | UI | T1 | P2 | `date_picker_policy` | `src/components/CalendarDialog.tsx` | 交易編輯器已開日期 dialog | — | — | 現役 |

---

## 邏輯：輸入寫入與存檔驗證

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-UI-104 | 不做查重、允許同名帳戶並存 | UI | T1 | P2 | `input_field_policy` | `src/services/accountLogic.ts::createAccount` | 已有一個同名帳戶 | — | — | 現役 |
| C-UI-105 | 不做查重、允許同名類別並存 | UI | T1 | P2 | `input_field_policy` | `src/services/categoryLogic.ts::createCategory` | 已有一個同名類別 | — | — | 現役 |
| C-UI-106 | 名稱超長時存檔擲驗證失敗、原因為名稱過長 | DB | T3 | P2 | `input_field_policy` | `src/services/accountLogic.ts::assertNameWithinLimit` | 經匯入路徑注入超長名稱 | — | `src/services/accountLogic.test.ts`（R-CM-070: throws ValidationError NAME_TOO_LONG when the trimmed name exceeds NAME_MAX_LENGTH）、`src/services/categoryLogic.test.ts`（R-CM-033: throws ValidationError NAME_TOO_LONG when the trimmed name exceeds NAME_MAX_LENGTH） | 現役 |
| C-UI-107 | 名稱長度比對取去空白後長度、前後空白不計入 | DB | T4 | P2 | `input_field_policy` | `src/services/accountLogic.ts::assertNameWithinLimit` | 不適用 | 需繞過畫面即時上限、無手動入口 | `src/services/accountLogic.test.ts`（R-CM-070: compares the TRIMMED length — surrounding whitespace does not count against the limit） | 現役 |
| C-UI-108 | 匯入路徑名稱超長截斷至上限後存入、不視為驗證失敗 | DB | T3 | P2 | `input_field_policy` | `src/services/importService.ts::executeImport` | 匯入檔含超長帳戶名稱 | — | — | 現役 |
| C-UI-109 | 金額超出可儲存範圍時存檔驗證失敗 | DB | T3 | P2 | `input_field_policy` | `src/utils/amountValidation.ts::survivesStorageMax` | 經匯入注入超界金額、其餘欄全合法 | — | `src/utils/currencyUtils.storageMax.test.ts`（accepts exactly the max (either sign) and rejects one unit past） | 現役 |

---

## 邏輯：月曆格與週起始解析

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-UI-110 | 星期列文字依語系顯示 | UI | T1 | P2 | `date_picker_policy` | `src/utils/calendarGrid.ts::getWeekdayLabels` | 語系切為日文後開交易日期 dialog | — | `src/utils/calendarGrid.test.ts`（renders zh-Hant Sunday-start labels） | 現役 |
| C-UI-111 | 週起始日依 `weekStart` 偏好決定 | UI | T1 | P1 | `date_picker_policy` | `src/utils/calendarGrid.ts::resolveWeekStart` | 週起始偏好改為週一 | — | `src/utils/calendarGrid.test.ts`（overrides the locale convention when sunday/monday is chosen） | 現役 |
| C-UI-112 | `weekStart` 為 `auto` 時依語系慣例決定週起始 | UI | T1 | P1 | `date_picker_policy` | `src/utils/calendarGrid.ts::getWeekStart` | 週起始偏好設 auto 且語系切為德文 | — | `src/utils/calendarGrid.test.ts`（follows the locale convention on auto） | 現役 |
| C-UI-113 | 月曆格僅鋪當月日期、相鄰月位置留白不可點按 | UI | T1 | P2 | `date_picker_policy` | `src/utils/calendarGrid.ts::calMonthGrid` | 交易編輯器已開日期 dialog | — | `src/utils/calendarGrid.test.ts`（renders 2026/6 Sunday-start with blank adjacent-month cells） | 現役 |
