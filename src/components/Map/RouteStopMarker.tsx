import { useEffect } from 'react'
import mapboxgl, { type Map } from 'mapbox-gl'
import type { RegionDestination } from '../../data/journeyRegions'

type RouteStopMarkerProps = {
  destination: RegionDestination
  map: Map
  /** Zero-based position along the route; rendered as A, B, C… */
  index: number
  onSelect?: (destination: RegionDestination) => void
}

function toStopLetter(index: number): string {
  // A–Z, then fall back to numbers for very long journeys.
  return index < 26 ? String.fromCharCode(65 + index) : String(index + 1)
}

function createMarkerElement(destination: RegionDestination, index: number) {
  const marker = document.createElement('button')
  const pin = document.createElement('span')
  const label = document.createElement('span')

  marker.type = 'button'
  marker.className = 'route-stop-marker'
  marker.setAttribute(
    'aria-label',
    `Stop ${toStopLetter(index)}: ${destination.title}`,
  )

  pin.className = 'route-stop-marker__pin'
  pin.textContent = toStopLetter(index)

  label.className = 'route-stop-marker__label'
  label.textContent = destination.title

  marker.append(pin, label)
  return marker
}

export function RouteStopMarker({ destination, map, index, onSelect }: RouteStopMarkerProps) {
  useEffect(() => {
    const markerElement = createMarkerElement(destination, index)
    const marker = new mapboxgl.Marker({
      anchor: 'bottom',
      element: markerElement,
    })
      .setLngLat(destination.coordinates)
      .addTo(map)

    const stopMapInteraction = (event: Event) => {
      event.preventDefault()
      event.stopPropagation()
    }

    const handleClick = (event: MouseEvent) => {
      stopMapInteraction(event)
      onSelect?.(destination)
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
      marker.remove()
    }
  }, [destination, index, map, onSelect])

  return null
}
