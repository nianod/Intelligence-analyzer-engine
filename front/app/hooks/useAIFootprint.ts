import { useState } from "react"
import fetchAIFootprint from "../lib/aifootprint"

export function useAIFootprint() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const analyze = async (owner: string, repo: string, ) => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchAIFootprint(owner, repo)
      setData(result)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, analyze }
}
