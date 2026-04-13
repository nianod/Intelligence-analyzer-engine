"use client"
import Link from "next/link"
import { ArrowLeft, ChevronRight, BarChart3, Globe, GitBranch, Shield, FileText, ChevronDown, Layers } from "lucide-react"
import { useState } from "react"
import { RepoDetails } from "../components/RepoDetails"
import { useRepo } from "../hooks/useRepo"
import { useLive } from "../hooks/useLive"
import useSecurity from "../hooks/useSecurity"
import { SecurityResults } from "../components/Security"
import Performance from "../components/Perfomance"
import TechStack from "../components/TechStack"
import useTechStack from "../hooks/useTechStack"

function AccordionItem({
  icon,
  label,
  isOpen,
  onToggle,
  children,
  disabled = false,
}: {
  icon: React.ReactNode
  label: string
  isOpen: boolean
  onToggle: () => void
  children?: React.ReactNode
  disabled?: boolean
}) {
  return (
    <div className="border-b mt-3 border-gray-100 last:border-b-0">
      <button
        onClick={onToggle}
        disabled={disabled}
        className={`w-full flex items-center justify-between px-5 py-4 text-left transition-all rounded-lg ${
          disabled
            ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-70"
            : "bg-white hover:bg-green-50 cursor-pointer shadow-sm hover:shadow-md"
        }`}
      >
        <div className="flex items-center gap-3">
          <span className={`${disabled ? "text-gray-400" : "text-blue-500"}`}>{icon}</span>
          <span className={`font-medium ${disabled ? "text-gray-400" : "text-gray-800"}`}>{label}</span>
          {disabled && (
            <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">Coming soon</span>
          )}
        </div>
        {!disabled && (
          isOpen
            ? <ChevronDown className="w-4 h-4 text-gray-500" />
            : <ChevronRight className="w-4 h-4 text-gray-500" />
        )}
      </button>
      {isOpen && !disabled && (
        <div className="px-5 pb-5 pt-2 bg-blue-50 rounded-b-lg">{children}</div>
      )}
    </div>
  )
}


