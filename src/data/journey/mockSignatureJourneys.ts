import type { SignatureJourney } from './types'

/**
 * Illustrative Signature Journeys — editorial concepts only.
 * Not priced, bookable, or tied to confirmed inventory.
 * Replace with verified client offerings when available.
 */
export const mockSignatureJourneys: SignatureJourney[] = [
  {
    id: 'colombo-hill-country-passage',
    title: 'The Colombo & Hill Country Passage',
    subtitle: 'Civic arrival into tea country and railway landscape',
    summary:
      'An illustrative private route from western arrival through civic memory into the highlands — to be shaped carefully with you, not offered as fixed inventory.',
    themeIds: ['shared-heritage', 'rail-landscape', 'culture-human-connection'],
    regionIds: ['western-gateway', 'hill-country'],
    destinationIds: ['colombo', 'ella', 'nuwara-eliya'],
    experienceIds: [],
    durationLabel: '8–11 days',
    isIllustrative: true,
  },
  {
    id: 'tea-country-to-tide-signature',
    title: 'From Tea Country to the Tide',
    subtitle: 'Highland landscapes opening toward the southern arc',
    summary:
      'A possible reading that moves from misted hills toward quieter southern shores — illustrative, awaiting private refinement.',
    themeIds: ['rail-landscape', 'ocean-discovery', 'wellness-restoration'],
    regionIds: ['hill-country', 'southern-coast'],
    destinationIds: ['ella', 'mirissa', 'galle-fort'],
    experienceIds: [],
    durationLabel: '9–12 days',
    isIllustrative: true,
  },
  {
    id: 'southern-ocean-passage-signature',
    title: 'The Southern Ocean Passage',
    subtitle: 'From arrival toward heritage coastlines',
    summary:
      'A considered passage through western arrival and southern heritage — a related curated journey concept, not a confirmed package.',
    themeIds: ['ocean-discovery', 'heritage-memory', 'wellness-restoration'],
    regionIds: ['western-gateway', 'southern-coast'],
    destinationIds: ['colombo', 'galle-fort', 'mirissa'],
    experienceIds: [],
    durationLabel: '8–10 days',
    isIllustrative: true,
  },
]
