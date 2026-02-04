"use client"

import Link from "next/link"
import { Github, Twitter, Mail, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 rounded bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-sm font-bold text-primary-foreground">OI</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                OSINT Intelligence
              </span>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              The most comprehensive directory of Open Source Intelligence tools and services, built and maintained by
              the global OSINT community.
            </p>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <a href="https://github.com/intelseclab" target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a href="https://twitter.com/OsintelX" target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a href="mailto:contact@osintelligence.net">
                  <Mail className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/tools" className="text-muted-foreground hover:text-primary transition-colors">
                  Browse Tools
                </Link>
              </li>
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <a href="/contribute" className="text-muted-foreground hover:text-primary transition-colors">
                  Contribute
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/intelseclab/osintelligence/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Report Issues
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://github.com/intelseclab/osintelligence/blob/main/CONTRIBUTING.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Contribution Guide
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/intelseclab/osintelligence/blob/main/README.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  README
                </a>
              </li>
             
            </ul>
          </div>
        </div>

        <div className="border-t border-border/40 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} OSINT Intelligence. Open source project under <a href="https://github.com/intelseclab/osintelligence/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">MIT License</a>
          </p>
          <a href="https://github.com/atiilla" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground flex items-center mt-4 md:mt-0">
            Made with <Heart className="h-4 w-4 text-red-500 mx-1" /> by the Atilla
          </a>
        </div>
      </div>
    </footer>
  )
}
