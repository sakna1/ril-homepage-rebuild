import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import mapboxgl, { type Map } from 'mapbox-gl'
import { TravelMap } from '../Map/TravelMap'
import { getHotelsForDestination, type HotelListing } from '../../data/hotels'
import type { RegionDestination } from '../../data/journeyRegions'
import { toJourneyId } from '../../journey/journeyItemHelpers'
import { useJourney } from '../../journey/useJourney'
import { galleryForTheme, reviewsForTheme } from '../ItinerariesPage/themeCatalog'
import { getPackagePlacesForTheme, type PackagePlace, type PackageThemeTitle } from './packageMapCatalog'
import './ThemeMapExplorer.css'

type ThemeShortcut = {
  title: PackageThemeTitle
  image: string
  imageAlt: string
}

type ThemeMapExplorerProps = {
  themes: readonly ThemeShortcut[]
  selectedTheme: PackageThemeTitle | null
  onSelectTheme: (theme: PackageThemeTitle) => void
}

function ThemeMapMarker({
  place,
  map,
  isFocused,
  onSelect,
}: {
  place: PackagePlace
  map: Map
  isFocused: boolean
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
    markerElement.className = `destination-marker theme-map-marker${isFocused ? ' is-focused' : ''}`
    markerElement.setAttribute('aria-label', `${isFocused ? 'Selected place' : 'Place'}: ${destinationTitle}`)

    visual.className = 'destination-marker__visual'
    halo.className = 'destination-marker__halo'
    core.className = 'destination-marker__core'
    label.className = 'destination-marker__label'
    label.textContent = destinationTitle

    visual.append(halo, core)
    markerElement.append(visual, label)

    const marker = new mapboxgl.Marker({ anchor: 'center', element: markerElement })
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
  }, [coordinates, destinationId, destinationTitle, isFocused, map, onSelect, place.destination])

  return null
}

