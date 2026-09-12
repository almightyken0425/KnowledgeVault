# 專案代理指令

## 專案定位

- 本庫是技術知識文件庫。
- 主要內容使用 Markdown。
- 本庫沒有統一建置流程。
- 日常工作以文件為主。

---

## 內容範圍

- `no1_ai_overview`
  - AI 發展脈絡
  - 規則式系統
  - 機器學習
- `no2_crypto_overview`
  - Bitcoin 基礎
  - Ethereum 基礎
  - 區塊鏈延伸主題
- `no3_product_management_guide`
  - 產品管理框架
  - 白牌領域知識
  - 個人化主題
- `no4_infra`
  - 資料庫知識
  - 伺服器知識
- `no5_react_basics`
  - React 基礎
  - React Native 路線圖
- `no99_archive`
  - 歷史內容
  - 封存資料

---

## 文件工作

- 修改前讀完整份文件。
- 同時讀相鄰章節。
- 先理解既有結構。
- 重複概念應合併。
- 衝突內容應先釐清。
- 不可直接插段縫合。
- 保留既有術語體系。
- 保留章節閱讀順序。
- 新文件延續現有序列。

---

## 命名規則

- GitHub repo 與主要 checkout 根目錄使用 `knowledge-vault`。
- 一般內容目錄與檔案使用 `lowercase_snake_case`。
- 有順序的內容使用 `noN_lowercase_snake_case`，序號不補零。
- `no0_` 保留給入口或總覽，`no99_` 保留給封存內容。
- `AGENTS.md` 與 `README.md` 保留平台約定名稱。
- 圖片與外部來源資產保留來源名稱，除非同批建立名稱映射。

---

## 寫作政策

- 知識由基礎往上建構。
- 新術語先提供前置概念。
- 重要事實保留來源線索。
- 事實與推論明確分開。
- 爭議主題呈現多方觀點。
- 相近概念優先做對比。
- 範例必須服務核心概念。
- 不確定資訊先查證。
- 時效性資訊必須查證。

---

## 驗證

- 修改後執行寫作 lint。

```bash
python3 ~/.codex/scripts/lint_markdown.py "$target"
```

- 交付前檢查指令漂移。

```bash
./scripts/check-instruction-drift.sh
```

---

## 指令維護

- 原生規則只維護於本檔。
- 相容入口只保留匯入語法。
- 不可複製第二份規則正文。
- 規則變更後執行漂移檢查。
