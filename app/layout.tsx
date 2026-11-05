import type React from "react"
import type { Metadata } from "next"
import localFont from "next/font/local"
import { GoogleAnalytics } from "@next/third-parties/google"
import { Providers } from "@/components/providers"
import { openGraph, twitter } from "@/lib/social-metadata"
import "./globals.css"

// Self-hosted rather than next/font/google: the Google loader fetches the
// stylesheet at build time and derives the file extension with
// /\.(woff|woff2|eot|ttf|otf)$/.exec(url)[1]. Google varies that stylesheet by
// User-Agent, and on a build agent that returned a URL the regex did not match,
// so the build died with "Cannot read properties of null (reading '1')" inside
// next/font. Shipping the file removes the build-time network dependency.
//
// DM Sans v17 is a variable font: this single latin file covers 400-700, which
// is the same coverage the previous subsets: ["latin"] configuration produced.
const dmSans = localFont({
  src: "./fonts/dm-sans-latin.woff2",
  weight: "400 700",
  style: "normal",
  display: "swap",
  variable: "--font-dm-sans",
})

export const metadata: Metadata = {
  title: {
    default: "OSINT Intelligence - Community OSINT Tools Directory",
    template: "%s | OSINT Intelligence",
  },
  description:
    "Comprehensive directory of Open Source Intelligence tools and services, maintained by the community through GitHub contributions. Discover 500+ curated OSINT tools for cybersecurity professionals.",
  generator: "Next.js",
  applicationName: "OSINT Intelligence",
  referrer: "origin-when-cross-origin",
  keywords: [
    "OSINT",
    "Open Source Intelligence",
    "Cybersecurity",
    "Tools",
    "Directory",
    "Security Research",
    "Digital Forensics",
    "Threat Intelligence",
    "Social Media Intelligence",
    "Geolocation Tools",
    "Network Analysis",
    "Email Investigation",
    "Domain Research",
    "Blockchain Analysis",
  ],
  authors: [{ name: "OSINT Intelligence Community", url: "https://osintelligence.net" }],
  creator: "OSINT Intelligence Community",
  publisher: "OSINT Intelligence",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://osintelligence.net"),
  alternates: {
    canonical: "/",
  },
  openGraph,
  twitter,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "OSINT Intelligence",
              description: "Comprehensive directory of Open Source Intelligence tools and services",
              url: "https://osintelligence.net",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://osintelligence.net/tools?search={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
              publisher: {
                "@type": "Organization",
                name: "OSINT Intelligence Community",
                url: "https://osintelligence.net",
              },
            }),
          }}
        />
        <meta name="yandex-verification" content="a94a2727a4490fd2" />
      </head>
      <body className={`${dmSans.variable} font-sans antialiased`}>
        <div className="matrix-bg">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        </div>
        <Providers>{children}</Providers>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  )
}
