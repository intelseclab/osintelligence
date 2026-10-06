import type { Metadata } from "next"
import { getToolMetadata } from "@/lib/tool-metadata"
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
  return <ToolDetailClient toolId={id} />
}
