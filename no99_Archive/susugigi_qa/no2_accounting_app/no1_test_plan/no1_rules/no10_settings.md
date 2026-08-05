# 檢驗點：設定與偏好

> **語意跟進未完成。** 116 條無一退場，但 26 條寫著帳號語彙。設定主頁的帳號區與登出入口已移除、改為全資料清除，相關斷言待改寫。跟進進度見索引。

檢驗點清單分冊。欄位定義、自檢方式與全冊索引見 `../no0_index.md`。

- 域碼：C-ST
- 涵蓋：設定主頁、偏好設定、主題與啟動模式與語系與時區與週起始日五個子畫面、設定管理邏輯、偏好上傳、Settings 表

---

## 資料模型：Settings 表

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-ST-001 | Settings 表對單一使用者恆存在一筆記錄 | DB | T2 | P2 | `no1_data_models` | `src/database/schema.ts` | 已登入 | — | — | 現役 |
| C-ST-002 | Settings `userId` 對應當前 Auth UID | DB | T2 | P2 | `no1_data_models` | `src/database/models/Settings.ts` | 已登入 | — | — | 現役 |
| C-ST-003 | Settings `timeZone` 存 IANA 時區名稱 | DB | T2 | P2 | `no1_data_models` | `src/database/models/Settings.ts` | 已登入 | — | — | 現役 |
| C-ST-004 | `launchMode` 值域限首頁、支出、收入、轉帳四值 | DB | T2 | P2 | `no1_data_models` | `src/contexts/PreferenceContext.tsx` | 已登入 | — | — | 現役 |
| C-ST-005 | `launchMode` 為空字串或集外值時載入回退首頁 | UI | T3 | P2 | — | `src/contexts/PreferenceContext.tsx` | sqlite 注入集外 launchMode 後重啟 | — | — | 現役 |
| C-ST-006 | `weekStart` 值域限跟隨語系、週日、週一三值 | DB | T2 | P2 | `no1_data_models` | `src/utils/calendarGrid.ts::WEEK_START_PREFERENCE_VALUES` | 已登入 | — | — | 現役 |
| C-ST-007 | `weekStart` 為 Null 或集外值時載入回退跟隨語系 | UI | T3 | P2 | — | `src/contexts/PreferenceContext.tsx` | sqlite 注入集外 weekStart 後重啟 | — | — | 現役 |
| C-ST-008 | `weekStart` 為跟隨語系時週起始依語系慣例決定 | UI | T1 | P1 | `no1_data_models` | `src/utils/calendarGrid.ts::resolveWeekStart` | 已登入 | — | — | 現役 |
| C-ST-009 | `theme` 讀取不到時載入回退預設主題 | UI | T3 | P2 | `no5_settings_management` | `src/contexts/PreferenceContext.tsx` | sqlite 清空 theme 欄後重啟 | — | — | 現役 |
| C-ST-010 | `analyticsConsent` 為 Null 時本機讀取視為已同意 | UI | T4 | P2 | — | `src/contexts/PreferenceContext.tsx` | 不適用 | migration 殘列無手動入口 | — | 現役 |
| C-ST-011 | 既有 `language` 為未支援標籤時載入正規化為支援語系 | UI | T3 | P2 | — | `src/contexts/PreferenceContext.tsx` | sqlite 注入 zh-CN 後重啟 | — | — | 現役 |
| C-ST-012 | 三個首頁顯示狀態欄位僅存本機、不參與偏好上傳 | FB | T2 | P1 | `no1_data_models` | `src/constants/syncFields.ts::SYNC_PREFERENCE_FIELDS` | 已登入並變更首頁篩選 | — | `src/constants/syncFields.test.ts`（covers every preference key once） | 現役 |
| C-ST-013 | 偏好上傳不前移 `lastSyncedAt` | DB | T2 | P2 | `no1_data_models` | `src/services/userService.ts::uploadPreferences` | 已登入且僅改偏好 | — | — | 現役 |
| C-ST-014 | Settings `createdAt` 建立後不可變更 | DB | T2 | P2 | `no1_data_models` | `src/database/models/Settings.ts` | 已登入並改偏好 | — | — | 現役 |
| C-ST-015 | Settings `updatedOn` 於每次偏好更新後刷新 | DB | T2 | P2 | `no1_data_models` | `src/utils/auditStamp.ts::stampUpdate` | 已登入並改偏好 | — | — | 現役 |

