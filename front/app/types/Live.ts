type Severity = "critical" | "high" | "medium"

type SecurityFinding = {
  file: string
  line: number
  type: string
  severity: Severity
  match: string
}

type SecurityData = {
  score?: number
  findings: Record<Severity, SecurityFinding[]>
}

type PerformanceData = {
  load_time_ms: number
  status_code: number
  page_size_kb: number
  redirect_count: number
}

type SEOData = {
  title_length: number
  meta_description_length: number
  h1_count: number
  images_missing_alt: number
}

type SummaryData = {
  performance: string
  security: string
  seo: string
}

export type AnalysisData = {
  summary?: SummaryData
  security_score?: number
  security?: SecurityData
  performance?: PerformanceData
  seo?: SEOData
  tech_stack?: string[]
}