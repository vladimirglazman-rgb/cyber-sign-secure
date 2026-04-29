import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getRequest } from "@tanstack/react-start/server";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const tokenSchema = z.object({ token: z.string().min(20).max(200) });
const verifySchema = tokenSchema.extend({
  verification: z.string().min(4).max(40),
});
const signSchema = verifySchema.extend({
  signature: z.string().min(50).max(200000),
});

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
  .inputValidator((d: unknown) => verifySchema.parse(d))
  .handler(async ({ data }) => {
    const { data: rows, error } = await supabaseAdmin.rpc("get_signing_context", {
      _token: data.token,
      _verification: data.verification.trim(),
    });
    if (error) {
      console.error(error);
      throw new Error("שגיאה באימות");
    }
    const row = rows?.[0];
    if (!row) throw new Error("פרטי אימות שגויים");

    await supabaseAdmin.rpc("mark_recipient_opened", {
      _token: data.token,
      _verification: data.verification.trim(),
    });

    const { data: signed } = await supabaseAdmin.storage
      .from("contracts")
      .createSignedUrl(row.file_path, 600);

    return {
      fileName: row.file_name,
      subject: row.subject,
      message: row.message,
      alreadySigned: row.already_signed,
      fileUrl: signed?.signedUrl ?? null,
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

    const { data: rows, error } = await supabaseAdmin.rpc("sign_recipient", {
      _token: data.token,
      _verification: data.verification.trim(),
      _signature: data.signature,
      _ip: ip,
      _ua: ua,
    });
    if (error) {
      console.error(error);
      const msg = error.message?.includes("already_signed")
        ? "המסמך כבר נחתם"
        : error.message?.includes("verification_failed")
          ? "פרטי אימות שגויים"
          : "שגיאה בשליחת החתימה";
      throw new Error(msg);
    }
    const row = rows?.[0];
    return { allSigned: !!row?.all_signed };
  });