---

## 畫面：設定主頁

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-ST-016 | 設定主頁分組以空白間距區隔、不顯示分組標題 | UI | T1 | P2 | `no8_settings_screen` | `src/screens/Settings/SettingsScreen.tsx` | 進設定主頁 | — | — | 現役 |
| C-ST-017 | 設定主頁第一組含類別管理、帳戶管理、資料管理三入口 | UI | T1 | P1 | `no8_settings_screen` | `src/screens/Settings/SettingsScreen.tsx` | 進設定主頁 | — | — | 現役 |
| C-ST-018 | 設定主頁第二組僅含偏好設定入口 | UI | T1 | P1 | `no8_settings_screen` | `src/screens/Settings/SettingsScreen.tsx` | 進設定主頁 | — | — | 現役 |
| C-ST-019 | 未訂閱付費版時設定主頁顯示升級入口 | UI | T1 | P1 | `no8_settings_screen` | `src/screens/Settings/SettingsScreen.tsx` | 免費帳號進設定主頁 | — | — | 現役 |
| C-ST-020 | 已訂閱付費版時設定主頁不顯示升級入口 | UI | T3 | P1 | `no8_settings_screen` | `src/screens/Settings/SettingsScreen.tsx` | 付費帳號進設定主頁 | — | — | 現役 |
| C-ST-021 | 設定主頁頁尾置中顯示 App 版本號 | UI | T1 | P2 | `no8_settings_screen` | `src/screens/Settings/SettingsScreen.tsx` | 進設定主頁 | — | — | 現役 |
| C-ST-022 | 設定主頁列表不足一頁時版本號仍貼齊畫面底部 | UI | T1 | P2 | `no8_settings_screen` | `src/screens/Settings/SettingsScreen.tsx` | 進設定主頁 | — | — | 現役 |
| C-ST-023 | 設定主頁列表超過一頁時版本號接於列表末端隨內容捲動 | UI | T3 | P2 | `no8_settings_screen` | `src/screens/Settings/SettingsScreen.tsx` | 放大系統字級後進設定主頁 | — | — | 現役 |
| C-ST-024 | 點按類別管理導航至類別清單 | UI | T1 | P1 | `no8_settings_screen` | `src/screens/Settings/SettingsScreen.tsx` | 進設定主頁 | — | — | 現役 |
| C-ST-025 | 點按帳戶管理導航至帳戶清單 | UI | T1 | P1 | `no8_settings_screen` | `src/screens/Settings/SettingsScreen.tsx` | 進設定主頁 | — | — | 現役 |
| C-ST-026 | 點按資料管理導航至資料管理畫面 | UI | T1 | P1 | `no8_settings_screen` | `src/screens/Settings/SettingsScreen.tsx` | 進設定主頁 | — | — | 現役 |
| C-ST-027 | 點按偏好設定導航至偏好設定畫面 | UI | T1 | P1 | `no8_settings_screen` | `src/screens/Settings/SettingsScreen.tsx` | 進設定主頁 | — | — | 現役 |
| C-ST-028 | 點按升級至付費版導航至付費牆 | UI | T1 | P1 | `no8_settings_screen` | `src/screens/Settings/SettingsScreen.tsx` | 免費帳號進設定主頁 | — | — | 現役 |
| C-ST-029 | 限時內連點版本號七次解鎖除錯工具區 | UI | T3 | P2 | — | `src/screens/Settings/SettingsScreen.tsx` | TestFlight 建置進設定主頁 | — | — | 現役 |
| C-ST-030 | 除錯工具區含主題設定入口並顯示當前主題名稱 | UI | T1 | P2 | — | `src/screens/Settings/SettingsScreen.tsx` | 解鎖除錯後進設定主頁 | — | — | 現役 |
| C-ST-031 | 正式版建置不顯示除錯工具區且主題設定路由不存在 | UI | T4 | P2 | — | `src/navigation/AppNavigator.tsx` | 不適用 | 正式版建置無法在測試環境佈置 | — | 現役 |

