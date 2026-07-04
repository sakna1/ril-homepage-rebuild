import { useCallback, useEffect, useMemo, useState } from 'react'
import { JourneyConstellationLayer } from '../../components/Map/JourneyConstellationLayer'
import { JourneyRegionLayer } from '../../components/Map/JourneyRegionLayer'
import { RegionDestinationMarker } from '../../components/Map/RegionDestinationMarker'
import { TravelMap } from '../../components/Map/TravelMap'
import type { IllustrativeItinerary, SuggestedRhythmResult, TravelConnection } from '../../data/journey/types'
import { ILLUSTRATIVE_DISCLAIMER } from '../../data/journey/mockJourneyTypes'
import { journeyRegions } from '../../data/journeyRegions'
import { getSavedDestinationIds, getSavedRegionIds } from '../../journey/contextualRecommendations'
import { hasEnoughForRhythm } from '../../journey/emergingRhythm'
import { buildDirectionsFromSavedItems } from '../../journey/journeyDirections'
import { useJourney } from '../../journey/JourneyContext'
import { buildJourneyGlanceSummary } from '../../journey/savedJourneyDisplay'
import {
  adaptSavedItemsToRepositoryInput,
  journeyRepository,
} from '../../services/journeyRepository'
import { FocusedDirectionView } from './FocusedDirectionView'
import { IllustrativeItineraryPreview } from './IllustrativeItineraryPreview'
import { getTabPanelId, getTabId } from './JourneyTabs'
import { readFocusedDirectionId, setFocusedDirectionId } from './journeyView'
import { YourDirectionsPanel } from './YourDirectionsPanel'

