import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, ShieldCheck, FileSignature, CheckCircle2, PenTool } from "lucide-react";
import { toast } from "sonner";
import { peekToken, verifySigner } from "@/server/signing.functions";
import { SignatureModal } from "@/components/mnit/SignatureModal";

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

type Peek = { verification_type: "id_number" | "phone"; recipient_name: string; document_subject: string; already_signed: boolean };
type Ctx = { fileName: string; subject: string; message: string | null; alreadySigned: boolean; fileUrl: string | null };

function SignPage() {
  const { token } = Route.useParams();
  const [stage, setStage] = useState<Stage>("verify");
  const [peek, setPeek] = useState<Peek | null>(null);
  const [peekErr, setPeekErr] = useState<string | null>(null);
  const [verification, setVerification] = useState("");
  const [busy, setBusy] = useState(false);
  const [ctx, setCtx] = useState<Ctx | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    let active = true;
    peekToken({ data: { token } })
      .then((p) => { if (active) setPeek(p as Peek); })
      .catch((e) => { if (active) setPeekErr(e instanceof Error ? e.message : "הקישור לא תקין"); });
    return () => { active = false; };
  }, [token]);

  const verify = async () => {
    if (verification.trim().length < 4) { toast.error("יש להזין ערך אימות תקין"); return; }
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
          <div className="font-display text-xl tracking-[0.25em] text-primary text-glow">MNIT · SIGN</div>
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
          <ViewerCard ctx={ctx} onSign={() => setModalOpen(true)} />
        ) : (
          <SuccessCard subject={peek.document_subject} />
        )}
      </div>

      {ctx && (
        <SignatureModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          token={token}
          verification={verification.trim()}
          onSigned={() => setStage("done")}
        />
      )}
    </div>
  );
}

function VerifyCard({ peek, value, onChange, onSubmit, busy }: { peek: Peek; value: string; onChange: (v: string) => void; onSubmit: () => void; busy: boolean }) {
  const isId = peek.verification_type === "id_number";
  return (
    <section className="glass-panel p-6">
      <div className="mb-4 flex items-center gap-2">
        <ShieldCheck className="h-5 w-5 text-primary icon-glow" />
        <h1 className="font-display text-lg text-primary text-glow">אימות זהות</h1>
      </div>
      <p className="mb-4 text-sm text-muted-foreground">
        שלום <span className="text-foreground">{peek.recipient_name}</span>, אנא הזן את {isId ? "מספר תעודת הזהות" : "מספר הטלפון"} שלך כדי לצפות במסמך:
      </p>
      <p className="mb-4 text-xs text-muted-foreground">נושא הפנייה: <span className="text-foreground">{peek.document_subject}</span></p>
      <input
        dir="ltr"
        autoFocus
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") onSubmit(); }}
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

function ViewerCard({ ctx, onSign }: { ctx: Ctx; onSign: () => void }) {
  return (
    <section className="glass-panel p-6">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileSignature className="h-5 w-5 text-primary icon-glow" />
          <h1 className="font-display text-lg text-primary text-glow">{ctx.subject}</h1>
        </div>
      </div>
      <p className="mb-4 truncate text-xs text-muted-foreground">{ctx.fileName}</p>
      {ctx.message && (
        <p className="mb-4 rounded-md border border-primary/15 bg-primary/5 p-3 text-sm text-foreground">{ctx.message}</p>
      )}

      <div className="relative overflow-hidden rounded-lg border border-primary/30 bg-background/30">
        {ctx.fileUrl ? (
          ctx.fileUrl.match(/\.(png|jpe?g)(\?|$)/i) ? (
            <img src={ctx.fileUrl} alt={ctx.fileName} className="max-h-[60vh] w-full object-contain" />
          ) : (
            <iframe src={ctx.fileUrl} title={ctx.fileName} className="h-[60vh] w-full" />
          )
        ) : (
          <div className="flex h-[40vh] items-center justify-center text-sm text-muted-foreground">לא ניתן לטעון את המסמך</div>
        )}
      </div>

      <button
        type="button"
        onClick={onSign}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 font-display text-sm font-bold tracking-wider text-primary-foreground glow-aqua hover:brightness-110"
      >
        <PenTool className="h-4 w-4" /> חתום כאן
      </button>
    </section>
  );
}

function SuccessCard({ subject }: { subject: string }) {
  return (
    <section className="glass-panel flex flex-col items-center p-10 text-center">
      <CheckCircle2 className="mb-4 h-16 w-16 text-primary icon-glow" />
      <h1 className="font-display text-xl text-primary text-glow">המסמך נחתם בהצלחה</h1>
      <p className="mt-2 text-sm text-muted-foreground">תודה על חתימתך על "{subject}". ניתן לסגור חלון זה.</p>
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