import './ExperiencesPage.css'
import { useEffect, useState, type MouseEvent, type ReactNode } from 'react'
import { ArrowIcon } from '../ArrowIcon'
import { experienceImages } from './images'
import { ThemeMapExplorer } from './ThemeMapExplorer'
import { useJourney } from '../../journey/useJourney'
import { inferJourneyRegion } from '../../journey/journeyTaxonomy'
import { normalizeRegionLabel } from '../../journey/savedJourneyDisplay'
import { sharedHeritageRecommendations, sharedHeritageWorld } from '../../journey/discoveryWorlds'
import kandyPerahera from '../../assets/images/Kandy Perahera.JPG'
import type { PackageThemeTitle } from './packageMapCatalog'

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


const experienceThemes = [
  {
    title: 'Wildlife & Wilderness',
    description:
      'Leopards, elephants, forests, field researchers, remote ecosystems, and nature without performance.',
    traveller: 'For the Seeker of Silence',
    image: experienceImages.leopardFeature,
    imageAlt: 'Sri Lankan leopard resting on rock at dusk in the wild',
    href: '#leopard-research-circuit',
    encounter: 'The Leopard Research Circuit',
  },
  {
    title: 'Ocean & Discovery',
    description:
      'For travellers drawn to the sea as a living world: whale paths, quiet lagoons, sailing days, and coastlines that reveal themselves with patience.',
    traveller: 'For the Unhurried Wanderer',
    image: experienceImages.mirissaBoats,
    imageAlt: 'Fishing boats at Mirissa harbour at sunset',
    href: '#deep-water-hour',
    encounter: 'The Deep-Water Hour',
  },
  {
    title: 'Heritage & Memory',
    description:
      'Ancient kingdoms, sacred spaces, archaeology, historians, and living traditions carried forward.',
    traveller: 'For the Heritage Guardian',
    image: experienceImages.sigiriyaMain,
    imageAlt: 'Sigiriya rock fortress in Sri Lanka',
    href: '#sigiriya-dawn-ascent',
    encounter: 'The Sigiriya Dawn Ascent',
  },
  {
    title: 'Wellness & Restoration',
    description:
      'Ayurveda, healing traditions, retreats, slow living, and the quiet work of personal renewal.',
    traveller: 'For the Restorer',
    image: experienceImages.ayurveda,
    imageAlt: 'Ayurvedic treatment pavilion set within a tropical rainforest retreat',
    href: '#ancient-grammar-of-healing',
    encounter: 'The Ancient Grammar of Healing',
  },
  {
    title: 'Rail & Landscape',
    description:
      'Hill country train journeys, tea estates, mountain routes, and scenery that changes by the hour.',
    traveller: 'For the Reflective Wanderer',
    image: experienceImages.hillCountry,
    imageAlt: 'Nuwara Eliya hill country landscape',
    href: '#private-tea-estate',
    encounter: 'A Private Tea Estate, Locked Before Dawn',
  },
  {
    title: 'Culture & Human Connection',
    description:
      'Artisans, musicians, dancers, family traditions, private introductions, and everyday Sri Lanka.',
    traveller: 'For the Curious Witness',
    image: kandyPerahera,
    imageAlt: 'Kandy Perahera cultural procession in Sri Lanka',
    href: '#kandyan-dance-rehearsal',
    encounter: 'A Private Kandyan Dance Rehearsal',
  },
  {
    title: sharedHeritageWorld.name,
    description: sharedHeritageWorld.description,
    traveller: sharedHeritageWorld.traveller,
    image: experienceImages.queenVictoriaStatue,
    imageAlt: 'Marble statue of Queen Victoria, a British monument in Sri Lanka',
    href: '#shared-heritage-quietly-read',
    encounter: 'Shared Heritage, Quietly Read',
  },
] as const

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

