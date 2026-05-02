import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Loader2, MapPin } from "lucide-react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

export type SigCoord = { pageNumber: number; x: number; y: number };

export function SignerPdfViewer({
  fileUrl,
  coordinates,
  onRemovePin,
}: {
  fileUrl: string;
  coordinates: SigCoord[];
  onRemovePin?: (index: number) => void;
}) {
  const [numPages, setNumPages] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!wrapRef.current) return;
    const el = wrapRef.current;
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth;
      if (w > 0) setWidth(w);
    });
    ro.observe(el);
    setWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={wrapRef}
      className="w-full overflow-hidden rounded-lg border border-primary/30 bg-background/40"
    >
      <Document
        file={fileUrl}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        loading={
          <div className="flex items-center justify-center p-10 text-sm text-muted-foreground">
            <Loader2 className="me-2 h-4 w-4 animate-spin" /> טוען מסמך…
          </div>
        }
        error={
          <div className="p-6 text-center text-sm text-destructive">
            לא ניתן להציג את המסמך
          </div>
        }
      >
        {Array.from({ length: numPages }, (_, i) => {
          const pageNumber = i + 1;
          const pinsForPage = coordinates
            .map((c, idx) => ({ c, idx }))
            .filter(({ c }) => (c.pageNumber || 1) === pageNumber);
          return (
            <div key={pageNumber} className="relative mx-auto mb-3 w-fit">
              <Page
                pageNumber={pageNumber}
                width={width || undefined}
                renderAnnotationLayer={false}
                renderTextLayer={false}
              />
              {pinsForPage.map(({ c, idx }) => (
                <div
                  key={idx}
                  role={onRemovePin ? "button" : undefined}
                  title={onRemovePin ? "לחץ להסרת סיכה" : undefined}
                  onClick={
                    onRemovePin
                      ? (e) => {
                          e.stopPropagation();
                          onRemovePin(idx);
                        }
                      : undefined
                  }
                  className={
                    "absolute z-10 -translate-x-1/2 -translate-y-full " +
                    (onRemovePin
                      ? "cursor-pointer transition hover:scale-110"
                      : "pointer-events-none")
                  }
                  style={{ left: `${c.x * 100}%`, top: `${c.y * 100}%` }}
                >
                  <div className="relative">
                    <MapPin
                      className="h-8 w-8 text-primary animate-pulse"
                      style={{
                        filter:
                          "drop-shadow(0 0 6px hsl(var(--primary))) drop-shadow(0 0 12px hsl(var(--primary)))",
                      }}
                      fill="hsl(var(--primary) / 0.4)"
                    />
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-primary/60 bg-background/90 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                      חתום כאן
                    </span>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </Document>
      {numPages > 0 && (
        <div className="border-t border-primary/20 p-2 text-center text-[11px] text-muted-foreground">
          {numPages} עמודים · {coordinates.length} מיקומי חתימה
        </div>
      )}
    </div>
  );
}