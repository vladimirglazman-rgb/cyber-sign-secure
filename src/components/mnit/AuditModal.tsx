import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Loader2,
  ExternalLink,
  ShieldCheck,
  Clock,
  Globe,
  User,
  FileText,
  Download,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { getAuthHeaders } from "@/lib/auth-headers";
import {
  downloadSignedDocument,
  getDocumentAudit,
  type DocumentAudit,
} from "@/server/documents.functions";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentId: string | null;
};

const verificationLabel: Record<string, string> = {
  id_number: "ת.ז.",
  phone: "טלפון",
};

export function AuditModal({ open, onOpenChange, documentId }: Props) {
  const [data, setData] = useState<DocumentAudit | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!open || !documentId) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    setData(null);
    (async () => {
      try {
        const headers = await getAuthHeaders();
        const res = await getDocumentAudit({ data: { documentId }, headers });
        if (!cancelled) setData(res);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "שגיאה בטעינת נתוני החתימה");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, documentId]);

  const handleDownload = async () => {
    if (!documentId) return;
    try {
      setDownloading(true);
      const headers = await getAuthHeaders();
      const res = await downloadSignedDocument({ data: { documentId }, headers });
      const bin = atob(res.base64);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      const blob = new Blob([bytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = res.fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "הורדת המסמך החתום נכשלה");
    } finally {
      setDownloading(false);
    }
  };

  const hasSignedRecipient = (data?.recipients ?? []).some((r) => r.signature_data_url);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        dir="rtl"
        className="fixed inset-0 left-0 top-0 z-[100] flex h-full max-h-none w-full max-w-none translate-x-0 translate-y-0 flex-col overflow-y-auto rounded-none border-primary/30 bg-background p-6 data-[state=closed]:hidden data-[state=closed]:animate-none sm:left-[50%] sm:top-[50%] sm:block sm:h-auto sm:max-h-[90vh] sm:w-full sm:max-w-2xl sm:translate-x-[-50%] sm:translate-y-[-50%] sm:rounded-2xl sm:bg-transparent sm:glass-panel [&>button.absolute]:hidden"
      >
        <DialogHeader className="relative z-10 space-y-0 text-right">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1 space-y-1.5">
              <DialogTitle className="flex items-center gap-2 font-display text-lg text-primary text-glow">
                <ShieldCheck className="h-5 w-5" /> מסלול חתימה מאומת
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {data?.subject ?? "פרטי חתימה דיגיטלית"}
              </DialogDescription>
            </div>
            <button
              type="button"
              aria-label="סגור"
              onClick={() => onOpenChange(false)}
              className="relative z-[9999] pointer-events-auto cursor-pointer p-2 text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </DialogHeader>

        {loading && (
          <div className="flex items-center justify-center py-10 text-primary">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}

        {error && (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
            {error}
          </div>
        )}

        {data && !loading && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 rounded-md border border-primary/20 bg-primary/5 p-2.5 text-xs text-foreground">
              <FileText className="h-4 w-4 text-primary" />
              <span className="min-w-0 flex-1 truncate">{data.fileName}</span>
              {hasSignedRecipient && (
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={downloading}
                  className="inline-flex items-center gap-1 rounded-md bg-primary px-2.5 py-1 text-[11px] font-semibold text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-60"
                >
                  {downloading ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Download className="h-3 w-3" />
                  )}
                  הורד מסמך חתום
                </button>
              )}
              {data.fileUrl && (
                <a
                  href={data.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-md bg-primary px-2.5 py-1 text-[11px] font-semibold text-primary-foreground shadow hover:bg-primary/90"
                >
                  <ExternalLink className="h-3 w-3" /> פתח מסמך מקור
                </a>
              )}
            </div>

            {data.recipients.length === 0 && (
              <p className="rounded-md border border-primary/10 bg-primary/5 p-3 text-center text-xs text-muted-foreground">
                אין חתימות מאומתות עדיין.
              </p>
            )}

            {data.recipients.map((r) => (
              <div
                key={r.id}
                className="flex flex-col gap-2 rounded-lg border border-primary/20 bg-background/40 p-3"
              >
                <div className="flex items-center gap-2 text-xs text-foreground">
                  <User className="h-3.5 w-3.5 text-primary" />
                  <span className="font-semibold">{r.name}</span>
                  {r.verification_type && (
                    <span className="ml-auto rounded-full bg-primary/15 px-2 py-0.5 text-[10px] text-primary ring-1 ring-primary/30">
                      אומת ב{verificationLabel[r.verification_type] ?? r.verification_type}
                    </span>
                  )}
                </div>

                {r.signature_data_url ? (
                  <div className="rounded-md border border-primary/20 bg-white p-2">
                    <img
                      src={r.signature_data_url}
                      alt={`חתימה של ${r.name}`}
                      className="mx-auto max-h-40 w-auto"
                    />
                  </div>
                ) : (
                  <p className="text-[11px] text-muted-foreground">לא נשמרה תמונת חתימה.</p>
                )}

                <div className="grid grid-cols-1 gap-1.5 text-[11px] text-muted-foreground sm:grid-cols-2">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3 text-primary/70" />
                    {r.signed_at ? (
                      <span>
                        {new Date(r.signed_at).toLocaleDateString("he-IL", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                        <span className="mx-1 text-primary/50">|</span>
                        <span className="text-[10px] text-primary/70">
                          {new Date(r.signed_at).toLocaleTimeString("he-IL", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          })}
                        </span>
                      </span>
                    ) : (
                      "—"
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Globe className="h-3 w-3 text-primary/70" />
                    IP: {r.signed_ip || "—"}
                  </div>
                </div>

                {r.signed_user_agent && (
                  <p
                    className="truncate text-[10px] text-muted-foreground/80"
                    title={r.signed_user_agent}
                  >
                    {r.signed_user_agent}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
