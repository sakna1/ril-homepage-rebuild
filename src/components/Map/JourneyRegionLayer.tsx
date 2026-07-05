import { useEffect } from 'react'
import type { DataDrivenPropertyValueSpecification, Map, MapLayerMouseEvent } from 'mapbox-gl'
import type { JourneyRegion } from '../../data/journeyRegions'

type JourneyRegionLayerProps = {
  map: Map
  recommendedRegionIds?: string[]
  regions: JourneyRegion[]
  selectedRegionId?: string
  onRegionSelect: (region: JourneyRegion) => void
}

type RegionPolygonFeatureCollection = {
  type: 'FeatureCollection'
  features: Array<{
    type: 'Feature'
    id: string
    properties: {
      id: string
      title: string
    }
    geometry: {
      type: 'Polygon'
      coordinates: [number, number][][]
    }
  }>
}

type RegionLabelFeatureCollection = {
  type: 'FeatureCollection'
  features: Array<{
    type: 'Feature'
    id: string
    properties: {
      id: string
      title: string
    }
    geometry: {
      type: 'Point'
      coordinates: [number, number]
    }
  }>
}

const REGION_SOURCE_ID = 'journey-regions'
const REGION_LABEL_SOURCE_ID = 'journey-region-labels'
const REGION_FILL_LAYER_ID = 'journey-region-fill'
const REGION_GLOW_LAYER_ID = 'journey-region-glow'
const REGION_LINE_LAYER_ID = 'journey-region-line'
const REGION_LABEL_LAYER_ID = 'journey-region-label'

function createRegionFeatureCollection(regions: JourneyRegion[]): RegionPolygonFeatureCollection {
  return {
    type: 'FeatureCollection',
    features: regions.map((region) => ({
      type: 'Feature',
      id: region.id,
      properties: {
        id: region.id,
        title: region.title,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[...region.polygon, region.polygon[0]]],
      },
    })),
  }
}

function createRegionLabelFeatureCollection(regions: JourneyRegion[]): RegionLabelFeatureCollection {
  return {
    type: 'FeatureCollection',
    features: regions.map((region) => ({
      type: 'Feature',
      id: region.id,
      properties: {
        id: region.id,
        title: region.title,
      },
      geometry: {
        type: 'Point',
        coordinates: region.center,
      },
    })),
  }
}

function setSourceData(map: Map, sourceId: string, data: unknown) {
  const source = map.getSource(sourceId) as { setData?: (nextData: unknown) => void } | undefined
  source?.setData?.(data)
}

function getRegionOpacityExpression(
  selectedRegionId?: string,
  recommendedRegionIds: string[] = [],
): DataDrivenPropertyValueSpecification<number> {
  const hasRecommendations = recommendedRegionIds.length > 0

  if (!selectedRegionId) {
    if (!hasRecommendations) {
      return ['case', ['boolean', ['feature-state', 'hover'], false], 0.3, 0.12]
    }

    return [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      0.34,
      ['in', ['get', 'id'], ['literal', recommendedRegionIds]],
      0.22,
      0.035,
    ]
  }

  return [
    'case',
    ['boolean', ['feature-state', 'hover'], false],
    0.34,
    ['==', ['get', 'id'], selectedRegionId],
    0.24,
    ['in', ['get', 'id'], ['literal', recommendedRegionIds]],
    0.11,
    0.035,
  ]
}

function getLabelOpacityExpression(
  selectedRegionId?: string,
  recommendedRegionIds: string[] = [],
): DataDrivenPropertyValueSpecification<number> {
  const hasRecommendations = recommendedRegionIds.length > 0

  if (!selectedRegionId) {
    if (!hasRecommendations) {
      return 0.82
    }

    return ['case', ['in', ['get', 'id'], ['literal', recommendedRegionIds]], 0.9, 0.18]
  }

  return [
    'case',
    ['==', ['get', 'id'], selectedRegionId],
    0.96,
    ['in', ['get', 'id'], ['literal', recommendedRegionIds]],
    0.44,
    0.14,
  ]
}

