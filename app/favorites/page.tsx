"use client"

import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useOSINTStore } from "@/lib/store"
import { useToolsData } from "@/lib/use-tools-data"
import { useToast } from "@/components/ui/toast"
import {
  Heart,
  ExternalLink,
  Copy,
  Trash2,
  ArrowLeft,
  Bookmark,
} from "lucide-react"

export default function FavoritesPage() {
  useToolsData()
  const { addToast } = useToast()

  const {
    tools,
    favorites,
    categories,
    toggleFavorite,
    isLoading,
  } = useOSINTStore()

  const favoriteTools = tools.filter((tool) => favorites.includes(tool.id))

  const handleCopyUrl = async (url: string, name: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url)
      } else {
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
  }

  const handleRemoveFavorite = (toolId: string, name: string) => {
    toggleFavorite(toolId)
    addToast({
      title: "Removed from favorites",
      description: name,
      variant: "success",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8 pt-24">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto" />
            <p className="mt-4 text-muted-foreground">Loading favorites...</p>
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Heart className="h-8 w-8 text-red-400 fill-red-400" />
              <h1 className="text-3xl font-bold text-foreground">My Favorites</h1>
            </div>
            <p className="text-muted-foreground">
              {favoriteTools.length} saved tool{favoriteTools.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/tools">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Browse Tools
            </Link>
          </Button>
        </div>

        {favoriteTools.length === 0 ? (
          <Card className="border-yellow-500/20 bg-card/50">
            <CardContent className="text-center py-12">
              <Bookmark className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No favorites yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Start exploring tools and click the heart icon to save your favorites for quick access.
              </p>
              <Button asChild>
                <Link href="/tools">
                  Explore Tools
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoriteTools.map((tool) => {
              const category = categories.find((c) => c.id === tool.category)
              return (
                <Card
                  key={tool.id}
                  className="border-border/50 bg-card/50 hover:border-green-500/30 transition-colors"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <Link
                        href={`/tools/${tool.id}`}
                        className="text-green-400 hover:text-green-300 font-semibold"
                      >
                        {tool.name}
                      </Link>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleCopyUrl(tool.url, tool.name)}
                          className="p-1.5 hover:bg-muted rounded"
                          title="Copy URL"
                        >
                          <Copy className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                        </button>
                        <button
                          onClick={() => handleRemoveFavorite(tool.id, tool.name)}
                          className="p-1.5 hover:bg-red-500/20 rounded"
                          title="Remove from favorites"
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-400" />
                        </button>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {tool.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {tool.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {category?.icon} {category?.name}
                      </span>
                      <Button size="sm" variant="outline" asChild>
                        <a href={tool.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Visit
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
