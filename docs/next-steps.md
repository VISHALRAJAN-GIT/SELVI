# Next steps after account switch

The MVP is complete for the event scope. Resume from `HANDOFF.md`.

## Before a checkpoint

Run `pnpm check`, `pnpm test`, and `pnpm build`. Start `pnpm dev`, then confirm `/api/health` and `/manus-routes.json`.

## Before a public release

Re-verify PM Vishwakarma facts and the official URL, review Tamil copy with a native speaker, test the journey on a small phone, and add the managed speech-upload enhancement if native browser speech support is not sufficient for the intended audience.

## Do not change casually

Keep eligibility deterministic, keep official URLs controlled by the curated dataset, keep AI calls server-side, and do not add Aadhaar/bank collection fields to the prototype. The user should always be able to complete the journey with text and large choices even when voice or AI services are unavailable.