const Analyze = () => {
  const [liveLink, setLiveLink] = useState("")
  const [repoUrl, setRepoUrl] = useState("")
  const [activeTab, setActiveTab] = useState(1)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [openSection, setOpenSection] = useState<string | null>("repo-details")

  const { data: repoData, loading: repoLoading, error: repoError, analyze: analyzeRepo } = useRepo()
  const { data: liveData, loading: liveLoading, error: liveError, analyze: analyzeLive } = useLive()
  const { data: techStackData, loading: techStackLoading, error: techStackError, analyze: analyzeTechStack} = useTechStack()
  const { data: securityData, loading: securityLoading, error: securityError, analyze: analyzeSecurity } = useSecurity()

  const parseGithubUrl = (url: string) => {
    try {
      const urlObj = new URL(url)
      const parts = urlObj.pathname.split("/").filter(Boolean)
      if (parts.length >= 2) return { owner: parts[0], repo: parts[1] }
    } catch {}
    return null
  }

  const handleAnalyze = async () => {
    const inputValue = activeTab === 1 ? liveLink : repoUrl
    if (!inputValue.trim()) return

    setIsAnalyzing(true)

    if (activeTab === 1) {
      await analyzeLive(inputValue)
    } else {
      const parsed = parseGithubUrl(inputValue)
      if (!parsed) {
        setIsAnalyzing(false)
        return
      }
      await Promise.all([
        analyzeRepo(parsed.owner, parsed.repo),
        analyzeSecurity(parsed.owner, parsed.repo),
        analyzeTechStack(parsed.owner, parsed.repo)
      ])
      setOpenSection("repo-details")
      console.log(techStackData)
    }

    setIsAnalyzing(false)
  }

  const toggleSection = (id: string) => {
    setOpenSection((prev) => (prev === id ? null : id))
  }

  const isValidInput = activeTab === 1 ? liveLink.trim() : repoUrl.trim()
  const isLoading = isAnalyzing || repoLoading || securityLoading || liveLoading || techStackLoading

  return (
    <div>
      <Link href="/" className="flex text-gray-600 items-center gap-1 p-4 hover:text-green-600 transition-colors">
        <ArrowLeft size={18} /> Back
      </Link>

      <div className="min-h-screen bg-white p-4 md:p-6">
        <div className="max-w-3xl mx-auto">

          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Analyze Your Project</h1>
            <p className="text-gray-500">Get instant insights on code quality, performance, and security</p>
          </div>

     
          <div className="flex border-b border-gray-200 gap-1 mb-4">
            {[{ id: 1, label: "Live Link" }, { id: 2, label: "Repository URL" }].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-medium transition-all cursor-pointer relative ${
                  activeTab === tab.id ? "text-green-600" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 rounded-full" />
                )}
              </button>
            ))}
          </div>

        
          <div className="mb-4">
            {activeTab === 1 ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Live Website URL</label>
                <input
                  type="text"
                  placeholder="https://yourwebsite.com"
                  value={liveLink}
                  onChange={(e) => setLiveLink(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">GitHub Repository URL</label>
                <input
                  type="text"
                  placeholder="https://github.com/username/repository"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
              </div>
            )}
          </div>

         
          <button
            onClick={handleAnalyze}
            disabled={!isValidInput || isLoading}
            className={`w-full py-3 rounded-lg font-medium transition-all ${
              isValidInput && !isLoading
                ? "bg-green-600 text-white hover:bg-green-700 shadow-sm cursor-pointer"
                : "bg-gray-400 text-white cursor-not-allowed opacity-45"
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Analyzing...
              </span>
            ) : (
              "Analyze Project"
            )}
          </button>

          
          {(repoError || securityError || liveError) && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{repoError || securityError || liveError || techStackError}</p>
            </div>
          )}
 
          {liveData && !liveLoading && activeTab === 1 && (
            <div className="mt-6">
              <Performance data={liveData} />
            </div>
          )}

           
          {repoData && !repoLoading && activeTab === 2 && (
            <div className="mt-6 border border-gray-200 rounded-xl overflow-hidden">
              <AccordionItem
                icon={<BarChart3 className="w-4 h-4" />}
                label="Repo Details"
                isOpen={openSection === "repo-details"}
                onToggle={() => toggleSection("repo-details")}
              >
                <RepoDetails data={repoData} />
              </AccordionItem>

              <AccordionItem
                icon={<Shield className="w-4 h-4" />}
                label="Security & Secrets Scan"
                isOpen={openSection === "security"}
                onToggle={() => toggleSection("security")}
              >
                <SecurityResults data={securityData} />
              </AccordionItem>

              <AccordionItem
                icon={<GitBranch className="w-4 h-4" />}
                label="Tech Stack & Complexity"
                isOpen={openSection === "techstack"}
                onToggle={() => toggleSection("techstack")}
              >
                <TechStack data={techStackData} />
              </AccordionItem>

              <AccordionItem
                icon={<Shield className="w-4 h-4" />}
                label="Vibe Coding Score"
                isOpen={openSection === "vibe-score"}
                onToggle={() => toggleSection("vibe-score")}
                disabled
              />

              <AccordionItem
                icon={<Layers className="w-4 h-4" />}
                label="Architecture Analysis"
                isOpen={openSection === "architecture"}
                onToggle={() => toggleSection("architecture")}
                disabled
              />

              <AccordionItem
                icon={<FileText className="w-4 h-4" />}
                label="Documentation & Tests"
                isOpen={openSection === "docs"}
                onToggle={() => toggleSection("docs")}
                disabled
              />

              <AccordionItem
                icon={<Globe className="w-4 h-4" />}
                label="Hireability Score"
                isOpen={openSection === "hireability"}
                onToggle={() => toggleSection("hireability")}
                disabled
              />
            </div>
          )}
 
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-400">Try an example:</p>
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              <button onClick={() => { setRepoUrl("https://github.com/vercel/next.js"); setActiveTab(2) }}
                className="text-xs text-green-600 hover:text-green-700 underline cursor-pointer">Next.js</button>
              <button onClick={() => { setRepoUrl("https://github.com/facebook/react"); setActiveTab(2) }}
                className="text-xs text-green-600 hover:text-green-700 underline cursor-pointer">React</button>
              <button onClick={() => { setLiveLink("https://vercel.com"); setActiveTab(1) }}
                className="text-xs text-green-600 hover:text-green-700 underline cursor-pointer">Vercel</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Analyze

