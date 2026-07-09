# Git 核心與圖形化工具

## 背景

- 開發者完成 Git 安裝後
    - 常接觸多種 Git 工具的討論
- 本文件說明
    - Git 核心與圖形化工具的關係

---

## Git 核心 CLI

- 定義：
    - CLI 全名 Command-Line Interface
    - 中文稱命令列介面
- 本體：
    - 終端機中執行的 `git` 指令
    - 安裝流程取得的 Git 核心
    - Git 的引擎與真實樣貌
- 優點：
    - 功能最完整
    - 速度最快
    - 跨平台通用
- 意義：
    - 開發者理解 Git 核心
    - 等同理解 Git 本質

---

## Git 圖形化工具 GUI

- 定義：
    - GUI 全名 Graphical User Interface
    - 中文稱圖形化使用者介面
- 比喻：
    - Git 核心的視覺化遙控器
- 常見工具：
    - 桌面應用程式：
        - Sourcetree
        - GitKraken
        - GitHub Desktop
        - 其他同類工具
    - 編輯器整合：
        - VS Code 內建 Git 面板
        - JetBrains 系列 IDE 內建 Git 面板
            - WebStorm
            - PyCharm
            - 其他 JetBrains IDE
- 作用：
    - Git 核心僅提供 CLI 操作方式
    - GUI 工具由第三方廠商開發
    - GUI 工具提供視覺化圖形介面
    - 開發者尚未熟悉全部指令時
        - 仍可透過點擊按鈕操作 Git
    - 開發者可透過視覺化分支圖
        - 理解專案歷史脈絡
    - 大幅降低初學者入門門檻

---

## 結論

- GUI 工具是 Git 核心 CLI 的外殼
- GUI 工具底層執行核心指令：
    - `git add`
    - `git commit`
    - `git push`
- 開發者學習 Git 核心概念與指令後
    - 使用任何 GUI 工具皆可得心應手
    - 工具無法解決問題時
        - 開發者知道如何回歸根本解決
