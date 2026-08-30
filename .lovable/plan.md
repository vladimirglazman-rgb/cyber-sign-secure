# Password visibility toggle + password reset flow

Scope: the auth page and one new page. No other files touched.

## 1. Show/hide password (src/routes/auth.tsx)
- Add local state `showPassword`.
- Wrap the password input in a relative container; place an `Eye` / `EyeOff` button (lucide-react) absolutely on the left side (RTL-correct), vertically centered, styled with the existing muted/primary colors.
- Input `type` switches between `password` and `text`. Button is `type="button"` so it never submits the form.

## 2. "שכחתי סיסמה?" link (src/routes/auth.tsx)
- Small link below the password field, visible in login mode.
- Clicking opens a lightweight inline panel (same glass-panel styling as the existing terms modal) with a single email field and a send button.
- On submit: `supabase.auth.resetPasswordForEmail(email, { redirectTo: ${window.location.origin}/reset-password })`.
- Always show the same neutral confirmation regardless of result: "אם האימייל קיים במערכת, נשלח קישור לאיפוס סיסמה" (no account-existence leak).

## 3. New page /reset-password (src/routes/reset-password.tsx)
- Public route (not under the authenticated layout), so the email link works before sign-in.
- Waits for the Supabase recovery session (`onAuthStateChange` / `getSession`); if no recovery session is present, shows a message asking the user to request a new link.
- Form: new password + confirm password, with the same eye toggle behaviour.
- Calls `supabase.auth.updateUser({ password })` (no `current_password` — recovery sessions are exempt), shows a success toast, then navigates to `/app`.
- Own `head()` metadata with a page-specific Hebrew title and description.

## Notes
- RTL alignment and existing cyan/editorial styling preserved; no new dependencies.
- No changes to database, auth guards, server functions, or any other component.
