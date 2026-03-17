const BASE = 'http://localhost:8080'

function authHeaders(token) {
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, options)
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(err.message || `Request failed: ${res.status}`)
  }
  if (res.status === 204) return null
  return res.json()
}

export const auth = {
  login: (username, password) =>
    request('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    }),
  register: (username, password) =>
    request('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    }),
}

export const listings = {
  search: ({ keyword = '', page = 0, size = 24, sort = 'lastSeen,desc' } = {}) => {
    const params = new URLSearchParams({ page, size, sort })
    if (keyword.trim()) params.set('keyword', keyword.trim())
    return request(`/listings?${params}`)
  },
}

export const watchlists = {
  list: (token) =>
    request('/watchlists', { headers: authHeaders(token) }),

  create: (keyword, percentageThreshold, token) =>
    request('/watchlists', {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify({ keyword, percentageThreshold }),
    }),

  update: (id, keyword, percentageThreshold, token) =>
    request(`/watchlists/${id}`, {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify({ keyword, percentageThreshold }),
    }),

  delete: (id, token) =>
    request(`/watchlists/${id}`, {
      method: 'DELETE',
      headers: authHeaders(token),
    }),

  matches: (id, { page = 0, size = 20 } = {}, token) =>
    request(`/watchlists/${id}/matches?page=${page}&size=${size}`, {
      headers: authHeaders(token),
    }),
}
