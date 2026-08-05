# 檢驗點：報表與期間狀態

檢驗點清單分冊。欄位定義、自檢方式與全冊索引見 `../no0_index.md`。

- 域碼：C-RP
- 涵蓋：期間推導、報表聚合、轉帳計入報表、圖表資料、帳戶選取同步、首頁顯示狀態持久化、報表快取

---

## 邏輯：期間推導

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-RP-001 | 期間偏移 0 為當期、每減 1 往過去一期 | UI | T1 | P1 | `no22_home_period_state_logic` | `src/utils/timeHelper.ts::getPeriodDates` | 有過去期間的紀錄 | — | `src/utils/timeHelper.getPeriodDates.weekStart.test.ts`（offset walks whole weeks under the chosen start） | 現役 |
| C-RP-002 | 期間偏移每加 1 往未來一期 | UI | T1 | P1 | `no22_home_period_state_logic` | `src/utils/timeHelper.ts::getPeriodDates` | 有未來日期的紀錄 | — | `src/utils/timeHelper.deriveNavigableOffsets.test.ts`（latest record 3 months ahead → future offsets up to that period） | 現役 |
| C-RP-003 | 以時區換算當下時間定位當期 | UI | T3 | P2 | `no22_home_period_state_logic` | `src/utils/timeHelper.ts::getPeriodDates` | 時區設為與裝置相差一日的地區、當下接近當地跨日邊界 | — | `src/utils/timeHelper.deriveNavigableOffsets.test.ts`（boundary assignment is timezone-aware (same inputs, different zone)） | 現役 |
| C-RP-004 | 粒度為日、月或年時起訖為該粒度的完整範圍 | UI | T1 | P1 | `no22_home_period_state_logic` | `src/utils/timeHelper.ts::getPeriodDates` | 有跨月與跨年的紀錄 | — | — | 現役 |
| C-RP-005 | 粒度為週時起訖為完整一週、起算日依週起始日 | UI | T1 | P1 | `no22_home_period_state_logic` | `src/utils/timeHelper.ts::getPeriodDates` | 週起始日設為週一、當期跨週界有紀錄 | — | `src/utils/timeHelper.getPeriodDates.weekStart.test.ts`（Monday start: week runs Mon 07-06 .. Sun 07-12） | 現役 |
| C-RP-006 | 週起始日偏好為 auto 時依語系慣例起算 | UI | T1 | P1 | `no22_home_period_state_logic` | `src/utils/calendarGrid.ts::resolveWeekStart` | 週起始日設為 auto、語系為週一起算語系 | — | `src/utils/calendarGrid.test.ts`（follows the locale convention on auto） | 現役 |
| C-RP-007 | 週起始日明選週日或週一時勝過語系慣例 | UI | T1 | P1 | `no22_home_period_state_logic` | `src/utils/calendarGrid.ts::resolveWeekStart` | 週起始日設為週日、語系為週一起算語系 | — | `src/utils/calendarGrid.test.ts`（overrides the locale convention when sunday/monday is chosen） | 現役 |
| C-RP-008 | 粒度為全部時起訖固定涵蓋 2000 年至 2100 年、不受偏移影響 | UI | T1 | P1 | `no22_home_period_state_logic` | `src/utils/timeHelper.ts::getPeriodDates` | 已佈置 1999 年與 2101 年的交易、粒度設為全部 | — | — | 現役 |

---

