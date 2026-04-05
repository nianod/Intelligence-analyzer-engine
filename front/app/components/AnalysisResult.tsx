// "use client"

// interface AnalysisResultProps {
//   data: {
//     projectOverview: {
//       name: string
//       description: string
//       author: string
//       stars: number
//       forks: number
//       lastUpdated: string
//       fileCount: number
//       linesOfCode: number
//     }
//     techStack: {
//       languages: string[]
//       frameworks: string[]
//       runtime: string
//     }
//     appType: string
//     architecture: {
//       pattern: string
//       structure: string
//     }
//     codeStructure: {
//       organization: string
//       namingConvention: string
//       modularity: string
//       separationOfConcerns: string
//     }
//     vibeScore: {
//       score: number
//       classification: string
//       suggestions: string[]
//     }
//     performance: {
//       loadTime?: string
//       assetSize?: string
//       inefficiencies?: string[]
//     }
//     security: {
//       hardcodedSecrets: number
//       unsafeConfigs: string[]
//       vulnerabilities: string[]
//     }
//     dependencyHealth: {
//       outdatedLibraries: string[]
//       totalDependencies: number
//       riskLevel: string
//     }
//     codeQuality: {
//       readability: number
//       maintainability: number
//       modularity: number
//       documentation: number
//     }
//     projectScale: {
//       classification: string
//       fileCount: number
//       linesOfCode: number
//       scalabilityReadiness: string
//     }
//     aiSummary: {
//       strengths: string[]
//       weaknesses: string[]
//       overallQuality: string
//     }
//     hireabilityScore: {
//       score: number
//       feedback: string
//     }
//     improvementRoadmap: string[]
//     documentation: {
//       readmeQuality: string
//       setupInstructions: boolean
//       apiDocs: boolean
//     }
//     testing: {
//       hasTests: boolean
//       coverage: string
//       frameworks: string[]
//     }
//     redFlags: string[]
//   }
// }

// const AnalysisResult = ({ data }: AnalysisResultProps) => {
//   return (
//     <div className="space-y-6 mt-8">
//       {/* Overall Score Header */}
//       <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//           <div>
//             <h2 className="text-2xl font-bold text-gray-900">Analysis Report</h2>
//             <p className="text-gray-600 mt-1">Generated on {new Date().toLocaleDateString()}</p>
//           </div>
//           <div className="text-center">
//             <div className="text-4xl font-bold text-green-600">{data.hireabilityScore.score}/100</div>
//             <p className="text-sm text-gray-600 mt-1">Overall Score</p>
//           </div>
//         </div>
//       </div>

//       {/* Project Overview */}
//       <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
//         <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
//           <h3 className="font-semibold text-gray-900">📋 Project Overview</h3>
//         </div>
//         <div className="p-6">
//           <div className="grid md:grid-cols-2 gap-4">
//             <div>
//               <p className="text-sm text-gray-500">Name</p>
//               <p className="font-medium text-gray-900">{data.projectOverview.name}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Author</p>
//               <p className="font-medium text-gray-900">{data.projectOverview.author}</p>
//             </div>
//             <div className="md:col-span-2">
//               <p className="text-sm text-gray-500">Description</p>
//               <p className="text-gray-700">{data.projectOverview.description}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Stars / Forks</p>
//               <p className="font-medium text-gray-900">⭐ {data.projectOverview.stars} / 🍴 {data.projectOverview.forks}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Last Updated</p>
//               <p className="font-medium text-gray-900">{data.projectOverview.lastUpdated}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Files / LOC</p>
//               <p className="font-medium text-gray-900">{data.projectOverview.fileCount} files / {data.projectOverview.linesOfCode.toLocaleString()} LOC</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Tech Stack */}
//       <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
//         <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
//           <h3 className="font-semibold text-gray-900">🛠️ Tech Stack</h3>
//         </div>
//         <div className="p-6">
//           <div className="flex flex-wrap gap-4">
//             <div>
//               <p className="text-sm text-gray-500">Languages</p>
//               <div className="flex gap-2 mt-1">
//                 {data.techStack.languages.map((lang, i) => (
//                   <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">{lang}</span>
//                 ))}
//               </div>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Frameworks</p>
//               <div className="flex gap-2 mt-1">
//                 {data.techStack.frameworks.map((fw, i) => (
//                   <span key={i} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-sm">{fw}</span>
//                 ))}
//               </div>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Runtime</p>
//               <p className="font-medium text-gray-900 mt-1">{data.techStack.runtime}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Application Type</p>
//               <p className="font-medium text-gray-900 mt-1">{data.appType}</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Vibe Coding Score */}
//       <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
//         <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
//           <h3 className="font-semibold text-gray-900">🎨 Vibe Coding Score</h3>
//         </div>
//         <div className="p-6">
//           <div className="flex items-center gap-4 mb-4">
//             <div className="text-4xl font-bold text-green-600">{data.vibeScore.score}%</div>
//             <div className={`px-3 py-1 rounded-full text-sm font-medium ${
//               data.vibeScore.classification === 'Clean' ? 'bg-green-100 text-green-700' :
//               data.vibeScore.classification === 'Mixed' ? 'bg-yellow-100 text-yellow-700' :
//               'bg-red-100 text-red-700'
//             }`}>
//               {data.vibeScore.classification}
//             </div>
//           </div>
//           <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
//             <div className="bg-green-600 h-2 rounded-full" style={{ width: `${data.vibeScore.score}%` }}></div>
//           </div>
//           <div>
//             <p className="text-sm font-medium text-gray-700 mb-2">Improvement Suggestions:</p>
//             <ul className="list-disc list-inside space-y-1">
//               {data.vibeScore.suggestions.map((suggestion, i) => (
//                 <li key={i} className="text-sm text-gray-600">{suggestion}</li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       </div>

