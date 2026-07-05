import type { JourneyItem } from '../journey/JourneyContext'
import { buildDirectionsFromSavedItems } from '../journey/journeyDirections'
import { buildJourneyGlanceSummary, normalizeJourneyItemLabels } from '../journey/savedJourneyDisplay'
import type { ConsultationJourneySummaryCompact } from './consultationStorage'

export type ConsultationDirectionSummary = {
  title: string
  savedLabels: string[]
}

export type ConsultationJourneySummaryDisplay = {
  hasMeaningfulContext: boolean
  directions: ConsultationDirectionSummary[]
  regions: string[]
  destinations: string[]
  experiences: string[]
  mood?: string
  season?: string
  glanceLine: string
  compact: ConsultationJourneySummaryCompact
}

function uniqueLabels(labels: string[]): string[] {
  return Array.from(new Set(labels.filter(Boolean)))
}

export function buildConsultationJourneySummary(items: JourneyItem[]): ConsultationJourneySummaryDisplay {
  const glance = buildJourneyGlanceSummary(items)
  const { directions } = buildDirectionsFromSavedItems(items)

  const regions = uniqueLabels([
    ...glance.regionNames,
    ...items
      .filter((item) => normalizeJourneyItemLabels(item).kind === 'region')
      .map((item) => normalizeJourneyItemLabels(item).label),
  ])

  const destinations = uniqueLabels(
    items.filter((item) => item.kind === 'destination').map((item) => item.label),
  )

  const experiences = uniqueLabels(
    items.filter((item) => item.kind === 'experience').map((item) => item.label),
  )

  const mood = items.find((item) => item.kind === 'mood')?.label
  const season = items.find((item) => item.kind === 'season')?.label

  const directionSummaries: ConsultationDirectionSummary[] = directions.map((direction) => ({
    title: direction.title,
    savedLabels: uniqueLabels(direction.entries.map((entry) => entry.item.label)),
  }))

  const compact: ConsultationJourneySummaryCompact = {
    directions: directionSummaries.map((direction) => direction.title).slice(0, 4),
    regions: regions.slice(0, 6),
    destinations: destinations.slice(0, 6),
    experiences: experiences.slice(0, 6),
    mood,
    season,
  }

  const hasMeaningfulContext =
    directionSummaries.length > 0 ||
    regions.length > 0 ||
    destinations.length > 0 ||
    experiences.length > 0 ||
    Boolean(mood) ||
    Boolean(season)

  const glanceLine = [glance.themeEditorialLine, glance.placesEditorialLine].filter(Boolean).join(' ')

  return {
    hasMeaningfulContext,
    directions: directionSummaries,
    regions,
    destinations,
    experiences,
    mood,
    season,
    glanceLine,
    compact,
  }
}

export function getPlacesForWhatsApp(summary: ConsultationJourneySummaryDisplay): string[] {
  return uniqueLabels([...summary.destinations, ...summary.experiences])
}
