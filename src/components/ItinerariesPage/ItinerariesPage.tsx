import { useEffect, useRef, useState } from 'react'
import './ItinerariesPage.css'
import { experienceImages } from '../ExperiencesPage/images'
import { fetchPublicPackages } from '../../services/publicContent'
import { itinerarySlug } from '../ItineraryDetailPage/itineraryNarratives'

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

/**
 * The page presents the three signature journeys and nothing else. The themes,
 * sub-packages and inclusions steps that used to follow were removed while the
 * journey content is being rewritten — see git history to restore them.
 */

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
      'The island at a spirited pace, with not a morning wasted. For travellers whose diary is short and whose appetite is anything but.',
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
      'Every celebrated place, and the long unclaimed afternoons in between. Time enough to sit with a view rather than photograph it and move on.',
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
      'The whole island read slowly, north to south. Including the quarters most travellers are never shown, at the pace such a journey has always deserved.',
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
  // Content comes from the admin-managed DB; fall back to the curated list.
  const [items, setItems] = useState<readonly Itinerary[]>(fallbackItineraries)


  const trackRef = useRef<HTMLDivElement>(null)
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
  }, [visible.length])

  const scrollToIndex = (index: number) => {
    const el = trackRef.current
    if (!el) return
    const card = el.querySelectorAll<HTMLElement>('.itin-card4')[index]
    if (!card) return
    const delta = card.getBoundingClientRect().left - el.getBoundingClientRect().left
    el.scrollBy({ left: delta, behavior: 'smooth' })
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
          <span className="itin-eyebrow itin-eyebrow--light">Three Ways to Meet the Island</span>
          <h1>
            How long should a place
            <em>be allowed to keep you?</em>
          </h1>
          <p>
            Ten days, sixteen, or twenty-one. Tell us how much time Sri Lanka gets, and we will
            spend every hour of it well.
          </p>
          <a className="itin-hero__cta" href="#itin-collection">
            See the Three Journeys
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>

      <section className="itin-collection" id="itin-collection" aria-label="Choose a journey">
        <div className="itin-gallery4">
          <header className="itin-gallery4__head">
            <div className="itin-gallery4__intro">
              <span className="itin-eyebrow">Choose Your Pace</span>
              <h2>Time is the real luxury.</h2>
              <p>
                Ten days, sixteen, or twenty one choose the one that lets you linger where it
                matters. We take care of everything in between.
              </p>
            </div>
            <div className="itin-gallery4__nav">
              <button
                type="button"
                aria-label="Previous journey"
                onClick={() => scrollToIndex(Math.max(0, current - 1))}
                disabled={!canPrev}
              >
                ←
              </button>
              <button
                type="button"
                aria-label="Next journey"
                onClick={() => scrollToIndex(Math.min(visible.length - 1, current + 1))}
                disabled={!canNext}
              >
                →
              </button>
            </div>
          </header>

          <div className="itin-gallery4__track" ref={trackRef} onScroll={updateNav}>
            {visible.map((itinerary) => (
              <article key={itinerary.name} className="itin-card4">
                <a
                  className="itin-card4__inner"
                  href={`/itineraries/${itinerarySlug(itinerary.name)}`}
                  aria-label={`Read the ${itinerary.name} journey day by day`}
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
                      <span className="itin-card4__nights">
                        {nightsLabel(itinerary.duration)}
                      </span>
                      <span className="itin-card4__title">{itinerary.name}</span>
                      <span className="itin-card4__desc">
                        {shortDescription(itinerary.character)}
                      </span>
                      <span className="itin-card4__more">
                        Read this journey <span aria-hidden="true">→</span>
                      </span>
                    </span>
                  </span>
                </a>
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

      </section>

      <section className="itin-closing">
        <span className="itin-eyebrow itin-eyebrow--light">Written for One Party Only</span>
        <h2>
          None of these is the finished thing.
          <em>Yours will be.</em>
        </h2>
        <p>
          Think of these as an opening line rather than a last word. Stretch a coastline, lose a
          city, steal another week in the hills — no two journeys we arrange have ever read the
          same, and yours will be travelled by no one else.
        </p>
        <div className="itin-closing__actions">
          <a className="itin-button itin-button--light" href="/contact">
            Start the Conversation
          </a>
          <a className="itin-button itin-button--ghost-light" href="/expectations">
            Tell Us What You Are Imagining
          </a>
        </div>
      </section>
    </main>
  )
}
