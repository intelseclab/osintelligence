import type { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Users, Github } from "lucide-react"

export const metadata: Metadata = {
  title: "About OSINT Intelligence Directory",
  description:
    "Learn about our mission to provide the cybersecurity community with a comprehensive, community-driven collection of OSINT tools and resources for professionals and researchers.",
  keywords: ["OSINT", "About", "Mission", "Community", "Cybersecurity", "Open Source Intelligence", "Tools Directory"],
  openGraph: {
    title: "About OSINT Intelligence Directory",
    description: "Community-driven collection of OSINT tools for cybersecurity professionals",
    url: "/about",
    type: "website",
  },
  twitter: {
    title: "About OSINT Intelligence Directory",
    description: "Community-driven collection of OSINT tools for cybersecurity professionals",
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">About OSINT Intelligence Directory</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A comprehensive, community-driven collection of Open Source Intelligence tools and resources for
            cybersecurity professionals, researchers, and investigators.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="border-green-500/20 bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-400">
                <Shield className="h-5 w-5" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                To provide the cybersecurity community with a centralized, up-to-date directory of OSINT tools and
                resources. We believe in the power of open source intelligence and aim to make these tools accessible to
                everyone.
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-500/20 bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-400">
                <Users className="h-5 w-5" />
                Community Driven
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This directory is maintained by the community, for the community. Every tool addition and update comes
                from security professionals who use these tools in their daily work.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-foreground">What We Offer</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-green-500/20 bg-card/50">
              <CardHeader>
                <CardTitle className="text-green-400">Comprehensive Coverage</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Over 100+ carefully curated OSINT tools across 15+ categories including social media intelligence,
                  domain analysis, and threat intelligence.
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-500/20 bg-card/50">
              <CardHeader>
                <CardTitle className="text-green-400">Always Updated</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our GitHub-based contribution system ensures the directory stays current with the latest tools and
                  updates from the community.
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-500/20 bg-card/50">
              <CardHeader>
                <CardTitle className="text-green-400">Easy to Use</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Advanced filtering, search functionality, and categorization make it easy to find the right tool for
                  your specific OSINT needs.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Categories Overview */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-foreground">Tool Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { name: "Search Engines", icon: "🔍" },
              { name: "Social Media", icon: "📱" },
              { name: "Domain & Network", icon: "🌐" },
              { name: "Email Investigation", icon: "📧" },
              { name: "Image & Video", icon: "🖼️" },
              { name: "People Search", icon: "👤" },
              { name: "Geolocation", icon: "📍" },
              { name: "Dark Web", icon: "🕵️" },
              { name: "Threat Intelligence", icon: "🛡️" },
              { name: "Metadata Analysis", icon: "📄" },
              { name: "File & Document", icon: "📁" },
              { name: "Code Repository", icon: "💻" },
              { name: "Username Tracking", icon: "🔗" },
              { name: "Phone Research", icon: "📞" },
              { name: "Archive & History", icon: "🗄️" },
              { name: "Financial Intelligence", icon: "💰" }
            ].map((category) => (
              <Badge
                key={category.name}
                variant="outline"
                className="p-3 justify-center border-green-500/20 text-green-400"
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* GitHub Integration */}
        <Card className="border-green-500/20 bg-card/50 mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-400">
              <Github className="h-5 w-5" />
              Open Source & Transparent
            </CardTitle>
            <CardDescription>Built with transparency and community collaboration at its core</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              This directory is completely open source and hosted on GitHub. All tool data is stored in a structured
              README.md file, making it easy for anyone to contribute, review changes, and maintain the quality of the
              directory.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">MIT Licensed</Badge>
              <Badge variant="secondary">Community Maintained</Badge>
              <Badge variant="secondary">GitHub Powered</Badge>
              <Badge variant="secondary">Always Free</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Card className="border-yellow-500/20 bg-card/50">
          <CardHeader>
            <CardTitle className="text-yellow-400">Important Disclaimer</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This collection is for educational and legitimate research purposes only. Users are responsible for
              ensuring their activities comply with applicable laws and regulations. Always respect privacy, terms of
              service, and legal boundaries when using OSINT tools.
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
