"use client"
import { useState } from "react"
import { ChevronDown, ChevronRight, Shield, Zap, Globe, Layers } from "lucide-react"
import type { AnalysisData } from "../types/Live"

type Props = {
  data: AnalysisData
}

const Performance = ({ data }: Props) => {
  const [open, setOpen] = useState<string | null>("security")

  const toggle = (id: string) => {
    setOpen(prev => (prev === id ? null : id))
  }

  const getColor = (score?: number) => {
    if (!score) return "text-gray-400"
    if (score >= 80) return "text-green-600"
    if (score >= 50) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <div className="mt-6 space-y-6">

 
      <div className="grid grid-cols-3 gap-4">
        <Card title="Performance" value={data.summary?.performance} />
        <Card title="Security" value={data.summary?.security} />
        <Card title="SEO" value={data.summary?.seo} />
      </div>

 
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card title="Security Score" value={`${data.security_score ?? 0}/100`} />
        <Card title="Load Time" value={`${data.performance?.load_time_ms ?? 0} ms`} />
        <Card title="Page Size" value={`${data.performance?.page_size_kb ?? 0} KB`} />
        <Card title="Tech Found" value={data.tech_stack?.length ?? 0} />
      </div>

 
      <div className="border rounded-xl overflow-hidden">

      
        <Section
          icon={<Shield size={16} />}
          title="Security Analysis"
          open={open === "security"}
          toggle={() => toggle("security")}
        >
          <div className="space-y-3">

            <div>
              <p className="text-sm text-gray-500">Security Score</p>
              <p className={`text-lg font-bold ${getColor(data.security_score)}`}>
                {data.security_score ?? 0}/100
              </p>

              <div className="w-full bg-gray-200 h-2 rounded-full mt-1">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${data.security_score ?? 0}%` }}
                />
              </div>
            </div>

            {(["critical", "high", "medium"] as const).map(level => {
              const items = data.security?.findings?.[level]
              if (!items || items.length === 0) return null

              return (
                <div key={level} className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-medium capitalize mb-1">
                    {level} Issues
                  </p>

                  {items.map((f, i) => (
                    <p key={i} className="text-xs text-gray-600">
                      {f.file} (line {f.line})
                    </p>
                  ))}
                </div>
              )
            })}
          </div>
        </Section>

 
        <Section
          icon={<Zap size={16} />}
          title="Performance"
          open={open === "performance"}
          toggle={() => toggle("performance")}
        >
          <div className="text-sm text-gray-600 space-y-2">
            <p>Load Time: {data.performance?.load_time_ms ?? 0} ms</p>
            <p>Status: {data.performance?.status_code ?? 0}</p>
            <p>Page Size: {data.performance?.page_size_kb ?? 0} KB</p>
            <p>Redirects: {data.performance?.redirect_count ?? 0}</p>
          </div>
        </Section>

   
        <Section
          icon={<Layers size={16} />}
          title="Tech Stack"
          open={open === "tech"}
          toggle={() => toggle("tech")}
        >
          <div className="flex flex-wrap gap-2">
            {data.tech_stack?.map((t, i) => (
              <span
                key={i}
                className="px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded-full"
              >
                {t}
              </span>
            ))}
          </div>
        </Section>

 
        <Section
          icon={<Globe size={16} />}
          title="SEO"
          open={open === "seo"}
          toggle={() => toggle("seo")}
        >
          <div className="text-sm text-gray-600 space-y-2">
            <p>Title Length: {data.seo?.title_length ?? 0}</p>
            <p>Description Length: {data.seo?.meta_description_length ?? 0}</p>
            <p>H1 Count: {data.seo?.h1_count ?? 0}</p>
            <p>Images Missing Alt: {data.seo?.images_missing_alt ?? 0}</p>
          </div>
        </Section>

      </div>
    </div>
  )
}
 

type CardProps = {
  title: string
  value?: string | number
}

function Card({ title, value }: CardProps) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <p className="text-xs text-gray-400">{title}</p>
      <p className="text-lg font-semibold text-gray-800">{value ?? "—"}</p>
    </div>
  )
}

type SectionProps = {
  icon: React.ReactNode
  title: string
  open: boolean
  toggle: () => void
  children: React.ReactNode
}

function Section({ icon, title, open, toggle, children }: SectionProps) {
  return (
    <div className="border-b last:border-b-0">
      <button
        onClick={toggle}
        className="w-full flex justify-between items-center px-5 py-4 hover:bg-gray-50"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-medium text-gray-800">{title}</span>
        </div>

        {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>

      {open && (
        <div className="px-5 pb-5 pt-2 bg-gray-50">
          {children}
        </div>
      )}
    </div>
  )
}


export default Performance

