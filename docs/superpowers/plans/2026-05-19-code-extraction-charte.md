# Code Extraction — Charte Graphique Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add toggleable code panels with copy-to-clipboard to the charte graphique website so users can extract HTML+CSS+SVG for every design element.

**Architecture:** All changes go into the single standalone file `Charte graphique/index.html`. New CSS classes handle toggle panel animation and copy button feedback. Vanilla JS functions handle toggle and clipboard APIs. Code snippets are stored in hidden `<script type="text/template">` tags, inserted into code panels on toggle. Existing `.code-block` elements (Easings, CSS Tokens) get copy buttons added.

**Tech Stack:** Vanilla HTML, CSS, JS. Zero dependencies.

---

### Task 1: Add CSS for toggle panels, toggle button, and copy button

**Files:**
- Modify: `Charte graphique/index.html` — insert into `<style>` block before `</style>`

- [ ] **Step 1: Add code toggle button CSS**

Insert the following CSS right before `</style>` (line ~1099):

```css
/* ═══ CODE TOGGLE ═══ */
.code-toggle-wrap {
  display: flex;
  justify-content: flex-end;
  margin-bottom: var(--space-sm);
}

.code-toggle-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-mono);
  font-weight: 400;
  font-size: 0.625rem;
  color: rgba(249,249,242,0.25);
  background: rgba(249,249,242,0.04);
  border: 1px solid rgba(249,249,242,0.06);
  border-radius: var(--radius-sm);
  padding: 3px 10px;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
  user-select: none;
}

.code-toggle-btn:hover {
  color: var(--lime);
  border-color: rgba(212,255,80,0.20);
  background: rgba(212,255,80,0.06);
}

.code-toggle-btn svg {
  width: 12px;
  height: 12px;
  opacity: 0.6;
}

.code-panel {
  max-height: 0;
  overflow: hidden;
  transition: max-height var(--duration-normal) var(--ease-out);
  margin-bottom: var(--space-lg);
}

.code-panel.open {
  max-height: 3000px;
}

.code-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-xs) var(--space-sm);
  margin-bottom: var(--space-xs);
}

.code-panel-label {
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 0.625rem;
  color: rgba(249,249,242,0.25);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.copy-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 0.625rem;
  color: rgba(249,249,242,0.30);
  background: transparent;
  border: 1px solid rgba(249,249,242,0.08);
  border-radius: var(--radius-sm);
  padding: 2px 8px;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}

.copy-btn:hover {
  color: var(--cream);
  border-color: rgba(249,249,242,0.20);
  background: rgba(249,249,242,0.04);
}

.copy-btn.copied {
  color: var(--success);
  border-color: rgba(58,224,134,0.25);
  background: rgba(58,224,134,0.08);
}

.copy-btn svg {
  width: 10px;
  height: 10px;
}

/* Inline copy for palette swatches */
.swatch-copy {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(5,13,7,0.30);
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  opacity: 0;
  transition: opacity var(--duration-fast);
  color: rgba(249,249,242,0.40);
}

.swatch:hover .swatch-copy,
.semantic-swatch:hover .swatch-copy {
  opacity: 1;
}

.swatch-copy:hover {
  background: rgba(5,13,7,0.60);
  color: var(--lime);
}

.swatch-copy.copied {
  color: var(--success);
  opacity: 1;
}

/* Inline copy for icon cells */
.icon-cell {
  position: relative;
}

.icon-cell-copy {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(5,13,7,0.30);
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  opacity: 0;
  transition: opacity var(--duration-fast);
  color: rgba(249,249,242,0.30);
  font-size: 0.5rem;
}

.icon-cell:hover .icon-cell-copy {
  opacity: 1;
}

.icon-cell-copy:hover {
  color: var(--lime);
  background: rgba(5,13,7,0.60);
}

.icon-cell-copy.copied {
  color: var(--success);
  opacity: 1;
}
```

- [ ] **Step 2: Commit**

```bash
git add "Charte graphique/index.html"
git commit -m "style: add code toggle and copy button CSS"
```

---

### Task 2: Add JavaScript for toggle and clipboard

