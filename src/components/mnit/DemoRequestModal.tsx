import { useState } from "react";
import { z } from "zod";
import { CalendarClock, Loader2, CheckCircle2 } from "lucide-react";
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
  fullName: z.string().trim().min(2, "נא להזין שם מלא").max(100),
  company: z.string().trim().min(2, "נא להזין משרד או חברה").max(120),
  phone: z
    .string()
    .trim()
    .min(9, "נא להזין מספר טלפון תקין")
    .max(20)
    .regex(/^[0-9+\-() ]+$/, "נא להזין מספר טלפון תקין"),
  email: z.string().trim().email("נא להזין כתובת אימייל תקינה").max(255),
});

type Props = { open: boolean; onOpenChange: (v: boolean) => void };

export function DemoRequestModal({ open, onOpenChange }: Props) {
  const [form, setForm] = useState({ fullName: "", company: "", phone: "", email: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleClose = (v: boolean) => {
    onOpenChange(v);
    if (!v) {
      setTimeout(() => {
        setDone(false);
        setErrors({});
        setForm({ fullName: "", company: "", phone: "", email: "" });
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

  const fields: { key: keyof typeof form; label: string; type: string; dir?: "ltr" }[] = [
    { key: "fullName", label: "שם מלא", type: "text" },
    { key: "company", label: "משרד / חברה", type: "text" },
    { key: "phone", label: "טלפון", type: "tel", dir: "ltr" },
    { key: "email", label: "אימייל", type: "email", dir: "ltr" },
  ];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md" dir="rtl">
        <DialogHeader className="text-right">
          <DialogTitle className="flex flex-row-reverse items-center justify-end gap-2 font-body text-lg font-bold text-foreground">
            <CalendarClock className="h-5 w-5 text-primary" />
            <span>תיאום דמו של 15 דקות</span>
          </DialogTitle>
          <DialogDescription className="text-right font-body text-sm text-muted-foreground">
            השאירו פרטים ונחזור אליכם לתיאום הדגמה אישית.
          </DialogDescription>
        </DialogHeader>

        {done ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <CheckCircle2 className="h-10 w-10 text-primary" />
            <p className="font-body text-base font-semibold text-foreground">
              נחזור אליך תוך יום עסקים לתיאום הדמו
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4 pt-2">
            {fields.map((f) => (
              <div key={f.key} className="space-y-1.5">
                <Label htmlFor={f.key} className="block text-right font-body text-sm">
                  {f.label}
                </Label>
                <Input
                  id={f.key}
                  type={f.type}
                  dir={f.dir}
                  value={form[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  className="text-right"
                  autoComplete="on"
                />
                {errors[f.key] && (
                  <p className="text-right text-xs text-destructive">{errors[f.key]}</p>
                )}
              </div>
            ))}
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
