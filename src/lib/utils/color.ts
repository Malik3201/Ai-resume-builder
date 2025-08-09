/**
 * Color utility functions for contrast checking and accessibility
 * Provides WCAG AA compliance checking for text readability
 */

/**
 * Convert hex color to RGB values
 * @param {string} hex - Hex color string (e.g., "#ff0000")
 * @returns {[number, number, number]} RGB values [r, g, b]
 */
export function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    throw new Error(`Invalid hex color: ${hex}`);
  }
  return [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16),
  ];
}

/**
 * Convert RGB to HSL color format
 * @param {string} hsl - HSL color string (e.g., "221 83% 53%")
 * @returns {[number, number, number]} RGB values [r, g, b]
 */
export function hslToRgb(hsl: string): [number, number, number] {
  const match = hsl.match(/(\d+)\s+(\d+)%\s+(\d+)%/);
  if (!match) {
    throw new Error(`Invalid HSL color: ${hsl}`);
  }
  
  const h = parseInt(match[1]) / 360;
  const s = parseInt(match[2]) / 100;
  const l = parseInt(match[3]) / 100;

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

/**
 * Calculate the relative luminance of a color
 * @param {[number, number, number]} rgb - RGB color values [r, g, b]
 * @returns {number} Relative luminance (0-1)
 */
export function luminance([r, g, b]: [number, number, number]): number {
  // Convert to sRGB
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  // Calculate relative luminance
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate the contrast ratio between two colors
 * @param {[number, number, number]} rgb1 - First color RGB values
 * @param {[number, number, number]} rgb2 - Second color RGB values
 * @returns {number} Contrast ratio (1-21)
 */
export function contrastRatio(rgb1: [number, number, number], rgb2: [number, number, number]): number {
  const lum1 = luminance(rgb1);
  const lum2 = luminance(rgb2);
  
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Check if color combination passes WCAG AA for normal text
 * @param {[number, number, number]} foreground - Foreground color RGB
 * @param {[number, number, number]} background - Background color RGB
 * @returns {boolean} True if passes AA (contrast ratio >= 4.5)
 */
export function passesAA(foreground: [number, number, number], background: [number, number, number]): boolean {
  return contrastRatio(foreground, background) >= 4.5;
}

/**
 * Convert color string to RGB values (supports hex and HSL)
 * @param {string} color - Color string (hex or HSL)
 * @returns {[number, number, number]} RGB values
 */
export function colorToRgb(color: string): [number, number, number] {
  if (color.startsWith('#')) {
    return hexToRgb(color);
  }
  if (color.includes('%')) {
    return hslToRgb(color);
  }
  throw new Error(`Unsupported color format: ${color}`);
}
