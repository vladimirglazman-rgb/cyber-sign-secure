import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import type { SignatureRequestApi } from "@/hooks/use-signature-request";
import { isValidEmail } from "@/hooks/use-signature-request";
import { createSignatureRequest } from "@/server/documents.functions";
export function SendBar({ api, paths, resetPaths }: { api: SignatureRequestApi; paths: Record<string, string>; resetPaths: () => void }) {
  const [sending, setSending] = useState(false);
  const qc = useQueryClient();
  const onSend = async () => {
    const file = api.files[0];
    if (!file) { toast.error("יש להעלות קובץ"); return; }
    const filePath = paths[file.id];
    if (!filePath) { toast.error("הקובץ עדיין מועלה"); return; }
    const valid = api.recipients.filter((r) => r.name.trim() && isValidEmail(r.email))
      .map((r) => ({ name: r.name.trim(), email: r.email.trim(), role: r.role }));
    if (valid.length === 0) { toast.error("יש להוסיף לפחות נמען אחד עם אימייל תקין"); return; }
    try {
      setSending(true);
      await createSignatureRequest({ data: {
        filePath, fileName: file.name, subject: api.subject.trim(),
        message: api.message.trim() || null, signInOrder: api.signInOrder,
        reminderDays: api.remindersEnabled ? api.reminderDays : null, recipients: valid,
      }});
      toast.success("הבקשה נשלחה לחתימה בהצלחה");
      api.reset(); resetPaths();
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    } catch (e) { console.error(e); toast.error("אירעה שגיאה, נסה שוב"); }
    finally { setSending(false); }
  };
  return (
    <div className="glass-panel flex items-center justify-between gap-4 p-4">
      <div className="text-xs text-muted-foreground">{api.canSend ? "מוכן לשליחה" : "מלא את כל השדות הנדרשים"}</div>
      <button type="button" onClick={onSend} disabled={!api.canSend || sending}
        className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 font-display text-sm font-bold tracking-wider transition ${api.canSend && !sending ? "bg-primary text-primary-foreground glow-aqua hover:brightness-110" : "cursor-not-allowed bg-muted/30 text-muted-foreground"}`}>
        {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {sending ? "שולח…" : "שלח לחתימה"}
      </button>
    </div>
  );
}
