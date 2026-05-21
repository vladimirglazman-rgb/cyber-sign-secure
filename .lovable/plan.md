# Fix signature verification modal: button contrast + close (X)

File: `src/components/mnit/AuditModal.tsx`

## 1. Restyle the two action buttons

Current "פתח מסמך מקור" (anchor) and "הורד מסמך חתום" (button) use a faint
`bg-primary/15 text-primary` combo that disappears on the dark glass panel.
Swap them to a solid, high-contrast pill:

- Background: `bg-primary` (solid)
- Text: `text-primary-foreground` (white-on-brand)
- Border: drop the translucent `border-primary/60`, keep rounded shape
- Hover: `hover:bg-primary/90`
- Keep size, icon, spacing, and disabled state intact

Applies to both the `<button>` (download) and the `<a>` (open source).
No copy, no handler, no layout changes.

## 2. Make the close (X) actually close the modal

The dialog content uses fixed full-screen sizing on mobile
(`fixed inset-0 ... p-6`). The Radix-provided `DialogPrimitive.Close` (the X)
is positioned `absolute right-4 top-4` inside that content, but the modal's
inner scroll container + the header layout currently overlap it, so the click
lands on a sibling element instead of the close button.

Fix without touching the shared `dialog.tsx`:
- Add a thin top spacer / ensure the header doesn't sit under the X by giving
  `DialogHeader` right padding (`pr-10`) so the title row clears the X.
- Add an explicit `DialogClose` (imported from `@/components/ui/dialog`) as a
  visible top-left button inside the content with `z-10`, `relative`
  positioning, solid styling matching the new action buttons, and an aria
  label — guarantees a clickable close target regardless of stacking.
- Verify nothing in the content uses `pointer-events-none` or a higher z-index
  that would sit above the Radix close.

No business logic, audit data fetching, signature rendering, or download flow
is modified.

## Out of scope

- Audit fetch (`getDocumentAudit`) and download (`downloadSignedDocument`)
- Recipient list rendering, signature image, IP/timestamp formatting
- Any other modal or page
# Tech Stack Cleanup Plan

## Goal
Refactor the Technology Stack section at the bottom of the landing page (`src/routes/index.tsx`) into a clean, minimal, premium badge/pill layout.

## Changes

### 1. Section Title
Keep the existing Hebrew title:
```
<span class="italic text-primary">הטכנולוגיה</span> שמאחורי המערכת
```

### 2. Tech Badge Grid (replaces the 3-column card grid)
Replace the current `{ icon, name, desc }` card grid with a single centered flex-wrap container of minimalist pill badges.

Each badge:
- Text content: crisp English tech name only (e.g. "React", "Vite", "Tailwind CSS", "Supabase", "AI Engine", "Cloudflare")
- Style: `bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium`
- Container: `dir="ltr"` so English names render left-to-right naturally
- Layout: centered flex-wrap row with gap-3

### 3. Remove "Lovable"
Verify the footer and tech stack area contain no mention of "Lovable".

### 4. Out of Scope
- Hero section
- 4-step workflow
- MVP capabilities section
- Header / navigation
- Footer links and copyright
- Any buttons or routing

## Technical Details
- Remove the `Code2`, `Paintbrush`, `Database`, `Brain`, `Cloud` icon imports if they become unused after removing the cards.
- The pills container will sit directly under the section title and divider, inside the existing `<section>`.
