# Selvi design direction

## Theme name

**Guiding warmth** — a calm, warm, dignified interface that feels like a trusted person sitting beside the user, not a government portal asking her to decode technology.

## Design movement

Soft editorial utility: generous whitespace, quiet paper-like surfaces, deep readable ink, and a single warm action color. The interface feels human and composed, while every screen still has one obvious next step.

## Core principles

1. **The next action is unmistakable.** The microphone, choice buttons, and official link are visually dominant at the moment they are useful.
2. **Language is the interface.** Tamil copy leads. English only appears for unavoidable official source labels or evaluator context.
3. **No shame states.** Errors explain what happened and offer a calm way forward without blaming the user.
4. **Trust is visible.** Verified source, privacy boundaries, and the “this is guidance, not approval” note are part of the experience.
5. **Voice with a reliable fallback.** Audio is celebrated, but every important answer is always visible as text.

## Color philosophy

- **Ink / midnight indigo:** high-contrast Tamil text and a stable, trustworthy anchor.
- **Paper / warm ivory:** soft background that reduces the visual harshness of a form.
- **Coral terracotta:** one warm, confident action color for the hero voice control and primary CTA.
- **Quiet teal:** success, verification, and completed steps.
- **Apricot wash:** low-intensity supportive highlights and gentle state backgrounds.

## Layout paradigm

Mobile-first single-column flow with a centered reading measure. On wide screens, a two-column composition pairs a small story/benefit panel with the main journey card; the main task remains the largest surface. No permanent navigation drawer.

## Signature elements

- A large circular microphone button with a subtle ripple only while listening.
- A thin “படி X / 5” progress rail with a filled coral segment.
- Rounded cards with a slightly irregular paper edge suggestion through borders, not shadows.
- A small verification seal next to official-source details.
- Short Tamil prompts paired with a tiny optional English eyebrow for evaluators, never as required instructions.

## Interaction philosophy

Every interaction should be recoverable. Back, repeat, start over, and text fallback are always nearby. Choice buttons are large and sentence-like. Focus is visible and keyboard order follows the visual order. Audio responses can be replayed without advancing the journey.

## Animation

Use short ease-out transitions for cards and progress changes. Listening has a gentle breathing/ripple animation. Honor `prefers-reduced-motion` by removing transforms, ripples, and animated transitions.

## Typography system

Use a Tamil-capable system stack with Noto Sans Tamil first when available, followed by Latha, Nirmala UI, and sans-serif. Large prompts use a comfortable 1.2–1.35 line-height; supporting copy uses 1.65–1.75 to help readers who are not used to screens.

## Brand essence

Selvi is the calm guide that turns a confusing official journey into a few understandable next steps.

## Brand voice

Warm, respectful, direct, never patronizing. Prefer “நாம் இப்போது இதைப் பார்ப்போம்” and “மீண்டும் முயற்சி செய்யலாம்” over bureaucratic or technical wording.

## Wordmark and logo

The Selvi mark is a simple coral voice-wave flower/lamp: three filled petals rise from a single base, suggesting a voice becoming a guiding light. It has a bold silhouette, ample negative space, no gradients, and no embedded text. The same mark appears in the header, favicon, and project icon.

## Signature brand color

Terracotta coral `#E66E5C` on warm paper `#FCF8F3`, supported by midnight ink `#1F2942` and teal `#2D8B82`.


## Novice-first service finder extension (2026-10-01)

Keep the accepted **Guiding warmth** direction. The opening sequence adds a small, reassuring welcome animation, then large native-language choice tiles, then a Tamil Nadu-first state choice. This should feel like a patient guide greeting someone at the door, not an app dashboard. The user must always be able to skip motion, read instead of listen, and return to the previous choice. No audio plays before a deliberate tap.

The service catalog uses one clear goal per generous card, familiar verbs, large tap targets, and a single official-site action. National and Tamil Nadu coverage are explicitly labeled; a visible note says the starter catalog is not exhaustive. A warm coral “next step” and teal “verified source” badge remain, with no childlike illustrations, dense menus, or technical jargon. Translated explanations keep the same safety caveats and official labels, and never imply that a Selvi translation is itself government-issued.