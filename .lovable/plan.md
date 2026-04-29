
# Phase 2 — MNIT Sign: AI Refinement & Client Signing Flow

Adds AI text refinement in Step 3, a token-protected public client signing route with drawn signatures and audit log, realtime sidebar updates, and a line-numbers toggle in the document preview. Hebrew RTL throughout. Cyber-Legal aesthetic preserved (aqua glow, glassmorphism, animated grid).

## 1. Database migration

Extend `recipients` with signing/audit columns and add public RPCs that are the **only** anonymous-callable surface (RLS on the table itself stays locked to owners).

New columns on `recipients`:
- `signing_token text unique` — random 24-byte hex (default `encode(gen_random_bytes(24),'hex')`).
- `verification_type text check in ('id_number','phone')`.
- `verification_value_hash text` — sha256 of the ID/phone (never plaintext).
- `signed_at timestamptz`, `signed_ip text`, `signed_user_agent text`.
- `signature_data_url text` — drawn PNG dataURL (size-limited 50–200KB in RPC).
- `opened_at timestamptz` — first verified view.

Three SECURITY DEFINER RPCs granted to `anon`/`authenticated`:
- `peek_signing_token(_token)` → `{ verification_type, recipient_name, document_subject }` for the verification screen.
- `get_signing_context(_token, _verification)` → recipient/document row only on hash match.
- `sign_recipient(_token, _verification, _signature, _ip, _ua)` → updates the recipient, flips the document to `signed` when all signers complete; returns `{ document_id, all_signed }`.
- `mark_recipient_opened(_token, _verification)` → first-open timestamp.

Realtime: add `documents` and `recipients` to `supabase_realtime` publication and set `replica identity full`.

Indexes: `recipients_signing_token_idx`.

## 2. AI refinement (Step 3)

`src/server/ai.functions.ts` exports `refineText`, an auth-protected server fn:
- Input: `{ field: 'subject'|'message', text: string, contextSubject?: string }` (Zod, ≤2000 chars).
- Calls Lovable AI Gateway (`google/gemini-3-flash-preview`) with a Hebrew system prompt: professional, legally-sound, concise; return ONLY the refined text (no preamble).
- Surfaces 429 ("חרגת ממכסת הבקשות") and 402 ("נדרש מילוי קרדיטים").

`src/components/mnit/AiRefineButton.tsx` — Sparkles button + suggestion panel:
- Click → loading state (cyan pulsing `animate-pulse-glow`).
- Result rendered in a glass card below the field with original vs. suggestion (simple side-by-side, NOT word-level diff to keep it lightweight).
- Buttons: **"החל"** / **"בטל"**.

`Step3Settings.tsx` — wires the button next to the subject and message labels.

## 3. Per-recipient verification (Step 2)

Each row in `Step2Recipients.tsx` gets two more controls:
- Select: "אימות לפי" → `ת.ז.` / `טלפון`.
- Input: "ערך אימות" (the actual ID/phone number; basic length validation).

`use-signature-request.ts` — recipients gain `verificationType` and `verificationValue`. `canSend` requires both.

`createSignatureRequest` server fn — hashes `verification_value` with `sha256` server-side and stores the hash + type when inserting recipient rows.

## 4. Public client signing route

New routes (NOT under `_authenticated`):

`src/routes/sign.$token.tsx` — three local stages with smooth transitions:

```text
[1] Verify ID/Phone  →  [2] Document viewer + "Sign Here"  →  [3] Success
```

Stage 1 — Verification:
- On mount: call `peek_signing_token` (anon) to get the recipient name and verification type → render Hebrew prompt.
- Submit → call `verifySigner` server fn (no auth middleware) which calls `get_signing_context`. Cache verification value in component state for subsequent calls. Wrong → toast "פרטי אימות שגויים". Right → call `mark_recipient_opened`, advance.

Stage 2 — Document viewer:
- Server fn `getSignedDocumentUrl` (no auth, but re-validates token+verification) returns a 10-minute signed URL via `supabaseAdmin.storage.from('contracts').createSignedUrl(file_path, 600)`.
- Render in `<iframe>` for PDFs / `<img>` for images. One overlay button "חתום כאן" (mock single zone for Phase 2) opens the modal.

