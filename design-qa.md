# 登录弹窗布局平衡设计 QA

- Source visual truth: `/var/folders/9w/xc7wj1z55s7bbr2kvqrmvdbw0000gn/T/codex-clipboard-c11dd5a4-024d-4bde-bdf9-2b50a3cdf1d3.png`
- Saved source copy: `artifacts/login-modal-balance-reference.png`
- Implementation screenshot: `artifacts/login-modal-balance-full-v18.png`
- Combined comparison: `artifacts/login-modal-balance-comparison-v18.png`
- Comparison page: `artifacts/login-modal-balance-comparison-v18.html`
- Viewport: `1280 × 720` CSS px
- Source pixels: `1808 × 1014`
- Implementation pixels: `1280 × 720`
- Combined comparison pixels: `1280 × 720`
- Density normalization: both images were proportionally fitted in the same side-by-side comparison surface; the implementation screenshot is stored at one screenshot pixel per CSS pixel.
- State: 首页登录弹窗打开，ReactBits Galaxy 背景运行，左右登录区域和宇航员可见。

## Full-view comparison evidence

The combined comparison confirms the three annotated changes: the green helper block beneath the QR code is absent; the left form group and right QR card have matching visual heights; and both title/subtitle groups are centered above their corresponding content regions.

## Focused comparison evidence

A separate focused crop was not required because the supplied annotation and the implementation both show the complete modal at a readable size. Browser geometry measurements provide the precision check: the left login form and right QR card both render at `236.2433px` after modal scaling, with a top-edge difference of only `0.0651px`.

## Required fidelity surfaces

- Fonts and typography: both heading groups keep the existing font family, weights, sizes, and gold emphasis while changing only the requested alignment to centered.
- Spacing and layout rhythm: the left form and right QR card are both `312px` high before the modal scale. Their top and bottom edges align visually, and the removed helper no longer adds extra weight below the QR code.
- Colors and visual tokens: the black space treatment, muted borders, white text, and gold accents remain unchanged.
- Image quality and asset fidelity: the existing QR, planet background, astronaut, and thin L-shaped corner assets remain sharp and correctly positioned.
- Copy and content: the phone and QR titles/subtitles remain intact. The `打开微信 / 首页右上角扫码登录` helper copy was removed exactly as annotated.

## Findings

- No actionable P0, P1, or P2 differences remain.
- [P3] The right card is `12px` narrower than the left form because the request specified equal height rather than equal width. This preserves the QR spacing and astronaut clearance.

## Comparison history

1. Annotated-layout pass
   - Earlier findings: the QR helper created an extra lower block, the QR card was `430px` high while the left form was `312px`, and both heading groups were left-aligned.
   - Fixes: removed the helper markup and styles, reduced the QR card to `312px`, aligned its top with the form, vertically recentered the QR/corners, and centered both title/subtitle groups.
   - Post-fix evidence: `artifacts/login-modal-balance-comparison-v18.png`.

## Interaction and runtime checks

- The modal close control hides the modal successfully.
- The header login action reopens the modal successfully.
- Browser console errors checked: none from the page.
- The verification-code button and existing login behavior were not changed.

## Follow-up polish

- If a later direction asks for identical widths as well, the QR card can be increased from `360px` to `372px` without changing the current height balance.

final result: passed

---

# 活动中心编辑式舞台重设计 QA

- Source visual truth: `/Users/opera/Downloads/f0954c82f3b769486b5246f28e54fb48fb0f318092ae5d-1AxJ4h_fw1200.png`
- Implementation screenshots:
  - `qa/activity-center-v1/implementation-hero-1280x900.png`
  - `qa/activity-center-v1/implementation-live-section-1440x1000.png`
  - `qa/activity-center-v1/implementation-history-1440x1000.png`
- Full-view comparison: `qa/activity-center-v1/comparison-reference-left-implementation-right.png`
- Focused card comparison: `qa/activity-center-v1/comparison-focused-cards.png`
- CSS viewports checked: `1280 × 900` and `1440 × 1000`
- Source pixels: `1200 × 5851`
- Implementation capture pixels: `1280 × 879` and `1440 × 879`
- Density normalization: the source hero was proportionally scaled to `1280px` wide and cropped to the same hero state before both sides were reduced to `640 × 450` in the comparison. Focused card crops were proportionally fitted to equal-width `640px` panels.
- State: default desktop page, all five current activities visible; separate interaction pass with the “成长任务” filter selected.

