
# Phase 1 — MNIT Sign: Build (approved)

Connect the Cyber-Legal UI to Lovable Cloud (Supabase). Add auth, persist documents/recipients, store PDFs, bind the sidebar to real data. Hebrew RTL throughout.

## 1. Infrastructure

- Enable Lovable Cloud → provisions `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, service role, and `src/integrations/supabase/{client,client.server,auth-middleware}.ts`.
- Disable email confirmation in auth settings (instant signup → login).

## 2. Database migration (single file)

**Enums**
- `app_role` → `'admin' | 'freelancer'`
- `document_status` → `'pending' | 'signed' | 'cancelled'`
- `recipient_role` → `'signer' | 'cc'`
- `recipient_status` → `'waiting' | 'signed'`

**Tables**
- `profiles(id uuid PK → auth.users on delete cascade, full_name text, created_at timestamptz default now())`
- `user_roles(id uuid PK default gen_random_uuid(), user_id uuid → auth.users on delete cascade, role app_role not null, unique(user_id, role))` — roles **never** on profiles (privilege-escalation safety).
- `documents(id uuid PK default gen_random_uuid(), owner_id uuid → profiles on delete cascade, file_name text, file_path text, status document_status default 'pending', subject text, message text, sign_in_order bool default false, reminder_days int, created_at timestamptz default now())`
- `recipients(id uuid PK default gen_random_uuid(), document_id uuid → documents on delete cascade, name text, email text, role recipient_role default 'signer', status recipient_status default 'waiting', signing_order int)`

**Functions / triggers**
- `public.has_role(_user_id uuid, _role app_role) returns boolean` — `SECURITY DEFINER`, used in RLS to avoid recursion.
- `public.handle_new_user()` — `SECURITY DEFINER` trigger on `auth.users insert` → inserts `profiles` row + default `user_roles('freelancer')`.

**Storage**
- Private bucket `contracts`. Path layout enforced by RLS: `contracts/{auth.uid()}/{timestamp}_{safeName}`.

## 3. Row-Level Security

Enable RLS on all four tables.

- `profiles`: select/update own row.
- `user_roles`: select own; only admins write (via `has_role`).
- `documents`: full CRUD where `owner_id = auth.uid()`.
- `recipients`: CRUD allowed when parent `document.owner_id = auth.uid()`.
- `storage.objects` on `contracts`: `insert/select/delete` only when first path segment = `auth.uid()`.

## 4. Auth (Hebrew, Cyber-Legal)

- `src/routes/auth.tsx` — tabs `התחברות` / `הרשמה`, glassmorphic card, Aqua-glow CTA.
  - `signUp({ ..., options: { emailRedirectTo: window.location.origin } })`
  - `signInWithPassword`.
- `src/routes/_authenticated.tsx` — pathless layout guard. `onAuthStateChange` listener set up **before** `getSession()`; redirects to `/auth` if no session.
- Move dashboard → `src/routes/_authenticated/index.tsx` (replaces placeholder `index.tsx`).
- `TopBar` shows real `full_name` from `profiles` + logout button.

## 5. Server functions (`src/server/`)

All authenticated fns use `requireSupabaseAuth` so RLS applies as the user.

- `documents.functions.ts`
  - `listMyDocuments()` → `{ documents, stats: { total, signed, pending, cancelled } }`
  - `createSignatureRequest({ filePath, fileName, subject, message, signInOrder, reminderDays, recipients })` → inserts the `documents` row + `recipients` rows; returns new doc id.
- `storage.functions.ts`
  - `getUploadTarget({ fileName })` → returns safe `{ path: '<uid>/<ts>_<safeName>' }`. The browser uploads directly via `supabase.storage.from('contracts').upload(path, file)` — no large-payload pass-through.

Zod validation on every input (`subject` 1–200, `recipients` 1–20, valid email, `reminderDays ∈ {1,3,7}`).

## 6. Components (rebuild Phase 0, data-bound)

`src/components/mnit/`
- `AnimatedGrid.tsx` — drifting cyber-grid background.
- `TopBar.tsx` *(edit)* — user name, logout.
- `Sidebar.tsx` — branding + **StatTile** grid (סה״כ / נחתמו / ממתינים / בוטלו) + **Recent Activity** with Hebrew status chips. Driven by TanStack Query via `useDashboard`.
- `StatTile.tsx`, `ActivityItem.tsx`.
- `Workspace.tsx` — 3-col grid `[280px_1fr_360px]`, stacks <768px (RTL via `dir="rtl"` on `__root.tsx`, logical `ms-*` / `pe-*` utilities throughout).
- `StepCard.tsx` — glass panel header with step number + title.
- `Step1Upload.tsx` — drag-and-drop zone (validate ≤20MB, types: pdf/doc/docx/png/jpg). On drop: `getUploadTarget` → upload → store `{path, name}` in local state.
- `Step2Recipients.tsx` — dynamic rows (שם / אימייל / תפקיד), `הוסף נמען`, remove button.
- `Step3Settings.tsx` — נושא, הודעה, סדר חתימה, תזכורות (1/3/7 ימים).
- `DocumentPreview.tsx` — framed glass panel with placeholder mockup that reacts to chosen file name.
- `SendBar.tsx` — disabled until valid; on click → `createSignatureRequest`, `toast.success('הבקשה נשלחה לחתימה בהצלחה')`, reset form, invalidate `['dashboard']` query.

`src/hooks/`
- `use-signature-request.ts` *(keep)* — local form state + `canSend`.
- `use-dashboard.ts` *(new)* — `useQuery(['dashboard', userId], listMyDocuments)`.

## 7. Hebrew copy reference

| Key | Hebrew |
|---|---|
| Send CTA | שלח לחתימה |
| Stats | סה״כ / נחתמו / ממתינים / בוטלו |
| Steps | העלאת מסמך / נמענים / הגדרות |
| Empty state | עדיין אין מסמכים — העלה את הראשון |
| Toast success | הבקשה נשלחה לחתימה בהצלחה |
| Toast error | אירעה שגיאה, נסה שוב |
| Auth tabs | התחברות / הרשמה |
| Auth fields | שם מלא / אימייל / סיסמה |
| Logout | התנתק |

## 8. Out of scope (Phase 2+)

Real PDF rendering, outbound signature emails to recipients, templates, admin pages, password reset.

## 9. File map

```text
supabase migration               (enums, tables, RLS, trigger, has_role, contracts bucket + policies)
src/routes/
  auth.tsx
  _authenticated.tsx
  _authenticated/index.tsx       (dashboard; replaces placeholder index)
src/components/mnit/
  AnimatedGrid.tsx, TopBar.tsx (edit), Sidebar.tsx, StatTile.tsx, ActivityItem.tsx,
  Workspace.tsx, StepCard.tsx, Step1Upload.tsx, Step2Recipients.tsx,
  Step3Settings.tsx, DocumentPreview.tsx, SendBar.tsx
src/server/
  documents.functions.ts, documents.server.ts, storage.functions.ts
src/hooks/
  use-dashboard.ts (new), use-signature-request.ts (keep)
src/styles.css                   (verify .cyber-grid / .glass-panel / .glow-aqua present)
```

## 10. Acceptance criteria

1. Logged-out visit to `/` → redirect to `/auth`. Signup auto-creates `profiles` + `user_roles('freelancer')` and logs in immediately (no email confirm).
2. Step 1 drop stores file under `contracts/<uid>/...` and shows a chip with the filename.
3. "שלח לחתימה" inserts `documents` + N `recipients`, fires Hebrew success toast, resets the form, sidebar stats increment without reload.
4. RLS verified by signing in as a second user — only their own docs/stats appear.
5. No console errors; existing dynamic-import preview crash is gone; cyber-grid + Aqua-glow + glass panels render in RTL.
