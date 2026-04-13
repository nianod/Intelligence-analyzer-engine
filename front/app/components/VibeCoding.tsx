"use client"

import { useState } from "react"
import { ShieldAlert, CheckCircle2, XCircle, Loader2, FileCode2, FolderOpen, FlaskConical, Package, MessageSquare, FileText, Hash,} from "lucide-react"

 

interface CheckResult {
  verdict: "pass" | "fail"
  penalty: number
  detail: string
  count?: number
  violations?: any[]
  flagged_files?: any[]
  spam_groups?: any[]
  total_emoji_count?: number
  total_dependencies?: number
  test_file_count?: number
  readme_quality?: string
}

interface VibeScoreData {
  vibe_score: number
  grade: string
  verdict: string
  files_analyzed: number
  checks: {
    massive_files: CheckResult
    naming: CheckResult
    tests: CheckResult
    hardcoded_values: CheckResult
    dependency_spam: CheckResult
    comments_emojis: CheckResult
    documentation: CheckResult
    structure: CheckResult
  }
}

interface VibeScoreProps {
  data: VibeScoreData | null
}

 

function getScoreColor(score: number) {
  if (score >= 85) return { text: "text-green-600",  ring: "stroke-green-500",  bg: "bg-green-50",  border: "border-green-200" }
  if (score >= 70) return { text: "text-blue-600",   ring: "stroke-blue-500",   bg: "bg-blue-50",   border: "border-blue-200" }
  if (score >= 55) return { text: "text-yellow-600", ring: "stroke-yellow-500", bg: "bg-yellow-50", border: "border-yellow-200" }
  if (score >= 40) return { text: "text-orange-600", ring: "stroke-orange-500", bg: "bg-orange-50", border: "border-orange-200" }
  return           { text: "text-red-600",    ring: "stroke-red-500",    bg: "bg-red-50",    border: "border-red-200" }
}

function getGradeColor(grade: string) {
  if (grade === "A") return "text-green-600 bg-green-50 border-green-200"
  if (grade === "B") return "text-blue-600 bg-blue-50 border-blue-200"
  if (grade === "C") return "text-yellow-600 bg-yellow-50 border-yellow-200"
  if (grade === "D") return "text-orange-600 bg-orange-50 border-orange-200"
  return "text-red-600 bg-red-50 border-red-200"
}
 
