# 檢驗點：幣別與匯率

檢驗點清單分冊。欄位定義、自檢方式與全冊索引見 `../no0_index.md`。

- 域碼：C-CU
- 涵蓋：主要貨幣設定、貨幣顯示格式、匯率清單與編輯器、匯率換算與佔位種入、轉帳顯示解析、金額顯示格式、CurrencyRates 與 CurrencyConfig 兩表

---

## 資料模型：CurrencyRates 表

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-CU-001 | 匯率以主單位對主單位數值儲存 | DB | T2 | P1 | `no1_data_models` | `src/database/models/CurrencyRate.ts` | 已建匯率 | — | — | 現役 |
| C-CU-002 | 匯率生效時點含日期與時刻 | DB | T2 | P1 | `no1_data_models` | `src/database/schema.ts` | 已建匯率 | — | — | 現役 |
| C-CU-003 | 匯率列帶刪除時點欄、參與軟刪 | DB | T2 | P2 | `no1_data_models` | `src/database/schema.ts` | 已刪除一筆匯率 | — | — | 現役 |

---

## 資料模型：CurrencyConfig 表

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-CU-004 | 貨幣顯示設定不同步雲端、僅存本機 | FB | T2 | P2 | `no1_data_models` | `src/services/syncEngine.ts` | 已登入並改幣別顯示設定 | — | — | 現役 |
| C-CU-005 | 貨幣顯示設定無刪除時點欄、不參與軟刪 | DB | T2 | P2 | `no1_data_models` | `src/database/schema.ts` | 已登入 | — | — | 現役 |

---

## 畫面：主要貨幣設定

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-CU-006 | 進入主要貨幣設定時目前選取貨幣置頂 | UI | T1 | P1 | `no19_base_currency_setting_screen` | `src/hooks/useFrozenSelectionOrder.ts::useFrozenSelectionOrder` | 進主要貨幣設定 | — | `src/hooks/useFrozenSelectionOrder.test.tsx`（pins the mount-time selection first, then sorts the rest by secondaryCompare） | 現役 |
| C-CU-007 | 進入後改選其他貨幣不重新排序、順序維持至離開 | UI | T1 | P1 | `no19_base_currency_setting_screen` | `src/hooks/useFrozenSelectionOrder.ts::useFrozenSelectionOrder` | 進主要貨幣設定後改選 | — | `src/hooks/useFrozenSelectionOrder.test.tsx`（does not reorder when the selection changes after mount） | 現役 |
| C-CU-008 | 掛載時選取值無命中則採純字母序 | UI | T4 | P2 | — | `src/hooks/useFrozenSelectionOrder.ts::useFrozenSelectionOrder` | 不適用 | 選取值不在清單內的情境無手動入口 | `src/hooks/useFrozenSelectionOrder.test.tsx`（falls back to pure secondaryCompare order when nothing matches on mount） | 現役 |
| C-CU-009 | 主要貨幣項目顯示代碼與名稱 | UI | T1 | P2 | `no19_base_currency_setting_screen` | `src/screens/Settings/BaseCurrencySettingScreen.tsx` | 進主要貨幣設定 | — | — | 現役 |
| C-CU-010 | 主要貨幣目前選取項顯示選取標記 | UI | T1 | P1 | `no19_base_currency_setting_screen` | `src/screens/Settings/BaseCurrencySettingScreen.tsx` | 進主要貨幣設定 | — | — | 現役 |
| C-CU-011 | 主要貨幣設定輸入搜尋依代碼或名稱即時篩選 | UI | T1 | P1 | `no19_base_currency_setting_screen` | `src/screens/Settings/BaseCurrencySettingScreen.tsx` | 進主要貨幣設定輸入關鍵字 | — | — | 現役 |
| C-CU-012 | 主要貨幣設定無搜尋結果時顯示找不到結果空狀態 | UI | T1 | P2 | `list_policy` | `src/screens/Settings/BaseCurrencySettingScreen.tsx` | 搜尋不存在的代碼 | — | — | 現役 |
| C-CU-013 | 主要貨幣設定點按貨幣項目標為目前選取 | UI | T1 | P1 | `no19_base_currency_setting_screen` | `src/screens/Settings/BaseCurrencySettingScreen.tsx` | 進主要貨幣設定點另一貨幣 | — | — | 現役 |
| C-CU-014 | 點按完成按鈕寫入主要貨幣並返回 | UI+DB | T2 | P1 | `no19_base_currency_setting_screen` | `src/contexts/PreferenceContext.tsx::setBaseCurrencyId` | 改主要貨幣後點完成 | — | — | 現役 |
| C-CU-015 | 主要貨幣設定點按關閉按鈕返回上一頁、不套用選取 | UI+DB | T2 | P1 | `no19_base_currency_setting_screen` | `src/screens/Settings/BaseCurrencySettingScreen.tsx` | 改選後點關閉再對賬 | — | — | 現役 |

