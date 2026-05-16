## Tab 2 Visual Upgrade — Coded smartphone mockup for "חוויית החותם"

### Scope
Only Tab 2 inside `src/components/mnit/UserManualModal.tsx`. Tabs 1, 3, 4 untouched. No text changes.

### Changes

1. **Remove image import for Tab 2**
   - Delete `import step2Img from "@/assets/manual/step2-signer.png"`.
   - Remove `<Screenshot src={step2Img} alt="חוויית החותם בנייד" />` from the Tab 2 content.
   - Leave the PNG file on disk (no delete needed).

2. **Add `Check` icon import** from lucide-react (alongside existing `Upload, FileText, Image as ImageIcon`).

3. **Add new `Step2Mockup` component** rendered in place of the removed screenshot, inside the same glowing cyan card wrapper used elsewhere (`mx-auto max-w-sm ...`). Structure:

   ```text
   ┌─ Phone frame (rounded-[2.5rem], cyan glow) ──────┐
   │  ┌─ notch ─┐                                     │
   │  ┌─ Screen (rounded-[2rem], dark) ────────────┐  │
   │  │  status bar (time · signal · battery)      │  │
   │  │  ┌─ Document preview ───────────────────┐  │  │
   │  │  │ ▬▬▬▬▬▬▬▬▬▬▬▬                        │  │  │
   │  │  │ ▬▬▬▬▬▬▬▬▬▬                          │  │  │
   │  │  │ ▬▬▬▬▬▬▬▬▬▬▬▬▬                       │  │  │
   │  │  │            [סיכת חתימה ←] (pulsing) │  │  │
   │  │  └──────────────────────────────────────┘  │  │
   │  │  ┌─ Signature pad ──────────────────────┐  │  │
   │  │  │  צייר חתימה                          │  │  │
   │  │  │   ╱╲___╱‾╲_  (svg script path)       │  │  │
   │  │  └──────────────────────────────────────┘  │  │
   │  │  [ ✓  אשר וסיים ] (full-width cyan btn)    │  │
   │  └────────────────────────────────────────────┘  │
   └──────────────────────────────────────────────────┘
   ```

   **Implementation details (Tailwind, dark, RTL):**
   - Outer phone: `mx-auto w-[300px] rounded-[2.5rem] border border-primary/40 bg-background/80 p-2 shadow-[0_0_32px_-6px_rgba(48,255,247,0.6)]`. Small notch: `mx-auto mb-1 h-1.5 w-16 rounded-full bg-primary/30`.
   - Inner screen: `rounded-[2rem] bg-[#0a1525] p-3 space-y-3` with `dir="rtl"`.
   - Status bar: `flex justify-between text-[10px] text-muted-foreground` showing `9:41` / `●●●● 100%`.
   - Document preview: `rounded-lg border border-primary/15 bg-background/60 p-3 space-y-1.5` with 4–5 muted `h-1.5 rounded bg-muted-foreground/25` lines of varying widths (`w-full`, `w-5/6`, `w-3/4`...), then a small cyan pill badge `סיכת חתימה ←` (`inline-flex bg-primary/15 text-primary text-[10px] rounded-md px-2 py-0.5 animate-pulse`) aligned to the right.
   - Signature pad: `rounded-lg border-2 border-dashed border-primary/40 bg-primary/5 p-3 h-24` with a tiny top-right label `צייר חתימה` (`text-[10px] text-muted-foreground`) and an inline SVG (viewBox `0 0 200 60`) drawing a smooth script-style signature path in `stroke-primary` (stroke-width 2, fill none, rounded line caps, `drop-shadow` cyan glow). Example path: `M10 40 C 30 10, 50 60, 70 30 S 110 10, 130 35 S 170 55, 195 25`.
   - Confirm button: `w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold py-2.5 shadow-[0_0_16px_-2px_rgba(48,255,247,0.7)]` with `Check` icon + `אשר וסיים`.

4. **Keep all Tab 2 Hebrew copy unchanged** — `h3` + 4-bullet list stay exactly as they are, `text-right` RTL.

### Out of scope
- Tabs 1, 3, 4 (no changes).
- Tab 2 text content.
- Deleting the PNG file from `src/assets/manual/`.

Approve and I'll implement.
