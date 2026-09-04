import { useState } from "react";
import { z } from "zod";
import { MessageSquareText, Loader2, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  fullName: z.string().trim().min(2, "נא להזין שם").max(100),
  phone: z
    .string()
    .trim()
    .min(9, "נא להזין מספר טלפון תקין")
    .max(20)
    .regex(/^[0-9+\-() ]+$/, "נא להזין מספר טלפון תקין"),
  message: z.string().trim().min(1, "נא להזין הודעה").max(500, "ההודעה חייבת להיות עד 500 תווים"),
});

type Props = { open: boolean; onOpenChange: (v: boolean) => void };

export function DemoRequestModal({ open, onOpenChange }: Props) {
  const [form, setForm] = useState({ fullName: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleClose = (v: boolean) => {
    onOpenChange(v);
    if (!v) {
      setTimeout(() => {
        setDone(false);
        setErrors({});
        setForm({ fullName: "", phone: "", message: "" });
      }, 200);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0]);
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const res = await fetch("/api/public/demo-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) throw new Error("failed");
      setDone(true);
    } catch {
      setErrors({ form: "אירעה שגיאה בשליחה. נסו שוב בעוד רגע." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md" dir="rtl">
        <DialogHeader className="text-right">
          <DialogTitle className="flex flex-row-reverse items-center justify-end gap-2 font-body text-lg font-bold text-foreground">
            <MessageSquareText className="h-5 w-5 text-primary" />
            <span>רוצה לדעת עוד? השאירו הודעה</span>
          </DialogTitle>
          <DialogDescription className="text-right font-body text-sm text-muted-foreground">
            השאירו פרטים ונחזור אליכם בהקדם.
          </DialogDescription>
        </DialogHeader>

        {done ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <CheckCircle2 className="h-10 w-10 text-primary" />
            <p className="font-body text-base font-semibold text-foreground">
              תודה! נחזור אליכם בהקדם.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="fullName" className="block text-right font-body text-sm">
                שם
              </Label>
              <Input
                id="fullName"
                type="text"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="text-right"
                autoComplete="name"
              />
              {errors.fullName && (
                <p className="text-right text-xs text-destructive">{errors.fullName}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone" className="block text-right font-body text-sm">
                טלפון
              </Label>
              <Input
                id="phone"
                type="tel"
                dir="ltr"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="text-right"
                autoComplete="tel"
              />
              {errors.phone && (
                <p className="text-right text-xs text-destructive">{errors.phone}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="message" className="block text-right font-body text-sm">
                הודעה
              </Label>
              <textarea
                id="message"
                dir="rtl"
                rows={4}
                maxLength={500}
                placeholder="ספרו לנו מה אתם מחפשים או שאלו שאלה"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-right font-body text-sm text-foreground outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
              <div className="flex flex-row-reverse justify-between text-xs text-muted-foreground">
                <span>{form.message.length}/500</span>
                {errors.message && (
                  <span className="text-destructive">{errors.message}</span>
                )}
              </div>
            </div>

            {errors.form && (
              <p className="text-right text-xs text-destructive">{errors.form}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 font-body text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              שליחה
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
