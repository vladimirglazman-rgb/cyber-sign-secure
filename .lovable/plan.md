# Plan: Responsive User Manual Modal

**Target:** `src/components/mnit/UserManualModal.tsx` (only file — manual lives inside a Dialog opened from the landing page).

## Changes (cosmetic Tailwind only)

### 1. Dialog container
- `max-w-4xl` → `w-[95vw] max-w-4xl` so it never exceeds the viewport on small screens.
- Add `p-4 sm:p-6` to control inner padding on mobile.

### 2. Tabs list (currently `grid-cols-4` — overflows on phones)
- Change to `grid-cols-2 sm:grid-cols-4` so tabs wrap into a 2×2 grid on mobile.
- Add `h-auto` and `gap-1` to `TabsList`; add `text-xs sm:text-sm whitespace-normal py-2` to each `TabsTrigger` so Hebrew labels wrap cleanly instead of clipping.

### 3. Tab content wrapper (`tabContentClass`)
- `p-6` → `p-4 sm:p-6`.
- `min-h-[420px]` kept, but add `overflow-hidden` to prevent horizontal scroll.

### 4. Typography inside tabs
- Main heading: `text-2xl` → `text-xl sm:text-2xl`.
- Section headings (`text-lg`): → `text-base sm:text-lg`.
- Body/list items: add `text-sm sm:text-base` and `break-words` to `<li>` and `<p>`.

### 5. Mockup components (Step1–Step4)
- Step1Mockup: `max-w-2xl` already responsive; ensure recipient row uses `flex-wrap gap-2` so name + phone don't overflow.
- Step2Mockup: fixed `w-[300px]` → `w-full max-w-[300px] mx-auto`.
- Step3Mockup: `max-w-2xl` kept; rows change to `flex-col sm:flex-row` with `gap-2` so status badges and action buttons stack on mobile instead of overflowing horizontally. Action buttons get `w-full sm:w-auto justify-center`.
- Step4Certificate: `p-8` → `p-4 sm:p-8`, inner `p-6 sm:p-8` → `p-4 sm:p-8`, seal `h-28 w-28` → `h-24 w-24 sm:h-28 sm:w-28`, title `text-xl` → `text-lg sm:text-xl`, footer chips wrap already via `flex-wrap`.

### 6. Header
- `DialogTitle` already `text-xl`; add `sm:text-2xl` for desktop polish (optional, keeps current mobile size).

## Out of scope
No text content, routing, auth, or business-logic changes. Pure Tailwind class adjustments in one file.
