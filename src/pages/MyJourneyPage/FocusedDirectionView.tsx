import { useEffect, useMemo, useRef, useState } from 'react'
import { JourneyConstellationLayer } from '../../components/Map/JourneyConstellationLayer'
import { JourneyRegionLayer } from '../../components/Map/JourneyRegionLayer'
import { RegionDestinationMarker } from '../../components/Map/RegionDestinationMarker'
import { TravelMap } from '../../components/Map/TravelMap'
import type {
  IllustrativeItinerary,
  SignatureJourney,
  SuggestedRhythmResult,
  TravelConnection,
} from '../../data/journey/types'
import { ILLUSTRATIVE_DISCLAIMER } from '../../data/journey/mockJourneyTypes'
import { journeyRegions } from '../../data/journeyRegions'
import { getContextualRecommendations, getSavedDestinationIds } from '../../journey/contextualRecommendations'
import {
  buildDirectionsFromSavedItems,
  getDirectionById,
  getDirectionRegionIds,
} from '../../journey/journeyDirections'
import { useJourney } from '../../journey/useJourney'
import { orderDestinationIdsEditorially } from '../../journey/savedPlaceResolution'
import {
  adaptSavedItemsToRepositoryInput,
  journeyRepository,
} from '../../services/journeyRepository'
import { ContextualRecommendations } from './ContextualRecommendations'
import { IllustrativeItineraryPreview } from './IllustrativeItineraryPreview'

type FocusedDirectionViewProps = {
  directionId: string
  onClose: () => void
}

const ROUTE_FORMING_MESSAGE =
  'The places you have saved are beginning to form a direction. Final routing is shaped personally around pace, season, and the details that matter to you.'

const CONTINUE_EXPLORING_MESSAGE =
  'Continue exploring to add places that sit naturally alongside what you have already saved.'

