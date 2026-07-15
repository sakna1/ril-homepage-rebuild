import { useId, useState, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { journeyRegions } from '../../data/journeyRegions'
import './PlaceHoverPreview.css'

function findDestinationWithRegion(placeName: string) {
  for (const region of journeyRegions) {
    const destination = region.destinations.find((entry) => entry.title === placeName)
    if (destination) {
      const siblings = region.destinations.filter((entry) => entry.id !== destination.id).slice(0, 2)
      return { destination, region, siblings }
    }
  }
  return null
}

export function PlaceHoverPreview({ placeName, children }: { placeName: string; children: ReactNode }) {
  const [isVisible, setIsVisible] = useState(false)
  const tooltipId = useId()
  const prefersReducedMotion = useReducedMotion()
  const match = findDestinationWithRegion(placeName)

  if (!match) {
    return <>{children}</>
  }

  const { destination, region, siblings } = match

  return (
    <span
      className="place-hover"
      tabIndex={0}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
      aria-describedby={isVisible ? tooltipId : undefined}
    >
      {children}
      {isVisible ? (
        <motion.div
          className="place-hover__card"
          id={tooltipId}
          role="tooltip"
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 10, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        >
          <figure className="place-hover__hero">
            <img src={destination.heroImage} alt={destination.title} />
          </figure>
          <div className="place-hover__body">
            <p className="place-hover__location">{region.title}</p>
            <h4>{destination.title}</h4>
            <p className="place-hover__description">{destination.description}</p>

            <dl className="place-hover__meta">
              <div>
                <dt>Best Time</dt>
                <dd>{destination.bestTimeToVisit}</dd>
              </div>
            </dl>

            {siblings.length > 0 ? (
              <div className="place-hover__siblings">
                <span>Also in {region.title}</span>
                <div>
                  {siblings.map((sibling) => (
                    <figure key={sibling.id}>
                      <img src={sibling.heroImage} alt={sibling.title} />
                      <figcaption>{sibling.title}</figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            ) : null}

            <a className="place-hover__cta" href="/discover-sri-lanka">
              Learn More
            </a>
          </div>
        </motion.div>
      ) : null}
    </span>
  )
}
