import { experiences, type Experience as CatalogExperience } from '../experiences'
import { getDestinationRecommendationMetadata } from '../journeyConsultation'
import { journeyRegions, type JourneyRegion, type RegionDestination } from '../journeyRegions'
import { getRegionEditorialName } from '../../journey/journeyRegionCatalog'
import type { Destination, JourneyExperience, MapPosition } from './types'

const SRI_LANKA_BOUNDS = {
  minLng: 79.62,
  maxLng: 81.84,
  minLat: 5.92,
  maxLat: 9.72,
}

const PRIMARY_REGION_IDS = new Set([
  'western-gateway',
  'southern-coast',
  'wild-south',
  'east-coast',
  'hill-country',
  'cultural-triangle',
  'northern-peninsula',
])

export function coordsToMapPosition(coordinates: [number, number]): MapPosition {
  const [lng, lat] = coordinates
  return {
    x: ((lng - SRI_LANKA_BOUNDS.minLng) / (SRI_LANKA_BOUNDS.maxLng - SRI_LANKA_BOUNDS.minLng)) * 100,
    y:
      ((SRI_LANKA_BOUNDS.maxLat - lat) / (SRI_LANKA_BOUNDS.maxLat - SRI_LANKA_BOUNDS.minLat)) * 100,
  }
}

function regionJourneyOrder(regionId: string): number {
  const order = [
    'western-gateway',
    'southern-coast',
    'hill-country',
    'cultural-triangle',
    'east-coast',
    'wild-south',
    'northern-peninsula',
  ]
  const index = order.indexOf(regionId)
  return index >= 0 ? index : 99
}

export function adaptRegionDestination(
  destination: RegionDestination,
  region: JourneyRegion,
): Destination {
  const metadata = getDestinationRecommendationMetadata(destination.id, 'Sri Lanka')
  return {
    id: destination.id,
    name: destination.title,
    regionId: region.id,
    regionName: getRegionEditorialName(region.id),
    shortDescription: destination.description,
    mapPosition: coordsToMapPosition(destination.coordinates),
    themeIds: metadata.journeyThemes,
    experienceIds: destination.experienceIds,
    recommendedNights: 2,
    journeyOrder: regionJourneyOrder(region.id),
    image: destination.heroImage,
    isRepresentative: true,
    coordinates: destination.coordinates,
  }
}

export function adaptCatalogExperience(
  experience: CatalogExperience,
  regionId?: string,
): JourneyExperience {
  const region = journeyRegions.find((entry) =>
    entry.destinations.some((destination) => destination.id === experience.destinationId),
  )
  const metadata = getDestinationRecommendationMetadata(experience.destinationId, 'Sri Lanka')

  return {
    id: experience.id,
    title: experience.title,
    destinationId: experience.destinationId,
    regionId: regionId ?? region?.id,
    themeIds: metadata.journeyThemes,
    shortDescription: experience.description,
    durationLabel: experience.duration,
    image: experience.heroImage,
    isRepresentative: true,
  }
}

export function buildDestinationsFromRegions(regions: JourneyRegion[] = journeyRegions): Destination[] {
  return regions
    .filter((region) => PRIMARY_REGION_IDS.has(region.id))
    .flatMap((region) => region.destinations.map((destination) => adaptRegionDestination(destination, region)))
}

export function buildExperiencesFromCatalog(): JourneyExperience[] {
  return experiences.map((experience) => adaptCatalogExperience(experience))
}

export function findRegionForDestinationId(destinationId: string): JourneyRegion | undefined {
  return journeyRegions.find((region) => region.destinations.some((destination) => destination.id === destinationId))
}

export function findCatalogDestinationById(destinationId: string): {
  destination: RegionDestination
  region: JourneyRegion
} | undefined {
  for (const region of journeyRegions) {
    const destination = region.destinations.find((entry) => entry.id === destinationId)
    if (destination) {
      return { destination, region }
    }
  }
  return undefined
}
