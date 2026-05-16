## Unified User Manual Modal (4 distinct tabs, max-w-4xl, RTL)

### Tab structure

| Tab | Trigger label | Heading text | Screenshot |
|---|---|---|---|
| 1 | `מבוא ושלב 1` | `1. 📤 יצירת בקשת חתימה (לשולח המסמך)` (current intro copy kept) | `image-12.png` — recipients form with Vladimir + Sofia |
| 2 | `שלב 2: חוויית החותם` | `2. 📱 חוויית החותם (ללקוח הקצה)` (current step2 copy kept) | **MISSING** — see note below |
| 3 | `שלב 3: לוח בקרה` | `3. 📊 לוח בקרה ומעקב (Dashboard)` (current step3 copy kept) | `image-14.png` — recent activity log with green WhatsApp / copy-link buttons |
| 4 | `שלב 4: אבטחה וסיום` | `4. 🔒 סיום התהליך וקבלת עותק סופי` (current step4 copy kept) | Dashed placeholder kept (clean, no image) |

### One blocker before implementation
You asked for Tab 2 to use a NEW screenshot of the signature drawing pad (`צייר חתימה`). The 3 files attached in this turn were:
- image-12 → recipients form (Tab 1) ✅
- image-13 → contract page showing the `חתום כאן` pin (NOT a signature pad)
- image-14 → recent activity dashboard (Tab 3) ✅

**Two options for Tab 2 — pick one:**
- **A.** Upload the actual signature-pad screenshot now and I'll use it for Tab 2.
- **B.** Use `image-13` (the `חתום כאן` pin on the document) for Tab 2 instead.
- **C.** Leave Tab 2 with the dashed placeholder for now and add the signature-pad screenshot later.

### Implementation (once Tab 2 image is resolved)

1. **Assets** — copy uploads into `src/assets/manual/`:
   - `image-12.png` → `step1-recipients.png`
   - `image-14.png` → `step3-dashboard.png`
   - (Tab 2 image per choice above)

2. **New shared component** `src/components/mnit/UserManualModal.tsx`
   - Props: `open: boolean`, `onOpenChange: (v: boolean) => void`
   - Owns the entire `<Dialog>` / `<Tabs>` block currently duplicated across `index.tsx` and `TopBar.tsx`
   - `DialogContent`: `max-w-4xl max-h-[90vh] overflow-y-auto`, glowing cyan border, `dir="rtl"`
   - `TabsList`: 4 columns, new labels above
   - Each `TabsContent`: `dir="rtl"`, `text-right`, `min-h-[420px]`, `p-6`, `space-y-5` — reuses the finalized Hebrew copy currently in `src/routes/index.tsx`
   - Screenshot container (tabs 1–3): centered card with `mx-auto max-w-2xl rounded-xl border border-primary/40 bg-background/60 p-3 shadow-[0_0_24px_-6px_rgba(48,255,247,0.6)]` wrapping `<img className="mx-auto rounded-lg max-h-[480px] w-auto">`
   - Tab 4: existing dashed `ImageIcon` placeholder
   - Footer: `DialogClose` → `סגור` button (closes from any tab)

3. **Wire into both surfaces**
   - `src/routes/index.tsx` — delete the inline `<Dialog>…</Dialog>` block, import + render `<UserManualModal open={manualOpen} onOpenChange={setManualOpen} />`
   - `src/components/mnit/TopBar.tsx` — same swap; also drop the now-unused `Dialog*`, `Tabs*` imports

4. **Verification** — open `/` and the authenticated app, confirm identical 4-tab modal at `max-w-4xl`, screenshots inside glowing cyan cards, `סגור` works on every tab.

### Out of scope
Tab body text wording (already finalized previously), `/auth` page trigger, any other route.

---

**Please confirm the Tab 2 image choice (A / B / C) and I'll implement.**
