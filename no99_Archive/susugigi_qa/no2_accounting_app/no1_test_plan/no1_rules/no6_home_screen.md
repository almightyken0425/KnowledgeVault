# 檢驗點：首頁畫面

檢驗點清單分冊。欄位定義、自檢方式與全冊索引見 `../no0_index.md`。

- 域碼：C-HM
- 涵蓋：首頁頁首與期間切換器、環形圖、焦點篩選列、逐筆紀錄列表、頁尾與分頁、首頁篩選畫面

報表聚合、期間推導、帳戶選取 reconcile 與報表快取屬 `no7_report_period.md`，本冊只收畫面呈現與其直接互動。

---

## 畫面：頁首與期間切換器

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-HM-001 | 首頁導航列依序含篩選、品牌標誌、搜尋、設定 | UI | T1 | P1 | `no2_home_screen` | `src/navigation/AppNavigator.tsx` | 進首頁 | — | — | 現役 |
| C-HM-002 | 點按導航列搜尋鍵導航至搜尋畫面 | UI | T1 | P1 | `no2_home_screen` | `src/navigation/AppNavigator.tsx` | 進首頁 | — | — | 現役 |
| C-HM-003 | 點按導航列設定鍵導航至設定主頁 | UI | T1 | P1 | `no2_home_screen` | `src/navigation/AppNavigator.tsx` | 進首頁 | — | — | 現役 |
| C-HM-004 | 期間切換器含較舊、日曆圖示與標題、較新三段 | UI | T1 | P2 | `no2_home_screen` | `src/screens/Home/components/PageHeaderContent.tsx` | 進首頁 | — | — | 現役 |
| C-HM-005 | 期間標題隨水平滑動更新為該頁區間 | UI | T1 | P2 | `no2_home_screen` | `src/screens/Home/PeriodPage.tsx::periodTitle` | 進首頁左右滑 | — | — | 現役 |

---

