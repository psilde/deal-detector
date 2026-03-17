import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Register() {
  const { register } = useAuth()
  const navigate     = useNavigate()

  const [form, setForm]     = useState({ username: '', password: '', confirm: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (form.username.trim().length < 3)  return setError('Username must be at least 3 characters.')
    if (form.password.length < 6)         return setError('Password must be at least 6 characters.')
    if (form.password !== form.confirm)   return setError('Passwords do not match.')

    setLoading(true)
    try {
      await register(form.username.trim(), form.password)
      navigate('/watchlists')
    } catch (e) {
      setError(e.message || 'Registration failed. Username may already be taken.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Create account</h1>
          <p className="auth-subtitle">Set up watchlists and track deals automatically</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="field">
            <label className="field-label" htmlFor="reg-username">Username</label>
            <input
              id="reg-username"
              className="field-input"
              type="text"
              placeholder="3–30 characters"
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              required
              autoFocus
            />
          </div>

          <div className="field">
            <label className="field-label" htmlFor="reg-password">Password</label>
            <input
              id="reg-password"
              className="field-input"
              type="password"
              placeholder="At least 6 characters"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              required
            />
          </div>

          <div className="field">
            <label className="field-label" htmlFor="reg-confirm">Confirm password</label>
            <input
              id="reg-confirm"
              className="field-input"
              type="password"
              placeholder="Repeat your password"
              value={form.confirm}
              onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
              required
            />
          </div>

          {error && <p className="field-error">{error}</p>}

          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{' '}
          <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
