# Replace Features Grid With 4-Step Journey

## Goal
Replace the 3-column features grid directly below the Loom video on the landing page (`src/routes/index.tsx`) with an elegant, editorial 4-step user-journey section in Hebrew/RTL.

## Scope
Frontend only — `src/routes/index.tsx`. No routing, button, or backend changes.

## Content
- Section title (serif display, large):
  "איך מתפעלים את הכלי – התהליך החדש, המדויק והחכם"
- Intro paragraph (muted, body font):
  "המערכת בנויה כך שכל תהליך החתימה הופך לזורם, אינטואיטיבי ומבוקר מקצה לקצה. ארבעה שלבים פשוטים — וכל המסמך חתום, מאומת ומוכן לשימוש."
- Four steps (01–04), each with title + description from supplied copy:
  1. שלב 1 – העלאה והגדרה
  2. שלב 2 – הזרקת השדות
  3. שלב 3 – שליחה חכמה
  4. שלב 4 – ניטור ואימות

## Layout & Style
- Replace the existing 3-tile grid (Lock / Zap / Sparkles) with the new section.
- Container: `dir="rtl"`, `max-w-5xl`, generous spacing.
- Header: small uppercase eyebrow ("Workflow"), serif `font-display` title (`text-4xl md:text-5xl`), intro paragraph (`text-lg text-muted-foreground max-w-3xl`), centered.
- Steps in a 2-column responsive grid (`md:grid-cols-2 gap-8`) of editorial cards:
  - Large serif numeral "01"–"04" in `text-primary`, `text-5xl font-display font-black`.
  - Step title `font-display text-xl font-bold`.
  - Description `text-sm md:text-base leading-relaxed text-muted-foreground`.
  - Card: `border border-gray-200 bg-white p-8 text-right rounded-lg hover:border-gray-400 transition`.
- Drop unused `Lock` and `Zap` icon imports; keep `Sparkles` (used by Tech Stack eyebrow).

## Out of scope
Hero, header nav, Loom video, Tech Stack, footer, routes, buttons.
