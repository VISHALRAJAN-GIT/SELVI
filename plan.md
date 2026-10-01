# Selvi — India-first Government Service Guide

## Goal

Make the first visit understandable to someone with little or no digital experience. Selvi displays a short skippable welcome animation, asks for a language, then a State/UT, then shows plain-language government service cards with direct official links and researched step-by-step guidance.

This release is a **verified starter catalog**, not a claim to cover every government service in India. The initial catalog contains eight researched tasks: five India-wide (Aadhaar, voter services, passport, DigiLocker, Instant e-PAN) and three Tamil Nadu services (community certificate, income certificate, family/PDS card services). The PM Vishwakarma Tamil guide and Explain This flow remain as additional legacy assistance.

## Language and geography decisions

- Five languages are offered: Tamil, Hindi, Bengali, Marathi and Telugu. Tamil appears first by user request; the others follow descending Census 2011 mother-tongue share. The percentages are historical Census data, not a current language-use or service-demand survey.
- Every language choice has an on-demand bundled greeting sample. The service catalog supports text search and optional user-initiated browser voice search in the selected locale when supported. The guide text remains visible if matching browser speech is unavailable.
- Tamil is the guide source. Hindi, Bengali, Marathi and Telugu are structured machine-assisted static drafts with targeted corrections, not official or native-reviewed translations. An authoritative linked government portal always takes precedence.
- Tamil Nadu is preselected and prominent. India-wide guides are visible in all states; Tamil Nadu-only guides are visible only when Tamil Nadu is selected. Other state/UT users receive honest coverage text plus official national state/UT directory links.

## User experience

1. **Welcome:** short branded loading animation, accessible skip action and reduced-motion support; no automatic audio.
2. **Language:** large native-script choice cards, Tamil first, user-clicked language sample audio, text always available.
3. **State:** prominent Tamil Nadu action plus searchable full state/UT list.
4. **Service search:** localized cards and text search; mic search is optional, explicit and user-reviewed. The transcript only populates the search box.
5. **Guide:** simple goal, preparation, ordered steps, safety notes, official source links/date and one clear official-site action. No form reading, autofill, clicking or submission.
6. **Retained Tamil help:** PM Vishwakarma journey and Explain This remain available in Tamil for Tamil Nadu users, alongside the separate optional local pointer extension on the PM Vishwakarma official domain.

## Source and safety policy

- Curated guide facts and URLs are stored in `client/src/data/serviceCatalog.ts`. Every guide must have an official HTTPS entry point, supporting official sources, a last-checked date and clear coverage/safety wording.
- Do not invent a required item or workflow. If sources don't establish a point, direct the user to the official service/help channel.
- Selvi never requests, retains or transmits Aadhaar, bank details, passwords or OTPs. The browser-only service finder sends no search query to the server. Explain This sends pasted text only after explicit user submission and does not persist it.
- The catalog is not all services and has no verified usage/popularity ranking. Census 2011 shares do not mean current language demand.
- Every new state guide needs a source-backed workflow, a Tamil source version, and reviewed translations for every enabled locale before being described as production-ready.

## Architecture and project structure

Retain the existing React/Vite/Express/tRPC SPA and `/` route. Do not add authentication, database persistence, or a service that manipulates government pages.

- `client/src/pages/Home.tsx`: onboarding/service navigation and retained Tamil PM/Explain flows.
- `client/src/components/nila/Onboarding.tsx`: splash and language/state selection.
- `client/src/components/nila/ServiceDirectory.tsx`: search, state scoping, localized cards and guide details.
- `client/src/data/serviceCatalog.ts`: curated service facts, fixed URLs and filtering.
- `client/src/data/localeSource.ta.json`: Tamil UI/source copy; `client/src/data/localeCopy.generated.json`: other static locale data.
- `scripts/generate-locales.py`, `scripts/locale-overrides.json`, `scripts/apply-locale-overrides.py`: reproducible machine-assisted translation and targeted overrides.
- `client/src/lib/i18n.ts`: typed locales, Census data/source and State/UT names.
- `client/src/lib/voice.ts`: bundled greeting/Tamil narration, user-initiated browser speech, matching-device voice fallback.
- `shared/scheme.ts`, server routers and APIs: retain the existing Tamil PM rules and Explain This boundary.
- `extension/nila-page-guide/`: optional user-clicked deterministic PM portal pointer.

## Verification

Run `pnpm check`, `pnpm test`, `pnpm build`, the extension build after extension changes, then test `/api/health` and `/manus-routes.json` if serving a production build. Automated tests cover locale key/guide parity, all 36 states/UTs, official HTTPS sources, national/state filtering, existing eligibility/explanation rules and extension restrictions. Manually test the splash, language audio, state search, locale service card/detail, microphone fallback and mobile layout. Review privacy, translated safety text and official sources before release.

## Known constraints

- Only eight guides are currently covered; no product claim should imply every service is included.
- State-specific services beyond Tamil Nadu are not yet curated.
- Four non-Tamil guide translations require native-language public-service editorial review.
- Browser speech support varies by device, browser, locale and permission; static text is always available.
- Government portals can change; current official instructions take precedence, and Selvi does not automate forms or guarantee an outcome.
