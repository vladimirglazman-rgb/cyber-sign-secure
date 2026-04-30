import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

// Same-origin proxy for document previews. Bypasses ad-blockers / shields that
// block direct *.supabase.co requests. The file path is the splat ($) and the
// caller's Supabase access token is passed as ?token=... (short-lived).
export const Route = createFileRoute("/api/preview/$")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const SUPABASE_URL = process.env.SUPABASE_URL;
        const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;
        if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
          return new Response("Server misconfigured", { status: 500 });
        }

        const url = new URL(request.url);
        const token = url.searchParams.get("token");
        const filePath = (params._splat || "").trim();
        if (!token) return new Response("Unauthorized", { status: 401 });
        if (!filePath) return new Response("Missing path", { status: 400 });

        const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
          global: { headers: { Authorization: `Bearer ${token}` } },
          auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
        });

        // Validate the token and resolve the user.
        const { data: claimsRes, error: claimsErr } = await supabase.auth.getClaims(token);
        const userId = claimsRes?.claims?.sub;
        if (claimsErr || !userId) {
          return new Response("Unauthorized", { status: 401 });
        }

        // Authorization: caller must own the document (or the path must be under their prefix
        // for files that haven't been persisted yet).
        const { data: doc } = await supabase
          .from("documents")
          .select("owner_id, file_name")
          .eq("file_path", filePath)
          .maybeSingle();
        const ownsByPath = filePath.startsWith(`${userId}/`);
        if (doc && doc.owner_id !== userId) {
          return new Response("Forbidden", { status: 403 });
        }
        if (!doc && !ownsByPath) {
          return new Response("Forbidden", { status: 403 });
        }

        // Stream the file from storage.
        const { data: blob, error: dlErr } = await supabase.storage
          .from("contracts")
          .download(filePath);
        if (dlErr || !blob) {
          console.error("PREVIEW_PROXY_DOWNLOAD_ERROR", dlErr);
          return new Response("Not found", { status: 404 });
        }

        const ext = filePath.split(".").pop()?.toLowerCase() ?? "";
        const contentType =
          ext === "pdf"
            ? "application/pdf"
            : ext === "png"
              ? "image/png"
              : ext === "jpg" || ext === "jpeg"
                ? "image/jpeg"
                : ext === "gif"
                  ? "image/gif"
                  : ext === "webp"
                    ? "image/webp"
                    : ext === "docx"
                      ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      : blob.type || "application/octet-stream";

        const fileName = doc?.file_name || filePath.split("/").pop() || "document";
        return new Response(blob, {
          status: 200,
          headers: {
            "Content-Type": contentType,
            "Content-Disposition": `inline; filename="${encodeURIComponent(fileName)}"`,
            "Cache-Control": "private, no-store",
            "X-Content-Type-Options": "nosniff",
          },
        });
      },
    },
  },
});
