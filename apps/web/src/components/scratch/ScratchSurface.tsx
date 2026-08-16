import {
  useCallback,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { ScratchCoin } from "@/components/scratch/ScratchCoin";
import { SCRATCH_REVEAL_THRESHOLD } from "@/lib/scratch/constants";
import { dissolveRemaining, eraseAlongPath } from "@/lib/scratch/erasePath";
import { measureClearRatio } from "@/lib/scratch/measureClear";
import { paintScratchMaterial } from "@/lib/scratch/paintScratchMaterial";
import {
  getCardRecord,
  markRevealed,
  saveMask,
} from "@/lib/scratch/scratchStore";
import {
  intensityFromDelta,
  markScratchTick,
  playRevealSound,
  startScratchSound,
  stopScratchSound,
  unlockScratchAudio,
  updateScratchSound,
} from "@/lib/scratch/scratchAudio";
import { cn } from "@/lib/cn";

type Fleck = {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  size: number;
  rot: number;
};

type ScratchSurfaceProps = {
  listId: string;
  movieId: string;
  enabled?: boolean;
  seed?: number;
  idleCoin?: boolean;
  className?: string;
  onReady?: () => void;
  onProgress?: (ratio: number) => void;
  onReveal?: () => void;
  onScratchStart?: () => void;
  onScratchEnd?: () => void;
};

function isCoarsePointer() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches
  );
}

