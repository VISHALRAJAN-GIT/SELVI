# Selvi — Tamil-first Government Service Guide

## One-line pitch

**Selvi turns confusing government-service journeys into a safe, readable, voice-supported next-step guide for first-time digital-service users.**

## Why this project stands out

- **Tamil-first accessibility:** Tamil is the primary experience, with Hindi, Bengali, Marathi, and Telugu support.
- **Real service discovery:** Users choose a State/UT, search eight carefully scoped service guides, and open official government portals directly.
- **Audio-first guidance:** Bundled Tamil narration works without depending on a device-installed Tamil browser voice. Aadhaar’s complete 11-slide guide has exact per-slide Tamil audio; all eight services have full Tamil guide narration.
- **Beginner-friendly flow:** Welcome screen → language → State/UT → search/browse → preparation → ordered action steps → safety notes → official sources.
- **Trust and safety by design:** Selvi never asks for Aadhaar numbers, OTPs, passwords, bank data, or government credentials; it does not fill or submit official forms.
- **Responsive and inclusive UI:** Desktop/mobile layouts, large controls, keyboard access, visible text alternatives, reduced-motion handling, and clear high-contrast yellow-and-black styling.
- **Evidence-backed content:** Each service includes official URLs, supporting sources, verification dates, scope notes, and honest limitations.
- **Optional extension:** A manually triggered Chrome page-pointer helper is domain-limited, deterministic, reversible, and never reads form fields or submits anything.

## Included service guides

1. Aadhaar services
2. Voter registration and electoral-roll services
3. Passport application and tracking
4. DigiLocker documents
5. Instant e-PAN
6. Tamil Nadu community certificate
7. Tamil Nadu income certificate
8. Tamil Nadu family-card/PDS services

## Engineering quality

- React + TypeScript + Vite client
- Express/tRPC server with bounded Explain This fallback
- Static, auditable service catalog with official HTTPS sources
- Automated test coverage for catalog integrity, language shape, journey parsing, audio routing, security boundaries, and extension rules
- Production and Chrome-extension build scripts
- Privacy/security documentation and continuation reports

## Verification

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm test
pnpm build
pnpm build:extension
```

Latest verified result: **34 tests passed**, TypeScript passed, production build passed, extension build passed, all Aadhaar slide audio routes passed, and `/api/health` returned `{"status":"ok"}`.

## Demo

Live preview: https://3000-id4blp1dwwod09euiylw7-bf5d6491.sg2.manus.computer

## Important scope note

Selvi is a navigation and explanation aid. Government portals remain authoritative. Users enter private information only on the official portal they choose, and should verify current requirements before submitting anything.
