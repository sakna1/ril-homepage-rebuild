import { useEffect } from 'react'
import type { Map } from 'mapbox-gl'
import { findCatalogDestinationById } from '../../services/journeyRepository'

type JourneyConstellationLayerProps = {
  map: Map
  destinationIds: string[]
}

const CONSTELLATION_SOURCE_ID = 'journey-constellation'
const CONSTELLATION_LAYER_ID = 'journey-constellation-line'
const CONSTELLATION_CASING_LAYER_ID = 'journey-constellation-line-casing'

function isMapStyleReady(map: Map): boolean {
  try {
    return Boolean(map.getStyle())
  } catch {
    return false
  }
}

function buildConstellationGeoJson(destinationIds: string[]) {
  const coordinates = destinationIds
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

function applyConstellation(map: Map, destinationIds: string[]) {
  if (!isMapStyleReady(map)) {
    return
  }

  const geoJson = buildConstellationGeoJson(destinationIds)

  if (!map.getSource(CONSTELLATION_SOURCE_ID)) {
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
    return
  }

  const source = map.getSource(CONSTELLATION_SOURCE_ID)
  if (source && 'setData' in source) {
    source.setData(geoJson)
  }
}

export function JourneyConstellationLayer({ map, destinationIds }: JourneyConstellationLayerProps) {
  useEffect(() => {
    const syncConstellation = () => applyConstellation(map, destinationIds)

    if (map.loaded()) {
      syncConstellation()
    } else {
      map.once('load', syncConstellation)
    }

    return () => {
      map.off('load', syncConstellation)
      removeConstellationLayers(map)
    }
  }, [destinationIds, map])

  return null
}
