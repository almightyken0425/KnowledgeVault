# Serverless 介紹

## 什麼是 AWS Fargate? 從管理伺服器到提供藍圖

在雲端運算的世界裡,Serverless 無伺服器是一個響亮的詞,而 AWS Fargate 則是實現這個理念的核心服務之一。

但 Serverless 並不代表沒有伺服器,而是代表您開發者不需要管理伺服器。

Fargate 是一種無伺服器容器運算引擎。這句話的真正意思是: 開發者只需要提供打包好的應用程式藍圖 Image,Fargate 會自動處理執行它所需的一切底層設施。

這是一場責任分界線的革命。要理解 Fargate 帶來的變革,我們必須先看沒有 Fargate 的世界是什麼樣子。

---

## 傳統的雲端 IaaS 模式

在 Fargate 出現之前,在雲端運行容器 Container 的標準作法,是使用 IaaS 基礎設施即服務,例如 AWS EC2。

這就像是租一間空房子 VM。

### 開發者的責任

- **租用 VM:** 你必須自己決定要租多大的 EC2 VM,例如 2 vCPU, 4GB RAM。
- **管理 OS:** 你必須自己登入這台 VM,負責安裝作業系統 Linux 的安全更新、修補漏洞。
- **安裝軟體:** 你必須自己安裝並管理 Docker 軟體。
- **執行 App:** 你自己執行 `docker run` 來啟動你的 App Container。
- **手動擴展 Scale:** 當流量變大,這台 VM 不夠力時,你必須自己再去租第二台、第三台 VM,重複上述所有步驟,並手動設定 Load Balancer 負載平衡器來分發流量。
- **成本:** 無論有沒有流量,你都必須為這幾台 VM 開機 24 小時的費用買單。

**結論:** IaaS 雖然免去了管理實體硬體的麻煩,但開發者仍需花費大量精力在管理 VM 空房子這件髒活上。

---

## Fargate 的 Serverless 模式

Fargate 屬於 PaaS 平台即服務,它徹底改變了遊戲規則。它就像是只提供藍圖,管家幫你蓋好精裝屋。

### 開發者的責任

- **只做一件事:** 在自己的電腦上,把 App 和其依賴環境打包成一個標準化的 Image 映像檔或藍圖。

### Fargate 的責任

- **負責一切:** Fargate 拿走你的藍色藍圖 Image,然後在綠色黑盒子裡自動完成所有底層工作:
    - 啟動硬體 Hardware
    - 管理虛擬化 Hypervisor
    - 啟動 VM 並安裝 Docker
    - 執行你的 Container
    - 自動串接 Load Balancer

**結論:** 開發者的責任從管理 VM 大幅縮減到提供 Image。

---

## Fargate 的內部魔法: 安全且快速的 Scale-Out

Fargate 最大的價值在於自動水平擴展 Auto Scale-Out。

- **Scale-Out 水平擴展:** 當流量變大時,Fargate 不會去升級單一 VM Scale-Up。它會複製你的 App 實例,從 1 個變成 10 個、100 個,來分攤流量。
- **Scale-In 縮減:** 當半夜沒流量時,它會自動把 100 個實例關閉到只剩 1 個,替你省錢。

### 關鍵問題: Fargate 如何做到安全又快速?

這就是它的秘密武器: Firecracker 微型 VM。

- **VM 等級的安全隔離:** Fargate 不會把 10 個不同客戶的 Container 塞在同一台大 VM 裡,這樣不安全。它會為每一個運行的 `Task` Container 實例都啟動一台專屬的、全新的微型 VM Firecracker。這提供了硬體層級的隔離,確保你的 App 不會被鄰居干擾。
- **Container 等級的啟動速度:** 傳統 VM EC2 開機需要數分鐘,但 `Firecracker` 是一台極簡化的 VM,它被砍掉了所有不必要的功能,只為一件事而生: 安全地執行 Container。
    - **啟動速度:** 僅需 125 毫秒 ms。

**Fargate 架構總結:** `Fargate Service` 管理者會拿取你的 `Image` 藍圖,當需要擴展時,它會立刻透過 `Hypervisor` 啟動數十個 `Firecracker` 微型 VM,並在 VM 內部執行你的 `Container`。這讓你同時享有了 VM 的安全性和 Container 的靈活性。

---

## Fargate 在生態系中的角色

Fargate 只是運算引擎工人,它還需要交通警察和金庫才能組成一個完整的服務:

- **Load Balancer ALB 交通警察:**
    - 這是所有請求的單一入口。
    - 它負責把外部流量盲目且平均地分發給 Fargate 啟動的所有 Container 實例。
- **RDS 金庫:**
    - Fargate 上的 App 應該是無狀態 Stateless 的,只負責運算。
    - 所有需要永久保存的資料,如使用者帳號、訂單,都應存放在外部的有狀態 Stateful 資料庫服務中,例如 RDS。
    - 所有的 Fargate 工人,都會連線到同一個 RDS Master DB 去存取資料。

---

## 結語: 為什麼 Fargate 很重要?

Fargate 完美體現了 Serverless 的核心價值: 它讓開發者能 100% 專注在商業邏輯 App 程式碼上,而將基礎設施管理 VM、OS、擴展的複雜性完全外包給雲端平台。

這也解釋了為什麼,如先前文章所提,當 IAM 身份驗證服務出問題時,Fargate 會受到重創。因為 Fargate 每一次自動擴展並啟動新的 `Firecracker VM` 時,都必須先向 IAM 取得憑證,才能開始工作。一旦憑證無法核發,擴展就會立刻失敗。

---
