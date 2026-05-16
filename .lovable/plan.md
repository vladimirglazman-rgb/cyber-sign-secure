## Tab 3 Visual Upgrade — Coded dashboard mockup for "לוח בקרה"

### Scope
Only Tab 3 inside `src/components/mnit/UserManualModal.tsx`. Tabs 1, 2, 4 untouched. No text changes.

### Changes

1. **Remove image for Tab 3**
   - Delete `import step3Img from "@/assets/manual/step3-dashboard.png"`.
   - Remove `<Screenshot src={step3Img} alt="לוח בקרה ופעילות אחרונה" />`.
   - Leave PNG on disk; `Screenshot` helper stays (unused now — also remove to keep file clean).

2. **Add icons** from lucide-react alongside existing imports: `Link2`, `MessageCircle`, `Clock`, `CheckCircle2`.

3. **Add `Step3Mockup` component** rendered in place of the removed screenshot, inside the same glowing cyan card wrapper used in Tabs 1/2 (`mx-auto max-w-2xl rounded-xl border border-primary/40 bg-background/60 p-4 shadow-[0_0_24px_-6px_rgba(48,255,247,0.6)]`).

   **Structure (RTL, dark):**

   ```text
   ┌─ Card (cyan glow) ─────────────────────────────────────┐
   │  פעילות אחרונה                                  📊      │
   │  ──────────────────────────────────────────────────    │
   │  [⏳ ממתין]  חוזה שכירות — ולדימיר   [🔗 העתק] [💬 וואטסאפ] │
   │  [✓ נחתם]   הסכם NDA — סופיה        [🔗 העתק] [💬 וואטסאפ] │
   │  [⏳ ממתין]  ייפוי כוח — דניאל        [🔗 העתק] [💬 וואטסאפ] │
   └────────────────────────────────────────────────────────┘
   ```

   **Implementation details (Tailwind):**
   - Header row: `flex items-center justify-between border-b border-primary/15 pb-2 mb-3` with `text-sm font-display text-primary tracking-wider` title "פעילות אחרונה" on the right (RTL).
   - Three rows in a `space-y-2` list. Each row: `flex items-center justify-between gap-3 rounded-lg border border-primary/15 bg-background/60 p-3 hover:border-primary/30 transition-colors`.
   - **Right side (document + status):** `flex items-center gap-2.5`
     - Status badge:
       - Pending: `inline-flex items-center gap-1 rounded-md bg-amber-500/15 px-2 py-0.5 text-[11px] font-semibold text-amber-400` + `Clock` icon (h-3 w-3) + "ממתין לחתימה"
       - Signed: `inline-flex items-center gap-1 rounded-md bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-400` + `CheckCircle2` icon + "נחתם"
     - Document name: `text-sm font-semibold text-foreground` + small `text-xs text-muted-foreground` for recipient ("· ולדימיר").
   - **Left side (actions):** `flex items-center gap-2`
     - "העתק קישור" button: `inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary hover:bg-primary/20` + `Link2` icon h-3 w-3.
     - "וואטסאפ" button: `inline-flex items-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-400 hover:bg-emerald-500/20` + `MessageCircle` icon h-3 w-3.
   - All inner content `dir="rtl"` and `text-right`.

   **Sample data (3 rows):**
   - `{ doc: "חוזה שכירות", recipient: "ולדימיר", status: "pending" }`
   - `{ doc: "הסכם NDA", recipient: "סופיה", status: "signed" }`
   - `{ doc: "ייפוי כוח", recipient: "דניאל", status: "pending" }`

4. **Keep all Tab 3 Hebrew copy unchanged** — `h3` + paragraph + 2-bullet list stay exactly as they are, `text-right` RTL.

### Out of scope
- Tabs 1, 2, 4 (no changes).
- Tab 3 text content.
- Deleting the PNG file from `src/assets/manual/`.

Approve and I'll implement.
