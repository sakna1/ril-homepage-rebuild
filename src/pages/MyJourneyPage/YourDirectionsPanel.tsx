import { useId, useState } from 'react'
import type { DirectionView } from '../../journey/journeyDirections'
import type { JourneyItem } from '../../journey/JourneyContext'
import { normalizeJourneyItemLabels } from '../../journey/savedJourneyDisplay'

type YourDirectionsPanelProps = {
  directions: DirectionView[]
  independentItems: JourneyItem[]
  onRemove: (id: string) => void
  onExploreDirection: (directionId: string) => void
}

export function YourDirectionsPanel({
  directions,
  independentItems,
  onRemove,
  onExploreDirection,
}: YourDirectionsPanelProps) {
  const hasDirections = directions.length > 0
  const [userCollapsed, setUserCollapsed] = useState(false)
  const isOpen = hasDirections && !userCollapsed
  const panelId = useId()

  if (!hasDirections && independentItems.length === 0) {
    return null
  }

  return (
    <div className="your-directions">
      {hasDirections ? (
        <div className="your-directions__header">
          <h3 className="your-directions__title">Your Directions</h3>
          <button
            type="button"
            className="your-directions__toggle"
            aria-expanded={isOpen}
            aria-controls={panelId}
            onClick={() => setUserCollapsed((current) => !current)}
          >
            {isOpen ? 'Hide' : 'Show'}
          </button>
        </div>
      ) : null}

      {hasDirections ? (
        <div
          id={panelId}
          className={`your-directions__panel${isOpen ? ' is-open' : ''}`}
          hidden={!isOpen}
        >
          <p className="your-directions__intro">
            The different ways Sri Lanka has begun to call to you.
          </p>

          <div className="your-directions__cards">
            {directions.map((direction) => (
              <DirectionCard
                key={direction.id}
                direction={direction}
                onExplore={() => onExploreDirection(direction.id)}
                onRemove={onRemove}
              />
            ))}
          </div>
        </div>
      ) : null}

      {independentItems.length > 0 ? (
        <section className="your-directions__also-saved" aria-labelledby="also-saved-heading">
          <h3 id="also-saved-heading">Also saved</h3>
          <ul>
            {independentItems.map((item) => {
              const normalized = normalizeJourneyItemLabels(item)
              return (
                <li key={item.id} className="your-directions__also-saved-item">
                  <div>
                    <strong>{normalized.label}</strong>
                    {normalized.parentRegion ? <p>In {normalized.parentRegion}</p> : null}
                  </div>
                  <div className="your-directions__also-saved-actions">
                    <a className="your-directions__quiet-link" href="/my-journey?view=explore">
                      Explore where this may connect
                    </a>
                    <button
                      type="button"
                      aria-label={`Remove ${normalized.label} from My Journey`}
                      onClick={() => onRemove(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      ) : null}
    </div>
  )
}

function DirectionCard({
  direction,
  onExplore,
  onRemove,
}: {
  direction: DirectionView
  onExplore: () => void
  onRemove: (id: string) => void
}) {
  return (
    <article className="direction-card">
      <h3>{direction.title}</h3>
      <p className="direction-card__description">{direction.description}</p>

      {direction.entries.length > 0 ? (
        <div className="direction-card__saved">
          <p className="direction-card__saved-label">Saved along this direction</p>
          <ul>
            {direction.entries.map(({ item, relationshipLabel }) => {
              const normalized = normalizeJourneyItemLabels(item)
              return (
                <li key={item.id}>
                  <div>
                    <strong>{normalized.label}</strong>
                    {relationshipLabel ? <small>{relationshipLabel}</small> : null}
                  </div>
                  <button
                    type="button"
                    aria-label={`Remove ${normalized.label} from My Journey`}
                    onClick={() => onRemove(item.id)}
                  >
                    Remove
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      ) : (
        <p className="direction-card__empty">
          You have saved this direction. Explore the island to find the places and encounters that
          belong to it.
        </p>
      )}

      <button type="button" className="direction-card__explore" onClick={onExplore}>
        Explore this direction
      </button>
    </article>
  )
}
