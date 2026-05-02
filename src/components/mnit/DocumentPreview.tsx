import { useEffect, useMemo, useRef, useState } from "react";
import {
  CheckCircle2,
  ExternalLink,
  FileText,
  ScanLine,
  MapPin,
} from "lucide-react";
import type { SignatureRequestApi, UploadedFile } from "@/hooks/use-signature-request";
import { supabase } from "@/integrations/supabase/client";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
export function DocumentPreview({
  api,
  paths,
}: {
  api: SignatureRequestApi;
  paths?: Record<string, string>;
}) {
  const file = api.selectedFile;
  const recipient = api.selectedRecipient;
  const [proxyUrlState, setProxyUrlState] = useState<{ path: string; url: string } | null>(null);
  const blobUrl = useMemo(() => {
    if (file?.file) return URL.createObjectURL(file.file);
    return null;
  }, [file?.file]);
  useEffect(() => {
    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [blobUrl]);
  const ext = (file?.ext || file?.name.split(".").pop() || "").toLowerCase();
  const remotePath = file ? paths?.[file.id] : undefined;
  // Build a same-origin proxy URL (bypasses ad-blockers that block *.supabase.co).
  useEffect(() => {
    let cancelled = false;
    setProxyUrlState(null);
    if (!remotePath) return;
    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;
        if (!token) return;
        const url = `/api/preview/${remotePath
          .split("/")
          .map(encodeURIComponent)
          .join("/")}?token=${encodeURIComponent(token)}`;
        if (!cancelled) setProxyUrlState({ path: remotePath, url });
      } catch (e) {
        console.error("INLINE_PROXY_URL_FAILED", e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [remotePath]);
  // Prefer same-origin proxy URL. Fall back to local blob until upload completes.
  const currentProxyUrl = proxyUrlState && proxyUrlState.path === remotePath ? proxyUrlState.url : null;
  const openHref = currentProxyUrl ?? blobUrl;
  const isPdf = ext === "pdf";
  const inlineSrc = isPdf ? (currentProxyUrl ?? blobUrl) : null;

  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [pageWidth, setPageWidth] = useState<number>(0);
  const [numPages, setNumPages] = useState<number>(0);

  useEffect(() => {
    if (!wrapRef.current) return;
    const el = wrapRef.current;
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth;
      if (w > 0) setPageWidth(w - 16); // padding allowance
    });
    ro.observe(el);
    setPageWidth(el.clientWidth - 16);
    return () => ro.disconnect();
  }, [inlineSrc]);

  const handlePlacePage = (
    e: React.MouseEvent<HTMLDivElement>,
    pageNumber: number,
  ) => {
    if (!recipient) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const next = [
      ...(recipient.signatureCoordinates ?? []),
      {
        pageNumber,
        x: Math.max(0, Math.min(1, x)),
        y: Math.max(0, Math.min(1, y)),
      },
    ];
    api.updateRecipient(recipient.id, {
      signatureCoordinates: next,
    });
  };
  const coords = recipient?.signatureCoordinates ?? [];

  return (
    <div className="glass-panel flex h-full flex-col p-4">
      <header className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-sm uppercase tracking-[0.2em] text-primary text-glow">
          תצוגה מקדימה
        </h3>
        <div className="flex items-center gap-2">
          <ScanLine className="h-4 w-4 text-primary icon-glow" />
        </div>
      </header>
      {file && recipient && (
        <div className="mb-2 rounded-md border border-primary/20 bg-primary/5 px-3 py-1.5 text-[11px] text-muted-foreground">
          לחץ על המסמך כדי למקם חתימה עבור{" "}
          <span className="text-primary text-glow">{recipient.name || "נמען"}</span>
        </div>
      )}
      <div className="relative flex-1 overflow-hidden rounded-lg border border-primary/30 bg-gradient-to-b from-background/60 to-background/20 p-5">
        {file ? (
          isPdf && inlineSrc ? (
            <div
              ref={wrapRef}
              className="relative h-full w-full overflow-auto rounded-md border border-primary/20 bg-background/40 p-2"
            >
              <Document
                file={inlineSrc}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                loading={
                  <div className="flex h-full items-center justify-center p-6 text-xs text-muted-foreground">
                    טוען מסמך…
                  </div>
                }
                error={
                  <div className="flex h-full items-center justify-center p-6 text-xs text-destructive">
                    לא ניתן להציג את המסמך
                  </div>
                }
              >
                {Array.from({ length: numPages }, (_, i) => {
                  const pageNumber = i + 1;
                  const pinsForPage = coords.filter(
                    (c) => (c.pageNumber || 1) === pageNumber,
                  );
                  return (
                    <div
                      key={pageNumber}
                      onClick={(e) => handlePlacePage(e, pageNumber)}
                      className="relative mx-auto mb-3 w-fit cursor-crosshair"
                    >
                      <Page
                        pageNumber={pageNumber}
                        width={pageWidth || undefined}
                        renderAnnotationLayer={false}
                        renderTextLayer={false}
                      />
                      {pinsForPage.map((c, idx) => (
                        <div
                          key={idx}
                          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full"
                          style={{ left: `${c.x * 100}%`, top: `${c.y * 100}%` }}
                        >
                          <MapPin
                            className="h-7 w-7 text-primary"
                            style={{
                              filter:
                                "drop-shadow(0 0 6px hsl(var(--primary))) drop-shadow(0 0 12px hsl(var(--primary)))",
                            }}
                            fill="hsl(var(--primary) / 0.35)"
                          />
                        </div>
                      ))}
                    </div>
                  );
                })}
              </Document>
              {openHref && (
                <a
                  href={openHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sticky bottom-2 z-20 ms-auto mt-2 inline-flex w-fit items-center gap-1.5 rounded-md border border-primary/60 bg-background/80 px-2.5 py-1 text-[11px] font-semibold text-primary backdrop-blur transition hover:bg-primary/15"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="h-3 w-3" />
                  פתח מקור
                </a>
              )}
            </div>
          ) : (
            <SuccessCard file={file} ext={ext} openHref={openHref} />
          )
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <FileText className="h-10 w-10 text-primary/40" />
            <p className="mt-3 text-xs text-muted-foreground">העלה מסמך כדי לראות תצוגה מקדימה</p>
          </div>
        )}
      </div>
      {file && recipient && (
        <div className="mt-2 text-[11px] text-muted-foreground">
          {coords.length > 0 ? (
            <>{coords.length} מיקומי חתימה נבחרו</>
          ) : (
            <>טרם נבחר מיקום חתימה — לחץ על המסמך כדי להוסיף</>
          )}
        </div>
      )}
    </div>
  );
}

function SuccessCard({
  file,
  ext,
  openHref,
}: {
  file: UploadedFile;
  ext: string;
  openHref: string | null;
}) {
  const extLabel = (ext || "FILE").toUpperCase();
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 p-6 text-center">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-emerald-400/20 blur-2xl" />
        <div
          className="relative flex h-24 w-24 items-center justify-center rounded-full border-2 border-emerald-400/70 bg-emerald-400/10"
          style={{
            boxShadow:
              "0 0 0 1px rgba(52,211,153,0.6), 0 0 24px rgba(52,211,153,0.55), 0 0 60px rgba(52,211,153,0.35)",
          }}
        >
          <CheckCircle2
            className="h-14 w-14 text-emerald-300"
            style={{ filter: "drop-shadow(0 0 10px rgba(52,211,153,0.8))" }}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <p className="font-display text-xs uppercase tracking-[0.3em] text-emerald-300">
          המסמך נטען ומוכן לשליחה
        </p>
        <div className="flex items-center justify-center gap-2">
          <FileText className="h-4 w-4 text-primary icon-glow" />
          <p
            className="max-w-[28ch] truncate text-base font-semibold text-foreground"
            title={file.name}
          >
            {file.name}
          </p>
        </div>
        <p className="text-[11px] text-muted-foreground">
          {extLabel} · {(file.size / 1024).toFixed(0)} KB
        </p>
      </div>

      {openHref ? (
        <a
          href={openHref}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative inline-flex items-center gap-2 rounded-lg border border-primary/70 bg-primary/15 px-6 py-3 text-sm font-semibold text-primary glow-aqua animate-pulse-glow transition hover:bg-primary/25"
        >
          <ExternalLink className="h-4 w-4 icon-glow" />
          <span className="text-glow">פתח מסמך מקורי</span>
        </a>
      ) : (
        <button
          type="button"
          disabled
          className="group relative inline-flex cursor-not-allowed items-center gap-2 rounded-lg border border-primary/70 bg-primary/15 px-6 py-3 text-sm font-semibold text-primary glow-aqua opacity-60"
        >
          <ExternalLink className="h-4 w-4 icon-glow" />
          <span className="text-glow">מכין קישור למסמך…</span>
        </button>
      )}

      <p className="max-w-xs text-[11px] leading-relaxed text-muted-foreground">
        המסמך נפתח בלשונית חדשה לתצוגה מאובטחת ללא חסימות דפדפן.
      </p>
    </div>
  );
}
