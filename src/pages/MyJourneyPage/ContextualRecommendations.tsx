import type { JourneyItem } from '../../journey/JourneyContext'
import { useJourney } from '../../journey/useJourney'
import type { ContextualRecommendation } from '../../journey/contextualRecommendations'

type ContextualRecommendationsProps = {
  primaryHeading: string
  secondaryHeading?: string
  recommendations: ContextualRecommendation[]
}

export function ContextualRecommendations({
  primaryHeading,
  secondaryHeading,
  recommendations,
}: ContextualRecommendationsProps) {
  const { includeItem, isIncluded } = useJourney()

  if (recommendations.length === 0) {
    return null
  }

  return (
    <div className="contextual-recommendations">
      <h3 className="contextual-recommendations__heading">{primaryHeading}</h3>
      {secondaryHeading ? (
        <p className="contextual-recommendations__subheading">{secondaryHeading}</p>
      ) : null}
      <ul className="contextual-recommendations__list">
        {recommendations.map((recommendation) => (
          <li key={recommendation.id}>
            <RecommendationCard
              recommendation={recommendation}
              isSaved={isIncluded(recommendation.id)}
              onAdd={() => includeItem(recommendation.item)}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}

function RecommendationCard({
  recommendation,
  isSaved,
  onAdd,
}: {
  recommendation: ContextualRecommendation
  isSaved: boolean
  onAdd: () => void
}) {
  return (
    <article className="contextual-recommendations__card">
      <div>
        <h4>{recommendation.label}</h4>
        <p>{recommendation.detail}</p>
        <small>{recommendation.reason}</small>
      </div>
      {isSaved ? (
        <span className="contextual-recommendations__saved" aria-live="polite">
          Added to My Journey
        </span>
      ) : (
        <button
          className="contextual-recommendations__add"
          type="button"
          onClick={onAdd}
          aria-label={`Add ${recommendation.label} to My Journey`}
        >
          Add to My Journey
        </button>
      )}
    </article>
  )
}

export function JourneySaveAction({
  item,
  label,
}: {
  item: JourneyItem
  label: string
}) {
  const { includeItem, confirmRemoveItem, isIncluded } = useJourney()
  const saved = isIncluded(item.id)

  if (saved) {
    return (
      <div className="journey-save-action">
        <span className="journey-save-action__saved" aria-live="polite">
          Added to My Journey
        </span>
        <button
          className="journey-save-action__remove"
          type="button"
          aria-label={`Remove ${label} from My Journey`}
          onClick={() => confirmRemoveItem(item.id)}
        >
          Remove
        </button>
      </div>
    )
  }

  return (
    <button
      className="journey-save-action__add"
      type="button"
      aria-label={`Add ${label} to My Journey`}
      onClick={() => includeItem(item)}
    >
      Add to My Journey
    </button>
  )
}
