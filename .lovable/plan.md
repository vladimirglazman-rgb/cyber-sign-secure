## Goal

On the client-facing signing page (`/sign/$token`), each pin should use the same vibrant per-recipient color (cyan, purple, orange, pink, lime, amber) as the Document Setup page, instead of the single dark blue. Pin marker, glow, label border, label background, and label text all adopt that color. Pin count, filtering, and signature logic stay unchanged.

## Changes

### 1. `src/server/signing.functions.ts` — attach a stable color index per pin

In `verifySigner`, when building `coordinates`:
- Order the "all recipients" query with `.order("created_at", { ascending: true })` so each recipient gets the same index as in setup (recipients are inserted in array order).
- For each recipient at index `i`, attach `colorIndex: i` to every pin alongside the existing `label`.
- Extend the local coord type to `{ pageNumber, x, y, label, colorIndex }`.

No other server logic changes.

### 2. `src/components/mnit/SignerPdfViewer.tsx` — render pins in recipient color

- Extend `SigCoord` with `colorIndex?: number`.
- Import `getRecipientColor` from `@/lib/recipient-colors`.
- For each unsigned pin, resolve `const color = getRecipientColor(c.colorIndex ?? 0)` and apply:
  - `MapPin` → `style={{ color: color.hex, filter: color.glow }}` and `fill={color.fill}`.
  - Label badge → inline `borderColor: color.border`, `backgroundColor: color.bg`, `color: color.text` (replacing the `border-primary/60 bg-background/90 text-primary` classes for this badge only).
- Signed-state badge (the "נחתם ✓" dark blue marker) stays exactly as-is — it's a completion indicator, not a per-recipient identifier.

### 3. No other files touched

`sign.$token.tsx`, recipients query elsewhere, click/submission logic, and signed-state rendering all remain untouched. Pure cosmetic change scoped to the unsigned pin marker + its label.

## Verification

- Open a signing link for a 3-recipient document → see 3 differently colored pin sets matching the setup page colors.
- Pin count and click-to-sign flow unchanged.
- Already-signed pins still render the dark blue "נחתם ✓" badge.
