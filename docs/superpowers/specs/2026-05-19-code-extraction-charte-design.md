# Code Extraction — Charte Graphique AgriScan

**Date:** 2026-05-19
**Status:** Design approved, ready for planning

## Goal

Add code extraction to the charte graphique website (`Charte graphique/index.html`) so users can view and copy source code (HTML, CSS, SVG) for any design element directly on the page.

## Mechanism

Each relevant section gets a `</> Code` toggle button in its header. Clicking it reveals a syntax-highlighted code panel below with the full source code, plus a **Copier** button that copies to clipboard with visual feedback (`✓ Copié !`).

### Behavior

1. Button `</> Code` — discreet, outline/ghost style, top-right of the section card/header
2. Click: code panel slides down (CSS transition on `max-height`), button becomes `✕ Masquer`
3. Panel contains syntax-highlighted code (same color scheme as existing `.code-block`) + a **Copier** button
4. Copier uses `navigator.clipboard.writeText()`, shows `✓ Copié !` feedback for 2 seconds
5. Clicking `✕ Masquer` collapses the panel

## Sections concerned

| Section | What to extract | Code format |
|---|---|---|
| **CSS Tokens** (#tokens) | Full `:root` block (already present, add copy button only) | CSS |
| **Easings** (#effets) | Easings CSS block (already present, add copy button only) | CSS |
| **Palette** (#palette) | Each swatch: hex value + CSS variable | Inline copy icon per swatch |
| **Typography** (#typo) | Font declarations, scale table | CSS `@import` + `font-family` declarations |
| **Logo** (#logo) | Full SVG for each variant + markup | SVG + HTML |
| **UI Components** (#composants) | | |
| — Buttons (Primary) | HTML + CSS for all 4 sizes/states | HTML + CSS |
| — Buttons (Secondary) | HTML + CSS | HTML + CSS |
| — Buttons (Ghost & Danger) | HTML + CSS | HTML + CSS |
| — Inputs | HTML + CSS for input + textarea | HTML + CSS |
| — Badges & Tags | HTML + CSS for all variants | HTML + CSS |
| — Cards | HTML + CSS for standard, stat, alert variants | HTML + CSS |
| — Chatbot UI | HTML + CSS for chat bubbles + typing indicator | HTML + CSS |
| **Iconography** (#icones) | SVG inline for each icon | SVG |

## Sections NOT concerned (no extractable code)

- Hero (visual only)
- Concept (text content)
- Grille/Espacement (visual demos)
- Effets Visuels descriptive cards (already done via Easings block)
- Écrans de Référence (complex mockups, not reusable code)
- Footer

## Implementation details

### Code snippets storage

Each toggleable section stores its raw code in a `<template>` element (hidden, not rendered) or inline `<script type="text/template">`. This keeps the HTML valid and the code is never visible in the rendered page until toggled.

### CSS additions

- `.code-toggle-btn` — ghost button style, small, positioned in section header
- `.code-panel` — collapsible container with `max-height: 0; overflow: hidden; transition: max-height 300ms var(--ease-out)`
- `.code-panel.open` — `max-height: 2000px` (large enough for any code block)
- `.code-panel .code-block` — reuses existing `.code-block` styles
- `.copy-btn` — button inside code panel header, ghost style
- `.copy-btn.copied` — green checkmark feedback

### JavaScript additions

All vanilla JS, no dependencies:

```js
function toggleCodePanel(btn) {
  // Find the associated code panel, toggle .open class
  // Update button text </> Code ↔ ✕ Masquer
}
function copyCode(btn) {
  // Find the associated <code> element
  // navigator.clipboard.writeText()
  // Show ✓ Copié ! feedback for 2s
}
```

### Clipboard API

Uses `navigator.clipboard.writeText()` with fallback to `document.execCommand('copy')` for older browsers. The site is served locally (file://) where clipboard API may require a user gesture — the click event satisfies this.

## Non-goals

- Download as file (only clipboard copy)
- Tailwind / other framework translations
- Export global de la page
- Dark/light mode variants (site is dark-only)

## Technical constraints

- Everything stays in `index.html` — zero external dependencies beyond Google Fonts
- No build step, no package.json
- Must work when opened as `file://` (local file)
- Responsive: code panels work on mobile (code blocks horizontally scrollable)
