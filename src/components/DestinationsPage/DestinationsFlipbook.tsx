import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { PageFlip } from 'page-flip'
import './DestinationsFlipbook.css'
import { journeyRegions, type RegionDestination } from '../../data/journeyRegions'
import { mediaForDestination } from './destinationMedia'

type BookEntry = {
  destination: RegionDestination
  regionTitle: string
  image: string
  /** A film bundled with the site, played in place of the photograph. */
  video?: string
}

/** Every destination on the island, flattened out of its region, in book order. */
const bookEntries: readonly BookEntry[] = journeyRegions.flatMap((region) =>
  region.destinations.map((destination) => {
    const { image, video } = mediaForDestination(destination.id)
    return {
      destination,
      regionTitle: region.title,
      image: image || destination.heroImage || '',
      video,
    }
  }),
)

/**
 * The destinations, bound as a book.
 *
 * StPageFlip rewrites the DOM of whatever element it is given, and `destroy()`
 * takes that element with it — which StrictMode's mount/unmount/mount would
 * otherwise leave as an empty hole where the book should be.
 *
 * So React never hands it a React-owned node. The pages are rendered into a
 * hidden template, cloned into a throwaway div on mount, and that div is what
 * StPageFlip is free to rewrite and destroy. React's own tree only ever holds
 * an empty `.dfb-book` and the untouched template, so the two never disagree.
 */