//       {/* Code Quality & Architecture */}
//       <div className="grid md:grid-cols-2 gap-6">
//         <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
//           <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
//             <h3 className="font-semibold text-gray-900">📊 Code Quality</h3>
//           </div>
//           <div className="p-6">
//             <div className="space-y-3">
//               <div>
//                 <div className="flex justify-between text-sm mb-1">
//                   <span>Readability</span>
//                   <span className="text-gray-600">{data.codeQuality.readability}%</span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-green-600 h-2 rounded-full" style={{ width: `${data.codeQuality.readability}%` }}></div></div>
//               </div>
//               <div>
//                 <div className="flex justify-between text-sm mb-1">
//                   <span>Maintainability</span>
//                   <span className="text-gray-600">{data.codeQuality.maintainability}%</span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-green-600 h-2 rounded-full" style={{ width: `${data.codeQuality.maintainability}%` }}></div></div>
//               </div>
//               <div>
//                 <div className="flex justify-between text-sm mb-1">
//                   <span>Modularity</span>
//                   <span className="text-gray-600">{data.codeQuality.modularity}%</span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-green-600 h-2 rounded-full" style={{ width: `${data.codeQuality.modularity}%` }}></div></div>
//               </div>
//               <div>
//                 <div className="flex justify-between text-sm mb-1">
//                   <span>Documentation</span>
//                   <span className="text-gray-600">{data.codeQuality.documentation}%</span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-green-600 h-2 rounded-full" style={{ width: `${data.codeQuality.documentation}%` }}></div></div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
//           <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
//             <h3 className="font-semibold text-gray-900">🏗️ Architecture</h3>
//           </div>
//           <div className="p-6">
//             <p className="text-sm text-gray-500 mb-2">Pattern</p>
//             <p className="font-medium text-gray-900 mb-3">{data.architecture.pattern}</p>
//             <p className="text-sm text-gray-500 mb-2">Code Structure</p>
//             <p className="text-sm text-gray-700 mb-2">{data.codeStructure.organization}</p>
//             <p className="text-sm text-gray-500 mb-1">Modularity: {data.codeStructure.modularity}</p>
//             <p className="text-sm text-gray-500">Separation of Concerns: {data.codeStructure.separationOfConcerns}</p>
//           </div>
//         </div>
//       </div>

