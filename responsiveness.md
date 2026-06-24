# Responsive Design System — AI Savvy Founders

Applies to: `index.html`, `web-design-guide.html`, `yt-skill.html`

---

## Design Tokens

All spacing and colour values are CSS custom properties defined in `:root`. Never use raw pixel values in layout rules — reference the tokens so changes propagate everywhere.

**Spacing scale**
| Token | Value |
|-------|-------|
| `--sp-1` | 4px |
| `--sp-2` | 8px |
| `--sp-3` | 12px |
| `--sp-4` | 16px |
| `--sp-5` | 24px |
| `--sp-6` | 32px |
| `--sp-7` | 48px |
| `--sp-8` | 64px |
| `--sp-9` | 96px |

**Typography**
| Token | Value |
|-------|-------|
| `--font-display` | Newsreader (serif) — headings, wordmark |
| `--font-body` | Manrope (sans-serif) — body copy, UI labels |

---

## Breakpoints

Three breakpoints cover every device class. Rules are `max-width` so styles cascade down from desktop.

| Breakpoint | Target | Key changes |
|------------|--------|-------------|
| `1024px` | Tablet landscape | Grid collapses to single column, hero/layout padding reduced |
| `768px` | Tablet portrait / large phone | Further padding reduction, header label hidden, hero-meta stacks vertically, font sizes reduced |
| `480px` | Small phone (iPhone SE etc.) | Tightest padding, hero title shrinks to 26 px, body text to 16 px, footer centered |

---

## Page-level Rules (apply to every page)

```css
html { overflow-x: clip; }
```

Clips any element that overflows horizontally without creating a scroll container — critical because `position: sticky` on the header breaks if the parent has `overflow-x: hidden`. `clip` prevents horizontal scroll without that side-effect.

---

## Grid Layout

Pages use a two-column CSS Grid: `240px` TOC sidebar + `1fr` content.

```css
.page-layout {            /* or .page-body */
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: var(--sp-7);
}
```

**Critical fix — `min-width: 0` on the content column**

Grid items default to `min-width: auto`, which means the content column expands to fit its widest child (code blocks with `white-space: pre` can be hundreds of pixels wide). This pushes the entire page wider than the viewport and makes the hero background appear as a narrow strip on mobile.

```css
.content { min-width: 0; }   /* allows grid track to shrink correctly */
```

The code block itself handles its own overflow:
```css
.code-block { overflow-x: auto; white-space: pre; }
```

**Collapsing the grid at 1024px**

```css
@media (max-width: 1024px) {
  .page-layout { grid-template-columns: 1fr; }
  .toc { position: static; max-height: none; }
}
```

---

## Hero Section

**Desktop** — full-width coloured band (`background: var(--muted)`) with generous padding.

```css
.hero { padding: var(--sp-9) var(--sp-8) var(--sp-8); }   /* 96px top, 64px sides */
```

**1024px** — reduce side padding so the hero content aligns with the now-single-column layout below.

```css
.hero { padding: var(--sp-8) var(--sp-6) var(--sp-7); }   /* 64px top, 32px sides */
```

**768px** — tighten further for phones.

```css
.hero { padding: var(--sp-7) var(--sp-4) var(--sp-6); }   /* 48px top, 16px sides */
```

**480px** — minimum comfortable padding and smaller title font.

```css
.hero { padding: var(--sp-6) var(--sp-3) var(--sp-5); }   /* 32px top, 12px sides */
.hero-title { font-size: 26px; }      /* overrides clamp() min of 32px */
.hero-subtitle { font-size: 16px; }
```

**Hero title** — uses `clamp()` for fluid scaling between breakpoints:

```css
.hero-title { font-size: clamp(32px, 5vw, 56px); }
```

The `clamp()` minimum is 32 px, which is still large on a 375 px phone. The 480 px override sets it explicitly to 26 px.

**Hero meta** — three inline items (read time, level, date) wrap awkwardly on narrow screens. Stack them vertically at 768 px:

```css
@media (max-width: 768px) {
  .hero-meta { flex-direction: column; gap: var(--sp-2); }
}
```

---

## Header

Sticky at the top. Shows wordmark on the left, page-type label on the right.

```css
.header { position: sticky; top: 0; height: 56px; padding: 0 var(--sp-8); }
```

At **768px** — hide the page-type label (saves space) and tighten padding:

```css
.header { padding: 0 var(--sp-4); }
.header-doctype { display: none; }   /* or .header-type depending on the page */
```

At **480px** — reduce wordmark font size:

```css
.header-wordmark { font-size: 15px; }
```

---

## Wordmark

The brand name is a CSS text element, not an image. Two `<span>` children share a flex row with `gap: 0.28em` (not HTML whitespace, which collapses inconsistently):

```html
<a class="header-wordmark" href="/">
  <span class="wm-brand">AI Savvy</span><span class="wm-suffix">Founders</span>
</a>
```

```css
.header-wordmark {
  display: flex;
  align-items: center;
  gap: 0.28em;
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 17px;
}
.header-wordmark .wm-brand { color: var(--terracotta); }
.header-wordmark .wm-suffix { color: var(--fg); }
```

---

## Tables and Code Blocks

Both can be wider than the viewport on mobile. Both are wrapped in a scroll container.

**Tables** — inside `.table-wrap`:

```css
.table-wrap { overflow-x: auto; }
.data-table th { white-space: nowrap; }   /* headers stay on one line */
```

**Code blocks** — the block itself is the scroll container:

```css
.code-block { overflow-x: auto; white-space: pre; }
```

For pages that use `<code>` tags inside the block:

```css
.code-block code { display: block; white-space: pre; }
```

Neither of these cause page-level overflow because `.content` has `min-width: 0`.

---

## Adding a New Page

Checklist when creating a new page that shares this system:

1. `<meta name="viewport" content="width=device-width, initial-scale=1.0">` in `<head>`
2. `html { overflow-x: clip; }` in the stylesheet
3. If the page has a two-column grid, add `min-width: 0` to the content column
4. Include all three breakpoints: `1024px`, `768px`, `480px`
5. Use the wordmark HTML pattern (two `<span>` inside a flex `<a>`) — no image logos
6. Use `clamp()` for hero titles; add an explicit 480 px override if the minimum exceeds 28 px