**Files:**
- Modify: `Charte graphique/index.html` — replace existing `<script>` block at lines 2061-2081

- [ ] **Step 1: Replace the existing `<script>` block**

Replace the entire `<script>` block (lines 2061-2081) with:

```html
<script>
  // ═══ Active nav link on scroll ═══
  const sections = document.querySelectorAll('.section, .hero');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id || '';
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
        if (!id) {
          navLinks.forEach(link => link.classList.remove('active'));
        }
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => observer.observe(s));

  // ═══ CODE TOGGLE ═══
  function toggleCodePanel(btn, panelId) {
    var panel = document.getElementById(panelId);
    var isOpen = panel.classList.contains('open');
    if (isOpen) {
      panel.classList.remove('open');
      btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg> Code';
    } else {
      panel.classList.add('open');
      btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Masquer';
    }
  }

  // ═══ COPY TO CLIPBOARD ═══
  function copyCode(btn, codeBlockId) {
    var codeBlock = document.getElementById(codeBlockId);
    var text = codeBlock.textContent || codeBlock.innerText;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function() {
        showCopied(btn);
      }).catch(function() {
        fallbackCopy(text, btn);
      });
    } else {
      fallbackCopy(text, btn);
    }
  }

  function copySwatch(btn, hex, cssVar) {
    var text = cssVar ? hex + '\n' + cssVar : hex;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function() {
        showCopied(btn);
      }).catch(function() {
        fallbackCopy(text, btn);
      });
    } else {
      fallbackCopy(text, btn);
    }
  }

  function copyIconSvg(btn, svgElementId) {
    var svgEl = document.getElementById(svgElementId);
    var text = svgEl.outerHTML;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function() {
        showCopied(btn);
      }).catch(function() {
        fallbackCopy(text, btn);
      });
    } else {
      fallbackCopy(text, btn);
    }
  }

  function fallbackCopy(text, btn) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      showCopied(btn);
    } catch (e) {
      // silent fail
    }
    document.body.removeChild(textarea);
  }

  function showCopied(btn) {
    var originalHTML = btn.innerHTML;
    btn.classList.add('copied');
    btn.innerHTML = '&#10003; Copi&eacute; !';
    setTimeout(function() {
      btn.classList.remove('copied');
      btn.innerHTML = originalHTML;
    }, 2000);
  }
</script>
```

- [ ] **Step 2: Commit**

```bash
git add "Charte graphique/index.html"
git commit -m "feat: add toggle and clipboard JavaScript"
```

---

### Task 3: Add copy button to existing code blocks (Easings + CSS Tokens)

**Files:**
- Modify: `Charte graphique/index.html` — lines 1779, 1997

- [ ] **Step 1: Wrap Easings code block and add copy header**

Replace lines 1779-1786 (the Easings code block) with:

```html
  <h4 style="font-family:var(--font-display);font-weight:700;font-size:1.125rem;margin-bottom:var(--space-lg);">Easings</h4>
  <div class="code-panel-header" style="margin-bottom:0;padding-bottom:var(--space-xs);">
    <span class="code-panel-label">CSS</span>
    <button class="copy-btn" onclick="copyCode(this,'code-block-easings')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
      Copier
    </button>
  </div>
  <div class="code-block" id="code-block-easings" style="margin-top:0;">
<span class="comment">/* Easings officiels AgriScan */</span>
<span class="punctuation">:</span><span class="property">root</span> <span class="punctuation">{</span>
  <span class="property">--ease-out</span><span class="punctuation">:</span>   <span class="value">cubic-bezier</span><span class="punctuation">(</span>0.16<span class="punctuation">,</span> 1<span class="punctuation">,</span> 0.3<span class="punctuation">,</span> 1<span class="punctuation">);</span>   <span class="comment">/* Apparitions */</span>
  <span class="property">--ease-in</span><span class="punctuation">:</span>    <span class="value">cubic-bezier</span><span class="punctuation">(</span>0.4<span class="punctuation">,</span> 0<span class="punctuation">,</span> 1<span class="punctuation">,</span> 1<span class="punctuation">);</span>      <span class="comment">/* Disparitions */</span>
  <span class="property">--ease-in-out</span><span class="punctuation">:</span> <span class="value">cubic-bezier</span><span class="punctuation">(</span>0.65<span class="punctuation">,</span> 0<span class="punctuation">,</span> 0.35<span class="punctuation">,</span> 1<span class="punctuation">);</span> <span class="comment">/* Continus */</span>
  <span class="property">--ease-spring</span><span class="punctuation">:</span> <span class="value">cubic-bezier</span><span class="punctuation">(</span>0.34<span class="punctuation">,</span> 1.56<span class="punctuation">,</span> 0.64<span class="punctuation">,</span> 1<span class="punctuation">);</span> <span class="comment">/* Press */</span>
<span class="punctuation">}</span></div>
```

