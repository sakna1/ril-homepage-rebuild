/**
 * Representative placeholder only — replace map centre, marker, and embed URL with the
 * client’s confirmed office/business location before launch. Do not treat this address as verified.
 *
 * Kept out of ContactLocationMap.tsx so that file only exports its component —
 * a module mixing the two breaks Fast Refresh.
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
