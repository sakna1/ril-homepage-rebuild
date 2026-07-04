import { journeyThemes } from '../data/journeyConsultation'
import { journeyRegions } from '../data/journeyRegions'
import { destinationDiscoveryWorlds, sharedHeritageWorld } from './discoveryWorlds'
import type { JourneyItem, JourneyItemKind } from './JourneyContext'
import { inferJourneyTheme } from './journeyTaxonomy'
import { regionMatchesTheme } from './journeyRegionCatalog'
import { findRegionIdByLabel, normalizeJourneyItemLabels } from './savedJourneyDisplay'

export type DirectionCatalogEntry = {
  id: string
  title: string
  description: string
}

export type DirectionSavedEntry = {
  item: JourneyItem
  relationshipLabel?: string
}

export type DirectionView = {
  id: string
  title: string
  description: string
  isSavedTheme: boolean
  entries: DirectionSavedEntry[]
}

export type DirectionsResult = {
  directions: DirectionView[]
  independentItems: JourneyItem[]
}

const DIRECTION_CATALOG: DirectionCatalogEntry[] = [
  ...journeyThemes.map((theme) => ({
    id: theme.id,
    title: theme.title,
    description: theme.description,
  })),
  {
    id: sharedHeritageWorld.id,
    title: sharedHeritageWorld.name,
    description:
      'A considered route through tea country, railway engineering, old gardens, civic streets, and grand hotels where Sri Lankan and British histories still meet.',
  },
]

const PLACE_KINDS: JourneyItemKind[] = ['region', 'destination', 'experience']

const ENTRY_KIND_ORDER: JourneyItemKind[] = ['region', 'destination', 'experience', 'mood', 'season']

export function getDirectionCatalog(): DirectionCatalogEntry[] {
  return DIRECTION_CATALOG
}

export function getDirectionById(directionId: string): DirectionCatalogEntry | undefined {
  return DIRECTION_CATALOG.find((entry) => entry.id === directionId)
}

export function resolveThemeIdFromLabel(label: string): string | undefined {
  const match = DIRECTION_CATALOG.find((entry) => entry.title === label)
  return match?.id
}

export function resolveThemeLabelFromId(directionId: string): string | undefined {
  return DIRECTION_CATALOG.find((entry) => entry.id === directionId)?.title
}

function isThemeItem(item: JourneyItem): boolean {
  return item.kind === 'theme' || item.kind === 'discovery-world'
}

function getSavedDirectionIds(items: JourneyItem[]): Set<string> {
  const ids = new Set<string>()
  items.forEach((item) => {
    if (isThemeItem(item)) {
      const id = resolveThemeIdFromLabel(item.label)
      if (id) {
        ids.add(id)
      }
    }
  })
  return ids
}

function getRelatedDirectionIds(item: JourneyItem): string[] {
  const related = new Set<string>()

  if (item.parentTheme) {
    const id = resolveThemeIdFromLabel(item.parentTheme)
    if (id) {
      related.add(id)
    }
  }

  if (isThemeItem(item)) {
    const id = resolveThemeIdFromLabel(item.label)
    if (id) {
      related.add(id)
    }
    return Array.from(related)
  }

  if (item.kind === 'destination') {
    const worlds = destinationDiscoveryWorlds[item.label]
    if (worlds) {
      const primaryId = resolveThemeIdFromLabel(worlds.primary)
      if (primaryId) {
        related.add(primaryId)
      }
      worlds.secondary.forEach((themeLabel) => {
        const id = resolveThemeIdFromLabel(themeLabel)
        if (id) {
          related.add(id)
        }
      })
    }
  }

  if (item.kind === 'experience') {
    const themeLabel = inferJourneyTheme(item)
    const id = themeLabel ? resolveThemeIdFromLabel(themeLabel) : undefined
    if (id) {
      related.add(id)
    }
  }

  if (item.kind === 'region') {
    const regionId = findRegionIdByLabel(item.label)
    if (regionId) {
      DIRECTION_CATALOG.forEach((direction) => {
        if (regionMatchesTheme(regionId, direction.id)) {
          related.add(direction.id)
        }
      })
    }
  }

  return Array.from(related)
}

function resolvePrimaryDirectionId(
  item: JourneyItem,
  savedDirectionIds: Set<string>,
  relatedIds: string[],
): string | undefined {
  if (item.parentTheme) {
    const parentId = resolveThemeIdFromLabel(item.parentTheme)
    if (parentId && savedDirectionIds.has(parentId)) {
      return parentId
    }
  }

  if (item.kind === 'destination') {
    const worlds = destinationDiscoveryWorlds[item.label]
    const primaryId = worlds ? resolveThemeIdFromLabel(worlds.primary) : undefined
    if (primaryId && savedDirectionIds.has(primaryId)) {
      return primaryId
    }
  }

  if (item.kind === 'experience') {
    const themeLabel = inferJourneyTheme(item)
    const themeId = themeLabel ? resolveThemeIdFromLabel(themeLabel) : undefined
    if (themeId && savedDirectionIds.has(themeId)) {
      return themeId
    }
  }

  const savedRelated = relatedIds.filter((id) => savedDirectionIds.has(id))
  return savedRelated[0]
}

