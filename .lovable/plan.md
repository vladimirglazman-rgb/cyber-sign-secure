# Fix: Full-Screen Signed Document Modal on Mobile

## Goal
Fix the mobile overlay bug shown in the screenshot: when opening a signed document, the audit/document modal only covers part of the screen and the dashboard remains visible on the side.

## Scope
Tailwind UI classes only. No backend logic, no data fetching, no routing changes.

## File to update
`src/components/mnit/AuditModal.tsx`

## Planned change
Update only the `DialogContent` `className` so the modal behaves as a full-screen overlay on mobile:

- Add full viewport coverage on mobile:
  - `fixed inset-0 z-[100]`
  - `left-0 top-0 translate-x-0 translate-y-0`
  - `w-full h-full max-w-none max-h-none`
- Add a solid mobile background:
  - `bg-background`
- Add proper mobile scrolling:
  - `overflow-y-auto`
- Keep RTL rendering:
  - Preserve `dir="rtl"`
- Restore the current desktop centered modal look at `sm:` and above:
  - `sm:left-[50%] sm:top-[50%]`
  - `sm:translate-x-[-50%] sm:translate-y-[-50%]`
  - `sm:h-auto sm:max-h-[90vh] sm:max-w-2xl sm:rounded-2xl`
  - keep the glass-panel styling for desktop

## Expected result
On mobile, the signed-document overlay covers the entire viewport with a solid background and scrolls normally, so the dashboard can no longer overlap or hide the right side of the document viewer.