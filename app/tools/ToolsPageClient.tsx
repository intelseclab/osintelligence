"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useOSINTStore } from "@/lib/store"
import { useToolsData } from "@/lib/use-tools-data"
import { Search, ExternalLink, Grid, List, ChevronLeft, ChevronRight } from "lucide-react"

const ITEMS_PER_PAGE = 50

export default function ToolsPageClient() {
  useToolsData()
  const searchParams = useSearchParams()
  const router = useRouter()

  const [currentPage, setCurrentPage] = useState(1)

  const {
    filteredTools,
    categories,
    searchQuery,
    selectedCategory,
    viewMode,
    sortBy,
    setSearchQuery,
    setSelectedCategory,
    setViewMode,
    setSortBy,
    isLoading,
  } = useOSINTStore()

  const [showFilters, setShowFilters] = useState(false)

  // Function to handle category change with URL update
  const handleCategoryChange = (value: string) => {
    const newCategory = value === "all" ? null : value
    setSelectedCategory(newCategory)
    
    // Update URL
    const params = new URLSearchParams(searchParams.toString())
    if (newCategory) {
      params.set("category", newCategory)
    } else {
      params.delete("category")
    }
    
    const newUrl = params.toString() ? `/tools?${params.toString()}` : "/tools"
    router.push(newUrl)
  }

  // Function to handle search query change with URL update
  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    
    // Update URL
    const params = new URLSearchParams(searchParams.toString())
    if (query.trim()) {
      params.set("search", query.trim())
    } else {
      params.delete("search")
    }
    
    const newUrl = params.toString() ? `/tools?${params.toString()}` : "/tools"
    router.push(newUrl)
  }

  useEffect(() => {
    const categoryParam = searchParams.get("category")
    const searchParam = searchParams.get("search")
    
    if (categoryParam && categoryParam !== selectedCategory) {
      setSelectedCategory(categoryParam)
    }
    
    if (searchParam && searchParam !== searchQuery) {
      setSearchQuery(searchParam)
    }
  }, [searchParams, selectedCategory, setSelectedCategory, searchQuery, setSearchQuery])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedCategory, sortBy])

  const totalPages = Math.ceil(filteredTools.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedTools = filteredTools.slice(startIndex, endIndex)

  const getPageNumbers = () => {
    const pages = []
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
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading OSINT tools...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 pt-24">
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
                  placeholder="Search tools, descriptions, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearchChange(e.currentTarget.value)
                    }
                  }}
                  onBlur={(e) => handleSearchChange(e.target.value)}
                  className="pl-10 bg-background/50"
                />
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
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-full lg:w-32 bg-background/50">
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
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredTools.length)} of {filteredTools.length} tools
            {selectedCategory && selectedCategory !== "all" && (
              <span> in {categories.find((c) => c.id === selectedCategory)?.name}</span>
            )}
            {searchQuery && <span> matching "{searchQuery}"</span>}
          </p>

          {(selectedCategory || searchQuery) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedCategory(null)
                setSearchQuery("")
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
              <p className="text-muted-foreground mb-4">No tools found matching your criteria.</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedCategory(null)
                  setSearchQuery("")
                  router.push("/tools")
                }}
                className="text-green-400 border-green-500/20"
              >
                Show All Tools
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="space-y-1">
              {paginatedTools.map((tool, index) => (
                <div
                  key={tool.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-card/30 transition-colors border border-transparent hover:border-green-500/20"
                >
                  {/* Number */}
                  <span className="text-muted-foreground text-sm font-mono w-6 text-right flex-shrink-0 mt-0.5">
                    {startIndex + index + 1}.
                  </span>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 mb-1">
                      <a
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-400 hover:text-green-300 font-medium text-sm leading-tight"
                      >
                        {tool.name}
                      </a>
                      <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                    </div>

                    <p className="text-muted-foreground text-sm leading-relaxed mb-2">{tool.description}</p>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        {categories.find((c) => c.id === tool.category)?.icon}
                        {categories.find((c) => c.id === tool.category)?.name}
                      </span>

                      {tool.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-green-400">
                          #{tag}
                        </span>
                      ))}

                      {tool.tags.length > 3 && <span className="text-green-400">+{tool.tags.length - 3} more</span>}

                      <span className="ml-auto">{tool.url.includes("github") ? "Open Source" : "Free"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="text-green-400 border-green-500/20 disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {getPageNumbers().map((page, index) => (
                    <div key={index}>
                      {page === "..." ? (
                        <span className="px-3 py-2 text-muted-foreground">...</span>
                      ) : (
                        <Button
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page as number)}
                          className={
                            currentPage === page ? "bg-green-500 text-white" : "text-green-400 border-green-500/20"
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
                  Next
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
