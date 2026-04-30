import { useCallback, useRef, useState } from "react";
import { UploadCloud, X, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { SignatureRequestApi } from "@/hooks/use-signature-request";
import { StepCard } from "./StepCard";
const MAX = 20 * 1024 * 1024;
const ALLOWED = [".pdf", ".doc", ".docx", ".png", ".jpg", ".jpeg"];
export function Step1Upload({
  api,
  setPath,
  removePath,
}: {
  api: SignatureRequestApi;
  paths: Record<string, string>;
  setPath: (id: string, p: string) => void;
  removePath: (id: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const validate = (f: File) => {
    const ext = "." + (f.name.split(".").pop()?.toLowerCase() ?? "");
    if (!ALLOWED.includes(ext)) {
      toast.error("סוג קובץ לא נתמך");
      return false;
    }
    if (f.size > MAX) {
      toast.error("הקובץ גדול מ-20MB");
      return false;
    }
    return true;
  };
  const upload = useCallback(
    async (list: FileList | File[]) => {
      const arr = Array.from(list).filter(validate);
      const ids = api.addFiles(arr);
      for (const [index, file] of arr.entries()) {
        const id = ids[index];
        try {
          setBusy(file.name);
          const { data: sessionData } = await supabase.auth.getSession();
          const userId = sessionData.session?.user?.id;
          if (!userId) {
            console.error("UPLOAD_FAILED_UNAUTHENTICATED");
            toast.error("חובה להיות מחובר כדי להעלות קובץ");
            if (id) api.removeFile(id);
            continue;
          }
          // Always rename — guarantees Hebrew/non-ASCII filenames don't break the path
          const dot = file.name.lastIndexOf(".");
          const rawExt = dot >= 0 ? file.name.slice(dot).toLowerCase() : "";
          const ext = /^\.[a-z0-9]{1,8}$/.test(rawExt) ? rawExt : ".pdf";
          const uuid =
            (crypto as Crypto & { randomUUID?: () => string }).randomUUID?.() ??
            `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
          const path = `${userId}/${Date.now()}_${uuid}${ext}`;
          const contentType =
            ext === ".pdf" ? "application/pdf" : file.type || "application/octet-stream";
          const { error } = await supabase.storage
            .from("contracts")
            .upload(path, file, { contentType, upsert: false });
          if (error) {
            const status = (error as { statusCode?: string | number }).statusCode;
            if (String(status) === "403") {
              console.error("STORAGE_POLICY_ERROR", error);
              toast.error("נפלה שגיאת הרשאות באחסון, אנא פנה למנהל");
            } else {
              console.error("UPLOAD_FAILED", error);
              toast.error(`שגיאה בהעלאת הקובץ: ${error.message ?? ""}`);
            }
            if (id) api.removeFile(id);
            continue;
          }
          if (id) setPath(id, path);
        } catch (e) {
          const err = e as { message?: string };
          console.error("UPLOAD_FAILED", err);
          toast.error(`שגיאה בהעלאת הקובץ${err?.message ? `: ${err.message}` : ""}`);
          if (id) api.removeFile(id);
        } finally {
          setBusy(null);
        }
      }
    },
    [api, setPath],
  );
  return (
    <StepCard step={1} title="העלאת מסמך" description="גרור קובץ או בחר מהמחשב (עד 20MB)">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          if (e.dataTransfer.files) upload(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 text-center transition ${drag ? "border-primary bg-primary/10 glow-aqua" : "border-primary/30 hover:border-primary/60 hover:bg-primary/5"}`}
      >
        {busy ? (
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        ) : (
          <UploadCloud className="h-8 w-8 text-primary icon-glow" />
        )}
        <p className="text-sm font-semibold text-foreground">
          {busy ? `מעלה ${busy}…` : "גרור לכאן או לחץ לבחירה"}
        </p>
        <p className="text-[11px] text-muted-foreground">PDF · DOC · DOCX · PNG · JPG</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ALLOWED.join(",")}
          className="hidden"
          onChange={(e) => {
            if (e.target.files) upload(e.target.files);
            e.target.value = "";
          }}
        />
      </div>
      {api.files.length > 0 && (
        <ul className="mt-4 flex flex-col gap-2">
          {api.files.map((f) => (
            <li
              key={f.id}
              className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-2.5"
            >
              <FileText className="h-4 w-4 text-primary" />
              <span className="flex-1 truncate text-sm text-foreground">{f.name}</span>
              <span className="text-[10px] text-muted-foreground">
                {(f.size / 1024).toFixed(0)} KB
              </span>
              <button
                type="button"
                onClick={() => {
                  api.removeFile(f.id);
                  removePath(f.id);
                }}
                className="rounded-md p-1 text-muted-foreground hover:bg-destructive/15 hover:text-destructive"
                aria-label="הסר קובץ"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </StepCard>
  );
}
