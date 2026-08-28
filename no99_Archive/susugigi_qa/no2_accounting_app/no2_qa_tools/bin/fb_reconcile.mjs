#!/usr/bin/env node
// Firestore 對賬。走 REST 與服務帳戶金鑰，零 npm 依賴。
//
// 為什麼不用 firebase-admin：Quality git 不裝套件、不編原生模組。
// JWT 走 node:crypto 的 RS256 自簽，REST 走內建 fetch，兩者皆內建。
//
// 憑證放 serviceAccountKey.json，已在 .gitignore 內，絕不進 git。
//
// 用法：node bin/fb-reconcile.mjs <子指令> [選項]

import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { EXIT, parseArgs, requireOption, normaliseRunId, main, isDebug, bail } from '../lib/cli.mjs'
import { assertNodeVersion, loadConfig, TOOLS_ROOT, ensureRunDir } from '../lib/env.mjs'
import { CLOUD_RENAME, CLOUD_TRAPS, toLocalFromCloud } from '../lib/naming.mjs'
import { createReport, record as rec, renderText, renderJson, exitCodeFor, VERDICT } from '../lib/report.mjs'

const DENOMINATOR = 19
const DENOM_NOTE = 'FB 面手測條數；與索引的 1481 與 456 不同口徑'

const KEY_PATH = path.join(TOOLS_ROOT, 'serviceAccountKey.json')
const SCOPE = 'https://www.googleapis.com/auth/datastore'

// 備份會寫進雲端的集合。逐項對應本機表。
const COLLECTIONS = ['accounts', 'categories', 'transactions', 'transfers', 'currencyRates', 'schedules']

const SUBCOMMANDS = ['auth-check', 'get', 'list', 'count', 'traps', 'reconcile', 'self-test', 'help']
const FLAGS = ['json', 'debug', 'help', 'verbose']
const OPTIONS = ['run-id', 'project', 'uid', 'path', 'limit', 'out']

await main(async () => {
  assertNodeVersion()
  const argv = process.argv.slice(2)
  const sub = argv[0] && !argv[0].startsWith('--') ? argv[0] : 'help'
  if (!SUBCOMMANDS.includes(sub)) {
    bail(`不認得的子指令 ${sub}。`, EXIT.BAD_ENV, `可用：${SUBCOMMANDS.join('、')}。`)
  }
  const { opts, positionals } = parseArgs(argv.slice(1), { flags: FLAGS, options: OPTIONS })
  if (opts.help || sub === 'help') return printHelp()
  const runId = normaliseRunId(opts['run-id'])

  switch (sub) {
    case 'traps': return cmdTraps(opts)
    case 'self-test': return selfTest(Boolean(opts.verbose))
    case 'auth-check': return cmdAuthCheck(opts)
    case 'get': return cmdGet(opts, positionals)
    case 'list': return cmdList(opts, positionals)
    case 'count': return cmdCount(opts)
    case 'reconcile': return cmdReconcile(opts, runId)
  }
}, { debug: isDebug() })

// ---------- 憑證與權杖 ----------

function loadKey({ required = true } = {}) {
  if (!fs.existsSync(KEY_PATH)) {
    if (!required) return null
    bail(
      `找不到服務帳戶金鑰 ${KEY_PATH}。`,
      EXIT.BAD_ENV,
      'Firebase console 產金鑰後存成該檔名。檔案已在 .gitignore 內，不會進 git。',
    )
  }
  let key
  try {
    key = JSON.parse(fs.readFileSync(KEY_PATH, 'utf8'))
  } catch (err) {
    bail(`金鑰檔不是合法 JSON：${err.message}`, EXIT.BAD_ENV, `檢查 ${KEY_PATH}。`)
  }
  for (const field of ['client_email', 'private_key', 'project_id']) {
    if (!key[field]) bail(`金鑰檔缺欄位 ${field}。`, EXIT.BAD_ENV, '重新自 Firebase console 下載完整金鑰。')
  }
  return key
}

