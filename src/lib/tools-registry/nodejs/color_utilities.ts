/**
 * Tool: color_utilities.ts
 * Category: utility/design
 * Description: أدوات ألوان شاملة — تحويل بين HEX, RGB, HSL, HSV + توليد gradients و palettes.
 *
 * Dependencies: none
 */

export async function execute(input: {
  operation: "convert" | "info" | "palette" | "gradient" | "mix" | "complement" | "brightness" | "random";
  color?: string;
  format?: "hex" | "rgb" | "hsl" | "hsv";
  count?: number;
  color2?: string;
  weight?: number;
}): Promise<any> {
  const { operation, color, format = "hex", count = 5, color2, weight = 0.5 } = input;

  if (operation === "random") {
    const c = randomColor();
    return { success: true, color: c, ...parseColor(c) };
  }

  if (!color && operation !== "random") {
    return { success: false, error: "color required" };
  }

  const parsed = parseColor(color!);
  if (!parsed) return { success: false, error: `invalid color: ${color}` };

  if (operation === "convert") {
    return {
      success: true,
      hex: rgbToHex(parsed.r, parsed.g, parsed.b),
      rgb: { r: parsed.r, g: parsed.g, b: parsed.b },
      hsl: rgbToHsl(parsed.r, parsed.g, parsed.b),
      hsv: rgbToHsv(parsed.r, parsed.g, parsed.b),
      format,
    };
  }

  if (operation === "info") {
    const hsl = rgbToHsl(parsed.r, parsed.g, parsed.b);
    return {
      success: true,
      hex: rgbToHex(parsed.r, parsed.g, parsed.b),
      rgb: { r: parsed.r, g: parsed.g, b: parsed.b },
      hsl,
      hsv: rgbToHsv(parsed.r, parsed.g, parsed.b),
      brightness: getBrightness(parsed.r, parsed.g, parsed.b),
      luminance: getLuminance(parsed.r, parsed.g, parsed.b),
      is_light: getBrightness(parsed.r, parsed.g, parsed.b) > 128,
      contrast_with_white: getContrast({ r: 255, g: 255, b: 255 }, parsed),
      contrast_with_black: getContrast({ r: 0, g: 0, b: 0 }, parsed),
      complementary: rgbToHex(255 - parsed.r, 255 - parsed.g, 255 - parsed.b),
    };
  }

  if (operation === "palette") {
    const hsl = rgbToHsl(parsed.r, parsed.g, parsed.b);
    const palette: string[] = [];
    // Generate analogous palette (vary hue)
    for (let i = 0; i < count; i++) {
      const newH = (hsl.h + (i - Math.floor(count / 2)) * 30 + 360) % 360;
      const rgb = hslToRgb(newH, hsl.s, hsl.l);
      palette.push(rgbToHex(rgb.r, rgb.g, rgb.b));
    }
    return { success: true, palette, base_color: color, count };
  }

  if (operation === "gradient") {
    if (!color2) return { success: false, error: "color2 required for gradient" };
    const parsed2 = parseColor(color2);
    if (!parsed2) return { success: false, error: `invalid color2: ${color2}` };
    const colors: string[] = [];
    for (let i = 0; i < count; i++) {
      const t = count === 1 ? 0 : i / (count - 1);
      const r = Math.round(parsed.r + (parsed2.r - parsed.r) * t);
      const g = Math.round(parsed.g + (parsed2.g - parsed.g) * t);
      const b = Math.round(parsed.b + (parsed2.b - parsed.b) * t);
      colors.push(rgbToHex(r, g, b));
    }
    return { success: true, gradient: colors, from: color, to: color2, count };
  }

  if (operation === "mix") {
    if (!color2) return { success: false, error: "color2 required for mix" };
    const parsed2 = parseColor(color2);
    if (!parsed2) return { success: false, error: `invalid color2: ${color2}` };
    const w = Math.max(0, Math.min(1, weight));
    const r = Math.round(parsed.r * (1 - w) + parsed2.r * w);
    const g = Math.round(parsed.g * (1 - w) + parsed2.g * w);
    const b = Math.round(parsed.b * (1 - w) + parsed2.b * w);
    return {
      success: true,
      mixed: rgbToHex(r, g, b),
      rgb: { r, g, b },
      from: color,
      to: color2,
      weight: w,
    };
  }

  if (operation === "complement") {
    return {
      success: true,
      original: color,
      complementary: rgbToHex(255 - parsed.r, 255 - parsed.g, 255 - parsed.b),
      hex: rgbToHex(parsed.r, parsed.g, parsed.b),
    };
  }

  if (operation === "brightness") {
    const brightness = getBrightness(parsed.r, parsed.g, parsed.b);
    return {
      success: true,
      brightness, // 0-255
      is_light: brightness > 128,
      is_dark: brightness <= 128,
      recommended_text: brightness > 128 ? "#000000" : "#FFFFFF",
    };
  }

  return { success: false, error: `unknown operation: ${operation}` };
}

function parseColor(c: string): { r: number; g: number; b: number } | null {
  // HEX
  if (c.startsWith("#")) {
    let hex = c.slice(1);
    if (hex.length === 3) hex = hex.split("").map((x) => x + x).join("");
    if (hex.length !== 6) return null;
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
    return { r, g, b };
  }
  // rgb(...)
  const rgbMatch = c.match(/^rgb\(?\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)?$/i);
  if (rgbMatch) {
    return { r: parseInt(rgbMatch[1]), g: parseInt(rgbMatch[2]), b: parseInt(rgbMatch[3]) };
  }
  // hsl(...) — convert to RGB
  const hslMatch = c.match(/^hsl\(?\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)?$/i);
  if (hslMatch) {
    const h = parseInt(hslMatch[1]);
    const s = parseInt(hslMatch[2]) / 100;
    const l = parseInt(hslMatch[3]) / 100;
    const rgb = hslToRgb(h, s, l);
    return rgb;
  }
  return null;
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((x) => Math.max(0, Math.min(255, x)).toString(16).padStart(2, "0")).join("");
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
    else if (max === g) h = ((b - r) / d + 2) * 60;
    else h = ((r - g) / d + 4) * 60;
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function rgbToHsv(r: number, g: number, b: number): { h: number; s: number; v: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  const d = max - min;
  const s = max === 0 ? 0 : d / max;
  const v = max;
  if (max !== min) {
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
    else if (max === g) h = ((b - r) / d + 2) * 60;
    else h = ((r - g) / d + 4) * 60;
  }
  return { h: Math.round(h), s: Math.round(s * 100), v: Math.round(v * 100) };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360; s /= 100; l /= 100;
  let r: number, g: number, b: number;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

function getBrightness(r: number, g: number, b: number): number {
  return Math.round((r * 299 + g * 587 + b * 114) / 1000);
}

function getLuminance(r: number, g: number, b: number): number {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

function getContrast(c1: { r: number; g: number; b: number }, c2: { r: number; g: number; b: number }): string {
  const l1 = getLuminance(c1.r, c1.g, c1.b);
  const l2 = getLuminance(c2.r, c2.g, c2.b);
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  return ratio.toFixed(2) + ":1";
}

function randomColor(): string {
  return rgbToHex(
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256)
  );
}

export const tool = {
  name: "color_utilities",
  description: "أدوات ألوان — convert, palette, gradient, mix, complement, brightness",
  execute,
};

export default tool;
