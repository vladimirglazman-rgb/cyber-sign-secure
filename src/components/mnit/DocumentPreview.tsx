import { useEffect, useMemo, useState } from "react";
import { FileText, ScanLine, Hash, Loader2 } from "lucide-react";
import type { SignatureRequestApi } from "@/hooks/use-signature-request";
export function DocumentPreview({ api }: { api: SignatureRequestApi }) {
  const file = api.selectedFile;
  const [showLines, setShowLines] = useState(false);
  const [loading, setLoading] = useState(false);
  const blobUrl = useMemo(() => {
    if (file?.file) return URL.createObjectURL(file.file);
    return null;
  }, [file?.file]);
  useEffect(() => {
    return () => { if (blobUrl) URL.revokeObjectURL(blobUrl); };
  }, [blobUrl]);
  useEffect(() => { if (blobUrl) setLoading(true); }, [blobUrl]);
  const isImage = !!file && /\.(png|jpe?g|gif|webp)$/i.test(file.name);
  const isPdf = !!file && (/\.pdf$/i.test(file.name) || file.type === "application/pdf");
  return (
    <div className="glass-panel flex h-full flex-col p-4">
      <header className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-sm uppercase tracking-[0.2em] text-primary text-glow">תצוגה מקדימה</h3>
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
                {loading && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/40 backdrop-blur-sm">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  </div>
                )}
                {isImage ? (
                  <img
                    src={blobUrl}
                    alt={file.name}
                    onLoad={() => setLoading(false)}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <iframe
                    src={blobUrl}
                    title={file.name}
                    onLoad={() => setLoading(false)}
                    className="h-full w-full bg-white"
                  />
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
                  <div className="h-2 rounded-full bg-primary/15" style={{ width: `${60 + ((i * 13) % 35)}%` }} />
                </div>
              ))}
              <div className="absolute bottom-4 end-4 flex h-16 w-32 items-center justify-center rounded border border-dashed border-primary/60 bg-primary/5 text-[10px] font-display tracking-wider text-primary text-glow">SIGN HERE</div>
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
