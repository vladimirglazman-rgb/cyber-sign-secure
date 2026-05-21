# Fix: AuditModal X button does nothing

## Root cause

`ActivityItem` renders the signed-document row as a clickable `<li>` with
`onClick={() => setAuditOpen(true)}`. `AuditModal` is rendered as a child of
that same `<li>`.

Radix portals `DialogContent` to `document.body` in the DOM, but **React
synthetic events still bubble through the React tree**. So when the user
clicks the built-in `<DialogPrimitive.Close>` (the X), the sequence is:

1. Radix `onOpenChange(false)` fires → `setAuditOpen(false)`.
2. The click event keeps bubbling up the React tree and hits the `<li>`'s
   `onClick`, which calls `setAuditOpen(true)` again.
3. Net result: the modal reopens on the same tick and looks unresponsive.

The state wiring itself (`open`/`onOpenChange` between `ActivityItem` and
`AuditModal` → `Dialog`) is already correct. The bug is the parent row's
click handler swallowing every click that happens inside the portaled modal.

## Fix (single file: `src/components/mnit/ActivityItem.tsx`)

Render `<AuditModal>` outside the clickable `<li>` so its event tree no
longer bubbles into the row's `onClick`. Concretely:

- Wrap the current `<li>` and the `<AuditModal>` in a React fragment.
- Move `{isSigned && <AuditModal ... />}` to be a sibling of `<li>`, not a
  child.

No style changes. No changes to `AuditModal.tsx`, `dialog.tsx`, routes, or
any other file. The `Dialog open={open} onOpenChange={onOpenChange}` wiring
inside `AuditModal` already works — it just needs to stop being re-triggered
by the parent row.

## Out of scope

- `src/components/ui/dialog.tsx`
- `AuditModal.tsx` internals (close button, layout, styles)
- Any other component or route
# Modal Close Button Structural Reset — AuditModal

## Goal
Restore the signature verification modal to the default shadcn/Radix Dialog structure with a single, working native close (X) button — top-right, clickable above the overlay.

## Scope
Only `src/components/mnit/AuditModal.tsx`. No changes to `dialog.tsx`, `index.tsx`, sidebar, or global CSS.

## Changes

1. **Simplify `<DialogContent>` className** — remove the heavy custom override classes (`fixed inset-0`, `translate-x-0`, `data-[state=closed]:hidden`, `sm:bg-transparent sm:glass-panel`, `border-primary/30`, etc.) that conflict with the default Radix positioning and obscure the built-in close button. Keep only minimal additions on top of the shadcn defaults:
   - `dir="rtl"`
   - `className="max-w-2xl max-h-[90vh] overflow-y-auto"`

2. **Remove `pr-10` from `<DialogHeader>`** — no longer needed once default layout is restored.

3. **Verify no custom close buttons exist** — confirm there are no extra `<DialogClose>`, circular `×`, or floating close elements in the JSX. The native close button shipped by `DialogContent` in `src/components/ui/dialog.tsx` is the only close affordance.

4. **Click reliability** — the default `<DialogPrimitive.Close>` in `dialog.tsx` is already `absolute right-4 top-4`. Once the custom `fixed inset-0 ... z-[100]` content classes are removed, it sits above the overlay (overlay is `z-50`, content is `z-50`, close is inside content) and is naturally clickable. No `dialog.tsx` edits needed.

## Out of scope
- `src/components/ui/dialog.tsx`
- The two action buttons' styling (already fixed)
- Audit data fetching, signature rendering, download logic
- Any other file
