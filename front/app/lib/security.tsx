const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

const Security = async (owner: string, repo: string) => {
    const response = await fetch(`${BASE_URL}/repo/${owner}/${repo}/security`)

    if(!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Failed to detect SEcurity")
    }
    return response.json()

    
}    
export default Security
