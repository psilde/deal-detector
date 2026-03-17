import { createContext, useContext, useState } from 'react'
import { auth as authApi } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '')
  const [username, setUsername] = useState(() => localStorage.getItem('username') || '')

  function storeSession(t, u) {
    localStorage.setItem('token', t)
    localStorage.setItem('username', u)
    setToken(t)
    setUsername(u)
  }

  function clearSession() {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    setToken('')
    setUsername('')
  }

  async function login(u, password) {
    const data = await authApi.login(u, password)
    storeSession(data.token, u)
    return data
  }

  async function register(u, password) {
    const data = await authApi.register(u, password)
    storeSession(data.token, u)
    return data
  }

  return (
    <AuthContext.Provider value={{ token, username, isLoggedIn: !!token, login, register, logout: clearSession }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
