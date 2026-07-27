# Invite page design QA

- Source visual truth: `C:\Users\a\AppData\Local\Temp\codex-clipboard-41698c3c-6b00-472c-8e04-941c79a05591.png`
- Full-page desktop evidence: `F:\community-public-preview\qa\invite-polish-top-1680.png`
- Source comparison: `F:\community-public-preview\qa\invite-polish-comparison.png`
- Lower-section desktop evidence: `F:\community-public-preview\qa\invite-polish-lower-1280.png`
- Mobile statistics evidence: `F:\community-public-preview\qa\invite-polish-stats-mobile.png`
- Tested viewports: 1680 × 944, 1280 × 800, 390 × 844
- Device scale factor: 1

## Browser verification

- `/invite.html` returned HTTP 200.
- At 1680px, the page uses a centered 1280px content width.
- At 1280px, the page has 24px safe gutters and no page-level horizontal overflow.
- At 390px, progress and statistics collapse to one column without increasing the document width.
- The daily progress value is 180 / 300 (60%); the monthly progress value is 620 / 2000 (31%). Both visual bars match those proportions.
- The rules action opens `#invite-rules-modal`.
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

## Final result

final result: passed