---

## 畫面：貨幣格式列表

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-CU-016 | 貨幣格式列表項目顯示代碼、名稱與 chevron | UI | T1 | P2 | `no20_currency_list_screen` | `src/screens/Settings/CurrencyListScreen.tsx` | 進貨幣格式列表 | — | — | 現役 |
| C-CU-017 | 貨幣格式列表輸入搜尋依代碼或名稱即時篩選 | UI | T1 | P1 | `no20_currency_list_screen` | `src/screens/Settings/CurrencyListScreen.tsx` | 進貨幣格式列表輸入關鍵字 | — | — | 現役 |
| C-CU-018 | 貨幣格式列表無搜尋結果時顯示找不到結果空狀態 | UI | T1 | P2 | `no20_currency_list_screen` | `src/screens/Settings/CurrencyListScreen.tsx` | 搜尋不存在的代碼 | — | — | 現役 |
| C-CU-019 | 點按貨幣項目導航至貨幣顯示格式畫面 | UI | T1 | P1 | `no20_currency_list_screen` | `src/screens/Settings/CurrencyListScreen.tsx` | 進貨幣格式列表點一項 | — | — | 現役 |

---

## 畫面：貨幣顯示格式

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-CU-020 | 貨幣顯示格式標題為貨幣代碼、內文首行為貨幣名稱 | UI | T1 | P2 | `no21_currency_detail_config_screen` | `src/screens/Settings/CurrencyDetailConfigScreen.tsx` | 進貨幣顯示格式 | — | — | 現役 |
| C-CU-021 | 千分位切換列含標題、說明與開關 | UI | T1 | P2 | `no21_currency_detail_config_screen` | `src/screens/Settings/CurrencyDetailConfigScreen.tsx` | 進貨幣顯示格式 | — | — | 現役 |
| C-CU-022 | 千分位開啟時顯示啟用狀態的說明文字 | UI | T1 | P2 | `no21_currency_detail_config_screen` | `src/screens/Settings/CurrencyDetailConfigScreen.tsx` | 開啟千分位開關 | — | — | 現役 |
| C-CU-023 | 千分位關閉時顯示標準顯示的說明文字 | UI | T1 | P2 | `no21_currency_detail_config_screen` | `src/screens/Settings/CurrencyDetailConfigScreen.tsx` | 關閉千分位開關 | — | — | 現役 |
| C-CU-024 | 貨幣顯示格式切換千分位開關更新目前千分位設定 | UI | T1 | P1 | `no21_currency_detail_config_screen` | `src/screens/Settings/CurrencyDetailConfigScreen.tsx` | 進貨幣顯示格式切換開關 | — | — | 現役 |
| C-CU-025 | 小數位數選項為 0 到 3 四項 | UI | T1 | P1 | `no21_currency_detail_config_screen` | `src/screens/Settings/CurrencyDetailConfigScreen.tsx` | 進貨幣顯示格式 | — | — | 現役 |
| C-CU-026 | 目前選取位數顯示選取標記 | UI | T1 | P1 | `no21_currency_detail_config_screen` | `src/screens/Settings/CurrencyDetailConfigScreen.tsx` | 進貨幣顯示格式 | — | — | 現役 |
| C-CU-027 | 貨幣顯示格式點按小數位數選項標為目前選取位數 | UI | T1 | P1 | `no21_currency_detail_config_screen` | `src/screens/Settings/CurrencyDetailConfigScreen.tsx` | 進貨幣顯示格式點另一位數 | — | — | 現役 |
| C-CU-028 | 重置為預設值列顯示該貨幣的預設位數 | UI | T1 | P2 | `no21_currency_detail_config_screen` | `src/utils/currencyUtils.ts::getDefaultDecimals` | 進貨幣顯示格式 | — | — | 現役 |
| C-CU-029 | 重置為預設值列標題採主色、與選項列區隔 | UI | T1 | P2 | `no21_currency_detail_config_screen` | `src/screens/Settings/CurrencyDetailConfigScreen.tsx` | 進貨幣顯示格式 | — | — | 現役 |
| C-CU-030 | 點按重置為預設值清除自訂位數並回復預設位數 | UI+DB | T2 | P1 | `no21_currency_detail_config_screen` | `src/services/settingsLogic.ts::resetCurrencyFormat` | 改位數後點重置 | — | — | 現役 |
| C-CU-031 | 點按完成寫入貨幣顯示格式並返回 | UI+DB | T2 | P1 | `no21_currency_detail_config_screen` | `src/services/settingsLogic.ts::setCurrencyFormat` | 改位數後點完成 | — | — | 現役 |

