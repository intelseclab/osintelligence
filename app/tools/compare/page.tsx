"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useOSINTStore } from "@/lib/store"
import { useToolsData } from "@/lib/use-tools-data"
import {
  ArrowLeft,
  X,
  ExternalLink,
  CheckCircle,
  XCircle,
  Tag,
  Shield,
} from "lucide-react"

export default function ComparePage() {
  useToolsData()
  const router = useRouter()

  const {
    getComparisonTools,
    removeFromComparison,
    clearComparison,
    categories,
    isLoading,
  } = useOSINTStore()

  const tools = getComparisonTools()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8 pt-24">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto" />
            <p className="mt-4 text-muted-foreground">Loading comparison...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (tools.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8 pt-24">
          <Card className="max-w-md mx-auto border-yellow-500/20">
            <CardContent className="pt-6 text-center">
              <h1 className="text-xl font-semibold mb-4">No Tools to Compare</h1>
              <p className="text-muted-foreground mb-6">
                Add tools to your comparison list from the tools directory.
              </p>
              <Button onClick={() => router.push("/tools")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Browse Tools
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
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Compare Tools</h1>
            <p className="text-muted-foreground">
              Comparing {tools.length} tool{tools.length > 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => router.push("/tools")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Add More
            </Button>
            <Button variant="outline" onClick={clearComparison}>
              Clear All
            </Button>
          </div>
        </div>

        {/* Comparison Table */}
        <Card className="border-green-500/20 bg-card/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground w-40">
                    Feature
                  </th>
                  {tools.map((tool) => (
                    <th key={tool.id} className="p-4 min-w-[250px]">
                      <div className="flex items-center justify-between">
                        <Link
                          href={`/tools/${tool.id}`}
                          className="text-green-400 hover:text-green-300 font-semibold"
                        >
                          {tool.name}
                        </Link>
                        <button
                          onClick={() => removeFromComparison(tool.id)}
                          className="p-1 hover:bg-red-500/20 rounded transition-colors"
                        >
                          <X className="h-4 w-4 text-muted-foreground hover:text-red-400" />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Description */}
                <tr className="border-b border-border/30">
                  <td className="p-4 text-sm font-medium text-muted-foreground">
                    Description
                  </td>
                  {tools.map((tool) => (
                    <td key={tool.id} className="p-4 text-sm text-foreground">
                      {tool.description}
                    </td>
                  ))}
                </tr>

                {/* Category */}
                <tr className="border-b border-border/30 bg-muted/20">
                  <td className="p-4 text-sm font-medium text-muted-foreground">
                    <Shield className="h-4 w-4 inline mr-2" />
                    Category
                  </td>
                  {tools.map((tool) => {
                    const cat = categories.find((c) => c.id === tool.category)
                    return (
                      <td key={tool.id} className="p-4 text-sm">
                        <Badge variant="outline">
                          {cat?.icon} {cat?.name}
                        </Badge>
                      </td>
                    )
                  })}
                </tr>

                {/* Tags */}
                <tr className="border-b border-border/30">
                  <td className="p-4 text-sm font-medium text-muted-foreground">
                    <Tag className="h-4 w-4 inline mr-2" />
                    Tags
                  </td>
                  {tools.map((tool) => (
                    <td key={tool.id} className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {tool.tags.slice(0, 5).map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {tool.tags.length > 5 && (
                          <Badge variant="secondary" className="text-xs">
                            +{tool.tags.length - 5}
                          </Badge>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Verified */}
                <tr className="border-b border-border/30 bg-muted/20">
                  <td className="p-4 text-sm font-medium text-muted-foreground">
                    Verified
                  </td>
                  {tools.map((tool) => (
                    <td key={tool.id} className="p-4">
                      {tool.verified ? (
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      ) : (
                        <XCircle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </td>
                  ))}
                </tr>

                {/* Open Source */}
                <tr className="border-b border-border/30">
                  <td className="p-4 text-sm font-medium text-muted-foreground">
                    Open Source
                  </td>
                  {tools.map((tool) => (
                    <td key={tool.id} className="p-4">
                      {tool.url.includes("github") ? (
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      ) : (
                        <XCircle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </td>
                  ))}
                </tr>

                {/* URL */}
                <tr className="border-b border-border/30 bg-muted/20">
                  <td className="p-4 text-sm font-medium text-muted-foreground">
                    Website
                  </td>
                  {tools.map((tool) => (
                    <td key={tool.id} className="p-4">
                      <a
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-400 hover:text-green-300 text-sm inline-flex items-center"
                      >
                        Visit
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </td>
                  ))}
                </tr>

                {/* Actions */}
                <tr>
                  <td className="p-4 text-sm font-medium text-muted-foreground">
                    Actions
                  </td>
                  {tools.map((tool) => (
                    <td key={tool.id} className="p-4">
                      <div className="flex gap-2">
                        <Button size="sm" asChild>
                          <a
                            href={tool.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Open
                          </a>
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/tools/${tool.id}`}>Details</Link>
                        </Button>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
