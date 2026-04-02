"use client"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useState } from "react"

const Analyze = () => {
  const [liveLink, setLiveLink] = useState<string>("")
  const [repoUrl, setRepoUrl] = useState<string>("")
  const [activeTab, setActiveTab] = useState<number>(1)
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false)

  const tabs = [
    { id: 1, label: "Live Link", value: "liveLink", placeholder: "https://example.com" },
    { id: 2, label: "Repository URL", value: "repoUrl", placeholder: "https://github.com/user/repo" }
  ]

  const handleAnalyze = () => {
    const inputValue = activeTab === 1 ? liveLink : repoUrl
    if (!inputValue.trim()) return
    
    setIsAnalyzing(true)
    // Simulate analysis - replace with actual API call
    setTimeout(() => {
      console.log("Analyzing:", inputValue)
      setIsAnalyzing(false)
    }, 2000)
  }

  const isValidInput = activeTab === 1 ? liveLink.trim() : repoUrl.trim()

  return (
    <div >
        <Link href="/" className="flex text-gray-600">
           <ArrowLeft />Back
        </Link>
     <div className="min-h-screen bg-white p-4 md:p-6">
      <div className="max-w-3xl mx-auto">
     
        <div className="text-center mb-3">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Analyze Your Project</h1>
          <p className="text-gray-500">Get instant insights on code quality, performance, and security</p>
        </div>

         <div className="flex border-b border-gray-200 gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
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
                 Limited analysis: Frontend, performance, SEO & tech detection
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
                 Full analysis: Code quality, architecture, security, tests & more
              </p>
            </div>
          )}
        </div>

         <button 
          onClick={handleAnalyze}
          disabled={!isValidInput || isAnalyzing}
          className={`mt-4 w-full py-3 rounded-lg font-medium transition-all cursor-pointer ${
            isValidInput && !isAnalyzing
              ? "bg-green-600 text-white hover:bg-green-700 shadow-sm" 
              : "bg-gray-400 text-white cursor-not-allowed opacity-45"
          }`}
        >
          {isAnalyzing ? (
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

        {/* Info Cards */}
  

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