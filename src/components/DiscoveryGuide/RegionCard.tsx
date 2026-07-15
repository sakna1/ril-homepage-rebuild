import { useRef, type MouseEvent as ReactMouseEvent } from 'react'
import { motion, useMotionTemplate, useReducedMotion, useSpring } from 'framer-motion'
import { RegionIcon, type RegionIconId } from './RegionIcon'

export type RegionCardData = {
  name: string
  image: string
  teaser: string
  bestMonthsShort: string
  climate: string
  icon: RegionIconId
}

type RegionCardProps = {
  region: RegionCardData
  isActive: boolean
  onSelect: () => void
  index: number
}

const TILT_RANGE = 8

export function RegionCard({ region, isActive, onSelect, index }: RegionCardProps) {
  const cardRef = useRef<HTMLButtonElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const rotateX = useSpring(0, { stiffness: 220, damping: 18 })
  const rotateY = useSpring(0, { stiffness: 220, damping: 18 })
  const glowX = useSpring(50, { stiffness: 220, damping: 24 })
  const glowY = useSpring(50, { stiffness: 220, damping: 24 })
  const glowBackground = useMotionTemplate`radial-gradient(220px circle at ${glowX}% ${glowY}%, rgba(197, 160, 89, 0.28), transparent 70%)`

  function handleMouseMove(event: ReactMouseEvent<HTMLButtonElement>) {
    if (prefersReducedMotion) return
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width
    const py = (event.clientY - rect.top) / rect.height
    rotateY.set((px - 0.5) * TILT_RANGE * 2)
    rotateX.set((0.5 - py) * TILT_RANGE * 2)
    glowX.set(px * 100)
    glowY.set(py * 100)
  }

  function handleMouseLeave() {
    rotateX.set(0)
    rotateY.set(0)
    glowX.set(50)
    glowY.set(50)
  }

  return (
    <motion.button
      ref={cardRef}
      type="button"
      className={`region-card${isActive ? ' is-active' : ''}`}
      onClick={onSelect}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-pressed={isActive}
      style={prefersReducedMotion ? undefined : { rotateX, rotateY, transformPerspective: 900 }}
      initial={prefersReducedMotion ? undefined : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      whileHover={prefersReducedMotion ? undefined : { scale: 1.025 }}
      whileTap={prefersReducedMotion ? undefined : { scale: 0.985 }}
    >
      <motion.span className="region-card__glow" style={{ background: glowBackground }} aria-hidden="true" />
      <span className="region-card__border" aria-hidden="true" />

      <figure className="region-card__media">
        <img src={region.image} alt={`${region.name} in Sri Lanka`} loading="lazy" />
        <span className="region-card__media-veil" aria-hidden="true" />
      </figure>

      <span className="region-card__icon" aria-hidden="true">
        <RegionIcon id={region.icon} />
      </span>

      <span className="region-card__body">
        <span className="region-card__title">{region.name}</span>
        <span className="region-card__teaser">{region.teaser}</span>
        <span className="region-card__meta">
          <span>
            <em>Best Months</em>
            {region.bestMonthsShort}
          </span>
          <span>
            <em>Climate</em>
            {region.climate}
          </span>
        </span>
      </span>
    </motion.button>
  )
}
