import type { LucideIcon } from "lucide-react";
const tone = { default: "text-primary", success: "text-emerald-300", warn: "text-amber-300", danger: "text-rose-300" };
export function StatTile({ label, value, icon: Icon, tone: t = "default" }: { label: string; value: number; icon: LucideIcon; tone?: keyof typeof tone }) {
  return (
    <div className="glass-panel flex flex-col gap-1 p-3">
      <div className="flex items-center justify-between">
        <span className="truncate text-[10px] text-muted-foreground">{label}</span>
        <Icon className={`h-4 w-4 shrink-0 ${tone[t]}`} />
      </div>
      <span className="font-body text-2xl font-bold text-foreground">{value}</span>
    </div>
  );
}
