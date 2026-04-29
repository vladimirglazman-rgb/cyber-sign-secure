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
    const safe = data.fileName.replace(/[^\w.\-\u0590-\u05FF]+/g, "_").slice(-120);
    const path = `${userId}/${Date.now()}_${safe}`;
    return { path };
  });