import { useEffect, useMemo, useState } from "react";
import { ExternalLink, FileText, Hash, Loader2, ScanLine } from "lucide-react";
import type { SignatureRequestApi } from "@/hooks/use-signature-request";
export function DocumentPreview({ api }: { api: SignatureRequestApi }) {
  const file = api.selectedFile;
  const [showLines, setShowLines] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewFailed, setPreviewFailed] = useState(false);
  const blobUrl = useMemo(() => {
    if (file?.file) return URL.createObjectURL(file.file);
    return null;
  }, [file?.file]);
  useEffect(() => {
    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [blobUrl]);
  useEffect(() => {
    setPreviewFailed(false);
    setLoading(!!blobUrl);
    if (!blobUrl) return;
    const timer = window.setTimeout(() => setLoading(false), 2500);
    return () => window.clearTimeout(timer);
  }, [blobUrl]);
  const isImage = !!file && /\.(png|jpe?g|gif|webp)$/i.test(file.name);
  const isPdf = !!file && (/\.pdf$/i.test(file.name) || file.type === "application/pdf");
  return (
    <div className="glass-panel flex h-full flex-col p-4">
      <header className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-sm uppercase tracking-[0.2em] text-primary text-glow">
          תצוגה מקדימה
        </h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowLines((s) => !s)}
            title="מספרי שורות"
            className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[10px] font-display tracking-wider transition ${showLines ? "border-primary bg-primary/15 text-primary text-glow" : "border-primary/20 text-muted-foreground hover:border-primary/40 hover:text-primary"}`}
          >
            <Hash className="h-3 w-3" /> שורות
          </button>
          <ScanLine className="h-4 w-4 text-primary icon-glow" />
        </div>
      </header>
      <div className="relative flex-1 overflow-hidden rounded-lg border border-primary/30 bg-gradient-to-b from-background/60 to-background/20 p-5">
        {file ? (
          <>
            <div className="mb-3 flex items-center gap-2 border-b border-primary/20 pb-2">
              <FileText className="h-4 w-4 text-primary" />
              <span className="truncate text-xs font-medium text-foreground">{file.name}</span>
            </div>
            {blobUrl && (isPdf || isImage) ? (
              <div className="relative h-[calc(100%-2.5rem)] w-full overflow-hidden rounded-md border border-primary/20 bg-background/60">
                <a
                  href={blobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute end-2 top-2 z-20 inline-flex items-center gap-1 rounded-md border border-primary/50 bg-background/85 px-2 py-1 text-[10px] font-semibold text-primary glow-aqua backdrop-blur transition hover:bg-primary/10"
                >
                  <ExternalLink className="h-3 w-3" />
                  פתח בלשונית חדשה
                </a>
                {loading && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/40 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-2 text-primary">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span className="text-xs text-glow">Loading Document...</span>
                    </div>
                  </div>
                )}
                {previewFailed && (
                  <div className="absolute inset-x-3 bottom-3 z-20 rounded-md border border-primary/30 bg-background/90 p-2 text-center text-xs text-muted-foreground backdrop-blur">
                    לא ניתן להציג את המסמך כאן. ניתן לפתוח אותו בלשונית חדשה.
                  </div>
                )}
                {isImage ? (
                  <img
                    src={blobUrl}
                    alt={file.name}
                    onLoad={() => setLoading(false)}
                    onError={() => {
                      setLoading(false);
                      setPreviewFailed(true);
                    }}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <object
                    data={blobUrl}
                    type="application/pdf"
                    title={file.name}
                    className="h-full w-full bg-background"
                  >
                    <iframe
                      src={blobUrl}
                      title={file.name}
                      onLoad={() => setLoading(false)}
                      className="h-full w-full bg-background"
                    />
                  </object>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {Array.from({ length: 14 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    {showLines && (
                      <span className="font-display text-[9px] tracking-wider text-primary text-glow w-5 shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    )}
                    <div
                      className="h-2 rounded-full bg-primary/15"
                      style={{ width: `${60 + ((i * 13) % 35)}%` }}
                    />
                  </div>
                ))}
                <div className="absolute bottom-4 end-4 flex h-16 w-32 items-center justify-center rounded border border-dashed border-primary/60 bg-primary/5 text-[10px] font-display tracking-wider text-primary text-glow">
                  SIGN HERE
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <FileText className="h-10 w-10 text-primary/40" />
            <p className="mt-3 text-xs text-muted-foreground">העלה מסמך כדי לראות תצוגה מקדימה</p>
          </div>
        )}
      </div>
    </div>
  );
}