## 畫面：環形圖

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-HM-006 | 環形圖同時呈現支出與收入兩弧 | UI | T1 | P1 | `no2_home_screen` | `src/components/DonutChart.tsx::computeBidirectionalSliceInfo` | 當期有收支各一筆 | — | `src/components/DonutChart.test.ts`（雙側：支出落負區間、收入落正區間、合計填滿整圈、交會於 12 點） | 現役 |
| C-HM-007 | 切換焦點卡後兩弧的組成與比例不變 | UI | T1 | P1 | `no2_home_screen` | `src/stores/PeriodDataStore.ts::buildPeriodReport` | 當期有收支各一筆後點另一張焦點卡 | — | — | 現役 |
| C-HM-008 | 兩弧起點位於環形圖正上方 | UI | T1 | P2 | `no2_home_screen` | `src/components/DonutChart.tsx::computeBidirectionalSliceInfo` | 當期有紀錄 | — | `src/components/DonutChart.test.ts`（雙側：支出落負區間、收入落正區間、合計填滿整圈、交會於 12 點） | 現役 |
| C-HM-009 | 支出弧自起點向左生長 | UI | T1 | P2 | `no2_home_screen` | `src/components/DonutChart.tsx::computeBidirectionalSliceInfo` | 當期有支出 | — | `src/components/DonutChart.test.ts`（雙側：支出落負區間、收入落正區間、合計填滿整圈、交會於 12 點） | 現役 |
| C-HM-010 | 收入弧自起點向右生長 | UI | T1 | P2 | `no2_home_screen` | `src/components/DonutChart.tsx::computeBidirectionalSliceInfo` | 當期有收入 | — | `src/components/DonutChart.test.ts`（雙側：支出落負區間、收入落正區間、合計填滿整圈、交會於 12 點） | 現役 |
| C-HM-011 | 兩弧長度合計填滿一圈 | UI | T1 | P1 | `no2_home_screen` | `src/components/DonutChart.tsx::computeBidirectionalSliceInfo` | 當期有收支各一筆 | — | `src/components/DonutChart.test.ts`（雙側：支出落負區間、收入落正區間、合計填滿整圈、交會於 12 點） | 現役 |
| C-HM-012 | 兩弧長度比例對應兩側納入繪製分組的金額合計 | UI | T1 | P1 | `no2_home_screen` | `src/components/DonutChart.tsx::computeBidirectionalSliceInfo` | 佈置支出 300 收入 100 | — | `src/components/DonutChart.test.ts`（雙側：支出落負區間、收入落正區間、合計填滿整圈、交會於 12 點） | 現役 |
| C-HM-013 | 兩弧交會位置由兩弧長度比例決定 | UI | T1 | P2 | `no2_home_screen` | `src/components/DonutChart.tsx::computeBidirectionalSliceInfo` | 佈置含門檻下分組的已知比例 | — | `src/components/DonutChart.test.ts`（拔片後交會點按剩餘總額比例移動） | 現役 |
| C-HM-014 | 各側分組自交會點往起點依金額由大到小排列 | UI | T1 | P2 | `no2_home_screen` | `src/components/DonutChart.tsx::computeBidirectionalSliceInfo` | 佈置同側三分組金額不同 | — | — | 現役 |
| C-HM-015 | 其他聚合分組恆列於最鄰近起點處、不依金額入序 | UI | T1 | P2 | — | `src/services/homeReportLogic.ts::buildChartData` | 佈置同側六分組且其他聚合金額大於次大分組 | — | — | 現役 |
| C-HM-016 | 分組金額低於全部分組總和 10/360 時不繪製 | UI | T1 | P1 | `no2_home_screen` | `src/components/DonutChart.tsx::computeBidirectionalSliceInfo` | 佈置一分組佔比略低於 10 度 | — | `src/components/DonutChart.test.ts`（低於門檻的片被拔、其餘重新鋪滿整圈） | 現役 |
| C-HM-017 | 恰等於門檻的分組保留繪製 | UI | T1 | P2 | `no2_home_screen` | `src/components/DonutChart.tsx::computeBidirectionalSliceInfo` | 佈置一分組佔比恰等於 10 度 | — | `src/components/DonutChart.test.ts`（恰等於門檻的片保留） | 現役 |
| C-HM-018 | 門檻下分組移除後其餘分組依比例重新填滿一圈 | UI | T1 | P2 | `no2_home_screen` | `src/components/DonutChart.tsx::computeBidirectionalSliceInfo` | 佈置含門檻下分組的金額組合 | — | `src/components/DonutChart.test.ts`（低於門檻的片被拔、其餘重新鋪滿整圈） | 現役 |
| C-HM-019 | 門檻以移除前比例判定、僅判一輪不回鍋 | UI | T1 | P2 | `no2_home_screen` | `src/components/DonutChart.tsx::computeBidirectionalSliceInfo` | 佈置移除後才跌破門檻的組合 | — | `src/components/DonutChart.test.ts`（只判一輪：略低門檻的片不因別片被拔而回鍋） | 現役 |
| C-HM-020 | 全部分組皆達標時繪製結果與未套門檻一致 | UI | T1 | P2 | `no2_home_screen` | `src/components/DonutChart.tsx::computeBidirectionalSliceInfo` | 佈置全部分組皆達門檻 | — | `src/components/DonutChart.test.ts`（全片達標時輸出與未過濾行為一致） | 現役 |
| C-HM-021 | 僅有支出無收入時整圈由支出弧填滿 | UI | T1 | P1 | `no2_home_screen` | `src/components/DonutChart.tsx::computeBidirectionalSliceInfo` | 當期僅有支出 | — | `src/components/DonutChart.test.ts`（只有支出：資料層鋪滿整圈） | 現役 |
| C-HM-022 | 僅有收入無支出時整圈由收入弧填滿 | UI | T1 | P1 | `no2_home_screen` | `src/components/DonutChart.tsx::computeBidirectionalSliceInfo` | 當期僅有收入 | — | `src/components/DonutChart.test.ts`（只有收入：資料層鋪滿整圈） | 現役 |
| C-HM-023 | 一側分組整側低於門檻時另一側鋪滿整圈 | UI | T1 | P2 | `no2_home_screen` | `src/components/DonutChart.tsx::computeBidirectionalSliceInfo` | 佈置一側全部低於門檻 | — | `src/components/DonutChart.test.ts`（一側整側被拔時另一側鋪滿整圈） | 現役 |
| C-HM-024 | 單側三個以上分組合計仍鋪滿整圈 | UI | T1 | P2 | `no2_home_screen` | `src/components/DonutChart.tsx::computeBidirectionalSliceInfo` | 佈置單側三個以上分組 | — | `src/components/DonutChart.test.ts`（單側多分組合計仍鋪滿整圈） | 現役 |
| C-HM-025 | 支出與收入皆無紀錄時環形圖不顯示 | UI | T1 | P2 | `no2_home_screen` | `src/components/DonutChart.tsx::computeBidirectionalSliceInfo` | 空庫進首頁 | — | `src/components/DonutChart.test.ts`（回傳空陣列當總額為 0） | 現役 |
| C-HM-026 | 餘額數值顯示於環形圖中心 | UI | T1 | P1 | `no2_home_screen` | `src/screens/Home/components/AnimatedBalance.tsx` | 當期有紀錄 | — | — | 現役 |

