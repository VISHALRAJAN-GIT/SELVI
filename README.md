# Selvi — Simple Government Service Guide

Selvi is a beginner-friendly, voice-supported guide for people navigating government services. The app now starts with a short welcome animation, asks the user to choose a language, then a State/UT, and presents researched service guides with direct official links.

> **Selvi explains and points the way. It does not make official decisions, inspect government form fields, enter credentials, fill or submit forms, or complete an application on a user's behalf.**

## First visit

1. A short loading/welcome page appears and can be skipped.
2. Choose from **Tamil, Hindi, Bengali, Marathi or Telugu**. Tamil is intentionally first. Each language card has a user-clicked, bundled greeting sample.
3. Choose **Tamil Nadu** or search for any other State/Union Territory.
4. Browse the service cards, type a search or—when supported by the browser—press the microphone button and say what service you are looking for.
5. Open a guide for a simple goal statement, items to prepare, ordered steps, safety notes, supporting official sources, a checked date and one direct official-service link.
6. Use the language and state shortcuts to change either choice at any time.

Large buttons, visible text, keyboard access, responsive mobile layout and reduced-motion handling are included. Speech playback is started only by a button press. Each language has a bundled short greeting; longer service guidance uses a matching browser voice **only when that device provides one**. Selvi says when speech is unavailable and keeps the guide readable. Browser speech recognition is optional and device/browser dependent: the mic starts only after a tap and browser permission. The recognized search phrase remains visible to review; it never opens a service automatically. Typed search and the service cards remain available.

## Languages and state coverage

Tamil is first by request. Hindi, Bengali, Marathi and Telugu follow it as the other largest 2011 Census mother-tongue groups. The historical shares are labeled as such; they are not a current usage survey, an estimate of digital access, or a claim about service popularity.

Tamil is the source for guide content. Hindi, Bengali, Marathi and Telugu currently use static machine-assisted draft translations with a structured pass and targeted corrections. They are simplified Selvi explanations—not official translations—and still need native-language public-service review. The current information on each linked government website is authoritative.

Tamil Nadu is the first prominent state choice. The starter directory contains **five India-wide guides** (Aadhaar services, voter services, passports, DigiLocker and Instant e-PAN) and **three Tamil Nadu guides** (community certificate, income certificate and family/PDS services). The national guides remain available in other states; Tamil Nadu-only guides are hidden outside Tamil Nadu. Users in other states are linked to the official Government of India state/UT services directory while further state guides are researched.

This is a researched starter catalog, **not every available government service** and not a popularity ranking. Official usage comparisons were not available for most entries, so Selvi does not claim that these are definitively India's most-used services. See [sources, language evidence and coverage](docs/service-catalog.md).

## Existing Tamil guides

Tamil Nadu users can still open the PM Vishwakarma question-by-question guide and Tamil-only Explain This panel from the catalog. Explain This is a bounded server-side flow with validation and a safe fallback. The optional [Chrome page-pointer extension](extension/nila-page-guide/README.md) remains separate; it is manually installed, user-clicked and limited to a local pointer suggestion on the official PM Vishwakarma site. It is a deterministic label matcher, not an AI agent.

## Run and verify

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm test
pnpm build
pnpm build:extension
pnpm dev
```

For a translation-data refresh, run `python3 scripts/generate-locales.py` and then `python3 scripts/apply-locale-overrides.py`; the configured LLM proxy must be available. Re-review translated safety text before release. The generated translations are static client data; the browser does not call a translation service.

The single-origin runtime serves the SPA and API. `/api/health` is the health route and `/manus-routes.json` is the Webdev route manifest.

## Privacy and trust

Selvi does not request an Aadhaar number, bank details, a government-service password, an OTP, or an account. Search, selection state and any voice-recognition transcript remain in browser memory; the service finder does not send them to Selvi's server. Microphone recognition is provided by the browser/device and may use its provider-specific processing. Selvi does not store raw microphone audio. Only if a user explicitly submits text in Explain This does that pasted passage go to the server, where Selvi does not persist it. Use credentials only on the official government service reached through the guide.

## Validation and honest limitations

The project includes tests for the five locale-data shapes, all 36 State/UT names, official HTTPS sources, state-scoped filtering, journey parsing, the Explain This fallback and the extension's domain/label rules. Browser playback and UI navigation should still be checked on real supported phones and browsers, and the extension needs a manual Chrome run.

Government portals can change. Re-check service links, required steps, safety wording and dates before public release. Non-Tamil translations need native-language public-service editors and usability review with people unfamiliar with websites; one Selvi reader must not replace an interpreter or official help.
