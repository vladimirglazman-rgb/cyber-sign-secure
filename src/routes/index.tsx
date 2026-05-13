import { createFileRoute } from "@tanstack/react-router";
import { Smartphone } from "lucide-react";
import cardRisk from "@/assets/card-risk.jpg";
import cardSign from "@/assets/card-sign.jpg";
import cardAccountant from "@/assets/card-accountant.jpg";
import cardCv from "@/assets/card-cv.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MNIT CYBER AI — שער הכניסה" },
      {
        name: "description",
        content: "ניהול חכם, מאובטח ומבוסס AI לכל היבטי העסק שלך.",
      },
    ],
  }),
  component: HomePage,
});

type CardProps = {
  image: string;
  imageAlt: string;
  title: string;
  subtitle: string;
  description: string;
  tags: { label: string; tone: "purple" | "green" | "amber" | "blue" }[];
  button: React.ReactNode;
};

const tagToneClasses: Record<string, string> = {
  purple: "bg-purple-500/10 text-purple-300 border-purple-500/30",
  green: "bg-green-500/10 text-green-300 border-green-500/30",
  amber: "bg-amber-500/10 text-amber-300 border-amber-500/30",
  blue: "bg-blue-500/10 text-blue-300 border-blue-500/30",
};

function ServiceCard({ image, imageAlt, title, subtitle, description, tags, button }: CardProps) {
  return (
    <article
      className="group relative flex flex-col lg:flex-row overflow-hidden rounded-2xl bg-slate-900/80 border border-cyan-500/40 shadow-[0_0_25px_-8px_rgba(34,211,238,0.35)] transition-all duration-300 hover:border-cyan-400/80 hover:shadow-[0_0_45px_-5px_rgba(34,211,238,0.6)]"
    >
      {/* Text container — 55%, first in DOM = renders right in RTL */}
      <div className="w-full lg:w-[55%] p-6 md:p-7 flex flex-col">
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((t) => (
            <span
              key={t.label}
              className={`text-[10px] font-semibold tracking-wider px-2.5 py-1 rounded-full border ${tagToneClasses[t.tone]}`}
            >
              {t.label}
            </span>
          ))}
        </div>
        <h3 className="text-2xl font-bold text-white mb-1">{title}</h3>
        <p className="text-sm text-cyan-400/80 mb-3" dir="ltr">{subtitle}</p>
        <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow">
          {description}
        </p>
        <div className="mt-auto">{button}</div>
      </div>

      {/* Image container — 45%, second in DOM = renders left in RTL */}
      <div className="w-full lg:w-[45%] relative min-h-[180px] lg:min-h-[260px] overflow-hidden">
        <img
          src={image}
          alt={imageAlt}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-l from-transparent via-slate-900/30 to-slate-900/80 lg:bg-gradient-to-l lg:from-transparent lg:to-slate-900/70"
        />
      </div>
    </article>
  );
}

function HomePage() {
  return (
    <div
      dir="rtl"
      className="relative min-h-screen bg-slate-950 text-white font-sans selection:bg-cyan-500/30 flex flex-col items-center overflow-hidden"
    >
      {/* Subtle cyan radial glow background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(34,211,238,0.15), transparent 60%), radial-gradient(ellipse 60% 40% at 50% 100%, rgba(34,211,238,0.08), transparent 70%)",
        }}
      />

      <header className="relative z-10 w-full pt-24 md:pt-32 pb-16 px-4 flex flex-col items-center text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-5">
          MNIT{" "}
          <span className="text-cyan-400 drop-shadow-[0_0_25px_rgba(34,211,238,0.75)]">
            CYBER AI
          </span>
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-6">
          ניהול חכם, מאובטח ומבוסס AI לכל היבטי העסק שלך.
        </p>
        <div className="inline-flex items-center gap-2 text-sm text-cyan-500/80 bg-cyan-500/10 px-4 py-1.5 rounded-full border border-cyan-500/20">
          <Smartphone size={16} />
          <span>מותאם באופן מלא למכשירים ניידים</span>
        </div>
      </header>

      <main className="relative z-10 w-full max-w-6xl px-4 pb-20 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ServiceCard
            image={cardRisk}
            imageAlt="MNIT Risk analytics dashboard"
            title="MNIT Risk"
            subtitle="Risk Analytics Platform"
            description="ניהול סיכוני השכרה וניתוח נתונים מתקדם למתווכים ובעלי נכסים."
            tags={[{ label: "DASHBOARD", tone: "purple" }]}
            button={
              <a
                href="https://risk.mnitcyberai.com"
                className="inline-flex w-full justify-center items-center py-2.5 px-4 bg-cyan-400 text-slate-950 rounded-lg hover:bg-cyan-300 font-bold transition-colors shadow-[0_0_15px_rgba(34,211,238,0.4)]"
              >
                כניסה למערכת
              </a>
            }
          />

          <ServiceCard
            image={cardSign}
            imageAlt="MNIT Sign digital signature"
            title="MNIT Sign"
            subtitle="Digital Signature System"
            description="מערכת חתימה דיגיטלית חכמה ומאובטחת לניהול חוזים והסכמים מכל מכשיר."
            tags={[{ label: "ACTIVE", tone: "green" }]}
            button={
              <a
                href="https://cyber-sign-flow.lovable.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full justify-center items-center py-2.5 px-4 bg-cyan-400 text-slate-950 rounded-lg hover:bg-cyan-300 font-bold transition-colors shadow-[0_0_15px_rgba(34,211,238,0.4)]"
              >
                חתימה
              </a>
            }
          />

          <ServiceCard
            image={cardAccountant}
            imageAlt="Digital accountant calculator"
            title="רואה חשבון דיגיטלי"
            subtitle="Digital Accountant"
            description="ניהול פיננסי חכם, מעקב הוצאות והפקת דוחות מבוססי AI."
            tags={[{ label: "בקרוב", tone: "amber" }]}
            button={
              <button
                disabled
                className="w-full py-2.5 px-4 bg-slate-800 text-slate-500 rounded-lg cursor-not-allowed border border-slate-700"
              >
                Coming Soon
              </button>
            }
          />

          <ServiceCard
            image={cardCv}
            imageAlt="MNIT CV node network"
            title="MNIT CV"
            subtitle="AI Resume Builder"
            description="מערכת ליצירה ואופטימיזציה של קורות חיים בעברית מבוססת בינה מלאכותית."
            tags={[{ label: "DEVELOPMENT", tone: "blue" }]}
            button={
              <button className="w-full py-2.5 px-4 border border-cyan-500/70 text-cyan-400 rounded-lg hover:bg-cyan-500/10 transition-colors font-semibold">
                יצירת קורות חיים
              </button>
            }
          />
        </div>
      </main>

      <footer className="relative z-10 w-full border-t border-slate-800/60 py-6 px-4 text-center">
        <p className="text-xs md:text-sm text-slate-500" dir="ltr">
          Powered by MNIT CYBER AI | All Rights Reserved | www.mnitcyberai.com
        </p>
      </footer>
    </div>
  );
}
