# Contact page prototype notes

## Quick inquiry

The `/contact` quick inquiry form saves drafts and submissions to `localStorage` only. It does not send email or notify the team. The success state is intentionally calm and makes no delivery claims.

For the fuller journey-aware consultation experience, use `/consultation`.

## WhatsApp

The confirmed business number is **+94 71 168 0902** (`94711680902`), held as `BUSINESS_WHATSAPP_NUMBER` and used by every CTA when no env var is set.

Set `VITE_WHATSAPP_NUMBER` (digits only, including country code) to route messages to a different number without a code change. The old development placeholder `94763962161` is still rejected, so it can never reach production.

Shared helpers live in `src/consultation/whatsApp.ts`.

## Map location (placeholder)

The Contact page map section uses **representative placeholder data only**:

- Title: Royale Isles Lanka, Colombo
- Address: Colombo 03, Sri Lanka

Replace the address, map centre, marker, and embed URL in `src/components/ContactPage/ContactLocationMap.tsx` with the client’s confirmed office/business location before launch. Do not present the current address as verified.

The prototype uses an OpenStreetMap embed centred on Colombo. Swap for the final Google Maps embed when the confirmed location and API access are available.
