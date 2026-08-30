import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "איפוס סיסמה | MNIT Sign" },
      { name: "description", content: "בחירת סיסמה חדשה לחשבון MNIT Sign לאחר בקשת איפוס סיסמה." },
      { property: "og:title", content: "איפוס סיסמה | MNIT Sign" },
      { property: "og:description", content: "בחירת סיסמה חדשה לחשבון MNIT Sign לאחר בקשת איפוס סיסמה." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) { setHasSession(true); setReady(true); }
    });
    supabase.auth.getSession().then(({ data }) => {
      setHasSession(!!data.session);
      setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { toast.error("הסיסמאות אינן תואמות"); return; }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("הסיסמה עודכנה בהצלחה");
      navigate({ to: "/app" });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "אירעה שגיאה");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="glass-panel w-full max-w-md p-7 text-right">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 ring-1 ring-primary/50">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-primary">איפוס סיסמה</h1>
            <p className="text-xs text-muted-foreground">בחרו סיסמה חדשה לחשבון שלכם</p>
          </div>
        </div>

        {!ready ? (
          <p className="text-sm text-muted-foreground">טוען…</p>
        ) : !hasSession ? (
          <p className="text-sm text-foreground/90">
            הקישור אינו תקף או שפג תוקפו. יש לבקש קישור חדש לאיפוס סיסמה מדף ההתחברות.
          </p>
        ) : (
          <form onSubmit={onSubmit} className="flex flex-col gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">סיסמה חדשה</label>
              <div className="relative">
                <input dir="ltr" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
                  className="w-full rounded-md border border-primary/20 bg-background/50 py-2 pl-10 pr-3 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "הסתר סיסמה" : "הצג סיסמה"}
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground transition hover:text-primary"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">אימות סיסמה</label>
              <input dir="ltr" type={showPassword ? "text" : "password"} value={confirm} onChange={(e) => setConfirm(e.target.value)} required minLength={6}
                className="w-full rounded-md border border-primary/20 bg-background/50 px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
            </div>
            <button type="submit" disabled={loading}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-display text-sm font-bold text-primary-foreground transition hover:brightness-110 disabled:opacity-50">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              עדכן סיסמה
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
