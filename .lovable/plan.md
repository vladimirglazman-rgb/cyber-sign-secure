# Fix: Hide AuditModal When Closed (Mobile Regression)

## Problem
After the previous full-screen mobile fix, the `DialogContent` in `AuditModal` uses `fixed inset-0 z-[100] bg-background w-full h-full`. When the dialog closes, the closing animation classes (`data-[state=closed]:animate-out fade-out-0 ...`) leave the element painted during/after the transition, and the full-viewport opaque background covers the dashboard.

## Scope
Tailwind classes / conditional rendering only in `src/components/mnit/AuditModal.tsx`. No backend, data, or routing changes.

## Change

In `src/components/mnit/AuditModal.tsx`, on the `DialogContent` className:

1. Add `data-[state=closed]:hidden` so the element is fully removed from the layout/paint as soon as Radix flags it closed (overrides any lingering animate-out visibility).
2. Drop the conflicting closing-animation classes that are inherited from the base `DialogContent` by using state-scoped resets where needed (`data-[state=closed]:animate-none`) so the opaque full-screen container never lingers visible.
3. Keep the existing open-state styling intact:
   - Mobile: `fixed inset-0 z-[100] left-0 top-0 translate-x-0 translate-y-0 w-full h-full max-w-none max-h-none bg-background overflow-y-auto p-6 rounded-none`
   - Desktop (`sm:`): centered glass modal as before (`sm:left-[50%] sm:top-[50%] sm:translate-x-[-50%] sm:translate-y-[-50%] sm:h-auto sm:max-h-[90vh] sm:max-w-2xl sm:rounded-2xl sm:bg-transparent sm:glass-panel`).
4. Preserve `dir="rtl"`.

## Expected result
- When the audit modal is closed, nothing from it remains visible on mobile — the dashboard is fully usable.
- When opened on mobile, it still covers the full viewport with the opaque background.
- Desktop centered glass modal behavior is unchanged.
