import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createHash } from "crypto";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type DocumentRow = {
  id: string;
  file_name: string;
  status: "pending" | "signed" | "cancelled";
  subject: string;
  created_at: string;
};

export type DashboardData = {
  documents: DocumentRow[];
  stats: { total: number; signed: number; pending: number; cancelled: number };
  profile: { full_name: string | null } | null;
};

export const listMyDocuments = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<DashboardData> => {
    const { supabase, userId } = context;

    const [{ data: docs }, { data: profile }] = await Promise.all([
      supabase
        .from("documents")
        .select("id, file_name, status, subject, created_at")
        .order("created_at", { ascending: false })
        .limit(50),
      supabase.from("profiles").select("full_name").eq("id", userId).maybeSingle(),
    ]);

    const documents = (docs ?? []) as DocumentRow[];
    const stats = {
      total: documents.length,
      signed: documents.filter((d) => d.status === "signed").length,
      pending: documents.filter((d) => d.status === "pending").length,
      cancelled: documents.filter((d) => d.status === "cancelled").length,
    };

    return { documents, stats, profile: profile ?? null };
  });

const recipientSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(200),
  role: z.enum(["signer", "cc"]),
  verificationType: z.enum(["id_number", "phone"]),
  verificationValue: z.string().min(4).max(40),
});

const createSchema = z.object({
  filePath: z.string().min(1).max(500),
  fileName: z.string().min(1).max(200),
  subject: z.string().min(1).max(200),
  message: z.string().max(2000).optional().nullable(),
  signInOrder: z.boolean(),
  reminderDays: z.union([z.literal(1), z.literal(3), z.literal(7)]).nullable(),
  recipients: z.array(recipientSchema).min(1).max(20),
});

export const createSignatureRequest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => createSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: doc, error: docErr } = await supabase
      .from("documents")
      .insert({
        owner_id: userId,
        file_name: data.fileName,
        file_path: data.filePath,
        subject: data.subject,
        message: data.message ?? null,
        sign_in_order: data.signInOrder,
        reminder_days: data.reminderDays,
        status: "pending",
      })
      .select("id")
      .single();

    if (docErr || !doc) {
      throw new Error(docErr?.message ?? "Failed to create document");
    }

    const rows = data.recipients.map((r, idx) => ({
      document_id: doc.id,
      name: r.name,
      email: r.email,
      role: r.role,
      signing_order: data.signInOrder ? idx + 1 : null,
      verification_type: r.verificationType,
      verification_value_hash: createHash("sha256")
        .update(r.verificationValue.trim())
        .digest("hex"),
    }));

    const { error: recErr } = await supabase.from("recipients").insert(rows);
    if (recErr) {
      throw new Error(recErr.message);
    }

    return { id: doc.id };
  });