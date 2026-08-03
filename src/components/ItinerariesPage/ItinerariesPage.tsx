import { useEffect, useMemo, useRef, useState } from 'react'
import './ItinerariesPage.css'
import { experienceImages } from '../ExperiencesPage/images'
import { toJourneyId } from '../../journey/journeyItemHelpers'
import { useJourney } from '../../journey/useJourney'
import { fetchPublicPackages, fetchPublicThemes } from '../../services/publicContent'
import {
  fallbackThemes,
  galleryForTheme,
  imageForTheme,
  type ItineraryTheme,
  type ThemeSubPackage,
} from './themeCatalog'

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
 * The Designed Trips flow, in four steps:
 *   1. Choose a package (Discovery / Deep Dive / Dynasty)
 *   2. Choose one of the seven themes
 *   3. Choose that theme's sub-package (The Glimpse / The Immersion)
 *   4. Review the locked inclusions and add the whole thing to the journey
 */
const STEPS = [
  { id: 'package', label: 'Package', hint: 'The shape of the journey' },
  { id: 'theme', label: 'Theme', hint: 'What the journey is about' },
  { id: 'sub-package', label: 'Sub-Package', hint: 'How deeply you go in' },
  { id: 'review', label: 'Inclusions', hint: 'Locked and ready' },
] as const

type StepId = (typeof STEPS)[number]['id']

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

/** The day count from a package duration string ("10 Days" -> 10); 0 if unparseable. */
function daysFromDuration(duration: string): number {
  const days = parseInt(duration, 10)
  return Number.isNaN(days) ? 0 : days
}

// A short one-line description for the gallery card.
function shortDescription(character: string): string {
  const firstSentence = character.split(/(?<=[.!?])\s/)[0] ?? character
  return firstSentence.length > 130 ? `${firstSentence.slice(0, 127).trimEnd()}…` : firstSentence
}

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

function formatUsd(amount: number): string {
  return usdFormatter.format(amount)
}

