const API = "http://localhost:8080"

export async function getWatchlists(token) {
  const res = await fetch(`${API}/watchlists`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  if (!res.ok) throw new Error("Failed to fetch watchlists")
  return res.json()
}

export async function createWatchlist(keyword, percentage, token) {
  const res = await fetch(`${API}/watchlists`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      keyword,
      percentage
    })
  })

  if (!res.ok) throw new Error("Failed to create watchlist")
  return res.json()
}

export async function getMatches(id, token) {
  const res = await fetch(`${API}/watchlists/${id}/matches`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  if (!res.ok) throw new Error("Failed to fetch matches")
  return res.json()
}