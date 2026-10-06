import assert from "node:assert/strict"
import { readFileSync, readdirSync } from "node:fs"
import { registerHooks } from "node:module"
import { after, test } from "node:test"

const hooks = registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "./markdown-parser" || specifier === "./category-config") {
      return nextResolve(`${specifier}.ts`, context)
    }
    return nextResolve(specifier, context)
  },
  load(url, context, nextLoad) {
    if (url.endsWith(".md")) {
      return { format: "module", source: `export default ${JSON.stringify(readFileSync(new URL(url), "utf8"))}`, shortCircuit: true }
    }
    return nextLoad(url, context)
  },
})
after(() => hooks.deregister())
const { getToolMetadata } = await import("../lib/tool-metadata.ts")
const { parseMarkdownToTools } = await import("../lib/markdown-parser.ts")

test("uses the actual catalog name and description for an opaque published ID", () => {
  assert.deepEqual(getToolMetadata("news-media-monitoring-news-media-monitoring-6occxj"), {
    title: "Arcmira: YouTube Transcript Search - OSINT Tool",
    description: "Searches indexed YouTube transcripts for timestamped quotes, speaker appearances and sponsor mentions through API, SDK, CLI and MCP access. Requires an account, with limited free access and paid reads that use credits from your plan, then your on-demand budget.",
  })
  assert.deepEqual(getToolMetadata("news-media-monitoring-news-media-monitoring-de4ito"), {
    title: "Google Alerts - OSINT Tool",
    description: "Content change detection and notification service",
  })
})

test("covers every tool in the same markdown catalog used by the client", () => {
  const folder = new URL("../public/tools/", import.meta.url)
  let checked = 0
  for (const filename of readdirSync(folder).filter((name) => name.endsWith(".md"))) {
    const { tools } = parseMarkdownToTools(readFileSync(new URL(filename, folder), "utf8"), filename)
    for (const tool of tools) {
      const metadata = getToolMetadata(tool.id)
      assert.equal(metadata.title, `${tool.name} - OSINT Tool`, tool.id)
      assert.equal(metadata.description, tool.description || `Learn about ${tool.name}, an OSINT tool for cybersecurity professionals.`, tool.id)
      checked++
    }
  }
  assert.ok(checked > 900)
})

test("does not invent a tool title or index a missing catalog entry", () => {
  assert.deepEqual(getToolMetadata("not-a-real-tool"), {
    title: "Tool Not Found",
    description: "The requested tool is not in the OSINT Intelligence directory.",
    robots: { index: false, follow: false },
  })
})
