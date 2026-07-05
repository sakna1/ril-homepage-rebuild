import { type ReactNode, useEffect, useRef, useState } from 'react'
import mapboxgl, { type LngLatBoundsLike, type LngLatLike, type Map } from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { MapControls } from './MapControls'
import './TravelMap.css'

const SRI_LANKA_CENTER: LngLatLike = [80.77, 7.87]
const SRI_LANKA_BOUNDS: LngLatBoundsLike = [
  [79.45, 5.72],
  [81.95, 9.84],
]
const SRI_LANKA_FOCUS_BOUNDS: LngLatBoundsLike = [
  [79.62, 5.92],
  [81.84, 9.72],
]
const OVERVIEW_DRAG_ZOOM_THRESHOLD = 7.6
const MAP_MASK_COLOR = '#fbf9f5'
const COUNTRY_BOUNDARIES_SOURCE_ID = 'country-boundaries'
const COUNTRY_MASK_LAYER_ID = 'sri-lanka-country-mask'

// Keep Sri Lanka visible and paint every other country with the map background color.
const excludeSriLankaFilter = [
  '!',
  [
    'any',
    ['==', ['get', 'iso_3166_1'], 'LK'],
    ['==', ['get', 'iso_3166_1_alpha_2'], 'LK'],
    ['==', ['get', 'iso_3166_1_alpha_3'], 'LKA'],
  ],
]

function isWaterLayer(layer: { id: string }) {
  return layer.id.toLowerCase().includes('water')
}

function muteBaseMapSymbols(map: Map, layerId: string) {
  map.setPaintProperty(layerId, 'text-opacity', 0)
  map.setPaintProperty(layerId, 'icon-opacity', 0)
}

function applySriLankaMask(map: Map) {
  if (!map.getSource(COUNTRY_BOUNDARIES_SOURCE_ID)) {
    map.addSource(COUNTRY_BOUNDARIES_SOURCE_ID, {
      type: 'vector',
      url: 'mapbox://mapbox.country-boundaries-v1',
    })
  }

  const styleLayers = map.getStyle().layers ?? []

  for (const layer of styleLayers) {
    if (layer.type === 'symbol') {
      muteBaseMapSymbols(map, layer.id)
    }

    if (isWaterLayer(layer) && layer.type === 'fill') {
      map.setPaintProperty(layer.id, 'fill-color', MAP_MASK_COLOR)
    }
  }

  if (!map.getLayer(COUNTRY_MASK_LAYER_ID)) {
    map.addLayer({
      id: COUNTRY_MASK_LAYER_ID,
      type: 'fill',
      source: COUNTRY_BOUNDARIES_SOURCE_ID,
      'source-layer': 'country_boundaries',
      filter: excludeSriLankaFilter,
      paint: {
        'fill-color': MAP_MASK_COLOR,
        'fill-opacity': 1,
      },
    })
  }
}

function keepOverviewFocused(map: Map) {
  if (map.getZoom() <= OVERVIEW_DRAG_ZOOM_THRESHOLD) {
    map.dragPan.disable()
    return
  }

  map.dragPan.enable()
}

export type TravelMapProps = {
  children?: ReactNode | ((map: Map) => ReactNode)
  className?: string
  center?: LngLatLike
  maxBounds?: LngLatBoundsLike
  maxZoom?: number
  minZoom?: number
  onMapReady?: (map: Map) => void
  styleUrl?: string
  zoom?: number
}

export function TravelMap({
  children,
  className,
  center = SRI_LANKA_CENTER,
  maxBounds = SRI_LANKA_BOUNDS,
  maxZoom = 14,
  minZoom = 6.8,
  onMapReady,
  styleUrl = 'mapbox://styles/mapbox/streets-v12',
  zoom = 7.4,
}: TravelMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<Map | null>(null)
  const [mapInstance, setMapInstance] = useState<Map | null>(null)
  const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN

  useEffect(() => {
    if (!containerRef.current || !accessToken || mapRef.current) {
      return
    }

    mapboxgl.accessToken = accessToken

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: styleUrl,
      center,
      zoom,
      minZoom,
      maxZoom,
      maxBounds,
      renderWorldCopies: false,
    })

    mapRef.current = map
    let isRestoringOverview = false

    const handleMapLoad = () => {
      applySriLankaMask(map)
      map.fitBounds(SRI_LANKA_FOCUS_BOUNDS, {
        duration: 0,
        padding: 12,
      })
      keepOverviewFocused(map)
      setMapInstance(map)
      onMapReady?.(map)
    }

    const handleZoomEnd = () => {
      keepOverviewFocused(map)

      if (map.getZoom() > OVERVIEW_DRAG_ZOOM_THRESHOLD || isRestoringOverview) {
        return
      }

      isRestoringOverview = true
      map.fitBounds(SRI_LANKA_FOCUS_BOUNDS, {
        duration: 320,
        padding: 12,
      })
      map.once('moveend', () => {
        isRestoringOverview = false
        keepOverviewFocused(map)
      })
    }

    map.on('zoomend', handleZoomEnd)

    if (map.loaded()) {
      handleMapLoad()
    } else {
      map.once('load', handleMapLoad)
    }

    return () => {
      map.off('load', handleMapLoad)
      map.off('zoomend', handleZoomEnd)
      map.remove()
      mapRef.current = null
      setMapInstance(null)
    }
  }, [accessToken, center, maxBounds, maxZoom, minZoom, onMapReady, styleUrl, zoom])

  if (!accessToken) {
    return (
      <div className={`travel-map travel-map--empty ${className ?? ''}`.trim()} role="status">
        Mapbox access token is not configured.
      </div>
    )
  }

  return (
    <div className={`travel-map ${className ?? ''}`.trim()}>
      <div ref={containerRef} className="travel-map__canvas" aria-label="Interactive map of Sri Lanka" />
      {mapInstance ? (
        <>
          <MapControls map={mapInstance} />
          {typeof children === 'function' ? children(mapInstance) : children}
        </>
      ) : null}
    </div>
  )
}
