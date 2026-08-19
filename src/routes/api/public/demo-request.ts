import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const schema = z.object({
  fullName: z.string().trim().min(2).max(100),
  company: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(9).max(20),
  email: z.string().trim().email().max(255),
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
          company: parsed.company,
          phone: parsed.phone,
          email: parsed.email,
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
              <h2>בקשת דמו חדשה מ-MNIT Sign</h2>
              <p><strong>שם מלא:</strong> ${escape(parsed.fullName)}</p>
              <p><strong>משרד / חברה:</strong> ${escape(parsed.company)}</p>
              <p><strong>טלפון:</strong> ${escape(parsed.phone)}</p>
              <p><strong>אימייל:</strong> ${escape(parsed.email)}</p>
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
                subject: `בקשת דמו חדשה — ${parsed.fullName}`,
                html,
              }),
            });
            if (!res.ok) {
              console.error(`DEMO_REQUEST_EMAIL_FAILED [${res.status}]: ${await res.text()}`);
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
