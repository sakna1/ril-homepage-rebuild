import { motion, useReducedMotion } from 'framer-motion'
import { TravelIcon } from './TravelIcon'

export function HealthInsuranceCard() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.aside
      className="myj-insurance-card"
      aria-labelledby="insurance-heading"
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="myj-insurance-card__badge">Preview</span>
      <span className="myj-insurance-card__icon">
        <TravelIcon id="shield" />
      </span>
      <h3 id="insurance-heading">Complimentary Health Insurance</h3>
      <p>
        Every guest receives complimentary travel health insurance during their stay in Sri Lanka, with coverage of
        up to USD 100,000.
      </p>
      <p className="myj-insurance-card__footnote">
        This is a preview of a planned guest benefit, shown here for illustration. Final coverage terms and provider
        will be confirmed by your concierge before your journey is booked.
      </p>
    </motion.aside>
  )
}