## Full-view comparison evidence

The combined hero comparison confirms the intended style transfer without copying the reference product: both use a near-black canvas, oversized high-contrast display type, a warm accent line, a vertically arched hero image, small orbital annotations, generous negative space, and a compact metric rail. The existing site navigation remains unchanged, as required.

## Focused comparison evidence

The focused card comparison confirms the same editorial rhythm carries into the content area: small gold overlines, centered section framing, media-led cards, restrained borders, compact pills, rounded image stages, and varied card proportions. The implementation maps those patterns to real activity metadata and routes rather than reproducing the NFT content.

## Required fidelity surfaces

- Fonts and typography: the existing Montserrat display asset drives large English/numeric and Chinese fallback headings; weights, line height, and negative tracking reproduce the reference’s dense editorial hierarchy without losing Chinese readability.
- Spacing and layout rhythm: the hero uses a two-column stage with large negative space; the current-activity area follows a `12`-column composition (`8 + 4`, then `4 + 4 + 4`); archive rows use a compact horizontal rhythm. No horizontal overflow exists at either checked width.
- Colors and visual tokens: background `#05070B`, warm gold `#F4C95D`, growth lime `#D9FF8C`, mint status `#66E2CF`, warm-white text, surface opacity, borders, radii, and shadows map directly to `UIguide.html`.
- Image quality and asset fidelity: all imagery comes from existing project assets, keeps correct aspect filling, has no missing sources, and remains sharp in both hero and card crops. Remix Icon assets are used for arrows and decorative shining marks; no placeholder icons or fake image art are present.
- Copy and content: all five current activities, rewards, dates, archive entries, routes, and hidden configuration schema remain represented. The new copy is concise and consistent with the community/product voice.
- Interactions and states: category buttons expose `aria-pressed`, selected and hover states are visible, reduced-motion is respected, and the primary anchors scroll to current activities and the archive.

## Findings

- No actionable P0, P1, or P2 differences remain.
- [P3] The reference uses warmer orange image accents while the implementation favors the product’s lime/gold tokens. This is intentional because the brief prioritizes `UIguide.html` theme colors over a literal palette clone.

## Comparison history

1. Initial implementation pass
   - Earlier finding: intrinsic image sizing expanded the first activity row to about `817px` and left the second row with an uneven `4 + 6` composition.
   - Fixes: set explicit `520px` first-row heights, changed the second row to `4 + 4 + 4`, and set all second-row cards to `330px`.
   - Post-fix evidence: browser geometry reports `520px` for the first two cards and `330px` for the remaining three; `qa/activity-center-v1/implementation-live-section-1440x1000.png` shows the corrected grid.

## Interaction and runtime checks

- “成长任务” filter selected successfully: exactly two growth cards remain visible, the other three are removed from layout, and `aria-pressed` updates correctly.
- Primary in-page links move to the live-activity and archive sections.
- Missing image check: none.
- Browser console errors and warnings checked: none.
- Horizontal overflow: none at `1280 × 900` and `1440 × 1000`.
- Navigation markup and content remain unchanged.

## Follow-up polish

- The retained desktop-only project shell still has a minimum page width of `1280px`; a separate mobile layout would require a product-level responsive pass outside this brief.

final result: passed

---

# 邀请页圆角输入框与奖励卡片设计 QA

- Source visual truth: `artifacts/invite-pill-controls-reference.png`
- Implementation screenshot: `artifacts/invite-unified-controls-implementation.png`
- Combined comparison: `artifacts/invite-pill-controls-comparison.png`
- Viewport: `1280 × 720` CSS px
- Source pixels: `1434 × 984`
- Implementation pixels: `1280 × 720`
- Density normalization: the annotated source was scaled to `720px` high and placed beside the browser capture. The source is a focused annotated crop rather than the full page, so comparison focuses on the named controls and section boundaries.
- State: invitation page, inviter form empty, copy control idle, reward rules visible.

## Full-view comparison evidence

