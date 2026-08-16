import ellaFilm from '../../assets/videos/destination-film-two.mp4'
import yalaFilm from '../../assets/videos/destination-film-one.mp4'

/**
 * Optional media per destination, keyed by the destination id used in
 * `journeyRegions`. Destinations fall back to their `heroImage` alone.
 *
 * Adding footage is a one-line change here — no page edits needed. Paste a
 * YouTube link in any of its usual shapes:
 *
 *   export const destinationMedia = {
 *     sigiriya: { youtube: 'https://youtu.be/dQw4w9WgXcQ' },
 *     jaffna: { youtube: 'dQw4w9WgXcQ', gallery: [shotOne, shotTwo] },
 *   }
 *
 * Or drop an .mp4 in src/assets/videos and set `video` instead — those play
 * inside the tile itself rather than only in the modal.
 */
export type DestinationMedia = {
  /** A file bundled with the site. Plays muted and looping in its tile. */
  video?: string
  /** YouTube link or bare video id. Plays in the lightbox. */
  youtube?: string
  /** Extra stills shown as a strip in the lightbox. */
  gallery?: readonly string[]
}

export const destinationMedia: Record<string, DestinationMedia> = {
  // Elephant crossing the park road.
  yala: { video: yalaFilm },
  // Waterfall in the hill country.
  ella: { video: ellaFilm },
}

export function mediaForDestination(id: string): DestinationMedia {
  return destinationMedia[id] ?? {}
}

/**
 * Pulls the video id out of watch/youtu.be/embed/shorts links, or accepts a
 * bare id. Returns null when nothing usable is found, so callers can fall back
 * to the still image rather than render a broken player.
 */
export function youtubeVideoId(linkOrId: string | undefined): string | null {
  if (!linkOrId) return null

  const trimmed = linkOrId.trim()
  if (/^[\w-]{11}$/.test(trimmed)) return trimmed

  try {
    const url = new URL(trimmed)
    const host = url.hostname.replace(/^www\./, '')

    if (host === 'youtu.be') {
      const id = url.pathname.slice(1)
      return /^[\w-]{11}$/.test(id) ? id : null
    }

    if (host.endsWith('youtube.com') || host.endsWith('youtube-nocookie.com')) {
      const param = url.searchParams.get('v')
      if (param && /^[\w-]{11}$/.test(param)) return param

      const match = url.pathname.match(/^\/(?:embed|shorts|v)\/([\w-]{11})/)
      if (match) return match[1]
    }
  } catch {
    // Not a URL — fall through.
  }

  return null
}

/** Privacy-enhanced embed URL, so viewers are not cookied by a browse. */
export function youtubeEmbedUrl(linkOrId: string | undefined): string | null {
  const id = youtubeVideoId(linkOrId)
  return id ? `https://www.youtube-nocookie.com/embed/${id}?rel=0` : null
}

/** Thumbnail served by YouTube, used as the card still when no photo exists. */
export function youtubeThumbnail(linkOrId: string | undefined): string | null {
  const id = youtubeVideoId(linkOrId)
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null
}
