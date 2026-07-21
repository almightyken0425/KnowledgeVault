# 產品形態與層組合

> G2 形態級的設計。不同類型的產品用不同的層組合，用宣告表達差異，不靠 null 欄位默契。

---

## 形態級解決的問題

沒有形態級時的實況：

- 註冊表用 null 欄位表達此產品無設計層
- 敘述文件寫死一套完整結構，讀者無從得知哪些層對眼前的產品不適用
- 新產品註冊時，開哪些層全憑臨場判斷，同型產品各開各的

形態級把某型產品該有哪些層的答案從默契升級為宣告。

---

## 形態宣告

層清單依粒度拆兩段宣告。product_layers 在產品級檢核一次，module_layers 逐模組檢核：

```yaml
profiles:
  - id: full_app                  # 完整應用
    product_layers: [initiation, planning, project_management, archive]
    module_layers: [spec, design, impl, quality, release]
  - id: backend_service           # 後端服務，無設計層
    product_layers: [initiation, planning, archive]
    module_layers: [spec, impl]
  - id: static_site               # 靜態站，內容即真相
    product_layers: []
    module_layers: [impl]
  - id: template_library          # 模板庫
    product_layers: []
    module_layers: [spec, impl]
  - id: concept                   # 純概念，未進實作
    product_layers: [initiation, planning]
    module_layers: [spec]
```

- 兩段清單皆引用層宣告檔的 id
- 形態收斂常見組合。個別產品或模組的偏差用註冊表的覆寫欄位表達，不為單一實例開新形態

---

## 形態的粒度選擇

- 形態可綁產品，也可逐模組覆寫
- 產品綁預設形態，模組結構分歧時個別模組覆寫，是最實用的形態
- 產品長大後模組結構必然分歧。schema 從第一天支援模組級覆寫，可省一次遷移
- 模組覆寫只影響 module_layers 段。product_layers 恆在產品級生效，不隨模組變

---

## 形態與衍生行為

形態不只決定目錄，也決定下游工具行為：

- 盤點工具對 concept 形態的產品不報實作層缺漏
- 配對檢查對 static_site 形態不要求規格對齊
- 形態宣告之外的實存層目錄，檢核器列為 drift 警示，由人裁決補宣告或移除
- 新層加入某形態時，檢核器列出該形態下所有既有實例的補建待辦

對照：沒有形態級時，這些判斷散落在各工具內的特例硬編碼，如特定狀態視為正常的例外表。形態級把特例收斂成資料。
