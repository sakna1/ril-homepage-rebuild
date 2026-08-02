import { apiUrl } from './apiConfig'

export type ConciergeRecommendation = {
  name?: string
  region?: string
  description?: string
  image?: string | null
}

export type ConciergeReply = {
  narrative: string
  tailoredNote?: string
  recommendations: ConciergeRecommendation[]
  followUpQuestion?: string
}

type ChatApiResponse = {
  success?: boolean
  narrative?: string
  tailoredNote?: string
  recommendations?: ConciergeRecommendation[]
  followUpQuestion?: string
}

/**
 * Asks the Gemini-backed concierge (POST /api/assistant/chat in ril-backend).
 *
 * `signal` lets the caller abort in-flight requests when the panel is closed.
 */
export async function askConcierge(
  message: string,
  options: { isPersonalized?: boolean; mood?: string; identity?: string; signal?: AbortSignal } = {},
): Promise<ConciergeReply> {
  const response = await fetch(apiUrl('/api/assistant/chat'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      isPersonalized: options.isPersonalized ?? false,
      mood: options.mood ?? null,
      identity: options.identity ?? null,
    }),
    signal: options.signal,
  })

  if (!response.ok) {
    throw new Error(`Concierge request failed (${response.status})`)
  }

  const data = (await response.json()) as ChatApiResponse

  return {
    narrative: data.narrative?.trim() ?? '',
    tailoredNote: data.tailoredNote?.trim() || undefined,
    recommendations: Array.isArray(data.recommendations) ? data.recommendations : [],
    followUpQuestion: data.followUpQuestion?.trim() || undefined,
  }
}
