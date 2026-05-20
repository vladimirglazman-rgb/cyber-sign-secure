import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ShieldCheck,
  ArrowLeft,
  Sparkles,
  Lock,
  Zap,
  Smartphone,
  Handshake,
  BookOpen,
  Code2,
  Paintbrush,
  Database,
  Brain,
  Cloud,
  FileWarning,
  Files,
  Users,
  LayoutDashboard,
  MessageCircle,
  Activity,
  Repeat,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { APP_VERSION } from "@/lib/app-version";
import { UserManualModal } from "@/components/mnit/UserManualModal";
import robotHandshakeImg from "@/assets/mnit-robot-handshake.png";
import senderUxImg from "@/assets/mnit-sender-ux.png";
import mobileUxImg from "@/assets/mnit-mobile-ux.png";

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
  const [manualOpen, setManualOpen] = useState(false);

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
          <button
            type="button"
            onClick={() => setManualOpen(true)}
            className="group inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-display tracking-wider text-secondary transition hover:border-primary/70 hover:text-primary hover:bg-primary/10 hover:shadow-[0_0_12px_rgba(48,255,247,0.6)]"
          >
            <BookOpen className="h-4 w-4 transition group-hover:drop-shadow-[0_0_8px_rgba(48,255,247,0.9)]" />
            <span>מדריך למשתמש 📘</span>
          </button>
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

        {/* Infographic — UX solution overview */}
        <section className="mt-20 w-full max-w-6xl" dir="rtl">
          <div className="mb-10 text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-[10px] font-display uppercase tracking-[0.3em] text-primary/90">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Infographic</span>
            </div>
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground md:text-4xl">
              <span className="text-primary text-glow">MNIT Sign</span> — פתרון UX לחתימה דיגיטלית חכמה על חוזי שכירות
            </h2>
            <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
          </div>

          {/* Problem vs Solution */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="glass-panel p-6 text-right">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/15 ring-1 ring-destructive/40">
                  <FileWarning className="h-5 w-5 text-destructive" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground">הבעיה — בירוקרטיה מסורבלת</h3>
              </div>
              <div className="mb-4 flex aspect-video items-center justify-center rounded-xl border border-destructive/20 bg-gradient-to-br from-destructive/10 to-transparent">
                <Files className="h-16 w-16 text-destructive/70" />
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                החתמה על חוזי שכירות עם מספר נמענים (שוכר, ערבים) היא תהליך איטי, מבולבל ומועד לטעויות —
                ניירת מפוזרת, חתימות חסרות והמתנה אינסופית בין הצדדים.
              </p>
            </div>

            <div className="glass-panel p-6 text-right">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/40">
                  <Sparkles className="h-5 w-5 text-primary icon-glow" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground">הפתרון — תהליך דיגיטלי חלק</h3>
              </div>
              <div className="mb-4 flex aspect-video items-center justify-center rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent glow-aqua">
                <img
                  src={robotHandshakeImg}
                  alt="MNIT robot handshake"
                  loading="lazy"
                  className="h-full w-full rounded-xl object-cover"
                />
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                אדם ובינה מלאכותית נפגשים — תהליך חתימה ברור, מאובטח ומובן לכולם.
                העלאה, הגדרת חותמים, סימון מקומות חתימה ושליחה — הכל בלחיצה אחת.
              </p>
            </div>
          </div>

          {/* UX columns */}
          <div className="mt-12">
            <div className="mb-6 text-center">
              <h3 className="font-display text-xl font-bold text-foreground md:text-2xl">
                חוויית המשתמש (<span className="text-primary text-glow">UX</span>) ב-MNIT Sign
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">הטכנולוגיה והדרך המהירה והבטוחה לחתימה</p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  icon: Users,
                  visual: LayoutDashboard,
                  image: senderUxImg,
                  fit: "cover" as const,
                  title: "שלב השולח (Sender UX)",
                  desc: "הגדרת החוזה והחותמים: העלאת PDF, הוספת נמענים וסימון מקומות החתימה בממשק נקי וחכם.",
                },
                {
                  icon: Smartphone,
                  visual: Smartphone,
                  image: mobileUxImg,
                  fit: "contain" as const,
                  title: "תצוגת מובייל",
                  desc: "תהליך חתימה ברור ומובן לכולם — פינים צבעוניים, תמיכת מגע מלאה והבנה מיידית של מה לחתום.",
                },
                {
                  icon: ShieldCheck,
                  visual: Code2,
                  image: undefined as string | undefined,
                  fit: "cover" as const,
                  title: "טכנולוגיה ואבטחה",
                  desc: "נבנה ב-React, Tailwind ו-Supabase — תשתית מודרנית עם הצפנה מקצה לקצה ואימות דו-שלבי.",
                },
              ].map((c) => (
                <div key={c.title} className="glass-panel p-6 text-right">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/40">
                      <c.icon className="h-5 w-5 text-primary icon-glow" />
                    </div>
                    <h4 className="font-display text-base font-bold text-foreground">{c.title}</h4>
                  </div>
                  <div className="mb-4 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 to-transparent">
                    {c.image ? (
                      <img
                        src={c.image}
                        alt={c.title}
                        loading="lazy"
                        className={`h-full w-full rounded-xl ${c.fit === "contain" ? "object-contain" : "object-cover"}`}
                      />
                    ) : (
                      <c.visual className="h-14 w-14 text-primary/80 icon-glow" />
                    )}
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Roadmap strip */}
          <div className="mt-12 glass-panel p-6" dir="rtl">
            <div className="mb-5 text-center">
              <h3 className="font-display text-xl font-bold text-foreground md:text-2xl">
                <span className="text-primary text-glow">העתיד</span> — מפת דרכים
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                אינטגרציה עם WhatsApp, תמיכה במספר חותמים נוסף, והצגת סטטוס בזמן אמת.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { icon: MessageCircle, label: "WhatsApp Integration" },
                { icon: Activity, label: "Real-time Status" },
                { icon: Repeat, label: "Automated Follow-ups" },
              ].map((r) => (
                <div
                  key={r.label}
                  className="flex flex-col items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-5 text-center transition hover:border-primary/60"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 ring-1 ring-primary/40">
                    <r.icon className="h-6 w-6 text-primary icon-glow" />
                  </div>
                  <div className="font-display text-sm font-semibold tracking-wide text-foreground">
                    {r.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

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

        {/* Technology Stack */}
        <section className="mt-24 w-full max-w-5xl" dir="rtl">
          <div className="mb-10 text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-[10px] font-display uppercase tracking-[0.3em] text-primary/90">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Tech Stack</span>
            </div>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
              <span className="text-primary text-glow">הטכנולוגיה</span> שמאחורי המערכת
            </h2>
            <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
          </div>
          <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2 md:grid-cols-3">
            {[
              { icon: Code2, name: "React & Vite", desc: "חוויית משתמש מהירה במיוחד, יציבה ומודרנית." },
              { icon: Paintbrush, name: "Tailwind CSS", desc: "עיצוב רספונסיבי, נקי וחדשני המותאם לכל מכשיר." },
              { icon: Database, name: "Supabase", desc: "מסד נתונים מאובטח בענן, ניהול משתמשים ותשתית Backend חזקה." },
              { icon: Brain, name: "AI Engine", desc: "מנוע בינה מלאכותית מתקדם לעיבוד, ניתוח ושכלול מסמכים אוטומטי." },
              { icon: Cloud, name: "Cloudflare", desc: "הגנת DDoS, אבטחת DNS ותעודות SSL להגנה מקסימלית על המידע." },
            ].map((t) => (
              <div
                key={t.name}
                className="glass-panel group p-5 text-right transition hover:border-primary/60 hover:shadow-[0_0_24px_-6px_rgba(48,255,247,0.55)]"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/40 transition group-hover:bg-primary/25">
                  <t.icon className="h-5 w-5 text-primary icon-glow" />
                </div>
                <h3 className="mb-1 font-display text-sm font-bold tracking-wide text-foreground">
                  {t.name}
                </h3>
                <p className="text-xs leading-relaxed text-muted-foreground">{t.desc}</p>
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

      <UserManualModal open={manualOpen} onOpenChange={setManualOpen} />
    </div>
  );
}