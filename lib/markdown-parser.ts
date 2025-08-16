import type { OSINTTool, Category } from "./store"
import { getCategoryConfig, createCategoryId } from "./category-config"

export interface ParsedMarkdownData {
  tools: OSINTTool[]
  categories: Category[]
}

export function parseMarkdownToTools(markdownContent: string): ParsedMarkdownData {
  const lines = markdownContent.split("\n")
  const tools: OSINTTool[] = []
  const categoryMap = new Map<string, number>()

  let currentCategory = ""
  let toolId = 1

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

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

      // Create tool object
      const tool: OSINTTool = {
        id: `tool-${toolId++}`,
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

export async function loadToolsFromReadme(): Promise<ParsedMarkdownData> {
  try {
    console.log("[*] Attempting to fetch README.md...")
    const response = await fetch("/README.md")

    if (!response.ok) {
      console.log("[*] README.md not found, status:", response.status)
      throw new Error(`Failed to load README.md: ${response.status}`)
    }

    const markdownContent = await response.text()
    console.log("[*] README.md content length:", markdownContent.length)

    const result = parseMarkdownToTools(markdownContent)
    console.log("[*] Parsed result:", result)

    return result
  } catch (error) {
    console.error("[*] Error loading tools from README:", error)

    // Fallback to empty data
    return {
      tools: [],
      categories: [],
    }
  }
}
