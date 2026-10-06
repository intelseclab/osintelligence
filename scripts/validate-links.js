#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

/**
 * Link validator for the tool catalog.
 *
 * Checks that every listed URL still resolves. Network-bound, so it is kept
 * separate from validate-catalog.js: pull requests check only the files they
 * touch, and a scheduled job sweeps the whole catalog.
 *
 *   node scripts/validate-links.js                       # every catalog file
 *   node scripts/validate-links.js public/tools/a.md ...  # only these files
 *   node scripts/validate-links.js --concurrency 16 --timeout 15000
 *
 * Exits 1 only on hard failures (DNS failure, connection refused, 404/410).
 * Timeouts, rate limits and bot-walls are reported but not fatal — plenty of
 * OSINT sites block datacenter IPs, and failing CI on that would be noise.
 */

const TOOLS_DIR = path.join(process.cwd(), 'public', 'tools')
const ENTRY_RE = /^- \*\*(.*?)\*\* - (https?:\/\/[^\s]+)/

const argv = process.argv.slice(2)
const flag = (name, def) => {
  const i = argv.indexOf(`--${name}`)
  return i === -1 ? def : Number(argv[i + 1])
}
const CONCURRENCY = flag('concurrency', 12)
const TIMEOUT = flag('timeout', 15000)
const files = argv.filter((a) => a.endsWith('.md') && !a.startsWith('--'))

/** Treated as "unreachable, and that is the catalog's problem". */
const HARD_STATUS = new Set([404, 410])
/** Bot-walls and throttling — reported, never fatal. */
const SOFT_STATUS = new Set([401, 403, 405, 406, 418, 429, 503])

/**
 * Domain-parking tells. A typo'd hostname is usually registered by a squatter
 * and monetized, so it answers 200/302 and sails past an ordinary link check —
 * which is exactly the case this catalog needs to catch. Match on the parking
 * operators' nameservers and on the hostname-prefix redirect they all use.
 */
const PARKING_NS = /(abovedomains|parkingcrew|bodis|sedoparking|above\.com|dan\.com|afternic|undeveloped|parklogic|teaminternet)\./i
const PARKING_HOST = /^(ww\d+|parking|sedo|lander)\./i

function collect() {
  const targets = files.length
    ? files.map((f) => path.resolve(f))
    : fs.readdirSync(TOOLS_DIR).filter((f) => f.endsWith('.md')).map((f) => path.join(TOOLS_DIR, f))

  const out = []
  for (const abs of targets) {
    if (!fs.existsSync(abs)) continue
    const rel = path.relative(process.cwd(), abs)
    const lines = fs.readFileSync(abs, 'utf8').split('\n')
    let inCode = false
    lines.forEach((raw, idx) => {
      const line = raw.trim()
      if (line.startsWith('```')) { inCode = !inCode; return }
      if (inCode) return
      const m = line.match(ENTRY_RE)
      if (m) out.push({ name: m[1], url: m[2], file: rel, line: idx + 1 })
    })
  }
  // One request per distinct URL, even when several entries share it.
  const seen = new Map()
  for (const e of out) if (!seen.has(e.url)) seen.set(e.url, e)
  return [...seen.values()]
}

/** Resolve the NS records for a hostname; empty array if lookup fails. */
async function nameservers(hostname) {
  try {
    const dns = require('dns').promises
    const parts = hostname.split('.')
    // Try the registrable domain, then walk up if it is a deeper subdomain.
    for (let i = Math.max(0, parts.length - 3); i < parts.length - 1; i++) {
      try {
        const ns = await dns.resolveNs(parts.slice(i).join('.'))
        if (ns && ns.length) return ns
      } catch { /* try the next label */ }
    }
  } catch { /* dns unavailable */ }
  return []
}

/** True when a URL landed on parking/monetization infrastructure. */
async function looksParked(originalUrl, finalUrl) {
  try {
    const orig = new URL(originalUrl)
    const fin = new URL(finalUrl || originalUrl)
    if (PARKING_HOST.test(fin.hostname) && fin.hostname !== orig.hostname) return 'redirected to a parking host'
    const ns = await nameservers(orig.hostname)
    const hit = ns.find((n) => PARKING_NS.test(n))
    if (hit) return `nameserver ${hit}`
  } catch { /* not parseable */ }
  return null
}

