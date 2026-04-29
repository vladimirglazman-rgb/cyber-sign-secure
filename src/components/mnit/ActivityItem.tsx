import { FileText } from "lucide-react";
import type { DocumentRow } from "@/server/documents.functions";
const label: Record<DocumentRow["status"], string> = { pending: "ממתין", signed: "נחתם", cancelled: "בוטל" };
const cls: Record<DocumentRow["status"], string> = {
  pending: "bg-amber-400/15 text-amber-200 ring-amber-300/40",
  signed: "bg-emerald-400/15 text-emerald-200 ring-emerald-300/40",
  cancelled: "bg-rose-400/15 text-rose-200 ring-rose-300/40",
};
export function ActivityItem({ doc }: { doc: DocumentRow }) {
  const date = new Date(doc.created_at).toLocaleDateString("he-IL", { day: "2-digit", month: "2-digit" });
  return (
    <li className="flex items-center gap-3 rounded-lg border border-primary/10 bg-primary/5 p-2.5">
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
    </li>
  );
}
