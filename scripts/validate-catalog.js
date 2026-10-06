#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

/**
 * Catalog validator: format compliance, duplicate detection, and sync consistency.
 *
 * Enforces the contract documented in public/README.md "File Structure for
 * Contributors". A category lives in five places and they must agree:
 *   1. public/tools/<slug>.md          the content
 *   2. README.md                       category link
 *   3. public/README.md                category link (depth-adjusted)
 *   4. lib/markdown-parser.ts          toolFiles[] array
 *   5. lib/category-config.ts          CATEGORY_CONFIGS key
 *
 * Pre-existing issues are grandfathered via scripts/catalog-baseline.json so CI
 * can be adopted without a big-bang cleanup. Run with --update-baseline to
 * re-record. New issues always fail.
 */

const ROOT = process.cwd()
const TOOLS_DIR = path.join(ROOT, 'public', 'tools')
const BASELINE = path.join(ROOT, 'scripts', 'catalog-baseline.json')

const ENTRY_RE = /^- \*\*(.*?)\*\* - (https?:\/\/[^\s]+)/
const DETAIL_RE = /^\s+-\s*(Description|Category|Tags|Free):\s*(.*)$/
const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/

/** Canonical category keys, read from lib/category-config.ts. */
function loadCategoryKeys() {
  const f = path.join(ROOT, 'lib', 'category-config.ts')
  if (!fs.existsSync(f)) return new Set()
  const src = fs.readFileSync(f, 'utf8')
  return new Set([...src.matchAll(/^  "([a-z0-9-]+)":\s*\{/gm)].map((m) => m[1]))
}

const CATEGORY_KEYS = loadCategoryKeys()

const issues = []

/**
 * Record an issue.
 *
 * `fingerprint` is what the baseline is keyed on, so it must stay stable when
 * unrelated edits shift line numbers — otherwise adding one entry near the top
 * of a file re-reports everything below it as "new". It defaults to the message
 * only for file-level issues that carry no line number in their text.
 */
const add = (code, file, line, msg, fingerprint) =>
  issues.push({ code, file, line, msg, fingerprint: fingerprint || msg })

/** Mirrors createCategoryId() in lib/category-config.ts */
function createCategoryId(header) {
  return header
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/&/g, '')
    .replace(/--/g, '-')
    .replace(/[^\w-]/g, '')
}

/** Normalize a URL so trivial spelling differences collapse to one key. */
function normalizeUrl(raw) {
  try {
    const u = new URL(raw)
    const host = u.hostname.toLowerCase().replace(/^www\./, '')
    const p = u.pathname.replace(/\/+$/, '')
    return host + p + u.search
  } catch {
    return raw.toLowerCase().replace(/\/+$/, '')
  }
}

const normalizeName = (n) => n.toLowerCase().replace(/[^a-z0-9]/g, '')

/** Parse one catalog file into entries, recording format violations as it goes. */
function parseFile(file) {
  const rel = path.posix.join('public/tools', file)
  const lines = fs.readFileSync(path.join(TOOLS_DIR, file), 'utf8').split('\n')
  const entries = []
  const mismatched = new Set()
  let header = null
  let headerId = ''
  let inCode = false

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i]
    const line = raw.trim()

    if (line.startsWith('```')) { inCode = !inCode; continue }
    if (inCode) continue

    if (line.startsWith('## ') && !/[🚀📋📝📄⭐]/.test(line)) {
      header = line.replace('## ', '').trim()
      headerId = createCategoryId(header)
      continue
    }

    if (!line.startsWith('- **')) continue

    const m = line.match(ENTRY_RE)
    if (!m) {
      add('FORMAT', rel, i + 1, `malformed entry (expected "- **Name** - https://url"): ${line.slice(0, 70)}`, `malformed|${line.slice(0, 70)}`)
      continue
    }

    const [, name, url] = m
    if (raw !== line) {
      add('FORMAT', rel, i + 1, `entry "${name}" is indented; entries must start at column 0`, `${name}|indented`)
    }

    // Collect the indented detail block that follows.
    const details = {}
    let j = i + 1
    while (j < lines.length && /^\s+-\s/.test(lines[j])) {
      const d = lines[j].match(DETAIL_RE)
      if (d) {
        if (details[d[1]] !== undefined) {
          add('FORMAT', rel, j + 1, `entry "${name}" repeats field ${d[1]}`, `${name}|repeat-${d[1]}`)
        }
        details[d[1]] = d[2].trim()
      } else {
        add('FORMAT', rel, j + 1, `entry "${name}" has an unrecognized detail line: ${lines[j].trim().slice(0, 60)}`, `${name}|bad-detail`)
      }
      j++
    }
    i = j - 1

    for (const field of ['Description', 'Category', 'Tags', 'Free']) {
      if (details[field] === undefined) {
        add('FORMAT', rel, i + 1, `entry "${name}" is missing required field ${field}`, `${name}|missing-${field}`)
      }
    }
    if (details.Description !== undefined && (!details.Description || /^no description$/i.test(details.Description))) {
      add('FORMAT', rel, i + 1, `entry "${name}" has a placeholder description`, `${name}|placeholder-description`)
    }
    if (details.Category !== undefined) {
      const slug = details.Category
      // NOTE: lib/markdown-parser.ts parses this field but discards it — a
      // tool's category comes from the file's "## " header, because the header
      // id is baked into the tool id and therefore into its /tools/<id> URL.
      // So a wrong value here does not change rendering; it is a data-hygiene
      // issue and a trap for anyone who assumes it is load-bearing.
      if (!SLUG_RE.test(slug)) {
        add('FORMAT', rel, i + 1, `entry "${name}" has a malformed Category slug "${slug}" (lowercase, single hyphens)`, `${name}|bad-slug-${slug}`)
      }
      if (!CATEGORY_KEYS.has(slug) && slug !== headerId) {
        mismatched.add(slug)
      }
    }
    if (details.Free !== undefined && !['true', 'false'].includes(details.Free)) {
      add('FORMAT', rel, i + 1, `entry "${name}" has Free="${details.Free}" (expected true or false)`)
    }

    entries.push({ name, url, line: i + 1, file: rel, category: details.Category, header })
  }

  if (mismatched.size) {
    const list = [...mismatched].sort().join(', ')
    add(
      'SYNC',
      rel,
      1,
      `declares Category value(s) not matching its heading id "${headerId}" and not in CATEGORY_CONFIGS: ${list}. The field is parsed but discarded (category comes from the "## " heading, which is baked into each tool's /tools/<id> URL), so this is misleading rather than broken — either drop the field from the entry format or make it authoritative.`,
      `category-field-drift`,
    )
  }

  return { entries, header }
}