---

## 畫面：焦點篩選列

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-HM-027 | 焦點篩選列兩張等寬卡並排 | UI | T1 | P2 | `no2_home_screen` | `src/screens/Home/components/FocusCard.tsx` | 進首頁 | — | — | 現役 |
| C-HM-028 | 支出焦點卡含支出圖示與支出合計金額 | UI | T1 | P2 | `no2_home_screen` | `src/screens/Home/components/PageHeaderContent.tsx` | 當期有支出 | — | — | 現役 |
| C-HM-029 | 收入焦點卡含收入圖示與收入合計金額 | UI | T1 | P2 | `no2_home_screen` | `src/screens/Home/components/PageHeaderContent.tsx` | 當期有收入 | — | — | 現役 |
| C-HM-030 | 兩張焦點卡永遠擇一啟用、另一停用 | UI | T1 | P1 | `no2_home_screen` | `src/screens/Home/components/PageHeaderContent.tsx` | 進首頁 | — | — | 現役 |
| C-HM-031 | 點按當前啟用的焦點卡不變更 | UI | T1 | P2 | `no2_home_screen` | `src/screens/Home/components/FocusCard.tsx` | 點當前啟用卡 | — | — | 現役 |
| C-HM-032 | 點按停用焦點卡後兩卡互換、逐筆列表即時切換類型 | UI | T1 | P1 | `no2_home_screen` | `src/screens/Home/PeriodPage.tsx::handleSelectFocus` | 點另一張焦點卡 | — | — | 現役 |
| C-HM-033 | 切換焦點後各分組重置為預設收合 | UI | T1 | P2 | `no2_home_screen` | `src/screens/Home/PeriodPage.tsx` | 展開分組後切焦點 | — | — | 現役 |

---

