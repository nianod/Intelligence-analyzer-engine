const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

const livePerfomance = async() => {
    const response = await fetch(`${BASE_URL}/live/analyze`)

    if(!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Unknown Link")
    }

    return response.json()
}

export default livePerfomance