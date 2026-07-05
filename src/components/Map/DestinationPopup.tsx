import type { Destination } from '../../data/destinations'

type DestinationPopupProps = {
  destination: Destination
}

export function DestinationPopup({ destination }: DestinationPopupProps) {
  return (
    <article className="destination-popup-card">
      <img
        className="destination-popup-card__image"
        src={destination.heroImage}
        alt={`${destination.name} destination preview`}
      />
      <div className="destination-popup-card__content">
        <p className="destination-popup-card__eyebrow">{destination.province}</p>
        <h2>{destination.name}</h2>
        <p>{destination.shortDescription}</p>
        <a className="destination-popup-card__link" href={`/my-journey?view=explore#${destination.id}`}>
          Explore Destination
        </a>
      </div>
    </article>
  )
}