export function ThemeMapExplorer({ themes, selectedTheme, onSelectTheme }: ThemeMapExplorerProps) {
  const mapRef = useRef<Map | null>(null)
  const [mapReady, setMapReady] = useState(false)
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | undefined>()
  const { confirmRemoveItem, count, includeItem, isIncluded } = useJourney()

  const places = useMemo(() => (selectedTheme ? getPackagePlacesForTheme(selectedTheme) : []), [selectedTheme])
  const selectedPlace = places.find((place) => place.destination.id === selectedPlaceId) ?? places[0] ?? null

  useEffect(() => {
    setSelectedPlaceId(places[0]?.destination.id)
  }, [places])

  const handleMapReady = useCallback((map: Map) => {
    mapRef.current = map
    setMapReady(true)
  }, [])

  const flyToDestination = useCallback((destination: RegionDestination) => {
    const map = mapRef.current
    if (!map) return
    map.flyTo({
      center: destination.coordinates,
      zoom: Math.max(map.getZoom(), 9),
      duration: 750,
      essential: true,
      curve: 1.12,
    })
  }, [])

  const handleSelectDestination = useCallback(
    (destination: RegionDestination) => {
      setSelectedPlaceId(destination.id)
      flyToDestination(destination)
    },
    [flyToDestination],
  )

  useEffect(() => {
    if (!mapReady || !mapRef.current || places.length === 0) {
      return
    }

    const bounds = new mapboxgl.LngLatBounds()
    places.forEach((place) => bounds.extend(place.destination.coordinates))
    mapRef.current.fitBounds(bounds, {
      duration: 850,
      padding: { top: 64, bottom: 64, left: 56, right: 56 },
      maxZoom: 9.4,
    })
  }, [mapReady, places])

  const half = Math.ceil(themes.length / 2)
  const leftThemes = themes.slice(0, half)
  const rightThemes = themes.slice(half)

  const hotels = selectedPlace ? getHotelsForDestination(selectedPlace.destination) : []
  const activities = selectedPlace?.destination.nearbyExperiences ?? []

  function toggleHotelInJourney(hotel: HotelListing) {
    if (!selectedPlace || !selectedTheme) return
    const journeyId = toJourneyId('accommodation', hotel.name)

    if (isIncluded(journeyId)) {
      confirmRemoveItem(journeyId)
      return
    }

    includeItem({
      id: journeyId,
      kind: 'accommodation',
      label: hotel.name,
      detail: hotel.description,
      source: 'Expectations',
      parentTheme: selectedTheme,
      parentRegion: selectedPlace.destination.title,
    })
  }

  function toggleActivityInJourney(activity: string) {
    if (!selectedPlace || !selectedTheme) return
    const journeyId = toJourneyId('experience', `${selectedPlace.destination.title} ${activity}`)

    if (isIncluded(journeyId)) {
      confirmRemoveItem(journeyId)
      return
    }

    includeItem({
      id: journeyId,
      kind: 'experience',
      label: activity,
      source: selectedPlace.destination.title,
      parentTheme: selectedTheme,
      parentRegion: selectedPlace.destination.title,
    })
  }

  function renderShortcut(theme: ThemeShortcut) {
    const isActive = theme.title === selectedTheme
    return (
      <button
        type="button"
        key={theme.title}
        className={`theme-map-shortcut${isActive ? ' is-active' : ''}`}
        onClick={() => onSelectTheme(theme.title)}
        aria-pressed={isActive}
      >
        <span className="theme-map-shortcut-image">
          <img src={theme.image} alt={theme.imageAlt} />
        </span>
        <span className="theme-map-shortcut-label">{theme.title}</span>
      </button>
    )
  }

  return (
    <section className="theme-map-explorer" id="discover-map" aria-label="Discover Sri Lanka by theme">
      <header className="theme-map-explorer-header">
        <p className="theme-map-eyebrow">Discover On The Map</p>
        <h2>
          {selectedTheme ? (
            <>
              Where <em>{selectedTheme}</em> comes to life.
            </>
          ) : (
            <>
              Choose a world to <em>begin exploring.</em>
            </>
          )}
        </h2>
      </header>

      <div className="theme-map-explorer-layout">
        <nav className="theme-map-shortcuts theme-map-shortcuts--left" aria-label="Discovery worlds">
          {leftThemes.map(renderShortcut)}
        </nav>

        <div className="theme-map-stage">
          <TravelMap className="theme-map-stage-canvas" onMapReady={handleMapReady}>
            {(map) =>
              places.map((place) => (
                <ThemeMapMarker
                  key={place.destination.id}
                  place={place}
                  map={map}
                  isFocused={place.destination.id === selectedPlace?.destination.id}
                  onSelect={handleSelectDestination}
                />
              ))
            }
          </TravelMap>
        </div>

        <nav className="theme-map-shortcuts theme-map-shortcuts--right" aria-label="Discovery worlds">
          {rightThemes.map(renderShortcut)}
        </nav>
      </div>

      {selectedTheme && selectedPlace ? (
        <div className="theme-map-detail" aria-live="polite">
          <div className="theme-map-detail-heading">
            <p className="theme-map-eyebrow">{selectedTheme}</p>
            <h3>{selectedPlace.destination.title}</h3>
            <p>{selectedPlace.destination.description}</p>
          </div>

          {(() => {
            // The place's own photograph leads; the rest illustrate the theme.
            const themeShots = galleryForTheme(selectedTheme).doing
            const placeShot = selectedPlace.destination.heroImage
            const shots = [
              ...(placeShot
                ? [{ src: placeShot, alt: `${selectedPlace.destination.title}, Sri Lanka` }]
                : []),
              ...themeShots.slice(0, placeShot ? 2 : 3),
            ]
            if (shots.length === 0) return null

            return (
              <div className="theme-map-shots">
                {shots.map((shot, index) => (
                  <figure key={`${shot.alt}-${index}`} className="theme-map-shot">
                    <img src={shot.src} alt={shot.alt} loading="lazy" />
                  </figure>
                ))}
              </div>
            )
          })()}

          <div className="theme-map-detail-columns">
            <div className="theme-map-detail-column">
              <h4>Where To Stay</h4>
              <ul className="theme-map-hotel-list">
                {hotels.map((hotel) => {
                  const added = isIncluded(toJourneyId('accommodation', hotel.name))
                  return (
                    <li key={hotel.id}>
                      <div className="theme-map-list-item-heading">
                        <p className="theme-map-hotel-name">{hotel.name}</p>
                        <button
                          type="button"
                          className={`theme-map-add-button${added ? ' is-added' : ''}`}
                          aria-pressed={added}
                          onClick={() => toggleHotelInJourney(hotel)}
                        >
                          {added ? 'Added' : 'Add to Journey'}
                        </button>
                      </div>
                      <p className="theme-map-hotel-description">{hotel.description}</p>
                      <p className="theme-map-hotel-price">{hotel.priceHint}</p>
                    </li>
                  )
                })}
              </ul>
            </div>

            <div className="theme-map-detail-column">
              <h4>What To Do</h4>
              {activities.length > 0 ? (
                <ul className="theme-map-activity-list">
                  {activities.map((activity) => {
                    const added = isIncluded(
                      toJourneyId('experience', `${selectedPlace.destination.title} ${activity}`),
                    )
                    return (
                      <li key={activity}>
                        <span>{activity}</span>
                        <button
                          type="button"
                          className={`theme-map-add-button${added ? ' is-added' : ''}`}
                          aria-pressed={added}
                          onClick={() => toggleActivityInJourney(activity)}
                        >
                          {added ? 'Added' : 'Add to Journey'}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <p className="theme-map-activity-empty">
                  Activities for this place are being curated. Ask your concierge for a private briefing.
                </p>
              )}
            </div>
          </div>

          {(() => {
            const reviews = reviewsForTheme(selectedTheme)
            if (reviews.length === 0) return null

            return (
              <aside className="theme-map-reviews" aria-label={`Reviews for ${selectedTheme}`}>
                <p className="theme-map-reviews-label">Guest Reflections</p>

                <div className="theme-map-reviews-grid">
                  {reviews.map((review) => (
                    <figure key={review.name} className="theme-map-review">
                      <div
                        className="theme-map-review-stars"
                        role="img"
                        aria-label={`${review.rating} out of 5`}
                      >
                        {'★'.repeat(review.rating)}
                        <span>{'★'.repeat(5 - review.rating)}</span>
                      </div>
                      <blockquote>{review.quote}</blockquote>
                      <figcaption>
                        {review.name} · <span>{review.origin}</span>
                      </figcaption>
                    </figure>
                  ))}
                </div>

                <p className="theme-map-reviews-note">
                  Sample reflections shown while verified guest reviews are being collected.
                </p>
              </aside>
            )
          })()}
        </div>
      ) : null}

      <footer className="theme-map-explorer-footer">
        <a className="theme-map-journey-link" href="/my-journey">
          View My Journey
          {count > 0 ? <span className="theme-map-journey-link-count">{count}</span> : null}
          <span aria-hidden="true">→</span>
        </a>
      </footer>
    </section>
  )
}
