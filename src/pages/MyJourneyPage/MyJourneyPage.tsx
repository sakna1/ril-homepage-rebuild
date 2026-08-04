import { useCallback, useEffect, useId, useMemo, useState } from 'react'
import { JourneyConstellationLayer } from '../../components/Map/JourneyConstellationLayer'
import { JourneyRegionLayer } from '../../components/Map/JourneyRegionLayer'
import { RouteStopMarker } from '../../components/Map/RouteStopMarker'
import { TravelMap } from '../../components/Map/TravelMap'
import type { IllustrativeItinerary } from '../../data/journey/types'
import { ILLUSTRATIVE_DISCLAIMER } from '../../data/journey/mockJourneyTypes'
import { journeyRegions } from '../../data/journeyRegions'
import { getSavedDestinationIds, getSavedRegionIds } from '../../journey/contextualRecommendations'
import type { DesignedTripSelection, JourneyItem } from '../../journey/JourneyContext'
import {
  designedTripDaysUsed,
  designedTripSegments,
  designedTripTotal,
} from '../../journey/journeyContextStore'
import { checkJourneyDistances } from '../../journey/journeyDistanceCheck'
import { groupJourneyPlaces } from '../../journey/journeyPlaceGroups'
import { useJourney } from '../../journey/useJourney'
import { useJourneyRoute } from '../../journey/useJourneyRoute'
import { formatDrivingDuration } from '../../services/mapboxDirections'
import { buildJourneyGlanceSummary } from '../../journey/savedJourneyDisplay'
import { orderDestinationIdsEditorially } from '../../journey/savedPlaceResolution'
import {
  companionOptions,
  nightsBetween,
  readStoredCompanion,
  readStoredDates,
  readStoredSecurity,
  readStoredTransport,
  transportOptions,
  writeStoredCompanion,
  writeStoredDates,
  writeStoredSecurity,
  writeStoredTransport,
  SECURITY_DETAIL_USD_PER_DAY,
  type CompanionId,
  type TravelDates,
  type TransportId,
} from '../../journey/travelPreferences'
import {
  adaptSavedItemsToRepositoryInput,
  findCatalogDestinationById,
  journeyRepository,
} from '../../services/journeyRepository'
import { DistanceAdvisoryBanner } from './DistanceAdvisoryBanner'
import { HealthInsuranceCard } from './HealthInsuranceCard'
import { JourneyCartPopup } from './JourneyCartPopup'
import { PlaceHoverPreview } from './PlaceHoverPreview'
import { RoadTransportSection } from './RoadTransportSection'
import { TravelCompanionsSection } from './TravelCompanionsSection'
import './MyJourneyPage.css'

type WorkspaceMode = 'package' | 'itinerary' | 'edit' | 'builder'

type JourneyStep = {
  id: 'theme' | 'places' | 'itinerary' | 'cart'
  label: string
  hint: string
}

const STEPS: JourneyStep[] = [
  {
    id: 'theme',
    label: 'Package',
    hint: 'Your theme is the package frame',
  },
  {
    id: 'places',
    label: 'Places',
    hint: 'Choose where the package unfolds',
  },
  {
    id: 'itinerary',
    label: 'Itinerary',
    hint: 'Shape the days',
  },
  {
    id: 'cart',
    label: 'Cart',
    hint: 'Review before checkout',
  },
]

function isPackageTheme(item: JourneyItem) {
  return item.kind === 'theme' || item.kind === 'discovery-world'
}

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

function formatUsd(amount: number) {
  return usdFormatter.format(amount)
}

function formatUsdDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

/**
 * Breaks a Designed Trip down into its package frame and each theme committed
 * inside it. The package is priced once, however many themes it holds.
 */