## 邏輯：報表聚合

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-RP-009 | 所屬帳戶已停用的交易不列入報表計算 | UI | T1 | P0 | `no13_home_report_logic` | `src/stores/PeriodDataStore.ts::buildPeriodReport` | 停用一個有交易的帳戶 | — | `src/stores/PeriodDataStore.test.ts`（a disabled account expense is dropped; the enabled one stays） | 現役 |
| C-RP-010 | 所屬分類已停用的交易不列入報表計算 | UI | T1 | P0 | `no13_home_report_logic` | `src/stores/PeriodDataStore.ts::buildPeriodReport` | 停用一個有交易的分類 | — | `src/stores/PeriodDataStore.test.ts`（a disabled-category expense is dropped from totals AND the section list; the enabled one stays） | 現役 |
| C-RP-011 | 停用帳戶後其歷史交易仍留存資料庫、不隨停用刪除 | DB | T2 | P0 | `no13_home_report_logic` | `src/services/accountLogic.ts::updateAccount` | 停用一個有交易的帳戶後對賬 sqlite | — | — | 現役 |
| C-RP-012 | 帳戶或分類查無定義的交易仍列入報表計算、僅明確停用者剔除 | UI | T4 | P1 | — | `src/stores/PeriodDataStore.ts::buildPeriodReport` | 不適用 | 查無定義的引用只在連帶刪除中途出現、無手動入口 | `src/stores/PeriodDataStore.test.ts`（a not-in-map account (deleted) is still counted (only explicitly-disabled is dropped)） | 現役 |
| C-RP-013 | 已選帳戶幣別全同時走單幣別模式、金額用原始幣別 | UI | T1 | P0 | `no13_home_report_logic` | `src/stores/PeriodDataStore.ts::buildPeriodReport` | 僅選取同幣別帳戶 | — | — | 現役 |
| C-RP-014 | 已選帳戶幣別不同時換算為主要貨幣後累計 | UI | T1 | P0 | `no13_home_report_logic` | `src/stores/PeriodDataStore.ts::buildPeriodReport` | 選取多個不同幣別的帳戶 | — | — | 現役 |
| C-RP-015 | 支出合計與收入合計不受圖表來源影響、皆獨立計算 | UI | T1 | P1 | `no13_home_report_logic` | `src/stores/PeriodDataStore.ts::buildPeriodReport` | 當期有收支各一筆 | — | — | 現役 |
| C-RP-016 | 分組清單僅含與圖表來源一致的類型 | UI | T1 | P1 | `no13_home_report_logic` | `src/stores/PeriodDataStore.ts::buildPeriodReport` | 當期有收支各一筆 | — | — | 現役 |
| C-RP-017 | 類別分組依該類型金額由大到小排序 | UI | T1 | P1 | `no13_home_report_logic` | `src/stores/PeriodDataStore.ts::buildPeriodReport` | 當期有多個類別且金額互異 | — | — | 現役 |
| C-RP-018 | 日期分組依日期由新到舊排序 | UI | T1 | P1 | `no13_home_report_logic` | `src/stores/PeriodDataStore.ts::buildPeriodReport` | 當期有跨多日的紀錄 | — | — | 現役 |
| C-RP-019 | 分組內各筆紀錄依日期由新到舊排序 | UI | T1 | P2 | — | `src/stores/PeriodDataStore.ts::buildPeriodReport` | 同一分組內有多筆不同日期的紀錄 | — | — | 現役 |
| C-RP-020 | 期間餘額為收入合計減支出合計 | UI | T1 | P0 | `no13_home_report_logic` | `src/stores/PeriodDataStore.ts::buildPeriodReport` | 當期有收支各一筆 | — | — | 現役 |

---

