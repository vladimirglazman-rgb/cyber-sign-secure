import { CheckCircle2, Clock, FileText, XCircle } from "lucide-react";
import { StatTile } from "./StatTile";
import { ActivityItem } from "./ActivityItem";
import { useDashboard } from "@/hooks/use-dashboard";
import { APP_VERSION } from "@/lib/app-version";
export function Sidebar() {
  const { data, isLoading } = useDashboard();
  const stats = data?.stats ?? { total: 0, signed: 0, pending: 0, cancelled: 0 };
  const docs = data?.documents ?? [];
  return (
    <aside className="flex flex-col gap-4">
      <section className="glass-panel p-4">
        <h3 className="mb-3 font-display text-sm uppercase tracking-[0.2em] text-primary text-glow">סטטיסטיקה</h3>
        <div className="grid grid-cols-2 gap-2">
          <StatTile label="סה״כ" value={stats.total} icon={FileText} />
          <StatTile label="נחתמו" value={stats.signed} icon={CheckCircle2} tone="success" />
          <StatTile label="ממתינים" value={stats.pending} icon={Clock} tone="warn" />
          <StatTile label="בוטלו" value={stats.cancelled} icon={XCircle} tone="danger" />
        </div>
      </section>
      <section className="glass-panel flex min-h-0 flex-1 flex-col p-4">
        <h3 className="mb-3 font-display text-sm uppercase tracking-[0.2em] text-primary text-glow">פעילות אחרונה</h3>
        {isLoading ? (
          <p className="text-xs text-muted-foreground">טוען…</p>
        ) : docs.length === 0 ? (
          <p className="text-xs text-muted-foreground">עדיין אין מסמכים — העלה את הראשון.</p>
        ) : (
          <ul className="flex flex-col gap-2 overflow-y-auto pe-1">
            {docs.slice(0, 8).map((d) => <ActivityItem key={d.id} doc={d} />)}
          </ul>
        )}
      </section>
      <div
        className="mt-auto inline-flex items-center justify-center gap-2 self-start rounded-md border border-primary/40 bg-primary/5 px-2.5 py-1 font-display text-[10px] tracking-[0.18em] text-primary glow-aqua"
        title="גרסת תוכנה"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_6px_var(--primary)]" />
        גרסת תוכנה: {APP_VERSION}
      </div>
    </aside>
  );
}
