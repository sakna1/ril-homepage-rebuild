import { LoginForm } from './LoginForm'
import './LoginPage.css'

export function TravellerLoginPage() {
  return (
    <main className="login-page" data-node-id="login-traveller">
      <section className="login-hero">
        <div className="login-panel">
          <p className="login-eyebrow">Traveller Access</p>
          <h1>
            Welcome back,
            <span> traveller.</span>
          </h1>
          <p className="login-lead">
            Sign in to view your journey, private itineraries, and messages from your concierge.
          </p>

          <LoginForm variant="traveller" submitLabel="Sign In" />

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
