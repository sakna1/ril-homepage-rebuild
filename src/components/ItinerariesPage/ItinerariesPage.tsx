import { motion, useReducedMotion } from 'framer-motion'
import './ItinerariesPage.css'
import { experienceImages } from '../ExperiencesPage/images'
import { toJourneyId } from '../../journey/journeyItemHelpers'
import { useJourney } from '../../journey/useJourney'

// ---------------------------------------------------------------------------
// PLACEHOLDER PRICING — replace `priceFrom` on each itinerary below with the
// real figures before this page goes live. Values are indicative, per person,
// in USD, and are labelled as such in the UI.
// ---------------------------------------------------------------------------

type Itinerary = {
  numeral: string
  name: string
  duration: string
  /** Indicative "from" price per person, in USD. */
  priceFrom: number
  character: string
  route: readonly string[]
  inclusions: readonly string[]
  pace: string
  bestFor: string
  reach: string
  image: string
  imageAlt: string
}

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const itineraries: readonly Itinerary[] = [
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
      'The Temple of the Tooth',
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

const comparisonRows = [
  { label: 'Duration', key: 'duration' },
  { label: 'Pace', key: 'pace' },
  { label: 'Best for', key: 'bestFor' },
  { label: 'Island reach', key: 'reach' },
] as const

export function ItinerariesPage() {
  const prefersReducedMotion = useReducedMotion()
  const { confirmRemoveItem, includeItem, isIncluded } = useJourney()

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
      pricePerPerson: itinerary.priceFrom,
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

        <div className="itin-list">
          {itineraries.map((itinerary, index) => (
            <motion.article
              key={itinerary.name}
              className="itin-package"
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
            >
              <figure className="itin-package__media">
                <img src={itinerary.image} alt={itinerary.imageAlt} loading="lazy" />
                <span className="itin-package__veil" aria-hidden="true" />
                <span className="itin-package__duration">
                  <strong>{itinerary.duration.split(' ')[0]}</strong>
                  <small>Days</small>
                </span>
              </figure>

              <div className="itin-package__body">
                <span className="itin-package__numeral" aria-hidden="true">
                  {itinerary.numeral}
                </span>
                <h3>{itinerary.name}</h3>

                <div className="itin-block">
                  <h4>The Character</h4>
                  <p>{itinerary.character}</p>
                </div>

                <div className="itin-block">
                  <h4>The Route</h4>
                  <ol className="itin-route">
                    {itinerary.route.map((stop) => (
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
                    {itinerary.inclusions.map((inclusion) => (
                      <li key={inclusion}>{inclusion}</li>
                    ))}
                  </ul>
                </div>

                <div className="itin-package__price">
                  <span className="itin-package__price-label">From</span>
                  <strong>{priceFormatter.format(itinerary.priceFrom)}</strong>
                  <span className="itin-package__price-unit">per person</span>
                  <small>Indicative — final price confirmed by your concierge.</small>
                </div>

                <div className="itin-package__actions">
                  {(() => {
                    const added = isIncluded(toJourneyId('package', itinerary.name))
                    return (
                      <button
                        type="button"
                        className={`itin-button${added ? ' itin-button--added' : ''}`}
                        aria-pressed={added}
                        onClick={() => togglePackage(itinerary)}
                      >
                        {added ? 'Added to Journey ✓' : 'Add to Journey'}
                      </button>
                    )
                  })()}
                  <a className="itin-button itin-button--ghost" href="/my-journey">
                    View My Journey
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
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
                {itineraries.map((itinerary) => (
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
                  {itineraries.map((itinerary) => (
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
