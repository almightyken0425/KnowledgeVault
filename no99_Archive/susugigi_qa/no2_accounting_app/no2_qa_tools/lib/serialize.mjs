// 分冊的序列化器。把解析出來的列寫回 markdown。
//
// 存在理由是批次改。1481 列要加欄、改錨、改自動化欄，手改必錯；
// 有了序列化器，任何批次改都是「解析、在記憶體改、寫回」三步，可重跑、可比對。
//
// 硬規則：只動表格列，散文與段標題逐字保留。
// 做法是逐行掃原檔，命中檢驗點列就換成新的一列，其餘原樣抄。
// 不重建整份檔——重建就要重現 736 行散文與 128 個段標題，那是自找的風險。

import fs from 'node:fs'
import { bail, EXIT } from './cli.mjs'
import { splitRow, BOOK_KEY_ORDER, EMPTY } from './checklist.mjs'

// 一列的渲染。欄序由表頭決定，不由這裡寫死。
export function renderRow(row, header) {
  const cells = header.map(name => {
    const key = BOOK_KEY_ORDER[name]
    if (!key) {
      bail(`表頭有不認得的欄名 ${name}。`, EXIT.BAD_ENV, '新增欄要同步改 checklist.mjs 的欄名映射。')
    }
    const v = row[key]
    return v === undefined || v === '' ? EMPTY : String(v)
  })
  return `| ${cells.join(' | ')} |`
}

// 逐行改寫。rowsById 提供改過的列；沒提供的列原樣保留。
export function rewriteBook(file, rowsById, { addColumns = [] } = {}) {
  const original = fs.readFileSync(file, 'utf8')
  const lines = original.split('\n')
  const out = []
  let header = null
  let touched = 0

  for (const line of lines) {
    if (!line.startsWith('|')) { out.push(line); continue }
    const cells = splitRow(line)

    // 表頭：認到就記下，並在此處補新欄。
    if (cells[0] === 'ID' && cells.includes('斷言')) {
      header = [...cells]
      for (const col of addColumns) if (!header.includes(col)) header.push(col)
      out.push(`| ${header.join(' | ')} |`)
      continue
    }
    // 分隔線：欄數跟著表頭走。
    if (header && /^-+$/.test(cells[0] ?? '')) {
      out.push(`| ${header.map(() => '---').join(' | ')} |`)
      continue
    }
    if (!header || !/^C-[A-Z]{2}-\d{3}$/.test(cells[0] ?? '')) { out.push(line); continue }

    const row = rowsById.get(cells[0])
    if (!row) { out.push(line); continue }
    out.push(renderRow(row, header))
    touched++
  }

  if (!touched && rowsById.size) {
    bail(
      `改寫 ${file} 時零列命中。`,
      EXIT.ZERO_ROWS,
      '零列不是通過，多半是 ID 對不上或表頭認不到。',
    )
  }
  return { text: out.join('\n'), touched }
}

// 批次改的統一入口。回傳每冊改了幾列，供呼叫端核對。
export function rewriteAll(books, mutate, { addColumns = [], write = false } = {}) {
  const report = []
  for (const book of books) {
    const changed = new Map()
    for (const row of book.rows) {
      const next = mutate(row)
      if (next) changed.set(row.id, next)
    }
    if (!changed.size && !addColumns.length) { report.push({ book: book.book, touched: 0 }); continue }
    // 加欄時全列都要重渲染，否則新欄只有被改到的列有值。
    const target = addColumns.length ? new Map(book.rows.map(r => [r.id, changed.get(r.id) ?? r])) : changed
    const { text, touched } = rewriteBook(book.file, target, { addColumns })
    if (write) fs.writeFileSync(book.file, text, 'utf8')
    report.push({ book: book.book, touched, changed: changed.size })
  }
  return report
}