---

## 畫面：偏好設定

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-ST-032 | 偏好設定分組以空白間距區隔、不顯示分組標題 | UI | T1 | P2 | `no16_preference_screen` | `src/screens/Settings/PreferenceScreen.tsx` | 進偏好設定 | — | — | 現役 |
| C-ST-033 | 偏好第一組含啟動模式入口並顯示當前啟動模式 | UI | T1 | P1 | `no16_preference_screen` | `src/screens/Settings/PreferenceScreen.tsx` | 進偏好設定 | — | — | 現役 |
| C-ST-034 | 偏好第二組含主要貨幣、貨幣格式設定、匯率管理三入口 | UI | T1 | P1 | `no16_preference_screen` | `src/screens/Settings/PreferenceScreen.tsx` | 進偏好設定 | — | — | 現役 |
| C-ST-035 | 主要貨幣入口顯示當前主要貨幣代碼 | UI | T1 | P1 | `no16_preference_screen` | `src/screens/Settings/PreferenceScreen.tsx` | 進偏好設定 | — | — | 現役 |
| C-ST-036 | 偏好第三組含語系、時區、週起始日三入口 | UI | T1 | P1 | `no16_preference_screen` | `src/screens/Settings/PreferenceScreen.tsx` | 進偏好設定 | — | — | 現役 |
| C-ST-037 | 語系入口顯示當前介面語系的原生名稱 | UI | T1 | P1 | `no16_preference_screen` | `src/screens/Settings/PreferenceScreen.tsx` | 進偏好設定 | — | — | 現役 |
| C-ST-038 | 時區入口顯示當前時區的城市名稱 | UI | T1 | P1 | `no16_preference_screen` | `src/screens/Settings/PreferenceScreen.tsx` | 進偏好設定 | — | — | 現役 |
| C-ST-039 | 週起始日入口顯示當前週起始日選項 | UI | T1 | P1 | `no16_preference_screen` | `src/screens/Settings/PreferenceScreen.tsx` | 進偏好設定 | — | — | 現役 |
| C-ST-040 | 偏好第四組含分析同意開關並顯示當前狀態 | UI | T1 | P1 | `no16_preference_screen` | `src/screens/Settings/PreferenceScreen.tsx` | 進偏好設定 | — | — | 現役 |
| C-ST-041 | 偏好第五組含登出與刪除帳號兩按鈕 | UI | T1 | P1 | `no16_preference_screen` | `src/screens/Settings/PreferenceScreen.tsx` | 進偏好設定 | — | — | 現役 |
| C-ST-042 | 刪除帳號按鈕採破壞性樣式紅字 | UI | T1 | P1 | `no16_preference_screen` | `src/screens/Settings/PreferenceScreen.tsx` | 進偏好設定 | — | — | 現役 |
| C-ST-043 | 登出按鈕同採破壞性樣式紅字 | UI | T1 | P2 | — | `src/screens/Settings/PreferenceScreen.tsx` | 進偏好設定 | — | — | 現役 |
| C-ST-044 | 點按啟動模式導航至啟動模式設定 | UI | T1 | P1 | `no16_preference_screen` | `src/screens/Settings/PreferenceScreen.tsx` | 進偏好設定 | — | — | 現役 |
| C-ST-045 | 點按主要貨幣導航至主要貨幣設定 | UI | T1 | P1 | `no16_preference_screen` | `src/screens/Settings/PreferenceScreen.tsx` | 進偏好設定 | — | — | 現役 |
| C-ST-046 | 點按貨幣格式設定導航至幣別清單 | UI | T1 | P1 | `no16_preference_screen` | `src/screens/Settings/PreferenceScreen.tsx` | 進偏好設定 | — | — | 現役 |
| C-ST-047 | 點按匯率管理導航至匯率清單 | UI | T1 | P1 | `no16_preference_screen` | `src/screens/Settings/PreferenceScreen.tsx` | 進偏好設定 | — | — | 現役 |
| C-ST-048 | 點按語系導航至語系設定 | UI | T1 | P1 | `no16_preference_screen` | `src/screens/Settings/PreferenceScreen.tsx` | 進偏好設定 | — | — | 現役 |
| C-ST-049 | 點按時區導航至時區設定 | UI | T1 | P1 | `no16_preference_screen` | `src/screens/Settings/PreferenceScreen.tsx` | 進偏好設定 | — | — | 現役 |
| C-ST-050 | 點按週起始日導航至週起始日設定 | UI | T1 | P1 | `no16_preference_screen` | `src/screens/Settings/PreferenceScreen.tsx` | 進偏好設定 | — | — | 現役 |
| C-ST-051 | 切換分析同意開關即時寫入設定 | UI+DB | T2 | P1 | `no16_preference_screen` | `src/contexts/PreferenceContext.tsx::setAnalyticsConsent` | 切開關後對賬 sqlite | — | — | 現役 |
| C-ST-052 | 點按登出顯示確認對話框並預告換帳號可清本機資料 | UI | T1 | P0 | `no16_preference_screen` | `src/screens/Settings/PreferenceScreen.tsx` | 進偏好設定點登出 | — | — | 現役 |
| C-ST-053 | 確認登出後回到登入畫面 | UI | T1 | P1 | `no16_preference_screen` | `src/contexts/AuthContext.tsx::signOut` | 進偏好設定確認登出 | — | — | 現役 |
| C-ST-054 | 登出失敗時顯示登出失敗提示 | UI | T3 | P1 | `no16_preference_screen` | `src/contexts/AuthContext.tsx::signOut` | 斷網後登出 | — | — | 現役 |

