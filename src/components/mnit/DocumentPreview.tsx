import { useEffect, useMemo, useRef, useState } from "react";
import {
  CheckCircle2,
  ExternalLink,
  FileText,
  ScanLine,
  MapPin,
  Maximize2,
  Check,
} from "lucide-react";
import type { SignatureRequestApi, UploadedFile } from "@/hooks/use-signature-request";
import { supabase } from "@/integrations/supabase/client";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useIsMobile } from "@/hooks/use-mobile";
import { getRecipientColor, type RecipientColor } from "@/lib/recipient-colors";

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
  const isMobile = useIsMobile();
  const [fsOpen, setFsOpen] = useState(false);

  const recipientIndex = recipient
    ? api.recipients.findIndex((r) => r.id === recipient.id)
    : -1;
  const activeColor: RecipientColor = getRecipientColor(
    recipientIndex >= 0 ? recipientIndex : 0,
  );

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
  const totalCoords = api.recipients.reduce(
    (sum, r) => sum + (r.signatureCoordinates?.length ?? 0),
    0,
  );

  const handleRemovePin = (
    e: React.MouseEvent<HTMLDivElement>,
    pinIndex: number,
  ) => {
    e.stopPropagation();
    if (!recipient) return;
    const next = (recipient.signatureCoordinates ?? []).filter(
      (_, i) => i !== pinIndex,
    );
    api.updateRecipient(recipient.id, { signatureCoordinates: next });
  };

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
      {file && api.recipients.length > 0 && (
        <div
          className="mb-2 flex items-center gap-2 rounded-md border px-3 py-2"
          style={{ borderColor: activeColor.border, background: activeColor.bg }}
        >
          <span
            className="text-[11px] uppercase tracking-[0.18em]"
            style={{ color: activeColor.text, textShadow: `0 0 8px ${activeColor.hex}` }}
          >
            נמען פעיל
          </span>
          <select
            value={recipient?.id ?? ""}
            onChange={(e) => api.setSelectedRecipientId(e.target.value)}
            className="ms-auto rounded-md border bg-background/70 px-2 py-1 text-xs outline-none"
            style={{
              borderColor: activeColor.border,
              color: activeColor.text,
              boxShadow: `0 0 0 1px ${activeColor.border}, 0 0 10px ${activeColor.hex}55`,
            }}
          >
            {api.recipients.map((r, idx) => {
              const c = getRecipientColor(idx);
              return (
                <option key={r.id} value={r.id} style={{ color: c.hex }}>
                  {`● ` +
                    (r.name || `נמען ${idx + 1}`) +
                  (r.role === "cc" ? " (העתק)" : "") +
                  ` · ${(r.signatureCoordinates?.length ?? 0)} סיכות`}
              </option>
              );
            })}
          </select>
        </div>
      )}
      {file && recipient && isPdf && inlineSrc && isMobile && (
        <button
          type="button"
          onClick={() => setFsOpen(true)}
          className="mb-2 inline-flex w-full items-center justify-center gap-2 rounded-md border px-3 py-2 text-xs font-semibold transition"
          style={{
            borderColor: activeColor.border,
            background: activeColor.bg,
            color: activeColor.text,
            boxShadow: `0 0 12px ${activeColor.hex}66`,
          }}
        >
          <Maximize2 className="h-4 w-4" />
          סמן מקומות חתימה
        </button>
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
                  // Render pins for ALL recipients so the sender sees the full picture,
                  // each in their own color. Selected recipient's pins glow stronger.
                  const allPins = api.recipients.flatMap((r, rIdx) => {
                    const color = getRecipientColor(rIdx);
                    const isActive = recipient?.id === r.id;
                    return (r.signatureCoordinates ?? [])
                      .map((c, idx) => ({ c, idx, r, rIdx, color, isActive }))
                      .filter(({ c }) => (c.pageNumber || 1) === pageNumber);
                  });
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
                      {allPins.map(({ c, idx, r, color, isActive }) => (
                        <div
                          key={`${r.id}-${idx}`}
                          role="button"
                          title="לחץ להסרת סיכה"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isActive) {
                              api.setSelectedRecipientId(r.id);
                              return;
                            }
                            handleRemovePin(e, idx);
                          }}
                          className="absolute -translate-x-1/2 -translate-y-full cursor-pointer transition hover:scale-110"
                          style={{
                            left: `${c.x * 100}%`,
                            top: `${c.y * 100}%`,
                            zIndex: isActive ? 20 : 10,
                            opacity: isActive ? 1 : 0.55,
                          }}
                        >
                          <span
                            className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-sm border bg-background/85 px-1.5 py-0.5 text-[10px] font-semibold"
                            style={{
                              borderColor: color.border,
                              color: color.text,
                              textShadow: `0 0 6px ${color.hex}`,
                            }}
                          >
                            {r.name || "נמען"}
                          </span>
                          <MapPin
                            className="h-7 w-7"
                            style={{
                              color: color.hex,
                              filter: isActive ? color.glowStrong : color.glow,
                            }}
                            fill={color.fill}
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
          {totalCoords > 0 ? (
            <>{totalCoords} מיקומי חתימה נבחרו (סה״כ לכל הנמענים)</>
          ) : (
            <>טרם נבחר מיקום חתימה — לחץ על המסמך כדי להוסיף</>
          )}
        </div>
      )}
      {fsOpen && inlineSrc && recipient && (
        <FullscreenPinModal
          src={inlineSrc}
          recipients={api.recipients}
          activeRecipientId={recipient.id}
          onSelectRecipient={(id) => api.setSelectedRecipientId(id)}
          onPlace={(pageNumber, x, y) => {
            const next = [
              ...(recipient.signatureCoordinates ?? []),
              { pageNumber, x, y },
            ];
            api.updateRecipient(recipient.id, { signatureCoordinates: next });
          }}
          onRemove={(recipientId, pinIndex) => {
            const r = api.recipients.find((x) => x.id === recipientId);
            if (!r) return;
            const next = (r.signatureCoordinates ?? []).filter(
              (_, i) => i !== pinIndex,
            );
            api.updateRecipient(recipientId, { signatureCoordinates: next });
          }}
          onClose={() => setFsOpen(false)}
        />
      )}
    </div>
  );
}

