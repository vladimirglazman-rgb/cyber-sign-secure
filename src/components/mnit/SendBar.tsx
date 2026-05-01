import { useState } from "react";
import { Loader2, MessageCircle, Send } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import type { SignatureRequestApi } from "@/hooks/use-signature-request";
import { isValidEmail } from "@/hooks/use-signature-request";
import { createSignatureRequest } from "@/server/documents.functions";
import { getAuthHeaders } from "@/lib/auth-headers";
import { APP_VERSION } from "@/lib/app-version";
export function SendBar({
  api,
  paths,
  resetPaths,
}: {
  api: SignatureRequestApi;
  paths: Record<string, string>;
  resetPaths: () => void;
}) {
  const [sending, setSending] = useState(false);
  const [shareLinks, setShareLinks] = useState<
    { id: string; name: string; phone: string | null; token: string; fileName: string }[]
  >([]);
  const qc = useQueryClient();
  const openWhatsApp = (item: {
    name: string;
    phone: string | null;
    token: string;
    fileName: string;
  }) => {
    const url = `${window.location.origin}/sign/${item.token}`;
    const text = `שלום, ממתין לך מסמך לחתימה דיגיטלית מאת MNIT Sign. לחתימה מאובטחת לחץ כאן: ${url}`;
    const digits = (item.phone ?? "").replace(/\D/g, "");
    let intl = digits;
    if (digits.startsWith("0")) intl = `972${digits.slice(1)}`;
    if (digits.startsWith("00972")) intl = digits.slice(2);
    window.open(
      intl
        ? `https://wa.me/${intl}?text=${encodeURIComponent(text)}`
        : `https://wa.me/?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };
  const onSend = async () => {
    const file = api.files[0];
    if (!file) {
      toast.error("יש להעלות קובץ");
      return;
    }
    const filePath = paths[file.id];
    if (!filePath) {
      toast.error("הקובץ עדיין מועלה");
      return;
    }
    const valid = api.recipients
      .filter((r) => {
        if (!r.name.trim() || r.verificationValue.trim().length < 4) return false;
        if (r.deliveryMethod === "sms") return r.phone.trim().length >= 7;
        return isValidEmail(r.email);
      })
      .map((r) => ({
        name: r.name.trim(),
        email: r.email.trim(),
        phone: r.phone.trim() || null,
        deliveryMethod: r.deliveryMethod,
        role: r.role,
        verificationType: r.verificationType,
        verificationValue:
          r.verificationType === "phone" && r.deliveryMethod === "sms" && r.phone.trim()
            ? r.phone.trim()
            : r.verificationValue.trim(),
        signatureCoordinates: r.signatureCoordinates ?? null,
      }));
    if (valid.length === 0) {
      toast.error("יש להוסיף לפחות נמען אחד עם פרטים תקינים");
      return;
    }
    try {
      setSending(true);
      const created = await createSignatureRequest({
        headers: await getAuthHeaders(),
        data: {
          filePath,
          fileName: file.name,
          fileType: file.ext || "pdf",
          subject: api.subject.trim(),
          message: api.message.trim() || null,
          signInOrder: api.signInOrder,
          reminderDays: api.remindersEnabled ? api.reminderDays : null,
          recipients: valid,
          version: APP_VERSION,
        },
      });
      const links = (created.recipients ?? [])
        .filter((r) => r.signing_token)
        .map((r) => ({
          id: r.id,
          name: r.name,
          phone: r.phone,
          token: r.signing_token as string,
          fileName: created.fileName,
        }));
      setShareLinks(links);
      // Auto-open WhatsApp for the first recipient that has a phone number.
      const autoTarget = links.find((l) => (l.phone ?? "").replace(/\D/g, "").length >= 7);
      if (autoTarget) {
        openWhatsApp(autoTarget);
      }
      toast.success("הבקשה נוצרה בהצלחה", {
        description: "ניתן לשלוח כעת בוואטסאפ או להעתיק קישור מהפעילות",
      });
      api.reset();
      resetPaths();
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    } catch (e) {
      console.error("SEND_FAILED", e);
      toast.error(e instanceof Error ? e.message : "אירעה שגיאה, נסה שוב");
    } finally {
      setSending(false);
    }
  };
  return (
    <div className="glass-panel flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="text-xs text-muted-foreground">
          {api.canSend ? "מוכן לשליחה" : "מלא את כל השדות הנדרשים"}
        </div>
        <button
          type="button"
          onClick={onSend}
          disabled={!api.canSend || sending}
          className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 font-display text-sm font-bold tracking-wider transition ${api.canSend && !sending ? "bg-primary text-primary-foreground glow-aqua hover:brightness-110" : "cursor-not-allowed bg-muted/30 text-muted-foreground"}`}
        >
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {sending ? "שולח…" : "שלח לחתימה"}
        </button>
      </div>
      {shareLinks.length > 0 && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-2">
          <p className="mb-2 text-[11px] text-muted-foreground">שליחה ידנית מיידית</p>
          <div className="flex flex-wrap gap-2">
            {shareLinks.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => openWhatsApp(item)}
                className="inline-flex items-center gap-1.5 rounded-md border border-primary/40 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary transition hover:bg-primary/20"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                שלח בוואטסאפ · {item.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