---

## 畫面：匯率列表

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-CU-032 | 匯率單行格式為一單位主要貨幣等於數值外幣 | UI | T1 | P1 | `no22_currency_rate_list_screen` | `src/services/currencyService.ts::formatRatePairLabel` | 已有外幣帳戶 | — | `src/services/currencyService.test.ts`（shows the base (toCode) first and the foreign (fromCode) last, inverted） | 現役 |
| C-CU-033 | 匯率列表項目顯示後綴 chevron | UI | T1 | P2 | `no22_currency_rate_list_screen` | `src/screens/Settings/CurrencyRateListScreen.tsx` | 已有外幣帳戶 | — | — | 現役 |
| C-CU-034 | 匯率數值依大小動態決定小數位、至少四位有效數字 | UI | T1 | P2 | `no22_currency_rate_list_screen` | `src/utils/currencyUtils.ts::formatExchangeRate` | 佈置極小與極大匯率各一 | — | `src/utils/currencyUtils.formatRate.test.ts`（keeps ~4 significant figures for sub-1 values） | 現役 |
| C-CU-035 | 無外幣帳戶時匯率列表顯示空狀態提示 | UI | T1 | P1 | `no22_currency_rate_list_screen` | `src/screens/Settings/CurrencyRateListScreen.tsx` | 僅有主要貨幣帳戶時進匯率列表 | — | — | 現役 |
| C-CU-036 | 匯率列表輸入搜尋依外幣或主要貨幣代碼即時篩選 | UI | T1 | P1 | `no22_currency_rate_list_screen` | `src/screens/Settings/CurrencyRateListScreen.tsx` | 已有多個外幣帳戶 | — | — | 現役 |
| C-CU-037 | 匯率列表無搜尋結果時顯示找不到結果空狀態 | UI | T1 | P2 | `no22_currency_rate_list_screen` | `src/screens/Settings/CurrencyRateListScreen.tsx` | 已有外幣帳戶且搜尋不存在的代碼 | — | — | 現役 |
| C-CU-038 | 點按匯率列表項目導航至匯率編輯器 | UI | T1 | P1 | `no22_currency_rate_list_screen` | `src/screens/Settings/CurrencyRateListScreen.tsx` | 已有外幣帳戶 | — | — | 現役 |
| C-CU-039 | 返回匯率列表時重新載入、反映編輯變動 | UI | T1 | P1 | `no22_currency_rate_list_screen` | `src/screens/Settings/CurrencyRateListScreen.tsx` | 改匯率後返回列表 | — | — | 現役 |

---

