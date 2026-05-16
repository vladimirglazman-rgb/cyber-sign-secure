## Tab 1 Visual Upgrade — Replace blurry screenshot with coded mockup

### Scope
Only Tab 1 ("מבוא ושלב 1") inside `src/components/mnit/UserManualModal.tsx`. Tabs 2–4 untouched. No text changes.

### Changes

1. **Remove image import**
   - Delete `import step1Img from "@/assets/manual/step1-recipients.png"` from `UserManualModal.tsx`.
   - Leave the PNG file on disk (still used nowhere else; safe to ignore — no delete needed).

2. **Replace `<Screenshot src={step1Img} … />` in Tab 1** with a new inline `Step1Mockup` component rendered inside the same glowing cyan card container (`mx-auto max-w-2xl rounded-xl border border-primary/40 bg-background/60 p-4 shadow-[0_0_24px_-6px_rgba(48,255,247,0.6)]`).

3. **`Step1Mockup` structure** (Tailwind only, dark mode, RTL):

   ```text
   ┌─ glowing cyan card ───────────────────────────────┐
   │  ┌─ Dropzone (dashed cyan border, rounded-xl) ─┐  │
   │  │      ⬆  גרור קובץ PDF או לחץ להעלאה         │  │
   │  │           contract.pdf · 2.4 MB             │  │
   │  └─────────────────────────────────────────────┘  │
   │                                                   │
   │  ┌─ Recipient row 1 ──────────────────────────┐   │
   │  │ [נמען 1]  ולדימיר          050-123-4567   │   │
   │  └────────────────────────────────────────────┘   │
   │  ┌─ Recipient row 2 ──────────────────────────┐   │
   │  │ [נמען 2]  סופיה            050-987-6543   │   │
   │  └────────────────────────────────────────────┘   │
   └───────────────────────────────────────────────────┘
   ```

   - Dropzone: `rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 p-6 text-center`, `Upload` icon from lucide-react above the Hebrew label, small muted line below showing `contract.pdf · 2.4 MB`.
   - Each recipient row: `flex items-center justify-between gap-3 rounded-lg border border-primary/20 bg-background/60 p-3`, with a cyan badge (`rounded-md bg-primary/15 px-2 py-0.5 text-[11px] font-semibold text-primary`) on the right reading `נמען 1` / `נמען 2`, the name (`ולדימיר` / `סופיה`) next to it, and the phone number in muted mono on the left.
   - `dir="rtl"` on the wrapper so badge sits right, phone sits left visually.

4. **Keep Hebrew copy above the mockup unchanged** — `h2`, intro paragraph, `h3`, and the 4-bullet list all stay exactly as they are, `text-right` RTL.

### Out of scope
- Tabs 2, 3, 4 (no changes — Tab 2 still uses the existing screenshot, Tab 3 too, Tab 4 keeps dashed placeholder).
- Text content of Tab 1.
- Deleting the PNG file from `src/assets/manual/`.

Approve and I'll implement.
