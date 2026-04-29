import { useState } from "react";
import { Sparkles, Loader2, Check, X } from "lucide-react";
import { toast } from "sonner";
import { refineText } from "@/server/ai.functions";
import { getAuthHeaders } from "@/lib/auth-headers";

type Props = {
  field: "subject" | "message";
  value: string;
  contextSubject?: string;
  onApply: (text: string) => void;
};

export function AiRefineButton({ field, value, contextSubject, onApply }: Props) {
  const [busy, setBusy] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);

  const run = async () => {
    if (!value.trim()) {
      toast.error("יש להזין טקסט תחילה");
      return;
    }
    try {
      setBusy(true);
      setSuggestion(null);
      const { suggestion: s } = await refineText({
        headers: await getAuthHeaders(),
        data: { field, text: value.trim(), contextSubject: contextSubject?.trim() || null },
      });
      setSuggestion(s);
    } catch (e) {
      console.error(e);
      toast.error(e instanceof Error ? e.message : "שגיאה בשירות ה-AI");
    } finally {
      setBusy(false);
    }
  };

  const apply = () => {
    if (suggestion) onApply(suggestion);
    setSuggestion(null);
    toast.success("ההצעה הוחלה");
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={run}
        disabled={busy}
        className={`inline-flex items-center gap-1.5 self-start rounded-md border border-primary/30 bg-primary/10 px-2.5 py-1 text-[11px] font-display tracking-wider text-primary transition hover:bg-primary/20 disabled:opacity-50 ${busy ? "animate-pulse-glow" : ""}`}
      >
        {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3 icon-glow" />}
        {busy ? "מנתח את הטקסט…" : "שכלל עם AI"}
      </button>

      {suggestion && (
        <div className="glass-panel rounded-lg p-3 text-xs animate-pulse-glow" style={{ animationIterationCount: 1, animationDuration: "0.8s" }}>
          <div className="mb-1.5 flex items-center gap-1.5 font-display text-[10px] uppercase tracking-[0.2em] text-primary text-glow">
            <Sparkles className="h-3 w-3" /> הצעת AI
          </div>
          <p className="whitespace-pre-wrap leading-relaxed text-foreground">{suggestion}</p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={apply}
              className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1 text-[11px] font-bold text-primary-foreground glow-aqua hover:brightness-110"
            >
              <Check className="h-3 w-3" /> החל
            </button>
            <button
              type="button"
              onClick={() => setSuggestion(null)}
              className="inline-flex items-center gap-1 rounded-md border border-primary/20 px-3 py-1 text-[11px] text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="h-3 w-3" /> בטל
            </button>
          </div>
        </div>
      )}
    </div>
  );
}