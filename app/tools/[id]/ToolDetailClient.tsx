"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useOSINTStore } from "@/lib/store"
import { useToolsData } from "@/lib/use-tools-data"
import { useToast } from "@/components/ui/toast"
import {
  ArrowLeft,
  ExternalLink,
  Heart,
  Copy,
  GitCompare,
  Clock,
  Tag,
  Shield,
} from "lucide-react"

interface ToolDetailClientProps {
  toolId: string
}

export default function ToolDetailClient({ toolId }: ToolDetailClientProps) {
  useToolsData()
  const router = useRouter()
  const { addToast } = useToast()

  const {
    tools,
    categories,
    isLoading,
    getToolById,
    toggleFavorite,
    isFavorite,
    addToRecentlyViewed,
    incrementToolView,
    addToComparison,
    isInComparison,
    comparisonList,
  } = useOSINTStore()

  const [tool, setTool] = useState(getToolById(toolId))
  const [relatedTools, setRelatedTools] = useState<typeof tools>([])

  useEffect(() => {
    const foundTool = getToolById(toolId)
    if (foundTool) {
      setTool(foundTool)
      addToRecentlyViewed(toolId)
      incrementToolView(toolId)

      // Find related tools (same category, excluding current)
      const related = tools
        .filter((t) => t.category === foundTool.category && t.id !== toolId)
        .slice(0, 4)
      setRelatedTools(related)
    }
  }, [toolId, tools, getToolById, addToRecentlyViewed, incrementToolView])

  const handleCopyUrl = async () => {
    if (tool) {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(tool.url)
        } else {
          const textArea = document.createElement("textarea")
          textArea.value = tool.url
          textArea.style.position = "fixed"
          textArea.style.left = "-999999px"
          document.body.appendChild(textArea)
          textArea.select()
          document.execCommand("copy")
          document.body.removeChild(textArea)
        }
        addToast({
          title: "URL copied!",
          description: "Tool URL copied to clipboard",
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
  }

  const handleToggleFavorite = () => {
    toggleFavorite(toolId)
    addToast({
      title: isFavorite(toolId) ? "Removed from favorites" : "Added to favorites",
      variant: "success",
    })
  }

  const handleAddToComparison = () => {
    if (comparisonList.length >= 3) {
      addToast({
        title: "Comparison limit reached",
        description: "You can compare up to 3 tools at a time",
        variant: "error",
      })
      return
    }
    addToComparison(toolId)
    addToast({
      title: "Added to comparison",
      description: `${comparisonList.length + 1}/3 tools selected`,
      variant: "success",
    })
  }

  const category = categories.find((c) => c.id === tool?.category)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8 pt-24">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-32 w-full rounded-lg" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-40 w-full rounded-lg" />
              <Skeleton className="h-40 w-full rounded-lg" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!tool) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8 pt-24">
          <Card className="max-w-md mx-auto border-yellow-500/20">
            <CardContent className="pt-6 text-center">
              <h1 className="text-xl font-semibold mb-4">Tool Not Found</h1>
              <p className="text-muted-foreground mb-6">
                The tool you&apos;re looking for doesn&apos;t exist or has been removed.
              </p>
              <Button onClick={() => router.push("/tools")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Tools
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
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/tools" className="hover:text-foreground transition-colors">
            Tools
          </Link>
          <span>/</span>
          {category && (
            <>
              <Link
                href={`/tools?category=${category.id}`}
                className="hover:text-foreground transition-colors"
              >
                {category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-foreground">{tool.name}</span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tool Header */}
            <Card className="border-green-500/20 bg-card/50">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground mb-2">{tool.name}</h1>
                    <p className="text-muted-foreground">{tool.description}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {tool.tags.map((tag) => (
                    <Link key={tag} href={`/tools?tag=${tag}`}>
                      <Badge
                        variant="outline"
                        className="cursor-pointer hover:bg-green-500/20 hover:border-green-500/50 transition-colors"
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    </Link>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button asChild className="bg-green-600 hover:bg-green-700">
                    <a href={tool.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit Tool
                    </a>
                  </Button>
                  <Button variant="outline" onClick={handleCopyUrl}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy URL
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleToggleFavorite}
                    className={isFavorite(toolId) ? "text-red-400 border-red-500/50" : ""}
                  >
                    <Heart
                      className={`h-4 w-4 mr-2 ${isFavorite(toolId) ? "fill-current" : ""}`}
                    />
                    {isFavorite(toolId) ? "Saved" : "Save"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleAddToComparison}
                    disabled={isInComparison(toolId)}
                  >
                    <GitCompare className="h-4 w-4 mr-2" />
                    {isInComparison(toolId) ? "In Comparison" : "Compare"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tool Details */}
            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <CardTitle className="text-lg">Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Category:</span>
                    <span className="text-foreground">
                      {category?.icon} {category?.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Added:</span>
                    <span className="text-foreground">
                      {new Date(tool.addedDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">URL:</span>
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-400 hover:underline truncate max-w-[200px]"
                    >
                      {tool.url}
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Type:</span>
                    <span className="text-foreground">
                      {tool.url.includes("github") ? "Open Source" : "Free Tool"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href={`/tools?category=${tool.category}`}>
                    <Shield className="h-4 w-4 mr-2" />
                    More in {category?.name}
                  </Link>
                </Button>
                {comparisonList.length > 0 && (
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/tools/compare">
                      <GitCompare className="h-4 w-4 mr-2" />
                      View Comparison ({comparisonList.length})
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Related Tools */}
            {relatedTools.length > 0 && (
              <Card className="border-border/50 bg-card/50">
                <CardHeader>
                  <CardTitle className="text-lg">Related Tools</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {relatedTools.map((relTool) => (
                    <Link
                      key={relTool.id}
                      href={`/tools/${relTool.id}`}
                      className="block p-3 rounded-lg border border-border/50 hover:border-green-500/50 transition-colors"
                    >
                      <h4 className="font-medium text-sm text-foreground mb-1">
                        {relTool.name}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {relTool.description}
                      </p>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
