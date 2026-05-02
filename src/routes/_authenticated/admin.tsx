import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Shield } from "lucide-react";
import { useIsAdmin } from "@/hooks/use-is-admin";
import { useEffect } from "react";
import { TopBar } from "@/components/mnit/TopBar";

export const Route = createFileRoute("/_authenticated/admin")({ component: AdminPage });

function AdminPage() {
  const { isAdmin, loading } = useIsAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAdmin) navigate({ to: "/app" });
  }, [loading, isAdmin, navigate]);

  if (loading || !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="font-display text-xs uppercase tracking-[0.3em] text-primary text-glow">
          {loading ? "בודק הרשאות…" : "אין גישה — מעביר…"}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="mt-4 px-4">
        <section className="glass-panel mx-auto max-w-5xl p-8">
          <header className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/40 glow-aqua">
              <Shield className="h-6 w-6 text-primary icon-glow" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-primary text-glow">
                פאנל ניהול
              </h1>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Admin Control Center
              </p>
            </div>
          </header>
          <p className="text-sm text-muted-foreground">
            ברוך הבא לאזור הניהול. כאן תוכל לאשר תשלומים, לנהל משתמשים ולעקוב אחר פעילות המערכת.
          </p>
        </section>
      </main>
    </div>
  );
}
