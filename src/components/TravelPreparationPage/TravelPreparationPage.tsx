import { useState } from 'react'
import './TravelPreparationPage.css'
import { experienceImages } from '../ExperiencesPage/images'
import { sharedHeritageWorld } from '../../journey/discoveryWorlds'

/*
 * Two images, both deliberately modest. The page is a handbook, not a gallery —
 * a full-bleed photograph here pushes the reading matter below the fold and
 * says nothing the copy does not already say.
 */
const images = {
  hero: experienceImages.poolVilla,
  dawn: experienceImages.sigiriyaSunrise,
  concierge: experienceImages.teaEstate,
} as const

const handbookLinks = [
  { href: '#arranged', label: 'Arranged Details' },
  { href: '#assurance', label: 'Assurances' },
  { href: '#begin', label: 'Begin' },
] as const

const heroProtocols = [
  'Airport welcome arranged',
  'Private transfer prepared',
  'Luggage handling arranged',
  'Concierge briefing completed',
  'Context notes prepared',
] as const

const assurancePoints = [
  { value: 'Guaranteed', label: 'The Royale Isles Standard' },
  { value: 'Licensed', label: 'Private Chauffeurs' },
  { value: 'Awaiting', label: 'Internationally Trained Hosts' },
  { value: 'Arranged', label: 'Private Transfer Route' },
] as const

const preparationInputs = [
  'Passport and arrival details',
  'Flight information and landing time',
  'Dietary preferences and wellbeing notes',
  'Accessibility or medical considerations',
  'Emergency contacts and family-office requests',
  'Special celebrations or privacy requirements',
] as const

const arrangedDetails = [
  {
    label: 'Transfers',
    title: 'Your chauffeur is already waiting.',
    copy:
      'Airport receiving, private transfer timing, route planning, luggage movement, and chauffeur briefing are prepared before you step outside arrivals.',
  },
  {
    label: 'Connectivity',
    title: 'Stay connected is one less consideration.',
    copy:
      'If local connectivity is helpful for your journey, SIM or eSIM support is considered in advance so communication never becomes a task.',
  },
  {
    label: 'Accommodation',
    title: 'Your hosts are ready before you arrive.',
    copy:
      'Room readiness, hotel arrival timing, welcome preferences, dietary notes, and first-evening pacing are confirmed privately with each property.',
  },
  {
    label: 'Currency',
    title: 'Local rupees, ready in your hand.',
    copy:
      'Rather than queuing at exchange counters on arrival, a sensible amount of Sri Lankan rupees is arranged in advance and handed to you on landing — so tips, small purchases, and incidentals are never a concern.',
  },
  {
    label: 'Preferences',
    title: 'The small details travel ahead of you.',
    copy:
      'Celebrations, wellness needs, family rhythms, privacy preferences, and personal rituals are woven into the journey in advance.',
  },
  {
    label: sharedHeritageWorld.name,
    title: 'Context travels with the route.',
    copy:
      'If your journey includes tea country, railways, old hotels, civic streets, or gardens, your host prepares historical context told with care.',
  },
] as const

const assurances = [
  {
    title: 'Entry details are reviewed with care',
    copy:
      'Where documentation or arrival formalities require attention, our advisory team confirms the appropriate path before travel and keeps your receiving host informed.',
  },
  {
    title: 'Practical expenses are anticipated',
    copy:
      'If local currency or incidental arrangements are useful during your journey, they are considered within the wider preparation rather than left to the moment.',
  },
  {
    title: 'Wellbeing is part of the briefing',
    copy:
      'Preferences, sensitivities, medical considerations, rest periods, and first-day pacing are held discreetly so the journey feels considered from the beginning.',
  },
  {
    title: 'The first day is intentionally gentle',
    copy:
      'Arrival is not treated as a transition to endure. It is composed as the opening chapter of your time in Sri Lanka.',
  },
  {
    title: `${sharedHeritageWorld.name} is told with care`,
    copy:
      'Where British and Sri Lankan histories intersect, the framing is told with care: architecture, tea, railways, education, gardens, and engineering are read as living cultural landscapes.',
  },
] as const

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="prep-section-heading">
      <i />
      <h2>{title}</h2>
    </div>
  )
}

