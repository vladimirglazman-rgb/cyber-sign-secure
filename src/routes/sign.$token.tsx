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
};

function SignPage() {
  const { token } = Route.useParams();
  const [stage, setStage] = useState<Stage>("verify");
  const [peek, setPeek] = useState<Peek | null>(null);
  const [peekErr, setPeekErr] = useState<string | null>(null);
  const [verification, setVerification] = useState("");
  const [busy, setBusy] = useState(false);
  const [ctx, setCtx] = useState<Ctx | null>(null);

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
    if (verification.trim().length < 4) {
      toast.error("יש להזין ערך אימות תקין");
      return;
    }
    try {
      setBusy(true);
      const c = await verifySigner({ data: { token, verification: verification.trim() } });
      setCtx(c);
      setStage(c.alreadySigned ? "done" : "view");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "פרטי אימות שגויים");
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
            value={verification}
            onChange={setVerification}
            onSubmit={verify}
            busy={busy}
          />
        ) : stage === "view" && ctx ? (
          <ViewerCard
            ctx={ctx}
            token={token}
            verification={verification.trim()}
            onSigned={() => setStage("done")}
          />
        ) : (
          <SuccessCard subject={peek.document_subject} />
        )}
      </div>
    </div>
  );
}

function VerifyCard({
  peek,
  value,
  onChange,
  onSubmit,
  busy,
}: {
  peek: Peek;
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  busy: boolean;
}) {
  const isId = peek.verification_type === "id_number";
  return (
    <section className="glass-panel p-6">
      <div className="mb-4 flex items-center gap-2">
        <ShieldCheck className="h-5 w-5 text-primary icon-glow" />
        <h1 className="font-display text-lg text-primary text-glow">אימות זהות</h1>
      </div>
      <p className="mb-4 text-sm text-muted-foreground">
        שלום <span className="text-foreground">{peek.recipient_name}</span>, אנא הזן את{" "}
        {isId ? "מספר תעודת הזהות" : "מספר הטלפון"} שלך כדי לצפות במסמך:
      </p>
      <p className="mb-4 text-xs text-muted-foreground">
        נושא הפנייה: <span className="text-foreground">{peek.document_subject}</span>
      </p>
      <input
        dir="ltr"
        autoFocus
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSubmit();
        }}
        placeholder={isId ? "ת.ז." : "טלפון"}
        className="mb-4 w-full rounded-md border border-primary/30 bg-background/50 px-3 py-2.5 text-base text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary"
      />
      <button
        type="button"
        onClick={onSubmit}
        disabled={busy}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 font-display text-sm font-bold text-primary-foreground glow-aqua hover:brightness-110 disabled:opacity-60"
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
        אמת והמשך
      </button>
    </section>
  );
}

function ViewerCard({
  ctx,
  token,
  verification,
  onSigned,
}: {
  ctx: Ctx;
  token: string;
  verification: string;
  onSigned: () => void;
}) {
  const canvasRef = useRef<SignatureCanvasHandle>(null);
  const [busy, setBusy] = useState(false);

  const openDocument = () => {
    if (!ctx.fileUrl) {
      toast.error("לא ניתן לטעון את המסמך");
      return;
    }
    window.open(ctx.fileUrl, "_blank", "noopener,noreferrer");
  };

  const submit = async () => {
    if (canvasRef.current?.isEmpty()) {
      toast.error("יש לחתום במסגרת");
      return;
    }
    const dataUrl = canvasRef.current?.toDataURL() ?? "";
    if (!dataUrl) return;
    try {
      setBusy(true);
      await submitSignature({ data: { token, verification, signature: dataUrl } });
      toast.success("המסמך נחתם בהצלחה");
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

      {/* Native "Open Document" card */}
      <div className="flex flex-col items-center gap-4 rounded-lg border border-primary/30 bg-gradient-to-b from-background/60 to-background/20 p-5 text-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl" />
          <div
            className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary/70 bg-primary/10"
            style={{
              boxShadow:
                "0 0 0 1px rgba(48,255,247,0.5), 0 0 24px rgba(48,255,247,0.45)",
            }}
          >
            <FileText
              className="h-9 w-9 text-primary"
              style={{ filter: "drop-shadow(0 0 8px rgba(48,255,247,0.7))" }}
            />
          </div>
        </div>
        <div className="space-y-1">
          <p className="font-display text-xs uppercase tracking-[0.25em] text-primary text-glow">
            המסמך מוכן לצפייה
          </p>
          <p
            className="max-w-[28ch] truncate text-sm font-semibold text-foreground"
            title={ctx.fileName}
          >
            {ctx.fileName}
          </p>
        </div>
        <button
          type="button"
          onClick={openDocument}
          disabled={!ctx.fileUrl}
          className="inline-flex items-center gap-2 rounded-lg border border-primary/70 bg-primary/15 px-6 py-3 text-sm font-semibold text-primary glow-aqua animate-pulse-glow transition hover:bg-primary/25 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <ExternalLink className="h-4 w-4 icon-glow" />
          <span className="text-glow">פתח את המסמך</span>
        </button>
        <p className="max-w-xs text-[11px] leading-relaxed text-muted-foreground">
          המסמך ייפתח בלשונית חדשה — תצוגה נטיבית מלאה במכשיר שלך.
        </p>
      </div>

      {/* Instruction */}
      <p className="rounded-md border border-primary/15 bg-primary/5 p-3 text-center text-xs text-foreground sm:text-sm">
        אנא קרא את המסמך בלחיצה על הכפתור מעלה, ולאחר מכן צייר את חתימתך מטה
      </p>

      {/* Signature pad */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PenTool className="h-4 w-4 text-primary icon-glow" />
            <p className="font-display text-xs uppercase tracking-[0.2em] text-primary text-glow">
              חתום כאן
            </p>
          </div>
          <button
            type="button"
            onClick={() => canvasRef.current?.clear()}
            className="inline-flex items-center gap-1.5 rounded-md border border-primary/20 px-2.5 py-1 text-[11px] text-muted-foreground hover:bg-primary/5 hover:text-foreground"
          >
            <Eraser className="h-3 w-3" /> נקה
          </button>
        </div>
        <SignatureCanvas ref={canvasRef} />
      </div>

      <button
        type="button"
        onClick={submit}
        disabled={busy}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 font-display text-sm font-bold tracking-wider text-primary-foreground glow-aqua hover:brightness-110 disabled:opacity-60"
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        חתום ושלח
      </button>
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
