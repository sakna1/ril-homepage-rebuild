import { useEffect, useState } from 'react'
import { useJourney } from './useJourney'
import './JourneyChrome.css'

export function JourneyIncludedPill() {
  return <span className="journey-included-pill">Included in Your Journey</span>
}

export function JourneyHelperMessage() {
  const { count, hasSeenHelper, dismissHelper } = useJourney()
  const shouldShow = count > 0 && !hasSeenHelper
  const [locallyHidden, setLocallyHidden] = useState(false)
  const isVisible = shouldShow && !locallyHidden

  useEffect(() => {
    if (!isVisible) {
      return undefined
    }

    const hideTimer = window.setTimeout(() => {
      setLocallyHidden(true)
      dismissHelper()
    }, 5200)

    return () => window.clearTimeout(hideTimer)
  }, [dismissHelper, isVisible])

  if (!isVisible) {
    return null
  }

  return (
    <aside className="journey-helper-message" aria-live="polite">
      <span>My Journey</span>
      <p>
        Journey updated. Your Expectations are now held in My Journey, ready for concierge refinement.
      </p>
    </aside>
  )
}
