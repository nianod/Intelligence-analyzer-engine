import { useState } from "react"
import Security from "../lib/security"

const UseSecurity = () => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
}