function ScoreRing({ score }: { score: number }) {
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const colors = getScoreColor(score)

  return (
    <div className="relative w-36 h-36 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" width="144" height="144" viewBox="0 0 144 144">
        <circle cx="72" cy="72" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="10" />
        <circle
          cx="72" cy="72" r={radius} fill="none"
          className={colors.ring}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      <div className="text-center z-10">
        <p className={`text-3xl font-bold ${colors.text}`}>{score}</p>
        <p className="text-xs text-gray-400 mt-0.5">/ 100</p>
      </div>
    </div>
  )
}

 
function CheckRow({
  icon,
  label,
  result,
  expandable = false,
}: {
  icon: React.ReactNode
  label: string
  result: CheckResult
  expandable?: boolean
}) {
  const [open, setOpen] = useState(false)
  const passed = result.verdict === "pass"

  const hasDetails =
    expandable && (
      (result.violations && result.violations.length > 0) ||
      (result.flagged_files && result.flagged_files.length > 0) ||
      (result.spam_groups && result.spam_groups.length > 0)
    )

  return (
    <div className={`rounded-lg border ${passed ? "border-gray-100 bg-white" : "border-red-100 bg-red-50/40"}`}>
      <div
        className={`flex items-center gap-3 px-4 py-3 ${hasDetails ? "cursor-pointer" : ""}`}
        onClick={() => hasDetails && setOpen((v) => !v)}
      >
       
        {passed
          ? <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
          : <XCircle className="w-4 h-4 text-red-500 shrink-0" />
        }

    
        <span className="text-gray-400 shrink-0">{icon}</span>
        <span className="font-medium text-sm text-gray-800 flex-1">{label}</span>
 
        <span className="text-xs text-gray-500 hidden sm:block">{result.detail}</span>

 
        {result.penalty > 0 && (
          <span className="ml-2 text-xs font-semibold text-red-600 bg-red-100 px-2 py-0.5 rounded-full shrink-0">
            -{result.penalty}
          </span>
        )}

 
        {hasDetails && (
          <span className="text-gray-400 text-xs ml-1">{open ? "▲" : "▼"}</span>
        )}
      </div>
 
      {open && hasDetails && (
        <div className="px-4 pb-4 border-t border-red-100">
          <div className="mt-3 space-y-1.5 max-h-48 overflow-y-auto">
       
            {result.violations?.map((v: any, i: number) => (
              <div key={i} className="text-xs font-mono bg-white border border-gray-100 rounded px-2 py-1.5 text-gray-700">
                {typeof v === "string" ? v : (
                  <span>
                    <span className="text-gray-500">{v.file}</span>
                    {v.line && <span className="text-red-500 ml-2">line {v.line}</span>}
                    {v.type && <span className="text-orange-600 ml-2">{v.type}</span>}
                  </span>
                )}
              </div>
            ))}

       
            {result.flagged_files?.map((f: any, i: number) => (
              <div key={i} className="text-xs font-mono bg-white border border-gray-100 rounded px-2 py-1.5 text-gray-700">
                <span className="text-gray-500">{f.file}</span>
                <span className="text-orange-600 ml-2">~{f.estimated_lines} lines</span>
                <span className="text-gray-400 ml-1">(threshold: {f.threshold})</span>
              </div>
            ))}
 
            {result.spam_groups?.map((g: any, i: number) => (
              <div key={i} className="text-xs bg-white border border-gray-100 rounded px-2 py-1.5">
                <span className="font-semibold text-orange-700">{g.group}</span>
                <span className="text-gray-500 ml-2">— {g.found.join(", ")}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

 

export function VibeScore({ data }: VibeScoreProps) {
if (!data) {
  return (
    <p className="text-sm text-gray-400 py-4 text-center flex items-center gap-2 justify-center">
       <Loader2 className="animate-spin "/>
      Vibe coding scan in progress...
     
    </p>
  )
}

  const colors = getScoreColor(data.vibe_score)
  const gradeColors = getGradeColor(data.grade)

  const checkConfig = [
    { key: "tests",            label: "Test Coverage",         icon: <FlaskConical className="w-4 h-4" />,  expandable: false },
    { key: "naming",           label: "Naming Consistency",    icon: <Hash className="w-4 h-4" />,          expandable: true  },
    { key: "massive_files",    label: "File Sizes",            icon: <FileCode2 className="w-4 h-4" />,     expandable: true  },
    { key: "hardcoded_values", label: "Hardcoded Values",      icon: <ShieldAlert className="w-4 h-4" />,   expandable: true  },
    { key: "dependency_spam",  label: "Dependency Spam",       icon: <Package className="w-4 h-4" />,       expandable: true  },
    { key: "comments_emojis",  label: "Comment Quality",       icon: <MessageSquare className="w-4 h-4" />, expandable: true  },
    { key: "documentation",    label: "Documentation",         icon: <FileText className="w-4 h-4" />,      expandable: false },
    { key: "structure",        label: "Code Structure",        icon: <FolderOpen className="w-4 h-4" />,    expandable: false },
  ] as const

  const passCount = checkConfig.filter(
    (c) => data.checks[c.key as keyof typeof data.checks]?.verdict === "pass"
  ).length

  return (
    <div className="space-y-5">

 
      <div className={`rounded-xl border ${colors.border} ${colors.bg} p-5`}>
        <div className="flex flex-col sm:flex-row items-center gap-6">

  
          <ScoreRing score={data.vibe_score} />

   
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
              <span className={`text-2xl font-bold border rounded-lg px-3 py-1 ${gradeColors}`}>
                {data.grade}
              </span>
              <span className={`text-lg font-semibold ${colors.text}`}>{data.verdict}</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {data.files_analyzed} files analyzed &nbsp;·&nbsp; {passCount}/{checkConfig.length} checks passed
            </p>

     
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all duration-700 ${
                    data.vibe_score >= 85 ? "bg-green-500" :
                    data.vibe_score >= 70 ? "bg-blue-500" :
                    data.vibe_score >= 55 ? "bg-yellow-500" :
                    data.vibe_score >= 40 ? "bg-orange-500" : "bg-red-500"
                  }`}
                  style={{ width: `${data.vibe_score}%` }}
                />
              </div>
              <span className="text-xs text-gray-400 shrink-0">{data.vibe_score}%</span>
            </div>
          </div>
        </div>
      </div>
 
   

 
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Checks</p>
        <div className="space-y-2">
          {checkConfig.map(({ key, label, icon, expandable }) => {
            const result = data.checks[key as keyof typeof data.checks]
            if (!result) return null
            return (
              <CheckRow
                key={key}
                icon={icon}
                label={label}
                result={result}
                expandable={expandable}
              />
            )
          })}
        </div>
      </div>

  
      <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
        <p className="text-xs text-gray-500 leading-relaxed">
          <span className="font-semibold text-gray-700">What is vibe coding?</span>  Code that
          looks like it works but lacks structure, consistency, tests, and intentional design.
          Security vurnerabilities
          Common in AI-generated codebases: massive files, mixed naming, no tests, hardcoded
          values, emoji-filled comments, and dependency overload.
        </p>
      </div>

    </div>
  )
}

