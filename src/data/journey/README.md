# Journey Mock Data Layer

This folder contains **representative prototype data** for the My Journey experience. It is designed so Saku can replace the mock repository internals with real API calls without rewriting UI components.

## Files

| File | Purpose |
|------|---------|
| `types.ts` | TypeScript contracts for destinations, experiences, connections, rhythms, recommendations, itineraries, and Signature Journeys |
| `adapters.ts` | Maps existing catalogue data (`journeyRegions.ts`, `experiences.ts`) into journey-layer types |
| `mockTravelConnections.ts` | Illustrative transfer rhythms between destinations |
| `mockJourneyRhythms.ts` | Editorial journey rhythm concepts (not commercial packages) |
| `mockRecommendations.ts` | Relationship-based editorial recommendations |
| `mockSignatureJourneys.ts` | Illustrative curated journey concepts for future commercial offerings |
| `mockJourneyTypes.ts` | Shared discovery-world references and disclaimer copy |
| `index.ts` | Barrel exports |

## Repository

UI components should import from `src/services/journeyRepository.ts`, **not** from mock arrays directly.

```ts
import { journeyRepository } from '../../services/journeyRepository'
```

### Methods used by the UI

| Method | Used by |
|--------|---------|
| `getDestinations()` | Future Explore tab data loading |
| `getExperiences()` | Future experience filters |
| `getExperiencesForDestination()` | Detail panels |
| `getRecommendations()` | Contextual recommendation enrichment |
| `getTravelConnection()` | Connection lookup |
| `getTravelConnectionsForDestinations()` | Saved Journey tab transfer notes |
| `getSuggestedRhythm()` | Saved Journey tab “A Possible Rhythm” |
| `getJourneyRhythms()` | Guided Discovery rhythm suggestions |
| `generateIllustrativeItinerary()` | Saved Journey tab itinerary preview |
| `getSignatureJourneysForTheme()` | Focused direction view — related curated journeys |

## Conceptual model

### Separate entities (data layer)

These remain distinct in storage and APIs:

- **Discovery Worlds / themes** — editorial directions of interest
- **Regions** — island chapters (The Hill Country, The Southern Arc, etc.)
- **Destinations / landmarks** — specific places
- **Experiences / encounters** — curated activities
- **Signature Journeys** — future curated commercial offerings (illustrative only today)

Relationships are **many-to-many**:

- one destination may relate to many themes
- one destination may appear in many future Signature Journeys
- one Signature Journey may span many themes, regions, destinations, and experiences

### Your Directions (UI layer)

**Your Directions** is a traveller-facing derived view — not a replacement database entity.

Implemented in `src/journey/journeyDirections.ts`, it groups saved `JourneyContext` items into direction cards based on:

1. themes the traveller has explicitly saved
2. each saved place/region/experience’s strongest matching saved direction
3. catalogue relationships (`destinationDiscoveryWorlds`, `parentTheme`, region metadata)

An item appears **once** in its primary direction. Secondary theme connections are shown with subtle labels such as “Also connected to Rail & Landscape”.

Items that cannot be linked to a saved direction appear under **Also saved**.

### Signature Journeys (future commercial layer)

`SignatureJourney` is a separate optional type for future curated offerings. Mock entries are:

- clearly illustrative (`isIllustrative: true`)
- not priced or bookable
- not tied to fictional availability or partners

Use traveller-facing language such as **“A related curated journey”** — never “Package” or tier labels.

## Data contracts

### `Destination`

Canonical journey destination shape. Adapters populate this from `journeyRegions.ts` for the seven primary editorial regions.

Fields the backend must eventually supply:

- `id`, `name`, `regionId`, `regionName`, `shortDescription`
- `themeIds`, `experienceIds`
- `coordinates` or `mapPosition` for map rendering
- `recommendedNights`, `journeyOrder` (optional planning metadata)

### `JourneyExperience`

Representative encounter shape. Adapters populate from `experiences.ts`.

All mock experiences are marked `isRepresentative: true`.

### `TravelConnection`

Illustrative only (`isIllustrative: true`). **Must be replaced** with verified routing data.

UI copy uses cautious language: “Illustrative transfer rhythm”, “Final routing is refined personally”.

### `SuggestedJourneyRhythm`

Editorial planning concepts — **not confirmed commercial offerings**. Do not expose as bookable packages.

### `IllustrativeItinerary`

Rule-based day/segment outline. **Not an operational itinerary.** No hotels, guides, prices, or availability.

### `SignatureJourney`

Future-facing curated journey concept. Illustrative only until the client confirms commercial offerings.

## How the frontend derives a direction

1. Read saved items from `JourneyContext` (localStorage key: `royale-isles-my-journey`).
2. Identify saved theme / discovery-world items → these become direction cards.
3. For each other saved item, resolve related theme IDs from `parentTheme`, catalogue mappings, and inference helpers.
4. Assign the item to the **primary** saved direction using priority:
   - explicit `parentTheme` if that direction is saved
   - catalogue primary theme for destinations
   - inferred theme for experiences
   - first matching saved direction otherwise
5. Render unassigned items in **Also saved**.

Focused direction navigation uses URL state:

`/my-journey?view=journey&direction=shared-heritage`

## Replacing mock data with API calls

1. Keep `JourneyRepository` interface in `src/services/journeyRepository.ts`.
2. Create `ApiJourneyRepository` implementing the same methods.
3. Swap the exported singleton:

```ts
export const journeyRepository: JourneyRepository = new ApiJourneyRepository()
```

4. Preserve `JourneyContext` as the single source of truth for **saved user selections** (localStorage today, authenticated API later).
5. Backend should supply:
   - theme ↔ region ↔ destination ↔ experience relationship tables
   - Signature Journey definitions with many-to-many links
   - verified routing, availability, pricing, and partners only through API responses

## Illustrative vs verified fields

| Illustrative (replace before production) | Verified (backend responsibility) |
|----------------------------------------|-----------------------------------|
| `TravelConnection.durationLabel` | Real transfer timings |
| `TravelConnection.note` | Confirmed routing notes |
| `SuggestedJourneyRhythm` entries | Client-approved journey products |
| `SignatureJourney` entries | Confirmed commercial offerings |
| `IllustrativeItinerary` segments | Day-by-day operational itinerary |
| `isRepresentative` experiences | Confirmed encounters with partners |
| `mockRecommendations` reasons | Curated or algorithmic recommendations |
| Direction grouping logic | May be enriched by server-side curation rules |

## Saved state

User saves flow through `JourneyContext` (`src/journey/JourneyContext.tsx`) and persist under:

- `royale-isles-my-journey`

Do not introduce parallel storage keys (e.g. separate experience ID lists or per-direction storage).

## Content to replace with client data

When the client confirms offerings, replace:

1. Journey rhythm titles and destination sequences in `mockJourneyRhythms.ts`
2. Signature Journey titles and relationships in `mockSignatureJourneys.ts`
3. Transfer connections in `mockTravelConnections.ts`
4. Recommendation relationships in `mockRecommendations.ts`
5. Region segment summaries in `journeyRepository.ts` (`REGION_SEGMENT_SUMMARIES`)
6. Discovery World / direction descriptions in `journeyConsultation.ts` and `discoveryWorlds.ts`
7. Adapter-sourced catalogue content in `journeyRegions.ts` and `experiences.ts`
