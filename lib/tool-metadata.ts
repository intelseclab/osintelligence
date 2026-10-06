import type { Metadata } from "next"
import { parseMarkdownToTools } from "./markdown-parser"
import searchEngines from "../public/tools/search-engines.md"
import socialMediaIntelligence from "../public/tools/social-media-intelligence.md"
import domainNetworkAnalysis from "../public/tools/domain-network-analysis.md"
import emailInvestigation from "../public/tools/email-investigation.md"
import imageVideoAnalysis from "../public/tools/image-video-analysis.md"
import peopleSearch from "../public/tools/people-search.md"
import geolocation from "../public/tools/geolocation.md"
import darkWeb from "../public/tools/dark-web.md"
import threatIntelligence from "../public/tools/threat-intelligence.md"
import metadataAnalysis from "../public/tools/metadata-analysis.md"
import fileDocumentIntelligence from "../public/tools/file-document-intelligence.md"
import codeRepositoryIntelligence from "../public/tools/code-repository-intelligence.md"
import usernameHandleTracking from "../public/tools/username-handle-tracking.md"
import phoneNumberResearch from "../public/tools/phone-number-research.md"
import archiveHistoryTools from "../public/tools/archive-history-tools.md"
import companyOrganizationResearch from "../public/tools/company-organization-research.md"
import maritimeAviationOsint from "../public/tools/maritime-aviation-osint.md"
import visualizationAnalysisTools from "../public/tools/visualization-analysis-tools.md"
import newsMediaMonitoring from "../public/tools/news-media-monitoring.md"
import dataStatistics from "../public/tools/data-statistics.md"
import privacySecurityTools from "../public/tools/privacy-security-tools.md"
import financialIntelligence from "../public/tools/financial-intelligence.md"

const catalogFiles = [
  ["search-engines.md", searchEngines],
  ["social-media-intelligence.md", socialMediaIntelligence],
  ["domain-network-analysis.md", domainNetworkAnalysis],
  ["email-investigation.md", emailInvestigation],
  ["image-video-analysis.md", imageVideoAnalysis],
  ["people-search.md", peopleSearch],
  ["geolocation.md", geolocation],
  ["dark-web.md", darkWeb],
  ["threat-intelligence.md", threatIntelligence],
  ["metadata-analysis.md", metadataAnalysis],
  ["file-document-intelligence.md", fileDocumentIntelligence],
  ["code-repository-intelligence.md", codeRepositoryIntelligence],
  ["username-handle-tracking.md", usernameHandleTracking],
  ["phone-number-research.md", phoneNumberResearch],
  ["archive-history-tools.md", archiveHistoryTools],
  ["company-organization-research.md", companyOrganizationResearch],
  ["maritime-aviation-osint.md", maritimeAviationOsint],
  ["visualization-analysis-tools.md", visualizationAnalysisTools],
  ["news-media-monitoring.md", newsMediaMonitoring],
  ["data-statistics.md", dataStatistics],
  ["privacy-security-tools.md", privacySecurityTools],
  ["financial-intelligence.md", financialIntelligence],
]

const tools = catalogFiles.flatMap(([filename, markdown]) =>
  parseMarkdownToTools(markdown, filename).tools,
)

export function getToolMetadata(id: string): Metadata {
  const tool = tools.find((entry) => entry.id === id)
  if (!tool) {
    return {
      title: "Tool Not Found",
      description: "The requested tool is not in the OSINT Intelligence directory.",
      robots: { index: false, follow: false },
    }
  }

  return {
    title: `${tool.name} - OSINT Tool`,
    description: tool.description || `Learn about ${tool.name}, an OSINT tool for cybersecurity professionals.`,
  }
}
