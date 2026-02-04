import type { Metadata } from "next"
import ToolDetailClient from "./ToolDetailClient"

export async function generateMetadata({
  params,
}: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const toolName = id.split("-").slice(2, -1).join(" ")

  return {
    title: `${toolName} - OSINT Tool`,
    description: `Learn about ${toolName}, an OSINT tool for cybersecurity professionals.`,
  }
}

export default async function ToolDetailPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <ToolDetailClient toolId={id} />
}
