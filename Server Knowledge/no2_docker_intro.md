# Docker 介紹

## Docker 是什麼?

Docker 是一個疊在 OS 上的 Application,它的核心工作是打包與隔離應用程式 Application 的執行環境。

它能讓你把你的應用程式,例如你的記帳 App 後端,連同它運作所需的一切,例如特定版本的 Python、特定的函式庫,全部打包成一個標準化的箱子。這個箱子就叫做 Container 容器。

這個箱子是自給自足的,你可以把它搬到任何有安裝 Docker 的機器上,你同事的 Mac、公司的 Linux 伺服器,它都能保證 100% 完美執行,完全不受外界環境干擾。

---

## Docker 存在的目的

Docker 解決的核心問題是: 在我的電腦上可以跑,為什麼在你的電腦上或伺服器上就跑不起來?

這個問題通常是因為軟體環境不一致造成的,例如 Python 版本不同、函式庫版本衝突。Docker 透過打包這個動作,確保了 App 在開發、測試、上線時,所處的環境永遠保持一致。

---

## Docker 實際做了什麼事

這就是你最想知道的核心機制。Docker 並不是像 VM 虛擬機器那樣模擬假硬體,而是更聰明地利用 Linux 作業系統核心 Kernel 內建的兩項功能來達成隔離:

- **使用 Namespaces 命名空間來欺騙 App**
    - 這是 Docker 執行隔離的關鍵動作。當你啟動一個 Container 時,Docker 會對 Linux 核心說: 請幫我建立一個專屬的泡泡 Namespace,然後把這個 App 放進去。
    - 這個泡泡會徹底欺騙 App 的視野:
        - **檔案系統隔離 Mount Namespace:** App 在泡泡裡往硬碟看,只看得到它自己箱子裡的檔案,例如 `Python 3.9`。它完全看不到主機上真正的檔案,例如主機上的 `Python 3.11`。
        - **行程隔離 PID Namespace:** App 在泡泡裡以為自己是系統上唯一的程式 PID 1,它看不到主機上跑的其他任何程式。
        - **網路隔離 Network Namespace:** App 在泡泡裡以為自己獨佔了網路卡和 IP 位址。
- **使用 Cgroups 控制群組來限制 App**
    - 光有隔離還不夠,如果 App 在泡泡裡把主機 100% 的 CPU 都吃光怎麼辦?
    - `Cgroups` 就是用來限制資源的。Docker 會對 Linux 核心說: 剛剛那個泡泡 Container,我限制它最多只能使用 1 顆 CPU 和 2GB 記憶體。

**總結動作:** Docker 並不創造新硬體或新 OS。它只是利用 `Namespaces` 欺騙 App 讓它以為自己是獨立的,並利用 `Cgroups` 限制 App 能用的資源。

---

## Docker 與作業系統的關係

因為 Docker 的核心動作 `Namespaces` 和 `Cgroups` 是 Linux 核心的內建功能,所以:

- **在 Linux 電腦上:** Docker 是原生的。它直接使用主機的 Linux 核心,效能最好。
    - **架構:** `硬體` → `Linux OS` → `Docker 軟體` → `[Container]`
- **在 Windows / Mac 電腦上:** 這兩個系統沒有 `Namespaces` 和 `Cgroups`。因此,你安裝的 `Docker Desktop` 應用程式,實際上是一個管理者。
    - 它會在背景偷偷啟動一台輕量級的 Linux VM 虛擬機器。
    - 你下的所有 Docker 指令,都會被轉發到那台隱藏的 Linux VM 裡面去執行。
    - **架構:** `硬體` → `Mac/Windows OS` → `Docker Desktop App` → `隱藏的 Linux VM` → `Docker 軟體` → `[Container]`

---

## 最終對比: Docker vs. VM

- **VM 虛擬機器:**
    - **做了什麼:** 模擬並切割硬體。
    - **結果:** 在 1 台實體機上跑多個獨立的作業系統 OS。
    - **特性:** 笨重 GB 等級、啟動慢分鐘級、隔離性最強。
- **Docker 容器:**
    - **做了什麼:** 隔離並限制軟體環境,使用 `Namespaces` 和 `Cgroups`。
    - **結果:** 在 1 個作業系統上跑多個獨立的應用程式 App。
    - **特性:** 輕量 MB 等級、啟動快秒級、隔離性較弱,因為共用 OS 核心。

AWS 的 EC2 就是一台 VM 虛擬機器。

所以,當你在這台 EC2,也就是 VM,裡面安裝了 Linux OS,然後再安裝 Docker,你做的就正是我們前面提到的模式三:

`硬體 AWS的機房` → `虛擬化軟體 AWS 幫你管` → `VM 你租的 EC2` → `OS 你安裝的 Linux` → `Docker 軟體` → `[Container 1] [Container 2] ...`

你把它理解為在 VM 上面疊 Docker,是完全正確的觀念。這也是目前公有雲上最主流、最常見的作法。

---

## 實作範例: 從零開始

我們來完整走一遍,從 0 開始。

- **你的起點:** 一台 Mac 電腦。
- **我們的目標:** 開發一個簡單的 Python Web App,並用 Docker 成功在你的 Mac 上隔離執行它。

---

## 在 Mac 上安裝 Docker

