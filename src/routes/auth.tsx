import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ShieldCheck, Loader2, ShieldAlert, Rocket, Wallet, Star, CheckCircle2, Scale, BrainCircuit, Headphones, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { MNIT_LEGAL_TERMS } from "@/content/mnit-legal-terms";
export const Route = createFileRoute("/auth")({ component: AuthPage });

const BENEFITS = [
  { icon: ShieldAlert, title: "הגנה הכי מתקדמת", desc: "הצפנה ברמה צבאית ו-audit trail מלא." },
  { icon: Rocket, title: "קצר ומהיר", desc: "חתימה תוך פחות מדקה." },
  { icon: Wallet, title: "זול למשתמש", desc: "מחיר הוגן ושקוף." },
  { icon: Star, title: "כחול לבן", desc: "מוצר ישראלי גאה." },
  { icon: CheckCircle2, title: "פשוט ואמין", desc: "ממשק נקי וברור." },
  { icon: Scale, title: "חוקי משפטית", desc: "תקף בכל בית משפט." },
  { icon: BrainCircuit, title: "מבוסס AI", desc: "ניתוח חכם של מסמכים." },
  { icon: Headphones, title: "תמיכה 24/7", desc: "אנחנו כאן בכל שעה." },
];

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const onResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setResetLoading(true);
    try {
      await supabase.auth.resetPasswordForEmail(resetEmail, { redirectTo: `${window.location.origin}/reset-password` });
    } catch { /* neutral response regardless of outcome */ }
    setResetSent(true); setResetLoading(false);
  };

  useEffect(() => { supabase.auth.getSession().then(({ data }) => { if (data.session) navigate({ to: "/app" }); }); }, [navigate]);
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      if (mode === "signup") {
        if (!agreedTerms) { toast.error("יש לאשר את תנאי השימוש"); setLoading(false); return; }
        const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/app`, data: { full_name: fullName } } });
        if (error) throw error;
        toast.success("נרשמת בהצלחה");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("התחברת בהצלחה");
      }
      navigate({ to: "/app" });
    } catch (err: unknown) { toast.error(err instanceof Error ? err.message : "אירעה שגיאה"); }
    finally { setLoading(false); }
  };
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[1.1fr_1fr]">
        {/* Marketing side panel */}
        <aside className="glass-panel order-2 hidden flex-col p-7 lg:order-1 lg:flex">
          <div className="mb-5">
            <p className="text-[10px] uppercase tracking-[0.3em] text-primary">Why MNIT Sign</p>
            <h2 className="mt-2 font-display text-2xl font-bold text-foreground">
              חתימה דיגיטלית <span className="text-primary text-glow">ברמה אחרת</span>
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              הצטרפו לאלפי משתמשים שכבר מנהלים את החתימות שלהם בצורה חכמה, מאובטחת וזריזה.
            </p>
          </div>
          <ul className="grid grid-cols-2 gap-3">
            {BENEFITS.map((b) => (
              <li key={b.title} className="group rounded-lg border border-primary/15 bg-background/40 p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-[0_0_20px_rgba(48,255,247,0.25)]">
                <div className="mb-1.5 flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/15 ring-1 ring-primary/40">
                    <b.icon className="h-3.5 w-3.5 text-primary icon-glow" />
                  </span>
                  <h3 className="font-display text-xs font-bold text-foreground">{b.title}</h3>
                </div>
                <p className="text-[11px] leading-snug text-muted-foreground">{b.desc}</p>
              </li>
            ))}
          </ul>
        </aside>

        {/* Auth panel */}
        <div className="glass-panel order-1 w-full p-7 lg:order-2">
        <div className="mb-6 flex items-center justify-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 ring-1 ring-primary/50">
            <ShieldCheck className="h-6 w-6 text-primary icon-glow" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-primary text-glow tracking-wider">MNIT SIGN</h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Cyber-Legal Signatures</p>
          </div>
        </div>
        <div className="mb-5 grid grid-cols-2 gap-1 rounded-lg border border-primary/20 bg-background/40 p-1">
          {(["login", "signup"] as const).map((m) => (
            <button key={m} type="button" onClick={() => setMode(m)}
              className={`rounded-md py-2 text-sm font-medium transition ${mode === m ? "bg-primary text-primary-foreground glow-aqua" : "text-muted-foreground hover:text-foreground"}`}>
              {m === "login" ? "התחברות" : "הרשמה"}
            </button>
          ))}
        </div>
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          {mode === "signup" && (
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">שם מלא</label>
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} required
                className="w-full rounded-md border border-primary/20 bg-background/50 px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
            </div>
          )}
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">אימייל</label>
            <input dir="ltr" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full rounded-md border border-primary/20 bg-background/50 px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">סיסמה</label>
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
            {mode === "login" && (
              <button
                type="button"
                onClick={() => { setResetEmail(email); setResetSent(false); setShowReset(true); }}
                className="mt-1.5 text-xs font-medium text-primary underline-offset-2 hover:underline"
              >
                שכחתי סיסמה?
              </button>
            )}
          </div>

          {mode === "signup" && (
            <label className="mt-1 flex cursor-pointer items-start gap-2 text-xs text-muted-foreground">
              <input
                type="checkbox"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className={`mt-0.5 h-4 w-4 cursor-pointer appearance-none rounded border border-primary/40 bg-background/50 transition checked:border-primary checked:bg-primary checked:shadow-[0_0_12px_rgba(48,255,247,0.9)] focus:outline-none focus:ring-1 focus:ring-primary`}
              />
              <span>
                אני מסכים ל
                <button
                  type="button"
                  onClick={() => setShowTerms(true)}
                  className="mx-1 font-medium text-primary text-glow underline-offset-2 hover:underline"
                >
                  תנאי השימוש
                </button>
                של MNIT Sign
              </span>
            </label>
          )}
          <button type="submit" disabled={loading || (mode === "signup" && !agreedTerms)}
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-display text-sm font-bold tracking-wider text-primary-foreground glow-aqua transition hover:brightness-110 disabled:opacity-50">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === "login" ? "התחבר" : "הירשם"}
          </button>
        </form>
        </div>
      </div>
      {showTerms && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-4 backdrop-blur-md"
          onClick={() => setShowTerms(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="glass-panel relative max-h-[85vh] w-full max-w-2xl overflow-hidden border border-primary/40 shadow-[0_0_40px_rgba(48,255,247,0.35)]"
          >
            <div className="flex items-center justify-between border-b border-primary/20 px-6 py-4">
              <h2 className="font-display text-lg font-bold text-primary text-glow">תנאי השימוש</h2>
              <button
                onClick={() => setShowTerms(false)}
                className="rounded-md px-2 py-1 text-sm text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto px-6 py-4">
              <pre className="whitespace-pre-wrap text-right font-sans text-sm leading-relaxed text-foreground/90">
                {MNIT_LEGAL_TERMS}
              </pre>
            </div>
          </div>
        </div>
      )}
      {showReset && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-4 backdrop-blur-md"
          onClick={() => setShowReset(false)}
        >
          <div
            dir="rtl"
            onClick={(e) => e.stopPropagation()}
            className="glass-panel relative w-full max-w-md overflow-hidden border border-primary/40 p-6 text-right"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-primary">איפוס סיסמה</h2>
              <button
                type="button"
                onClick={() => setShowReset(false)}
                className="rounded-md px-2 py-1 text-sm text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>
            {resetSent ? (
              <p className="text-sm text-foreground/90">אם האימייל קיים במערכת, נשלח קישור לאיפוס סיסמה</p>
            ) : (
              <form onSubmit={onResetSubmit} className="flex flex-col gap-3">
                <label className="block text-xs font-medium text-muted-foreground">אימייל</label>
                <input dir="ltr" type="email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} required
                  className="w-full rounded-md border border-primary/20 bg-background/50 px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                <button type="submit" disabled={resetLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-display text-sm font-bold text-primary-foreground transition hover:brightness-110 disabled:opacity-50">
                  {resetLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  שלח קישור לאיפוס
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
