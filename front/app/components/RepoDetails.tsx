"use client"

import type { RepoDetailsProps } from "../types/RepoDetails"
import { Star, Eye, GitFork, AlertTriangle, Package } from "lucide-react"

export function RepoDetails({ data }: RepoDetailsProps) {
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
    })

  const formatSize = (kb: number) =>
    kb < 1024 ? `${kb} KB` : `${(kb / 1024).toFixed(2)} MB`

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap">
        <h2 className="text-xl font-bold text-gray-900">{data.name}</h2>
        {data.private && <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded-full">Private</span>}
        {data.fork && <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">Fork</span>}
        {data.archived && <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">Archived</span>}
      </div>
      <p className="text-sm text-gray-500">by {data.full_name}</p>
      <p className="text-gray-700">{data.description || "No description provided"}</p>
      <div className="flex items-center gap-4">
        <a href={data.url} target="_blank" rel="noopener noreferrer"
          className="text-sm text-green-600 hover:underline">View on GitHub </a>
        {data.language && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-sm text-gray-600">{data.language}</span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-4 border-t border-gray-200">
        {[
          { icon: <Star className="w-5 h-5 text-yellow-500" />, value: data.stars.toLocaleString(), label: "Stars" },
          { icon: <Eye className="w-5 h-5 text-blue-500" />, value: data.watchers.toLocaleString(), label: "Watchers" },
          { icon: <GitFork className="w-5 h-5 text-purple-500" />, value: data.forks.toLocaleString(), label: "Forks" },
          { icon: <AlertTriangle className="w-5 h-5 text-red-500" />, value: data.open_issues.toLocaleString(), label: "Open Issues" },
          { icon: <Package className="w-5 h-5 text-green-500" />, value: formatSize(data.size_kb), label: "Size" },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <div className="flex justify-center mb-1">{s.icon}</div>
            <p className="text-xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-gray-200 ">
        <p className="font-semibold">Owner</p>
     
      <div className="flex items-center gap-4 ">
         
        <img src={data.owner.avatar} alt={data.owner.username} className="w-12 h-12 rounded-full object-cover" />
        <div>
          <a href={data.owner.profile} target="_blank" rel="noopener noreferrer"
            className="font-semibold text-gray-900 hover:text-green-600 hover:underline">
            {data.owner.username}
          </a>
          <p className="text-xs text-gray-500 mt-0.5">Account Type: {data.owner.type}</p>
        </div>
      </div>
       </div>

      
      <div className="flex flex-col pt-4 border-t border-gray-200">
        <span className="font-semibold mb-2">
          Topics
        </span>
      {data.topics.length > 0 && (
        <div className="flex flex-wrap gap-2">
        
          {data.topics.map((topic, i) => (
            <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">{topic}</span>
          ))}
        </div>
      )}
      </div>

      {/* Metadata */}
      <div className="grid md:grid-cols-2 gap-3 pt-4 border-t border-gray-200">
        {[
          { label: "Created", value: formatDate(data.created_at) },
          { label: "Last Updated", value: formatDate(data.updated_at) },
          { label: "Last Pushed", value: formatDate(data.pushed_at) },
          { label: "Default Branch", value: data.default_branch },
          { label: "License", value: data.license || "Not specified" },
        ].map((item) => (
          <div key={item.label}>
            <p className="text-xs text-gray-500">{item.label}</p>
            <p className="font-medium text-gray-900 text-sm">{item.value}</p>
          </div>
        ))}
        <div>
          <p className="text-xs text-gray-500 mb-1">Features</p>
          <div className="flex flex-wrap gap-1">
            {data.has_issues && <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">Issues</span>}
            {data.has_wiki && <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">Wiki</span>}
            {data.has_projects && <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">Projects</span>}
            {data.has_downloads && <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">Downloads</span>}
          </div>
        </div>
      </div>
    </div>
  )
}