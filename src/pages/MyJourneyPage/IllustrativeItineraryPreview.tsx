import { useId, useState } from 'react'
import type { IllustrativeItinerary } from '../../data/journey/types'

type IllustrativeItineraryPreviewProps = {
  itinerary: IllustrativeItinerary
  defaultOpen?: boolean
}

export function IllustrativeItineraryPreview({
  itinerary,
  defaultOpen = false,
}: IllustrativeItineraryPreviewProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const panelId = useId()

  return (
    <section className="illustrative-itinerary" aria-labelledby="illustrative-itinerary-heading">
      <button
        type="button"
        id="illustrative-itinerary-heading"
        className="illustrative-itinerary__toggle"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((current) => !current)}
      >
        {isOpen ? 'Hide illustrative journey outline' : 'See an illustrative journey outline'}
      </button>

      <div
        id={panelId}
        className={`illustrative-itinerary__content${isOpen ? ' is-open' : ''}`}
        hidden={!isOpen}
      >
        <div className="illustrative-itinerary__segments">
          {itinerary.segments.map((segment) => (
            <article key={`${segment.dayLabel}-${segment.regionName}`} className="illustrative-itinerary__segment">
              <span className="illustrative-itinerary__days">{segment.dayLabel}</span>
              <h3>{segment.regionName}</h3>
              <p>{segment.summary}</p>
            </article>
          ))}
        </div>
        <p className="illustrative-itinerary__note">{itinerary.note}</p>
      </div>
    </section>
  )
}