- [ ] **Step 2: Wrap CSS Tokens code block and add copy header**

Replace lines 1997-2051 (the CSS Tokens code block) with:

```html
  <div class="code-panel-header" style="margin-bottom:0;padding-bottom:var(--space-xs);">
    <span class="code-panel-label">CSS — :root</span>
    <button class="copy-btn" onclick="copyCode(this,'code-block-tokens')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
      Copier
    </button>
  </div>
  <div class="code-block" id="code-block-tokens" style="margin-top:0;">
<span class="comment">/* ══════════════════════════════════════════════════
   AGRISCAN.AI — DESIGN TOKENS v1.0
   Direction : SYNAPSE — Dark Tech Cinématique × Nature
   ══════════════════════════════════════════════════ */</span>

<span class="punctuation">:</span><span class="property">root</span> <span class="punctuation">{</span>
  <span class="comment">/* ── Couleurs Principales ── */</span>
  <span class="property">--color-black</span><span class="punctuation">:</span> <span class="value">#050D07</span><span class="punctuation">;</span>
  <span class="property">--color-forest-green</span><span class="punctuation">:</span> <span class="value">#0A1B0E</span><span class="punctuation">;</span>
  <span class="property">--color-cream</span><span class="punctuation">:</span> <span class="value">#F9F9F2</span><span class="punctuation">;</span>
  <span class="property">--color-lime</span><span class="punctuation">:</span> <span class="value">#D4FF50</span><span class="punctuation">;</span>
  <span class="property">--color-slate</span><span class="punctuation">:</span> <span class="value">#2D3A2F</span><span class="punctuation">;</span>

  <span class="comment">/* ── Couleurs Sémantiques ── */</span>
  <span class="property">--color-success</span><span class="punctuation">:</span> <span class="value">#3AE086</span><span class="punctuation">;</span>
  <span class="property">--color-error</span><span class="punctuation">:</span> <span class="value">#FF4E5C</span><span class="punctuation">;</span>
  <span class="property">--color-warning</span><span class="punctuation">:</span> <span class="value">#FFB443</span><span class="punctuation">;</span>
  <span class="property">--color-info</span><span class="punctuation">:</span> <span class="value">#4DAAFF</span><span class="punctuation">;</span>

  <span class="comment">/* ── Typographie ── */</span>
  <span class="property">--font-display</span><span class="punctuation">:</span> <span class="string">'Plus Jakarta Sans'</span><span class="punctuation">,</span> <span class="value">sans-serif</span><span class="punctuation">;</span>
  <span class="property">--font-body</span><span class="punctuation">:</span> <span class="string">'Inter'</span><span class="punctuation">,</span> <span class="value">sans-serif</span><span class="punctuation">;</span>
  <span class="property">--font-mono</span><span class="punctuation">:</span> <span class="string">'JetBrains Mono'</span><span class="punctuation">,</span> <span class="value">monospace</span><span class="punctuation">;</span>

  <span class="comment">/* ── Border Radius ── */</span>
  <span class="property">--radius-sm</span><span class="punctuation">:</span> <span class="value">4px</span><span class="punctuation">;</span>
  <span class="property">--radius-md</span><span class="punctuation">:</span> <span class="value">8px</span><span class="punctuation">;</span>
  <span class="property">--radius-lg</span><span class="punctuation">:</span> <span class="value">12px</span><span class="punctuation">;</span>
  <span class="property">--radius-xl</span><span class="punctuation">:</span> <span class="value">16px</span><span class="punctuation">;</span>
  <span class="property">--radius-squircle</span><span class="punctuation">:</span> <span class="value">28px</span><span class="punctuation">;</span>
  <span class="property">--radius-full</span><span class="punctuation">:</span> <span class="value">9999px</span><span class="punctuation">;</span>

  <span class="comment">/* ── Espacement ── */</span>
  <span class="property">--space-xs</span><span class="punctuation">:</span> <span class="value">4px</span><span class="punctuation">;</span>
  <span class="property">--space-sm</span><span class="punctuation">:</span> <span class="value">8px</span><span class="punctuation">;</span>
  <span class="property">--space-md</span><span class="punctuation">:</span> <span class="value">12px</span><span class="punctuation">;</span>
  <span class="property">--space-lg</span><span class="punctuation">:</span> <span class="value">16px</span><span class="punctuation">;</span>
  <span class="property">--space-xl</span><span class="punctuation">:</span> <span class="value">24px</span><span class="punctuation">;</span>
  <span class="property">--space-2xl</span><span class="punctuation">:</span> <span class="value">32px</span><span class="punctuation">;</span>
  <span class="property">--space-3xl</span><span class="punctuation">:</span> <span class="value">48px</span><span class="punctuation">;</span>
  <span class="property">--space-4xl</span><span class="punctuation">:</span> <span class="value">64px</span><span class="punctuation">;</span>

  <span class="comment">/* ── Animations ── */</span>
  <span class="property">--duration-fast</span><span class="punctuation">:</span> <span class="value">150ms</span><span class="punctuation">;</span>
  <span class="property">--duration-normal</span><span class="punctuation">:</span> <span class="value">300ms</span><span class="punctuation">;</span>
  <span class="property">--duration-slow</span><span class="punctuation">:</span> <span class="value">600ms</span><span class="punctuation">;</span>
  <span class="property">--ease-out</span><span class="punctuation">:</span> <span class="value">cubic-bezier</span><span class="punctuation">(</span>0.16<span class="punctuation">,</span> 1<span class="punctuation">,</span> 0.3<span class="punctuation">,</span> 1<span class="punctuation">);</span>
  <span class="property">--ease-spring</span><span class="punctuation">:</span> <span class="value">cubic-bezier</span><span class="punctuation">(</span>0.34<span class="punctuation">,</span> 1.56<span class="punctuation">,</span> 0.64<span class="punctuation">,</span> 1<span class="punctuation">);</span>

  <span class="comment">/* ── Glassmorphism ── */</span>
  <span class="property">--glass-bg</span><span class="punctuation">:</span> <span class="value">rgba</span><span class="punctuation">(</span>10<span class="punctuation">,</span> 27<span class="punctuation">,</span> 14<span class="punctuation">,</span> 0.55<span class="punctuation">);</span>
  <span class="property">--glass-blur</span><span class="punctuation">:</span> <span class="value">blur</span><span class="punctuation">(</span>16px<span class="punctuation">);</span>
  <span class="property">--glass-border</span><span class="punctuation">:</span> <span class="value">1px solid rgba</span><span class="punctuation">(</span>249<span class="punctuation">,</span> 249<span class="punctuation">,</span> 242<span class="punctuation">,</span> 0.06<span class="punctuation">);</span>
<span class="punctuation">}</span></div>
```