//       {/* Security & Dependencies */}
//       <div className="grid md:grid-cols-2 gap-6">
//         <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
//           <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
//             <h3 className="font-semibold text-gray-900">🔒 Security Analysis</h3>
//           </div>
//           <div className="p-6">
//             <div className="space-y-3">
//               <div className="flex justify-between items-center">
//                 <span className="text-sm text-gray-600">Hardcoded Secrets</span>
//                 <span className={`font-semibold ${data.security.hardcodedSecrets > 0 ? 'text-red-600' : 'text-green-600'}`}>
//                   {data.security.hardcodedSecrets} found
//                 </span>
//               </div>
//               {data.security.unsafeConfigs.length > 0 && (
//                 <div>
//                   <p className="text-sm text-gray-600 mb-1">Unsafe Configurations:</p>
//                   <ul className="list-disc list-inside text-sm text-red-600">
//                     {data.security.unsafeConfigs.map((config, i) => (
//                       <li key={i}>{config}</li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//               {data.security.vulnerabilities.length > 0 && (
//                 <div>
//                   <p className="text-sm text-gray-600 mb-1">Vulnerabilities:</p>
//                   <ul className="list-disc list-inside text-sm text-orange-600">
//                     {data.security.vulnerabilities.map((vuln, i) => (
//                       <li key={i}>{vuln}</li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
//           <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
//             <h3 className="font-semibold text-gray-900">📦 Dependency Health</h3>
//           </div>
//           <div className="p-6">
//             <p className="text-sm text-gray-500 mb-1">Total Dependencies: <span className="font-semibold text-gray-900">{data.dependencyHealth.totalDependencies}</span></p>
//             <p className="text-sm text-gray-500 mb-2">Risk Level: <span className={`font-semibold ${
//               data.dependencyHealth.riskLevel === 'Low' ? 'text-green-600' :
//               data.dependencyHealth.riskLevel === 'Medium' ? 'text-yellow-600' : 'text-red-600'
//             }`}>{data.dependencyHealth.riskLevel}</span></p>
//             {data.dependencyHealth.outdatedLibraries.length > 0 && (
//               <div>
//                 <p className="text-sm text-gray-600 mb-1">Outdated Libraries:</p>
//                 <ul className="list-disc list-inside text-sm text-gray-700">
//                   {data.dependencyHealth.outdatedLibraries.map((lib, i) => (
//                     <li key={i}>{lib}</li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* AI Summary */}
//       <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
//         <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
//           <h3 className="font-semibold text-gray-900">🤖 AI-Powered Summary</h3>
//         </div>
//         <div className="p-6">
//           <div className="grid md:grid-cols-2 gap-6">
//             <div>
//               <p className="font-medium text-green-600 mb-2">Strengths</p>
//               <ul className="list-disc list-inside space-y-1">
//                 {data.aiSummary.strengths.map((strength, i) => (
//                   <li key={i} className="text-sm text-gray-700">{strength}</li>
//                 ))}
//               </ul>
//             </div>
//             <div>
//               <p className="font-medium text-red-600 mb-2">Weaknesses</p>
//               <ul className="list-disc list-inside space-y-1">
//                 {data.aiSummary.weaknesses.map((weakness, i) => (
//                   <li key={i} className="text-sm text-gray-700">{weakness}</li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//           <div className="mt-4 p-4 bg-gray-50 rounded-lg">
//             <p className="text-gray-700">{data.aiSummary.overallQuality}</p>
//           </div>
//         </div>
//       </div>

//       {/* Improvement Roadmap */}
//       <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
//         <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
//           <h3 className="font-semibold text-gray-900">🗺️ Improvement Roadmap</h3>
//         </div>
//         <div className="p-6">
//           <ol className="space-y-3">
//             {data.improvementRoadmap.map((step, i) => (
//               <li key={i} className="flex gap-3">
//                 <span className="w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-sm font-semibold">{i + 1}</span>
//                 <span className="text-gray-700">{step}</span>
//               </li>
//             ))}
//           </ol>
//         </div>
//       </div>

//       {/* Documentation & Testing */}
//       <div className="grid md:grid-cols-2 gap-6">
//         <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
//           <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
//             <h3 className="font-semibold text-gray-900">📚 Documentation</h3>
//           </div>
//           <div className="p-6">
//             <p className="text-sm text-gray-500 mb-1">README Quality: <span className="font-medium text-gray-900">{data.documentation.readmeQuality}</span></p>
//             <p className="text-sm text-gray-500 mb-1">Setup Instructions: <span className={data.documentation.setupInstructions ? 'text-green-600' : 'text-red-600'}>{data.documentation.setupInstructions ? '✓ Present' : '✗ Missing'}</span></p>
//             <p className="text-sm text-gray-500">API Documentation: <span className={data.documentation.apiDocs ? 'text-green-600' : 'text-red-600'}>{data.documentation.apiDocs ? '✓ Present' : '✗ Missing'}</span></p>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
//           <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
//             <h3 className="font-semibold text-gray-900">🧪 Testing</h3>
//           </div>
//           <div className="p-6">
//             <p className="text-sm text-gray-500 mb-1">Tests Present: <span className={data.testing.hasTests ? 'text-green-600' : 'text-red-600'}>{data.testing.hasTests ? '✓ Yes' : '✗ No'}</span></p>
//             {data.testing.hasTests && (
//               <>
//                 <p className="text-sm text-gray-500 mb-1">Coverage: <span className="font-medium text-gray-900">{data.testing.coverage}</span></p>
//                 <p className="text-sm text-gray-500">Frameworks: {data.testing.frameworks.join(', ')}</p>
//               </>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Red Flags */}
//       {data.redFlags.length > 0 && (
//         <div className="bg-red-50 rounded-xl border border-red-200 overflow-hidden">
//           <div className="bg-red-100 px-6 py-3 border-b border-red-200">
//             <h3 className="font-semibold text-red-800">⚠️ Critical Issues Detected</h3>
//           </div>
//           <div className="p-6">
//             <ul className="list-disc list-inside space-y-2">
//               {data.redFlags.map((flag, i) => (
//                 <li key={i} className="text-red-700">{flag}</li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default AnalysisResult