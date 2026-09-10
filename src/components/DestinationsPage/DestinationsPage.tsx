import { useMemo, useState } from 'react'
import './DestinationsPage.css'
import { journeyRegions } from '../../data/journeyRegions'
import { DestinationsFlipbook } from './DestinationsFlipbook'
import { DestinationsMap } from './DestinationsMap'

/** Every destination on the island, flattened out of its region. */
const allDestinations = journeyRegions.flatMap((region) => region.destinations)

export function DestinationsPage() {
  // The map keeps its own focus; the book is browsed by turning pages.
  const [openId, setOpenId] = useState<string | null>(null)

  const mapDestinations = useMemo(() => allDestinations, [])

  return (
    <main className="destinations-page">
      <section className="destinations-hero">
        <p className="destinations-eyebrow">Sri Lanka, Place by Place</p>
        <h1>
          Destinations
          <em>worth the journey.</em>
        </h1>
      </section>

      <section className="destinations-book" aria-label="Destinations, page by page">
        <DestinationsFlipbook />
      </section>

      <DestinationsMap
        destinations={mapDestinations}
        focusedId={openId}
        onSelect={(destination) => setOpenId(destination.id)}
      />
    </main>
  )
}
