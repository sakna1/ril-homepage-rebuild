import type { JourneyItem } from './JourneyContext'
import { getRegionEditorialName, REGION_RHYTHM_ORDER } from './journeyRegionCatalog'
import { journeyRegions } from '../data/journeyRegions'

export type EmergingRhythmResult = {
  sequence: string[]
  summary: string
} | null

function resolveRegionIdFromItem(item: JourneyItem): string | undefined {
  if (item.kind !== 'region') {
    return undefined
  }

  const match = journeyRegions.find(
    (region) => getRegionEditorialName(region.id) === item.label || region.title === item.label,
  )
  return match?.id
}

export function getEmergingRhythm(items: JourneyItem[]): EmergingRhythmResult {
  const savedRegions = items.filter((item) => item.kind === 'region')
  const savedDestinations = items.filter((item) => item.kind === 'destination')
  const savedExperiences = items.filter((item) => item.kind === 'experience')

  const regionLabels = new Map<string, string>()

  savedRegions.forEach((item) => {
    const regionId = resolveRegionIdFromItem(item)
    if (regionId) {
      regionLabels.set(regionId, item.label)
    }
  })

  savedDestinations.forEach((item) => {
    if (item.parentRegion) {
      const match = journeyRegions.find(
        (region) => getRegionEditorialName(region.id) === item.parentRegion,
      )
      if (match) {
        regionLabels.set(match.id, item.parentRegion)
      }
    }
  })

  if (regionLabels.size < 2 && savedDestinations.length + savedExperiences.length < 2) {
    return null
  }

  if (regionLabels.size < 2) {
    return null
  }

  const ordered = REGION_RHYTHM_ORDER.filter((regionId) => regionLabels.has(regionId)).map(
    (regionId) => regionLabels.get(regionId) ?? getRegionEditorialName(regionId),
  )

  if (ordered.length < 2) {
    return null
  }

  return {
    sequence: ordered,
    summary: 'A considered beginning, ready to be refined privately.',
  }
}

export function hasEnoughForRhythm(items: JourneyItem[]): boolean {
  const locationCount = items.filter((item) =>
    ['region', 'destination', 'experience'].includes(item.kind),
  ).length
  return locationCount >= 2 || getEmergingRhythm(items) !== null
}
