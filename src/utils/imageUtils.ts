// src/utils/imageUtils.ts
/**
 * Compute the average luminance (0–255) of the canvas.
 * Uses Rec.709 luma coefficients.
 */
export function computeAverageLuminance(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): number {
  const imageData = ctx.getImageData(0, 0, width, height);
  const { data } = imageData;
  let total = 0;
  // RGBA bytes, so step by 4
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    total += 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
  return total / (width * height);
}