function base64url(buf) {
  return Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

// RS256 自簽。nowSec 可注入，讓自測不依賴真實時鐘。
export function buildJwt(key, nowSec) {
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const claim = base64url(JSON.stringify({
    iss: key.client_email,
    scope: SCOPE,
    aud: 'https://oauth2.googleapis.com/token',
    iat: nowSec,
    exp: nowSec + 3600,
  }))
  const signingInput = `${header}.${claim}`
  const signature = crypto.createSign('RSA-SHA256').update(signingInput).sign(key.private_key)
  return `${signingInput}.${base64url(signature)}`
}

async function getAccessToken(key) {
  const jwt = buildJwt(key, Math.floor(Date.now() / 1000))
  let res
  try {
    res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwt }),
      signal: AbortSignal.timeout(15000),
    })
  } catch (err) {
    bail(`向 Google 換權杖時連線失敗：${err.message}`, EXIT.BAD_ENV, '確認本機有外網連線。')
  }
  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    bail(
      `換權杖失敗 HTTP ${res.status}：${body.error_description ?? body.error ?? '未知'}`,
      EXIT.BAD_ENV,
      '確認金鑰未被撤銷、服務帳戶有 Datastore 權限、且本機時鐘沒有嚴重偏移。',
    )
  }
  return body.access_token
}

function projectId(opts, key) {
  return opts.project ?? loadConfig().firebaseProjectId ?? key?.project_id
}

