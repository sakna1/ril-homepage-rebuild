import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import './DestinationsBentoGallery.css'

export type BentoMediaItem = {
  id: string
  title: string
  desc: string
  /** Still shown in the tile, and behind the film in the modal. */
  image: string
  /** A bundled video file, played muted and looping inside the tile. */
  video?: string
  /** Privacy-enhanced YouTube embed URL, when the place has footage. */
  embedUrl?: string | null
  region: string
  bestTime?: string
  travelNotes?: string
  nearby?: readonly string[]
}

type BentoGalleryProps = {
  items: readonly BentoMediaItem[]
  /** Which place is open, held by the page so the map can open one too. */
  openId: string | null
  onOpenChange: (id: string | null) => void
}

/**
 * Tile shapes, deliberately uneven. They are grouped into bands that each fill
 * exactly six rows across the four columns — a 2x6 feature beside a 1x6, then a
 * 1x4 stacked on a 1x2 — so the sizes vary without leaving holes in the grid.
 */
const SPANS = [
  // Band: hero + tall + (standard over short)
  'is-hero',
  'is-tall',
  'is-standard',
  'is-short',
  // Band: two stacked columns + (block over wide)
  'is-standard',
  'is-short',
  'is-short',
  'is-standard',
  'is-block',
  'is-wide',
] as const

/**
 * Films need the tall reel-shaped slot, and simply forcing one wherever a film
 * happens to land breaks the band it sits in — leaving a hole beside it. So
 * instead the films are moved into the slots the pattern already makes tall.
 */
function arrangeForFilms(items: readonly BentoMediaItem[]): BentoMediaItem[] {
  const arranged = [...items]
  const shapeAt = (index: number) => SPANS[index % SPANS.length]

  const tallSlots = arranged
    .map((_, index) => index)
    .filter((index) => shapeAt(index) === 'is-tall')

  const filmSlots = arranged
    .map((item, index) => (item.video ? index : -1))
    .filter((index) => index >= 0)

  filmSlots.forEach((from) => {
    if (shapeAt(from) === 'is-tall') return
    const to = tallSlots.find((slot) => !arranged[slot].video)
    if (to === undefined) return
    const moved = arranged[from]
    arranged[from] = arranged[to]
    arranged[to] = moved
  })

  return arranged
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

/**
 * A tile with footage plays it muted and looping, but only while it is on
 * screen — eighteen videos decoding at once would cost far more than it buys.
 *
 * Mobile Safari refuses `play()` until a frame has been decoded, and with
 * `preload="metadata"` that has usually not happened by the time the tile
 * scrolls in. A single attempt therefore fails silently and the poster sits
 * there forever, so the load is kicked off on entry and the play retried on
 * every readiness event until it takes.
 */
function TileVideo({ item }: { item: BentoMediaItem }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // React sets `muted` as a property, and iOS only grants inline autoplay to
    // a video it considers muted, so assert it directly too.
    video.muted = true

    let inView = false

    const attemptPlay = () => {
      if (!inView || !video.paused) return
      const started = video.play()
      // Refusals (low power mode, data saver) leave the poster in place.
      if (started) started.catch(() => {})
    }

    const readinessEvents = ['loadeddata', 'canplay', 'canplaythrough'] as const
    readinessEvents.forEach((event) => video.addEventListener(event, attemptPlay))

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          inView = entry.isIntersecting
          if (!inView) {
            video.pause()
            return
          }
          // Nothing fetched yet (preload="metadata" on a cold tile): start it.
          if (video.readyState === 0) video.load()
          attemptPlay()
        })
      },
      { root: null, rootMargin: '200px', threshold: 0.01 },
    )

    observer.observe(video)

    return () => {
      observer.disconnect()
      readinessEvents.forEach((event) => video.removeEventListener(event, attemptPlay))
    }
  }, [])

  return (
    <video
      ref={videoRef}
      className="bento-tile__media"
      src={item.video}
      poster={item.image || undefined}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
    />
  )
}

function TileMedia({ item }: { item: BentoMediaItem }) {
  return (
    <>
      {item.video ? (
        <TileVideo item={item} />
      ) : (
        <img className="bento-tile__media" src={item.image} alt={item.title} loading="lazy" decoding="async" />
      )}
      {item.video || item.embedUrl ? (
        <span className="bento-tile__play" aria-hidden="true">
          ▶
        </span>
      ) : null}
    </>
  )
}

