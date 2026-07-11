import { LoginForm } from './LoginForm'
import './LoginPage.css'

export function AdminLoginPage() {
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
            Restricted to the Royale Isles Lanka team. Sign in to manage journeys, enquiries, and traveller accounts.
          </p>

          <LoginForm variant="admin" submitLabel="Sign In" />

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
