"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Shield, Users, Star, Github } from "lucide-react"
import Link from "next/link"
import { useOSINTStore } from "@/lib/store"

export function HeroSection() {
  const { tools, categories } = useOSINTStore()

  return (
    <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center">
          {/* Hero Badge */}
          <div className="flex justify-center mb-8">
            <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
              <Shield className="h-4 w-4 mr-2" />
              Community-Driven OSINT Directory
            </Badge>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="block text-transparent bg-gradient-to-tr from-gray-200 to-gray-600 bg-clip-text">
              Discover the Ultimate
            </span>
            <span className="block text-transparent bg-gradient-to-tr from-green-400 to-gray-600 bg-clip-text">
              OSINT Tools Collection
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Explore the most comprehensive directory of Open Source Intelligence tools, curated and maintained by the
            cybersecurity community through GitHub contributions.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{tools.length}+</div>
              <div className="text-sm text-muted-foreground">OSINT Tools</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">{categories.length}</div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">+</div>
              <div className="text-sm text-muted-foreground">Contributors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">24/7</div>
              <div className="text-sm text-muted-foreground">Updated</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="glow-effect group">
              <Shield className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
              Explore Tools
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="https://github.com/intelseclab/osintelligence" target="_blank" rel="noopener noreferrer">
                <Github className="h-5 w-5 mr-2" />
                Contribute on GitHub
              </Link>
            </Button>
          </div>

          {/* Community Indicators */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2 text-primary" />
              Trusted by security professionals
            </div>
            <div className="flex items-center">
              <Star className="h-4 w-4 mr-2 text-accent" />
              Open source & transparent
            </div>
            <div className="flex items-center">
              <Github className="h-4 w-4 mr-2 text-primary" />
              Community maintained
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
