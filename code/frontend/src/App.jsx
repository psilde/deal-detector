import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import Layout from './components/Layout'
import Browse from './pages/Browse'
import ListingDetail from './pages/ListingDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import Watchlists from './pages/Watchlists'
import Account from './pages/Account'

function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth()
  return isLoggedIn ? children : <Navigate to="/login" replace />
}

function AppRoutes() {
  const { pathname } = useLocation()

  return (
    <Layout>
      <div key={pathname} className="page-transition">
        <Routes>
          <Route path="/"              element={<Browse />} />
          <Route path="/listings/:id"  element={<ListingDetail />} />
          <Route path="/login"         element={<Login />} />
          <Route path="/register"      element={<Register />} />
          <Route path="/watchlists"    element={<ProtectedRoute><Watchlists /></ProtectedRoute>} />
          <Route path="/account"       element={<ProtectedRoute><Account /></ProtectedRoute>} />
          <Route path="*"              element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Layout>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
