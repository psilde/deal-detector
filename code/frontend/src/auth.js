const API_BASE = "http://localhost:8080"

export async function login(username, password) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  })

  if (!response.ok) {
    throw new Error("Login failed")
  }

  return response.json()
}

export async function register(username, password) {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  })

  if (!response.ok) {
    throw new Error("Registration failed")
  }

  return response.json()
}