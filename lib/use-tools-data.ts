"use client"

import { useEffect } from "react"
import { useOSINTStore, type OSINTTool, type Category } from "./store"
import { loadToolsFromFiles } from "./markdown-parser"

const CACHE_KEY = "osint-tools-cache-v2"
const CACHE_TTL = 1000 * 60 * 60 // 1 hour

interface CachedData {
  tools: OSINTTool[]
  categories: Category[]
  timestamp: number
}

function getCachedData(): CachedData | null {
  if (typeof window === "undefined") return null

  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (!cached) return null

    const data: CachedData = JSON.parse(cached)
    if (Date.now() - data.timestamp > CACHE_TTL) {
      localStorage.removeItem(CACHE_KEY)
      return null
    }

    return data
  } catch {
    return null
  }
}

function setCachedData(tools: OSINTTool[], categories: Category[]): void {
  if (typeof window === "undefined") return

  try {
    const data: CachedData = {
      tools,
      categories,
      timestamp: Date.now(),
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(data))
  } catch {
    // Storage may be full or unavailable
  }
}

export function useToolsData() {
  const { setTools, setCategories, setIsLoading, setError, filterTools } = useOSINTStore()

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      setError(false)

      try {
        // Check cache first
        const cached = getCachedData()
        if (cached && cached.tools.length > 0) {
          setTools(cached.tools)
          setCategories(cached.categories)
          filterTools()
          setIsLoading(false)
          return
        }

        // Load fresh data
        const { tools, categories } = await loadToolsFromFiles()

        if (tools.length === 0) {
          setError(true, "No tools found. Please try again later.")
        }

        setTools(tools)
        setCategories(categories)
        filterTools()

        // Cache the result
        if (tools.length > 0) {
          setCachedData(tools, categories)
        }
      } catch (err) {
        setError(true, "Failed to load tools. Please check your connection and try again.")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [setTools, setCategories, setIsLoading, setError, filterTools])
}
