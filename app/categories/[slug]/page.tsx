"use client"

import { useParams } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useOSINTStore } from "@/lib/store"
import { useToolsData } from "@/lib/use-tools-data"
import { ExternalLink, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CategoryPage() {
  const params = useParams()
  const slug = params.slug as string

  useToolsData()

  const { tools, categories, isLoading } = useOSINTStore()

  const category = categories.find((c) => c.id === slug)
  const categoryTools = tools.filter((tool) => tool.category === slug)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading category...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Category Not Found</h1>
            <p className="text-muted-foreground mb-6">The category you&apos;re looking for doesn&apos;t exist.</p>
            <Button asChild>
              <Link href="/tools">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Tools
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-green-400">
            Home
          </Link>
          <span>/</span>
          <Link href="/tools" className="hover:text-green-400">
            Tools
          </Link>
          <span>/</span>
          <span className="text-foreground">{category.name}</span>
        </div>

        {/* Category Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{category.icon}</div>
          <h1 className="text-4xl font-bold text-foreground mb-4">{category.name}</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">{category.description}</p>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {categoryTools.length} Tools Available
          </Badge>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryTools.map((tool) => (
            <Card key={tool.id} className="border-green-500/20 bg-card/50 hover:border-green-500/40 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-green-400 text-lg">{tool.name}</CardTitle>
                    <CardDescription className="mt-2">{tool.description}</CardDescription>
                  </div>
                  {tool.featured && (
                    <Badge variant="secondary" className="ml-2">
                      Featured
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {tool.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {tool.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{tool.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Free Status */}
                  <div className="flex items-center justify-between text-sm">
                    <Badge variant={tool.url.includes("github") ? "default" : "outline"}>
                      {tool.url.includes("github") ? "Open Source" : "Free"}
                    </Badge>
                    <span className="text-muted-foreground">⭐ {tool.rating}/5</span>
                  </div>

                  {/* Action Button */}
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => window.open(tool.url, "_blank")}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Visit Tool
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Back to Tools */}
        <div className="text-center mt-12">
          <Button variant="outline" asChild className="border-green-500/20 text-green-400 bg-transparent">
            <Link href="/tools">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to All Tools
            </Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  )
}