---

## 畫面：主題設定

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-ST-055 | 主題設定以全螢幕 Modal 呈現、不在使用者偏好流程內 | UI | T1 | P2 | `no17_theme_settings_screen` | `src/navigation/AppNavigator.tsx` | 自除錯區進主題設定 | — | — | 現役 |
| C-ST-056 | 主題卡片含配色預覽區與主題名稱 | UI | T1 | P2 | `no17_theme_settings_screen` | `src/screens/Settings/ThemeSettingsScreen.tsx` | 進主題設定 | — | — | 現役 |
| C-ST-057 | 主題設定當前已選主題顯示選取標記 | UI | T1 | P2 | `no17_theme_settings_screen` | `src/screens/Settings/ThemeSettingsScreen.tsx` | 進主題設定 | — | — | 現役 |
| C-ST-058 | 主題設定點主題卡片即時移動選取標記、不立即套用 | UI | T1 | P2 | `no17_theme_settings_screen` | `src/screens/Settings/ThemeSettingsScreen.tsx` | 進主題設定改選其他主題 | — | — | 現役 |
| C-ST-059 | 主題設定點關閉返回且不套用變更 | UI | T1 | P1 | `no17_theme_settings_screen` | `src/screens/Settings/ThemeSettingsScreen.tsx` | 改選主題後點關閉 | — | — | 現役 |
| C-ST-060 | 主題設定點完成套用選取主題並返回 | UI | T1 | P1 | `no17_theme_settings_screen` | `src/screens/Settings/ThemeSettingsScreen.tsx` | 改選主題後點完成 | — | — | 現役 |

---

## 畫面：啟動模式設定

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-ST-061 | 啟動模式選項為首頁、支出、收入、轉帳四項 | UI | T1 | P1 | `no18_launch_mode_setting_screen` | `src/screens/Settings/LaunchModeSettingScreen.tsx` | 進啟動模式設定 | — | — | 現役 |
| C-ST-062 | 啟動模式設定當前值顯示選取標記 | UI | T1 | P1 | `no18_launch_mode_setting_screen` | `src/screens/Settings/LaunchModeSettingScreen.tsx` | 進啟動模式設定 | — | — | 現役 |
| C-ST-063 | 啟動模式設定點關閉返回且不寫入設定 | UI | T1 | P1 | `no18_launch_mode_setting_screen` | `src/screens/Settings/LaunchModeSettingScreen.tsx` | 改選啟動模式後點關閉 | — | — | 現役 |
| C-ST-064 | 啟動模式設定點完成寫入設定並返回 | UI+DB | T2 | P1 | `no18_launch_mode_setting_screen` | `src/screens/Settings/LaunchModeSettingScreen.tsx` | 改啟動模式後點完成 | — | — | 現役 |

