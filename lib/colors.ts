// Reusable color interpolation utilities
// getInterpolatedColor(startColor, endColor, value, maxValue)
// - startColor/endColor: hex strings like '#RRGGBB' or 'RRGGBB'
// - value: current numeric value
// - maxValue: maximum value for the scale (e.g. 5)
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let cleaned = hex.replace('#', '')
  if (cleaned.length === 3) {
    cleaned = cleaned.split('').map((c) => c + c).join('')
  }
  const int = parseInt(cleaned, 16)
  return {
    r: (int >> 16) & 255,
    g: (int >> 8) & 255,
    b: int & 255,
  }
}

export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const h = Math.max(0, Math.min(255, Math.round(n))).toString(16)
    return h.length === 1 ? '0' + h : h
  }
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

export function getInterpolatedColor(startColor: string, endColor: string, value: number, maxValue: number): string {
  if (maxValue <= 0) return startColor
  const v = Math.max(0, Math.min(maxValue, value))
  const t = v / maxValue
  const s = hexToRgb(startColor)
  const e = hexToRgb(endColor)
  const r = s.r + (e.r - s.r) * t
  const g = s.g + (e.g - s.g) * t
  const b = s.b + (e.b - s.b) * t
  return rgbToHex(r, g, b)
}

export default getInterpolatedColor
