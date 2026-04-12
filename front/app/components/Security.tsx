"use client"

import { Loader2 } from "lucide-react"
import { useState } from "react"

interface Finding {
  file: string
  line: number
  type: string
  severity: string
  match: string
}

interface SecurityData {
  summary: {
    total_findings: number
    risk_level: string
    critical: number
    high: number
    medium: number
    files_scanned: number
    files_skipped: number
    env_files_detected: string[]
  }
  findings: {
    critical: Finding[]
    high: Finding[]
    medium: Finding[]
  }
}

interface SecurityResultsProps {
  data: SecurityData | null
}

export function SecurityResults({ data }: SecurityResultsProps) {
  const [activeTab, setActiveTab] = useState<"critical" | "high" | "medium">("critical")

if (!data) {
  return (
    <p className="text-sm text-gray-400 py-4 text-center flex items-center gap-2 justify-center">
       <Loader2 className="animate-spin "/>
      Security scan in progress...
     
    </p>
  )
}

  const getRiskBadgeColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "critical": return "  text-red-700 border-red-200"
      case "high": return " text-orange-700 border-orange-200"
      case "medium": return "  text-yellow-700 border-yellow-200"
      default: return "  text-green-700 border-green-200"
    }
  }

  const findingsCount = {
    critical: data.findings.critical.length,
    high: data.findings.high.length,
    medium: data.findings.medium.length,
  }

  return (
    <div className="space-y-6 mt-8">
  
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Security Scan Results</h2>
              <p className="text-sm text-gray-500 mt-1">Hardcoded secrets & credentials detection</p>
            </div>
            <div className="flex items-center gap-3">
              <div className={`px-4 py-2 rounded-full border ${getRiskBadgeColor(data.summary.risk_level)}`}>
                <span className="font-semibold capitalize">{data.summary.risk_level} Risk</span>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{data.summary.total_findings}</p>
                <p className="text-xs text-gray-500">Total Findings</p>
              </div>
            </div>
          </div>
        </div>
 
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: "Critical", value: data.summary.critical, color: "text-red-600" },
              { label: "High", value: data.summary.high, color: "text-orange-600"   },
              { label: "Medium", value: data.summary.medium, color: "text-yellow-600" },
              { label: "Files Scanned", value: data.summary.files_scanned, color: "text-green-600"},
              { label: "Files Skipped", value: data.summary.files_skipped, color: "text-green-600"},
            ].map((stat) => (
              <div key={stat.label} className={`text-center p-3  rounded-lg`}>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-gray-600 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

  
      {data.summary.env_files_detected.length > 0 && (
        <div className="bg-yellow-50 rounded-xl border border-yellow-200 overflow-hidden">
          <div className="bg-yellow-100 px-6 py-3 border-b border-yellow-200 flex items-center gap-2">
            <h3 className="font-semibold text-yellow-800">Environment Files Detected</h3>
          </div>
          <div className="p-6">
            <p className="text-sm text-yellow-700 mb-3">
              These files should not be committed to version control:
            </p>
            <div className="flex flex-wrap gap-2">
              {data.summary.env_files_detected.map((file, index) => (
                <code key={index} className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">
                  {file}
                </code>
              ))}
            </div>
          </div>
        </div>
      )}

      
      {data.summary.total_findings > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex gap-1 px-6">
              {(["critical", "high", "medium"] as const).map((tab) => {
                const colors: Record<string, string> = {
                  critical: "text-red-600",
                  high: "text-orange-600",
                  medium: "text-yellow-600",
                }
                const underlines: Record<string, string> = {
                  critical: "bg-red-600",
                  high: "bg-orange-600",
                  medium: "bg-yellow-600",
                }
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-3 font-medium transition-all cursor-pointer relative capitalize ${
                      activeTab === tab ? colors[tab] : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {tab} ({findingsCount[tab]})
                    {activeTab === tab && (
                      <span className={`absolute bottom-0 left-0 right-0 h-0.5 ${underlines[tab]} rounded-full`} />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

         
          <div className="p-6">
            {data.findings[activeTab].length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">No {activeTab} severity findings</p>
              </div>
            ) : (
              <div className="space-y-3">
                {data.findings[activeTab].map((finding, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between flex-wrap gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRiskBadgeColor(finding.severity)}`}>
                          {finding.severity}
                        </span>
                        <span className="font-mono text-sm text-gray-900">{finding.type}</span>
                      </div>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                        Line {finding.line}
                      </code>
                    </div>
                    <p className="text-sm text-gray-600 mb-2 font-mono">
                      File: <span className="text-gray-900">{finding.file}</span>
                    </p>
                    <div className="bg-gray-50 rounded p-2 mt-2">
                      <p className="text-xs text-gray-500 mb-1">Detected value (masked):</p>
                      <code className="text-sm font-mono text-red-600 break-all">{finding.match}</code>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

   
      {data.summary.total_findings === 0 && (
        <div className="bg-green-50 rounded-xl border border-green-200 overflow-hidden">
          <div className="bg-green-100 px-6 py-3 border-b border-green-200">
            <h3 className="font-semibold text-green-800">No Secrets Found</h3>
          </div>
          <div className="p-6">
            <p className="text-green-700">
              Great job! No hardcoded secrets, API keys, or credentials were detected in your repository.
            </p>
          </div>
        </div>
      )}
 
      {data.summary.total_findings > 0 && (
        <div className="  rounded-xl border   overflow-hidden">
          <div className="bg-blue-100 px-6 py-3 border-b border-blue-200">
            <h3 className="font-semibold ">Recommendations</h3>
          </div>
          <div className="p-6">
            <ul className="space-y-2">
              {[
                "Remove all hardcoded secrets from your codebase immediately",
                "Use environment variables or a secrets manager (e.g., HashiCorp Vault, AWS Secrets Manager)",
                "Add .env files to .gitignore to prevent accidental commits",
                "Rotate any exposed credentials immediately",
                "Consider using pre-commit hooks with secret scanning (e.g., detect-secrets, gitleaks)",
              ].map((tip, i) => (
                <li key={i} className="flex gap-2 text-sm text-green-700">
                  <span>-</span>{tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}


