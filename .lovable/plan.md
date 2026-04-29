
# MNIT Sign — Phase 0 Implementation Plan

A fully interactive UI shell for the "Send for Signature" workspace. Local state only — no backend, no persistence. The goal is to lock in the Cyber-Legal visual language and confirm the 3-step flow feels right before wiring data in Phase 1.

## 1. Visual Foundation

**Design tokens** (in `src/styles.css`, replacing the default slate palette):
- `--background`: deep navy `#000B18`
- `--primary` (Aqua): `#30FFF7` — borders, glows, active states, CTA
- `--secondary` (Metallic Silver): `#B0C1CE` — body text, icons
- `--card`: glass tint `rgba(10, 40, 70, 0.4)`
- `--border`: cyan at 20% opacity
- Radius: `16px` default (xl)

**Glassmorphism utility** — single reusable class (`.glass-panel`) applied to every panel:
- `background: rgba(10,40,70,0.4)`
- `backdrop-filter: blur(12px)`
- `border: 1px solid rgba(48,255,247,0.25)`
- `box-shadow: 0 0 24px rgba(48,255,247,0.08), inset 0 0 1px rgba(48,255,247,0.4)`

**Aqua Glow utility** (`.glow-aqua`) for the CTA and focus rings — heavy outer cyan box-shadow plus subtle gradient.

**Typography**:
- Headings: `Orbitron` (futuristic, bold) — loaded from Google Fonts
- Body / Hebrew: `Heebo` — strong Hebrew support, clean Latin fallback
- Both wired into `styles.css` via `@import` and exposed as `font-display` / `font-body` utility families.

## 2. Animated Background Grid

A persistent, fixed-position layer behind all content:
- Pure CSS: two repeating linear-gradients forming a grid of cyan lines at ~5% opacity, 40px cells.
- Subtle `@keyframes` translating the grid diagonally over 30s for a slow drift.
- A second layer: radial gradient "node glows" using `background-size` + slow pulse animation.
- Component: `<AnimatedGrid />` mounted once in `__root.tsx`.

GPU-friendly (transform + opacity only), `pointer-events: none`, respects `prefers-reduced-motion`.

## 3. Layout Shell (RTL-first)

`__root.tsx` sets `<html lang="he" dir="rtl">` so the entire app flips by default. All spacing uses logical Tailwind utilities (`ms-*`, `me-*`, `ps-*`, `pe-*`) so the layout mirrors cleanly if English is enabled later.

**Top bar** (full width, glass): MNIT Sign logo (Orbitron + cyan drop-shadow), notification bell, user chip ("Alex / Freelancer").

**Workspace grid** below the top bar:
```text
┌──────────┬──────────────────────┬──────────┐
│ Sidebar  │   3-Step Workflow    │ Preview  │
│  (right  │      (center)        │  (left   │
│  in RTL) │                      │  in RTL) │
└──────────┴──────────────────────┴──────────┘
```
Desktop: `grid-cols-[280px_1fr_360px]`. Tablet/mobile: stacks to single column with the preview last.

## 4. Components to Build

All under `src/components/mnit/`:

**Sidebar**
- `Sidebar.tsx` — branding + stats grid + activity list + templates list
- `StatTile.tsx` — glass tile with glowing Lucide icon, label, big number (Total / Signed / Sent / Pending)
- `ActivityItem.tsx` — avatar, name, timestamp, status dot (green=signed, amber=pending)

**Workflow (center)**
- `StepCard.tsx` — generic glass card with numbered cyan badge + title
- `Step1Upload.tsx` — drag-and-drop zone with dashed cyan border that intensifies on `dragOver`; "Browse files" button opens hidden `<input type="file" multiple>`; uploaded files render as removable chips with file icon, name, size
- `Step2Recipients.tsx` — dynamic list of recipient rows (Name / Email / Role select [Signer | CC] / remove); "+ הוסף נמען" button appends a row; "Sign in Order" toggle on the right
- `Step3Settings.tsx` — Subject input, Email Message textarea, "Set Reminders" toggle with frequency select (1/3/7 days)

**Preview (left in RTL)**
- `DocumentPreview.tsx` — framed glass panel showing the currently selected uploaded file's name; placeholder document mockup with shimmering cyan signature lines; page indicator "1 of 1"; clicking an uploaded chip in Step 1 swaps the preview

**Footer bar**
- "← חזור" ghost button + glowing "שלח לחתימה" CTA. CTA is disabled until: ≥1 file uploaded AND ≥1 valid recipient (name + email regex) AND subject not empty. On click → `sonner` toast success and a confetti-style cyan pulse on the CTA, then form resets.

## 5. State Management

Single `useSignatureRequest` hook (in `src/hooks/use-signature-request.ts`) holding:
- `files: UploadedFile[]`
- `recipients: Recipient[]` (default: one empty row)
- `signInOrder: boolean`
- `subject: string`, `message: string`
- `reminders: { enabled: boolean; days: 1|3|7 }`
- `selectedFileId: string | null` (drives preview)
- Derived: `canSend` boolean
- Actions: `addFiles`, `removeFile`, `addRecipient`, `updateRecipient`, `removeRecipient`, `reset`

No Zustand needed — `useState` + `useMemo` inside the hook is sufficient for Phase 0 and keeps the upgrade path to a server mutation trivial.

## 6. RTL & Typography Polish

- All copy in Hebrew: "שלח לחתימה", "העלה מסמכים", "הוסף נמענים", "נושא", "הודעת אימייל", "חתום לפי הסדר", "הגדר תזכורות", סטטיסטיקות, וכו'.
- Numbers and email addresses kept LTR via `<bdi>` wrappers so file sizes ("2.1 MB") and emails don't reverse.
- Lucide icons that imply direction (chevrons, arrows in the back button) get `rtl:scale-x-[-1]` so they flip.
- Form inputs: `dir="auto"` so emails stay LTR while Hebrew names render RTL inside the same field.
- Focus rings use the aqua glow, not the default browser ring.

## 7. Routes

Single route this phase: `src/routes/index.tsx` → renders `<Workspace />`. The marketing landing page and `/app` split is deferred. Page metadata in `head()`: title "MNIT Sign — חתימה דיגיטלית מאובטחת".

## 8. Out of Scope (Phase 1+)

- Supabase wiring (auth, document storage, recipient persistence, send action)
- Real PDF rendering in the preview
- Templates page, Documents page, Settings page (sidebar links exist but are visual only)
- Language switcher / English translations
- Authentication & user profile

## 9. Acceptance Criteria

1. Page loads in RTL with Hebrew labels, dark navy bg, and a visibly drifting cyan grid behind glass panels.
2. Drag-and-drop accepts files, shows them as chips, and clicking a chip updates the preview heading.
3. Adding/removing recipients works; "Sign in Order" toggle visibly changes state.
4. CTA is disabled until validation passes; clicking it shows a success toast and resets the form.
5. At ≤768px, the three columns stack vertically without horizontal scroll.
6. No console errors; Lighthouse "reduced motion" disables grid animation.
