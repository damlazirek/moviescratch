/** Shared foil painting for teaser + scratch cards. */
export function paintFoil(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  seed = 1,
) {
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#55585c");
  gradient.addColorStop(0.4, "#8a8d92");
  gradient.addColorStop(0.7, "#b0ada4");
  gradient.addColorStop(1, "#c5c2b8");
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Deterministic-ish speckles from seed
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  const rand = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };

  ctx.fillStyle = "rgba(11, 10, 9, 0.14)";
  const dots = Math.floor((width * height) / 900);
  for (let i = 0; i < dots; i += 1) {
    const x = rand() * width;
    const y = rand() * height;
    ctx.fillRect(x, y, 1.2 + rand(), 1.2 + rand());
  }

  ctx.strokeStyle = "rgba(237, 232, 223, 0.07)";
  ctx.lineWidth = Math.max(1, width * 0.002);
  for (let y = height * 0.08; y < height; y += height * 0.07) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y + height * 0.015);
    ctx.stroke();
  }

  // Soft vignette
  const vignette = ctx.createRadialGradient(
    width * 0.5,
    height * 0.45,
    width * 0.2,
    width * 0.5,
    height * 0.5,
    width * 0.75,
  );
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(11,10,9,0.22)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);
}

export function measureClearRatio(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  step = 12,
): number {
  const sample = ctx.getImageData(0, 0, width, height).data;
  let transparent = 0;
  let total = 0;
  for (let i = 3; i < sample.length; i += 4 * step) {
    total += 1;
    if (sample[i]! < 28) transparent += 1;
  }
  return total === 0 ? 0 : transparent / total;
}

export const SCRATCH_THRESHOLD = 0.55;
