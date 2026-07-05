import { experiences } from '../data/experiences'
import { journeyRegions, type JourneyRegion } from '../data/journeyRegions'
import type { JourneyItem } from './JourneyContext'
import { getRegionEditorialName, REGION_RHYTHM_ORDER } from './journeyRegionCatalog'
import { findRegionIdByLabel, normalizeRegionLabel } from './savedJourneyDisplay'

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-')
}

function findDestinationIdByLabel(label: string, regions: JourneyRegion[]): string | undefined {
  for (const region of regions) {
    const match = region.destinations.find((destination) => destination.title === label)
    if (match) {
      return match.id
    }
  }
  return undefined
}

function findDestinationIdBySlug(slug: string, regions: JourneyRegion[]): string | undefined {
  for (const region of regions) {
    const match = region.destinations.find((destination) => slugify(destination.title) === slug)
    if (match) {
      return match.id
    }
  }
  return undefined
}

/** Resolve catalogue destination IDs from saved journey items, including experiences. */
export function resolveSavedDestinationIds(
  savedItems: JourneyItem[],
  regions: JourneyRegion[] = journeyRegions,
): string[] {
  const ids = new Set<string>()

  savedItems.forEach((item) => {
    if (item.kind === 'destination') {
      const byLabel = findDestinationIdByLabel(item.label, regions)
      if (byLabel) {
        ids.add(byLabel)
        return
      }
      const slug = item.id.replace(/^destination:/, '')
      const bySlug = findDestinationIdBySlug(slug, regions)
      if (bySlug) {
        ids.add(bySlug)
      }
      return
    }

    if (item.kind === 'experience') {
      const experience = experiences.find((entry) => entry.title === item.label)
      if (experience?.destinationId) {
        ids.add(experience.destinationId)
      }
    }
  })

  return Array.from(ids)
}

/** Resolve region IDs implied by saved regions, destinations, and experiences. */
export function resolveSavedRegionIds(
  savedItems: JourneyItem[],
  regions: JourneyRegion[] = journeyRegions,
): string[] {
  const regionIds = new Set<string>()
  const savedLabels = new Set(savedItems.map((item) => item.label))

  savedItems.forEach((item) => {
    if (item.kind === 'region') {
      const regionId = findRegionIdByLabel(item.label)
      if (regionId) {
        regionIds.add(regionId)
      }
    }

    if (item.parentRegion) {
      const regionId = findRegionIdByLabel(item.parentRegion)
      if (regionId) {
        regionIds.add(regionId)
      }
    }
  })

  regions.forEach((region) => {
    const editorialName = getRegionEditorialName(region.id)
    if (savedLabels.has(editorialName) || savedLabels.has(region.title)) {
      regionIds.add(region.id)
    }

    savedItems.forEach((item) => {
      if (item.kind === 'region' && normalizeRegionLabel(item.label) === editorialName) {
        regionIds.add(region.id)
      }
    })

    region.destinations.forEach((destination) => {
      if (savedLabels.has(destination.title)) {
        regionIds.add(region.id)
      }
    })
  })

  savedItems
    .filter((item) => item.kind === 'experience')
    .forEach((item) => {
      const experience = experiences.find((entry) => entry.title === item.label)
      if (!experience?.destinationId) {
        return
      }
      const region = regions.find((entry) =>
        entry.destinations.some((destination) => destination.id === experience.destinationId),
      )
      if (region) {
        regionIds.add(region.id)
      }
    })

  return Array.from(regionIds)
}

/**
 * Stable editorial order for map constellation / transfer lookup.
 * Uses region rhythm order, then catalogue order within each region — not save order.
 */
export function orderDestinationIdsEditorially(
  destinationIds: string[],
  regions: JourneyRegion[] = journeyRegions,
): string[] {
  const orderEntries = destinationIds.map((id) => {
    for (const region of regions) {
      const destinationIndex = region.destinations.findIndex((destination) => destination.id === id)
      if (destinationIndex < 0) {
        continue
      }
      const regionOrder = REGION_RHYTHM_ORDER.indexOf(region.id)
      return {
        id,
        order: (regionOrder === -1 ? 99 : regionOrder) * 100 + destinationIndex,
      }
    }
    return { id, order: 9999 }
  })

  return orderEntries.sort((left, right) => left.order - right.order || left.id.localeCompare(right.id)).map((entry) => entry.id)
}