- [ ] **Step 3: Commit**

```bash
git add "Charte graphique/index.html"
git commit -m "feat: add copy buttons to existing code blocks"
```

---

### Task 4: Add inline copy buttons to palette swatches

**Files:**
- Modify: `Charte graphique/index.html` — palette section (lines 1204-1278)

- [ ] **Step 1: Add copy buttons to each color swatch**

For each of the 5 main swatches (Black, Forest Green, Cream, Lime, Slate), add a copy button inside `.swatch-preview`. Example for Black (line 1206):

```html
      <div class="swatch-preview" style="background:#050D07;">
        <button class="swatch-copy" onclick="copySwatch(this,'#050D07','--color-black: #050D07;')" title="Copier">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
        </button>
      </div>
```

Apply the same pattern for all 5 main swatches:
- `#0A1B0E` / `--color-forest-green: #0A1B0E;`
- `#F9F9F2` / `--color-cream: #F9F9F2;`
- `#D4FF50` / `--color-lime: #D4FF50;`
- `#2D3A2F` / `--color-slate: #2D3A2F;`

And for the 4 semantic swatches (Success, Error, Warning, Info), add the same pattern inside `.semantic-preview`:

```html
<button class="swatch-copy" onclick="copySwatch(this,'#3AE086','--color-success: #3AE086;')" title="Copier">
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
</button>
```