## 邏輯：轉帳計入報表

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-RP-021 | 轉出與轉入帳戶皆在已選帳戶清單的轉帳不列入報表計算 | UI | T1 | P0 | `no13_home_report_logic` | `src/services/transferDisplayLogic.ts::resolveTransferDisplay` | 兩端帳戶皆選取且已建立互轉 | — | `src/services/transferDisplayLogic.test.ts`（兩端皆選 → 不顯示（內部轉帳）） | 現役 |
| C-RP-022 | 轉出與轉入帳戶皆不在已選帳戶清單的轉帳不列入報表計算 | UI | T1 | P0 | `no13_home_report_logic` | `src/services/transferDisplayLogic.ts::resolveTransferDisplay` | 轉帳兩端帳戶皆取消選取 | — | `src/services/transferDisplayLogic.test.ts`（兩端皆不選 → 不顯示（無關）） | 現役 |
| C-RP-023 | 外部帳戶已刪除或已停用的轉帳不列入報表計算 | UI | T1 | P1 | `no13_home_report_logic` | `src/services/transferDisplayLogic.ts::resolveTransferDisplay` | 轉帳對手帳戶已停用 | — | `src/services/transferDisplayLogic.test.ts`（A6-03: 外部帳戶已停用（在 accountMap 但 disabledOn != null）→ 不顯示） | 現役 |
| C-RP-024 | 僅轉出帳戶在已選帳戶清單時以轉出金額列入支出合計 | UI | T1 | P0 | `no13_home_report_logic` | `src/services/transferDisplayLogic.ts::resolveTransferDisplay` | 僅選取轉出方帳戶 | — | `src/services/transferDisplayLogic.test.ts`（轉出在選內 → 支出，用 amountFrom + 轉出帳戶幣別） | 現役 |
| C-RP-025 | 僅轉入帳戶在已選帳戶清單時以轉入金額列入收入合計 | UI | T1 | P0 | `no13_home_report_logic` | `src/services/transferDisplayLogic.ts::resolveTransferDisplay` | 僅選取轉入方帳戶 | — | `src/services/transferDisplayLogic.test.ts`（轉入在選內 → 收入，用 amountTo + 轉入帳戶幣別） | 現役 |
| C-RP-026 | 已選端自身停用時該轉帳仍列入報表計算 | UI | T4 | P1 | — | `src/services/transferDisplayLogic.ts::resolveTransferDisplay` | 不適用 | 停用帳戶即自已選清單移除、該狀態無法佈置 | `src/services/transferDisplayLogic.test.ts`（A6-03: 已選端自身停用、外部端正常 → 仍顯示（停用判斷只針對外部對手端）） | 現役 |
| C-RP-027 | 轉帳金額查無帳戶幣別時以主要貨幣為後備 | LOG | T4 | P2 | — | `src/services/transferDisplayLogic.ts::resolveTransferDisplay` | 不適用 | 帳戶恆帶幣別、查無幣別的狀態無法佈置 | `src/services/transferDisplayLogic.test.ts`（所選帳戶查無幣別時 displayCurrency 退回注入的 baseCurrencyCode（非寫死 TWD）） | 現役 |

---

## 邏輯：圖表資料

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-RP-028 | 圖表各分組依金額由大到小排序 | UI | T1 | P2 | `no13_home_report_logic` | `src/services/homeReportLogic.ts::buildChartData` | 當期有多個分組且金額互異 | — | `src/services/homeReportLogic.test.ts`（sorts entries by amount descending before slicing） | 現役 |
| C-RP-029 | 累積達總和 5/6 或累加至第 2 分組先達成者為截止點 | UI | T1 | P2 | `no13_home_report_logic` | `src/services/homeReportLogic.ts::buildChartData` | 當期分組金額跨門檻兩側 | — | `src/services/homeReportLogic.test.ts`（uses splitIndex=1 when the largest entry alone clears the 5/6 threshold） | 現役 |
| C-RP-030 | 截止點內分組依排名分配圖表色票序列 | UI | T1 | P2 | `no13_home_report_logic` | `src/services/homeReportLogic.ts::pickChartColor` | 當期恰兩個分組即達門檻 | — | `src/services/homeReportLogic.test.ts`（returns the chart color at the given index） | 現役 |
| C-RP-031 | 色票序列用盡時回到第一個色票 | UI | T4 | P2 | — | `src/services/homeReportLogic.ts::pickChartColor` | 不適用 | 截止點至多兩個分組、色盤不會被用盡 | `src/services/homeReportLogic.test.ts`（falls back to chart[0] when the index overflows the palette） | 現役 |
| C-RP-032 | 截止點外分組合併為其他、分配次要色 | UI | T1 | P2 | `no13_home_report_logic` | `src/services/homeReportLogic.ts::buildChartData` | 當期有三個以上分組 | — | `src/services/homeReportLogic.test.ts`（uses splitIndex=2 when no single entry clears the threshold） | 現役 |
| C-RP-033 | 無分組溢出截止點時不產出其他分組 | UI | T1 | P2 | — | `src/services/homeReportLogic.ts::buildChartData` | 當期恰兩個分組且金額相近 | — | `src/services/homeReportLogic.test.ts`（omits the Other bucket when nothing spills past splitIndex） | 現役 |
| C-RP-034 | 該類型金額總和非正數時圖表分組清單為空 | UI | T1 | P2 | — | `src/services/homeReportLogic.ts::buildChartData` | 當期無該類型紀錄 | — | `src/services/homeReportLogic.test.ts`（returns empty data when total is zero or negative） | 現役 |
| C-RP-035 | 圖表區塊名稱取自對應類別或外部帳戶名稱 | UI | T1 | P1 | `no13_home_report_logic` | `src/services/homeReportLogic.ts::buildChartData` | 當期有一般交易與轉帳各一筆 | — | `src/services/homeReportLogic.test.ts`（resolves transfer_ keys via accountMap） | 現役 |
| C-RP-036 | 分類查無定義時圖表區塊名稱顯示未分類 | UI | T4 | P2 | — | `src/services/homeReportLogic.ts::buildChartData` | 不適用 | 分類刪除連帶處理其交易、查無分類的狀態無手動入口 | `src/services/homeReportLogic.test.ts`（falls back to period.uncategorized for an unknown category） | 現役 |

