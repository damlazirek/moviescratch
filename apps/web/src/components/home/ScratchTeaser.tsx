import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { measureClearRatio, paintFoil } from "@/lib/foil";
import { motionTokens } from "@/lib/motion";

const REVEAL_THRESHOLD = 0.42;

/** Interactive foil preview for Home — teaches the ritual before Lists. */
export function ScratchTeaser() {
  const { t, tf } = useLocale();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  const measureProgress = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    const ratio = measureClearRatio(ctx, canvas.width, canvas.height, 16);
    setProgress(ratio);
    if (ratio >= REVEAL_THRESHOLD) setDone(true);
  }, []);

  const reset = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    paintFoil(ctx, canvas.width, canvas.height, 3);
    setProgress(0);
    setDone(false);
    last.current = null;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      paintFoil(ctx, canvas.width, canvas.height, 3);
      setProgress(0);
      setDone(false);
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const scratchAt = (clientX: number, clientY: number) => {
    if (done) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;
    const radius = Math.max(canvas.width, canvas.height) * 0.045;

    ctx.globalCompositeOperation = "destination-out";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = radius * 2;

    if (last.current) {
      ctx.beginPath();
      ctx.moveTo(last.current.x, last.current.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    last.current = { x, y };
    measureProgress();
  };

  const clearLabel = useMemo(
    () =>
      tf(t.teaser.cleared, {
        pct: Math.min(100, Math.round(progress * 100)),
      }),
    [progress, t.teaser.cleared, tf],
  );

  return (
    <div className="relative flex h-full min-h-[320px] flex-col sm:min-h-[420px] lg:min-h-full">
      <div className="relative flex-1 overflow-hidden border border-line bg-stage">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 40% 30%, #3a2e22 0%, #12100e 55%, #0b0a09 100%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-[12%] border border-paper/10 bg-[linear-gradient(145deg,#2a241c,#14110e)] opacity-90"
        />
        <p
          aria-hidden
          className="font-marquee pointer-events-none absolute inset-0 z-[1] flex items-center justify-center text-5xl tracking-[0.14em] text-paper/20 sm:text-6xl"
        >
          ???
        </p>

        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-[2] touch-none cursor-crosshair"
          role="img"
          aria-label={t.teaser.aria}
          onPointerDown={(e) => {
            drawing.current = true;
            e.currentTarget.setPointerCapture(e.pointerId);
            last.current = null;
            scratchAt(e.clientX, e.clientY);
          }}
          onPointerMove={(e) => {
            if (!drawing.current) return;
            scratchAt(e.clientX, e.clientY);
          }}
          onPointerUp={() => {
            drawing.current = false;
            last.current = null;
          }}
          onPointerCancel={() => {
            drawing.current = false;
            last.current = null;
          }}
        />

        {!done && progress < 0.05 && (
          <p className="font-ui pointer-events-none absolute bottom-4 left-4 z-[3] text-xs tracking-[0.14em] uppercase text-paper/70">
            {t.teaser.drag}
          </p>
        )}

        {done && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: motionTokens.base, ease: motionTokens.easeOutExpo }}
            className="absolute inset-0 z-[3] flex flex-col items-center justify-center gap-4 bg-ink/55 px-6 text-center backdrop-blur-[2px]"
          >
            <p className="font-display text-2xl text-paper sm:text-3xl">
              {t.teaser.ritual}
            </p>
            <p className="max-w-xs text-sm text-muted">{t.teaser.ritualSub}</p>
            <div className="flex flex-wrap justify-center gap-2">
              <Link to="/lists">
                <Button size="md">{t.teaser.chooseList}</Button>
              </Link>
              <Button size="md" variant="ghost" onClick={reset}>
                {t.teaser.tryAgain}
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      <div className="font-ui mt-3 flex items-center justify-between text-xs tracking-wide text-muted">
        <span>{t.teaser.preview}</span>
        <span aria-live="polite">{clearLabel}</span>
      </div>
    </div>
  );
}
