# 前一版 ID 對照表

## 文件定位

- 前一版 1315 條的 `C-` ID 對照到本版 1481 條的新 ID
- 用途是回溯外部文件的舊 ID 引用，不是長期維護對象
- 重建當下一次性產出，後續不再更新

---

## 三代編號

| 代 | 前綴 | 狀態 |
| --- | --- | --- |
| 第一代 | `R-` | 由 git 歷史保存。impl 測試碼中仍有 37 處引用，指向該版 |
| 第二代 | `C-` 舊域碼 | 由 git 歷史保存。本表左欄 |
| 第三代 | `C-` 新域碼 | 本版。本表右欄 |

---

## 舊冊到新冊的整體去向

| 前一版分冊 | 本版去向 |
| --- | --- |
| `no1_data_models.md` | 依欄位所屬實體分散至 BT / EN / TX / RC / CU / ST / XC 各冊 |
| `no2_shared_policies.md` | UI 冊為主，精靈六條下放 XF、搜尋兩條下放 SR、復原整段下放 UD |
| `no3_auth_premium_quota.md` | C-AU 進 BT 冊、C-PM 與 C-QT 進 SB 冊 |
| `no4_accounts_categories.md` | EN 冊 |
| `no5_transactions_transfers.md` | TX 冊，復原邏輯段下放 UD 冊 |
| `no6_home_report.md` | 畫面段進 HM 冊、邏輯段進 RP 冊 |
| `no7_recurring.md` | RC 冊 |
| `no8_currency_rates.md` | CU 冊 |
| `no9_settings_deletion.md` | C-ST 進 ST 冊、C-DA 進 BT 冊 |
| `no10_data_import_export.md` | XF 冊 |
| `no11_backup_search_db.md` | C-SR 進 SR 冊、C-BK 與 C-DB 進 DA 冊 |
| `no12_cross_cutting.md` | C-BS 進 BT 冊、C-OF 進 DA 冊、C-FM 進 CU 冊、C-KR 與 C-TZ 進 XC 冊、C-XD 段整段不重列 |

---

## 逐條對照

斷言在重建時大量改寫過——統一用語、拆分複合斷言、合併重複條目。故只有斷言語意未變的條目能機械對上。

未對上者不代表被刪除，多數是斷言改寫或拆併。查法是依上表找到新冊，在該冊同一功能段落找語意對應的條目。

### 斷言相符（625 條）

