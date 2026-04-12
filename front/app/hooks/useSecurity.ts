import { useState } from "react"
import Security from "../lib/security"

const useSecurity = () => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

      const analyze = async (owner: string, repo: string) => {
        setLoading(true)
        setError(null)
        try {
          const result = await Security(owner, repo)
          setData(result)
        } catch (err: any) {
          setError(err.message)
        } finally {
          setLoading(false)
        }
      }

      return { data, loading, error, analyze}
}

export default useSecurity
