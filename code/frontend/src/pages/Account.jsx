import { useAuth } from '../hooks/useAuth'
import { Link, useNavigate } from 'react-router-dom'

export default function Account() {
  const { username, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="account-page">
      <div className="account-panel">
        <div className="account-panel-header">
          <h1 className="account-title">Account</h1>
        </div>

        <div className="account-card">
          <div className="account-row">
            <span className="account-key">Username</span>
            <span className="account-val">{username || '—'}</span>
          </div>
          <div className="account-row">
            <span className="account-key">Plan</span>
            <span className="account-val">Free</span>
          </div>
          <div className="account-row">
            <span className="account-key">Watchlists</span>
            <span className="account-val">
              <Link to="/watchlists">View watchlists →</Link>
            </span>
          </div>
        </div>

        <button className="btn btn-secondary account-signout" onClick={handleLogout}>
          Sign out
        </button>
      </div>
    </div>
  )
}
