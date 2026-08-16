import { useCallback, useEffect, useRef, useState } from 'react'
import mapboxgl, { type Map } from 'mapbox-gl'
import { TravelMap } from '../Map/TravelMap'
import type { RegionDestination } from '../../data/journeyRegions'

type DestinationMapMarkerProps = {
  destination: RegionDestination
  map: Map
  isFocused: boolean
  onSelect: (destination: RegionDestination) => void
}

function DestinationMapMarker({ destination, map, isFocused, onSelect }: DestinationMapMarkerProps) {
  const { id, title, coordinates } = destination

  useEffect(() => {
    const markerElement = document.createElement('button')
    const visual = document.createElement('span')
    const halo = document.createElement('span')
    const core = document.createElement('span')
    const label = document.createElement('span')

    markerElement.type = 'button'
    markerElement.className = `destination-marker theme-map-marker${isFocused ? ' is-focused' : ''}`
    markerElement.setAttribute('aria-label', `${title}, Sri Lanka`)

    visual.className = 'destination-marker__visual'
    halo.className = 'destination-marker__halo'
    core.className = 'destination-marker__core'
    label.className = 'destination-marker__label'
    label.textContent = title

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
      onSelect(destination)
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
  }, [coordinates, destination, id, isFocused, map, onSelect, title])

  return null
}

type DestinationsMapProps = {
  destinations: readonly RegionDestination[]
  focusedId: string | null
  onSelect: (destination: RegionDestination) => void
}

/**
 * Where the places are, plainly. Every destination currently in view gets a
 * marker; tapping one opens that destination. No themes, no packages.
 */
export function DestinationsMap({ destinations, focusedId, onSelect }: DestinationsMapProps) {
  const mapRef = useRef<Map | null>(null)
  const [mapReady, setMapReady] = useState(false)

  const handleMapReady = useCallback((map: Map) => {
    mapRef.current = map
    setMapReady(true)
  }, [])

  // Keep every visible marker in frame as the region filter changes.
  useEffect(() => {
    if (!mapReady || !mapRef.current || destinations.length === 0) return

    const bounds = new mapboxgl.LngLatBounds()
    destinations.forEach((destination) => bounds.extend(destination.coordinates))
    mapRef.current.fitBounds(bounds, {
      duration: 850,
      padding: { top: 64, bottom: 64, left: 56, right: 56 },
      maxZoom: 9.4,
    })
  }, [mapReady, destinations])

  return (
    <section className="destinations-map" id="destinations-map" aria-label="Destinations on the map">
      <header className="destinations-map__head">
        <p className="destinations-eyebrow">On The Map</p>
        <h2>Where these places sit.</h2>
        <p className="destinations-map__lede">
          Tap any marker to open that destination.
        </p>
      </header>

      <div className="destinations-map__stage">
        <TravelMap className="destinations-map__canvas" onMapReady={handleMapReady}>
          {(map) =>
            destinations.map((destination) => (
              <DestinationMapMarker
                key={destination.id}
                destination={destination}
                map={map}
                isFocused={destination.id === focusedId}
                onSelect={onSelect}
              />
            ))
          }
        </TravelMap>
      </div>
    </section>
  )
}
