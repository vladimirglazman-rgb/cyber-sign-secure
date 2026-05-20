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
