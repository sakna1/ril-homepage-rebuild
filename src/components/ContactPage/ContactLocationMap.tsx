import { CONTACT_LOCATION_PLACEHOLDER } from './contactLocation'

export function ContactLocationMap() {
  const { title, address, supportingCopy, mapEmbedSrc, mapLink } = CONTACT_LOCATION_PLACEHOLDER

  return (
    <div className="contact-location-map">
      <div className="contact-location-map__copy">
        <h3>{title}</h3>
        <p className="contact-location-map__address">{address}</p>
        <p className="contact-location-map__support">{supportingCopy}</p>
        <p className="contact-location-map__placeholder-note">
          Representative location for prototype review. Confirm the final office address before launch.
        </p>
      </div>

      <figure className="contact-location-map__frame">
        <iframe
          title="Map preview centred on Colombo, Sri Lanka (representative placeholder)"
          src={mapEmbedSrc}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <figcaption>
          <a href={mapLink} target="_blank" rel="noreferrer">
            Open map centred on Colombo
          </a>
        </figcaption>
      </figure>
    </div>
  )
}
