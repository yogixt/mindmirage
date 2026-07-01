# Mind Mirage — Color Palette

Reference palette extracted from `src/app/globals.css` and component usage for course images, marketing assets, and design work.

---

## Brand Philosophy

**Pure White aesthetic**: white paper, black ink, terracotta CTAs, gold ornament.

- Backgrounds: clean whites and warm off-whites
- Text: near-black ink with soft gray hierarchy
- CTAs / accents: terracotta / saffron
- Ornament / elegance: antique gold

---

## Core Tokens

Defined in `@theme` inside `src/app/globals.css`.

### Paper (backgrounds)

| Token | Hex | Name | Usage |
|-------|-----|------|-------|
| `--color-paper` | `#FFFFFF` | Pure White | Primary page background |
| `--color-paper-warm` | `#FAFAFA` | Warm White | Slightly tinted sections |
| `--color-paper-cream` | `#FFFFFF` | Cream White | Raised cards |
| `--color-paper-deep` | `#F5F5F5` | Light Gray | Section bands |
| `--color-paper-ochre` | `#F0F0F0` | Ochre Gray | Emphasis sections |

### Ink (text)

| Token | Hex | Name | Usage |
|-------|-----|------|-------|
| `--color-ink` | `#0A0A0A` | Near Black | Primary text |
| `--color-ink-soft` | `#525252` | Soft Gray | Secondary / body text |
| `--color-ink-faint` | `#A3A3A3` | Light Gray | Captions, placeholders |

### Accents

| Token | Hex | Name | Usage |
|-------|-----|------|-------|
| `--color-gold` | `#C9A227` | Antique Gold | Ornaments, dividers, highlights |
| `--color-gold-soft` | `#E8D5A0` | Pale Gold | Glows, selection, soft accents |
| `--color-saffron` | `#C0531F` | Terracotta / Saffron | Primary CTA buttons |
| `--color-terracotta` | `#C0531F` | Terracotta | Alias of saffron |
| `--color-clay` | `#9C5530` | Clay Brown | Hovers, borders, muted accents |
| `--color-maroon` | `#5C1A1B` | Deep Maroon | Dark accent |
| `--color-indigo` | `#1a0f3c` | Deep Indigo | Dark section backgrounds |
| `--color-indigo-deep` | `#0d0920` | Midnight Indigo | Deepest darks |

---

## Secondary / Section Colors

Used in specific components and pages (Tejas AI, Sanskrit verses, emails, etc.).

| Hex | Name | Usage |
|-----|------|-------|
| `#B8862B` | Dark Goldenrod | Tejas AI UI, ornamental details |
| `#B7410E` | Rust / Burnt Orange | Tejas headings, accent buttons |
| `#7e8a4b` | Sage / Olive Green | Leaf icons, nature accents |
| `#c8d3a8` | Pale Sage | Tejas chat bubbles |
| `#FAF3E0` | Warm Cream | Tejas/chat card backgrounds |
| `#FDF2DC` | Light Cream | Gradient backgrounds |
| `#F4ECD8` | Sand Cream | Gradient mid-tone |
| `#EADFC0` | Deeper Cream | Gradient shadow tone |
| `#C8B79B` | Sand Beige | Sanskrit verse text (dark variant) |
| `#9B8A72` | Taupe | Sanskrit verse refs (dark variant) |
| `#25d366` | WhatsApp Green | WhatsApp button only |

---

## Email Palette

Hard-coded colors used in transactional email templates (`src/lib/notify.ts`).

| Hex | Usage |
|-----|-------|
| `#FAF8F5` | Email outer background |
| `#FFFFFF` | Card background |
| `#FDFBF8` | Table header background |
| `#F3EFE9` | Borders / dividers |
| `#EFECE6` | Card border |
| `#1D1B18` | Headings / primary text |
| `#8A857C` | Muted captions |
| `#C0531F` | Accent headings, links, buttons |
| `#FFF6F2` | Highlight boxes, icon backgrounds |
| `#7A5340` | Support / body text |
| `#D5D2C9` | Separator dots |

---

## Typography

| Role | Font | Fallbacks |
|------|------|-----------|
| Display / headings | `Instrument Serif` | Cormorant Garamond, Georgia, serif |
| Body | `Inter` | system-ui, -apple-system, sans-serif |
| Devanagari / Sanskrit | `Noto Serif Devanagari` | Sanskrit Text, Georgia, serif |

---

## Quick CSS Variable Reference

```css
:root {
  /* Paper */
  --color-paper: #FFFFFF;
  --color-paper-warm: #FAFAFA;
  --color-paper-cream: #FFFFFF;
  --color-paper-deep: #F5F5F5;
  --color-paper-ochre: #F0F0F0;

  /* Ink */
  --color-ink: #0A0A0A;
  --color-ink-soft: #525252;
  --color-ink-faint: #A3A3A3;

  /* Accents */
  --color-gold: #C9A227;
  --color-gold-soft: #E8D5A0;
  --color-saffron: #C0531F;
  --color-terracotta: #C0531F;
  --color-clay: #9C5530;
  --color-maroon: #5C1A1B;
  --color-indigo: #1a0f3c;
  --color-indigo-deep: #0d0920;
}
```

---

## Suggested Course Image Combinations

| Mood | Background | Text | Accent |
|------|------------|------|--------|
| Clean / editorial | `#FFFFFF` | `#0A0A0A` | `#C0531F` CTA + `#C9A227` ornament |
| Warm / serene | `#FAF3E0` | `#0A0A0A` | `#B8862B` + `#7e8a4b` |
| Dark / premium | `#1a0f3c` | `#FFFFFF` | `#C9A227` + `#E8D5A0` |
| Earthy / grounded | `#F5F5F5` | `#0A0A0A` | `#9C5530` + `#C9A227` |

---

*Last extracted from `src/app/globals.css` and component files on 2026-06-17.*