The browser capture confirms the green invitation kicker is removed, the invitation card remains balanced against the simplified left copy block, and both right-side control rows now share the same geometry and text styling.

## Focused comparison evidence

A separate crop was not required because the supplied annotation already enlarges the two control rows, while the implementation capture keeps both rows readable. Browser measurements confirm both outer controls use a `999px` radius and `46px` height. The invitation card is `410 × 340.16px`; the left copy block is `307.05px` high.

## Required fidelity surfaces

- Fonts and typography: existing invitation-page type hierarchy is preserved; the input adopts the comment composer’s lighter `13px` text treatment.
- Spacing and layout rhythm: the card height is reduced by about `32px`; both control rows share the same pill container padding and radius.
- Colors and visual tokens: the comment composer’s dark translucent surface and subtle warm border are reused; primary and secondary button semantics remain distinct.
- Image quality and asset fidelity: `assets/invite/inviteBG.png`, the supplied astronaut, and the reverse brand Logo render sharply at their intended scale.
- Copy and content: the copy action is shortened to `复制`; the bound state is shortened to the single-line `已绑定`.

## Findings

- No actionable P0, P1, or P2 differences remain.
- [P3] The astronaut’s transparent source canvas makes its measured `435.2px` width larger than its visible body; visually it remains balanced with the reduced card.

## Comparison history

1. First implementation pass
   - Earlier finding: the inviter input retained an inner rectangular border, so it did not visually match the pill-shaped copy field.
   - Fix: removed the input’s own border, background, and shadow with a scoped override so the shared outer pill is the only visible field surface.
   - Post-fix evidence: `artifacts/invite-pill-controls-implementation.png`.

2. Borderless-rules and asset pass
   - Request: switch to `inviteBG.png`, enlarge the astronaut, remove all reward-rule borders, shorten the copy label, and keep the bound label on one line.
   - Fixes: replaced the background asset, increased the astronaut resource frame to `435.2px`, removed panel/card/badge borders, changed the copy label to `复制`, and changed the success label to `已绑定`.
   - Post-fix evidence: `artifacts/invite-bg-borderless-implementation.png`.

3. Unified-control pass
   - Request: remove the green invitation kicker, unify the inviter and copy controls, add top breathing room, and remove the inviter divider.
   - Fixes: removed the kicker markup, standardized both controls to `360 × 46px`, standardized both buttons to `72 × 34px`, matched field text at `13px / 300`, increased the card’s top padding, and removed the divider.
   - Post-fix evidence: `artifacts/invite-unified-controls-implementation.png`.

## Interaction and runtime checks

- Binding `ABCD1234` enters the bound state, locks the input, and displays success feedback.
- The bound button remains `34px` high and displays the single-line label `已绑定`.
- Copy-link action enters the copied state.
- Browser console errors checked: none.
- No horizontal overflow at `1280 × 720`.

## Follow-up polish

- No required follow-up.

final result: passed

---

# 活动中心两段式列表简化 QA

- Source visual truth: `/Users/opera/Downloads/f0954c82f3b769486b5246f28e54fb48fb0f318092ae5d-1AxJ4h_fw1200.png`
- Implementation screenshots:
  - `qa/activity-center-v1/implementation-simple-1280x900.png`
  - `qa/activity-center-v1/implementation-simple-1440x1000.png`
  - `qa/activity-center-v1/implementation-simple-history-1440x1000.png`
- Combined comparison: `qa/activity-center-v1/comparison-simple-cards.png`
- CSS viewports checked: `1280 × 900` and `1440 × 1000`
- Source pixels: `1200 × 5851`
- Implementation capture pixels: `1280 × 879` and `1440 × 879`
- Density normalization: the reference collection crop and implementation viewport were proportionally fitted into equal-width `640px` comparison panels.
- State: five current activities shown in a three-column grid, followed by two past activities in the same grid language.

## Full-view comparison evidence

The current implementation contains exactly the two requested sections: `正在进行` and `往期回顾`. The first section contains five equal cards arranged `3 + 2`; the second contains two equal cards. No hero, summary, filter, featured treatment, marquee, archive list, or closing CTA remains.

## Focused comparison evidence