export function JourneyRegionLayer({
  map,
  recommendedRegionIds = [],
  regions,
  selectedRegionId,
  onRegionSelect,
}: JourneyRegionLayerProps) {
  useEffect(() => {
    const regionData = createRegionFeatureCollection(regions)
    const labelData = createRegionLabelFeatureCollection(regions)

    if (!map.getSource(REGION_SOURCE_ID)) {
      map.addSource(REGION_SOURCE_ID, {
        type: 'geojson',
        data: regionData,
        promoteId: 'id',
      })
    } else {
      setSourceData(map, REGION_SOURCE_ID, regionData)
    }

    if (!map.getSource(REGION_LABEL_SOURCE_ID)) {
      map.addSource(REGION_LABEL_SOURCE_ID, {
        type: 'geojson',
        data: labelData,
        promoteId: 'id',
      })
    } else {
      setSourceData(map, REGION_LABEL_SOURCE_ID, labelData)
    }

    if (!map.getLayer(REGION_FILL_LAYER_ID)) {
      map.addLayer({
        id: REGION_FILL_LAYER_ID,
        type: 'fill',
        source: REGION_SOURCE_ID,
        paint: {
          'fill-color': '#c5a059',
          'fill-opacity': getRegionOpacityExpression(selectedRegionId, recommendedRegionIds),
        },
      })
    }

    if (!map.getLayer(REGION_GLOW_LAYER_ID)) {
      map.addLayer({
        id: REGION_GLOW_LAYER_ID,
        type: 'line',
        source: REGION_SOURCE_ID,
        paint: {
          'line-color': '#c5a059',
          'line-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 0.58, 0],
          'line-width': ['case', ['boolean', ['feature-state', 'hover'], false], 28, 8],
          'line-blur': 22,
        },
      })
    }

    if (!map.getLayer(REGION_LINE_LAYER_ID)) {
      map.addLayer({
        id: REGION_LINE_LAYER_ID,
        type: 'line',
        source: REGION_SOURCE_ID,
        paint: {
          'line-color': '#004225',
          'line-opacity': 0.18,
          'line-width': 1,
          'line-blur': 1.4,
        },
      })
    }

    if (!map.getLayer(REGION_LABEL_LAYER_ID)) {
      map.addLayer({
        id: REGION_LABEL_LAYER_ID,
        type: 'symbol',
        source: REGION_LABEL_SOURCE_ID,
        layout: {
          'text-field': ['get', 'title'],
          'text-size': 11,
          'text-letter-spacing': 0.12,
          'text-transform': 'uppercase',
          'text-allow-overlap': false,
          'text-ignore-placement': false,
        },
        paint: {
          'text-color': '#004225',
          'text-halo-color': '#fbf9f5',
          'text-halo-width': 1.4,
          'text-opacity': getLabelOpacityExpression(selectedRegionId, recommendedRegionIds),
        },
      })
    }

    const handleClick = (event: MapLayerMouseEvent) => {
      const feature = event.features?.[0] as { properties?: { id?: string } } | undefined
      const regionId = feature?.properties?.id
      const region = regions.find((item) => item.id === regionId)

      if (region) {
        onRegionSelect(region)
      }
    }

    let hoveredRegionId: string | number | undefined

    const handleMouseMove = (event: MapLayerMouseEvent) => {
      map.getCanvas().style.cursor = 'pointer'
      const feature = event.features?.[0] as { id?: string | number; properties?: { id?: string } } | undefined
      const nextRegionId = feature?.id ?? feature?.properties?.id

      if (hoveredRegionId === nextRegionId) {
        return
      }

      if (hoveredRegionId !== undefined) {
        map.setFeatureState({ source: REGION_SOURCE_ID, id: hoveredRegionId }, { hover: false })
      }

      hoveredRegionId = nextRegionId

      if (hoveredRegionId !== undefined) {
        map.setFeatureState({ source: REGION_SOURCE_ID, id: hoveredRegionId }, { hover: true })
      }
    }

    const handleMouseLeave = () => {
      map.getCanvas().style.cursor = ''

      if (hoveredRegionId !== undefined) {
        map.setFeatureState({ source: REGION_SOURCE_ID, id: hoveredRegionId }, { hover: false })
      }

      hoveredRegionId = undefined
    }

    map.on('click', REGION_FILL_LAYER_ID, handleClick)
    map.on('mousemove', REGION_FILL_LAYER_ID, handleMouseMove)
    map.on('mouseleave', REGION_FILL_LAYER_ID, handleMouseLeave)

    return () => {
      map.off('click', REGION_FILL_LAYER_ID, handleClick)
      map.off('mousemove', REGION_FILL_LAYER_ID, handleMouseMove)
      map.off('mouseleave', REGION_FILL_LAYER_ID, handleMouseLeave)

      if (hoveredRegionId !== undefined) {
        map.setFeatureState({ source: REGION_SOURCE_ID, id: hoveredRegionId }, { hover: false })
      }
    }
  }, [map, onRegionSelect, recommendedRegionIds, regions, selectedRegionId])

  useEffect(() => {
    if (map.getLayer(REGION_FILL_LAYER_ID)) {
      map.setPaintProperty(
        REGION_FILL_LAYER_ID,
        'fill-opacity',
        getRegionOpacityExpression(selectedRegionId, recommendedRegionIds),
      )
    }

    if (map.getLayer(REGION_LABEL_LAYER_ID)) {
      map.setPaintProperty(
        REGION_LABEL_LAYER_ID,
        'text-opacity',
        getLabelOpacityExpression(selectedRegionId, recommendedRegionIds),
      )
    }
  }, [map, recommendedRegionIds, selectedRegionId])

  return null
}
