import { motion, useReducedMotion } from 'framer-motion'
import type { DistanceAdvisory } from '../../journey/journeyDistanceCheck'

type DistanceAdvisoryBannerProps = {
  advisory: DistanceAdvisory
  onKeepSelection: () => void
}

export function DistanceAdvisoryBanner({ advisory, onKeepSelection }: DistanceAdvisoryBannerProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      className="myj-distance-advisory"
      role="status"
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="myj-distance-advisory__mark" aria-hidden="true">
        !
      </span>
      <div className="myj-distance-advisory__body">
        <p className="myj-distance-advisory__title">A note on distance</p>
        <p>
          <strong>{advisory.from}</strong> and <strong>{advisory.to}</strong> are roughly{' '}
          {Math.round(advisory.distanceKm)}km apart, on different sides of the island. Combining them may
          significantly increase travel time. We recommend choosing one coastal region, or extending your trip
          duration.
        </p>
        <div className="myj-distance-advisory__actions">
          <button type="button" className="myj-distance-advisory__keep" onClick={onKeepSelection}>
            Keep Selection
          </button>
          <a href="/expectations">View Suggested Alternatives</a>
          <a href="/my-journey">Adjust Journey</a>
        </div>
      </div>
    </motion.div>
  )
}
