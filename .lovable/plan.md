# Workflow section: 4-row layout with mapped images

## Scope

- File: `src/routes/index.tsx` only.
- Section: the block under heading "איך מתפעלים את הכלי – התהליך החדש, המדויק והחכם".
- No changes to header, hero, MVP list, tech stack, footer, AuditModal, sidebar, click handlers, or any other file.
- All 4 Hebrew step titles + descriptions remain verbatim.

## Asset prep (copy uploads → `src/assets/`)

- Step 1 → `src/assets/workflow-step-1-upload.png` from `user-uploads://image_3.png` (PDF document being uploaded)
- Step 2 → `src/assets/workflow-step-2-fields.png` generated via imagegen — premium UI mockup of dragging signature/date pin fields onto a document, light editorial style with indigo accents
- Step 3 → `src/assets/workflow-step-3-send.png` from `user-uploads://image_4.png` (signer 2FA / send screen)
- Step 4 → `src/assets/workflow-step-4-monitor.png` from `user-uploads://image_2.png` (recent activity / monitoring panel)

Each imported as an ES6 module at the top of `src/routes/index.tsx`.

## New layout per row

- Replace the `grid md:grid-cols-2` of 4 text cards with a vertical stack (`space-y-6 md:space-y-8`).
- Row container: `rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition p-6 md:p-8`.
- Inside: `grid md:grid-cols-2 gap-6 md:gap-10 items-center`. DOM order = image first, text second. Under `dir="rtl"` the first column renders on the right (image right, text left).
- Image container: `aspect-[4/3] w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50` with `<img className="h-full w-full object-cover" loading="lazy" />`.
- Text block: `text-right`; step number (`font-display text-5xl font-black text-primary`), title (`font-display text-xl md:text-2xl font-bold text-foreground`), description (`text-sm md:text-base leading-relaxed text-muted-foreground`).

## Step 2 image generation

imagegen `standard`, 4:3, saved to `src/assets/workflow-step-2-fields.png`. Prompt: a clean light-cream desktop UI mockup of a PDF document on a workspace, with colored signature pin markers (indigo, purple, orange) being dragged onto highlighted signature/date/text fields, soft shadows, premium editorial aesthetic, no legible text.

## Out of scope

- No new routes, components, or global CSS.
- No edits to `AuditModal`, `ActivityItem`, `dialog.tsx`, sidebar, header, hero, MVP list, tech-stack, footer.
- No copy rewrites, no click-handler changes.
