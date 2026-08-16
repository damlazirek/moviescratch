function mulberry32(seed: number) {
  let s = seed >>> 0;
  return () => {
    s += 0x6d2b79f5;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Printed scratch-card latex/silver — imperfect, matte, not chrome foil.
 */
export function paintScratchMaterial(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  seed = 1,
) {
  const rand = mulberry32(seed * 9973 + 13);

  // Base: muted warm-gray print (not shiny gold/silver gradient)
  const base = ctx.createLinearGradient(0, 0, width * 0.2, height);
  base.addColorStop(0, "#6e6a64");
  base.addColorStop(0.35, "#7a7670");
  base.addColorStop(0.7, "#68645e");
  base.addColorStop(1, "#5c5852");
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, width, height);

  // Second wash — slight mottling
  for (let i = 0; i < 18; i += 1) {
    const x = rand() * width;
    const y = rand() * height;
    const r = (0.08 + rand() * 0.22) * Math.max(width, height);
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    const light = rand() > 0.5;
    g.addColorStop(0, light ? "rgba(210,205,195,0.14)" : "rgba(40,38,34,0.16)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, width, height);
  }

  // Fine grain
  const grain = Math.floor((width * height) / 280);
  for (let i = 0; i < grain; i += 1) {
    const x = rand() * width;
    const y = rand() * height;
    const a = 0.04 + rand() * 0.1;
    ctx.fillStyle =
      rand() > 0.5 ? `rgba(20,18,16,${a})` : `rgba(230,224,214,${a * 0.7})`;
    ctx.fillRect(x, y, 0.8 + rand() * 1.6, 0.8 + rand() * 1.6);
  }

  // Irregular hairline scratches already in the print
  ctx.strokeStyle = "rgba(255,250,240,0.06)";
  ctx.lineWidth = Math.max(0.6, width * 0.0012);
  for (let i = 0; i < 14; i += 1) {
    const x1 = rand() * width;
    const y1 = rand() * height;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1 + (rand() - 0.5) * width * 0.35, y1 + (rand() - 0.4) * 12);
    ctx.stroke();
  }

  // Tiny printed flecks / registration marks feel
  for (let i = 0; i < 9; i += 1) {
    ctx.fillStyle = `rgba(30,28,24,${0.08 + rand() * 0.12})`;
    ctx.beginPath();
    ctx.ellipse(
      rand() * width,
      rand() * height,
      1 + rand() * 3,
      0.6 + rand() * 1.5,
      rand() * Math.PI,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }

  // Soft edge darkening (printed card margin, not UI vignette glow)
  const edge = ctx.createRadialGradient(
    width * 0.5,
    height * 0.5,
    Math.min(width, height) * 0.35,
    width * 0.5,
    height * 0.5,
    Math.max(width, height) * 0.72,
  );
  edge.addColorStop(0, "rgba(0,0,0,0)");
  edge.addColorStop(1, "rgba(18,16,14,0.28)");
  ctx.fillStyle = edge;
  ctx.fillRect(0, 0, width, height);

  // Thin inner border like a die-cut panel
  ctx.strokeStyle = "rgba(25,22,18,0.35)";
  ctx.lineWidth = Math.max(1, width * 0.004);
  ctx.strokeRect(
    width * 0.02,
    height * 0.02,
    width * 0.96,
    height * 0.96,
  );
}
