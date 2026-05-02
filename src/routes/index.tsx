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
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.25em] text-primary text-glow animate-fade-in">
          <Sparkles className="h-3.5 w-3.5" />
          Next-Gen Digital Signatures
        </div>

        <h1 className="max-w-4xl font-display text-4xl font-extrabold leading-tight text-foreground md:text-6xl">
          <span className="text-primary text-glow">MNIT Sign</span>
          <span className="block text-foreground/95">
            חתימה דיגיטלית חכמה, פשוטה ומאובטחת
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
          שלחו, חתמו ונהלו מסמכים משפטיים תוך שניות. פלטפורמה עתידנית עם תקני אבטחה
          מהמתקדמים בעולם — מותאמת לפרילנסרים, עורכי דין ועסקים בישראל.
        </p>

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
      </main>

      <footer className="relative z-10 border-t border-primary/10 py-6 text-center text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
        © {new Date().getFullYear()} MNIT Sign · {APP_VERSION}
      </footer>
    </div>
  );
}