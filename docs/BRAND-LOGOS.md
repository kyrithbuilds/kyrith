# KyrithBuilds — Logo & Mark Reference

Structured reference for **logo assets, anatomy, colors, and usage** when generating content with AI (social posts, decks, proposals, email signatures, mockups, or code).

For broader brand voice, colors, and UI standards, see [KYRYTHBUILDS.md](./KYRYTHBUILDS.md).  
For where logos are used in the website codebase, see [WEBSITE.md](./WEBSITE.md).

---

## Source of truth (priority order)

| Priority | Location | Notes |
|----------|----------|--------|
| **1 — Production** | `src/assets/Full Logo.svg`, `src/assets/Circle Logo.svg` | Canonical lockups on [kyrithbuilds.com](https://kyrithbuilds.com) |
| **2 — Favicon / schema** | `public/` and `src/assets/favicon_io/` | PNG/ICO derivatives of the circle mark |
| **3 — Design file** | [KyrithBuilds-Logos (Figma)](https://www.figma.com/design/nuav021IuUOndB9odPGP99/KyrithBuilds-Logos) | Source artwork; **tagline in Figma is outdated** (see below) |

**Rule for AI:** Always start from repo SVGs or exported PNGs from them. Do not redraw, retype, or approximate the wordmark from memory.

---

## Logo variants

| Variant | File | Canvas (viewBox) | When to use |
|---------|------|------------------|-------------|
| **Full logo** | `src/assets/Full Logo.svg` | 1425 × 323 | Navbar (desktop ≥ lg), footer, letterheads, hero lockups, presentations |
| **Full logo (dark)** | `src/assets/Full Logo Dark.svg` | 1425 × 323 | Dark backgrounds (`#021D41`, navy UI, social banners on dark) |
| **Circle mark** | `src/assets/Circle Logo.svg` | 506 × 506 | Mobile navbar, app icons, avatars, favicons, square social profile images |
| **Circle mark (dark)** | `src/assets/Circle Logo Dark.svg` | 506 × 506 | Dark UI chrome, app icons on navy backgrounds |
| **Favicon set** | `public/favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png`, `android-chrome-192x192.png`, `android-chrome-512x512.png` | 16–512 px | Browser tab, bookmarks, PWA, JSON-LD `Organization.logo` |

There is **no separate wordmark-only** or **monochrome** SVG in the repo today. If a one-color version is needed, derive it from the SVG paths using only `#021D41` (navy) and `#4172F4` (blue)—do not substitute other blues.

---

## Visual anatomy

### Full logo (horizontal lockup)

Left to right:

1. **K monogram mark** — Abstract “K” built from four interlocking shapes (see Circle mark).
2. **Wordmark** — `KyrithBuilds` as custom vector outlines (not live text):
   - **Kyrith** → Primary navy `#021D41`
   - **Builds** → Secondary blue `#4172F4`
   - Between “i” and “B”: small white **dot accents** on a diagonal white **stroke** (decorative connector).
3. **Tagline row** (below wordmark, part of the SVG artwork):
   - Copy: **Build. Automate. Scale.**
   - “Build.” and “Scale.” → `#021D41`
   - “Automate.” → `#4172F4`
   - Trailing **arrow** accent (black stroke in SVG).

### Circle mark (icon)

- **Outer shape:** White circle (`#FFFFFF` fill).
- **Inner K monogram:** Same four-path “K” as the full logo, scaled to fit the circle.
- **Mark colors:** Navy `#021D41` (three paths) + blue `#4172F4` (one accent path).

### Conceptual meaning (for copy, not literal logo text)

The mark reads as a stylized **“K”** for **KyrithBuilds**—geometric, forward-leaning, professional. Pair with outcome-focused copy; do not describe the logo as “just a letter K in a circle” in customer-facing material unless context requires it.

---

## Taglines — do not confuse

| Type | Copy | Where it appears |
|------|------|------------------|
| **Logo tagline** (visual, in SVG) | **Build. Automate. Scale.** | Embedded in `Full Logo.svg` only |
| **Marketing / SEO tagline** | Custom software, Bubble apps, workflow automations, MVPs, and internal tools for businesses that want to move faster and reduce manual work. | `SITE_TAGLINE` in `src/config/site.js`, meta descriptions, JSON-LD |
| **Footer blurb** | Building software, automations, and web solutions for businesses that want to move faster. | `Footer.jsx` |
| **Deprecated (Figma only)** | Idea Business | Old concept in Figma frame “Full Logo”; **do not use** |

When generating assets **with the full logo artwork**, the SVG already includes “Build. Automate. Scale.” Do not add a second tagline on top unless the layout intentionally hides the SVG tagline row.

---

## Logo colors (strict)

| Element | Hex | Token |
|---------|-----|--------|
| Navy (wordmark “Kyrith”, mark base, tagline “Build.” / “Scale.”) | `#021D41` | Primary |
| Blue (wordmark “Builds”, mark accent, tagline “Automate.”) | `#4172F4` | Secondary |
| Circle background | `#FFFFFF` | Background |
| Decorative dots / connector stroke | `#FFFFFF` / `#FEFEFE` | On light backgrounds only |
| Arrow (tagline) | `#000000` | Small accent; keep as designed |

**Backgrounds:** Default site uses light backgrounds (`#FFFFFF`, `#F5F8FF`, soft blue gradients). Full-color logo on white or `#F5F8FF` is standard.

### Dark mode (reversed) treatment

Use **`Full Logo Dark.svg`** and **`Circle Logo Dark.svg`** on navy or dark surfaces (`#021D41` primary, dark charcoal, or photo overlays with a solid backing).

| Light mode element | Dark mode mapping |
|--------------------|-------------------|
| Navy `#021D41` (mark, “Kyrith”, tagline “Build.” / “Scale.”) | White `#FFFFFF` |
| Blue `#4172F4` (“Builds”, mark accent, “Automate.”) | Unchanged `#4172F4` |
| White circle / white connector dots & stroke | Navy `#021D41` (blends on dark backgrounds) |
| Black arrow accent | White `#FFFFFF` |

**Circle mark dark:** Navy-filled circle (`#021D41`) with white K paths and blue accent—self-contained icon, no separate background needed.

**Full logo dark:** Transparent canvas; place on `#021D41` or equivalent dark fill for correct contrast.

Regenerate from light SVGs: `node scripts/generate-logo-dark.mjs` (full logo only; circle is maintained alongside).

**Figma:** Import dark SVGs into [KyrithBuilds-Logos](https://www.figma.com/design/nuav021IuUOndB9odPGP99/KyrithBuilds-Logos) as frames named `Circle Logo — Dark` and `Full Logo — Dark`, positioned below the light variants.

---

## Typography in the wordmark

The wordmark is **outlined vector paths**, not Inter or any installable font. For AI mockups:

- Match **weight:** Bold / heavy sans feel similar to Inter **700**.
- Match **case:** `KyrithBuilds` — capital **K** and **B**, no space, no hyphen.
- **Do not** set “KyrithBuilds” in a generic font and call it the logo—use the SVG or a high-res export.

Supporting UI typography elsewhere on the brand is **Inter** (see [KYRYTHBUILDS.md](./KYRYTHBUILDS.md)).

---

## Usage on the live website

| Location | Asset | Display size (approx.) | Alt text |
|----------|-------|--------------------------|----------|
| Navbar desktop (`lg+`) | Full logo | `h-9`, max-width ~200px | `KyrithBuilds` |
| Navbar mobile / tablet | Circle mark | `36×36` px (`h-9 w-9`) | `KyrithBuilds` |
| Footer | Full logo | `h-8` → `h-9` | `KyrithBuilds` |
| JSON-LD Organization | `https://kyrithbuilds.com/android-chrome-512x512.png` | 512×512 PNG | — |

Implementation: `src/components/Navbar.jsx`, `src/components/Footer.jsx`, `src/components/seo/StructuredData.jsx`.

---

## Clear space & minimum size

No formal brand manual exists in-repo; follow these practical rules derived from live usage:

- **Clear space:** At least the height of the **“K” mark** on all sides of the full logo or circle mark.
- **Minimum full logo width:** ~120 px for legibility; prefer ≥160 px in footers and decks.
- **Minimum circle mark:** 32 px (favicon); 36 px+ for UI; 192 px+ for social/app icons.
- **Do not** scale disproportionately—always lock aspect ratio (`object-contain` on web).

---

## Figma reference

| Field | Value |
|-------|--------|
| **File** | KyrithBuilds-Logos |
| **URL** | https://www.figma.com/design/nuav021IuUOndB9odPGP99/KyrithBuilds-Logos |
| **File key** | `nuav021IuUOndB9odPGP99` |
| **Frames** | `Circle Logo` (506×506), `Full Logo` (1425×322), `Full Logo New Concept` (alternate; not on site), **`Circle Logo — Dark`**, **`Full Logo — Dark`** (import from repo SVGs) |

Sync policy: When logo artwork changes, update **repo SVGs first**, then Figma. Figma may lag; trust repo SVGs for production and AI exports.

---

## AI content generation checklist

**Do**

- Use `@docs/BRAND-LOGOS.md` + `@docs/KYRYTHBUILDS.md` together for branded output.
- Export or embed **`Full Logo.svg`** / **`Circle Logo.svg`** for slides and mockups.
- Spell the name **KyrithBuilds** exactly.
- Keep logo on **light** backgrounds unless a reversed version is explicitly designed.
- Use **Build. Automate. Scale.** only when showing the full logo artwork or referring to the logo lockup—not as the primary SEO sentence.

**Don’t**

- Recreate the wordmark in Canva/Figma text layers from scratch.
- Change hex values (`#021D41`, `#4172F4`) or swap “Kyrith” / “Builds” colors.
- Use the Figma tagline **“Idea Business”**.
- Stretch, rotate, add drop shadows, gradients on the mark, or outline effects.
- Place the logo on busy photos without a solid or blurred backing plate.
- Use “React + PHP” or internal stack as brand taglines.

---

## Quick prompt snippets

Use these when instructing an AI tool:

```text
Brand: KyrithBuilds (one word, capital K and B).
Logo: Use provided Full Logo.svg — navy #021D41 + blue #4172F4.
Mark: Circle Logo.svg for square/icon contexts.
Logo tagline in artwork: "Build. Automate. Scale."
Marketing description: practical software studio, custom apps, Bubble, automations, MVPs.
Background: light (#FFFFFF or #F5F8FF), airy, Inter for body text.
```

```text
Generate a LinkedIn banner: place Full Logo.svg top-left on #F5F8FF gradient;
headline in Inter Bold #021D41; CTA button #4172F4. Do not redraw the wordmark.
```

---

## File index (repo)

```text
src/assets/Full Logo.svg          # Primary horizontal lockup
src/assets/Full Logo Dark.svg     # Dark-background horizontal lockup
src/assets/Circle Logo.svg        # Icon / mobile mark
src/assets/Circle Logo Dark.svg   # Dark-background circle mark
scripts/generate-logo-dark.mjs    # Regenerate Full Logo Dark from light SVG
src/assets/favicon_io/            # Source favicon exports
public/favicon.ico
public/favicon-16x16.png
public/favicon-32x32.png
public/apple-touch-icon.png
public/android-chrome-192x192.png
public/android-chrome-512x512.png   # Schema.org logo URL
public/site.webmanifest           # theme_color #021D41
```

---

*Last synced from repo SVGs, live site components, and Figma file `nuav021IuUOndB9odPGP99`. Update when logo files, taglines, or placement change.*
