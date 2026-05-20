# Fix mobile truncation in "פעילות אחרונה" list

Pure Tailwind class changes in `src/components/mnit/ActivityItem.tsx` and `src/components/mnit/Sidebar.tsx`. No data or logic changes.

## Changes

### `src/components/mnit/ActivityItem.tsx`
- Top row (currently `flex items-center gap-3 ...`): switch to `flex-col sm:flex-row` so the file name, status badge, and meta info stack on mobile and sit side-by-side on `sm+`.
- Document name container (`min-w-0 flex-1`): add `w-full` and change `truncate` → `whitespace-normal break-words` on the file name `<p>`, so the title wraps to multiple lines on mobile instead of clipping to "…f". Subject line keeps `truncate` (or also gets `whitespace-normal` if needed for readability).
- Status/meta column (currently `flex flex-col items-end gap-1`): on mobile, align to start (`items-start sm:items-end`) and let it sit under the title; on `sm+` it returns to the right.

### `src/components/mnit/Sidebar.tsx`
- The activity `<ul>` (currently `flex flex-col gap-2 overflow-y-auto pe-1`): add `pb-24` so the last item isn't covered by the floating SendBar/version banner on mobile. Desktop is unaffected visually.

## Constraints

- Only Tailwind className edits.
- No changes to props, data fetching, RLS, or backend.
### Pure UI Cosmetic Fix: Color the Pins by Index

**What:** Inside `src/components/mnit/SignerPdfViewer.tsx`, color each pin badge based on its array index within the existing `.map()` loop.

**How:**
1. In the `pinsForPage.map(({ c, idx }) => ...)` block, derive a color class string from `idx`:
   - `idx === 0` → teal (`bg-teal-500`, `border-teal-600`, `text-teal-700`)
   - `idx === 1` → purple (`bg-purple-500`, `border-purple-600`, `text-purple-700`)
   - `idx === 2` → green (`bg-green-500`, `border-green-600`, `text-green-700`)
   - `idx >= 3` → orange (`bg-orange-500`, `border-orange-600`, `text-orange-700`)

2. Apply the chosen color classes to:
   - The `MapPin` icon fill/text color
   - The pin label box background, border, and text

**Constraints respected:**
- No data fetching logic is touched.
- No pin filtering or array manipulation is changed.
- Only Tailwind classNames inside the existing map render path are modified.
