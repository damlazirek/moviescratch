export function measureClearRatio(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  step = 10,
): number {
  const sample = ctx.getImageData(0, 0, width, height).data;
  let transparent = 0;
  let total = 0;
  for (let i = 3; i < sample.length; i += 4 * step) {
    total += 1;
    if (sample[i]! < 16) transparent += 1;
  }
  return total === 0 ? 0 : transparent / total;
}