---

## 畫面：語系設定

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-ST-065 | 語系列表進入時目前選取語系置頂 | UI | T1 | P1 | `no24_language_setting_screen` | `src/hooks/useFrozenSelectionOrder.ts::useFrozenSelectionOrder` | 進語系設定 | — | `src/hooks/useFrozenSelectionOrder.test.tsx`（pins the mount-time selection first, then sorts the rest by secondaryCompare） | 現役 |
| C-ST-066 | 其餘語系照原生名稱字母序排列 | UI | T1 | P2 | `no24_language_setting_screen` | `src/screens/Settings/LanguageSettingScreen.tsx` | 進語系設定 | — | — | 現役 |
| C-ST-067 | 語系與時區清單改選後不重排、順序維持至離開畫面 | UI | T1 | P2 | `no24_language_setting_screen` | `src/hooks/useFrozenSelectionOrder.ts::useFrozenSelectionOrder` | 進語系設定改選其他項 | — | `src/hooks/useFrozenSelectionOrder.test.tsx`（does not reorder when the selection changes after mount (frozen)） | 現役 |
| C-ST-068 | 語系項目以原生名稱呈現、不附譯名 | UI | T1 | P1 | `no24_language_setting_screen` | `src/screens/Settings/LanguageSettingScreen.tsx` | 進語系設定 | — | — | 現役 |
| C-ST-069 | 支援語系清單共 20 個 | UI | T1 | P1 | `no24_language_setting_screen` | `src/locales/i18n.ts::SUPPORTED_LANGUAGES` | 進語系設定數項數 | — | — | 現役 |
| C-ST-070 | 語系設定當前語系顯示選取標記 | UI | T1 | P1 | `no24_language_setting_screen` | `src/screens/Settings/LanguageSettingScreen.tsx` | 進語系設定 | — | — | 現役 |
| C-ST-071 | 語系搜尋依語系代碼或原生名稱即時篩選 | UI | T1 | P1 | `no24_language_setting_screen` | `src/screens/Settings/LanguageSettingScreen.tsx` | 進語系設定輸入關鍵字 | — | — | 現役 |
| C-ST-072 | 語系無搜尋結果時顯示找不到結果空狀態 | UI | T1 | P2 | `no24_language_setting_screen` | `src/screens/Settings/LanguageSettingScreen.tsx` | 搜尋不存在的語系 | — | — | 現役 |
| C-ST-073 | 語系設定點關閉返回且不寫入設定 | UI | T1 | P1 | `no24_language_setting_screen` | `src/screens/Settings/LanguageSettingScreen.tsx` | 改選語系後點關閉 | — | — | 現役 |
| C-ST-074 | 語系設定點完成寫入設定並返回 | UI+DB | T2 | P1 | `no24_language_setting_screen` | `src/screens/Settings/LanguageSettingScreen.tsx` | 改語系後點完成 | — | — | 現役 |

---

## 畫面：時區設定

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-ST-075 | 時區項目顯示城市名稱與 UTC 偏移 | UI | T1 | P1 | `no25_time_zone_setting_screen` | `src/screens/Settings/TimeZoneSettingScreen.tsx` | 進時區設定 | — | — | 現役 |
| C-ST-076 | 時區列表進入時目前選取時區置頂 | UI | T1 | P1 | `no25_time_zone_setting_screen` | `src/hooks/useFrozenSelectionOrder.ts::useFrozenSelectionOrder` | 進時區設定 | — | `src/hooks/useFrozenSelectionOrder.test.tsx`（pins the mount-time selection first, then sorts the rest by secondaryCompare） | 現役 |
| C-ST-077 | 時區設定當前時區顯示選取標記 | UI | T1 | P1 | `no25_time_zone_setting_screen` | `src/screens/Settings/TimeZoneSettingScreen.tsx` | 進時區設定 | — | — | 現役 |
| C-ST-078 | 時區搜尋依時區名稱或城市名稱即時篩選 | UI | T1 | P1 | `no25_time_zone_setting_screen` | `src/screens/Settings/TimeZoneSettingScreen.tsx` | 進時區設定輸入關鍵字 | — | — | 現役 |
| C-ST-079 | 時區無搜尋結果時顯示找不到結果空狀態 | UI | T1 | P2 | — | `src/screens/Settings/TimeZoneSettingScreen.tsx` | 搜尋不存在的時區 | — | — | 現役 |
| C-ST-080 | 時區設定點關閉返回且不寫入設定 | UI | T1 | P1 | `no25_time_zone_setting_screen` | `src/screens/Settings/TimeZoneSettingScreen.tsx` | 改選時區後點關閉 | — | — | 現役 |
| C-ST-081 | 時區設定點完成寫入設定並返回 | UI+DB | T2 | P1 | `no25_time_zone_setting_screen` | `src/screens/Settings/TimeZoneSettingScreen.tsx` | 改時區後點完成 | — | — | 現役 |

