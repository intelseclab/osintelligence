"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Github, Menu, X, Shield, Home, Info, Users, Wrench } from "lucide-react"
import { useOSINTStore } from "@/lib/store"

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { searchQuery, setSearchQuery, tools } = useOSINTStore()
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isActiveLink = (href: string) => {
    if (href === "/" && pathname === "/") return true
    if (href !== "/" && pathname.startsWith(href)) return true
    return false
  }

  const navigationItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/tools", label: "Tools", icon: Wrench },
    { href: "/about", label: "About", icon: Info },
    { href: "/contribute", label: "Contribute", icon: Users },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/95 backdrop-blur-md border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <Shield className="h-8 w-8 text-green-500 group-hover:text-green-400 transition-colors" />
              <div className="absolute inset-0 bg-green-500/20 rounded-full blur-md group-hover:bg-green-400/20 transition-colors" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-foreground">OSINT Intelligence</span>
              <span className="text-xs text-muted-foreground">Community Tools Directory</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = isActiveLink(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-1 transition-colors ${
                    isActive ? "text-green-400 font-medium" : "text-foreground hover:text-green-400"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs">
                {tools.length} Tools
              </Badge>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search OSINT tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 bg-card border-border focus:border-green-500"
              />
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="https://github.com/intelseclab/osintelligence" target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4 mr-2" />
                GitHub
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-card border-border"
                />
              </div>
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = isActiveLink(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 transition-colors ${
                      isActive ? "text-green-400 font-medium bg-green-500/10" : "text-foreground hover:text-green-400"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
              <div className="px-3 py-2">
                <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
                  <Link
                    href="https://github.com/intelseclab/osintelligence"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="h-4 w-4 mr-2" />
                    View on GitHub
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
