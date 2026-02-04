import type React from "react"
import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"
import { Providers } from "@/components/providers"
import "./globals.css"

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
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
  openGraph: {
    title: "OSINT Intelligence - Community Tools Directory",
    description:
      "Discover and contribute to the most comprehensive OSINT tools directory with 500+ curated tools for cybersecurity professionals",
    type: "website",
    url: "https://osintelligence.net",
    siteName: "OSINT Intelligence",
    locale: "en_US",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "OSINT Intelligence - Community OSINT Tools Directory",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OSINT Intelligence - Community OSINT Tools Directory",
    description: "Discover 500+ curated OSINT tools for cybersecurity professionals",
    images: ["/logo.png"],
    creator: "@hackingspace",
  },
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
      </body>
    </html>
  )
}