## 畫面：匯率編輯器

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-CU-040 | 匯率編輯器來源幣別鎖定為主要貨幣、不可修改 | UI | T1 | P1 | `no23_currency_rate_editor_screen` | `src/screens/Settings/CurrencyRateEditorScreen.tsx` | 進匯率編輯器 | — | — | 現役 |
| C-CU-041 | 新增模式點按目標幣別開啟幣別選擇 modal | UI | T1 | P1 | `no23_currency_rate_editor_screen` | `src/screens/Settings/CurrencyRateEditorScreen.tsx` | 以新增模式進匯率編輯器 | — | — | 現役 |
| C-CU-042 | 更新模式目標幣別不可修改 | UI | T1 | P1 | `no23_currency_rate_editor_screen` | `src/screens/Settings/CurrencyRateEditorScreen.tsx` | 自匯率列表點入 | — | — | 現役 |
| C-CU-043 | 幣別選擇 modal 內可依代碼或名稱搜尋幣別 | UI | T1 | P1 | `no23_currency_rate_editor_screen` | `src/screens/Settings/CurrencyRateEditorScreen.tsx` | 開啟幣別選擇 modal | — | — | 現役 |
| C-CU-044 | 幣別選擇 modal 無搜尋結果時顯示單行找不到幣別文字、不套列表空狀態版型 | UI | T1 | P2 | `no23_currency_rate_editor_screen` | `src/screens/Settings/CurrencyRateEditorScreen.tsx` | modal 內搜尋不存在代碼 | — | — | 現役 |
| C-CU-045 | 點按 modal 內幣別選項套用為目標幣別並關閉 modal | UI | T1 | P1 | `no23_currency_rate_editor_screen` | `src/screens/Settings/CurrencyRateEditorScreen.tsx` | 開啟 modal 點一項 | — | — | 現役 |
| C-CU-046 | 來源金額輸入框預設值為 1 | UI | T1 | P1 | `no23_currency_rate_editor_screen` | `src/screens/Settings/CurrencyRateEditorScreen.tsx` | 進匯率編輯器 | — | — | 現役 |
| C-CU-047 | 更新模式目標金額預填一單位主要貨幣對應外幣量 | UI | T1 | P1 | `no23_currency_rate_editor_screen` | `src/services/currencyService.ts::inverseRate` | 自匯率列表點入 | — | — | 現役 |
| C-CU-048 | 兩金額框即時只接受數字與單一小數點 | UI | T1 | P1 | `no23_currency_rate_editor_screen` | `src/screens/Settings/CurrencyRateEditorScreen.tsx::sanitizeDecimalInput` | 金額框輸入英文字母 | — | — | 現役 |
| C-CU-049 | 兩金額框達字元上限即時阻擋 | UI | T1 | P2 | `no23_currency_rate_editor_screen` | `src/constants/limits.ts::RATE_INPUT_MAX_LENGTH` | 金額框輸入十六字元 | — | — | 現役 |
| C-CU-050 | 輸入欄位未填妥時完成按鈕不可點按 | UI | T1 | P1 | `no23_currency_rate_editor_screen` | `src/screens/Settings/CurrencyRateEditorScreen.tsx` | 清空金額框 | — | — | 現役 |
| C-CU-051 | 點按完成寫入匯率記錄、成功後返回 | UI+DB | T2 | P1 | `no23_currency_rate_editor_screen` | `src/screens/Settings/CurrencyRateEditorScreen.tsx` | 改匯率後點完成 | — | — | 現役 |
| C-CU-052 | 匯率寫入失敗時顯示錯誤提示 | UI | T4 | P2 | `no23_currency_rate_editor_screen` | `src/screens/Settings/CurrencyRateEditorScreen.tsx` | 不適用 | 寫入失敗無手動入口 | — | 現役 |
| C-CU-053 | 匯率編輯器點按關閉按鈕返回上一頁 | UI | T1 | P1 | `no23_currency_rate_editor_screen` | `src/screens/Settings/CurrencyRateEditorScreen.tsx::handleCancel` | 進匯率編輯器點關閉 | — | — | 現役 |

---