## 畫面：逐筆紀錄列表

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-HM-034 | 各分組預設為收合狀態 | UI | T1 | P1 | `no2_home_screen` | `src/stores/PeriodDataStore.ts::buildPeriodReport` | 當期有紀錄 | — | — | 現役 |
| C-HM-035 | 分組標題列左端顯示收合展開圖示、展開時轉向 | UI | T1 | P2 | `no2_home_screen` | `src/screens/Home/components/TxSectionCard.tsx` | 當期有紀錄 | — | — | 現役 |
| C-HM-036 | 點按分組標題列展開或收合該分組 | UI | T1 | P1 | `no2_home_screen` | `src/screens/Home/PeriodPage.tsx::toggleSection` | 當期有紀錄 | — | — | 現役 |
| C-HM-037 | 類別分組下一般類別的標題顯示類別圖示與名稱 | UI | T1 | P1 | `no2_home_screen` | `src/stores/PeriodDataStore.ts::buildPeriodReport` | 類別分組模式下有交易 | — | — | 現役 |
| C-HM-038 | 類別分組下轉帳分組的標題顯示外部帳戶圖示與名稱 | UI | T1 | P1 | `no2_home_screen` | `src/stores/PeriodDataStore.ts::buildPeriodReport` | 類別分組模式下有跨選取轉帳 | — | — | 現役 |
| C-HM-039 | 日期分組下分組標題顯示日期文字 | UI | T1 | P1 | `no2_home_screen` | `src/stores/PeriodDataStore.ts::buildPeriodReport` | 切日期分組模式 | — | — | 現役 |
| C-HM-040 | 分組標題列顯示該分組小計金額 | UI | T1 | P1 | `no2_home_screen` | `src/screens/Home/components/TxSectionCard.tsx` | 當期有紀錄 | — | — | 現役 |
| C-HM-041 | 各分組標題色採統一文字色 | UI | T1 | P2 | `no2_home_screen` | `src/screens/Home/PeriodPage.tsx::createStyles` | 當期有多個分組 | — | — | 現役 |
| C-HM-042 | 一般交易於類別分組左輔助欄顯示日期文字 | UI | T1 | P2 | `no2_home_screen` | `src/screens/Home/PeriodPage.tsx::renderRecord` | 類別分組模式展開分組 | — | — | 現役 |
| C-HM-043 | 左輔助欄日期文字的日與月順序依語系決定 | UI | T1 | P2 | — | `src/screens/Home/components/TxDateBadge.tsx` | 切至日月順序不同的語系後進類別分組 | — | — | 現役 |
| C-HM-044 | 一般交易於日期分組左輔助欄顯示類別圖示 | UI | T1 | P2 | `no2_home_screen` | `src/screens/Home/PeriodPage.tsx::renderRecord` | 日期分組模式展開分組 | — | — | 現役 |
| C-HM-045 | 單筆紀錄列的類別圖示採統一主色 | UI | T1 | P2 | `no2_home_screen` | `src/screens/Home/PeriodPage.tsx::renderRecord` | 日期分組模式展開分組 | — | — | 現役 |
| C-HM-046 | 一般交易主文字顯示備註、副文字顯示帳戶名稱 | UI | T1 | P1 | `no2_home_screen` | `src/screens/Home/PeriodPage.tsx::renderRecord` | 記一筆帶備註的交易 | — | — | 現役 |
| C-HM-047 | 紀錄無備註時主文字不顯示內容 | UI | T1 | P2 | `no2_home_screen` | `src/screens/Home/PeriodPage.tsx::renderRecord` | 記一筆不帶備註的交易 | — | — | 現役 |
| C-HM-048 | 轉帳於類別分組左輔助欄顯示日期文字 | UI | T1 | P2 | `no2_home_screen` | `src/screens/Home/PeriodPage.tsx::renderRecord` | 類別分組下有跨選取轉帳 | — | — | 現役 |
| C-HM-049 | 轉帳於類別分組副文字顯示另一方帳戶並列方向箭頭 | UI | T1 | P1 | `no2_home_screen` | `src/screens/Home/PeriodPage.tsx::renderRecord` | 類別分組下有跨選取轉帳 | — | — | 現役 |
| C-HM-050 | 轉帳於日期分組左輔助欄顯示方向圖示 | UI | T1 | P2 | `no2_home_screen` | `src/screens/Home/PeriodPage.tsx::renderRecord` | 日期分組下有跨選取轉帳 | — | — | 現役 |
| C-HM-051 | 轉帳於日期分組副文字依方向由來源至目的列兩帳戶 | UI | T1 | P1 | `no2_home_screen` | `src/screens/Home/PeriodPage.tsx::renderRecord` | 日期分組下有跨選取轉帳 | — | — | 現役 |
| C-HM-052 | 主金額以該筆原始幣別呈現 | UI | T1 | P1 | `no2_home_screen` | `src/screens/Home/PeriodPage.tsx::renderRecord` | 多幣別帳戶各記一筆 | — | — | 現役 |
| C-HM-053 | 多幣別模式下非主要貨幣的紀錄顯示 `≈` 前綴換算副文字 | UI | T1 | P1 | `no2_home_screen` | `src/screens/Home/PeriodPage.tsx::renderRecord` | 選取多幣別帳戶後展開分組 | — | — | 現役 |
| C-HM-054 | 多幣別模式下主要貨幣的紀錄不顯示換算副文字 | UI | T1 | P1 | `no2_home_screen` | `src/screens/Home/PeriodPage.tsx::renderRecord` | 選取多幣別帳戶後展開分組 | — | — | 現役 |
| C-HM-055 | 單幣別模式下全部紀錄不顯示換算副文字 | UI | T1 | P2 | `no2_home_screen` | `src/screens/Home/PeriodPage.tsx::renderRecord` | 僅選同幣別帳戶 | — | — | 現役 |
| C-HM-056 | 定期排程實例於金額左側並列循環圖示 | UI | T1 | P1 | `no2_home_screen` | `src/screens/Home/PeriodPage.tsx::renderRecord` | 已有排程產生的實例 | — | — | 現役 |
| C-HM-057 | 循環圖示採停用態前景色、視覺權重低於金額 | UI | T1 | P2 | `no2_home_screen` | `src/components/RecurringChip.tsx` | 已有排程產生的實例 | — | — | 現役 |
| C-HM-058 | 循環圖示不獨立互動、點按該列行為與一般紀錄相同 | UI | T1 | P2 | `no2_home_screen` | `src/screens/Home/PeriodPage.tsx::renderRecord` | 點排程實例的循環圖示 | — | — | 現役 |
| C-HM-059 | 期間無紀錄時不顯示空狀態提示 | UI | T1 | P2 | `no2_home_screen` | `src/screens/Home/PeriodPage.tsx` | 切到無紀錄的期間 | — | — | 現役 |
| C-HM-060 | 初始載入中顯示載入文字 | UI | T1 | P2 | `no2_home_screen` | `src/screens/Home/HomeScreen.tsx` | 冷啟進首頁瞬間觀察 | — | — | 現役 |
| C-HM-061 | 報表載入失敗時整頁顯示錯誤文字與重試按鈕 | UI | T4 | P2 | — | `src/screens/Home/PeriodPage.tsx` | 不適用 | 報表查詢擲錯無手動入口 | — | 現役 |
| C-HM-062 | 點按重試清除錯誤文字、該頁回到載入態 | UI | T4 | P2 | — | `src/screens/Home/PeriodPage.tsx` | 不適用 | 報表查詢擲錯無手動入口 | — | 現役 |
| C-HM-063 | 點按一般交易列帶入紀錄導航至交易編輯器 | UI | T1 | P1 | `no2_home_screen` | `src/screens/Home/PeriodPage.tsx::renderRecord` | 展開分組點交易列 | — | — | 現役 |
| C-HM-064 | 點按轉帳列帶入紀錄導航至轉帳編輯器 | UI | T1 | P1 | `no2_home_screen` | `src/screens/Home/PeriodPage.tsx::renderRecord` | 展開分組點轉帳列 | — | — | 現役 |

