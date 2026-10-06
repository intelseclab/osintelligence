import assert from "node:assert/strict"
import { readFileSync, readdirSync } from "node:fs"
import { registerHooks } from "node:module"
import { after, test } from "node:test"

const hooks = registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "./markdown-parser" || specifier === "./category-config" || specifier === "./social-metadata") {
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
  const arcmira = getToolMetadata("news-media-monitoring-news-media-monitoring-6occxj")
  assert.deepEqual({ title: arcmira.title, description: arcmira.description }, {
    title: "Arcmira: YouTube Transcript Search - OSINT Tool",
    description: "Searches indexed YouTube transcripts for timestamped quotes, speaker appearances and sponsor mentions through API, SDK, CLI and MCP access. Requires an account, with limited free access and paid reads that use credits from your plan, then your on-demand budget.",
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
      assert.equal(metadata.alternates.canonical, `/tools/${encodeURIComponent(tool.id)}`, tool.id)
      assert.equal(metadata.openGraph.url, metadata.alternates.canonical, tool.id)
      assert.equal(metadata.openGraph.title, metadata.title, tool.id)
      assert.equal(metadata.openGraph.description, metadata.description, tool.id)
      assert.equal(metadata.twitter.title, metadata.title, tool.id)
      assert.equal(metadata.twitter.description, metadata.description, tool.id)
      checked++
    }
  }
  assert.ok(checked > 900)
})

test("uses tool-specific share URLs and copy while keeping the publisher image and branding", () => {
  const metadata = getToolMetadata("news-media-monitoring-news-media-monitoring-de4ito")
  assert.deepEqual(metadata.alternates, {
    canonical: "/tools/news-media-monitoring-news-media-monitoring-de4ito",
  })
  assert.deepEqual(metadata.openGraph, {
    title: "Google Alerts - OSINT Tool",
    description: "Content change detection and notification service",
    type: "website",
    url: "/tools/news-media-monitoring-news-media-monitoring-de4ito",
    siteName: "OSINT Intelligence",
    locale: "en_US",
    images: [{
      url: "/logo.png",
      width: 1200,
      height: 630,
      alt: "OSINT Intelligence - Community OSINT Tools Directory",
    }],
  })
  assert.deepEqual(metadata.twitter, {
    card: "summary_large_image",
    title: "Google Alerts - OSINT Tool",
    description: "Content change detection and notification service",
    images: ["/logo.png"],
    creator: "@hackingspace",
  })
})

test("does not invent a tool title or index a missing catalog entry", () => {
  assert.deepEqual(getToolMetadata("not-a-real-tool"), {
    title: "Tool Not Found",
    description: "The requested tool is not in the OSINT Intelligence directory.",
    robots: { index: false, follow: false },
  })
})