## 邏輯：匯率解析

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-CU-054 | 查找匯率合併正向與反向的所有幣別對記錄 | UI | T1 | P1 | `no7_currency_conversion_logic` | `src/services/currencyService.ts::resolveCurrencyRate` | 佈置僅有反向記錄的幣別對 | — | `src/contexts/CurrencyContext.convertAmount.test.tsx`（same-currency / unknown-code / direct / inverse） | 現役 |
| C-CU-055 | 最新記錄為反向時取其匯率的倒數 | UI | T1 | P1 | `no7_currency_conversion_logic` | `src/services/currencyService.ts::resolveRateFromRecord` | 佈置僅有反向記錄的幣別對 | — | `src/services/currencyService.test.ts`（returns 1/rate for an inverse To→From record） | 現役 |
| C-CU-056 | 反向記錄匯率為零時換算係數回零、不做除以零 | UI | T3 | P2 | — | `src/services/currencyService.ts::resolveRateFromRecord` | sqlite 注入匯率為零的反向記錄 | — | `src/services/currencyService.test.ts`（returns 0 for an inverse record with rate 0 (no divide-by-zero)） | 現役 |
| C-CU-057 | 排除生效時點晚於當下的記錄 | UI | T1 | P1 | `no7_currency_conversion_logic` | `src/services/currencyService.ts::pickLatestEffectiveRate` | 建未來日期的跨幣別轉帳 | — | `src/services/currencyService.test.ts`（skips a future-dated record and resolves the older effective row） | 現役 |
| C-CU-058 | 依生效時點倒序取最新一筆 | UI | T1 | P1 | `no7_currency_conversion_logic` | `src/services/currencyService.ts::pickLatestEffectiveRate` | 建立生效時點不同的兩筆匯率 | — | `src/services/currencyService.test.ts`（a newer effective date still outranks a later updated_on on an older date） | 現役 |
| C-CU-059 | 生效時點相同時再依更新時間倒序取最新 | UI | T1 | P1 | `no7_currency_conversion_logic` | `src/services/currencyService.ts::pickLatestEffectiveRate` | 同一轉帳不改日期改兩次金額 | — | `src/services/currencyService.test.ts`（takes the record with the newer updated_on when dates tie） | 現役 |
| C-CU-060 | 無任何已生效記錄時匯率回 1 | UI | T1 | P1 | `no7_currency_conversion_logic` | `src/services/currencyService.ts::resolveRateFromRecord` | 佈置只有未來時點記錄的幣別對 | — | `src/services/currencyService.test.ts`（falls back to 1 when the only record for the pair is future-dated） | 現役 |
| C-CU-061 | 已軟刪的匯率記錄不參與換算 | UI | T3 | P0 | — | `src/services/currencyService.ts::resolveCurrencyRate` | sqlite 對較新一筆匯率列注入刪除時點 | — | `src/services/currencyService.test.ts`（resolveCurrencyRate skips a newer tombstone and resolves the older live row） | 現役 |
| C-CU-062 | 幣別對只剩軟刪墓碑時換算落回 1、不取已刪匯率 | UI | T3 | P0 | — | `src/services/currencyService.ts::resolveCurrencyRate` | sqlite 對該幣別對全部匯率列注入刪除時點 | — | `src/services/currencyService.test.ts`（resolveCurrencyRate ignores a soft-deleted rate and falls back to 1） | 現役 |
| C-CU-063 | 僅查直接記錄、不經中間幣別接力換算 | UI | T1 | P1 | `no7_currency_conversion_logic` | `src/services/currencyService.ts::resolveCurrencyRate` | 鋪兩腿匯率驗第三對不接力 | — | `src/services/currencyService.test.ts`（USD→TWD 無直接記錄回 1，不經 EUR 接力成 0.9 × 35） | 現役 |
| C-CU-064 | 相同幣別換算直接回原值 | UI | T1 | P1 | `no7_currency_conversion_logic` | `src/contexts/CurrencyContext.tsx::convertAmount` | 單幣別帳戶記一筆 | — | `src/contexts/CurrencyContext.convertAmount.test.tsx`（same-currency / unknown-code / direct / inverse） | 現役 |
| C-CU-065 | 未知幣別代碼換算直接回原值、不擲錯 | UI | T3 | P2 | — | `src/contexts/CurrencyContext.tsx::convertAmount` | sqlite 注入未知幣別代碼的帳戶 | — | `src/contexts/CurrencyContext.convertAmount.test.tsx`（same-currency / unknown-code / direct / inverse） | 現役 |

---

## 邏輯：佔位匯率種入

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-CU-066 | 佔位匯率記錄的值固定為 1、僅作佔位 | DB | T2 | P1 | `no7_currency_conversion_logic` | `src/services/currencyService.ts::ensureRate` | 建外幣帳戶後查匯率表 | — | `src/services/currencyService.test.ts`（ensureRate stamps the placeholder with the sentinel date, not "now"） | 現役 |
| C-CU-067 | 佔位記錄的生效時點為極早佔位時點、非建立當下 | DB | T2 | P0 | `no7_currency_conversion_logic` | `src/services/currencyService.ts::PLACEHOLDER_RATE_DATE` | 建外幣帳戶後查匯率表 | — | `src/services/currencyService.test.ts`（ensureRate stamps the placeholder with the sentinel date, not "now"） | 現役 |
| C-CU-068 | 真實匯率記錄必然壓過佔位記錄 | UI | T1 | P0 | `no7_currency_conversion_logic` | `src/services/currencyService.ts::resolveCurrencyRate` | 建外幣帳戶後補一筆較舊真實匯率 | — | `src/services/currencyService.test.ts`（an older-dated real rate written AFTER the placeholder outranks it） | 現役 |
| C-CU-069 | 僅有佔位記錄時佔位被選取、換算結果為 1 | UI | T1 | P1 | `no7_currency_conversion_logic` | `src/services/currencyService.ts::resolveCurrencyRate` | 建外幣帳戶後直接看報表 | — | `src/services/currencyService.test.ts`（a placeholder-only pair still converts at 1 through the placeholder row） | 現役 |
| C-CU-070 | 該幣別對已有未刪記錄時不重複種入佔位 | DB | T2 | P0 | `no7_currency_conversion_logic` | `src/services/currencyService.ts::ensureRate` | 建第二個同幣別外幣帳戶 | — | `src/services/currencyService.test.ts`（ensureRate stays a no-op while a live row exists for the pair (either direction)） | 現役 |
| C-CU-071 | 該幣別對只剩軟刪墓碑時重新種入佔位 | DB | T3 | P1 | — | `src/services/currencyService.ts::ensureRate` | sqlite 對該幣別對全部匯率列注入刪除時點後再建同幣別帳戶 | — | `src/services/currencyService.test.ts`（ensureRate re-seeds the 1.0 placeholder when the pair only has tombstones） | 現役 |
| C-CU-072 | 匯入不種入佔位匯率 | DB | T3 | P1 | `no7_currency_conversion_logic` | `src/services/importService.ts::executeImport` | 匯入含外幣帳戶的資料後查匯率表 | — | — | 現役 |