---

## 邏輯：帳戶選取同步

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-RP-037 | 首次載入無既有選取時全選未刪除且未停用的帳戶 | UI | T3 | P1 | `no22_home_period_state_logic` | `src/contexts/reconcileAccountSelection.ts::reconcileAccountSelection` | 全新帳號建帳戶後進首頁 | — | `src/contexts/reconcileAccountSelection.test.ts`（prev 空 → 全選（caller 首載傳 newlyDetectedIds 為空、靠防空回退達成）） | 現役 |
| C-RP-038 | 首次載入有既有選取時過濾已刪除與已停用帳戶 | UI | T1 | P1 | `no22_home_period_state_logic` | `src/contexts/reconcileAccountSelection.ts::reconcileAccountSelection` | 停用一個已選帳戶後冷啟 | — | `src/contexts/reconcileAccountSelection.test.ts`（既有部分失效 → 只過濾失效 ID、不補（C15 迴歸）） | 現役 |
| C-RP-039 | 首次載入有既有選取時不補入清單以外的既有帳戶 | UI | T1 | P1 | `no22_home_period_state_logic` | `src/contexts/reconcileAccountSelection.ts::reconcileAccountSelection` | 取消部分帳戶後冷啟 | — | `src/contexts/reconcileAccountSelection.test.ts`（既有全有效 → 原樣保留、不補其他帳戶（C15 迴歸）） | 現役 |
| C-RP-040 | 首次載入既有選取全數失效時回退為全選 | UI | T1 | P1 | `no22_home_period_state_logic` | `src/contexts/reconcileAccountSelection.ts::reconcileAccountSelection` | 停用全部已選帳戶後冷啟 | — | `src/contexts/reconcileAccountSelection.test.ts`（既有全失效（過濾後變空）→ 防空回退全選） | 現役 |
| C-RP-041 | 帳戶新增或重新啟用後自動加入已選清單 | UI | T1 | P1 | `no22_home_period_state_logic` | `src/contexts/reconcileAccountSelection.ts::reconcileAccountSelection` | 已取消部分帳戶後新增一個帳戶 | — | `src/contexts/reconcileAccountSelection.test.ts`（新增帳戶 → 既有選取保留並併入新帳戶） | 現役 |
| C-RP-042 | 帳戶刪除或停用後自動自已選清單移除 | UI | T1 | P1 | `no22_home_period_state_logic` | `src/contexts/reconcileAccountSelection.ts::reconcileAccountSelection` | 停用一個已選帳戶 | — | `src/contexts/reconcileAccountSelection.test.ts`（帳戶集合部分重疊 → 維持仍有效的既有選取、不誤回退全選） | 現役 |
| C-RP-043 | 帳戶集合部分重疊時維持仍有效的既有選取 | UI | T1 | P1 | `no22_home_period_state_logic` | `src/contexts/reconcileAccountSelection.ts::reconcileAccountSelection` | 刪除部分已選帳戶後冷啟 | — | `src/contexts/reconcileAccountSelection.test.ts`（帳戶集合部分重疊 → 維持仍有效的既有選取、不誤回退全選） | 現役 |
| C-RP-044 | 已選清單變空且仍有可用帳戶時回退為全選 | UI | T1 | P1 | `no22_home_period_state_logic` | `src/contexts/reconcileAccountSelection.ts::reconcileAccountSelection` | 停用全部已選帳戶後再啟用其一 | — | `src/contexts/reconcileAccountSelection.test.ts`（停用 / 刪除導致選取變空但仍有可用帳戶 → 回退全選） | 現役 |
| C-RP-045 | 換帳號後舊帳戶識別碼全失效時回退新帳號全選 | UI | T3 | P1 | `no22_home_period_state_logic` | `src/contexts/reconcileAccountSelection.ts::reconcileAccountSelection` | 換帳號後進首頁 | — | `src/contexts/reconcileAccountSelection.test.ts`（換帳號後舊 ID 全失效 → 回退新帳號全選，非空） | 現役 |
| C-RP-046 | 無可用帳戶時已選清單維持空、不無中生有 | UI | T1 | P2 | `no22_home_period_state_logic` | `src/contexts/reconcileAccountSelection.ts::reconcileAccountSelection` | 停用全部帳戶 | — | `src/contexts/reconcileAccountSelection.test.ts`（完全沒有可用帳戶 → 維持空、不無中生有 · 首載） | 現役 |
| C-RP-047 | 新偵測帳戶已在保留清單內時不重複加入 | UI | T4 | P2 | — | `src/contexts/reconcileAccountSelection.ts::reconcileAccountSelection` | 不適用 | 重複偵測時序無法手動構造 | `src/contexts/reconcileAccountSelection.test.ts`（新偵測 ID 已在保留清單內 → 不重複加入） | 現役 |
| C-RP-048 | 僅剩一個已選帳戶時取消該帳戶不生效 | UI | T1 | P1 | `no22_home_period_state_logic` | `src/contexts/HomeFilterContext.tsx::toggleAccount` | 取消至僅剩一個已選帳戶 | — | — | 現役 |
| C-RP-049 | 切換期間偏移或時間粒度不重設已選帳戶清單 | UI | T1 | P1 | `no22_home_period_state_logic` | `src/contexts/HomeFilterContext.tsx` | 取消部分帳戶後切粒度 | — | — | 現役 |
| C-RP-050 | 切換分組模式或圖表來源不重設已選帳戶清單 | UI | T1 | P1 | `no22_home_period_state_logic` | `src/contexts/HomeFilterContext.tsx` | 取消部分帳戶後切分組模式 | — | — | 現役 |
| C-RP-051 | 換帳號後首頁顯示狀態重設為預設、不殘留前一帳號的值 | UI | T3 | P1 | — | `src/contexts/HomeFilterContext.tsx` | 改過篩選的帳號登出後換另一帳號登入 | — | — | 現役 |

