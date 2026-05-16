## Finalize Tab 4 in the user manual modal

Single-file edit: `src/routes/index.tsx`. Replace the `<TabsContent value="step4">` body with the same RTL structure used for Tabs 1–3.

### Tab 4 (`value="step4"`)
- Wrapper: `dir="rtl"`, `text-right`, `min-h-[420px]`, `p-6`, `space-y-5`, same border/background as the other tabs.
- H3 heading: `4. 🔒 סיום התהליך וקבלת עותק סופי` in `font-display text-lg text-primary/90`.
- `<ul>` with 2 bullets matching the supplied text:
  - "ברגע שהחותם האחרון…" (PDF Flattening)
  - "עותק סופי, חתום ומהימן…"
  - Each uses the `•` marker in `text-primary` and `leading-7` (no bold lead phrase needed — text has no `key:` structure).
- Replace `[IMAGE_PLACEHOLDER_4]` with the same dashed `ImageIcon` placeholder box used in the other tabs.

### Close button check
The "סגור" button uses `<DialogClose asChild>` wrapping a native `<button>`, controlled by the `manualOpen`/`onOpenChange` state on the `<Dialog>`. Radix `DialogClose` calls `onOpenChange(false)` regardless of which tab is active — tab state is independent of dialog state — so it already works on all four tabs. No change needed; will confirm by inspection only.

### Out of scope
Tabs 1–3, modal sizing, TopBar copy of the modal, any other file. No new imports.

### Verification
Open `/`, click `מדריך למשתמש 📘`, switch to שלב 4: new RTL content with both bullets and the dashed screenshot placeholder appears. Click `סגור` from each of the 4 tabs — modal closes every time.
