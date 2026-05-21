# Fix duplicate / broken close button in AuditModal

## Problem

`src/components/mnit/AuditModal.tsx` currently renders two close affordances:

1. A custom blue circular `DialogClose` added at top-left.
2. The built-in gray X from the shared `DialogContent` at top-right.

Neither closes the modal. The custom `DialogContent` className uses
`fixed inset-0 ... z-[100]` on mobile and a glass panel on desktop. Inner
content layers (header, scroll container, glass background) cover the
built-in Radix close button, so pointer events never reach it.

## Changes (single file)

`src/components/mnit/AuditModal.tsx` only:

1. Remove the custom top-left close block entirely, and drop `DialogClose`
   from the `@/components/ui/dialog` import.
2. Keep `DialogHeader` right-padded so the title clears the single top-right X.
3. Force the built-in top-right close button to sit above all modal layers
   without editing the shared dialog primitive: add an arbitrary-selector
   utility on `DialogContent` that targets its descendant close button and
   sets `position: relative`, `z-index: 50`, and `pointer-events: auto`.
   Concretely, append a Tailwind arbitrary selector class to the
   `DialogContent` className that targets the inner close button (matched
   by its `absolute right-4 top-4` positioning) and bumps its stacking and
   pointer events.
4. Preserve the high-contrast action buttons ("פתח מסמך מקור" /
   "הורד מסמך חתום") exactly as they are.
5. The close click flows through Radix's built-in `DialogPrimitive.Close`,
   which fires `onOpenChange(false)` — the exact prop passed by the parent.
   No new local state is introduced.

## Out of scope

- The shared `src/components/ui/dialog.tsx` (no edits, keeps every other
  dialog stable).
- Audit fetch, download handler, signature image, recipient list,
  IP/timestamp formatting.
- Any other modal or page.