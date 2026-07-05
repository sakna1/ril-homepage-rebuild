import { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import mapboxgl, { type Map, type Popup } from 'mapbox-gl'
import type { Destination } from '../../data/destinations'
import { DestinationPopup } from './DestinationPopup'

type PopupAnchor =
  | 'bottom'
  | 'bottom-left'
  | 'bottom-right'
  | 'left'
  | 'right'
  | 'top'
  | 'top-left'
  | 'top-right'

type DestinationMarkerProps = {
  destination: Destination
  map: Map
}

let activePopupRequest = 0
let closeActivePopup: (() => void) | null = null

function createMarkerElement(destination: Destination) {
  const marker = document.createElement('button')
  const visual = document.createElement('span')
  const halo = document.createElement('span')
  const core = document.createElement('span')
  const label = document.createElement('span')

  marker.type = 'button'
  marker.className = 'destination-marker'
  marker.setAttribute('aria-label', `Discover ${destination.name}`)

  visual.className = 'destination-marker__visual'
  halo.className = 'destination-marker__halo'
  core.className = 'destination-marker__core'
  label.className = 'destination-marker__label'
  label.textContent = destination.name

  visual.append(halo, core)
  marker.append(visual, label)

  return marker
}

function getPopupAnchor(map: Map, coordinates: Destination['coordinates']): PopupAnchor {
  const point = map.project(coordinates)
  const canvas = map.getCanvas()
  const edgePadding = 220
  const isNearTop = point.y < edgePadding
  const isNearBottom = point.y > canvas.clientHeight - edgePadding
  const isNearLeft = point.x < edgePadding
  const isNearRight = point.x > canvas.clientWidth - edgePadding

  if (isNearTop && isNearLeft) {
    return 'top-left'
  }

  if (isNearTop && isNearRight) {
    return 'top-right'
  }

  if (isNearBottom && isNearLeft) {
    return 'bottom-left'
  }

  if (isNearBottom && isNearRight) {
    return 'bottom-right'
  }

  if (isNearTop) {
    return 'top'
  }

  if (isNearBottom) {
    return 'bottom'
  }

  if (isNearLeft) {
    return 'left'
  }

  if (isNearRight) {
    return 'right'
  }

  return 'bottom'
}

function getFlyToOffset(anchor: PopupAnchor): [number, number] {
  const x =
    anchor.endsWith('left') || anchor === 'left'
      ? -140
      : anchor.endsWith('right') || anchor === 'right'
        ? 140
        : 0
  const y = anchor.startsWith('top') ? -120 : anchor.startsWith('bottom') ? 120 : 0

  return [x, y]
}

export function DestinationMarker({ destination, map }: DestinationMarkerProps) {
  useEffect(() => {
    const markerElement = createMarkerElement(destination)
    const popupElement = document.createElement('div')
    const popupRoot = createRoot(popupElement)

    popupRoot.render(<DestinationPopup destination={destination} />)

    let popup: Popup | null = null
    const removePopup = () => popup?.remove()

    const marker = new mapboxgl.Marker({
      anchor: 'center',
      element: markerElement,
    })
      .setLngLat(destination.coordinates)
      .addTo(map)

    const openPopup = () => {
      const popupRequest = activePopupRequest + 1
      const anchor = getPopupAnchor(map, destination.coordinates)
      const targetZoom = Math.max(map.getZoom(), 7.55)

      activePopupRequest = popupRequest
      closeActivePopup?.()
      popup?.remove()
      popup = new mapboxgl.Popup({
        anchor,
        className: 'destination-popup',
        closeButton: false,
        closeOnClick: true,
        focusAfterOpen: false,
        maxWidth: '360px',
        offset: 28,
      })
      closeActivePopup = removePopup

      map.flyTo({
        center: destination.coordinates,
        curve: 1.25,
        duration: 850,
        essential: true,
        offset: getFlyToOffset(anchor),
        speed: 0.75,
        zoom: targetZoom,
      })

      map.once('moveend', () => {
        if (popupRequest !== activePopupRequest) {
          return
        }

        popup?.setLngLat(destination.coordinates).setDOMContent(popupElement).addTo(map)
      })
    }

    markerElement.addEventListener('click', openPopup)

    return () => {
      markerElement.removeEventListener('click', openPopup)
      marker.remove()
      popup?.remove()
      if (closeActivePopup === removePopup) {
        closeActivePopup = null
      }
      popupRoot.unmount()
    }
  }, [destination, map])

  return null
}
