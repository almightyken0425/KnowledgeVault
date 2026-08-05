# impl 錨反查索引

## 文件定位

- 改動 impl 後反查要跑哪些檢驗點的入口
- 自各分冊的 impl 錨欄機械生成，不手抄
- 檢驗點定義與欄位說明見 `no0_index.md`

---

## 怎麼用

改了某個 impl 檔，在下表找該檔那一列。

三個數字回答三種問題：

- **P0**——這次改動碰到幾條資金流或資料完整性斷言
- **已自動化**——幾條跑 `npm test` 就有把關，不必手測
- **需手測**——扣掉已自動化與手動不可測後，真正要人跑的條數

檢驗點 ID 再回 `no1_rules/` 對應分冊查斷言與前置。

---

## 反查表

依涉及檢驗點數由多至少排列。

<!-- GENERATED:impl-anchor-index -->
| impl 錨 | 總數 | P0 | 已自動化 | 需手測 | 檢驗點 |
| --- | --- | --- | --- | --- | --- |
| `src/screens/Settings/ImportScreen.tsx` | 50 | 4 | 1 | 47 | C-XF-015, C-XF-016, C-XF-017, C-XF-018, C-XF-019, C-XF-020, C-XF-021, C-XF-022, C-XF-023, C-XF-024, C-XF-025, C-XF-026, C-XF-027, C-XF-028, C-XF-029, C-XF-030, C-XF-031, C-XF-032, C-XF-033, C-XF-034, C-XF-035, C-XF-036, C-XF-037, C-XF-038, C-XF-039, C-XF-040, C-XF-043, C-XF-044, C-XF-045, C-XF-046, C-XF-047, C-XF-048, C-XF-049, C-XF-050, C-XF-051, C-XF-052, C-XF-053, C-XF-054, C-XF-055, C-XF-056, C-XF-057, C-XF-058, C-XF-059, C-XF-060, C-XF-061, C-XF-062, C-XF-063, C-XF-064, C-XC-014, C-XC-017 |
| `src/screens/Settings/PreferenceScreen.tsx` | 32 | 5 | 0 | 31 | C-BT-052, C-BT-053, C-BT-054, C-BT-055, C-BT-056, C-BT-057, C-BT-058, C-BT-059, C-BT-060, C-BT-061, C-BT-062, C-BT-063, C-ST-032, C-ST-033, C-ST-034, C-ST-035, C-ST-036, C-ST-037, C-ST-038, C-ST-039, C-ST-040, C-ST-041, C-ST-042, C-ST-043, C-ST-044, C-ST-045, C-ST-046, C-ST-047, C-ST-048, C-ST-049, C-ST-050, C-ST-052 |
| `src/navigation/AppNavigator.tsx` | 31 | 0 | 0 | 28 | C-BT-102, C-BT-103, C-BT-104, C-BT-105, C-BT-106, C-BT-107, C-BT-108, C-BT-109, C-BT-110, C-BT-111, C-SB-013, C-SB-040, C-HM-001, C-HM-002, C-HM-003, C-HM-081, C-HM-082, C-HM-094, C-SR-001, C-SR-002, C-SR-003, C-SR-004, C-ST-031, C-ST-055, C-UI-001, C-UI-002, C-UI-008, C-UI-009, C-UI-010, C-UI-012, C-UI-013 |
| `src/screens/Paywall/PaywallScreen.tsx` | 27 | 0 | 1 | 23 | C-SB-014, C-SB-015, C-SB-016, C-SB-017, C-SB-018, C-SB-019, C-SB-022, C-SB-023, C-SB-024, C-SB-030, C-SB-031, C-SB-032, C-SB-033, C-SB-034, C-SB-035, C-SB-036, C-SB-037, C-SB-038, C-SB-039, C-SB-043, C-SB-044, C-SB-045, C-SB-046, C-SB-047, C-SB-048, C-SB-050, C-SB-052 |
| `src/screens/Accounts/AccountEditorScreen.tsx` | 22 | 2 | 0 | 19 | C-EN-053, C-EN-054, C-EN-055, C-EN-057, C-EN-059, C-EN-060, C-EN-062, C-EN-063, C-EN-064, C-EN-065, C-EN-066, C-EN-067, C-EN-068, C-EN-069, C-EN-076, C-EN-078, C-UD-010, C-UI-006, C-UI-018, C-UI-019, C-UI-020, C-UI-021 |
| `src/services/recurringLogic.ts::doGenerateMissingInstances` | 21 | 16 | 6 | 13 | C-RC-076, C-RC-077, C-RC-078, C-RC-079, C-RC-080, C-RC-081, C-RC-082, C-RC-083, C-RC-084, C-RC-085, C-RC-086, C-RC-087, C-RC-088, C-RC-089, C-RC-090, C-RC-091, C-RC-092, C-RC-093, C-RC-094, C-RC-095, C-XC-024 |
| `src/services/syncEngine.ts::runSync` | 20 | 3 | 9 | 11 | C-BT-066, C-BT-115, C-SB-106, C-DA-031, C-DA-032, C-DA-033, C-DA-034, C-DA-035, C-DA-036, C-DA-037, C-DA-038, C-DA-043, C-DA-044, C-DA-045, C-DA-046, C-DA-054, C-DA-058, C-DA-059, C-DA-062, C-XC-020 |
| `src/components/RecurringOptions.tsx` | 19 | 0 | 7 | 12 | C-TX-035, C-TX-036, C-TX-037, C-RC-012, C-RC-013, C-RC-014, C-RC-015, C-RC-016, C-RC-017, C-RC-018, C-RC-019, C-RC-020, C-RC-021, C-RC-022, C-RC-023, C-RC-024, C-RC-025, C-RC-026, C-UI-081 |
| `src/contexts/AuthContext.tsx::runPostAuth` | 19 | 6 | 13 | 5 | C-BT-024, C-BT-046, C-BT-047, C-BT-048, C-BT-049, C-BT-050, C-BT-051, C-BT-093, C-BT-094, C-BT-095, C-BT-096, C-BT-097, C-BT-098, C-BT-099, C-BT-100, C-BT-112, C-BT-113, C-BT-114, C-RC-074 |
| `src/components/CalendarDialog.tsx` | 18 | 0 | 0 | 18 | C-UI-082, C-UI-083, C-UI-084, C-UI-085, C-UI-086, C-UI-087, C-UI-088, C-UI-089, C-UI-090, C-UI-091, C-UI-092, C-UI-093, C-UI-094, C-UI-095, C-UI-096, C-UI-098, C-UI-099, C-UI-101 |
| `src/components/DonutChart.tsx::computeBidirectionalSliceInfo` | 18 | 0 | 17 | 1 | C-HM-006, C-HM-008, C-HM-009, C-HM-010, C-HM-011, C-HM-012, C-HM-013, C-HM-014, C-HM-016, C-HM-017, C-HM-018, C-HM-019, C-HM-020, C-HM-021, C-HM-022, C-HM-023, C-HM-024, C-HM-025 |
| `src/screens/Categories/CategoryEditorScreen.tsx` | 18 | 1 | 1 | 14 | C-EN-034, C-EN-035, C-EN-036, C-EN-038, C-EN-039, C-EN-040, C-EN-045, C-EN-046, C-EN-047, C-EN-048, C-EN-049, C-EN-050, C-EN-051, C-EN-052, C-EN-077, C-UD-011, C-UI-028, C-UI-029 |
| `src/services/importService.ts::executeImport` | 18 | 4 | 1 | 16 | C-CU-072, C-XF-083, C-XF-084, C-XF-085, C-XF-086, C-XF-087, C-XF-088, C-XF-089, C-XF-090, C-XF-092, C-XF-093, C-XF-094, C-XF-098, C-XF-099, C-DA-068, C-UI-108, C-XC-015, C-XC-016 |
| `src/screens/Home/PeriodPage.tsx::renderRecord` | 17 | 0 | 0 | 17 | C-HM-042, C-HM-044, C-HM-045, C-HM-046, C-HM-047, C-HM-048, C-HM-049, C-HM-050, C-HM-051, C-HM-052, C-HM-053, C-HM-054, C-HM-055, C-HM-056, C-HM-058, C-HM-063, C-HM-064 |
| `src/contexts/PremiumContext.tsx` | 16 | 2 | 0 | 12 | C-BT-067, C-BT-116, C-BT-121, C-BT-122, C-SB-002, C-SB-003, C-SB-004, C-SB-005, C-SB-056, C-SB-057, C-SB-058, C-SB-067, C-SB-068, C-SB-069, C-SB-071, C-RC-075 |
| `src/screens/Search/SearchScreen.tsx::renderRow` | 16 | 0 | 0 | 16 | C-SR-016, C-SR-018, C-SR-019, C-SR-020, C-SR-021, C-SR-022, C-SR-023, C-SR-024, C-SR-025, C-SR-026, C-SR-027, C-SR-028, C-SR-032, C-SR-033, C-SR-034, C-SR-035 |
| `src/screens/Search/SearchScreen.tsx` | 16 | 0 | 0 | 14 | C-SR-005, C-SR-006, C-SR-007, C-SR-008, C-SR-009, C-SR-010, C-SR-011, C-SR-012, C-SR-049, C-SR-050, C-SR-051, C-UD-031, C-UI-057, C-UI-061, C-UI-064, C-UI-075 |
| `src/stores/PeriodDataStore.ts::buildPeriodReport` | 16 | 5 | 3 | 13 | C-HM-007, C-HM-034, C-HM-037, C-HM-038, C-HM-039, C-RP-009, C-RP-010, C-RP-012, C-RP-013, C-RP-014, C-RP-015, C-RP-016, C-RP-017, C-RP-018, C-RP-019, C-RP-020 |
| `src/contexts/HomeFilterContext.tsx` | 15 | 0 | 1 | 10 | C-HM-095, C-RP-049, C-RP-050, C-RP-051, C-RP-052, C-RP-053, C-RP-054, C-RP-055, C-RP-060, C-RP-062, C-RP-063, C-RP-064, C-RP-065, C-RP-066, C-RP-067 |
| `src/screens/Settings/DataManagementScreen.tsx` | 15 | 2 | 0 | 13 | C-XF-001, C-XF-002, C-XF-003, C-XF-004, C-XF-005, C-XF-006, C-XF-007, C-XF-008, C-XF-009, C-XF-010, C-XF-011, C-XF-012, C-XF-013, C-XF-014, C-UI-031 |
| `src/screens/Settings/SettingsScreen.tsx` | 15 | 0 | 0 | 15 | C-ST-016, C-ST-017, C-ST-018, C-ST-019, C-ST-020, C-ST-021, C-ST-022, C-ST-023, C-ST-024, C-ST-025, C-ST-026, C-ST-027, C-ST-028, C-ST-029, C-ST-030 |
| `src/screens/Transactions/TransactionEditorScreen.tsx` | 15 | 0 | 0 | 15 | C-TX-016, C-TX-020, C-TX-021, C-TX-022, C-TX-024, C-TX-025, C-TX-032, C-TX-033, C-TX-034, C-TX-139, C-UD-008, C-UI-016, C-UI-022, C-UI-025, C-XC-018 |
| `src/services/mergeService.ts::performMerge` | 15 | 12 | 10 | 4 | C-EN-103, C-EN-104, C-EN-145, C-EN-146, C-EN-147, C-EN-148, C-EN-149, C-EN-150, C-EN-151, C-EN-152, C-EN-153, C-EN-154, C-EN-155, C-EN-156, C-EN-159 |
| `src/services/subscriptionGateLogic.ts::canUserPerformAction` | 15 | 5 | 9 | 5 | C-SB-084, C-SB-087, C-SB-088, C-SB-089, C-SB-090, C-SB-091, C-SB-092, C-SB-093, C-SB-094, C-SB-100, C-SB-101, C-TX-078, C-TX-079, C-TX-098, C-TX-099 |
| `src/database/schema.ts` | 14 | 3 | 0 | 14 | C-BT-003, C-BT-004, C-EN-003, C-EN-004, C-EN-011, C-TX-001, C-TX-008, C-RC-005, C-CU-002, C-CU-003, C-CU-005, C-ST-001, C-XC-001, C-XC-002 |
| `src/hooks/useCalculator.ts::handleKey` | 13 | 0 | 9 | 4 | C-TX-023, C-TX-044, C-TX-053, C-TX-054, C-TX-055, C-TX-056, C-TX-057, C-TX-058, C-TX-059, C-TX-063, C-TX-064, C-TX-066, C-TX-067 |
| `src/screens/Merge/MergeEditorScreen.tsx` | 13 | 1 | 0 | 10 | C-EN-079, C-EN-080, C-EN-083, C-EN-084, C-EN-096, C-EN-097, C-EN-098, C-EN-099, C-EN-100, C-EN-102, C-EN-105, C-EN-106, C-UI-032 |
| `src/screens/Transactions/TransferEditorScreen.tsx::handleSave` | 13 | 3 | 0 | 12 | C-TX-088, C-TX-089, C-TX-090, C-TX-091, C-TX-092, C-TX-097, C-TX-101, C-TX-102, C-UD-017, C-UD-018, C-UD-019, C-UD-035, C-UD-036 |
| `src/contexts/AuthContext.tsx::deleteUserAccount` | 12 | 8 | 9 | 2 | C-BT-064, C-BT-068, C-BT-069, C-BT-073, C-BT-074, C-BT-075, C-BT-076, C-BT-078, C-BT-080, C-BT-081, C-BT-082, C-BT-084 |
| `src/screens/Home/HomeFilterScreen.tsx` | 12 | 0 | 0 | 12 | C-HM-083, C-HM-084, C-HM-085, C-HM-086, C-HM-087, C-HM-088, C-HM-089, C-HM-090, C-HM-091, C-HM-093, C-UI-045, C-UI-047 |
| `src/screens/Settings/CurrencyRateEditorScreen.tsx` | 12 | 0 | 0 | 11 | C-CU-040, C-CU-041, C-CU-042, C-CU-043, C-CU-044, C-CU-045, C-CU-046, C-CU-050, C-CU-051, C-CU-052, C-UI-077, C-UI-078 |
| `src/services/transferLogic.ts::createTransfer` | 12 | 10 | 7 | 5 | C-TX-014, C-TX-118, C-TX-119, C-TX-120, C-TX-121, C-TX-123, C-TX-124, C-TX-125, C-TX-126, C-TX-127, C-TX-128, C-TX-129 |
| `src/contexts/reconcileAccountSelection.ts::reconcileAccountSelection` | 11 | 0 | 11 | 0 | C-RP-037, C-RP-038, C-RP-039, C-RP-040, C-RP-041, C-RP-042, C-RP-043, C-RP-044, C-RP-045, C-RP-046, C-RP-047 |
| `src/screens/Transactions/TransactionEditorScreen.tsx::handleSave` | 11 | 2 | 0 | 10 | C-TX-069, C-TX-070, C-TX-071, C-TX-073, C-TX-081, C-TX-082, C-UD-013, C-UD-014, C-UD-015, C-UD-032, C-UD-033 |
| `src/services/recurringLogic.ts::createSchedule` | 11 | 7 | 0 | 10 | C-TX-076, C-TX-095, C-RC-007, C-RC-008, C-RC-011, C-RC-039, C-RC-040, C-RC-041, C-RC-042, C-RC-043, C-RC-044 |
| `src/services/templateService.ts::generateInstructions` | 11 | 0 | 0 | 11 | C-XF-120, C-XF-121, C-XF-122, C-XF-123, C-XF-124, C-XF-125, C-XF-126, C-XF-127, C-XF-128, C-XF-129, C-XF-130 |
| `src/services/transferDisplayLogic.ts::resolveTransferDisplay` | 11 | 8 | 11 | 0 | C-RP-021, C-RP-022, C-RP-023, C-RP-024, C-RP-025, C-RP-026, C-RP-027, C-CU-078, C-CU-079, C-CU-080, C-CU-081 |
| `src/screens/Accounts/AccountListScreen.tsx` | 10 | 0 | 0 | 10 | C-EN-023, C-EN-024, C-EN-025, C-EN-027, C-EN-028, C-EN-029, C-EN-031, C-EN-032, C-UI-048, C-UI-049 |
| `src/screens/Settings/CurrencyDetailConfigScreen.tsx` | 9 | 0 | 0 | 9 | C-CU-020, C-CU-021, C-CU-022, C-CU-023, C-CU-024, C-CU-025, C-CU-026, C-CU-027, C-CU-029 |
| `src/services/transferLogic.ts::updateTransfer` | 9 | 9 | 6 | 3 | C-TX-100, C-TX-122, C-TX-130, C-TX-131, C-TX-132, C-TX-133, C-TX-134, C-TX-135, C-TX-136 |
| `src/services/userService.ts::uploadPreferences` | 9 | 1 | 3 | 5 | C-ST-013, C-ST-099, C-ST-109, C-ST-110, C-ST-111, C-ST-112, C-ST-113, C-ST-114, C-DA-066 |
| `src/components/BottomSearchBar.tsx` | 8 | 0 | 1 | 7 | C-UI-068, C-UI-069, C-UI-070, C-UI-071, C-UI-072, C-UI-073, C-UI-074, C-UI-079 |
| `src/screens/Categories/CategoryListScreen.tsx` | 8 | 0 | 0 | 8 | C-EN-013, C-EN-014, C-EN-015, C-EN-016, C-EN-017, C-EN-018, C-EN-020, C-EN-021 |
| `src/screens/Transactions/TransferEditorScreen.tsx` | 8 | 1 | 0 | 8 | C-TX-140, C-TX-038, C-TX-041, C-TX-042, C-TX-047, C-UD-009, C-UI-023, C-UI-024 |
| `src/services/accountLogic.ts::deleteAccountCascade` | 8 | 5 | 3 | 5 | C-EN-136, C-EN-137, C-EN-138, C-EN-139, C-EN-140, C-EN-141, C-EN-142, C-EN-143 |
| `src/services/homeReportLogic.ts::buildChartData` | 8 | 0 | 7 | 1 | C-HM-015, C-RP-028, C-RP-029, C-RP-032, C-RP-033, C-RP-034, C-RP-035, C-RP-036 |
| `src/services/syncEngine.ts::pushBatches` | 8 | 1 | 2 | 5 | C-SB-107, C-SB-108, C-SB-111, C-DA-049, C-DA-051, C-DA-052, C-DA-053, C-DA-057 |
| `src/utils/formatters.ts::formatCurrencyValue` | 8 | 0 | 7 | 1 | C-SR-030, C-CU-090, C-CU-091, C-CU-092, C-CU-094, C-CU-101, C-CU-102, C-CU-103 |
| `src/components/list/ListItem.tsx` | 7 | 0 | 2 | 5 | C-UI-033, C-UI-034, C-UI-035, C-UI-036, C-UI-037, C-UI-038, C-UI-039 |
| `src/constants/syncFields.ts::localToUploadValue` | 7 | 0 | 7 | 0 | C-ST-101, C-ST-102, C-ST-104, C-ST-105, C-ST-106, C-ST-107, C-ST-108 |
| `src/contexts/PreferenceContext.tsx` | 7 | 0 | 0 | 6 | C-RP-086, C-ST-004, C-ST-005, C-ST-007, C-ST-009, C-ST-010, C-ST-011 |
| `src/screens/Search/SearchScreen.tsx::performSearch` | 7 | 0 | 0 | 7 | C-SR-042, C-SR-043, C-SR-044, C-SR-045, C-SR-046, C-SR-047, C-SR-048 |
| `src/screens/Settings/LanguageSettingScreen.tsx` | 7 | 0 | 0 | 7 | C-ST-066, C-ST-068, C-ST-070, C-ST-071, C-ST-072, C-ST-073, C-ST-074 |
| `src/services/exportService.ts` | 7 | 3 | 4 | 3 | C-XF-100, C-XF-101, C-XF-102, C-XF-103, C-XF-104, C-XF-106, C-XF-108 |
| `src/services/mergeService.ts::revertMerge` | 7 | 6 | 7 | 0 | C-EN-160, C-EN-161, C-EN-162, C-EN-163, C-EN-164, C-EN-165, C-EN-166 |
| `src/services/recurringLogic.ts::updateSchedule` | 7 | 7 | 0 | 7 | C-TX-075, C-TX-094, C-RC-049, C-RC-050, C-RC-052, C-RC-053, C-RC-054 |
| `src/hooks/useFrozenSelectionOrder.ts::useFrozenSelectionOrder` | 6 | 0 | 6 | 0 | C-CU-006, C-CU-007, C-CU-008, C-ST-065, C-ST-067, C-ST-076 |
| `src/navigation/AppNavigator.tsx::handleGlobalNavigation` | 6 | 0 | 0 | 6 | C-SB-102, C-HM-066, C-HM-067, C-HM-068, C-HM-069, C-HM-070 |
| `src/screens/Home/PeriodPage.tsx` | 6 | 0 | 0 | 4 | C-HM-033, C-HM-059, C-HM-061, C-HM-062, C-HM-078, C-HM-079 |
| `src/screens/Settings/BaseCurrencySettingScreen.tsx` | 6 | 0 | 0 | 6 | C-CU-009, C-CU-010, C-CU-011, C-CU-012, C-CU-013, C-CU-015 |
| `src/screens/Settings/CurrencyListScreen.tsx` | 6 | 0 | 0 | 6 | C-CU-016, C-CU-017, C-CU-018, C-CU-019, C-UI-060, C-UI-076 |
| `src/screens/Settings/CurrencyRateListScreen.tsx` | 6 | 0 | 0 | 6 | C-CU-033, C-CU-035, C-CU-036, C-CU-037, C-CU-038, C-CU-039 |
| `src/screens/Settings/TimeZoneSettingScreen.tsx` | 6 | 0 | 0 | 6 | C-ST-075, C-ST-077, C-ST-078, C-ST-079, C-ST-080, C-ST-081 |
| `src/services/accountDeletionService.ts` | 6 | 1 | 5 | 1 | C-BT-071, C-BT-072, C-BT-077, C-BT-079, C-BT-085, C-BT-086 |
| `src/services/accountLogic.ts::createAccount` | 6 | 0 | 5 | 1 | C-EN-126, C-EN-127, C-EN-128, C-EN-129, C-EN-131, C-UI-104 |
| `src/services/categoryLogic.ts::deleteCategoryCascade` | 6 | 3 | 6 | 0 | C-EN-117, C-EN-118, C-EN-119, C-EN-120, C-EN-121, C-EN-122 |
| `src/services/currencyService.ts::resolveCurrencyRate` | 6 | 3 | 6 | 0 | C-CU-054, C-CU-061, C-CU-062, C-CU-063, C-CU-068, C-CU-069 |
| `src/services/localDbService.ts::destroyUserData` | 6 | 4 | 5 | 1 | C-BT-087, C-BT-088, C-BT-089, C-BT-090, C-BT-091, C-BT-092 |
| `src/services/recurringLogic.ts::convertToSchedule` | 6 | 6 | 4 | 2 | C-TX-077, C-TX-096, C-RC-045, C-RC-046, C-RC-047, C-RC-048 |
| `src/utils/pickerAutoSelect.ts::resolveAutoPick` | 6 | 0 | 6 | 0 | C-EN-087, C-EN-090, C-EN-091, C-EN-092, C-EN-093, C-EN-094 |
| `src/utils/timeHelper.ts::deriveNavigableOffsets` | 6 | 1 | 5 | 1 | C-HM-072, C-HM-073, C-HM-074, C-HM-075, C-HM-076, C-XC-022 |
| `src/utils/timeHelper.ts::getPeriodDates` | 6 | 0 | 4 | 2 | C-RP-001, C-RP-002, C-RP-003, C-RP-004, C-RP-005, C-RP-008 |
| `src/components/EditorDateRecurringRow.tsx` | 5 | 0 | 0 | 5 | C-TX-003, C-TX-017, C-TX-018, C-TX-019, C-UI-080 |
| `src/components/FloatingActionBar.tsx` | 5 | 0 | 0 | 5 | C-HM-065, C-UD-003, C-UD-004, C-UD-005, C-UD-006 |
| `src/components/SearchableDropdown.tsx` | 5 | 0 | 0 | 5 | C-EN-037, C-EN-056, C-EN-058, C-XF-041, C-XF-042 |
| `src/screens/Home/HomeScreen.tsx` | 5 | 0 | 0 | 5 | C-HM-060, C-HM-071, C-HM-080, C-RP-088, C-UD-030 |
| `src/screens/Settings/ThemeSettingsScreen.tsx` | 5 | 0 | 0 | 5 | C-ST-056, C-ST-057, C-ST-058, C-ST-059, C-ST-060 |
| `src/screens/Transactions/TransactionEditorScreen.tsx::handleDelete` | 5 | 1 | 0 | 5 | C-TX-083, C-TX-085, C-TX-087, C-UD-016, C-UD-034 |
| `src/screens/Transactions/TransferEditorScreen.tsx::handleDelete` | 5 | 1 | 0 | 5 | C-TX-103, C-TX-105, C-TX-107, C-UD-020, C-UD-037 |
| `src/services/categoryLogic.ts::createCategory` | 5 | 0 | 4 | 1 | C-EN-109, C-EN-110, C-EN-111, C-EN-112, C-UI-105 |
| `src/services/exportService.ts::exportToCsv` | 5 | 1 | 0 | 5 | C-XF-109, C-XF-110, C-XF-111, C-XF-112, C-DA-069 |
| `src/services/importService.ts::analyzeImportContent` | 5 | 3 | 4 | 1 | C-XF-078, C-XF-079, C-XF-080, C-XF-081, C-XF-082 |
| `src/services/importService.ts::getRowSkipReason` | 5 | 0 | 5 | 0 | C-XF-076, C-XF-077, C-XF-095, C-XF-096, C-XF-097 |
| `src/services/localDbService.ts::searchTransactions` | 5 | 0 | 3 | 2 | C-SR-037, C-SR-039, C-SR-041, C-DA-013, C-DA-015 |
| `src/services/localDbService.ts` | 5 | 1 | 1 | 2 | C-SB-099, C-DA-001, C-DA-002, C-DA-003, C-DA-004 |
| `src/services/recurringLogic.ts::deleteSchedule` | 5 | 5 | 0 | 5 | C-TX-084, C-TX-104, C-RC-055, C-RC-056, C-RC-057 |
| `src/services/recurringLogic.ts::restoreScheduleInstances` | 5 | 5 | 4 | 1 | C-RC-058, C-RC-059, C-RC-060, C-RC-061, C-RC-063 |
| `src/services/syncEngine.ts::detectRemoteUserData` | 5 | 0 | 1 | 4 | C-SB-109, C-SB-110, C-DA-039, C-DA-040, C-DA-041 |
| `src/services/syncEngine.ts` | 5 | 1 | 1 | 3 | C-TX-011, C-CU-004, C-DA-023, C-DA-024, C-DA-060 |
| `src/services/userService.ts::syncUserToFirestore` | 5 | 0 | 3 | 2 | C-BT-041, C-BT-042, C-BT-043, C-BT-044, C-BT-045 |
| `src/stores/PeriodDataStore.ts::getCacheKey` | 5 | 0 | 5 | 0 | C-RP-068, C-RP-069, C-RP-070, C-RP-071, C-RP-072 |
| `src/components/list/ListGroupCard.tsx` | 4 | 0 | 0 | 4 | C-SR-013, C-SR-015, C-UI-053, C-UI-054 |
| `src/constants/syncFields.ts::SYNC_PREFERENCE_FIELDS` | 4 | 0 | 4 | 0 | C-ST-012, C-ST-098, C-ST-100, C-ST-103 |
| `src/contexts/PremiumContext.tsx::reconcile` | 4 | 1 | 0 | 4 | C-SB-060, C-SB-070, C-SB-072, C-SB-073 |
| `src/contexts/UndoContext.tsx::beginCountdown` | 4 | 1 | 0 | 4 | C-UD-007, C-UD-021, C-UD-023, C-UD-027 |
| `src/screens/Home/components/PageHeaderContent.tsx` | 4 | 0 | 0 | 4 | C-HM-004, C-HM-028, C-HM-029, C-HM-030 |
| `src/screens/Merge/MergeEditorScreen.tsx::handleSave` | 4 | 3 | 0 | 3 | C-EN-101, C-UD-012, C-UD-045, C-UD-046 |
| `src/screens/Paywall/PaywallScreen.tsx::handleRestore` | 4 | 0 | 0 | 4 | C-SB-049, C-SB-051, C-SB-053, C-SB-054 |
| `src/screens/Settings/LaunchModeSettingScreen.tsx` | 4 | 0 | 0 | 4 | C-ST-061, C-ST-062, C-ST-063, C-ST-064 |
| `src/screens/Settings/WeekStartSettingScreen.tsx` | 4 | 0 | 0 | 4 | C-ST-082, C-ST-083, C-ST-084, C-ST-085 |
| `src/screens/Transactions/TransactionEditorScreen.tsx::loadTransaction` | 4 | 1 | 0 | 4 | C-TX-028, C-TX-029, C-TX-030, C-TX-031 |
| `src/services/cleanupInvalidIconIds.ts::cleanupInvalidIconIds` | 4 | 0 | 2 | 1 | C-BT-117, C-BT-118, C-BT-119, C-BT-120 |
| `src/services/currencyService.ts::ensureRate` | 4 | 2 | 4 | 0 | C-CU-066, C-CU-070, C-CU-071, C-ST-089 |
| `src/services/importService.ts::parseDate` | 4 | 3 | 3 | 1 | C-XF-073, C-XF-074, C-XF-075, C-XF-113 |
| `src/services/recurringLogic.ts::revertConvertToSchedule` | 4 | 3 | 4 | 0 | C-RC-066, C-RC-067, C-RC-068, C-RC-069 |
| `src/services/recurringLogic.ts::revertScheduleUpdate` | 4 | 4 | 4 | 0 | C-RC-070, C-RC-071, C-RC-072, C-RC-073 |
| `src/services/syncEngine.ts::syncEngine` | 4 | 0 | 2 | 0 | C-DA-027, C-DA-028, C-DA-029, C-DA-030 |
| `src/services/transactionLogic.ts::createTransaction` | 4 | 2 | 2 | 2 | C-TX-007, C-TX-111, C-TX-112, C-TX-113 |
| `src/services/transactionLogic.ts::updateTransaction` | 4 | 4 | 3 | 1 | C-TX-080, C-TX-114, C-TX-115, C-TX-116 |
| `src/stores/PeriodDataStore.ts` | 4 | 0 | 1 | 3 | C-RP-080, C-RP-081, C-RP-082, C-RP-083 |
| `src/utils/calendarGrid.ts::resolveWeekStart` | 4 | 0 | 3 | 1 | C-RP-006, C-RP-007, C-ST-008, C-UI-111 |
| `src/utils/formatters.ts::insertMinusAfterSymbol` | 4 | 0 | 3 | 1 | C-SR-031, C-CU-093, C-CU-095, C-CU-096 |
| `src/utils/formatters.ts::splitCurrencyParts` | 4 | 0 | 4 | 0 | C-CU-097, C-CU-098, C-CU-099, C-CU-100 |
| `src/utils/sortOrder.ts::nextSortOrder` | 4 | 0 | 4 | 0 | C-EN-107, C-EN-108, C-EN-124, C-EN-125 |
| `src/components/CalculatorKeypad.tsx` | 3 | 0 | 0 | 3 | C-TX-048, C-TX-049, C-TX-050 |
| `src/components/DualPickerBox.tsx` | 3 | 0 | 0 | 3 | C-EN-081, C-EN-095, C-TX-045 |
| `src/components/EditorNameField.tsx` | 3 | 0 | 0 | 3 | C-EN-070, C-UI-014, C-UI-015 |
| `src/components/list/ListEmptyState.tsx` | 3 | 0 | 3 | 0 | C-UI-059, C-UI-062, C-UI-063 |
| `src/components/list/ListEmptyTransition.tsx` | 3 | 0 | 1 | 2 | C-UI-058, C-UI-065, C-UI-067 |
| `src/components/list/ReorderableListItem.tsx` | 3 | 0 | 1 | 2 | C-UI-050, C-UI-051, C-UI-052 |
| `src/components/list/SelectionListItem.tsx` | 3 | 0 | 1 | 1 | C-UI-040, C-UI-041, C-UI-042 |
| `src/components/RecurringOptions.tsx::handleEndConditionChange` | 3 | 0 | 1 | 2 | C-RC-034, C-RC-035, C-RC-036 |
| `src/components/RecurringOptions.tsx::handleIntervalChange` | 3 | 0 | 0 | 3 | C-RC-031, C-RC-032, C-RC-033 |
| `src/components/RecurringOptions.tsx::handleToggle` | 3 | 0 | 0 | 3 | C-RC-027, C-RC-028, C-RC-029 |
| `src/constants/limits.ts::checkIsPremium` | 3 | 0 | 3 | 0 | C-SB-007, C-SB-008, C-SB-009 |
| `src/constants/limits.ts::NOTE_MAX_LENGTH` | 3 | 0 | 0 | 3 | C-TX-004, C-TX-012, C-RC-009 |
| `src/contexts/AuthContext.tsx::signOut` | 3 | 0 | 0 | 3 | C-BT-029, C-ST-053, C-ST-054 |
| `src/contexts/CurrencyContext.tsx::getCurrencyConfig` | 3 | 0 | 0 | 3 | C-CU-086, C-CU-087, C-CU-088 |
| `src/contexts/HomeFilterContext.tsx::toggleAccount` | 3 | 0 | 0 | 3 | C-HM-092, C-RP-048, C-UI-046 |
| `src/contexts/PreferenceContext.tsx::updateSetting` | 3 | 0 | 0 | 2 | C-ST-095, C-ST-096, C-ST-097 |
| `src/database/models/Schedule.ts` | 3 | 0 | 0 | 3 | C-RC-004, C-RC-006, C-RC-010 |
| `src/database/models/Settings.ts` | 3 | 0 | 0 | 3 | C-ST-002, C-ST-003, C-ST-014 |
| `src/database/models/SoftDeletableModel.ts` | 3 | 2 | 0 | 3 | C-EN-006, C-XC-003, C-XC-007 |
| `src/database/models/Transfer.ts` | 3 | 1 | 0 | 3 | C-TX-009, C-TX-010, C-TX-013 |
| `src/hooks/useCalculator.ts::compute` | 3 | 1 | 2 | 1 | C-TX-051, C-TX-052, C-TX-068 |
| `src/navigation/AppNavigator.tsx::NavigatorContent` | 3 | 0 | 0 | 3 | C-UD-001, C-UD-002, C-UD-022 |
| `src/navigation/headerItems.tsx::headerButtonItem` | 3 | 0 | 0 | 3 | C-UI-003, C-UI-004, C-UI-011 |
| `src/screens/Accounts/AccountEditorScreen.tsx::handleDelete` | 3 | 1 | 0 | 3 | C-EN-075, C-UD-041, C-UI-030 |
| `src/screens/Accounts/AccountEditorScreen.tsx::handleSave` | 3 | 2 | 0 | 3 | C-UD-038, C-UD-039, C-UD-040 |
| `src/screens/Transactions/showRecurringModeDialog.ts::showRecurringModeDialog` | 3 | 0 | 0 | 3 | C-TX-072, C-TX-074, C-TX-093 |
| `src/services/accountLogic.ts::updateAccount` | 3 | 2 | 2 | 1 | C-EN-132, C-EN-133, C-RP-011 |
| `src/services/currencyService.ts::pickLatestEffectiveRate` | 3 | 0 | 3 | 0 | C-CU-057, C-CU-058, C-CU-059 |
| `src/services/currencyService.ts::resolveRateFromRecord` | 3 | 0 | 3 | 0 | C-CU-055, C-CU-056, C-CU-060 |
| `src/services/iapService.ts::handlePurchaseUpdate` | 3 | 0 | 3 | 0 | C-SB-075, C-SB-076, C-SB-077 |
| `src/services/importService.ts::scanColumnCompliance` | 3 | 2 | 3 | 0 | C-XF-066, C-XF-067, C-XF-068 |
| `src/services/localDbService.ts::countActiveAccounts` | 3 | 0 | 2 | 1 | C-SB-096, C-SB-097, C-SB-098 |
| `src/services/localDbService.ts::getAccounts` | 3 | 0 | 0 | 3 | C-EN-026, C-DA-005, C-DA-006 |
| `src/services/localDbService.ts::getAccountsForSelector` | 3 | 0 | 2 | 1 | C-EN-085, C-DA-007, C-DA-008 |
| `src/services/localDbService.ts::getCategoriesForSelector` | 3 | 0 | 2 | 1 | C-EN-086, C-DA-011, C-DA-012 |
| `src/services/runBackup.ts::runBackup` | 3 | 1 | 1 | 2 | C-DA-025, C-DA-026, C-DA-061 |
| `src/services/settingsLogic.ts::resetCurrencyFormat` | 3 | 0 | 2 | 1 | C-CU-030, C-ST-093, C-ST-094 |
| `src/services/settingsLogic.ts::setCurrencyFormat` | 3 | 0 | 2 | 1 | C-CU-031, C-ST-091, C-ST-092 |
| `src/services/transactionLogic.ts::normalizeTransactionAmount` | 3 | 3 | 3 | 0 | C-TX-108, C-TX-109, C-TX-110 |
| `src/services/transferLogic.ts::deleteTransfer` | 3 | 2 | 0 | 3 | C-TX-106, C-TX-137, C-TX-138 |
| `src/services/userService.ts::initializeNewUser` | 3 | 0 | 0 | 3 | C-BT-002, C-BT-039, C-BT-040 |
| `src/stores/PeriodDataStore.ts::evictCacheIfNeeded` | 3 | 0 | 0 | 3 | C-RP-077, C-RP-078, C-RP-079 |
| `src/stores/PeriodDataStore.ts::fetch` | 3 | 0 | 1 | 0 | C-RP-073, C-RP-075, C-RP-091 |
| `src/utils/auditStamp.ts::stampSoftDelete` | 3 | 3 | 1 | 2 | C-EN-005, C-EN-012, C-XC-004 |
| `src/utils/auditStamp.ts::stampUpdate` | 3 | 2 | 2 | 1 | C-EN-007, C-ST-015, C-XC-006 |
| `src/utils/currencyUtils.ts::getDefaultDecimals` | 3 | 0 | 2 | 1 | C-CU-028, C-CU-084, C-CU-085 |
| `src/components/DeleteButton.tsx` | 2 | 0 | 0 | 2 | C-UI-026, C-UI-027 |
| `src/components/IconPickerGrid.tsx` | 2 | 0 | 0 | 2 | C-EN-071, C-EN-072 |
| `src/components/InlineAmount.tsx` | 2 | 0 | 0 | 2 | C-SR-029, C-CU-104 |
| `src/components/list/GroupedListCard.tsx` | 2 | 0 | 0 | 2 | C-UI-055, C-UI-066 |
| `src/components/list/SelectionGridItem.tsx` | 2 | 0 | 2 | 0 | C-UI-043, C-UI-044 |
| `src/components/RecurringChip.tsx` | 2 | 0 | 0 | 2 | C-HM-057, C-SR-036 |
| `src/components/RecurringOptions.tsx::onDateChange` | 2 | 0 | 0 | 2 | C-RC-037, C-RC-038 |
| `src/constants/limits.ts::INTERVAL_MAX_DIGITS` | 2 | 0 | 2 | 0 | C-RC-002, C-RC-003 |
| `src/constants/limits.ts::RATE_INPUT_MAX_LENGTH` | 2 | 0 | 0 | 2 | C-CU-049, C-CU-074 |
| `src/contexts/AuthContext.tsx::signIn` | 2 | 0 | 0 | 1 | C-BT-022, C-BT-023 |
| `src/contexts/AuthContext.tsx` | 2 | 0 | 0 | 2 | C-BT-101, C-RP-089 |
| `src/contexts/CurrencyContext.tsx::convertAmount` | 2 | 0 | 2 | 0 | C-CU-064, C-CU-065 |
| `src/contexts/homeFilterPersistence.ts::parseSelectedAccountIds` | 2 | 0 | 2 | 0 | C-RP-058, C-RP-059 |
| `src/contexts/PreferenceContext.tsx::setBaseCurrencyId` | 2 | 0 | 0 | 2 | C-RP-087, C-CU-014 |
| `src/contexts/PreferenceContext.tsx::setLanguage` | 2 | 0 | 0 | 2 | C-RP-084, C-ST-090 |
| `src/contexts/PreferenceContext.tsx::setThemeId` | 2 | 0 | 0 | 1 | C-ST-086, C-ST-087 |
| `src/contexts/UndoContext.tsx::closeUndo` | 2 | 1 | 0 | 2 | C-UD-026, C-UD-028 |
| `src/contexts/UndoContext.tsx::executeUndo` | 2 | 1 | 0 | 1 | C-UD-025, C-UD-029 |
| `src/contexts/UndoContext.tsx::UndoProvider` | 2 | 1 | 0 | 2 | C-XC-012, C-XC-013 |
| `src/database/models/Account.ts` | 2 | 1 | 0 | 2 | C-EN-001, C-EN-002 |
| `src/database/models/Category.ts` | 2 | 1 | 0 | 2 | C-EN-009, C-EN-010 |
| `src/hooks/useCalculator.ts::setValue` | 2 | 0 | 2 | 0 | C-TX-061, C-TX-062 |
| `src/screens/Categories/CategoryEditorScreen.tsx::handleSave` | 2 | 2 | 0 | 2 | C-UD-042, C-UD-043 |
| `src/screens/Categories/CategoryEditorScreen.tsx::handleTypeChange` | 2 | 0 | 0 | 2 | C-EN-041, C-EN-042 |
| `src/screens/Home/components/AnimatedBalance.tsx` | 2 | 0 | 0 | 2 | C-HM-026, C-CU-105 |
| `src/screens/Home/components/FocusCard.tsx` | 2 | 0 | 0 | 2 | C-HM-027, C-HM-031 |
| `src/screens/Home/components/TxSectionCard.tsx` | 2 | 0 | 0 | 2 | C-HM-035, C-HM-040 |
| `src/screens/Paywall/paywallPricing.ts::displayDecimals` | 2 | 0 | 2 | 0 | C-SB-027, C-SB-028 |
| `src/screens/Paywall/PaywallScreen.tsx::loadProducts` | 2 | 0 | 0 | 2 | C-SB-020, C-SB-021 |
| `src/screens/Paywall/PaywallScreen.tsx::renderSegment` | 2 | 0 | 0 | 2 | C-SB-025, C-SB-041 |
| `src/screens/Search/SearchScreen.tsx::createStyles` | 2 | 0 | 0 | 2 | C-SR-014, C-SR-017 |
| `src/screens/Search/SearchScreen.tsx::handlePressItem` | 2 | 0 | 0 | 2 | C-SR-052, C-SR-053 |
| `src/screens/Transactions/TransferEditorScreen.tsx::handleFieldFocus` | 2 | 0 | 0 | 2 | C-TX-039, C-TX-040 |
| `src/services/accountLogic.ts::assertNameWithinLimit` | 2 | 0 | 2 | 0 | C-UI-106, C-UI-107 |
| `src/services/accountLogic.ts::reorderAccounts` | 2 | 0 | 2 | 0 | C-EN-134, C-EN-135 |
| `src/services/categoryLogic.ts::reorderCategories` | 2 | 0 | 2 | 0 | C-EN-115, C-EN-116 |
| `src/services/categoryLogic.ts::updateCategory` | 2 | 1 | 2 | 0 | C-EN-113, C-EN-114 |
| `src/services/currencyService.ts::getCurrencyPairs` | 2 | 0 | 1 | 1 | C-CU-076, C-CU-077 |
| `src/services/homeReportLogic.ts::pickChartColor` | 2 | 0 | 2 | 0 | C-RP-030, C-RP-031 |
| `src/services/iapService.ts` | 2 | 1 | 0 | 1 | C-SB-079, C-SB-080 |
| `src/services/importService.ts::isValidAmount` | 2 | 0 | 1 | 1 | C-XF-069, C-XF-070 |
| `src/services/localDbService.ts::escapeNoteSearchTerm` | 2 | 0 | 2 | 0 | C-SR-038, C-DA-014 |
| `src/services/localDbService.ts::getCategories` | 2 | 0 | 0 | 2 | C-DA-009, C-DA-010 |
| `src/services/localDbService.ts::searchTransfers` | 2 | 1 | 2 | 0 | C-SR-040, C-DA-016 |
| `src/services/mergeService.ts::buildSourceScheduleSoftDeletes` | 2 | 2 | 0 | 2 | C-EN-157, C-EN-158 |
| `src/services/recurringLogic.ts::revertScheduleCreation` | 2 | 2 | 2 | 0 | C-RC-064, C-RC-065 |
| `src/services/subscriptionGateLogic.ts::ACTION_IDS` | 2 | 0 | 2 | 0 | C-SB-082, C-SB-083 |
| `src/services/syncEngine.ts::adoptLegacySyncState` | 2 | 0 | 2 | 0 | C-DA-047, C-DA-048 |
| `src/services/syncEngine.ts::runDeltaBackup` | 2 | 1 | 0 | 2 | C-DA-056, C-DA-064 |
| `src/services/syncEngine.ts::runInitialBackup` | 2 | 0 | 1 | 1 | C-DA-042, C-DA-050 |
| `src/services/templateService.ts::generateTemplate` | 2 | 0 | 0 | 2 | C-XF-114, C-XF-117 |
| `src/services/templateService.ts::shareInstructions` | 2 | 0 | 0 | 2 | C-XF-131, C-XF-132 |
| `src/services/templateService.ts::shareTemplate` | 2 | 0 | 0 | 2 | C-XF-118, C-XF-119 |
| `src/services/transactionLogic.ts::deleteTransaction` | 2 | 2 | 0 | 2 | C-TX-086, C-TX-117 |
| `src/services/userService.ts::uploadAllPreferences` | 2 | 0 | 2 | 0 | C-ST-115, C-ST-116 |
| `src/utils/currencyUtils.ts::encodeStorageAmount` | 2 | 2 | 2 | 0 | C-TX-002, C-CU-107 |
| `src/utils/currencyUtils.ts::formatExchangeRate` | 2 | 0 | 2 | 0 | C-CU-034, C-CU-109 |
| `src/utils/currencyUtils.ts::getMinorUnits` | 2 | 0 | 2 | 0 | C-CU-082, C-CU-083 |
| `src/utils/currencyUtils.ts::toStorageAmount` | 2 | 1 | 0 | 2 | C-XF-091, C-XC-008 |
| `src/utils/iconSelection.ts::filterCategoryIcons` | 2 | 0 | 1 | 1 | C-EN-043, C-EN-044 |
| `src/components/AccountSelector.tsx` | 1 | 0 | 0 | 1 | C-EN-089 |
| `src/components/CategorySelector.tsx` | 1 | 0 | 0 | 1 | C-EN-088 |
| `src/components/EntitySelector.tsx` | 1 | 0 | 0 | 1 | C-EN-082 |
| `src/components/list/ListSection.tsx` | 1 | 0 | 0 | 1 | C-UI-056 |
| `src/components/RecurringOptions.tsx::renderFrequencyOption` | 1 | 0 | 0 | 1 | C-RC-030 |
| `src/constants/entitlements.ts::PlanTier` | 1 | 0 | 0 | 0 | C-SB-001 |
| `src/constants/limits.ts::MAX_FREE_ACCOUNTS` | 1 | 0 | 1 | 0 | C-SB-085 |
| `src/constants/limits.ts::MAX_FREE_CATEGORIES` | 1 | 0 | 1 | 0 | C-SB-086 |
| `src/constants/seedDefaults.ts` | 1 | 0 | 1 | 0 | C-EN-008 |
| `src/contexts/CurrencyContext.tsx::formatCurrency` | 1 | 0 | 0 | 1 | C-CU-089 |
| `src/contexts/HomeFilterContext.tsx::HomeFilterProvider` | 1 | 0 | 0 | 1 | C-XC-021 |
| `src/contexts/HomeFilterContext.tsx::persistField` | 1 | 0 | 0 | 1 | C-RP-061 |
| `src/contexts/homeFilterPersistence.ts::sanitizeGroupMode` | 1 | 0 | 1 | 0 | C-RP-057 |
| `src/contexts/homeFilterPersistence.ts::sanitizeTimeGranularity` | 1 | 0 | 1 | 0 | C-RP-056 |
| `src/contexts/PreferenceContext.tsx::setAnalyticsConsent` | 1 | 0 | 0 | 1 | C-ST-051 |
| `src/contexts/PreferenceContext.tsx::setWeekStart` | 1 | 0 | 0 | 1 | C-RP-085 |
| `src/contexts/PremiumContext.tsx::setMockTier` | 1 | 1 | 0 | 0 | C-SB-081 |
| `src/contexts/UndoContext.tsx::showUndo` | 1 | 0 | 0 | 1 | C-UD-024 |
| `src/database/models/CurrencyRate.ts` | 1 | 0 | 0 | 1 | C-CU-001 |
| `src/database/models/Transaction.ts` | 1 | 0 | 0 | 1 | C-TX-005 |
| `src/database/models/User.ts` | 1 | 0 | 0 | 1 | C-BT-001 |
| `src/hooks/useCalculator.ts::flush` | 1 | 1 | 0 | 1 | C-TX-065 |
| `src/hooks/useCalculator.ts::resetAll` | 1 | 0 | 1 | 0 | C-TX-060 |
| `src/hooks/useCalculator.ts::useCalculator` | 1 | 0 | 0 | 1 | C-UI-017 |
| `src/locales/i18n.ts::SUPPORTED_LANGUAGES` | 1 | 0 | 0 | 1 | C-ST-069 |
| `src/navigation/headerItems.tsx::headerBackItem` | 1 | 0 | 0 | 1 | C-UI-005 |
| `src/navigation/headerItems.tsx::headerCheckmarkItem` | 1 | 0 | 0 | 1 | C-UI-007 |
| `src/navigation/headerItems.tsx::headerCloseItem` | 1 | 0 | 0 | 1 | C-EN-074 |
| `src/screens/Accounts/AccountListScreen.tsx::handleAddPress` | 1 | 0 | 0 | 1 | C-EN-030 |
| `src/screens/Accounts/AccountListScreen.tsx::handleReorder` | 1 | 0 | 0 | 1 | C-EN-033 |
| `src/screens/Categories/CategoryEditorScreen.tsx::handleDelete` | 1 | 1 | 0 | 1 | C-UD-044 |
| `src/screens/Categories/CategoryListScreen.tsx::handleAddPress` | 1 | 0 | 0 | 1 | C-EN-019 |
| `src/screens/Categories/CategoryListScreen.tsx::handleReorder` | 1 | 0 | 0 | 1 | C-EN-022 |
| `src/screens/Home/components/TxDateBadge.tsx` | 1 | 0 | 0 | 1 | C-HM-043 |
| `src/screens/Home/HomeScreen.tsx::loadMorePeriods` | 1 | 0 | 0 | 1 | C-HM-077 |
| `src/screens/Home/PeriodPage.tsx::createStyles` | 1 | 0 | 0 | 1 | C-HM-041 |
| `src/screens/Home/PeriodPage.tsx::handleSelectFocus` | 1 | 0 | 0 | 1 | C-HM-032 |
| `src/screens/Home/PeriodPage.tsx::periodTitle` | 1 | 0 | 0 | 1 | C-HM-005 |
| `src/screens/Home/PeriodPage.tsx::toggleSection` | 1 | 0 | 0 | 1 | C-HM-036 |
| `src/screens/Paywall/paywallPricing.ts::currencyFractionDigits` | 1 | 0 | 1 | 0 | C-SB-029 |
| `src/screens/Paywall/paywallPricing.ts::perMonthEquivalent` | 1 | 0 | 1 | 0 | C-SB-026 |
| `src/screens/Paywall/PaywallScreen.tsx::handlePurchase` | 1 | 0 | 0 | 1 | C-SB-042 |
| `src/screens/Settings/CurrencyRateEditorScreen.tsx::handleCancel` | 1 | 0 | 0 | 1 | C-CU-053 |
| `src/screens/Settings/CurrencyRateEditorScreen.tsx::sanitizeDecimalInput` | 1 | 0 | 0 | 1 | C-CU-048 |
| `src/screens/Transactions/TransactionEditorScreen.tsx::getTitle` | 1 | 0 | 0 | 1 | C-TX-015 |
| `src/screens/Transactions/TransactionEditorScreen.tsx::handleAmountFocus` | 1 | 0 | 0 | 1 | C-TX-026 |
| `src/screens/Transactions/TransactionEditorScreen.tsx::handleNoteFocus` | 1 | 0 | 0 | 1 | C-TX-027 |
| `src/screens/Transactions/TransferEditorScreen.tsx::getAmountColor` | 1 | 0 | 0 | 1 | C-TX-043 |
| `src/screens/Transactions/TransferEditorScreen.tsx::handleCalculatorPress` | 1 | 0 | 0 | 1 | C-TX-046 |
| `src/services/accountDeletionState.ts::isAccountDeletionInFlight` | 1 | 1 | 1 | 0 | C-BT-065 |
| `src/services/accountLogic.ts::restoreAccountCascade` | 1 | 1 | 0 | 1 | C-EN-144 |
| `src/services/categoryLogic.ts::restoreCategoryCascade` | 1 | 1 | 0 | 1 | C-EN-123 |
| `src/services/currencyService.ts::createCurrencyRate` | 1 | 1 | 1 | 0 | C-CU-073 |
| `src/services/currencyService.ts::ensureRateForNewAccount` | 1 | 1 | 0 | 1 | C-EN-130 |
| `src/services/currencyService.ts::ensureRatesForNewBase` | 1 | 1 | 1 | 0 | C-ST-088 |
| `src/services/currencyService.ts::formatRatePairLabel` | 1 | 0 | 1 | 0 | C-CU-032 |
| `src/services/currencyService.ts::inverseRate` | 1 | 0 | 0 | 1 | C-CU-047 |
| `src/services/currencyService.ts::PLACEHOLDER_RATE_DATE` | 1 | 1 | 1 | 0 | C-CU-067 |
| `src/services/currencyService.ts::ratePairToStoredRate` | 1 | 1 | 1 | 0 | C-CU-075 |
| `src/services/entitlementService.ts::subscribeEntitlement` | 1 | 0 | 0 | 1 | C-SB-055 |
| `src/services/entitlementService.ts::verifyTransaction` | 1 | 1 | 0 | 1 | C-SB-074 |
| `src/services/exportService.ts::toExportDatetime` | 1 | 1 | 0 | 1 | C-XF-105 |
| `src/services/exportService.ts::trimZeros` | 1 | 0 | 0 | 1 | C-XF-107 |
| `src/services/iapService.ts::restorePurchases` | 1 | 0 | 0 | 1 | C-SB-078 |
| `src/services/importService.ts::suggestColumnMapping` | 1 | 0 | 1 | 0 | C-XF-072 |
| `src/services/importService.ts::validateAllColumns` | 1 | 0 | 0 | 1 | C-XF-065 |
| `src/services/importService.ts` | 1 | 0 | 0 | 1 | C-SB-095 |
| `src/services/localDbService.ts::resetAllData` | 1 | 0 | 0 | 1 | C-DA-022 |
| `src/services/quotaService.ts::checkQuota` | 1 | 0 | 0 | 1 | C-SB-105 |
| `src/services/quotaService.ts::resetIfNewDay` | 1 | 0 | 0 | 1 | C-SB-104 |
| `src/services/quotaService.ts` | 1 | 0 | 0 | 0 | C-SB-103 |
| `src/services/recurringLogic.ts::Frequency` | 1 | 0 | 0 | 1 | C-RC-001 |
| `src/services/recurringLogic.ts::generateMissingInstances` | 1 | 1 | 1 | 0 | C-RC-096 |
| `src/services/recurringLogic.ts::getScheduleInstancesFrom` | 1 | 1 | 0 | 1 | C-RC-062 |
| `src/services/recurringLogic.ts::previousPeriod` | 1 | 1 | 0 | 1 | C-RC-051 |
| `src/services/recurringLogic.ts` | 1 | 0 | 0 | 1 | C-TX-006 |
| `src/services/syncEngine.ts::getLocalChanges` | 1 | 0 | 0 | 1 | C-DA-055 |
| `src/services/syncEngine.ts::markSynced` | 1 | 1 | 0 | 1 | C-XC-019 |
| `src/services/templateService.ts::generateTransactionTemplate` | 1 | 0 | 0 | 1 | C-XF-115 |
| `src/services/templateService.ts::generateTransferTemplate` | 1 | 0 | 0 | 1 | C-XF-116 |
| `src/services/transactionLogic.ts` | 1 | 1 | 0 | 1 | C-DA-065 |
| `src/stores/PeriodDataStore.ts::clearCache` | 1 | 0 | 0 | 1 | C-RP-090 |
| `src/stores/PeriodDataStore.ts::getData` | 1 | 0 | 0 | 1 | C-RP-074 |
| `src/stores/PeriodDataStore.ts::setPriority` | 1 | 0 | 0 | 1 | C-RP-076 |
| `src/utils/amountValidation.ts::parseAmount` | 1 | 0 | 0 | 1 | C-XF-071 |
| `src/utils/amountValidation.ts::survivesStorageMax` | 1 | 0 | 1 | 0 | C-UI-109 |
| `src/utils/auditStamp.ts::stampRestore` | 1 | 1 | 1 | 0 | C-XC-005 |
| `src/utils/calendarGrid.ts::calMonthGrid` | 1 | 0 | 1 | 0 | C-UI-113 |
| `src/utils/calendarGrid.ts::getWeekdayLabels` | 1 | 0 | 1 | 0 | C-UI-110 |
| `src/utils/calendarGrid.ts::getWeekStart` | 1 | 0 | 1 | 0 | C-UI-112 |
| `src/utils/calendarGrid.ts::WEEK_START_PREFERENCE_VALUES` | 1 | 0 | 0 | 1 | C-ST-006 |
| `src/utils/currencyUtils.ts::decodeStorageAmount` | 1 | 1 | 1 | 0 | C-CU-106 |
| `src/utils/currencyUtils.ts::fromStorageAmount` | 1 | 1 | 1 | 0 | C-CU-108 |
| `src/utils/currencyUtils.ts::MAX_STORAGE_AMOUNT` | 1 | 0 | 1 | 0 | C-XC-009 |
| `src/utils/currencyUtils.ts::maxDisplayAmount` | 1 | 0 | 1 | 0 | C-XC-010 |
| `src/utils/formatters.ts::formatDate` | 1 | 0 | 0 | 1 | C-UI-097 |
| `src/utils/formatters.ts::formatTime` | 1 | 0 | 0 | 1 | C-UI-100 |
| `src/utils/iconCatalog.ts::getIconsByTag` | 1 | 0 | 0 | 1 | C-EN-061 |
| `src/utils/iconSelection.ts::getDefaultId` | 1 | 0 | 1 | 0 | C-EN-073 |
| `src/utils/networkState.ts::isOffline` | 1 | 0 | 0 | 0 | C-DA-063 |
| `src/utils/timeHelper.ts::getCurrentTimestamp` | 1 | 0 | 0 | 1 | C-XC-011 |
| `src/utils/timeHelper.ts::safeToZonedTime` | 1 | 0 | 0 | 1 | C-XC-023 |
<!-- /GENERATED:impl-anchor-index -->

---

## 統計

- 涵蓋 154 個 impl 檔、329 個相異錨、1481 條檢驗點
- 涉及最多檢驗點的三個錨：`ImportScreen.tsx` 50 條、`AppNavigator.tsx` 33 條、`PreferenceScreen.tsx` 32 條
