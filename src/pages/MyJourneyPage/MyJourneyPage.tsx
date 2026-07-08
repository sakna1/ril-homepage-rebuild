import { useCallback, useEffect, useId, useMemo, useState } from 'react'
import { JourneyConstellationLayer } from '../../components/Map/JourneyConstellationLayer'
import { JourneyRegionLayer } from '../../components/Map/JourneyRegionLayer'
import { RegionDestinationMarker } from '../../components/Map/RegionDestinationMarker'
import { TravelMap } from '../../components/Map/TravelMap'
import type { IllustrativeItinerary } from '../../data/journey/types'
import { ILLUSTRATIVE_DISCLAIMER } from '../../data/journey/mockJourneyTypes'
import { journeyRegions } from '../../data/journeyRegions'
import { getSavedDestinationIds, getSavedRegionIds } from '../../journey/contextualRecommendations'
import type { JourneyItem } from '../../journey/JourneyContext'
import { useJourney } from '../../journey/useJourney'
import {
  buildJourneyGlanceSummary,
  getTravellerFacingDetail,
} from '../../journey/savedJourneyDisplay'
import { orderDestinationIdsEditorially } from '../../journey/savedPlaceResolution'
import {
  adaptSavedItemsToRepositoryInput,
  journeyRepository,
} from '../../services/journeyRepository'
import { JourneyCartPopup } from './JourneyCartPopup'
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

function isPackagePlace(item: JourneyItem) {
  return item.kind === 'destination' || item.kind === 'experience' || item.kind === 'region'
}

export function MyJourneyPage() {
  const { items, confirmRemoveItem } = useJourney()
  const [mode, setMode] = useState<WorkspaceMode>('package')
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [itinerary, setItinerary] = useState<IllustrativeItinerary | undefined>()
  const [isGenerating, setIsGenerating] = useState(false)
  const stepsId = useId()

  const themes = useMemo(() => items.filter(isPackageTheme), [items])
  const places = useMemo(
    () => items.filter((item) => item.kind === 'destination' || item.kind === 'experience'),
    [items],
  )
  const destinations = useMemo(() => items.filter((item) => item.kind === 'destination'), [items])
  const experiences = useMemo(() => items.filter((item) => item.kind === 'experience'), [items])
  const regions = useMemo(() => items.filter((item) => item.kind === 'region'), [items])
  /** Cart shows package composition only — not auto-saved regions/moods/seasons. */
  const cartItems = useMemo(() => [...themes, ...destinations, ...experiences], [destinations, experiences, themes])
  const placeCount = destinations.length
  const otherItems = useMemo(
    () => items.filter((item) => !isPackageTheme(item) && !isPackagePlace(item)),
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

  const destinationMarkers = useMemo(
    () =>
      journeyRegions.flatMap((region) =>
        region.destinations
          .filter((destination) => savedDestinationIds.includes(destination.id))
          .map((destination) => ({ region, destination })),
      ),
    [savedDestinationIds],
  )

  const constellationDestinationIds =
    savedDestinationIds.length >= 2 ? savedDestinationIds : []

  const completedSteps = useMemo(() => {
    const done = new Set<JourneyStep['id']>()
    if (themes.length > 0) {
      done.add('theme')
    }
    if (places.length > 0) {
      done.add('places')
    }
    if (itinerary && itinerary.segments.length >= 2) {
      done.add('itinerary')
    }
    if (places.length > 0) {
      done.add('cart')
    }
    return done
  }, [itinerary, places.length, themes.length])

  const activeStep: JourneyStep['id'] =
    mode === 'itinerary' || mode === 'edit' || mode === 'builder'
      ? 'itinerary'
      : places.length === 0
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
              <p>Theme = package</p>
              <h2 id="package-heading">
                {primaryTheme ? primaryTheme.label : 'No package theme yet'}
              </h2>
              <p className="journey-workspace__lede">
                {glance.themeEditorialLine ||
                  'Return to Expectations and open a theme package map to begin.'}
              </p>
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

            <div className="journey-workspace__places">
              <div className="journey-workspace__places-head">
                <h3>Places in this package</h3>
                <a href="/expectations">Add more places</a>
              </div>

              {places.length === 0 ? (
                <div className="journey-workspace__callout">
                  <p>Your package needs places.</p>
                  <span>
                    Open the theme on Expectations, highlight companions on the map, and add what
                    belongs.
                  </span>
                  <a href="/expectations">Open package map</a>
                </div>
              ) : (
                <ul className="journey-workspace__place-list">
                  {destinations.map((item) => (
                    <li key={item.id}>
                      <div>
                        <strong>{item.label}</strong>
                        <span>Place</span>
                        {item.parentTheme ? <small>In {item.parentTheme}</small> : null}
                        {getTravellerFacingDetail(item) ? (
                          <p>{getTravellerFacingDetail(item)}</p>
                        ) : null}
                      </div>
                      <button type="button" onClick={() => confirmRemoveItem(item.id)}>
                        Remove
                      </button>
                    </li>
                  ))}
                  {experiences.map((item) => (
                    <li key={item.id}>
                      <div>
                        <strong>{item.label}</strong>
                        <span>Encounter</span>
                        {item.parentTheme ? <small>In {item.parentTheme}</small> : null}
                      </div>
                      <button type="button" onClick={() => confirmRemoveItem(item.id)}>
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="journey-workspace__next">
              <h3>Next</h3>
              <div className="journey-workspace__actions">
                <button
                  className="journey-workspace__cta"
                  type="button"
                  onClick={handleGenerateItinerary}
                  disabled={places.length === 0}
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
              {places.length === 0 ? (
                <p className="journey-workspace__hint">Add at least one place before generating days.</p>
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
                      {destinationMarkers.map(({ region, destination }) => (
                        <RegionDestinationMarker
                          key={`${region.id}-${destination.id}`}
                          destination={destination}
                          map={map}
                          onSelect={() => undefined}
                        />
                      ))}
                      {constellationDestinationIds.length >= 2 ? (
                        <JourneyConstellationLayer
                          map={map}
                          destinationIds={constellationDestinationIds}
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
                  <h3>Package summary</h3>
                  <dl>
                    <div>
                      <dt>Theme</dt>
                      <dd>{primaryTheme?.label ?? 'Not set'}</dd>
                    </div>
                    <div>
                      <dt>Places</dt>
                      <dd>{destinations.length}</dd>
                    </div>
                    <div>
                      <dt>Encounters</dt>
                      <dd>{experiences.length}</dd>
                    </div>
                  </dl>
                  <p>{ILLUSTRATIVE_DISCLAIMER}</p>
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
                    {places.map((item) => (
                      <li key={item.id}>
                        <strong>{item.label}</strong>
                        <span>{item.kind === 'destination' ? 'Place block' : 'Encounter block'}</span>
                      </li>
                    ))}
                  </ul>
                  {places.length === 0 ? (
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
