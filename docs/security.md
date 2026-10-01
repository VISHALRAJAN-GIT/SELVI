# Selvi security and trust notes

## Data minimization

The service finder is a static directory. Search terms, selected language/state, and the transcript produced by optional browser speech recognition stay in the browser; Selvi does not send them to a search API or save them. No account/database persistence is needed. The retained PM Vishwakarma eligibility questions stay in client memory and ask only age, state, contextual income band and occupation/trade. Selvi does not ask for Aadhaar numbers, bank details, passwords, OTPs or government-service credentials.

Explain This is separate: only when the user submits a pasted passage does that bounded text go to the server-side explanation procedure. It is not persisted by Selvi. Server validation, prompt-injection treatment and deterministic fallback are described in `docs/architecture.md` and `server/services/nila.ts`.

## Speech and audio

Each language option has a static, bundled greeting that plays only after a user presses its speaker button. The longer guide narration is bundled for Tamil; other languages use browser speech only when a matching device voice is available. Missing voice support is shown visibly, with on-screen text retained as the fallback.

Microphone recognition is optional and begins only after a user presses the catalog mic button and grants the browser's permission. The mic is used to fill the visible search box; Selvi does not auto-select a service. Speech recognition is a browser/device-provided API that may have provider-specific processing and privacy terms. Selvi's server does not receive or store a raw recording or voice transcript. The voice button is disabled if the browser cannot offer this feature; text search and buttons remain.

## Official-service guides and translation

Guide data is static, code-curated content with fixed HTTPS official URLs and supporting official sources. Hindi, Bengali, Marathi and Telugu are machine-assisted draft translations of Tamil source copy with targeted corrections; they are not official or native-reviewed translations. UI copy tells users that the official linked portal is authoritative. Native-language public-service editing is required before production distribution.

Selvi does not read live government pages, inspect form fields, read link destinations to operate them, enter data, autofill, click portal controls or submit an application. Users enter private details only on the official service site they chose to open. The catalog is an eight-guide starter set, not exhaustive and not a validated usage ranking. Tamil Nadu-specific guides are shown only for Tamil Nadu; other locations receive national guides and official state/UT discovery links.

## Optional PM Vishwakarma page-pointer extension

The optional Chrome MV3 helper is manually installed and user-clicked. It requests only `activeTab` and `scripting`, checks HTTPS plus an exact PM Vishwakarma host, reads only visible anchor/button labels in the active tab, and locally draws a dismissible arrow for one matching action. It has no persistent host permission, storage, network access, cookies or API keys; it never reads user-entered values, clicks, fills or submits. It is a deterministic label matcher, not an AI agent.

## Existing Explain This path

The managed LLM call is server-side only. Pasted text is untrusted, output is bounded and validated, and URLs/eligibility claims are not generated. When the call is missing or fails, Selvi shows a deterministic Tamil safety fallback and makes clear if it is not an explanation of the user's exact text. Browser-side API credentials are not used.

## Verification and release

Government pages and procedures change. Re-check service entry links, steps, required items, safety notes and contact details before each public release. Test voice permissions and playback on supported mobile devices. Review every non-Tamil translation with native-language public-service editors and test with people unfamiliar with websites. Never describe the guide as official, complete, or able to guarantee eligibility or approval.
