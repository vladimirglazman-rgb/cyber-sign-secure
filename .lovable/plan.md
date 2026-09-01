# Add Telegram Notification to Demo Request Flow

## Goal
Extend the existing demo-request notification in `src/routes/api/public/demo-request.ts` so that after the Resend email is sent, a Telegram message is also dispatched via the connected Telegram connector.

## Current State
- Demo request handler lives in `src/routes/api/public/demo-request.ts`.
- It already inserts the lead into `demo_requests` and then sends an owner email through the Resend connector gateway.
- A Telegram workspace connection exists (`vladimirglazman@gmail.com`) but is **not yet linked to this project**, so `TELEGRAM_API_KEY` is not available in the runtime.

## Plan

### 1. Link Telegram connector to the project
- Use `standard_connectors--connect` for connector `telegram`.
- This makes `TELEGRAM_API_KEY` and `LOVABLE_API_KEY` available to the server function without modifying any source file.

### 2. Add Telegram call inside the existing notification block
- In `src/routes/api/public/demo-request.ts`, inside the same `try` block that sends the email (after the email `fetch`), add a second non-blocking `fetch` to:
  `https://connector-gateway.lovable.dev/telegram/sendMessage`
- Headers:
  - `Authorization: Bearer ${LOVABLE_API_KEY}`
  - `X-Connection-Api-Key: ${TELEGRAM_API_KEY}`
  - `Content-Type: application/json`
- Body:
  ```json
  {
    "chat_id": "5780229482",
    "text": "🔔 פנייה חדשה ל-SIGN\nשם: {fullName}\nטלפון: {phone}\nמייל: {email}",
    "parse_mode": "HTML"
  }
  ```
- The Telegram call is wrapped in its own `try/catch` (or uses `.catch`/async-fire-and-forget) so that a Telegram failure is only logged and does not affect the existing email success path or the `200 { ok: true }` response.

### 3. Validation
- Submit a test demo request via the landing page or `curl`.
- Confirm:
  - Email still arrives.
  - Telegram message arrives in chat `5780229482`.
  - If Telegram is unavailable, the endpoint still returns `200 { ok: true }` and logs the error.

## Out of Scope
- No changes to the landing page, modal, form, database schema, auth, or any other route/component.
- No refactoring of the existing email logic beyond inserting the Telegram call immediately after it.
