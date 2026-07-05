import type { Experience } from '../data/experiences'
import type { JourneyTheme } from '../data/journeyConsultation'
import type { JourneyRegion, RegionDestination } from '../data/journeyRegions'
import { getRegionEditorialName } from './journeyRegionCatalog'
import type { JourneyItem, JourneyItemKind } from './JourneyContext'

export function toJourneyId(kind: JourneyItemKind, value: string): string {
  return `${kind}:${value.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
}

export function createJourneyItemFromTheme(theme: JourneyTheme | { id: string; title: string; description?: string }): JourneyItem {
  return {
    id: toJourneyId('theme', theme.title),
    kind: 'theme',
    label: theme.title,
    detail: 'description' in theme ? theme.description : undefined,
    source: 'My Journey',
  }
}

export function createJourneyItemFromDiscoveryWorld(name: string, detail?: string): JourneyItem {
  return {
    id: toJourneyId('discovery-world', name),
    kind: 'discovery-world',
    label: name,
    detail,
    source: 'My Journey',
  }
}

export function createJourneyItemFromRegion(region: JourneyRegion, parentTheme?: string): JourneyItem {
  const editorialName = getRegionEditorialName(region.id)
  return {
    id: toJourneyId('region', editorialName),
    kind: 'region',
    label: editorialName,
    detail: region.editorialIntroduction,
    source: 'My Journey',
    parentTheme,
  }
}

export function createJourneyItemFromDestination(
  destination: RegionDestination,
  region?: JourneyRegion,
  parentTheme?: string,
): JourneyItem {
  const parentRegion = region ? getRegionEditorialName(region.id) : undefined
  return {
    id: toJourneyId('destination', destination.title),
    kind: 'destination',
    label: destination.title,
    detail: destination.description,
    source: 'My Journey',
    parentTheme,
    parentRegion,
  }
}

export function createJourneyItemFromExperience(
  experience: Experience,
  destination?: RegionDestination,
  region?: JourneyRegion,
): JourneyItem {
  const parentRegion = region ? getRegionEditorialName(region.id) : undefined
  return {
    id: toJourneyId('experience', experience.title),
    kind: 'experience',
    label: experience.title,
    detail: experience.description,
    source: destination?.title ?? 'My Journey',
    parentRegion,
  }
}

export function createJourneyItemFromMood(mood: string): JourneyItem {
  return {
    id: toJourneyId('mood', mood),
    kind: 'mood',
    label: mood,
    source: 'Guided Discovery',
  }
}

export function createJourneyItemFromSeason(seasonId: string, label: string, detail?: string): JourneyItem {
  return {
    id: toJourneyId('season', seasonId),
    kind: 'season',
    label,
    detail,
    source: 'Guided Discovery',
  }
}
