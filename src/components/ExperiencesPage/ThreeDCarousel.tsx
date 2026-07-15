import { useEffect, useRef } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import './ThreeDCarousel.css'
import { experienceImages } from './images'
import kandyPeraheraImage from '../../assets/images/Kandy Perahera.JPG'
import queenVictoriaStatueImage from '../../assets/images/queen-victoria-statue-colombo.jpg'

const cards = [
  { src: experienceImages.leopardFeature, alt: 'Sri Lankan leopard resting on rock at dusk' },
  { src: experienceImages.mirissaBoats, alt: 'Fishing boats at Mirissa harbour at sunset' },
  { src: experienceImages.sigiriyaMain, alt: 'Sigiriya rock fortress rising above the landscape' },
  { src: experienceImages.ayurveda, alt: 'Ayurvedic treatment pavilion in a rainforest retreat' },
  { src: experienceImages.hillCountry, alt: 'Nuwara Eliya hill country tea estate' },
  { src: kandyPeraheraImage, alt: 'Kandy Perahera procession with ceremonial performers' },
  { src: queenVictoriaStatueImage, alt: 'Marble statue of Queen Victoria in Colombo' },
] as const

const AUTO_SPIN_DEG_PER_MS = 0.008
const DRAG_DEG_PER_PX = 0.22

export function ThreeDCarousel() {
  const cylinderRef = useRef<HTMLDivElement>(null)
  const motionRef = useRef({ rotation: 0, velocity: 0, dragging: false, lastX: 0 })

  useEffect(() => {
    const cylinder = cylinderRef.current
    if (!cylinder) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frameId = 0
    let lastTime = performance.now()

    const tick = (now: number) => {
      const elapsed = Math.min(now - lastTime, 64)
      lastTime = now
      const motion = motionRef.current

      if (!motion.dragging) {
        motion.velocity *= 0.94
        motion.rotation += motion.velocity
        if (!reducedMotion) {
          motion.rotation += AUTO_SPIN_DEG_PER_MS * elapsed
        }
      }

      cylinder.style.transform = `rotateY(${motion.rotation}deg)`
      frameId = requestAnimationFrame(tick)
    }

    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [])

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    motionRef.current.dragging = true
    motionRef.current.velocity = 0
    motionRef.current.lastX = event.clientX
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const motion = motionRef.current
    if (!motion.dragging) return
    const delta = event.clientX - motion.lastX
    motion.lastX = event.clientX
    motion.rotation += delta * DRAG_DEG_PER_PX
    motion.velocity = delta * DRAG_DEG_PER_PX * 0.4
  }

  const handlePointerEnd = () => {
    motionRef.current.dragging = false
  }

  return (
    <div
      className="exp-carousel"
      role="group"
      aria-label="Rotating gallery of Sri Lanka experiences — drag to spin"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
    >
      <div className="exp-carousel-stage">
        <div className="exp-carousel-cylinder" ref={cylinderRef}>
          {cards.map((card, index) => (
            <figure
              key={card.src}
              style={{
                transform: `rotateY(${index * (360 / cards.length)}deg) translateZ(var(--exp-carousel-radius))`,
              }}
            >
              <img src={card.src} alt={card.alt} draggable={false} loading="lazy" />
            </figure>
          ))}
        </div>
      </div>
    </div>
  )
}