- **下載:** 你打開 Chrome 瀏覽器,前往 [docker.com](https://www.docker.com/)。
- **安裝:** 你下載 `Docker Desktop for Mac`,像安裝其他 App 一樣,把它拖到應用程式資料夾。
- **啟動:** 你點開 Docker Desktop。
- **背後動作:** 此時,Docker Desktop 在你的 Mac 背景中,偷偷啟動了一台輕量級的 Linux VM。你 Mac 上的終端機 Terminal 現在已經準備好跟這台隱藏的 VM 下指令了。

---

## 開發你的 Application

你在 Mac 的桌面上建立一個資料夾,叫做 `my-web-app`。

在這個資料夾裡,你用 VS Code 建立 3 個檔案:

### app.py

這是一個使用 `Flask` 函式庫的超迷你網站伺服器。

```python
from flask import Flask
import os

# 建立一個 Flask app
app = Flask(__name__)

# 當有人瀏覽網站根目錄 ("/") 時,執行這個函數
@app.route('/')
def hello():
    # 我們從環境變數讀取一個名字,如果沒有就用 "World"
    name = os.environ.get('NAME', 'World')
    return f"Hello, {name}! This is running inside a Container."

# 啟動伺服器,監聽 port 5000
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
```

### requirements.txt

這告訴 Python 這個 App 需要安裝什麼函式庫。

```
Flask==2.0.0
```

### Dockerfile

這個檔案沒有副檔名。這是你寫給 Docker 的食譜,告訴 Docker 如何建立 Image。

```dockerfile
# 告訴 Docker 從一個基礎 Image 開始
# 我們選一個官方的、已經裝好 Python 3.9 的精簡版 Linux
FROM python:3.9-slim

# 在箱子內部建立一個工作資料夾
WORKDIR /app

# 把 Mac 上的檔案複製到箱子內部
# 先複製依賴清單
COPY requirements.txt .

# 在箱子內部執行指令,安裝依賴函式庫
RUN pip install -r requirements.txt

# 把 App 程式碼也複製進去
COPY app.py .

# 告訴 Docker,當這個箱子被啟動時,要執行什麼指令
# 就是 `python app.py`
CMD ["python", "app.py"]
```

---

## 建立 Image

現在你的 `my-web-app` 資料夾裡有 3 個檔案了。

- 你打開 Mac 的終端機 Terminal。
- `cd` 切換目錄到你的資料夾:

```bash
cd ~/Desktop/my-web-app
```

- 你對 Docker 下達 Build 建立指令:

```bash
docker build -t my-hello-image .
```

- `docker build`: 建立 Image 的指令。
- `-t my-hello-image`: `-t` 是 tag 標籤,你幫這個 Image 取名叫 `my-hello-image`。
- `.`: `.` 代表用當前資料夾裡的 Dockerfile 當作食譜。

**Docker 這時做了什麼事?**

Docker 會開始讀你的 `Dockerfile`,一行一行執行,這一切都發生在那台隱藏的 Linux VM 裡:

- 好,我去下載 `python:3.9-slim`... 載好了。
- 在裡面建立 `/app` 資料夾... 好了。
- 把 `requirements.txt` 複製進去... 好了。
- 執行 `pip install Flask==2.0.0`... 裝好了。
- 把 `app.py` 複製進去... 好了。
- 記住啟動指令是 `python app.py`... 記住了。
- 打包完成!

**結果:** 一個名叫 `my-hello-image` 的 Image 映像檔已經被建立好,靜靜地躺在 Docker 的儲存區了。它就是那個靜止的、打包好的箱子。

---

## Run Container

Image 只是個模板,本身不會動。我們要 Run 執行它。

你繼續在終端機輸入:

```bash
docker run -d -p 8080:5000 -e NAME="Gemini" --name my-running-app my-hello-image
```

這串指令做了超多事,我們拆解它:

- `docker run`: 啟動 Container 的指令。
- `-d`: 在背景 Detached 執行,不要卡住我的終端機。
- `-p 8080:5000`: `-p` 是 port 連接埠。意思是: 把我 Mac 的 8080 埠連接到 Container 內部的 5000 埠,因為我們的 App 在 5000 埠上監聽。
- `-e NAME="Gemini"`: `-e` 是 Environment 環境變數。我們塞了一個變數 `NAME`,值是 `Gemini` 進去,App 程式碼會讀這個。
- `--name my-running-app`: 幫這個正在運行的 Container 取個名字,叫 `my-running-app`。
- `my-hello-image`: 告訴 Docker 要用哪一個 Image 模板來啟動。

**Docker 這時做了什麼事?**

- 收到!我要用 `my-hello-image` 模板。
- 建立一個新的 Container 實例。
- 使用 `Namespaces` 和 `Cgroups` 把它隔離起來。
- 設定好網路,把 Mac:8080 連到 Container:5000。
- 塞入環境變數 `NAME=Gemini`。
- 執行 Image 裡指定的 `CMD` 指令: `python app.py`。

**結果:** 你的 App 現在正在 Container 裡面運行了。它在那個泡泡裡,使用著 `Python 3.9` 和 `Flask`,監聽著泡泡裡的 5000 埠。

---

## 驗證結果

你打開 Mac 上的 Chrome 瀏覽器。

在網址列輸入: `http://localhost:8080`

你按下 Enter。

- 瀏覽器向你的 Mac localhost 的 8080 埠發出請求。
- Docker 透過 `-p 8080:5000` 的設定,把這個請求轉發到 Container 內部的 5000 埠。
- Container 裡的 Flask App 收到了請求,執行 `hello()` 函數,讀到了 `NAME="Gemini"`。
- App 回傳了字串。
- Docker 再把這個字串轉發回你的瀏覽器。

**你在瀏覽器上會看到:**

```
Hello, Gemini! This is running inside a Container.
```

**恭喜你!** 你的 App 完全在 Docker Container 的隔離環境中成功執行,而你的 Mac 本身主機可能連 `Flask` 都沒有安裝,但 App 照樣跑起來了。這就是 Docker 的威力。

---