function main() {
  if (!fs.existsSync(TOOLS_DIR)) {
    console.error(`✖ ${TOOLS_DIR} not found`)
    process.exit(1)
  }

  const files = fs.readdirSync(TOOLS_DIR).filter((f) => f.endsWith('.md')).sort()
  const all = []
  const headerIds = new Map()

  for (const f of files) {
    const { entries, header } = parseFile(f)
    all.push(...entries)
    if (!header) {
      add('SYNC', path.posix.join('public/tools', f), 1, 'file has no "## Category" header; every tool in it would be uncategorized')
    } else {
      headerIds.set(f, createCategoryId(header))
    }
  }

  // --- Duplicate detection -------------------------------------------------
  const byUrl = new Map()
  const byName = new Map()
  for (const e of all) {
    const u = normalizeUrl(e.url)
    const n = `${normalizeName(e.name)}`
    if (!byUrl.has(u)) byUrl.set(u, [])
    if (!byName.has(n)) byName.set(n, [])
    byUrl.get(u).push(e)
    byName.get(n).push(e)
  }

  for (const [u, group] of byUrl) {
    if (group.length < 2) continue
    const where = group.map((g) => `${g.file}:${g.line}`).join(', ')
    add('DUPLICATE', group[0].file, group[0].line, `URL ${u} listed ${group.length}x as ${[...new Set(group.map((g) => g.name))].join(' / ')} (${where})`, `dup-url|${u}`)
  }
  for (const [n, group] of byName) {
    if (group.length < 2) continue
    if (new Set(group.map((g) => normalizeUrl(g.url))).size === 1) continue // already reported as a URL dup
    const where = group.map((g) => `${g.file}:${g.line}`).join(', ')
    add('DUPLICATE', group[0].file, group[0].line, `name "${group[0].name}" listed ${group.length}x with differing URLs (${where}) — possible typo in one`, `dup-name|${n}`)
  }

  // --- Sync consistency across the five targets ----------------------------
  const slugs = files.map((f) => f.replace(/\.md$/, '')).sort()

  const linkSlugs = (mdPath, re) => {
    if (!fs.existsSync(path.join(ROOT, mdPath))) return null
    const src = fs.readFileSync(path.join(ROOT, mdPath), 'utf8')
    return [...src.matchAll(re)].map((m) => m[1]).sort()
  }

  const rootLinks = linkSlugs('README.md', /\(public\/tools\/([a-z0-9-]+)\.md\)/g)
  const pubLinks = linkSlugs('public/README.md', /\(tools\/([a-z0-9-]+)\.md\)/g)

  const parserSrc = fs.existsSync(path.join(ROOT, 'lib/markdown-parser.ts'))
    ? fs.readFileSync(path.join(ROOT, 'lib/markdown-parser.ts'), 'utf8') : ''
  const parserSlugs = [...parserSrc.matchAll(/"([a-z0-9-]+)\.md"/g)].map((m) => m[1]).sort()

  const cfgSrc = fs.existsSync(path.join(ROOT, 'lib/category-config.ts'))
    ? fs.readFileSync(path.join(ROOT, 'lib/category-config.ts'), 'utf8') : ''
  const cfgKeys = new Set([...cfgSrc.matchAll(/^\s{2}"([a-z0-9-]+)":\s*\{/gm)].map((m) => m[1]))

  const compare = (label, file, actual) => {
    if (actual === null) return
    for (const s of slugs) {
      if (!actual.includes(s)) add('SYNC', file, 1, `category "${s}" exists in public/tools/ but is missing from ${label}`)
    }
    for (const s of actual) {
      if (!slugs.includes(s)) add('SYNC', file, 1, `${label} references "${s}" but public/tools/${s}.md does not exist`)
    }
  }

  compare('README.md category list', 'README.md', rootLinks)
  compare('public/README.md category list', 'public/README.md', pubLinks)
  compare('toolFiles[] in lib/markdown-parser.ts', 'lib/markdown-parser.ts', parserSlugs)

  // lib/tool-metadata.ts bundles the catalog at build time for generateMetadata.
  // Static imports are what make webpack's asset/source bundling work, so the
  // list cannot be a glob — which means it is two more hand-maintained copies
  // (the import statements and the catalogFiles array) that must not drift.
  // Absent until that module exists, so this is a no-op before then.
  const metaPath = 'lib/tool-metadata.ts'
  if (fs.existsSync(path.join(ROOT, metaPath))) {
    const metaSrc = fs.readFileSync(path.join(ROOT, metaPath), 'utf8')
    const imported = [...metaSrc.matchAll(/from\s+"[^"]*public\/tools\/([a-z0-9-]+)\.md"/g)].map((m) => m[1]).sort()
    const listed = [...metaSrc.matchAll(/\[\s*"([a-z0-9-]+)\.md"\s*,/g)].map((m) => m[1]).sort()

    compare(`catalog imports in ${metaPath}`, metaPath, imported.length ? imported : null)
    compare(`catalogFiles[] in ${metaPath}`, metaPath, listed.length ? listed : null)

    // The two lists inside the file must also agree with each other: an import
    // that never reaches catalogFiles is dead, and an entry whose import is
    // missing is a build error rather than a silent gap.
    for (const s of imported) {
      if (!listed.includes(s)) {
        add('SYNC', metaPath, 1, `"${s}.md" is imported but never added to catalogFiles[] — its tools get no metadata`, `meta-import-unused-${s}`)
      }
    }
    for (const s of listed) {
      if (!imported.includes(s)) {
        add('SYNC', metaPath, 1, `catalogFiles[] lists "${s}.md" but nothing imports it`, `meta-list-unimported-${s}`)
      }
    }
  }

  // The config is keyed by the id derived from each file's "## " header, not by
  // the filename — that is what getCategoryConfig() looks up at runtime, and it
  // is the only category value that actually reaches the UI.
  for (const [f, id] of headerIds) {
    if (!cfgKeys.has(id)) {
      add('SYNC', 'lib/category-config.ts', 1, `public/tools/${f} resolves to category id "${id}", which has no CATEGORY_CONFIGS entry (falls back to the generic 🔧 icon)`)
    }
  }

  // --- Baseline ------------------------------------------------------------
  const key = (i) => `${i.code}|${i.file}|${i.fingerprint}`
  const updating = process.argv.includes('--update-baseline')

  if (updating) {
    fs.writeFileSync(BASELINE, JSON.stringify({ generated: new Date().toISOString(), known: issues.map(key).sort() }, null, 2) + '\n')
    console.log(`✅ baseline recorded: ${issues.length} known issues → scripts/catalog-baseline.json`)
    return
  }

  let known = new Set()
  if (fs.existsSync(BASELINE)) {
    known = new Set(JSON.parse(fs.readFileSync(BASELINE, 'utf8')).known || [])
  }

  const fresh = issues.filter((i) => !known.has(key(i)))
  const grandfathered = issues.length - fresh.length

  const counts = (list) => list.reduce((a, i) => ((a[i.code] = (a[i.code] || 0) + 1), a), {})

  console.log(`Scanned ${files.length} catalog files, ${all.length} entries.\n`)

  if (fresh.length) {
    console.log(`✖ ${fresh.length} new issue(s):\n`)
    for (const i of fresh.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line)) {
      console.log(`  [${i.code}] ${i.file}:${i.line}\n      ${i.msg}`)
    }
    console.log()
  }

  if (grandfathered) {
    console.log(`ℹ ${grandfathered} pre-existing issue(s) grandfathered by scripts/catalog-baseline.json: ${JSON.stringify(counts(issues.filter((i) => known.has(key(i)))))}`)
    console.log('  Burn these down over time; re-record with: node scripts/validate-catalog.js --update-baseline\n')
  }

  if (!fresh.length) {
    console.log('✅ No new catalog issues.')
    return
  }

  console.log(`Summary of new issues: ${JSON.stringify(counts(fresh))}`)
  process.exit(1)
}

main()
