import { FileText, ScanLine } from "lucide-react";
import type { SignatureRequestApi } from "@/hooks/use-signature-request";
export function DocumentPreview({ api }: { api: SignatureRequestApi }) {
  const file = api.selectedFile;
  return (
    <div className="glass-panel flex h-full flex-col p-4">
      <header className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-sm uppercase tracking-[0.2em] text-primary text-glow">תצוגה מקדימה</h3>
        <ScanLine className="h-4 w-4 text-primary icon-glow" />
      </header>
      <div className="relative flex-1 overflow-hidden rounded-lg border border-primary/30 bg-gradient-to-b from-background/60 to-background/20 p-5">
        {file ? (
          <>
            <div className="mb-3 flex items-center gap-2 border-b border-primary/20 pb-2">
              <FileText className="h-4 w-4 text-primary" />
              <span className="truncate text-xs font-medium text-foreground">{file.name}</span>
            </div>
            <div className="space-y-2">
              {Array.from({ length: 14 }).map((_, i) => (
                <div key={i} className="h-2 rounded-full bg-primary/15" style={{ width: `${60 + ((i * 13) % 35)}%` }} />
              ))}
            </div>
            <div className="absolute bottom-4 end-4 flex h-16 w-32 items-center justify-center rounded border border-dashed border-primary/60 bg-primary/5 text-[10px] font-display tracking-wider text-primary text-glow">SIGN HERE</div>
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
