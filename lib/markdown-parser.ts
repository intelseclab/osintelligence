import type { OSINTTool, Category } from "./store"
import { getCategoryConfig, createCategoryId } from "./category-config"

export interface ParsedMarkdownData {
  tools: OSINTTool[]
  categories: Category[]
}

export function parseMarkdownToTools(markdownContent: string, filename: string = ""): ParsedMarkdownData {
  const lines = markdownContent.split("\n")
  const tools: OSINTTool[] = []
  const categoryMap = new Map<string, number>()

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
      let category = currentCategory
      let tags: string[] = []
      let isFree = true

      // Parse the following lines for tool details
      let j = i + 1
      while (j < lines.length && lines[j].trim().startsWith("  - ")) {
        const detailLine = lines[j].trim()

        if (detailLine.startsWith("  - Description:")) {
          description = detailLine.replace("  - Description:", "").trim()
        } else if (detailLine.startsWith("  - Category:")) {
          category = detailLine.replace("  - Category:", "").trim()
        } else if (detailLine.startsWith("  - Tags:")) {
          const tagString = detailLine.replace("  - Tags:", "").trim()
          tags = tagString.split(",").map((tag) => tag.trim())
        } else if (detailLine.startsWith("  - Free:")) {
          isFree = detailLine.replace("  - Free:", "").trim() === "true"
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

      // Create tool object
      const tool: OSINTTool = {
        id: `${filename.replace('.md', '')}-${category}-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${simpleHash(url)}`,
        name,
        description,
        url,
        category,
        tags,
        featured: Math.random() > 0.8, // Randomly mark some as featured
        verified: true,
        addedBy: "admin",
        addedDate: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        rating: Math.floor(Math.random() * 2) + 4, // Random rating between 4-5
        usageCount: Math.floor(Math.random() * 1000),
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
    console.log("[*] Attempting to fetch tools from individual files...")
    
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
          console.log(`[*] Skipping ${fileName}, status:`, response.status)
          continue
        }

        const markdownContent = await response.text()
        console.log(`[*] Loaded ${fileName}, content length:`, markdownContent.length)

        // Parse the individual file
        const fileResult = parseMarkdownToTools(markdownContent, fileName)
        
        // Merge tools and count categories
        allTools = allTools.concat(fileResult.tools)
        
        // Update category counts
        fileResult.tools.forEach(tool => {
          categoryMap.set(tool.category, (categoryMap.get(tool.category) || 0) + 1)
        })

      } catch (error) {
        console.error(`[*] Error loading ${fileName}:`, error)
        continue
      }
    }

    console.log("[*] Total tools loaded:", allTools.length)

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

    const result = { tools: allTools, categories }
    console.log("[*] Final parsed result:", result)

    return result
  } catch (error) {
    console.error("[*] Error loading tools from files:", error)

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
