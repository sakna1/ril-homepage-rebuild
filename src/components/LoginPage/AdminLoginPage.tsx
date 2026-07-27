import { useEffect, useState, type FormEvent } from 'react'
import { ArrowIcon } from '../ArrowIcon'
import { useAdminAuth } from '../../admin/useAdminAuth'
import '../../traveller/TravellerAuth.css'
import './LoginPage.css'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function AdminLoginPage() {
  const { isAuthenticated, login } = useAdminAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isAuthenticated) window.location.href = '/admin'
  }, [isAuthenticated])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!EMAIL_PATTERN.test(email.trim())) {
      setError('Please enter a valid email address.')
      return
    }
    if (!password) {
      setError('Please enter your password.')
      return
    }
    setError('')
    setIsSubmitting(true)
    try {
      await login(email.trim(), password)
      window.location.href = '/admin'
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in.')
      setIsSubmitting(false)
    }
  }

  return (
    <main className="login-page login-page--admin" data-node-id="login-admin">
      <section className="login-hero">
        <div className="login-panel">
          <p className="login-eyebrow">Private Office Access</p>
          <h1>
            Admin
            <span> sign in.</span>
          </h1>
          <p className="login-lead">
            Restricted to the Royale Isles Lanka team. Sign in to manage themes, places, packages,
            and reports.
          </p>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            {error ? (
              <p className="traveller-auth__error" role="alert">
                {error}
              </p>
            ) : null}

            <div className="login-field">
              <label className="login-field-label" htmlFor="admin-email">
                Email <span className="login-field-required" aria-hidden="true">*</span>
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@royaleisles.lk"
                autoComplete="email"
                required
              />
            </div>

            <div className="login-field">
              <label className="login-field-label" htmlFor="admin-password">
                Password <span className="login-field-required" aria-hidden="true">*</span>
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>

            <div className="login-form-actions">
              <button type="submit" className="login-button" disabled={isSubmitting}>
                {isSubmitting ? 'Signing in…' : 'Sign In'}
                {!isSubmitting ? <ArrowIcon /> : null}
              </button>
            </div>
          </form>

          <p className="login-switch">
            Are you a traveller? <a href="/login/traveller">Sign in here</a>
          </p>
          <a className="login-back-link" href="/login">
            ← Back to sign-in options
          </a>
        </div>
      </section>
    </main>
  )
}