export function FocusedDirectionView({ directionId, onClose }: FocusedDirectionViewProps) {
  const { items, confirmRemoveItem } = useJourney()
  const headingRef = useRef<HTMLHeadingElement>(null)
  const [rhythm, setRhythm] = useState<SuggestedRhythmResult | undefined>()
  const [itinerary, setItinerary] = useState<IllustrativeItinerary | undefined>()
  const [connections, setConnections] = useState<TravelConnection[]>([])
  const [signatureJourneys, setSignatureJourneys] = useState<SignatureJourney[]>([])
  const [showRhythmReason, setShowRhythmReason] = useState(false)

  const direction = getDirectionById(directionId)
  const { directions } = useMemo(() => buildDirectionsFromSavedItems(items), [items])
  const directionView = directions.find((entry) => entry.id === directionId)

  const directionItems = useMemo(
    () => directionView?.entries.map(({ item }) => item) ?? [],
    [directionView],
  )

  const scopedItems = useMemo(() => {
    const themeItem = items.find(
      (item) =>
        (item.kind === 'theme' || item.kind === 'discovery-world') &&
        (item.label === direction?.title),
    )
    return themeItem ? [themeItem, ...directionItems] : directionItems
  }, [direction?.title, directionItems, items])

  const directionRegionIds = useMemo(
    () => getDirectionRegionIds(directionId, items),
    [directionId, items],
  )

  const savedDestinationIds = useMemo(
    () => orderDestinationIdsEditorially(getSavedDestinationIds(scopedItems, journeyRegions)),
    [scopedItems],
  )

  const repositoryInput = useMemo(
    () => adaptSavedItemsToRepositoryInput(scopedItems),
    [scopedItems],
  )

  const recommendationGroup = useMemo(
    () => getContextualRecommendations('theme', items, { themeId: directionId }),
    [directionId, items],
  )

  useEffect(() => {
    headingRef.current?.focus()
  }, [directionId])

  useEffect(() => {
    let cancelled = false

    async function loadDirectionInsights() {
      if (!directionView) {
        return
      }

      const rhythmResult = await journeyRepository.getSuggestedRhythm(
        repositoryInput.savedItemIds,
        scopedItems,
      )
      const hasValidRhythm = Boolean(rhythmResult && rhythmResult.sequence.length >= 2)
      const itineraryResult = await journeyRepository.generateIllustrativeItinerary(
        {
          savedItemIds: repositoryInput.savedItemIds,
          regionIds: directionRegionIds.length > 0 ? directionRegionIds : repositoryInput.regionIds,
          rhythmId: hasValidRhythm ? rhythmResult?.rhythmId : undefined,
        },
        scopedItems,
      )
      const connectionResult = await journeyRepository.getTravelConnectionsForDestinations(
        repositoryInput.destinationIds,
      )
      const journeys = await journeyRepository.getSignatureJourneysForTheme(directionId)

      if (!cancelled) {
        setRhythm(hasValidRhythm ? rhythmResult : undefined)
        setItinerary(
          itineraryResult && itineraryResult.segments.length >= 2 ? itineraryResult : undefined,
        )
        setConnections(connectionResult)
        setSignatureJourneys(journeys)
      }
    }

    void loadDirectionInsights()

    return () => {
      cancelled = true
    }
  }, [directionId, directionRegionIds, directionView, repositoryInput, scopedItems])

  const destinationMarkers = useMemo(
    () =>
      journeyRegions.flatMap((region) =>
        region.destinations
          .filter((destination) => savedDestinationIds.includes(destination.id))
          .map((destination) => ({ region, destination })),
      ),
    [savedDestinationIds],
  )

  const constellationDestinationIds = useMemo(
    () => (savedDestinationIds.length >= 2 ? savedDestinationIds : []),
    [savedDestinationIds],
  )

  const hasValidRhythm = Boolean(rhythm && rhythm.sequence.length >= 2)
  const hasValidItinerary = Boolean(itinerary && itinerary.segments.length >= 2)
  const mappedDestinationCount = savedDestinationIds.length

  if (!direction || !directionView) {
    return (
      <div className="focused-direction focused-direction--missing">
        <p>This direction is no longer in your saved journey.</p>
        <button type="button" onClick={onClose}>
          Return to your directions
        </button>
      </div>
    )
  }

  return (
    <section className="focused-direction" aria-labelledby="focused-direction-heading">
      <button type="button" className="focused-direction__back" onClick={onClose}>
        Return to all saved directions
      </button>

      <header className="focused-direction__header">
        <h2 id="focused-direction-heading" ref={headingRef} tabIndex={-1}>
          {direction.title}
        </h2>
        <p>{direction.description}</p>
      </header>

      {directionView.entries.length > 0 ? (
        <div className="focused-direction__saved">
          <h3>Saved along this direction</h3>
          <ul>
            {directionView.entries.map(({ item, relationshipLabel }) => (
              <li key={item.id}>
                <div>
                  <strong>{item.label}</strong>
                  {relationshipLabel ? <small>{relationshipLabel}</small> : null}
                </div>
                <button
                  type="button"
                  aria-label={`Remove ${item.label} from My Journey`}
                  onClick={() => confirmRemoveItem(item.id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="focused-direction__map">
        <h3>The island through this direction</h3>
        <div className="saved-journey-tab__map">
          <TravelMap>
            {(map) => (
              <>
                <JourneyRegionLayer
                  map={map}
                  recommendedRegionIds={directionRegionIds}
                  regions={journeyRegions.filter((region) => directionRegionIds.includes(region.id))}
                  onRegionSelect={() => {
                    /* focused direction overview */
                  }}
                />
                {destinationMarkers.map(({ region, destination }) => (
                  <RegionDestinationMarker
                    key={`${region.id}-${destination.id}`}
                    destination={destination}
                    map={map}
                    onSelect={() => {
                      /* focused direction overview */
                    }}
                  />
                ))}
                {constellationDestinationIds.length >= 2 ? (
                  <JourneyConstellationLayer map={map} destinationIds={constellationDestinationIds} />
                ) : null}
              </>
            )}
          </TravelMap>
        </div>
        {connections.length > 0 ? (
          <div className="saved-journey-tab__connections" aria-label="Illustrative transfer rhythms">
            <p className="saved-journey-tab__connections-label">Illustrative transfer rhythm</p>
            <ul>
              {connections.map((connection) => (
                <li key={connection.id}>
                  <span>{connection.durationLabel}</span>
                  {connection.note ? <small>{connection.note}</small> : null}
                </li>
              ))}
            </ul>
            <p className="saved-journey-tab__connections-note">
              Final routing is refined personally. {ILLUSTRATIVE_DISCLAIMER}
            </p>
          </div>
        ) : mappedDestinationCount >= 2 ? (
          <p className="saved-journey-tab__route-note">{ROUTE_FORMING_MESSAGE}</p>
        ) : mappedDestinationCount === 1 ? (
          <p className="saved-journey-tab__route-note">{CONTINUE_EXPLORING_MESSAGE}</p>
        ) : directionView.entries.length === 0 ? (
          <p className="saved-journey-tab__route-note">
            Explore the island to find the places and encounters that belong to this direction.
          </p>
        ) : null}
      </div>

      {recommendationGroup ? (
        <ContextualRecommendations
          primaryHeading={recommendationGroup.primaryHeading}
          secondaryHeading={recommendationGroup.secondaryHeading}
          recommendations={recommendationGroup.recommendations}
        />
      ) : null}

      {hasValidRhythm && rhythm ? (
        <div className="saved-journey-tab__rhythm focused-direction__rhythm">
          <h3>A possible rhythm</h3>
          <p className="saved-journey-tab__rhythm-intro">
            Based on what you have saved along this direction, one possible beginning is:
          </p>
          <p className="saved-journey-tab__rhythm-sequence">{rhythm.sequence.join(' → ')}</p>
          <div className="saved-journey-tab__rhythm-actions">
            <button
              type="button"
              className="saved-journey-tab__rhythm-link"
              aria-expanded={showRhythmReason}
              onClick={() => setShowRhythmReason((current) => !current)}
            >
              {showRhythmReason ? 'Hide' : 'Why this route?'}
            </button>
            <a className="saved-journey-tab__rhythm-link" href="/expectations">
              Refine selections
            </a>
          </div>
          {showRhythmReason ? (
            <p className="saved-journey-tab__rhythm-reason">{rhythm.summary}</p>
          ) : null}
          <p className="saved-journey-tab__rhythm-note">{ILLUSTRATIVE_DISCLAIMER}</p>
        </div>
      ) : null}

      {hasValidItinerary && itinerary ? (
        <IllustrativeItineraryPreview itinerary={itinerary} defaultOpen />
      ) : null}

      {signatureJourneys.length > 0 ? (
        <section className="focused-direction__signature-journeys" aria-labelledby="signature-journeys-heading">
          <h3 id="signature-journeys-heading">A related curated journey</h3>
          {signatureJourneys.map((journey) => (
            <article key={journey.id} className="signature-journey-card">
              <h4>{journey.title}</h4>
              {journey.subtitle ? <p className="signature-journey-card__subtitle">{journey.subtitle}</p> : null}
              <p>{journey.summary}</p>
              {journey.durationLabel ? (
                <p className="signature-journey-card__duration">{journey.durationLabel}</p>
              ) : null}
              <p className="signature-journey-card__note">
                Illustrative only — not a confirmed package or bookable offering.
              </p>
            </article>
          ))}
        </section>
      ) : null}

      <div className="focused-direction__actions">
        <a className="saved-journey-tab__cta-primary" href="/concierge">
          Request a Private Consultation
        </a>
        <button type="button" className="focused-direction__back-secondary" onClick={onClose}>
          Return to all saved directions
        </button>
      </div>
    </section>
  )
}
