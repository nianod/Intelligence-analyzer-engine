const BASE_URL = "http://127.0.0.1:8000"


export async function fetchRepoDetails(owner: string, repo: string, token: string) {
  console.log("token", JSON.stringify(token))

  const res = await fetch(`${BASE_URL}/repo/${owner}/${repo}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
console.log(res)
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || "Failed to fetch repo")
  }

  return res.json()
}

// import axios from 'axios'
// const BASE_URL= "http://127.0.0.1:8000"

// export const fetchRepoDetails = async (owner: string, repo: string, token: string) => {
//   try{
//     const response = await axios.get(`${BASE_URL}/repo/${owner}/${repo}`)
//     console.log(response.data)
//   } catch(error) {
//     console.log(error)
//   }
// }

