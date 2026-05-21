# CSS-Only Button Contrast Fix — AuditModal

## Goal
Improve text readability of the two action buttons inside the signature verification modal by switching them to high-contrast solid colors.

## Changes
In `src/components/mnit/AuditModal.tsx`, update **only** the `className` attributes of:

1. **"הורד מסמך חתום"** button (line ~130)
2. **"פתח מסמך מקור"** anchor (line ~145)

### Class updates for both elements
- Replace `bg-primary` with `bg-blue-600`
- Replace `text-primary-foreground` with `text-white`
- Replace `hover:bg-primary/90` with `hover:bg-blue-700`
- Keep all other classes, structural markup, `onClick` handlers, and modal wrapper exactly as-is.

## Out of scope
- Modal wrapper / `DialogContent`
- Close (X) button / `DialogClose`
- `DialogHeader` layout
- Any event handlers or logic
- Any other component or page
