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

      <Dialog open={manualOpen} onOpenChange={setManualOpen}>
        <DialogContent
          dir="rtl"
          className="max-w-5xl max-h-[90vh] overflow-y-auto border border-primary/30 bg-background/80 backdrop-blur-xl shadow-[0_0_40px_-10px_rgba(48,255,247,0.4)]"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-xl tracking-wider text-primary text-glow text-right">
              מדריך למשתמש 📘
            </DialogTitle>
            <DialogDescription className="text-right text-muted-foreground">
              מדריך מהיר לשימוש במערכת MNIT Sign
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="intro" className="w-full" dir="rtl">
            <TabsList className="grid w-full grid-cols-4 bg-primary/5 border border-primary/20">
              <TabsTrigger value="intro">מבוא ושלב 1</TabsTrigger>
              <TabsTrigger value="step2">שלב 2</TabsTrigger>
              <TabsTrigger value="step3">שלב 3</TabsTrigger>
              <TabsTrigger value="step4">שלב 4</TabsTrigger>
            </TabsList>
            <TabsContent
              value="intro"
              dir="rtl"
              className="min-h-[420px] rounded-lg border border-primary/15 bg-background/40 p-6 text-right text-sm leading-relaxed text-foreground/90 space-y-5"
            >
              <h2 className="font-display text-2xl text-primary text-glow">
                📘 MNIT Sign – חתימה דיגיטלית חכמה
              </h2>
              <p className="leading-7">
                ברוכים הבאים ל-MNIT Sign, הפלטפורמה המאובטחת לניהול והחתמת מסמכים דיגיטליים.
                המערכת נועדה לחסוך לכם זמן, ניירת וכאב ראש משפטי. הנה כל מה שאתם צריכים לדעת
                כדי לצאת לדרך:
              </p>
              <h3 className="font-display text-lg text-primary/90">
                1. 📤 יצירת בקשת חתימה (לשולח המסמך)
              </h3>
              <ul className="space-y-3 list-none pr-0">
                <li className="leading-7">
                  <span className="text-primary">•</span>{" "}
                  <span className="font-semibold text-foreground">העלאת קובץ:</span>{" "}
                  במסך הראשי, לחצו על כפתור 'העלה מסמך' ובחרו את קובץ ה-PDF שלכם (לדוגמה: חוזה שכירות).
                </li>
                <li className="leading-7">
                  <span className="text-primary">•</span>{" "}
                  <span className="font-semibold text-foreground">הוספת נמענים:</span>{" "}
                  הזינו את שמות החותמים (שוכר, ערב 1 וכו') ואת מספרי הטלפון שלהם לקבלת הקישור בווטסאפ.
                  הערה: ניתן לשלוח גם למספר טלפון זהה אם החותמים יושבים יחד.
                </li>
                <li className="leading-7">
                  <span className="text-primary">•</span>{" "}
                  <span className="font-semibold text-foreground">הנחת סיכות (Pins):</span>{" "}
                  לחצו על האזורים במסמך שבהם נדרשת חתימה. שייכו כל 'סיכה' לנמען המתאים כדי שהמערכת
                  תדע מי צריך לחתום ואיפה.
                </li>
                <li className="leading-7">
                  <span className="text-primary">•</span>{" "}
                  <span className="font-semibold text-foreground">שיגור:</span>{" "}
                  לחצו על 'שלח לחתימה'. המערכת תייצר קישור מאובטח ותפיץ אותו לנמענים.
                </li>
              </ul>
              <div className="flex h-64 w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-primary/30 bg-primary/5">
                <ImageIcon className="h-10 w-10 text-primary/60" />
                <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                  מקום שמור לצילום מסך
                </span>
              </div>
            </TabsContent>
            <TabsContent
              value="step2"
              dir="rtl"
              className="min-h-[420px] rounded-lg border border-primary/15 bg-background/40 p-6 text-right text-sm leading-relaxed text-foreground/90 space-y-5"
            >
              <h3 className="font-display text-lg text-primary/90">
                2. 📱 חוויית החותם (ללקוח הקצה)
              </h3>
              <ul className="space-y-3 list-none pr-0">
                <li className="leading-7">
                  <span className="text-primary">•</span>{" "}
                  <span className="font-semibold text-foreground">קבלת התראה:</span>{" "}
                  לקוח הקצה יקבל הודעת ווטסאפ (או מייל) ידידותית עם קישור ייחודי ומוצפן.
                  אין צורך בהורדת אפליקציה או בהרשמה.
                </li>
                <li className="leading-7">
                  <span className="text-primary">•</span>{" "}
                  <span className="font-semibold text-foreground">אימות וצפייה:</span>{" "}
                  לחיצה על הקישור תפתח את המסמך בדפדפן הנייד בצורה מאובטחת.
                </li>
                <li className="leading-7">
                  <span className="text-primary">•</span>{" "}
                  <span className="font-semibold text-foreground">פעולת החתימה:</span>{" "}
                  הלקוח יופנה אוטומטית ל'סיכה' המיועדת לו. לחיצה עליה תפתח מסך שבו ניתן
                  לצייר את החתימה עם האצבע או להקליד שם.
                </li>
                <li className="leading-7">
                  <span className="text-primary">•</span>{" "}
                  <span className="font-semibold text-foreground">אישור:</span>{" "}
                  לאחר החתימה, הלקוח לוחץ על 'אשר וסיים'.
                </li>
              </ul>
              <div className="flex h-64 w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-primary/30 bg-primary/5">
                <ImageIcon className="h-10 w-10 text-primary/60" />
                <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                  מקום שמור לצילום מסך
                </span>
              </div>
            </TabsContent>
            <TabsContent
              value="step3"
              dir="rtl"
              className="min-h-[420px] rounded-lg border border-primary/15 bg-background/40 p-6 text-right text-sm leading-relaxed text-foreground/90 space-y-5"
            >
              <h3 className="font-display text-lg text-primary/90">
                3. 📊 לוח בקרה ומעקב (Dashboard)
              </h3>
              <p className="leading-7">
                כמי ששלח את המסמך, יש לכם שליטה מלאה בזמן אמת:
              </p>
              <ul className="space-y-3 list-none pr-0">
                <li className="leading-7">
                  <span className="text-primary">•</span>{" "}
                  <span className="font-semibold text-foreground">סטטוס חי:</span>{" "}
                  בלוח הבקרה תוכלו לראות איזה מסמך נמצא בסטטוס 'ממתין לחתימה', מי כבר חתם,
                  ומי מעכב את התהליך.
                </li>
                <li className="leading-7">
                  <span className="text-primary">•</span>{" "}
                  <span className="font-semibold text-foreground">שליחת תזכורות:</span>{" "}
                  בלחיצת כפתור תוכלו לשלוח תזכורת אוטומטית לנמען שטרם חתם.
                </li>
              </ul>
              <div className="flex h-64 w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-primary/30 bg-primary/5">
                <ImageIcon className="h-10 w-10 text-primary/60" />
                <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                  מקום שמור לצילום מסך
                </span>
              </div>
            </TabsContent>
            <TabsContent
              value="step4"
              dir="rtl"
              className="min-h-[420px] rounded-lg border border-primary/15 bg-background/40 p-6 text-right text-sm leading-relaxed text-foreground/90 space-y-5"
            >
              <h3 className="font-display text-lg text-primary/90">
                4. 🔒 סיום התהליך וקבלת עותק סופי
              </h3>
              <ul className="space-y-3 list-none pr-0">
                <li className="leading-7">
                  <span className="text-primary">•</span>{" "}
                  ברגע שהחותם האחרון (למשל, הערב השני) מסיים את חלקו, המערכת נועלת את
                  המסמך (PDF Flattening) כדי למנוע שינויים עתידיים.
                </li>
                <li className="leading-7">
                  <span className="text-primary">•</span>{" "}
                  עותק סופי, חתום ומהימן משפטית, יישלח אוטומטית בחזרה לכל הצדדים המעורבים
                  ויישמר בארכיון הענן המאובטח שלכם במערכת.
                </li>
              </ul>
              <div className="flex h-64 w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-primary/30 bg-primary/5">
                <ImageIcon className="h-10 w-10 text-primary/60" />
                <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                  מקום שמור לצילום מסך
                </span>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-xs font-display tracking-wider text-primary transition hover:bg-primary/20 hover:shadow-[0_0_12px_rgba(48,255,247,0.6)]"
              >
                סגור
              </button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}