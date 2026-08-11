import './ExperiencesPage.css'
import { type MouseEvent, type ReactNode } from 'react'
import { ArrowIcon } from '../ArrowIcon'
import { experienceImages } from './images'
import { experienceThemes } from './experienceThemes'
import { ThreeDCarousel } from './ThreeDCarousel'

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

export function ExpectationsPage() {

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
                  <strong>Arjun Fernando</strong>
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
                // The map moved to Destinations, so a world opens it there.
                const worldHref = `/destinations?world=${encodeURIComponent(theme.title)}#discover-map`

                return (
                  <article key={theme.title} className="theme-chapter-shell">
                    <a
                      className="theme-chapter"
                      href={worldHref}
                      aria-label={`${theme.title}: see these places on the map`}
                    >
                      <figure>
                        <img src={theme.image} alt={theme.imageAlt} />
                      </figure>
                      <div className="theme-chapter-copy">
                        <p>{theme.traveller}</p>
                        <h3>{theme.title}</h3>
                        <p>{theme.description}</p>
                        <small>{theme.encounter}</small>
                      </div>
                    </a>
                  </article>
                )
              })}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
