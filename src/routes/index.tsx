import { createFileRoute } from "@tanstack/react-router";
import { Smartphone } from "lucide-react";
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

      <header className="relative z-10 w-full pt-24 md:pt-32 pb-16 px-4 flex flex-col items-center text-center overflow-hidden">
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

        <div className="relative z-10 flex flex-col items-center">
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
        </div>
      </header>

      <main className="relative z-10 w-full max-w-6xl px-4 pb-20 flex-1">
        {/* Grid cards will be added in the next step */}
      </main>

      <footer className="relative z-10 w-full border-t border-slate-800/60 py-6 px-4 text-center">
        <p className="text-xs md:text-sm text-slate-500" dir="ltr">
          Powered by MNIT CYBER AI | All Rights Reserved | www.mnitcyberai.com
        </p>
      </footer>
    </div>
  );
}