Semantic values:
- `#3AE086` / `--color-success: #3AE086;`
- `#FF4E5C` / `--color-error: #FF4E5C;`
- `#FFB443` / `--color-warning: #FFB443;`
- `#4DAAFF` / `--color-info: #4DAAFF;`

- [ ] **Step 2: Commit**

```bash
git add "Charte graphique/index.html"
git commit -m "feat: add inline copy buttons to palette swatches"
```

---

### Task 5: Add copy buttons to icon cells

**Files:**
- Modify: `Charte graphique/index.html` — icones section (lines 1796-1853)

- [ ] **Step 1: Assign IDs to each icon SVG and add copy buttons**

For each `.icon-cell`, add an `id` to the SVG and add a copy button. Example for the first icon (dashboard):

```html
    <div class="icon-cell">
      <svg id="svg-dashboard" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>
      <span>dashboard</span>
      <button class="icon-cell-copy" onclick="copyIconSvg(this,'svg-dashboard')" title="Copier SVG">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
      </button>
    </div>
```

Apply to all 14 icons with IDs: `svg-dashboard`, `svg-scan`, `svg-history`, `svg-user`, `svg-settings`, `svg-arrow-left`, `svg-x`, `svg-search`, `svg-alert`, `svg-check`, `svg-camera`, `svg-send`, `svg-sprout`, `svg-bell`.

- [ ] **Step 2: Commit**

```bash
git add "Charte graphique/index.html"
git commit -m "feat: add inline copy buttons to icon cells"
```

---

### Task 6: Add toggle panels for UI Components (Buttons, Inputs, Badges, Cards, Chat)

**Files:**
- Modify: `Charte graphique/index.html` — composants section (lines 1643-1735)

- [ ] **Step 1: Add toggle panel for Buttons — Primary**

After the Buttons Primary `.comp-demo` (line 1657), insert:

```html
    <div class="code-toggle-wrap">
      <button class="code-toggle-btn" onclick="toggleCodePanel(this,'code-panel-btn-primary')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg> Code
      </button>
    </div>
    <div class="code-panel" id="code-panel-btn-primary">
      <div class="code-panel-header">
        <span class="code-panel-label">HTML + CSS</span>
        <button class="copy-btn" onclick="copyCode(this,'code-btn-primary')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
          Copier
        </button>
      </div>
      <div class="code-block" id="code-btn-primary" style="margin-top:0;">
<span class="comment">&lt;!-- Boutons Primary --&gt;</span>
&lt;<span class="property">button</span> <span class="value">class</span>=<span class="string">"btn btn-primary btn-sm"</span>&gt;Small&lt;/<span class="property">button</span>&gt;
&lt;<span class="property">button</span> <span class="value">class</span>=<span class="string">"btn btn-primary btn-md"</span>&gt;Medium&lt;/<span class="property">button</span>&gt;
&lt;<span class="property">button</span> <span class="value">class</span>=<span class="string">"btn btn-primary btn-lg"</span>&gt;Large CTA&lt;/<span class="property">button</span>&gt;

<span class="comment">/* CSS */</span>
<span class="punctuation">.</span><span class="property">btn</span> <span class="punctuation">{</span>
  <span class="property">display</span><span class="punctuation">:</span> <span class="value">inline-flex</span><span class="punctuation">;</span>
  <span class="property">align-items</span><span class="punctuation">:</span> <span class="value">center</span><span class="punctuation">;</span>
  <span class="property">justify-content</span><span class="punctuation">:</span> <span class="value">center</span><span class="punctuation">;</span>
  <span class="property">gap</span><span class="punctuation">:</span> <span class="value">8px</span><span class="punctuation">;</span>
  <span class="property">font-family</span><span class="punctuation">:</span> <span class="value">var</span><span class="punctuation">(</span><span class="property">--font-body</span><span class="punctuation">);</span>
  <span class="property">font-weight</span><span class="punctuation">:</span> <span class="value">500</span><span class="punctuation">;</span>
  <span class="property">border</span><span class="punctuation">:</span> <span class="value">none</span><span class="punctuation">;</span>
  <span class="property">border-radius</span><span class="punctuation">:</span> <span class="value">var</span><span class="punctuation">(</span><span class="property">--radius-md</span><span class="punctuation">);</span>
  <span class="property">cursor</span><span class="punctuation">:</span> <span class="value">pointer</span><span class="punctuation">;</span>
  <span class="property">transition</span><span class="punctuation">:</span> <span class="value">all 150ms cubic-bezier</span><span class="punctuation">(</span>0.16<span class="punctuation">,</span> 1<span class="punctuation">,</span> 0.3<span class="punctuation">,</span> 1<span class="punctuation">);</span>
  <span class="property">white-space</span><span class="punctuation">:</span> <span class="value">nowrap</span><span class="punctuation">;</span>
<span class="punctuation">}</span>

<span class="punctuation">.</span><span class="property">btn</span><span class="punctuation">:</span><span class="property">active</span> <span class="punctuation">{</span> <span class="property">transform</span><span class="punctuation">:</span> <span class="value">scale</span><span class="punctuation">(</span>0.97<span class="punctuation">);</span> <span class="punctuation">}</span>

<span class="punctuation">.</span><span class="property">btn-sm</span> <span class="punctuation">{</span> <span class="property">height</span><span class="punctuation">:</span> <span class="value">32px</span><span class="punctuation">;</span> <span class="property">padding</span><span class="punctuation">:</span> <span class="value">0 12px</span><span class="punctuation">;</span> <span class="property">font-size</span><span class="punctuation">:</span> <span class="value">11px</span><span class="punctuation">;</span> <span class="punctuation">}</span>
<span class="punctuation">.</span><span class="property">btn-md</span> <span class="punctuation">{</span> <span class="property">height</span><span class="punctuation">:</span> <span class="value">44px</span><span class="punctuation">;</span> <span class="property">padding</span><span class="punctuation">:</span> <span class="value">0 20px</span><span class="punctuation">;</span> <span class="property">font-size</span><span class="punctuation">:</span> <span class="value">13px</span><span class="punctuation">;</span> <span class="punctuation">}</span>
<span class="punctuation">.</span><span class="property">btn-lg</span> <span class="punctuation">{</span> <span class="property">height</span><span class="punctuation">:</span> <span class="value">52px</span><span class="punctuation">;</span> <span class="property">padding</span><span class="punctuation">:</span> <span class="value">0 28px</span><span class="punctuation">;</span> <span class="property">font-size</span><span class="punctuation">:</span> <span class="value">15px</span><span class="punctuation">;</span> <span class="punctuation">}</span>

<span class="punctuation">.</span><span class="property">btn-primary</span> <span class="punctuation">{</span>
  <span class="property">background</span><span class="punctuation">:</span> <span class="value">#D4FF50</span><span class="punctuation">;</span>
  <span class="property">color</span><span class="punctuation">:</span> <span class="value">#050D07</span><span class="punctuation">;</span>
  <span class="property">box-shadow</span><span class="punctuation">:</span> <span class="value">0 0 10px rgba</span><span class="punctuation">(</span>212<span class="punctuation">,</span>255<span class="punctuation">,</span>80<span class="punctuation">,</span>0.10<span class="punctuation">);</span>
<span class="punctuation">}</span>

<span class="punctuation">.</span><span class="property">btn-primary</span><span class="punctuation">:</span><span class="property">hover</span> <span class="punctuation">{</span>
  <span class="property">background</span><span class="punctuation">:</span> <span class="value">#C5F030</span><span class="punctuation">;</span>
  <span class="property">box-shadow</span><span class="punctuation">:</span> <span class="value">0 0 20px rgba</span><span class="punctuation">(</span>212<span class="punctuation">,</span>255<span class="punctuation">,</span>80<span class="punctuation">,</span>0.15<span class="punctuation">);</span>
<span class="punctuation">}</span>
      </div>
    </div>
```