function toJourneyId(kind: string, value: string) {
  return `${kind}:${value.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
}

const mapThemeTitles = experienceThemes.map((theme) => theme.title)

function readInitialExpectationTheme(): PackageThemeTitle | null {
  if (typeof window === 'undefined') {
    return null
  }

  const world = new URLSearchParams(window.location.search).get('world')
  return (mapThemeTitles as readonly string[]).includes(world ?? '') ? (world as PackageThemeTitle) : null
}

export function ExpectationsPage() {
  const [selectedTheme, setSelectedTheme] = useState<PackageThemeTitle | null>(readInitialExpectationTheme)
  const { confirmRemoveItem, includeItem, isIncluded } = useJourney()

  // Arriving here with a theme already chosen (e.g. "Continue To Expectations"
  // from the homepage) should land straight on the map, not the page top.
  // Wait for full page load (not just the next frame) — otherwise images
  // still loading above the map push it further down after we've scrolled,
  // leaving the map out of view.
  useEffect(() => {
    if (!selectedTheme) return

    const scrollToMap = () => {
      document.getElementById('discover-map')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    if (document.readyState === 'complete') {
      window.requestAnimationFrame(scrollToMap)
      return
    }

    window.addEventListener('load', scrollToMap, { once: true })
    return () => window.removeEventListener('load', scrollToMap)
    // Only ever run this for the theme the page was loaded with.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function includeSharedHeritageRecommendations() {
    sharedHeritageRecommendations.slice(1, 5).forEach(({ destination }) => {
      const parentRegion = inferJourneyRegion({
        kind: 'destination',
        label: destination,
        source: 'Shared Heritage recommendations',
      })
      includeItem({
        id: toJourneyId('destination', destination),
        kind: 'destination',
        label: destination,
        source: 'Expectations',
        parentTheme: sharedHeritageWorld.name,
        parentRegion: parentRegion ? normalizeRegionLabel(parentRegion) : undefined,
      })
    })
  }

  function handleThemeExplore(theme: PackageThemeTitle, event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault()
    setSelectedTheme(theme)

    window.requestAnimationFrame(() => {
      document.getElementById('discover-map')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  function toggleThemeJourney(theme: PackageThemeTitle) {
    const journeyId = toJourneyId('theme', theme)

    if (isIncluded(journeyId)) {
      confirmRemoveItem(journeyId)
      return
    }

    includeItem({
      id: journeyId,
      kind: 'theme',
      label: theme,
      source: 'Expectations',
    })

    if (theme === sharedHeritageWorld.name) {
      includeSharedHeritageRecommendations()
    }
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
              regions, and styles of access that feel true; only here do those preferences begin forming
              My Journey.
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
            <div className="hero-image-frame">
              <img src={experienceImages.sigiriyaMain} alt="Sigiriya rock fortress rising above the Sri Lankan landscape" />
            </div>
            <span className="hero-feature-label">Featured Private Access</span>
            <span className="hero-choice">By Introduction Only</span>
            <div className="hero-access-card" aria-label="Arrival protocol">
              <p>Arrival Protocol</p>
              <strong>Pre-dawn ascent, sealed route, curator in attendance.</strong>
              <span>Sigiriya — Central Province</span>
            </div>
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
                const themeJourneyId = toJourneyId('theme', theme.title)
                const isThemeIncluded = isIncluded(themeJourneyId)

                return (
                  <article
                    key={theme.title}
                    className={`theme-chapter-shell journey-selectable${isThemeIncluded ? ' is-included' : ''}`}
                  >
                    <button
                      className="theme-journey-toggle"
                      type="button"
                      aria-pressed={isThemeIncluded}
                      aria-label={`${isThemeIncluded ? 'Remove' : 'Add'} ${theme.title} ${isThemeIncluded ? 'from' : 'to'} your journey`}
                      onClick={(event) => {
                        event.preventDefault()
                        event.stopPropagation()
                        toggleThemeJourney(theme.title)
                      }}
                    >
                      {isThemeIncluded ? 'Remove from Journey' : 'Add to Journey'}
                    </button>
                    <a
                      className="theme-chapter"
                      href="#discover-map"
                      onClick={(event) => handleThemeExplore(theme.title, event)}
                      aria-label={`${theme.title}: explore matching expectation paths`}
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

      <ThemeMapExplorer themes={experienceThemes} selectedTheme={selectedTheme} onSelectTheme={setSelectedTheme} />
    </main>
  )
}