async function probe(entry) {
  const run = async (method) => {
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), TIMEOUT)
    try {
      return await fetch(entry.url, {
        method,
        redirect: 'follow',
        signal: ctrl.signal,
        headers: {
          // Several catalog hosts 403 the default fetch agent outright.
          'User-Agent': 'Mozilla/5.0 (compatible; osintelligence-linkcheck/1.0; +https://osintelligence.net)',
          Accept: 'text/html,application/xhtml+xml,*/*;q=0.8',
        },
      })
    } finally {
      clearTimeout(timer)
    }
  }

  try {
    let res = await run('HEAD')
    // Many servers mishandle HEAD; retry once with GET before judging.
    if (res.status >= 400) res = await run('GET')

    const parked = await looksParked(entry.url, res.url)
    if (parked) return { ...entry, state: 'parked', status: res.status, detail: parked }

    if (res.ok) return { ...entry, state: 'ok', status: res.status }
    if (HARD_STATUS.has(res.status)) return { ...entry, state: 'dead', status: res.status }
    if (SOFT_STATUS.has(res.status)) return { ...entry, state: 'blocked', status: res.status }
    return { ...entry, state: 'warn', status: res.status }
  } catch (err) {
    const msg = String(err && err.message ? err.message : err)
    if (/abort/i.test(msg)) return { ...entry, state: 'timeout', status: 0, detail: 'timed out' }
    // DNS / TLS / refused — the domain itself is wrong or gone. This is the
    // class that catches typo'd hostnames.
    if (/ENOTFOUND|EAI_AGAIN|ECONNREFUSED|ERR_NAME|getaddrinfo|certificate|ECONNRESET/i.test(msg)) {
      return { ...entry, state: 'dead', status: 0, detail: msg.slice(0, 90) }
    }
    return { ...entry, state: 'warn', status: 0, detail: msg.slice(0, 90) }
  }
}

async function pool(items, size, worker) {
  const results = []
  let cursor = 0
  const runners = Array.from({ length: Math.min(size, items.length) }, async () => {
    while (cursor < items.length) {
      const i = cursor++
      results[i] = await worker(items[i])
      if (results.filter(Boolean).length % 50 === 0) {
        process.stdout.write(`  …${results.filter(Boolean).length}/${items.length}\n`)
      }
    }
  })
  await Promise.all(runners)
  return results
}

async function main() {
  const entries = collect()
  if (!entries.length) {
    console.log('No catalog URLs to check.')
    return
  }

  console.log(`Checking ${entries.length} unique URLs (concurrency ${CONCURRENCY}, timeout ${TIMEOUT}ms)…\n`)
  const results = await pool(entries, CONCURRENCY, probe)

  const by = (s) => results.filter((r) => r.state === s)
  const dead = by('dead')
  const parked = by('parked')
  const blocked = by('blocked')
  const timeout = by('timeout')
  const warn = by('warn')

  const show = (label, list) => {
    if (!list.length) return
    console.log(`\n${label} (${list.length}):`)
    for (const r of list.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line)) {
      console.log(`  ${r.file}:${r.line}  ${r.name}`)
      console.log(`      ${r.url}  →  ${r.status || r.detail || 'no response'}`)
    }
  }

  show('✖ DEAD — unreachable or 404/410', dead)
  show('✖ PARKED — domain-parking / typosquat infrastructure', parked)
  show('⚠ BLOCKED — bot-wall or rate limit, verify by hand', blocked)
  show('⚠ TIMEOUT — slow or unreachable from CI', timeout)
  show('⚠ OTHER', warn)

  console.log(`\nok ${by('ok').length} · dead ${dead.length} · parked ${parked.length} · blocked ${blocked.length} · timeout ${timeout.length} · other ${warn.length}`)

  if (dead.length || parked.length) {
    if (parked.length) {
      console.log('\nParked domains are typically typosquats — verify the spelling against the real tool.')
    }
    console.log('Dead and parked links must be fixed or removed.')
    process.exit(1)
  }
  console.log('\n✅ No dead or parked links.')
}

main().catch((e) => { console.error(e); process.exit(1) })
