export interface CategoryConfig {
  id: string
  name: string
  icon: string
  description: string
  markdownHeader: string
}

/**
 * Centralized category configuration
 * All categories, icons, names, and descriptions are defined here
 * When a new category is added to README.md, it must also be added here
 */
export const CATEGORY_CONFIGS: Record<string, CategoryConfig> = {
  "search-engines": {
    id: "search-engines",
    name: "Search Engines",
    icon: "🔍",
    description: "Search engines and discovery tools for finding information across the web",
    markdownHeader: "Search Engines"
  },
  "social-media": {
    id: "social-media",
    name: "Social Media",
    icon: "👥",
    description: "Tools for investigating and analyzing social media platforms",
    markdownHeader: "Social Media"
  },
  "domain-network": {
    id: "domain-network",
    name: "Domain & Network",
    icon: "🌐",
    description: "Domain analysis, DNS investigation, and network reconnaissance tools",
    markdownHeader: "Domain & Network"
  },
  "email": {
    id: "email",
    name: "Email",
    icon: "📧",
    description: "Email investigation, verification, and analysis tools",
    markdownHeader: "Email"
  },
  "image-video": {
    id: "image-video",
    name: "Image & Video",
    icon: "🖼️",
    description: "Image and video analysis, reverse search, and metadata extraction",
    markdownHeader: "Image & Video"
  },
  "people-search": {
    id: "people-search",
    name: "People Search",
    icon: "🧑‍💼",
    description: "People search engines and background investigation tools",
    markdownHeader: "People Search"
  },
  "geolocation": {
    id: "geolocation",
    name: "Geolocation",
    icon: "📍",
    description: "Location intelligence and geospatial analysis tools",
    markdownHeader: "Geolocation"
  },
  "dark-web": {
    id: "dark-web",
    name: "Dark Web",
    icon: "🕸️",
    description: "Dark web search engines and monitoring tools",
    markdownHeader: "Dark Web"
  },
  "threat-intelligence": {
    id: "threat-intelligence",
    name: "Threat Intelligence",
    icon: "🛡️",
    description: "Malware analysis, threat detection, and security intelligence",
    markdownHeader: "Threat Intelligence"
  },
  "metadata": {
    id: "metadata",
    name: "Metadata",
    icon: "📋",
    description: "File metadata analysis and information extraction tools",
    markdownHeader: "Metadata"
  },
  "file-document-intelligence": {
    id: "file-document-intelligence",
    name: "File & Document Intelligence",
    icon: "📄",
    description: "Document analysis, file investigation, and content intelligence tools",
    markdownHeader: "File & Document Intelligence"
  },
  "code-repository-intelligence": {
    id: "code-repository-intelligence",
    name: "Code & Repository Intelligence",
    icon: "💻",
    description: "Source code analysis, repository investigation, and development intelligence",
    markdownHeader: "Code & Repository Intelligence"
  },
  "username-handle-tracking": {
    id: "username-handle-tracking",
    name: "Username & Handle Tracking",
    icon: "🆔",
    description: "Username enumeration, handle tracking, and account discovery tools",
    markdownHeader: "Username & Handle Tracking"
  },
  "phone-number-research": {
    id: "phone-number-research",
    name: "Phone Number Research",
    icon: "📱",
    description: "Phone number investigation, lookup, and analysis tools",
    markdownHeader: "Phone Number Research"
  },
  "archive-history-tools": {
    id: "archive-history-tools",
    name: "Archive & History Tools",
    icon: "🗄️",
    description: "Web archiving, historical data, and time-based investigation tools",
    markdownHeader: "Archive & History Tools"
  },
  "company-organization-research": {
    id: "company-organization-research",
    name: "Company & Organization Research",
    icon: "🏢",
    description: "Business intelligence, corporate investigation, and organizational analysis",
    markdownHeader: "Company & Organization Research"
  },
  "maritime-aviation-osint": {
    id: "maritime-aviation-osint",
    name: "Maritime & Aviation OSINT",
    icon: "✈️",
    description: "Transportation intelligence, vessel tracking, and aviation monitoring",
    markdownHeader: "Maritime & Aviation OSINT"
  },
  "visualization-analysis-tools": {
    id: "visualization-analysis-tools",
    name: "Visualization & Analysis Tools",
    icon: "📊",
    description: "Data visualization, network analysis, and relationship mapping tools",
    markdownHeader: "Visualization & Analysis Tools"
  },
  "news-media-monitoring": {
    id: "news-media-monitoring",
    name: "News & Media Monitoring",
    icon: "📰",
    description: "Media monitoring, news analysis, and information verification tools",
    markdownHeader: "News & Media Monitoring"
  },
  "data-statistics": {
    id: "data-statistics",
    name: "Data & Statistics",
    icon: "📈",
    description: "Statistical analysis, data mining, and information research tools",
    markdownHeader: "Data & Statistics"
  },
  "privacy-security-tools": {
    id: "privacy-security-tools",
    name: "Privacy & Security Tools",
    icon: "🕵️",
    description: "Privacy protection, security tools, and anonymity resources",
    markdownHeader: "Privacy & Security Tools"
  },
  "financial-intelligence": {
    id: "financial-intelligence",
    name: "Financial Intelligence",
    icon: "💰",
    description: "Financial analysis, fraud detection, and economic research tools",
    markdownHeader: "Financial Intelligence"
  }
}

/**
 * Creates a category ID from a README.md header
 */
export function createCategoryId(markdownHeader: string): string {
  return markdownHeader
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/&/g, "")
    .replace(/--/g, "-")
    .replace(/[^\w-]/g, "")
}

/**
 * Returns the category configuration from a category ID
 */
export function getCategoryConfig(categoryId: string): CategoryConfig {
  const config = CATEGORY_CONFIGS[categoryId]
  if (config) {
    return config
  }
  
  // Fallback: Create category dynamically
  return {
    id: categoryId,
    name: categoryId
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
    icon: "🔧",
    description: "OSINT tools and resources",
    markdownHeader: categoryId
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }
}

/**
 * Returns all category configurations
 */
export function getAllCategoryConfigs(): CategoryConfig[] {
  return Object.values(CATEGORY_CONFIGS)
}

/**
 * Returns the category icon
 */
export function getCategoryIcon(categoryId: string): string {
  return getCategoryConfig(categoryId).icon
}

/**
 * Returns the category name
 */
export function getCategoryName(categoryId: string): string {
  return getCategoryConfig(categoryId).name
}

/**
 * Returns the category description
 */
export function getCategoryDescription(categoryId: string): string {
  return getCategoryConfig(categoryId).description
}
