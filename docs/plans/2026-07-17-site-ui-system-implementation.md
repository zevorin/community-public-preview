# Site UI System Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Derive a reusable UI design system from the homepage and apply it consistently to every other public page.

**Architecture:** Keep the existing static HTML information architecture and behavior. Add a final shared design-system layer to `style.css`, normalize header markup across HTML pages, and use a small set of page-specific compatibility rules where existing components cannot inherit safely.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, Remix Icon SVG assets, local browser visual regression.

---

### Task 1: Document the UI system

**Files:**
- Create: `docs/ui-design-system.md`

**Step 1:** Record color, typography, spacing, radius, shadow and motion tokens.

**Step 2:** Record navigation, button, Tab, form, selector, card and responsive rules.

**Step 3:** Review the document against the current homepage.

Expected: every shared component has measurable values and state rules.

### Task 2: Normalize global headers

**Files:**
- Modify: all top-level `*.html` files except `index.html`

**Step 1:** Replace split logo markup with `assets/brand/LOGO.svg`.

**Step 2:** Add the homepage Remix Icon set to primary navigation links.

**Step 3:** Normalize activity, invite, store, notification, points and avatar actions.

**Step 4:** Preserve page-specific active navigation state.

Expected: every page exposes the same header component structure and action count.

### Task 3: Add the shared CSS component layer

**Files:**
- Modify: `style.css`

**Step 1:** Add `--ds-*` design tokens.

**Step 2:** Implement non-home header, primary navigation and account capsule rules.

**Step 3:** Implement shared primary, secondary and text buttons.

**Step 4:** Implement shared Tab systems for experience, model filter, message and detail tabs.

**Step 5:** Implement shared form, selector, card, modal and focus states.

**Step 6:** Add responsive and reduced-motion rules.

Expected: representative components on every page inherit the homepage visual language without breaking layout.

### Task 4: Add compatibility fixes

**Files:**
- Modify: `style.css`
- Modify only affected top-level HTML files when CSS cannot safely normalize the structure.

**Step 1:** Audit AIGC, model, flash, tutorial, activity, store and user pages.

**Step 2:** Add narrowly scoped compatibility rules.

**Step 3:** Remove new duplicate or obsolete rules introduced during migration.

Expected: no component relies on conflicting widths, borders or active-state styles.

### Task 5: Verify all pages

**Files:**
- Test: all top-level `*.html` pages

**Step 1:** Validate HTML resource references and JavaScript syntax.

**Step 2:** Open representative desktop pages at the local preview URL.

**Step 3:** Check header, tabs, buttons, forms and cards visually.

**Step 4:** Check 1366px and 1920px layouts.

**Step 5:** Confirm no console errors and no automatically opened modal/detail state.

Expected: the site is visually coherent, usable and free of new runtime errors.