---

## 邏輯：首頁顯示狀態持久化

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-RP-052 | 時間粒度、分組模式與已選帳戶清單存於使用者設定、不上傳雲端 | DB+FB | T2 | P1 | `no22_home_period_state_logic` | `src/contexts/HomeFilterContext.tsx` | 改篩選後對賬 sqlite 與 Firestore | — | — | 現役 |
| C-RP-053 | 圖表來源不持久化、每次啟動以支出為初始 | UI | T1 | P2 | `no22_home_period_state_logic` | `src/contexts/HomeFilterContext.tsx` | 圖表來源切為收入後冷啟 | — | — | 現役 |
| C-RP-054 | 使用者確立後自設定讀取三值 | DB | T2 | P1 | `no22_home_period_state_logic` | `src/contexts/HomeFilterContext.tsx` | 改篩選後冷啟 | — | — | 現役 |
| C-RP-055 | 訂閱帳戶異動前先完成三值載入 | UI | T1 | P1 | `no22_home_period_state_logic` | `src/contexts/HomeFilterContext.tsx` | 取消部分帳戶後冷啟 | — | — | 現役 |
| C-RP-056 | 時間粒度為集外值時視為日 | DB | T3 | P1 | `no22_home_period_state_logic` | `src/contexts/homeFilterPersistence.ts::sanitizeTimeGranularity` | sqlite 注入集外粒度後冷啟 | — | `src/contexts/homeFilterPersistence.test.ts`（sanitizeTimeGranularity · 集外值與空值一律回 null） | 現役 |
| C-RP-057 | 分組模式為集外值時視為類別 | DB | T3 | P1 | `no22_home_period_state_logic` | `src/contexts/homeFilterPersistence.ts::sanitizeGroupMode` | sqlite 注入集外分組模式後冷啟 | — | `src/contexts/homeFilterPersistence.test.ts`（sanitizeGroupMode · 集外值與空值一律回 null） | 現役 |
| C-RP-058 | 已選帳戶清單為壞 JSON 或非字串陣列時視為無既有清單 | DB | T3 | P1 | `no22_home_period_state_logic` | `src/contexts/homeFilterPersistence.ts::parseSelectedAccountIds` | sqlite 注入壞 JSON 後冷啟 | — | `src/contexts/homeFilterPersistence.test.ts`（壞 JSON 回 null） | 現役 |
| C-RP-059 | 已選帳戶清單為空陣列時視為無既有清單、走初始全選 | DB | T3 | P2 | `no22_home_period_state_logic` | `src/contexts/homeFilterPersistence.ts::parseSelectedAccountIds` | sqlite 注入空陣列後冷啟 | — | `src/contexts/homeFilterPersistence.test.ts`（空陣列合法回傳（reconcile 首載會轉全選，等同無清單）） | 現役 |
| C-RP-060 | 讀取失敗時三值維持預設且本次啟動不寫回 | DB | T4 | P1 | `no22_home_period_state_logic` | `src/contexts/HomeFilterContext.tsx` | 不適用 | 讀取拋錯無手動入口 | — | 現役 |
| C-RP-061 | 時間粒度或分組模式變更後即寫回 | DB | T2 | P1 | `no22_home_period_state_logic` | `src/contexts/HomeFilterContext.tsx::persistField` | 切粒度後對賬 sqlite | — | — | 現役 |
| C-RP-062 | 已選帳戶清單變更後即寫回 | DB | T2 | P1 | `no22_home_period_state_logic` | `src/contexts/HomeFilterContext.tsx` | 取消一個帳戶後對賬 sqlite | — | — | 現役 |
| C-RP-063 | 寫回涵蓋帳戶異動自動增減的結果 | DB | T2 | P1 | `no22_home_period_state_logic` | `src/contexts/HomeFilterContext.tsx` | 新增帳戶後對賬 sqlite | — | — | 現役 |
| C-RP-064 | 載入完成前不寫回 | DB | T4 | P1 | `no22_home_period_state_logic` | `src/contexts/HomeFilterContext.tsx` | 不適用 | 載入時序無法手動控制 | — | 現役 |
| C-RP-065 | 使用者設定列尚未建立時跳過該次寫回 | DB | T4 | P2 | `no22_home_period_state_logic` | `src/contexts/HomeFilterContext.tsx` | 不適用 | 無設定列的狀態無法佈置 | — | 現役 |
| C-RP-066 | 寫入進行中改回原值仍補排落地、不固化中間值 | DB | T4 | P1 | — | `src/contexts/HomeFilterContext.tsx` | 不適用 | 寫入時序無法手動構造 | `src/contexts/HomeFilterContext.selectionPersist.test.tsx`（in-flight 寫入期間改回原值仍會補排落地，DB 不固化中間值） | 現役 |
| C-RP-067 | 換帳號後不把新選取寫進前一帳號的設定列 | DB | T4 | P1 | — | `src/contexts/HomeFilterContext.tsx` | 不適用 | 換帳號與寫回的交錯時序無法手動構造 | — | 現役 |

