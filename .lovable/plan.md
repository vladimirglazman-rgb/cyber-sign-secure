# Infographic-inspired sections on landing page

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
