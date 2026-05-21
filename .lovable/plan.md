# Ultimate close fix for AuditModal

## Problem

The signature verification modal's visible X is still not clickable because it
is rendered as a floating/absolute close control outside or above the wrong
visual layer. It can end up outside the white modal card area or underneath a
layer that intercepts pointer events.

## Changes

Edit `src/components/mnit/AuditModal.tsx` only.

1. Stop relying on the shared `DialogContent` built-in absolute close button for
   this modal by hiding that descendant close button from this modal's
   `DialogContent` className.
2. Add exactly one close button inside the modal's own content, in the top
   header row of the white/modal card area.
3. Use a normal lucide `X` icon, not a custom floating circular clone.
4. Wire the click directly to the parent dismissal prop already used by the
   component:

   ```tsx
   onClick={() => onOpenChange(false)}
   ```

5. Apply the requested interaction guarantees to the real button:

   ```text
   relative z-[9999] pointer-events-auto cursor-pointer p-2
   ```

6. Keep the existing high-contrast document action buttons unchanged:
   `bg-primary text-primary-foreground shadow hover:bg-primary/90`.

## Out of scope

- No edits to `src/components/ui/dialog.tsx`.
- No changes to audit trail text, signature image rendering, timestamps, IP
  display, downloads, fetches, verification logic, or backend code.