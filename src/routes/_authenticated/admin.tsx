import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Shield, Users, Crown, Clock, Sparkles, Loader2, Undo2 } from "lucide-react";
import { useIsAdmin } from "@/hooks/use-is-admin";
import { useEffect, useState, useCallback } from "react";
import { TopBar } from "@/components/mnit/TopBar";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin")({ component: AdminPage });

type AdminUser = {
  id: string;
  full_name: string | null;
  email: string | null;
  subscription_tier: string;
  documents_sent_count: number;
  pending_payment_id: string | null;
};

function StatCard({ label, value, icon: Icon }: { label: string; value: number; icon: typeof Users }) {
  return (
    <div className="glass-panel glow-aqua flex items-center justify-between p-5">
      <div>
        <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{label}</div>
        <div className="mt-1 font-display text-3xl font-bold text-primary text-glow">{value}</div>
      </div>
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/40">
        <Icon className="h-6 w-6 text-primary icon-glow" />
      </div>
    </div>
  );
}

function AdminPage() {
  const { isAdmin, loading } = useIsAdmin();
  const navigate = useNavigate();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [fetching, setFetching] = useState(true);
  const [upgradingId, setUpgradingId] = useState<string | null>(null);
  const [revertingId, setRevertingId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !isAdmin) navigate({ to: "/app" });
  }, [loading, isAdmin, navigate]);

  const load = useCallback(async () => {
    setFetching(true);
    try {
      const [{ data: profiles, error: pErr }, { data: payments, error: payErr }] = await Promise.all([
        supabase.from("profiles").select("id, full_name, subscription_tier, documents_sent_count").order("created_at", { ascending: false }),
        supabase.from("payments").select("id, user_id, status").eq("status", "pending_bank_transfer"),
      ]);
      if (pErr) throw pErr;
      if (payErr) throw payErr;

      const pendingMap = new Map<string, string>();
      (payments ?? []).forEach((p) => pendingMap.set(p.user_id, p.id));

      const merged: AdminUser[] = (profiles ?? []).map((p) => ({
        id: p.id,
        full_name: p.full_name,
        email: null,
        subscription_tier: p.subscription_tier,
        documents_sent_count: p.documents_sent_count,
        pending_payment_id: pendingMap.get(p.id) ?? null,
      }));
      setUsers(merged);
    } catch (e) {
      console.error("[admin] load failed", e);
      toast.error(`שגיאה בטעינת נתונים: ${e instanceof Error ? e.message : "Unknown"}`);
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin, load]);

  const handleUpgrade = async (u: AdminUser) => {
    setUpgradingId(u.id);
    try {
      const { error: upErr } = await supabase
        .from("profiles")
        .update({ subscription_tier: "pro" })
        .eq("id", u.id);
      if (upErr) throw upErr;

      if (u.pending_payment_id) {
        const { error: payErr } = await supabase
          .from("payments")
          .update({ status: "completed" })
          .eq("id", u.pending_payment_id);
        if (payErr) throw payErr;
      }

      toast.success("המשתמש שודרג ל-Pro בהצלחה!");
      setUsers((prev) =>
        prev.map((x) => (x.id === u.id ? { ...x, subscription_tier: "pro", pending_payment_id: null } : x)),
      );
    } catch (e) {
      console.error("[admin] upgrade failed", e);
      toast.error(`שדרוג נכשל: ${e instanceof Error ? e.message : "Unknown"}`);
    } finally {
      setUpgradingId(null);
    }
  };

  const handleRevert = async (u: AdminUser) => {
    setRevertingId(u.id);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ subscription_tier: "free" })
        .eq("id", u.id);
      if (error) throw error;
      toast.success("המשתמש הוחזר לחינמי");
      setUsers((prev) =>
        prev.map((x) => (x.id === u.id ? { ...x, subscription_tier: "free" } : x)),
      );
    } catch (e) {
      console.error("[admin] revert failed", e);
      toast.error(`החזרה נכשלה: ${e instanceof Error ? e.message : "Unknown"}`);
    } finally {
      setRevertingId(null);
    }
  };

  if (loading || !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="font-display text-xs uppercase tracking-[0.3em] text-primary text-glow">
          {loading ? "בודק הרשאות…" : "אין גישה — מעביר…"}
        </div>
      </div>
    );
  }

  const totalUsers = users.length;
  const proUsers = users.filter((u) => u.subscription_tier === "pro").length;
  const pendingApprovals = users.filter((u) => u.pending_payment_id).length;

  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="mx-auto mt-4 max-w-7xl space-y-6 px-4 pb-12">
        <section className="glass-panel p-6">
          <header className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/40 glow-aqua">
              <Shield className="h-6 w-6 text-primary icon-glow" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-primary text-glow">פאנל ניהול</h1>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Admin Control Center</p>
            </div>
          </header>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <StatCard label="משתמשים רשומים" value={totalUsers} icon={Users} />
          <StatCard label="משתמשי Pro" value={proUsers} icon={Crown} />
          <StatCard label="ממתינים לאישור" value={pendingApprovals} icon={Clock} />
        </section>

        <section className="glass-panel p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-primary text-glow">ניהול משתמשים</h2>
            <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">User Management</span>
          </div>

          {fetching ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary icon-glow" />
            </div>
          ) : users.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">אין משתמשים להצגה</div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-primary/20">
              <Table>
                <TableHeader>
                  <TableRow className="border-primary/20 hover:bg-transparent">
                    <TableHead className="text-right text-[11px] uppercase tracking-[0.2em] text-muted-foreground">שם מלא</TableHead>
                    <TableHead className="text-right text-[11px] uppercase tracking-[0.2em] text-muted-foreground">מנוי</TableHead>
                    <TableHead className="text-right text-[11px] uppercase tracking-[0.2em] text-muted-foreground">מסמכים נשלחו</TableHead>
                    <TableHead className="text-right text-[11px] uppercase tracking-[0.2em] text-muted-foreground">סטטוס תשלום</TableHead>
                    <TableHead className="text-right text-[11px] uppercase tracking-[0.2em] text-muted-foreground">פעולה</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => {
                    const isPro = u.subscription_tier === "pro";
                    const hasPending = !!u.pending_payment_id;
                    return (
                      <TableRow key={u.id} className="border-primary/10 hover:bg-primary/5">
                        <TableCell className="font-medium text-foreground">
                          {u.full_name?.trim() || <span className="text-muted-foreground">— ללא שם —</span>}
                          <div className="text-[10px] text-muted-foreground/60 font-mono">{u.id.slice(0, 8)}…</div>
                        </TableCell>
                        <TableCell>
                          <span
                            className={
                              isPro
                                ? "inline-flex items-center gap-1 rounded-md border border-primary/50 bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary text-glow"
                                : "inline-flex items-center rounded-md border border-muted-foreground/30 bg-muted/30 px-2 py-0.5 text-xs text-muted-foreground"
                            }
                          >
                            {isPro && <Crown className="h-3 w-3" />} {isPro ? "Pro" : "Free"}
                          </span>
                        </TableCell>
                        <TableCell className="font-mono text-sm text-foreground">{u.documents_sent_count}</TableCell>
                        <TableCell>
                          {hasPending ? (
                            <span className="inline-flex items-center gap-1 rounded-md border border-amber-400/50 bg-amber-400/10 px-2 py-0.5 text-xs font-semibold text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.35)]">
                              <Clock className="h-3 w-3" /> ממתין להעברה
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground/60">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {!isPro ? (
                            <Button
                              size="sm"
                              disabled={upgradingId === u.id}
                              onClick={() => handleUpgrade(u)}
                              className="bg-primary/15 text-primary border border-primary/50 hover:bg-primary/25 glow-aqua font-display text-xs"
                            >
                              {upgradingId === u.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Sparkles className="h-3 w-3" />
                              )}
                              שדרג ל-Pro
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={revertingId === u.id}
                              onClick={() => handleRevert(u)}
                              className="border-amber-400/50 bg-amber-400/10 text-amber-300 hover:bg-amber-400/20 font-display text-xs"
                            >
                              {revertingId === u.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Undo2 className="h-3 w-3" />
                              )}
                              החזר לחינמי
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
