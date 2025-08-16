"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github, Shield } from "lucide-react"
import { useOSINTStore } from "@/lib/store"

export function FeaturedToolsSection() {
  const { filteredTools, selectedCategory } = useOSINTStore()

  const displayTools = filteredTools.length > 0 ? filteredTools : []

  return (
    <section id="tools" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {selectedCategory ? "Filtered Tools" : "Featured Tools"}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {selectedCategory
              ? `Tools in the selected category`
              : "Discover powerful OSINT tools used by professionals worldwide"}
          </p>
        </div>

        {displayTools.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No tools found matching your criteria.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayTools.map((tool, index) => (
              <div
                key={tool.id}
                className="group flex items-start gap-4 p-4 rounded-lg border border-border/50 hover:border-green-500/40 hover:bg-card/50 transition-all duration-200"
              >
                {/* Index number like HackerNews */}
                <div className="text-muted-foreground text-sm font-mono w-6 text-right flex-shrink-0 mt-1">
                  {index + 1}.
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <h3 className="text-green-400 font-medium group-hover:text-green-300 transition-colors">
                        <a href={tool.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {tool.name}
                        </a>
                      </h3>
                      <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{tool.description}</p>

                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="outline" className="text-xs">
                            {tool.category}
                          </Badge>
                          {tool.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {tool.verified && <Shield className="h-3 w-3 text-green-400" />}
                          <span>Updated {new Date(tool.lastUpdated).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 flex-shrink-0">
                      <Button size="sm" variant="outline" asChild>
                        <a href={tool.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Visit
                        </a>
                      </Button>
                      {tool.githubUrl && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={tool.githubUrl} target="_blank" rel="noopener noreferrer">
                            <Github className="h-3 w-3" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
