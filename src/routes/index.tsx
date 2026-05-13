import { createFileRoute } from "@tanstack/react-router";
import { Smartphone } from "lucide-react";
import heroBg from "@/assets/hero-bg.png";
import cardRisk from "@/assets/card-risk.png";
import cardSign from "@/assets/card-sign.png";
import cardAccountant from "@/assets/card-accountant.png";
import cardCv from "@/assets/card-cv.png";

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
          <div className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl overflow-hidden flex flex-col transition-colors">
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950">
              <img src={cardRisk} alt="MNIT Risk" className="absolute inset-0 w-full h-full object-cover" />
              <span className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30 backdrop-blur-sm">
                DASHBOARD
              </span>
            </div>
            <div className="p-6 flex flex-col flex-grow">
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
          </div>

          <div className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl overflow-hidden flex flex-col transition-colors">
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950">
              <img src={cardSign} alt="MNIT Sign" className="absolute inset-0 w-full h-full object-cover" />
              <span className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 bg-green-500/20 text-green-300 rounded-full border border-green-500/30 backdrop-blur-sm">
                ACTIVE
              </span>
            </div>
            <div className="p-6 flex flex-col flex-grow">
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
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col opacity-80">
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950">
              <img src={cardAccountant} alt="רואה חשבון דיגיטלי" className="absolute inset-0 w-full h-full object-cover" />
              <span className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/30 backdrop-blur-sm">
                בקרוב
              </span>
            </div>
            <div className="p-6 flex flex-col flex-grow">
            <h3 className="text-xl font-bold mb-2">רואה חשבון דיגיטלי</h3>
            <p className="text-slate-400 text-sm mb-6 flex-grow">
              ניהול פיננסי חכם, מעקב הוצאות והפקת דוחות מבוססי AI.
            </p>
            <button className="w-full py-2.5 px-4 bg-slate-800 text-slate-500 rounded-lg cursor-not-allowed border border-slate-700">
              Coming Soon
            </button>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl overflow-hidden flex flex-col transition-colors">
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950">
              <img src={cardCv} alt="MNIT CV" className="absolute inset-0 w-full h-full object-cover" />
              <span className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 bg-blue-500/20 text-blue-300 rounded-full border border-blue-500/30 backdrop-blur-sm">
                DEVELOPMENT
              </span>
            </div>
            <div className="p-6 flex flex-col flex-grow">
            <h3 className="text-xl font-bold mb-2">MNIT CV</h3>
            <p className="text-slate-400 text-sm mb-6 flex-grow">
              מערכת ליצירה ואופטימיזציה של קורות חיים בעברית מבוססת בינה מלאכותית.
            </p>
            <button className="w-full py-2.5 px-4 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-800 transition-colors">
              יצירת קורות חיים
            </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
