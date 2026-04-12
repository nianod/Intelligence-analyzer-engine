"use client"

import { Code2, Package, Loader2, Layers, Palette, Database, Shield, FlaskConical, Wrench, Container, LayoutGrid,  Cpu,  Box } from "lucide-react"

interface Language {
  name: string
  bytes: number
  percentage: number
}

interface TechStackData {
  runtime: string
  package_manager: string
  languages: Language[]
  stack: {
    frameworks: string[]
    backend: string[]
    styling: string[]
    ui: string[]
    database: string[]
    auth: string[]
    state: string[]
    testing: string[]
    tooling: string[]
    devops: string[]
  }
  total_detected: number
}

interface TechStackProps {
  data: TechStackData | null
}
 
const LANG_COLORS: Record<string, string> = {
  TypeScript:  "#3178c6",
  JavaScript:  "#f7df1e",
  Python:      "#3572a5",
  Rust:        "#dea584",
  Go:          "#00add8",
  Ruby:        "#701516",
  Java:        "#b07219",
  "C#":        "#178600",
  "C++":       "#f34b7d",
  C:           "#555555",
  PHP:         "#4f5d95",
  Swift:       "#f05138",
  Kotlin:      "#a97bff",
  Dart:        "#00b4ab",
  HTML:        "#e34c26",
  CSS:         "#563d7c",
  Shell:       "#89e051",
  Vue:         "#41b883",
  Svelte:      "#ff3e00",
}

const CATEGORY_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  frameworks: { label: "Frameworks",       icon: <Layers className="w-3.5 h-3.5" />,      color: "bg-blue-50 text-blue-700 border-blue-200" },
  backend:    { label: "Backend",          icon: <Cpu className="w-3.5 h-3.5" />,          color: "bg-violet-50 text-violet-700 border-violet-200" },
  styling:    { label: "Styling",          icon: <Palette className="w-3.5 h-3.5" />,      color: "bg-pink-50 text-pink-700 border-pink-200" },
  ui:         { label: "UI Libraries",     icon: <LayoutGrid className="w-3.5 h-3.5" />,   color: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200" },
  database:   { label: "Database / ORM",   icon: <Database className="w-3.5 h-3.5" />,     color: "bg-amber-50 text-amber-700 border-amber-200" },
  auth:       { label: "Auth",             icon: <Shield className="w-3.5 h-3.5" />,       color: "bg-green-50 text-green-700 border-green-200" },
  state:      { label: "State Management", icon: <Box className="w-3.5 h-3.5" />,          color: "bg-cyan-50 text-cyan-700 border-cyan-200" },
  testing:    { label: "Testing",          icon: <FlaskConical className="w-3.5 h-3.5" />, color: "bg-lime-50 text-lime-700 border-lime-200" },
  tooling:    { label: "Tooling",          icon: <Wrench className="w-3.5 h-3.5" />,       color: "bg-orange-50 text-orange-700 border-orange-200" },
  devops:     { label: "DevOps",           icon: <Container className="w-3.5 h-3.5" />,    color: "bg-slate-50 text-slate-700 border-slate-200" },
}

function Tag({ label, colorClass }: { label: string; colorClass: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${colorClass}`}>
      {label}
    </span>
  )
}

const TechStack = ({ data }: TechStackProps) => {
if (!data) {
  return (
    <p className="text-sm text-gray-400 py-4 text-center flex items-center gap-2 justify-center">
       <Loader2 className="animate-spin "/>
      TechStack scan in progress...
     
    </p>
  )
}
  const hasStack = data.total_detected > 0

  return (
    <div className="space-y-5">

    
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium">
          <Cpu className="w-4 h-4 text-green-400" />
          {data.runtime}
          <span className="text-sm">Runtime</span>
        </div>
        {data.package_manager !== "unknown" && (
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
            <Package className="w-4 h-4 text-gray-500" />
            {data.package_manager}
          </div>
        )}
        <div className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium border border-green-200">
          <Code2 className="w-4 h-4" />
          {data.total_detected} tools detected
        </div>
      </div>

   
      {data.languages.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Languages</p>
          
          <div className="flex rounded-full overflow-hidden h-3 w-full mb-3 gap-px">
            {data.languages.map((lang) => (
              <div
                key={lang.name}
                style={{
                  width: `${lang.percentage}%`,
                  backgroundColor: LANG_COLORS[lang.name] || "#8b949e",
                }}
                title={`${lang.name} ${lang.percentage}%`}
              />
            ))}
          </div>
   
          <div className="flex flex-wrap gap-3">
            {data.languages.map((lang) => (
              <div key={lang.name} className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: LANG_COLORS[lang.name] || "#8b949e" }}
                />
                <span className="text-xs text-gray-700 font-medium">{lang.name}</span>
                <span className="text-xs text-gray-400">{lang.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

  
      {hasStack ? (
        <div className="space-y-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Detected Stack</p>
          {Object.entries(data.stack).map(([key, items]) => {
            if (!items || items.length === 0) return null
            const config = CATEGORY_CONFIG[key]
            if (!config) return null
            return (
              <div key={key}>
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-gray-400">{config.icon}</span>
                  <p className="text-xs font-semibold text-gray-500">{config.label}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {items.map((item: string) => (
                    <Tag key={item} label={item} colorClass={config.color} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-100">
          <p className="text-sm text-gray-500">No framework signals detected.</p>
          <p className="text-xs text-gray-400 mt-1">The repo may use a custom setup or an unsupported language.</p>
        </div>
      )}
    </div>
  )
}

export default TechStack
