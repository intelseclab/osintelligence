"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useOSINTStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import { getCategoryIcon } from "@/lib/category-config"

export function CategoriesSection() {
  const { categories } = useOSINTStore()
  const router = useRouter()

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/tools?category=${encodeURIComponent(categoryId)}`)
  }

  return (
    <section id="categories" className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Tool Categories</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore OSINT tools organized by their primary use cases and specializations
          </p>
        </div>

        <div className="grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg border-border/50 hover:bg-card/80 hover:border-green-500/40"
              onClick={() => handleCategoryClick(category.id)}
            >
              <CardContent className="p-4 text-center">
                <div className="flex flex-col items-center">
                  <div className="text-3xl mb-3">
                    {getCategoryIcon(category.id)}
                  </div>
                  <Badge variant="secondary" className="text-xs mb-2">
                    {category.toolCount} tools
                  </Badge>
                </div>
                <h3 className="text-sm font-semibold mb-2">{category.name}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2">{category.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
