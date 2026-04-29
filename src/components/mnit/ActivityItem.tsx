import { FileText, Link2, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { DocumentRow } from "@/server/documents.functions";
const label: Record<DocumentRow["status"], string> = { pending: "ממתין", signed: "נחתם", cancelled: "בוטל" };
const cls: Record<DocumentRow["status"], string> = {
  pending: "bg-amber-400/15 text-amber-200 ring-amber-300/40",
  signed: "bg-emerald-400/15 text-emerald-200 ring-emerald-300/40",
  cancelled: "bg-rose-400/15 text-rose-200 ring-rose-300/40",
};
export function ActivityItem({ doc }: { doc: DocumentRow }) {
  const date = new Date(doc.created_at).toLocaleDateString("he-IL", { day: "2-digit", month: "2-digit" });
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const pendingSigners = (doc.recipients ?? []).filter(
    (r) => r.signing_token && r.status !== "signed",
  );
  const copy = async (token: string, name: string) => {
    const url = `${window.location.origin}/sign/${token}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(token);
      toast.success(`הקישור של ${name} הועתק`);
      setTimeout(() => setCopiedId((c) => (c === token ? null : c)), 1500);
    } catch {
      toast.error("העתקה נכשלה");
    }
  };
  return (
    <li className="flex flex-col gap-2 rounded-lg border border-primary/10 bg-primary/5 p-2.5">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 ring-1 ring-primary/30">
          <FileText className="h-4 w-4 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-foreground">{doc.file_name}</p>
          <p className="truncate text-[10px] text-muted-foreground">{doc.subject}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ${cls[doc.status]}`}>{label[doc.status]}</span>
          <span className="text-[10px] text-muted-foreground">{date}</span>
        </div>
      </div>
      {pendingSigners.length > 0 && (
        <ul className="flex flex-col gap-1 ps-1">
          {pendingSigners.map((r) => (
            <li key={r.id} className="flex items-center gap-2">
              <span className="min-w-0 flex-1 truncate text-[10px] text-muted-foreground">{r.name}</span>
              <button
                type="button"
                onClick={() => r.signing_token && copy(r.signing_token, r.name)}
                className="inline-flex items-center gap-1 rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] text-primary transition hover:bg-primary/20"
                title="העתק קישור חתימה"
              >
                {copiedId === r.signing_token ? <Check className="h-3 w-3" /> : <Link2 className="h-3 w-3" />}
                {copiedId === r.signing_token ? "הועתק" : "העתק קישור"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
