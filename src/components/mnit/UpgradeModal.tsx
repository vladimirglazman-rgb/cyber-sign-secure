import { useState } from "react";
import { Building2, Check, Copy, Loader2, ShieldCheck, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const BANK_DETAILS = {
  bank: "בנק לאומי (10)",
  branch: "סניף 800 - ראשי",
  account: "123-456789",
  beneficiary: "MNIT Sign בע\"מ",
  amount: "₪99 / חודש",
};

const BENEFITS = [
  "שליחת מסמכים ללא הגבלה",
  "הפרדת חותמים מתקדמת",
  "תמיכה טכנית מועדפת",
];

export function UpgradeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [showBank, setShowBank] = useState(false);
  const [reporting, setReporting] = useState(false);

  if (!open) return null;

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} הועתק`);
  };

  const onReport = async () => {
    try {
      setReporting(true);
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) {
        toast.error("יש להתחבר מחדש");
        return;
      }
      const { error } = await supabase.from("payments").insert({
        user_id: auth.user.id,
        amount: 99,
        status: "pending_bank_transfer",
      });
      if (error) throw error;
      toast.success("הדיווח התקבל! המנהל יאשר את החשבון בקרוב.");
      onClose();
    } catch (e) {
      console.error("REPORT_TRANSFER_FAILED", e);
      toast.error("אירעה שגיאה בדיווח, נסה שוב");
    } finally {
      setReporting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
        className="glass-panel relative w-full max-w-lg border-primary/60 bg-background/90 p-6 shadow-[0_0_60px_rgba(48,255,247,0.35)]"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute left-3 top-3 rounded-md p-1 text-muted-foreground hover:bg-muted/30 hover:text-foreground"
          aria-label="סגור"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2 text-primary">
          <ShieldCheck className="h-5 w-5 icon-glow" />
          <span className="font-display text-xs font-bold uppercase tracking-widest">
            MNIT Sign Pro
          </span>
        </div>

        <h2 className="mt-2 font-display text-2xl font-bold text-foreground">
          הגיע הזמן להשתדרג ל-<span className="text-primary text-glow">Pro</span>
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          הגעת למכסת המסמכים החינמית (3). שדרג עכשיו והמשך לשלוח ללא הגבלה.
        </p>

        <ul className="mt-4 space-y-2">
          {BENEFITS.map((b) => (
            <li key={b} className="flex items-center gap-2 text-sm text-foreground">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-primary/50 bg-primary/10 text-primary">
                <Check className="h-3 w-3" />
              </span>
              {b}
            </li>
          ))}
        </ul>

        <div className="mt-5 space-y-2">
          <button
            type="button"
            onClick={() => setShowBank((v) => !v)}
            className="flex w-full items-center justify-between rounded-lg border border-primary/40 bg-primary/10 px-4 py-2.5 text-sm font-bold text-primary transition hover:bg-primary/20"
          >
            <span className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              תשלום בהעברה בנקאית
            </span>
            <span className="text-xs opacity-70">{showBank ? "הסתר" : "הצג פרטים"}</span>
          </button>

          {showBank && (
            <div className="rounded-lg border border-primary/20 bg-background/60 p-3 text-sm">
              {[
                { label: "סכום", value: BANK_DETAILS.amount },
                { label: "בנק", value: BANK_DETAILS.bank },
                { label: "סניף", value: BANK_DETAILS.branch },
                { label: "חשבון", value: BANK_DETAILS.account },
                { label: "מוטב", value: BANK_DETAILS.beneficiary },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between gap-2 border-b border-primary/10 py-1.5 last:border-0"
                >
                  <span className="text-xs text-muted-foreground">{row.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-foreground">{row.value}</span>
                    <button
                      type="button"
                      onClick={() => copy(row.value, row.label)}
                      className="text-primary hover:opacity-80"
                      aria-label={`העתק ${row.label}`}
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={onReport}
                disabled={reporting}
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground glow-aqua transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {reporting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                דווח על העברה
              </button>
            </div>
          )}
        </div>

        <p className="mt-4 text-center text-[11px] text-muted-foreground">
          לאחר אישור התשלום על-ידי המנהל, החשבון ישודרג אוטומטית ל-Pro.
        </p>
      </div>
    </div>
  );
}