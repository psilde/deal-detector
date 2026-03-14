function AuthForm({
  mode,
  username,
  password,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
  onSwitchMode,
  authLoading,
  authError
}) {
  return (
    <div className="auth-panel auth-panel-embedded">
      <form className="auth-form" onSubmit={onSubmit}>
        <input
          className="auth-input"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          required
        />

        <input
          className="auth-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          required
        />

        {authError && <p className="auth-error">{authError}</p>}

        <button className="auth-submit" type="submit" disabled={authLoading}>
          {authLoading
            ? mode === 'login'
              ? 'Logging in...'
              : 'Creating account...'
            : mode === 'login'
              ? 'Log in'
              : 'Create account'}
        </button>
      </form>

      <button className="switch-mode" type="button" onClick={onSwitchMode}>
        {mode === 'login'
          ? 'Need an account? Register'
          : 'Already have an account? Log in'}
      </button>
    </div>
  )
}

export default AuthForm