# Contact page prototype notes

## Quick inquiry

The `/contact` quick inquiry form saves drafts and submissions to `localStorage` only. It does not send email or notify the team. The success state is intentionally calm and makes no delivery claims.

For the fuller journey-aware consultation experience, use `/consultation`.

## WhatsApp

Set `VITE_WHATSAPP_NUMBER` in the environment to a confirmed business number (digits only, including country code). The known development placeholder `94763962161` is treated as unconfigured, so WhatsApp CTAs remain inactive until a real number is supplied.

Shared helpers live in `src/consultation/whatsApp.ts`.

## Map location (placeholder)

The Contact page map section uses **representative placeholder data only**:

- Title: Royale Isles Lanka, Colombo
- Address: Colombo 03, Sri Lanka

Replace the address, map centre, marker, and embed URL in `src/components/ContactPage/ContactLocationMap.tsx` with the client’s confirmed office/business location before launch. Do not present the current address as verified.

The prototype uses an OpenStreetMap embed centred on Colombo. Swap for the final Google Maps embed when the confirmed location and API access are available.
