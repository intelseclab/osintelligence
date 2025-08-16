"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Github, GitPullRequest, Users, Star } from "lucide-react"

export function ContributeSection() {
  return (
    <section id="contribute" className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Contribute to the Community</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Help grow the most comprehensive OSINT tools directory by contributing your knowledge and discoveries
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="text-center p-6 border-border/50">
            <Github className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Fork Repository</h3>
            <p className="text-sm text-muted-foreground">Start by forking our GitHub repository to your account</p>
          </Card>

          <Card className="text-center p-6 border-border/50">
            <Users className="h-12 w-12 text-accent mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Add Your Tool</h3>
            <p className="text-sm text-muted-foreground">Add new OSINT tools with detailed descriptions and metadata</p>
          </Card>

          <Card className="text-center p-6 border-border/50">
            <GitPullRequest className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Submit PR</h3>
            <p className="text-sm text-muted-foreground">Create a pull request with your additions or improvements</p>
          </Card>

          <Card className="text-center p-6 border-border/50">
            <Star className="h-12 w-12 text-accent mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Get Featured</h3>
            <p className="text-sm text-muted-foreground">Quality contributions get featured and help the community</p>
          </Card>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="p-8 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="text-center p-0">
              <h3 className="text-2xl font-bold mb-4">Ready to Contribute?</h3>
              <p className="text-muted-foreground mb-6">
                Join hundreds of OSINT professionals who have already contributed to this directory. Your expertise
                helps the entire community discover better tools and techniques.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="px-8">
                  <a href="https://github.com/intelseclab/osintelligence" target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-5 w-5" />
                    View on GitHub
                  </a>
                </Button>
                <Button variant="outline" size="lg" asChild className="px-8 bg-transparent">
                  <a
                    href="https://github.com/intelseclab/osintelligence/blob/main/CONTRIBUTING.md"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Contribution Guide
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
