import type { JourneyItem, JourneyItemKind } from './JourneyContext'
import { getRegionEditorialName } from './journeyRegionCatalog'
import { journeyRegions } from '../data/journeyRegions'

/** Legacy region labels stored before the editorial naming model. */
const LEGACY_REGION_LABELS: Record<string, string> = {
  'South Coast': 'The Southern Arc',
  'Southern Coast': 'The Southern Arc',
  'Cultural Triangle': 'The Ancient Kingdoms',
  'West Coast': 'The Western Gateway',
  'West Coast & Colombo': 'The Western Gateway',
  'The North': 'The Northern Reaches',
}

const PROTOTYPE_DETAIL_PATTERNS = [
  /^A preferred way into Sri Lanka from Expectations\.?$/,
  /^A regional setting naturally aligned with .+\.?$/,
  /^A high-relevance recommendation (for|aligned with) .+\.?$/,
  /^A region shaping .+\.?$/,
  /^A signature encounter naturally aligned with .+\.?$/,
  /^The primary way .+\.?$/,
]

export function normalizeRegionLabel(label: string): string {
  return LEGACY_REGION_LABELS[label] ?? label
}

export function findRegionIdByLabel(label: string): string | undefined {
  const normalized = normalizeRegionLabel(label)
  const match = journeyRegions.find(
    (region) => getRegionEditorialName(region.id) === normalized || region.title === normalized,
  )
  return match?.id
}

export function normalizeJourneyItemLabels(item: JourneyItem): JourneyItem {
  const normalized: JourneyItem = { ...item }

  if (item.kind === 'region') {
    normalized.label = normalizeRegionLabel(item.label)
  }

  if (item.parentRegion) {
    normalized.parentRegion = normalizeRegionLabel(item.parentRegion)
  }

  return normalized
}

export function isPrototypeDetail(detail: string | undefined): boolean {
  if (!detail) {
    return false
  }
  return PROTOTYPE_DETAIL_PATTERNS.some((pattern) => pattern.test(detail))
}

export function getTravellerFacingDetail(item: JourneyItem): string | undefined {
  if (!item.detail || isPrototypeDetail(item.detail)) {
    if (item.parentTheme && (item.source === 'Expectations' || item.source === 'Recommendation Engine')) {
      return `Saved from your exploration of ${item.parentTheme}.`
    }
    if (item.kind === 'theme' && item.source === 'Expectations') {
      return 'Saved from Expectations.'
    }
    return undefined
  }
  return item.detail
}

export function formatConjunctionList(items: string[]): string {
  if (items.length === 0) {
    return ''
  }
  if (items.length === 1) {
    return items[0]
  }
  if (items.length === 2) {
    return `${items[0]} and ${items[1]}`
  }
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`
}

export type JourneyGlanceSummary = {
  themeLabels: string[]
  themeEditorialLine: string
  placeCount: number
  regionNames: string[]
  placesEditorialLine: string
}

function resolveRegionNamesFromItems(items: JourneyItem[]): string[] {
  const regionNames = new Set<string>()

  items.forEach((item) => {
    const normalized = normalizeJourneyItemLabels(item)
    if (normalized.kind === 'region') {
      regionNames.add(normalized.label)
    }
    if (normalized.parentRegion) {
      regionNames.add(normalized.parentRegion)
    }
  })

  journeyRegions.forEach((region) => {
    const editorialName = getRegionEditorialName(region.id)
    const savedLabels = new Set(items.map((entry) => entry.label))
    if (savedLabels.has(editorialName) || savedLabels.has(region.title)) {
      regionNames.add(editorialName)
    }
    region.destinations.forEach((destination) => {
      if (savedLabels.has(destination.title)) {
        regionNames.add(editorialName)
      }
    })
  })

  return Array.from(regionNames)
}

export function buildJourneyGlanceSummary(items: JourneyItem[]): JourneyGlanceSummary {
  const themeLabels = items
    .filter((item) => item.kind === 'theme' || item.kind === 'discovery-world')
    .map((item) => item.label)
    .slice(0, 4)

  const placeCount = items.filter(
    (item) => item.kind === 'destination' || item.kind === 'experience',
  ).length

  const regionNames = resolveRegionNamesFromItems(items)

  const themeEditorialLine =
    themeLabels.length > 0
      ? `Drawn to ${formatConjunctionList(themeLabels)}.`
      : 'Your saved directions are beginning to take shape.'

  const placesEditorialLine =
    placeCount > 0 && regionNames.length > 0
      ? `${placeCount} ${placeCount === 1 ? 'place and encounter' : 'places and encounters'} saved across ${formatConjunctionList(regionNames)}.`
      : placeCount > 0
        ? `${placeCount} ${placeCount === 1 ? 'place and encounter' : 'places and encounters'} saved so far.`
        : regionNames.length > 0
          ? `Saved across ${formatConjunctionList(regionNames)}.`
          : ''

  return {
    themeLabels,
    themeEditorialLine,
    placeCount,
    regionNames,
    placesEditorialLine,
  }
}

export const savedItemKindLabels: Record<JourneyItemKind, string> = {
  theme: 'Discovery Worlds',
  'discovery-world': 'Discovery Worlds',
  region: 'Regions',
  destination: 'Destinations',
  mood: 'Travel rhythm',
  accommodation: 'Accommodation',
  experience: 'Experiences',
  season: 'Season',
  interest: 'Interests',
  package: 'Packages',
}

export const savedItemKindOrder: JourneyItemKind[] = [
  'theme',
  'discovery-world',
  'region',
  'destination',
  'experience',
  'mood',
  'season',
  'accommodation',
  'interest',
]
