# Add New Capabilities Section Between Workflow & Tech Stack

## Goal
Insert an elegant, minimalist capabilities section on the landing page (`src/routes/index.tsx`), placed directly between the existing 4-step workflow area and the Tech Stack section.

## Scope
Frontend only — `src/routes/index.tsx`. No routing, button, or backend changes.

## Content

### Section Title (centered, clean typography):
"🔍 מה הכלי עוע בפועל (MVP – אבל כבר חזק מאוד)"

### Capabilities List (8 items, clean checklist grid with minimal checkmark icons):
1. טעינת מסמך – העלאת PDF או בחירת תבנית מוכנה.
2. סימון מיקום חתימות – הצבת סיכות צבעוניות ושמיות לכל חותם.
3. שליחה לחותמים – ליחיד, לקבוצה או לסדר חתימה מוגדר מראש.
4. הזדהות רב־שכבתית – אימות זהות באמצעות SMS, אימייל, קוד חד‑פעמי או שכבות נוספות.
5. חתימה לפי סיכה – כל חותם רואה את הסיכה שלו וחותם בדיוק במקום שיועד לו.
6. ניהול תהליך מלא – המסמך לא חוזר עד שכל החותמים השלימו את חלקם.
7. שקיפות מלאה – המחתים רואה בזמן אמת מי חתם, מי לא, ובאיזה תאריך ושעה.
8. הגנה על מסמכים חתומים – עד לסיום התהליך, אף גורם לא יכול לפתוח או לשנות את המסמך החתום.

### Future Vision Note (subtle premium text frame):
"🌟 וזה רק ה‑MVP: המערכת תתרחב לפיצ’רים שלא קיימים היום בשום כלי בעולם — אוטומציות מתקדמות, אימותים חכמים, אינטגרציות עמוקות, ניהול תהליכים מורכבים ועוד. הכול בשבילכם, 24/7, בצורה מאובטחת, מהירה ומקצועית."

## Layout & Style
- Container: `dir="rtl"`, `max-w-5xl`, centered, generous vertical padding (`py-20` or similar) and top margin to separate from workflow.
- Title: `font-display text-3xl md:text-4xl font-bold text-center` with bottom margin.
- Capabilities grid: responsive 2-column grid on desktop (`md:grid-cols-2 gap-6`), single column on mobile. Each item in a clean card-like row or a simple flex row with a minimal checkmark icon (`Check` from lucide-react).
- Each checklist item: `flex flex-row-reverse items-start gap-3 text-right` with icon on the right (RTL), body text `text-base text-foreground`.
- Future vision: centered, within a subtle bordered/highlighted container (`rounded-xl border border-gray-200 bg-muted/30 p-8 max-w-3xl mx-auto mt-12 text-center` with `text-muted-foreground font-body`).
- No additional state or business logic.

## Out of scope
Hero, header nav, 4-step workflow, Tech Stack, footer, routes, buttons.
