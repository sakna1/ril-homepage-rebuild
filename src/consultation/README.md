# Consultation flow — developer handover

The `/consultation` route is the primary contact and conversion surface for this prototype. It does not send data to a backend, CRM, or email service.

## Route and components

| Path | Component | Layout |
|------|-----------|--------|
| `/consultation` | `src/components/ConsultationPage/ConsultationPage.tsx` | `PageLayout` |
| `/privacy` | `src/components/LegalPlaceholderPage/PrivacyPage.tsx` | `PageLayout` |
| `/accessibility` | `src/components/LegalPlaceholderPage/AccessibilityPage.tsx` | `PageLayout` |

Supporting modules:

- `ConsultationForm.tsx` — form, validation, draft persistence, success state
- `JourneySummaryPanel.tsx` — read-only handoff from `JourneyContext`
- `src/consultation/consultationStorage.ts` — localStorage keys and shapes
- `src/consultation/buildConsultationSummary.ts` — journey → traveller-facing summary
- `src/consultation/consultationValidation.ts` — client-side validation
- `src/consultation/whatsApp.ts` — WhatsApp URL builder and configuration guard
- `src/consultation/readConsultationSource.ts` — `?from=` source marker parsing

`/concierge` remains as a standalone concept/demo page and is no longer linked from consultation CTAs.

## localStorage keys

### Draft (in progress)

- **Key:** `royale-isles-consultation-draft-v1`
- **Shape:**

```json
{
  "version": 1,
  "updatedAt": "ISO-8601 timestamp",
  "name": "",
  "email": "",
  "phone": "",
  "travelTiming": "",
  "partySize": "1 | \"2\" | \"3-4\" | \"5-6\" | \"7+\" | \"\"",
  "note": ""
}
```

Draft is written as the traveller types and cleared after a successful local submission.

### Submissions (completed, local only)

- **Key:** `royale-isles-consultation-submissions-v1`
- **Cap:** 10 most recent entries (newest first)
- **Shape:**

```json
{
  "id": "uuid",
  "submittedAt": "ISO-8601 timestamp",
  "source": "my-journey | homepage | brochure | ...",
  "form": { "name", "email", "phone", "travelTiming", "partySize", "note" },
  "journeySummary": {
    "directions": ["..."],
    "regions": ["..."],
    "destinations": ["..."],
    "experiences": ["..."],
    "mood": "...",
    "season": "...",
    "rhythmSequence": ["..."]
  }
}
```

Submissions are never logged to the console in production builds.

## Journey summary handoff

`JourneyContext` (`royale-isles-my-journey` in localStorage) is the single source of truth.

`buildConsultationJourneySummary()` composes:

- `buildDirectionsFromSavedItems()` — Your Directions / Discovery Worlds
- `buildJourneyGlanceSummary()` — editorial glance line
- Saved regions, destinations, experiences, mood, and season items
- Optional illustrative rhythm via `journeyRepository.getSuggestedRhythm()` (only when valid, labelled illustrative)

The summary panel is omitted entirely when no meaningful saved context exists.

Travel month prefills from a saved `season` journey item; the traveller can edit it.

## CTA entry points

All consultation/contact CTAs route to `/consultation?from=<source>`:

| Source marker | Entry point |
|---------------|-------------|
| `my-journey` | My Journey empty state, populated handoff, Focused Direction CTA |
| `homepage` | Hero, invitation section, FAQ aside |
| `brochure` | Homepage brochure section |
| `about` | About invitation CTA |
| `journal` | Journal landing concierge aside |
| `travel-preparation` | FAQ aside, final CTA, in-page nav |
| `expectations` | Expectations encounter cards, final CTA, text links |
| `footer` | Footer “Begin a Conversation” and “Contact” |
| `guided-discovery` | Reserved for future Guided Discovery handoff |

Discovery CTAs that belong to Expectations continue to point at `/expectations`.

## Connecting a real backend later

1. Add an API route or form endpoint (e.g. `/api/consultation`).
2. In `ConsultationForm.tsx`, replace the local-only `saveConsultationSubmission()` call with a `fetch` POST that sends:
   - trimmed form fields
   - `source` marker
   - compact `journeySummary` from `buildConsultationJourneySummary()`
3. On success, clear the draft and show updated success copy (see below).
4. Remove or gate local submission storage behind a dev flag if no longer needed.
5. Publish privacy policy and update the form note before collecting live data.

Suggested payload shape matches `ConsultationSubmission` in `consultationStorage.ts`.

## WhatsApp configuration

Set a confirmed number in `.env`:

```
VITE_WHATSAPP_NUMBER=94771234567
```

Rules:

- Digits only (country code included); non-digits are stripped.
- The placeholder `94763962161` in code is treated as unconfigured.
- When unconfigured: no “Continue on WhatsApp” in success state, no floating WhatsApp FAB.
- When configured: success-state link prefills name, top 1–3 directions, up to 3 saved places, and travel timing if supplied. Email, phone, notes, and full itinerary are excluded.

Helper: `src/consultation/whatsApp.ts`.

## Success-state wording to change when live

Current (prototype-safe):

- “Thank you. Your journey has been noted.”
- “Your ideas are now gathered in one place. When the consultation desk is connected, this will become the beginning of a more personal conversation.”

Replace with honest delivery language once email/CRM is connected, e.g. confirmation of receipt and expected response timeframe.

Form note references unpublished privacy policy — update when legal copy is approved.

## Client / business dependencies before go-live

- [ ] Approved business email and enquiry routing
- [ ] Confirmed WhatsApp Business number (`VITE_WHATSAPP_NUMBER`)
- [ ] Privacy policy and consent wording
- [ ] Response SLA for consultation enquiries
- [ ] Confirmed office address (if shown on site)
- [ ] CRM or form endpoint
- [ ] Brochure delivery mechanism (if separate from consultation)

## Floating actions

The fictional “AI Concierge” FAB was removed from `PageLayout`. `/concierge` remains reachable only by direct URL for demo purposes. WhatsApp FAB appears only when a non-placeholder number is configured.
