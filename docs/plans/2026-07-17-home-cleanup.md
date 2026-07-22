# Homepage Cleanup Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove confirmed redundant homepage code and files that are not referenced anywhere in the site without breaking other pages or homepage interactions.

**Architecture:** Build a whole-project reference inventory before deleting assets, because several files are shared across pages. Limit code cleanup to exact duplicate or unreachable homepage rules, then validate the homepage in its default, scrolled, carousel, and expanded-composer states.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, GSAP, local image/video/font/SVG assets.

---

### Task 1: Build the reference inventory

**Files:**
- Inspect: `index.html`
- Inspect: `style.css`
- Inspect: `walkthrough.js`
- Inspect: all project `.html`, `.css`, `.js`, `.json`, and `.md` files
- Inspect: `assets/**`, `resources/**`, and `vendor/**`

**Step 1:** Enumerate every asset and every textual reference to it.

**Step 2:** Separate confirmed whole-project orphans from homepage-only unused files.

**Step 3:** Record missing references separately so they are not mistaken for deletable assets.

### Task 2: Remove confirmed unused artifacts

**Files:**
- Delete: macOS `.DS_Store` files
- Delete: generated `.codex-qa/**` artifacts
- Delete: media and icons with zero references across the project

**Step 1:** Delete only assets with no exact reference in any runtime or manifest file.

**Step 2:** Re-run the reference inventory and confirm no deleted path remains referenced.

### Task 3: Clean redundant homepage code

**Files:**
- Modify: `index.html`
- Modify: `style.css`
- Modify: `walkthrough.js`

**Step 1:** Remove unreachable homepage markup and exact duplicate CSS declarations only.

**Step 2:** Replace any homepage references to missing media with existing equivalent assets when the intended asset is unambiguous.

**Step 3:** Run JavaScript syntax validation and check the remaining homepage resource graph.

### Task 4: Validate the homepage

**Files:**
- Test: `index.html`
- Test: `style.css`
- Test: `walkthrough.js`

**Step 1:** Load the homepage and check console/resource errors.

**Step 2:** Verify the hero, floating navigation, featured carousel, masonry cards, video ad card, tabs, and expanded inspiration composer.

**Step 3:** Confirm deleted files are no longer requested and all visible media loads successfully.