| 前一版 | 本版 |
| --- | --- |
| C-IE-001 | C-XF-001 |
| C-IE-002 | C-XF-002 |
| C-IE-003 | C-XF-003 |
| C-IE-004 | C-XF-004 |
| C-IE-008 | C-XF-008 |
| C-IE-009 | C-XF-010 |
| C-IE-010 | C-XF-011 |
| C-IE-011 | C-XF-012 |
| C-IE-012 | C-XF-014 |
| C-IE-014 | C-XF-016 |
| C-IE-015 | C-XF-017 |
| C-IE-016 | C-XF-018 |
| C-IE-017 | C-XF-019 |
| C-IE-018 | C-XF-020 |
| C-IE-019 | C-XF-022 |
| C-IE-020 | C-XF-023 |
| C-IE-021 | C-XF-024 |
| C-IE-022 | C-XF-025 |
| C-IE-023 | C-XF-026 |
| C-IE-024 | C-XF-027 |
| C-IE-025 | C-XF-037 |
| C-IE-026 | C-XF-028 |
| C-IE-027 | C-XF-030 |
| C-IE-032 | C-XF-036 |
| C-IE-033 | C-XF-038 |
| C-IE-037 | C-XF-043 |
| C-IE-038 | C-XF-065 |
| C-IE-039 | C-XF-066 |
| C-IE-041 | C-XF-068 |
| C-IE-043 | C-XF-044 |
| C-IE-044 | C-XF-045 |
| C-IE-045 | C-XF-046 |
| C-IE-046 | C-XF-047 |
| C-IE-047 | C-XF-049 |
| C-IE-048 | C-XF-050 |
| C-IE-049 | C-XF-051 |
| C-IE-050 | C-XF-053 |
| C-IE-052 | C-XF-079 |
| C-IE-053 | C-XF-080 |
| C-IE-054 | C-XF-081 |
| C-IE-055 | C-XF-082 |
| C-IE-056 | C-XF-054 |
| C-IE-057 | C-XF-055 |
| C-IE-058 | C-XF-056 |
| C-IE-059 | C-XF-058 |
| C-IE-062 | C-XF-062 |
| C-IE-064 | C-XF-064 |
| C-IE-066 | C-XF-084 |
| C-IE-067 | C-XF-088 |
| C-IE-069 | C-XF-074 |
| C-IE-070 | C-XF-089 |
| C-IE-074 | C-XF-095 |
| C-IE-075 | C-XF-096 |
| C-IE-077 | C-XF-102 |
| C-IE-078 | C-XF-108 |
| C-IE-079 | C-XF-112 |
| C-IE-082 | C-XF-106 |
| C-IE-084 | C-XF-109 |
| C-IE-085 | C-XF-110 |
| C-IE-087 | C-XF-111 |
| C-IE-088 | C-XF-114 |
| C-IE-089 | C-XF-117 |
| C-IE-090 | C-XF-118 |
| C-IE-091 | C-XF-119 |
| C-IE-092 | C-XF-120 |
| C-IE-095 | C-XF-126 |
| C-IE-096 | C-XF-128 |
| C-IE-097 | C-XF-130 |
| C-IE-098 | C-XF-131 |
| C-IE-099 | C-XF-132 |
| C-IE-105 | C-XF-071 |
| C-SR-001 | C-SR-001 |
| C-SR-003 | C-SR-009 |
| C-SR-004 | C-SR-010 |
| C-SR-005 | C-SR-011 |
| C-SR-006 | C-SR-013 |
| C-SR-007 | C-SR-014 |
| C-SR-008 | C-SR-041 |
| C-SR-009 | C-SR-042 |
| C-SR-010 | C-SR-045 |
| C-SR-012 | C-SR-047 |
| C-SR-013 | C-SR-048 |
| C-SR-014 | C-SR-017 |
| C-SR-015 | C-SR-018 |
| C-SR-016 | C-SR-019 |
| C-SR-018 | C-SR-022 |
| C-SR-019 | C-SR-024 |
| C-SR-020 | C-SR-025 |
| C-SR-023 | C-SR-030 |
| C-SR-024 | C-SR-031 |
| C-SR-025 | C-SR-032 |
| C-SR-026 | C-SR-033 |
| C-SR-027 | C-SR-034 |
| C-SR-028 | C-SR-035 |
| C-SR-029 | C-SR-049 |
| C-SR-030 | C-SR-050 |
| C-SR-032 | C-SR-052 |
| C-SR-033 | C-SR-053 |
| C-DB-004 | C-DA-003 |
| C-DB-006 | C-DA-005 |
| C-DB-008 | C-DA-007 |
| C-DB-009 | C-DA-009 |
| C-DB-011 | C-DA-011 |
| C-DB-015 | C-DA-020 |
| C-BK-003 | C-DA-026 |
| C-BK-004 | C-DA-023 |
| C-BK-005 | C-DA-024 |
| C-BK-009 | C-DA-032 |
| C-BK-013 | C-DA-036 |
| C-BK-015 | C-DA-039 |
| C-BK-022 | C-DA-051 |
| C-BK-023 | C-DA-052 |
| C-BK-025 | C-DA-055 |
| C-BK-028 | C-DA-058 |
| C-BS-001 | C-BT-101 |
| C-BS-002 | C-BT-102 |
| C-BS-003 | C-BT-103 |
| C-BS-004 | C-BT-112 |
| C-BS-005 | C-BT-113 |
| C-BS-006 | C-BT-111 |
| C-BS-007 | C-BT-109 |
| C-BS-009 | C-BT-114 |
| C-BS-010 | C-BT-115 |
| C-BS-012 | C-BT-118 |
| C-BS-013 | C-BT-119 |
| C-BS-014 | C-BT-120 |
| C-BS-015 | C-BT-121 |
| C-BS-016 | C-BT-122 |
| C-BS-017 | C-BT-104 |
| C-BS-018 | C-BT-105 |
| C-BS-019 | C-BT-106 |
| C-BS-020 | C-BT-107 |
| C-BS-021 | C-BT-108 |
| C-BS-022 | C-BT-110 |
| C-OF-004 | C-DA-064 |
| C-KR-001 | C-XC-012 |
| C-KR-002 | C-XC-013 |
| C-KR-007 | C-XC-019 |
| C-FM-006 | C-CU-093 |
| C-FM-009 | C-CU-094 |
| C-FM-010 | C-CU-095 |
| C-FM-011 | C-CU-096 |
| C-FM-012 | C-CU-097 |
| C-FM-013 | C-CU-098 |
| C-FM-014 | C-CU-099 |
| C-FM-015 | C-CU-100 |
| C-FM-017 | C-CU-102 |
| C-FM-018 | C-CU-103 |
| C-FM-020 | C-CU-104 |
| C-FM-021 | C-CU-105 |
| C-FM-023 | C-CU-107 |
| C-DM-001 | C-ST-001 |
| C-DM-002 | C-ST-002 |
| C-DM-034 | C-ST-013 |
| C-DM-039 | C-ST-102 |
| C-DM-044 | C-ST-110 |
| C-DM-046 | C-ST-014 |
| C-DM-050 | C-EN-002 |
| C-DM-053 | C-EN-008 |
| C-DM-063 | C-EN-010 |
| C-DM-067 | C-TX-001 |
| C-DM-068 | C-TX-002 |
| C-DM-069 | C-TX-003 |
| C-DM-072 | C-TX-006 |
| C-DM-073 | C-TX-007 |
| C-DM-074 | C-TX-008 |
| C-DM-076 | C-TX-010 |
| C-DM-077 | C-TX-011 |
| C-DM-080 | C-CU-001 |
| C-DM-088 | C-RC-002 |
| C-DM-090 | C-RC-004 |
| C-DM-091 | C-RC-005 |
| C-DM-092 | C-RC-006 |
| C-DM-095 | C-RC-009 |
| C-DM-097 | C-BT-001 |
| C-DM-099 | C-BT-003 |
| C-DM-100 | C-BT-004 |
| C-DM-110 | C-SB-005 |
| C-DM-113 | C-SB-008 |
| C-DM-114 | C-SB-009 |
| C-DM-116 | C-XC-010 |
| C-HD-005 | C-UI-006 |
| C-IN-008 | C-UI-104 |
| C-DL-008 | C-UI-032 |
| C-LS-023 | C-UI-062 |
| C-LS-030 | C-UI-056 |
| C-SC-014 | C-UI-079 |
| C-UD-007 | C-UD-012 |
| C-UD-012 | C-UD-005 |
| C-DP-007 | C-UI-086 |
| C-DP-008 | C-UI-087 |
| C-DP-009 | C-UI-088 |
| C-DP-011 | C-UI-091 |
| C-DP-014 | C-UI-095 |
| C-DP-018 | C-UI-111 |
| C-AU-001 | C-BT-005 |
| C-AU-002 | C-BT-006 |
| C-AU-003 | C-BT-007 |
| C-AU-004 | C-BT-008 |
| C-AU-005 | C-BT-009 |
| C-AU-008 | C-BT-012 |
| C-AU-009 | C-BT-013 |
| C-AU-010 | C-BT-014 |
| C-AU-011 | C-BT-015 |
| C-AU-012 | C-BT-016 |
| C-AU-013 | C-BT-017 |
| C-AU-014 | C-BT-018 |
| C-AU-015 | C-BT-019 |
| C-AU-016 | C-BT-020 |
| C-AU-017 | C-BT-021 |
| C-AU-018 | C-BT-022 |
| C-AU-019 | C-BT-023 |
| C-AU-023 | C-BT-027 |
| C-AU-024 | C-BT-028 |
| C-AU-025 | C-BT-029 |
| C-AU-027 | C-BT-031 |
| C-AU-028 | C-BT-032 |
| C-AU-029 | C-BT-033 |
| C-AU-030 | C-BT-034 |
| C-AU-031 | C-BT-035 |
| C-AU-032 | C-BT-036 |
| C-AU-033 | C-BT-037 |
| C-AU-034 | C-BT-038 |
| C-AU-036 | C-BT-040 |
| C-AU-042 | C-BT-046 |
| C-AU-043 | C-BT-047 |
| C-AU-044 | C-BT-048 |
| C-AU-045 | C-BT-049 |
| C-AU-046 | C-BT-050 |
| C-AU-047 | C-BT-051 |
| C-PM-002 | C-SB-014 |
| C-PM-005 | C-SB-017 |
| C-PM-006 | C-SB-018 |
| C-PM-007 | C-SB-019 |
| C-PM-008 | C-SB-020 |
| C-PM-009 | C-SB-021 |
| C-PM-010 | C-SB-022 |
| C-PM-011 | C-SB-023 |
| C-PM-012 | C-SB-024 |
| C-PM-013 | C-SB-026 |
| C-PM-014 | C-SB-027 |
| C-PM-015 | C-SB-028 |
| C-PM-017 | C-SB-032 |
| C-PM-018 | C-SB-033 |
| C-PM-019 | C-SB-034 |
| C-PM-020 | C-SB-035 |
| C-PM-022 | C-SB-040 |
| C-PM-023 | C-SB-041 |
| C-PM-026 | C-SB-045 |
| C-PM-027 | C-SB-046 |
| C-PM-031 | C-SB-053 |
| C-PM-033 | C-SB-056 |
| C-PM-035 | C-SB-060 |
| C-PM-038 | C-SB-070 |
| C-PM-039 | C-SB-075 |
| C-PM-041 | C-SB-077 |
| C-PM-048 | C-SB-064 |
| C-PM-051 | C-SB-068 |
| C-PM-052 | C-SB-069 |
| C-QT-001 | C-SB-082 |
| C-QT-002 | C-SB-084 |
| C-QT-005 | C-SB-088 |
| C-QT-006 | C-SB-090 |
| C-QT-010 | C-SB-095 |
| C-QT-011 | C-SB-096 |
| C-QT-012 | C-SB-097 |
| C-QT-013 | C-SB-099 |
| C-QT-015 | C-SB-101 |
| C-QT-016 | C-SB-103 |
| C-QT-019 | C-SB-105 |
| C-QT-024 | C-SB-107 |
| C-CM-001 | C-EN-013 |
| C-CM-002 | C-EN-014 |
| C-CM-003 | C-EN-016 |
| C-CM-007 | C-EN-019 |
| C-CM-011 | C-EN-023 |
| C-CM-012 | C-EN-024 |
| C-CM-013 | C-EN-027 |
| C-CM-016 | C-EN-030 |
| C-CM-020 | C-EN-034 |
| C-CM-021 | C-EN-035 |
| C-CM-023 | C-EN-037 |
| C-CM-024 | C-EN-038 |
| C-CM-025 | C-EN-039 |
| C-CM-031 | C-EN-042 |
| C-CM-034 | C-EN-044 |
| C-CM-038 | C-EN-046 |
| C-CM-040 | C-EN-048 |
| C-CM-041 | C-EN-053 |
| C-CM-042 | C-EN-054 |
| C-CM-044 | C-EN-056 |
| C-CM-046 | C-EN-058 |
| C-CM-047 | C-EN-059 |
| C-CM-052 | C-EN-063 |
| C-CM-053 | C-EN-074 |
| C-CM-058 | C-EN-075 |
| C-CM-060 | C-EN-076 |
| C-CM-072 | C-EN-117 |
| C-CM-073 | C-EN-118 |
| C-CM-074 | C-EN-119 |
| C-CM-075 | C-EN-120 |
| C-CM-077 | C-EN-122 |
| C-CM-078 | C-EN-123 |
| C-CM-081 | C-EN-130 |
| C-CM-082 | C-EN-131 |
| C-CM-086 | C-EN-137 |
| C-CM-087 | C-EN-138 |
| C-CM-088 | C-EN-142 |
| C-CM-089 | C-EN-143 |
| C-CM-092 | C-EN-097 |
| C-CM-093 | C-EN-096 |
| C-CM-095 | C-EN-083 |
| C-CM-096 | C-EN-084 |
| C-CM-097 | C-EN-081 |
| C-CM-098 | C-EN-082 |
| C-CM-100 | C-EN-087 |
| C-CM-101 | C-EN-088 |
| C-CM-102 | C-EN-089 |
| C-CM-103 | C-EN-090 |
| C-CM-108 | C-EN-105 |
| C-CM-109 | C-EN-145 |
| C-CM-110 | C-EN-146 |
| C-CM-116 | C-EN-153 |
| C-CM-117 | C-EN-154 |
| C-CM-118 | C-EN-155 |
| C-CM-122 | C-EN-161 |
| C-CM-123 | C-EN-162 |
| C-CM-124 | C-EN-163 |
| C-CM-125 | C-EN-165 |
| C-CM-126 | C-EN-166 |
| C-TX-001 | C-TX-015 |
| C-TX-004 | C-TX-018 |
| C-TX-005 | C-TX-019 |
| C-TX-006 | C-TX-020 |
| C-TX-007 | C-TX-021 |
| C-TX-011 | C-TX-048 |
| C-TX-012 | C-TX-049 |
| C-TX-013 | C-TX-050 |
| C-TX-014 | C-TX-026 |
| C-TX-015 | C-TX-027 |
| C-TX-017 | C-TX-030 |
| C-TX-018 | C-TX-031 |
| C-TX-025 | C-TX-069 |
| C-TX-026 | C-TX-070 |
| C-TX-035 | C-HM-069 |
| C-TX-037 | C-TX-080 |
| C-TX-040 | C-TX-083 |
| C-TX-042 | C-TX-085 |
| C-TX-043 | C-TX-086 |
| C-TX-045 | C-TX-038 |
| C-TX-046 | C-TX-039 |
| C-TX-054 | C-TX-052 |
| C-TX-055 | C-TX-053 |
| C-TX-056 | C-TX-054 |
| C-TX-057 | C-TX-055 |
| C-TX-058 | C-TX-056 |
| C-TX-059 | C-TX-057 |
| C-TX-060 | C-TX-058 |
| C-TX-061 | C-TX-059 |
| C-TX-062 | C-TX-060 |
| C-TX-063 | C-TX-061 |
| C-TX-064 | C-TX-062 |
| C-TX-065 | C-TX-063 |
| C-TX-066 | C-TX-064 |
| C-TX-067 | C-TX-108 |
| C-TX-069 | C-TX-109 |
| C-TX-070 | C-TX-110 |
| C-TX-071 | C-TX-111 |
| C-TX-072 | C-TX-112 |
| C-TX-073 | C-TX-113 |
| C-TX-074 | C-TX-114 |
| C-TX-076 | C-TX-116 |
| C-TX-077 | C-TX-117 |
| C-TX-078 | C-TX-118 |
| C-TX-079 | C-TX-119 |
| C-TX-080 | C-TX-120 |
| C-TX-081 | C-TX-121 |
| C-TX-082 | C-TX-123 |
| C-TX-083 | C-TX-124 |
| C-TX-084 | C-TX-126 |
| C-TX-085 | C-TX-127 |
| C-TX-086 | C-TX-128 |
| C-TX-087 | C-TX-129 |
| C-TX-088 | C-TX-130 |
| C-TX-089 | C-TX-131 |
| C-TX-090 | C-TX-132 |
| C-TX-094 | C-TX-136 |
| C-TX-095 | C-TX-137 |
| C-TX-096 | C-TX-138 |
| C-HR-002 | C-HM-004 |
| C-HR-004 | C-HM-008 |
| C-HR-005 | C-HM-009 |
| C-HR-006 | C-HM-010 |
| C-HR-007 | C-HM-011 |
| C-HR-009 | C-HM-013 |
| C-HR-012 | C-HM-017 |
| C-HR-013 | C-HM-018 |
| C-HR-016 | C-HM-021 |
| C-HR-017 | C-HM-022 |
| C-HR-019 | C-HM-025 |
| C-HR-021 | C-HM-026 |
| C-HR-022 | C-HM-027 |
| C-HR-026 | C-HM-031 |
| C-HR-028 | C-HM-033 |
| C-HR-029 | C-RP-053 |
| C-HR-031 | C-HM-036 |
| C-HR-032 | C-HM-037 |
| C-HR-033 | C-HM-038 |
| C-HR-034 | C-HM-039 |
| C-HR-035 | C-HM-040 |
| C-HR-036 | C-HM-041 |
| C-HR-037 | C-HM-042 |
| C-HR-038 | C-HM-044 |
| C-HR-039 | C-HM-046 |
| C-HR-040 | C-HM-047 |
| C-HR-041 | C-HM-049 |
| C-HR-042 | C-HM-050 |
| C-HR-043 | C-HM-051 |
| C-HR-044 | C-HM-045 |
| C-HR-045 | C-HM-052 |
| C-HR-050 | C-HM-057 |
| C-HR-052 | C-HM-059 |
| C-HR-053 | C-HM-060 |
| C-HR-054 | C-HM-063 |
| C-HR-055 | C-HM-064 |
| C-HR-062 | C-HM-071 |
| C-HR-063 | C-HM-072 |
| C-HR-066 | C-HM-076 |
| C-HR-067 | C-HM-077 |
| C-HR-069 | C-HM-078 |
| C-HR-070 | C-HM-079 |
| C-HR-071 | C-HM-080 |
| C-HR-073 | C-HM-083 |
| C-HR-075 | C-HM-085 |
| C-HR-076 | C-HM-086 |
| C-HR-078 | C-HM-088 |
| C-HR-079 | C-HM-089 |
| C-HR-080 | C-HM-090 |
| C-HR-081 | C-HM-091 |
| C-HR-083 | C-HM-093 |
| C-HR-086 | C-RP-029 |
| C-HR-087 | C-RP-030 |
| C-HR-088 | C-RP-032 |
| C-HR-089 | C-RP-009 |
| C-HR-090 | C-RP-010 |
| C-HR-097 | C-RP-013 |
| C-HR-098 | C-RP-014 |
| C-HR-100 | C-RP-016 |
| C-HR-102 | C-RP-018 |
| C-HR-103 | C-RP-020 |
| C-HR-108 | C-RP-003 |
| C-HR-116 | C-RP-041 |
| C-HR-117 | C-RP-042 |
| C-HR-118 | C-RP-044 |
| C-HR-120 | C-RP-043 |
| C-HR-121 | C-RP-047 |
| C-HR-123 | C-RP-049 |
| C-HR-124 | C-RP-050 |
| C-HR-127 | C-RP-055 |
| C-HR-128 | C-RP-060 |
| C-HR-129 | C-RP-061 |
| C-HR-130 | C-RP-062 |
| C-HR-131 | C-RP-063 |
| C-HR-132 | C-RP-064 |
| C-HR-133 | C-RP-066 |
| C-HR-139 | C-RP-075 |
| C-HR-140 | C-RP-076 |
| C-HR-141 | C-RP-077 |
| C-HR-142 | C-RP-079 |
| C-HR-143 | C-RP-078 |
| C-HR-145 | C-RP-081 |
| C-HR-146 | C-RP-082 |
| C-HR-150 | C-RP-088 |
| C-HR-151 | C-RP-089 |
| C-RC-001 | C-RC-012 |
| C-RC-002 | C-RC-013 |
| C-RC-003 | C-RC-014 |
| C-RC-004 | C-RC-015 |
| C-RC-005 | C-RC-016 |
| C-RC-007 | C-RC-018 |
| C-RC-008 | C-RC-019 |
| C-RC-011 | C-RC-025 |
| C-RC-013 | C-RC-027 |
| C-RC-014 | C-RC-028 |
| C-RC-015 | C-RC-030 |
| C-RC-016 | C-RC-031 |
| C-RC-017 | C-RC-032 |
| C-RC-018 | C-RC-033 |
| C-RC-019 | C-RC-034 |
| C-RC-022 | C-RC-037 |
| C-RC-023 | C-RC-038 |
| C-RC-024 | C-RC-039 |
| C-RC-028 | C-RC-045 |
| C-RC-029 | C-RC-047 |
| C-RC-030 | C-RC-048 |
| C-RC-032 | C-RC-050 |
| C-RC-035 | C-RC-053 |
| C-RC-037 | C-RC-055 |
| C-RC-038 | C-RC-056 |
| C-RC-040 | C-RC-058 |
| C-RC-041 | C-RC-060 |
| C-RC-043 | C-RC-062 |
| C-RC-044 | C-RC-063 |
| C-RC-045 | C-RC-064 |
| C-RC-046 | C-RC-065 |
| C-RC-047 | C-RC-066 |
| C-RC-048 | C-RC-067 |
| C-RC-049 | C-RC-068 |
| C-RC-050 | C-RC-070 |
| C-RC-051 | C-RC-071 |
| C-RC-052 | C-RC-072 |
| C-RC-053 | C-RC-073 |
| C-RC-054 | C-RC-074 |
| C-RC-058 | C-RC-078 |
| C-RC-059 | C-RC-079 |
| C-RC-060 | C-RC-080 |
| C-RC-061 | C-RC-081 |
| C-RC-062 | C-RC-083 |
| C-RC-063 | C-RC-084 |
| C-RC-064 | C-RC-085 |
| C-RC-065 | C-RC-086 |
| C-RC-066 | C-RC-088 |
| C-RC-067 | C-RC-089 |
| C-RC-070 | C-RC-093 |
| C-RC-073 | C-RC-096 |
| C-CU-002 | C-CU-007 |
| C-CU-010 | C-CU-016 |
| C-CU-011 | C-CU-017 |
| C-CU-013 | C-CU-019 |
| C-CU-015 | C-CU-021 |
| C-CU-016 | C-CU-022 |
| C-CU-017 | C-CU-023 |
| C-CU-018 | C-CU-025 |
| C-CU-019 | C-CU-026 |
| C-CU-020 | C-CU-028 |
| C-CU-021 | C-CU-029 |
| C-CU-025 | C-CU-032 |
| C-CU-026 | C-CU-034 |
| C-CU-030 | C-CU-038 |
| C-CU-031 | C-CU-039 |
| C-CU-032 | C-CU-040 |
| C-CU-033 | C-CU-041 |
| C-CU-034 | C-CU-042 |
| C-CU-037 | C-CU-045 |
| C-CU-038 | C-CU-046 |
| C-CU-039 | C-CU-047 |
| C-CU-040 | C-CU-048 |
| C-CU-041 | C-CU-049 |
| C-CU-042 | C-CU-050 |
| C-CU-047 | C-CU-057 |
| C-CU-048 | C-CU-058 |
| C-CU-049 | C-CU-059 |
| C-CU-051 | C-CU-063 |
| C-CU-052 | C-CU-064 |
| C-CU-053 | C-CU-076 |
| C-CU-055 | C-CU-067 |
| C-CU-056 | C-CU-068 |
| C-CU-057 | C-CU-069 |
| C-CU-060 | C-CU-073 |
| C-CU-074 | C-CU-089 |
| C-CU-077 | C-CU-109 |
| C-ST-009 | C-ST-024 |
| C-ST-010 | C-ST-025 |
| C-ST-011 | C-ST-026 |
| C-ST-012 | C-ST-027 |
| C-ST-013 | C-ST-028 |
| C-ST-017 | C-ST-036 |
| C-ST-021 | C-ST-040 |
| C-ST-022 | C-ST-041 |
| C-ST-023 | C-ST-042 |
| C-ST-025 | C-BT-063 |
| C-ST-031 | C-ST-056 |
| C-ST-035 | C-ST-061 |
| C-ST-038 | C-ST-065 |
| C-ST-039 | C-ST-066 |
| C-ST-041 | C-ST-069 |
| C-ST-045 | C-ST-075 |
| C-ST-046 | C-ST-076 |
| C-ST-047 | C-ST-078 |
| C-ST-049 | C-ST-082 |
| C-ST-055 | C-ST-091 |
| C-ST-056 | C-ST-093 |
| C-ST-057 | C-ST-094 |
| C-ST-058 | C-ST-098 |
| C-ST-061 | C-ST-100 |
| C-ST-064 | C-ST-111 |
| C-ST-065 | C-ST-115 |
| C-ST-067 | C-ST-113 |
| C-DA-001 | C-BT-052 |
| C-DA-002 | C-BT-053 |
| C-DA-004 | C-BT-055 |
| C-DA-005 | C-BT-056 |
| C-DA-006 | C-BT-057 |
| C-DA-007 | C-BT-058 |
| C-DA-008 | C-BT-059 |
| C-DA-009 | C-BT-060 |
| C-DA-010 | C-BT-061 |
| C-DA-012 | C-BT-065 |
| C-DA-014 | C-BT-068 |
| C-DA-015 | C-BT-069 |
| C-DA-018 | C-BT-073 |
| C-DA-019 | C-BT-074 |
| C-DA-020 | C-BT-075 |
| C-DA-022 | C-BT-077 |
| C-DA-023 | C-BT-078 |
| C-DA-024 | C-BT-079 |
| C-DA-025 | C-BT-080 |
| C-DA-026 | C-BT-081 |
| C-DA-027 | C-BT-082 |
| C-DA-028 | C-BT-083 |
| C-DA-030 | C-BT-087 |
| C-DA-031 | C-BT-088 |
| C-DA-032 | C-BT-089 |
| C-DA-033 | C-BT-090 |
| C-DA-034 | C-BT-091 |
| C-DA-036 | C-BT-093 |
| C-DA-037 | C-BT-094 |
| C-DA-038 | C-BT-095 |
| C-DA-039 | C-BT-096 |
| C-DA-040 | C-BT-097 |
| C-DA-041 | C-BT-098 |
| C-DA-042 | C-BT-099 |
| C-DA-043 | C-BT-100 |
| C-DA-044 | C-BT-085 |
| C-DA-045 | C-BT-086 |

### 斷言已改寫或拆併（690 條）

