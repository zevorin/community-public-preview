# Design System Convergence Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Consolidate repeated neutral colors, typography, spacing, control sizing, motion, elevation, layering, breakpoints, and provably duplicate CSS without changing product behavior.

**Architecture:** Extend `design-tokens.css` as the only shared token source, then migrate repeated values in the existing page styles to semantic references. Preserve page-specific artwork, hero treatments, responsive intent, and cascade-dependent overrides; delete only exact duplicate rules inside the same at-rule context.

**Tech Stack:** Static HTML, CSS custom properties, vanilla JavaScript, local browser verification.

---

### Task 1: Capture the baseline

**Files:**
- Inspect: `design-tokens.css`
- Inspect: `style.css`
- Inspect: `invite.css`
- Inspect: remaining root CSS files

**Steps:**

1. Inventory repeated neutral alpha values, typography, spacing, control heights, durations, shadows, z-index values, breakpoints, and selector blocks.
2. Record representative computed styles for Home, Activity Center, Member Store, Invite, Message Center, and Login.
3. Verify the current CSS is balanced and `git diff --check` passes.

### Task 2: Extend the shared token system

**Files:**
- Modify: `design-tokens.css`
- Modify: `UIguide.html`

**Steps:**

1. Add constrained neutral opacity scales for white, paper, and black.
2. Add a shared type scale, five font weights, and five line-height roles.
3. Add a 4px spacing scale and four control-height roles.
4. Add missing motion, focus-ring, elevation, and global-layer tokens.
5. Update the UI guide to display and consume the new token groups.

### Task 3: Migrate repeated values

**Files:**
- Modify: `style.css`
- Modify: `activity-center.css`
- Modify: `invite.css`
- Modify: `member-store.css`
- Modify: `message-center.css`
- Modify: `secondary-pages.css`
- Modify: `ui-theme.css`

**Steps:**

1. Quantize repeated neutral alpha values to the shared scale.
2. Map common font sizes, numeric weights, and unitless line heights to type tokens.
3. Map spacing declarations to the 4px scale while preserving explicit optical 1–2px adjustments.
4. Apply control-height tokens only to selectors with control semantics.
5. Normalize common transition and animation durations while preserving one-off authored hero timing.
6. Replace repeated shadow and focus-ring declarations with shared tokens.
7. Normalize near-identical responsive breakpoints without merging different layout intents.

### Task 4: Remove safe duplicate CSS

**Files:**
- Modify: root CSS files containing exact duplicate rules

**Steps:**

1. Parse rules with their `@media`, `@supports`, and container context.
2. Remove only selector-and-body duplicates occurring in the same context.
3. Leave cascade-dependent partial overrides in place.
4. Re-run the unused custom-property and balanced-brace checks.

### Task 5: Verify the result

**Files:**
- Verify: all root HTML pages and CSS files

**Steps:**

1. Run `git diff --check`, CSS balance, variable-cycle, unused-variable, and raw-value inventories.
2. Run the Impeccable detector once after the final edits.
3. Inspect Home, Activity Center, Member Store, Invite, Message Center, and Login in the browser.
4. Compare representative computed typography, spacing, control heights, colors, and page visibility.
5. Review the final diff and preserve unrelated user asset changes.
