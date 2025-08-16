"use client"

import { useEffect } from "react"
import { useOSINTStore } from "./store"
import { loadToolsFromReadme } from "./markdown-parser"

export function useReadmeData() {
  const { setTools, setCategories, setIsLoading, filterTools } = useOSINTStore()

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      console.log("[*] Starting to load README data...")

      try {
        const { tools, categories } = await loadToolsFromReadme()
        console.log("[*] Loaded tools:", tools.length, "categories:", categories.length)
        setTools(tools)
        setCategories(categories)
        filterTools()
      } catch (error) {
        console.error("[*] Failed to load README data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [setTools, setCategories, setIsLoading, filterTools])
}
