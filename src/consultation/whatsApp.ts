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

export type QuickInquiryWhatsAppMessageInput = {
  name: string
  message?: string
}

export function buildQuickInquiryWhatsAppMessage(input: QuickInquiryWhatsAppMessageInput): string {
  const name = input.name.trim() || 'a guest'
  const lines = [`Hello Royale Isles Lanka. I am ${name}.`]

  if (input.message?.trim()) {
    lines.push(input.message.trim())
  }

  lines.push('I would like to begin a conversation.')
  return lines.join(' ')
}
