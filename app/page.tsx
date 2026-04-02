import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
       <nav className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">PA</span>
            </div>
            <span className="font-semibold text-gray-900 text-lg">Project Analyzer</span>
          </div>
          <div className="flex gap-4">
            <Link 
              href="/get-started" 
              className="px-5 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors cursor-pointer"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

     
      <section className="max-w-5xl mx-auto px-6 py-20 md:py-28">
        <div className="text-center">
          <div className="inline-block mb-4 px-3 py-1  rounded-full">
            <span className="text-green-700 text-sm font-medium">Project Intelligence Engine</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight mb-6">
            Analyze your project like a{' '}
            <span className="text-green-600">senior engineer</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            Get instant, multi-dimensional reports on code quality, architecture, 
            security, and engineering standards, from any GitHub repository.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/get-started" 
              className="px-8 py-3 bg-green-600 text-white rounded-xl font-medium text-lg hover:bg-green-700 transition-all cursor-pointer shadow-sm"
            >
              Start analyzing 
            </Link>
            <Link 
              href="#how-it-works" 
              className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium text-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              See how it works
            </Link>
          </div>
          <p className="mt-6 text-sm text-gray-500">
             No signup required • Free repository analysis
          </p>
        </div>
      </section>

       
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-gray-100">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Deep analysis, clear insights</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to evaluate project quality and impress recruiters.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          
          <div className="border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Vibe Coding Score</h3>
            <p className="text-gray-600">
              Proprietary 0–100% score measuring code organization, file sizes, duplication & consistency.
            </p>
          </div>

          <div className="border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Security & Secrets Scan</h3>
            <p className="text-gray-600">
              Detect hardcoded secrets, unsafe configs, and vulnerable dependencies before they become risks.
            </p>
          </div>

          <div className="border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Performance & Architecture</h3>
            <p className="text-gray-600">
              Monolith vs microservices inference, folder structure evaluation, algorithmic inefficiencies.
            </p>
          </div>

          <div className="border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Hireability Score</h3>
            <p className="text-gray-600">
              Recruiter-friendly metric: portfolio readiness, industry standards, and overall engineering quality.
            </p>
          </div>

          <div className="border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Documentation & Tests</h3>
            <p className="text-gray-600">
              README quality, API docs, test coverage estimation, and testing framework detection.
            </p>
          </div>

          <div className="border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 01-6.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Tech Stack & Complexity</h3>
            <p className="text-gray-600">
              Languages, frameworks, project scale classification (S/M/L), and LOC counting.
            </p>
          </div>
        </div>
      </section>
 
      <section id="how-it-works" className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Three steps, full report</h2>
            <p className="text-gray-600 text-lg">From any GitHub repo to actionable insights in seconds</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-700 text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Paste repository URL</h3>
              <p className="text-gray-500">Enter any public GitHub repo, no auth required</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-700 text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI & static analysis</h3>
              <p className="text-gray-500">We scan structure, code quality, security & performance</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-700 text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Get detailed report</h3>
              <p className="text-gray-500">Vibe Score, Hireability Score, roadmap & insights</p>
            </div>
          </div>

          
          <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              <span className="text-xs text-gray-500 ml-2">project-analyzer.io/report/demo</span>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start flex-wrap gap-4 border-b pb-4 mb-4">
                <div>
                  <h4 className="font-bold text-gray-800 text-xl">Next.js Starter</h4>
                  <p className="text-gray-500 text-sm">Last updated: 2 days ago • 124 files • 8,200 LOC</p>
                </div>
                <div className="bg-green-50 px-3 py-1 rounded-full">
                  <span className="text-green-700 font-medium text-sm">Overall Score: 84/100</span>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Vibe Coding Score</p>
                  <p className="text-2xl font-bold text-gray-800">78<span className="text-base text-gray-400">/100</span></p>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1"><div className="bg-green-600 h-1.5 rounded-full" style={{ width: '78%' }}></div></div>
                  <p className="text-xs text-gray-500 mt-1">Mixed, moderate duplication</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Hireability Score</p>
                  <p className="text-2xl font-bold text-gray-800">82<span className="text-base text-gray-400">/100</span></p>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1"><div className="bg-green-600 h-1.5 rounded-full" style={{ width: '82%' }}></div></div>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"> Good README</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">  3 secrets exposed</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">  22 dependencies</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">  React/Next.js</span>
              </div>
              <button className="mt-5 w-full border border-green-600 text-green-700 py-2 rounded-lg font-medium hover:bg-green-50 transition-colors cursor-pointer">
                View full report 
              </button>
            </div>
          </div>
        </div>
      </section>
 
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Built for developers, recruiters, and teams</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex gap-3 items-start">
                <span className="text-green-600 text-xl">✓</span> 
                <span><strong>Students & junior devs</strong> - Get actionable feedback to level up portfolio projects</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-green-600 text-xl">✓</span> 
                <span><strong>Recruiters & tech leads</strong> - Instantly evaluate code quality without manual review</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-green-600 text-xl">✓</span> 
                <span><strong>Open source maintainers</strong> - Identify structural issues and security blindspots</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-green-600 text-xl">✓</span> 
                <span><strong>Agency/outsourcing reviews</strong> - Standardized quality checks before delivery</span>
              </li>
            </ul>
            <div className="mt-8">
              <Link 
                href="/get-started" 
                className="inline-block px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors cursor-pointer"
              >
                Analyze your first project 
              </Link>
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-700 font-bold">“</span>
              </div>
              <p className="font-medium text-gray-800">Instant feedback on portfolio quality</p>
            </div>
            <p className="text-gray-600 mb-3">
              “I used Project Analyzer before applying to backend roles, it caught 3 hardcoded secrets and suggested better folder structure. My hireability score went from 68 to 89 after fixes. Landed 2 interviews!”
            </p>
            <div className="flex items-center gap-3 mt-4">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <div>
                <p className="text-sm font-semibold text-gray-800">Priya K.</p>
                <p className="text-xs text-gray-500">Full-stack developer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

       <div className="border-t border-gray-100 py-10">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex flex-wrap justify-center gap-5 text-sm">
            <div className="flex items-center gap-1 text-gray-600"><span className="text-green-600 font-bold">✓</span> GitHub Repository (Full analysis)</div>
            <div className="flex items-center gap-1 text-gray-600"><span className="text-green-600 font-bold">✓</span> Live URL (Frontend & performance)</div>
            <div className="flex items-center gap-1 text-gray-600"><span className="text-green-600 font-bold">✓</span> No credit card required</div>
            <div className="flex items-center gap-1 text-gray-600"><span className="text-green-600 font-bold">✓</span> Free public reports</div>
          </div>
        </div>
      </div>

      <footer className="border-t border-gray-200 bg-white py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-600 rounded-md flex items-center justify-center">
              <span className="text-white text-[11px] font-bold">PA</span>
            </div>
            <span className="text-gray-500 text-sm">© 2026 Project Analyzer. engineering quality insights</span>
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
             Developed by Arnold
          </div>
        </div>
      </footer>
    </div>
  );
}

