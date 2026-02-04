"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { useOSINTStore } from "@/lib/store"
import { Search, Tag, ArrowRight, Keyboard } from "lucide-react"

interface SearchAutocompleteProps {
  placeholder?: string
  className?: string
  onSearch?: (query: string) => void
}

export function SearchAutocomplete({
  placeholder = "Search tools...",
  className = "",
  onSearch,
}: SearchAutocompleteProps) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)

  const { tools, categories, getAllTags } = useOSINTStore()

  // Get suggestions based on query
  const getSuggestions = useCallback(() => {
    if (!query.trim() || query.length < 2) return { tools: [], tags: [], categories: [] }

    const q = query.toLowerCase()

    // Match tools
    const matchingTools = tools
      .filter(
        (tool) =>
          tool.name.toLowerCase().includes(q) ||
          tool.description.toLowerCase().includes(q)
      )
      .slice(0, 5)

    // Match tags
    const allTags = getAllTags()
    const matchingTags = allTags
      .filter((tag) => tag.toLowerCase().includes(q))
      .slice(0, 3)

    // Match categories
    const matchingCategories = categories
      .filter(
        (cat) =>
          cat.name.toLowerCase().includes(q) ||
          cat.id.toLowerCase().includes(q)
      )
      .slice(0, 3)

    return {
      tools: matchingTools,
      tags: matchingTags,
      categories: matchingCategories,
    }
  }, [query, tools, categories, getAllTags])

  const suggestions = getSuggestions()
  const totalSuggestions =
    suggestions.tools.length +
    suggestions.tags.length +
    suggestions.categories.length

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          setSelectedIndex((prev) =>
            prev < totalSuggestions - 1 ? prev + 1 : 0
          )
          break
        case "ArrowUp":
          e.preventDefault()
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : totalSuggestions - 1
          )
          break
        case "Enter":
          e.preventDefault()
          if (selectedIndex >= 0) {
            // Inline handleSelect logic
            let currentIndex = 0
            for (const tool of suggestions.tools) {
              if (currentIndex === selectedIndex) {
                router.push(`/tools/${tool.id}`)
                setIsOpen(false)
                setQuery("")
                return
              }
              currentIndex++
            }
            for (const tag of suggestions.tags) {
              if (currentIndex === selectedIndex) {
                router.push(`/tools?tag=${tag}`)
                setIsOpen(false)
                setQuery("")
                return
              }
              currentIndex++
            }
            for (const cat of suggestions.categories) {
              if (currentIndex === selectedIndex) {
                router.push(`/tools?category=${cat.id}`)
                setIsOpen(false)
                setQuery("")
                return
              }
              currentIndex++
            }
          } else if (query.trim()) {
            // handleSearch inline
            if (onSearch) {
              onSearch(query.trim())
            } else {
              router.push(`/tools?search=${encodeURIComponent(query.trim())}`)
            }
            setIsOpen(false)
          }
          break
        case "Escape":
          setIsOpen(false)
          setSelectedIndex(-1)
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, selectedIndex, totalSuggestions, suggestions, query, router, onSearch])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = (index: number) => {
    let currentIndex = 0

    // Tools
    for (const tool of suggestions.tools) {
      if (currentIndex === index) {
        router.push(`/tools/${tool.id}`)
        setIsOpen(false)
        setQuery("")
        return
      }
      currentIndex++
    }

    // Tags
    for (const tag of suggestions.tags) {
      if (currentIndex === index) {
        router.push(`/tools?tag=${tag}`)
        setIsOpen(false)
        setQuery("")
        return
      }
      currentIndex++
    }

    // Categories
    for (const cat of suggestions.categories) {
      if (currentIndex === index) {
        router.push(`/tools?category=${cat.id}`)
        setIsOpen(false)
        setQuery("")
        return
      }
      currentIndex++
    }
  }

  const handleSearch = () => {
    if (query.trim()) {
      if (onSearch) {
        onSearch(query.trim())
      } else {
        router.push(`/tools?search=${encodeURIComponent(query.trim())}`)
      }
      setIsOpen(false)
    }
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(e.target.value.length >= 2)
            setSelectedIndex(-1)
          }}
          onFocus={() => {
            if (query.length >= 2) setIsOpen(true)
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isOpen) {
              handleSearch()
            }
          }}
          placeholder={placeholder}
          className="pl-10 pr-16 bg-background/50"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
          <Keyboard className="h-3 w-3" />
          <kbd className="px-1 py-0.5 bg-muted rounded text-[10px]">/</kbd>
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && totalSuggestions > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50">
          {/* Tools */}
          {suggestions.tools.length > 0 && (
            <div className="p-2">
              <div className="text-xs text-muted-foreground px-2 py-1">Tools</div>
              {suggestions.tools.map((tool, i) => {
                const globalIndex = i
                return (
                  <Link
                    key={tool.id}
                    href={`/tools/${tool.id}`}
                    onClick={() => {
                      setIsOpen(false)
                      setQuery("")
                    }}
                    className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                      selectedIndex === globalIndex
                        ? "bg-green-500/20 text-green-400"
                        : "hover:bg-muted"
                    }`}
                  >
                    <div className="font-medium">{tool.name}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {tool.description}
                    </div>
                  </Link>
                )
              })}
            </div>
          )}

          {/* Tags */}
          {suggestions.tags.length > 0 && (
            <div className="p-2 border-t border-border/50">
              <div className="text-xs text-muted-foreground px-2 py-1">Tags</div>
              {suggestions.tags.map((tag, i) => {
                const globalIndex = suggestions.tools.length + i
                return (
                  <Link
                    key={tag}
                    href={`/tools?tag=${tag}`}
                    onClick={() => {
                      setIsOpen(false)
                      setQuery("")
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                      selectedIndex === globalIndex
                        ? "bg-green-500/20 text-green-400"
                        : "hover:bg-muted"
                    }`}
                  >
                    <Tag className="h-3 w-3" />
                    #{tag}
                  </Link>
                )
              })}
            </div>
          )}

          {/* Categories */}
          {suggestions.categories.length > 0 && (
            <div className="p-2 border-t border-border/50">
              <div className="text-xs text-muted-foreground px-2 py-1">Categories</div>
              {suggestions.categories.map((cat, i) => {
                const globalIndex =
                  suggestions.tools.length + suggestions.tags.length + i
                return (
                  <Link
                    key={cat.id}
                    href={`/tools?category=${cat.id}`}
                    onClick={() => {
                      setIsOpen(false)
                      setQuery("")
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                      selectedIndex === globalIndex
                        ? "bg-green-500/20 text-green-400"
                        : "hover:bg-muted"
                    }`}
                  >
                    <span>{cat.icon}</span>
                    {cat.name}
                  </Link>
                )
              })}
            </div>
          )}

          {/* Search all */}
          <div className="p-2 border-t border-border/50">
            <button
              onClick={handleSearch}
              className="flex items-center justify-between w-full px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors"
            >
              <span className="text-muted-foreground">
                Search for &quot;{query}&quot;
              </span>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
