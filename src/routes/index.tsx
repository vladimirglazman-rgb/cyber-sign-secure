import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ShieldCheck,
  ArrowLeft,
  Sparkles,
  Lock,
  Zap,
  ShieldAlert,
  Rocket,
  Wallet,
  Star,
  CheckCircle2,
  Scale,
  BrainCircuit,
  Headphones,
  Sun,
  Smartphone,
  Handshake,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { APP_VERSION } from "@/lib/app-version";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MNIT Sign — חתימה דיגיטלית חכמה, פשוטה ומאובטחת" },
      {
        name: "description",
        content:
          "פלטפורמת חתימה דיגיטלית עתידנית לפרילנסרים ועסקים — מאובטחת, מהירה ומקצועית. שלחו, חתמו ונהלו מסמכים בלחיצה.",
      },
      { property: "og:title", content: "MNIT Sign — חתימה דיגיטלית חכמה" },
      {
        property: "og:description",
        content: "חתימה דיגיטלית מאובטחת לפרילנסרים ועסקים. Cyber-Legal grade.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setAuthed(!!data.session));
  }, []);

  const handleStart = () => {
    if (authed) navigate({ to: "/app" });
    else navigate({ to: "/auth" });
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Decorative wireframe / network overlay */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 opacity-40">
        <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="netFade" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="rgba(48,255,247,0.35)" />
              <stop offset="100%" stopColor="rgba(48,255,247,0)" />
            </radialGradient>
          </defs>
          <g stroke="url(#netFade)" strokeWidth="0.6" fill="none">
            {Array.from({ length: 14 }).map((_, i) => (
              <line key={`h-${i}`} x1="0" y1={`${(i + 1) * 7}%`} x2="100%" y2={`${(i + 1) * 5 + 10}%`} />
            ))}
            {Array.from({ length: 14 }).map((_, i) => (
              <line key={`v-${i}`} x1={`${(i + 1) * 7}%`} y1="0" x2={`${(i + 1) * 5 + 10}%`} y2="100%" />
            ))}
          </g>
        </svg>
      </div>

      {/* Top bar */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 ring-1 ring-primary/50">
            <ShieldCheck className="h-5 w-5 text-primary icon-glow" />
          </div>
          <div>
            <div className="font-display text-base font-bold tracking-wider text-primary text-glow">
              MNIT SIGN
            </div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Cyber-Legal Signatures
            </div>
          </div>
        </div>
        <nav className="flex items-center gap-3">
          <Link
            to="/auth"
            className="rounded-md px-3 py-2 text-sm text-muted-foreground transition hover:text-foreground"
          >
            התחברות
          </Link>
          <button
            onClick={handleStart}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-display text-xs font-bold uppercase tracking-[0.18em] text-primary-foreground glow-aqua transition hover:brightness-110"
          >
            מתחילים עכשיו
            <ArrowLeft className="h-4 w-4" />
          </button>
        </nav>
      </header>

      {/* Hero */}
      <main className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-6 pb-24 pt-16 text-center md:pt-28">
        {/* MNIT CYBER AI Hero with handshake graphic */}
        <div className="relative w-full">
          <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center opacity-10">
            <Handshake className="text-primary" size={300} />
          </div>
          <div className="relative z-10 flex flex-col items-center">
            <h1 className="font-display text-5xl font-extrabold tracking-tight text-foreground md:text-6xl">
              MNIT{" "}
              <span className="text-primary text-glow drop-shadow-[0_0_15px_rgba(48,255,247,0.5)]">
                CYBER AI
              </span>
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              ניהול חכם, מאובטח ומבוסס AI לכל היבטי העסק שלך.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary/90">
              <Smartphone className="h-4 w-4" />
              <span>מותאם באופן מלא למכשירים ניידים</span>
            </div>
          </div>
        </div>

        {/* 2x2 product grid */}
        <div className="mt-12 grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
          {/* MNIT Risk */}
          <div className="glass-panel flex flex-col rounded-2xl p-6 text-right transition-all duration-300 hover:border-primary/60 hover:shadow-[0_0_30px_-5px_rgba(48,255,247,0.35)]">
            <div className="mb-4 flex items-start justify-between">
              <div className="rounded-xl bg-primary/10 p-3 text-primary ring-1 ring-primary/40">
                <Activity className="h-6 w-6 icon-glow" />
              </div>
              <span className="rounded-full border border-purple-400/30 bg-purple-400/10 px-2.5 py-1 text-xs font-semibold tracking-wider text-purple-300">
                DASHBOARD
              </span>
            </div>
            <h3 className="mb-2 font-display text-xl font-bold text-foreground">MNIT Risk</h3>
            <p className="mb-6 flex-grow text-sm leading-relaxed text-muted-foreground">
              ניהול סיכוני השכרה וניתוח נתונים מתקדם למתווכים ובעלי נכסים.
            </p>
            <a
              href="https://risk.mnitcyberai.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-lg border border-primary px-4 py-2.5 text-center font-display text-sm font-medium uppercase tracking-[0.18em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              כניסה למערכת
            </a>
          </div>

          {/* MNIT Sign */}
          <div className="glass-panel flex flex-col rounded-2xl p-6 text-right transition-all duration-300 hover:border-primary/60 hover:shadow-[0_0_30px_-5px_rgba(48,255,247,0.35)]">
            <div className="mb-4 flex items-start justify-between">
              <div className="rounded-xl bg-primary/10 p-3 text-primary ring-1 ring-primary/40">
                <Edit3 className="h-6 w-6 icon-glow" />
              </div>
              <span className="rounded-full border border-green-400/30 bg-green-400/10 px-2.5 py-1 text-xs font-semibold tracking-wider text-green-300">
                ACTIVE
              </span>
            </div>
            <h3 className="mb-2 font-display text-xl font-bold text-foreground">MNIT Sign</h3>
            <p className="mb-6 flex-grow text-sm leading-relaxed text-muted-foreground">
              מערכת חתימה דיגיטלית חכמה ומאובטחת לניהול חוזים והסכמים מכל מכשיר.
            </p>
            <button
              onClick={handleStart}
              className="w-full rounded-lg bg-primary px-4 py-2.5 text-center font-display text-sm font-bold uppercase tracking-[0.18em] text-primary-foreground glow-aqua transition hover:brightness-110"
            >
              חתימה
            </button>
          </div>
        </div>

        {/* Marketing video */}
        <div
          className="mx-auto mt-10 w-full max-w-3xl overflow-hidden rounded-xl border border-primary/30 glow-aqua"
          style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}
        >
          <iframe
            src="https://www.loom.com/embed/53630878dbfb4570a47c95105b68a1f9"
            title="MNIT Sign — סרטון הסבר"
            frameBorder={0}
            allowFullScreen
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
          />
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <button
            onClick={handleStart}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 font-display text-sm font-bold uppercase tracking-[0.2em] text-primary-foreground glow-aqua animate-pulse-glow transition hover:brightness-110"
          >
            מתחילים עכשיו
            <ArrowLeft className="h-4 w-4" />
          </button>
          <Link
            to="/auth"
            className="rounded-xl border border-primary/30 px-8 py-4 font-display text-sm font-medium uppercase tracking-[0.2em] text-foreground/90 transition hover:border-primary/60 hover:text-primary"
          >
            יש לי חשבון
          </Link>
        </div>

        {/* Feature tiles */}
        <div className="mt-20 grid w-full max-w-5xl gap-4 md:grid-cols-3">
          {[
            {
              icon: Lock,
              title: "אבטחה ברמה משפטית",
              desc: "הצפנה מקצה לקצה, audit trail מלא ותאימות לחוק החתימה האלקטרונית.",
            },
            {
              icon: Zap,
              title: "מהיר ופשוט",
              desc: "העלו מסמך, סמנו מקום חתימה ושלחו ללקוח בפחות מ-30 שניות.",
            },
            {
              icon: Sparkles,
              title: "AI מובנה",
              desc: "כתיבה חכמה של הודעות שליחה ואופטימיזציה אוטומטית של המסמך.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="glass-panel p-6 text-right transition hover:border-primary/50"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/40">
                <f.icon className="h-5 w-5 text-primary icon-glow" />
              </div>
              <h3 className="mb-1 font-display text-base font-bold text-foreground">
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Benefits grid */}
        <section className="mt-24 w-full max-w-6xl">
          <div className="mb-10 flex flex-col items-center text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.25em] text-primary text-glow">
              <Sparkles className="h-3.5 w-3.5" />
              Why MNIT Sign
            </div>
            <h2 className="font-display text-3xl font-extrabold text-foreground md:text-4xl">
              <span className="text-primary text-glow">9 סיבות</span> לבחור בנו
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
              פלטפורמה ישראלית, מאובטחת ומתקדמת — כל מה שצריך כדי לחתום מסמכים בלי כאבי ראש.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: ShieldAlert, title: "הגנה הכי מתקדמת", desc: "הצפנה ברמה צבאית ו-audit trail מלא לכל פעולה." },
              { icon: Rocket, title: "קצר ומהיר", desc: "שליחה וחתימה תוך פחות מדקה — ללא טפסים מיותרים." },
              { icon: Wallet, title: "זול למשתמש", desc: "מחיר הוגן, ללא עמלות נסתרות וללא חוזים ארוכים." },
              { icon: Star, title: "מוצר ישראלי · כחול לבן", desc: "פותח בישראל, נתונים בישראל, תמיכה בעברית." },
              { icon: CheckCircle2, title: "פשוט ואמין", desc: "ממשק נקי שעובד מצוין גם למי שלא טכנולוגי." },
              { icon: Scale, title: "חוקי משפטית", desc: "תואם לחוק החתימה האלקטרונית הישראלי וה-eIDAS." },
              { icon: BrainCircuit, title: "מבוסס AI", desc: "ניסוח חכם, אופטימיזציה ובדיקת מסמכים אוטומטית." },
              { icon: Headphones, title: "תמיכה טכנית 24/7", desc: "צוות אנושי זמין סביב השעון בצ'אט ובטלפון." },
              { icon: Sun, title: "נראות מקסימלית בשטח", desc: "ממשק Cyber-Legal עוצמתי עם קונטרסט גבוה וזוהר בציאן, המאפשר עבודה נוחה וזיהוי שדות חתימה בקלות גם תחת אור שמש ישיר בסמארטפון." },
            ].map((b) => (
              <div
                key={b.title}
                className="glass-panel group relative p-5 text-right transition-all duration-300 hover:-translate-y-1 hover:border-primary/70 hover:shadow-[0_0_30px_rgba(48,255,247,0.35)]"
              >
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 ring-1 ring-primary/40 transition group-hover:bg-primary/25 group-hover:ring-primary/70">
                  <b.icon className="h-5 w-5 text-primary icon-glow drop-shadow-[0_0_12px_rgba(48,255,247,0.9)]" />
                </div>
                <h3 className="mb-1.5 font-display text-sm font-bold tracking-wide text-foreground">
                  {b.title}
                </h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {b.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-primary/10 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 text-center">
          <div className="flex flex-col items-center gap-3 text-sm text-muted-foreground md:flex-row md:gap-4">
            <span>© 2026 MNIT Cyber AI Hub.</span>
            <span className="hidden text-primary/30 md:inline">|</span>
            <a
              href="mailto:vladimirglazman@gmail.com"
              className="transition-colors hover:text-primary hover:text-glow"
            >
              vladimirglazman@gmail.com
            </a>
            <span className="hidden text-primary/30 md:inline">|</span>
            <a
              href="tel:0526134890"
              className="transition-colors hover:text-primary hover:text-glow"
              dir="ltr"
            >
              052-613-4890
            </a>
            <span className="hidden text-primary/30 md:inline">|</span>
            <a
              href="https://www.linkedin.com/in/vladimirglazman"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-primary hover:text-glow"
            >
              LinkedIn
            </a>
          </div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60">
            MNIT Sign · {APP_VERSION}
          </div>
        </div>
      </footer>
    </div>
  );
}