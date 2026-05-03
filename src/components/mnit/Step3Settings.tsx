import type { SignatureRequestApi, ReminderDays } from "@/hooks/use-signature-request";
import { StepCard } from "./StepCard";
import { AiRefineButton } from "./AiRefineButton";
export function Step3Settings({ api }: { api: SignatureRequestApi }) {
  return (
    <StepCard step={3} title="הגדרות" description="נושא, הודעה ותזכורות">
      <div className="flex flex-col gap-4">
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-xs font-medium text-muted-foreground">
              נושא <span className="asterisk-glow">*</span>
            </label>
            <AiRefineButton field="subject" value={api.subject} onApply={api.setSubject} />
          </div>
          <input value={api.subject} onChange={(e) => api.setSubject(e.target.value)} placeholder="חתימה על הסכם שירותים"
            className={`w-full rounded-md border bg-background/50 px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary ${!api.subject.trim() ? "field-required-empty" : "border-primary/20"}`} />
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-xs font-medium text-muted-foreground">הודעה</label>
            <AiRefineButton field="message" value={api.message} contextSubject={api.subject} onApply={api.setMessage} />
          </div>
          <textarea value={api.message} onChange={(e) => api.setMessage(e.target.value)} rows={3} placeholder="הודעה אישית לנמענים…"
            className="w-full resize-none rounded-md border border-primary/20 bg-background/50 px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
        </div>
        <label className="flex items-center justify-between rounded-lg border border-primary/15 bg-primary/5 p-3">
          <span className="text-sm text-foreground">חתימה לפי סדר הנמענים</span>
          <input type="checkbox" checked={api.signInOrder} onChange={(e) => api.setSignInOrder(e.target.checked)} className="h-4 w-4 accent-primary" />
        </label>
        <div className="rounded-lg border border-primary/15 bg-primary/5 p-3">
          <label className="flex items-center justify-between">
            <span className="text-sm text-foreground">תזכורת אוטומטית</span>
            <input type="checkbox" checked={api.remindersEnabled} onChange={(e) => api.setRemindersEnabled(e.target.checked)} className="h-4 w-4 accent-primary" />
          </label>
          {api.remindersEnabled && (
            <div className="mt-3 flex gap-2">
              {[1, 3, 7].map((d) => (
                <button key={d} type="button" onClick={() => api.setReminderDays(d as ReminderDays)}
                  className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition ${api.reminderDays === d ? "bg-primary text-primary-foreground glow-aqua" : "border border-primary/20 bg-background/50 text-foreground hover:border-primary"}`}>
                  כל {d} ימים
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </StepCard>
  );
}
