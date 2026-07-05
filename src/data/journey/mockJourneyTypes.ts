import { journeyMoods, journeySeasons, journeyThemes } from '../journeyConsultation'
import { sharedHeritageWorld } from '../../journey/discoveryWorlds'

export const journeyDiscoveryWorlds = [
  ...journeyThemes,
  {
    id: sharedHeritageWorld.id,
    iconLabel: 'S',
    title: sharedHeritageWorld.name,
    description: sharedHeritageWorld.description,
  },
] as const

export { journeyMoods, journeySeasons }

export const ILLUSTRATIVE_DISCLAIMER =
  'Final routing, timings, and arrangements are refined personally.'

export const ITINERARY_DISCLAIMER =
  'This is an illustrative journey outline. Final routing, timings, and arrangements are refined personally.'
