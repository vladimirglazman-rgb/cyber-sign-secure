## Goal
Make the "מדריך למשתמש 📘" button + modal visible on the public homepage (`/`), which is what you're currently previewing. Today it only exists in `TopBar.tsx`, which renders inside the authenticated `/app` layout — that's why nothing shows up on `/`.

## Changes
Single file: `src/routes/index.tsx`

1. **Header nav** (next to "התחברות" / "מתחילים עכשיו"):
   - Add a button styled to match the existing nav (rounded, primary/30 border, cyan glow on hover) with `BookOpen` icon + label `מדריך למשתמש 📘`.
   - Wire it to a local `useState` `manualOpen` / `setManualOpen`.

2. **Modal** (rendered at the bottom of `LandingPage`, outside `<main>`):
   - Reuse the exact same `Dialog` + `Tabs` markup already in `TopBar.tsx` (4 tabs: `מבוא ושלב 1`, `שלב 2`, `שלב 3`, `שלב 4`, with the same Hebrew content and "סגור" close button).
   - Same dark glass styling: `bg-background/80 backdrop-blur-xl`, `border-primary/30`, cyan shadow.

3. **Imports to add** to `src/routes/index.tsx`:
   - `BookOpen` from `lucide-react`
   - `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`, `DialogClose` from `@/components/ui/dialog`
   - `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` from `@/components/ui/tabs`

## Out of scope
- No changes to `TopBar.tsx` (the authenticated dashboard keeps its own copy).
- No extraction into a shared component yet — can do that later if you want to dedupe. Say the word and I'll refactor both call sites to use a single `<UserManualButton />`.
- No routing, auth, or backend changes.

## Verification
After the edit, the button appears in the top-right of the landing page header at `/`, clicking it opens the dark modal with 4 working tabs, and "סגור" closes it.