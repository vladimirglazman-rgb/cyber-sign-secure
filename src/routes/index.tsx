import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ShieldCheck,
  ArrowLeft,
  Sparkles,
  Smartphone,
  BookOpen,
  Check,
  MessageSquareText,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { APP_VERSION } from "@/lib/app-version";
import { UserManualModal } from "@/components/mnit/UserManualModal";
import { DemoRequestModal } from "@/components/mnit/DemoRequestModal";
import workflowStep1 from "@/assets/workflow-step-1-upload.png";
import workflowStep2 from "@/assets/workflow-step-2-fields.png";
import workflowStep3 from "@/assets/workflow-step-3-send.png";
import workflowStep4 from "@/assets/workflow-step-4-monitor.png";

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
  const [demoOpen, setDemoOpen] = useState(false);

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
              חתימה מרחוק שמבטלת את הצורך לנסוע או לטוס רק כדי להחתים אדם — עם תיעוד מלא של תהליך החתימה.
            </h1>
            <p className="mt-6 w-full max-w-3xl text-right font-body text-lg leading-relaxed text-muted-foreground md:text-xl">
              באמצעות אימות דו-שלבי ותיעוד דיגיטלי מלא — יודעים בדיוק מי חתם, מתי ומאיפה.
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
          <button
            onClick={() => setDemoOpen(true)}
            className="animate-cta-pulse inline-flex items-center gap-3 rounded-xl bg-blue-600 px-10 py-5 font-body text-lg font-bold text-white shadow-lg transition hover:bg-blue-700 hover:shadow-xl md:text-xl"
          >
            <MessageSquareText className="h-6 w-6" />
            רוצה לדעת עוד? השאירו הודעה
          </button>
          <Link
            to="/auth"
            className="rounded-md border border-gray-300 px-8 py-4 font-body text-sm font-medium uppercase tracking-[0.2em] text-foreground transition hover:border-foreground hover:text-primary"
          >
            יש לי חשבון
          </Link>
        </div>

        {/* 4-step user journey */}
        <section className="mt-24 w-full max-w-5xl" dir="rtl">
          <div className="mb-12 flex flex-col items-center text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-[10px] font-body uppercase tracking-[0.3em] text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Workflow</span>
            </div>
            <h2 className="font-display text-3xl font-black leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl">
              איך מתפעלים את הכלי – התהליך החדש, המדויק והחכם
            </h2>
            <p className="mt-5 max-w-3xl font-body text-base leading-relaxed text-muted-foreground md:text-lg">
              המערכת בנויה כך שכל תהליך החתימה הופך לזורם, אינטואיטיבי ומבוקר מקצה לקצה. ארבעה שלבים פשוטים — וכל המסמך חתום, מאומת ומוכן לשימוש.
            </p>
            <div className="mx-auto mt-6 h-px w-24 bg-gray-300" />
          </div>
          <div className="space-y-6 md:space-y-8">
            {[
              {
                num: "01",
                title: "שלב 1 – העלאה והגדרה",
                desc: "מעלים מסמך או בוחרים תבנית מוכנה, מגדירים את החותמים (בודדים או קבוצות), מסדרים את סדר החתימה ומגדירים הרשאות.",
                img: workflowStep1,
              },
              {
                num: "02",
                title: "שלב 2 – הזרקת השדות",
                desc: "גוררים שדות דינמיים — חתימה, תאריך, טקסט, שדות חובה ועוד — וממקמים אותם בדיוק במקום הנדרש במסמך. כל חותם מקבל \u201Cסיכה\u201D צבעונית ושמית שמסמנת לו את מיקום החתימה.",
                img: workflowStep2,
              },
              {
                num: "03",
                title: "שלב 3 – שליחה חכמה",
                desc: "בלחיצה אחת המערכת מפיצה את הבקשה לחתימה, מפעילה תזכורות אוטומטיות, מנהלת סדרי חתימה ומוודאת שהכול מתקדם בלי שתצטרך לרדוף אחרי אף אחד.",
                img: workflowStep3,
              },
              {
                num: "04",
                title: "שלב 4 – ניטור ואימות",
                desc: "עוקבים בזמן אמת אחרי סטטוס החתימות ב\u2011Dashboard: מי חתם, מתי, מאיזה מכשיר ומה מצב המסמך. בסיום מופק דו\u201Dח ביקורת (Audit Trail) משפטי, חתום ומאובטח — הוכחה מלאה לתהליך תקין.",
                img: workflowStep4,
              },
            ].map((s) => (
              <div
                key={s.num}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md md:p-8"
              >
                <div className="grid items-center gap-6 md:grid-cols-2 md:gap-10">
                  <div className="aspect-[4/3] w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                    <img
                      src={s.img}
                      alt={s.title}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="text-right">
                    <div className="mb-3 font-display text-5xl font-black leading-none text-primary">
                      {s.num}
                    </div>
                    <h3 className="mb-3 font-display text-xl font-bold text-foreground md:text-2xl">
                      {s.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                      {s.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Technology Stack */}
        {/* MVP capabilities */}
        <section className="mt-24 w-full max-w-5xl" dir="rtl">
          <div className="mb-12 text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              🔍 מה הכלי עושה בפועל (MVP – אבל כבר חזק מאוד)
            </h2>
            <div className="mx-auto mt-6 h-px w-24 bg-gray-300" />
          </div>
          <ul className="grid gap-5 md:grid-cols-2 md:gap-6">
            {[
              "טעינת מסמך – העלאת PDF או בחירת תבנית מוכנה.",
              "סימון מיקום חתימות – הצבת סיכות צבעוניות ושמיות לכל חותם.",
              "שליחה לחותמים – ליחיד, לקבוצה או לסדר חתימה מוגדר מראש.",
              "הזדהות רב־שכבתית – אימות זהות באמצעות SMS, אימייל, קוד חד\u2011פעמי או שכבות נוספות.",
              "חתימה לפי סיכה – כל חותם רואה את הסיכה שלו וחותם בדיוק במקום שיועד לו.",
              "ניהול תהליך מלא – המסמך לא חוזר עד שכל החותמים השלימו את חלקם.",
              "שקיפות מלאה – המחתים רואה בזמן אמת מי חתם, מי לא, ובאיזה תאריך ושעה.",
              "הגנה על מסמכים חתומים – עד לסיום התהליך, אף גורם לא יכול לפתוח או לשנות את המסמך החתום.",
            ].map((item) => (
              <li
                key={item}
                className="flex flex-row-reverse items-start gap-3 rounded-lg border border-gray-200 bg-white p-5 text-right"
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
                <p className="font-body text-base leading-relaxed text-foreground">
                  {item}
                </p>
              </li>
            ))}
          </ul>
          <div className="mx-auto mt-12 max-w-3xl rounded-xl border border-gray-200 bg-muted/40 p-8 text-center">
            <p className="font-body text-base leading-relaxed text-muted-foreground md:text-lg">
              🌟 וזה רק ה‑MVP: המערכת תתרחב לפיצ׳רים שלא קיימים היום בשום כלי בעולם — אוטומציות מתקדמות, אימותים חכמים, אינטגרציות עמוקות, ניהול תהליכים מורכבים ועוד. הכול בשבילכם, 24/7, בצורה מאובטחת, מהירה ומקצועית.
            </p>
          </div>
        </section>

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
          <div
            dir="ltr"
            className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-3"
          >
            {[
              "React",
              "Vite",
              "TypeScript",
              "Tailwind CSS",
              "TanStack Start",
              "Supabase",
              "AI Engine",
              "Cloudflare",
            ].map((name) => (
              <span
                key={name}
                className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800"
              >
                {name}
              </span>
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
      <DemoRequestModal open={demoOpen} onOpenChange={setDemoOpen} />
    </div>
  );
}