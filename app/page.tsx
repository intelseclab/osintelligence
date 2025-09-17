"use client";

import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { CategoriesSection } from "@/components/categories-section";
import { ContributeSection } from "@/components/contribute-section";
import { Footer } from "@/components/footer";
import { useToolsData } from "@/lib/use-tools-data";

export default function HomePage() {
  useToolsData();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        <HeroSection />
        <CategoriesSection />
        <ContributeSection />
      </main>
      <Footer />
    </div>
  );
}