Stage 3 — `SignatureModal` (Shadcn Dialog):
- `<canvas>` 480×180 with pointer events; aqua stroke; "נקה" / "בטל" / "חתום ושלח".
- Submit → `submitSignature` server fn captures `x-forwarded-for` + `user-agent` and calls `sign_recipient` RPC.
- Success → success screen + toast "המסמך נחתם בהצלחה".

`SignatureCanvas.tsx` — small reusable drawing component (pointer events, dpi-aware, `toDataURL('image/png')`).

## 5. Realtime sidebar

`use-dashboard.ts` — after `useQuery`, subscribe to two channels filtered by `owner_id` for `documents` and a join-style filter for `recipients`. On any payload → `queryClient.invalidateQueries(['dashboard'])`. Cleanup on unmount.

## 6. Line numbers toggle

`DocumentPreview.tsx` — small `Hash` icon button in the header toggles a state. When on, each placeholder line is prefixed by `<span class="font-display text-[10px] text-primary text-glow">{nn}</span>`.

## 7. File map

```text
supabase migration                            (recipient cols, 4 RPCs, realtime, indexes)
src/server/ai.functions.ts                    (refineText)
src/server/signing.functions.ts               (peekToken, verifySigner, getSignedDocumentUrl, submitSignature)
src/server/documents.functions.ts             (edit — hash & store verification on recipients)
src/routes/sign.$token.tsx                    (3-stage public flow)
src/components/mnit/SignatureCanvas.tsx       (canvas drawing)
src/components/mnit/SignatureModal.tsx        (Dialog wrapper)
src/components/mnit/AiRefineButton.tsx        (sparkle button + suggestion panel)
src/components/mnit/Step2Recipients.tsx       (edit — verification fields)
src/components/mnit/Step3Settings.tsx         (edit — wire AiRefineButton)
src/components/mnit/DocumentPreview.tsx       (edit — line-numbers toggle)
src/hooks/use-signature-request.ts            (edit — verification fields, canSend)
src/hooks/use-dashboard.ts                    (edit — realtime subscription)
```

## 8. Hebrew copy reference

| Key | Hebrew |
|---|---|
| AI button | שכלל עם AI |
| AI loading | מנתח את הטקסט… |
| Apply / Discard | החל / בטל |
| Step 2 verify type | אימות לפי |
| Step 2 verify value | ערך אימות (ת.ז. / טלפון) |
| Sign route title | חתימה דיגיטלית |
| Verify prompt | אנא הזן את מספר הזהות / הטלפון לאימות |
| Wrong creds | פרטי אימות שגויים |
| Sign here | חתום כאן |
| Modal title | חתום במסגרת |
| Clear | נקה |
| Submit signature | חתום ושלח |
| Sign success | המסמך נחתם בהצלחה |
| Line numbers | מספרי שורות |
| Sidebar realtime | (שקוף — invalidates query) |

## 9. Acceptance criteria

1. Click "שכלל עם AI" on subject/message → loading shimmer → suggestion card with "החל" / "בטל"; applying replaces field text.
2. Step 2 requires `ת.ז.` / `טלפון` value per recipient; sending stores it as sha256 hash.
3. Visiting `/sign/<token>` shows the verification screen in Hebrew RTL; wrong value → toast; correct → document viewer + "חתום כאן".
4. Drawing & submitting flips that recipient to `signed`, records IP/UA/timestamp/dataURL. When all signers complete, document → `signed`.
5. Sender's sidebar stats update **without reload** when a client signs (Realtime).
6. Line-numbers toggle in preview shows glowing cyan numbers.
7. RLS still blocks cross-user access on `documents`/`recipients` tables; the only public surface is the four token RPCs.

## 10. Out of scope (Phase 3+)

Real PDF rendering with click-anywhere zones, email/SMS delivery to recipients, OTP, embedding the rendered signature into the original PDF, downloadable certificate of completion.
