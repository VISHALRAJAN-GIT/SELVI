# Selvi account-switch handoff

This portable project is now **Selvi — Simple Government Service Guide**: a Tamil-first, five-language onboarding flow and a source-backed starter directory, while retaining the original PM Vishwakarma Tamil guide, Explain This flow and optional page-pointer extension.

## Current experience

1. A short animated, skippable welcome screen opens first; reduced-motion preference is respected.
2. Users choose Tamil, Hindi, Bengali, Marathi or Telugu using large native-script cards. Tamil is first by request; each option has a bundled sample greeting.
3. Users choose Tamil Nadu (prominent default choice) or search every State/UT.
4. The catalog includes eight researched guides: Aadhaar, voter registration, passport, DigiLocker and Instant e-PAN for India-wide services; Tamil Nadu community certificate, income certificate and family/PDS services for Tamil Nadu.
5. Users can search by text or use a selected-language browser microphone when supported. Speech begins only after the mic button; the transcript appears in the search field and is never sent or acted on automatically.
6. Each guide has localized goal text, preparation tips, steps, safety warnings, supporting official links, last-checked date and direct official-service link. Every guide keeps text readable if no matching device speech voice is available.
7. National guides remain available in other states; Tamil Nadu-only guides do not. Other-state users receive a clear scope message and links to the Government of India state/UT directories.
8. Tamil Nadu users with Tamil selected can still open the PM Vishwakarma eligibility walkthrough and Tamil-only Explain This flow.

## Deliverables and implementation

- Five UI/service locales: Tamil source copy plus Hindi, Bengali, Marathi and Telugu static copies. Each language choice has a static greeting MP3 under `client/public/audio/languages/`; the legacy Tamil journey/website-guide narration lives under `client/public/audio/ta/`.
- Eight curated guide records, official URLs, date and state filter: `client/src/data/serviceCatalog.ts`.
- Tamil UI/state source: `client/src/data/localeSource.ta.json`; generated static drafts: `client/src/data/localeCopy.generated.json`; reviewed language fixes: `scripts/locale-overrides.json` and `scripts/apply-locale-overrides.py`.
- Language/state onboarding: `client/src/components/nila/Onboarding.tsx`.
- Searchable service catalog and detailed guides: `client/src/components/nila/ServiceDirectory.tsx`.
- Locale metadata, Census source and localized content lookup: `client/src/lib/i18n.ts`.
- User-clicked voice helpers and transcript safety: `client/src/lib/voice.ts`.
- Main routing and existing PM/Explain journey: `client/src/pages/Home.tsx`.
- Optional local pointer helper: `extension/nila-page-guide/`.
- Service/source register and scope caveats: `docs/service-catalog.md`.

## Important truth and production caveats

- The eight entries are a researched **starter catalog**, not every central/state/municipal service and not a verified usage/popularity ranking.
- Only the five India-wide guide records are currently shown outside Tamil Nadu. State-specific guides for other states/UTs remain to be researched.
- Hindi, Bengali, Marathi and Telugu guide translations are machine-assisted drafts. Targeted fixes are applied, but a native-language public-service editor should review each translation, especially safety and official-site instructions, before public production. The linked government site remains the authoritative source.
- Browser-native speech recognition and longer read-aloud voices depend on the user's device/browser. Each language has a bundled short choice sample, but there is no bundled full-language narration for all service guides. If a voice is unavailable, users still have the full on-screen text.
- Official portals, process screens and requirements can change. The sources and steps must be re-checked before each public release.
- Selvi does not read government form values, enter credentials, click form actions, autofill, or submit applications. No Aadhaar/bank details are requested by Selvi. The optional extension remains a local deterministic arrow helper only for the official PM Vishwakarma domain.
- The project does not claim complete coverage or automated application completion; no database/accounts were added.

## Verify locally

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm test
pnpm build
pnpm build:extension
pnpm dev
```

The expanded tests include locale parity, source URL validation, all 36 states/UTs, state-specific catalog filtering, journey/scheme rules, voice path mappings, extension matcher restrictions and Explain This recovery.

When refreshing language drafts, run `python3 scripts/generate-locales.py` then `python3 scripts/apply-locale-overrides.py`. The configured LLM proxy is needed for generation. Re-review the new output rather than treating the overrides as full native-language proofreading.

## Account transfer

Managed Webdev resources, preview URLs, checkpoints and account-specific runtime configuration do not automatically transfer between Manus accounts. Initialize a new managed Web project, copy the source, retain the new account's managed configuration, run all checks, verify `/api/health` and `/manus-routes.json`, and create a new checkpoint. Do not copy secret runtime values from the old account.
