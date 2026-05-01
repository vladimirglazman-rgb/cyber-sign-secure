import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ExternalLink,
  FileText,
  ScanLine,
} from "lucide-react";
import type { SignatureRequestApi, UploadedFile } from "@/hooks/use-signature-request";
import { supabase } from "@/integrations/supabase/client";
export function DocumentPreview({
  api,
  paths,
}: {
  api: SignatureRequestApi;
  paths?: Record<string, string>;
}) {
  const file = api.selectedFile;
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
          <SuccessCard
            file={file}
            ext={ext}
            openHref={openHref}
          />
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