- [ ] **Step 2: Add toggle panel for Buttons — Secondary**

After the Buttons Secondary `.comp-demo` (line 1666), insert the same structure with `id="code-panel-btn-secondary"` and `id="code-btn-secondary"`. The code block should show the secondary button markup and CSS.

- [ ] **Step 3: Add toggle panel for Buttons — Ghost & Danger**

After the Ghost & Danger `.comp-demo` (line 1674), insert the same structure with `id="code-panel-btn-ghost-danger"` and `id="code-btn-ghost-danger"`. Show ghost and danger button markup + CSS.

- [ ] **Step 4: Add toggle panel for Inputs**

After the Inputs `.comp-demo` (line 1688), insert toggle panel with input + textarea HTML and CSS.

- [ ] **Step 5: Add toggle panel for Badges & Tags**

After the Badges `.comp-demo` (line 1700), insert toggle panel with badge and tag HTML + CSS.

- [ ] **Step 6: Add toggle panel for Cards**

After the Cards `.comp-demo` (line 1718), insert toggle panel with card variants HTML + CSS.

- [ ] **Step 7: Add toggle panel for Chatbot UI**

After the Chatbot `.comp-demo` (line 1734), insert toggle panel with chat message HTML + CSS including typing dots keyframes.

- [ ] **Step 8: Commit**

```bash
git add "Charte graphique/index.html"
git commit -m "feat: add code toggle panels for all UI components"
```

---

### Task 7: Add toggle panels for Typography and Logo

**Files:**
- Modify: `Charte graphique/index.html` — typo section (after line 1478) and logo section (after line 1533)

- [ ] **Step 1: Add typography code toggle**

After the typographic scale table `</div>` (line 1478), insert a toggle panel showing Google Fonts `@import` and font-family declarations:

```html
  <div class="code-toggle-wrap">
    <button class="code-toggle-btn" onclick="toggleCodePanel(this,'code-panel-typo')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg> Code
    </button>
  </div>
  <div class="code-panel" id="code-panel-typo">
    <div class="code-panel-header">
      <span class="code-panel-label">CSS — Fonts</span>
      <button class="copy-btn" onclick="copyCode(this,'code-typo')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
        Copier
      </button>
    </div>
    <div class="code-block" id="code-typo" style="margin-top:0;">
<span class="comment">/* Google Fonts Import */</span>
<span class="punctuation">@import</span> <span class="value">url</span><span class="punctuation">(</span><span class="string">'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;700&display=swap'</span><span class="punctuation">);</span>

<span class="comment">/* Font Declarations */</span>
<span class="punctuation">--font-display:</span> <span class="string">'Plus Jakarta Sans'</span><span class="punctuation">,</span> <span class="value">sans-serif</span><span class="punctuation">;</span>  <span class="comment">/* 800, 700 — Titres */</span>
<span class="punctuation">--font-body:</span>    <span class="string">'Inter'</span><span class="punctuation">,</span> <span class="value">sans-serif</span><span class="punctuation">;</span>              <span class="comment">/* 400, 500 — Corps */</span>
<span class="punctuation">--font-mono:</span>    <span class="string">'JetBrains Mono'</span><span class="punctuation">,</span> <span class="value">monospace</span><span class="punctuation">;</span>      <span class="comment">/* 400, 700 — Données */</span>
    </div>
  </div>
```

- [ ] **Step 2: Add logo SVG code toggle**

After the last logo card (before `</div>` closing the logo-variants grid, line 1533), insert:

