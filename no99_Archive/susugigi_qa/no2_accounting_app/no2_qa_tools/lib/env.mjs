// 環境前置檢查與機器相依設定的載入。
//
// 設計前提：作者的開發機是 Windows、執行機是 macOS 加 iOS simulator。
// 因此工具在 Windows 上必須跑得起來並給出清楚的環境不符訊息，不是拋 stack。
// 取檔是人工前置、與平台無關；只有 pull 這種要摸 simulator 的子指令才擋平台。

import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { fileURLToPath } from 'node:url'
import { bail, EXIT } from './cli.mjs'

export const TOOLS_ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)))
export const RUNS_ROOT = path.join(TOOLS_ROOT, 'runs')
export const CONFIG_PATH = path.join(TOOLS_ROOT, 'config.json')

export const MIN_NODE = [22, 5, 0]

// node:sqlite 的 DatabaseSync 與全域 WebSocket 都是 v22.5 起穩定內建。
export function assertNodeVersion() {
  const parts = process.versions.node.split('.').map(Number)
  for (let i = 0; i < MIN_NODE.length; i++) {
    if (parts[i] > MIN_NODE[i]) return
    if (parts[i] < MIN_NODE[i]) {
      bail(
        `Node 版本過舊，需 v${MIN_NODE.join('.')} 以上，目前 v${process.versions.node}。`,
        EXIT.BAD_ENV,
        'node:sqlite 的 DatabaseSync 與全域 WebSocket 在該版本才穩定內建。',
      )
    }
  }
}

export function isMac() {
  return process.platform === 'darwin'
}

// 只有真的要摸 simulator 的子指令呼叫這支。其餘一律不擋平台。
export function assertMacForSimulator(subcommand) {
  if (isMac()) return
  bail(
    `子指令 ${subcommand} 需要 iOS simulator，本機平台為 ${process.platform}。`,
    EXIT.BAD_ENV,
    '在 Mac 上人工取出 .db 後複製過來，再用 snapshot 子指令接手；其餘子指令本機可跑。',
  )
}

export function loadConfig({ required = false } = {}) {
  if (!fs.existsSync(CONFIG_PATH)) {
    if (!required) return {}
    bail(
      `找不到設定檔 ${CONFIG_PATH}。`,
      EXIT.BAD_ENV,
      '複製 config.example.json 成 config.json，填好 implRoot 後重跑。設定檔不進 git。',
    )
  }
  try {
    return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'))
  } catch (err) {
    bail(`設定檔不是合法 JSON：${err.message}`, EXIT.BAD_ENV, `檢查 ${CONFIG_PATH} 的括號與逗號。`)
  }
}

// implRoot 用來解 Currency.json 與 IconDefinition.json，兩檔在 impl git 的 assets/definitions/。
export function resolveImplRoot(opts = {}) {
  const explicit = opts.implRoot ?? opts['impl-root']
  const cfg = loadConfig()
  const root = explicit ?? cfg.implRoot ?? process.env.SUSUGIGI_IMPL_ROOT
  if (!root) {
    bail(
      '未指定 impl git 根目錄。',
      EXIT.BAD_ENV,
      '三擇一：--impl-root <path>、config.json 的 implRoot、或環境變數 SUSUGIGI_IMPL_ROOT。',
    )
  }
  const resolved = path.resolve(expandHome(root))
  if (!fs.existsSync(path.join(resolved, 'assets', 'definitions'))) {
    bail(
      `implRoot 底下找不到 assets/definitions/：${resolved}`,
      EXIT.BAD_ENV,
      'implRoot 要指到 impl git 的根目錄，不是 src/ 或 assets/。',
    )
  }
  return resolved
}

function expandHome(p) {
  if (p.startsWith('~/') || p === '~') return path.join(os.homedir(), p.slice(1))
  return p
}

export function loadDefinitions(implRoot) {
  const dir = path.join(implRoot, 'assets', 'definitions')
  const currency = readJson(path.join(dir, 'Currency.json'), '幣別定義')
  const icons = readJson(path.join(dir, 'IconDefinition.json'), '圖示定義')
  // Currency.json 的代碼欄名是 alphabeticCode、不是 code；id 與 numericCode 同值。
  // 圖示 id 是稀疏集合、126 個散佈於 1 到 232，用區間判定會放行無效 id。
  return {
    currency,
    icons,
    iconIds: new Set(collectIds(icons)),
    currencyByCode: indexBy(currency, 'alphabeticCode'),
    currencyById: indexBy(currency, 'id'),
  }
}

function readJson(file, label) {
  if (!fs.existsSync(file)) {
    bail(`找不到${label}檔 ${file}。`, EXIT.BAD_ENV, '確認 implRoot 指到的 impl git 是完整 checkout。')
  }
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'))
  } catch (err) {
    bail(`${label}檔不是合法 JSON：${err.message}`, EXIT.BAD_ENV, `檢查 ${file}。`)
  }
}

// 定義檔可能是陣列，也可能是含陣列的物件，兩種都吃。
function toArray(data) {
  if (Array.isArray(data)) return data
  if (data && typeof data === 'object') {
    for (const v of Object.values(data)) if (Array.isArray(v)) return v
  }
  return []
}

function collectIds(data) {
  return toArray(data)
    .map(item => item?.id)
    .filter(v => v !== undefined && v !== null)
}

function indexBy(data, key) {
  const out = new Map()
  for (const item of toArray(data)) {
    if (item && item[key] !== undefined) out.set(item[key], item)
  }
  return out
}

export function ensureRunDir(runId, ...sub) {
  const dir = path.join(RUNS_ROOT, runId, ...sub)
  fs.mkdirSync(dir, { recursive: true })
  return dir
}

// node:sqlite 目前仍掛 ExperimentalWarning。工具自己吞掉，免得每次輸出被雜訊蓋住。
export function silenceSqliteWarning() {
  const original = process.emitWarning
  process.emitWarning = (warning, ...rest) => {
    const text = typeof warning === 'string' ? warning : warning?.message ?? ''
    if (text.includes('SQLite is an experimental feature')) return
    return original.call(process, warning, ...rest)
  }
}
