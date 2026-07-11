import { ArrowIcon } from '../ArrowIcon'
import './LoginPage.css'

const choices = [
  {
    href: '/login/traveller',
    title: 'Traveller Login',
    description: 'Access your journey, private itineraries, and messages from your concierge.',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm0 2c-4.2 0-8 2.1-8 5.2V21h16v-1.8c0-3.1-3.8-5.2-8-5.2Z" />
      </svg>
    ),
  },
  {
    href: '/login/admin',
    title: 'Admin Login',
    description: 'Restricted to the Royale Isles Lanka team, for managing journeys and enquiries.',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 2 4 5v6c0 5 3.4 9 8 11 4.6-2 8-6 8-11V5l-8-3Zm0 2.2 6 2.25V11c0 3.9-2.6 7.1-6 8.8-3.4-1.7-6-4.9-6-8.8V6.45l6-2.25Z" />
      </svg>
    ),
  },
] as const

export function LoginChooserPage() {
  return (
    <main className="login-page login-page--chooser" data-node-id="login-chooser">
      <section className="login-hero">
        <div className="login-chooser">
          <p className="login-eyebrow">Sign In</p>
          <h1>
            Welcome
            <span> back.</span>
          </h1>
          <p className="login-lead">Choose how you would like to sign in.</p>

          <div className="login-choice-grid">
            {choices.map((choice) => (
              <a className="login-choice-card" href={choice.href} key={choice.href}>
                <span className="login-choice-icon">{choice.icon}</span>
                <h2>{choice.title}</h2>
                <p>{choice.description}</p>
                <span className="login-choice-action">
                  Continue
                  <ArrowIcon />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
