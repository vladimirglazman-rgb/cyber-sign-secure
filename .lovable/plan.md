## Tab 4 Visual Upgrade — Coded "Secured Digital Certificate" mockup

### Scope
Only Tab 4 inside `src/components/mnit/UserManualModal.tsx`. Tabs 1, 2, 3 untouched. No text changes.

### Changes

1. **Remove the dashed placeholder**
   - Delete the `<div className="mx-auto flex h-64 max-w-2xl ... border-dashed ...">` block containing the `ImageIcon` and "מקום שמור לצילום מסך" label.
   - Remove the now-unused `Image as ImageIcon` from the lucide-react import.

2. **Add icons** from lucide-react: `ShieldCheck`, `Lock`, `Sparkles`.

3. **Add `Step4Certificate` component** rendered in place of the removed placeholder.

   **Structure (RTL, dark, centered):**

   ```text
   ┌═══════════════════════════════════════════════════════┐
   ║  ✦                                                 ✦  ║
   ║         ┌─ outer ring (cyan glow) ─┐                  ║
   ║         │   ┌─ inner seal ─┐       │                  ║
   ║         │   │   🛡  (glow)   │      │                  ║
   ║         │   └───────────────┘       │                  ║
   ║         └────────────────────────────┘                 ║
   ║                                                       ║
   ║          MNIT — חתימה מאובטחת                          ║
   ║         🔒 Secured & Verified                          ║
   ║                                                       ║
   ║   ── מסמך נעול · PDF Flattened · ארכיון ענן ──        ║
   ║  ✦                                                 ✦  ║
   └═══════════════════════════════════════════════════════┘
   ```

   **Implementation details (Tailwind):**
   - Outer certificate frame: `mx-auto max-w-2xl relative rounded-2xl border-2 border-primary/40 bg-gradient-to-br from-background/80 via-background/60 to-background/80 p-8 shadow-[0_0_40px_-8px_rgba(48,255,247,0.5)]`.
   - Add a second inner border ring for the "official document" look: nested `<div className="rounded-xl border border-primary/20 p-6 sm:p-8">`.
   - Four corner ornaments: absolutely-positioned `Sparkles` icons (h-4 w-4 text-primary/60) at top-left, top-right, bottom-left, bottom-right of the outer frame.
   - **Seal stack (centered):**
     - Outer pulsing ring: `mx-auto h-28 w-28 rounded-full border border-primary/30 bg-primary/5 flex items-center justify-center animate-pulse`.
     - Inner solid disc: `h-20 w-20 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/50 flex items-center justify-center shadow-[0_0_24px_-2px_rgba(48,255,247,0.8)]`.
     - Icon: `<ShieldCheck className="h-10 w-10 text-primary drop-shadow-[0_0_8px_rgba(48,255,247,0.9)]" />`.
   - **Title block (below seal, centered, RTL):**
     - `<h4 className="mt-5 font-display text-xl tracking-wider text-primary text-glow">MNIT — חתימה מאובטחת</h4>`
     - Sub-line: `<p className="mt-1 inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-primary/80"><Lock className="h-3.5 w-3.5" /> Secured & Verified</p>`
   - **Footer divider line:** `mt-6 flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.25em] text-muted-foreground` with three small chips separated by `·`: "מסמך נעול", "PDF Flattened", "ארכיון ענן".
   - Wrapping container `dir="rtl"` and `text-center` for the title/footer area.

4. **Keep all Tab 4 Hebrew copy unchanged** — `h3` + 2-bullet list stay exactly as they are, `text-right` RTL.

### Out of scope
- Tabs 1, 2, 3 (no changes).
- Tab 4 text content.
- New asset files.

Approve and I'll implement.
