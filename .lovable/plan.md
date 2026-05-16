## Technology Stack Section — Landing Page

### Goal
Add a premium "Technology Stack" section to the public landing page (`/`) just above the Footer, showcasing the 7 technologies behind MNIT Sign with a high-end dark-mode cyber aesthetic aligned to the existing design system.

### Design
- **Position**: Inside `<main>` or as a sibling section between the Feature tiles and the `<footer>`.
- **Container**: `max-w-5xl mx-auto px-6` (matches existing feature tiles width).
- **Header**: Hebrew title `הטכנולוגיה שמאחורי המערכת` in `font-display`, centered, with a subtle `text-glow` or `text-primary` accent and a short decorative divider line.
- **Grid**: Responsive grid of 7 cards:
  - Mobile: 1 column
  - Tablet (`sm`): 2 columns
  - Desktop (`md`+): 3 columns with the last row centered (4+3 layout) OR a 4+3 natural wrap.
- **Card style**: Reuse the existing `glass-panel` utility with `text-right` RTL alignment. Each card contains:
  - A Lucide icon inside a `rounded-lg bg-primary/15 ring-1 ring-primary/40` container (`h-10 w-10`)
  - Technology name in `font-display` bold
  - Hebrew description in `text-muted-foreground` (`text-sm`)
- **Hover**: Cards lift subtly via `hover:border-primary/50` transition (same as feature tiles).
- **Icons** (one per card, chosen from `lucide-react`):
  1. Lovable — `Wand2` or `Sparkles`
  2. React & Vite — `Code2` or `Monitor`
  3. Tailwind CSS — `Paintbrush` or `Layers`
  4. Supabase — `Database` or `Cloud`
  5. GitHub — `Github` (Lucide icon)
  6. AI Engine — `Brain` or `Cpu`
  7. Cloudflare — `Shield` or `Globe`

### Content (RTL)
| Tech | Hebrew Description |
|------|-------------------|
| Lovable | פיתוח מבוסס AI לבנייה מהירה, פריסה חכמה ועדכוני קוד בזמן אמת. |
| React & Vite | חוויית משתמש מהירה במיוחד, יציבה ומודרנית. |
| Tailwind CSS | עיצוב רספונסיבי, נקי וחדשני המותאם לכל מכשיר. |
| Supabase | מסד נתונים מאובטח בענן, ניהול משתמשים ותשתית Backend חזקה. |
| GitHub | ניהול קוד מקצועי, בקרת גרסאות ואבטחה ברמה ארגונית (Enterprise). |
| AI Engine | מנוע בינה מלאכותית מתקדם לעיבוד, ניתוח ושכלול מסמכים אוטומטי. |
| Cloudflare | הגנת DDoS, אבטחת DNS ותעודות SSL להגנה מקסימלית על המידע. |

### Scope & Out of Scope
- **In scope**: New section markup + CSS classes in `src/routes/index.tsx` only. Import any additional Lucide icons needed.
- **Out of scope**: No new components, no style system changes, no backend logic, no route changes. Reuse existing `glass-panel` and typography tokens.

### Implementation Notes
- The page already has `dir="rtl"` on `<html>`, so `text-right` on cards will align correctly.
- The existing 3 feature tiles use an identical card pattern — the new section will follow that markup structure exactly for visual consistency.
- Add `mt-20` (or `mt-24`) spacing above the new section to separate it from the feature tiles, and `pb-24` on `<main>` may need adjustment or the section can live just before the footer with its own `py-16` padding.
