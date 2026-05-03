import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  CheckCircle2,
  Eraser,
  ExternalLink,
  FileSignature,
  FileText,
  Loader2,
  PenTool,
  Send,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { peekToken, verifySigner, submitSignature } from "@/server/signing.functions";
import { SignatureCanvas, type SignatureCanvasHandle } from "@/components/mnit/SignatureCanvas";
import { SignerPdfViewer, type SigCoord } from "@/components/mnit/SignerPdfViewer";
import { MNIT_LEGAL_TERMS } from "@/content/mnit-legal-terms";

export const Route = createFileRoute("/sign/$token")({
  head: () => ({
    meta: [
      { title: "חתימה דיגיטלית — MNIT Sign" },
      { name: "description", content: "אימות וחתימה על מסמך דיגיטלי מאובטח." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: SignPage,
});

type Stage = "verify" | "view" | "done";

type Peek = {
  verification_type: "id_number" | "phone";
  recipient_name: string;
  document_subject: string;
  already_signed: boolean;
};
type Ctx = {
  fileName: string;
  subject: string;
  message: string | null;
  alreadySigned: boolean;
  fileUrl: string | null;
  coordinates: SigCoord[];
};

function SignPage() {
  const { token } = Route.useParams();
  const [stage, setStage] = useState<Stage>("verify");
  const [peek, setPeek] = useState<Peek | null>(null);
  const [peekErr, setPeekErr] = useState<string | null>(null);
  const [idNumber, setIdNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [ctx, setCtx] = useState<Ctx | null>(null);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  useEffect(() => {
    let active = true;
    peekToken({ data: { token } })
      .then((p) => {
        if (active) setPeek(p as Peek);
      })
      .catch((e) => {
        if (active) setPeekErr(e instanceof Error ? e.message : "הקישור לא תקין");
      });
    return () => {
      active = false;
    };
  }, [token]);

  const verify = async () => {
    if (idNumber.trim().length < 4 || phone.trim().length < 4) {
      toast.error("יש להזין ת.ז. וטלפון תקינים");
      return;
    }
    if (!agreedTerms) {
      toast.error("יש לאשר את תנאי השימוש ואת הצהרת החתימה הדיגיטלית");
      return;
    }
    try {
      setBusy(true);
      const c = await verifySigner({
        data: { token, idNumber: idNumber.trim(), phone: phone.trim() },
      });
      setCtx(c as Ctx);
      setStage(c.alreadySigned ? "done" : "view");
    } catch (e) {
      toast.error(
        e instanceof Error
          ? e.message
          : "פרטי הזיהוי (ת.ז. או טלפון) אינם תואמים את רישומי המערכת.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative min-h-screen px-4 py-8" dir="rtl">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <header className="flex items-center justify-between">
          <div className="font-display text-xl tracking-[0.25em] text-primary text-glow">
            MNIT · SIGN
          </div>
          <div className="flex items-center gap-1.5 rounded-md border border-primary/20 px-2.5 py-1 text-[11px] text-primary">
            <ShieldCheck className="h-3.5 w-3.5" /> חתימה מאובטחת
          </div>
        </header>

        {peekErr ? (
          <ErrorCard message={peekErr} />
        ) : !peek ? (
          <div className="glass-panel flex items-center justify-center p-10 text-sm text-muted-foreground">
            <Loader2 className="me-2 h-4 w-4 animate-spin" /> טוען…
          </div>
        ) : stage === "verify" ? (
          <VerifyCard
            peek={peek}
            idValue={idNumber}
            phoneValue={phone}
            onIdChange={setIdNumber}
            onPhoneChange={setPhone}
            onSubmit={verify}
            busy={busy}
            agreedTerms={agreedTerms}
            onAgreedChange={setAgreedTerms}
            onShowTerms={() => setShowTerms(true)}
          />
        ) : stage === "view" && ctx ? (
          <ViewerCard
            ctx={ctx}
            token={token}
            idNumber={idNumber.trim()}
            phone={phone.trim()}
            onSigned={() => setStage("done")}
          />
        ) : (
          <SuccessCard subject={peek.document_subject} />
        )}
      </div>
      {showTerms && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-4 backdrop-blur-md"
          onClick={() => setShowTerms(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="glass-panel relative max-h-[85vh] w-full max-w-2xl overflow-hidden border border-primary/40 shadow-[0_0_40px_rgba(48,255,247,0.35)]"
          >
            <div className="flex items-center justify-between border-b border-primary/20 px-6 py-4">
              <h2 className="font-display text-lg font-bold text-primary text-glow">תנאי השימוש</h2>
              <button
                onClick={() => setShowTerms(false)}
                className="rounded-md px-2 py-1 text-sm text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto px-6 py-4">
              <pre className="whitespace-pre-wrap text-right font-sans text-sm leading-relaxed text-foreground/90">
                {MNIT_LEGAL_TERMS}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function VerifyCard({
  peek,
  idValue,
  phoneValue,
  onIdChange,
  onPhoneChange,
  onSubmit,
  busy,
  agreedTerms,
  onAgreedChange,
  onShowTerms,
}: {
  peek: Peek;
  idValue: string;
  phoneValue: string;
  onIdChange: (v: string) => void;
  onPhoneChange: (v: string) => void;
  onSubmit: () => void;
  busy: boolean;
  agreedTerms: boolean;
  onAgreedChange: (v: boolean) => void;
  onShowTerms: () => void;
}) {
  return (
    <section className="glass-panel p-6">
      <div className="mb-4 flex items-center gap-2">
        <ShieldCheck className="h-5 w-5 text-primary icon-glow" />
        <h1 className="font-display text-lg text-primary text-glow">אימות זהות דו-שלבי</h1>
      </div>
      <p className="mb-4 text-sm text-muted-foreground">
        שלום <span className="text-foreground">{peek.recipient_name}</span>, לאימות זהותך הזן הן את מספר ת.ז. והן את מספר הטלפון הנייד שלך:
      </p>
      <p className="mb-4 text-xs text-muted-foreground">
        נושא הפנייה: <span className="text-foreground">{peek.document_subject}</span>
      </p>
      <div className="mb-4 flex flex-col gap-3">
        <label className="flex flex-col gap-1.5">
          <span className="font-display text-[11px] uppercase tracking-[0.18em] text-primary text-glow">
            מספר תעודת זהות
          </span>
          <input
            dir="ltr"
            autoFocus
            inputMode="numeric"
            value={idValue}
            onChange={(e) => onIdChange(e.target.value)}
            placeholder="000000000"
            className="w-full rounded-md border border-primary/40 bg-background/50 px-3 py-2.5 text-base text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary focus:shadow-[0_0_12px_rgba(48,255,247,0.5)]"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-display text-[11px] uppercase tracking-[0.18em] text-primary text-glow">
            מספר טלפון נייד
          </span>
          <input
            dir="ltr"
            inputMode="tel"
            value={phoneValue}
            onChange={(e) => onPhoneChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSubmit();
            }}
            placeholder="05X-XXXXXXX"
            className="w-full rounded-md border border-primary/40 bg-background/50 px-3 py-2.5 text-base text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary focus:shadow-[0_0_12px_rgba(48,255,247,0.5)]"
          />
        </label>
      </div>
      <label className="mb-4 flex cursor-pointer items-start gap-2 text-xs text-muted-foreground">
        <input
          type="checkbox"
          checked={agreedTerms}
          onChange={(e) => onAgreedChange(e.target.checked)}
          className="mt-0.5 h-4 w-4 cursor-pointer appearance-none rounded border border-primary/40 bg-background/50 transition checked:border-primary checked:bg-primary checked:shadow-[0_0_12px_rgba(48,255,247,0.9)] focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <span className="leading-relaxed">
          אני מאשר כי קראתי ואני מסכים ל
          <button
            type="button"
            onClick={onShowTerms}
            className="mx-1 font-medium text-primary text-glow underline-offset-2 hover:underline"
          >
            תנאי השימוש
          </button>
          ולהצהרת החתימה הדיגיטלית.
        </span>
      </label>
      <button
        type="button"
        onClick={onSubmit}
        disabled={busy || !agreedTerms}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 font-display text-sm font-bold text-primary-foreground glow-aqua hover:brightness-110 disabled:opacity-60"
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
        המשך למסמך
      </button>
    </section>
  );
}

function ViewerCard({
  ctx,
  token,
  idNumber,
  phone,
  onSigned,
}: {
  ctx: Ctx;
  token: string;
  idNumber: string;
  phone: string;
  onSigned: () => void;
}) {
  const canvasRef = useRef<SignatureCanvasHandle>(null);
  const [busy, setBusy] = useState(false);
  const [placed, setPlaced] = useState<Set<number>>(new Set());
  const totalPins = ctx.coordinates?.length ?? 0;
  const allPlaced = totalPins === 0 ? true : placed.size === totalPins;

  const scrollToFirstMissing = () => {
    const firstMissing = (ctx.coordinates ?? []).findIndex(
      (_, i) => !placed.has(i),
    );
    if (firstMissing < 0) return;
    const el = document.querySelector(
      `[data-pin-index="${firstMissing}"]`,
    ) as HTMLElement | null;
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handlePinClick = (idx: number) => {
    if (canvasRef.current?.isEmpty()) {
      toast.error("יש לצייר חתימה לפני סימון מיקום");
      const pad = document.getElementById("signature-pad");
      pad?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setPlaced((prev) => {
      const next = new Set(prev);
      next.add(idx);
      return next;
    });
  };

  const submit = async () => {
    if (!allPlaced) {
      toast.error("יש להשלים את כל מיקומי החתימה");
      scrollToFirstMissing();
      return;
    }
    if (canvasRef.current?.isEmpty()) {
      toast.error("יש לחתום במסגרת");
      return;
    }
    const dataUrl = canvasRef.current?.toDataURL() ?? "";
    if (!dataUrl) return;
    try {
      setBusy(true);
      await submitSignature({ data: { token, idNumber, phone, signature: dataUrl } });
      toast.success("המסמך נחתם ונשלח בהצלחה!", {
        style: {
          background: "rgba(48,255,247,0.12)",
          border: "1px solid rgba(48,255,247,0.6)",
          color: "hsl(var(--primary))",
          boxShadow: "0 0 24px rgba(48,255,247,0.5)",
        },
      });
      onSigned();
    } catch (e) {
      console.error(e);
      toast.error(e instanceof Error ? e.message : "שגיאה בשליחת החתימה");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="glass-panel flex flex-col gap-5 p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <FileSignature className="h-5 w-5 text-primary icon-glow" />
        <h1 className="font-display text-lg text-primary text-glow">{ctx.subject}</h1>
      </div>

      {ctx.message && (
        <p className="rounded-md border border-primary/15 bg-primary/5 p-3 text-sm text-foreground">
          {ctx.message}
        </p>
      )}

      {/* Inline PDF viewer with sender's signature pins */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary icon-glow" />
            <p
              className="font-display text-xs uppercase tracking-[0.2em] text-primary text-glow truncate max-w-[60vw]"
              title={ctx.fileName}
            >
              {ctx.fileName}
            </p>
          </div>
          {ctx.fileUrl && (
            <a
              href={ctx.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-primary/40 px-2.5 py-1 text-[11px] text-primary hover:bg-primary/10"
            >
              <ExternalLink className="h-3 w-3" /> פתח בלשונית
            </a>
          )}
        </div>
        {ctx.fileUrl ? (
          <SignerPdfViewer
            fileUrl={ctx.fileUrl}
            coordinates={ctx.coordinates ?? []}
            placedIndices={placed}
            onPinClick={handlePinClick}
          />
        ) : (
          <div className="rounded-md border border-destructive/40 p-4 text-center text-xs text-destructive">
            לא ניתן לטעון את המסמך
          </div>
        )}
      </div>

      {/* Instruction */}
      <p className="rounded-md border border-primary/15 bg-primary/5 p-3 text-center text-xs text-foreground sm:text-sm">
        צייר את חתימתך כאן, ולאחר מכן לחץ על כל סמן זוהר במסמך כדי לסמן אותו כהושלם ({placed.size}/{totalPins}):
      </p>

      {/* Signature pad */}
      <div id="signature-pad" className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PenTool className="h-4 w-4 text-primary icon-glow" />
            <p className="font-display text-xs uppercase tracking-[0.2em] text-primary text-glow">
              חתום כאן
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              canvasRef.current?.clear();
              setPlaced(new Set());
            }}
            className="inline-flex items-center gap-1.5 rounded-md border border-primary/20 px-2.5 py-1 text-[11px] text-muted-foreground hover:bg-primary/5 hover:text-foreground"
          >
            <Eraser className="h-3 w-3" /> נקה
          </button>
        </div>
        <SignatureCanvas ref={canvasRef} />
      </div>

      <div
        onClick={() => {
          if (!allPlaced && !busy) {
            toast.error("יש להשלים את כל מיקומי החתימה");
            scrollToFirstMissing();
          }
        }}
      >
        <button
          type="button"
          onClick={submit}
          disabled={busy || !allPlaced}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 font-display text-sm font-bold tracking-wider text-primary-foreground glow-aqua hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {allPlaced ? "סיום ושלח" : `סיום ושלח (${placed.size}/${totalPins})`}
        </button>
      </div>
    </section>
  );
}

function SuccessCard({ subject }: { subject: string }) {
  return (
    <section className="glass-panel flex flex-col items-center p-10 text-center">
      <CheckCircle2 className="mb-4 h-16 w-16 text-primary icon-glow" />
      <h1 className="font-display text-xl text-primary text-glow">המסמך נחתם בהצלחה</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        תודה על חתימתך על "{subject}". ניתן לסגור חלון זה.
      </p>
    </section>
  );
}

function ErrorCard({ message }: { message: string }) {
  return (
    <section className="glass-panel border-destructive/40 p-8 text-center">
      <h1 className="font-display text-lg text-destructive">לא ניתן לטעון את הקישור</h1>
      <p className="mt-2 text-sm text-muted-foreground">{message}</p>
    </section>
  );
}
