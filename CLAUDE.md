# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal portfolio site served by GitHub Pages from `main`. Plain static HTML/CSS/JS — no build step, package manager, linter, or tests. Pushing to `main` deploys.

Preview locally with any static server, e.g. `python3 -m http.server 8000`, then open http://localhost:8000.

## Structure

Three files: `index.html` (all content), `styles.css`, `script.js`.

- **Cache busting:** `index.html` references `styles.css?v=N` and `script.js?v=N`. Bump the matching `v` number whenever you change either file, or visitors get stale cached assets.
- **Theming:** Dark is the default, defined as CSS custom properties on `:root`; light overrides live under `:root[data-theme="light"]`. An inline script in `<head>` applies the saved `localStorage` theme before paint; the `#theme` button in `script.js` toggles `data-theme` and saves it. Add new colors as tokens in both blocks rather than hard-coding them.
- **Nav ↔ sections:** Links in `.nav nav` are `href="#<section id>"`, and `script.js` highlights the active one by finding the last section whose top has passed under the sticky nav bar. Keep nav link order matching the section order on the page (currently toolbox/Skills, work, experience, about, contact). A clicked link stays active until scrolling settles.
- **Sticky nav:** Use `overflow-x: clip`, not `hidden`, on ancestors — `hidden` breaks `position: sticky`.
- **Scroll effects:** `main .panel` and `.sec-head` elements get a `reveal` class and fade in via IntersectionObserver. Elements with `data-count="N"` count up to N when visible (skipped under `prefers-reduced-motion`).
- **Mobile menu:** `#menu-btn` toggles `.nav.open`; it closes on link click, Escape, or an outside click.

## Content style

Copy was deliberately cut for fast scanning; keep additions short.
