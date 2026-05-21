# Make hero headline a massive bold serif newspaper title

## Goal

The hero copy on `/` already contains the correct Hebrew headline and sub-headline. Make the headline render as a massive, bold serif newspaper title with perfect RTL alignment, without touching surrounding buttons, links, or the Loom video.

## Scope

Frontend only, single file: `src/routes/index.tsx`, hero block only (lines ~102-113). No JSX structure changes outside class names.

## Changes

- Enlarge the `<h1>` from `text-3xl md:text-5xl` to a newspaper scale: `text-4xl sm:text-5xl md:text-6xl lg:text-7xl`.
- Keep `font-display` (Playfair Display serif), bump weight to `font-black`, keep `leading-[1.05] tracking-tight`.
- Widen the headline container to `max-w-5xl` so the long Hebrew sentence breathes.
- Keep `dir="rtl"` on the wrapper and `text-right` on both the headline and sub-headline for clean RTL alignment.
- Slightly enlarge the sub-headline to `text-lg md:text-xl` for better hierarchy; keep `font-body`, `text-muted-foreground`.
- Do not touch the mobile badge chip, the Loom iframe, the header nav, or the CTA buttons below.

## Verification

- Visit `/` at the current viewport: headline reads as one big serif block, right-aligned RTL, no per-character wrapping.
- Sub-headline sits directly below, smaller, also right-aligned RTL.
- Loom video, badge, and CTA buttons unchanged.

## Goal

Fix the "פעילות אחרונה" activity cards so Hebrew filenames, badges, and action buttons render in normal RTL horizontal flow instead of collapsing into a single-letter vertical column.

## Scope

Frontend presentation only. No business logic, data fetching, routing, copy-link behavior, WhatsApp behavior, or modal behavior will change.

Files to update:

- `src/components/mnit/ActivityItem.tsx`
- `src/components/mnit/Sidebar.tsx` only if the list wrapper still constrains child width

## Planned structure

Each activity item will become a stacked block card:

```text
Activity card
└─ Row 1: [status/meta badge] [filename + subject] [file icon]
└─ Row 2: [העתק קישור] [וואטסאפ] [signer name]
```

## Changes

### Activity item card

- Set the outer `<li>` to a stable block layout: `flex flex-col w-full text-right p-3` with `box-border`, `min-w-0`, and `dir="rtl"`.
- Replace the current mixed row/meta layout with two clear rows:
  - Top row: file icon, filename/subject text, and status/date metadata side-by-side.
  - Bottom row: signer action controls below the filename area.
- Give the filename wrapper `flex-1 w-full min-w-0 text-right` so filenames have real horizontal space.
- Remove restrictive typography widths that can compress text to 0px.
- Keep Hebrew text in a clean sans-serif body style and avoid letter spacing/tracking in this component.

### Action row

- Render pending signer actions with `mt-2 flex flex-row-reverse justify-start gap-2`.
- Keep both buttons as `shrink-0 whitespace-nowrap` so "העתק קישור" and "וואטסאפ" remain intact.
- Keep the signer name as a normal RTL text element with `min-w-0` and truncation only if needed.

### Sidebar wrapper safety

- Ensure the activity list wrapper remains `w-full min-w-0 box-border` and does not add a width constraint that squeezes cards.
- Preserve existing padding that keeps the sidebar away from the screen edge.

## Verification

After implementation, verify on `/app` at the current desktop viewport:

- File names in "פעילות אחרונה" flow horizontally RTL, not letter-by-letter vertically.
- Status badges remain aligned in the top row.
- Copy link and WhatsApp buttons remain horizontally aligned below the text.
- No card content is clipped on the right edge.
