import { motion, useReducedMotion } from 'framer-motion'
import { companionOptions, type CompanionId } from '../../journey/travelPreferences'
import { TravelIcon } from './TravelIcon'

type TravelCompanionsSectionProps = {
  selected: CompanionId | null
  onSelect: (id: CompanionId) => void
}

export function TravelCompanionsSection({ selected, onSelect }: TravelCompanionsSectionProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section className="myj-preference-section" aria-labelledby="companions-heading">
      <h3 id="companions-heading">Who Will You Be Travelling With?</h3>
      <p>This helps your concierge personalise recommendations around your journey.</p>

      <div className="myj-companion-grid" role="radiogroup" aria-labelledby="companions-heading">
        {companionOptions.map((option, index) => {
          const isSelected = option.id === selected
          return (
            <motion.button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              className={`myj-companion-card${isSelected ? ' is-selected' : ''}`}
              onClick={() => onSelect(option.id)}
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
              whileHover={prefersReducedMotion ? undefined : { y: -3 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
            >
              <span className="myj-companion-icon">
                <TravelIcon id={option.icon} />
              </span>
              <span className="myj-companion-label">{option.label}</span>
            </motion.button>
          )
        })}
      </div>
    </section>
  )
}
