# Tech Stack Cleanup Plan

## Goal
Refactor the Technology Stack section at the bottom of the landing page (`src/routes/index.tsx`) into a clean, minimal, premium badge/pill layout.

## Changes

### 1. Section Title
Keep the existing Hebrew title:
```
<span class="italic text-primary">הטכנולוגיה</span> שמאחורי המערכת
```

### 2. Tech Badge Grid (replaces the 3-column card grid)
Replace the current `{ icon, name, desc }` card grid with a single centered flex-wrap container of minimalist pill badges.

Each badge:
- Text content: crisp English tech name only (e.g. "React", "Vite", "Tailwind CSS", "Supabase", "AI Engine", "Cloudflare")
- Style: `bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium`
- Container: `dir="ltr"` so English names render left-to-right naturally
- Layout: centered flex-wrap row with gap-3

### 3. Remove "Lovable"
Verify the footer and tech stack area contain no mention of "Lovable".

### 4. Out of Scope
- Hero section
- 4-step workflow
- MVP capabilities section
- Header / navigation
- Footer links and copyright
- Any buttons or routing

## Technical Details
- Remove the `Code2`, `Paintbrush`, `Database`, `Brain`, `Cloud` icon imports if they become unused after removing the cards.
- The pills container will sit directly under the section title and divider, inside the existing `<section>`.
