import type { OSINTTool, Category } from "./store"
import { getCategoryConfig, createCategoryId } from "./category-config"

export interface ParsedMarkdownData {
  tools: OSINTTool[]
  categories: Category[]
}

let globalToolCounter = 0

export function parseMarkdownToTools(markdownContent: string, filename: string = ""): ParsedMarkdownData {
  const lines = markdownContent.split("\n")
  const tools: OSINTTool[] = []
  const categoryMap = new Map<string, number>()
  const usedIds = new Set<string>()

  let currentCategory = ""
  let insideCodeBlock = false

  // Simple hash function for URLs
  function simpleHash(str: string): string {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36)
  }

  // Generate unique ID
  function generateUniqueId(base: string): string {
    let id = base
    let counter = 0
    while (usedIds.has(id)) {
      counter++
      id = `${base}-${counter}`
    }
    usedIds.add(id)
    return id
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    // Detect code block markers
    if (line.startsWith("```")) {
      insideCodeBlock = !insideCodeBlock
      continue
    }

    // Skip processing content inside code blocks
    if (insideCodeBlock) {
      continue
    }

    // Detect category headers (## Category Name)
    if (
      line.startsWith("## ") &&
      !line.includes("🚀") &&
      !line.includes("📋") &&
      !line.includes("📝") &&
      !line.includes("📄") &&
      !line.includes("⭐")
    ) {
      const headerText = line.replace("## ", "").trim()
      currentCategory = createCategoryId(headerText)
    }

    // Detect tool entries (- **Tool Name** - URL)
    if (line.startsWith("- **") && line.includes("**") && line.includes("http")) {
      const toolMatch = line.match(/- \*\*(.*?)\*\* - (https?:\/\/[^\s]+)/)
      if (!toolMatch) continue

      const [, name, url] = toolMatch
      let description = ""
      // Category headings define the existing catalog routes and tool IDs.
      const category = currentCategory
      let tags: string[] = []

      // Parse the following lines for tool details.
      // Detail lines are indented under their entry; match on the raw line so a
      // following unindented "- **Tool**" entry ends the block instead of being
      // consumed as a detail of this one.
      let j = i + 1
      while (j < lines.length && /^\s+- (?:Description|Category|Tags|Free):/.test(lines[j])) {
        const detailLine = lines[j].trim()

        if (detailLine.startsWith("- Description:")) {
          const value = detailLine.replace("- Description:", "").trim()
          // Most entries carry the literal placeholder "No description". Treat it
          // as absent so the UI can omit the paragraph rather than printing the
          // placeholder; scripts/validate-catalog.js tracks the real gap.
          description = /^no description\.?$/i.test(value) ? "" : value
        } else if (detailLine.startsWith("- Tags:")) {
          const tagString = detailLine.replace("- Tags:", "").trim()
          tags = tagString.split(",").map((tag) => tag.trim())
        }
        j++
      }

      // Count tools per category
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1)

      // Skip example.com URLs as they are likely examples
      if (url.includes("example.com")) {
        i = j - 1; // Skip the processed detail lines
        continue;
      }

      // Create tool object with unique ID
      globalToolCounter++
      const baseId = `${filename.replace('.md', '')}-${category}-${simpleHash(url)}`
      const tool: OSINTTool = {
        id: generateUniqueId(baseId),
        name,
        description,
        url,
        category,
        tags,
        featured: false,
        verified: true,
        addedBy: "admin",
        addedDate: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        rating: 0,
        usageCount: 0,
      }

      tools.push(tool)
      i = j - 1 // Skip the processed detail lines
    }
  }

  // Create categories array
  const categories: Category[] = Array.from(categoryMap.entries()).map(([categoryId, toolCount]) => {
    const config = getCategoryConfig(categoryId)

    return {
      id: categoryId,
      name: config.name,
      description: config.description,
      icon: config.icon,
      toolCount,
    }
  })

  return { tools, categories }
}

export async function loadToolsFromFiles(): Promise<ParsedMarkdownData> {
  try {
    
    // List of tool files to load
    const toolFiles = [
      "search-engines.md",
      "social-media-intelligence.md", 
      "domain-network-analysis.md",
      "email-investigation.md",
      "image-video-analysis.md",
      "people-search.md",
      "geolocation.md",
      "dark-web.md",
      "threat-intelligence.md",
      "metadata-analysis.md",
      "file-document-intelligence.md",
      "code-repository-intelligence.md",
      "username-handle-tracking.md",
      "phone-number-research.md",
      "archive-history-tools.md",
      "company-organization-research.md",
      "maritime-aviation-osint.md",
      "visualization-analysis-tools.md",
      "news-media-monitoring.md",
      "data-statistics.md",
      "privacy-security-tools.md",
      "financial-intelligence.md"
    ]

    let allTools: OSINTTool[] = []
    const categoryMap = new Map<string, number>()

    // Load each tool file
    for (const fileName of toolFiles) {
      try {
        const response = await fetch(`/tools/${fileName}`)
        if (!response.ok) {
          continue
        }

        const markdownContent = await response.text()

        // Parse the individual file
        const fileResult = parseMarkdownToTools(markdownContent, fileName)
        
        // Merge tools and count categories
        allTools = allTools.concat(fileResult.tools)
        
        // Update category counts
        fileResult.tools.forEach(tool => {
          categoryMap.set(tool.category, (categoryMap.get(tool.category) || 0) + 1)
        })

      } catch {
        continue
      }
    }

    // Create categories array from the merged data
    const categories: Category[] = Array.from(categoryMap.entries()).map(([categoryId, toolCount]) => {
      const config = getCategoryConfig(categoryId)
      return {
        id: categoryId,
        name: config.name,
        description: config.description,
        icon: config.icon,
        toolCount,
      }
    })

    return { tools: allTools, categories }
  } catch {
    // Fallback to empty data
    return {
      tools: [],
      categories: [],
    }
  }
}

// Keep the old function for backward compatibility
export async function loadToolsFromReadme(): Promise<ParsedMarkdownData> {
  return loadToolsFromFiles()
}