function GalleryModal({
  selectedItem,
  items,
  onSelect,
  onClose,
}: {
  selectedItem: BentoMediaItem
  items: readonly BentoMediaItem[]
  onSelect: (item: BentoMediaItem) => void
  onClose: () => void
}) {
  const [dockPosition, setDockPosition] = useState({ x: 0, y: 0 })

  // Escape closes, and the page behind must not scroll while this is open.
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKey)
    }
  }, [onClose])

  return (
    <>
      <motion.div
        className="bento-modal"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        role="dialog"
        aria-modal="true"
        aria-label={selectedItem.title}
        onClick={onClose}
      >
        <div
          className={`bento-modal__panel${selectedItem.video ? ' is-reel' : ''}`}
          onClick={(event) => event.stopPropagation()}
        >
          {/* Keyed, but not wrapped in AnimatePresence: waiting for the old
              stage to animate out left the previous place's media on screen
              after the copy beside it had already changed. */}
          <motion.div
            key={selectedItem.id}
            className={`bento-modal__stage${selectedItem.video ? ' is-reel' : ''}`}
            initial={{ y: 20, scale: 0.97, opacity: 0 }}
            animate={{
              y: 0,
              scale: 1,
              opacity: 1,
              transition: { type: 'spring', stiffness: 500, damping: 30, mass: 0.5 },
            }}
          >
              {selectedItem.video ? (
                <video
                  src={selectedItem.video}
                  poster={selectedItem.image || undefined}
                  controls
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : selectedItem.embedUrl ? (
                <iframe
                  src={selectedItem.embedUrl}
                  title={`${selectedItem.title} on video`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              ) : (
                <img src={selectedItem.image} alt={selectedItem.title} />
              )}
          </motion.div>

          <div className="bento-modal__copy">
            <p className="bento-modal__region">{selectedItem.region}</p>
            <h3>{selectedItem.title}</h3>
            <p className="bento-modal__desc">{selectedItem.desc}</p>

            <dl className="bento-modal__facts">
              {selectedItem.bestTime ? (
                <div>
                  <dt>Best time to visit</dt>
                  <dd>{selectedItem.bestTime}</dd>
                </div>
              ) : null}
              {selectedItem.travelNotes ? (
                <div>
                  <dt>Getting there</dt>
                  <dd>{selectedItem.travelNotes}</dd>
                </div>
              ) : null}
            </dl>

            {selectedItem.nearby && selectedItem.nearby.length > 0 ? (
              <div className="bento-modal__nearby">
                <h4>What is close by</h4>
                <ul>
                  {selectedItem.nearby.map((entry) => (
                    <li key={entry}>{entry}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <motion.button
            type="button"
            className="bento-modal__close"
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Close"
          >
            <CloseIcon />
          </motion.button>
        </div>
      </motion.div>

      {/* Draggable dock of every place, so one can be swapped for another. */}
      <motion.div
        className="bento-dock"
        drag
        dragMomentum={false}
        dragElastic={0.1}
        initial={false}
        animate={{ x: dockPosition.x, y: dockPosition.y }}
        onDragEnd={(_, info) => {
          setDockPosition((previous) => ({
            x: previous.x + info.offset.x,
            y: previous.y + info.offset.y,
          }))
        }}
      >
        <div className="bento-dock__rail">
          {items.map((item, index) => {
            const isCurrent = item.id === selectedItem.id
            return (
              <motion.button
                type="button"
                key={item.id}
                className={`bento-dock__thumb${isCurrent ? ' is-current' : ''}`}
                style={{ zIndex: isCurrent ? 30 : items.length - index }}
                onClick={(event) => {
                  event.stopPropagation()
                  onSelect(item)
                }}
                initial={{ rotate: index % 2 === 0 ? -15 : 15 }}
                animate={{
                  scale: isCurrent ? 1.2 : 1,
                  rotate: isCurrent ? 0 : index % 2 === 0 ? -15 : 15,
                  y: isCurrent ? -8 : 0,
                }}
                whileHover={{
                  scale: 1.3,
                  rotate: 0,
                  y: -10,
                  transition: { type: 'spring', stiffness: 400, damping: 25 },
                }}
                aria-label={item.title}
                aria-current={isCurrent}
              >
                <img src={item.image} alt="" loading="lazy" />
              </motion.button>
            )
          })}
        </div>
      </motion.div>
    </>
  )
}

/**
 * A bento-style grid of places: tiles of varied height opening into a modal,
 * with a draggable dock for hopping between destinations.
 */
export function DestinationsBentoGallery({ items, openId, onOpenChange }: BentoGalleryProps) {
  // Films are placed into the tall slots once; the order is fixed after that.
  // Tiles used to be draggable, but on a touch screen that turned a scroll into
  // a reorder — places moved under the reader's thumb.
  const ordered = useMemo(() => arrangeForFilms(items), [items])
  // Which place is open is the page's business — a marker on the map opens one
  // just as a tile does.
  const selectedItem = openId ? (ordered.find((item) => item.id === openId) ?? null) : null

  return (
    <div className="bento-gallery">
      {/* The grid stays mounted while the modal is open. Unmounting it collapsed
          the page to the height of the hero and map, so the browser clamped the
          scroll position and you were dumped at the bottom on close. */}
      <motion.div
        className="bento-grid"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
        }}
      >
            {ordered.map((item, index) => (
              <motion.button
                type="button"
                key={item.id}
                layoutId={`bento-${item.id}`}
                // Footage is shot vertically, so a film always takes the tall
                // reel-shaped footprint rather than the pattern's next shape.
                className={`bento-tile ${item.video ? 'is-reel' : SPANS[index % SPANS.length]}`}
                onClick={() => {
                  onOpenChange(item.id)
                }}
                aria-label={`View ${item.title}`}
                variants={{
                  hidden: { y: 50, scale: 0.9, opacity: 0 },
                  visible: {
                    y: 0,
                    scale: 1,
                    opacity: 1,
                    transition: {
                      type: 'spring',
                      stiffness: 350,
                      damping: 25,
                      delay: index * 0.04,
                    },
                  },
                }}
                whileHover={{ scale: 1.02 }}
              >
                <TileMedia item={item} />
                <span className="bento-tile__scrim" aria-hidden="true" />
                <span className="bento-tile__copy">
                  <span className="bento-tile__region">{item.region}</span>
                  <span className="bento-tile__title">{item.title}</span>
                  <span className="bento-tile__desc">{item.desc}</span>
                </span>
          </motion.button>
        ))}
      </motion.div>

      <AnimatePresence>
        {selectedItem ? (
          <GalleryModal
            key="modal"
            selectedItem={selectedItem}
            items={ordered}
            onSelect={(item) => onOpenChange(item.id)}
            onClose={() => onOpenChange(null)}
          />
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export default DestinationsBentoGallery
