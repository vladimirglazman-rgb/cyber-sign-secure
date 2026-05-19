## Plan: restore all-pins signing view with original names

1. **Return all document pins from verification**
   - In `verifySigner`, keep the existing 2FA/token validation unchanged.
   - After verifying the active recipient, fetch all recipients for the same document with `id`, `name`, `status`, and `signature_coordinates`.
   - Build the signing-view coordinates by flattening every recipient’s `signature_coordinates`, preserving every pin and attaching that recipient’s `name` as the pin label.
   - Do not change database schema, auth, token checks, or signing submission workflow.

2. **Carry per-pin labels through the signing page state**
   - Extend the signing coordinate type used by the client to include an optional `label`/`recipientName` field.
   - Keep the existing click-to-place completion logic based on the flattened array index, so all visible pins must be clicked before submit.

3. **Render each pin’s own label in `SignerPdfViewer`**
   - Remove the single shared `pinLabel={ctx.signerName}` behavior from the signing route.
   - In the PDF viewer, render every coordinate in the array as it already does, but show `coordinate.label` for each pin badge.
   - Keep the fallback text only for legacy/missing labels.
   - Preserve the existing signed badge, buttons, layout, responsiveness, and all click behavior.

4. **Verify the regression target**
   - Confirm there is no `.slice`, single-recipient filtering, or single shared label left in the signing view rendering path.
   - Check that the viewer count and completion count use the full flattened all-pins array.