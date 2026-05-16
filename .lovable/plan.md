## Optimize User Manual Modal

Edit `src/routes/index.tsx` only — no other files touched.

### 1. Enlarge the modal
On the `<DialogContent>` for `manualOpen`, change `max-w-2xl` → `max-w-5xl` and add `max-h-[90vh] overflow-y-auto` so the taller content scrolls cleanly on smaller viewports.

### 2. Rewrite Tab 1 content (`value="intro"`)
Replace the current intro `<TabsContent>` body with the exact RTL Hebrew copy provided, structured as:
- H2 title: `📘 MNIT Sign – חתימה דיגיטלית חכמה` (using `font-display text-primary text-glow`, larger size)
- Intro paragraph (welcome text)
- Section heading: `1. 📤 יצירת בקשת חתימה (לשולח המסמך)`
- A `<ul>` of 4 bullet items (`העלאת קובץ`, `הוספת נמענים`, `הנחת סיכות`, `שיגור`), each with the bold lead phrase + description, using bullet markers consistent with `•`
- Spacing tuned with `space-y-4`, comfortable line-height, `text-right` and `dir="rtl"` enforced on the tab content

### 3. Image placeholder box
Below the bullet list (replacing `[IMAGE_PLACEHOLDER_1]`), add a centered placeholder:
- Full-width, ~`h-64`, `rounded-xl`
- `border border-dashed border-primary/30 bg-primary/5`
- Centered icon (`ImageIcon` from `lucide-react`) + caption text `מקום שמור לצילום מסך` in muted color
- New import: add `ImageIcon` to the existing `lucide-react` import

### Out of scope
Tabs 2–4 content, modal styling beyond size, the TopBar copy of the modal, any backend or routing change.

### Verification
After the edit, open `/`, click `מדריך למשתמש 📘`: modal is noticeably wider/taller, Tab 1 shows the new RTL structured content with the dashed placeholder box, other tabs unchanged, `סגור` still closes it.