export function ScratchSurface({
  listId,
  movieId,
  enabled = true,
  seed = 1,
  idleCoin = false,
  className,
  onReady,
  onProgress,
  onReveal,
  onScratchStart,
  onScratchEnd,
}: ScratchSurfaceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const coinRef = useRef<HTMLDivElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const lastCss = useRef<{ x: number; y: number; t: number } | null>(null);
  const revealed = useRef(false);
  const fleckId = useRef(0);
  const measureTick = useRef(0);
  const rafMeasure = useRef(0);
  const saveTimer = useRef(0);
  const ready = useRef(false);
  const setupGen = useRef(0);

  const [flecks, setFlecks] = useState<Fleck[]>([]);
  const [clearing, setClearing] = useState(false);
  const [surfaceReady, setSurfaceReady] = useState(false);
  const [coinVisible, setCoinVisible] = useState(false);
  const [coinPressing, setCoinPressing] = useState(false);

  const emitProgress = useEffectEvent((ratio: number) => {
    onProgress?.(ratio);
  });
  const emitReady = useEffectEvent(() => {
    onReady?.();
  });
  const emitReveal = useEffectEvent(() => {
    onReveal?.();
  });
  const emitScratchStart = useEffectEvent(() => {
    onScratchStart?.();
  });
  const emitScratchEnd = useEffectEvent(() => {
    onScratchEnd?.();
  });

  const placeCoin = useCallback((cssX: number, cssY: number, pressing: boolean) => {
    const el = coinRef.current;
    if (!el) return;
    const coarse = isCoarsePointer();
    const ox = coarse ? -8 : 0;
    const oy = coarse ? -30 : 0;
    let rot = 0;
    let tilt = pressing ? 10 : 0;
    const prev = lastCss.current;
    const now = performance.now();
    if (prev && pressing) {
      const dt = Math.max(8, now - prev.t);
      const vx = ((cssX - prev.x) / dt) * 16;
      rot = Math.max(-22, Math.min(22, vx * 2.2));
      tilt = 8 + Math.min(10, Math.hypot(cssX - prev.x, cssY - prev.y) * 0.15);
    }
    lastCss.current = { x: cssX, y: cssY, t: now };
    const scale = pressing ? 0.9 : coarse ? 0.88 : 1;
    el.style.transform = `translate3d(${cssX + ox}px, ${cssY + oy}px, 0) translate(-50%, -50%) rotate(${rot}deg) rotateX(${tilt}deg) scale(${scale})`;
  }, []);

  const parkIdleCoin = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    placeCoin(rect.width * 0.7, rect.height * 0.76, false);
  }, [placeCoin]);

  const persistMask = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || revealed.current) return;
    try {
      const dataUrl = canvas.toDataURL("image/png");
      void saveMask(listId, movieId, dataUrl);
    } catch {
      /* ignore quota */
    }
  }, [listId, movieId]);

  const schedulePersist = useCallback(() => {
    window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => persistMask(), 180);
  }, [persistMask]);

  const emitFleck = useCallback((cssX: number, cssY: number) => {
    if (Math.random() > 0.45) return;
    fleckId.current += 1;
    const id = fleckId.current;
    const fleck: Fleck = {
      id,
      x: cssX,
      y: cssY,
      dx: (Math.random() - 0.5) * 22,
      dy: -6 - Math.random() * 18,
      size: 1.5 + Math.random() * 2.5,
      rot: (Math.random() - 0.5) * 40,
    };
    setFlecks((prev) => [...prev.slice(-8), fleck]);
    window.setTimeout(() => {
      setFlecks((prev) => prev.filter((f) => f.id !== id));
    }, 300);
  }, []);

  const finishReveal = useCallback(() => {
    if (revealed.current) return;
    revealed.current = true;
    setClearing(true);
    setCoinVisible(false);
    setCoinPressing(false);
    stopScratchSound();
    playRevealSound();
    emitScratchEnd();

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      dissolveRemaining(ctx, canvas.width, canvas.height);
    }

    void markRevealed(listId, movieId);
    emitProgress(1);
    window.setTimeout(() => emitReveal(), 360);
  }, [listId, movieId]);

  const measure = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || revealed.current) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    const ratio = measureClearRatio(ctx, canvas.width, canvas.height);
    emitProgress(ratio);
    if (ratio >= SCRATCH_REVEAL_THRESHOLD) {
      finishReveal();
    }
  }, [finishReveal]);

  const scheduleMeasure = useCallback(() => {
    if (rafMeasure.current) return;
    rafMeasure.current = requestAnimationFrame(() => {
      rafMeasure.current = 0;
      measure();
    });
  }, [measure]);

  // Setup once per card — must NOT re-run when parent re-renders (grid dimming)
  useEffect(() => {
    const gen = ++setupGen.current;
    let cancelled = false;

    const run = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const record = await getCardRecord(`${listId}:${movieId}`);
      if (cancelled || gen !== setupGen.current) return;

      if (record?.revealed) {
        revealed.current = true;
        setClearing(true);
        ready.current = true;
        setSurfaceReady(true);
        emitReady();
        return;
      }

      paintScratchMaterial(ctx, canvas.width, canvas.height, seed);

      if (record?.maskDataUrl) {
        await new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => {
            if (cancelled || gen !== setupGen.current) {
              resolve();
              return;
            }
            ctx.globalCompositeOperation = "source-over";
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve();
          };
          img.onerror = () => resolve();
          img.src = record.maskDataUrl!;
        });
        if (cancelled || gen !== setupGen.current) return;
        const ratio = measureClearRatio(ctx, canvas.width, canvas.height);
        emitProgress(ratio);
      } else {
        emitProgress(0);
      }

      if (cancelled || gen !== setupGen.current) return;
      revealed.current = false;
      setClearing(false);
      ready.current = true;
      setSurfaceReady(true);
      emitReady();
    };

    void run();

    return () => {
      cancelled = true;
      if (rafMeasure.current) cancelAnimationFrame(rafMeasure.current);
      window.clearTimeout(saveTimer.current);
      stopScratchSound();
    };
  }, [listId, movieId, seed]);

  useEffect(() => {
    if (!enabled || clearing || revealed.current || !surfaceReady) return;
    if (!idleCoin || !isCoarsePointer()) return;
    setCoinVisible(true);
    const id = requestAnimationFrame(() => parkIdleCoin());
    return () => cancelAnimationFrame(id);
  }, [enabled, clearing, idleCoin, parkIdleCoin, surfaceReady]);

  const scratchAt = (clientX: number, clientY: number) => {
    if (!enabled || revealed.current || clearing || !ready.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;
    const cssX = clientX - rect.left;
    const cssY = clientY - rect.top;
    const shortSide = Math.min(canvas.width, canvas.height);
    const coarse = isCoarsePointer();

    const prevCss = lastCss.current;
    const dt = markScratchTick();
    if (prevCss) {
      updateScratchSound(
        intensityFromDelta(cssX - prevCss.x, cssY - prevCss.y, dt),
      );
    } else {
      updateScratchSound(0.35);
    }

    eraseAlongPath(ctx, last.current, { x, y }, shortSide, coarse);
    last.current = { x, y };
    emitFleck(cssX, cssY);
    placeCoin(cssX, cssY, true);
    schedulePersist();

    measureTick.current += 1;
    if (measureTick.current % 2 === 0) scheduleMeasure();
  };

  const localFromEvent = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { cssX: 0, cssY: 0 };
    const rect = canvas.getBoundingClientRect();
    return { cssX: clientX - rect.left, cssY: clientY - rect.top };
  };

  return (
    <div
      className={cn("absolute inset-0 z-[2] overscroll-none", className)}
      style={{ perspective: 480, touchAction: "none" }}
    >
      {/* Hold foil until canvas is painted — prevents poster flash */}
      {!surfaceReady && !clearing && (
        <div
          aria-hidden
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(160deg, #6e6a64 0%, #7a7670 40%, #5c5852 100%)",
          }}
        />
      )}

      <canvas
        ref={canvasRef}
        className={cn(
          "absolute inset-0 touch-none",
          enabled && !clearing ? "cursor-none" : "pointer-events-none",
          !surfaceReady && "opacity-0",
          clearing && "opacity-0 transition-opacity duration-500 ease-out",
        )}
        role="img"
        aria-label="Scratch to reveal this movie. Progress is saved."
        onPointerEnter={(e) => {
          if (!enabled || clearing || revealed.current || !surfaceReady) return;
          if (e.pointerType === "touch") return;
          setCoinVisible(true);
          const { cssX, cssY } = localFromEvent(e.clientX, e.clientY);
          placeCoin(cssX, cssY, false);
        }}
        onPointerDown={(e) => {
          if (!enabled || !surfaceReady) return;
          e.preventDefault();
          drawing.current = true;
          setCoinVisible(true);
          setCoinPressing(true);
          emitScratchStart();
          e.currentTarget.setPointerCapture(e.pointerId);
          last.current = null;
          lastCss.current = null;
          void unlockScratchAudio().then(() => startScratchSound());
          scratchAt(e.clientX, e.clientY);
        }}
        onPointerMove={(e) => {
          const { cssX, cssY } = localFromEvent(e.clientX, e.clientY);
          if (!drawing.current) {
            if (coinVisible && e.pointerType !== "touch") placeCoin(cssX, cssY, false);
            return;
          }
          e.preventDefault();
          scratchAt(e.clientX, e.clientY);
        }}
        onPointerUp={(e) => {
          drawing.current = false;
          last.current = null;
          setCoinPressing(false);
          stopScratchSound();
          emitScratchEnd();
          persistMask();
          const { cssX, cssY } = localFromEvent(e.clientX, e.clientY);
          if (isCoarsePointer() && idleCoin) {
            placeCoin(cssX, cssY, false);
            window.setTimeout(parkIdleCoin, 400);
          } else if (isCoarsePointer()) {
            setCoinVisible(false);
          } else {
            placeCoin(cssX, cssY, false);
          }
          measure();
        }}
        onPointerLeave={() => {
          if (drawing.current) return;
          if (!isCoarsePointer()) {
            setCoinVisible(false);
            setCoinPressing(false);
          }
        }}
        onPointerCancel={() => {
          drawing.current = false;
          last.current = null;
          setCoinPressing(false);
          stopScratchSound();
          emitScratchEnd();
          persistMask();
          if (isCoarsePointer() && idleCoin) parkIdleCoin();
          else setCoinVisible(false);
        }}
      />

      <ScratchCoin
        ref={coinRef}
        visible={coinVisible && !clearing && surfaceReady}
        pressing={coinPressing}
      />

      {flecks.map((f) => {
        const style = {
          left: f.x,
          top: f.y,
          width: f.size,
          height: f.size * 0.65,
          "--fx": `${f.dx}px`,
          "--fy": `${f.dy}px`,
          "--rot": `${f.rot}deg`,
          animation: "scratch-fleck 300ms ease-out forwards",
        } as CSSProperties;

        return (
          <span
            key={f.id}
            aria-hidden
            className="pointer-events-none absolute z-[15] bg-[#8a8680]"
            style={style}
          />
        );
      })}
    </div>
  );
}
