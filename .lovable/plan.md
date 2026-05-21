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
