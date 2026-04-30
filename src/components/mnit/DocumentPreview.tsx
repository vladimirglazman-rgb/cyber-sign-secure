import { useEffect, useMemo, useState } from "react";
import {
  Download,
  ExternalLink,
  FileText,
  Loader2,
  ScanLine,
} from "lucide-react";
import type { SignatureRequestApi, UploadedFile } from "@/hooks/use-signature-request";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
export function DocumentPreview({
  api,
  paths,
}: {
  api: SignatureRequestApi;
  paths?: Record<string, string>;
}) {
  const file = api.selectedFile;
  const [opening, setOpening] = useState(false);
  const [proxyUrl, setProxyUrl] = useState<string | null>(null);
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
  const isImage = ["png", "jpg", "jpeg", "gif", "webp"].includes(ext);
  const isPdf = ext === "pdf" || file?.type === "application/pdf";
  const remotePath = file ? paths?.[file.id] : undefined;
  // Build a same-origin proxy URL (bypasses ad-blockers that block *.supabase.co).
  useEffect(() => {
    let cancelled = false;
    setProxyUrl(null);
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
        if (!cancelled) setProxyUrl(url);
      } catch (e) {
        console.error("INLINE_PROXY_URL_FAILED", e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [remotePath]);
  // Prefer same-origin proxy URL. Fall back to local blob until upload completes.
  const previewSrc = proxyUrl ?? blobUrl;
  const openInNewTab = async () => {
    try {
      setOpening(true);
      if (!remotePath) {
        if (blobUrl) window.open(blobUrl, "_blank", "noopener,noreferrer");
        else toast.error("הקובץ עדיין לא הועלה");
        return;
      }
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) {
        toast.error("חובה להיות מחובר");
        return;
      }
      const url = `/api/preview/${remotePath
        .split("/")
        .map(encodeURIComponent)
        .join("/")}?token=${encodeURIComponent(token)}`;
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (e) {
      console.error("OPEN_NEW_TAB_FAILED", e);
      toast.error("פתיחת הקובץ נכשלה");
    } finally {
      setOpening(false);
    }
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
      <div className="relative flex-1 overflow-hidden rounded-lg border border-primary/30 bg-gradient-to-b from-background/60 to-background/20 p-5">
        {file ? (
          <>
            <div className="mb-3 flex items-center gap-2 border-b border-primary/20 pb-2">
              <FileText className="h-4 w-4 text-primary" />
              <span className="truncate text-xs font-medium text-foreground">{file.name}</span>
            </div>
            <div className="relative h-[calc(100%-2.5rem)] w-full overflow-hidden rounded-md border border-primary/20 bg-background/60">
                <button
                  type="button"
                  onClick={openInNewTab}
                  disabled={opening || (!remotePath && !blobUrl)}
                  className="absolute end-2 top-2 z-20 inline-flex items-center gap-1 rounded-md border border-primary/50 bg-background/85 px-2 py-1 text-[10px] font-semibold text-primary glow-aqua backdrop-blur transition hover:bg-primary/10 disabled:opacity-60"
                >
                  {opening ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <ExternalLink className="h-3 w-3" />
                  )}
                  פתח בלשונית חדשה
                </button>
                {previewSrc ? (
                  isImage ? (
                    <ImagePreview src={previewSrc} name={file.name} />
                  ) : isPdf ? (
                    <PdfPreview
                      src={previewSrc}
                      name={file.name}
                      onOpenExternal={openInNewTab}
                    />
                  ) : blobUrl ? (
                    <FileCard file={file} blobUrl={blobUrl} />
                  ) : (
                    <PreviewLoader />
                  )
                ) : (
                  <PreviewLoader />
                )}
            </div>
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

function ImagePreview({ src, name }: { src: string; name: string }) {
  const [loading, setLoading] = useState(true);
  return (
    <>
      {loading && <PreviewLoader />}
      <img
        src={src}
        alt={name}
        onLoad={() => setLoading(false)}
        onError={() => setLoading(false)}
        className="h-full w-full object-contain"
      />
    </>
  );
}

function PdfPreview({
  src,
  name,
  onOpenExternal,
}: {
  src: string;
  name: string;
  onOpenExternal?: () => void | Promise<void>;
}) {
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  // Safety net: if neither onLoad nor onError fires within 4s, drop the spinner.
  useEffect(() => {
    setLoading(true);
    setFailed(false);
    const t = window.setTimeout(() => setLoading(false), 4000);
    return () => window.clearTimeout(t);
  }, [src]);
  if (failed) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
        <FileText className="h-10 w-10 text-primary/60" />
        <p className="text-xs text-muted-foreground">
          הדפדפן לא הצליח להציג את ה-PDF כאן. ניתן לפתוח אותו בלשונית חדשה.
        </p>
        <button
          type="button"
          onClick={() => onOpenExternal?.()}
          className="inline-flex items-center gap-1.5 rounded-md border border-primary/60 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary glow-aqua hover:bg-primary/20"
        >
          <ExternalLink className="h-3.5 w-3.5" /> פתח בלשונית חדשה
        </button>
      </div>
    );
  }
  return (
    <>
      {loading && <PreviewLoader />}
      <iframe
        src={`${src}#toolbar=0&navpanes=0`}
        title={name}
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setFailed(true);
        }}
        className="h-full w-full bg-background"
      />
    </>
  );
}

function FileCard({ file, blobUrl }: { file: UploadedFile; blobUrl: string }) {
  const ext = (file.ext || file.name.split(".").pop() || "FILE").toUpperCase();
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="relative flex h-28 w-24 flex-col items-center justify-center rounded-lg border-2 border-primary/50 bg-gradient-to-b from-primary/15 to-primary/5 glow-aqua">
        <FileText className="h-8 w-8 text-primary icon-glow" />
        <span className="mt-1 font-display text-[11px] font-bold tracking-wider text-primary text-glow">
          {ext}
        </span>
      </div>
      <div className="space-y-0.5">
        <p className="truncate text-sm font-semibold text-foreground" title={file.name}>
          {file.name}
        </p>
        <p className="text-[11px] text-muted-foreground">
          {(file.size / 1024).toFixed(0)} KB · לא ניתן לצפות במסמכי {ext} בדפדפן
        </p>
      </div>
      <a
        href={blobUrl}
        download={file.name}
        className="inline-flex items-center gap-2 rounded-md border border-primary/60 bg-primary/10 px-4 py-2 text-xs font-semibold text-primary glow-aqua hover:bg-primary/20"
      >
        <Download className="h-3.5 w-3.5" /> הורד וצפה
      </a>
    </div>
  );
}

function PreviewLoader() {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/40 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-2 text-primary">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-xs text-glow">Loading Document...</span>
      </div>
    </div>
  );
}
