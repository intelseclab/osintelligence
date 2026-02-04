import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

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

export interface UserRating {
  toolId: string
  rating: number
  timestamp: number
}

export interface RecentlyViewed {
  toolId: string
  timestamp: number
}

interface OSINTStore {
  // Tools state
  tools: OSINTTool[]
  filteredTools: OSINTTool[]
  selectedCategory: string | null
  searchQuery: string
  selectedTags: string[]

  // Categories state
  categories: Category[]

  // UI state
  isLoading: boolean
  isError: boolean
  errorMessage: string | null
  viewMode: "grid" | "list"
  sortBy: "name" | "rating" | "recent" | "popular" | "trending"

  // User data (persisted)
  favorites: string[]
  recentlyViewed: RecentlyViewed[]
  userRatings: UserRating[]
  toolViews: Record<string, number>
  comparisonList: string[]

  // Actions
  setTools: (tools: OSINTTool[]) => void
  setFilteredTools: (tools: OSINTTool[]) => void
  setSelectedCategory: (category: string | null) => void
  setSearchQuery: (query: string) => void
  setSelectedTags: (tags: string[]) => void
  toggleTag: (tag: string) => void
  setCategories: (categories: Category[]) => void
  setIsLoading: (loading: boolean) => void
  setError: (isError: boolean, message?: string) => void
  setViewMode: (mode: "grid" | "list") => void
  setSortBy: (sort: "name" | "rating" | "recent" | "popular" | "trending") => void
  filterTools: () => void
  addTool: (tool: OSINTTool) => void
  updateTool: (id: string, updates: Partial<OSINTTool>) => void

  // Favorites
  toggleFavorite: (toolId: string) => void
  isFavorite: (toolId: string) => boolean


  // User ratings
  setUserRating: (toolId: string, rating: number) => void
  getUserRating: (toolId: string) => number | null

  // Tool views (for trending)
  incrementToolView: (toolId: string) => void
  getTrendingTools: () => OSINTTool[]

  // Comparison
  addToComparison: (toolId: string) => void
  removeFromComparison: (toolId: string) => void
  clearComparison: () => void
  isInComparison: (toolId: string) => boolean
  getComparisonTools: () => OSINTTool[]

  // Utility
  getToolById: (id: string) => OSINTTool | undefined
  getAllTags: () => string[]
}

export const useOSINTStore = create<OSINTStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        tools: [],
        filteredTools: [],
        selectedCategory: null,
        searchQuery: "",
        selectedTags: [],
        categories: [],
        isLoading: false,
        isError: false,
        errorMessage: null,
        viewMode: "grid",
        sortBy: "name",

        // User data
        favorites: [],
        recentlyViewed: [],
        userRatings: [],
        toolViews: {},
        comparisonList: [],

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
        setSelectedTags: (selectedTags) => {
          set({ selectedTags })
          get().filterTools()
        },
        toggleTag: (tag) => {
          const { selectedTags } = get()
          const newTags = selectedTags.includes(tag)
            ? selectedTags.filter((t) => t !== tag)
            : [...selectedTags, tag]
          set({ selectedTags: newTags })
          get().filterTools()
        },
        setCategories: (categories) => set({ categories }),
        setIsLoading: (isLoading) => set({ isLoading }),
        setError: (isError, message) => set({ isError, errorMessage: message || null }),
        setViewMode: (viewMode) => set({ viewMode }),
        setSortBy: (sortBy) => {
          set({ sortBy })
          get().filterTools()
        },

        filterTools: () => {
          const { tools, selectedCategory, searchQuery, selectedTags, sortBy, toolViews } = get()
          let filtered = [...tools]

          // Filter by category
          if (selectedCategory) {
            filtered = filtered.filter((tool) => tool.category === selectedCategory)
          }

          // Filter by tags
          if (selectedTags.length > 0) {
            filtered = filtered.filter((tool) =>
              selectedTags.some((tag) => tool.tags.includes(tag))
            )
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
              case "trending":
                return (toolViews[b.id] || 0) - (toolViews[a.id] || 0)
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

        // Favorites
        toggleFavorite: (toolId) => {
          const { favorites } = get()
          const newFavorites = favorites.includes(toolId)
            ? favorites.filter((id) => id !== toolId)
            : [...favorites, toolId]
          set({ favorites: newFavorites })
        },
        isFavorite: (toolId) => get().favorites.includes(toolId),

      
        // User ratings
        setUserRating: (toolId, rating) => {
          const { userRatings } = get()
          const filtered = userRatings.filter((r) => r.toolId !== toolId)
          set({
            userRatings: [...filtered, { toolId, rating, timestamp: Date.now() }],
          })
        },
        getUserRating: (toolId) => {
          const rating = get().userRatings.find((r) => r.toolId === toolId)
          return rating?.rating ?? null
        },

        // Tool views
        incrementToolView: (toolId) => {
          const { toolViews } = get()
          set({
            toolViews: {
              ...toolViews,
              [toolId]: (toolViews[toolId] || 0) + 1,
            },
          })
        },
        getTrendingTools: () => {
          const { tools, toolViews } = get()
          return [...tools]
            .sort((a, b) => (toolViews[b.id] || 0) - (toolViews[a.id] || 0))
            .slice(0, 10)
        },

        // Comparison
        addToComparison: (toolId) => {
          const { comparisonList } = get()
          if (comparisonList.length < 3 && !comparisonList.includes(toolId)) {
            set({ comparisonList: [...comparisonList, toolId] })
          }
        },
        removeFromComparison: (toolId) => {
          const { comparisonList } = get()
          set({ comparisonList: comparisonList.filter((id) => id !== toolId) })
        },
        clearComparison: () => set({ comparisonList: [] }),
        isInComparison: (toolId) => get().comparisonList.includes(toolId),
        getComparisonTools: () => {
          const { tools, comparisonList } = get()
          return comparisonList
            .map((id) => tools.find((t) => t.id === id))
            .filter((t): t is OSINTTool => t !== undefined)
        },

        // Utility
        getToolById: (id) => get().tools.find((t) => t.id === id),
        getAllTags: () => {
          const { tools } = get()
          const tagSet = new Set<string>()
          tools.forEach((tool) => tool.tags.forEach((tag) => tagSet.add(tag)))
          return Array.from(tagSet).sort()
        },
      }),
      {
        name: "osint-user-data",
        partialize: (state) => ({
          favorites: state.favorites,
          recentlyViewed: state.recentlyViewed,
          userRatings: state.userRatings,
          toolViews: state.toolViews,
          viewMode: state.viewMode,
        }),
      }
    ),
    { name: "osint-store" },
  ),
)
