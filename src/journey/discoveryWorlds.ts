import { experienceImages } from '../components/ExperiencesPage/images'

export const DISCOVERY_WORLD_NAMES = {
  sharedHeritage: 'Shared Heritage',
} as const

export type DiscoveryWorldName = (typeof DISCOVERY_WORLD_NAMES)[keyof typeof DISCOVERY_WORLD_NAMES]

export const sharedHeritageWorld = {
  id: 'shared-heritage',
  name: DISCOVERY_WORLD_NAMES.sharedHeritage,
  number: '07',
  traveller: 'For the Thoughtful Historian',
  description:
    "Rolling tea estates, timeless hill stations, railway journeys, old gardens, and civic architecture reveal a chapter of Sri Lanka's story still visible in daily life.",
  encounter: 'Heritage routes in development',
  image: experienceImages.queenVictoriaStatue,
  imageAlt: 'Marble statue of Queen Victoria, a British monument in Sri Lanka',
  homepageTitle: 'Monuments, Memory, and a Shared Past',
  homepageCopy:
    'For travellers curious about the relationship between Sri Lanka and Britain, history is read in marble and stone as much as landscape: civic monuments, harbour streets, tea country gardens, railway engineering, and the quiet sculpture that still marks a complicated colonial inheritance.',
} as const

export const sharedHeritageCollections = [
  {
    title: 'Colombo Legacy',
    description:
      "Civic streets, old institutions, seafront hotels, and museum gardens show Colombo as a city shaped by encounter, administration, education, and reinvention.",
    destinations: [
      'Colombo Fort',
      'Old Parliament',
      'General Post Office',
      'Cargills Building',
      'Galle Face Hotel',
      'National Museum',
      'Royal College',
      'University of Colombo',
    ],
  },
  {
    title: 'Hill Country Legacy',
    description:
      'Tea estates, cool highland gardens, old schools, and planter-era bungalows carry the complicated beauty of the hills into the present.',
    destinations: [
      'Nuwara Eliya',
      'Hakgala Botanical Gardens',
      'Peradeniya',
      'Trinity College',
      'Tea Estates',
      'Little England',
      'Colonial Bungalows',
    ],
  },
  {
    title: 'Railway Legacy',
    description:
      "Railways made the highlands legible in a new way. Today the journeys remain among the island's most poetic links between engineering, landscape, and memory.",
    destinations: [
      'Nine Arches Bridge',
      'Peradeniya Railway Station',
      'Badulla Railway Station',
      'Colombo Fort Railway Station',
      'Scenic Hill Country Railway',
    ],
  },
  {
    title: 'Coastal Legacy',
    description:
      'Fortified harbours and coastal towns hold layered histories of trade, conflict, architecture, and everyday life beside the sea.',
    destinations: ['Galle Fort', 'Fort Frederick', 'Star Fort'],
  },
] as const

export const sharedHeritageRecommendations = [
  { destination: 'Colombo Fort', weight: 100 },
  { destination: 'Nuwara Eliya', weight: 96 },
  { destination: 'Nine Arches Bridge', weight: 92 },
  { destination: 'Galle Face Hotel', weight: 90 },
  { destination: 'Hakgala Botanical Gardens', weight: 86 },
  { destination: 'Tea Country', weight: 84 },
  { destination: 'Galle Fort', weight: 80 },
] as const

export const destinationDiscoveryWorlds: Record<string, { primary: string; secondary: string[] }> = {
  'Nuwara Eliya': {
    primary: DISCOVERY_WORLD_NAMES.sharedHeritage,
    secondary: ['Wellness & Restoration', 'Rail & Landscape'],
  },
  'Nine Arches Bridge': {
    primary: 'Rail & Landscape',
    secondary: [DISCOVERY_WORLD_NAMES.sharedHeritage],
  },
  'Galle Fort': {
    primary: 'Heritage & Memory',
    secondary: [DISCOVERY_WORLD_NAMES.sharedHeritage],
  },
  'Colombo Fort': {
    primary: DISCOVERY_WORLD_NAMES.sharedHeritage,
    secondary: ['Culture & Human Connection'],
  },
  'Galle Face Hotel': {
    primary: DISCOVERY_WORLD_NAMES.sharedHeritage,
    secondary: ['Culture & Human Connection'],
  },
  'Tea Country': {
    primary: 'Rail & Landscape',
    secondary: [DISCOVERY_WORLD_NAMES.sharedHeritage, 'Wellness & Restoration'],
  },
}