async function firestoreGet(token, project, docPath) {
  const url = `https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents/${docPath}`
  const res = await fetch(url, { headers: { authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(20000) })
  if (res.status === 404) return null
  if (!res.ok) {
    bail(`Firestore 讀取失敗 HTTP ${res.status}，路徑 ${docPath}。`, EXIT.BAD_ENV, '確認路徑正確、服務帳戶有讀權限。')
  }
  return res.json()
}

async function firestoreList(token, project, collectionPath, pageSize = 50) {
  const out = []
  let pageToken = ''
  do {
    const url = new URL(`https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents/${collectionPath}`)
    url.searchParams.set('pageSize', String(pageSize))
    if (pageToken) url.searchParams.set('pageToken', pageToken)
    const res = await fetch(url, { headers: { authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(20000) })
    if (res.status === 404) return out
    if (!res.ok) bail(`Firestore 列舉失敗 HTTP ${res.status}，路徑 ${collectionPath}。`, EXIT.BAD_ENV, '確認路徑與權限。')
    const body = await res.json()
    out.push(...(body.documents ?? []))
    pageToken = body.nextPageToken ?? ''
  } while (pageToken)
  return out
}

// Firestore 的 REST 回傳是型別包裝值，攤平成純值才好比對。
export function unwrap(value) {
  if (value === null || value === undefined) return null
  if ('nullValue' in value) return null
  if ('stringValue' in value) return value.stringValue
  if ('integerValue' in value) return Number(value.integerValue)
  if ('doubleValue' in value) return value.doubleValue
  if ('booleanValue' in value) return value.booleanValue
  if ('timestampValue' in value) return value.timestampValue
  if ('arrayValue' in value) return (value.arrayValue.values ?? []).map(unwrap)
  if ('mapValue' in value) return unwrapFields(value.mapValue.fields ?? {})
  return value
}

export function unwrapFields(fields) {
  const out = {}
  for (const [k, v] of Object.entries(fields ?? {})) out[k] = unwrap(v)
  return out
}

// ---------- 子指令 ----------

function cmdTraps(opts) {
  if (opts.json) {
    process.stdout.write(`${JSON.stringify({ traps: CLOUD_TRAPS, renames: CLOUD_RENAME }, null, 1)}\n`)
    return EXIT.OK
  }
  process.stdout.write('雲端欄名與本機欄名的對照，以及對賬容易踩的坑\n\n')
  for (const [table, map] of Object.entries(CLOUD_RENAME)) {
    process.stdout.write(`  ${table}\n`)
    for (const [local, entry] of Object.entries(map)) {
      process.stdout.write(`    ${local.padEnd(16)} → ${entry.cloud}${entry.note ? `  ${entry.note}` : ''}\n`)
    }
  }
  process.stdout.write('\n對賬前先讀這三條\n')
  for (const t of CLOUD_TRAPS) process.stdout.write(`  - ${t}\n`)
  return EXIT.OK
}

async function cmdAuthCheck(opts) {
  const key = loadKey()
  const project = projectId(opts, key)
  process.stdout.write(`金鑰檔存在，服務帳戶 ${key.client_email}\n`)
  process.stdout.write(`專案 ${project}\n`)
  const jwt = buildJwt(key, Math.floor(Date.now() / 1000))
  process.stdout.write(`JWT 組裝成功，三段長度 ${jwt.split('.').map(s => s.length).join('/')}\n`)
  const token = await getAccessToken(key)
  process.stdout.write(`權杖換發成功，長度 ${token.length}\n`)
  return EXIT.OK
}

async function cmdGet(opts, positionals) {
  const docPath = positionals[0] ?? opts.path
  if (!docPath) bail('get 需要一個文件路徑。', EXIT.BAD_ENV, '例如 get users/<uid>。')
  const key = loadKey()
  const token = await getAccessToken(key)
  const doc = await firestoreGet(token, projectId(opts, key), docPath)
  if (!doc) {
    process.stderr.write(`文件不存在：${docPath}\n下一步：確認 uid 與集合名，或該文件本來就該不存在。\n`)
    return EXIT.ZERO_ROWS
  }
  const flat = unwrapFields(doc.fields)
  process.stdout.write(`${JSON.stringify({ name: doc.name, fields: flat }, null, 1)}\n`)
  return EXIT.OK
}

async function cmdList(opts, positionals) {
  const collectionPath = positionals[0] ?? opts.path
  if (!collectionPath) bail('list 需要一個集合路徑。', EXIT.BAD_ENV, '例如 list users/<uid>/transactions。')
  const key = loadKey()
  const token = await getAccessToken(key)
  const docs = await firestoreList(token, projectId(opts, key), collectionPath)
  const limit = Number(opts.limit ?? 20)
  const rows = docs.slice(0, limit).map(d => ({ id: d.name.split('/').pop(), fields: unwrapFields(d.fields) }))
  if (!docs.length) {
    process.stderr.write(`集合零筆：${collectionPath}\n下一步：確認路徑；零筆不等於對賬通過。\n`)
    return EXIT.ZERO_ROWS
  }
  process.stdout.write(`${JSON.stringify({ collection: collectionPath, total: docs.length, shown: rows.length, rows }, null, 1)}\n`)
  return EXIT.OK
}

async function cmdCount(opts) {
  const uid = requireOption(opts, 'uid', '例如 --uid <匿名身分 uid>。無帳號架構下由 app 首開產生。')
  const key = loadKey()
  const token = await getAccessToken(key)
  const project = projectId(opts, key)
  const rows = []
  for (const c of COLLECTIONS) {
    const docs = await firestoreList(token, project, `users/${uid}/${c}`)
    rows.push({ collection: c, count: docs.length })
  }
  const total = rows.reduce((a, r) => a + r.count, 0)
  if (opts.json) {
    process.stdout.write(`${JSON.stringify({ uid, rows, total }, null, 1)}\n`)
  } else {
    process.stdout.write(`雲端六集合筆數  uid ${uid}\n\n`)
    for (const r of rows) process.stdout.write(`  ${r.collection.padEnd(16)} ${r.count}\n`)
    process.stdout.write(`  ${'合計'.padEnd(14)} ${total}\n`)
  }
  return total === 0 ? EXIT.ZERO_ROWS : EXIT.OK
}

async function cmdReconcile(opts, runId) {
  const uid = requireOption(opts, 'uid', '例如 --uid <匿名身分 uid>。')
  const key = loadKey()
  const token = await getAccessToken(key)
  const project = projectId(opts, key)
  const report = createReport({ tool: 'fb-reconcile', runId, denominator: DENOMINATOR, denominatorNote: DENOM_NOTE })

  const userDoc = await firestoreGet(token, project, `users/${uid}`)
  rec(report, {
    id: 'FB/user-document',
    verdict: userDoc ? VERDICT.PASS : VERDICT.FAIL,
    assertion: '雲端使用者文件存在',
    evidence: userDoc ? unwrapFields(userDoc.fields) : null,
    detail: userDoc ? '' : `users/${uid} 不存在`,
  })

  // 無帳號整改後 client 已停寫身分三欄，雲端仍有值代表舊資料殘留。
  if (userDoc) {
    const flat = unwrapFields(userDoc.fields)
    const identityKeys = ['email', 'displayName', 'photoURL'].filter(k => flat[k] !== undefined && flat[k] !== null)
    rec(report, {
      id: 'FB/identity-fields-cleared',
      verdict: identityKeys.length === 0 ? VERDICT.PASS : VERDICT.FAIL,
      assertion: '無帳號架構下不再寫入身分欄',
      evidence: identityKeys.length ? identityKeys : { cleared: true },
      detail: identityKeys.length ? `仍有值：${identityKeys.join('、')}` : '',
    })
  }

  for (const c of COLLECTIONS) {
    const docs = await firestoreList(token, project, `users/${uid}/${c}`)
    rec(report, {
      id: `FB/collection-${c}`,
      verdict: docs.length ? VERDICT.PASS : VERDICT.UNRESOLVABLE,
      assertion: `雲端集合 ${c} 有備份資料`,
      evidence: docs.length ? { count: docs.length, sample: unwrapFields(docs[0].fields) } : null,
      detail: docs.length ? '' : '零筆。可能是本場沒產生該類資料，非必然失敗',
    })
  }

  // accounts.currencyId 在幣別代碼查無時整欄省略，對這欄套必填會製造假 FAIL。
  const accounts = await firestoreList(token, project, `users/${uid}/accounts`)
  const missingCurrency = accounts.filter(d => unwrapFields(d.fields).currencyId === undefined)
  rec(report, {
    id: 'FB/account-currency-id',
    verdict: VERDICT.UNRESOLVABLE,
    assertion: 'accounts.currencyId 省略屬預期行為，非缺欄',
    evidence: { total: accounts.length, omitted: missingCurrency.length },
    detail: '此欄省略是設計，判定要人工確認該帳戶的幣別代碼是否真的查無',
  })

  const dir = ensureRunDir(runId)
  const text = opts.json ? renderJson(report) : renderText(report)
  const outFile = opts.out ? path.resolve(opts.out) : path.join(dir, 'fb-report.txt')
  fs.writeFileSync(outFile, `${text}\n`, 'utf8')
  process.stdout.write(`${text}\n\n報告已寫入 ${outFile}\n`)
  return exitCodeFor(report)
}

// ---------- 自測 ----------

function selfTest(verbose) {
  const cases = []
  const t = (name, fn) => {
    try { cases.push({ name, ok: true, detail: fn() ?? '' }) }
    catch (err) { cases.push({ name, ok: false, detail: err.message }) }
  }
  const assert = (c, m) => { if (!c) throw new Error(m) }

  t('型別包裝值攤得平', () => {
    const flat = unwrapFields({
      name: { stringValue: 'Cash' },
      amountCents: { integerValue: '1200000' },
      active: { booleanValue: true },
      missing: { nullValue: null },
      tags: { arrayValue: { values: [{ stringValue: 'a' }, { stringValue: 'b' }] } },
      nested: { mapValue: { fields: { inner: { integerValue: '7' } } } },
    })
    assert(flat.name === 'Cash', 'string')
    assert(flat.amountCents === 1200000, `integer 應轉數字，實得 ${flat.amountCents}`)
    assert(flat.active === true, 'boolean')
    assert(flat.missing === null, 'null')
    assert(flat.tags.join(',') === 'a,b', 'array')
    assert(flat.nested.inner === 7, 'map')
  })

  t('雲端欄名反查回本機欄名', () => {
    assert(toLocalFromCloud('transactions', 'amountCents') === 'amount', 'amountCents')
    assert(toLocalFromCloud('transfers', 'impliedRateScaled') === 'implied_rate', 'impliedRateScaled')
  })

  t('JWT 三段組得起來且簽章可驗', () => {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 })
    const pem = privateKey.export({ type: 'pkcs8', format: 'pem' })
    const jwt = buildJwt({ client_email: 'a@b.iam.gserviceaccount.com', private_key: pem }, 1754300000)
    const parts = jwt.split('.')
    assert(parts.length === 3, `預期三段，實得 ${parts.length}`)
    const ok = crypto.createVerify('RSA-SHA256')
      .update(`${parts[0]}.${parts[1]}`)
      .verify(publicKey, Buffer.from(parts[2].replace(/-/g, '+').replace(/_/g, '/'), 'base64'))
    assert(ok, '簽章驗不過')
    const claim = JSON.parse(Buffer.from(parts[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString())
    assert(claim.exp - claim.iat === 3600, `有效期預期一小時，實得 ${claim.exp - claim.iat}`)
    return 'RS256 自簽可驗'
  })

  t('缺金鑰時回環境錯而非 stack', () => {
    const exists = fs.existsSync(KEY_PATH)
    if (exists) return '本機有金鑰，略過'
    let threw = null
    try { loadKey() } catch (err) { threw = err }
    assert(threw && threw.code === EXIT.BAD_ENV, `預期環境錯，實得 ${threw?.code}`)
    assert(threw.message.includes('serviceAccountKey.json'), threw.message)
    return threw.message.slice(0, 40)
  })

  t('六集合清單與備份範圍一致', () => {
    assert(COLLECTIONS.length === 6, `預期 6，實得 ${COLLECTIONS.length}`)
    assert(COLLECTIONS.includes('currencyRates'), '雲端用駝峰 currencyRates')
  })

  const passed = cases.filter(c => c.ok).length
  for (const c of cases) {
    if (!c.ok) process.stdout.write(`  FAIL  ${c.name}\n        ${c.detail}\n`)
    else if (verbose) process.stdout.write(`  ok    ${c.name}${c.detail ? `  ${c.detail}` : ''}\n`)
  }
  process.stdout.write(`\n自測 ${cases.length} 項，通過 ${passed}，失敗 ${cases.length - passed}\n`)
  process.stdout.write('涵蓋型別攤平、欄名反查、JWT 自簽。對真 Firestore 的一切未涵蓋。\n')
  return passed === cases.length ? EXIT.OK : EXIT.HAS_FAIL
}

function printHelp() {
  process.stdout.write(`fb-reconcile — Firestore 對賬，零 npm 依賴

用法：node bin/fb-reconcile.mjs <子指令> [選項]

子指令
  traps                          印雲端與本機的欄名對照與三個坑，不需憑證
  self-test [--verbose]          離線自測，不需憑證與網路，Windows 可跑
  auth-check                     驗金鑰、組 JWT、換權杖
  get <doc-path>                 讀單一文件
  list <collection-path>         列舉集合，自動翻頁
  count --uid <uid>              六集合筆數
  reconcile --uid <uid>          判定 FB 面檢驗點並出報告

選項
  --project <id>   專案 id，預設取金鑰內的 project_id
  --uid <uid>      匿名身分 uid，無帳號架構下由 app 首開產生
  --limit <n>      list 顯示上限，預設 20
  --json           輸出 JSON

憑證
  服務帳戶金鑰放 no2_qa_tools/serviceAccountKey.json，已在 .gitignore 內。

平台
  traps 與 self-test 不需憑證與網路，Windows 可跑。
  其餘子指令需要金鑰與外網。
`)
  return EXIT.OK
}
