import { Plus, Trash2, User } from "lucide-react";
import type { SignatureRequestApi } from "@/hooks/use-signature-request";
import { StepCard } from "./StepCard";
export function Step2Recipients({ api }: { api: SignatureRequestApi }) {
  return (
    <StepCard step={2} title="נמענים" description="הוסף את האנשים שיחתמו על המסמך">
      <div className="flex flex-col gap-3">
        {api.recipients.map((r, idx) => (
          <div key={r.id} className="grid grid-cols-1 gap-2 rounded-lg border border-primary/15 bg-primary/5 p-3 md:grid-cols-[1fr_1fr_auto_auto]">
            <div className="relative">
              <User className="absolute end-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input value={r.name} onChange={(e) => api.updateRecipient(r.id, { name: e.target.value })} placeholder={`שם נמען ${idx + 1}`}
                className="w-full rounded-md border border-primary/20 bg-background/50 pe-8 ps-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
            </div>
            <input type="email" dir="ltr" value={r.email} onChange={(e) => api.updateRecipient(r.id, { email: e.target.value })} placeholder="email@example.com"
              className="w-full rounded-md border border-primary/20 bg-background/50 px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
            <select value={r.role} onChange={(e) => api.updateRecipient(r.id, { role: e.target.value as "signer" | "cc" })}
              className="rounded-md border border-primary/20 bg-background/50 px-3 py-2 text-sm text-foreground outline-none focus:border-primary">
              <option value="signer">חותם</option>
              <option value="cc">העתק</option>
            </select>
            <button type="button" onClick={() => api.removeRecipient(r.id)} className="rounded-md p-2 text-muted-foreground hover:bg-destructive/15 hover:text-destructive" aria-label="הסר נמען">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button type="button" onClick={api.addRecipient} className="inline-flex items-center justify-center gap-2 rounded-lg border border-dashed border-primary/40 px-3 py-2 text-sm text-primary transition hover:bg-primary/10">
          <Plus className="h-4 w-4" />הוסף נמען
        </button>
      </div>
    </StepCard>
  );
}
