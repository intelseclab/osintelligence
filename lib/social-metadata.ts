import type { Metadata } from "next"

export const openGraph = {
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
} satisfies NonNullable<Metadata["openGraph"]>

export const twitter = {
  card: "summary_large_image",
  title: "OSINT Intelligence - Community OSINT Tools Directory",
  description: "Discover 500+ curated OSINT tools for cybersecurity professionals",
  images: ["/logo.png"],
  creator: "@hackingspace",
} satisfies NonNullable<Metadata["twitter"]>
