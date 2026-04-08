"use client"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useState } from "react"
import { RepoDetails } from "../components/RepoDetails"
import { useRepo } from "../hooks/useRepo"

const Analyze = () => {
  const [liveLink, setLiveLink] = useState<string>("")
  const [repoUrl, setRepoUrl] = useState<string>("")
  const [activeTab, setActiveTab] = useState<number>(1)
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false)
  
  // Use the hook to get repo data fetching capabilities
  const { data, loading, error, analyze } = useRepo()

  const parseGithubUrl = (url: string) => {
    try {
      const urlObj = new URL(url)
      const parts = urlObj.pathname.split('/').filter(Boolean)
      if (parts.length >= 2) {
        return { owner: parts[0], repo: parts[1] }
      }
    } catch (e) {
      return null
    }
    return null
  }

  const handleAnalyze = async () => {
    const inputValue = activeTab === 1 ? liveLink : repoUrl
    if (!inputValue.trim()) return
    
    if (activeTab === 2) {
      // Parse GitHub URL
      const parsed = parseGithubUrl(inputValue)
      if (!parsed) {
        console.error("Invalid GitHub URL")
        return
      }
      
      setIsAnalyzing(true)
      // Call the analyze function from the hook
      const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN || ""
      await analyze(parsed.owner, parsed.repo, token)
      setIsAnalyzing(false)
    } else {
      // Handle live link analysis
      setIsAnalyzing(true)
      setTimeout(() => {
        console.log("Analyzing live link:", inputValue)
        setIsAnalyzing(false)
      }, 2000)
    }
  }

  const isValidInput = activeTab === 1 ? liveLink.trim() : repoUrl.trim()

  return (
    <div>
      <Link href="/" className="flex text-gray-600 items-center gap-1 p-4 hover:text-green-600 transition-colors">
        <ArrowLeft size={18} /> Back
      </Link>
      
      <div className="min-h-screen bg-white p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-3">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Analyze Your Project</h1>
            <p className="text-gray-500">Get instant insights on code quality, performance, and security</p>
          </div>

          {/* Tab Buttons */}
          <div className="flex border-b border-gray-200 gap-1">
            {[
              { id: 1, label: "Live Link" },
              { id: 2, label: "Repository URL" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id)
                }}
                className={`px-6 py-3 font-medium transition-all cursor-pointer relative ${
                  activeTab === tab.id 
                    ? "text-green-600" 
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="mt-4">
            {activeTab === 1 ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Live Website URL
                </label>
                <input 
                  type="text" 
                  placeholder="https://yourwebsite.com" 
                  value={liveLink}
                  onChange={(e) => setLiveLink(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                />
                <p className="mt-2 text-sm text-gray-400">
                  📊 Limited analysis: Frontend, performance, SEO & tech detection
                </p>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GitHub Repository URL
                </label>
                <input 
                  type="text" 
                  placeholder="https://github.com/username/repository" 
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                />
                <p className="mt-2 text-sm text-gray-400">
                  🔍 Full analysis: Code quality, architecture, security, tests & more
                </p>
              </div>
            )}
          </div>

          {/* Analyze Button */}
          <button 
            onClick={handleAnalyze}
            disabled={!isValidInput || isAnalyzing || loading}
            className={`mt-4 w-full py-3 rounded-lg font-medium transition-all cursor-pointer ${
              isValidInput && !isAnalyzing && !loading
                ? "bg-green-600 text-white hover:bg-green-700 shadow-sm" 
                : "bg-gray-400 text-white cursor-not-allowed opacity-45"
            }`}
          >
            {(isAnalyzing || loading) ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </span>
            ) : (
              "Analyze Project"
            )}
          </button>

          {/* Display Error */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Display Repository Details - THIS IS WHERE THE HOOK DATA IS USED */}
          {data && !loading && (
            <RepoDetails data={data} />
          )}

          {/* Info Cards */}
          <div className="mt-8 grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xl">📦</span>
                <h3 className="font-semibold text-gray-800">Repository Analysis</h3>
              </div>
              <p className="text-sm text-gray-500">
                Deep code review, architecture insights, dependency health, security scan, test coverage estimation, and detailed quality metrics.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xl">🌐</span>
                <h3 className="font-semibold text-gray-800">Live Link Analysis</h3>
              </div>
              <p className="text-sm text-gray-500">
                Performance metrics, load time, asset size, SEO, accessibility, and frontend framework detection.
              </p>
            </div>
          </div>

          {/* Example Buttons */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">Try an example:</p>
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              <button 
                onClick={() => setRepoUrl("https://github.com/vercel/next.js")}
                className="text-xs text-green-600 hover:text-green-700 underline cursor-pointer"
              >
                Next.js
              </button>
              <button 
                onClick={() => setRepoUrl("https://github.com/facebook/react")}
                className="text-xs text-green-600 hover:text-green-700 underline cursor-pointer"
              >
                React
              </button>
              <button 
                onClick={() => setLiveLink("https://vercel.com")}
                className="text-xs text-green-600 hover:text-green-700 underline cursor-pointer"
              >
                Vercel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analyze