export function TravelPreparationPage() {
  const [openAssuranceIndex, setOpenAssuranceIndex] = useState<number | null>(null)

  return (
    <main className="travel-prep-page">
      <section className="prep-hero">
        <div className="prep-container prep-hero-inner">
          <div className="prep-hero-text">
            <div className="prep-kicker">
              <span />
              <p>Your Journey Begins</p>
            </div>
            <h1>On Arrival</h1>
            <i className="prep-gold-rule" />
            <p className="prep-hero-intro">
              From the moment your flight touches Sri Lanka, Royale Isles Lanka has already considered the details that
              allow you to simply arrive, breathe, and begin.
            </p>
            <nav className="prep-chip-nav" aria-label="On Arrival sections">
              {handbookLinks.map((link) => (
                <a key={link.href} href={link.href}>
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* A staggered pair rather than one plate — it fills the band without
              becoming the photograph the page used to open with. */}
          <div className="prep-hero-collage" aria-hidden="true">
            <img src={images.hero} alt="" />
            <img src={images.dawn} alt="" />
          </div>
        </div>
      </section>

      {/* The arrival checklist used to float on top of the photograph, where it
          fought the image for legibility. It reads better as its own strip. */}
      <section className="prep-arrival-care" aria-label="Arrival care highlights">
        <div className="prep-container">
          <p className="prep-arrival-care__label">Arrival Care — everything is in motion before you land</p>
          <ul className="prep-arrival-care__list">
            {heroProtocols.map((protocol) => (
              <li key={protocol}>{protocol}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="prep-assurance" aria-label="Private arrival assurance">
        <div className="prep-container prep-assurance-inner">
          <div className="prep-assurance-copy">
            <span>For Principals, Family Offices &amp; Private Travellers</span>
            <p>
              Arrival should never feel like a list of tasks. It should feel like being expected, recognised, and
              gracefully looked after from the first minute.
            </p>
          </div>
          <dl className="prep-assurance-grid">
            {assurancePoints.map((point) => (
              <div key={point.label}>
                <dt>{point.value}</dt>
                <dd>{point.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="prep-section prep-payments" id="arranged">
        <div className="prep-container">
          <SectionHeading title="Every Detail Thoughtfully Arranged" />
          <div className="prep-payment-grid">
            {arrangedDetails.map((detail) => (
              <article key={detail.label} className="prep-payment-card">
                <p>{detail.label}</p>
                <h3>{detail.title}</h3>
                <small>{detail.copy}</small>
              </article>
            ))}
          </div>
          <aside className="prep-service-note prep-service-note--stacked">
            <span>What We Need From You</span>
            <ul>
              {preparationInputs.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className="prep-section prep-faq" id="assurance">
        <div className="prep-faq-container">
          <div className="prep-faq-intro">
            <SectionHeading title="Quiet Assurances" />
            <p>
              The purpose of preparation is not to give you more to remember. It is to remove the need to keep track of
              what has already been considered.
            </p>
          </div>

          {/*
            The advisory card sits beside the questions it answers, not beside
            the two-line intro — which left most of a column empty.
          */}
          <div className="prep-faq-body">
            <div className="prep-faq-panel">
              <div className="prep-faq-list">
                {assurances.map((item, index) => (
                  <details key={item.title} open={openAssuranceIndex === index}>
                    <summary
                      onClick={(event) => {
                        event.preventDefault()
                        setOpenAssuranceIndex((currentIndex) => (currentIndex === index ? null : index))
                      }}
                    >
                      <div>
                        <small>Prepared Privately</small>
                        <strong>{item.title}</strong>
                      </div>
                    </summary>
                    <p>{item.copy}</p>
                  </details>
                ))}
              </div>
            </div>

            <aside className="prep-faq-concierge">
              <img src={images.concierge} alt="Tea terraces in the Sri Lankan hill country at first light" />
              <span>Private Advisory</span>
              <h3>Questions with nuance belong in conversation.</h3>
              <p>
                For principals, entourages, medical considerations, special access, or discretion-sensitive movement,
                our team briefs you directly before any journey is finalised.
              </p>
            </aside>
          </div>
        </div>
      </section>

      <section className="prep-final-cta" id="begin">
        <div className="prep-final-cta-inner">
          <div className="prep-final-cta-mark" aria-hidden="true">
            ✦
          </div>
          <p>Begin Your Journey</p>
          <h2>
            Arrive in Sri Lanka
            <br />
            <em>already cared for.</em>
          </h2>
          <p>
            By the time you arrive, the practical world has already been softened around you. All that remains is to
            enter the journey.
          </p>
          <div className="prep-cta-actions">
            <a href="/expectations">Begin With Discovery</a>
          </div>
          <small>Personally welcomed. Thoughtfully prepared. Held from the moment you arrive.</small>
        </div>
      </section>
    </main>
  )
}
