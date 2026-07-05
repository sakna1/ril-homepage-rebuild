import blueWhaleSunset from '../assets/experiences/blue-whale-sunset.jpg'
import brassLamp from '../assets/experiences/brass-lamp.jpg'
import galleFort from '../assets/experiences/galle-fort.jpg'
import kandyanDancer from '../assets/experiences/kandyan-dancer.jpg'
import mirissaBoats from '../assets/experiences/mirissa-boats.jpg'
import monks from '../assets/experiences/monks.jpg'
import oilLamps from '../assets/experiences/oil-lamps.jpg'
import poolVilla from '../assets/experiences/pool-villa.jpg'
import sigiriyaDawn from '../assets/experiences/sigiriya-dawn.jpg'
import teaEstate from '../assets/experiences/tea-estate.jpg'
import { getDestinationRecommendationMetadata } from './journeyConsultation'
import { getExperienceIdsForDestination } from './experiences'
import { MapMode, type MapMode as MapModeValue } from './mapModes'

export type Destination = {
  id: string
  name: string
  province: string
  district: string
  /** Mapbox coordinates are stored as [longitude, latitude]. */
  coordinates: [number, number]
  heroImage: string
  shortDescription: string
  experienceIds: string[]
  journeyThemes: string[]
  journeyMoods: string[]
  bestTimeOptions: string[]
  journeyRegion: string
  suggestedExperiences: string[]
  nearby: string[]
  recommendationReason: string
  themes: string[]
  moods: string[]
  bestMonths: string[]
  experiences: string[]
  journalArticles: string[]
  hotels: string[]
}

type DestinationInput = Omit<
  Destination,
  | 'experienceIds'
  | 'journeyThemes'
  | 'journeyMoods'
  | 'bestTimeOptions'
  | 'journeyRegion'
  | 'suggestedExperiences'
  | 'nearby'
  | 'recommendationReason'
>

const destinationRecordsBase: DestinationInput[] = [
  {
    id: 'colombo',
    name: 'Colombo',
    province: 'Western Province',
    district: 'Colombo',
    coordinates: [79.8612, 6.9271],
    heroImage: poolVilla,
    shortDescription: 'A coastal capital of garden villas, galleries, old clubs and modern island rhythm.',
    themes: [],
    moods: [],
    bestMonths: [],
    experiences: [],
    journalArticles: [],
    hotels: [],
  },
  {
    id: 'galle',
    name: 'Galle',
    province: 'Southern Province',
    district: 'Galle',
    coordinates: [80.217, 6.0535],
    heroImage: galleFort,
    shortDescription: 'Fort walls, sea air and ochre lanes shaped by centuries of ocean trade.',
    themes: [],
    moods: [],
    bestMonths: [],
    experiences: [],
    journalArticles: [],
    hotels: [],
  },
  {
    id: 'tangalle',
    name: 'Tangalle',
    province: 'Southern Province',
    district: 'Hambantota',
    coordinates: [80.7911, 6.024],
    heroImage: mirissaBoats,
    shortDescription: 'Quiet southern beaches, coconut shade and long, unhurried days beside the Indian Ocean.',
    themes: [],
    moods: [],
    bestMonths: [],
    experiences: [],
    journalArticles: [],
    hotels: [],
  },
  {
    id: 'ella',
    name: 'Ella',
    province: 'Uva Province',
    district: 'Badulla',
    coordinates: [81.0463, 6.8667],
    heroImage: teaEstate,
    shortDescription: 'Mist-covered mountains, tea estates and slow railway journeys through the hills.',
    themes: [],
    moods: [],
    bestMonths: [],
    experiences: [],
    journalArticles: [],
    hotels: [],
  },
  {
    id: 'nuwara-eliya',
    name: 'Nuwara Eliya',
    province: 'Central Province',
    district: 'Nuwara Eliya',
    coordinates: [80.7829, 6.9497],
    heroImage: blueWhaleSunset,
    shortDescription: 'Cool highland air, tea country rituals and soft mornings above emerald valleys.',
    themes: [],
    moods: [],
    bestMonths: [],
    experiences: [],
    journalArticles: [],
    hotels: [],
  },
  {
    id: 'kandy',
    name: 'Kandy',
    province: 'Central Province',
    district: 'Kandy',
    coordinates: [80.6337, 7.2906],
    heroImage: kandyanDancer,
    shortDescription: 'A sacred hill capital of temple bells, lake reflections and living Kandyan culture.',
    themes: [],
    moods: [],
    bestMonths: [],
    experiences: [],
    journalArticles: [],
    hotels: [],
  },
  {
    id: 'sigiriya',
    name: 'Sigiriya',
    province: 'Central Province',
    district: 'Matale',
    coordinates: [80.7603, 7.957],
    heroImage: sigiriyaDawn,
    shortDescription: 'Ancient gardens, jungle silence and a rock citadel rising from morning gold.',
    themes: [],
    moods: [],
    bestMonths: [],
    experiences: [],
    journalArticles: [],
    hotels: [],
  },
  {
    id: 'anuradhapura',
    name: 'Anuradhapura',
    province: 'North Central Province',
    district: 'Anuradhapura',
    coordinates: [80.4037, 8.3114],
    heroImage: oilLamps,
    shortDescription: 'Sacred stupas, moonstones and ancient reservoirs under wide northern skies.',
    themes: [],
    moods: [],
    bestMonths: [],
    experiences: [],
    journalArticles: [],
    hotels: [],
  },
  {
    id: 'trincomalee',
    name: 'Trincomalee',
    province: 'Eastern Province',
    district: 'Trincomalee',
    coordinates: [81.233, 8.5874],
    heroImage: monks,
    shortDescription: 'Eastern coves, temple cliffs and luminous blue water at the edge of the island.',
    themes: [],
    moods: [],
    bestMonths: [],
    experiences: [],
    journalArticles: [],
    hotels: [],
  },
  {
    id: 'jaffna',
    name: 'Jaffna',
    province: 'Northern Province',
    district: 'Jaffna',
    coordinates: [80.0255, 9.6615],
    heroImage: brassLamp,
    shortDescription: 'Northern light, Tamil heritage, palmyrah landscapes and a culture of quiet resilience.',
    themes: [],
    moods: [],
    bestMonths: [],
    experiences: [],
    journalArticles: [],
    hotels: [],
  },
]