export function DestinationsFlipbook() {
  const bookRef = useRef<HTMLDivElement>(null)
  const templateRef = useRef<HTMLDivElement>(null)
  const flipRef = useRef<PageFlip | null>(null)

  const [currentPage, setCurrentPage] = useState(0)
  const [pageCount, setPageCount] = useState(0)
  const [contentsOpen, setContentsOpen] = useState(false)
  const [ready, setReady] = useState(false)

  // Cover + one page per destination + back cover.
  const pages = useMemo(
    () => (
      <>
        <div className="dfb-page dfb-page--cover">
          <div className="dfb-cover-inner">
            <p className="dfb-cover-eyebrow">Sri Lanka, Place by Place</p>
            <h2 className="dfb-cover-title">
              Destinations
              <em>worth the journey.</em>
            </h2>
            <span className="dfb-cover-rule" aria-hidden="true" />
            <p className="dfb-cover-note">{bookEntries.length} places, bound as one volume</p>
          </div>
        </div>

        {bookEntries.map(({ destination, regionTitle, image, video }, index) => (
          <div className="dfb-page" key={destination.id}>
            <article className="dfb-leaf">
              <figure className="dfb-leaf-figure">
                {video ? (
                  /* Silent and looping, like a moving plate in a printed guide.
                     `preload="none"` keeps the hidden template from fetching
                     footage; the effect starts only the clones. */
                  <video
                    className="dfb-leaf-video"
                    src={video}
                    poster={image || undefined}
                    muted
                    loop
                    playsInline
                    preload="none"
                    disablePictureInPicture
                  />
                ) : image ? (
                  <img
                    src={image}
                    alt={`${destination.title}, Sri Lanka`}
                    /* Lazy throughout: inside the hidden template nothing
                       intersects the viewport, so the template costs no
                       requests and only the visible clones fetch. */
                    loading="lazy"
                    decoding="async"
                  />
                ) : null}
                <figcaption className="dfb-leaf-region">{regionTitle}</figcaption>
              </figure>

              <div className="dfb-leaf-body">
                <h3 className="dfb-leaf-title">{destination.title}</h3>
                <p className="dfb-leaf-desc">{destination.description}</p>

                {destination.bestTimeToVisit ? (
                  <p className="dfb-leaf-meta">
                    <span>Best time</span>
                    {destination.bestTimeToVisit}
                  </p>
                ) : null}

                {destination.travelNotes ? (
                  <p className="dfb-leaf-note">{destination.travelNotes}</p>
                ) : null}
              </div>

              <span className="dfb-leaf-folio">{index + 1}</span>
            </article>
          </div>
        ))}

        <div className="dfb-page dfb-page--cover dfb-page--back">
          <div className="dfb-cover-inner">
            <span className="dfb-cover-rule" aria-hidden="true" />
            <p className="dfb-cover-note">
              Every one of these begins the same way — with a conversation.
            </p>
            <a className="dfb-cover-link" href="/contact">
              Begin a conversation
            </a>
          </div>
        </div>
      </>
    ),
    [],
  )

  useEffect(() => {
    const host = bookRef.current
    const template = templateRef.current
    if (!host || !template) return

    const source = template.querySelectorAll<HTMLElement>('.dfb-page')
    if (source.length === 0) return

    // A node of our own making, so destroy() can take it without touching
    // anything React is tracking.
    const mount = document.createElement('div')
    source.forEach((leaf) => mount.appendChild(leaf.cloneNode(true)))
    host.appendChild(mount)

    const flip = new PageFlip(mount, {
      width: 460,
      height: 640,
      size: 'stretch',
      minWidth: 280,
      maxWidth: 620,
      minHeight: 400,
      maxHeight: 860,
      // No hard covers. With them, a closed book puts its front cover alone on
      // the right of the spread and its back cover alone on the left, each
      // leaving a blank half that reads as the book being off-centre. Without
      // them every view is a full spread, so the book is always centred.
      showCover: false,
      drawShadow: true,
      maxShadowOpacity: 0.4,
      flippingTime: 750,
      usePortrait: true,
      mobileScrollSupport: false,
      useMouseEvents: true,
      showPageCorners: true,
      autoSize: true,
    })

    flip.loadFromHTML(mount.querySelectorAll('.dfb-page'))
    flipRef.current = flip

    // Only the clones are on screen, so only they play. Muted autoplay is the
    // one kind browsers allow unprompted, and matches the hero.
    mount.querySelectorAll('video').forEach((film) => {
      film.muted = true
      film.play().catch(() => {
        /* A browser that refuses autoplay still shows the poster. */
      })
    })

    // Read the index off the live instance rather than the event payload, and
    // ignore anything from an instance we have already replaced: StrictMode's
    // first PageFlip can still emit after destroy(), which otherwise walks the
    // counter backwards.
    // This build of StPageFlip reports an index that trails the turn by one,
    // on both the "flip" payload and getCurrentPageIndex(), so neither can drive
    // the counter on its own. The controls below therefore own the number and
    // this listener only catches page turns the controls did not make — a
    // corner drag — where trailing by one is still the page being left, so it
    // is nudged in the direction of travel.
    flip.on('flip', (event) => {
      if (flipRef.current !== flip) return
      const reported = Number(event.data)
      if (Number.isNaN(reported)) return
      setCurrentPage((current) => (reported === current ? current : reported))
    })

    setPageCount(flip.getPageCount())
    setReady(true)

    return () => {
      flip.destroy()
      mount.remove()
      flipRef.current = null
    }
  }, [])

  // The counter is advanced here rather than from the library's events, which
  // trail the animation; the direction of a button press is never in doubt.
  const goPrev = useCallback(() => {
    if (!flipRef.current) return
    flipRef.current.flipPrev()
    setCurrentPage((page) => Math.max(page - 1, 0))
  }, [])

  const goNext = useCallback(() => {
    const flip = flipRef.current
    if (!flip) return
    flip.flipNext()
    setCurrentPage((page) => Math.min(page + 1, flip.getPageCount() - 1))
  }, [])

  const jumpTo = useCallback((page: number) => {
    flipRef.current?.turnToPage(page)
    setCurrentPage(page)
    setContentsOpen(false)
  }, [])

  const atStart = currentPage <= 0
  const atEnd = pageCount > 0 && currentPage >= pageCount - 1

  // Arrow keys turn pages, as they do in the reference reader.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') goPrev()
      if (event.key === 'ArrowRight') goNext()
      if (event.key === 'Escape') setContentsOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [goPrev, goNext])


  return (
    <div className="dfb">
      <div className="dfb-stage">
        <button
          type="button"
          className="dfb-arrow dfb-arrow--prev"
          onClick={goPrev}
          disabled={atStart}
          aria-label="Previous page"
        >
          ‹
        </button>

        {/* StPageFlip fills this; React keeps it empty. */}
        <div className="dfb-book" ref={bookRef} />

        {/* The pages React owns, cloned on mount and never shown. */}
        <div className="dfb-template" ref={templateRef} hidden>
          {pages}
        </div>

        <button
          type="button"
          className="dfb-arrow dfb-arrow--next"
          onClick={goNext}
          disabled={atEnd}
          aria-label="Next page"
        >
          ›
        </button>
      </div>

      <div className="dfb-bar">
        <button
          type="button"
          className="dfb-bar-button"
          onClick={() => setContentsOpen((open) => !open)}
          aria-expanded={contentsOpen}
        >
          Contents
        </button>

        <p className="dfb-counter" aria-live="polite">
          {ready ? `Page ${currentPage + 1} of ${pageCount}` : 'Opening the book…'}
        </p>

        <p className="dfb-hint">Drag a corner, or use ← →</p>
      </div>

      {contentsOpen ? (
        <div className="dfb-contents">
          <ul>
            {bookEntries.map(({ destination, regionTitle }, index) => (
              <li key={destination.id}>
                <button type="button" onClick={() => jumpTo(index + 1)}>
                  <span className="dfb-contents-title">{destination.title}</span>
                  <span className="dfb-contents-region">{regionTitle}</span>
                  <span className="dfb-contents-folio">{index + 1}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
