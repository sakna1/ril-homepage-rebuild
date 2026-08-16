import { useMemo, useState } from 'react'
import './DestinationsPage.css'
import { journeyRegions, type RegionDestination } from '../../data/journeyRegions'
import { DestinationsBentoGallery, type BentoMediaItem } from './DestinationsBentoGallery'
import { DestinationsMap } from './DestinationsMap'
import { mediaForDestination, youtubeEmbedUrl, youtubeThumbnail } from './destinationMedia'

type DestinationCard = {
  destination: RegionDestination
  regionId: string
  regionTitle: string
}

/** Every destination on the island, flattened out of its region. */
const allDestinations: readonly DestinationCard[] = journeyRegions.flatMap((region) =>
  region.destinations.map((destination) => ({
    destination,
    regionId: region.id,
    regionTitle: region.title,
  })),
)

/** Shapes a destination for the bento gallery, folding in any film it has. */
function toBentoItem({ destination, regionTitle }: DestinationCard): BentoMediaItem {
  const { video, youtube } = mediaForDestination(destination.id)

  return {
    id: destination.id,
    title: destination.title,
    desc: destination.description,
    image: destination.heroImage || youtubeThumbnail(youtube) || '',
    video,
    embedUrl: youtubeEmbedUrl(youtube),
    region: regionTitle,
    bestTime: destination.bestTimeToVisit,
    travelNotes: destination.travelNotes,
    nearby: destination.nearbyExperiences,
  }
}

export function DestinationsPage() {
  // Held here so both the gallery tiles and the map markers open a place.
  const [openId, setOpenId] = useState<string | null>(null)

  const bentoItems = useMemo(() => allDestinations.map(toBentoItem), [])
  const mapDestinations = useMemo(
    () => allDestinations.map((card) => card.destination),
    [],
  )

  return (
    <main className="destinations-page">
      <section className="destinations-hero">
        <p className="destinations-eyebrow">Sri Lanka, Place by Place</p>
        <h1>
          Destinations
          <em>worth the journey.</em>
        </h1>        
      </section>

      <section className="destinations-gallery" aria-label="Destinations in Sri Lanka">
        <DestinationsBentoGallery
          items={bentoItems}
          openId={openId}
          onOpenChange={setOpenId}
        />
      </section>

      <DestinationsMap
        destinations={mapDestinations}
        focusedId={openId}
        onSelect={(destination) => setOpenId(destination.id)}
      />
    </main>
  )
}
