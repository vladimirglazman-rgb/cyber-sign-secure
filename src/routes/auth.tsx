import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ShieldCheck, Loader2, ShieldAlert, Rocket, Wallet, Star, CheckCircle2, Scale, BrainCircuit, Headphones } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
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
  useEffect(() => { supabase.auth.getSession().then(({ data }) => { if (data.session) navigate({ to: "/app" }); }); }, [navigate]);
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      if (mode === "signup") {
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
            <input dir="ltr" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
              className="w-full rounded-md border border-primary/20 bg-background/50 px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
          </div>
          <button type="submit" disabled={loading}
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-display text-sm font-bold tracking-wider text-primary-foreground glow-aqua transition hover:brightness-110 disabled:opacity-50">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === "login" ? "התחבר" : "הירשם"}
          </button>
        </form>
        </div>
      </div>
    </div>
  );
}
