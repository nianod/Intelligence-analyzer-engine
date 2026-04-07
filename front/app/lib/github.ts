const BASE_URL = "http://127.0.0.1:8000"

export async function fetchRepoDetails(owner: string, repo: string, token: string) {
  const res = await fetch(`${BASE_URL}/repo/${owner}/${repo}`, {
    headers: {
      token: token,
    },
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || "Failed to fetch repo")
  }

  return res.json()
}