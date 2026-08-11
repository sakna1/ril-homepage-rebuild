import { experienceImages } from './images'
import { sharedHeritageWorld } from '../../journey/discoveryWorlds'
import kandyPerahera from '../../assets/images/Kandy Perahera.JPG'

/**
 * The seven discovery worlds. Lives in its own module so both the Expectations
 * page and the Destinations map can import it (a component file may not export
 * constants without breaking fast refresh).
 */
export const experienceThemes = [
  {
    title: 'Wildlife & Wilderness',
    description:
      'Leopards, elephants, forests, field researchers, remote ecosystems, and nature without performance.',
    traveller: 'For the Seeker of Silence',
    image: experienceImages.leopardFeature,
    imageAlt: 'Sri Lankan leopard resting on rock at dusk in the wild',
    href: '#leopard-research-circuit',
    encounter: 'The Leopard Research Circuit',
  },
  {
    title: 'Ocean & Discovery',
    description:
      'For travellers drawn to the sea as a living world: whale paths, quiet lagoons, sailing days, and coastlines that reveal themselves with patience.',
    traveller: 'For the Unhurried Wanderer',
    image: experienceImages.mirissaBoats,
    imageAlt: 'Fishing boats at Mirissa harbour at sunset',
    href: '#deep-water-hour',
    encounter: 'The Deep-Water Hour',
  },
  {
    title: 'Heritage & Memory',
    description:
      'Ancient kingdoms, sacred spaces, archaeology, historians, and living traditions carried forward.',
    traveller: 'For the Heritage Guardian',
    image: experienceImages.sigiriyaMain,
    imageAlt: 'Sigiriya rock fortress in Sri Lanka',
    href: '#sigiriya-dawn-ascent',
    encounter: 'The Sigiriya Dawn Ascent',
  },
  {
    title: 'Wellness & Restoration',
    description:
      'Ayurveda, healing traditions, retreats, slow living, and the quiet work of personal renewal.',
    traveller: 'For the Restorer',
    image: experienceImages.ayurveda,
    imageAlt: 'Ayurvedic treatment pavilion set within a tropical rainforest retreat',
    href: '#ancient-grammar-of-healing',
    encounter: 'The Ancient Grammar of Healing',
  },
  {
    title: 'Rail & Landscape',
    description:
      'Hill country train journeys, tea estates, mountain routes, and scenery that changes by the hour.',
    traveller: 'For the Reflective Wanderer',
    image: experienceImages.hillCountry,
    imageAlt: 'Nuwara Eliya hill country landscape',
    href: '#private-tea-estate',
    encounter: 'A Private Tea Estate, Locked Before Dawn',
  },
  {
    title: 'Culture & Human Connection',
    description:
      'Artisans, musicians, dancers, family traditions, private introductions, and everyday Sri Lanka.',
    traveller: 'For the Curious Witness',
    image: kandyPerahera,
    imageAlt: 'Kandy Perahera cultural procession in Sri Lanka',
    href: '#kandyan-dance-rehearsal',
    encounter: 'A Private Kandyan Dance Rehearsal',
  },
  {
    title: sharedHeritageWorld.name,
    description: sharedHeritageWorld.description,
    traveller: sharedHeritageWorld.traveller,
    image: experienceImages.queenVictoriaStatue,
    imageAlt: 'Marble statue of Queen Victoria, a British monument in Sri Lanka',
    href: '#shared-heritage-quietly-read',
    encounter: 'Shared History, Quietly Read',
  },
] as const
