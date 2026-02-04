"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SearchAutocomplete } from "@/components/search-autocomplete"
import { Github, Menu, X, Shield, Home, Info, Users, Wrench, Heart } from "lucide-react"
import { useOSINTStore } from "@/lib/store"

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { tools, favorites } = useOSINTStore()
  const pathname = usePathname()
  const router = useRouter()

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
    { href: "/favorites", label: "Favorites", icon: Heart, badge: favorites.length > 0 ? favorites.length : undefined },
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
          <div className="hidden md:flex items-center space-x-6">
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
                  <Icon className={`h-4 w-4 ${item.label === "Favorites" && favorites.length > 0 ? "text-red-400" : ""}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="text-xs ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-red-500/20 text-red-400">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              )
            })}
            <Badge variant="secondary" className="text-xs">
              {tools.length} Tools
            </Badge>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center space-x-4">
            <SearchAutocomplete
              placeholder="Search OSINT tools..."
              className="w-72"
            />
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
              <div className="mb-3 px-2">
                <SearchAutocomplete placeholder="Search tools..." />
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
                    <Icon className={`h-4 w-4 ${item.label === "Favorites" && favorites.length > 0 ? "text-red-400" : ""}`} />
                    <span>{item.label}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="text-xs ml-1 bg-red-500/20 text-red-400">
                        {item.badge}
                      </Badge>
                    )}
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
