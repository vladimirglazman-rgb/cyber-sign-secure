# Fix RTL vertical-text bug in "פעילות אחרונה" sidebar

## Problem

After the editorial-theme refresh, the right-side dashboard sidebar that hosts
the statistics tiles and "פעילות אחרונה" list renders Hebrew text broken into
single letters per line. The root cause is a combination of three things
introduced/left over from the cyber theme:

1. `font-display` (now `Playfair Display, Georgia, "Heebo", serif`) on Hebrew
   text. Playfair/Georgia don't ship Hebrew glyphs, so every Hebrew character
   falls back individually to Heebo. Mixed with `tracking-[0.2em]` /
   `tracking-[0.25em]` letter-spacing, each glyph becomes its own break
   opportunity in a narrow 280px column.
2. Several text containers inside the sidebar/activity items are missing
   `min-w-0`, so a long unbroken Hebrew filename collapses the flex item to
   width 0 and the browser wraps one character per line.
3. The activity list `<ul>` uses `overflow-y-auto` without a defined
   `min-w-0`, which compounds the collapse on the inner items.

## Scope

Frontend / presentation only. No logic, data fetching, routing, or backend
changes. Files touched:

- `src/components/mnit/Sidebar.tsx`
- `src/components/mnit/ActivityItem.tsx`
- `src/components/mnit/StatTile.tsx`

## Changes

### `src/components/mnit/Sidebar.tsx`

- Section headings ("סטטיסטיקה", "פעילות אחרונה"): swap `font-display` →
  `font-body`, drop `uppercase` and `tracking-[0.2em]` (Hebrew shouldn't be
  letterspaced or uppercased — both are no-ops or harmful for Hebrew). Keep
  `text-sm font-semibold text-primary`.
- Header button: add `min-w-0`; wrap the label in a `<span class="truncate
  text-right">` so the chevron stays right-aligned and the label never wraps.
- Activity `<ul>`: add `w-full min-w-0` so children inherit a real width.
- Admin link label: same font-display → font-body swap, drop tracking; keep
  it as a single `whitespace-nowrap` line.
- Footer version pill: drop `tracking-[0.18em]` and `font-display` for the
  same reason (Hebrew-adjacent text in a tiny pill).

### `src/components/mnit/ActivityItem.tsx`

- Outer `<li>`: add `w-full min-w-0`.
- Inner row wrapper: add `min-w-0` and ensure the right-side meta column has
  `shrink-0` so it doesn't push the filename column to 0.
- Filename + subject paragraphs: keep `break-words` but add `text-right` and
  `min-w-0` on the parent `<div>` so wrapping happens at word boundaries
  rather than per-character.
- Pending-signer rows: add `w-full min-w-0`; give the name span `truncate`
  and the two action buttons `shrink-0 whitespace-nowrap` so "העתק קישור" and
  "וואטסאפ" stay on one line.
- "גרסה" / "פרטי חתימה" small labels: drop `font-display` and
  `tracking-wider`; replace with plain `font-body text-[10px]`.

### `src/components/mnit/StatTile.tsx`

- Drop `uppercase tracking-[0.2em]` on the Hebrew label; keep `text-[10px]
  text-muted-foreground`. Add `truncate` so a wider word like "ממתינים"
  cannot wrap per-character in the 130-ish-pixel tile.

## Verification

After the patch, on the dashboard (`/app`) at the current 1377px viewport:

- The right column shows "פעילות אחרונה" as a single horizontal Hebrew
  heading, the chevron toggle still flips on click.
- Activity items show filename + subject as normal RTL paragraphs, status
  badge + date stay aligned to the right edge of the row.
- "העתק קישור" and "וואטסאפ" pills sit on one horizontal line next to the
  signer name without wrapping.
- StatTile labels ("סה״כ", "נחתמו", "ממתינים", "בוטלו") are single-line.
- No background/color changes — editorial theme remains intact.
# Editorial Theme Refresh (Landing Page)

Shift the landing page from the neon "cyber" look to a premium **Digital Tech Editorial** newspaper style — light paper background, dark editorial type, serif headlines, hairline gray dividers. Pure visual changes; no logic, routing, or data touched.

## Scope

- `src/styles.css` — design tokens, base body color, utility classes (`glass-panel`, `glow-aqua`, `text-glow`, `icon-glow`, `cyber-grid`, `animate-pulse-glow`).
- `src/routes/index.tsx` — landing page markup (background overlay, hero, feature tiles, tech-stack section, footer).
- Other routes/components are **not** changed in this pass (auth, app dashboard, modals, etc.) to keep the change tightly scoped to what the user is reviewing.

## Visual direction

- Background: warm paper white `#fdfdfb`.
- Foreground text: charcoal `#1a1a1a`; muted text: `#5b5b5b`.
- Accent (links, small highlights): restrained ink blue `#1d4ed8` — used sparingly, no glow.
- Headlines: bold serif (Playfair Display) for an editorial headline feel.
- Body: keep Heebo for Hebrew support, weight 400/500.
- Borders: hairline `#e5e7eb` (gray-200). No drop shadows, no neon, no backdrop blur.
- Replace dark "glass" cards with white cards, generous padding, 1px gray borders, subtle radius.

## Changes by file

### `src/styles.css`
- Swap the Orbitron import for **Playfair Display** (display) + keep Heebo (body).
- Rewrite `:root` tokens in oklch to light editorial palette (background near-white, foreground charcoal, primary ink blue, muted warm gray, borders gray-200).
- Set `body` background to `#fdfdfb`, color to charcoal.
- Neutralize neon utilities so existing class names keep working but render flat:
  - `.glass-panel` → white background, 1px `#e5e7eb` border, no blur, no glow.
  - `.glow-aqua`, `.text-glow`, `.icon-glow`, `.animate-pulse-glow`, `pulse-glow`, `pulse-required`, `asterisk-glow` → no-op (no shadow / no animation / inherit color).
  - `.cyber-grid` and its `::after` → transparent (kept so existing markup doesn't break) or rendered as an extremely faint paper grain.
- `--font-display` → `"Playfair Display", Georgia, serif`.

### `src/routes/index.tsx`
- Remove the decorative SVG network overlay (or keep the element but render nothing) so the page reads as clean paper.
- Header: replace aqua pill chrome with subtle border-gray-200 buttons; primary CTA becomes solid charcoal/ink-blue button with no glow.
- Hero: drop the giant translucent handshake glyph; large serif H1 in charcoal, "CYBER AI" highlighted via ink-blue color (no glow). Mobile-badge chip uses thin gray border.
- Loom video frame: replace `glow-aqua` with `border border-gray-200 rounded-xl`.
- Feature tiles + Tech Stack cards: white cards, `border border-gray-200`, generous `p-8`, no hover glow — hover lifts only via slightly darker border.
- Footer: thin gray top border, muted gray text, ink-blue link hover (no text-glow).

All Tailwind class swaps; no JSX structure / props / handlers / imports of logic change. `UserManualModal`, auth/session calls, and routing are untouched.

## Out of scope (intentionally)

- Auth page, `/app` dashboard, signature modals, signer PDF viewer, admin pages.
- Any backend, server functions, Supabase config.
- Component refactors beyond className/style edits.

If you want the editorial theme propagated into the authenticated app shell and modals too, say so after reviewing this pass and I'll do it as a follow-up.
