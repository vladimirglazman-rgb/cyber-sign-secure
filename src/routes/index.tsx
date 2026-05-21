import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ShieldCheck,
  ArrowLeft,
  Sparkles,
  Smartphone,
  BookOpen,
  Code2,
  Paintbrush,
  Database,
  Brain,
  Cloud,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { APP_VERSION } from "@/lib/app-version";
import { UserManualModal } from "@/components/mnit/UserManualModal";

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
      {/* Editorial: clean paper background, no overlay */}

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
            className="group inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-body tracking-wide text-foreground transition hover:border-gray-400 hover:text-primary"
          >
            <BookOpen className="h-4 w-4" />
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
            className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 font-body text-xs font-semibold uppercase tracking-[0.18em] text-background transition hover:bg-primary"
          >
            מתחילים עכשיו
            <ArrowLeft className="h-4 w-4" />
          </button>
        </nav>
      </header>

      {/* Hero */}
      <main className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-6 pb-24 pt-16 text-center md:pt-28">
        {/* MNIT CYBER AI Hero */}
        <div className="relative w-full">
          <div className="relative z-10 flex flex-col items-center" dir="rtl">
            <h1 className="w-full max-w-5xl text-right font-display text-4xl font-black leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
              חתימה מרחוק מבטלת את הצורך לנסוע או לטוס רק כדי להחתים אדם בחו״ל, ומספקת אימות זהות חזק יותר מחתימה רגילה.
            </h1>
            <p className="mt-6 w-full max-w-3xl text-right font-body text-lg leading-relaxed text-muted-foreground md:text-xl">
              באמצעות אימות דו־שלבי, תיעוד מלא וזיהוי דיגיטלי — יודעים בדיוק מי חתם, מתי, ואי אפשר לזייף את זה.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm text-foreground">
              <Smartphone className="h-4 w-4" />
              <span>מותאם באופן מלא למכשירים ניידים</span>
            </div>
          </div>
        </div>

        {/* Marketing video */}
        <div
          className="mx-auto mt-12 w-full max-w-3xl overflow-hidden rounded-xl border border-gray-200"
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

        <div className="mt-12 flex flex-col items-center gap-3 sm:flex-row">
          <button
            onClick={handleStart}
            className="inline-flex items-center gap-2 rounded-md bg-foreground px-8 py-4 font-body text-sm font-semibold uppercase tracking-[0.2em] text-background transition hover:bg-primary"
          >
            מתחילים עכשיו
            <ArrowLeft className="h-4 w-4" />
          </button>
          <Link
            to="/auth"
            className="rounded-md border border-gray-300 px-8 py-4 font-body text-sm font-medium uppercase tracking-[0.2em] text-foreground transition hover:border-foreground hover:text-primary"
          >
            יש לי חשבון
          </Link>
        </div>

        {/* Feature tiles */}
        <div className="mt-24 grid w-full max-w-5xl gap-6 md:grid-cols-3">
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
              className="rounded-lg border border-gray-200 bg-white p-8 text-right transition hover:border-gray-400"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 bg-muted">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mb-2 font-display text-xl font-bold text-foreground">
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Technology Stack */}
        <section className="mt-28 w-full max-w-5xl border-t border-gray-200 pt-16" dir="rtl">
          <div className="mb-10 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-[10px] font-body uppercase tracking-[0.3em] text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Tech Stack</span>
            </div>
            <h2 className="font-display text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
              <span className="italic text-primary">הטכנולוגיה</span> שמאחורי המערכת
            </h2>
            <div className="mx-auto mt-6 h-px w-24 bg-gray-300" />
          </div>
          <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2 md:grid-cols-3">
            {[
              { icon: Code2, name: "React & Vite", desc: "חוויית משתמש מהירה במיוחד, יציבה ומודרנית." },
              { icon: Paintbrush, name: "Tailwind CSS", desc: "עיצוב רספונסיבי, נקי וחדשני המותאם לכל מכשיר." },
              { icon: Database, name: "Supabase", desc: "מסד נתונים מאובטח בענן, ניהול משתמשים ותשתית Backend חזקה." },
              { icon: Brain, name: "AI Engine", desc: "מנוע בינה מלאכותית מתקדם לעיבוד, ניתוח ושכלול מסמכים אוטומטי." },
              { icon: Cloud, name: "Cloudflare", desc: "הגנת DDoS, אבטחת DNS ותעודות SSL להגנה מקסימלית על המידע." },
            ].map((t) => (
              <div
                key={t.name}
                className="group rounded-lg border border-gray-200 bg-white p-6 text-right transition hover:border-gray-400"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 bg-muted">
                  <t.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-2 font-display text-lg font-bold tracking-tight text-foreground">
                  {t.name}
                </h3>
                <p className="text-xs leading-relaxed text-muted-foreground">{t.desc}</p>
              </div>
            ))}
          </div>
        </section>

      </main>

      <footer className="relative z-10 border-t border-gray-200 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 text-center">
          <div className="flex flex-col items-center gap-3 text-sm text-muted-foreground md:flex-row md:gap-4">
            <span>© 2026 MNIT Cyber AI Hub.</span>
            <span className="hidden text-gray-300 md:inline">|</span>
            <a
              href="mailto:vladimirglazman@gmail.com"
              className="transition-colors hover:text-primary"
            >
              vladimirglazman@gmail.com
            </a>
            <span className="hidden text-gray-300 md:inline">|</span>
            <a
              href="tel:0526134890"
              className="transition-colors hover:text-primary"
              dir="ltr"
            >
              052-613-4890
            </a>
            <span className="hidden text-gray-300 md:inline">|</span>
            <a
              href="https://www.linkedin.com/in/vladimirglazman"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-primary"
            >
              LinkedIn
            </a>
          </div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            MNIT Sign · {APP_VERSION}
          </div>
        </div>
      </footer>

      <UserManualModal open={manualOpen} onOpenChange={setManualOpen} />
    </div>
  );
}