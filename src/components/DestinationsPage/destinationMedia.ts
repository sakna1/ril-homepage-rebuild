/**
 * Optional extra media per destination, keyed by the destination id used in
 * `journeyRegions`. Destinations fall back to their `heroImage` alone.
 *
 * Video is rendered in place of the still whenever `video` is set, so adding
 * footage later is a one-line change here — no page edits needed:
 *
 *   import sigiriyaFilm from '../../assets/videos/sigiriya.mp4'
 *   export const destinationMedia = {
 *     sigiriya: { video: sigiriyaFilm, gallery: [shotOne, shotTwo] },
 *   }
 */
export type DestinationMedia = {
  /** Plays muted and looping in the card; with controls in the lightbox. */
  video?: string
  /** Extra stills shown alongside the hero image in the lightbox. */
  gallery?: readonly string[]
}

export const destinationMedia: Record<string, DestinationMedia> = {
  // No destination footage supplied yet — stills only.
}

export function mediaForDestination(id: string): DestinationMedia {
  return destinationMedia[id] ?? {}
}
