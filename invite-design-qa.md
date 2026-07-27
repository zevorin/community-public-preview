# Invite page design QA

- Source visual truth: `C:\Users\a\AppData\Local\Temp\codex-clipboard-41698c3c-6b00-472c-8e04-941c79a05591.png`
- Banner before evidence: `F:\community-public-preview\qa\invite-banner-before-1680.png`
- Fixed-width banner evidence: `F:\community-public-preview\qa\invite-banner-fixed-1680.png`
- 1280 desktop evidence: `F:\community-public-preview\qa\invite-banner-fixed-1280.png`
- Rules-link evidence: `F:\community-public-preview\qa\invite-rule-link-1680.png`
- Rules-modal evidence: `F:\community-public-preview\qa\invite-rule-link-modal-check.png`
- Tested viewports: 1680 × 944, 1280 × 800, 390 × 844
- Device scale factor: 1

## Browser verification

- `/invite.html` returned HTTP 200.
- At 1680px, the page uses a centered 1280px content width.
- At 1680px, the 16:9 banner image is rendered at a fixed 1280px width with 200px outer black space on both sides.
- The banner preserves its intrinsic aspect ratio with `height: auto` and `object-fit: contain`; it is no longer enlarged to fill ultra-wide screens.
- A horizontal mask fades the outer 10% of the artwork into the black section background, with no hard vertical seam.
- At 1280px, the page has 24px safe gutters and no page-level horizontal overflow.
- At 390px, progress and statistics collapse to one column without increasing the document width.
- The daily progress value is 180 / 300 (60%); the monthly progress value is 620 / 2000 (31%). Both visual bars match those proportions.
- The rules action opens `#invite-rules-modal`.
- The “查看完整规则” action now matches the AIGC “全部模板” component structure: pill container, 34px circular arrow control, and equivalent hover/focus motion.
- The copy-link action enters `data-copy-state="copied"` and updates its accessible label to `已复制邀请链接`.
- Browser console errors: none.

## Visual review

- The main invitation headline and `SG2026` are reduced without changing their hierarchy.
- The astronaut sits immediately beside the invitation-code card and remains visually separate from its interactive content.
- The reward-panel top border is transparent, so no rule crosses beneath the “邀请奖励规则” title.
- The registration reward uses the supplied user icon without the former black add badge.
- Daily and monthly summaries now use semantic progress elements with value, track, and supporting stage counts.
- “实时更新” is plain low-emphasis status copy with no border, fill, padding, or button silhouette.
- Desktop and mobile screenshots show no clipped text, broken panel edges, or actionable overlap.

## Comparison history

- Pass 1: the hero title and invitation code competed for attention, the astronaut felt detached from the code card, the reward title sat over a visible panel rule, the registration icon carried an unwanted black add mark, and the period summaries were text-only.
- Fix: reduced display type, moved the supplied astronaut asset toward the invitation card, removed the panel top rule and add badge, introduced semantic daily/monthly progress bars, and demoted the live-update badge to plain text.
- Pass 2 (`invite-polish-comparison.png`, `invite-polish-lower-1280.png`, `invite-polish-stats-mobile.png`): no actionable P0/P1/P2 visual or interaction findings.
- Pass 3 (`invite-banner-before-1680.png`, `invite-banner-fixed-1680.png`, `invite-banner-fixed-1280.png`): constrained the banner artwork to 1280px, preserved its aspect ratio, and added black edge fades. No actionable P0/P1/P2 findings.
- Pass 4 (`invite-rule-link-1680.png`, `invite-rule-link-modal-check.png`): replaced the former secondary button with the AIGC “全部模板” action pattern and confirmed the rules modal still opens. No actionable P0/P1/P2 findings.

## Final result

final result: passed
