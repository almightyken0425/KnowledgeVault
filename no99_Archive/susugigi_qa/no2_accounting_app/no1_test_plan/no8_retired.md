# 退場登記

## 文件定位

- 已退場檢驗點的清冊，記各條的退場理由與後繼
- 退場採原地標記，列仍留在原分冊、ID 不回收
- 分冊的 `狀態` 欄是判定依據，本檔是它的展開
- 生成自 `no8_retirement.data.json`，不手抄

---

## 為什麼不物理刪除

三個理由，任一成立就不該刪列。

- `no5_id_migration.md` 有列指向這些 ID，物理移出立刻懸空
- Impl 測試碼與 git 歷史仍引用這些 ID
- 這個 repo 會 revert。行為若被推回來，改一個欄值就復活，重編 ID 則要斷追溯鏈

原地退場的成本與物理刪除相同，且可逆。

---

## 退場的判準

一條檢驗點退場，要滿足下列任一且有機械證據。

- **錨檔不存在**——impl 錨指向的檔已刪除，判準落點消失
- **錨成員不存在**——檔還在、該 export 或具名函式已刪除
- **觸發點消失**——進入該行為的唯一路徑已拆除，殘存性質由後繼條目覆蓋

只有措辭或機制變動、行為仍在者不退場，走改寫。改寫需逐條讀 impl 現碼，不在機械修的範圍。

---

## 統計

<!-- GENERATED:retirement-summary -->
| 退場理由 | 條數 |
| --- | --- |
| 錨檔 src/screens/Auth/LoginScreen.tsx 已隨無帳號整改刪除 | 12 |
| 錨檔 src/services/premiumStatusCache.ts 已隨無帳號整改刪除 | 10 |
| 觸發點隨登入牆拔除而消失 | 9 |
| 登入管線隨兩登入門一起拆除，AuthContext 已無 signIn | 5 |
| 錨成員 resetAllData 已刪除，行為不復存在 | 5 |
| 錨檔 src/services/entitlementTier.ts 已隨無帳號整改刪除 | 5 |
| 錨成員 detectAccountSwitch 已刪除，行為不復存在 | 1 |
| 錨成員 getAppleAuthorizationCode 已刪除，行為不復存在 | 1 |
| 錨成員 subscribeEntitlement 已刪除，行為不復存在 | 1 |
| **合計** | **49** |
<!-- /GENERATED:retirement-summary -->

---

## 逐條清冊

`後繼` 欄指向承接該行為殘存性質的檢驗點。填 `—` 代表行為整個消失、無承接者。

