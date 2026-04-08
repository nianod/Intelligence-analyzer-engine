"use client"

import type { RepoDetailsProps } from "../types/RepoDetails"
import { 
  BarChart3, 
  Star, 
  Eye, 
  GitFork, 
  AlertTriangle, 
  Package, 
  User, 
  Tags, 
  Info, 
  FileText, 
  BookOpen, 
  LayoutGrid, 
  Download 
} from "lucide-react"

export function RepoDetails({ data }: RepoDetailsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatSize = (kb: number) => {
    if (kb < 1024) return `${kb} KB`
    return `${(kb / 1024).toFixed(2)} MB`
  }

  return (
    <div className="space-y-6 mt-8">
      {/* Header Section */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-xl font-bold text-gray-900">{data.name}</h2>
            {data.private && (
              <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded-full">Private</span>
            )}
            {data.fork && (
              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">Fork</span>
            )}
            {data.archived && (
              <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">Archived</span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">by {data.full_name}</p>
        </div>
        <div className="p-6">
          <p className="text-gray-700 mb-4">{data.description || "No description provided"}</p>
          <div className="flex items-center gap-4">
            <a 
              href={data.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-green-600 hover:text-green-700 hover:underline cursor-pointer"
            >
              View on GitHub →
            </a>
            {data.language && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm text-gray-600">{data.language}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-gray-700" />
          <h3 className="font-semibold text-gray-900">Repository Stats</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <Star className="w-6 h-6 mx-auto mb-1 text-yellow-500" />
              <p className="text-2xl font-bold text-gray-900">{data.stars}</p>
              <p className="text-xs text-gray-500 mt-1">Stars</p>
            </div>
            <div className="text-center">
              <Eye className="w-6 h-6 mx-auto mb-1 text-blue-500" />
              <p className="text-2xl font-bold text-gray-900">{data.watchers}</p>
              <p className="text-xs text-gray-500 mt-1">Watchers</p>
            </div>
            <div className="text-center">
              <GitFork className="w-6 h-6 mx-auto mb-1 text-purple-500" />
              <p className="text-2xl font-bold text-gray-900">{data.forks}</p>
              <p className="text-xs text-gray-500 mt-1">Forks</p>
            </div>
            <div className="text-center">
              <AlertTriangle className="w-6 h-6 mx-auto mb-1 text-red-500" />
              <p className={`text-2xl font-bold ${data.open_issues > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {data.open_issues}
              </p>
              <p className="text-xs text-gray-500 mt-1">Open Issues</p>
            </div>
            <div className="text-center">
              <Package className="w-6 h-6 mx-auto mb-1 text-green-500" />
              <p className="text-2xl font-bold text-gray-900">{formatSize(data.size_kb)}</p>
              <p className="text-xs text-gray-500 mt-1">Size</p>
            </div>
          </div>
        </div>
      </div>

      {/* Owner Information */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex items-center gap-2">
          <User className="w-5 h-5 text-gray-700" />
          <h3 className="font-semibold text-gray-900">Owner Information</h3>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-4">
            <img 
              src={data.owner.avatar} 
              alt={data.owner.username}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <a 
                href={data.owner.profile}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-semibold text-gray-900 hover:text-green-600 hover:underline cursor-pointer"
              >
                {data.owner.username}
              </a>
              <p className="text-sm text-gray-500 mt-1">Account Type: {data.owner.type}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Topics */}
      {data.topics.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex items-center gap-2">
            <Tags className="w-5 h-5 text-gray-700" />
            <h3 className="font-semibold text-gray-900">Topics</h3>
          </div>
          <div className="p-6">
            <div className="flex flex-wrap gap-2">
              {data.topics.map((topic, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex items-center gap-2">
          <Info className="w-5 h-5 text-gray-700" />
          <h3 className="font-semibold text-gray-900">Repository Metadata</h3>
        </div>
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500">Created</p>
              <p className="font-medium text-gray-900">{formatDate(data.created_at)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Updated</p>
              <p className="font-medium text-gray-900">{formatDate(data.updated_at)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Pushed</p>
              <p className="font-medium text-gray-900">{formatDate(data.pushed_at)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Default Branch</p>
              <p className="font-medium text-gray-900">{data.default_branch}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">License</p>
              <p className="font-medium text-gray-900">{data.license || "Not specified"}</p>
            </div>
          </div>
           
        </div>
      </div>
    </div>
  )
}



 