import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
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
  {
    numeral: 'IV',
    name: 'Coastal Serenity',
    duration: '8 Days',
    priceFrom: 4200,
    character:
      'Slow mornings by the sea, cinnamon gardens, and quiet fortified towns — the southern coast read at the pace of the tide.',
    route: ['Colombo', 'Bentota', 'Galle', 'Weligama', 'Mirissa', 'Tangalle', 'Airport'],
    inclusions: [
      'A private villa on the southern coast',
      'Galle Fort at golden hour',
      'A dawn whale-watching charter',
      'A cinnamon estate visit',
      'Sunset suppers by the sea',
    ],
    pace: 'Gentle',
    bestFor: 'Coastal escapes and honeymoons',
    reach: 'Western & Southern coast',
    image: experienceImages.poolVilla,
    imageAlt: 'Private coastal villa pool in southern Sri Lanka',
  },
  {
    numeral: 'V',
    name: 'Highland Retreat',
    duration: '7 Days',
    priceFrom: 3900,
    character:
      'Misted tea country, cool verandas, and the slow work of restoration — hill stations and gardens reached by scenic mountain rail.',
    route: ['Colombo', 'Kandy', 'Nuwara Eliya', 'Ella', 'Haputale', 'Airport'],
    inclusions: [
      'A tea-estate bungalow stay',
      'The scenic highland rail journey',
      'Private tea tastings',
      'Ayurvedic wellness mornings',
      'Nine Arches Bridge at first light',
    ],
    pace: 'Restorative',
    bestFor: 'Wellness and cool-climate travel',
    reach: 'Central Highlands & Uva',
    image: experienceImages.teaEstate,
    imageAlt: 'Rows of tea bushes on a misted hill-country estate',
  },
  {
    numeral: 'VI',
    name: 'Wild Encounters',
    duration: '9 Days',
    priceFrom: 5600,
    character:
      'Leopard country, elephant gatherings, and dawn safaris with naturalists who know when not to speak — wilderness held with patience.',
    route: ['Colombo', 'Wilpattu National Park', 'Sigiriya', 'Minneriya', 'Kandy', 'Udawalawe', 'Yala', 'Airport'],
    inclusions: [
      'Private leopard safaris in Yala',
      'The Minneriya elephant gathering',
      'A naturalist-led field morning',
      'Wilpattu wilderness drives',
      'A tented wild-coast retreat',
    ],
    pace: 'Adventurous',
    bestFor: 'Wildlife and photography',
    reach: 'North-West, Centre & Deep South',
    image: experienceImages.leopardFeature,
    imageAlt: 'Sri Lankan leopard resting on a rock at dusk',
  },
  {
    numeral: 'VII',
    name: 'Sacred Circuit',
    duration: '11 Days',
    priceFrom: 6100,
    character:
      "Ancient capitals, cave temples, and living ritual — the island's spiritual heart entered slowly, with scholarship and protected timing.",
    route: ['Colombo', 'Anuradhapura', 'Mihintale', 'Polonnaruwa', 'Sigiriya', 'Dambulla', 'Kandy', 'Airport'],
    inclusions: [
      'Private dawn access at Sigiriya',
      'The Dambulla cave temples',
      'The Temple of the Tooth',
      'Resident-scholar accompaniment',
      'A Kandyan dance and ritual evening',
    ],
    pace: 'Contemplative',
    bestFor: 'Heritage and scholarship',
    reach: 'Cultural Triangle & Central',
    image: experienceImages.monks,
    imageAlt: 'Buddhist monks at a Sri Lankan temple',
  },
] as const

const comparisonRows = [
  { label: 'Duration', key: 'duration' },
  { label: 'Pace', key: 'pace' },
  { label: 'Best for', key: 'bestFor' },
  { label: 'Island reach', key: 'reach' },
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
  return firstSentence.length > 120 ? `${firstSentence.slice(0, 117).trimEnd()}…` : firstSentence
}

export function ItinerariesPage() {
  const prefersReducedMotion = useReducedMotion()
  const { confirmRemoveItem, includeItem, isIncluded } = useJourney()

  // Content comes from the admin-managed DB; fall back to the curated list.
  const [items, setItems] = useState<readonly Itinerary[]>(fallbackItineraries)
  const [selectedIndex, setSelectedIndex] = useState(0)

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

  const activeIndex = items.length > 0 ? Math.min(selectedIndex, items.length - 1) : 0
  const selected = items[activeIndex] ?? null

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

        <motion.div
          className="itin-hero__copy"
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
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
        </motion.div>
      </section>

      <section className="itin-collection" id="itin-collection" aria-label="Signature itineraries">
        <header className="itin-section-heading">
          <span className="itin-eyebrow">The Collection</span>
          <h2>Chosen rhythms, not fixed schedules.</h2>
          <p>
            Ten days, sixteen, or twenty-one. The difference is not how much is seen, but how much
            time each place is given.
          </p>
        </header>

        {/* Expanding gallery — hover to preview, click a package to open its details below. */}
        <div className="itin-gallery" role="tablist" aria-label="Package selection">
          {items.map((itinerary, index) => {
            const isActive = index === activeIndex
            return (
              <button
                key={itinerary.name}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`itin-gallery-card${isActive ? ' is-active' : ''}`}
                onClick={() => setSelectedIndex(index)}
              >
                <img
                  className="itin-gallery-card__img"
                  src={itinerary.image}
                  alt={itinerary.imageAlt}
                  loading="lazy"
                />
                <span className="itin-gallery-card__veil" aria-hidden="true" />
                <span className="itin-gallery-card__content">
                  <span className="itin-gallery-card__nights">{nightsLabel(itinerary.duration)}</span>
                  <span className="itin-gallery-card__name">{itinerary.name}</span>
                  <span className="itin-gallery-card__desc">{shortDescription(itinerary.character)}</span>
                </span>
              </button>
            )
          })}
        </div>

        {/* Dynamic details for the selected package. */}
        {selected ? (
          <motion.article
            key={selected.name}
            className="itin-detail"
            aria-live="polite"
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
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
          </motion.article>
        ) : null}
      </section>

      <section className="itin-compare" aria-labelledby="itin-compare-heading">
        <header className="itin-section-heading itin-section-heading--centred">
          <span className="itin-eyebrow">At a Glance</span>
          <h2 id="itin-compare-heading">Which rhythm suits you?</h2>
        </header>

        <div className="itin-compare__scroll">
          <table className="itin-compare__table">
            <caption className="itin-visually-hidden">
              Comparison of the Discovery, Deep Dive, and Dynasty itineraries
            </caption>
            <thead>
              <tr>
                <th scope="col">
                  <span className="itin-visually-hidden">Detail</span>
                </th>
                {items.map((itinerary) => (
                  <th key={itinerary.name} scope="col">
                    {itinerary.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.key}>
                  <th scope="row">{row.label}</th>
                  {items.map((itinerary) => (
                    <td key={itinerary.name}>{itinerary[row.key]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
