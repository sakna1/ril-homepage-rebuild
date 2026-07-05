/** Default placeholder used in development when no env var is set. */
export const PLACEHOLDER_WHATSAPP_NUMBER = '94763962161'

const DEFAULT_FLOATING_MESSAGE =
  'Hello Royale Isles Lanka, I would like to start planning a Sri Lanka journey.'

export function getConfiguredWhatsAppNumber(): string | undefined {
  const raw = import.meta.env.VITE_WHATSAPP_NUMBER
  if (!raw || typeof raw !== 'string') {
    return undefined
  }

  const normalized = raw.replace(/\D/g, '')
  if (!normalized || normalized === PLACEHOLDER_WHATSAPP_NUMBER) {
    return undefined
  }

  return normalized
}

export function isWhatsAppConfigured(): boolean {
  return Boolean(getConfiguredWhatsAppNumber())
}

export function buildWhatsAppHref(message: string): string {
  const phoneNumber = getConfiguredWhatsAppNumber()
  if (!phoneNumber) {
    return ''
  }

  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
}

export function getDefaultWhatsAppHref(): string {
  return buildWhatsAppHref(DEFAULT_FLOATING_MESSAGE)
}

export type ConsultationWhatsAppMessageInput = {
  name: string
  directions: string[]
  places: string[]
  travelTiming?: string
}

export function buildConsultationWhatsAppMessage(input: ConsultationWhatsAppMessageInput): string {
  const lines = [`Hello Royale Isles Lanka. I am ${input.name.trim()}.`]

  if (input.directions.length > 0) {
    lines.push(`Drawn to: ${input.directions.slice(0, 3).join(', ')}.`)
  }

  if (input.places.length > 0) {
    lines.push(`Saved places: ${input.places.slice(0, 3).join(', ')}.`)
  }

  if (input.travelTiming?.trim()) {
    lines.push(`Travel timing: ${input.travelTiming.trim()}.`)
  }

  lines.push('I would like to begin a private consultation.')
  return lines.join(' ')
}
