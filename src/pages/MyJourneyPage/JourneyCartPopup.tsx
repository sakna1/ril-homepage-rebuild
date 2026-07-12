import { useEffect, useId } from 'react'
import type { JourneyItem } from '../../journey/JourneyContext'

type JourneyCartPopupProps = {
  items: JourneyItem[]
  themeLabel?: string
  placeCount: number
  encounterCount: number
  hasItinerary: boolean
  onClose: () => void
  onRemove: (id: string) => void
}

function kindLabel(kind: JourneyItem['kind']) {
  switch (kind) {
    case 'theme':
    case 'discovery-world':
      return 'Package'
    case 'destination':
      return 'Place'
    case 'experience':
      return 'Encounter'
    case 'accommodation':
      return 'Stay'
    case 'region':
      return 'Region'
    default:
      return 'Preference'
  }
}

export function JourneyCartPopup({
  items,
  themeLabel,
  placeCount,
  encounterCount,
  hasItinerary,
  onClose,
  onRemove,
}: JourneyCartPopupProps) {
  const titleId = useId()

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  return (
    <div className="journey-cart" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <button className="journey-cart__backdrop" type="button" aria-label="Close cart" onClick={onClose} />
      <div className="journey-cart__panel">
        <header className="journey-cart__header">
          <div>
            <p>Journey cart</p>
            <h2 id={titleId}>{themeLabel ? `${themeLabel} package` : 'Your selections'}</h2>
          </div>
          <button type="button" className="journey-cart__close" onClick={onClose}>
            Close
          </button>
        </header>

        <div className="journey-cart__body">
          <p className="journey-cart__status">
            {placeCount} {placeCount === 1 ? 'place' : 'places'}
            {encounterCount > 0
              ? ` · ${encounterCount} ${encounterCount === 1 ? 'encounter' : 'encounters'}`
              : ''}
            {hasItinerary ? ' · itinerary ready' : ' · itinerary still forming'}
          </p>

          <ul className="journey-cart__list">
            {items.map((item) => (
              <li key={item.id}>
                <div>
                  <span>{kindLabel(item.kind)}</span>
                  <strong>{item.label}</strong>
                  {item.parentTheme ? <small>{item.parentTheme}</small> : null}
                </div>
                <button type="button" onClick={() => onRemove(item.id)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        <footer className="journey-cart__footer">
          <p>Checkout is a preview for now. Your concierge will confirm the final journey.</p>
          <div className="journey-cart__actions">
            <button type="button" className="journey-cart__ghost" onClick={onClose}>
              Keep composing
            </button>
            <a className="journey-cart__checkout" href="/checkout">
              Checkout
            </a>
          </div>
        </footer>
      </div>
    </div>
  )
}
