export const MapMode = {
  DISCOVER: 'discover',
  PERSONALISED: 'personalised',
} as const

export type MapMode = (typeof MapMode)[keyof typeof MapMode]

export type MapModeContent = {
  eyebrow: string
  title: string
  description: string
  travellerIdentity?: string
  mood?: string
}

export const mapModeContent: Record<MapMode, MapModeContent> = {
  [MapMode.DISCOVER]: {
    eyebrow: 'Destination Discovery',
    title: 'Discover Sri Lanka',
    description:
      'Explore Sri Lanka through journey regions. Begin with atmosphere, landscape and rhythm before choosing the destinations that shape your own route.',
  },
  [MapMode.PERSONALISED]: {
    eyebrow: 'Your Sri Lanka',
    title: 'A Romantic Island Mood',
    description:
      'Based on your Traveller Discovery profile, these journey regions have been selected because they best reflect your current travel identity and mood.',
    travellerIdentity: 'The Romantic Traveller',
    mood: 'Romantic',
  },
}