<!-- GENERATED:retirement-table -->
| 檢驗點 | P | 分冊 | 斷言 | 退場理由 | 後繼 |
| --- | --- | --- | --- | --- | --- |
| C-BT-005 | P2 | `no1_boot_identity.md` | 登入畫面顯示品牌標誌 | 錨檔 src/screens/Auth/LoginScreen.tsx 已隨無帳號整改刪除 | — |
| C-BT-006 | P1 | `no1_boot_identity.md` | Google 與 Apple 登入按鈕並排顯示 | 錨檔 src/screens/Auth/LoginScreen.tsx 已隨無帳號整改刪除 | — |
| C-BT-007 | P2 | `no1_boot_identity.md` | 登入按鈕僅含提供者圖示、無文字標籤 | 錨檔 src/screens/Auth/LoginScreen.tsx 已隨無帳號整改刪除 | — |
| C-BT-008 | P1 | `no1_boot_identity.md` | Apple 登入按鈕僅 iOS 平台顯示 | 錨檔 src/screens/Auth/LoginScreen.tsx 已隨無帳號整改刪除 | — |
| C-BT-009 | P1 | `no1_boot_identity.md` | 登入載入中被點按鈕顯示載入狀態 | 錨檔 src/screens/Auth/LoginScreen.tsx 已隨無帳號整改刪除 | — |
| C-BT-010 | P1 | `no1_boot_identity.md` | 登入載入中兩鈕皆不可點按 | 錨檔 src/screens/Auth/LoginScreen.tsx 已隨無帳號整改刪除 | — |
| C-BT-011 | P2 | `no1_boot_identity.md` | 頁尾條款引導文字與其下兩連結相連成完整語意 | 錨檔 src/screens/Auth/LoginScreen.tsx 已隨無帳號整改刪除 | — |
| C-BT-012 | P2 | `no1_boot_identity.md` | 頁尾條款引導文字不重複條款名稱 | 錨檔 src/screens/Auth/LoginScreen.tsx 已隨無帳號整改刪除 | — |
| C-BT-013 | P2 | `no1_boot_identity.md` | 頁尾顯示使用條款與隱私政策兩連結 | 錨檔 src/screens/Auth/LoginScreen.tsx 已隨無帳號整改刪除 | — |
| C-BT-014 | P2 | `no1_boot_identity.md` | 頁尾顯示版權文字 | 錨檔 src/screens/Auth/LoginScreen.tsx 已隨無帳號整改刪除 | — |
| C-BT-015 | P2 | `no1_boot_identity.md` | 點按使用條款連結開啟外部頁面 | 錨檔 src/screens/Auth/LoginScreen.tsx 已隨無帳號整改刪除 | — |
| C-BT-016 | P2 | `no1_boot_identity.md` | 點按隱私政策連結開啟外部頁面 | 錨檔 src/screens/Auth/LoginScreen.tsx 已隨無帳號整改刪除 | — |
| C-BT-017 | P1 | `no1_boot_identity.md` | 兩登入門共用單一登入管線 | 登入管線隨兩登入門一起拆除，AuthContext 已無 signIn | — |
| C-BT-018 | P1 | `no1_boot_identity.md` | Google 門走 Google 程序、不碰 Apple | 登入管線隨兩登入門一起拆除，AuthContext 已無 signIn | — |
| C-BT-019 | P1 | `no1_boot_identity.md` | Apple 門走 Apple 面板、不碰 Google | 登入管線隨兩登入門一起拆除，AuthContext 已無 signIn | — |
| C-BT-020 | P0 | `no1_boot_identity.md` | 兩門帳號各自獨立、不連結不合併 | 登入管線隨兩登入門一起拆除，AuthContext 已無 signIn | — |
| C-BT-021 | P1 | `no1_boot_identity.md` | 認證程序遭取消時顯示登入失敗提示且不續行 | 登入管線隨兩登入門一起拆除，AuthContext 已無 signIn | — |
| C-BT-025 | P1 | `no1_boot_identity.md` | 登入成功後依啟動模式導航至初始落點 | 觸發點隨登入牆拔除而消失 | C-BT-103 |
| C-BT-026 | P1 | `no1_boot_identity.md` | 登入成功且付費牆攔截時導航至付費牆 | 觸發點隨登入牆拔除而消失 | C-BT-108 |
| C-BT-027 | P0 | `no1_boot_identity.md` | 登出保留本地帳務資料、不執行清除 | 觸發點隨登入牆拔除而消失 | — |
| C-BT-028 | P1 | `no1_boot_identity.md` | 登出觸發 Firebase Auth 登出並清除本地憑證 | 觸發點隨登入牆拔除而消失 | C-BT-084 |
| C-BT-030 | P1 | `no1_boot_identity.md` | 重新登入同帳號時上傳本機偏好至雲端 | 觸發點隨登入牆拔除而消失 | C-BT-043 |
| C-BT-031 | P1 | `no1_boot_identity.md` | 重新登入同帳號時委派交易備份 | 觸發點隨登入牆拔除而消失 | C-BT-114 |
| C-BT-032 | P0 | `no1_boot_identity.md` | 偵測不同帳號時明示詢問保留或清除、不自動清除 | 錨成員 detectAccountSwitch 已刪除，行為不復存在 | — |
| C-BT-033 | P0 | `no1_boot_identity.md` | 選擇清除時硬重置本機資料庫、不分 userId | 觸發點隨登入牆拔除而消失 | — |
| C-BT-034 | P0 | `no1_boot_identity.md` | 換帳號清除採硬重置、不傳播雲端刪除標記 | 觸發點隨登入牆拔除而消失 | C-BT-090 |
| C-BT-035 | P1 | `no1_boot_identity.md` | 選擇清除時連帶清前一帳號授權快取 | 錨檔 src/services/premiumStatusCache.ts 已隨無帳號整改刪除 | — |
| C-BT-036 | P1 | `no1_boot_identity.md` | 清除前一帳號快取時不動當前帳號快取 | 錨檔 src/services/premiumStatusCache.ts 已隨無帳號整改刪除 | — |
| C-BT-037 | P1 | `no1_boot_identity.md` | 選擇保留時前一帳號授權快取不動 | 錨檔 src/services/premiumStatusCache.ts 已隨無帳號整改刪除 | — |
| C-BT-038 | P0 | `no1_boot_identity.md` | 選擇保留時本機資料原樣續用 | 觸發點隨登入牆拔除而消失 | — |
| C-BT-070 | P0 | `no1_boot_identity.md` | Apple 門以刷新模式喚起原生授權 | 錨成員 getAppleAuthorizationCode 已刪除，行為不復存在 | — |
| C-BT-083 | P1 | `no1_boot_identity.md` | 刪除完成後清除該帳號的本地授權快取 | 錨檔 src/services/premiumStatusCache.ts 已隨無帳號整改刪除 | — |
| C-DA-017 | P0 | `no12_data_sync.md` | 重置資料軟刪全部具墓碑欄的資料表 | 錨成員 resetAllData 已刪除，行為不復存在 | — |
| C-DA-018 | P0 | `no12_data_sync.md` | 重置資料僅標記當前帳號紀錄、不動其他帳號 | 錨成員 resetAllData 已刪除，行為不復存在 | — |
| C-DA-019 | P1 | `no12_data_sync.md` | 重置資料採軟刪除、紀錄仍留在本機 | 錨成員 resetAllData 已刪除，行為不復存在 | — |
| C-DA-020 | P0 | `no12_data_sync.md` | 重置資料的軟刪除傳播雲端刪除標記 | 錨成員 resetAllData 已刪除，行為不復存在 | — |
| C-DA-021 | P1 | `no12_data_sync.md` | 重置資料不動使用者、設定、貨幣顯示三表 | 錨成員 resetAllData 已刪除，行為不復存在 | — |
| C-DA-067 | P0 | `no12_data_sync.md` | 離線時付費帳號依本地授權快取維持等級、不降級 | 錨檔 src/services/premiumStatusCache.ts 已隨無帳號整改刪除 | — |
| C-SB-006 | P1 | `no2_subscription_quota.md` | 本地授權快取以帳號為範圍、他帳號讀不到 | 錨檔 src/services/premiumStatusCache.ts 已隨無帳號整改刪除 | — |
| C-SB-010 | P2 | `no2_subscription_quota.md` | 快取等級欄非數字時整筆視為無快取 | 錨檔 src/services/premiumStatusCache.ts 已隨無帳號整改刪除 | — |
| C-SB-011 | P2 | `no2_subscription_quota.md` | 不採用無帳號範圍的舊版裝置層快取 | 錨檔 src/services/premiumStatusCache.ts 已隨無帳號整改刪除 | — |
| C-SB-012 | P2 | `no2_subscription_quota.md` | 帳號識別碼為空時快取不讀不寫 | 錨檔 src/services/premiumStatusCache.ts 已隨無帳號整改刪除 | — |
| C-SB-059 | P1 | `no2_subscription_quota.md` | 無本地授權快取時推定為 LEVEL_0 | 錨檔 src/services/premiumStatusCache.ts 已隨無帳號整改刪除 | — |
| C-SB-061 | P1 | `no2_subscription_quota.md` | 授權來自後端即時回報時直接採其等級、不自行以到期日推翻 | 錨檔 src/services/entitlementTier.ts 已隨無帳號整改刪除 | — |
| C-SB-062 | P1 | `no2_subscription_quota.md` | 後端回報降級的授權記錄時照實降為 LEVEL_0 | 錨檔 src/services/entitlementTier.ts 已隨無帳號整改刪除 | — |
| C-SB-063 | P1 | `no2_subscription_quota.md` | 授權來自離線副本且到期日早於或等於當下時降為 LEVEL_0 | 錨檔 src/services/entitlementTier.ts 已隨無帳號整改刪除 | — |
| C-SB-064 | P1 | `no2_subscription_quota.md` | 授權來自離線副本且未過期時採其等級 | 錨檔 src/services/entitlementTier.ts 已隨無帳號整改刪除 | — |
| C-SB-065 | P2 | `no2_subscription_quota.md` | 離線授權副本無到期日時視為無期限、維持付費等級 | 錨檔 src/services/entitlementTier.ts 已隨無帳號整改刪除 | — |
| C-SB-066 | P2 | `no2_subscription_quota.md` | 授權記錄欄位型別不符時收斂為 LEVEL_0 與無到期日 | 錨成員 subscribeEntitlement 已刪除，行為不復存在 | — |
<!-- /GENERATED:retirement-table -->