function buildRelationshipLabel(
  item: JourneyItem,
  primaryDirectionId: string,
  relatedIds: string[],
  savedDirectionIds: Set<string>,
): string | undefined {
  const labels: string[] = []

  if (item.parentRegion && PLACE_KINDS.includes(item.kind)) {
    labels.push(`In ${normalizeJourneyItemLabels(item).parentRegion}`)
  }

  const secondaryThemes = relatedIds
    .filter((id) => id !== primaryDirectionId && savedDirectionIds.has(id))
    .map((id) => resolveThemeLabelFromId(id))
    .filter((title): title is string => Boolean(title))

  if (secondaryThemes.length > 0) {
    labels.push(`Also connected to ${secondaryThemes.join(' and ')}`)
  }

  if (item.kind === 'experience' && !item.parentRegion) {
    labels.push('A related encounter')
  }

  return labels.length > 0 ? labels.join(' · ') : undefined
}

function sortEntries(entries: DirectionSavedEntry[]): DirectionSavedEntry[] {
  return [...entries].sort((left, right) => {
    const leftIndex = ENTRY_KIND_ORDER.indexOf(left.item.kind)
    const rightIndex = ENTRY_KIND_ORDER.indexOf(right.item.kind)
    return (leftIndex === -1 ? 99 : leftIndex) - (rightIndex === -1 ? 99 : rightIndex)
  })
}

export function buildDirectionsFromSavedItems(items: JourneyItem[]): DirectionsResult {
  const normalizedItems = items.map(normalizeJourneyItemLabels)
  const savedDirectionIds = getSavedDirectionIds(normalizedItems)
  const assignedItemIds = new Set<string>()
  const directionEntries = new Map<string, DirectionSavedEntry[]>()

  savedDirectionIds.forEach((directionId) => {
    directionEntries.set(directionId, [])
  })

  normalizedItems.forEach((item) => {
    if (isThemeItem(item)) {
      return
    }

    const relatedIds = getRelatedDirectionIds(item)
    const primaryDirectionId = resolvePrimaryDirectionId(item, savedDirectionIds, relatedIds)

    if (!primaryDirectionId) {
      return
    }

    assignedItemIds.add(item.id)
    const entries = directionEntries.get(primaryDirectionId) ?? []
    entries.push({
      item,
      relationshipLabel: buildRelationshipLabel(item, primaryDirectionId, relatedIds, savedDirectionIds),
    })
    directionEntries.set(primaryDirectionId, entries)
  })

  const directions: DirectionView[] = Array.from(savedDirectionIds)
    .map((directionId) => {
      const catalog = getDirectionById(directionId)
      if (!catalog) {
        return undefined
      }
      return {
        id: directionId,
        title: catalog.title,
        description: catalog.description,
        isSavedTheme: true,
        entries: sortEntries(directionEntries.get(directionId) ?? []),
      }
    })
    .filter((direction): direction is DirectionView => Boolean(direction))
    .sort((left, right) => left.title.localeCompare(right.title))

  const independentItems = normalizedItems.filter(
    (item) => !isThemeItem(item) && !assignedItemIds.has(item.id),
  )

  return { directions, independentItems }
}

export function getDirectionRegionIds(directionId: string, items: JourneyItem[]): string[] {
  const { directions } = buildDirectionsFromSavedItems(items)
  const direction = directions.find((entry) => entry.id === directionId)
  if (!direction) {
    return []
  }

  const regionIds = new Set<string>()
  direction.entries.forEach(({ item }) => {
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

  journeyRegions.forEach((region) => {
    if (regionMatchesTheme(region.id, directionId)) {
      const savedLabels = new Set(items.map((entry) => entry.label))
      const hasSavedPlace = region.destinations.some((destination) => savedLabels.has(destination.title))
      if (hasSavedPlace) {
        regionIds.add(region.id)
      }
    }
  })

  return Array.from(regionIds)
}

export function getDirectionSavedItemIds(directionId: string, items: JourneyItem[]): string[] {
  const { directions } = buildDirectionsFromSavedItems(items)
  const direction = directions.find((entry) => entry.id === directionId)
  if (!direction) {
    return []
  }
  return direction.entries.map(({ item }) => item.id)
}
