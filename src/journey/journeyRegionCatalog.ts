import { getRegionRecommendationMetadata, journeyThemes } from '../data/journeyConsultation'
import { sharedHeritageWorld } from './discoveryWorlds'

/** Editorial region names used across Discover Sri Lanka and My Journey. */
export const REGION_EDITORIAL_NAMES: Record<string, string> = {
  'western-gateway': 'The Western Gateway',
  'southern-coast': 'The Southern Arc',
  'romantic-western-southern-provinces': 'The Southern Arc',
  'wild-south': 'The Wild South',
  'romantic-wild-south': 'The Wild South',
  'east-coast': 'The East Coast',
  'romantic-eastern-province': 'The East Coast',
  'hill-country': 'The Hill Country',
  'romantic-central-province': 'The Hill Country',
  'romantic-uva-province': 'The Hill Country',
  'cultural-triangle': 'The Ancient Kingdoms',
  'northern-peninsula': 'The Northern Reaches',
  'romantic-northern-province': 'The Northern Reaches',
  'central-highlands': 'The Hill Country',
  'romantic-sabaragamuwa-province': 'The Hill Country',
}

/** Sensible west-to-south rhythm for emerging journey order. */
export const REGION_RHYTHM_ORDER: string[] = [
  'western-gateway',
  'southern-coast',
  'romantic-western-southern-provinces',
  'central-highlands',
  'hill-country',
  'romantic-central-province',
  'romantic-uva-province',
  'romantic-sabaragamuwa-province',
  'cultural-triangle',
  'east-coast',
  'romantic-eastern-province',
  'wild-south',
  'romantic-wild-south',
  'northern-peninsula',
  'romantic-northern-province',
]

export const DISCOVERY_WORLD_FILTERS = [
  ...journeyThemes.map((theme) => ({
    id: theme.id,
    label: theme.title,
  })),
  {
    id: sharedHeritageWorld.id,
    label: sharedHeritageWorld.name,
  },
] as const

export const REGION_FILTER_IDS = [
  'western-gateway',
  'southern-coast',
  'wild-south',
  'east-coast',
  'hill-country',
  'cultural-triangle',
  'northern-peninsula',
] as const

export function getRegionEditorialName(regionId: string): string {
  return REGION_EDITORIAL_NAMES[regionId] ?? regionId
}

export function getRegionFilterLabel(regionId: string): string {
  return getRegionEditorialName(regionId)
}

export function regionMatchesTheme(regionId: string, themeId: string): boolean {
  const metadata = getRegionRecommendationMetadata(regionId)
  if (!metadata) {
    return false
  }
  if (themeId === sharedHeritageWorld.id) {
    return metadata.journeyThemes.includes('heritage-memory') || metadata.journeyThemes.includes('culture-human-connection')
  }
  return metadata.journeyThemes.includes(themeId)
}

export function getThemeTitleForId(themeId: string): string | undefined {
  const theme = journeyThemes.find((entry) => entry.id === themeId)
  if (theme) {
    return theme.title
  }
  if (themeId === sharedHeritageWorld.id) {
    return sharedHeritageWorld.name
  }
  return undefined
}
