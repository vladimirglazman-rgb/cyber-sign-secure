import { useEffect } from "react";
import { Plus, Trash2, User, ShieldCheck, Mail, MessageCircle, Phone } from "lucide-react";
import type { SignatureRequestApi, VerificationType, DeliveryMethod } from "@/hooks/use-signature-request";
import { StepCard } from "./StepCard";
import { getRecipientColor } from "@/lib/recipient-colors";
export function Step2Recipients({ api }: { api: SignatureRequestApi }) {
  // Sync verification value to phone when verifying by phone via SMS
  useEffect(() => {
    api.recipients.forEach((r) => {
      if (
        r.verificationType === "phone" &&
        r.deliveryMethod === "sms" &&
        r.phone &&
        r.phone !== r.verificationValue
      ) {
        api.updateRecipient(r.id, { verificationValue: r.phone });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api.recipients]);
  return (
    <StepCard step={2} title="נמענים" description="הוסף את האנשים שיחתמו על המסמך">
      <div className="flex flex-col gap-3">
        {api.recipients.map((r, idx) => {
          const color = getRecipientColor(idx);
          const nameMissing = !r.name.trim();
          const emailMissing = r.deliveryMethod === "email" && !r.email.trim();
          const phoneMissing = r.deliveryMethod === "sms" && r.phone.trim().length < 7;
          const verifMissing = !(r.verificationType === "phone" && r.deliveryMethod === "sms")
            && r.verificationValue.trim().length < 4;
          return (
          <div
            key={r.id}
            className="rounded-lg border bg-primary/5 p-3"
            style={{
              borderColor: color.border,
              boxShadow: `inset 4px 0 0 0 ${color.hex}, 0 0 8px ${color.hex}33`,
            }}
          >
            <div className="mb-2 flex items-center gap-2">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ background: color.hex, boxShadow: `0 0 6px ${color.hex}` }}
              />
              <span
                className="text-[10px] uppercase tracking-[0.18em]"
                style={{ color: color.text }}
              >
                נמען {idx + 1}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_1fr_auto_auto]">
              <div className="relative">
                <User className="absolute end-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input value={r.name} onChange={(e) => api.updateRecipient(r.id, { name: e.target.value })} placeholder={`שם מלא * נמען ${idx + 1}`}
                  className={`w-full rounded-md border bg-background/50 pe-8 ps-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary ${nameMissing ? "field-required-empty" : "border-primary/20"}`} />
              </div>
              <input
                type="email"
                dir="ltr"
                value={r.email}
                onChange={(e) => api.updateRecipient(r.id, { email: e.target.value })}
                placeholder={r.deliveryMethod === "email" ? "* email@example.com" : "email@example.com"}
                className={`w-full rounded-md border bg-background/50 px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary ${emailMissing ? "field-required-empty" : r.deliveryMethod === "email" ? "border-primary/20" : "border-primary/10 opacity-70"}`}
              />
              <select value={r.role} onChange={(e) => api.updateRecipient(r.id, { role: e.target.value as "signer" | "cc" })}
                className="rounded-md border border-primary/20 bg-background/50 px-3 py-2 text-sm text-foreground outline-none focus:border-primary">
                <option value="signer">חותם</option>
                <option value="cc">העתק</option>
              </select>
              <button type="button" onClick={() => api.removeRecipient(r.id)} className="rounded-md p-2 text-muted-foreground hover:bg-destructive/15 hover:text-destructive" aria-label="הסר נמען">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-[200px_1fr]">
              <div className="flex items-center gap-1.5 rounded-md border border-primary/20 bg-background/50 px-2 py-1.5">
                {r.deliveryMethod === "sms" ? (
                  <MessageCircle className="h-3.5 w-3.5 text-primary" />
                ) : (
                  <Mail className="h-3.5 w-3.5 text-primary" />
                )}
                <span className="text-[11px] text-muted-foreground">שיטת שליחה</span>
                <select
                  value={r.deliveryMethod}
                  onChange={(e) => {
                    const dm = e.target.value as DeliveryMethod;
                    api.updateRecipient(r.id, {
                      deliveryMethod: dm,
                      ...(dm === "sms" ? { verificationType: "phone" as VerificationType } : {}),
                    });
                  }}
                  className="ms-auto bg-transparent text-xs text-foreground outline-none"
                >
                  <option value="email">אימייל</option>
                  <option value="sms">SMS / וואטסאפ</option>
                </select>
              </div>
              <div className="relative">
                <Phone className="absolute end-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  dir="ltr"
                  value={r.phone}
                  onChange={(e) => api.updateRecipient(r.id, { phone: e.target.value })}
                  placeholder={r.deliveryMethod === "sms" ? "* מספר טלפון 05X-XXXXXXX" : "מספר טלפון 05X-XXXXXXX"}
                  required={r.deliveryMethod === "sms"}
                  className={`w-full rounded-md border bg-background/50 pe-8 ps-3 py-1.5 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary ${
                    phoneMissing
                      ? "field-required-empty"
                      : r.deliveryMethod === "sms"
                      ? "border-primary focus:border-primary glow-aqua"
                      : "border-primary/20 focus:border-primary"
                  }`}
                />
              </div>
            </div>
            <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-[160px_1fr]">
              <div className="flex items-center gap-1.5 rounded-md border border-primary/20 bg-background/50 px-2 py-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                <span className="text-[11px] text-muted-foreground">אימות לפי</span>
                <select
                  value={r.verificationType}
                  onChange={(e) => api.updateRecipient(r.id, { verificationType: e.target.value as VerificationType })}
                  className="ms-auto bg-transparent text-xs text-foreground outline-none"
                >
                  <option value="id_number">ת.ז.</option>
                  <option value="phone">טלפון</option>
                </select>
              </div>
              <input
                dir="ltr"
                value={r.verificationValue}
                onChange={(e) => api.updateRecipient(r.id, { verificationValue: e.target.value })}
                placeholder={r.verificationType === "id_number" ? "* מספר תעודת זהות" : "* מספר טלפון"}
                className={`w-full rounded-md border bg-background/50 px-3 py-1.5 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary ${verifMissing ? "field-required-empty" : "border-primary/20"}`}
              />
            </div>
          </div>
          );
        })}
        <button type="button" onClick={api.addRecipient} className="inline-flex items-center justify-center gap-2 rounded-lg border border-dashed border-primary/40 px-3 py-2 text-sm text-primary transition hover:bg-primary/10">
          <Plus className="h-4 w-4" />הוסף נמען
        </button>
      </div>
    </StepCard>
  );
}
