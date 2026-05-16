## Update Tabs 2 & 3 in the user manual modal

Single-file edit: `src/routes/index.tsx`. Replace the `<TabsContent value="step2">` and `<TabsContent value="step3">` bodies using the same RTL structure already established for Tab 1.

### Tab 2 (`value="step2"`)
- Apply `dir="rtl"`, `text-right`, `min-h-[420px]`, `p-6`, `space-y-5` (mirroring Tab 1).
- H3 heading: `2. 📱 חוויית החותם (ללקוח הקצה)` in `font-display text-lg text-primary/90`.
- `<ul>` with 4 bullets (`קבלת התראה`, `אימות וצפייה`, `פעולת החתימה`, `אישור`) — bold lead phrase + description, `•` marker in `text-primary`, `leading-7`.
- Note: fix the stray Cyrillic `с` in the source ("מסמך") so the Hebrew renders cleanly.
- Replace `[IMAGE_PLACEHOLDER_2]` with the same dashed placeholder box used in Tab 1 (`ImageIcon` + caption `מקום שמור לצילום מסך`).

### Tab 3 (`value="step3"`)
- Same wrapper styling as Tab 1/2.
- H3 heading: `3. 📊 לוח בקרה ומעקב (Dashboard)`.
- Intro paragraph: `כמי ששלח את המסמך, יש לכם שליטה מלאה בזמן אמת:`.
- `<ul>` with 2 bullets (`סטטוס חי`, `שליחת תזכורות`) in the same bullet style.
- Replace `[IMAGE_PLACEHOLDER_3]` with the same dashed placeholder box.

### Out of scope
Tab 1, Tab 4, modal size, TopBar copy of the modal, any other file. No new imports needed (`ImageIcon` already imported).

### Verification
Open `/`, click `מדריך למשתמש 📘`, switch to שלב 2 and שלב 3: each shows the new RTL content with bullets and a dashed screenshot placeholder. Tabs 1 and 4 unchanged.