```html
  <div class="code-toggle-wrap">
    <button class="code-toggle-btn" onclick="toggleCodePanel(this,'code-panel-logo')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg> Code
    </button>
  </div>
  <div class="code-panel" id="code-panel-logo">
    <div class="code-panel-header">
      <span class="code-panel-label">SVG — Logo Primaire</span>
      <button class="copy-btn" onclick="copyCode(this,'code-logo')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
        Copier
      </button>
    </div>
    <div class="code-block" id="code-logo" style="margin-top:0;">
<span class="comment">&lt;!-- Logo AgriScan.ai — Symbole SVG --&gt;</span>
&lt;<span class="property">div</span> <span class="value">class</span>=<span class="string">"logo-symbol"</span> <span class="value">style</span>=<span class="string">"background:#0A1B0E;border-radius:28px;width:64px;height:64px;display:flex;align-items:center;justify-content:center;border:1px solid rgba(249,249,242,0.08);"</span>&gt;
  &lt;<span class="property">svg</span> <span class="value">viewBox</span>=<span class="string">"0 0 24 24"</span> <span class="value">fill</span>=<span class="string">"none"</span> <span class="value">stroke</span>=<span class="string">"#F9F9F2"</span> <span class="value">stroke-width</span>=<span class="string">"1.5"</span> <span class="value">stroke-linecap</span>=<span class="string">"round"</span> <span class="value">stroke-linejoin</span>=<span class="string">"round"</span>&gt;
    &lt;<span class="property">path</span> <span class="value">d</span>=<span class="string">"M12 2C8 6 4 10 4 14c0 4 3.5 7 8 7s8-3 8-7c0-4-4-8-8-12z"</span>/&gt;
    &lt;<span class="property">path</span> <span class="value">d</span>=<span class="string">"M12 2v19"</span>/&gt;
    &lt;<span class="property">line</span> <span class="value">x1</span>=<span class="string">"5"</span> <span class="value">y1</span>=<span class="string">"10"</span> <span class="value">x2</span>=<span class="string">"19"</span> <span class="value">y2</span>=<span class="string">"10"</span> <span class="value">stroke</span>=<span class="string">"#D4FF50"</span> <span class="value">stroke-dasharray</span>=<span class="string">"2 1.5"</span>/&gt;
  &lt;/<span class="property">svg</span>&gt;
&lt;/<span class="property">div</span>&gt;
&lt;<span class="property">div</span> <span class="value">style</span>=<span class="string">"font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;color:#F9F9F2;"</span>&gt;AgriScan&lt;<span class="property">span</span> <span class="value">style</span>=<span class="string">"color:#D4FF50;"</span>&gt;.ai&lt;/<span class="property">span</span>&gt;&lt;/<span class="property">div</span>&gt;
    </div>
  </div>
```

- [ ] **Step 3: Commit**

```bash
git add "Charte graphique/index.html"
git commit -m "feat: add code toggle panels for typography and logo"
```

---

### Task 8: Final verification and commit

**Files:**
- Verify: `Charte graphique/index.html`

- [ ] **Step 1: Verify HTML validity**

```bash
# Open the file in a browser to check visually, or run:
python3 -c "
import re
with open('Charte graphique/index.html') as f:
    content = f.read()
# Check all tags are balanced
open_script = content.count('<script')
close_script = content.count('</script>')
open_div = content.count('<div')
close_div = content.count('</div>')
print(f'script tags: {open_script} open, {close_script} close')
print(f'div tags: {open_div} open, {close_div} close')
"
```

Expected: script tags balanced (open == close). Div tags may differ slightly (void elements) but should be close.

- [ ] **Step 2: Verify all onclick references match existing IDs**

```bash
# Check that all onclick panel IDs have matching HTML elements
grep -oP "CodePanel\(this,'([^']+)'\)" "Charte graphique/index.html" | sed "s/CodePanel(this,'//;s/')//" | while read id; do grep -q "id=\"$id\"" "Charte graphique/index.html" || echo "MISSING: $id"; done

grep -oP "copyCode\(this,'([^']+)'\)" "Charte graphique/index.html" | sed "s/copyCode(this,'//;s/')//" | while read id; do grep -q "id=\"$id\"" "Charte graphique/index.html" || echo "MISSING: $id"; done
```

All IDs should be found.

- [ ] **Step 3: Final commit**

```bash
git add "Charte graphique/index.html"
git commit -m "feat: verify code extraction feature completeness"
```
