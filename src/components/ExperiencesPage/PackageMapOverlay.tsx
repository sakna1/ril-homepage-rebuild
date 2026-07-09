import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import type { Map } from 'mapbox-gl'
import mapboxgl from 'mapbox-gl'
import { TravelMap } from '../Map/TravelMap'
import { useJourney } from '../../journey/useJourney'
import {
  createJourneyItemFromDestination,
  createJourneyItemFromTheme,
  toJourneyId,
} from '../../journey/journeyItemHelpers'
import { getRegionEditorialName } from '../../journey/journeyRegionCatalog'
import type { RegionDestination } from '../../data/journeyRegions'
import {
  getEncounterPackageContext,
  type PackagePlace,
  type PackageThemeTitle,
} from './packageMapCatalog'
import './PackageMapOverlay.css'

type EncounterSummary = {
  id: string
  title: string
  note: string
  image: string
  imageAlt: string
  category: string
  caption: string
  theme?: PackageThemeTitle
}

type PackageMapOverlayProps = {
  encounter: EncounterSummary
  themeEncounters: EncounterSummary[]
  onClose: () => void
  onFocusEncounter: (encounterId: string) => void
}

function PackageDestinationMarker({
  place,
  map,
  isFocused,
  isSaved,
  onSelect,
}: {
  place: PackagePlace
  map: Map
  isFocused: boolean
  isSaved: boolean
  onSelect: (destination: RegionDestination) => void
}) {
  const destinationId = place.destination.id
  const destinationTitle = place.destination.title
  const coordinates = place.destination.coordinates

  useEffect(() => {
    const markerElement = document.createElement('button')
    const visual = document.createElement('span')
    const halo = document.createElement('span')
    const core = document.createElement('span')
    const label = document.createElement('span')

    markerElement.type = 'button'
    markerElement.className = [
      'destination-marker',
      'package-map-marker',
      isFocused ? 'is-focused' : '',
      isSaved ? 'is-saved' : '',
    ]
      .filter(Boolean)
      .join(' ')
    markerElement.setAttribute(
      'aria-label',
      `${isFocused ? 'Selected place' : 'Package place'}: ${destinationTitle}`,
    )

    visual.className = 'destination-marker__visual'
    halo.className = 'destination-marker__halo'
    core.className = 'destination-marker__core'
    label.className = 'destination-marker__label'
    label.textContent = destinationTitle

    visual.append(halo, core)
    markerElement.append(visual, label)

    const marker = new mapboxgl.Marker({
      anchor: 'center',
      element: markerElement,
    })
      .setLngLat(coordinates)
      .addTo(map)

    const stopMapInteraction = (event: Event) => {
      event.preventDefault()
      event.stopPropagation()
    }

    const handleClick = (event: MouseEvent) => {
      stopMapInteraction(event)
      onSelect(place.destination)
    }

    markerElement.addEventListener('pointerdown', stopMapInteraction)
    markerElement.addEventListener('mousedown', stopMapInteraction)
    markerElement.addEventListener('touchstart', stopMapInteraction)
    markerElement.addEventListener('click', handleClick)

    return () => {
      markerElement.removeEventListener('pointerdown', stopMapInteraction)
      markerElement.removeEventListener('mousedown', stopMapInteraction)
      markerElement.removeEventListener('touchstart', stopMapInteraction)
      markerElement.removeEventListener('click', handleClick)
      markerElement.classList.add('destination-marker--leaving')
      window.setTimeout(() => marker.remove(), 220)
    }
  }, [coordinates, destinationId, destinationTitle, isFocused, isSaved, map, onSelect, place.destination])

  return null
}

