export interface RepoDetailsProps {
  data: {
    id: number
    name: string
    full_name: string
    description: string
    url: string
    private: boolean
    fork: boolean
    stars: number
    watchers: number
    forks: number
    open_issues: number
    size_kb: number
    language: string
    topics: string[]
    created_at: string
    updated_at: string
    pushed_at: string
    owner: {
      username: string
      avatar: string
      profile: string
      type: string
    }
    default_branch: string
    has_issues: boolean
    has_wiki: boolean
    has_projects: boolean
    has_downloads: boolean
    archived: boolean
    disabled: boolean
    license: string | null
  }
}