const addDestinationMetadata = (destination: DestinationInput | Destination): Destination => {
  const metadata = getDestinationRecommendationMetadata(destination.id, 'Sri Lanka')

  return {
    ...destination,
    experienceIds: getExperienceIdsForDestination(destination.id),
    journeyThemes: metadata.journeyThemes,
    journeyMoods: metadata.journeyMoods,
    bestTimeOptions: metadata.bestTimeOptions,
    journeyRegion: metadata.journeyRegion,
    suggestedExperiences: metadata.suggestedExperiences,
    nearby: metadata.nearby,
    recommendationReason: metadata.recommendationReason,
  }
}

const destinationRecords: Destination[] = destinationRecordsBase.map(addDestinationMetadata)

const destinationById = Object.fromEntries(destinationRecords.map((destination) => [destination.id, destination])) as Record<
  string,
  Destination
>

export const generalDestinations: Destination[] = destinationRecords

const personalisedDestinationRecordsBase: Array<DestinationInput | Destination> = [
  destinationById.tangalle,
  {
    id: 'mirissa',
    name: 'Mirissa',
    province: 'Southern Province',
    district: 'Matara',
    coordinates: [80.4716, 5.9485],
    heroImage: mirissaBoats,
    shortDescription: 'A soft southern bay for slow mornings, ocean rituals and candlelit coastal evenings.',
    themes: [],
    moods: [],
    bestMonths: [],
    experiences: [],
    journalArticles: [],
    hotels: [],
  },
  {
    id: 'rekawa',
    name: 'Rekawa',
    province: 'Southern Province',
    district: 'Hambantota',
    coordinates: [80.8356, 6.0477],
    heroImage: blueWhaleSunset,
    shortDescription: 'A quiet lagoon-edge coast where twilight, turtles and tide pools set the pace.',
    themes: [],
    moods: [],
    bestMonths: [],
    experiences: [],
    journalArticles: [],
    hotels: [],
  },
  destinationById.ella,
  destinationById['nuwara-eliya'],
  {
    id: 'private-villas',
    name: 'Private Villas',
    province: 'Southern Province',
    district: 'Galle',
    coordinates: [80.2467, 6.0367],
    heroImage: poolVilla,
    shortDescription: 'Secluded garden residences and poolside stillness for journeys that feel entirely your own.',
    themes: [],
    moods: [],
    bestMonths: [],
    experiences: [],
    journalArticles: [],
    hotels: [],
  },
  {
    id: 'hidden-beaches',
    name: 'Hidden Beaches',
    province: 'Southern Province',
    district: 'Hambantota',
    coordinates: [80.7676, 5.9834],
    heroImage: mirissaBoats,
    shortDescription: 'Low-key stretches of coast chosen for privacy, warm water and unhurried conversation.',
    themes: [],
    moods: [],
    bestMonths: [],
    experiences: [],
    journalArticles: [],
    hotels: [],
  },
  {
    id: 'sunset-dining',
    name: 'Sunset Dining',
    province: 'Southern Province',
    district: 'Galle',
    coordinates: [80.2168, 6.0261],
    heroImage: galleFort,
    shortDescription: 'Golden-hour tables, sea breeze and intimate menus arranged around the mood of the evening.',
    themes: [],
    moods: [],
    bestMonths: [],
    experiences: [],
    journalArticles: [],
    hotels: [],
  },
  {
    id: 'mountain-retreats',
    name: 'Mountain Retreats',
    province: 'Uva Province',
    district: 'Badulla',
    coordinates: [80.9562, 6.7654],
    heroImage: teaEstate,
    shortDescription: 'Highland hideaways wrapped in tea, cloud forest and the quiet drama of the hills.',
    themes: [],
    moods: [],
    bestMonths: [],
    experiences: [],
    journalArticles: [],
    hotels: [],
  },
]

export const personalisedDestinations: Destination[] = personalisedDestinationRecordsBase.map(addDestinationMetadata)

export const mapModeDestinations: Record<MapModeValue, Destination[]> = {
  [MapMode.DISCOVER]: generalDestinations,
  [MapMode.PERSONALISED]: personalisedDestinations,
}

export const destinations = generalDestinations
