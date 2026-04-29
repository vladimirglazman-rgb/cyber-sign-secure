import { useEffect, useImperativeHandle, useRef, forwardRef } from "react";

export type SignatureCanvasHandle = {
  clear: () => void;
  isEmpty: () => boolean;
  toDataURL: () => string;
};

export const SignatureCanvas = forwardRef<SignatureCanvasHandle, { className?: string }>(
  function SignatureCanvas({ className }, ref) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const drawing = useRef(false);
    const empty = useRef(true);
    const lastPt = useRef<{ x: number; y: number } | null>(null);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext("2d")!;
      ctx.scale(dpr, dpr);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = "#30FFF7";
      ctx.shadowColor = "rgba(48,255,247,0.6)";
      ctx.shadowBlur = 6;
    }, []);

    const pos = (e: React.PointerEvent<HTMLCanvasElement>) => {
      const r = canvasRef.current!.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      canvasRef.current!.setPointerCapture(e.pointerId);
      drawing.current = true;
      empty.current = false;
      lastPt.current = pos(e);
    };

    const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!drawing.current || !canvasRef.current) return;
      const ctx = canvasRef.current.getContext("2d")!;
      const p = pos(e);
      const last = lastPt.current ?? p;
      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      lastPt.current = p;
    };

    const end = (e: React.PointerEvent<HTMLCanvasElement>) => {
      drawing.current = false;
      lastPt.current = null;
      try { canvasRef.current?.releasePointerCapture(e.pointerId); } catch { /* noop */ }
    };

    useImperativeHandle(ref, () => ({
      clear: () => {
        const c = canvasRef.current;
        if (!c) return;
        const ctx = c.getContext("2d")!;
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, c.width, c.height);
        ctx.restore();
        empty.current = true;
      },
      isEmpty: () => empty.current,
      toDataURL: () => canvasRef.current?.toDataURL("image/png") ?? "",
    }));

    return (
      <canvas
        ref={canvasRef}
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
        className={`w-full touch-none rounded-lg border border-primary/30 bg-background/40 ${className ?? ""}`}
        style={{ height: 180 }}
      />
    );
  }
);