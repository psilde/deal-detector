import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { LayoutGrid, Bookmark, User, LogOut, LogIn } from 'lucide-react'

export default function Layout({ children }) {
  const { isLoggedIn, logout } = useAuth()
  const { pathname } = useLocation()

  return (
    <div className="layout">
      <header className="nav">
        <div className="nav-inner">
          <Link to="/" className="nav-brand">
            <span className="nav-brand-mark">
              <span className="nav-brand-letter">D</span>
              <span className="nav-brand-text">Deal Detection Platform</span>
            </span>
          </Link>

          <nav className="nav-links">
            <Link to="/" className={`nav-link${pathname === '/' ? ' active' : ''}`}>
              <LayoutGrid size={14} strokeWidth={1.75} />
              Browse
            </Link>
            {isLoggedIn && (
              <Link to="/watchlists" className={`nav-link${pathname === '/watchlists' ? ' active' : ''}`}>
                <Bookmark size={14} strokeWidth={1.75} />
                Watchlists
              </Link>
            )}
          </nav>

          <div className="nav-actions">
            {isLoggedIn ? (
              <>
                <Link to="/account" className={`nav-link${pathname === '/account' ? ' active' : ''}`}>
                  <User size={14} strokeWidth={1.75} />
                  Account
                </Link>
                <button className="btn btn-ghost btn-sm" onClick={logout}>
                  <LogOut size={14} strokeWidth={1.75} />
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm">
                  <LogIn size={14} strokeWidth={1.75} />
                  Sign in
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">Get started</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="page-content">
        {children}
      </main>
    </div>
  )
}
