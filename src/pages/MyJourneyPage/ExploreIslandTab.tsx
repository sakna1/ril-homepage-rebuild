import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Map } from 'mapbox-gl'
import { JourneyRegionLayer } from '../../components/Map/JourneyRegionLayer'
import { RegionDestinationMarker } from '../../components/Map/RegionDestinationMarker'
import { TravelMap } from '../../components/Map/TravelMap'
import { experiencesById, type Experience } from '../../data/experiences'
import { journeyRegions, type JourneyRegion, type RegionDestination } from '../../data/journeyRegions'
import { getSavedDestinationIds, getSavedRegionIds } from '../../journey/contextualRecommendations'
import { regionMatchesTheme } from '../../journey/journeyRegionCatalog'
import { useJourney } from '../../journey/useJourney'
import { LocationDetailPanel } from './LocationDetailPanel'
import { MapFilters } from './MapFilters'
import { getTabId, getTabPanelId, type MapFilterState } from './journeyView'

const SRI_LANKA_OVERVIEW_BOUNDS: [[number, number], [number, number]] = [
  [79.62, 5.92],
  [81.84, 9.72],
]

type ExploreIslandTabProps = {
  highlightedRegionIds?: string[]
  onRegionHighlight?: (regionIds: string[]) => void
}

export function ExploreIslandTab({ highlightedRegionIds = [] }: ExploreIslandTabProps) {
  const { items } = useJourney()
  const [filter, setFilter] = useState<MapFilterState>({ category: 'all' })
  const [selectedRegionId, setSelectedRegionId] = useState<string | undefined>()
  const [selectedDestinationId, setSelectedDestinationId] = useState<string | undefined>()
  const [selectedExperienceId, setSelectedExperienceId] = useState<string | undefined>()
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false)
  const mapRef = useRef<Map | null>(null)

  const activeRegions = journeyRegions
  const savedRegionIds = useMemo(() => getSavedRegionIds(items, activeRegions), [items, activeRegions])
  const savedDestinationIds = useMemo(() => getSavedDestinationIds(items, activeRegions), [items, activeRegions])

  const visibleRegions = useMemo(() => {
    if (filter.category === 'saved') {
      if (items.length === 0) {
        return []
      }
      return activeRegions.filter((region) => savedRegionIds.includes(region.id))
    }

    if (filter.category === 'regions' && filter.secondaryId) {
      return activeRegions.filter((region) => region.id === filter.secondaryId)
    }

    if (filter.category === 'worlds' && filter.secondaryId) {
      return activeRegions.filter((region) => regionMatchesTheme(region.id, filter.secondaryId!))
    }

    if (filter.category === 'experiences' && filter.secondaryId) {
      const experience = experiencesById[filter.secondaryId]
      if (!experience) {
        return activeRegions
      }
      return activeRegions.filter((region) =>
        region.destinations.some((destination) => destination.id === experience.destinationId),
      )
    }

    return activeRegions
  }, [activeRegions, filter, items.length, savedRegionIds])

  const recommendedRegionIds = useMemo(() => {
    if (highlightedRegionIds.length > 0) {
      return highlightedRegionIds
    }
    if (filter.category === 'saved') {
      return savedRegionIds
    }
    return visibleRegions.map((region) => region.id)
  }, [filter.category, highlightedRegionIds, savedRegionIds, visibleRegions])

  const selectedRegion = activeRegions.find((region) => region.id === selectedRegionId)
  const selectedDestination = selectedRegion?.destinations.find(
    (destination) => destination.id === selectedDestinationId,
  )
  const selectedExperience = selectedExperienceId ? experiencesById[selectedExperienceId] : undefined
  const selectedDestinationExperiences =
    selectedDestination?.experienceIds
      .map((experienceId) => experiencesById[experienceId])
      .filter((experience): experience is Experience => Boolean(experience)) ?? []

  const handleMapReady = useCallback((map: Map) => {
    mapRef.current = map
  }, [])

  const handleExploreRegions = useCallback(() => {
    setSelectedRegionId(undefined)
    setSelectedDestinationId(undefined)
    setSelectedExperienceId(undefined)
    setIsMobilePanelOpen(false)
    mapRef.current?.fitBounds(SRI_LANKA_OVERVIEW_BOUNDS, {
      duration: 700,
      padding: 12,
    })
  }, [])

  const handleRegionSelect = useCallback((region: JourneyRegion) => {
    setSelectedRegionId(region.id)
    setSelectedDestinationId(undefined)
    setSelectedExperienceId(undefined)
    setIsMobilePanelOpen(true)
    mapRef.current?.flyTo({
      center: region.center,
      curve: 1.22,
      duration: 950,
      essential: true,
      speed: 0.72,
      zoom: region.zoom,
    })
  }, [])

  const handleDestinationSelect = useCallback(
    (destination: RegionDestination) => {
      setSelectedDestinationId(destination.id)
      setSelectedExperienceId(undefined)
      setIsMobilePanelOpen(true)
      mapRef.current?.flyTo({
        center: destination.coordinates,
        curve: 1.16,
        duration: 850,
        essential: true,
        speed: 0.78,
        zoom: Math.max(selectedRegion?.zoom ?? 9, 9.45),
      })
    },
    [selectedRegion?.zoom],
  )

  const handleExperienceSelect = useCallback((experience: Experience) => {
    setSelectedExperienceId(experience.id)
    setIsMobilePanelOpen(true)
  }, [])

  const handleBackToDestination = useCallback(() => {
    setSelectedExperienceId(undefined)
  }, [])

  const handleFilterChange = useCallback(
    (nextFilter: MapFilterState) => {
      setFilter(nextFilter)

      if (nextFilter.category !== 'experiences' || !nextFilter.secondaryId) {
        return
      }

      const experience = experiencesById[nextFilter.secondaryId]
      if (!experience) {
        return
      }

      const region = activeRegions.find((entry) =>
        entry.destinations.some((destination) => destination.id === experience.destinationId),
      )
      if (!region) {
        return
      }

      setSelectedRegionId(region.id)
      setSelectedDestinationId(experience.destinationId)
      setSelectedExperienceId(experience.id)
      setIsMobilePanelOpen(true)
    },
    [activeRegions],
  )

  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 961px)').matches : true,
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 961px)')
    const handleChange = () => setIsDesktop(mediaQuery.matches)
    handleChange()
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const showPanel =
    isDesktop || isMobilePanelOpen || Boolean(selectedRegion || selectedDestination || selectedExperience)

  const destinationMarkers = useMemo(() => {
    if (filter.category === 'saved' && savedDestinationIds.length > 0 && !selectedRegion) {
      return activeRegions.flatMap((region) =>
        region.destinations
          .filter((destination) => savedDestinationIds.includes(destination.id))
          .map((destination) => ({ region, destination })),
      )
    }

    if (!selectedRegion) {
      return []
    }

    return selectedRegion.destinations.map((destination) => ({
      region: selectedRegion,
      destination,
    }))
  }, [activeRegions, filter.category, savedDestinationIds, selectedRegion])

  return (
    <section
      className="my-journey-tab-panel explore-island-tab"
      role="tabpanel"
      id={getTabPanelId('explore')}
      aria-labelledby={getTabId('explore')}
    >
      <MapFilters filter={filter} onFilterChange={handleFilterChange} hasSavedItems={items.length > 0} />

      <div className="explore-island-tab__workspace">
        <div className="explore-island-tab__map">
          <TravelMap onMapReady={handleMapReady}>
            {(map) => (
              <>
                <JourneyRegionLayer
                  map={map}
                  recommendedRegionIds={recommendedRegionIds}
                  regions={visibleRegions.length > 0 ? visibleRegions : activeRegions}
                  selectedRegionId={selectedRegionId}
                  onRegionSelect={handleRegionSelect}
                />
                {destinationMarkers.map(({ region, destination }) => (
                  <RegionDestinationMarker
                    key={`${region.id}-${destination.id}`}
                    destination={destination}
                    map={map}
                    onSelect={handleDestinationSelect}
                  />
                ))}
              </>
            )}
          </TravelMap>
        </div>

        {showPanel ? (
          <div className={`explore-island-tab__panel${isMobilePanelOpen ? ' is-open' : ''}`}>
            <LocationDetailPanel
              experiences={selectedDestinationExperiences}
              selectedRegion={selectedRegion}
              selectedDestination={selectedDestination}
              selectedExperience={selectedExperience}
              onBackToDestination={handleBackToDestination}
              onDestinationSelect={handleDestinationSelect}
              onExperienceSelect={handleExperienceSelect}
              onExploreRegions={handleExploreRegions}
              onClose={() => {
                setIsMobilePanelOpen(false)
                setSelectedRegionId(undefined)
                setSelectedDestinationId(undefined)
                setSelectedExperienceId(undefined)
              }}
            />
          </div>
        ) : null}
      </div>
    </section>
  )
}
