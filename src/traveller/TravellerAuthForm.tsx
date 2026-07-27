import { useState, type FormEvent } from 'react'
import { ArrowIcon } from '../components/ArrowIcon'
import { useTravellerAuth } from './useTravellerAuth'
import { requestPasswordReset } from './travellerAuthApi'
import { TravellerGoogleButton } from './TravellerGoogleButton'
import './TravellerAuth.css'

type Mode = 'signin' | 'signup' | 'forgot'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function TravellerAuthForm({ onAuthenticated }: { onAuthenticated: () => void }) {
  const { login, register, googleLogin } = useTravellerAuth()

  const [mode, setMode] = useState<Mode>('signin')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  const isSignup = mode === 'signup'
  const isForgot = mode === 'forgot'

  function switchMode(next: Mode) {
    setMode(next)
    setError('')
    setResetSent(false)
  }

  async function handleGoogle(credential: string) {
    setError('')
    await googleLogin(credential)
    onAuthenticated()
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!EMAIL_PATTERN.test(email.trim())) {
      setError('Please enter a valid email address.')
      return
    }
    if (!isForgot && password.length < (isSignup ? 8 : 1)) {
      setError(isSignup ? 'Your password must be at least 8 characters.' : 'Please enter your password.')
      return
    }

    setError('')
    setIsSubmitting(true)
    try {
      if (isForgot) {
        await requestPasswordReset(email.trim())
        setResetSent(true)
      } else if (isSignup) {
        await register(email.trim(), password, fullName.trim())
        onAuthenticated()
      } else {
        await login(email.trim(), password)
        onAuthenticated()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isForgot && resetSent) {
    return (
      <section className="login-success" aria-live="polite">
        <div className="login-success__mark" aria-hidden="true">
          ✦
        </div>
        <h2>Check your email.</h2>
        <p>
          If an account exists for <strong>{email.trim()}</strong>, we&apos;ve sent a link to reset
          your password. It expires in 30 minutes.
        </p>
        <button type="button" className="traveller-link-button" onClick={() => switchMode('signin')}>
          ← Back to sign in
        </button>
      </section>
    )
  }

  const lead = isForgot
    ? 'Enter your account email and we will send you a link to choose a new password.'
    : isSignup
      ? 'Register to save your journey, private itineraries, and concierge messages.'
      : 'Sign in to view your journey, private itineraries, and messages from your concierge.'

  return (
    <div className="traveller-auth">
      <p className="login-lead traveller-auth__lead">{lead}</p>

      <form className="login-form" onSubmit={handleSubmit} noValidate>
        {error ? (
          <p className="traveller-auth__error" role="alert">
            {error}
          </p>
        ) : null}

        {isSignup ? (
          <div className="login-field">
            <label className="login-field-label" htmlFor="traveller-name">
              Full Name &amp; Title
            </label>
            <input
              id="traveller-name"
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="e.g. Anaya Wickramasinghe"
              autoComplete="name"
            />
          </div>
        ) : null}

        <div className="login-field">
          <label className="login-field-label" htmlFor="traveller-email">
            Email <span className="login-field-required" aria-hidden="true">*</span>
          </label>
          <input
            id="traveller-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="your@email.com"
            autoComplete="email"
            required
          />
        </div>

        {!isForgot ? (
          <div className="login-field">
            <div className="traveller-field-head">
              <label className="login-field-label" htmlFor="traveller-password">
                Password <span className="login-field-required" aria-hidden="true">*</span>
              </label>
              {!isSignup ? (
                <button
                  type="button"
                  className="traveller-inline-link"
                  onClick={() => switchMode('forgot')}
                >
                  Forgot password?
                </button>
              ) : null}
            </div>
            <input
              id="traveller-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              autoComplete={isSignup ? 'new-password' : 'current-password'}
              required
            />
            {isSignup ? <p className="traveller-hint">At least 8 characters.</p> : null}
          </div>
        ) : null}

        <div className="login-form-actions">
          <button type="submit" className="login-button" disabled={isSubmitting}>
            {isSubmitting
              ? 'Please wait…'
              : isForgot
                ? 'Send Reset Link'
                : isSignup
                  ? 'Create Account'
                  : 'Sign In'}
            {!isSubmitting ? <ArrowIcon /> : null}
          </button>
        </div>
      </form>

      {!isForgot ? <TravellerGoogleButton onCredential={handleGoogle} onError={setError} /> : null}

      <p className="login-switch">
        {isForgot ? (
          <>
            Remembered it?{' '}
            <button type="button" className="traveller-inline-link" onClick={() => switchMode('signin')}>
              Back to sign in
            </button>
          </>
        ) : isSignup ? (
          <>
            Already registered?{' '}
            <button type="button" className="traveller-inline-link" onClick={() => switchMode('signin')}>
              Sign in
            </button>
          </>
        ) : (
          <>
            New here?{' '}
            <button type="button" className="traveller-inline-link" onClick={() => switchMode('signup')}>
              Create an account
            </button>
          </>
        )}
      </p>
    </div>
  )
}
