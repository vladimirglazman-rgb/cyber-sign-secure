# Replace placeholder icons with uploaded images

## Scope
Frontend-only edit to `src/routes/index.tsx` (project has no `src/pages/Index.tsx`). Also copy 3 uploaded images into `src/assets/`. No other files touched.

## Steps

1. **Copy uploads into the repo** (so they bundle via Vite):
   - `user-uploads://image-24.png` → `src/assets/mnit-robot-handshake.png` (robot + human handshake hero)
   - `user-uploads://image-27.png` → `src/assets/mnit-sender-ux.png` (sender UI screenshot)
   - `user-uploads://image-25.png` → `src/assets/mnit-mobile-ux.png` (mobile UI screenshot)

2. **`src/routes/index.tsx` — add 3 ES6 image imports** alongside existing imports:
   ```ts
   import robotHandshakeImg from "@/assets/mnit-robot-handshake.png";
   import senderUxImg from "@/assets/mnit-sender-ux.png";
   import mobileUxImg from "@/assets/mnit-mobile-ux.png";
   ```

3. **Replace 3 icon placeholders inside the infographic section** (keep all wrappers, glass tiles, borders, glow, and aspect ratios identical — only swap the inner `<Icon />` for an `<img>`):
   - **"הפתרון — תהליך דיגיטלי חלק"** card: replace the centered `<Handshake />` icon with `<img src={robotHandshakeImg} alt="MNIT robot handshake" className="h-full w-full object-cover rounded-xl" loading="lazy" />`.
   - **"שלב השולח (Sender UX)"** column (rendered from the `cards` array): for that single card, render the sender screenshot instead of the `LayoutDashboard` icon — `<img src={senderUxImg} alt="Sender UX" className="h-full w-full object-cover rounded-xl" loading="lazy" />`.
   - **"תצוגת מובייל"** column: same pattern, swap the `Smartphone` visual for `<img src={mobileUxImg} alt="Mobile UX" className="h-full w-full object-contain rounded-xl" loading="lazy" />` (contain — keeps the phone mockup uncropped).

4. **Implementation note for the 3-column grid:** the current code maps a `cards` array and renders `<c.visual />` for every column. To support per-card images without touching the third (Tech Stack) column, extend each item with an optional `image?: string` + `fit?: "cover" | "contain"` field, then render `image ? <img ... /> : <c.visual ... />`. The Tech Stack column keeps its `Code2` icon unchanged.

## Out of scope
- The small header icon (`Sparkles` next to "הפתרון" heading) stays — only the large visual tile is replaced.
- "הבעיה" card, Tech Stack column, roadmap strip, hero, CTAs, TopBar, footer — all untouched.
- No styling tokens, no `styles.css`, no routing, no backend.

## Scope
Frontend-only edit to `src/routes/index.tsx` (the landing page; project does not have `src/pages/Index.tsx`). No changes to routing, auth, API, DB, or any other component.

## Insertion point
Insert all new content as one wrapper, immediately AFTER the Loom video container `<div>` and BEFORE the existing CTA block (`mt-10 flex flex-col items-center gap-3 sm:flex-row`). Existing buttons, TopBar, Tech Stack, and footer remain untouched.

## New content (RTL, cyberpunk styled with existing tokens)

1. **Section title (centered)**
   - Small chip "Infographic" + `<h2>` "MNIT Sign — פתרון UX לחתימה דיגיטלית חכמה על חוזי שכירות" with `text-primary text-glow` accent.
   - Gradient divider line below, matching the Tech Stack pattern.

2. **"הבעיה מול הפתרון" — two-column grid** (`grid gap-6 md:grid-cols-2`, both cards `glass-panel p-6 text-right`)
   - Right card: heading "הבעיה — בירוקרטיה מסורבלת" + Hebrew paragraph about slow, messy paper flow between שוכר/ערבים/מועד. Icon: `FileWarning` (lucide) in a muted/destructive tint ring.
   - Left card: heading "הפתרון — תהליך דיגיטלי חלק" + Hebrew paragraph about AI-assisted secure signing. Icon: `Sparkles` in primary tint ring.
   - Generic visual placeholder per card: a small `aspect-video` div with `glass-panel`, gradient background, and a centered lucide icon (e.g. `Files` / `Handshake`) — no external images.

3. **"חוויית המשתמש (UX) ב-MNIT Sign" — three-column grid** (`grid gap-4 md:grid-cols-3`, each `glass-panel p-6 text-right`)
   - Col 1 — Sender UX: heading "שלב השולח (Sender UX)" + Hebrew text "הגדרת החוזה והחותמים". Icon `Users`. Placeholder visual: `aspect-[4/3]` glass tile with `LayoutDashboard` icon.
   - Col 2 — Mobile UX: heading "תצוגת מובייל" + Hebrew text "תהליך חתימה ברור". Icon `Smartphone`. Placeholder visual: `aspect-[4/3]` glass tile with `Smartphone` icon.
   - Col 3 — Tech Stack & Security: heading "טכנולוגיה ואבטחה" + short Hebrew text mentioning React, Tailwind, Supabase. Icon `ShieldCheck`. Placeholder visual: `aspect-[4/3]` glass tile with `Code2` icon row.

4. **"העתיד — מפת דרכים" — bottom strip** (single `glass-panel p-6` with `grid gap-4 md:grid-cols-3 text-center`)
   - Tile 1: `MessageCircle` icon + "WhatsApp Integration".
   - Tile 2: `Activity` icon + "Real-time Status".
   - Tile 3: `Repeat` icon + "Automated Follow-ups".
   - Short Hebrew summary line above or below the grid.

## Styling rules
- Reuse existing tokens only: `glass-panel`, `text-primary`, `text-glow`, `glow-aqua`, `border-primary/*`, `font-display`, `text-muted-foreground`, `icon-glow`.
- All new wrappers use `dir="rtl"` and `text-right`.
- No new CSS in `styles.css`. No external image files — all visuals are lucide icons in glass tiles.
- New lucide imports added to the existing import block: `FileWarning`, `Files`, `Users`, `LayoutDashboard`, `MessageCircle`, `Activity`, `Repeat`. (`Sparkles`, `Smartphone`, `ShieldCheck`, `Code2`, `Handshake` already imported.)

## Out of scope
TopBar, hero, existing CTAs, Tech Stack section, footer, routes, backend, styles.css, and any viewer/app components.
