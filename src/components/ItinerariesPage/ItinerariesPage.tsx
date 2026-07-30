import { useEffect, useRef, useState } from 'react'
import './ItinerariesPage.css'
import { experienceImages } from '../ExperiencesPage/images'
import { toJourneyId } from '../../journey/journeyItemHelpers'
import { useJourney } from '../../journey/useJourney'
import { fetchPublicPackages } from '../../services/publicContent'

type Itinerary = {
  numeral: string
  name: string
  duration: string
  /** Indicative "from" price per person, in USD. Null hides the price. */
  priceFrom: number | null
  character: string
  route: readonly string[]
  inclusions: readonly string[]
  pace: string
  bestFor: string
  reach: string
  image: string
  imageAlt: string
}

// The three signature structures shown on this page, in order.
const KEEP_NAMES = ['Discovery', 'Deep Dive', 'Dynasty'] as const

// Curated fallback, used until (or if) the backend content API is unavailable.
const fallbackItineraries: readonly Itinerary[] = [
  {
    numeral: 'I',
    name: 'Discovery',
    duration: '10 Days',
    priceFrom: 4850,
    character:
      'Brisk and spirited. The island’s defining sights gathered without a wasted morning — for travellers whose diary is short but whose appetite is not.',
    route: [
      'Colombo',
      'Sigiriya (Cultural Triangle)',
      'Kandy',
      'Nuwara Eliya',
      'Yala National Park',
      'Galle',
      'Airport',
    ],
    inclusions: [
      'The Sigiriya rock ascent',
      'The Temple of the Tooth (can arrange private access with special viewings)',
      'A scenic hill-country rail journey',
      'A private wildlife safari',
      'A walking tour of historic Galle Fort',
    ],
    pace: 'Brisk',
    bestFor: 'First visits and shorter diaries',
    reach: 'West, Centre & South',
    image: experienceImages.galleFort,
    imageAlt: 'The ramparts of historic Galle Fort above the southern coast',
  },
  {
    numeral: 'II',
    name: 'Deep Dive',
    duration: '16 Days',
    priceFrom: 7900,
    character:
      'Immersive and unhurried. The celebrated landmarks are all here, but so is the time to sit with them — cultural depth balanced against long, unclaimed afternoons.',
    route: [
      'Negombo',
      'Anuradhapura',
      'Trincomalee (East Coast)',
      'Sigiriya',
      'Kandy',
      'Ella',
      'Udawalawe National Park',
      'Mirissa Beach',
      'Galle',
      'Airport',
    ],
    inclusions: [
      'The UNESCO ancient cities',
      'Whale watching or quiet beach days at Trincomalee',
      'Mountain walking above Ella',
      'A visit to the elephant transit home',
      'Surfing lessons on the southern coast',
    ],
    pace: 'Measured',
    bestFor: 'Travellers who prefer depth to distance',
    reach: 'North-Central, East, Hills & South',
    image: experienceImages.mirissaBoats,
    imageAlt: 'Fishing boats at Mirissa harbour at sunset',
  },
  {
    numeral: 'III',
    name: 'Dynasty',
    duration: '21 Days',
    priceFrom: 12400,
    character:
      'The grand overland passage. The entire island read from north to south, at the pace such a journey deserves — including the quarters most itineraries never reach.',
    route: [
      'Colombo',
      'Wilpattu National Park',
      'Jaffna (The Far North)',
      'Trincomalee',
      'Cultural Triangle',
      'Kandy',
      'Knuckles Range',
      'Nuwara Eliya & Ella',
      'Yala',
      'Tangalle & Hiriketiya',
      'Galle',
      'Airport',
    ],
    inclusions: [
      'Remote northern culture and island-hopping around Jaffna',
      'Leopard safaris in Wilpattu',
      'Trekking in the Knuckles mountain range',
      'Slow, unhurried days along the untouched southern bays',
    ],
    pace: 'Unhurried',
    bestFor: 'Returning travellers and grand tours',
    reach: 'The entire island, north to south',
    image: experienceImages.perahera,
    imageAlt: 'Ceremonial procession with traditional performers in Sri Lanka',
  },
] as const

// Map a DB package to the display shape, borrowing an image from the curated
// list by name (the DB has no bundled image asset) with a sensible default.
function imageForName(name: string): { image: string; imageAlt: string } {
  const match = fallbackItineraries.find((entry) => entry.name === name)
  if (match) return { image: match.image, imageAlt: match.imageAlt }
  return { image: experienceImages.sigiriyaMain, imageAlt: `${name} in Sri Lanka` }
}