function FullscreenPinModal({
  src,
  recipients,
  activeRecipientId,
  onSelectRecipient,
  onPlace,
  onRemove,
  onClose,
}: {
  src: string;
  recipients: Array<{
    id: string;
    name: string;
    role: string;
    signatureCoordinates?: Array<{ pageNumber: number; x: number; y: number }> | null;
  }>;
  activeRecipientId: string;
  onSelectRecipient: (id: string) => void;
  onPlace: (pageNumber: number, x: number, y: number) => void;
  onRemove: (recipientId: string, pinIndex: number) => void;
  onClose: () => void;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [pageWidth, setPageWidth] = useState<number>(0);
  const [numPages, setNumPages] = useState<number>(0);
  const activeIdx = recipients.findIndex((r) => r.id === activeRecipientId);
  const activeColor = getRecipientColor(activeIdx >= 0 ? activeIdx : 0);
  const activeRecipient = recipients[activeIdx >= 0 ? activeIdx : 0];
  const activeCount =
    activeRecipient?.signatureCoordinates?.length ?? 0;
  const totalCount = recipients.reduce(
    (sum, r) => sum + (r.signatureCoordinates?.length ?? 0),
    0,
  );

  useEffect(() => {
    if (!wrapRef.current) return;
    const el = wrapRef.current;
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth;
      if (w > 0) setPageWidth(w - 16);
    });
    ro.observe(el);
    setPageWidth(el.clientWidth - 16);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const handlePlace = (
    e: React.MouseEvent<HTMLDivElement>,
    pageNumber: number,
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    onPlace(pageNumber, Math.max(0, Math.min(1, x)), Math.max(0, Math.min(1, y)));
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-background">
      <header
        className="flex items-center justify-between border-b bg-background/95 px-4 py-3 backdrop-blur"
        style={{ borderColor: activeColor.border }}
      >
        <div className="min-w-0">
          <p
            className="truncate font-display text-xs uppercase tracking-[0.2em]"
            style={{ color: activeColor.text, textShadow: `0 0 8px ${activeColor.hex}` }}
          >
            סימון מקומות חתימה
          </p>
          <div className="mt-1 flex items-center gap-2">
            <select
              value={activeRecipientId}
              onChange={(e) => onSelectRecipient(e.target.value)}
              className="rounded-md border bg-background/70 px-2 py-1 text-[11px] outline-none"
              style={{
                borderColor: activeColor.border,
                color: activeColor.text,
                boxShadow: `0 0 8px ${activeColor.hex}55`,
              }}
            >
              {recipients.map((r, idx) => {
                const c = getRecipientColor(idx);
                return (
                  <option key={r.id} value={r.id} style={{ color: c.hex }}>
                    {`● ` +
                      (r.name || `נמען ${idx + 1}`) +
                      ` · ${(r.signatureCoordinates?.length ?? 0)}`}
                  </option>
                );
              })}
            </select>
            <span className="text-[11px] text-muted-foreground">
              {activeCount} סיכות · סה״כ {totalCount}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-semibold transition"
          style={{
            borderColor: activeColor.border,
            background: activeColor.bg,
            color: activeColor.text,
            boxShadow: `0 0 10px ${activeColor.hex}66`,
          }}
        >
          <Check className="h-4 w-4" />
          סיום
        </button>
      </header>
      <div
        ref={wrapRef}
        className="relative flex-1 overflow-auto bg-background/60 p-2"
      >
        <Document
          file={src}
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
            const allPins = recipients.flatMap((r, rIdx) => {
              const color = getRecipientColor(rIdx);
              const isActive = r.id === activeRecipientId;
              return (r.signatureCoordinates ?? [])
                .map((c, idx) => ({ c, idx, r, color, isActive }))
                .filter(({ c }) => (c.pageNumber || 1) === pageNumber);
            });
            return (
              <div
                key={pageNumber}
                onClick={(e) => handlePlace(e, pageNumber)}
                className="relative mx-auto mb-3 w-fit cursor-crosshair"
              >
                <Page
                  pageNumber={pageNumber}
                  width={pageWidth || undefined}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                />
                {allPins.map(({ c, idx, r, color, isActive }) => (
                  <div
                    key={`${r.id}-${idx}`}
                    role="button"
                    title="לחץ להסרת סיכה"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isActive) {
                        onSelectRecipient(r.id);
                        return;
                      }
                      onRemove(r.id, idx);
                    }}
                    className="absolute -translate-x-1/2 -translate-y-full cursor-pointer transition hover:scale-110"
                    style={{
                      left: `${c.x * 100}%`,
                      top: `${c.y * 100}%`,
                      zIndex: isActive ? 20 : 10,
                      opacity: isActive ? 1 : 0.55,
                    }}
                  >
                    <span
                      className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-sm border bg-background/85 px-1.5 py-0.5 text-[10px] font-semibold"
                      style={{
                        borderColor: color.border,
                        color: color.text,
                        textShadow: `0 0 6px ${color.hex}`,
                      }}
                    >
                      {r.name || "נמען"}
                    </span>
                    <MapPin
                      className="h-8 w-8"
                      style={{
                        color: color.hex,
                        filter: isActive ? color.glowStrong : color.glow,
                      }}
                      fill={color.fill}
                    />
                  </div>
                ))}
              </div>
            );
          })}
        </Document>
      </div>
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
