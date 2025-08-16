import type { Metadata } from "next"
import ContributeClientPage from "./ContributeClientPage"

export const metadata: Metadata = {
  title: "Contribute to OSINT Directory",
  description:
    "Help grow the world's most comprehensive OSINT tools directory. Learn how to contribute new tools, submit pull requests, and join our community of cybersecurity professionals.",
  keywords: [
    "OSINT",
    "Contribute",
    "GitHub",
    "Pull Request",
    "Community",
    "Open Source",
    "Cybersecurity Tools",
    "Contribution Guidelines",
  ],
  openGraph: {
    title: "Contribute to OSINT Directory",
    description: "Help grow the world's most comprehensive OSINT tools directory through GitHub contributions",
    url: "/contribute",
    type: "website",
  },
  twitter: {
    title: "Contribute to OSINT Directory",
    description: "Help grow the world's most comprehensive OSINT tools directory through GitHub contributions",
  },
}

export default function ContributePage() {
  return <ContributeClientPage />
}
