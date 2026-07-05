import './FloatingWhatsAppButton.css'
import { getDefaultWhatsAppHref, isWhatsAppConfigured } from '../../consultation/whatsApp'

export function FloatingWhatsAppButton() {
  const whatsAppConfigured = isWhatsAppConfigured()
  const whatsAppHref = whatsAppConfigured ? getDefaultWhatsAppHref() : undefined

  return (
    <div className="floating-action-group" aria-label="Quick contact actions">
      <a
        className="floating-action-button floating-action-button--concierge"
        href="/concierge"
        target="_blank"
        rel="noreferrer"
        aria-label="Open AI Concierge in a new tab"
      >
        <span className="floating-action-button__icon" aria-hidden="true">
          <svg viewBox="0 0 32 32" focusable="false">
            <path d="M16 3.5 18.14 11 25.5 13.14 18.14 15.28 16 22.5 13.86 15.28 6.5 13.14 13.86 11 16 3.5Zm7.75 16.25.98 3.52 3.52.98-3.52.98-.98 3.52-.98-3.52-3.52-.98 3.52-.98.98-3.52ZM8.25 20l.76 2.49 2.49.76-2.49.76-.76 2.49-.76-2.49L5 23.25l2.49-.76L8.25 20Z" />
          </svg>
        </span>
        <span className="floating-action-button__text">AI Concierge</span>
      </a>

      {whatsAppConfigured && whatsAppHref ? (
        <a
          className="floating-action-button floating-action-button--whatsapp"
          href={whatsAppHref}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat with Royale Isles Lanka on WhatsApp"
        >
          <span className="floating-action-button__icon" aria-hidden="true">
            <svg viewBox="0 0 32 32" focusable="false">
              <path d="M16.04 3.2c-7.02 0-12.72 5.64-12.72 12.6 0 2.23.6 4.42 1.74 6.34L3.2 28.8l6.86-1.79a12.82 12.82 0 0 0 5.98 1.5c7.02 0 12.72-5.65 12.72-12.6S23.06 3.2 16.04 3.2Zm0 22.98c-1.88 0-3.72-.5-5.33-1.45l-.38-.22-4.07 1.06 1.08-3.92-.25-.4a10.2 10.2 0 0 1-1.57-5.44c0-5.67 4.72-10.28 10.52-10.28s10.52 4.61 10.52 10.28-4.72 10.37-10.52 10.37Zm5.78-7.72c-.31-.16-1.86-.91-2.15-1.01-.29-.11-.5-.16-.71.16-.21.31-.82 1.01-1 1.22-.18.21-.37.23-.68.08-.31-.16-1.33-.49-2.53-1.55-.94-.83-1.57-1.85-1.75-2.16-.18-.31-.02-.48.14-.64.14-.14.31-.36.47-.54.16-.18.21-.31.31-.52.1-.21.05-.39-.03-.54-.08-.16-.71-1.7-.97-2.33-.26-.61-.52-.53-.71-.54h-.61c-.21 0-.55.08-.84.39-.29.31-1.1 1.06-1.1 2.59s1.13 3.01 1.28 3.22c.16.21 2.22 3.36 5.38 4.71.75.32 1.34.52 1.8.66.76.24 1.45.21 2 .13.61-.09 1.86-.75 2.12-1.48.26-.73.26-1.36.18-1.49-.08-.13-.29-.21-.6-.36Z" />
            </svg>
          </span>
          <span className="floating-action-button__text">WhatsApp</span>
        </a>
      ) : null}
    </div>
  )
}
