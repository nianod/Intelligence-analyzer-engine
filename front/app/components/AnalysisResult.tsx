"use client"

const AnalysisResult = () => {
  // Mock data directly inside the component
  const data = {
    projectOverview: {
      name: "Next.js Dashboard",
      description: "A modern dashboard application built with Next.js 14, featuring real-time analytics and user management.",
      author: "John Doe",
      stars: 245,
      forks: 67,
      lastUpdated: "2026-04-01",
      fileCount: 156,
      linesOfCode: 12450
    },
    techStack: {
      languages: ["TypeScript", "JavaScript", "CSS"],
      frameworks: ["Next.js", "React", "Tailwind CSS"],
      runtime: "Node.js"
    },
    appType: "Full-stack Web Application",
    architecture: {
      pattern: "Component-based with App Router",
      structure: "Feature-based organization"
    },
    codeStructure: {
      organization: "Well-organized with clear separation",
      namingConvention: "Consistent PascalCase and camelCase",
      modularity: "High - components are reusable",
      separationOfConcerns: "Good separation between UI and logic"
    },
    vibeScore: {
      score: 78,
      classification: "Mixed",
      suggestions: [
        "Split large components into smaller ones",
        "Reduce duplication in utility functions",
        "Improve file organization in the utils folder"
      ]
    },
    performance: {
      loadTime: "1.2s",
      assetSize: "1.4MB",
      inefficiencies: ["Large bundle size due to unused imports", "Missing image optimization"]
    },
    security: {
      hardcodedSecrets: 0,
      unsafeConfigs: ["Environment variables not properly validated"],
      vulnerabilities: ["One dependency has known CVE (minor)"]
    },
    dependencyHealth: {
      outdatedLibraries: ["react-query v3 → v5 available", "axios v0.27 → v1.7"],
      totalDependencies: 42,
      riskLevel: "Medium"
    },
    codeQuality: {
      readability: 82,
      maintainability: 75,
      modularity: 80,
      documentation: 65
    },
    projectScale: {
      classification: "Medium",
      fileCount: 156,
      linesOfCode: 12450,
      scalabilityReadiness: "Good for moderate scale, needs optimization for high traffic"
    },
    aiSummary: {
      strengths: [
        "Clean component structure",
        "Good TypeScript usage",
        "Responsive design implementation"
      ],
      weaknesses: [
        "Inconsistent error handling",
        "Missing unit tests for critical features",
        "Limited API documentation"
      ],
      overallQuality: "The project shows solid engineering practices with good organization. However, testing and documentation need improvement to reach production-ready standards."
    },
    hireabilityScore: {
      score: 74,
      feedback: "Portfolio shows competence but lacks testing evidence. Add tests and improve documentation for better recruiter impression."
    },
    improvementRoadmap: [
      "Add unit tests for core components (Jest + React Testing Library)",
      "Implement proper error boundaries and logging",
      "Optimize bundle size with dynamic imports",
      "Add API documentation using Swagger/OpenAPI",
      "Set up CI/CD pipeline with automated testing"
    ],
    documentation: {
      readmeQuality: "Good - includes setup, features, and basic usage",
      setupInstructions: true,
      apiDocs: false
    },
    testing: {
      hasTests: false,
      coverage: "0%",
      frameworks: []
    },
    seoAccessibility: {
      metaTags: true,
      altText: "Partial",
      accessibilityScore: "72/100"
    },
    redFlags: [
      "Missing test suite for critical functionality",
      "No CI/CD pipeline configured"
    ]
  }

  return (
    <div className="space-y-6 mt-8">
      {/* Overall Score Header */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Analysis Report</h2>
            <p className="text-gray-600 mt-1">Generated on {new Date().toLocaleDateString()}</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600">{data.hireabilityScore.score}/100</div>
            <p className="text-sm text-gray-600 mt-1">Overall Score</p>
          </div>
        </div>
      </div>

      {/* Project Overview */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">📋 Project Overview</h3>
        </div>
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium text-gray-900">{data.projectOverview.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Author</p>
              <p className="font-medium text-gray-900">{data.projectOverview.author}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Description</p>
              <p className="text-gray-700">{data.projectOverview.description}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Stars / Forks</p>
              <p className="font-medium text-gray-900">⭐ {data.projectOverview.stars} / 🍴 {data.projectOverview.forks}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Updated</p>
              <p className="font-medium text-gray-900">{data.projectOverview.lastUpdated}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Files / LOC</p>
              <p className="font-medium text-gray-900">{data.projectOverview.fileCount} files / {data.projectOverview.linesOfCode.toLocaleString()} LOC</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Stack & App Type */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">🛠️ Tech Stack & Application Type</h3>
        </div>
        <div className="p-6">
          <div className="flex flex-wrap gap-6">
            <div>
              <p className="text-sm text-gray-500">Languages</p>
              <div className="flex gap-2 mt-1">
                {data.techStack.languages.map((lang, i) => (
                  <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">{lang}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Frameworks</p>
              <div className="flex gap-2 mt-1 flex-wrap">
                {data.techStack.frameworks.map((fw, i) => (
                  <span key={i} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-sm">{fw}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Runtime</p>
              <p className="font-medium text-gray-900 mt-1">{data.techStack.runtime}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Application Type</p>
              <p className="font-medium text-gray-900 mt-1">{data.appType}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Architecture & Code Structure */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">🏗️ Architecture Analysis</h3>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-500 mb-2">Pattern</p>
            <p className="font-medium text-gray-900 mb-3">{data.architecture.pattern}</p>
            <p className="text-sm text-gray-500 mb-2">Structure</p>
            <p className="text-gray-700">{data.architecture.structure}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">📁 Code Structure</h3>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-500 mb-2">Organization</p>
            <p className="text-gray-700 mb-2">{data.codeStructure.organization}</p>
            <p className="text-sm text-gray-500 mb-1">Naming Convention: {data.codeStructure.namingConvention}</p>
            <p className="text-sm text-gray-500 mb-1">Modularity: {data.codeStructure.modularity}</p>
            <p className="text-sm text-gray-500">Separation of Concerns: {data.codeStructure.separationOfConcerns}</p>
          </div>
        </div>
      </div>

      {/* Vibe Coding Score */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">🎨 Vibe Coding Score</h3>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-4xl font-bold text-green-600">{data.vibeScore.score}%</div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              data.vibeScore.classification === 'Clean' ? 'bg-green-100 text-green-700' :
              data.vibeScore.classification === 'Mixed' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {data.vibeScore.classification}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div className="bg-green-600 h-2 rounded-full" style={{ width: `${data.vibeScore.score}%` }}></div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Improvement Suggestions:</p>
            <ul className="list-disc list-inside space-y-1">
              {data.vibeScore.suggestions.map((suggestion, i) => (
                <li key={i} className="text-sm text-gray-600">{suggestion}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Code Quality */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">📊 Code Quality Score</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Readability</span>
                <span className="text-gray-600">{data.codeQuality.readability}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: `${data.codeQuality.readability}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Maintainability</span>
                <span className="text-gray-600">{data.codeQuality.maintainability}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: `${data.codeQuality.maintainability}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Modularity</span>
                <span className="text-gray-600">{data.codeQuality.modularity}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: `${data.codeQuality.modularity}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Documentation Quality</span>
                <span className="text-gray-600">{data.codeQuality.documentation}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: `${data.codeQuality.documentation}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Analysis */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">⚡ Performance Analysis</h3>
        </div>
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500">Load Time</p>
              <p className="font-medium text-gray-900">{data.performance.loadTime}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Asset Size</p>
              <p className="font-medium text-gray-900">{data.performance.assetSize}</p>
            </div>
          </div>
          {data.performance.inefficiencies.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Inefficiencies Detected:</p>
              <ul className="list-disc list-inside space-y-1">
                {data.performance.inefficiencies.map((issue, i) => (
                  <li key={i} className="text-sm text-orange-600">{issue}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Security Analysis */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">🔒 Security Analysis</h3>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Hardcoded Secrets</span>
              <span className={`font-semibold ${data.security.hardcodedSecrets > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {data.security.hardcodedSecrets} found
              </span>
            </div>
            {data.security.unsafeConfigs.length > 0 && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Unsafe Configurations:</p>
                <ul className="list-disc list-inside text-sm text-red-600">
                  {data.security.unsafeConfigs.map((config, i) => (
                    <li key={i}>{config}</li>
                  ))}
                </ul>
              </div>
            )}
            {data.security.vulnerabilities.length > 0 && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Dependency Vulnerabilities:</p>
                <ul className="list-disc list-inside text-sm text-orange-600">
                  {data.security.vulnerabilities.map((vuln, i) => (
                    <li key={i}>{vuln}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dependency Health */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">📦 Dependency Health</h3>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-500 mb-1">Total Dependencies: <span className="font-semibold text-gray-900">{data.dependencyHealth.totalDependencies}</span></p>
          <p className="text-sm text-gray-500 mb-3">Risk Level: <span className={`font-semibold ${
            data.dependencyHealth.riskLevel === 'Low' ? 'text-green-600' :
            data.dependencyHealth.riskLevel === 'Medium' ? 'text-yellow-600' : 'text-red-600'
          }`}>{data.dependencyHealth.riskLevel}</span></p>
          {data.dependencyHealth.outdatedLibraries.length > 0 && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Outdated Libraries:</p>
              <ul className="list-disc list-inside text-sm text-gray-700">
                {data.dependencyHealth.outdatedLibraries.map((lib, i) => (
                  <li key={i}>{lib}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Project Scale & Complexity */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">📏 Project Scale & Complexity</h3>
        </div>
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Classification</p>
              <p className="font-medium text-gray-900">{data.projectScale.classification}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">File Count</p>
              <p className="font-medium text-gray-900">{data.projectScale.fileCount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Lines of Code</p>
              <p className="font-medium text-gray-900">{data.projectScale.linesOfCode.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Scalability Readiness</p>
              <p className="font-medium text-gray-900">{data.projectScale.scalabilityReadiness}</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI-Powered Summary */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">🤖 AI-Powered Summary</h3>
        </div>
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6 mb-4">
            <div>
              <p className="font-medium text-green-600 mb-2">✅ Strengths</p>
              <ul className="list-disc list-inside space-y-1">
                {data.aiSummary.strengths.map((strength, i) => (
                  <li key={i} className="text-sm text-gray-700">{strength}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-medium text-red-600 mb-2">⚠️ Weaknesses</p>
              <ul className="list-disc list-inside space-y-1">
                {data.aiSummary.weaknesses.map((weakness, i) => (
                  <li key={i} className="text-sm text-gray-700">{weakness}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700">{data.aiSummary.overallQuality}</p>
          </div>
        </div>
      </div>

      {/* Hireability Score */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">💼 Hireability Score</h3>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-4 mb-3">
            <div className="text-3xl font-bold text-green-600">{data.hireabilityScore.score}/100</div>
            <div className="flex-1">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: `${data.hireabilityScore.score}%` }}></div>
              </div>
            </div>
          </div>
          <p className="text-gray-700">{data.hireabilityScore.feedback}</p>
        </div>
      </div>

      {/* Improvement Roadmap */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">🗺️ Improvement Roadmap</h3>
        </div>
        <div className="p-6">
          <ol className="space-y-3">
            {data.improvementRoadmap.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-sm font-semibold">{i + 1}</span>
                <span className="text-gray-700">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Documentation Analysis */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">📚 Documentation Analysis</h3>
        </div>
        <div className="p-6">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">README Quality: <span className="font-medium text-gray-900">{data.documentation.readmeQuality}</span></p>
            <p className="text-sm text-gray-500">Setup Instructions: <span className={data.documentation.setupInstructions ? 'text-green-600' : 'text-red-600'}>{data.documentation.setupInstructions ? '✓ Present' : '✗ Missing'}</span></p>
            <p className="text-sm text-gray-500">API Documentation: <span className={data.documentation.apiDocs ? 'text-green-600' : 'text-red-600'}>{data.documentation.apiDocs ? '✓ Present' : '✗ Missing'}</span></p>
          </div>
        </div>
      </div>

      {/* Testing Analysis */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">🧪 Testing Analysis</h3>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-500 mb-1">Tests Present: <span className={data.testing.hasTests ? 'text-green-600' : 'text-red-600'}>{data.testing.hasTests ? '✓ Yes' : '✗ No'}</span></p>
          {data.testing.hasTests && (
            <>
              <p className="text-sm text-gray-500 mb-1">Coverage: <span className="font-medium text-gray-900">{data.testing.coverage}</span></p>
              <p className="text-sm text-gray-500">Frameworks: {data.testing.frameworks.join(', ')}</p>
            </>
          )}
          {!data.testing.hasTests && (
            <p className="text-sm text-orange-600 mt-2">⚠️ No tests detected. Consider adding tests for critical functionality.</p>
          )}
        </div>
      </div>

      {/* SEO & Accessibility (Live Only) */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">🔍 SEO & Accessibility</h3>
        </div>
        <div className="p-6">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Meta Tags: <span className={data.seoAccessibility.metaTags ? 'text-green-600' : 'text-red-600'}>{data.seoAccessibility.metaTags ? '✓ Present' : '✗ Missing'}</span></p>
            <p className="text-sm text-gray-500">Alt Text: <span className="font-medium text-gray-900">{data.seoAccessibility.altText}</span></p>
            <p className="text-sm text-gray-500">Accessibility Score: <span className="font-medium text-gray-900">{data.seoAccessibility.accessibilityScore}</span></p>
          </div>
        </div>
      </div>

      {/* Red Flags Detection */}
      {data.redFlags.length > 0 && (
        <div className="bg-red-50 rounded-xl border border-red-200 overflow-hidden">
          <div className="bg-red-100 px-6 py-3 border-b border-red-200">
            <h3 className="font-semibold text-red-800">🚩 Critical Issues Detected</h3>
          </div>
          <div className="p-6">
            <ul className="list-disc list-inside space-y-2">
              {data.redFlags.map((flag, i) => (
                <li key={i} className="text-red-700">{flag}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnalysisResult