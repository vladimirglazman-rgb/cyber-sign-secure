import { createFileRoute } from "@tanstack/react-router";
import { Activity, Edit3, Calculator, FileText, Smartphone } from "lucide-react";
import heroBg from "@/assets/hero-bg.png";

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

function HomePage() {
  return (
    <div dir="rtl" className="min-h-screen bg-slate-950 text-white font-sans selection:bg-cyan-500/30 flex flex-col items-center">
      <header className="relative w-full pt-20 pb-12 px-4 flex flex-col items-center text-center overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 z-0 pointer-events-none bg-center bg-no-repeat bg-contain opacity-25"
          style={{
            backgroundImage: `url(${heroBg})`,
            maskImage:
              "radial-gradient(ellipse at center, black 30%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          }}
        />
        <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-b from-slate-950/40 via-slate-950/60 to-slate-950" />

        <div className="relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
            MNIT <span className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">CYBER AI</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-4">
            ניהול חכם, מאובטח ומבוסס AI לכל היבטי העסק שלך.
          </p>
          <div className="inline-flex items-center gap-2 text-sm text-cyan-500/80 bg-cyan-500/10 px-4 py-1.5 rounded-full border border-cyan-500/20">
            <Smartphone size={16} />
            <span>מותאם באופן מלא למכשירים ניידים</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 w-full max-w-5xl px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-6 flex flex-col transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-slate-800 rounded-xl text-cyan-400">
                <Activity size={24} />
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-purple-500/10 text-purple-400 rounded-full border border-purple-500/20">
                DASHBOARD
              </span>
            </div>
            <h3 className="text-xl font-bold mb-2">MNIT Risk</h3>
            <p className="text-slate-400 text-sm mb-6 flex-grow">
              ניהול סיכוני השכרה וניתוח נתונים מתקדם למתווכים ובעלי נכסים.
            </p>
            <a
              href="https://risk.mnitcyberai.com"
              className="w-full text-center py-2.5 px-4 border border-cyan-500 text-cyan-400 rounded-lg hover:bg-cyan-500 hover:text-slate-950 transition-colors"
            >
              כניסה למערכת
            </a>
          </div>

          <div className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-6 flex flex-col transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-slate-800 rounded-xl text-cyan-400">
                <Edit3 size={24} />
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-green-500/10 text-green-400 rounded-full border border-green-500/20">
                ACTIVE
              </span>
            </div>
            <h3 className="text-xl font-bold mb-2">MNIT Sign</h3>
            <p className="text-slate-400 text-sm mb-6 flex-grow">
              מערכת חתימה דיגיטלית חכמה ומאובטחת לניהול חוזים והסכמים מכל מכשיר.
            </p>
            <a
              href="https://sign.mnitcyberai.com"
              className="w-full text-center py-2.5 px-4 bg-cyan-400 text-slate-950 rounded-lg hover:bg-cyan-300 font-bold transition-colors"
            >
              חתימה
            </a>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col opacity-80">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-slate-800 rounded-xl text-slate-500">
                <Calculator size={24} />
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-amber-500/10 text-amber-400 rounded-full border border-amber-500/20">
                בקרוב
              </span>
            </div>
            <h3 className="text-xl font-bold mb-2">רואה חשבון דיגיטלי</h3>
            <p className="text-slate-400 text-sm mb-6 flex-grow">
              ניהול פיננסי חכם, מעקב הוצאות והפקת דוחות מבוססי AI.
            </p>
            <button className="w-full py-2.5 px-4 bg-slate-800 text-slate-500 rounded-lg cursor-not-allowed border border-slate-700">
              Coming Soon
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-6 flex flex-col transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-slate-800 rounded-xl text-cyan-400">
                <FileText size={24} />
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20">
                DEVELOPMENT
              </span>
            </div>
            <h3 className="text-xl font-bold mb-2">MNIT CV</h3>
            <p className="text-slate-400 text-sm mb-6 flex-grow">
              מערכת ליצירה ואופטימיזציה של קורות חיים בעברית מבוססת בינה מלאכותית.
            </p>
            <button className="w-full py-2.5 px-4 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-800 transition-colors">
              יצירת קורות חיים
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
