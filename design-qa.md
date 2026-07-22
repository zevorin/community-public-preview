# Design QA — 闪念右栏活动 Banner 与分层入场

- Source visual truth: `/var/folders/9w/xc7wj1z55s7bbr2kvqrmvdbw0000gn/T/codex-clipboard-4b6b35cb-417f-4b4a-9c8a-c10e74d78e87.png`
- Source focused crop: `/Users/opera/Documents/community-public-preview/flash-banner-reference-crop.png`
- Implementation screenshot: `/Users/opera/Documents/community-public-preview/flash-banner-implementation.png`
- Implementation focused crop: `/Users/opera/Documents/community-public-preview/flash-banner-focused.png`
- Side-by-side comparison: `/Users/opera/Documents/community-public-preview/flash-banner-design-comparison.png`
- Desktop capture: 1440 × 956 px, CSS pixel density 1×
- Focused source: 710 × 191 px; focused implementation: 380 × 174 px
- Comparison normalization: both focused regions normalized to 191 px height without changing aspect ratio
- State: dark theme, page-load animations settled, right rail at top of timeline

## Full-view comparison evidence

The browser-rendered 1440 px desktop view keeps the campaign directly below the quick-publish card and above the curated list. The right rail remains vertically balanced, the feed retains its original width, and no horizontal overflow is present. At 390 px the rail collapses to one 362 px column and the campaign measures 362 × 166 px without overflow.

## Focused region comparison evidence

The side-by-side image compares the supplied banner crop with the implemented campaign. Both use a dark cinematic space image, a gold outlined category badge, a strong white headline, muted supporting copy, and a gold text CTA with a right-arrow icon. The implementation intentionally uses a taller ratio because it occupies the existing 380 px sidebar rather than the much wider source frame; hierarchy, crop direction and tone remain consistent after this responsive adaptation.

## Required fidelity surfaces

- Fonts and typography: headline weight, three-level copy hierarchy and compact gold label match the reference's visual emphasis; wrapping stays controlled in the narrower rail.
- Spacing and layout rhythm: 20–22 px internal padding, 18 px radius and vertical gaps reproduce the source's compact campaign rhythm while fitting the existing sidebar.
- Colors and tokens: warm gold, near-black surface and muted cream copy align with both the reference and the existing flash-page token system.
- Image quality and asset fidelity: uses the existing high-resolution `model-banner-ringed-planet-v1.webp` asset with a responsive crop; no placeholder, CSS illustration or generated substitute is used.
- Copy and content: campaign message follows the reference and remains coherent as a direct activity-center entry.
- Icons and accessibility: the CTA uses the local Remix Icon `arrow-right-line.svg`; the campaign has a descriptive accessible label and all images load successfully.

## Findings

No actionable P0, P1 or P2 differences remain. The wider source ratio cannot be reproduced literally inside the current 380 px sidebar without either making the text too small or cropping the artwork excessively; the taller adaptation preserves the intended composition and readability.

## Comparison history

- Pass 1: the overall layout and image treatment matched, but the initial arrow filename did not exist and rendered as a broken asset. Classified P2 and replaced with the available local `arrow-right-line.svg`.
- Pass 2: focused comparison confirmed the corrected icon, image crop, typography and hierarchy. No actionable P0/P1/P2 findings remained.

## Primary interactions and console

- Campaign destination verified as `./activity-center.html` with accessible label `参加 AI 生图创作挑战`.
- Navigation, six posts and all three right-rail modules render without horizontal overflow.
- Entry animation names verified on header, post cards, post contents and right-rail cards.
- Reduced-motion stylesheet disables all new staged animations and campaign transitions.
- All three videos remain muted, paused and without autoplay.
- Browser console: no page errors.

## Implementation checklist

- [x] Remove the tutorial module.
- [x] Insert the campaign immediately below quick publish.
- [x] Use a real local image and local SVG icon.
- [x] Add staggered, lightly springy entry motion.
- [x] Preserve reduced-motion behavior.
- [x] Verify desktop and mobile overflow, imagery and console state.

final result: passed