export function ItinerariesPage() {
  const { confirmRemoveItem, includeItem, isIncluded } = useJourney()

  // Content comes from the admin-managed DB; fall back to the curated lists.
  const [items, setItems] = useState<readonly Itinerary[]>(fallbackItineraries)
  const [themes, setThemes] = useState<readonly ItineraryTheme[]>(fallbackThemes)

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null)
  const [selectedSubPackageId, setSelectedSubPackageId] = useState<string | null>(null)
  const [furthestStep, setFurthestStep] = useState<StepId>('package')

  const trackRef = useRef<HTMLDivElement>(null)
  const themeRef = useRef<HTMLDivElement>(null)
  const subPackageRef = useRef<HTMLDivElement>(null)
  const reviewRef = useRef<HTMLDivElement>(null)
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

  // Themes carry their two sub-packages nested, so one call covers steps 2 and 3.
  useEffect(() => {
    let cancelled = false
    fetchPublicThemes()
      .then((publicThemes) => {
        const withSubPackages = publicThemes.filter(
          (theme) => (theme.themePackages ?? []).length > 0,
        )
        if (cancelled || withSubPackages.length === 0) return
        setThemes(
          withSubPackages.map((theme) => ({
            id: String(theme.id),
            title: theme.title,
            description: theme.description,
            traveller: theme.traveller,
            ...imageForTheme(theme.title),
            subPackages: theme.themePackages.map((sub) => ({
              id: String(sub.id),
              tier: sub.tier === 'immersion' ? 'immersion' : 'glimpse',
              name: sub.name,
              days: sub.days,
              coverage: sub.coverage === 'full' ? 'full' : 'half',
              summary: sub.summary,
              hotel: sub.hotel,
              activities: sub.activities,
              inclusions: sub.inclusions,
              priceAdd: sub.priceAdd,
            })),
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

  const selectedTheme = useMemo(
    () => themes.find((theme) => theme.id === selectedThemeId) ?? null,
    [selectedThemeId, themes],
  )
  const selectedSubPackage = useMemo(
    () =>
      selectedTheme?.subPackages.find((sub) => sub.id === selectedSubPackageId) ?? null,
    [selectedSubPackageId, selectedTheme],
  )

  // Step 4 shows the package's "from" price plus the sub-package's addition.
  const packagePrice = selected?.priceFrom ?? 0
  const totalPrice = packagePrice + (selectedSubPackage?.priceAdd ?? 0)

  const reachedStep = (step: StepId) => {
    const order = STEPS.map((entry) => entry.id)
    return order.indexOf(step) <= order.indexOf(furthestStep)
  }

  const advanceTo = (step: StepId, target: React.RefObject<HTMLDivElement | null>) => {
    const order = STEPS.map((entry) => entry.id)
    setFurthestStep((previous) =>
      order.indexOf(step) > order.indexOf(previous) ? step : previous,
    )
    requestAnimationFrame(() => {
      target.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

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

  // Step 1 -> 2. Changing the package keeps the theme but re-prices the trip.
  const selectPackage = (index: number) => {
    setSelectedIndex(index)
    advanceTo('theme', themeRef)
  }

  // Step 2 -> 3. A new theme invalidates whichever sub-package was chosen.
  const selectTheme = (theme: ItineraryTheme) => {
    setSelectedThemeId(theme.id)
    setSelectedSubPackageId(null)
    setFurthestStep('sub-package')
    requestAnimationFrame(() => {
      subPackageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  // Step 3 -> 4. The inclusions below are now fixed.
  const selectSubPackage = (subPackage: ThemeSubPackage) => {
    setSelectedSubPackageId(subPackage.id)
    advanceTo('review', reviewRef)
  }

  const journeyId =
    selected && selectedTheme && selectedSubPackage
      ? toJourneyId(
          'package',
          `${selected.name}-${selectedTheme.title}-${selectedSubPackage.name}`,
        )
      : null
  const added = journeyId ? isIncluded(journeyId) : false

  function toggleDesignedTrip() {
    if (!selected || !selectedTheme || !selectedSubPackage || !journeyId) return

    if (added) {
      confirmRemoveItem(journeyId)
      return
    }

    includeItem({
      id: journeyId,
      kind: 'package',
      label: `${selected.name} — ${selectedTheme.title}`,
      detail: selectedSubPackage.summary,
      source: 'Itineraries',
      duration: selected.duration,
      pricePerPerson: totalPrice,
      designedTrip: {
        packageName: selected.name,
        packageDuration: selected.duration,
        packagePrice,
        themeTitle: selectedTheme.title,
        subPackageName: selectedSubPackage.name,
        subPackageDays: selectedSubPackage.days,
        subPackageCoverage: selectedSubPackage.coverage,
        subPackagePriceAdd: selectedSubPackage.priceAdd,
        hotel: selectedSubPackage.hotel,
        activities: [...selectedSubPackage.activities],
        inclusions: [...selectedSubPackage.inclusions],
      },
    })
  }

  const currentStep: StepId = selectedSubPackage
    ? 'review'
    : selectedTheme
      ? 'sub-package'
      : furthestStep === 'package'
        ? 'package'
        : 'theme'

  return (
    <main className="itineraries-page">
      <section className="itin-hero">
        <div className="itin-hero__backdrop" aria-hidden="true">
          <span className="itin-hero__orb itin-hero__orb--one" />
          <span className="itin-hero__orb itin-hero__orb--two" />
          <span className="itin-hero__grain" />
        </div>

        <div className="itin-hero__copy">
          <span className="itin-eyebrow itin-eyebrow--light">Designed Trips</span>
          <h1>
            Four Choices, and
            <em>the Journey Is Yours.</em>
          </h1>
          <p>
            Begin with a structure, give it a subject, then decide how deeply you go in. The hotel
            and the days are set for you — so there is nothing left to arrange.
          </p>
          <a className="itin-hero__cta" href="#itin-collection">
            Begin With a Package
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>

      {/* The four-step progress rail, shown throughout the flow. */}
      <nav className="itin-steps" aria-label="Designed trip steps">
        <ol>
          {STEPS.map((step, index) => {
            const isDone = STEPS.findIndex((entry) => entry.id === currentStep) > index
            const isCurrent = step.id === currentStep
            return (
              <li
                key={step.id}
                className={`itin-step${isCurrent ? ' is-current' : ''}${isDone ? ' is-done' : ''}`}
                aria-current={isCurrent ? 'step' : undefined}
              >
                <span className="itin-step__index">{isDone ? '✓' : index + 1}</span>
                <span className="itin-step__text">
                  <strong>{step.label}</strong>
                  <small>{step.hint}</small>
                </span>
              </li>
            )
          })}
        </ol>
      </nav>

      {/* Step 1 — choose a package. */}
      <section className="itin-collection" id="itin-collection" aria-label="Choose a package">
        <div className="itin-gallery4">
          <header className="itin-gallery4__head">
            <div className="itin-gallery4__intro">
              <span className="itin-eyebrow">Step One · The Package</span>
              <h2>Chosen rhythms, not fixed schedules.</h2>
              <p>
                Ten days, sixteen, or twenty-one. The difference is not how much is seen, but how
                much time each place is given.
              </p>
            </div>
            <div className="itin-gallery4__nav">
              <button
                type="button"
                aria-label="Previous package"
                onClick={() => scrollToIndex(Math.max(0, current - 1))}
                disabled={!canPrev}
              >
                ←
              </button>
              <button
                type="button"
                aria-label="Next package"
                onClick={() => scrollToIndex(Math.min(visible.length - 1, current + 1))}
                disabled={!canNext}
              >
                →
              </button>
            </div>
          </header>

          <div className="itin-gallery4__track" ref={trackRef} onScroll={updateNav}>
            {visible.map((itinerary, index) => {
              const isChosen = reachedStep('theme') && index === activeIndex
              return (
                <article
                  key={itinerary.name}
                  className={`itin-card4${isChosen ? ' is-active' : ''}`}
                >
                  <button
                    type="button"
                    className="itin-card4__inner"
                    aria-pressed={isChosen}
                    onClick={() => selectPackage(index)}
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
                          {isChosen ? 'Selected ✓' : 'Choose this package'}{' '}
                          <span aria-hidden="true">→</span>
                        </span>
                      </span>
                    </span>
                  </button>
                </article>
              )
            })}
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

      {/* Step 2 — choose a theme. */}
      {reachedStep('theme') ? (
        <section className="itin-themes" ref={themeRef} aria-label="Choose a theme">
          <header className="itin-section-head">
            <span className="itin-eyebrow">Step Two · The Theme</span>
            <h2>What is this journey actually about?</h2>
            <p>
              Seven subjects, each with its own specialists, properties and hours of the day. Choose
              one — it decides everything that follows.
            </p>
          </header>

          <div className="itin-theme-grid">
            {themes.map((theme) => {
              const isChosen = theme.id === selectedThemeId
              return (
                <button
                  key={theme.id}
                  type="button"
                  className={`itin-theme-card${isChosen ? ' is-chosen' : ''}`}
                  aria-pressed={isChosen}
                  onClick={() => selectTheme(theme)}
                >
                  <span className="itin-theme-card__figure">
                    <img src={theme.image} alt={theme.imageAlt} loading="lazy" />
                    <span className="itin-theme-card__overlay" aria-hidden="true" />
                  </span>
                  <span className="itin-theme-card__body">
                    <span className="itin-theme-card__traveller">{theme.traveller}</span>
                    <span className="itin-theme-card__title">{theme.title}</span>
                    <span className="itin-theme-card__desc">{theme.description}</span>
                    <span className="itin-theme-card__mark">
                      {isChosen ? 'Chosen ✓' : 'Choose this theme'}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </section>
      ) : null}

      {/* Step 3 — choose the theme's sub-package. */}
      {selectedTheme ? (
        <section className="itin-subpackages" ref={subPackageRef} aria-label="Choose a sub-package">
          <header className="itin-section-head">
            <span className="itin-eyebrow">Step Three · The Sub-Package</span>
            <h2>How deeply into {selectedTheme.title.toLowerCase()}?</h2>
            <p>
              Two days at the edge of it, or four days properly inside it. Each comes with its own
              property and its own set hours.
            </p>
          </header>

          <div className="itin-subpackage-grid">
            {selectedTheme.subPackages.map((subPackage) => {
              const isChosen = subPackage.id === selectedSubPackageId
              return (
                <button
                  key={subPackage.id}
                  type="button"
                  className={`itin-subpackage${isChosen ? ' is-chosen' : ''}`}
                  aria-pressed={isChosen}
                  onClick={() => selectSubPackage(subPackage)}
                >
                  <span className="itin-subpackage__head">
                    <span className="itin-subpackage__name">{subPackage.name}</span>
                    <span className="itin-subpackage__meta">
                      {subPackage.days} Days · {subPackage.coverage === 'full' ? 'Full' : 'Half'}
                    </span>
                  </span>
                  <span className="itin-subpackage__summary">{subPackage.summary}</span>
                  <span className="itin-subpackage__hotel">
                    <small>Hotel</small>
                    {subPackage.hotel}
                  </span>
                  <span className="itin-subpackage__foot">
                    <span className="itin-subpackage__price">
                      {formatUsd(subPackage.priceAdd)}
                      <small>per person</small>
                    </span>
                    <span className="itin-subpackage__mark">
                      {isChosen ? 'Chosen ✓' : 'Choose'}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </section>
      ) : null}

      {/* Step 4 — the locked inclusions and the add to cart. */}
      {selected && selectedTheme && selectedSubPackage ? (
        <section className="itin-review" ref={reviewRef} aria-label="Locked inclusions">
          <header className="itin-section-head">
            <span className="itin-eyebrow">Step Four · Inclusions</span>
            <h2>Set, and not for editing.</h2>
            <p>
              The hotel and the activities below come with this sub-package. Everything else about
              the journey stays open to conversation.
            </p>
          </header>

          <article className="itin-review__card">
            <ol className="itin-review__chain">
              <li>
                <span>Package</span>
                <strong>
                  {selected.name} · {selected.duration}
                </strong>
              </li>
              <li>
                <span>Theme</span>
                <strong>{selectedTheme.title}</strong>
              </li>
              <li>
                <span>Sub-Package</span>
                <strong>
                  {selectedSubPackage.name} · {selectedSubPackage.days} Days
                </strong>
              </li>
            </ol>

            {(() => {
              // The sub-package fixes only part of the package. The balance
              // stays open, which is the point of the flow — so say so plainly.
              const totalDays = daysFromDuration(selected.duration)
              const setDays = selectedSubPackage.days
              const openDays = Math.max(0, totalDays - setDays)
              if (totalDays === 0) return null

              return (
                <div className="itin-review__days">
                  <div
                    className="itin-review__days-bar"
                    role="img"
                    aria-label={`${setDays} of ${totalDays} days set, ${openDays} still open`}
                  >
                    <span
                      className="itin-review__days-set"
                      style={{ width: `${(setDays / totalDays) * 100}%` }}
                    />
                  </div>
                  <p className="itin-review__days-copy">
                    <strong>
                      {setDays} of {totalDays} days set.
                    </strong>{' '}
                    {openDays > 0 ? (
                      <>
                        The remaining {openDays} {openDays === 1 ? 'day stays' : 'days stay'} open —
                        shape them in My Journey, or leave them to your concierge.
                      </>
                    ) : (
                      <>Every day of this package is accounted for.</>
                    )}
                  </p>
                </div>
              )
            })()}

            <div className="itin-review__locked">
              <span className="itin-review__lock-label">
                Inclusions locked <span aria-hidden="true">🔒</span>
              </span>

              {(() => {
                const gallery = galleryForTheme(selectedTheme.title)

                return (
                  <div className="itin-review__grid">
                    <div className="itin-block">
                      <h4>The Hotel</h4>
                      <p>{selectedSubPackage.hotel}</p>
                      <figure className="itin-review__shot">
                        <img src={gallery.hotel.src} alt={gallery.hotel.alt} loading="lazy" />
                      </figure>
                    </div>

                    <div className="itin-block">
                      <h4>What You Will Do</h4>
                      <ul className="itin-inclusions">
                        {selectedSubPackage.activities.map((activity) => (
                          <li key={activity}>{activity}</li>
                        ))}
                      </ul>
                      <div className="itin-review__shots">
                        {gallery.doing.map((shot, index) => (
                          <figure
                            key={`${shot.alt}-${index}`}
                            className="itin-review__shot itin-review__shot--small"
                          >
                            <img src={shot.src} alt={shot.alt} loading="lazy" />
                          </figure>
                        ))}
                      </div>
                    </div>

                    <div className="itin-block">
                      <h4>What Is Included</h4>
                      <ul className="itin-inclusions">
                        {selectedSubPackage.inclusions.map((inclusion) => (
                          <li key={inclusion}>{inclusion}</li>
                        ))}
                      </ul>
                      <div className="itin-review__shots">
                        {gallery.included.map((shot, index) => (
                          <figure
                            key={`${shot.alt}-${index}`}
                            className="itin-review__shot itin-review__shot--small"
                          >
                            <img src={shot.src} alt={shot.alt} loading="lazy" />
                          </figure>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })()}

              <p className="itin-review__shot-note">
                Photographs are indicative of the theme, not of the specific property.
              </p>
            </div>

            <div className="itin-review__pricing">
              <dl>
                <div>
                  <dt>{selected.name}</dt>
                  <dd>{formatUsd(packagePrice)}</dd>
                </div>
                <div>
                  <dt>
                    {selectedTheme.title} · {selectedSubPackage.name}
                  </dt>
                  <dd>+{formatUsd(selectedSubPackage.priceAdd)}</dd>
                </div>
                <div className="itin-review__total">
                  <dt>Indicative total</dt>
                  <dd>
                    {formatUsd(totalPrice)}
                    <small>per person</small>
                  </dd>
                </div>
              </dl>
              <p className="itin-review__note">
                Indicative pricing — your concierge confirms the final figure before anything is
                booked.
              </p>
            </div>

            <div className="itin-package__actions">
              <button
                type="button"
                className={`itin-button${added ? ' itin-button--added' : ''}`}
                aria-pressed={added}
                onClick={toggleDesignedTrip}
              >
                {added ? 'Added to Cart ✓' : 'Add to Cart'}
              </button>
              <a className="itin-button itin-button--ghost" href="/my-journey">
                View My Journey
              </a>
            </div>
          </article>
        </section>
      ) : null}

      <section className="itin-closing">
        <span className="itin-eyebrow itin-eyebrow--light">A Private Commission</span>
        <h2>
          None of these is the finished article.
          <em>Yours will be.</em>
        </h2>
        <p>
          These structures exist so there is something to react to. Lengthen a coastline, remove a
          city, add a week in the hills — every journey we arrange is written for one party and
          travelled by no one else.
        </p>
        <div className="itin-closing__actions">
          <a className="itin-button itin-button--light" href="/contact">
            Begin a Conversation
          </a>
          <a className="itin-button itin-button--ghost-light" href="/expectations">
            Design Your Own Trip
          </a>
        </div>
      </section>
    </main>
  )
}
