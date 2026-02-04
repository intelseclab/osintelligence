"use client"

import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Github, GitPullRequest, FileText, CheckCircle, AlertCircle, ExternalLink } from "lucide-react"

export default function ContributeClientPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Contribute to OSINT Directory</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Help grow the world&apos;s most comprehensive OSINT tools directory. Your contributions make this resource better
            for everyone.
          </p>
        </div>

        {/* Quick Start */}
        <Card className="border-green-500/20 bg-card/50 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-400">
              <Github className="h-5 w-5" />
              Quick Start Guide
            </CardTitle>
            <CardDescription>Get started contributing in just a few steps</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-400 font-bold">1</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Fork Repository</h3>
                <p className="text-sm text-muted-foreground">Fork the GitHub repository to your account</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-400 font-bold">2</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Add Your Tool</h3>
                <p className="text-sm text-muted-foreground">Edit README.md following our format</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-400 font-bold">3</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Submit PR</h3>
                <p className="text-sm text-muted-foreground">Create a pull request for review</p>
              </div>
            </div>
            <div className="mt-6 text-center">

              <Button asChild className="bg-green-600 hover:bg-green-700">
                <Link href="https://github.com/intelseclab/osintelligence" target="_blank">
                  <Github className="mr-2 h-4 w-4" />
                  View on GitHub
                </Link>
              </Button>

            </div>
          </CardContent>
        </Card>

        {/* Tool Format */}
        <Card className="border-green-500/20 bg-card/50 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-400">
              <FileText className="h-5 w-5" />
              Tool Format
            </CardTitle>
            <CardDescription>Follow this exact format when adding new tools</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/50 p-4 rounded-lg font-mono text-sm mb-4">
              <pre className="text-muted-foreground">{`- **Tool Name** - https://example.com
  - Description: Brief description of what the tool does
  - Category: category-name
  - Tags: tag1, tag2, tag3
  - Free: true/false`}</pre>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Required Fields</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Tool Name (clear, concise)</li>
                  <li>• URL (working, direct link)</li>
                  <li>• Description (1-2 sentences)</li>
                  <li>• Category (from existing list)</li>
                  <li>• Tags (relevant keywords)</li>
                  <li>• Free status (true/false)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Categories</h4>
                <div className="flex flex-wrap gap-1">
                  {[
                    "search-engines",
                    "social-media",
                    "domain-network",
                    "email",
                    "image-video",
                    "people-search",
                    "geolocation",
                    "dark-web",
                    "threat-intelligence",
                    "metadata",
                    "file-document",
                    "code-repository",
                    "username-tracking",
                    "phone-research",
                    "archive-history",
                  ].map((cat) => (
                    <Badge key={cat} variant="outline" className="text-xs">
                      {cat}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Guidelines */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="border-green-500/20 bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-400">
                <CheckCircle className="h-5 w-5" />
                Dos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✅ Test the tool before submitting</li>
                <li>✅ Use clear, descriptive names</li>
                <li>✅ Provide accurate descriptions</li>
                <li>✅ Check for duplicates first</li>
                <li>✅ Use appropriate categories</li>
                <li>✅ Include relevant tags</li>
                <li>✅ Verify the URL works</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-red-500/20 bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-400">
                <AlertCircle className="h-5 w-5" />
                Don&apos;ts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>❌ Submit malicious or illegal tools</li>
                <li>❌ Add broken or dead links</li>
                <li>❌ Use promotional language</li>
                <li>❌ Submit tools you haven&apos;t tested</li>
                <li>❌ Ignore the format requirements</li>
                <li>❌ Add duplicate entries</li>
                <li>❌ Submit without proper research</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Review Process */}
        <Card className="border-green-500/20 bg-card/50 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-400">
              <GitPullRequest className="h-5 w-5" />
              Review Process
            </CardTitle>
            <CardDescription>What happens after you submit your contribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-blue-400 text-xs">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Automated Checks</h4>
                  <p className="text-sm text-muted-foreground">GitHub Actions verify format and check for duplicates</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-blue-400 text-xs">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Community Review</h4>
                  <p className="text-sm text-muted-foreground">
                    Maintainers and community members review your submission
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-green-400 text-xs">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Merge & Deploy</h4>
                  <p className="text-sm text-muted-foreground">
                    Approved changes are merged and automatically deployed
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Ready to Contribute?</h2>
          <p className="text-muted-foreground mb-6">
            Join our community of contributors and help make OSINT tools more accessible to everyone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link href="https://github.com/intelseclab/osintelligence" target="_blank">
                <Github className="mr-2 h-4 w-4" />
                Start Contributing
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-green-500/20 text-green-400 bg-transparent">
              <Link href="https://github.com/intelseclab/osintelligence/blob/main/CONTRIBUTING.md" target="_blank">
                <FileText className="mr-2 h-4 w-4" />
                View Guidelines
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
