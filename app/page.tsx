"use client"

import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { CategoriesSection } from "@/components/categories-section"
import { ContributeSection } from "@/components/contribute-section"
import { Footer } from "@/components/footer"
import { useReadmeData } from "@/lib/use-readme-data"

export default function HomePage() {
  useReadmeData()

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20">
        <HeroSection />
        <CategoriesSection />
        <ContributeSection />
      </main>
      <Footer />
    </div>
  )
}