// Nights are one fewer than the day count ("10 Days" -> "9 Nights").
function nightsLabel(duration: string): string {
  const days = parseInt(duration, 10)
  if (Number.isNaN(days)) return duration
  return `${Math.max(0, days - 1)} Nights`
}

// A short one-line description for the gallery card.
function shortDescription(character: string): string {
  const firstSentence = character.split(/(?<=[.!?])\s/)[0] ?? character
  return firstSentence.length > 130 ? `${firstSentence.slice(0, 127).trimEnd()}…` : firstSentence
}

export function ItinerariesPage() {
  const { confirmRemoveItem, includeItem, isIncluded } = useJourney()

  // Content comes from the admin-managed DB; fall back to the curated list.
  const [items, setItems] = useState<readonly Itinerary[]>(fallbackItineraries)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const trackRef = useRef<HTMLDivElement>(null)
  const detailRef = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState(0)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetchPublicPackages()
      .then((packages) => {
        if (cancelled || packages.length === 0) return
        setItems(
          packages.map((pkg) => ({
            numeral: pkg.numeral,
            name: pkg.name,
            duration: pkg.duration,
            priceFrom: pkg.priceFrom,
            character: pkg.character,
            route: pkg.route,
            inclusions: pkg.inclusions,
            pace: pkg.pace,
            bestFor: pkg.bestFor,
            reach: pkg.reach,
            ...imageForName(pkg.name),
          })),
        )
      })
      .catch(() => {
        /* keep the curated fallback */
      })
    return () => {
      cancelled = true
    }
  }, [])

  // Only the three signature structures. If the DB has renamed them, fall back
  // to the first three so the page is never empty.
  const named = items.filter((entry) => (KEEP_NAMES as readonly string[]).includes(entry.name))
  const visible = named.length > 0 ? named : items.slice(0, 3)

  const activeIndex = visible.length > 0 ? Math.min(selectedIndex, visible.length - 1) : 0
  const selected = visible[activeIndex] ?? null

  const updateNav = () => {
    const el = trackRef.current
    if (!el) return
    const { scrollLeft, scrollWidth, clientWidth } = el
    setCanPrev(scrollLeft > 4)
    setCanNext(scrollLeft < scrollWidth - clientWidth - 4)
    const cards = Array.from(el.querySelectorAll<HTMLElement>('.itin-card4'))
    let idx = 0
    let min = Infinity
    cards.forEach((card, i) => {
      const distance = Math.abs(card.offsetLeft - el.scrollLeft - el.offsetLeft)
      if (distance < min) {
        min = distance
        idx = i
      }
    })
    setCurrent(idx)
  }

  useEffect(() => {
    updateNav()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible.length])

  const scrollToIndex = (index: number) => {
    const el = trackRef.current
    if (!el) return
    const card = el.querySelectorAll<HTMLElement>('.itin-card4')[index]
    if (!card) return
    const delta = card.getBoundingClientRect().left - el.getBoundingClientRect().left
    el.scrollBy({ left: delta, behavior: 'smooth' })
  }

  const selectCard = (index: number) => {
    setSelectedIndex(index)
    requestAnimationFrame(() => {
      detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  function togglePackage(itinerary: Itinerary) {
    const journeyId = toJourneyId('package', itinerary.name)

    if (isIncluded(journeyId)) {
      confirmRemoveItem(journeyId)
      return
    }

    includeItem({
      id: journeyId,
      kind: 'package',
      label: `${itinerary.name} — ${itinerary.duration}`,
      detail: itinerary.character,
      source: 'Itineraries',
      duration: itinerary.duration,
      pricePerPerson: itinerary.priceFrom ?? undefined,
    })
  }

  return (
    <main className="itineraries-page">
      <section className="itin-hero">
        <div className="itin-hero__backdrop" aria-hidden="true">
          <span className="itin-hero__orb itin-hero__orb--one" />
          <span className="itin-hero__orb itin-hero__orb--two" />
          <span className="itin-hero__grain" />
        </div>

        <div className="itin-hero__copy">
          <span className="itin-eyebrow itin-eyebrow--light">Signature Itineraries</span>
          <h1>
            Three Ways to
            <em>Travel the Island.</em>
          </h1>
          <p>
            Each is a considered structure rather than a fixed schedule: a proven route, a sensible
            pace, and the room to be rewritten entirely around you. Read them as a starting point.
          </p>
          <a className="itin-hero__cta" href="#itin-collection">
            View the Collection
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>

      <section className="itin-collection" id="itin-collection" aria-label="Signature itineraries">
        <div className="itin-gallery4">
          <header className="itin-gallery4__head">
            <div className="itin-gallery4__intro">
              <span className="itin-eyebrow">The Collection</span>
              <h2>Chosen rhythms, not fixed schedules.</h2>
              <p>
                Ten days, sixteen, or twenty-one. The difference is not how much is seen, but how
                much time each place is given.
              </p>
            </div>
            <div className="itin-gallery4__nav">
              <button
                type="button"
                aria-label="Previous itinerary"
                onClick={() => scrollToIndex(Math.max(0, current - 1))}
                disabled={!canPrev}
              >
                ←
              </button>
              <button
                type="button"
                aria-label="Next itinerary"
                onClick={() => scrollToIndex(Math.min(visible.length - 1, current + 1))}
                disabled={!canNext}
              >
                →
              </button>
            </div>
          </header>

          <div className="itin-gallery4__track" ref={trackRef} onScroll={updateNav}>
            {visible.map((itinerary, index) => (
              <article
                key={itinerary.name}
                className={`itin-card4${index === activeIndex ? ' is-active' : ''}`}
              >
                <button
                  type="button"
                  className="itin-card4__inner"
                  onClick={() => selectCard(index)}
                >
                  <span className="itin-card4__figure">
                    <img
                      className="itin-card4__img"
                      src={itinerary.image}
                      alt={itinerary.imageAlt}
                      loading="lazy"
                    />
                    <span className="itin-card4__overlay" aria-hidden="true" />
                    <span className="itin-card4__body">
                      <span className="itin-card4__nights">{nightsLabel(itinerary.duration)}</span>
                      <span className="itin-card4__title">{itinerary.name}</span>
                      <span className="itin-card4__desc">
                        {shortDescription(itinerary.character)}
                      </span>
                      <span className="itin-card4__more">
                        Read more <span aria-hidden="true">→</span>
                      </span>
                    </span>
                  </span>
                </button>
              </article>
            ))}
          </div>

          <div className="itin-gallery4__dots">
            {visible.map((itinerary, index) => (
              <button
                key={itinerary.name}
                type="button"
                className={`${current === index ? 'is-active' : ''}`}
                aria-label={`Go to ${itinerary.name}`}
                onClick={() => scrollToIndex(index)}
              />
            ))}
          </div>
        </div>

        {/* Details for the selected package. */}
        {selected ? (
          <article className="itin-detail" ref={detailRef} aria-live="polite">
            <div className="itin-detail__head">
              <span className="itin-detail__numeral" aria-hidden="true">
                {selected.numeral}
              </span>
              <div>
                <h3>{selected.name}</h3>
                <p className="itin-detail__meta">
                  {selected.duration} · {nightsLabel(selected.duration)} · {selected.reach}
                </p>
              </div>
            </div>

            <div className="itin-detail__grid">
              <div className="itin-block">
                <h4>The Character</h4>
                <p>{selected.character}</p>
              </div>

              <div className="itin-block">
                <h4>The Route</h4>
                <ol className="itin-route">
                  {selected.route.map((stop) => (
                    <li key={stop}>
                      <span className="itin-route__dot" aria-hidden="true" />
                      <span className="itin-route__label">{stop}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="itin-block">
                <h4>Signature Inclusions</h4>
                <ul className="itin-inclusions">
                  {selected.inclusions.map((inclusion) => (
                    <li key={inclusion}>{inclusion}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="itin-package__actions">
              {(() => {
                const added = isIncluded(toJourneyId('package', selected.name))
                return (
                  <button
                    type="button"
                    className={`itin-button${added ? ' itin-button--added' : ''}`}
                    aria-pressed={added}
                    onClick={() => togglePackage(selected)}
                  >
                    {added ? 'Added to Journey ✓' : 'Add to Journey'}
                  </button>
                )
              })()}
              <a className="itin-button itin-button--ghost" href="/my-journey">
                View My Journey
              </a>
            </div>
          </article>
        ) : null}
      </section>

      <section className="itin-closing">
        <span className="itin-eyebrow itin-eyebrow--light">A Private Commission</span>
        <h2>
          None of these is the finished article.
          <em>Yours will be.</em>
        </h2>
        <p>
          These three structures exist so there is something to react to. Lengthen a coastline,
          remove a city, add a week in the hills — every journey we arrange is written for one party
          and travelled by no one else.
        </p>
        <div className="itin-closing__actions">
          <a className="itin-button itin-button--light" href="/contact">
            Begin a Conversation
          </a>
          <a className="itin-button itin-button--ghost-light" href="/expectations">
            Shape Your Own Journey
          </a>
        </div>
      </section>
    </main>
  )
}
