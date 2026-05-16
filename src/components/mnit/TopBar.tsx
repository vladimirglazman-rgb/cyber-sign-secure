import { Bell, BookOpen, LogOut, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useDashboard } from "@/hooks/use-dashboard";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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

      <Dialog open={manualOpen} onOpenChange={setManualOpen}>
        <DialogContent
          dir="rtl"
          className="max-w-2xl border border-primary/30 bg-background/80 backdrop-blur-xl shadow-[0_0_40px_-10px_rgba(48,255,247,0.4)]"
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
            <TabsContent value="intro" className="min-h-[220px] rounded-lg border border-primary/15 bg-background/40 p-5 text-sm leading-relaxed text-foreground/90">
              <h3 className="mb-2 font-display text-primary text-glow">מבוא ושלב 1 – העלאת מסמך</h3>
              <p>ברוכים הבאים ל-MNIT Sign. בשלב הראשון, גררו או בחרו את קובץ ה-PDF שברצונכם להחתים. המערכת תזהה את המסמך ותכין אותו לעריכה.</p>
            </TabsContent>
            <TabsContent value="step2" className="min-h-[220px] rounded-lg border border-primary/15 bg-background/40 p-5 text-sm leading-relaxed text-foreground/90">
              <h3 className="mb-2 font-display text-primary text-glow">שלב 2 – הוספת נמענים</h3>
              <p>הוסיפו את פרטי הנמענים: שם מלא, כתובת אימייל ומספר טלפון. ניתן להוסיף מספר חותמים ולקבוע את סדר החתימה.</p>
            </TabsContent>
            <TabsContent value="step3" className="min-h-[220px] rounded-lg border border-primary/15 bg-background/40 p-5 text-sm leading-relaxed text-foreground/90">
              <h3 className="mb-2 font-display text-primary text-glow">שלב 3 – הגדרות ושליחה</h3>
              <p>הגדירו את תוקף החתימה, הוסיפו הודעה אישית ושלחו את הבקשה. הנמענים יקבלו קישור מאובטח לחתימה.</p>
            </TabsContent>
            <TabsContent value="step4" className="min-h-[220px] rounded-lg border border-primary/15 bg-background/40 p-5 text-sm leading-relaxed text-foreground/90">
              <h3 className="mb-2 font-display text-primary text-glow">שלב 4 – מעקב והשלמה</h3>
              <p>עקבו אחר סטטוס החתימות מהדשבורד. לאחר השלמת כל החתימות, תקבלו מסמך חתום עם חותמת זמן וביקורת מלאה.</p>
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
    </header>
  );
}