export function PackageMapOverlay({
  encounter,
  themeEncounters,
  onClose,
  onFocusEncounter,
}: PackageMapOverlayProps) {
  const titleId = useId()
  const { confirmRemoveItem, includeItem, isIncluded, items } = useJourney()
  const mapRef = useRef<Map | null>(null)
  const framedFocusRef = useRef<string | undefined>(undefined)
  const [mapReady, setMapReady] = useState(false)

  const theme = encounter.theme
  const packageContext = useMemo(() => {
    if (!theme) {
      return null
    }
    return getEncounterPackageContext(encounter.id, theme)
  }, [encounter.id, theme])

  const [focusedDestinationId, setFocusedDestinationId] = useState(
    packageContext?.focused?.destination.id,
  )

  useEffect(() => {
    setFocusedDestinationId(packageContext?.focused?.destination.id)
  }, [packageContext?.focused?.destination.id])

  const places = packageContext?.places ?? []
  const focusedPlace =
    places.find((place) => place.destination.id === focusedDestinationId) ?? packageContext?.focused ?? null

  const focusedEncounter =
    themeEncounters.find((entry) =>
      focusedPlace?.encounterIds.includes(entry.id),
    ) ?? encounter

  const packageSelectedCount = useMemo(() => {
    if (!theme) {
      return 0
    }
    return places.filter((place) =>
      isIncluded(toJourneyId('destination', place.destination.title)),
    ).length
  }, [isIncluded, places, theme])

  const includeTheme = useCallback(() => {
    if (!theme) {
      return
    }
    includeItem({
      ...createJourneyItemFromTheme({ id: theme, title: theme }),
      source: 'Expectations',
    })
  }, [includeItem, theme])

  const addPlaceToPackage = useCallback(
    (place: PackagePlace) => {
      if (!theme) {
        return
      }

      const destinationItem = {
        ...createJourneyItemFromDestination(place.destination, place.region, theme),
        source: 'Expectations',
      }

      includeTheme()
      if (!isIncluded(destinationItem.id)) {
        includeItem(destinationItem)
      }

      for (const encounterId of place.encounterIds) {
        const matched = themeEncounters.find((entry) => entry.id === encounterId)
        if (!matched) {
          continue
        }
        const experienceId = toJourneyId('experience', matched.title)
        if (isIncluded(experienceId)) {
          continue
        }
        includeItem({
          id: experienceId,
          kind: 'experience',
          label: matched.title,
          detail: matched.note,
          source: matched.category,
          parentTheme: theme,
          parentRegion: getRegionEditorialName(place.region.id),
        })
      }
    },
    [includeItem, includeTheme, isIncluded, theme, themeEncounters],
  )

  const togglePlace = useCallback(
    (place: PackagePlace) => {
      if (!theme) {
        return
      }

      const destinationItem = {
        ...createJourneyItemFromDestination(place.destination, place.region, theme),
        source: 'Expectations',
      }

      if (isIncluded(destinationItem.id)) {
        confirmRemoveItem(destinationItem.id)
        return
      }

      addPlaceToPackage(place)
    },
    [addPlaceToPackage, confirmRemoveItem, isIncluded, theme],
  )

  const addAllPackagePlaces = useCallback(() => {
    places.forEach((place) => addPlaceToPackage(place))
  }, [addPlaceToPackage, places])

  const handleMapReady = useCallback((map: Map) => {
    mapRef.current = map
    setMapReady(true)
  }, [])

  const flyToDestination = useCallback((destination: RegionDestination) => {
    mapRef.current?.flyTo({
      center: destination.coordinates,
      zoom: Math.max(mapRef.current.getZoom(), 9),
      duration: 750,
      essential: true,
      curve: 1.12,
    })
  }, [])

  const handleSelectDestination = useCallback(
    (destination: RegionDestination) => {
      setFocusedDestinationId(destination.id)
      framedFocusRef.current = destination.id
      flyToDestination(destination)

      const matchedEncounterId = places.find((place) => place.destination.id === destination.id)
        ?.encounterIds[0]
      if (matchedEncounterId && matchedEncounterId !== encounter.id) {
        onFocusEncounter(matchedEncounterId)
      }
    },
    [encounter.id, flyToDestination, onFocusEncounter, places],
  )

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  useEffect(() => {
    if (!mapReady || !mapRef.current || places.length === 0 || !packageContext) {
      return
    }

    const bounds = new mapboxgl.LngLatBounds()
    places.forEach((place) => {
      bounds.extend(place.destination.coordinates)
    })

    mapRef.current.fitBounds(bounds, {
      duration: 850,
      padding: { top: 72, bottom: 72, left: 56, right: 56 },
      maxZoom: 9.2,
    })
    framedFocusRef.current = focusedDestinationId
  }, [mapReady, packageContext?.themeId])

  useEffect(() => {
    if (!mapReady || !focusedPlace || !focusedDestinationId) {
      return
    }
    if (framedFocusRef.current === focusedDestinationId) {
      return
    }
    framedFocusRef.current = focusedDestinationId
    flyToDestination(focusedPlace.destination)
  }, [flyToDestination, focusedDestinationId, focusedPlace, mapReady])

  if (!theme || !packageContext || !focusedPlace) {
    return null
  }

  const focusedSaved = isIncluded(toJourneyId('destination', focusedPlace.destination.title))

  return (
    <div className="package-map-overlay" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <button className="package-map-overlay__backdrop" type="button" aria-label="Close package map" onClick={onClose} />

      <div className="package-map-overlay__shell">
        <header className="package-map-overlay__chrome">
          <div>
            <p className="package-map-overlay__kicker">Theme package</p>
            <h2 id={titleId}>{theme}</h2>
            <p className="package-map-overlay__status">
              {packageSelectedCount} of {places.length} places selected
              {items.length > 0 ? ` · ${items.length} in your journey bag` : ''}
            </p>
          </div>
          <button className="package-map-overlay__close" type="button" onClick={onClose}>
            Close
          </button>
        </header>

        <div className="package-map-overlay__workspace">
          <aside className="package-map-overlay__panel">
            <figure className="package-map-overlay__hero">
              <img src={focusedEncounter.image} alt={focusedEncounter.imageAlt} />
            </figure>

            <p className="package-map-overlay__category">{focusedEncounter.category}</p>
            <h3>{focusedPlace.destination.title}</h3>
            <p className="package-map-overlay__caption">{focusedEncounter.caption}</p>
            <blockquote>“{focusedEncounter.note}”</blockquote>

            <div className="package-map-overlay__actions">
              <button
                className="package-map-overlay__primary"
                type="button"
                aria-pressed={focusedSaved}
                onClick={() => togglePlace(focusedPlace)}
              >
                {focusedSaved ? 'In package' : 'Add to package'}
              </button>
              <button className="package-map-overlay__ghost" type="button" onClick={addAllPackagePlaces}>
                Add all highlighted
              </button>
            </div>

            <div className="package-map-overlay__companions">
              <p>Also in this package</p>
              <ul>
                {places.map((place) => {
                  const saved = isIncluded(toJourneyId('destination', place.destination.title))
                  const isActive = place.destination.id === focusedPlace.destination.id
                  return (
                    <li key={place.destination.id}>
                      <button
                        type="button"
                        className={`package-map-overlay__chip${isActive ? ' is-active' : ''}${saved ? ' is-saved' : ''}`}
                        onClick={() => handleSelectDestination(place.destination)}
                      >
                        <span>{place.destination.title}</span>
                        {saved ? <em>Added</em> : null}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>

            {packageSelectedCount > 0 ? (
              <a className="package-map-overlay__continue" href="/my-journey">
                Continue shaping itinerary
              </a>
            ) : (
              <p className="package-map-overlay__hint">
                Select the places that belong in this package. Sequencing happens in My Journey.
              </p>
            )}
          </aside>

          <div className="package-map-overlay__map">
            <TravelMap className="package-map-overlay__travel-map" onMapReady={handleMapReady}>
              {(map) => (
                <>
                  {places.map((place) => (
                    <PackageDestinationMarker
                      key={place.destination.id}
                      place={place}
                      map={map}
                      isFocused={place.destination.id === focusedPlace.destination.id}
                      isSaved={isIncluded(toJourneyId('destination', place.destination.title))}
                      onSelect={handleSelectDestination}
                    />
                  ))}
                </>
              )}
            </TravelMap>
          </div>
        </div>
      </div>
    </div>
  )
}
