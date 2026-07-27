import { useState, type FormEvent } from 'react'
import { ArrowIcon } from '../ArrowIcon'
import { useTravellerAuth } from '../../traveller/useTravellerAuth'
import '../../traveller/TravellerAuth.css'
import './LoginPage.css'

function getTokenFromUrl(): string {
  if (typeof window === 'undefined') return ''
  return new URLSearchParams(window.location.search).get('token') ?? ''
}

export function ResetPasswordPage() {
  const { completeReset } = useTravellerAuth()
  const [token] = useState(getTokenFromUrl)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (password.length < 8) {
      setError('Your password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('The two passwords do not match.')
      return
    }
    setError('')
    setIsSubmitting(true)
    try {
      await completeReset(token, password)
      // Reset also signs the traveller in — go to the dashboard.
      window.location.href = '/traveller'
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not reset your password.')
      setIsSubmitting(false)
    }
  }

  return (
    <main className="login-page" data-node-id="reset-password">
      <section className="login-hero">
        <div className="login-panel">
          <p className="login-eyebrow">Traveller Access</p>
          <h1>
            Choose a
            <span> new password.</span>
          </h1>

          {!token ? (
            <>
              <p className="login-lead">
                This reset link is missing its token. Please use the link from your email, or request
                a new one.
              </p>
              <a className="login-back-link" href="/login/traveller">
                ← Back to sign in
              </a>
            </>
          ) : (
            <div className="traveller-auth">
              <p className="login-lead traveller-auth__lead">
                Enter a new password for your account. You&apos;ll be signed in straight away.
              </p>

              <form className="login-form" onSubmit={handleSubmit} noValidate>
                {error ? (
                  <p className="traveller-auth__error" role="alert">
                    {error}
                  </p>
                ) : null}

                <div className="login-field">
                  <label className="login-field-label" htmlFor="reset-password">
                    New Password <span className="login-field-required" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="reset-password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    required
                  />
                  <p className="traveller-hint">At least 8 characters.</p>
                </div>

                <div className="login-field">
                  <label className="login-field-label" htmlFor="reset-confirm">
                    Confirm Password <span className="login-field-required" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="reset-confirm"
                    type="password"
                    value={confirm}
                    onChange={(event) => setConfirm(event.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    required
                  />
                </div>

                <div className="login-form-actions">
                  <button type="submit" className="login-button" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving…' : 'Set New Password'}
                    {!isSubmitting ? <ArrowIcon /> : null}
                  </button>
                </div>
              </form>

              <a className="login-back-link" href="/login/traveller">
                ← Back to sign in
              </a>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
