import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getRequest } from "@tanstack/react-start/server";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { createHash } from "crypto";

const tokenSchema = z.object({ token: z.string().min(20).max(200) });
const dualSchema = tokenSchema.extend({
  idNumber: z.string().min(4).max(40),
  phone: z.string().min(4).max(40),
});
const signSchema = dualSchema.extend({
  signature: z.string().min(50).max(200000),
});

const normalizePhone = (s: string) => s.replace(/\D+/g, "");
const MISMATCH_MSG = "פרטי הזיהוי (ת.ז. או טלפון) אינם תואמים את רישומי המערכת.";

export const peekToken = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => tokenSchema.parse(d))
  .handler(async ({ data }) => {
    const { data: rows, error } = await supabaseAdmin.rpc("peek_signing_token", {
      _token: data.token,
    });
    if (error) {
      console.error(error);
      throw new Error("הקישור לא תקין");
    }
    const row = rows?.[0];
    if (!row) throw new Error("הקישור לא תקין או שפג תוקפו");
    return row;
  });

export const verifySigner = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => dualSchema.parse(d))
  .handler(async ({ data }) => {
    const idTrim = data.idNumber.trim();
    const phoneTrim = data.phone.trim();
    const idHash = createHash("sha256").update(idTrim).digest("hex");
    const phoneNorm = normalizePhone(phoneTrim);

    const { data: rec, error: recErr } = await supabaseAdmin
      .from("recipients")
      .select(
        "id, document_id, phone, verification_value_hash, status, signature_coordinates",
      )
      .eq("signing_token", data.token)
      .maybeSingle();
    if (recErr) {
      console.error(recErr);
      throw new Error("שגיאה באימות");
    }
    if (!rec) throw new Error(MISMATCH_MSG);

    const storedPhone = normalizePhone(String(rec.phone ?? ""));
    const idMatch = rec.verification_value_hash === idHash;
    const phoneMatch = !!storedPhone && storedPhone === phoneNorm;
    if (!idMatch || !phoneMatch) {
      throw new Error(MISMATCH_MSG);
    }

    const { data: doc, error: docErr } = await supabaseAdmin
      .from("documents")
      .select("id, file_name, file_path, subject, message")
      .eq("id", rec.document_id)
      .maybeSingle();
    if (docErr || !doc) throw new Error("שגיאה בטעינת המסמך");

    const row = {
      recipient_id: rec.id,
      file_name: doc.file_name,
      file_path: doc.file_path,
      subject: doc.subject,
      message: doc.message,
      already_signed: rec.status === "signed",
    };

    await supabaseAdmin
      .from("recipients")
      .update({ opened_at: new Date().toISOString() } as never)
      .eq("id", rec.id)
      .is("opened_at", null);

    const { data: signed } = await supabaseAdmin.storage
      .from("contracts")
      .createSignedUrl(row.file_path, 600);

    let coordinates: { pageNumber: number; x: number; y: number }[] = [];
    try {
      const raw = rec?.signature_coordinates;
      if (Array.isArray(raw)) {
        coordinates = raw
          .map((c) => {
            const obj = (c && typeof c === "object" ? c : {}) as Record<string, unknown>;
            return {
              pageNumber: Number(obj.pageNumber ?? 1) || 1,
              x: Number(obj.x ?? 0),
              y: Number(obj.y ?? 0),
            };
          })
          .filter((c) => Number.isFinite(c.x) && Number.isFinite(c.y));
      }
    } catch (e) {
      console.error("FETCH_COORDS_FAILED", e);
    }

    return {
      fileName: row.file_name,
      subject: row.subject,
      message: row.message,
      alreadySigned: row.already_signed,
      fileUrl: signed?.signedUrl ?? null,
      coordinates,
    };
  });

export const submitSignature = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => signSchema.parse(d))
  .handler(async ({ data }) => {
    const req = getRequest();
    const ip =
      req?.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req?.headers.get("x-real-ip") ??
      "";
    const ua = req?.headers.get("user-agent") ?? "";

    // Re-verify both factors before signing.
    const idTrim = data.idNumber.trim();
    const phoneNorm = normalizePhone(data.phone.trim());
    const idHash = createHash("sha256").update(idTrim).digest("hex");
    const { data: rec } = await supabaseAdmin
      .from("recipients")
      .select("id, phone, verification_value_hash")
      .eq("signing_token", data.token)
      .maybeSingle();
    if (
      !rec ||
      rec.verification_value_hash !== idHash ||
      normalizePhone(String(rec.phone ?? "")) !== phoneNorm
    ) {
      throw new Error(MISMATCH_MSG);
    }

    const { data: rows, error } = await supabaseAdmin.rpc("sign_recipient", {
      _token: data.token,
      _verification: idTrim,
      _signature: data.signature,
      _ip: ip,
      _ua: ua,
    });
    if (error) {
      console.error(error);
      const msg = error.message?.includes("already_signed")
        ? "המסמך כבר נחתם"
        : error.message?.includes("verification_failed")
          ? MISMATCH_MSG
          : "שגיאה בשליחת החתימה";
      throw new Error(msg);
    }
    const row = rows?.[0];
    return { allSigned: !!row?.all_signed };
  });

export const findNextSignerForPhone = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({ token: z.string().min(20).max(200), phone: z.string().min(4).max(40) })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const phoneNorm = normalizePhone(data.phone);
    const { data: current } = await supabaseAdmin
      .from("recipients")
      .select("document_id")
      .eq("signing_token", data.token)
      .maybeSingle();
    if (!current) return { token: null, name: null };
    const { data: peers } = await supabaseAdmin
      .from("recipients")
      .select("name, phone, signing_token, status")
      .eq("document_id", current.document_id)
      .neq("status", "signed");
    const next = (peers ?? []).find(
      (r) => normalizePhone(String(r.phone ?? "")) === phoneNorm && r.signing_token,
    );
    return next ? { token: next.signing_token, name: next.name } : { token: null, name: null };
  });