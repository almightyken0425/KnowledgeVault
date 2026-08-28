# DataBase Introduction

## 核心定義與概念解析

### 資料庫定義 DataBase DB Definition

- 依特定目的組織的資料集合體
- 可能非單一副檔名檔案

### 資料庫管理系統定義 DataBase Management System DBMS Definition

- 管理資料庫檔案的大型軟體應用程式
- 負責
  - 資料讀取寫入
  - 系統備份還原
  - 權限安全控管
  - 防衝突機制

### 類比對照

- DB > .csv
- DBMS > Excel or GoogleSheet

---

## 主流架構分類與代表性產品

### 關聯式資料庫 RDBMS

- `MySQL`
- `PostgreSQL`

### 非關聯式資料庫 NoSQL

- `MongoDB`
- `Redis`
- `Cassandra`

---

## 雲端部署與管理模式

### IaaS 基礎設施即服務

- 租用一台空白虛擬主機
- 操作方式為遠端連線進主機
- 連線後自行安裝 DBMS
- 連線後自行下指令操作 DBMS
- 代表服務:
  - `AWS EC2`
  - `Google Compute Engine`

### DBaaS 資料庫即服務

- 屬於 PaaS 的延伸服務
- 供應商代管已裝好的 DBMS
- 操作方式為雲端主控台 GUI
- 操作方式也可用 CLI 連線
- 應用程式仍需自行撰寫後端程式碼
- 後端程式碼透過連線字串呼叫 DBMS
- 代表服務:
  - `AWS RDS`
  - `Google Cloud SQL`

### BaaS 後端即服務

- 供應商代管整套後端服務
- 操作方式為前端直接用 SDK
- 不需自行撰寫後端程式碼
- 不需碰 DBMS 本身
- 代表服務:
  - `Firestore`
  - `SQL Connect`
