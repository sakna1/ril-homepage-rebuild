export type TravelMode = 'private-transfer' | 'rail' | 'domestic-flight' | 'boat'

export interface MapPosition {
  x: number
  y: number
}

export interface Destination {
  id: string
  name: string
  regionId: string
  regionName: string
  shortDescription: string
  mapPosition: MapPosition
  themeIds: string[]
  experienceIds: string[]
  recommendedNights?: number
  journeyOrder?: number
  image?: string
  isRepresentative?: boolean
  /** Mapbox coordinates [longitude, latitude] for map rendering. */
  coordinates?: [number, number]
}

export interface JourneyExperience {
  id: string
  title: string
  destinationId?: string
  regionId?: string
  themeIds: string[]
  shortDescription: string
  durationLabel?: string
  image?: string
  isRepresentative: true
}

export interface TravelConnection {
  id: string
  fromDestinationId: string
  toDestinationId: string
  mode: TravelMode
  durationLabel: string
  note?: string
  isIllustrative: true
}

export interface SuggestedJourneyRhythm {
  id: string
  title: string
  subtitle: string
  destinationIds: string[]
  themeIds: string[]
  durationLabel: string
  summary: string
  isIllustrative: true
}

export type RecommendationSourceType = 'theme' | 'region' | 'destination' | 'experience' | 'journey'
export type RecommendationTargetType = 'destination' | 'experience' | 'rhythm'

export interface Recommendation {
  id: string
  sourceType: RecommendationSourceType
  sourceId: string
  recommendationType: RecommendationTargetType
  targetId: string
  reason: string
  editorialLabel?: string
}

export interface RecommendationInput {
  sourceType: RecommendationSourceType
  sourceId: string
  savedItemIds?: string[]
  limit?: number
}

export interface ItinerarySegment {
  dayLabel: string
  regionName: string
  summary: string
}

export interface IllustrativeItinerary {
  id: string
  segments: ItinerarySegment[]
  isIllustrative: true
  note: string
}

export interface ItineraryInput {
  savedItemIds: string[]
  regionIds?: string[]
  rhythmId?: string
}

export interface SuggestedRhythmResult {
  sequence: string[]
  summary: string
  rhythmId?: string
  isIllustrative: true
}

/** Illustrative curated journey — not a confirmed commercial package. */
export interface SignatureJourney {
  id: string
  title: string
  subtitle?: string
  summary: string
  themeIds: string[]
  regionIds: string[]
  destinationIds: string[]
  experienceIds: string[]
  durationLabel?: string
  isIllustrative: true
}
