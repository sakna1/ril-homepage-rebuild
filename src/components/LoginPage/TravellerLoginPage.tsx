import { useEffect } from 'react'
import { TravellerAuthForm } from '../../traveller/TravellerAuthForm'
import { useTravellerAuth } from '../../traveller/useTravellerAuth'
import './LoginPage.css'

export function TravellerLoginPage() {
  const { isAuthenticated } = useTravellerAuth()

  // Already signed in — go straight to the dashboard.
  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = '/traveller'
    }
  }, [isAuthenticated])

  return (
    <main className="login-page" data-node-id="login-traveller">
      <section className="login-hero">
        <div className="login-panel">
          <p className="login-eyebrow">Traveller Access</p>
          <h1>
            Welcome back,
            <span> traveller.</span>
          </h1>

          <TravellerAuthForm onAuthenticated={() => (window.location.href = '/traveller')} />

          <p className="login-switch">
            Part of our private office team? <a href="/login/admin">Sign in as admin</a>
          </p>
          <a className="login-back-link" href="/login">
            ← Back to sign-in options
          </a>
        </div>
      </section>
    </main>
  )
}