---

## 邏輯：手動新增匯率

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-CU-073 | 手動新增匯率拒寫非有限正值 | DB | T2 | P0 | `no7_currency_conversion_logic` | `src/services/currencyService.ts::createCurrencyRate` | 程式化注入零與負值匯率 | — | `src/services/currencyService.test.ts`（writes nothing for a negative rate） | 現役 |
| C-CU-074 | 匯率無單一寫死上限、量級由兩金額框位數上限界定 | UI | T1 | P2 | `no7_currency_conversion_logic` | `src/constants/limits.ts::RATE_INPUT_MAX_LENGTH` | 輸入高量級匯率驗可存 | — | — | 現役 |
| C-CU-075 | 編輯器兩金額比值換回外幣對主要貨幣的儲存匯率 | DB | T2 | P0 | — | `src/services/currencyService.ts::ratePairToStoredRate` | 存一筆一單位主要貨幣對三十外幣的匯率後查匯率表 | — | `src/services/currencyService.test.ts`（returns baseAmount / foreignAmount (1 foreign = r base)） | 現役 |

---

## 邏輯：幣別對清單

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-CU-076 | 幣別對清單蒐集帳戶使用且非主要貨幣的外幣、去重 | UI | T1 | P1 | `no7_currency_conversion_logic` | `src/services/currencyService.ts::getCurrencyPairs` | 建兩個同幣別外幣帳戶 | — | — | 現役 |
| C-CU-077 | 幣別對清單排除已軟刪帳戶的幣別 | UI | T1 | P1 | — | `src/services/currencyService.ts::getCurrencyPairs` | 刪除唯一的該幣別帳戶後進匯率列表 | — | `src/services/currencyService.test.ts`（getCurrencyPairs drops pairs whose only account is soft-deleted） | 現役 |

---

## 邏輯：轉帳顯示解析

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-CU-078 | 轉出與轉入帳戶皆在已選清單時不顯示 | UI | T1 | P0 | `no7_currency_conversion_logic` | `src/services/transferDisplayLogic.ts::resolveTransferDisplay` | 兩帳戶皆選取時建互轉 | — | `src/services/transferDisplayLogic.test.ts`（兩端皆選 → 不顯示（內部轉帳）） | 現役 |
| C-CU-079 | 轉出與轉入帳戶皆不在已選清單時不顯示 | UI | T1 | P0 | `no7_currency_conversion_logic` | `src/services/transferDisplayLogic.ts::resolveTransferDisplay` | 取消選取兩端帳戶 | — | `src/services/transferDisplayLogic.test.ts`（兩端皆不選 → 不顯示（無關）） | 現役 |
| C-CU-080 | 轉出端在已選清單時顯示為支出、取轉出金額與轉出帳戶幣別 | UI | T1 | P0 | `no7_currency_conversion_logic` | `src/services/transferDisplayLogic.ts::resolveTransferDisplay` | 僅選取轉出方帳戶 | — | `src/services/transferDisplayLogic.test.ts`（轉出在選內 → 支出，用 amountFrom + 轉出帳戶幣別） | 現役 |
| C-CU-081 | 轉入端在已選清單時顯示為收入、取轉入金額與轉入帳戶幣別 | UI | T1 | P0 | `no7_currency_conversion_logic` | `src/services/transferDisplayLogic.ts::resolveTransferDisplay` | 僅選取轉入方帳戶 | — | `src/services/transferDisplayLogic.test.ts`（轉入在選內 → 收入，用 amountTo + 轉入帳戶幣別） | 現役 |

---

