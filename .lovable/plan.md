# Add "Success Story" section below Loom video

## Scope
Frontend-only edit to `src/routes/index.tsx`. No auth, API, or DB changes. No existing buttons or sections removed.

## Steps

1. Copy the uploaded flowchart (`user-uploads://image-18.png`) into `src/assets/mnit-flowchart.png` and import it as an ES6 module in `src/routes/index.tsx`.

2. In `src/routes/index.tsx`, insert a new `<section>` immediately AFTER the Loom video container `<div>` and BEFORE the CTA buttons block (`mt-10 flex flex-col items-center gap-3 sm:flex-row`).

3. Section structure (cyberpunk styled, RTL):
   - Outer wrapper: `mt-20 w-full max-w-5xl` with `dir="rtl"`.
   - Heading block (centered, mirrors the existing "Tech Stack" pattern): small chip "Success Story" + `<h2>` "הכירו את סיפור ההצלחה של MNIT Sign" with `text-primary text-glow` accent, plus the gradient divider line.
   - Content grid: `grid gap-6 md:grid-cols-2 items-center` inside a `glass-panel p-6`.
     - Right column (first in RTL): `<h3>` "זרימת עבודה חכמה" + short Hebrew paragraph (~2–3 sentences) describing the automated flow: upload → smart recipient setup → secure 2FA signing → real-time status & WhatsApp follow-ups.
     - Left column: flowchart `<img>` with `rounded-xl border border-primary/30 glow-aqua`, descriptive Hebrew alt text, `loading="lazy"`.

4. Reuse existing tokens only: `glass-panel`, `text-primary`, `text-glow`, `glow-aqua`, `border-primary/*`, `font-display`, `text-muted-foreground`. No new colors or CSS.

## Out of scope
No changes to TopBar, CTAs, Tech Stack, footer, routes, backend, or styles.css.
### Pure UI Cosmetic Fix: Color the Pins by Index

**What:** Inside `src/components/mnit/SignerPdfViewer.tsx`, color each pin badge based on its array index within the existing `.map()` loop.

**How:**
1. In the `pinsForPage.map(({ c, idx }) => ...)` block, derive a color class string from `idx`:
   - `idx === 0` → teal (`bg-teal-500`, `border-teal-600`, `text-teal-700`)
   - `idx === 1` → purple (`bg-purple-500`, `border-purple-600`, `text-purple-700`)
   - `idx === 2` → green (`bg-green-500`, `border-green-600`, `text-green-700`)
   - `idx >= 3` → orange (`bg-orange-500`, `border-orange-600`, `text-orange-700`)

2. Apply the chosen color classes to:
   - The `MapPin` icon fill/text color
   - The pin label box background, border, and text

**Constraints respected:**
- No data fetching logic is touched.
- No pin filtering or array manipulation is changed.
- Only Tailwind classNames inside the existing map render path are modified.
