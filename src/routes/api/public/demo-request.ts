import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const schema = z.object({
  fullName: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(9).max(20),
  message: z.string().trim().min(1).max(500),
});

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const Route = createFileRoute("/api/public/demo-request")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let parsed;
        try {
          parsed = schema.parse(await request.json());
        } catch {
          return new Response("Invalid input", { status: 400 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { error } = await supabaseAdmin.from("demo_requests").insert({
          full_name: parsed.fullName,
          phone: parsed.phone,
          message: parsed.message,
        });
        if (error) {
          console.error("DEMO_REQUEST_INSERT_FAILED", error.message);
          return new Response("Could not save request", { status: 500 });
        }

        // Notify the site owner. A failure here must not fail the request —
        // the lead is already stored.
        try {
          const lovableKey = process.env["LOVABLE_API_KEY"];
          const resendKey = process.env["RESEND_API_KEY"];
          if (lovableKey && resendKey) {
            const html = `<div dir="rtl" style="font-family:Arial,sans-serif">
              <h2>פנייה חדשה מ-MNIT Sign</h2>
              <p><strong>שם:</strong> ${escape(parsed.fullName)}</p>
              <p><strong>טלפון:</strong> ${escape(parsed.phone)}</p>
              <p><strong>הודעה:</strong> ${escape(parsed.message)}</p>
            </div>`;
            const res = await fetch("https://connector-gateway.lovable.dev/resend/emails", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${lovableKey}`,
                "X-Connection-Api-Key": resendKey,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                from: "MNIT Sign <onboarding@resend.dev>",
                to: ["eitanglazman@gmail.com"],
                subject: `פנייה חדשה — ${parsed.fullName}`,
                html,
              }),
            });
            if (!res.ok) {
              console.error(`DEMO_REQUEST_EMAIL_FAILED [${res.status}]: ${await res.text()}`);
            }

            // Send a Telegram notification as well. This is best-effort and must
            // not block the successful response if it fails.
            const telegramKey = process.env["TELEGRAM_API_KEY"];
            if (lovableKey && telegramKey) {
              try {
                const text = `🔔 פנייה חדשה ל-SIGN\nשם: ${parsed.fullName}\nטלפון: ${parsed.phone}\nהודעה: ${parsed.message}`;
                const telegramRes = await fetch("https://connector-gateway.lovable.dev/telegram/sendMessage", {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${lovableKey}`,
                    "X-Connection-Api-Key": telegramKey,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    chat_id: "5780229482",
                    text,
                    parse_mode: "HTML",
                  }),
                });
                if (!telegramRes.ok) {
                  console.error(`DEMO_REQUEST_TELEGRAM_FAILED [${telegramRes.status}]: ${await telegramRes.text()}`);
                }
              } catch (e) {
                console.error("DEMO_REQUEST_TELEGRAM_ERROR", e);
              }
            }
          } else {
            console.warn("DEMO_REQUEST_EMAIL_SKIPPED: email provider not connected");
          }
        } catch (e) {
          console.error("DEMO_REQUEST_EMAIL_ERROR", e);
        }

        return Response.json({ ok: true });
      },
    },
  },
});
