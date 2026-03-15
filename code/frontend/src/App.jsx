import { useEffect, useState } from 'react'
import './App.css'
import Listing from './components/Listing'
import Search from './components/Search'
import Page from './components/Page'
import { fetchListings } from './api'
import AuthForm from './components/AuthForm'
import { login, register } from './auth'
import Watchlists from './components/Watchlists'
import Home from './components/Home'

function App() {
  const [keyword, setKeyword] = useState('')
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [debouncedKeyword, setDebouncedKeyword] = useState(keyword)

  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState('')
  const [authMode, setAuthMode] = useState('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [token, setToken] = useState(localStorage.getItem('token') || '')

  const [view, setView] = useState('home')

  async function handleLogin(e) {
    e.preventDefault()

    try {
      setAuthLoading(true)
      setAuthError('')

      const data = await login(username, password)

      localStorage.setItem('token', data.token)
      setToken(data.token)
      setPassword('')
      setAuthError('')
      setView('browse')
    } catch (error) {
      setAuthError(error.message)
    } finally {
      setAuthLoading(false)
    }
  }

  async function handleRegister(e) {
    e.preventDefault()

    try {
      setAuthLoading(true)
      setAuthError('')

      await register(username, password)

      setAuthMode('login')
      setPassword('')
      setAuthError('')
      setView('auth')
    } catch (error) {
      setAuthError(error.message)
    } finally {
      setAuthLoading(false)
    }
  }

  function handleLogout() {
    localStorage.removeItem('token')
    setToken('')
    setPassword('')
    setView('home')
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword)
      setPage(0)
    }, 300)

    return () => clearTimeout(timer)
  }, [keyword])

  useEffect(() => {
    if (!token || view !== 'browse') return

    async function loadListings() {
      try {
        setLoading(true)
        setError('')

        const data = await fetchListings(page, debouncedKeyword)

        setListings(data.content)
        setTotalPages(data.totalPages)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    loadListings()
  }, [page, debouncedKeyword, token, view])

  return (
    <div className="app-shell">
      <header className="site-header">
        <button className="brand-button" onClick={() => setView('home')}>
          <span className="title-accent">Deal</span> Detection
        </button>

        <nav className="nav-bar">
          <button
            className={`nav-button ${view === 'home' ? 'active' : ''}`}
            onClick={() => setView('home')}
          >
            Home
          </button>

          {token && (
            <>
              <button
                className={`nav-button ${view === 'browse' ? 'active' : ''}`}
                onClick={() => setView('browse')}
              >
                Browse
              </button>

              <button
                className={`nav-button ${view === 'watchlists' ? 'active' : ''}`}
                onClick={() => setView('watchlists')}
              >
                Watchlists
              </button>
            </>
          )}
        </nav>

        <div className="header-actions">
          {!token ? (
            <>
              <button
                className="button-secondary header-auth-button"
                onClick={() => {
                  setAuthMode('login')
                  setAuthError('')
                  setView('auth')
                }}
              >
                Log in
              </button>

              <button
                className="button-primary header-auth-button"
                onClick={() => {
                  setAuthMode('register')
                  setAuthError('')
                  setView('auth')
                }}
              >
                Register
              </button>
            </>
          ) : (
            <button className="logout-button" onClick={handleLogout}>
              Log out
            </button>
          )}
        </div>
      </header>

      <main className="app-container">
        {view === 'home' && (
          <Home
            token={token}
            onBrowseClick={() => setView(token ? 'browse' : 'auth')}
            onWatchlistsClick={() => setView(token ? 'watchlists' : 'auth')}
            onSelectLogin={() => {
              setAuthMode('login')
              setView('auth')
            }}
            onSelectRegister={() => {
              setAuthMode('register')
              setView('auth')
            }}
          />
        )}

        {!token && view === 'auth' && (
          <section className="auth-page page-enter">
            <div className="auth-page-grid">
              <div className="auth-showcase panel">
                <div className="auth-showcase-badge">Deal tracking platform</div>

                <h1>
                  Stop endlessly browsing.
                  <span className="auth-showcase-accent"> Start tracking smarter.</span>
                </h1>

                <p className="auth-showcase-text">
                  Build watchlists, search faster, and surface strong deals through one clean workflow.
                </p>

                <div className="auth-showcase-points">
                  <div className="auth-showcase-point">
                    <strong>Search faster</strong>
                    <span>Browse listings with less noise and better focus.</span>
                  </div>

                  <div className="auth-showcase-point">
                    <strong>Create watchlists</strong>
                    <span>Track the keywords and discount targets you care about.</span>
                  </div>

                  <div className="auth-showcase-point">
                    <strong>Catch better value</strong>
                    <span>Bring matching deals into one place instead of checking manually.</span>
                  </div>
                </div>
              </div>

              <div className="auth-page-card panel">
                <div className="auth-page-tabs">
                  <button
                    className={`auth-page-tab ${authMode === 'login' ? 'active' : ''}`}
                    onClick={() => {
                      setAuthMode('login')
                      setAuthError('')
                    }}
                  >
                    Log in
                  </button>

                  <button
                    className={`auth-page-tab ${authMode === 'register' ? 'active' : ''}`}
                    onClick={() => {
                      setAuthMode('register')
                      setAuthError('')
                    }}
                  >
                    Register
                  </button>
                </div>

                <div className="auth-page-card-inner">
                  <p className="auth-page-eyebrow">
                    {authMode === 'login' ? 'Welcome back' : 'Create your account'}
                  </p>

                  <h2 className="auth-page-title">
                    {authMode === 'login' ? 'Sign in to continue' : 'Start tracking deals today'}
                  </h2>

                  <p className="auth-page-subtitle">
                    {authMode === 'login'
                      ? 'Access your watchlists, browsing history, and tracked deals.'
                      : 'Set up your account and start building a smarter deal-finding workflow.'}
                  </p>

                  <AuthForm
                    mode={authMode}
                    username={username}
                    password={password}
                    onUsernameChange={setUsername}
                    onPasswordChange={setPassword}
                    onSubmit={authMode === 'login' ? handleLogin : handleRegister}
                    onSwitchMode={() => {
                      setAuthMode(authMode === 'login' ? 'register' : 'login')
                      setAuthError('')
                    }}
                    authLoading={authLoading}
                    authError={authError}
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {token && view === 'browse' && (
          <>
            <div className="control-panel page-enter">
              <Search
                keyword={keyword}
                onKeywordChange={(newKeyword) => {
                  setKeyword(newKeyword)
                  setPage(0)
                }}
              />

              <p key={debouncedKeyword} className="search-status">
                {debouncedKeyword ? `Searching: "${debouncedKeyword}"` : 'All listings'}
              </p>

              {error && <p className="watchlist-error">Error: {error}</p>}
            </div>

            {loading ? (
              <div className="listings-grid">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="listing-card">
                    <div className="skeleton skeleton-image" />
                    <div className="listing-body">
                      <div className="skeleton skeleton-line skeleton-title" />
                      <div className="skeleton skeleton-line skeleton-short" />
                      <div className="skeleton skeleton-line skeleton-price" />
                      <div className="skeleton skeleton-line skeleton-short" />
                      <div className="skeleton skeleton-btn" />
                    </div>
                  </div>
                ))}
              </div>
            ) : !error && (
              <div className="listings-grid page-enter">
                {listings.map((listing) => (
                  <Listing
                    key={listing.id}
                    title={listing.title}
                    price={listing.price}
                    location={listing.location}
                    url={listing.url}
                    createdAt={listing.createdAt}
                    imageUrl={listing.imageUrl}
                  />
                ))}
              </div>
            )}

            <Page
              page={page}
              totalPages={totalPages}
              onPrevious={() => setPage(page - 1)}
              onNext={() => setPage(page + 1)}
            />
          </>
        )}

        {token && view === 'watchlists' && <Watchlists token={token} />}
      </main>
    </div>
  )
}

export default App