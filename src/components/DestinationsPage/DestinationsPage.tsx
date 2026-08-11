import { useEffect, useMemo, useState } from 'react'
import './DestinationsPage.css'
import { journeyRegions, type RegionDestination } from '../../data/journeyRegions'
import { experienceThemes } from '../ExperiencesPage/experienceThemes'
import { ThemeMapExplorer } from '../ExperiencesPage/ThemeMapExplorer'
import type { PackageThemeTitle } from '../ExperiencesPage/packageMapCatalog'
import { mediaForDestination } from './destinationMedia'

type DestinationCard = {
  destination: RegionDestination
  regionId: string
  regionTitle: string
}

/** Every destination on the island, flattened out of its region. */
const allDestinations: readonly DestinationCard[] = journeyRegions.flatMap((region) =>
  region.destinations.map((destination) => ({
    destination,
    regionId: region.id,
    regionTitle: region.title,
  })),
)

const regionFilters = [
  { id: 'all', title: 'All of Sri Lanka' },
  ...journeyRegions.map((region) => ({ id: region.id, title: region.title })),
] as const

const mapThemeTitles = experienceThemes.map((theme) => theme.title)

/** Arriving from Expectations with ?world=… opens the map on that world. */
function readInitialWorld(): PackageThemeTitle | null {
  if (typeof window === 'undefined') return null
  const world = new URLSearchParams(window.location.search).get('world')
  return (mapThemeTitles as readonly string[]).includes(world ?? '')
    ? (world as PackageThemeTitle)
    : null
}

function DestinationMedia({
  destination,
  playing,
}: {
  destination: RegionDestination
  playing: boolean
}) {
  const { video } = mediaForDestination(destination.id)

  if (video) {
    return (
      <video
        className="destination-card__media"
        src={video}
        poster={destination.heroImage || undefined}
        muted
        loop
        playsInline
        autoPlay={playing}
        preload="metadata"
      />
    )
  }

  return (
    <img
      className="destination-card__media"
      src={destination.heroImage}
      alt={`${destination.title}, Sri Lanka`}
      loading="lazy"
    />
  )
}

function DestinationLightbox({
  card,
  onClose,
}: {
  card: DestinationCard
  onClose: () => void
}) {
  const { destination, regionTitle } = card
  const { video, gallery } = mediaForDestination(destination.id)

  // Escape closes, and the page behind must not scroll while this is open.
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKey)
    }
  }, [onClose])

  const stills = [destination.heroImage, ...(gallery ?? [])].filter(Boolean)

  return (
    <div
      className="destination-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={destination.title}
      onClick={onClose}
    >
      <div className="destination-lightbox__panel" onClick={(event) => event.stopPropagation()}>
        <button
          type="button"
          className="destination-lightbox__close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        <figure className="destination-lightbox__stage">
          {video ? (
            <video src={video} poster={destination.heroImage || undefined} controls autoPlay muted loop playsInline />
          ) : (
            <img src={destination.heroImage} alt={`${destination.title}, Sri Lanka`} />
          )}
        </figure>

        <div className="destination-lightbox__copy">
          <p className="destination-lightbox__region">{regionTitle}</p>
          <h3>{destination.title}</h3>
          <p className="destination-lightbox__description">{destination.description}</p>

          <dl className="destination-lightbox__facts">
            <div>
              <dt>Best time to visit</dt>
              <dd>{destination.bestTimeToVisit}</dd>
            </div>
            {destination.travelNotes ? (
              <div>
                <dt>Getting there</dt>
                <dd>{destination.travelNotes}</dd>
              </div>
            ) : null}
          </dl>

          {destination.nearbyExperiences.length > 0 ? (
            <div className="destination-lightbox__nearby">
              <h4>What is close by</h4>
              <ul>
                {destination.nearbyExperiences.map((experience) => (
                  <li key={experience}>{experience}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        {stills.length > 1 ? (
          <div className="destination-lightbox__strip">
            {stills.map((shot, index) => (
              <figure key={`${destination.id}-${index}`}>
                <img src={shot} alt={`${destination.title}, Sri Lanka`} loading="lazy" />
              </figure>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export function DestinationsPage() {
  const [activeRegion, setActiveRegion] = useState<string>('all')
  const [openCardId, setOpenCardId] = useState<string | null>(null)
  const [selectedTheme, setSelectedTheme] = useState<PackageThemeTitle | null>(readInitialWorld)

  const cards = useMemo(
    () =>
      activeRegion === 'all'
        ? allDestinations
        : allDestinations.filter((card) => card.regionId === activeRegion),
    [activeRegion],
  )

  const openCard = openCardId
    ? (allDestinations.find((card) => card.destination.id === openCardId) ?? null)
    : null

  // Landing with ?world=… (from Expectations) should arrive at the map.
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
    // Only for the world the page was opened with.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <main className="destinations-page">
      <section className="destinations-hero">
        <p className="destinations-eyebrow">Sri Lanka, Place by Place</p>
        <h1>
          Destinations
          <em>worth the journey.</em>
        </h1>
        <p className="destinations-hero__lede">
          Coast, hill country, ancient capitals and the wild south — photographed as they are, not as
          a brochure imagines them. Open any place to see it closer.
        </p>
      </section>

      <section className="destinations-gallery" aria-label="Destinations in Sri Lanka">
        <nav className="destinations-filters" aria-label="Filter destinations by region">
          {regionFilters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              className={`destinations-filter${activeRegion === filter.id ? ' is-active' : ''}`}
              aria-pressed={activeRegion === filter.id}
              onClick={() => setActiveRegion(filter.id)}
            >
              {filter.title}
            </button>
          ))}
        </nav>

        <div className="destinations-grid">
          {cards.map((card) => (
            <article key={card.destination.id} className="destination-card">
              <button
                type="button"
                className="destination-card__inner"
                onClick={() => setOpenCardId(card.destination.id)}
                aria-label={`View ${card.destination.title}`}
              >
                <span className="destination-card__figure">
                  <DestinationMedia destination={card.destination} playing={false} />
                  <span className="destination-card__scrim" aria-hidden="true" />
                </span>
                <span className="destination-card__body">
                  <span className="destination-card__region">{card.regionTitle}</span>
                  <span className="destination-card__title">{card.destination.title}</span>
                  <span className="destination-card__description">
                    {card.destination.description}
                  </span>
                </span>
              </button>
            </article>
          ))}
        </div>

        {cards.length === 0 ? (
          <p className="destinations-empty">No destinations listed for this region yet.</p>
        ) : null}
      </section>

      <ThemeMapExplorer
        themes={experienceThemes}
        selectedTheme={selectedTheme}
        onSelectTheme={setSelectedTheme}
      />

      {openCard ? (
        <DestinationLightbox card={openCard} onClose={() => setOpenCardId(null)} />
      ) : null}
    </main>
  )
}