| 前一版 | 前一版斷言 | 查法 |
| --- | --- | --- |
| C-IE-005 | 匯出操作中阻擋重複觸發直到完成 | 見 `no10_data_import_export.md` 的去向 |
| C-IE-006 | 匯出收入支出呼叫匯出並帶交易類型 | 見 `no10_data_import_export.md` 的去向 |
| C-IE-007 | 匯出轉帳呼叫匯出並帶轉帳類型 | 見 `no10_data_import_export.md` 的去向 |
| C-IE-013 | 精靈標題隨步驟切換為四種文案 | 見 `no10_data_import_export.md` 的去向 |
| C-IE-028 | 讀取檔案錯誤時顯示讀取失敗對話框 | 見 `no10_data_import_export.md` 的去向 |
| C-IE-029 | 選擇有效 CSV 時呼叫解析並顯示檔名 | 見 `no10_data_import_export.md` 的去向 |
| C-IE-030 | 點按下載範本呼叫分享範本 | 見 `no10_data_import_export.md` 的去向 |
| C-IE-031 | 點按下載說明呼叫分享說明 | 見 `no10_data_import_export.md` 的去向 |
| C-IE-034 | 欄位對應列顯示系統欄位名稱與必填標記 | 見 `no10_data_import_export.md` 的去向 |
| C-IE-035 | 欄位選擇器顯示目前對應的 CSV 欄位 | 見 `no10_data_import_export.md` 的去向 |
| C-IE-036 | 無符合格式的可用欄位時顯示提示 | 見 `no10_data_import_export.md` 的去向 |
| C-IE-040 | 必填欄任一格空值或非法值時該欄不入候選 | 見 `no10_data_import_export.md` 的去向 |
| C-IE-042 | 依合規結果為每個系統必填欄位建議最相符欄位 | 見 `no10_data_import_export.md` 的去向 |
| C-IE-051 | 帳戶相符須名稱與幣別皆相同 | 見 `no10_data_import_export.md` 的去向 |
| C-IE-060 | 點按送出呼叫執行匯入 | 見 `no10_data_import_export.md` 的去向 |
| C-IE-061 | 匯入操作中顯示載入狀態 | 見 `no10_data_import_export.md` 的去向 |
| C-IE-063 | 使用者點擊確認後關閉 Modal | 見 `no10_data_import_export.md` 的去向 |
| C-IE-065 | 匯入依比對結果建立標記為新建的帳戶與類別 | 見 `no10_data_import_export.md` 的去向 |
| C-IE-068 | 日期字串帶時區偏移後綴時以內嵌偏移解讀 | 見 `no10_data_import_export.md` 的去向 |
| C-IE-071 | 無法建立的列略過並計入略過筆數 | 見 `no10_data_import_export.md` 的去向 |
| C-IE-072 | 帳戶不存在的列略過 | 見 `no10_data_import_export.md` 的去向 |
| C-IE-073 | 日期解析失敗的列略過 | 見 `no10_data_import_export.md` 的去向 |
| C-IE-076 | 匯出讀取當前使用者對應類型的活躍紀錄 | 見 `no10_data_import_export.md` 的去向 |
| C-IE-080 | 匯出時間欄位帶 UTC 偏移輸出、自我描述時區 | 見 `no10_data_import_export.md` 的去向 |
| C-IE-081 | 原樣重匯能還原同一絕對時刻 | 見 `no10_data_import_export.md` 的去向 |
| C-IE-083 | 匯出金額可去除尾隨零 | 見 `no10_data_import_export.md` 的去向 |
| C-IE-086 | 匯出無資料時回傳無資料 | 見 `no10_data_import_export.md` 的去向 |
| C-IE-093 | 說明檔注意事項載明必填欄須整欄有值且合法 | 見 `no10_data_import_export.md` 的去向 |
| C-IE-094 | 說明檔載明交易金額正值為收入負值為支出 | 見 `no10_data_import_export.md` 的去向 |
| C-IE-100 | 交易模式 CSV 欄位順序為六欄定序 | 見 `no10_data_import_export.md` 的去向 |
| C-IE-101 | 轉帳模式 CSV 欄位順序為八欄定序 | 見 `no10_data_import_export.md` 的去向 |
| C-IE-102 | 幣別代碼欄位大小寫不敏感 | 見 `no10_data_import_export.md` 的去向 |
| C-IE-103 | 日期僅有日期時時間預設為零時零分零秒 | 見 `no10_data_import_export.md` 的去向 |
| C-IE-104 | 金額小數最多四位 | 見 `no10_data_import_export.md` 的去向 |
| C-SR-002 | 搜尋 header 含關閉按鈕與搜尋標題 | 見 `no11_backup_search_db.md` 的去向 |
| C-SR-011 | 所屬分類已停用的交易不列入搜尋結果 | 見 `no11_backup_search_db.md` 的去向 |
| C-SR-017 | 結果列圖示一律採主色、不依收支正負著色 | 見 `no11_backup_search_db.md` 的去向 |
| C-SR-021 | 備註中的關鍵字以高亮標示 | 見 `no11_backup_search_db.md` 的去向 |
| C-SR-022 | 結果金額一律採主文字色、不依收支正負著色 | 見 `no11_backup_search_db.md` 的去向 |
| C-SR-031 | 復原完成計數變動且搜尋框非空時重新搜尋 | 見 `no11_backup_search_db.md` 的去向 |
| C-DB-001 | 本機資料庫保存所有曾登入使用者的資料 | 見 `no11_backup_search_db.md` 的去向 |
| C-DB-002 | 登出不清除本機資料 | 見 `no11_backup_search_db.md` 的去向 |
| C-DB-003 | 清單查詢以 `userId` 限定僅回當前使用者記錄 | 見 `no11_backup_search_db.md` 的去向 |
| C-DB-005 | 單筆查詢不套租戶過濾與軟刪停用排除 | 見 `no11_backup_search_db.md` 的去向 |
| C-DB-007 | 帳戶管理清單依 `sortOrder` 遞增排序 | 見 `no11_backup_search_db.md` 的去向 |
| C-DB-010 | 類別管理清單依 `sortOrder` 遞增排序 | 見 `no11_backup_search_db.md` 的去向 |
| C-DB-012 | 重置資料批次軟刪六張具墓碑欄的表 | 見 `no11_backup_search_db.md` 的去向 |
| C-DB-013 | 重置資料僅標記當前使用者紀錄、不動其他帳號 | 見 `no11_backup_search_db.md` 的去向 |
| C-DB-014 | 重置資料採軟刪除、不實體刪除紀錄 | 見 `no11_backup_search_db.md` 的去向 |
| C-DB-016 | 重置資料保留使用者、設定、貨幣顯示三表 | 見 `no11_backup_search_db.md` 的去向 |
| C-DB-017 | 偏好設定屬裝置層級、重置資料不清除 | 見 `no11_backup_search_db.md` 的去向 |
| C-BK-001 | 備份上傳六張資料表至雲端 | 見 `no11_backup_search_db.md` 的去向 |
| C-BK-002 | 備份全 user 寫入、含免費等級 | 見 `no11_backup_search_db.md` 的去向 |
| C-BK-006 | 帳號刪除進行中時備份直接返回 | 見 `no11_backup_search_db.md` 的去向 |
| C-BK-007 | 無登入使用者時備份直接返回 | 見 `no11_backup_search_db.md` 的去向 |
| C-BK-008 | 備份已在進行中時直接返回 | 見 `no11_backup_search_db.md` 的去向 |
| C-BK-010 | 冷卻時間戳屬裝置層級、跨重啟不重置 | 見 `no11_backup_search_db.md` 的去向 |
| C-BK-011 | 冷卻時間戳跨使用者切換不重置 | 見 `no11_backup_search_db.md` 的去向 |
| C-BK-012 | 備份記錄本次起始時間至裝置層級儲存 | 見 `no11_backup_search_db.md` 的去向 |
| C-BK-014 | 寫入禁止時跳過本次上傳、等 UTC 跨日重置 | 見 `no11_backup_search_db.md` 的去向 |
| C-BK-016 | 探測以單一集合近似判定、不遍歷其餘集合 | 見 `no11_backup_search_db.md` 的去向 |
| C-BK-017 | 探測失敗時保守視為遠端無資料、走全量上傳 | 見 `no11_backup_search_db.md` 的去向 |
| C-BK-018 | 遠端無資料時走初次完整上傳 | 見 `no11_backup_search_db.md` 的去向 |
| C-BK-019 | 遠端有資料時走增量上傳 | 見 `no11_backup_search_db.md` 的去向 |
| C-BK-020 | 遠端有資料但同步水位為空時視為全量增量 | 見 `no11_backup_search_db.md` 的去向 |
| C-BK-021 | 初次上傳讀取本機六張表全部資料 | 見 `no11_backup_search_db.md` 的去向 |
| C-BK-024 | 上傳完成後更新同步水位為當下時間 | 見 `no11_backup_search_db.md` 的去向 |
| C-BK-026 | 增量無任何變更時跳過上傳且不更新水位 | 見 `no11_backup_search_db.md` 的去向 |
| C-BK-027 | 上傳採冪等寫入、全量重傳安全 | 見 `no11_backup_search_db.md` 的去向 |
| C-BK-029 | 備份完成後解除進行中旗標 | 見 `no11_backup_search_db.md` 的去向 |
| C-BS-008 | 啟動時向 IAP 服務查憑證更新本地到期狀態 | 見 `no12_cross_cutting.md` 的去向 |
| C-BS-011 | 啟動時圖示引用查無定義的帳戶自癒為首個圖示 | 見 `no12_cross_cutting.md` 的去向 |
| C-OF-001 | 斷網下新增交易本機立即成功且介面不卡 | 見 `no12_cross_cutting.md` 的去向 |
| C-OF-002 | 離線時整段跳過同步、不探測遠端也不寫戳記 | 見 `no12_cross_cutting.md` 的去向 |
| C-OF-003 | 離線期間備份未完成時不前移同步水位 | 見 `no12_cross_cutting.md` 的去向 |
| C-OF-005 | 遠端探測失敗時保守視為遠端無資料 | 見 `no12_cross_cutting.md` 的去向 |
| C-OF-006 | 離線時偏好變更僅寫本機、雲端待恢復後補 | 見 `no12_cross_cutting.md` 的去向 |
| C-OF-007 | 離線時付費者依本地授權快取維持等級不降級 | 見 `no12_cross_cutting.md` 的去向 |
| C-OF-008 | 離線時登入失敗顯示連線異常提示 | 見 `no12_cross_cutting.md` 的去向 |
| C-OF-009 | 離線時帳號刪除直接拋網路錯誤、不進副作用 | 見 `no12_cross_cutting.md` 的去向 |
| C-OF-010 | 離線時匯入匯出不受影響、純本機操作 | 見 `no12_cross_cutting.md` 的去向 |
| C-OF-011 | 寫入配額耗盡時整段跳過備份 | 見 `no12_cross_cutting.md` 的去向 |
| C-OF-012 | 已同步過的使用者直接走增量、不探測遠端 | 見 `no12_cross_cutting.md` 的去向 |
| C-KR-003 | 匯入寫入中殺掉 App 後不留半套資料 | 見 `no12_cross_cutting.md` 的去向 |
| C-KR-004 | 匯入送出前任一步殺 App 後無新增帳戶類別紀錄 | 見 `no12_cross_cutting.md` 的去向 |
| C-KR-005 | 匯入成功對話框出現後殺 App 筆數與摘要一致 | 見 `no12_cross_cutting.md` 的去向 |
| C-KR-006 | 編輯器填寫中殺 App 後不留未存檔的半套紀錄 | 見 `no12_cross_cutting.md` 的去向 |
| C-KR-008 | 備份中斷後重開走增量重傳、不重複建雲端列 | 見 `no12_cross_cutting.md` 的去向 |
| C-KR-009 | 帳號刪除送出後殺 App 由中斷復原接手判定 | 見 `no12_cross_cutting.md` 的去向 |
| C-KR-010 | 首頁篩選變更後殺 App 重開三值仍保留 | 見 `no12_cross_cutting.md` 的去向 |
| C-KR-011 | 排程建立後殺 App 重開不重複補產生首筆實例 | 見 `no12_cross_cutting.md` 的去向 |
| C-TZ-001 | 期間邊界指派為時區敏感 | 見 `no12_cross_cutting.md` 的去向 |
| C-TZ-002 | 週起始為週一時該週自週一至週日 | 見 `no12_cross_cutting.md` 的去向 |
| C-TZ-003 | 週起始為週日時該週自週日至週六 | 見 `no12_cross_cutting.md` 的去向 |
| C-TZ-004 | 期間偏移在所選週起始下以整週為單位位移 | 見 `no12_cross_cutting.md` 的去向 |
| C-TZ-005 | 非週粒度忽略週起始日設定 | 見 `no12_cross_cutting.md` 的去向 |
| C-TZ-006 | 補產生以絕對時刻判定到期、不依時區日界 | 見 `no12_cross_cutting.md` 的去向 |
| C-TZ-007 | 切時區重跑補產生不多產實例 | 見 `no12_cross_cutting.md` 的去向 |
| C-TZ-008 | 匯入日期帶偏移後綴時來源時區對該列無效 | 見 `no12_cross_cutting.md` 的去向 |
| C-TZ-009 | 匯出時間帶 UTC 偏移、原樣重匯還原同一絕對時刻 | 見 `no12_cross_cutting.md` 的去向 |
| C-TZ-010 | 未來紀錄的可滑動範圍依粒度設上限 | 見 `no12_cross_cutting.md` 的去向 |
| C-TZ-011 | 最晚紀錄落在當期時無未來方向可滑 | 見 `no12_cross_cutting.md` 的去向 |
| C-TZ-012 | 最晚紀錄在未來時可向未來滑至該期 | 見 `no12_cross_cutting.md` 的去向 |
| C-TZ-013 | 最早紀錄較近時過去方向範圍收斂至實際觸及期間 | 見 `no12_cross_cutting.md` 的去向 |
| C-FM-001 | 幣別符號固定依 en-US 慣例、不隨 app 語系變 | 見 `no12_cross_cutting.md` 的去向 |
| C-FM-002 | 千分位與小數分隔符依 app 語系 | 見 `no12_cross_cutting.md` 的去向 |
| C-FM-003 | 法語採空格千分位與逗號小數 | 見 `no12_cross_cutting.md` 的去向 |
| C-FM-004 | 印地語採印度式分組 | 見 `no12_cross_cutting.md` 的去向 |
| C-FM-005 | 英語系維持逗號千分位與點小數 | 見 `no12_cross_cutting.md` 的去向 |
| C-FM-007 | 零小數幣別負值同樣採符號後負號 | 見 `no12_cross_cutting.md` 的去向 |
| C-FM-008 | 非英語系負值仍符號後負號、數字保本地寫法 | 見 `no12_cross_cutting.md` 的去向 |
| C-FM-016 | 未知幣別代碼不擲錯、降級顯示 | 見 `no12_cross_cutting.md` 的去向 |
| C-FM-019 | 日語幣別符號依幣別放置 | 見 `no12_cross_cutting.md` 的去向 |
| C-FM-022 | 千分位模式幣別顯示值為實際金額除以一千 | 見 `no12_cross_cutting.md` 的去向 |
| C-FM-024 | 匯率顯示採動態小數位、至少四位有效數字 | 見 `no12_cross_cutting.md` 的去向 |
| C-XD-001 | 停用帳戶的排程於補產時仍產生實例 | 見 `no12_cross_cutting.md` 的去向 |
| C-XD-002 | 停用帳戶排程補產的實例不列入首頁報表 | 見 `no12_cross_cutting.md` 的去向 |
| C-XD-003 | 刪除帳戶或類別後其排程續產與否須明定 | 見 `no12_cross_cutting.md` 的去向 |
| C-XD-004 | 合併帳戶或類別後排程範本欄轉指目標須明定 | 見 `no12_cross_cutting.md` 的去向 |
| C-XD-005 | 免費帳號帳戶或類別總數超上限時擋新增交易轉帳 | 見 `no12_cross_cutting.md` 的去向 |
| C-XD-006 | 停用的帳戶與類別仍計入免費配額 | 見 `no12_cross_cutting.md` 的去向 |
| C-XD-007 | 匯入可使總數超過免費上限 | 見 `no12_cross_cutting.md` 的去向 |
| C-XD-008 | 復原刪除致總數超上限的容忍行為須明定 | 見 `no12_cross_cutting.md` 的去向 |
| C-XD-009 | 復原成功後首頁與搜尋依計數重新查詢列表 | 見 `no12_cross_cutting.md` 的去向 |
| C-XD-010 | 復原合併依快照移回紀錄並恢復冗餘轉帳 | 見 `no12_cross_cutting.md` 的去向 |
| C-XD-011 | 匯入完成不顯示復原列、匯入不可單步復原 | 見 `no12_cross_cutting.md` 的去向 |
| C-XD-012 | 換帳號偵測不同帳號時明示詢問、不自動清除 | 見 `no12_cross_cutting.md` 的去向 |
| C-XD-014 | 換帳號清除前未上傳變更是否先備份須明定 | 見 `no12_cross_cutting.md` 的去向 |
| C-XD-015 | 換帳號清除連帶清前一帳號授權快取 | 見 `no12_cross_cutting.md` 的去向 |
| C-XD-016 | 清除資料庫僅軟刪當前使用者六表 | 見 `no12_cross_cutting.md` 的去向 |
| C-XD-017 | 清除資料庫不影響其他帳號本機紀錄 | 見 `no12_cross_cutting.md` 的去向 |
| C-XD-018 | 清除資料庫的軟刪傳播雲端刪除標記 | 見 `no12_cross_cutting.md` 的去向 |
| C-XD-019 | 備份冷卻屬裝置層級、換帳號不重置 | 見 `no12_cross_cutting.md` 的去向 |
| C-XD-020 | 跨幣別轉帳補錄正反兩筆匯率、生效時點為轉帳日 | 見 `no12_cross_cutting.md` 的去向 |
| C-XD-022 | 刪除跨幣別轉帳不刪已補錄匯率、換算沿用殘留值 | 見 `no12_cross_cutting.md` 的去向 |
| C-XD-023 | 週起始日變更後清空報表快取、週期間依新值重推 | 見 `no12_cross_cutting.md` 的去向 |
| C-XD-024 | 日期選擇器星期列順序依週起始日即時跟隨 | 見 `no12_cross_cutting.md` 的去向 |
| C-XD-025 | 主要貨幣變更後為既有外幣帳戶種入新佔位匯率 | 見 `no12_cross_cutting.md` 的去向 |
| C-XD-026 | 帳戶停用後自首頁已選帳戶清單移除 | 見 `no12_cross_cutting.md` 的去向 |
| C-XD-027 | 類別停用後其交易自報表與搜尋結果隱藏 | 見 `no12_cross_cutting.md` 的去向 |
| C-XD-028 | 帳號刪除中備份與授權補驗一律跳過 | 見 `no12_cross_cutting.md` 的去向 |
| C-DM-003 | 新帳號 `language` 依裝置 Locale 推導 | 見 `no1_data_models.md` 的去向 |
| C-DM-004 | 裝置 Locale 未命中支援清單時 `language` 落 `en` | 見 `no1_data_models.md` 的去向 |
| C-DM-005 | 語系比對不做語族內 fallback | 見 `no1_data_models.md` 的去向 |
| C-DM-006 | 挪威語 `nb` 與 `nn` 映射至 `no` | 見 `no1_data_models.md` 的去向 |
| C-DM-007 | 新帳號 `baseCurrencyId` 自裝置 Locale 推導 | 見 `no1_data_models.md` 的去向 |
| C-DM-008 | Locale 無法推導貨幣時 `baseCurrencyId` 落 TWD | 見 `no1_data_models.md` 的去向 |
| C-DM-009 | 新帳號 `timeZone` 取裝置時區 | 見 `no1_data_models.md` 的去向 |
| C-DM-010 | `timeZone` 存 IANA 名稱 | 見 `no1_data_models.md` 的去向 |
| C-DM-011 | 新帳號 `theme` 預設 `theme1` | 見 `no1_data_models.md` 的去向 |
| C-DM-012 | `theme` 讀取不到時採 `theme1` | 見 `no1_data_models.md` 的去向 |
| C-DM-013 | `launchMode` 預設值為 `home` | 見 `no1_data_models.md` 的去向 |
| C-DM-014 | `launchMode` 值域限 `home` `expense` `income` `transfer` | 見 `no1_data_models.md` 的去向 |
| C-DM-015 | `launchMode` 為空字串或集外值時上傳正規化為 `home` | 見 `no1_data_models.md` 的去向 |
| C-DM-016 | `weekStart` 預設值為 `auto` | 見 `no1_data_models.md` 的去向 |
| C-DM-017 | `weekStart` 值域限 `auto` `sunday` `monday` | 見 `no1_data_models.md` 的去向 |
| C-DM-018 | `weekStart` 為 `auto` 時週起始依語系慣例決定 | 見 `no1_data_models.md` 的去向 |
| C-DM-019 | `weekStart` 為 Null 或集外值時上傳正規化為 `auto` | 見 `no1_data_models.md` 的去向 |
| C-DM-020 | `analyticsConsent` 預設值為 true | 見 `no1_data_models.md` 的去向 |
| C-DM-021 | `analyticsConsent` 為 Null 時本機讀取視為 true | 見 `no1_data_models.md` 的去向 |
| C-DM-022 | `analyticsConsent` 為 false 時上傳保留 false 不被略過 | 見 `no1_data_models.md` 的去向 |
| C-DM-023 | `homeTimeGranularity` 值域限 `day` `week` `month` `year` `all` | 見 `no1_data_models.md` 的去向 |
| C-DM-024 | `homeTimeGranularity` 為 Null 或集外值時載入視為 `day` | 見 `no1_data_models.md` 的去向 |
| C-DM-025 | `homeGroupMode` 值域限 `category` `date` | 見 `no1_data_models.md` 的去向 |
| C-DM-026 | `homeGroupMode` 為 Null 或集外值時載入視為 `category` | 見 `no1_data_models.md` 的去向 |
| C-DM-027 | `homeSelectedAccountIds` 以 JSON 字串陣列序列化儲存 | 見 `no1_data_models.md` 的去向 |
| C-DM-028 | `homeSelectedAccountIds` 為壞 JSON 時視為無既有清單 | 見 `no1_data_models.md` 的去向 |
| C-DM-029 | `homeSelectedAccountIds` 為非陣列 JSON 時視為無既有清單 | 見 `no1_data_models.md` 的去向 |
| C-DM-030 | `homeSelectedAccountIds` 陣列含非字串元素時視為無既有清單 | 見 `no1_data_models.md` 的去向 |
| C-DM-031 | `homeSelectedAccountIds` 為空陣列時視為無既有清單 | 見 `no1_data_models.md` 的去向 |
| C-DM-032 | 交易備份上傳完成後系統前移 `lastSyncedAt` | 見 `no1_data_models.md` 的去向 |
| C-DM-033 | `lastSyncedAt` 為 Null 代表尚未上傳過、走全量備份 | 見 `no1_data_models.md` 的去向 |
| C-DM-035 | `lastSyncedAt` 為 Delta 上傳的篩選基準 | 見 `no1_data_models.md` 的去向 |
| C-DM-036 | 三個 home 顯示狀態欄位僅存本機、不上傳雲端 | 見 `no1_data_models.md` 的去向 |
| C-DM-037 | 六項偏好欄位變更後系統上傳至 `preferences` | 見 `no1_data_models.md` 的去向 |
| C-DM-038 | `baseCurrencyId` 上傳時轉 ISO Code 寫 `preferences.currency` | 見 `no1_data_models.md` 的去向 |
| C-DM-040 | 本機 `timeZone` 上傳至雲端鍵名 `timezone` | 見 `no1_data_models.md` 的去向 |
| C-DM-041 | 雲端偏好鏡像永不下載套用回本機 | 見 `no1_data_models.md` 的去向 |
| C-DM-042 | 偏好屬裝置層級、不隨帳號跨裝置下載 | 見 `no1_data_models.md` 的去向 |
| C-DM-043 | 多裝置偏好各自上傳且最後寫入覆寫 | 見 `no1_data_models.md` 的去向 |
| C-DM-045 | 本機無 Settings 列時偏好上傳不執行 | 見 `no1_data_models.md` 的去向 |
| C-DM-047 | Settings `updatedOn` 於每次更新後刷新 | 見 `no1_data_models.md` 的去向 |
| C-DM-048 | 帳戶 `userId` 標記資料擁有者、為必填 | 見 `no1_data_models.md` 的去向 |
| C-DM-049 | 帳戶名稱長度上限 60 字元 | 見 `no1_data_models.md` 的去向 |
| C-DM-051 | 帳戶名稱全為空白視為空 | 見 `no1_data_models.md` 的去向 |
| C-DM-052 | 帳戶 `iconId` 限 `tags` 含 `account` 的圖示 | 見 `no1_data_models.md` 的去向 |
| C-DM-054 | 帳戶 `currencyCode` 存 ISO Alpha 代碼 | 見 `no1_data_models.md` 的去向 |
| C-DM-055 | 帳戶 `scheduleId` 為棄用殘欄、任何路徑恆為 Null | 見 `no1_data_models.md` 的去向 |
| C-DM-056 | 停用帳戶寫入 `disabledOn`、啟用中為 Null | 見 `no1_data_models.md` 的去向 |
| C-DM-057 | 重新啟用帳戶時 `disabledOn` 清為 Null | 見 `no1_data_models.md` 的去向 |
| C-DM-058 | 帳戶軟刪寫入 `deletedOn` 並同時前移 `updatedOn` | 見 `no1_data_models.md` 的去向 |
| C-DM-059 | 軟刪除採 `deletedOn` 墓碑、不用 WatermelonDB 標記刪除 | 見 `no1_data_models.md` 的去向 |
| C-DM-060 | 任何寫入路徑皆前移 `updatedOn`、確保進 Delta 上傳窗 | 見 `no1_data_models.md` 的去向 |
| C-DM-061 | 類別 `userId` 標記資料擁有者、為必填 | 見 `no1_data_models.md` 的去向 |
| C-DM-062 | 類別名稱長度上限 60 字元 | 見 `no1_data_models.md` 的去向 |
| C-DM-064 | 類別 `type` 值域限 `expense` 或 `income` | 見 `no1_data_models.md` 的去向 |
| C-DM-065 | 類別 `iconId` 限 `tags` 含 `category` 的圖示 | 見 `no1_data_models.md` 的去向 |
| C-DM-066 | 停用類別寫入 `disabledOn`、啟用中為 Null | 見 `no1_data_models.md` 的去向 |
| C-DM-070 | 交易備註長度上限 200 字元 | 見 `no1_data_models.md` 的去向 |
| C-DM-071 | 交易備註寫入時去除前後空白 | 見 `no1_data_models.md` 的去向 |
| C-DM-075 | 轉出與轉入金額各自以縮放整數儲存 | 見 `no1_data_models.md` 的去向 |
| C-DM-078 | 轉帳備註長度上限 200 字元 | 見 `no1_data_models.md` 的去向 |
| C-DM-079 | 轉帳備註寫入時去除前後空白 | 見 `no1_data_models.md` 的去向 |
| C-DM-081 | 匯率 `date` 為生效時點、含日期與時刻 | 見 `no1_data_models.md` 的去向 |
| C-DM-082 | 匯率 `date` 為換算取值的新舊比較基準 | 見 `no1_data_models.md` 的去向 |
| C-DM-083 | `decimalPlaces` 為 Null 時採貨幣預設小數位 | 見 `no1_data_models.md` 的去向 |
| C-DM-084 | `useThousandsUnit` 開啟時金額以千為單位顯示 | 見 `no1_data_models.md` 的去向 |
| C-DM-085 | CurrencyConfig 不同步雲端、僅存本地 | 見 `no1_data_models.md` 的去向 |
| C-DM-086 | CurrencyConfig 無 `deletedOn` 欄、不參與軟刪 | 見 `no1_data_models.md` 的去向 |
| C-DM-087 | 排程 `frequency` 值域限 DAILY WEEKLY MONTHLY YEARLY | 見 `no1_data_models.md` 的去向 |
| C-DM-089 | 上限值 `interval` 在每種頻率下皆產生合法日期 | 見 `no1_data_models.md` 的去向 |
| C-DM-093 | 收支排程僅寫三個收支 template 欄、轉帳欄留 Null | 見 `no1_data_models.md` 的去向 |
| C-DM-094 | 轉帳排程僅寫四個轉帳 template 欄、收支欄留 Null | 見 `no1_data_models.md` 的去向 |
| C-DM-096 | 排程範本備註寫入時去除前後空白 | 見 `no1_data_models.md` 的去向 |
| C-DM-098 | 登入時系統更新 `lastLoginAt` | 見 `no1_data_models.md` 的去向 |
| C-DM-101 | 每個圖示定義的 glyph 都有對應的向量資產檔 | 見 `no1_data_models.md` 的去向 |
| C-DM-102 | 每個圖示定義的 glyph 都有對應的映射表項目 | 見 `no1_data_models.md` 的去向 |
| C-DM-103 | 映射表無孤兒項目、每項皆對應圖示定義 | 見 `no1_data_models.md` 的去向 |
| C-DM-104 | 圖示 `tags` 界定適用域、`account` 供帳戶、`category` 供類別 | 見 `no1_data_models.md` 的去向 |
| C-DM-105 | 貨幣定義的 `minorUnits` 對齊 ISO 標準 | 見 `no1_data_models.md` 的去向 |
| C-DM-106 | runtime 訂閱等級值域僅 `LEVEL_0` 至 `LEVEL_2` | 見 `no1_data_models.md` 的去向 |
| C-DM-107 | `isPremiumLoaded` 初值為 false、首次解析前不判定授權 | 見 `no1_data_models.md` 的去向 |
| C-DM-108 | 線上更新或離線回退任一完成後 `isPremiumLoaded` 設為 true | 見 `no1_data_models.md` 的去向 |
| C-DM-109 | 登出後 `isPremiumLoaded` 維持 true、不再等待解析 | 見 `no1_data_models.md` 的去向 |
| C-DM-111 | 本地授權快取以帳號為範圍、不跨帳號沿用 | 見 `no1_data_models.md` 的去向 |
| C-DM-112 | 快取 `expirationDate` 為 Null 代表無期限 | 見 `no1_data_models.md` 的去向 |
| C-DM-115 | 金額縮放整數上限為系統安全整數上界 | 見 `no1_data_models.md` 的去向 |
| C-DM-117 | 交易金額不得為 0 | 見 `no1_data_models.md` 的去向 |
| C-DM-118 | 轉帳轉出與轉入金額皆須大於 0 | 見 `no1_data_models.md` 的去向 |
| C-DM-119 | 本機所有時間欄位存 UTC Unix Timestamp 毫秒 | 見 `no1_data_models.md` 的去向 |
| C-HD-001 | 模式 A 列表頁依序含原生返回、標題、動作元件 | 見 `no2_shared_policies.md` 的去向 |
| C-HD-002 | 模式 A 動作元件通常留空 | 見 `no2_shared_policies.md` 的去向 |
| C-HD-003 | 模式 A 列表類可於動作元件放新增 | 見 `no2_shared_policies.md` 的去向 |
| C-HD-004 | 模式 A 列表類可於動作元件放合併 | 見 `no2_shared_policies.md` 的去向 |
| C-HD-006 | 模式 C 必填欄位未滿足時完成動作 disabled | 見 `no2_shared_policies.md` 的去向 |
| C-HD-007 | 模式 D 純展示 modal 含關閉與標題、動作元件留空 | 見 `no2_shared_policies.md` 的去向 |
| C-HD-008 | 付費牆 header 僅關閉動作、不設畫面標題 | 見 `no2_shared_policies.md` 的去向 |
| C-HD-009 | 模式 E 首頁依序含篩選、標題、搜尋、設定四元件 | 見 `no2_shared_policies.md` 的去向 |
| C-HD-010 | 模式 F 精靈首步左動作為關閉 | 見 `no2_shared_policies.md` 的去向 |
| C-HD-011 | 模式 F 精靈其餘步驟左動作為返回 | 見 `no2_shared_policies.md` 的去向 |
| C-HD-012 | 模式 F 精靈末步右動作為送出 | 見 `no2_shared_policies.md` 的去向 |
| C-HD-013 | 模式 F 精靈其餘步驟右動作為前進 | 見 `no2_shared_policies.md` 的去向 |
| C-HD-014 | 模式 F 當前步驟驗證未通過時右動作 disabled | 見 `no2_shared_policies.md` 的去向 |
| C-HD-015 | 模式 F 步驟導航由 header 承載、不設底導航列 | 見 `no2_shared_policies.md` 的去向 |
| C-HD-016 | header 自訂按鈕以 icon 表意、不含任何文字 | 見 `no2_shared_policies.md` 的去向 |
| C-HD-017 | 標題本身為文字禁令的唯一例外 | 見 `no2_shared_policies.md` 的去向 |
| C-HD-018 | 模式 B 編輯頁為預留、目前無 screen 採用 | 見 `no2_shared_policies.md` 的去向 |
| C-IN-001 | 名稱輸入達上限後續輸入不更新欄位 | 見 `no2_shared_policies.md` 的去向 |
| C-IN-002 | 備註輸入達上限後續輸入不更新欄位 | 見 `no2_shared_policies.md` 的去向 |
| C-IN-003 | 金額輸入達位數上限後續輸入不更新欄位 | 見 `no2_shared_policies.md` 的去向 |
| C-IN-004 | 輸入達上限採靜默阻擋、不顯示錯誤訊息 | 見 `no2_shared_policies.md` 的去向 |
| C-IN-005 | 名稱寫入時去除前後空白 | 見 `no2_shared_policies.md` 的去向 |
| C-IN-006 | 備註寫入時去除前後空白 | 見 `no2_shared_policies.md` 的去向 |
| C-IN-007 | 名稱去空白後為空時由完成按鈕必填閘擋下 | 見 `no2_shared_policies.md` 的去向 |
| C-IN-009 | 不做查重、允許同名分類並存 | 見 `no2_shared_policies.md` 的去向 |
| C-IN-010 | 撞名時畫面不顯示警告 | 見 `no2_shared_policies.md` 的去向 |
| C-IN-011 | 撞名不使完成按鈕 disabled | 見 `no2_shared_policies.md` 的去向 |
| C-IN-012 | 名稱超長於存檔時擲驗證失敗、原因為名稱過長 | 見 `no2_shared_policies.md` 的去向 |
| C-IN-013 | 名稱長度比對取去空白後長度 | 見 `no2_shared_policies.md` 的去向 |
| C-IN-014 | 金額超出可儲存範圍於存檔時驗證失敗 | 見 `no2_shared_policies.md` 的去向 |
| C-IN-015 | 匯入路徑名稱超長截斷後存入、不作驗證失敗 | 見 `no2_shared_policies.md` 的去向 |
| C-IN-016 | 交易金額為 0 時完成按鈕 disabled | 見 `no2_shared_policies.md` 的去向 |
| C-IN-017 | 轉帳兩側金額未大於 0 時完成按鈕 disabled | 見 `no2_shared_policies.md` 的去向 |
| C-IN-018 | 轉帳轉出與轉入帳戶相同時完成按鈕 disabled | 見 `no2_shared_policies.md` 的去向 |
| C-IN-019 | 輸入達長度上限不使完成按鈕 disabled | 見 `no2_shared_policies.md` 的去向 |
| C-IN-020 | 金額超限不進 disabled 條件、靠存檔驗證處理 | 見 `no2_shared_policies.md` 的去向 |
| C-DL-001 | 刪除按鈕標籤一律為刪除、不帶實體名稱 | 見 `no2_shared_policies.md` 的去向 |
| C-DL-002 | 同一元件在不同 screen 標籤不隨之改變 | 見 `no2_shared_policies.md` 的去向 |
| C-DL-003 | 四個 editor 僅編輯模式顯示刪除按鈕 | 見 `no2_shared_policies.md` 的去向 |
| C-DL-004 | 新增模式不顯示刪除按鈕 | 見 `no2_shared_policies.md` 的去向 |
| C-DL-005 | 刪除按鈕置於 screen 操作區 | 見 `no2_shared_policies.md` 的去向 |
| C-DL-006 | 點按刪除按鈕觸發該畫面對應的刪除操作 | 見 `no2_shared_policies.md` 的去向 |
| C-DL-007 | 資料管理的清空資料庫不套用本政策標籤 | 見 `no2_shared_policies.md` 的去向 |
| C-LS-001 | 模式 A 列項依序含 leading icon、主標、副標、trailing 值、chevron | 見 `no2_shared_policies.md` 的去向 |
| C-LS-002 | 模式 A 列項可只有主標、副標為選配 | 見 `no2_shared_policies.md` 的去向 |
| C-LS-003 | 模式 A 點擊跳轉下層 screen 或開啟 modal | 見 `no2_shared_policies.md` 的去向 |
| C-LS-004 | 模式 A 與 B 列表啟用按下回饋 | 見 `no2_shared_policies.md` 的去向 |
| C-LS-005 | B-1 單列 trailing 顯示勾選圖示標示選中 | 見 `no2_shared_policies.md` 的去向 |
| C-LS-006 | B-1 選中列採主色 | 見 `no2_shared_policies.md` 的去向 |
| C-LS-007 | B-2 網格以右上 overlay 標示選中 | 見 `no2_shared_policies.md` 的去向 |
| C-LS-008 | B-2 網格未選中時不渲染 overlay 圖示 | 見 `no2_shared_policies.md` 的去向 |
| C-LS-009 | 多選用法不變更 trailing 樣式 | 見 `no2_shared_policies.md` 的去向 |
| C-LS-010 | visibility-toggle 格以視覺差異標示、不用 overlay | 見 `no2_shared_policies.md` 的去向 |
| C-LS-011 | visibility-toggle 點 tile 切換選取狀態 | 見 `no2_shared_policies.md` 的去向 |
| C-LS-012 | visibility-toggle 最後一個選取格不可取消 | 見 `no2_shared_policies.md` 的去向 |
| C-LS-013 | 模式 D 列表長按拖拉排序 | 見 `no2_shared_policies.md` 的去向 |
| C-LS-014 | 模式 D 列表點擊整列導向編輯 | 見 `no2_shared_policies.md` 的去向 |
| C-LS-015 | 模式 D 列表停用按下回饋、避免拖拉手勢衝突 | 見 `no2_shared_policies.md` 的去向 |
| C-LS-016 | 模式 D 列項含 leading icon、主標、選配副標 | 見 `no2_shared_policies.md` 的去向 |
| C-LS-017 | disabled 列停用按下回饋 | 見 `no2_shared_policies.md` 的去向 |
| C-LS-018 | 整列是否套 disabled 視覺弱化由引用端決定 | 見 `no2_shared_policies.md` 的去向 |
| C-LS-019 | 任何含搜尋的列表必顯空狀態 | 見 `no2_shared_policies.md` 的去向 |
| C-LS-020 | 搜尋無結果空狀態 title 採共用無結果文案 | 見 `no2_shared_policies.md` 的去向 |
| C-LS-021 | 搜尋無結果空狀態描述含搜尋字串原文 | 見 `no2_shared_policies.md` 的去向 |
| C-LS-022 | 初始無資料顯示該畫面對應描述性訊息 | 見 `no2_shared_policies.md` 的去向 |
| C-LS-024 | 空狀態圖示傳 null 時不渲染圖示 | 見 `no2_shared_policies.md` 的去向 |
| C-LS-025 | 載入中不顯示空狀態 | 見 `no2_shared_policies.md` 的去向 |
| C-LS-026 | 群組卡片搜尋列表兩態切換以動畫互換、不硬切 | 見 `no2_shared_policies.md` 的去向 |
| C-LS-027 | empty 態不渲染卡片底色、避免視覺殘留 | 見 `no2_shared_policies.md` 的去向 |
| C-LS-028 | 切換期間舊態不接受互動 | 見 `no2_shared_policies.md` 的去向 |
| C-LS-029 | 群組卡片於子項間渲染分隔線 | 見 `no2_shared_policies.md` 的去向 |
| C-LS-031 | Custom 列表不套模式分類、仍受狀態行為約束 | 見 `no2_shared_policies.md` 的去向 |
| C-SC-001 | 搜尋列依序含前綴 icon、輸入框、後綴 clear | 見 `no2_shared_policies.md` 的去向 |
| C-SC-002 | 搜尋列 placeholder 各畫面共用同一通用文案 | 見 `no2_shared_policies.md` 的去向 |
| C-SC-003 | clear 動作僅於輸入框 focus 時顯示 | 見 `no2_shared_policies.md` 的去向 |
| C-SC-004 | 點按 clear 清空輸入並重新觸發篩選 | 見 `no2_shared_policies.md` 的去向 |
| C-SC-005 | 底部 dock 固定於畫面底部、不隨 scroll 隱藏 | 見 `no2_shared_policies.md` 的去向 |
| C-SC-006 | 底部 dock 隨鍵盤上推、鍵盤收起落回底部 | 見 `no2_shared_policies.md` 的去向 |
| C-SC-007 | modal 變體內嵌 modal 頂部、不隨鍵盤移動 | 見 `no2_shared_policies.md` 的去向 |
| C-SC-008 | modal 變體隨 modal 開關出現消失 | 見 `no2_shared_policies.md` 的去向 |
| C-SC-009 | 輸入內容時即時觸發引用端篩選 | 見 `no2_shared_policies.md` 的去向 |
| C-SC-010 | 搜尋頁進入時輸入框 autoFocus | 見 `no2_shared_policies.md` 的去向 |
| C-SC-011 | 其餘搜尋畫面進入時不 autoFocus | 見 `no2_shared_policies.md` 的去向 |
| C-SC-012 | 搜尋頁列表滾動時收起鍵盤 | 見 `no2_shared_policies.md` 的去向 |
| C-SC-013 | 滾動期間保留點擊事件可命中列項 | 見 `no2_shared_policies.md` 的去向 |
| C-UD-001 | 交易編輯器新增成功後顯示復原列 | 見 `no2_shared_policies.md` 的去向 |
| C-UD-002 | 交易編輯器編輯成功後顯示復原列 | 見 `no2_shared_policies.md` 的去向 |
| C-UD-003 | 交易編輯器刪除成功後顯示復原列 | 見 `no2_shared_policies.md` 的去向 |
| C-UD-004 | 轉帳編輯器三種寫入操作後皆顯示復原列 | 見 `no2_shared_policies.md` 的去向 |
| C-UD-005 | 帳戶編輯器三種寫入操作後皆顯示復原列 | 見 `no2_shared_policies.md` 的去向 |
| C-UD-006 | 類別編輯器三種寫入操作後皆顯示復原列 | 見 `no2_shared_policies.md` 的去向 |
| C-UD-008 | 復原列覆蓋於編輯器關閉後返回的目的畫面 | 見 `no2_shared_policies.md` 的去向 |
| C-UD-009 | 復原列顯示後約 4 秒無互動則自動關閉 | 見 `no2_shared_policies.md` 的去向 |
| C-UD-010 | 復原列為全域單一實例、後一次操作取代前一次 | 見 `no2_shared_policies.md` 的去向 |
| C-UD-011 | 復原段含倒數計時與固定復原標籤、整段為單一觸發區 | 見 `no2_shared_policies.md` 的去向 |
| C-UD-013 | 點按復原段呼叫 executeUndo | 見 `no2_shared_policies.md` 的去向 |
| C-UD-014 | 點按取消段呼叫 closeUndo、不執行復原 | 見 `no2_shared_policies.md` 的去向 |
| C-UD-015 | 倒數歸零呼叫 closeUndo、不執行復原 | 見 `no2_shared_policies.md` 的去向 |
| C-UD-016 | 復原列啟用時覆蓋 Footer、暫代三顆新增按鈕 | 見 `no2_shared_policies.md` 的去向 |
| C-UD-017 | 復原列不屬任一 screen、為全域底部覆蓋元件 | 見 `no2_shared_policies.md` 的去向 |
| C-DP-001 | 交易與轉帳記錄日期採 Datetime 模式、含時間選擇 | 見 `no2_shared_policies.md` 的去向 |
| C-DP-002 | 定期結束日期採 Date-only 模式、無時間選擇 | 見 `no2_shared_policies.md` 的去向 |
| C-DP-003 | Datetime 觸發器顯示日期與時間文字 | 見 `no2_shared_policies.md` 的去向 |
| C-DP-004 | Date-only 觸發器僅顯示日期文字 | 見 `no2_shared_policies.md` 的去向 |
| C-DP-005 | 點按觸發器 pill 彈出 dialog 並進日選擇子模式 | 見 `no2_shared_policies.md` 的去向 |
| C-DP-006 | 日選擇子模式點標題列切換至月選擇子模式 | 見 `no2_shared_policies.md` 的去向 |
| C-DP-010 | 點按某一日即選定該日 | 見 `no2_shared_policies.md` 的去向 |
| C-DP-012 | Datetime 模式轉動時間滾輪選定時與分 | 見 `no2_shared_policies.md` 的去向 |
| C-DP-013 | Date-only 模式 dialog 不含時間滾輪 | 見 `no2_shared_policies.md` 的去向 |
| C-DP-015 | 任一選擇立即反映呼叫畫面值、無確認取消按鈕 | 見 `no2_shared_policies.md` 的去向 |
| C-DP-016 | 觸發器與標題列文字依使用者語系格式顯示 | 見 `no2_shared_policies.md` 的去向 |
| C-DP-017 | 星期列文字依使用者語系顯示 | 見 `no2_shared_policies.md` 的去向 |
| C-DP-019 | 日期選擇器星期列於 `weekStart` 為 `auto` 時依語系慣例排序 | 見 `no2_shared_policies.md` 的去向 |
| C-DP-020 | 時間依使用者偏好以 24 或 12 小時制顯示 | 見 `no2_shared_policies.md` 的去向 |
| C-DP-021 | 月曆格僅顯當月日期、相鄰月位置留白不可點 | 見 `no2_shared_policies.md` 的去向 |
| C-DP-022 | 呼叫畫面未指定上下限時日期可選範圍無限制 | 見 `no2_shared_policies.md` 的去向 |
| C-DP-023 | 超出呼叫畫面指定上下限的日期不可選 | 見 `no2_shared_policies.md` 的去向 |
| C-AU-006 | 登入載入中兩鈕皆停用點擊 | 見 `no3_auth_premium_quota.md` 的去向 |
| C-AU-007 | 頁尾條款引導文字與兩連結相連成完整語意 | 見 `no3_auth_premium_quota.md` 的去向 |
| C-AU-020 | 登入成功後呼叫 handlePostAuth | 見 `no3_auth_premium_quota.md` 的去向 |
| C-AU-021 | 登入成功後依 `src/navigation/AppNavigator.tsx` 導航初始落點 | 見 `no3_auth_premium_quota.md` 的去向 |
| C-AU-022 | 登入成功且付費牆攔截時導航至 PaywallScreen | 見 `no3_auth_premium_quota.md` 的去向 |
| C-AU-026 | 重新登入同帳號時委派偏好全量上傳 | 見 `no3_auth_premium_quota.md` 的去向 |
| C-AU-035 | 清除後由 handlePostAuth 重建新帳號的 User 與 Settings | 見 `no3_auth_premium_quota.md` 的去向 |
| C-AU-037 | 雲端 `users/{uid}` 不存在時建立雲端用戶文件 | 見 `no3_auth_premium_quota.md` 的去向 |
| C-AU-038 | 雲端文件 preferences 取本機實際值、非寫死預設 | 見 `no3_auth_premium_quota.md` 的去向 |
| C-AU-039 | 雲端 `users/{uid}` 已存在時委派偏好全量上傳 | 見 `no3_auth_premium_quota.md` 的去向 |
| C-AU-040 | 登入後不讀取套用雲端 preference | 見 `no3_auth_premium_quota.md` 的去向 |
| C-AU-041 | 雲端用戶文件建立不分訂閱等級、無條件執行 | 見 `no3_auth_premium_quota.md` 的去向 |
| C-PM-001 | 付費牆以 Modal 呈現 | 見 `no3_auth_premium_quota.md` 的去向 |
| C-PM-003 | 內容高度超出可視高度時整頁可垂直捲動 | 見 `no3_auth_premium_quota.md` 的去向 |
| C-PM-004 | 捲動時所有區塊維持完整可及、不裁切 | 見 `no3_auth_premium_quota.md` 的去向 |
| C-PM-016 | 訂閱按鈕於未選方案或處理中時不可點按 | 見 `no3_auth_premium_quota.md` 的去向 |
| C-PM-021 | 頁腳含恢復購買、使用條款、隱私政策三連結 | 見 `no3_auth_premium_quota.md` 的去向 |
| C-PM-024 | 點按訂閱按鈕呼叫 `startSubscriptionPurchase` | 見 `no3_auth_premium_quota.md` 的去向 |
| C-PM-025 | 購買成功後呼叫 `refreshStatus` 並關閉 Modal | 見 `no3_auth_premium_quota.md` 的去向 |
| C-PM-028 | 恢復購買查到購買且取得授權時顯示恢復成功對話框 | 見 `no3_auth_premium_quota.md` 的去向 |
| C-PM-029 | 恢復購買查無可還原時顯示無可還原提示 | 見 `no3_auth_premium_quota.md` 的去向 |
| C-PM-030 | 查到購買但當前帳號未取得授權時顯示無可還原提示 | 見 `no3_auth_premium_quota.md` 的去向 |
| C-PM-032 | 登入後訂閱後端授權記錄、即時更新本機等級 | 見 `no3_auth_premium_quota.md` 的去向 |
| C-PM-034 | 無授權記錄或連線失敗時不直接降為 `LEVEL_0` | 見 `no3_auth_premium_quota.md` 的去向 |
| C-PM-036 | 任一情形完成後標記訂閱狀態為已就緒 | 見 `no3_auth_premium_quota.md` 的去向 |
| C-PM-037 | 購買憑證送後端驗證、client 不自行推定等級 | 見 `no3_auth_premium_quota.md` 的去向 |
| C-PM-040 | 已完成購買一律送驗證、不受確認交易成敗影響 | 見 `no3_auth_premium_quota.md` 的去向 |
| C-PM-042 | 每筆已完成購買都須確認、與是否帶交易識別碼無關 | 見 `no3_auth_premium_quota.md` 的去向 |
| C-PM-043 | 無本地授權快取時推定等級為 `LEVEL_0` | 見 `no3_auth_premium_quota.md` 的去向 |
| C-PM-044 | 快取有到期日且早於當下時推定 `LEVEL_0` | 見 `no3_auth_premium_quota.md` 的去向 |
| C-PM-045 | 快取未過期時推定為快取中的訂閱等級 | 見 `no3_auth_premium_quota.md` 的去向 |
| C-PM-046 | 授權來自後端即時回報時直接採其等級、不自行推翻 | 見 `no3_auth_premium_quota.md` 的去向 |
| C-PM-047 | 授權來自離線副本且已過期時回 `LEVEL_0` | 見 `no3_auth_premium_quota.md` 的去向 |
| C-PM-049 | 登出時解除後端授權訂閱 | 見 `no3_auth_premium_quota.md` 的去向 |
| C-PM-050 | 快取讀寫以當前 uid 為範圍 | 見 `no3_auth_premium_quota.md` 的去向 |
| C-QT-003 | `LEVEL_0` 帳戶總數上限 3 個 | 見 `no3_auth_premium_quota.md` 的去向 |
| C-QT-004 | `LEVEL_0` 類別總數上限 7 個 | 見 `no3_auth_premium_quota.md` 的去向 |
| C-QT-007 | 帳戶或類別總數等於上限時仍允許新增交易 | 見 `no3_auth_premium_quota.md` 的去向 |
| C-QT-008 | 帳戶或類別總數超過上限時連帶擋新增交易 | 見 `no3_auth_premium_quota.md` 的去向 |
| C-QT-009 | 帳戶或類別總數超過上限時連帶擋新增轉帳 | 見 `no3_auth_premium_quota.md` 的去向 |
| C-QT-014 | 無 userId 時保守回傳禁止、不退回無範圍計數 | 見 `no3_auth_premium_quota.md` 的去向 |
| C-QT-017 | 寫入配額於 UTC 跨日時重置 | 見 `no3_auth_premium_quota.md` 的去向 |
| C-QT-018 | 寫入配額用盡時跳過本次上傳 | 見 `no3_auth_premium_quota.md` 的去向 |
| C-QT-020 | 讀取不納入配額管控 | 見 `no3_auth_premium_quota.md` 的去向 |
| C-QT-021 | 遠端存在性探測每次至多一讀、不計入寫入計數 | 見 `no3_auth_premium_quota.md` 的去向 |
| C-QT-022 | 配額範圍只治理交易備份批次寫入 | 見 `no3_auth_premium_quota.md` 的去向 |
| C-QT-023 | 偏好上傳不計入寫入配額 | 見 `no3_auth_premium_quota.md` 的去向 |
| C-QT-025 | 跨日重置將當日計數歸零並更新記錄日期 | 見 `no3_auth_premium_quota.md` 的去向 |
| C-CM-004 | 類別清單 header 含返回、標題、合併、新增 | 見 `no4_accounts_categories.md` 的去向 |
| C-CM-005 | 點按類別清單返回按鈕返回上一頁 | 見 `no4_accounts_categories.md` 的去向 |
| C-CM-006 | 點按合併按鈕以類別模式導航至合併編輯器 | 見 `no4_accounts_categories.md` 的去向 |
| C-CM-008 | 新增類別允許時導航至類別編輯器且不帶類型參數 | 見 `no4_accounts_categories.md` 的去向 |
| C-CM-009 | 點按類別列表項目導航至類別編輯器 | 見 `no4_accounts_categories.md` 的去向 |
| C-CM-010 | 拖拉類別項目依所在分區類型呼叫重排 | 見 `no4_accounts_categories.md` 的去向 |
| C-CM-014 | 帳戶清單 header 含返回、標題、合併、新增 | 見 `no4_accounts_categories.md` 的去向 |
| C-CM-015 | 點按合併按鈕以帳戶模式導航至合併編輯器 | 見 `no4_accounts_categories.md` 的去向 |
| C-CM-017 | 新增帳戶允許時導航至帳戶編輯器 | 見 `no4_accounts_categories.md` 的去向 |
| C-CM-018 | 點按帳戶列表項目導航至帳戶編輯器 | 見 `no4_accounts_categories.md` 的去向 |
| C-CM-019 | 拖拉帳戶項目呼叫重排帳戶 | 見 `no4_accounts_categories.md` 的去向 |
| C-CM-022 | 類別名稱為空時完成按鈕不可點按 | 見 `no4_accounts_categories.md` 的去向 |
| C-CM-026 | 新增模式類別類型可修改 | 見 `no4_accounts_categories.md` 的去向 |
| C-CM-027 | 編輯模式類別類型顯示為停用樣式 | 見 `no4_accounts_categories.md` 的去向 |
| C-CM-028 | 編輯模式點按類型選擇器不執行任何動作 | 見 `no4_accounts_categories.md` 的去向 |
| C-CM-029 | 切換類別類型時保留已選圖示 | 見 `no4_accounts_categories.md` 的去向 |
| C-CM-030 | 切換類別類型時保留已輸入名稱 | 見 `no4_accounts_categories.md` 的去向 |
| C-CM-032 | 類別圖示網格常駐顯示、無折疊狀態 | 見 `no4_accounts_categories.md` 的去向 |
| C-CM-033 | 類別圖示網格僅含 `tags` 含 `category` 的圖示 | 見 `no4_accounts_categories.md` 的去向 |
| C-CM-035 | 新增模式預設選取圖示清單第一個 | 見 `no4_accounts_categories.md` 的去向 |
| C-CM-036 | 圖示清單為空時選取內建後備圖示 | 見 `no4_accounts_categories.md` 的去向 |
| C-CM-037 | 點按圖示即時更新預覽 | 見 `no4_accounts_categories.md` 的去向 |
| C-CM-039 | 編輯模式載入既有類別的停用狀態 | 見 `no4_accounts_categories.md` 的去向 |
| C-CM-043 | 帳戶名稱為空時完成按鈕不可點按 | 見 `no4_accounts_categories.md` 的去向 |
| C-CM-045 | 幣別項目顯示 `alphabeticCode` 與 `name` | 見 `no4_accounts_categories.md` 的去向 |
| C-CM-048 | 編輯模式幣別不可展開、不可修改 | 見 `no4_accounts_categories.md` 的去向 |
| C-CM-049 | 編輯模式僅顯示當前所選幣別 | 見 `no4_accounts_categories.md` 的去向 |
| C-CM-050 | 帳戶圖示網格僅含 `tags` 含 `account` 的圖示 | 見 `no4_accounts_categories.md` 的去向 |
| C-CM-051 | 新增模式帳戶圖示初始選取網格第一筆 | 見 `no4_accounts_categories.md` 的去向 |
| C-CM-054 | 新增模式點完成呼叫建立、成功後顯示復原列並返回 | 見 `no4_accounts_categories.md` 的去向 |
| C-CM-055 | 編輯模式點完成呼叫更新、成功後顯示復原列並返回 | 見 `no4_accounts_categories.md` 的去向 |
| C-CM-056 | 寫入操作失敗時顯示錯誤提示、不返回 | 見 `no4_accounts_categories.md` 的去向 |
| C-CM-057 | 編輯模式儲存前找不到原記錄時擲錯、不做半套更新 | 見 `no4_accounts_categories.md` 的去向 |
| C-CM-059 | 確認刪除後呼叫刪除、成功顯示復原列並返回 | 見 `no4_accounts_categories.md` 的去向 |
| C-CM-061 | 新建類別 `sortOrder` 取同型未刪最大值加一 | 見 `no4_accounts_categories.md` 的去向 |
| C-CM-062 | 型別分區為空時新建類別 `sortOrder` 起始 0 | 見 `no4_accounts_categories.md` 的去向 |
| C-CM-063 | 計算 `sortOrder` 最大值時排除軟刪列 | 見 `no4_accounts_categories.md` 的去向 |
| C-CM-064 | 新建時選停用則寫入 `disabledOn` | 見 `no4_accounts_categories.md` 的去向 |
| C-CM-065 | 建立類別擲名稱過長驗證失敗時不寫入 | 見 `no4_accounts_categories.md` 的去向 |
| C-CM-066 | 更新類別僅改名稱、圖示、停用狀態 | 見 `no4_accounts_categories.md` 的去向 |
| C-CM-067 | 更新類別一律不動 `type` | 見 `no4_accounts_categories.md` 的去向 |
| C-CM-068 | 重新啟用類別時 `disabledOn` 清為 Null | 見 `no4_accounts_categories.md` 的去向 |
| C-CM-069 | 重排類別批次改寫每個移動列的 `sortOrder` | 見 `no4_accounts_categories.md` 的去向 |
| C-CM-070 | 重排時已在目標位置的列不寫入 | 見 `no4_accounts_categories.md` 的去向 |
| C-CM-071 | 重排僅寫入位置有變的列 | 見 `no4_accounts_categories.md` 的去向 |
| C-CM-076 | 類別與交易的軟刪於單一批次提交 | 見 `no4_accounts_categories.md` 的去向 |
| C-CM-079 | 新建帳戶 `sortOrder` 取未刪最大值加一 | 見 `no4_accounts_categories.md` 的去向 |
| C-CM-080 | 第一個帳戶 `sortOrder` 起始 0 | 見 `no4_accounts_categories.md` 的去向 |
| C-CM-083 | 建立帳戶擲名稱過長驗證失敗時不種匯率 | 見 `no4_accounts_categories.md` 的去向 |
| C-CM-084 | 更新帳戶不動 `currencyCode` | 見 `no4_accounts_categories.md` 的去向 |
| C-CM-085 | 刪除帳戶連帶軟刪其全部交易 | 見 `no4_accounts_categories.md` 的去向 |
| C-CM-090 | 合併編輯器來源模式由呼叫端於導航時指定 | 見 `no4_accounts_categories.md` 的去向 |
| C-CM-091 | 合併 header 含關閉、合併標題、完成 | 見 `no4_accounts_categories.md` 的去向 |
| C-CM-094 | 來源與目標相同時外框以錯誤色標示衝突 | 見 `no4_accounts_categories.md` 的去向 |
| C-CM-099 | 來源選擇器列出全部未停用項目 | 見 `no4_accounts_categories.md` 的去向 |
| C-CM-104 | 變更來源致目標不相容時目標自動重置 | 見 `no4_accounts_categories.md` 的去向 |
| C-CM-105 | 相容清單僅來源一項時目標維持為來源並呈衝突 | 見 `no4_accounts_categories.md` 的去向 |
| C-CM-106 | 帳戶模式點完成呼叫合併帳戶 | 見 `no4_accounts_categories.md` 的去向 |
| C-CM-107 | 類別模式點完成呼叫合併類別 | 見 `no4_accounts_categories.md` 的去向 |
| C-CM-111 | 同幣別帳戶合併通過前置檢查並進入批次 | 見 `no4_accounts_categories.md` 的去向 |
| C-CM-112 | 合併帳戶將來源交易改指目標 | 見 `no4_accounts_categories.md` 的去向 |
| C-CM-113 | 合併帳戶將以來源為轉出方的轉帳改指目標 | 見 `no4_accounts_categories.md` 的去向 |
| C-CM-114 | 合併帳戶將以來源為轉入方的轉帳改指目標 | 見 `no4_accounts_categories.md` 的去向 |
| C-CM-115 | 合併後轉出入同一方的冗餘轉帳被軟刪 | 見 `no4_accounts_categories.md` 的去向 |
| C-CM-119 | 合併類別將來源交易改指目標 | 見 `no4_accounts_categories.md` 的去向 |
| C-CM-120 | 合併完成後軟刪來源項目 | 見 `no4_accounts_categories.md` 的去向 |
| C-CM-121 | 復原合併清空來源的 `deletedOn`、恢復來源 | 見 `no4_accounts_categories.md` 的去向 |
| C-TX-002 | 必填欄位未填妥時完成按鈕不可點按 | 見 `no5_transactions_transfers.md` 的去向 |
| C-TX-003 | 交易日期選擇區採 Datetime 模式 | 見 `no5_transactions_transfers.md` 的去向 |
| C-TX-008 | 金額輸入框與其標示同一 group box 包住 | 見 `no5_transactions_transfers.md` 的去向 |
| C-TX-009 | 帳戶選擇器與類別選擇器並排 | 見 `no5_transactions_transfers.md` 的去向 |
| C-TX-010 | 編輯模式顯示刪除按鈕 | 見 `no5_transactions_transfers.md` 的去向 |
| C-TX-016 | 編輯模式進入時依當前內容顯示各欄位 | 見 `no5_transactions_transfers.md` 的去向 |
| C-TX-019 | 新增模式定期規則為空 | 見 `no5_transactions_transfers.md` 的去向 |
| C-TX-020 | 定期設定區預設為收合 | 見 `no5_transactions_transfers.md` 的去向 |
| C-TX-021 | 金額輸入框預設聚焦 | 見 `no5_transactions_transfers.md` 的去向 |
| C-TX-022 | 定期結束日 async 載入後選擇器補同步 | 見 `no5_transactions_transfers.md` 的去向 |
| C-TX-023 | 載入後點特定日期回寫原結束日、不覆寫成今天 | 見 `no5_transactions_transfers.md` 的去向 |
| C-TX-024 | 使用者已手選日期時稍後載入不覆蓋手選值 | 見 `no5_transactions_transfers.md` 的去向 |
| C-TX-027 | 定期規則清空視同與開啟時相同 | 見 `no5_transactions_transfers.md` 的去向 |
| C-TX-028 | 定期規則變動時對話框僅提供此筆及未來 | 見 `no5_transactions_transfers.md` 的去向 |
| C-TX-029 | 定期規則變動時對話框訊息說明僅能套用至此筆及未來 | 見 `no5_transactions_transfers.md` 的去向 |
| C-TX-030 | 僅一般欄位變動時對話框提供僅此一筆與此筆及未來 | 見 `no5_transactions_transfers.md` 的去向 |
| C-TX-031 | 選擇任一定期編輯模式後呼叫更新排程 | 見 `no5_transactions_transfers.md` 的去向 |
| C-TX-032 | 一般交易設定定期規則後新增模式呼叫建立排程 | 見 `no5_transactions_transfers.md` 的去向 |
| C-TX-033 | 一般交易設定定期規則後編輯模式呼叫轉為排程 | 見 `no5_transactions_transfers.md` 的去向 |
| C-TX-034 | 新增一般交易前呼叫配額閘控 | 見 `no5_transactions_transfers.md` 的去向 |
| C-TX-036 | 新增交易允許時呼叫建立交易 | 見 `no5_transactions_transfers.md` 的去向 |
| C-TX-038 | 寫入成功後顯示復原列並返回上一頁 | 見 `no5_transactions_transfers.md` 的去向 |
| C-TX-039 | 寫入失敗時顯示錯誤提示 | 見 `no5_transactions_transfers.md` 的去向 |
| C-TX-041 | 選擇任一定期刪除模式後呼叫刪除排程 | 見 `no5_transactions_transfers.md` 的去向 |
| C-TX-044 | 刪除成功後顯示復原列並返回上一頁 | 見 `no5_transactions_transfers.md` 的去向 |
| C-TX-047 | 跨幣別轉帳點轉入金額框可聚焦並顯示鍵盤 | 見 `no5_transactions_transfers.md` 的去向 |
| C-TX-048 | 同幣別轉帳點轉入金額框無反應 | 見 `no5_transactions_transfers.md` 的去向 |
| C-TX-049 | 計算機按鍵結果即時顯示於聚焦的金額框 | 見 `no5_transactions_transfers.md` 的去向 |
| C-TX-050 | 轉帳編輯器完成與刪除的排程分流與交易編輯器一致 | 見 `no5_transactions_transfers.md` 的去向 |
| C-TX-051 | 新增轉帳前呼叫配額閘控、動作識別碼為建立轉帳 | 見 `no5_transactions_transfers.md` 的去向 |
| C-TX-052 | 轉帳編輯器完成時遭配額禁止則導向付費牆 | 見 `no5_transactions_transfers.md` 的去向 |
| C-TX-053 | 除以零得非有限值時清空回 0、不留 Infinity | 見 `no5_transactions_transfers.md` 的去向 |
| C-TX-068 | 金額乘以一萬縮放為整數儲存 | 見 `no5_transactions_transfers.md` 的去向 |
| C-TX-075 | 更新交易時未帶排程欄位則保留記錄原值 | 見 `no5_transactions_transfers.md` 的去向 |
| C-TX-091 | 幣別對變動時補錄新的正反兩筆匯率 | 見 `no5_transactions_transfers.md` 的去向 |
| C-TX-092 | 變動判斷以更新前原值為基準 | 見 `no5_transactions_transfers.md` 的去向 |
| C-TX-093 | 金額日期不變僅換幣別對時仍補錄匯率 | 見 `no5_transactions_transfers.md` 的去向 |
| C-TX-097 | 已有進行中的復原等待時清除前一筆倒數 | 見 `no5_transactions_transfers.md` 的去向 |
| C-TX-098 | 倒數自復原列對使用者可見後起算 | 見 `no5_transactions_transfers.md` 的去向 |
| C-TX-099 | 倒數歸零時呼叫關閉復原等待 | 見 `no5_transactions_transfers.md` 的去向 |
| C-TX-100 | 關閉復原等待時停止倒數並清除已存操作 | 見 `no5_transactions_transfers.md` 的去向 |
| C-TX-101 | 執行復原成功後遞增復原完成計數 | 見 `no5_transactions_transfers.md` 的去向 |
| C-TX-102 | 復原完成計數變動時首頁重新查詢列表 | 見 `no5_transactions_transfers.md` 的去向 |
| C-TX-103 | 復原完成計數變動時搜尋頁重新查詢列表 | 見 `no5_transactions_transfers.md` 的去向 |
| C-TX-104 | 復原執行失敗時顯示復原失敗提示並關閉等待 | 見 `no5_transactions_transfers.md` 的去向 |
| C-TX-105 | 建立操作的復原以軟刪剛建的記錄實現 | 見 `no5_transactions_transfers.md` 的去向 |
| C-TX-106 | 編輯操作的復原以寫回更新前欄位值實現 | 見 `no5_transactions_transfers.md` 的去向 |
| C-TX-107 | 刪除操作的復原以清除墓碑欄實現 | 見 `no5_transactions_transfers.md` 的去向 |
| C-TX-108 | 合併操作的復原帶入受影響記錄識別碼快照 | 見 `no5_transactions_transfers.md` 的去向 |
| C-HR-001 | 首頁 header 依序含篩選、Logo、搜尋、設定 | 見 `no6_home_report.md` 的去向 |
| C-HR-003 | 環形圖同時呈現支出與收入兩弧、不受焦點切換影響 | 見 `no6_home_report.md` 的去向 |
| C-HR-008 | 兩弧長度比例對應兩側納入分組的金額合計 | 見 `no6_home_report.md` 的去向 |
| C-HR-010 | 各側分組金額小者鄰近起點、大者鄰近交會點 | 見 `no6_home_report.md` 的去向 |
| C-HR-011 | 分組金額低於總和 10/360 門檻時不繪製 | 見 `no6_home_report.md` 的去向 |
| C-HR-014 | 門檻以移除前比例判定、僅一輪不重算 | 見 `no6_home_report.md` 的去向 |
| C-HR-015 | 全部分組達標時輸出與未過濾一致 | 見 `no6_home_report.md` 的去向 |
| C-HR-018 | 一側整側被拔時另一側鋪滿整圈 | 見 `no6_home_report.md` 的去向 |
| C-HR-020 | 單側多分組合計仍鋪滿整圈 | 見 `no6_home_report.md` 的去向 |
| C-HR-023 | 支出焦點卡含支出圖示與合計金額 | 見 `no6_home_report.md` 的去向 |
| C-HR-024 | 收入焦點卡含收入圖示與合計金額 | 見 `no6_home_report.md` 的去向 |
| C-HR-025 | 焦點卡永遠擇一啟用、另一停用 | 見 `no6_home_report.md` 的去向 |
| C-HR-027 | 點按停用焦點卡後兩卡互換、列表即時切換類型 | 見 `no6_home_report.md` 的去向 |
| C-HR-030 | 逐筆紀錄各分組預設為收合狀態 | 見 `no6_home_report.md` 的去向 |
| C-HR-046 | 多幣別模式非主要貨幣筆顯示 `≈` 前綴換算副文字 | 見 `no6_home_report.md` 的去向 |
| C-HR-047 | 單幣別模式不顯示換算副文字 | 見 `no6_home_report.md` 的去向 |
| C-HR-048 | 多幣別模式下主要貨幣筆不顯示換算副文字 | 見 `no6_home_report.md` 的去向 |
| C-HR-049 | 定期排程實例金額左側並列循環圖示 | 見 `no6_home_report.md` 的去向 |
| C-HR-051 | 循環圖示不獨立互動、點按列行為與一般紀錄相同 | 見 `no6_home_report.md` 的去向 |
| C-HR-056 | Footer 含新增支出、轉帳、收入三顆按鈕 | 見 `no6_home_report.md` 的去向 |
| C-HR-057 | 新增支出遭配額禁止時導向付費牆 | 見 `no6_home_report.md` 的去向 |
| C-HR-058 | 新增支出允許時帶今天日期開支出模式編輯器 | 見 `no6_home_report.md` 的去向 |
| C-HR-059 | 新增收入允許時帶今天日期開收入模式編輯器 | 見 `no6_home_report.md` 的去向 |
| C-HR-060 | 新增轉帳允許時帶今天日期開轉帳編輯器 | 見 `no6_home_report.md` 的去向 |
| C-HR-061 | 首頁 Footer 新增轉帳遭配額禁止時導向付費牆 | 見 `no6_home_report.md` 的去向 |
| C-HR-064 | 無任何紀錄時僅顯示當前區間、不可向兩側滑 | 見 `no6_home_report.md` 的去向 |
| C-HR-065 | 可滑動範圍涵蓋最早至最晚紀錄所在區間 | 見 `no6_home_report.md` 的去向 |
| C-HR-068 | 時間區間標題跟隨水平滑動 | 見 `no6_home_report.md` 的去向 |
| C-HR-072 | 首頁篩選由首頁以 Modal 呈現 | 見 `no6_home_report.md` 的去向 |
| C-HR-074 | 各摘要卡內含 icon 與當前選定值 | 見 `no6_home_report.md` 的去向 |
| C-HR-077 | 帳戶卡內含帳戶圖示、名稱與幣別 badge | 見 `no6_home_report.md` 的去向 |
| C-HR-082 | 點按帳戶卡切換選取、首頁報表即時更新 | 見 `no6_home_report.md` 的去向 |
| C-HR-084 | 首頁篩選點按關閉按鈕關閉 Modal | 見 `no6_home_report.md` 的去向 |
| C-HR-085 | 圖表資料各分組依金額由大到小排序 | 見 `no6_home_report.md` 的去向 |
| C-HR-091 | 停用後歷史交易資料留存、僅自報表視圖隱藏 | 見 `no6_home_report.md` 的去向 |
| C-HR-092 | 轉出轉入帳戶皆在已選清單的轉帳不列入計算 | 見 `no6_home_report.md` 的去向 |
| C-HR-093 | 轉出轉入帳戶皆不在已選清單的轉帳不列入計算 | 見 `no6_home_report.md` 的去向 |
| C-HR-094 | 外部帳戶已刪除或已停用的轉帳不列入計算 | 見 `no6_home_report.md` 的去向 |
| C-HR-095 | 僅轉出帳戶在已選清單時以轉出金額列入支出合計 | 見 `no6_home_report.md` 的去向 |
| C-HR-096 | 僅轉入帳戶在已選清單時以轉入金額列入收入合計 | 見 `no6_home_report.md` 的去向 |
| C-HR-099 | 支出與收入合計不受圖表來源影響、皆獨立計算 | 見 `no6_home_report.md` 的去向 |
| C-HR-101 | 類別分組依一致類型金額由大到小排序 | 見 `no6_home_report.md` 的去向 |
| C-HR-104 | 各筆紀錄帶 `scheduleId` 供判斷是否為排程實例 | 見 `no6_home_report.md` 的去向 |
| C-HR-105 | 一般交易帶所屬帳戶名稱供顯示 | 見 `no6_home_report.md` 的去向 |
| C-HR-106 | 轉帳紀錄帶來源與目的帳戶名稱供依方向呈現 | 見 `no6_home_report.md` 的去向 |
| C-HR-107 | 期間偏移 0 為當期、減 1 往過去、加 1 往未來 | 見 `no6_home_report.md` 的去向 |
| C-HR-109 | 粒度為日週月年時起訖為該粒度完整範圍 | 見 `no6_home_report.md` 的去向 |
| C-HR-110 | 週起算日依 `weekStart` 偏好解析 | 見 `no6_home_report.md` 的去向 |
| C-HR-111 | 首頁週期間於 `weekStart` 為 `auto` 時依語系慣例起算 | 見 `no6_home_report.md` 的去向 |
| C-HR-112 | 粒度為全部時起訖涵蓋全部時間且不受偏移影響 | 見 `no6_home_report.md` 的去向 |
| C-HR-113 | 首次載入無既有選取時全選未刪除未停用帳戶 | 見 `no6_home_report.md` 的去向 |
| C-HR-114 | 載入既有選取時過濾已刪除與已停用帳戶 | 見 `no6_home_report.md` 的去向 |
| C-HR-115 | 載入既有選取時不補入清單以外的既有帳戶 | 見 `no6_home_report.md` 的去向 |
| C-HR-119 | 換帳號後舊帳戶 id 全失效時回退新帳號全選 | 見 `no6_home_report.md` 的去向 |
| C-HR-122 | 僅剩一個已選帳戶時取消該帳戶操作不生效 | 見 `no6_home_report.md` 的去向 |
| C-HR-125 | 三值存於使用者 Settings、僅存本機不上傳 | 見 `no6_home_report.md` 的去向 |
| C-HR-126 | 使用者確立後自 Settings 讀取三值 | 見 `no6_home_report.md` 的去向 |
| C-HR-134 | Settings 尚未建立時跳過該次寫回 | 見 `no6_home_report.md` 的去向 |
| C-HR-135 | 快取鍵由全部輸入與當前使用者組成 | 見 `no6_home_report.md` 的去向 |
| C-HR-136 | 相同輸入且同一使用者共用同一份快取 | 見 `no6_home_report.md` 的去向 |
| C-HR-137 | 不同使用者即使輸入相同對應各自快取 | 見 `no6_home_report.md` 的去向 |
| C-HR-138 | 快取命中時更新該筆存取時間並直接回傳 | 見 `no6_home_report.md` 的去向 |
| C-HR-144 | 交易建立更新刪除後清空報表快取 | 見 `no6_home_report.md` 的去向 |
| C-HR-147 | 帳戶建立或更新後清空報表快取 | 見 `no6_home_report.md` 的去向 |
| C-HR-148 | 匯率異動後清空報表快取、多幣別報表依新匯率重算 | 見 `no6_home_report.md` 的去向 |
| C-HR-149 | 語系時區主要貨幣或週起始日變更後清空報表快取 | 見 `no6_home_report.md` 的去向 |
| C-RC-006 | 間隔單位文字依頻率顯示日週月年 | 見 `no7_recurring.md` 的去向 |
| C-RC-009 | 結束日期初始值為既有規則的結束日期 | 見 `no7_recurring.md` 的去向 |
| C-RC-010 | 無既有結束日期時初始顯示今天 | 見 `no7_recurring.md` 的去向 |
| C-RC-012 | 結束條件為永不時結束日期選擇器不可操作 | 見 `no7_recurring.md` 的去向 |
| C-RC-020 | 點按永不時選擇器顯示的日期保留不變 | 見 `no7_recurring.md` 的去向 |
| C-RC-021 | 點按於指定日期時結束日期設為選擇器當下顯示值 | 見 `no7_recurring.md` 的去向 |
| C-RC-025 | 建立排程同時產生首筆交易 | 見 `no7_recurring.md` 的去向 |
| C-RC-026 | 轉帳排程首筆走建立轉帳、帶入排程欄位 | 見 `no7_recurring.md` 的去向 |
| C-RC-027 | 收支排程首筆走建立交易、帶入排程欄位 | 見 `no7_recurring.md` 的去向 |
| C-RC-031 | 更新排程選僅此一筆時不影響排程表 | 見 `no7_recurring.md` 的去向 |
| C-RC-033 | 前一週期依排程頻率與間隔往前推一個週期單位 | 見 `no7_recurring.md` 的去向 |
| C-RC-034 | 更新排程刪除自此筆日期當日起的所有原實例 | 見 `no7_recurring.md` 的去向 |
| C-RC-036 | 新排程自該日期依新規則補產生實例至當前時間 | 見 `no7_recurring.md` 的去向 |
| C-RC-039 | 刪除排程選此筆及未來時刪除自此筆日期起的實例 | 見 `no7_recurring.md` 的去向 |
| C-RC-042 | 復原依截斷前快照、不重查實例 | 見 `no7_recurring.md` 的去向 |
| C-RC-055 | 補產生以當前時刻為截止點 | 見 `no7_recurring.md` 的去向 |
| C-RC-056 | 補產生以絕對時刻判定、不依時區日界 | 見 `no7_recurring.md` 的去向 |
| C-RC-057 | 補產生僅處理該使用者的排程 | 見 `no7_recurring.md` 的去向 |
| C-RC-068 | 實例日期晚於當前時間時結束該排程迴圈 | 見 `no7_recurring.md` 的去向 |
| C-RC-069 | 實例日期晚於 `endOn` 時結束該排程迴圈 | 見 `no7_recurring.md` 的去向 |
| C-RC-071 | 已軟刪除的實例視為已存在、不重建 | 見 `no7_recurring.md` 的去向 |
| C-RC-072 | 補產生的實例帶入 `date`、`scheduleId`、實例日 | 見 `no7_recurring.md` 的去向 |
| C-RC-074 | 同使用者並行呼叫共用同一進行中執行 | 見 `no7_recurring.md` 的去向 |
| C-RC-075 | 前景恢復不觸發補產生定期交易 | 見 `no7_recurring.md` 的去向 |
| C-CU-001 | 進入主要貨幣畫面時目前選取貨幣置頂 | 見 `no8_currency_rates.md` 的去向 |
| C-CU-003 | 掛載時無命中選取則採純次要排序 | 見 `no8_currency_rates.md` 的去向 |
| C-CU-004 | 貨幣項目顯示代碼與名稱 | 見 `no8_currency_rates.md` 的去向 |
| C-CU-005 | 目前選取貨幣項目顯示選取標記 | 見 `no8_currency_rates.md` 的去向 |
| C-CU-006 | 輸入搜尋文字依代碼或名稱即時篩選 | 見 `no8_currency_rates.md` 的去向 |
| C-CU-007 | 點按貨幣項目標為目前選取 | 見 `no8_currency_rates.md` 的去向 |
| C-CU-008 | 點按完成按鈕呼叫設定主要貨幣並返回 | 見 `no8_currency_rates.md` 的去向 |
| C-CU-009 | 點按關閉按鈕返回上一頁、不套用選取 | 見 `no8_currency_rates.md` 的去向 |
| C-CU-012 | 貨幣格式列表無搜尋結果時顯示找不到結果 | 見 `no8_currency_rates.md` 的去向 |
| C-CU-014 | 貨幣顯示格式標題為貨幣代碼、副標為名稱 | 見 `no8_currency_rates.md` 的去向 |
| C-CU-022 | 點按重置為預設值呼叫重置並回復預設位數 | 見 `no8_currency_rates.md` 的去向 |
| C-CU-023 | 點按完成呼叫設定貨幣格式並返回 | 見 `no8_currency_rates.md` 的去向 |
| C-CU-024 | 匯率列表資料由帳戶幣別對產出 | 見 `no8_currency_rates.md` 的去向 |
| C-CU-027 | 尚未設定任何匯率時顯示空狀態提示 | 見 `no8_currency_rates.md` 的去向 |
| C-CU-028 | 輸入搜尋依外幣或主要貨幣代碼即時篩選 | 見 `no8_currency_rates.md` 的去向 |
| C-CU-029 | 匯率列表無搜尋結果時顯示找不到結果 | 見 `no8_currency_rates.md` 的去向 |
| C-CU-035 | 幣別選擇 modal 內可搜尋幣別清單 | 見 `no8_currency_rates.md` 的去向 |
| C-CU-036 | 幣別選擇 modal 無搜尋結果時依列表政策顯示空狀態 | 見 `no8_currency_rates.md` 的去向 |
| C-CU-043 | 點按完成呼叫手動新增匯率、成功後返回 | 見 `no8_currency_rates.md` 的去向 |
| C-CU-044 | 操作失敗時顯示錯誤提示 | 見 `no8_currency_rates.md` 的去向 |
| C-CU-045 | 查找匯率合併正向與反向的所有交易對 | 見 `no8_currency_rates.md` 的去向 |
| C-CU-046 | 最新記錄為反向時回傳其匯率的倒數 | 見 `no8_currency_rates.md` 的去向 |
| C-CU-050 | 無任何已生效記錄時回傳匯率 1 | 見 `no8_currency_rates.md` 的去向 |
| C-CU-054 | 建立初始匯率的值固定為 1、僅作佔位 | 見 `no8_currency_rates.md` 的去向 |
| C-CU-058 | 該幣別對已有記錄時不重複種入佔位 | 見 `no8_currency_rates.md` 的去向 |
| C-CU-059 | 匯入不呼叫建立初始匯率 | 見 `no8_currency_rates.md` 的去向 |
| C-CU-061 | 匯率不設單一寫死上限、由輸入位數界定量級 | 見 `no8_currency_rates.md` 的去向 |
| C-CU-062 | 兩端帳戶皆在已選清單的轉帳回不顯示 | 見 `no8_currency_rates.md` 的去向 |
| C-CU-063 | 兩端帳戶皆不在已選清單的轉帳回不顯示 | 見 `no8_currency_rates.md` 的去向 |
| C-CU-064 | 轉出方在清單且非主要貨幣時換算為主要貨幣支出 | 見 `no8_currency_rates.md` 的去向 |
| C-CU-065 | 轉出方在清單且為主要貨幣時直接以轉出金額顯示 | 見 `no8_currency_rates.md` 的去向 |
| C-CU-066 | 轉入方在清單且非主要貨幣時換算為主要貨幣收入 | 見 `no8_currency_rates.md` 的去向 |
| C-CU-067 | 貨幣 `minorUnits` 取該貨幣定義值 | 見 `no8_currency_rates.md` 的去向 |
| C-CU-068 | 未知貨幣 `minorUnits` fallback 為 2、不設特例 | 見 `no8_currency_rates.md` 的去向 |
| C-CU-069 | 小數位優先序為使用者設定大於 TWD 例外大於 minorUnits | 見 `no8_currency_rates.md` 的去向 |
| C-CU-070 | TWD 無使用者覆寫時預設 0 位小數 | 見 `no8_currency_rates.md` 的去向 |
| C-CU-071 | TWD 例外會被使用者設定的小數位覆寫 | 見 `no8_currency_rates.md` 的去向 |
| C-CU-072 | 無對應貨幣 id 時回 2 位小數且千分位關閉 | 見 `no8_currency_rates.md` 的去向 |
| C-CU-073 | 無 CurrencyConfig 時千分位視為關閉 | 見 `no8_currency_rates.md` 的去向 |
| C-CU-075 | 千分位啟用時整數縮放金額先除以一千 | 見 `no8_currency_rates.md` 的去向 |
| C-CU-076 | 結果再除以一萬還原為主單位數值 | 見 `no8_currency_rates.md` 的去向 |
| C-ST-001 | 設定列表分組以空白間距區隔、不顯示分組標題 | 見 `no9_settings_deletion.md` 的去向 |
| C-ST-002 | 設定第一組含類別管理、帳戶管理、資料管理三入口 | 見 `no9_settings_deletion.md` 的去向 |
| C-ST-003 | 設定第二組含偏好設定入口 | 見 `no9_settings_deletion.md` 的去向 |
| C-ST-004 | 未訂閱付費版時顯示升級入口 | 見 `no9_settings_deletion.md` 的去向 |
| C-ST-005 | 已訂閱付費版時不顯示升級入口 | 見 `no9_settings_deletion.md` 的去向 |
| C-ST-006 | App 版本號錨定畫面底部置中顯示 | 見 `no9_settings_deletion.md` 的去向 |
| C-ST-007 | 列表不足一頁時版本號仍貼齊畫面底部 | 見 `no9_settings_deletion.md` 的去向 |
| C-ST-008 | 列表超過一頁時版本號接於列表末端隨內容捲動 | 見 `no9_settings_deletion.md` 的去向 |
| C-ST-014 | 偏好第一組含啟動模式入口並顯示當前值 | 見 `no9_settings_deletion.md` 的去向 |
| C-ST-015 | 偏好第二組含主要貨幣、貨幣格式、匯率管理 | 見 `no9_settings_deletion.md` 的去向 |
| C-ST-016 | 主要貨幣入口顯示當前設定的貨幣代碼 | 見 `no9_settings_deletion.md` 的去向 |
| C-ST-018 | 語系入口顯示當前 App 語言 | 見 `no9_settings_deletion.md` 的去向 |
| C-ST-019 | 時區入口顯示當前設定的時區 | 見 `no9_settings_deletion.md` 的去向 |
| C-ST-020 | 週起始日入口顯示當前選項 | 見 `no9_settings_deletion.md` 的去向 |
| C-ST-024 | 刪除進行中第五組按鈕全部停用 | 見 `no9_settings_deletion.md` 的去向 |
| C-ST-026 | 切換分析同意開關呼叫設定並即時生效 | 見 `no9_settings_deletion.md` 的去向 |
| C-ST-027 | 點按登出顯示確認對話框並預告換帳號可清資料 | 見 `no9_settings_deletion.md` 的去向 |
| C-ST-028 | 確認登出成功後導航至登入畫面 | 見 `no9_settings_deletion.md` 的去向 |
| C-ST-029 | 登出失敗時顯示錯誤提示 | 見 `no9_settings_deletion.md` 的去向 |
| C-ST-030 | 主題設定以 Modal 呈現、非使用者偏好流程入口 | 見 `no9_settings_deletion.md` 的去向 |
| C-ST-032 | 當前已選主題右上以勾選 overlay 標示 | 見 `no9_settings_deletion.md` 的去向 |
| C-ST-033 | 主題設定點關閉不套用變更 | 見 `no9_settings_deletion.md` 的去向 |
| C-ST-034 | 主題設定點完成呼叫切換主題並關閉 Modal | 見 `no9_settings_deletion.md` 的去向 |
| C-ST-036 | 目前選取啟動模式顯示選取標記 | 見 `no9_settings_deletion.md` 的去向 |
| C-ST-037 | 啟動模式點完成呼叫設定並返回 | 見 `no9_settings_deletion.md` 的去向 |
| C-ST-040 | 語系項目以原生名稱呈現、不附中文譯名 | 見 `no9_settings_deletion.md` 的去向 |
| C-ST-042 | 語系搜尋依代碼或原生名稱即時篩選 | 見 `no9_settings_deletion.md` 的去向 |
| C-ST-043 | 語系無搜尋結果時顯示找不到結果 | 見 `no9_settings_deletion.md` 的去向 |
| C-ST-044 | 語系點完成呼叫設定語系並返回 | 見 `no9_settings_deletion.md` 的去向 |
| C-ST-048 | 時區點完成呼叫設定時區、點關閉不套用 | 見 `no9_settings_deletion.md` 的去向 |
| C-ST-050 | 週起始日點完成呼叫設定並返回 | 見 `no9_settings_deletion.md` 的去向 |
| C-ST-051 | 切換主題時非同步寫入 Settings 表 | 見 `no9_settings_deletion.md` 的去向 |
| C-ST-052 | 設定主要貨幣時為每個不同幣別帳戶種佔位匯率 | 見 `no9_settings_deletion.md` 的去向 |
| C-ST-053 | 已有匯率記錄的幣別對不重複種入 | 見 `no9_settings_deletion.md` 的去向 |
| C-ST-054 | 設定語系時同步切換 App 執行期介面語系 | 見 `no9_settings_deletion.md` 的去向 |
| C-ST-059 | 未傳入的欄位不受影響 | 見 `no9_settings_deletion.md` 的去向 |
| C-ST-060 | 以 dot notation 更新、不覆寫整個偏好物件 | 見 `no9_settings_deletion.md` 的去向 |
| C-ST-062 | 任一欄位轉換後為空值或 Null 時略過不寫入 | 見 `no9_settings_deletion.md` 的去向 |
| C-ST-063 | 自動更新文件根層更新時間、無論傳入欄位數量 | 見 `no9_settings_deletion.md` 的去向 |
| C-ST-066 | 偏好上傳不做付費等級篩選、全 user 享有 | 見 `no9_settings_deletion.md` 的去向 |
| C-DA-003 | 訂閱中多一顆直達 App Store 訂閱管理的按鈕 | 見 `no9_settings_deletion.md` 的去向 |
| C-DA-011 | 裝置離線時拋網路錯誤並中止、不進任何副作用 | 見 `no9_settings_deletion.md` 的去向 |
| C-DA-013 | 記憶體旗標使備份與授權補驗即時跳過 | 見 `no9_settings_deletion.md` 的去向 |
| C-DA-016 | Apple 門以刷新模式喚起授權取得當次授權碼 | 見 `no9_settings_deletion.md` 的去向 |
| C-DA-017 | Google 門不喚 Apple 面板、payload 為空物件 | 見 `no9_settings_deletion.md` 的去向 |
| C-DA-021 | 委派結果不明時持久旗標維持已送出並拋錯 | 見 `no9_settings_deletion.md` 的去向 |
| C-DA-029 | 刪除完成後觸發登出並回到登入牆 | 見 `no9_settings_deletion.md` 的去向 |
| C-DA-035 | 重跑硬刪刪除零列、天然冪等 | 見 `no9_settings_deletion.md` 的去向 |

---

## 統計

- 前一版 1315 條、本版 1481 條
- 斷言相符可機械對照 625 條（48%）
- 其餘 690 條經改寫或拆併，依分冊去向查
- 本版淨增 166 條，來自補抽與拆分，扣除跨域重複條的刪除
