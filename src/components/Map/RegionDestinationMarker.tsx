import { useEffect } from 'react'
import mapboxgl, { type Map } from 'mapbox-gl'
import type { RegionDestination } from '../../data/journeyRegions'

type RegionDestinationMarkerProps = {
  destination: RegionDestination
  map: Map
  onSelect: (destination: RegionDestination) => void
}

function createMarkerElement(destination: RegionDestination) {
  const marker = document.createElement('button')
  const visual = document.createElement('span')
  const halo = document.createElement('span')
  const core = document.createElement('span')
  const label = document.createElement('span')

  marker.type = 'button'
  marker.className = 'destination-marker'
  marker.setAttribute('aria-label', `Discover ${destination.title}`)

  visual.className = 'destination-marker__visual'
  halo.className = 'destination-marker__halo'
  core.className = 'destination-marker__core'
  label.className = 'destination-marker__label'
  label.textContent = destination.title

  visual.append(halo, core)
  marker.append(visual, label)

  return marker
}

export function RegionDestinationMarker({
  destination,
  map,
  onSelect,
}: RegionDestinationMarkerProps) {
  useEffect(() => {
    const markerElement = createMarkerElement(destination)
    const marker = new mapboxgl.Marker({
      anchor: 'center',
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
  }, [destination, map, onSelect])

  return null
}
