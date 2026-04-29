import { useRef, useState } from "react";
import { Loader2, Eraser, Send } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { SignatureCanvas, type SignatureCanvasHandle } from "./SignatureCanvas";
import { submitSignature } from "@/server/signing.functions";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  token: string;
  verification: string;
  onSigned: (allSigned: boolean) => void;
};

export function SignatureModal({ open, onOpenChange, token, verification, onSigned }: Props) {
  const canvasRef = useRef<SignatureCanvasHandle>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (canvasRef.current?.isEmpty()) {
      toast.error("יש לחתום במסגרת");
      return;
    }
    const dataUrl = canvasRef.current?.toDataURL() ?? "";
    if (!dataUrl) return;
    try {
      setBusy(true);
      const { allSigned } = await submitSignature({
        data: { token, verification, signature: dataUrl },
      });
      toast.success("המסמך נחתם בהצלחה");
      onOpenChange(false);
      onSigned(allSigned);
    } catch (e) {
      console.error(e);
      toast.error(e instanceof Error ? e.message : "שגיאה בשליחת החתימה");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="glass-panel max-w-lg border-primary/30">
        <DialogHeader>
          <DialogTitle className="font-display text-lg text-primary text-glow">חתום במסגרת</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            צייר את חתימתך באמצעות העכבר או המגע
          </DialogDescription>
        </DialogHeader>
        <SignatureCanvas ref={canvasRef} />
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => canvasRef.current?.clear()}
            className="inline-flex items-center gap-1.5 rounded-md border border-primary/20 px-3 py-1.5 text-xs text-muted-foreground hover:bg-primary/5 hover:text-foreground"
          >
            <Eraser className="h-3.5 w-3.5" /> נקה
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-md border border-primary/20 px-3 py-1.5 text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            >
              בטל
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={busy}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground glow-aqua hover:brightness-110 disabled:opacity-60"
            >
              {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
              חתום ושלח
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}