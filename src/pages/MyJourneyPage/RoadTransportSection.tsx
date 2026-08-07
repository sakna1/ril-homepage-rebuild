import { motion, useReducedMotion } from 'framer-motion'
import { transportOptions, type TransportId } from '../../journey/travelPreferences'
import { TravelIcon } from './TravelIcon'

type RoadTransportSectionProps = {
  selected: TransportId | null
  onSelect: (id: TransportId) => void
}

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export function RoadTransportSection({ selected, onSelect }: RoadTransportSectionProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section className="myj-preference-section" aria-labelledby="transport-heading">
      <h3 id="transport-heading">Road Transportation</h3>
      <p>
        Choose how you would like to travel between destinations. The Private Luxury Car is included
        as standard; anything beyond it is charged as an upgrade.
      </p>

      <div className="myj-transport-grid" role="radiogroup" aria-labelledby="transport-heading">
        {transportOptions.map((option, index) => {
          const isSelected = option.id === selected
          return (
            <motion.button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              className={`myj-transport-card${isSelected ? ' is-selected' : ''}`}
              onClick={() => onSelect(option.id)}
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
              whileHover={prefersReducedMotion ? undefined : { y: -3 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
            >
              <span className="myj-transport-icon">
                <TravelIcon id={option.icon} />
              </span>
              <span className="myj-transport-label">{option.label}</span>

              {/* The first vehicle comes with every package; the rest are upgrades. */}
              <span
                className={`myj-transport-price${option.priceAdd === 0 ? ' is-standard' : ''}`}
              >
                {option.priceAdd === 0
                  ? 'Standard · included'
                  : `+ ${usd.format(option.priceAdd)} per person`}
              </span>

              <dl className="myj-transport-meta">
                <div>
                  <dt>Capacity</dt>
                  <dd>{option.capacity}</dd>
                </div>
                <div>
                  <dt>Luggage</dt>
                  <dd>{option.luggage}</dd>
                </div>
                <div>
                  <dt>Comfort</dt>
                  <dd>{option.comfort}</dd>
                </div>
              </dl>

              <p className="myj-transport-recommended">Recommended for {option.recommendedFor}</p>
            </motion.button>
          )
        })}
      </div>
    </section>
  )
}
