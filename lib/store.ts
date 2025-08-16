import { create } from "zustand"
import { devtools } from "zustand/middleware"

export interface OSINTTool {
  id: string
  name: string
  description: string
  url: string
  category: string
  tags: string[]
  githubUrl?: string
  featured: boolean
  verified: boolean
  addedBy: string
  addedDate: string
  lastUpdated: string
  rating: number
  usageCount: number
}

export interface Category {
  id: string
  name: string
  description: string
  icon: string
  toolCount: number
}

interface OSINTStore {
  // Tools state
  tools: OSINTTool[]
  filteredTools: OSINTTool[]
  selectedCategory: string | null
  searchQuery: string

  // Categories state
  categories: Category[]

  // UI state
  isLoading: boolean
  viewMode: "grid" | "list"
  sortBy: "name" | "rating" | "recent" | "popular"

  // Actions
  setTools: (tools: OSINTTool[]) => void
  setFilteredTools: (tools: OSINTTool[]) => void
  setSelectedCategory: (category: string | null) => void
  setSearchQuery: (query: string) => void
  setCategories: (categories: Category[]) => void
  setIsLoading: (loading: boolean) => void
  setViewMode: (mode: "grid" | "list") => void
  setSortBy: (sort: "name" | "rating" | "recent" | "popular") => void
  filterTools: () => void
  addTool: (tool: OSINTTool) => void
  updateTool: (id: string, updates: Partial<OSINTTool>) => void
}

export const useOSINTStore = create<OSINTStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      tools: [],
      filteredTools: [],
      selectedCategory: null,
      searchQuery: "",
      categories: [],
      isLoading: false,
      viewMode: "grid",
      sortBy: "name",

      // Actions
      setTools: (tools) => set({ tools }),
      setFilteredTools: (filteredTools) => set({ filteredTools }),
      setSelectedCategory: (selectedCategory) => {
        set({ selectedCategory })
        get().filterTools()
      },
      setSearchQuery: (searchQuery) => {
        set({ searchQuery })
        get().filterTools()
      },
      setCategories: (categories) => set({ categories }),
      setIsLoading: (isLoading) => set({ isLoading }),
      setViewMode: (viewMode) => set({ viewMode }),
      setSortBy: (sortBy) => {
        set({ sortBy })
        get().filterTools()
      },

      filterTools: () => {
        const { tools, selectedCategory, searchQuery, sortBy } = get()
        let filtered = [...tools]

        // Filter by category
        if (selectedCategory) {
          filtered = filtered.filter((tool) => tool.category === selectedCategory)
        }

        // Filter by search query
        if (searchQuery) {
          const query = searchQuery.toLowerCase()
          filtered = filtered.filter(
            (tool) =>
              tool.name.toLowerCase().includes(query) ||
              tool.description.toLowerCase().includes(query) ||
              tool.tags.some((tag) => tag.toLowerCase().includes(query)),
          )
        }

        // Sort tools
        filtered.sort((a, b) => {
          switch (sortBy) {
            case "rating":
              return b.rating - a.rating
            case "recent":
              return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime()
            case "popular":
              return b.usageCount - a.usageCount
            default:
              return a.name.localeCompare(b.name)
          }
        })

        set({ filteredTools: filtered })
      },

      addTool: (tool) => {
        const { tools } = get()
        const newTools = [...tools, tool]
        set({ tools: newTools })
        get().filterTools()
      },

      updateTool: (id, updates) => {
        const { tools } = get()
        const newTools = tools.map((tool) => (tool.id === id ? { ...tool, ...updates } : tool))
        set({ tools: newTools })
        get().filterTools()
      },
    }),
    { name: "osint-store" },
  ),
)
