import { Bell, ShieldCheck } from "lucide-react";

export function TopBar() {
  return (
    <header className="glass-panel mx-4 mt-4 flex items-center justify-between px-5 py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/40">
          <ShieldCheck className="h-5 w-5 text-primary icon-glow" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="font-display text-lg font-bold text-primary text-glow tracking-wider">
            MNIT SIGN
          </span>
          <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Cyber-Legal Signatures
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="התראות"
          className="relative rounded-full p-2 text-secondary transition hover:bg-primary/10 hover:text-primary"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute end-1.5 top-1.5 h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(48,255,247,0.9)]" />
        </button>
        <div className="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 ps-1 pe-3 py-1">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary/70 to-primary/30 text-xs font-bold text-background">
            A
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-xs font-semibold text-foreground">Alex</span>
            <span className="text-[10px] text-muted-foreground">Freelancer</span>
          </div>
        </div>
      </div>
    </header>
  );
}