---

## 畫面：週起始日設定

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-ST-082 | 週起始日選項為跟隨語系、週日、週一三項 | UI | T1 | P1 | `no27_week_start_setting_screen` | `src/screens/Settings/WeekStartSettingScreen.tsx` | 進週起始日設定 | — | — | 現役 |
| C-ST-083 | 週起始日設定當前值顯示選取標記 | UI | T1 | P1 | `no27_week_start_setting_screen` | `src/screens/Settings/WeekStartSettingScreen.tsx` | 進週起始日設定 | — | — | 現役 |
| C-ST-084 | 週起始日設定點關閉返回且不寫入設定 | UI | T1 | P1 | `no27_week_start_setting_screen` | `src/screens/Settings/WeekStartSettingScreen.tsx` | 改選週起始日後點關閉 | — | — | 現役 |
| C-ST-085 | 週起始日設定點完成寫入設定並返回 | UI+DB | T2 | P1 | `no27_week_start_setting_screen` | `src/screens/Settings/WeekStartSettingScreen.tsx` | 改週起始日後點完成 | — | — | 現役 |

---

## 邏輯：設定管理

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-ST-086 | 切換主題即時套用並寫入 Settings 表 | UI+DB | T2 | P2 | `no5_settings_management` | `src/contexts/PreferenceContext.tsx::setThemeId` | 改主題後對賬 sqlite | — | — | 現役 |
| C-ST-087 | 切換至未定義主題識別碼時不寫入、維持原主題 | DB | T4 | P2 | — | `src/contexts/PreferenceContext.tsx::setThemeId` | 不適用 | 未定義識別碼無畫面入口 | — | 現役 |
| C-ST-088 | 設定主要貨幣時為每個不同幣別的啟用中帳戶種入佔位匯率 | DB | T2 | P0 | `no5_settings_management` | `src/services/currencyService.ts::ensureRatesForNewBase` | 有外幣帳戶時改主要貨幣 | — | `src/services/currencyService.test.ts`（ensureRatesForNewBase still seeds for a live foreign account — 多幣別去重分支未覆蓋） | 現役 |
| C-ST-089 | 已有匯率記錄的幣別對改主要貨幣時不重複種入 | DB | T2 | P0 | `no5_settings_management` | `src/services/currencyService.ts::ensureRate` | 改主要貨幣後再改回 | — | `src/services/currencyService.test.ts`（ensureRate stays a no-op while a live row exists for the pair (either direction)） | 現役 |
| C-ST-090 | 設定語系時同步切換執行期介面語系 | UI | T1 | P1 | `no5_settings_management` | `src/contexts/PreferenceContext.tsx::setLanguage` | 改語系後看介面 | — | — | 現役 |
| C-ST-091 | 設定貨幣格式時既有記錄走更新、無記錄走新增 | DB | T2 | P1 | `no5_settings_management` | `src/services/settingsLogic.ts::setCurrencyFormat` | 首次與二次設定同幣別後對賬 | — | `src/services/settingsLogic.test.ts`（updates only provided fields on an existing config）、`src/services/settingsLogic.test.ts`（creates with defaults when no config exists） | 現役 |
| C-ST-092 | 設定貨幣格式僅更新傳入的欄位、未傳入者不動 | DB | T2 | P2 | — | `src/services/settingsLogic.ts::setCurrencyFormat` | 只改千分位後對賬小數位 | — | `src/services/settingsLogic.test.ts`（does not touch decimalPlaces when only use_thousands_unit is provided） | 現役 |
| C-ST-093 | 重置貨幣小數位將既有記錄的位數設為 Null | DB | T2 | P1 | `no5_settings_management` | `src/services/settingsLogic.ts::resetCurrencyFormat` | 設位數後點重置再對賬 | — | `src/services/settingsLogic.test.ts`（updates an existing config decimalPlaces to null） | 現役 |
| C-ST-094 | 重置貨幣小數位在無記錄時新增位數為 Null 的列 | DB | T2 | P1 | `no5_settings_management` | `src/services/settingsLogic.ts::resetCurrencyFormat` | 未設過格式的幣別直接點重置 | — | `src/services/settingsLogic.test.ts`（creates a config with null decimalPlaces when none exists） | 現役 |
| C-ST-095 | 每個偏好寫入後委派偏好上傳 | FB | T2 | P1 | `no5_settings_management` | `src/contexts/PreferenceContext.tsx::updateSetting` | 改任一偏好後查 Firestore | — | — | 現役 |
| C-ST-096 | 偏好寫入不等待雲端回應、離線仍即時返回 | UI | T3 | P1 | — | `src/contexts/PreferenceContext.tsx::updateSetting` | 斷網後改偏好點完成 | — | — | 現役 |
| C-ST-097 | 未登入時偏好寫入不執行 | DB | T4 | P2 | — | `src/contexts/PreferenceContext.tsx::updateSetting` | 不適用 | 登出態無設定畫面入口 | — | 現役 |

