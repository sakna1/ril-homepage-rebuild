/**
 * The confirmed business WhatsApp number: +94 71 168 0902.
 * Used whenever `VITE_WHATSAPP_NUMBER` is unset, so every CTA works out of the
 * box; set the env var to route messages elsewhere without a code change.
 */
export const BUSINESS_WHATSAPP_NUMBER = '94711680902'

/** The old development stand-in. Still rejected, so it can never go live. */
export const PLACEHOLDER_WHATSAPP_NUMBER = '94763962161'

const DEFAULT_FLOATING_MESSAGE =
  'Hello Royale Isles Lanka, I would like to start planning a Sri Lanka journey.'

export function getConfiguredWhatsAppNumber(): string | undefined {
  const raw = import.meta.env.VITE_WHATSAPP_NUMBER
  if (!raw || typeof raw !== 'string') {
    return BUSINESS_WHATSAPP_NUMBER
  }

  const normalized = raw.replace(/\D/g, '')
  if (!normalized || normalized === PLACEHOLDER_WHATSAPP_NUMBER) {
    return BUSINESS_WHATSAPP_NUMBER
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

/** Floating action button — always visible, using the env value or the business number. */
export function getDefaultWhatsAppHref(): string {
  const phoneNumber = getConfiguredWhatsAppNumber() ?? BUSINESS_WHATSAPP_NUMBER
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(DEFAULT_FLOATING_MESSAGE)}`
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
