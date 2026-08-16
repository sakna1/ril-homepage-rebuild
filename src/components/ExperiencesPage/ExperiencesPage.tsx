import './ExperiencesPage.css'
import { useState, type MouseEvent, type ReactNode } from 'react'
import { ArrowIcon } from '../ArrowIcon'
import { experienceImages } from './images'
import { experienceThemes } from './experienceThemes'
import { ThreeDCarousel } from './ThreeDCarousel'
import { ThemeInquiryForm } from './ThemeInquiryForm'

const curatorTitles = {
  arjun: 'Founder & Lead Curator',
} as const

const stats = [
  { value: '1:1', label: 'Curator Planning' },
  { value: 'Immediate', label: 'Concierge Attention' },
  { value: 'Private', label: 'Closed-Circle Access' },
  { value: 'Bespoke', label: 'Designed Around You' },
] as const

const heroProofs = ['Private routing', 'Discreet hosts', 'Closed-door access'] as const



function Eyebrow({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <div className={`experiences-eyebrow${dark ? ' experiences-eyebrow--dark' : ''}`}>
      <span />
      <p>{children}</p>
    </div>
  )
}

function TextLink({
  children,
  href = '/contact',
  inverse = false,
  onClick,
}: {
  children: ReactNode
  href?: string
  inverse?: boolean
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void
}) {
  return (
    <a className={`experiences-text-link${inverse ? ' experiences-text-link--inverse' : ''}`} href={href} onClick={onClick}>
      {children}
      <ArrowIcon />
    </a>
  )
}

const themeTitles = experienceThemes.map((theme) => theme.title)

export function ExpectationsPage() {
  // Themes are marks of interest that gather into a single enquiry, rather
  // than seven separate ones.
  const [chosenThemes, setChosenThemes] = useState<readonly string[]>([])
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false)

  const toggleTheme = (title: string) => {
    setChosenThemes((current) =>
      current.includes(title) ? current.filter((entry) => entry !== title) : [...current, title],
    )
  }

  return (
    <main className="experiences-page">
      <section className="experiences-hero experiences-reveal">
        <div className="experiences-container experiences-hero-grid">
          <div className="experiences-hero-copy">
            <Eyebrow>Expectations — Journey Curation Begins</Eyebrow>
            <h1>
              What
              <br />
              <em>Should</em>
              <br />
              Sri Lanka Feel Like?
            </h1>
            <p>
              This is where Royale Isles Lanka asks you to shape the journey. Choose the moods,
              regions, and styles of access that feel true; your enquiry reaches the destination team
              with those preferences already read.
            </p>
            <ul className="experiences-hero-proof-list" aria-label="Expectation standards">
              {heroProofs.map((proof) => (
                <li key={proof}>{proof}</li>
              ))}
            </ul>
            <TextLink href="#experience-themes-title">Begin With Expectations</TextLink>
            <aside className="opening-note">
              <p>Curator's Note</p>
              <blockquote>
                "For our most private guests, luxury is not excess. It is timing, trust, and the
                assurance that no one else is moving through the same moment."
              </blockquote>
              <div>
                <img src={experienceImages.arjun} alt="" />
                <span>
                  <strong>Dr Suren Raghavan</strong>
                  <small>{curatorTitles.arjun}</small>
                </span>
              </div>
            </aside>
          </div>

          <div className="experiences-hero-image">
            <ThreeDCarousel />
            <div className="experiences-stat-strip">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="experience-themes experiences-reveal" aria-labelledby="experience-themes-title">
        <div className="experiences-container">
          <header className="experience-themes-header">
            <div>
              <Eyebrow>Journey Themes</Eyebrow>
              <h2 id="experience-themes-title">
                The Shape
                <br />
                <em>Of The Journey.</em>
              </h2>
            </div>
            <p>
              This is not a catalogue of activities. It is a quiet reading of what should matter:
              wilderness, memory, restoration, movement, coast, culture, or histories still held in the landscape.
            </p>
          </header>

          <div className="experience-themes-salon">
            <aside className="experience-themes-note">
              <span>Curatorial Reading</span>
              <p>
                Choose only what feels instinctive. A preference here is not a commitment; it is a signal your
                concierge can read with discretion.
              </p>
              <small>Every path remains private, edited, and shaped around timing.</small>
            </aside>

            <div className="experience-themes-board">
              {experienceThemes.map((theme) => {
                const isChosen = chosenThemes.includes(theme.title)

                return (
                  <article
                    key={theme.title}
                    className={`theme-chapter-shell${isChosen ? ' is-chosen' : ''}`}
                  >
                    <button
                      type="button"
                      className="theme-chapter"
                      onClick={() => toggleTheme(theme.title)}
                      aria-pressed={isChosen}
                      aria-label={`${theme.title}: ${isChosen ? 'chosen' : 'choose this world'}`}
                    >
                      <figure>
                        <img src={theme.image} alt={theme.imageAlt} />
                      </figure>
                      <span className="theme-chapter-mark" aria-hidden="true">
                        {isChosen ? '✓' : '+'}
                      </span>
                      <div className="theme-chapter-copy">
                        <p>{theme.traveller}</p>
                        <h3>{theme.title}</h3>
                        <p>{theme.description}</p>
                        <small>{theme.encounter}</small>
                      </div>
                    </button>
                  </article>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="theme-enquiry-invite experiences-reveal" aria-labelledby="theme-enquiry-title">
        <div className="experiences-container theme-enquiry-invite__inner">
          <div className="theme-enquiry-invite__copy">
            <Eyebrow>Plan With Us</Eyebrow>
            <h2 id="theme-enquiry-title">
              Tell us which worlds are yours,
              <em>and we will shape the rest.</em>
            </h2>
            <p>
              Choose the worlds above that feel true, add anything you are already imagining, and
              send it across. Your enquiry reaches the destination team directly — no booking, no
              payment, simply the beginning of a conversation.
            </p>
          </div>

          <div className="theme-enquiry-invite__panel">
            <p className="theme-enquiry-invite__label">
              {chosenThemes.length === 0
                ? 'No worlds chosen yet'
                : `${chosenThemes.length} ${chosenThemes.length === 1 ? 'world' : 'worlds'} chosen`}
            </p>

            <ul className="theme-enquiry-invite__chips">
              {chosenThemes.length === 0 ? (
                <li className="theme-enquiry-invite__chip is-empty">
                  Select a world above, or choose them inside the form
                </li>
              ) : (
                chosenThemes.map((title) => (
                  <li key={title} className="theme-enquiry-invite__chip">
                    {title}
                    <button
                      type="button"
                      onClick={() => toggleTheme(title)}
                      aria-label={`Remove ${title}`}
                    >
                      ×
                    </button>
                  </li>
                ))
              )}
            </ul>

            <button
              type="button"
              className="theme-enquiry-invite__cta"
              onClick={() => setIsEnquiryOpen(true)}
            >
              Send an Enquiry
              <ArrowIcon />
            </button>
          </div>
        </div>
      </section>
      {isEnquiryOpen ? (
        <ThemeInquiryForm
          chosenThemes={chosenThemes}
          themes={themeTitles}
          onToggleTheme={toggleTheme}
          onSubmitted={() => setChosenThemes([])}
          onClose={() => setIsEnquiryOpen(false)}
        />
      ) : null}
    </main>
  )
}