## 邏輯：貨幣顯示設定解析

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-CU-082 | 貨幣小數位基準取該貨幣定義的 `minorUnits` | UI | T1 | P2 | `no7_currency_conversion_logic` | `src/utils/currencyUtils.ts::getMinorUnits` | 建日圓與科威特第納爾帳戶 | — | `src/utils/currencyUtils.minorUnits.test.ts`（0 for JPY/KRW, 2 for common, 3 for the dinar family） | 現役 |
| C-CU-083 | 未知貨幣代碼的 `minorUnits` 回 2、不設特例 | UI | T3 | P2 | `no7_currency_conversion_logic` | `src/utils/currencyUtils.ts::getMinorUnits` | sqlite 注入未知幣別代碼 | — | `src/utils/currencyUtils.defaultDecimals.test.ts`（未知幣別 fallback 為 2） | 現役 |
| C-CU-084 | 台幣無使用者覆寫時預設 0 位小數 | UI | T1 | P1 | `no7_currency_conversion_logic` | `src/utils/currencyUtils.ts::getDefaultDecimals` | 台幣帳戶記一筆整數金額 | — | `src/utils/currencyUtils.defaultDecimals.test.ts`（TWD 預設 0 位） | 現役 |
| C-CU-085 | 非台幣無使用者覆寫時採該貨幣 `minorUnits` | UI | T1 | P1 | `no7_currency_conversion_logic` | `src/utils/currencyUtils.ts::getDefaultDecimals` | 美元帳戶記一筆 | — | `src/utils/currencyUtils.defaultDecimals.test.ts`（非 TWD 一律等於 ISO minorUnits） | 現役 |
| C-CU-086 | 使用者設定的小數位覆寫台幣預設 0 位 | UI | T1 | P1 | `no7_currency_conversion_logic` | `src/contexts/CurrencyContext.tsx::getCurrencyConfig` | 台幣設 2 位小數後看金額 | — | — | 現役 |
| C-CU-087 | 無對應貨幣 id 時顯示設定回 2 位小數與千分位關閉 | UI | T3 | P2 | `no7_currency_conversion_logic` | `src/contexts/CurrencyContext.tsx::getCurrencyConfig` | sqlite 注入未知幣別代碼 | — | — | 現役 |
| C-CU-088 | 無貨幣顯示設定記錄時千分位視為關閉 | UI | T1 | P2 | `no7_currency_conversion_logic` | `src/contexts/CurrencyContext.tsx::getCurrencyConfig` | 未設過格式的幣別記一筆 | — | — | 現役 |
| C-CU-089 | 格式化金額的小數位與千分位由內部取得、非呼叫端傳入 | UI | T1 | P1 | `no7_currency_conversion_logic` | `src/contexts/CurrencyContext.tsx::formatCurrency` | 改幣別格式後看全 app 金額 | — | — | 現役 |

---

