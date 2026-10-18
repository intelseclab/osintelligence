import type { Metadata } from "next"
import { getToolById, getToolMetadata } from "@/lib/tool-metadata"
import ToolDetailClient from "./ToolDetailClient"

export async function generateMetadata({
  params,
}: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  return getToolMetadata(id)
}

export default async function ToolDetailPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // Resolve the tool here so the initial HTML carries the real listing.
  // The client store only populates in an effect, so without this a valid
  // tool rendered "Tool Not Found" to anything reading the server response
  // -- crawlers, link unfurlers, and readers without JavaScript -- while the
  // page metadata simultaneously described the tool correctly.
  const tool = getToolById(id) ?? null

  return <ToolDetailClient toolId={id} initialTool={tool} />
}
