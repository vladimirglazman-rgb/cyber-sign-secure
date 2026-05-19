## Fix: Per-signer named pins on the signing page

### Findings

- **Pin filtering is already correct.** `verifySigner` (`src/server/signing.functions.ts`) loads `signature_coordinates` from the recipient row matched by the signing token, so each signer already receives only their own pins.
- **DB confirms multiple pins per recipient are stored properly** (e.g. one row has 4 pins). The full array reaches the client via the `coordinates` field returned by `verifySigner`.
- **The hardcoded badge text "חתום כאן"** on every pin lives in `src/components/mnit/SignerPdfViewer.tsx`. There is no per-pin label in the data model — the natural label is the active signer's name (returned by `peek_signing_token` as `recipient_name`).
- The "only one pin appears" symptom most likely reflects sessions where only one pin was placed per recipient during setup; the rendering loop in `SignerPdfViewer` already maps over every coordinate. We will still add a defensive review to make sure nothing slices/caps the array.

### Changes

1. **`src/server/signing.functions.ts` — `verifySigner`**
   - Also fetch `recipients.name` and return it as `signerName` in the response.
   - Leave the coordinate-mapping loop untouched (it already preserves every entry); just confirm no `.slice` / index access is added.

2. **`src/routes/sign.$token.tsx`**
   - Extend the `Ctx` type with `signerName: string`.
   - Pass `signerName` from `ctx` down into `<SignerPdfViewer />` as a new prop (e.g. `pinLabel={ctx.signerName}`).
   - No changes to the 2FA flow, routing, or submit logic.

3. **`src/components/mnit/SignerPdfViewer.tsx`**
   - Add an optional `pinLabel?: string` prop.
   - Replace the hardcoded `חתום כאן` badge text with `pinLabel ?? "חתום כאן"` (fallback keeps existing behavior if the prop is missing).
   - Keep the existing `נחתם ✓` badge for already-placed pins unchanged.
   - Keep the render loop as-is so **all** coordinates for the active signer render.
   - Preserve responsive layout (no class changes beyond the badge text).

### Out of scope (per the strict constraint)

- No DB schema changes (no per-pin label field is added).
- No changes to the 2FA verification flow, RPCs, or signing submission.
- No changes to the sender-side configuration UI in `DocumentPreview.tsx`.

### Technical notes

- `peek_signing_token` already exposes `recipient_name`, but the signing page only stores it in the `peek` state before verification. Returning `signerName` from `verifySigner` keeps the viewer's data source consistent with the rest of the verified context.
- Fallback to `"חתום כאן"` ensures backward safety if `signerName` is ever missing.
