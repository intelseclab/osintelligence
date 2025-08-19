"use client"

import { useEffect } from "react"
import { useOSINTStore } from "./store"
import { loadToolsFromFiles } from "./markdown-parser"

export function useToolsData() {
  const { setTools, setCategories, setIsLoading, filterTools } = useOSINTStore()

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      console.log("[*] Starting to load tools data from files...")

      try {
        const { tools, categories } = await loadToolsFromFiles()
        console.log("[*] Loaded tools:", tools.length, "categories:", categories.length)
        setTools(tools)
        setCategories(categories)
        filterTools()
      } catch (error) {
        console.error("[*] Failed to load tools data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [setTools, setCategories, setIsLoading, filterTools])
}