---

## 邏輯：偏好上傳

| ID | 斷言 | 面 | 級 | P | spec 錨 | impl 錨 | 前置 | 不可測原因 | 自動化 | 狀態 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-ST-098 | 上傳欄位清單恰為七項偏好欄位 | FB | T2 | P1 | `no18_preference_upload_logic` | `src/constants/syncFields.ts::SYNC_PREFERENCE_FIELDS` | 改偏好後查 Firestore | — | `src/constants/syncFields.test.ts`（covers every preference key once） | 現役 |
| C-ST-099 | 以 dot notation 逐欄更新、未傳入欄位維持雲端原值 | FB | T2 | P0 | `no18_preference_upload_logic` | `src/services/userService.ts::uploadPreferences` | 僅改主題後查其餘欄位仍在 | — | `src/constants/syncFields.test.ts`（uploads provided fields via dot notation, dropping the rest） | 現役 |
| C-ST-100 | 主題與語系欄位名與值皆直送 | FB | T2 | P2 | `no18_preference_upload_logic` | `src/constants/syncFields.ts::SYNC_PREFERENCE_FIELDS` | 改主題與語系後查 Firestore | — | `src/constants/syncFields.test.ts`（uploads the remaining mapped fields (timeZone → timezone, etc.)） | 現役 |
| C-ST-101 | 主要貨幣上傳時轉 ISO 代碼寫入 currency 欄 | FB | T2 | P1 | `no18_preference_upload_logic` | `src/constants/syncFields.ts::localToUploadValue` | 已登入並改主要貨幣 | — | `src/constants/syncFields.test.ts`（uploads currency local id → remote ISO code (901 → TWD)） | 現役 |
| C-ST-102 | 未知貨幣 id 上傳時略去 currency 欄、不代入預設碼 | FB | T4 | P2 | `no18_preference_upload_logic` | `src/constants/syncFields.ts::localToUploadValue` | 不適用 | 未知 id 無法經正常操作產生 | `src/constants/syncFields.test.ts`（omits currency for an unknown id — never substitutes a default code） | 現役 |
| C-ST-103 | 本機 `timeZone` 上傳至雲端 `timezone` 鍵 | FB | T2 | P2 | `no18_preference_upload_logic` | `src/constants/syncFields.ts::SYNC_PREFERENCE_FIELDS` | 已登入並改時區 | — | `src/constants/syncFields.test.ts`（maps remote `timezone` onto local `timeZone` (name mismatch is explicit)） | 現役 |
| C-ST-104 | `launchMode` 為空字串或集外值時上傳正規化為首頁 | FB | T4 | P2 | `no18_preference_upload_logic` | `src/constants/syncFields.ts::localToUploadValue` | 不適用 | 舊版殘留值無法手動佈置 | `src/constants/syncFields.test.ts`（legacy empty string and out-of-set garbage both normalize to home） | 現役 |
| C-ST-105 | `weekStart` 為 Null 或集外值時上傳正規化為跟隨語系 | FB | T4 | P2 | `no18_preference_upload_logic` | `src/constants/syncFields.ts::localToUploadValue` | 不適用 | schema v8 前殘列無法手動佈置 | `src/constants/syncFields.test.ts`（pre-v8 null and out-of-set garbage both normalize to auto） | 現役 |
| C-ST-106 | `analyticsConsent` 為 Null 時上傳為已同意 | FB | T4 | P2 | `no18_preference_upload_logic` | `src/constants/syncFields.ts::localToUploadValue` | 不適用 | migration 殘列無法手動佈置 | `src/constants/syncFields.test.ts`（consent: null uploads as true） | 現役 |
| C-ST-107 | `analyticsConsent` 為關閉時上傳保留關閉、不被略過 | FB | T2 | P1 | `no18_preference_upload_logic` | `src/constants/syncFields.ts::localToUploadValue` | 已登入並關閉分析同意 | — | `src/constants/syncFields.test.ts`（consent: false survives） | 現役 |
| C-ST-108 | 其餘欄位轉換後為空值或 Null 時略過不寫入 | FB | T4 | P2 | `no18_preference_upload_logic` | `src/constants/syncFields.ts::localToUploadValue` | 不適用 | 空值狀態無手動入口 | `src/constants/syncFields.test.ts`（plain fields: empty/null/undefined are omitted） | 現役 |
| C-ST-109 | 每次上傳自動更新文件根層更新時間、不論欄位數量 | FB | T2 | P2 | `no18_preference_upload_logic` | `src/services/userService.ts::uploadPreferences` | 改任一偏好後查 Firestore | — | `src/constants/syncFields.test.ts`（uploads provided fields via dot notation, dropping the rest） | 現役 |
| C-ST-110 | 未登入時偏好上傳不執行任何雲端寫入 | FB | T2 | P1 | `no18_preference_upload_logic` | `src/services/userService.ts::uploadPreferences` | 登出態 | — | `src/constants/syncFields.test.ts`（no-ops without a uid (no cloud write when signed out)） | 現役 |
| C-ST-111 | Firestore 寫入失敗時僅記 log、不阻塞畫面 | LOG | T3 | P1 | `no18_preference_upload_logic` | `src/services/userService.ts::uploadPreferences` | 斷網後改偏好對賬 QA PREF error | — | — | 現役 |
| C-ST-112 | 偏好上傳不做付費等級篩選、全部帳號皆執行 | FB | T2 | P1 | `no18_preference_upload_logic` | `src/services/userService.ts::uploadPreferences` | 免費帳號改偏好後查 Firestore | — | — | 現役 |
| C-ST-113 | 偏好上傳不使用即時監聽 | LOG | T4 | P2 | `no18_preference_upload_logic` | `src/services/userService.ts::uploadPreferences` | 不適用 | 無畫面判準、需檢視實作 | — | 現役 |
| C-ST-114 | 多裝置同帳號各自上傳、接受最後寫入覆寫 | FB | T3 | P2 | `no18_preference_upload_logic` | `src/services/userService.ts::uploadPreferences` | 兩裝置同帳號先後改同一偏好 | — | — | 現役 |
| C-ST-115 | 全量上傳讀取本機各偏好欄位實際值 | FB | T4 | P1 | `no18_preference_upload_logic` | `src/services/userService.ts::uploadAllPreferences` | 不適用 | 無 production 呼叫端、無手動觸發路徑 | `src/constants/syncFields.test.ts`（uploads the remaining mapped fields (timeZone → timezone, etc.)） | 現役 |
| C-ST-116 | 全量上傳在本機無 Settings 列時不執行 | FB | T4 | P2 | — | `src/services/userService.ts::uploadAllPreferences` | 不適用 | 無 Settings 列狀態不可人工佈置 | `src/constants/syncFields.test.ts`（no-ops when there is no local Settings row） | 現役 |
