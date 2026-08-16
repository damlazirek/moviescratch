import { BRUSH_RADIUS_COARSE, BRUSH_RADIUS_FINE, STAMP_SPACING } from "./constants";

type Point = { x: number; y: number };

/**
 * Organic coin-scratch erase: jittered stamps along the path, soft edges.
 * Not a clean digital circle stroke.
 */
export function eraseAlongPath(
  ctx: CanvasRenderingContext2D,
  from: Point | null,
  to: Point,
  canvasShortSide: number,
  coarse: boolean,
) {
  const baseR = canvasShortSide * (coarse ? BRUSH_RADIUS_COARSE : BRUSH_RADIUS_FINE);

  ctx.globalCompositeOperation = "destination-out";
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const stamp = (x: number, y: number, pressure = 1) => {
    const jitter = (Math.random() - 0.5) * baseR * 0.35;
    const jx = x + jitter;
    const jy = y + (Math.random() - 0.5) * baseR * 0.35;
    const r = baseR * (0.7 + Math.random() * 0.28) * pressure;

    // Soft core — keep blur modest so a light pass doesn't wipe half the card
    ctx.shadowBlur = r * (0.28 + Math.random() * 0.18);
    ctx.shadowColor = "rgba(0,0,0,1)";
    ctx.fillStyle = "rgba(0,0,0,0.88)";
    ctx.beginPath();
    ctx.ellipse(
      jx,
      jy,
      r * (0.82 + Math.random() * 0.22),
      r * (0.68 + Math.random() * 0.28),
      Math.random() * Math.PI,
      0,
      Math.PI * 2,
    );
    ctx.fill();

    // Secondary fleck for torn edge
    if (Math.random() > 0.62) {
      ctx.shadowBlur = r * 0.15;
      ctx.beginPath();
      ctx.arc(
        jx + (Math.random() - 0.5) * r,
        jy + (Math.random() - 0.5) * r,
        r * (0.16 + Math.random() * 0.18),
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }
  };

  if (!from) {
    stamp(to.x, to.y, 1);
    // slight cluster on press
    stamp(to.x + baseR * 0.15, to.y - baseR * 0.1, 0.7);
    return;
  }

  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dist = Math.hypot(dx, dy);
  const spacing = Math.max(baseR * STAMP_SPACING, 1.5);
  const steps = Math.max(1, Math.ceil(dist / spacing));

  for (let i = 1; i <= steps; i += 1) {
    const t = i / steps;
    stamp(from.x + dx * t, from.y + dy * t, 0.85 + Math.random() * 0.2);
  }
}

/** Fade remaining material after threshold — not an instant rectangle wipe. */
export function dissolveRemaining(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  passes = 4,
) {
  ctx.globalCompositeOperation = "destination-out";
  for (let p = 0; p < passes; p += 1) {
    const alpha = 0.28 + p * 0.18;
    ctx.fillStyle = `rgba(0,0,0,${alpha})`;
    // irregular wipe bands
    for (let i = 0; i < 12; i += 1) {
      const y = (height / 12) * i + (Math.random() - 0.5) * 8;
      ctx.fillRect(0, y, width, height / 10 + Math.random() * 10);
    }
  }
  ctx.fillStyle = "rgba(0,0,0,1)";
  ctx.fillRect(0, 0, width, height);
}
