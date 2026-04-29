import type { ReactNode } from "react";

export function StepCard({
  step,
  title,
  description,
  children,
}: {
  step: number;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="glass-panel p-5">
      <header className="mb-4 flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/40 font-display text-primary text-glow">
          {step}
        </div>
        <div>
          <h2 className="font-display text-lg font-bold text-foreground tracking-wide">{title}</h2>
          {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
        </div>
      </header>
      <div>{children}</div>
    </section>
  );
}