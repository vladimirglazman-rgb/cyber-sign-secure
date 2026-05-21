import { CheckCircle2, ChevronDown, Clock, FileText, Shield, XCircle } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { StatTile } from "./StatTile";
import { ActivityItem } from "./ActivityItem";
import { useDashboard } from "@/hooks/use-dashboard";
import { useIsAdmin } from "@/hooks/use-is-admin";
import { useIsMobile } from "@/hooks/use-mobile";
import { APP_VERSION } from "@/lib/app-version";
export function Sidebar() {
  const { data, isLoading } = useDashboard();
  const { isAdmin } = useIsAdmin();
  const isMobile = useIsMobile();
  const [activityOpen, setActivityOpen] = useState<boolean | null>(null);
  const open = activityOpen ?? !isMobile;
  const stats = data?.stats ?? { total: 0, signed: 0, pending: 0, cancelled: 0 };
  const docs = data?.documents ?? [];
  return (
    <aside className="flex flex-col gap-4">
      {isAdmin && (
        <Link
          to="/admin"
          className="glass-panel flex items-center justify-between gap-2 px-4 py-3 transition hover:border-primary/60 hover:glow-aqua"
        >
          <span className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary icon-glow" />
            <span className="font-body text-sm font-semibold text-primary whitespace-nowrap">
              פאנל ניהול
            </span>
          </span>
          <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground shrink-0">
            Admin
          </span>
        </Link>
      )}
      <section className="glass-panel p-4">
        <h3 className="mb-3 font-body text-sm font-semibold text-primary text-right">סטטיסטיקה</h3>
        <div className="grid grid-cols-2 gap-2">
          <StatTile label="סה״כ" value={stats.total} icon={FileText} />
          <StatTile label="נחתמו" value={stats.signed} icon={CheckCircle2} tone="success" />
          <StatTile label="ממתינים" value={stats.pending} icon={Clock} tone="warn" />
          <StatTile label="בוטלו" value={stats.cancelled} icon={XCircle} tone="danger" />
        </div>
      </section>
      <section className={`glass-panel flex flex-col p-4 transition-all ${open ? "min-h-0 flex-1" : ""}`}>
        <button
          type="button"
          onClick={() => setActivityOpen(!open)}
          aria-expanded={open}
          className="mb-3 flex w-full min-w-0 items-center justify-between gap-2 font-body text-sm font-semibold text-primary transition hover:opacity-90"
        >
          <span className="truncate text-right">פעילות אחרונה</span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 transition-transform duration-300 ${open ? "rotate-180" : "rotate-0"}`}
          />
        </button>
        <div
          className={`grid transition-all duration-300 ease-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
        >
          <div className="min-h-0 overflow-hidden">
            {isLoading ? (
              <p className="text-xs text-muted-foreground">טוען…</p>
            ) : docs.length === 0 ? (
              <p className="text-xs text-muted-foreground">עדיין אין מסמכים — העלה את הראשון.</p>
            ) : (
              <ul className="box-border flex w-full min-w-0 flex-col gap-2 overflow-y-auto px-1 pe-3 pb-24">
                {docs.slice(0, 8).map((d) => <ActivityItem key={d.id} doc={d} />)}
              </ul>
            )}
          </div>
        </div>
      </section>
      <div
        className="mt-auto inline-flex items-center justify-center gap-2 self-start whitespace-nowrap rounded-md border border-primary/40 bg-primary/5 px-2.5 py-1 font-body text-[10px] text-primary"
        title="גרסת תוכנה"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_6px_var(--primary)]" />
        {APP_VERSION}
      </div>
    </aside>
  );
}
