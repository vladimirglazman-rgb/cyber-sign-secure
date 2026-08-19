import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const schema = z.object({
  fileName: z.string().min(1).max(200),
});

export const getUploadTarget = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data, context }) => {
    const { userId } = context;
    // Strip non-ASCII (Hebrew etc.) — Supabase Storage keys must be URL-safe ASCII.
    const dot = data.fileName.lastIndexOf(".");
    const ext = dot >= 0 ? data.fileName.slice(dot).replace(/[^.\w]+/g, "").toLowerCase() : "";
    const base = (dot >= 0 ? data.fileName.slice(0, dot) : data.fileName)
      .replace(/[^\w.\-]+/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_|_$/g, "")
      .slice(0, 60) || "document";
    const path = `${userId}/${Date.now()}_${base}${ext || ".pdf"}`;
    return { path };
  });