The combined card comparison confirms the retained style cues from the reference: near-black background, media-led cards, rounded corners, restrained warm-gold accents, compact status pills, clear titles, and generous inter-card spacing. All current cards use identical dimensions and hierarchy.

## Required fidelity surfaces

- Fonts and typography: both section titles use the same display treatment; all card titles, metadata, descriptions, and rewards use identical sizes and weights across the seven cards.
- Spacing and layout rhythm: at `1440px`, current cards measure approximately `414.7 × 498px`; at `1280px`, all five measure `399 × 476px`. Row tops confirm a `3 + 2` layout, and the two past cards share the same column geometry.
- Colors and visual tokens: the page continues to use `UIguide.html` background, warm-white text, gold metadata, lime rewards, mint live status, line opacity, `16px` radius, and card shadow tokens.
- Image quality and asset fidelity: all seven cards use existing project artwork with consistent media frames and object-fit behavior; no sources are missing.
- Copy and content: exactly five current activities and two past activities remain, with their existing destinations, descriptions, dates, and reward summaries.

## Findings

- No actionable P0, P1, or P2 differences remain.
- No follow-up polish is required for the requested structure.

## Comparison history

1. Simplification pass
   - Earlier state: the page included a hero, main-event hierarchy, statistics, filters, marquee, mixed card sizes, archive rows, and a closing CTA.
   - Fixes: removed every extra section and interaction, replaced mixed layouts with one equal-card component, and enforced a three-column grid.
   - Post-fix evidence: browser geometry reports `5` current cards and `2` past cards; all current cards share equal width and height, with row tops `218, 218, 218, 716, 716` at the `1280px` viewport.

## Interaction and runtime checks

- All seven cards remain complete links to their existing destinations.
- Current activity count: `5`.
- Past activity count: `2`.
- Missing image check: none.
- Browser console errors and warnings checked: none.
- Horizontal overflow: none at `1280 × 900` and `1440 × 1000`.
- Navigation markup and content remain unchanged from the repository baseline.

final result: passed

---

# 活动中心 100px 顶部 Banner QA

- Source visual truth: `/Users/opera/Downloads/f0954c82f3b769486b5246f28e54fb48fb0f318092ae5d-1AxJ4h_fw1200.png`
- Implementation screenshots:
  - `qa/activity-center-v1/implementation-banner-1280x900.png`
  - `qa/activity-center-v1/implementation-banner-1440x1000.png`
- Combined comparison: `qa/activity-center-v1/comparison-banner.png`
- CSS viewports checked: `1280 × 900` and `1440 × 1000`
- State: default activity-center page with the new banner above the unchanged two-section activity list.

## Full-view comparison evidence

The new banner is the first content surface below navigation and measures exactly `100px` high at both checked desktop widths. It gives the page a stronger entry point without reintroducing a hero section or changing the three-column activity hierarchy.

## Focused comparison evidence

The combined comparison confirms that the banner carries the source’s near-black atmosphere, restrained warm accent, small editorial metadata, rounded framing, and image-led depth. The live badge remains compact and secondary to the `活动中心` title.

## Required fidelity surfaces

- Fonts and typography: the banner title uses the existing display family at `28px`; supporting copy remains a quiet `11px`, and the live label uses compact uppercase numerals.
- Spacing and layout rhythm: banner height is exactly `100px`; internal content is vertically centered with `30px` horizontal padding. The following section retains its existing title and three-column grid.
- Colors and visual tokens: warm-white title, gold image warmth, lime live label, mint status dot, subtle UI-guide border, and dark translucent surface are preserved.
- Image quality and asset fidelity: the banner uses the existing `assets/image_assets/29.webp` artwork with cover cropping and no missing source.
- Copy and content: the banner contains only the page identity, one short description, and the current live count; no button or additional content section was introduced.

## Findings

- No actionable P0, P1, or P2 differences remain.

## Interaction and runtime checks

- Banner geometry at `1440px`: `1280 × 100px`.
- Banner geometry at `1280px`: `1232 × 100px`.
- Five current cards and two past cards remain present.
- Missing image check: none.
- Browser console errors and warnings checked: none.
- Horizontal overflow: none at both checked widths.
- Navigation markup and content remain unchanged from the repository baseline.

final result: passed
