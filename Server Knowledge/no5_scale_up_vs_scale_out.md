# Scale-Up vs Scale-Out

## 兩種擴展方式

- **Scale-Up 垂直擴展**
    - **做了什麼:** 讓單一台伺服器變得更強大。
    - **動作:** 增加 CPU、增加 RAM、更換更快的硬碟。
    - **比喻:** 你不找幫手,你選擇自己去健身房,把自己練得更壯。
- **Scale-Out 水平擴展**
    - **做了什麼:** 增加更多台伺服器來分攤工作。
    - **動作:** 將 1 台伺服器,複製成 10 台一模一樣的伺服器,並在它們前面放一個負載平衡器 Load Balancer 來分發請求。
    - **比喻:** 你不把自己練壯,你選擇打電話叫 9 個兄弟來幫你一起幹活。

---

## EC2 與 Fargate 的擴展方式比較

這兩者在擴展性上的哲學有著根本的不同。EC2 是 IaaS 基礎設施,Fargate 是 Serverless 無伺服器。

| **特性** | **EC2 IaaS 模式** | **Fargate Serverless 模式** |
| --- | --- | --- |
| **服務模型** | 你租用的是整台 VM 虛擬機器。你必須自己管理 VM 裡的 OS、Docker、App。 | 你提供的是 Container Image 藍圖。你完全不用管理 VM 或 OS。 |
| **Scale-Up 垂直擴展** | **可行,但手動且緩慢**<br>**做法:**<br>- 你必須停止你的 EC2 VM。<br>- 更改它的規格,例如 `t3.small` → `t3.large`。<br>- 重開機。<br>**缺點:** 需要手動介入且服務會中斷。 | **哲學上不支援**<br>你不能升級一台正在運行的 Fargate 任務。你必須重新定義你的服務藍圖,例如 `1vCPU/2GB` → `2vCPU/4GB`,然後重新部署一個新的、更強的 Container 來取代舊的。 |
| **Scale-Out 水平擴展** | **可行,但笨重且緩慢**<br>**做法:**<br>- 你設定 Auto Scaling Group。<br>- 觸發時,AWS 會啟動一台完整的 EC2 VM。<br>- 這台 VM 需要幾分鐘來開機、安裝 OS 更新、啟動 Docker、拉取 Image、最後才啟動 Container。<br>- 你必須自己設定 Load Balancer。 | **這是它唯一的擴展方式**<br>**做法:**<br>- 你設定 Service Auto Scaling。<br>- 觸發時,Fargate 會啟動一台微型 VM micro-VM。<br>- 這台 micro-VM 只需幾秒鐘就能啟動並執行你的 Container。<br>- 自動與 Load Balancer 整合。 |
| **擴展哲學** | **手動管理、少數、大型的 VM**<br>你傾向於租用少數幾台、規格強大的 VM,並盡可能塞滿它們。擴展是一個緩慢、重大的操作。 | **自動複製、大量、小型的 Container**<br>你定義一個標準化的最小運算單元,例如 `1vCPU/2GB`。Fargate 的工作就是自動且快速地複製這個單元來應對流量。 |

---
