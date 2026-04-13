const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

const vibeCode = async(owner: string, repo: string) => {
    const response = await fetch(`${BASE_URL}/repo/${owner}/${repo}/vibescore`)

    if(!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Unknown Link")
    }

    return response.json()
}

export default vibeCode

 