export function SavedJourneyTab() {
  const { items, confirmRemoveItem } = useJourney()
  const [rhythm, setRhythm] = useState<SuggestedRhythmResult | undefined>()
  const [itinerary, setItinerary] = useState<IllustrativeItinerary | undefined>()
  const [connections, setConnections] = useState<TravelConnection[]>([])
  const [showRhythmReason, setShowRhythmReason] = useState(false)
  const [activeDirectionId, setActiveDirectionId] = useState<string | undefined>(() =>
    readFocusedDirectionId(),
  )

  useEffect(() => {
    const handlePopState = () => setActiveDirectionId(readFocusedDirectionId())
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const handleExploreDirection = useCallback((directionId: string) => {
    setActiveDirectionId(directionId)
    setFocusedDirectionId(directionId)
  }, [])

  const handleCloseDirection = useCallback(() => {
    setActiveDirectionId(undefined)
    setFocusedDirectionId(undefined)
  }, [])

  const repositoryInput = useMemo(() => adaptSavedItemsToRepositoryInput(items), [items])
  const { directions, independentItems } = useMemo(() => buildDirectionsFromSavedItems(items), [items])
  const glance = useMemo(() => buildJourneyGlanceSummary(items), [items])

  const savedRegionIds = useMemo(() => getSavedRegionIds(items, journeyRegions), [items])
  const savedDestinationIds = useMemo(() => getSavedDestinationIds(items, journeyRegions), [items])
  const enoughForRhythm = hasEnoughForRhythm(items)

  useEffect(() => {
    let cancelled = false

    async function loadJourneyInsights() {
      if (items.length === 0 || activeDirectionId) {
        setRhythm(undefined)
        setItinerary(undefined)
        setConnections([])
        return
      }

      const rhythmResult = await journeyRepository.getSuggestedRhythm(repositoryInput.savedItemIds, items)
      const itineraryResult = await journeyRepository.generateIllustrativeItinerary(
        {
          savedItemIds: repositoryInput.savedItemIds,
          regionIds: repositoryInput.regionIds,
          rhythmId: rhythmResult?.rhythmId,
        },
        items,
      )
      const connectionResult = await journeyRepository.getTravelConnectionsForDestinations(
        repositoryInput.destinationIds,
      )

      if (!cancelled) {
        setRhythm(rhythmResult)
        setItinerary(itineraryResult)
        setConnections(connectionResult)
      }
    }

    void loadJourneyInsights()

    return () => {
      cancelled = true
    }
  }, [activeDirectionId, items, repositoryInput])

  const destinationMarkers = useMemo(
    () =>
      journeyRegions.flatMap((region) =>
        region.destinations
          .filter((destination) => savedDestinationIds.includes(destination.id))
          .map((destination) => ({ region, destination })),
      ),
    [savedDestinationIds],
  )

  const constellationDestinationIds = useMemo(() => {
    if (repositoryInput.destinationIds.length >= 2) {
      return repositoryInput.destinationIds
    }
    return savedDestinationIds
  }, [repositoryInput.destinationIds, savedDestinationIds])

  const hasShareableJourney = enoughForRhythm && (rhythm !== undefined || itinerary !== undefined)

  if (activeDirectionId) {
    return (
      <section
        className="my-journey-tab-panel saved-journey-tab"
        role="tabpanel"
        id={getTabPanelId('journey')}
        aria-labelledby={getTabId('journey')}
      >
        <FocusedDirectionView directionId={activeDirectionId} onClose={handleCloseDirection} />
      </section>
    )
  }

  return (
    <section
      className="my-journey-tab-panel saved-journey-tab"
      role="tabpanel"
      id={getTabPanelId('journey')}
      aria-labelledby={getTabId('journey')}
    >
      {items.length === 0 ? (
        <div className="saved-journey-tab__empty">
          <h2>Your journey, at a glance</h2>
          <p>
            Save a few places or encounters, and we will begin to trace how the island might unfold
            around them.
          </p>
          <a href="/my-journey?view=explore">Explore the Island</a>
        </div>
      ) : (
        <>
          <div className="saved-journey-tab__glance">
            <h2>Your journey, at a glance</h2>
            <p className="saved-journey-tab__glance-editorial">{glance.themeEditorialLine}</p>

            {glance.themeLabels.length > 0 ? (
              <ul className="saved-journey-tab__theme-chips" aria-label="Saved directions">
                {glance.themeLabels.map((theme) => (
                  <li key={theme}>{theme}</li>
                ))}
              </ul>
            ) : null}

            {glance.placesEditorialLine ? (
              <p className="saved-journey-tab__glance-count">{glance.placesEditorialLine}</p>
            ) : null}

            <YourDirectionsPanel
              directions={directions}
              independentItems={independentItems}
              onRemove={confirmRemoveItem}
              onExploreDirection={handleExploreDirection}
            />
          </div>

          <div className="saved-journey-tab__map-section">
            <h2>The island, shaped around what has stayed with you</h2>
            <div className="saved-journey-tab__map">
              <TravelMap>
                {(map) => (
                  <>
                    <JourneyRegionLayer
                      map={map}
                      recommendedRegionIds={savedRegionIds}
                      regions={journeyRegions.filter((region) => savedRegionIds.includes(region.id))}
                      onRegionSelect={() => {
                        /* saved journey overview */
                      }}
                    />
                    {destinationMarkers.map(({ region, destination }) => (
                      <RegionDestinationMarker
                        key={`${region.id}-${destination.id}`}
                        destination={destination}
                        map={map}
                        onSelect={() => {
                          /* saved journey overview */
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
                <p className="saved-journey-tab__connections-note">{ILLUSTRATIVE_DISCLAIMER}</p>
              </div>
            ) : null}
          </div>
        </>
      )}

      <div className="saved-journey-tab__rhythm">
        <h2>A possible rhythm</h2>
        {enoughForRhythm && rhythm ? (
          <>
            <p className="saved-journey-tab__rhythm-intro">
              Based on the places you have saved, one possible beginning is:
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
              <a className="saved-journey-tab__rhythm-link" href="/my-journey?view=explore">
                Refine selections
              </a>
            </div>
            {showRhythmReason ? <p className="saved-journey-tab__rhythm-reason">{rhythm.summary}</p> : null}
            <p className="saved-journey-tab__rhythm-note">{ILLUSTRATIVE_DISCLAIMER}</p>
          </>
        ) : (
          <p>
            Save a few places or encounters, and we will begin to trace how the island might unfold
            around them.
          </p>
        )}
      </div>

      {itinerary ? <IllustrativeItineraryPreview itinerary={itinerary} /> : null}

      <div className="saved-journey-tab__handoff">
        <h2>When the outline feels right, we will take care of the rest.</h2>
        <p>
          Share a little more about how you like to travel, and our team can begin shaping the details
          with care.
        </p>
        <div className="saved-journey-tab__handoff-actions">
          <a className="saved-journey-tab__cta-primary" href="/concierge">
            Request a Private Consultation
          </a>
          {hasShareableJourney ? (
            <button className="saved-journey-tab__cta-secondary" type="button" disabled>
              Share Your Journey
            </button>
          ) : null}
        </div>
      </div>
    </section>
  )
}
