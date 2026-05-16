import { useEffect, useState } from "react";
import { Bell, BookOpen, LogOut, ShieldCheck } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useDashboard } from "@/hooks/use-dashboard";
import { supabase } from "@/integrations/supabase/client";
import { UserManualModal } from "@/components/mnit/UserManualModal";

export function TopBar() {
  const { data } = useDashboard();
  const [email, setEmail] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const fullName = data?.profile?.full_name?.trim();
  const displayName = fullName && fullName.length > 0 ? fullName : email ?? "משתמש";
  const initial = (displayName[0] ?? "?").toUpperCase();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("שגיאה בהתנתקות");
      return;
    }
    toast.success("התנתקת מהמערכת בהצלחה.");
    navigate({ to: "/auth" });
  };

  const [manualOpen, setManualOpen] = useState(false);

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
          onClick={() => setManualOpen(true)}
          className="group inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-display tracking-wider text-secondary transition hover:border-primary/70 hover:text-primary hover:bg-primary/10 hover:shadow-[0_0_12px_rgba(48,255,247,0.6)]"
        >
          <BookOpen className="h-4 w-4 transition group-hover:drop-shadow-[0_0_8px_rgba(48,255,247,0.9)]" />
          <span>מדריך למשתמש 📘</span>
        </button>
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
            {initial}
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-xs font-semibold text-foreground max-w-[160px] truncate">{displayName}</span>
            <span className="text-[10px] text-muted-foreground">Freelancer</span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          aria-label="התנתק"
          className="group inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-display tracking-wider text-secondary transition hover:border-primary/70 hover:text-primary hover:bg-primary/10 hover:shadow-[0_0_12px_rgba(48,255,247,0.6)]"
        >
          <LogOut className="h-4 w-4 transition group-hover:drop-shadow-[0_0_8px_rgba(48,255,247,0.9)]" />
          <span>התנתק</span>
        </button>
      </div>

      <UserManualModal open={manualOpen} onOpenChange={setManualOpen} />
    </header>
  );
}