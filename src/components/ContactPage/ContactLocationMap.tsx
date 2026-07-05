/**
 * Representative placeholder only — replace map centre, marker, and embed URL with the
 * client’s confirmed office/business location before launch. Do not treat this address as verified.
 */
export const CONTACT_LOCATION_PLACEHOLDER = {
  title: 'Royale Isles Lanka, Colombo',
  address: 'Colombo 03, Sri Lanka',
  supportingCopy: 'Based in Sri Lanka, shaping journeys across the island.',
  /** OpenStreetMap embed centred on Colombo 03 — swap for Google Maps when confirmed. */
  mapEmbedSrc:
    'https://www.openstreetmap.org/export/embed.html?bbox=79.848%2C6.894%2C79.878%2C6.914&layer=mapnik&marker=6.904%2C79.863',
  mapLink: 'https://www.openstreetmap.org/?mlat=6.904&mlon=79.863#map=14/6.904/79.863',
} as const

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
