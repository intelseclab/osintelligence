"use client"

import { useState, useEffect, useDeferredValue, useCallback, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ToolsPageSkeleton } from "@/components/ui/skeleton"
import { useOSINTStore } from "@/lib/store"
import { useToolsData } from "@/lib/use-tools-data"
import { useToast } from "@/components/ui/toast"
import { sanitizeInput } from "@/lib/utils"
import {
  Search,
  ExternalLink,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
  Copy,
  Heart,
  GitCompare,
  X,
  Tag,
  Lightbulb,
  Keyboard,
  AlertTriangle,
  RefreshCw,
} from "lucide-react"

const ITEMS_PER_PAGE = 50

export default function ToolsPageClient() {
  useToolsData()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { addToast } = useToast()
  const searchInputRef = useRef<HTMLInputElement>(null)

  const [currentPage, setCurrentPage] = useState(1)
  const [localSearchQuery, setLocalSearchQuery] = useState("")
  const deferredSearchQuery = useDeferredValue(localSearchQuery)
  const [showKeyboardHint, setShowKeyboardHint] = useState(true)

  const {
    filteredTools,
    categories,
    searchQuery,
    selectedCategory,
    selectedTags,
    viewMode,
    sortBy,
    setSearchQuery,
    setSelectedCategory,
    setSelectedTags,
    toggleTag,
    setViewMode,
    setSortBy,
    isLoading,
    isError,
    errorMessage,
    toggleFavorite,
    isFavorite,
    addToComparison,
    isInComparison,
    comparisonList,
    getAllTags,
  } = useOSINTStore()

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // "/" to focus search
      if (e.key === "/" && !e.ctrlKey && !e.metaKey) {
        const activeElement = document.activeElement
        if (activeElement?.tagName !== "INPUT" && activeElement?.tagName !== "TEXTAREA") {
          e.preventDefault()
          searchInputRef.current?.focus()
        }
      }
      // "Escape" to clear search and blur
      if (e.key === "Escape") {
        if (document.activeElement === searchInputRef.current) {
          searchInputRef.current?.blur()
          if (localSearchQuery) {
            setLocalSearchQuery("")
            setSearchQuery("")
            const params = new URLSearchParams(searchParams.toString())
            params.delete("search")
            const newUrl = params.toString() ? `/tools?${params.toString()}` : "/tools"
            router.push(newUrl)
          }
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [localSearchQuery, searchParams, router, setSearchQuery])

  // Hide keyboard hint after first interaction
  useEffect(() => {
    const timer = setTimeout(() => setShowKeyboardHint(false), 10000)
    return () => clearTimeout(timer)
  }, [])

  // Sync local search query with global search query
  useEffect(() => {
    setLocalSearchQuery(searchQuery)
  }, [searchQuery])

  // Function to handle category change with URL update
  const handleCategoryChange = useCallback((value: string) => {
    const newCategory = value === "all" ? null : value
    setSelectedCategory(newCategory)

    const params = new URLSearchParams(searchParams.toString())
    if (newCategory) {
      params.set("category", newCategory)
    } else {
      params.delete("category")
    }

    const newUrl = params.toString() ? `/tools?${params.toString()}` : "/tools"
    router.push(newUrl)
  }, [searchParams, setSelectedCategory, router])

  // Function to handle search query change with URL update
  const handleSearchChange = useCallback((query: string) => {
    const sanitized = sanitizeInput(query)
    setSearchQuery(sanitized)

    const params = new URLSearchParams(searchParams.toString())
    if (sanitized.trim()) {
      params.set("search", sanitized.trim())
    } else {
      params.delete("search")
    }

    const newUrl = params.toString() ? `/tools?${params.toString()}` : "/tools"
    router.push(newUrl)
  }, [searchParams, setSearchQuery, router])

  // Handle tag click
  const handleTagClick = useCallback((tag: string) => {
    toggleTag(tag)
  }, [toggleTag])

  // Copy tool URL
  const handleCopyUrl = useCallback(async (url: string, name: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url)
      } else {
        // Fallback for older browsers
        const textArea = document.createElement("textarea")
        textArea.value = url
        textArea.style.position = "fixed"
        textArea.style.left = "-999999px"
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand("copy")
        document.body.removeChild(textArea)
      }
      addToast({
        title: "URL copied!",
        description: `${name} URL copied to clipboard`,
        variant: "success",
      })
    } catch {
      addToast({
        title: "Failed to copy",
        description: "Please copy the URL manually",
        variant: "error",
      })
    }
  }, [addToast])

  // Toggle favorite
  const handleToggleFavorite = useCallback((toolId: string, name: string) => {
    const wasFavorite = isFavorite(toolId)
    toggleFavorite(toolId)
    addToast({
      title: wasFavorite ? "Removed from favorites" : "Added to favorites",
      description: name,
      variant: "success",
    })
  }, [toggleFavorite, isFavorite, addToast])

  // Add to comparison
  const handleAddToComparison = useCallback((toolId: string, name: string) => {
    if (comparisonList.length >= 3) {
      addToast({
        title: "Comparison limit reached",
        description: "You can compare up to 3 tools",
        variant: "error",
      })
      return
    }
    addToComparison(toolId)
    addToast({
      title: "Added to comparison",
      description: `${name} (${comparisonList.length + 1}/3)`,
      variant: "success",
    })
  }, [addToComparison, comparisonList.length, addToast])

  // Use refs to track current values without triggering re-renders
  const selectedCategoryRef = useRef(selectedCategory)
  const searchQueryRef = useRef(searchQuery)
  selectedCategoryRef.current = selectedCategory
  searchQueryRef.current = searchQuery

  useEffect(() => {
    const categoryParam = searchParams.get("category")
    const searchParam = searchParams.get("search")
    const tagParam = searchParams.get("tag")

    if (categoryParam && categoryParam !== selectedCategoryRef.current) {
      setSelectedCategory(categoryParam)
    } else if (!categoryParam && selectedCategoryRef.current) {
      setSelectedCategory(null)
    }

    if (searchParam !== null && searchParam !== searchQueryRef.current) {
      setSearchQuery(sanitizeInput(searchParam))
    } else if (searchParam === null && searchQueryRef.current) {
      setSearchQuery("")
    }

    // Handle tag from URL
    if (tagParam && !selectedTags.includes(tagParam)) {
      toggleTag(tagParam)
    }
  }, [searchParams, setSelectedCategory, setSearchQuery, selectedTags, toggleTag])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedCategory, selectedTags, sortBy])

  const totalPages = Math.ceil(filteredTools.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedTools = filteredTools.slice(startIndex, endIndex)

  // Get popular tags for suggestions
  const popularTags = getAllTags().slice(0, 10)

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i)
        pages.push("...")
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push("...")
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i)
      } else {
        pages.push(1)
        pages.push("...")
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i)
        pages.push("...")
        pages.push(totalPages)
      }
    }

    return pages
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8 pt-24">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">OSINT Tools Directory</h1>
            <p className="text-xl text-muted-foreground">Loading tools...</p>
          </div>
          <ToolsPageSkeleton />
        </main>
        <Footer />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8 pt-24">
          <Card className="max-w-md mx-auto border-red-500/20 bg-card/50">
            <CardContent className="pt-6 text-center">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Failed to Load Tools
              </h2>
              <p className="text-muted-foreground mb-6">
                {errorMessage || "Something went wrong. Please try again."}
              </p>
              <Button
                onClick={() => window.location.reload()}
                className="bg-green-600 hover:bg-green-700"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Breadcrumb */}
        {(selectedCategory || searchQuery || selectedTags.length > 0) && (
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/tools" className="hover:text-foreground transition-colors">
              All Tools
            </Link>
            {selectedCategory && (
              <>
                <span>/</span>
                <span className="text-foreground">
                  {categories.find((c) => c.id === selectedCategory)?.name}
                </span>
              </>
            )}
            {searchQuery && (
              <>
                <span>/</span>
                <span className="text-foreground">Search: {searchQuery}</span>
              </>
            )}
          </nav>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">OSINT Tools Directory</h1>
          <p className="text-xl text-muted-foreground">
            Discover and explore {filteredTools.length} carefully curated OSINT tools
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="border-green-500/20 bg-card/50 mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  ref={searchInputRef}
                  placeholder="Search tools, descriptions, or tags... (Press / to focus)"
                  value={localSearchQuery}
                  onChange={(e) => {
                    const value = e.target.value
                    setLocalSearchQuery(value)
                    if (!value.trim()) {
                      setSearchQuery("")
                      const params = new URLSearchParams(searchParams.toString())
                      params.delete("search")
                      const newUrl = params.toString() ? `/tools?${params.toString()}` : "/tools"
                      router.push(newUrl)
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearchChange(e.currentTarget.value)
                    }
                  }}
                  onBlur={() => handleSearchChange(localSearchQuery)}
                  className="pl-10 pr-10 bg-background/50"
                />
                {showKeyboardHint && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 hidden sm:flex items-center text-xs text-muted-foreground">
                    <Keyboard className="h-3 w-3 mr-1" />
                    <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">/</kbd>
                  </div>
                )}
              </div>

              {/* Category Filter */}
              <Select
                value={selectedCategory || "all"}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger className="w-full lg:w-48 bg-background/50">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={(value: "name" | "rating" | "recent" | "popular") => setSortBy(value)}>
                <SelectTrigger className="w-full lg:w-36 bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="recent">Recent</SelectItem>
                  <SelectItem value="popular">Popular</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode */}
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="px-3"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="px-3"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Active Tag Filters */}
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border/50">
                <span className="text-xs text-muted-foreground">Filtering by tags:</span>
                {selectedTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer hover:bg-destructive/20"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTags([])}
                  className="h-6 text-xs"
                >
                  Clear all
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Comparison Bar */}
        {comparisonList.length > 0 && (
          <Card className="border-blue-500/20 bg-blue-950/20 mb-4">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GitCompare className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-blue-300">
                  {comparisonList.length} tool{comparisonList.length > 1 ? "s" : ""} selected for comparison
                </span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" asChild>
                  <Link href="/tools/compare">Compare Now</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            Showing {filteredTools.length > 0 ? startIndex + 1 : 0}-{Math.min(endIndex, filteredTools.length)} of {filteredTools.length} tools
            {selectedCategory && selectedCategory !== "all" && (
              <span> in {categories.find((c) => c.id === selectedCategory)?.name}</span>
            )}
            {searchQuery && <span> matching &quot;{searchQuery}&quot;</span>}
          </p>

          {(selectedCategory || searchQuery || selectedTags.length > 0) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedCategory(null)
                setSearchQuery("")
                setSelectedTags([])
                router.push("/tools")
              }}
              className="text-green-400 border-green-500/20"
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Tools List */}
        {filteredTools.length === 0 ? (
          <Card className="border-yellow-500/20 bg-card/50">
            <CardContent className="text-center py-12">
              <Lightbulb className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No tools found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filters to find what you&apos;re looking for.
              </p>

              {/* Suggestions */}
              <div className="space-y-4">
                {searchQuery && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Try searching for:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {["osint", "social media", "email", "domain"].map((suggestion) => (
                        <Badge
                          key={suggestion}
                          variant="outline"
                          className="cursor-pointer hover:bg-green-500/20"
                          onClick={() => handleSearchChange(suggestion)}
                        >
                          {suggestion}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Popular tags:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {popularTags.slice(0, 6).map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="cursor-pointer hover:bg-green-500/20"
                        onClick={() => handleTagClick(tag)}
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCategory(null)
                    setSearchQuery("")
                    setSelectedTags([])
                    router.push("/tools")
                  }}
                  className="text-green-400 border-green-500/20"
                >
                  Show All Tools
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="space-y-1">
              {paginatedTools.map((tool, index) => (
                <div
                  key={tool.id}
                  className="group flex items-start gap-3 p-3 rounded-lg hover:bg-card/30 transition-colors border border-transparent hover:border-green-500/20"
                >
                  {/* Number */}
                  <span className="text-muted-foreground text-sm font-mono w-6 text-right flex-shrink-0 mt-0.5">
                    {startIndex + index + 1}.
                  </span>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 mb-1">
                      <Link
                        href={`/tools/${tool.id}`}
                        className="text-green-400 hover:text-green-300 font-medium text-sm leading-tight"
                      >
                        {tool.name}
                      </Link>
                      <a
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-green-400"
                      >
                        <ExternalLink className="h-3 w-3 flex-shrink-0 mt-0.5" />
                      </a>

                      {/* Action buttons - visible on hover */}
                      <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleCopyUrl(tool.url, tool.name)}
                          className="p-1 hover:bg-muted rounded"
                          title="Copy URL"
                        >
                          <Copy className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                        </button>
                        <button
                          onClick={() => handleToggleFavorite(tool.id, tool.name)}
                          className="p-1 hover:bg-muted rounded"
                          title={isFavorite(tool.id) ? "Remove from favorites" : "Add to favorites"}
                        >
                          <Heart
                            className={`h-3 w-3 ${
                              isFavorite(tool.id)
                                ? "text-red-400 fill-red-400"
                                : "text-muted-foreground hover:text-red-400"
                            }`}
                          />
                        </button>
                        <button
                          onClick={() => handleAddToComparison(tool.id, tool.name)}
                          className="p-1 hover:bg-muted rounded"
                          title="Add to comparison"
                          disabled={isInComparison(tool.id)}
                        >
                          <GitCompare
                            className={`h-3 w-3 ${
                              isInComparison(tool.id)
                                ? "text-blue-400"
                                : "text-muted-foreground hover:text-blue-400"
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    <p className="text-muted-foreground text-sm leading-relaxed mb-2">{tool.description}</p>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        {categories.find((c) => c.id === tool.category)?.icon}
                        {categories.find((c) => c.id === tool.category)?.name}
                      </span>

                      {tool.tags.slice(0, 3).map((tag) => (
                        <button
                          key={tag}
                          onClick={() => handleTagClick(tag)}
                          className={`text-green-400 hover:text-green-300 hover:underline ${
                            selectedTags.includes(tag) ? "font-semibold" : ""
                          }`}
                        >
                          #{tag}
                        </button>
                      ))}

                      {tool.tags.length > 3 && (
                        <span className="text-green-400">+{tool.tags.length - 3} more</span>
                      )}

                      <span className="ml-auto">
                        {tool.url.includes("github") ? "Open Source" : "Free"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="text-green-400 border-green-500/20 disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline ml-1">Previous</span>
                </Button>

                <div className="flex items-center gap-1">
                  {getPageNumbers().map((page, index) => (
                    <div key={index}>
                      {page === "..." ? (
                        <span className="px-2 py-2 text-muted-foreground">...</span>
                      ) : (
                        <Button
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page as number)}
                          className={
                            currentPage === page
                              ? "bg-green-500 text-white"
                              : "text-green-400 border-green-500/20"
                          }
                        >
                          {page}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="text-green-400 border-green-500/20 disabled:opacity-50"
                >
                  <span className="hidden sm:inline mr-1">Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}