---

## 畫面：頁尾與分頁

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-HM-065 | 頁尾含新增支出、轉帳、收入三顆按鈕 | UI | T1 | P1 | `no2_home_screen` | `src/components/FloatingActionBar.tsx` | 進首頁 | — | — | 現役 |
| C-HM-066 | 新增支出獲准時開啟支出模式交易編輯器 | UI | T1 | P1 | `no2_home_screen` | `src/navigation/AppNavigator.tsx::handleGlobalNavigation` | 進首頁點新增支出 | — | — | 現役 |
| C-HM-067 | 新增收入獲准時開啟收入模式交易編輯器 | UI | T1 | P1 | `no2_home_screen` | `src/navigation/AppNavigator.tsx::handleGlobalNavigation` | 進首頁點新增收入 | — | — | 現役 |
| C-HM-068 | 新增轉帳獲准時開啟轉帳編輯器 | UI | T1 | P1 | `no2_home_screen` | `src/navigation/AppNavigator.tsx::handleGlobalNavigation` | 進首頁點新增轉帳 | — | — | 現役 |
| C-HM-069 | 新增交易遭配額禁止時導向付費牆 | UI | T1 | P1 | `no2_home_screen` | `src/navigation/AppNavigator.tsx::handleGlobalNavigation` | 佈置交易配額已達上限 | — | — | 現役 |
| C-HM-070 | 新增轉帳遭配額禁止時導向付費牆 | UI | T1 | P1 | `no2_home_screen` | `src/navigation/AppNavigator.tsx::handleGlobalNavigation` | 佈置轉帳配額已達上限 | — | — | 現役 |
| C-HM-071 | 主內容區水平分頁滑動、每頁代表一個時間區間 | UI | T1 | P1 | `no2_home_screen` | `src/screens/Home/HomeScreen.tsx` | 進首頁左右滑 | — | — | 現役 |
| C-HM-072 | 時間粒度為全部時僅一頁、不可滑動 | UI | T1 | P1 | `no2_home_screen` | `src/utils/timeHelper.ts::deriveNavigableOffsets` | 篩選切粒度為全部 | — | `src/utils/timeHelper.deriveNavigableOffsets.test.ts`（'all' granularity is a single non-navigable page regardless of records） | 現役 |
| C-HM-073 | 無任何紀錄時僅顯示當前區間、不可向兩側滑動 | UI | T1 | P2 | `no2_home_screen` | `src/utils/timeHelper.ts::deriveNavigableOffsets` | 空庫進首頁 | — | `src/utils/timeHelper.deriveNavigableOffsets.test.ts`（no records → only the current period） | 現役 |
| C-HM-074 | 過去側頁數止於最早紀錄所在區間 | UI | T1 | P1 | `no2_home_screen` | `src/utils/timeHelper.ts::deriveNavigableOffsets` | 最早紀錄落在上一個區間 | — | `src/utils/timeHelper.deriveNavigableOffsets.test.ts`（recent earliest record trims the past seed to the periods it actually reaches） | 現役 |
| C-HM-075 | 未來側頁數止於最晚紀錄所在區間 | UI | T1 | P1 | `no2_home_screen` | `src/utils/timeHelper.ts::deriveNavigableOffsets` | 佈置未來日期的紀錄 | — | `src/utils/timeHelper.deriveNavigableOffsets.test.ts`（latest record 3 months ahead → future offsets up to that period） | 現役 |
| C-HM-076 | 當前時間區間恆在可滑動範圍內 | UI | T1 | P2 | `no2_home_screen` | `src/utils/timeHelper.ts::deriveNavigableOffsets` | 僅在過去月份有紀錄 | — | — | 現役 |
| C-HM-077 | 向過去方向滑動時自動載入更多時間區間 | UI | T1 | P2 | `no2_home_screen` | `src/screens/Home/HomeScreen.tsx::loadMorePeriods` | 佈置跨多月紀錄後連續左滑 | — | — | 現役 |
| C-HM-078 | 向上捲動主內容區時環形圖區塊隨之消失 | UI | T1 | P2 | `no2_home_screen` | `src/screens/Home/PeriodPage.tsx` | 當期有多筆紀錄後上捲 | — | — | 現役 |
| C-HM-079 | 捲動回起點時環形圖區塊顯示 | UI | T1 | P2 | `no2_home_screen` | `src/screens/Home/PeriodPage.tsx` | 上捲後捲回頂端 | — | — | 現役 |
| C-HM-080 | 返回首頁時重新載入報表反映他處變動 | UI | T1 | P1 | `no2_home_screen` | `src/screens/Home/HomeScreen.tsx` | 他處改資料後返回首頁 | — | — | 現役 |

