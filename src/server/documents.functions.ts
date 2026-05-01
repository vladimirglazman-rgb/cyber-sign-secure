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
  version?: string | null;
  recipients?: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    delivery_method: "email" | "sms";
    signing_token: string | null;
    status: string;
  }[];
};

export type DashboardData = {
  documents: DocumentRow[];
  stats: { total: number; signed: number; pending: number; cancelled: number };
  profile: { full_name: string | null } | null;
};

export const listMyDocuments = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<DashboardData> => {
    try {
      const { supabase, userId } = context;
      const [docsRes, profileRes] = await Promise.all([
        supabase
          .from("documents")
          .select(
            "id, file_name, status, subject, created_at, version, recipients(id, name, email, phone, delivery_method, signing_token, status)",
          )
          .order("created_at", { ascending: false })
          .limit(50),
        supabase.from("profiles").select("full_name").eq("id", userId).maybeSingle(),
      ]);
      if (docsRes.error) console.error("DASHBOARD_DOCS_ERROR", docsRes.error);
      if (profileRes.error) console.error("DASHBOARD_PROFILE_ERROR", profileRes.error);
      const documents = (docsRes.data ?? []) as DocumentRow[];
      const stats = {
        total: documents.length,
        signed: documents.filter((d) => d.status === "signed").length,
        pending: documents.filter((d) => d.status === "pending").length,
        cancelled: documents.filter((d) => d.status === "cancelled").length,
      };
      return { documents, stats, profile: profileRes.data ?? null };
    } catch (err) {
      console.error("LIST_MY_DOCUMENTS_FAILED", err);
      return {
        documents: [],
        stats: { total: 0, signed: 0, pending: 0, cancelled: 0 },
        profile: null,
      };
    }
  });

const recipientSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(200).or(z.literal("")),
  phone: z.string().max(40).optional().nullable(),
  deliveryMethod: z.enum(["email", "sms"]).default("email"),
  role: z.enum(["signer", "cc"]),
  verificationType: z.enum(["id_number", "phone"]),
  verificationValue: z.string().min(4).max(40),
  signatureCoordinates: z
    .object({
      pageNumber: z.number().int().min(1).max(2000),
      x: z.number().min(0).max(1),
      y: z.number().min(0).max(1),
    })
    .nullable()
    .optional(),
});

const createSchema = z.object({
  filePath: z.string().min(1).max(500),
  fileName: z.string().min(1).max(200),
  fileType: z
    .string()
    .min(1)
    .max(12)
    .regex(/^[a-z0-9]+$/i)
    .default("pdf"),
  subject: z.string().min(1).max(200),
  message: z.string().max(2000).optional().nullable(),
  signInOrder: z.boolean(),
  reminderDays: z.union([z.literal(1), z.literal(3), z.literal(7)]).nullable(),
  recipients: z.array(recipientSchema).min(1).max(20),
  version: z.string().min(1).max(40).optional().nullable(),
});

export const createSignatureRequest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => createSchema.parse(data))
  .handler(async ({ data, context }) => {
    try {
      const { supabase, userId } = context;

      const { data: doc, error: docErr } = await supabase
        .from("documents")
        .insert({
          owner_id: userId,
          file_name: data.fileName,
          file_path: data.filePath,
          file_type: data.fileType.toLowerCase(),
          subject: data.subject,
          message: data.message ?? null,
          sign_in_order: data.signInOrder,
          reminder_days: data.reminderDays,
          version: data.version ?? "v1.0.4",
          status: "pending",
        } as never)
        .select("id")
        .single();

      if (docErr || !doc) {
        console.error("DOCUMENT_INSERT_ERROR", docErr);
        throw new Error("שמירת המסמך נכשלה");
      }

      const rows = data.recipients.map((r, idx) => ({
        document_id: doc.id,
        name: r.name,
        email: r.email,
        phone: r.phone?.trim() || null,
        delivery_method: r.deliveryMethod,
        role: r.role,
        signing_order: data.signInOrder ? idx + 1 : null,
        verification_type: r.verificationType,
        verification_value_hash: createHash("sha256")
          .update(r.verificationValue.trim())
          .digest("hex"),
        signature_coordinates: r.signatureCoordinates ?? null,
      }));

      const { data: recipients, error: recErr } = await supabase
        .from("recipients")
        .insert(rows)
        .select("id, name, email, phone, delivery_method, signing_token");
      if (recErr || !recipients) {
        console.error("RECIPIENTS_INSERT_ERROR", recErr);
        throw new Error("שמירת הנמענים נכשלה");
      }

      return { id: doc.id, fileName: data.fileName, recipients };
    } catch (err) {
      console.error("CREATE_SIGNATURE_REQUEST_FAILED", err);
      throw err instanceof Error ? err : new Error("שליחה נכשלה");
    }
  });

const signedUrlSchema = z.object({ filePath: z.string().min(1).max(500) });

export const getOwnerSignedUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => signedUrlSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    // Ensure the file path belongs to a document owned by the caller.
    const { data: doc, error } = await supabase
      .from("documents")
      .select("id, owner_id, file_path")
      .eq("file_path", data.filePath)
      .maybeSingle();
    // Allow newly-uploaded files (not yet persisted) only if path is under user's prefix.
    const ownsByPath = data.filePath.startsWith(`${userId}/`);
    if (error) console.error("SIGNED_URL_LOOKUP_ERROR", error);
    if (doc && doc.owner_id !== userId) {
      throw new Error("Forbidden");
    }
    if (!doc && !ownsByPath) {
      throw new Error("Forbidden");
    }
    const { data: signed, error: sErr } = await supabase.storage
      .from("contracts")
      .createSignedUrl(data.filePath, 60);
    if (sErr || !signed?.signedUrl) {
      console.error("SIGNED_URL_ERROR", sErr);
      throw new Error("יצירת קישור נכשלה");
    }
    return { url: signed.signedUrl };
  });

const auditSchema = z.object({ documentId: z.string().uuid() });

export type SignedRecipientAudit = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  verification_type: string | null;
  signed_at: string | null;
  signed_ip: string | null;
  signed_user_agent: string | null;
  signature_data_url: string | null;
};

export type DocumentAudit = {
  fileName: string;
  subject: string;
  fileUrl: string | null;
  recipients: SignedRecipientAudit[];
};

export const getDocumentAudit = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => auditSchema.parse(data))
  .handler(async ({ data, context }): Promise<DocumentAudit> => {
    const { supabase, userId } = context;
    const { data: doc, error: docErr } = await supabase
      .from("documents")
      .select("id, owner_id, file_name, file_path, subject")
      .eq("id", data.documentId)
      .maybeSingle();
    if (docErr || !doc) throw new Error("המסמך לא נמצא");
    if (doc.owner_id !== userId) throw new Error("Forbidden");

    const { data: recipients, error: recErr } = await supabase
      .from("recipients")
      .select(
        "id, name, email, phone, verification_type, signed_at, signed_ip, signed_user_agent, signature_data_url, status",
      )
      .eq("document_id", data.documentId)
      .eq("status", "signed");
    if (recErr) console.error("AUDIT_RECIPIENTS_ERROR", recErr);

    const { data: signed } = await supabase.storage
      .from("contracts")
      .createSignedUrl(doc.file_path, 600);

    return {
      fileName: doc.file_name,
      subject: doc.subject,
      fileUrl: signed?.signedUrl ?? null,
      recipients: (recipients ?? []) as SignedRecipientAudit[],
    };
  });
