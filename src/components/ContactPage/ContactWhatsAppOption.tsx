import { ArrowIcon } from '../ArrowIcon'
import {
  buildQuickInquiryWhatsAppMessage,
  buildWhatsAppHref,
  isWhatsAppConfigured,
} from '../../consultation/whatsApp'

type ContactWhatsAppOptionProps = {
  guestName?: string
  guestMessage?: string
}

export function ContactWhatsAppOption({ guestName = '', guestMessage = '' }: ContactWhatsAppOptionProps) {
  const configured = isWhatsAppConfigured()
  const href = configured
    ? buildWhatsAppHref(
        buildQuickInquiryWhatsAppMessage({
          name: guestName,
          message: guestMessage,
        }),
      )
    : ''

  return (
    <aside className="contact-whatsapp-option" aria-labelledby="contact-whatsapp-heading">
      <p className="contact-eyebrow" id="contact-whatsapp-heading">
        Prefer WhatsApp?
      </p>
      <p className="contact-whatsapp-option__copy">
        For a discreet, immediate line to the team when a number is confirmed for live enquiries.
      </p>

      {configured && href ? (
        <a
          className="contact-button contact-button--outline contact-whatsapp-option__cta"
          href={href}
          target="_blank"
          rel="noreferrer"
        >
          Continue on WhatsApp
          <ArrowIcon />
        </a>
      ) : (
        <span className="contact-button contact-button--outline contact-whatsapp-option__cta contact-whatsapp-option__cta--inactive">
          Available once confirmed
        </span>
      )}
    </aside>
  )
}
