import type { SuggestedJourneyRhythm } from './types'

/** Representative journey rhythms — illustrative planning concepts, not confirmed commercial offerings. */
export const mockJourneyRhythms: SuggestedJourneyRhythm[] = [
  {
    id: 'southern-ocean-passage',
    title: 'The Southern Ocean Passage',
    subtitle: 'From the western gateway toward the southern arc',
    destinationIds: ['colombo', 'galle-fort', 'mirissa'],
    themeIds: ['ocean-discovery', 'wellness-restoration'],
    durationLabel: '8–10 days',
    summary:
      'An unhurried passage from arrival through heritage coastlines to quieter southern shores — a considered beginning, ready to be refined privately.',
    isIllustrative: true,
  },
  {
    id: 'tea-country-to-tide',
    title: 'From Tea Country to the Tide',
    subtitle: 'Highland landscapes descending to the coast',
    destinationIds: ['kandy', 'ella', 'mirissa'],
    themeIds: ['rail-landscape', 'ocean-discovery'],
    durationLabel: '9–12 days',
    summary:
      'A rhythm that moves from misted highlands through rail and landscape toward the southern ocean — illustrative, not confirmed.',
    isIllustrative: true,
  },
  {
    id: 'eastern-blue-season',
    title: 'The Eastern Blue Season',
    subtitle: 'Ancient kingdoms opening toward the east',
    destinationIds: ['sigiriya', 'trincomalee', 'nilaveli'],
    themeIds: ['heritage-memory', 'ocean-discovery'],
    durationLabel: '8–10 days',
    summary:
      'A possible reading that pairs cultural depth with the island’s quieter eastern rhythm — to be shaped with care.',
    isIllustrative: true,
  },
  {
    id: 'slower-reading',
    title: 'A Slower Reading of the Island',
    subtitle: 'Gateway, highlands, and southern close',
    destinationIds: ['colombo', 'ella', 'galle-fort'],
    themeIds: ['rail-landscape', 'wellness-restoration', 'culture-human-connection'],
    durationLabel: '12–14 days',
    summary:
      'A gentler arc that allows time in each chapter — an illustrative outline awaiting private refinement.',
    isIllustrative: true,
  },
  {
    id: 'wild-quiet-shores',
    title: 'Wild Landscapes, Quiet Shores',
    subtitle: 'From leopard country to the southern coast',
    destinationIds: ['yala', 'mirissa', 'tangalle'],
    themeIds: ['wildlife-wilderness', 'ocean-discovery'],
    durationLabel: '7–9 days',
    summary:
      'A contrast of wild terrain and intimate coastal pauses — representative, not a confirmed package.',
    isIllustrative: true,
  },
]
