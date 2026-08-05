// 三支對賬工具共用的參數解析、退出碼與訊息措辭。
//
// 退出碼契約，三支一致：
//   0  全判定完成且無 FAIL
//   1  有 FAIL
//   2  環境或參數不符
//   3  跑得完但零筆可判
//   4  未預期例外
//
// 訊息規則：使用者可見訊息一律完整句子加下一步建議。
// stack 只在 --debug 出現，避免把環境問題誤讀成工具壞掉。

export const EXIT = {
  OK: 0,
  HAS_FAIL: 1,
  BAD_ENV: 2,
  ZERO_ROWS: 3,
  UNEXPECTED: 4,
}

export class ToolError extends Error {
  constructor(message, code = EXIT.BAD_ENV, hint = '') {
    super(message)
    this.name = 'ToolError'
    this.code = code
    this.hint = hint
  }
}

export function bail(message, code = EXIT.BAD_ENV, hint = '') {
  throw new ToolError(message, code, hint)
}

// 布林旗標與帶值選項要分開宣告，否則 `--json --out x` 會把 --out 吃成 --json 的值。
export function parseArgs(argv, { flags = [], options = [], aliases = {} } = {}) {
  const flagSet = new Set(flags)
  const optSet = new Set(options)
  const opts = {}
  const positionals = []
  const unknown = []

  for (let i = 0; i < argv.length; i++) {
    const token = argv[i]
    if (!token.startsWith('--')) {
      positionals.push(token)
      continue
    }
    const eq = token.indexOf('=')
    const rawName = eq === -1 ? token.slice(2) : token.slice(2, eq)
    const name = aliases[rawName] ?? rawName

    if (flagSet.has(name)) {
      if (eq !== -1) bail(`旗標 --${rawName} 不接值，收到 ${token}。`, EXIT.BAD_ENV, `改寫成 --${rawName} 單獨一項。`)
      opts[name] = true
      continue
    }
    if (optSet.has(name)) {
      const value = eq === -1 ? argv[++i] : token.slice(eq + 1)
      if (value === undefined || value.startsWith('--')) {
        bail(`選項 --${rawName} 缺少值。`, EXIT.BAD_ENV, `寫成 --${rawName} <值> 或 --${rawName}=<值>。`)
      }
      // 同名重複視為多值，讓 --param k=v --param k2=v2 這種用法成立。
      if (name in opts) opts[name] = [].concat(opts[name], value)
      else opts[name] = value
      continue
    }
    unknown.push(rawName)
  }

  if (unknown.length) {
    bail(
      `不認得的選項：${unknown.map(u => `--${u}`).join('、')}。`,
      EXIT.BAD_ENV,
      '打 --help 看該子指令支援哪些選項。',
    )
  }
  return { opts, positionals }
}

// --param k=v 可重複，收斂成物件。值一律當字串，型別轉換交給呼叫端。
export function collectParams(raw) {
  const list = raw === undefined ? [] : [].concat(raw)
  const out = {}
  for (const item of list) {
    const eq = item.indexOf('=')
    if (eq <= 0) {
      bail(`--param 的格式是 k=v，收到 ${item}。`, EXIT.BAD_ENV, '例如 --param table=accounts。')
    }
    out[item.slice(0, eq)] = item.slice(eq + 1)
  }
  return out
}

export function requireOption(opts, name, hint) {
  const value = opts[name]
  if (value === undefined || value === true || value === '') {
    bail(`缺少必填選項 --${name}。`, EXIT.BAD_ENV, hint)
  }
  return value
}

export function requireOneOf(value, allowed, label) {
  if (!allowed.includes(value)) {
    bail(
      `${label} 的值 ${value} 不在允許集合內。`,
      EXIT.BAD_ENV,
      `允許值為 ${allowed.join('、')}。`,
    )
  }
  return value
}

// run-id 進檔名與目錄名，只放安全字元。時間來源由呼叫端注入，方便自測固定值。
export function normaliseRunId(raw, now = new Date()) {
  if (raw === undefined || raw === true || raw === '') {
    return now.toISOString().replace(/[:.]/g, '-').replace(/Z$/, 'Z')
  }
  if (!/^[A-Za-z0-9._-]+$/.test(raw)) {
    bail(`--run-id 只接受英數與 . _ - 三種符號，收到 ${raw}。`, EXIT.BAD_ENV, '改成不含路徑分隔符的短代號。')
  }
  return raw
}

// 統一的進入點包裝。把 ToolError 印成人話、其餘例外歸類 UNEXPECTED。
export async function main(fn, { debug = false } = {}) {
  try {
    const code = await fn()
    process.exit(typeof code === 'number' ? code : EXIT.OK)
  } catch (err) {
    if (err instanceof ToolError) {
      process.stderr.write(`${err.message}\n`)
      if (err.hint) process.stderr.write(`下一步：${err.hint}\n`)
      if (debug && err.stack) process.stderr.write(`${err.stack}\n`)
      process.exit(err.code)
    }
    process.stderr.write(`未預期例外：${err.message}\n`)
    process.stderr.write('下一步：加 --debug 重跑取得 stack，再回報。\n')
    if (debug && err.stack) process.stderr.write(`${err.stack}\n`)
    process.exit(EXIT.UNEXPECTED)
  }
}

export function isDebug(argv = process.argv) {
  return argv.includes('--debug')
}
