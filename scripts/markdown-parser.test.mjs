import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import { registerHooks } from "node:module"
import { after, test } from "node:test"

const parserUrl = new URL("../lib/markdown-parser.ts", import.meta.url)
// Node requires extensions; the application resolves this import through Next.js.
const hooks = registerHooks({
  resolve(specifier, context, nextResolve) {
    if (context.parentURL === parserUrl.href && specifier === "./category-config") {
      return nextResolve("./category-config.ts", context)
    }
    return nextResolve(specifier, context)
  },
})
after(() => hooks.deregister())
const { parseMarkdownToTools } = await import(parserUrl.href)

test("reads indented details without consuming the next tool", () => {
  const { tools, categories } = parseMarkdownToTools(`## Search Engines
- **First** - https://first.test
  - Description: Search public records.
  - Category: old-category-label
  - Tags: records, search
  - Free: true
  - **Second** - https://second.test
    - Description: Search archived pages.
    - Tags: archive, history
`, "search-engines.md")

  assert.deepEqual(tools.map(({ name, description, category, tags }) => ({
    name, description, category, tags,
  })), [
    { name: "First", description: "Search public records.", category: "search-engines", tags: ["records", "search"] },
    { name: "Second", description: "Search archived pages.", category: "search-engines", tags: ["archive", "history"] },
  ])
  assert.equal(categories[0].toolCount, 2)
})

test("restores actual catalog details and preserves the published Arcmira URL", async () => {
  const markdown = await readFile(new URL("../public/tools/news-media-monitoring.md", import.meta.url), "utf8")
  const { tools } = parseMarkdownToTools(markdown, "news-media-monitoring.md")
  assert.equal(tools.length, 5)
  assert.equal(tools[0].description, "Content change detection and notification service")
  assert.deepEqual(tools[0].tags, ["alerts", "monitoring", "google"])
  const arcmira = tools.find((tool) => tool.name === "Arcmira: YouTube Transcript Search")
  assert.ok(arcmira)
  assert.equal(arcmira.id, "news-media-monitoring-news-media-monitoring-6occxj")
  assert.equal(arcmira.category, "news-media-monitoring")
  assert.match(arcmira.description, /paid reads that use credits from your plan, then your on-demand budget/)
  assert.deepEqual(arcmira.tags, ["youtube", "transcript-search", "media-monitoring", "speaker-search", "sponsorship"])
})

test("keeps fenced examples out of the catalog", () => {
  const { tools } = parseMarkdownToTools("## Search Engines\n```markdown\n- **Example** - https://first.test\n  - Description: Not a real entry.\n```\n- **Actual** - https://second.test\n  - Description: Real entry.")
  assert.deepEqual(tools.map(({ name, description }) => ({ name, description })), [
    { name: "Actual", description: "Real entry." },
  ])
})
