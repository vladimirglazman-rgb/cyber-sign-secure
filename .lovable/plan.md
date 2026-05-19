## Tech Stack — White-label Cleanup (2×3 Grid)

### Scope
Cosmetic edit to the "הטכנולוגיה שמאחורי המערכת" section in `src/routes/index.tsx`. No routes, schema, auth, or signing logic touched.

### Changes
1. **Remove tiles**: delete the `Lovable` (Wand2) and `GitHub` (Github) entries from the tech array.
2. **Drop unused imports**: remove `Wand2` and `Github` from the `lucide-react` import block.
3. **Remaining 6 tiles** (order preserved from current code):
   - Row 1: `React & Vite` · `Tailwind CSS` · `Supabase`
   - Row 2: `AI Engine` · `Cloudflare` · *(third slot)*

   To get a clean symmetrical 2×3, the order will be:
   ```
   Row 1:  React & Vite  |  Tailwind CSS  |  Supabase
   Row 2:  AI Engine     |  Cloudflare    |  (needs 6th)
   ```
   Since removing Lovable + GitHub leaves only 5, a true 2×3 needs 6. **Clarification below.**

### Clarification needed
Image_19.png is not visible to me in this turn. Removing both Lovable and GitHub from the current 7-tile list leaves **5 tiles**, which cannot form a symmetrical 2×3 grid.

Options:
- **A.** Keep only 5 tiles and use a centered layout (`grid-cols-3` row of 3 + centered row of 2). Clean, fully white-label.
- **B.** Re-add one tile to reach 6 (e.g. a "Security / TLS" or "Edge Runtime" card) — please specify name + Hebrew description.
- **C.** Drop only one of Lovable/GitHub to keep 6 tiles in 2×3.

### Styling (unchanged)
Keep existing `glass-panel`, cyan `text-glow` header, "TECH STACK" pill badge, gradient divider, hover glow, and RTL alignment. Grid becomes `sm:grid-cols-2 md:grid-cols-3` (drop the `lg:grid-cols-4` so the layout stays a true 2×3 on desktop).

Please confirm A / B / C before I implement.
