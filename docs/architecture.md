# Selvi architecture

Selvi is a client-rendered React/Vite app served by the existing Express/tRPC server. The first-time flow stays on `/` and changes internal view state rather than adding deep routes. It intentionally combines small fixed choices and source-backed guides rather than acting as an open-ended government-site agent.

## First-visit flow

```text
Skippable welcome animation
        ↓
Choose one of five languages (Tamil first; user-clicked sample audio)
        ↓
Choose a State/UT (Tamil Nadu prominent)
        ↓
Filter the researched service catalog
        ↓
Read/replay an ordered guide and safety notes
        ↓
Open an official portal and continue independently
```

`client/src/data/serviceCatalog.ts` contains eight typed records: five India-wide guides and three Tamil Nadu-only guides. `getServicesForState` keeps national entries available in all states and suppresses state-specific entries elsewhere. Every record contains a fixed official entry URL, supporting official sources, date, Tamil source copy, preparation guidance, steps, safety notes and coverage caveat. `client/src/lib/i18n.ts` merges the Tamil source with static Hindi, Bengali, Marathi and Telugu translations in `client/src/data/localeCopy.generated.json`. Translated service/UI content is a draft, not an official translation.

The static directory supports text search and optional user-clicked browser speech recognition in the selected locale. A recognized phrase goes into the visible search box; it does not navigate automatically or post a transcript to the server. `client/src/lib/voice.ts` also plays short bundled language samples. Longer localized guide read-aloud uses browser speech only if a matching native voice exists; text remains available if it does not. The earlier Tamil flow still uses bundled guide/journey audio from `client/public/audio/ta/`.

## Main frontend modules

- `client/src/pages/Home.tsx`: welcome/language/state/service view flow and retained PM Vishwakarma, Explain This and guide modes.
- `client/src/components/nila/Onboarding.tsx`: splash, native-script language cards and all-State/UT chooser.
- `client/src/components/nila/ServiceDirectory.tsx`: text/voice search, localized cards, state-specific scope, guide detail, sources and official link.
- `client/src/lib/i18n.ts`: locale metadata, Census source, state data and static localized copy.
- `client/src/data/localeSource.ta.json`: Tamil UI and State/UT source text.
- `client/src/data/localeCopy.generated.json`: static translated copies; `scripts/locale-overrides.json` contains targeted corrections.
- `client/src/lib/voice.ts`: microphone support check, locale-specific browser recognition, static greetings, bundled Tamil clips, optional browser read-aloud and visible status.
- `shared/scheme.ts` and `client/src/lib/journey.ts`: original curated PM Vishwakarma rules and Tamil journey parsing.

## Existing Tamil guide flows

The PM Vishwakarma journey remains deterministic and Tamil-only. It uses curated scheme facts, official links, a checklist and a first-pass eligibility result that is explicitly not an official decision. Income is contextual only. The Explain This feature is also Tamil-only and is the app's sole generative path: bounded government text goes to the server, output is validated, and deterministic safe text is used when the model/service is unavailable.

The optional `extension/nila-page-guide/` is a separate, manually installed Chrome Manifest V3 helper for exact official PM Vishwakarma hosts. After an explicit click it reads visible navigation labels locally, matches a goal deterministically and draws a reversible arrow. It never reads typed fields or destinations, clicks, fills, submits, or makes a network request. It is not a site-operating AI agent.

## Runtime and data flow

The same origin serves the SPA and `/api/*`. Express retains platform health/config routes and tRPC exposes `nila.explainThis`. The service directory and state/language choices are static client data and do not require an API or database. Search, selection and microphone transcript remain in browser memory; no profile, preference, or raw audio is persisted by Selvi.

## Extension path

Add state-specific catalog records only after official entry URLs, source-backed workflow/required items, safeguards, last-checked dates and every enabled language have been reviewed. State portals can change; re-check guides before public release. Additional languages require static translation review and clear system-voice/fallback disclosure; never relax the fixed-link or no-form-automation boundary.
