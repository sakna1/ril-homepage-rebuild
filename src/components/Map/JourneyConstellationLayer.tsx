import { useEffect } from 'react'
import type { Map } from 'mapbox-gl'
import { findCatalogDestinationById } from '../../services/journeyRepository'

type JourneyConstellationLayerProps = {
  map: Map
  destinationIds: string[]
  /**
   * Road-following geometry from the Directions API. When supplied the line
   * follows real roads; otherwise it falls back to straight stop-to-stop lines.
   */
  routeCoordinates?: [number, number][]
}

const CONSTELLATION_SOURCE_ID = 'journey-constellation'
const CONSTELLATION_LAYER_ID = 'journey-constellation-line'
const CONSTELLATION_CASING_LAYER_ID = 'journey-constellation-line-casing'

function isMapStyleReady(map: Map): boolean {
  try {
    // isStyleLoaded() is the accurate check — getStyle() resolves before the
    // style can actually accept addSource/addLayer calls.
    return map.isStyleLoaded()
  } catch {
    return false
  }
}

function buildConstellationGeoJson(
  destinationIds: string[],
  routeCoordinates?: [number, number][],
) {
  const coordinates =
    routeCoordinates && routeCoordinates.length >= 2
      ? routeCoordinates
      : destinationIds
          .map((id) => findCatalogDestinationById(id)?.destination.coordinates)
          .filter((coords): coords is [number, number] => Boolean(coords))

  if (coordinates.length < 2) {
    return {
      type: 'FeatureCollection' as const,
      features: [],
    }
  }

  return {
    type: 'FeatureCollection' as const,
    features: [
      {
        type: 'Feature' as const,
        properties: {
          illustrative: true,
        },
        geometry: {
          type: 'LineString' as const,
          coordinates,
        },
      },
    ],
  }
}

function removeConstellationLayers(map: Map) {
  if (!isMapStyleReady(map)) {
    return
  }

  try {
    if (map.getLayer(CONSTELLATION_LAYER_ID)) {
      map.removeLayer(CONSTELLATION_LAYER_ID)
    }
    if (map.getLayer(CONSTELLATION_CASING_LAYER_ID)) {
      map.removeLayer(CONSTELLATION_CASING_LAYER_ID)
    }
    if (map.getSource(CONSTELLATION_SOURCE_ID)) {
      map.removeSource(CONSTELLATION_SOURCE_ID)
    }
  } catch {
    // Map may already be mid-teardown when TravelMap unmounts.
  }
}

function applyConstellation(
  map: Map,
  destinationIds: string[],
  routeCoordinates?: [number, number][],
) {
  if (!isMapStyleReady(map)) {
    return
  }

  const geoJson = buildConstellationGeoJson(destinationIds, routeCoordinates)

  try {
    const existing = map.getSource(CONSTELLATION_SOURCE_ID)
    if (existing && 'setData' in existing) {
      existing.setData(geoJson)
      return
    }

    map.addSource(CONSTELLATION_SOURCE_ID, {
      type: 'geojson',
      data: geoJson,
    })

    // Google-Maps-style route: a white casing underneath keeps the red line
    // readable over both light land and road colours.
    map.addLayer({
      id: CONSTELLATION_CASING_LAYER_ID,
      type: 'line',
      source: CONSTELLATION_SOURCE_ID,
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
      paint: {
        'line-color': '#ffffff',
        'line-width': 7,
        'line-opacity': 0.9,
      },
    })

    map.addLayer({
      id: CONSTELLATION_LAYER_ID,
      type: 'line',
      source: CONSTELLATION_SOURCE_ID,
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
      paint: {
        'line-color': '#d93025',
        'line-width': 4,
        'line-opacity': 0.95,
      },
    })
  } catch {
    // Style wasn't ready to accept layers yet — a later styledata/idle event retries.
  }
}

export function JourneyConstellationLayer({
  map,
  destinationIds,
  routeCoordinates,
}: JourneyConstellationLayerProps) {
  useEffect(() => {
    const syncConstellation = () => applyConstellation(map, destinationIds, routeCoordinates)

    // This layer mounts *after* TravelMap's own `load` handler has run, so
    // `once('load')` would never fire. Apply immediately, then keep retrying on
    // styledata/idle until the style is ready to accept the source and layers.
    syncConstellation()
    map.on('styledata', syncConstellation)
    map.on('idle', syncConstellation)

    return () => {
      map.off('styledata', syncConstellation)
      map.off('idle', syncConstellation)
      removeConstellationLayers(map)
    }
  }, [destinationIds, map, routeCoordinates])

  return null
}