---

## 畫面：首頁篩選

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-HM-081 | 點按導航列篩選鍵以 Modal 開啟首頁篩選 | UI | T1 | P1 | `no3_home_filter_screen` | `src/navigation/AppNavigator.tsx` | 進首頁 | — | — | 現役 |
| C-HM-082 | 首頁篩選導覽列含關閉按鈕與顯示設定標題 | UI | T1 | P2 | `no3_home_filter_screen` | `src/navigation/AppNavigator.tsx` | 進首頁篩選 | — | — | 現役 |
| C-HM-083 | 篩選摘要條依序為時間粒度與分組方式兩卡平分 | UI | T1 | P2 | `no3_home_filter_screen` | `src/screens/Home/HomeFilterScreen.tsx` | 進首頁篩選 | — | — | 現役 |
| C-HM-084 | 各摘要卡內含圖示與當前選定值 | UI | T1 | P2 | `no3_home_filter_screen` | `src/screens/Home/HomeFilterScreen.tsx` | 進首頁篩選 | — | — | 現役 |
| C-HM-085 | 帳戶卡以 2 欄連續排列、不依幣別分群 | UI | T1 | P2 | `no3_home_filter_screen` | `src/screens/Home/HomeFilterScreen.tsx` | 已有多幣別帳戶 | — | — | 現役 |
| C-HM-086 | 帳戶總數為奇數時尾端落單卡靠左、右側留空 | UI | T1 | P2 | `no3_home_filter_screen` | `src/screens/Home/HomeFilterScreen.tsx` | 帳戶總數為奇數 | — | — | 現役 |
| C-HM-087 | 帳戶卡內含帳戶圖示、名稱與幣別標記 | UI | T1 | P2 | `no3_home_filter_screen` | `src/screens/Home/HomeFilterScreen.tsx` | 進首頁篩選 | — | — | 現役 |
| C-HM-088 | 帳戶卡依是否被選取切換選中與未選兩態 | UI | T1 | P1 | `no3_home_filter_screen` | `src/screens/Home/HomeFilterScreen.tsx` | 進首頁篩選點帳戶卡 | — | — | 現役 |
| C-HM-089 | 無可用帳戶時帳戶區空白、不顯示空狀態提示 | UI | T3 | P2 | `no3_home_filter_screen` | `src/screens/Home/HomeFilterScreen.tsx` | sqlite 停用全部帳戶後進入 | — | — | 現役 |
| C-HM-090 | 點按時間粒度卡切至下一粒度、首頁報表即時更新 | UI | T1 | P1 | `no3_home_filter_screen` | `src/screens/Home/HomeFilterScreen.tsx` | 進首頁篩選 | — | — | 現役 |
| C-HM-091 | 點按分組方式卡切至下一分組、首頁報表即時更新 | UI | T1 | P1 | `no3_home_filter_screen` | `src/screens/Home/HomeFilterScreen.tsx` | 進首頁篩選 | — | — | 現役 |
| C-HM-092 | 點按帳戶卡切換該帳戶選取、首頁報表即時更新 | UI | T1 | P1 | `no3_home_filter_screen` | `src/contexts/HomeFilterContext.tsx::toggleAccount` | 已有兩個以上帳戶 | — | — | 現役 |
| C-HM-093 | 僅剩一個選取帳戶時該卡不可點按 | UI | T1 | P1 | `no3_home_filter_screen` | `src/screens/Home/HomeFilterScreen.tsx` | 取消至僅剩一個選取 | — | — | 現役 |
| C-HM-094 | 點按關閉按鈕關閉首頁篩選 Modal | UI | T1 | P1 | `no3_home_filter_screen` | `src/navigation/AppNavigator.tsx` | 進首頁篩選 | — | — | 現役 |

---

## 邏輯：焦點來源狀態

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-HM-095 | 圖表來源不跨啟動保留、每次啟動以支出焦點為初始 | UI | T1 | P1 | `no22_home_period_state_logic` | `src/contexts/HomeFilterContext.tsx` | 切到收入焦點後冷啟 | — | — | 現役 |
