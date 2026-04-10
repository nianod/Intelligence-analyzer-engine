"use client"

import { useState } from "react"

interface Finding {
  file: string
  line: number
  type: string
  severity: string
  match: string
}

interface SecurityResultsProps {
  data: {
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
}

export function SecurityResults({ data }: SecurityResultsProps) {
  const [activeTab, setActiveTab] = useState<"critical" | "high" | "medium">("critical")

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "critical": return "bg-red-600"
      case "high": return "bg-orange-500"
      case "medium": return "bg-yellow-500"
      default: return "bg-green-500"
    }
  }

  const getRiskBadgeColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "critical": return "bg-red-100 text-red-700 border-red-200"
      case "high": return "bg-orange-100 text-orange-700 border-orange-200"
      case "medium": return "bg-yellow-100 text-yellow-700 border-yellow-200"
      default: return "bg-green-100 text-green-700 border-green-200"
    }
  }

  const findingsCount = {
    critical: data.findings.critical.length,
    high: data.findings.high.length,
    medium: data.findings.medium.length
  }

  return (
    <div className="space-y-6 mt-8">
      {/* Header with Risk Level */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">🔒 Security Scan Results</h2>
              <p className="text-sm text-gray-500 mt-1">Hardcoded secrets & credentials detection</p>
            </div>
            <div className="flex items-center gap-3">
              <div className={`px-4 py-2 rounded-full ${getRiskBadgeColor(data.summary.risk_level)}`}>
                <span className="font-semibold capitalize">{data.summary.risk_level} Risk</span>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{data.summary.total_findings}</p>
                <p className="text-xs text-gray-500">Total Findings</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Summary Stats */}
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-600">{data.summary.critical}</p>
              <p className="text-xs text-gray-600 mt-1">Critical</p>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">{data.summary.high}</p>
              <p className="text-xs text-gray-600 mt-1">High</p>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">{data.summary.medium}</p>
              <p className="text-xs text-gray-600 mt-1">Medium</p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{data.summary.files_scanned}</p>
              <p className="text-xs text-gray-600 mt-1">Files Scanned</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-600">{data.summary.files_skipped}</p>
              <p className="text-xs text-gray-600 mt-1">Files Skipped</p>
            </div>
          </div>
        </div>
      </div>

      {/* .env Files Detected */}
      {data.summary.env_files_detected.length > 0 && (
        <div className="bg-yellow-50 rounded-xl border border-yellow-200 overflow-hidden">
          <div className="bg-yellow-100 px-6 py-3 border-b border-yellow-200">
            <h3 className="font-semibold text-yellow-800">⚠️ Environment Files Detected</h3>
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

      {/* Findings Tabs */}
      {data.summary.total_findings > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex gap-1 px-6">
              <button
                onClick={() => setActiveTab("critical")}
                className={`px-4 py-3 font-medium transition-all cursor-pointer relative ${
                  activeTab === "critical" 
                    ? "text-red-600" 
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                Critical ({findingsCount.critical})
                {activeTab === "critical" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
                )}
              </button>
              <button
                onClick={() => setActiveTab("high")}
                className={`px-4 py-3 font-medium transition-all cursor-pointer relative ${
                  activeTab === "high" 
                    ? "text-orange-600" 
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                High ({findingsCount.high})
                {activeTab === "high" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600 rounded-full" />
                )}
              </button>
              <button
                onClick={() => setActiveTab("medium")}
                className={`px-4 py-3 font-medium transition-all cursor-pointer relative ${
                  activeTab === "medium" 
                    ? "text-yellow-600" 
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                Medium ({findingsCount.medium})
                {activeTab === "medium" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-600 rounded-full" />
                )}
              </button>
            </div>
          </div>

          {/* Findings List */}
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
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskBadgeColor(finding.severity)}`}>
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

      {/* No Findings Message */}
      {data.summary.total_findings === 0 && (
        <div className="bg-green-50 rounded-xl border border-green-200 overflow-hidden">
          <div className="bg-green-100 px-6 py-3 border-b border-green-200">
            <h3 className="font-semibold text-green-800">✅ No Secrets Found</h3>
          </div>
          <div className="p-6">
            <p className="text-green-700">
              Great job! No hardcoded secrets, API keys, or credentials were detected in your repository.
            </p>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {data.summary.total_findings > 0 && (
        <div className="bg-blue-50 rounded-xl border border-blue-200 overflow-hidden">
          <div className="bg-blue-100 px-6 py-3 border-b border-blue-200">
            <h3 className="font-semibold text-blue-800">📋 Recommendations</h3>
          </div>
          <div className="p-6">
            <ul className="space-y-2">
              <li className="flex gap-2 text-sm text-blue-700">
                <span>•</span>
                Remove all hardcoded secrets from your codebase immediately
              </li>
              <li className="flex gap-2 text-sm text-blue-700">
                <span>•</span>
                Use environment variables or a secrets manager (e.g., HashiCorp Vault, AWS Secrets Manager)
              </li>
              <li className="flex gap-2 text-sm text-blue-700">
                <span>•</span>
                Add .env files to .gitignore to prevent accidental commits
              </li>
              <li className="flex gap-2 text-sm text-blue-700">
                <span>•</span>
                Rotate any exposed credentials immediately
              </li>
              <li className="flex gap-2 text-sm text-blue-700">
                <span>•</span>
                Consider using pre-commit hooks with secret scanning (e.g., detect-secrets, gitleaks)
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}