---

## 邏輯：報表快取

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-RP-068 | 快取鍵含主要貨幣、改主要貨幣不命中原快取 | LOG | T2 | P1 | — | `src/stores/PeriodDataStore.ts::getCacheKey` | 改主要貨幣後對賬 QA RCACHE lookup | — | `src/stores/PeriodDataStore.test.ts`（AXIS4-14: a different base currency does not hit the previous base entry） | 現役 |
| C-RP-069 | 快取鍵含匯率版本、匯率載入或編輯後不命中原快取 | LOG | T2 | P1 | — | `src/stores/PeriodDataStore.ts::getCacheKey` | 改一筆匯率後對賬 QA RCACHE lookup | — | `src/stores/PeriodDataStore.test.ts`（AXIS4-12: a different rates version does not hit the stale entry） | 現役 |
| C-RP-070 | 快取鍵含解析後週起始日、改週起始日不命中原快取 | LOG | T2 | P1 | `no22_home_period_state_logic` | `src/stores/PeriodDataStore.ts::getCacheKey` | 改週起始日後對賬 QA RCACHE lookup | — | `src/stores/PeriodDataStore.test.ts`（WEEK-START: a different resolved week start does not hit the previous entry） | 現役 |
| C-RP-071 | 全部維度相同且同一使用者共用同一份快取 | LOG | T2 | P1 | `no22_home_period_state_logic` | `src/stores/PeriodDataStore.ts::getCacheKey` | 來回切換同兩個期間後對賬 QA RCACHE lookup | — | `src/stores/PeriodDataStore.test.ts`（identical dimensions still share one entry (new dims are not over-partitioning)） | 現役 |
| C-RP-072 | 不同使用者即使維度相同對應各自快取 | LOG | T3 | P1 | `no22_home_period_state_logic` | `src/stores/PeriodDataStore.ts::getCacheKey` | 兩帳號輪流登入後對賬 QA RCACHE lookup | — | `src/stores/PeriodDataStore.test.ts`（a different user does not hit the previous user entry (cache key folds in user)） | 現役 |
| C-RP-073 | 快取命中時直接回傳既有結果、不重新查詢 | LOG | T2 | P1 | `no22_home_period_state_logic` | `src/stores/PeriodDataStore.ts::fetch` | 來回切換期間後對賬 QA RCACHE lookup hit=true | — | `src/stores/PeriodDataStore.test.ts`（fetch dedupes/serves the cached entry on the second call for the same key） | 現役 |
| C-RP-074 | 快取命中時更新該筆的存取時間 | LOG | T2 | P2 | `no22_home_period_state_logic` | `src/stores/PeriodDataStore.ts::getData` | 快取已存滿後回看最舊一筆、再切一個新期間 | — | — | 現役 |
| C-RP-075 | 同一快取鍵已有進行中查詢時共用結果、不重複查 | LOG | T4 | P1 | `no22_home_period_state_logic` | `src/stores/PeriodDataStore.ts::fetch` | 不適用 | 併發查詢時序無法手動構造 | — | 現役 |
| C-RP-076 | 粒度為年或全部時該筆快取標記為優先保留 | LOG | T2 | P2 | `no22_home_period_state_logic` | `src/stores/PeriodDataStore.ts::setPriority` | 切粒度為年後對賬 QA RCACHE store pinned | — | — | 現役 |
| C-RP-077 | 快取筆數超過十五筆時執行淘汰 | LOG | T2 | P2 | `no22_home_period_state_logic` | `src/stores/PeriodDataStore.ts::evictCacheIfNeeded` | 連續切換十六個以上期間後對賬 QA RCACHE evict | — | — | 現役 |
| C-RP-078 | 有非優先保留快取時優先淘汰其中最久未存取者 | LOG | T2 | P2 | `no22_home_period_state_logic` | `src/stores/PeriodDataStore.ts::evictCacheIfNeeded` | 混用日與年粒度切換至快取超額 | — | — | 現役 |
| C-RP-079 | 全部快取皆優先保留時自其中淘汰最久未存取者 | LOG | T2 | P2 | `no22_home_period_state_logic` | `src/stores/PeriodDataStore.ts::evictCacheIfNeeded` | 以年粒度連續切換十六期以上 | — | — | 現役 |
| C-RP-080 | 交易、轉帳、帳戶、類別或匯率任一資料表寫入後清空報表快取 | LOG | T2 | P1 | `no22_home_period_state_logic` | `src/stores/PeriodDataStore.ts` | 記一筆交易後對賬 QA RCACHE clear | — | `src/stores/PeriodDataStore.test.ts`（資料表變更時自動 clearCache，已快取的 entry 被清） | 現役 |
| C-RP-081 | 合併完成後清空報表快取 | LOG | T2 | P1 | `no22_home_period_state_logic` | `src/stores/PeriodDataStore.ts` | 完成一次合併後對賬 QA RCACHE clear | — | — | 現役 |
| C-RP-082 | 復原操作完成後清空報表快取 | LOG | T2 | P1 | `no22_home_period_state_logic` | `src/stores/PeriodDataStore.ts` | 點復原後對賬 QA RCACHE clear | — | — | 現役 |
| C-RP-083 | 匯率異動後多幣別報表依新匯率重算 | UI+LOG | T2 | P1 | `no22_home_period_state_logic` | `src/stores/PeriodDataStore.ts` | 多幣別報表已顯示且改一筆匯率 | — | — | 現役 |
| C-RP-084 | 語系變更後清空報表快取 | LOG | T2 | P1 | `no22_home_period_state_logic` | `src/contexts/PreferenceContext.tsx::setLanguage` | 改語系後對賬 QA RCACHE clear | — | — | 現役 |
| C-RP-085 | 週起始日變更後清空報表快取 | LOG | T2 | P1 | `no22_home_period_state_logic` | `src/contexts/PreferenceContext.tsx::setWeekStart` | 改週起始日後對賬 QA RCACHE clear | — | — | 現役 |
| C-RP-086 | 時區變更不清空報表快取、改以新快取鍵重查 | LOG | T2 | P2 | `no22_home_period_state_logic` | `src/contexts/PreferenceContext.tsx` | 改時區後對賬 QA RCACHE clear 與 lookup | — | — | 現役 |
| C-RP-087 | 主要貨幣變更不清空報表快取、改以新快取鍵重查 | LOG | T2 | P2 | `no22_home_period_state_logic` | `src/contexts/PreferenceContext.tsx::setBaseCurrencyId` | 全部帳戶皆為本幣帳戶、改主要貨幣後對賬 QA RCACHE clear 與 lookup | — | — | 現役 |
| C-RP-088 | 首頁重新取得焦點並重載帳戶類別後清空報表快取 | LOG | T2 | P1 | `no22_home_period_state_logic` | `src/screens/Home/HomeScreen.tsx` | 自他頁返回首頁後對賬 QA RCACHE clear | — | — | 現役 |
| C-RP-089 | 登入、登出或換帳號後清空報表快取 | LOG | T2 | P1 | `no22_home_period_state_logic` | `src/contexts/AuthContext.tsx` | 登出後重新登入對賬 QA RCACHE clear | — | — | 現役 |
| C-RP-090 | 清空同時清除存取時間、優先保留標記與進行中查詢紀錄 | LOG | T2 | P2 | `no22_home_period_state_logic` | `src/stores/PeriodDataStore.ts::clearCache` | 快取已超額後記一筆交易再對賬 QA RCACHE store | — | — | 現役 |
| C-RP-091 | 清空期間進行中的查詢結果不寫回快取 | LOG | T4 | P1 | — | `src/stores/PeriodDataStore.ts::fetch` | 不適用 | 查詢與清空的交錯時序無法手動構造 | — | 現役 |
