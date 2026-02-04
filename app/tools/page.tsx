import type { Metadata } from "next"
import ToolsPageClient from "./ToolsPageClient"

export default function ToolsPage() {
  return <ToolsPageClient />
}

export async function generateMetadata({
  searchParams,
}: { searchParams: Promise<{ category?: string; search?: string }> }): Promise<Metadata> {
  const params = await searchParams
  const category = params.category
  const search = params.search

  let title = "OSINT Tools Directory"
  let description = "Browse our comprehensive collection of 500+ OSINT tools for cybersecurity professionals"

  if (category) {
    title = `${category} OSINT Tools`
    description = `Discover the best ${category} tools for Open Source Intelligence gathering and analysis`
  }

  if (search) {
    title = `Search Results for "${search}"`
    description = `Find OSINT tools matching "${search}" in our comprehensive directory`
  }

  return {
    title,
    description,
    openGraph: {
      title: `${title} | OSINT Intelligence`,
      description,
      url: `/tools${category ? `?category=${category}` : ""}${search ? `?search=${search}` : ""}`,
    },
    twitter: {
      title: `${title} | OSINT Intelligence`,
      description,
    },
  }
}
