
## Exact Tamil Aadhaar slide audio and yellow-black theme

The visible Aadhaar guide was checked as an 11-slide sequence. Each preparation, action, and safety sentence now maps to its own generated Tamil WAV file, including the first visible sentence: `பதிவிறக்கத்திற்கு Aadhaar எண், Enrollment எண் அல்லது VID இவற்றில் ஒன்று.` The guide uses the exact slide clip when available and retains the generated full-service Tamil narration button for other service guides.

The entire interface was changed to a high-contrast yellow-and-black palette: pale yellow background/surfaces, black text and controls, bright yellow primary accents, and soft yellow information surfaces. The site, extension popup, overlay, SVG/PNG icon, focus states, and responsive controls use the same system.

Validation: theme verifier passed, TypeScript check passed, all 34 tests passed, production and extension builds passed, all 11 Aadhaar WAV routes returned successfully, and `/api/health` returned `{"status":"ok"}`.