## 邏輯：金額顯示格式

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-CU-090 | 幣別符號固定依英語系慣例、不隨 app 語系變 | UI | T1 | P1 | — | `src/utils/formatters.ts::formatCurrencyValue` | 切語系後看同一筆金額 | — | `src/utils/formatters.formatCurrencyLocale.test.ts`（幣別符號用 en-US 慣例、不隨 app 語系變） | 現役 |
| C-CU-091 | 數字分組與小數分隔符依 app 語系 | UI | T1 | P1 | — | `src/utils/formatters.ts::formatCurrencyValue` | 切德語後看金額寫法 | — | `src/utils/formatters.formatCurrencyLocale.test.ts`（de uses dot thousands + comma decimal） | 現役 |
| C-CU-092 | 印地語系採印度式分組 | UI | T1 | P2 | — | `src/utils/formatters.ts::formatCurrencyValue` | 切印地語後看大額金額 | — | `src/utils/formatters.formatCurrencyLocale.test.ts`（hi groups Indian-style (lakh)） | 現役 |
| C-CU-093 | 負值金額負號置於幣別符號後、數字前 | UI | T1 | P1 | `no4_search_screen` | `src/utils/formatters.ts::insertMinusAfterSymbol` | 看一筆支出金額 | — | `src/utils/formatters.formatCurrencyLocale.test.ts`（TWD 負值：NT$-500 而非 -NT$500） | 現役 |
| C-CU-094 | 正值不帶負號、零視為正 | UI | T1 | P1 | `no4_search_screen` | `src/utils/formatters.ts::formatCurrencyValue` | 看一筆收入金額 | — | `src/utils/formatters.formatCurrencyLocale.test.ts`（正值不帶負號；零視為正） | 現役 |
| C-CU-095 | 負號只插在第一個數字前、分隔符不受影響 | UI | T1 | P2 | — | `src/utils/formatters.ts::insertMinusAfterSymbol` | 看一筆帶千分位的支出 | — | `src/utils/formatters.insertMinusAfterSymbol.test.ts`（千分位 / 小數：只在第一個數字前插號） | 現役 |
| C-CU-096 | 非 ASCII 數字語系仍命中第一個十進位數字 | UI | T1 | P2 | — | `src/utils/formatters.ts::insertMinusAfterSymbol` | 切泰語或印地語後看支出 | — | `src/utils/formatters.insertMinusAfterSymbol.test.ts`（非 ASCII 數字 locale） | 現役 |
| C-CU-097 | 金額切分為幣別段與數字段兩部分 | UI | T1 | P2 | — | `src/utils/formatters.ts::splitCurrencyParts` | 看首頁交易列金額 | — | `src/utils/formatters.splitCurrencyParts.test.ts`（正值：前置符號與數字段切開） | 現役 |
| C-CU-098 | 負號隨數字段走、不黏在幣別段 | UI | T1 | P2 | — | `src/utils/formatters.ts::splitCurrencyParts` | 看一筆支出的金額排版 | — | `src/utils/formatters.splitCurrencyParts.test.ts`（負值：符號後負號隨數字段走） | 現役 |
| C-CU-099 | 切分只在第一個數字前、分隔符不受影響 | UI | T1 | P2 | — | `src/utils/formatters.ts::splitCurrencyParts` | 切德語後看帶千分位金額 | — | `src/utils/formatters.splitCurrencyParts.test.ts`（千分位 / 小數 / 德式寫法：只在第一個數字前切） | 現役 |
| C-CU-100 | 未知幣別降級格式仍能正確切分並去尾端空白 | UI | T3 | P2 | — | `src/utils/formatters.ts::splitCurrencyParts` | sqlite 注入未知幣別代碼 | — | `src/utils/formatters.splitCurrencyParts.test.ts`（非 ASCII 數字 locale + 降級格式） | 現役 |
| C-CU-101 | 未知幣別代碼不擲錯、降級顯示代碼與數值 | UI | T3 | P1 | — | `src/utils/formatters.ts::formatCurrencyValue` | sqlite 注入未知幣別代碼 | — | `src/utils/formatters.formatCurrencyLocale.test.ts`（never throws on an unknown currency code; keeps code + value visible） | 現役 |
| C-CU-102 | 小數位參數獨立於 ISO 小數位生效 | UI | T1 | P1 | — | `src/utils/formatters.ts::formatCurrencyValue` | 覆寫幣別小數位後看金額 | — | `src/utils/formatters.formatCurrencyLocale.test.ts`（honors the decimals argument independent of ISO minorUnits） | 現役 |
| C-CU-103 | 未指定語系時退回當前 app 語系 | UI | T4 | P2 | — | `src/utils/formatters.ts::formatCurrencyValue` | 不適用 | 內部呼叫、無畫面判準 | `src/utils/formatters.formatCurrencyLocale.test.ts`（falls back to i18n.locale when locale arg omitted） | 現役 |
| C-CU-104 | 交易列與焦點卡金額幣別段縮小、數字段大字 | UI | T1 | P2 | — | `src/components/InlineAmount.tsx` | 看首頁交易列與焦點卡 | — | — | 現役 |
| C-CU-105 | 首頁環形圖中央金額幣別段在上、數字段在下 | UI | T1 | P2 | — | `src/screens/Home/components/AnimatedBalance.tsx` | 看首頁環形圖中心 | — | — | 現役 |
| C-CU-106 | 千分位啟用時顯示值為儲存金額除以一千 | UI | T1 | P0 | `no7_currency_conversion_logic` | `src/utils/currencyUtils.ts::decodeStorageAmount` | 開啟千分位後看三千元顯示 | — | `src/utils/currencyUtils.kmode.test.ts`（multiplies in / divides out by 1000 when K-mode is on） | 現役 |
| C-CU-107 | 千分位模式重開編輯器金額欄回填原輸入值 | UI | T1 | P0 | — | `src/utils/currencyUtils.ts::encodeStorageAmount` | 開千分位記一筆後重開編輯 | — | `src/utils/currencyUtils.kmode.test.ts`（round-trips display → storage → display in both modes） | 現役 |
| C-CU-108 | 儲存金額再除以一萬還原為主單位數值 | UI | T1 | P0 | `no7_currency_conversion_logic` | `src/utils/currencyUtils.ts::fromStorageAmount` | 記一筆已知金額後比對顯示 | — | `src/utils/currencyUtils.minorUnits.test.ts`（de-scales by the fixed factor, currency-independent） | 現役 |
| C-CU-109 | 匯率非正數或非有限時顯示替代符號、不印無限大 | UI | T3 | P2 | — | `src/utils/currencyUtils.ts::formatExchangeRate` | sqlite 注入匯率為零的記錄 | — | `src/utils/currencyUtils.formatRate.test.ts`（returns the fallback for non-positive / non-finite input） | 現役 |
