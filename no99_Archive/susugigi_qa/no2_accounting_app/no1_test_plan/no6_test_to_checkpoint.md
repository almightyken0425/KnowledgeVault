# 測試檔反向索引

## 文件定位

- 回答「這支 test 壞了影響哪些檢驗點」
- 自各分冊的自動化欄機械生成，不手抄
- 與 `no4_impl_anchor_index.md` 互為正反：那份問改了檔要跑什麼，這份問測試紅燈影響什麼

---

## 怎麼用

某支 jest 轉紅時，在下表找該檔那一列，取其檢驗點清單。

那些檢驗點原本靠這支測試把關、已退出手動場次。測試壞掉等於那批回歸保護消失，修好前該批要退回手動驗。

P0 欄標示該支測試守著幾條資金流或資料完整性斷言，優先修。

---

## 反向表

<!-- GENERATED:test-to-checkpoint -->
| 測試檔 | 守住條數 | 其中 P0 | 檢驗點 |
| --- | --- | --- | --- |
| `src/services/currencyService.test.ts` | 21 | 9 | C-CU-032, C-CU-055, C-CU-056, C-CU-057, C-CU-058, C-CU-059, C-CU-060, C-CU-061, C-CU-062, C-CU-063, C-CU-066, C-CU-067, C-CU-068, C-CU-069, C-CU-070, C-CU-071, C-CU-073, C-CU-075, C-CU-077, C-ST-088, C-ST-089 |
| `src/services/syncEngine.test.ts` | 19 | 2 | C-SB-106, C-SB-108, C-DA-027, C-DA-028, C-DA-037, C-DA-038, C-DA-041, C-DA-042, C-DA-043, C-DA-044, C-DA-045, C-DA-046, C-DA-047, C-DA-048, C-DA-052, C-DA-059, C-DA-060, C-DA-061, C-DA-062 |
| `src/components/DonutChart.test.ts` | 17 | 0 | C-HM-006, C-HM-008, C-HM-009, C-HM-010, C-HM-011, C-HM-012, C-HM-013, C-HM-016, C-HM-017, C-HM-018, C-HM-019, C-HM-020, C-HM-021, C-HM-022, C-HM-023, C-HM-024, C-HM-025 |
| `src/services/categoryLogic.test.ts` | 17 | 4 | C-EN-107, C-EN-108, C-EN-109, C-EN-110, C-EN-111, C-EN-112, C-EN-113, C-EN-114, C-EN-115, C-EN-116, C-EN-117, C-EN-118, C-EN-119, C-EN-120, C-EN-121, C-EN-122, C-UI-106 |
| `src/constants/syncFields.test.ts` | 16 | 1 | C-ST-012, C-ST-098, C-ST-099, C-ST-100, C-ST-101, C-ST-102, C-ST-103, C-ST-104, C-ST-105, C-ST-106, C-ST-107, C-ST-108, C-ST-109, C-ST-110, C-ST-115, C-ST-116 |
| `src/services/accountLogic.test.ts` | 16 | 2 | C-EN-124, C-EN-125, C-EN-126, C-EN-127, C-EN-128, C-EN-129, C-EN-131, C-EN-132, C-EN-133, C-EN-134, C-EN-135, C-EN-139, C-EN-142, C-EN-143, C-UI-106, C-UI-107 |
| `src/hooks/useCalculator.test.tsx` | 14 | 1 | C-TX-051, C-TX-052, C-TX-053, C-TX-054, C-TX-055, C-TX-056, C-TX-057, C-TX-058, C-TX-059, C-TX-060, C-TX-061, C-TX-062, C-TX-063, C-TX-064 |
| `src/services/localDbService.test.ts` | 14 | 2 | C-SB-097, C-SB-098, C-EN-085, C-EN-086, C-SR-037, C-SR-038, C-SR-039, C-SR-040, C-DA-002, C-DA-007, C-DA-011, C-DA-014, C-DA-015, C-DA-016 |
| `src/contexts/reconcileAccountSelection.test.ts` | 11 | 0 | C-RP-037, C-RP-038, C-RP-039, C-RP-040, C-RP-041, C-RP-042, C-RP-043, C-RP-044, C-RP-045, C-RP-046, C-RP-047 |
| `src/services/subscriptionGateLogic.test.ts` | 11 | 5 | C-SB-082, C-SB-083, C-SB-087, C-SB-088, C-SB-089, C-SB-090, C-SB-091, C-SB-092, C-SB-093, C-SB-094, C-SB-100 |
| `src/services/transferDisplayLogic.test.ts` | 11 | 8 | C-RP-021, C-RP-022, C-RP-023, C-RP-024, C-RP-025, C-RP-026, C-RP-027, C-CU-078, C-CU-079, C-CU-080, C-CU-081 |
| `src/contexts/AuthContext.deleteUserAccount.test.tsx` | 10 | 8 | C-BT-064, C-BT-065, C-BT-068, C-BT-069, C-BT-075, C-BT-076, C-BT-078, C-BT-080, C-BT-081, C-BT-082 |
| `src/services/recurringLogic.revertGuards.test.ts` | 10 | 9 | C-RC-064, C-RC-065, C-RC-066, C-RC-067, C-RC-068, C-RC-069, C-RC-070, C-RC-071, C-RC-072, C-RC-073 |
| `src/stores/PeriodDataStore.test.ts` | 10 | 2 | C-RP-009, C-RP-010, C-RP-012, C-RP-068, C-RP-069, C-RP-070, C-RP-071, C-RP-072, C-RP-073, C-RP-080 |
| `src/services/homeReportLogic.test.ts` | 9 | 0 | C-RP-028, C-RP-029, C-RP-030, C-RP-031, C-RP-032, C-RP-033, C-RP-034, C-RP-035, C-RP-036 |
| `src/services/transferLogic.test.ts` | 9 | 9 | C-TX-125, C-TX-126, C-TX-127, C-TX-128, C-TX-131, C-TX-132, C-TX-133, C-TX-134, C-TX-135 |
| `src/components/RecurringOptions.test.tsx` | 8 | 0 | C-TX-035, C-TX-036, C-TX-037, C-RC-020, C-RC-022, C-RC-023, C-RC-024, C-RC-036 |
| `src/services/mergeService.revertSelfTransfer.test.ts` | 8 | 7 | C-EN-152, C-EN-160, C-EN-161, C-EN-162, C-EN-163, C-EN-164, C-EN-165, C-EN-166 |
| `src/utils/formatters.formatCurrencyLocale.test.ts` | 8 | 0 | C-CU-090, C-CU-091, C-CU-092, C-CU-093, C-CU-094, C-CU-101, C-CU-102, C-CU-103 |
| `src/contexts/AuthContext.deletionRecovery.test.tsx` | 7 | 6 | C-BT-093, C-BT-094, C-BT-095, C-BT-096, C-BT-098, C-BT-099, C-BT-100 |
| `src/screens/Paywall/paywallPricing.test.ts` | 7 | 0 | C-SB-019, C-SB-026, C-SB-027, C-SB-028, C-SB-029, C-SB-085, C-SB-086 |
| `src/services/importService.rowSkip.test.ts` | 7 | 1 | C-XF-059, C-XF-076, C-XF-077, C-XF-082, C-XF-095, C-XF-096, C-XF-097 |
| `src/services/recurringLogic.test.ts` | 7 | 6 | C-RC-076, C-RC-084, C-RC-085, C-RC-086, C-RC-087, C-RC-093, C-RC-096 |
| `src/services/validationGuards.test.ts` | 7 | 7 | C-TX-111, C-TX-112, C-TX-114, C-TX-118, C-TX-119, C-TX-121, C-TX-122 |
| `src/utils/timeHelper.deriveNavigableOffsets.test.ts` | 7 | 1 | C-HM-072, C-HM-073, C-HM-074, C-HM-075, C-RP-002, C-RP-003, C-XC-022 |
| `src/hooks/useFrozenSelectionOrder.test.tsx` | 6 | 0 | C-CU-006, C-CU-007, C-CU-008, C-ST-065, C-ST-067, C-ST-076 |
| `src/utils/calendarGrid.test.ts` | 6 | 0 | C-RP-006, C-RP-007, C-UI-110, C-UI-111, C-UI-112, C-UI-113 |
| `src/utils/pickerAutoSelect.test.ts` | 6 | 0 | C-EN-087, C-EN-090, C-EN-091, C-EN-092, C-EN-093, C-EN-094 |
| `src/contexts/AuthContext.tokenRefreshGuard.test.tsx` | 5 | 0 | C-BT-047, C-BT-048, C-BT-049, C-BT-050, C-BT-051 |
| `src/services/accountDeletionService.test.ts` | 5 | 0 | C-BT-072, C-BT-077, C-BT-079, C-BT-085, C-BT-086 |
| `src/services/importService.columnCandidates.test.ts` | 5 | 2 | C-XF-066, C-XF-067, C-XF-068, C-XF-070, C-XF-072 |
| `src/services/localDbService.destroyUserData.test.ts` | 5 | 3 | C-BT-087, C-BT-088, C-BT-089, C-BT-091, C-BT-092 |
| `src/services/mergeService.deletedFilter.test.ts` | 5 | 2 | C-EN-149, C-EN-150, C-EN-153, C-EN-154, C-EN-155 |
| `src/contexts/homeFilterPersistence.test.ts` | 4 | 0 | C-RP-056, C-RP-057, C-RP-058, C-RP-059 |
| `src/services/auditStamp.guard.test.ts` | 4 | 4 | C-EN-007, C-XC-004, C-XC-005, C-XC-006 |
| `src/services/exportService.test.ts` | 4 | 2 | C-XF-100, C-XF-101, C-XF-103, C-XF-104 |
| `src/services/importService.guard.test.ts` | 4 | 3 | C-XF-078, C-XF-080, C-XF-081, C-XF-089 |
| `src/services/mergeService.test.ts` | 4 | 4 | C-EN-145, C-EN-146, C-EN-147, C-EN-148 |
| `src/services/recurringLogic.convertToSchedule.test.ts` | 4 | 4 | C-RC-045, C-RC-046, C-RC-047, C-RC-048 |
| `src/services/recurringLogic.restoreScheduleInstances.test.ts` | 4 | 4 | C-RC-058, C-RC-059, C-RC-060, C-RC-063 |
| `src/services/settingsLogic.test.ts` | 4 | 0 | C-ST-091, C-ST-092, C-ST-093, C-ST-094 |
| `src/services/transactionLogic.test.ts` | 4 | 4 | C-TX-002, C-TX-108, C-TX-109, C-TX-110 |
| `src/utils/formatters.splitCurrencyParts.test.ts` | 4 | 0 | C-CU-097, C-CU-098, C-CU-099, C-CU-100 |
| `src/components/list/ListEmptyState.test.tsx` | 3 | 0 | C-UI-059, C-UI-062, C-UI-063 |
| `src/constants/limits.test.ts` | 3 | 0 | C-SB-007, C-SB-008, C-SB-009 |
| `src/contexts/CurrencyContext.convertAmount.test.tsx` | 3 | 0 | C-CU-054, C-CU-064, C-CU-065 |
| `src/services/iapService.finishTransaction.guard.test.ts` | 3 | 0 | C-SB-075, C-SB-076, C-SB-077 |
| `src/services/importService.parseDate.test.ts` | 3 | 3 | C-XF-073, C-XF-074, C-XF-113 |
| `src/services/userService.test.ts` | 3 | 0 | C-BT-041, C-BT-042, C-BT-043 |
| `src/utils/currencyUtils.defaultDecimals.test.ts` | 3 | 0 | C-CU-083, C-CU-084, C-CU-085 |
| `src/utils/currencyUtils.storageMax.test.ts` | 3 | 0 | C-UI-109, C-XC-009, C-XC-010 |
| `src/components/list/ListItem.test.tsx` | 2 | 0 | C-UI-033, C-UI-035 |
| `src/components/list/SelectionGridItem.test.tsx` | 2 | 0 | C-UI-043, C-UI-044 |
| `src/constants/limits.intervalSafety.test.ts` | 2 | 0 | C-RC-002, C-RC-003 |
| `src/constants/seedDefaults.test.ts` | 2 | 0 | C-EN-008, C-EN-045 |
| `src/services/cleanupInvalidIconIds.test.ts` | 2 | 0 | C-BT-117, C-BT-120 |
| `src/services/transactionLogic.updateSchedule.test.ts` | 2 | 2 | C-TX-115, C-TX-116 |
| `src/utils/currencyUtils.formatRate.test.ts` | 2 | 0 | C-CU-034, C-CU-109 |
| `src/utils/currencyUtils.kmode.test.ts` | 2 | 2 | C-CU-106, C-CU-107 |
| `src/utils/currencyUtils.minorUnits.test.ts` | 2 | 1 | C-CU-082, C-CU-108 |
| `src/utils/formatters.insertMinusAfterSymbol.test.ts` | 2 | 0 | C-CU-095, C-CU-096 |
| `src/utils/iconSelection.test.ts` | 2 | 0 | C-EN-043, C-EN-073 |
| `src/utils/timeHelper.getPeriodDates.weekStart.test.ts` | 2 | 0 | C-RP-001, C-RP-005 |
| `src/components/BottomSearchBar.test.tsx` | 1 | 0 | C-UI-074 |
| `src/components/list/ListEmptyTransition.test.tsx` | 1 | 0 | C-UI-067 |
| `src/components/list/ReorderableListItem.test.tsx` | 1 | 0 | C-UI-052 |
| `src/components/list/SelectionListItem.test.tsx` | 1 | 0 | C-UI-040 |
| `src/contexts/AuthContext.backupNonBlocking.test.tsx` | 1 | 0 | C-BT-113 |
| `src/contexts/HomeFilterContext.selectionPersist.test.tsx` | 1 | 0 | C-RP-066 |
<!-- /GENERATED:test-to-checkpoint -->

---

## 統計

- 75 支測試檔守住 456 條檢驗點
- 守最多的三支：`currencyService.test.ts` 21 條、`syncEngine.test.ts` 19 條、`localDbService.test.ts` 18 條