function DesignedTripSummary({ trip }: { trip: DesignedTripSelection }) {
  const segments = designedTripSegments(trip)
  const totalDays = parseInt(trip.packageDuration ?? '', 10)
  const daysUsed = designedTripDaysUsed(trip)
  const openDays = Number.isNaN(totalDays) ? 0 : Math.max(0, totalDays - daysUsed)

  return (
    <div className="myj-designed-trip">
      <ul className="myj-designed-trip__chain">
        <li>
          <span>Package</span>
          <strong>
            {trip.packageName} · {trip.packageDuration}
          </strong>
        </li>
        <li>
          <span>Days set</span>
          <strong>
            {daysUsed}
            {Number.isNaN(totalDays) ? '' : ` of ${totalDays}`}
          </strong>
        </li>
        <li>
          <span>Still open</span>
          <strong>{openDays} Days</strong>
        </li>
      </ul>

      <p className="myj-designed-trip__locked">
        Inclusions locked <span aria-hidden="true">🔒</span>
      </p>

      {segments.map((segment) => (
        <div key={`${segment.themeTitle}-${segment.subPackageName}`} className="myj-designed-trip__segment">
          <p className="myj-designed-trip__segment-head">
            <strong>{segment.themeTitle}</strong>
            <span>
              {segment.subPackageName} · {segment.subPackageDays} Days ({segment.subPackageCoverage})
            </span>
          </p>

          {segment.hotel ? (
            <p className="myj-designed-trip__hotel">
              <span>Hotel</span> {segment.hotel}
            </p>
          ) : null}

          {segment.activities.length > 0 ? (
            <ul className="myj-designed-trip__list">
              {segment.activities.map((activity) => (
                <li key={activity}>{activity}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ))}

      <p className="myj-designed-trip__breakdown">
        {formatUsd(trip.packagePrice)} package
        {segments.map((segment) => (
          <span key={`${segment.themeTitle}-price`}>
            {' '}
            + {formatUsd(segment.subPackagePriceAdd)} {segment.subPackageName}
          </span>
        ))}{' '}
        = <strong>{formatUsd(designedTripTotal(trip))}</strong> per person
      </p>
    </div>
  )
}

function isPackagePlace(item: JourneyItem) {
  return (
    item.kind === 'destination' ||
    item.kind === 'experience' ||
    item.kind === 'region' ||
    item.kind === 'accommodation'
  )
}

export function MyJourneyPage() {
  const { items, confirmRemoveItem } = useJourney()
  const [mode, setMode] = useState<WorkspaceMode>('package')
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [itinerary, setItinerary] = useState<IllustrativeItinerary | undefined>()
  const [isGenerating, setIsGenerating] = useState(false)
  const [companion, setCompanion] = useState<CompanionId | null>(readStoredCompanion)
  const [transport, setTransport] = useState<TransportId | null>(readStoredTransport)
  const [travelDates, setTravelDates] = useState<TravelDates>(readStoredDates)
  const [wantsSecurity, setWantsSecurity] = useState<boolean>(readStoredSecurity)
  const [dismissedDistancePair, setDismissedDistancePair] = useState<string | null>(null)
  const stepsId = useId()

  useEffect(() => {
    writeStoredCompanion(companion)
  }, [companion])

  useEffect(() => {
    writeStoredTransport(transport)
  }, [transport])

  useEffect(() => {
    writeStoredDates(travelDates)
  }, [travelDates])

  useEffect(() => {
    writeStoredSecurity(wantsSecurity)
  }, [wantsSecurity])

  // Security is charged per day of the trip; a single day when no range is set.
  const journeyNights = nightsBetween(travelDates.startDate, travelDates.endDate)
  const securityDays = Math.max(1, journeyNights)
  const securityCost = wantsSecurity ? securityDays * SECURITY_DETAIL_USD_PER_DAY : 0

  const themes = useMemo(() => items.filter(isPackageTheme), [items])
  const destinations = useMemo(() => items.filter((item) => item.kind === 'destination'), [items])
  const experiences = useMemo(() => items.filter((item) => item.kind === 'experience'), [items])
  const accommodations = useMemo(() => items.filter((item) => item.kind === 'accommodation'), [items])
  const regions = useMemo(() => items.filter((item) => item.kind === 'region'), [items])
  const packages = useMemo(() => items.filter((item) => item.kind === 'package'), [items])
  const packagesTotal = useMemo(
    () => packages.reduce((total, item) => total + (item.pricePerPerson ?? 0), 0),
    [packages],
  )
  const placeGroups = useMemo(() => groupJourneyPlaces(items), [items])

  /**
   * A Designed Trip already carries its own hotels, activities and days, so it
   * satisfies the "package" and "places" steps on its own — the traveller does
   * not need to build the journey up from the map.
   */
  const designedTrip = useMemo(
    () => packages.find((item) => item.designedTrip)?.designedTrip,
    [packages],
  )
  const designedSegments = designedTrip ? designedTripSegments(designedTrip) : []
  const hasDesignedTrip = designedSegments.length > 0
  const designedDaysUsed = designedTrip ? designedTripDaysUsed(designedTrip) : 0
  const designedPackageDays = designedTrip ? parseInt(designedTrip.packageDuration ?? '', 10) : NaN
  const designedActivityCount = designedSegments.reduce(
    (total, segment) => total + segment.activities.length,
    0,
  )
  /** The journey is ready to start once a package or places are in place. */
  const journeyReady = hasDesignedTrip || placeGroups.length > 0
  /** Cart shows package composition only — not auto-saved regions/moods/seasons. */
  const cartItems = useMemo(
    () => [...themes, ...destinations, ...experiences, ...accommodations],
    [accommodations, destinations, experiences, themes],
  )
  const packageLineItems = useMemo(
    () => [...destinations, ...experiences, ...accommodations],
    [accommodations, destinations, experiences],
  )
  const placeCount = placeGroups.length
  const otherItems = useMemo(
    () =>
      items.filter(
        (item) => !isPackageTheme(item) && !isPackagePlace(item) && item.kind !== 'package',
      ),
    [items],
  )

  const primaryTheme = themes[0]
  const glance = useMemo(() => buildJourneyGlanceSummary(items), [items])
  const repositoryInput = useMemo(() => adaptSavedItemsToRepositoryInput(items), [items])

  const savedRegionIds = useMemo(() => getSavedRegionIds(items, journeyRegions), [items])
  const savedDestinationIds = useMemo(
    () => orderDestinationIdsEditorially(getSavedDestinationIds(items, journeyRegions)),
    [items],
  )

  // Ordered along the journey (not catalogue order) so the map pins read A, B, C…
  const destinationMarkers = useMemo(
    () =>
      savedDestinationIds
        .map((id) => findCatalogDestinationById(id))
        .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry)),
    [savedDestinationIds],
  )

  const { route: drivingRoute } = useJourneyRoute(savedDestinationIds)

  const constellationDestinationIds =
    savedDestinationIds.length >= 2 ? savedDestinationIds : []

  const distanceAdvisory = useMemo(() => checkJourneyDistances(savedDestinationIds), [savedDestinationIds])
  const distancePairKey = distanceAdvisory ? `${distanceAdvisory.from}::${distanceAdvisory.to}` : null
  const showDistanceAdvisory = Boolean(distanceAdvisory) && distancePairKey !== dismissedDistancePair

  const completedSteps = useMemo(() => {
    const done = new Set<JourneyStep['id']>()
    if (themes.length > 0) {
      done.add('theme')
    }
    if (placeGroups.length > 0) {
      done.add('places')
    }
    if (itinerary && itinerary.segments.length >= 2) {
      done.add('itinerary')
    }
    if (placeGroups.length > 0) {
      done.add('cart')
    }
    return done
  }, [itinerary, placeGroups.length, themes.length])

  const activeStep: JourneyStep['id'] =
    mode === 'itinerary' || mode === 'edit' || mode === 'builder'
      ? 'itinerary'
      : placeGroups.length === 0
        ? themes.length === 0
          ? 'theme'
          : 'places'
        : 'places'

  useEffect(() => {
    let cancelled = false

    async function loadItinerary() {
      if (items.length === 0 || destinations.length + regions.length < 1) {
        setItinerary(undefined)
        return
      }

      setIsGenerating(true)
      const result = await journeyRepository.generateIllustrativeItinerary(
        {
          savedItemIds: repositoryInput.savedItemIds,
          regionIds: repositoryInput.regionIds,
        },
        items,
      )

      if (!cancelled) {
        setItinerary(result && result.segments.length >= 2 ? result : undefined)
        setIsGenerating(false)
      }
    }

    void loadItinerary()
    return () => {
      cancelled = true
    }
  }, [destinations.length, items, regions.length, repositoryInput])

  const openCart = useCallback(() => setIsCartOpen(true), [])
  const closeCart = useCallback(() => setIsCartOpen(false), [])

  const handleGenerateItinerary = useCallback(() => {
    setMode('itinerary')
  }, [])

  if (items.length === 0) {
    return (
      <main className="my-journey-unified-page journey-workspace">
        <section className="journey-workspace__intro">
          <div className="my-journey-unified-page__container">
            <p className="journey-workspace__eyebrow">My Journey</p>
            <h1>Compose your package</h1>
            <p>
              Themes are packages. Start on Expectations, choose a theme, add the places that belong,
              then return here to shape the days.
            </p>
            <div className="journey-workspace__empty-actions">
              <a className="journey-workspace__cta" href="/expectations">
                Choose a theme package
              </a>
              <button className="journey-workspace__cart-btn is-empty" type="button" disabled>
                Cart · 0
              </button>
            </div>
          </div>
        </section>

        <section className="my-journey-unified-page__container journey-workspace__empty">
          <ol className="journey-workspace__steps" aria-label="How your journey is composed">
            {STEPS.map((step, index) => (
              <li key={step.id}>
                <span>Step {String(index + 1).padStart(2, '0')}</span>
                <div>
                  <strong>{step.label}</strong>
                  <p>{step.hint}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </main>
    )
  }

  return (
    <main className="my-journey-unified-page journey-workspace">
      <section className="journey-workspace__intro">
        <div className="my-journey-unified-page__container journey-workspace__intro-row">
          <div>
            <p className="journey-workspace__eyebrow">My Journey</p>
            <h1>{primaryTheme ? primaryTheme.label : 'Your package'}</h1>
            <p>
              {primaryTheme
                ? `${primaryTheme.label} is your package. Add or remove places, then shape the itinerary.`
                : 'Add a theme from Expectations to define the package, then choose places inside it.'}
            </p>
          </div>
          <button
            className="journey-workspace__cart-btn"
            type="button"
            onClick={openCart}
            aria-haspopup="dialog"
            aria-label={`Cart with ${placeCount} ${placeCount === 1 ? 'place' : 'places'} and ${experiences.length} ${experiences.length === 1 ? 'encounter' : 'encounters'}`}
          >
            Cart · {placeCount}
          </button>
        </div>
      </section>

      <div className="my-journey-unified-page__container">
        <nav className="journey-workspace__stepper" aria-labelledby={stepsId}>
          <p id={stepsId} className="journey-workspace__stepper-label">
            Clear next steps
          </p>
          <ol>
            {STEPS.map((step, index) => {
              const isComplete = completedSteps.has(step.id)
              const isActive = activeStep === step.id || (step.id === 'cart' && isCartOpen)
              const stepHint =
                step.id === 'places' && placeCount > 0
                  ? `${placeCount} ${placeCount === 1 ? 'place' : 'places'} in this package`
                  : step.id === 'places' && placeCount === 0
                    ? 'No places chosen yet'
                    : step.hint

              return (
                <li
                  key={step.id}
                  className={`${isComplete ? 'is-complete' : ''}${isActive ? ' is-active' : ''}`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (step.id === 'cart') {
                        openCart()
                        return
                      }
                      if (step.id === 'itinerary') {
                        setMode('itinerary')
                        return
                      }
                      setMode('package')
                    }}
                  >
                    <span>Step {String(index + 1).padStart(2, '0')}</span>
                    <strong>{step.label}</strong>
                    <em>{stepHint}</em>
                  </button>
                </li>
              )
            })}
          </ol>
        </nav>

        <div className="journey-workspace__layout">
          <section className="journey-workspace__package" aria-labelledby="package-heading">
            <header>
              {hasDesignedTrip && designedTrip ? (
                <>
                  <p>Designed Trip</p>
                  <h2 id="package-heading">{designedTrip.packageName}</h2>
                  <p className="journey-workspace__lede">
                    {designedSegments.map((segment) => segment.themeTitle).join(' · ')} — hotels and
                    days are already set for you.
                  </p>
                </>
              ) : (
                <>
                  <p>Theme = package</p>
                  <h2 id="package-heading">
                    {primaryTheme ? primaryTheme.label : 'No package theme yet'}
                  </h2>
                  <p className="journey-workspace__lede">
                    {glance.themeEditorialLine ||
                      'Return to Expectations and open a theme package map to begin.'}
                  </p>
                </>
              )}
            </header>

            {themes.length > 1 ? (
              <ul className="journey-workspace__theme-list" aria-label="Package themes">
                {themes.map((theme) => (
                  <li key={theme.id}>
                    <span>{theme.label}</span>
                    <button type="button" onClick={() => confirmRemoveItem(theme.id)}>
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}

            {packages.length > 0 ? (
              <div className="myj-packages">
                <div className="myj-places-head">
                  <h3>Selected Package{packages.length > 1 ? 's' : ''}</h3>
                  <a href="/itineraries">Browse Itineraries</a>
                </div>
                <ul className="myj-package-list">
                  {packages.map((pkg) => (
                    <li key={pkg.id}>
                      <div className="myj-package-main">
                        <p className="myj-package-name">{pkg.label}</p>
                        {pkg.detail ? <p className="myj-package-detail">{pkg.detail}</p> : null}
                        {pkg.designedTrip ? (
                          <DesignedTripSummary trip={pkg.designedTrip} />
                        ) : null}
                      </div>
                      <div className="myj-package-side">
                        {typeof pkg.pricePerPerson === 'number' ? (
                          <span className="myj-package-price">
                            {formatUsd(pkg.pricePerPerson)}
                            <small>per person</small>
                          </span>
                        ) : null}
                        <button type="button" onClick={() => confirmRemoveItem(pkg.id)}>
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="myj-package-total">
                  <span>Indicative total</span>
                  <strong>{formatUsd(packagesTotal)} per person</strong>
                </p>
                <p className="myj-package-note">
                  Indicative pricing — your concierge confirms the final figure before anything is
                  booked.
                </p>
              </div>
            ) : null}

            <div className="myj-places">
              <div className="myj-places-head">
                <h3>Places In This Journey</h3>
                <a href="/expectations">
                  {hasDesignedTrip ? 'Add optional places' : 'Add more places'}
                </a>
              </div>

              {placeGroups.length === 0 && hasDesignedTrip ? (
                <div className="myj-places-covered">
                  <p className="myj-places-covered__lead">
                    Your package already covers where you stay.
                  </p>
                  <ul className="myj-places-covered__list">
                    {designedSegments.map((segment) => (
                      <li key={`${segment.themeTitle}-${segment.hotel}`}>
                        <strong>{segment.hotel}</strong>
                        <span>
                          {segment.themeTitle} · {segment.subPackageDays} days
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="myj-places-covered__note">
                    Nothing more is required. If you would like to add places for the open days, the
                    map explorer is there for it.
                  </p>
                </div>
              ) : placeGroups.length === 0 ? (
                <div className="journey-workspace__callout">
                  <p>Your journey needs places.</p>
                  <span>
                    Open a theme on Expectations, explore the map, and add the hotels or things to do
                    that belong.
                  </span>
                  <a href="/expectations">Open the map explorer</a>
                </div>
              ) : (
                <div className="myj-place-groups">
                  {placeGroups.map((group) => (
                    <article className="myj-place-group" key={group.placeName}>
                      <header className="myj-place-group-header">
                        <PlaceHoverPreview placeName={group.placeName}>
                          <h4>{group.placeName}</h4>
                        </PlaceHoverPreview>
                      </header>

                      {group.accommodations.length > 0 ? (
                        <div className="myj-place-section">
                          <p className="myj-place-section-label">Where To Stay</p>
                          <ul className="myj-place-item-list">
                            {group.accommodations.map((item) => (
                              <li key={item.id}>
                                <div>
                                  <strong>{item.label}</strong>
                                  {item.detail ? <span>{item.detail}</span> : null}
                                </div>
                                <button type="button" onClick={() => confirmRemoveItem(item.id)}>
                                  Remove
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      {group.activities.length > 0 ? (
                        <div className="myj-place-section">
                          <p className="myj-place-section-label">Things To Do</p>
                          <ul className="myj-place-item-list myj-place-item-list--compact">
                            {group.activities.map((item) => (
                              <li key={item.id}>
                                <strong>{item.label}</strong>
                                <button type="button" onClick={() => confirmRemoveItem(item.id)}>
                                  Remove
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </article>
                  ))}
                </div>
              )}
            </div>

            {showDistanceAdvisory && distanceAdvisory ? (
              <DistanceAdvisoryBanner
                advisory={distanceAdvisory}
                onKeepSelection={() => setDismissedDistancePair(distancePairKey)}
              />
            ) : null}

            <TravelCompanionsSection selected={companion} onSelect={setCompanion} />
            <RoadTransportSection selected={transport} onSelect={setTransport} />

            <section className="myj-preference-section myj-dates" aria-labelledby="myj-dates-head">
              <div className="myj-preference-head">
                <h3 id="myj-dates-head">When Will You Travel?</h3>
                <p>
                  Tell us your preferred dates and party size so your concierge can hold the right
                  dates.
                </p>
              </div>
              <div className="myj-dates-fields">
                <label>
                  <span>Start date</span>
                  <input
                    type="date"
                    value={travelDates.startDate}
                    onChange={(event) =>
                      setTravelDates((current) => ({ ...current, startDate: event.target.value }))
                    }
                  />
                </label>
                <label>
                  <span>End date</span>
                  <input
                    type="date"
                    // Cannot end before it begins.
                    min={travelDates.startDate || undefined}
                    value={travelDates.endDate}
                    onChange={(event) =>
                      setTravelDates((current) => ({ ...current, endDate: event.target.value }))
                    }
                  />
                </label>
                <label>
                  <span>Travellers</span>
                  <input
                    type="number"
                    min={1}
                    max={40}
                    value={travelDates.travellers}
                    onChange={(event) =>
                      setTravelDates((current) => ({
                        ...current,
                        travellers: Math.max(1, Math.floor(Number(event.target.value) || 1)),
                      }))
                    }
                  />
                </label>
              </div>
              {journeyNights > 0 ? (
                <p className="myj-dates-duration">
                  {journeyNights} {journeyNights === 1 ? 'night' : 'nights'} on the island.
                </p>
              ) : null}
            </section>

            <section
              className={`myj-preference-section myj-security${wantsSecurity ? ' is-selected' : ''}`}
              aria-labelledby="myj-security-head"
            >
              <div className="myj-preference-head">
                <h3 id="myj-security-head">Personal Security Detail</h3>
                <p>
                  Discreet close protection for the length of your journey, arranged through vetted
                  personnel. Added to your journey at a separate cost.
                </p>
              </div>

              <label className="myj-security-option">
                <input
                  type="checkbox"
                  checked={wantsSecurity}
                  onChange={(event) => setWantsSecurity(event.target.checked)}
                />
                <span className="myj-security-copy">
                  <span className="myj-security-title">Add a personal security detail</span>
                  <span className="myj-security-price">
                    {formatUsd(SECURITY_DETAIL_USD_PER_DAY)} per day
                    {wantsSecurity ? ` · ${securityDays} ${securityDays === 1 ? 'day' : 'days'}` : ''}
                  </span>
                </span>
                {wantsSecurity ? (
                  <span className="myj-security-total">{formatUsd(securityCost)}</span>
                ) : null}
              </label>

              <p className="myj-security-note">
                Indicative pricing. Final cost is confirmed by your concierge once dates and party
                size are fixed.
              </p>
            </section>

            <HealthInsuranceCard />

            <div className="journey-workspace__next">
              <h3>Next</h3>
              <div className="journey-workspace__actions">
                <a
                  className={`myj-start-journey${journeyReady ? '' : ' is-disabled'}`}
                  href={journeyReady ? '/checkout' : undefined}
                  aria-disabled={!journeyReady}
                >
                  Start Journey
                </a>
                <button
                  className="journey-workspace__ghost"
                  type="button"
                  onClick={handleGenerateItinerary}
                  disabled={placeGroups.length === 0}
                >
                  {itinerary ? 'View itinerary' : 'Generate itinerary'}
                </button>
                <button
                  className="journey-workspace__ghost"
                  type="button"
                  onClick={() => setMode('edit')}
                  disabled={!itinerary}
                >
                  Edit itinerary
                </button>
                <button
                  className="journey-workspace__ghost"
                  type="button"
                  onClick={() => setMode('builder')}
                >
                  Custom builder
                </button>
                <button className="journey-workspace__ghost" type="button" onClick={openCart}>
                  Add to cart
                </button>
              </div>
              {!journeyReady ? (
                <p className="journey-workspace__hint">
                  Choose a designed package, or add at least one place, before starting your journey.
                </p>
              ) : null}
            </div>
          </section>

          <aside className="journey-workspace__side">
            {savedDestinationIds.length > 0 || savedRegionIds.length > 0 ? (
              <div className="journey-workspace__map">
                <TravelMap>
                  {(map) => (
                    <>
                      <JourneyRegionLayer
                        map={map}
                        recommendedRegionIds={savedRegionIds}
                        regions={journeyRegions.filter((region) => savedRegionIds.includes(region.id))}
                        onRegionSelect={() => undefined}
                      />
                      {destinationMarkers.map(({ region, destination }, index) => (
                        <RouteStopMarker
                          key={`${region.id}-${destination.id}`}
                          destination={destination}
                          map={map}
                          index={index}
                        />
                      ))}
                      {constellationDestinationIds.length >= 2 ? (
                        <JourneyConstellationLayer
                          map={map}
                          destinationIds={constellationDestinationIds}
                          routeCoordinates={drivingRoute?.coordinates}
                        />
                      ) : null}
                    </>
                  )}
                </TravelMap>
              </div>
            ) : (
              <div className="journey-workspace__map-empty">
                <p>Your package map appears once places are saved.</p>
              </div>
            )}

            <div className="journey-workspace__panel">
              {mode === 'package' ? (
                <>
                  <h3>Journey summary</h3>
                  {/* Headline: what has been chosen, and what it comes to. */}
                  <div className="myj-sum-hero">
                    <p className="myj-sum-hero__label">
                      {hasDesignedTrip && designedTrip ? 'Designed Trip' : 'Your Journey'}
                    </p>
                    <p className="myj-sum-hero__name">
                      {hasDesignedTrip && designedTrip
                        ? designedTrip.packageName
                        : (primaryTheme?.label ?? 'Not yet shaped')}
                    </p>
                    {packagesTotal + securityCost > 0 ? (
                      <p className="myj-sum-hero__total">
                        {formatUsd(packagesTotal + securityCost)}
                        <small>per person</small>
                      </p>
                    ) : null}
                  </div>

                  <div className="myj-sum-group">
                    <p className="myj-sum-group__title">The Journey</p>
                    <dl className="myj-sum-list">
                      {hasDesignedTrip && designedTrip ? (
                        <>
                          <div>
                            <dt>Themes</dt>
                            <dd>{designedSegments.map((s) => s.themeTitle).join(', ')}</dd>
                          </div>
                          <div>
                            <dt>Days set</dt>
                            <dd>
                              {designedDaysUsed}
                              {Number.isNaN(designedPackageDays) ? '' : ` of ${designedPackageDays}`}
                            </dd>
                          </div>
                          <div>
                            <dt>Hotels</dt>
                            <dd>{designedSegments.length}</dd>
                          </div>
                        </>
                      ) : (
                        <div>
                          <dt>Theme</dt>
                          <dd>{primaryTheme?.label ?? 'Not set'}</dd>
                        </div>
                      )}
                      <div>
                        <dt>Stops</dt>
                        <dd>{placeGroups.length + designedSegments.length}</dd>
                      </div>
                      <div>
                        <dt>Activities</dt>
                        <dd>{experiences.length + designedActivityCount}</dd>
                      </div>
                      {drivingRoute ? (
                        <>
                          <div>
                            <dt>Driving</dt>
                            <dd>{drivingRoute.distanceKm} km</dd>
                          </div>
                          <div>
                            <dt>Est. time</dt>
                            <dd>{formatDrivingDuration(drivingRoute.durationMinutes)}</dd>
                          </div>
                        </>
                      ) : null}
                    </dl>
                  </div>

                  <div className="myj-sum-group">
                    <p className="myj-sum-group__title">The Dates</p>
                    <dl className="myj-sum-list">
                      <div>
                        <dt>Start</dt>
                        <dd>
                          {travelDates.startDate ? formatUsdDate(travelDates.startDate) : 'Not set'}
                        </dd>
                      </div>
                      <div>
                        <dt>End</dt>
                        <dd>
                          {travelDates.endDate ? formatUsdDate(travelDates.endDate) : 'Not set'}
                        </dd>
                      </div>
                      {journeyNights > 0 ? (
                        <div>
                          <dt>Nights</dt>
                          <dd>{journeyNights}</dd>
                        </div>
                      ) : null}
                      <div>
                        <dt>Travellers</dt>
                        <dd>{travelDates.travellers}</dd>
                      </div>
                    </dl>
                  </div>

                  <div className="myj-sum-group">
                    <p className="myj-sum-group__title">The Arrangements</p>
                    <dl className="myj-sum-list">
                      <div>
                        <dt>Travelling with</dt>
                        <dd>
                          {companionOptions.find((option) => option.id === companion)?.label ??
                            'Not set'}
                        </dd>
                      </div>
                      <div>
                        <dt>Transport</dt>
                        <dd>
                          {transportOptions.find((option) => option.id === transport)?.label ??
                            'Not set'}
                        </dd>
                      </div>
                      <div>
                        <dt>Health insurance</dt>
                        <dd className="is-included">Included</dd>
                      </div>
                      <div>
                        <dt>Security detail</dt>
                        <dd>{wantsSecurity ? `${formatUsd(securityCost)} added` : 'Not added'}</dd>
                      </div>
                    </dl>
                  </div>

                  {packagesTotal + securityCost > 0 ? (
                    <div className="myj-sum-total">
                      <span>Indicative total</span>
                      <strong>{formatUsd(packagesTotal + securityCost)}</strong>
                    </div>
                  ) : null}

                  <p className="myj-sum-note">{ILLUSTRATIVE_DISCLAIMER}</p>
                </>
              ) : null}

              {mode === 'itinerary' ? (
                <>
                  <h3>Itinerary</h3>
                  {isGenerating ? <p>Composing an outline…</p> : null}
                  {!isGenerating && itinerary ? (
                    <div className="journey-workspace__itinerary">
                      {itinerary.segments.map((segment) => (
                        <article key={`${segment.dayLabel}-${segment.regionName}`}>
                          <span>{segment.dayLabel}</span>
                          <strong>{segment.regionName}</strong>
                          <p>{segment.summary}</p>
                        </article>
                      ))}
                      <p className="journey-workspace__note">{itinerary.note}</p>
                      <div className="journey-workspace__actions is-compact">
                        <button
                          className="journey-workspace__ghost"
                          type="button"
                          onClick={() => setMode('edit')}
                        >
                          Edit
                        </button>
                        <button className="journey-workspace__cta" type="button" onClick={openCart}>
                          Add to cart
                        </button>
                      </div>
                    </div>
                  ) : null}
                  {!isGenerating && !itinerary ? (
                    <div className="journey-workspace__callout">
                      <p>Need a little more geography.</p>
                      <span>Add another place or region so a day sequence can form.</span>
                      <a href="/expectations">Add more places</a>
                    </div>
                  ) : null}
                </>
              ) : null}

              {mode === 'edit' ? (
                <>
                  <h3>Edit itinerary</h3>
                  <p>
                    Adjust the outline of your package. For now, remove places that no longer belong,
                    then regenerate.
                  </p>
                  <ul className="journey-workspace__edit-list">
                    {itinerary?.segments.map((segment) => (
                      <li key={`${segment.dayLabel}-${segment.regionName}`}>
                        <strong>
                          {segment.dayLabel} · {segment.regionName}
                        </strong>
                        <span>{segment.summary}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="journey-workspace__actions is-compact">
                    <button
                      className="journey-workspace__ghost"
                      type="button"
                      onClick={() => setMode('itinerary')}
                    >
                      Back to itinerary
                    </button>
                    <a className="journey-workspace__ghost" href="/expectations">
                      Swap places
                    </a>
                  </div>
                </>
              ) : null}

              {mode === 'builder' ? (
                <>
                  <h3>Custom builder</h3>
                  <p>
                    Build day by day around your package theme. This workspace will grow into full
                    custom sequencing; for now, use places as the building blocks.
                  </p>
                  <ul className="journey-workspace__builder-blocks">
                    {packageLineItems.map((item) => (
                      <li key={item.id}>
                        <strong>{item.label}</strong>
                        <span>
                          {item.kind === 'destination'
                            ? 'Place block'
                            : item.kind === 'accommodation'
                              ? 'Stay block'
                              : 'Encounter block'}
                        </span>
                      </li>
                    ))}
                  </ul>
                  {packageLineItems.length === 0 ? (
                    <a href="/expectations">Add places to build with</a>
                  ) : (
                    <div className="journey-workspace__actions is-compact">
                      <button
                        className="journey-workspace__cta"
                        type="button"
                        onClick={() => setMode('itinerary')}
                      >
                        Apply to itinerary
                      </button>
                      <button className="journey-workspace__ghost" type="button" onClick={openCart}>
                        Add to cart
                      </button>
                    </div>
                  )}
                </>
              ) : null}
            </div>
          </aside>
        </div>

        {otherItems.length > 0 ? (
          <section className="journey-workspace__extras" aria-label="Other saved preferences">
            <h3>Also saved</h3>
            <ul>
              {otherItems.map((item) => (
                <li key={item.id}>
                  <span>{item.label}</span>
                  <button type="button" onClick={() => confirmRemoveItem(item.id)}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>

      {isCartOpen ? (
        <JourneyCartPopup
          items={cartItems}
          themeLabel={primaryTheme?.label}
          placeCount={placeCount}
          encounterCount={experiences.length}
          hasItinerary={Boolean(itinerary)}
          onClose={closeCart}
          onRemove={confirmRemoveItem}
        />
      ) : null}
    </main>
  )
}
