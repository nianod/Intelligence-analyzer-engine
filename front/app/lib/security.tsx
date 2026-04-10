const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

const Security = async (owner: string, repo: string) => {
    const response = await fetch(`${BASE_URL}/repo/${owner}/${repo}/security`)
    return response.json()
}    
export default Security