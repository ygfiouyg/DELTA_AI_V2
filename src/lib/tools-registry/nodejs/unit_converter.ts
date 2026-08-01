/**
 * Tool: unit_converter.ts
 * Category: utility
 * Description: محول وحدات شامل — طول، وزن، حرارة، مساحة، حجم، سرعة، بيانات.
 *
 * Dependencies: none
 */

const CONVERSIONS = {
  // Length (meters as base)
  length: {
    mm: 0.001, cm: 0.01, m: 1, km: 1000,
    in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344,
  },
  // Weight (grams as base)
  weight: {
    mg: 0.001, g: 1, kg: 1000, t: 1_000_000,
    oz: 28.3495, lb: 453.592,
  },
  // Volume (liters as base)
  volume: {
    ml: 0.001, l: 1, m3: 1000,
    tsp: 0.00492892, tbsp: 0.0147868, cup: 0.236588,
    pt: 0.473176, qt: 0.946353, gal: 3.78541,
  },
  // Area (m² as base)
  area: {
    mm2: 0.000001, cm2: 0.0001, m2: 1, km2: 1_000_000,
    ha: 10000, acre: 4046.86, ft2: 0.092903, in2: 0.00064516,
  },
  // Speed (m/s as base)
  speed: {
    mps: 1, kph: 0.277778, mph: 0.44704, knot: 0.514444,
  },
  // Data (bytes as base)
  data: {
    B: 1, KB: 1024, MB: 1024 ** 2, GB: 1024 ** 3, TB: 1024 ** 4,
    PB: 1024 ** 5,
  },
  // Time (seconds as base)
  time: {
    ms: 0.001, s: 1, min: 60, hr: 3600, day: 86400, week: 604800, month: 2629800, year: 31557600,
  },
  // Pressure (pascal as base)
  pressure: {
    Pa: 1, kPa: 1000, MPa: 1_000_000, bar: 100_000, atm: 101_325, psi: 6894.76, torr: 133.322,
  },
  // Angle (radians as base)
  angle: {
    rad: 1, deg: Math.PI / 180, grad: Math.PI / 200, turn: 2 * Math.PI,
  },
};

const TEMPERATURE_UNITS = ["C", "F", "K"] as const;
type TempUnit = typeof TEMPERATURE_UNITS[number];

function convertTemperature(value: number, from: string, to: string): number {
  // Convert to Celsius first
  let celsius: number;
  if (from === "C") celsius = value;
  else if (from === "F") celsius = (value - 32) * 5 / 9;
  else if (from === "K") celsius = value - 273.15;
  else throw new Error(`unknown temperature unit: ${from}`);

  // Then to target
  if (to === "C") return celsius;
  if (to === "F") return celsius * 9 / 5 + 32;
  if (to === "K") return celsius + 273.15;
  throw new Error(`unknown temperature unit: ${to}`);
}

export async function execute(input: {
  operation: "convert" | "list_units";
  category?: string;
  value?: number;
  from?: string;
  to?: string;
}): Promise<any> {
  const { operation, category, value, from, to } = input;

  if (operation === "list_units") {
    const result: any = {};
    for (const [cat, units] of Object.entries(CONVERSIONS)) {
      result[cat] = Object.keys(units);
    }
    result.temperature = [...TEMPERATURE_UNITS];
    return { success: true, categories: result };
  }

  if (operation === "convert") {
    if (value === undefined || !from || !to) {
      return { success: false, error: "value, from, and to required" };
    }

    // Temperature is special
    if (category === "temperature" || TEMPERATURE_UNITS.includes(from as TempUnit)) {
      try {
        const result = convertTemperature(Number(value), from, to);
        return {
          success: true,
          value: Number(value),
          from,
          to,
          result: Math.round(result * 10000) / 10000,
          category: "temperature",
        };
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }

    if (!category) return { success: false, error: "category required (or use temperature)" };
    const cat = category as keyof typeof CONVERSIONS;
    const catUnits = (CONVERSIONS as any)[cat];
    if (!catUnits) return { success: false, error: `unknown category: ${cat}` };
    if (!(from in catUnits)) return { success: false, error: `unknown unit '${from}' in ${cat}` };
    if (!(to in catUnits)) return { success: false, error: `unknown unit '${to}' in ${cat}` };

    const baseValue = Number(value) * catUnits[from];
    const result = baseValue / catUnits[to];

    return {
      success: true,
      value: Number(value),
      from,
      to,
      result: Math.round(result * 1000000) / 1000000,
      category,
    };
  }

  return { success: false, error: `unknown operation: ${operation}` };
}

export const tool = {
  name: "unit_converter",
  description: "محول وحدات شامل — طول، وزن، حرارة، مساحة، حجم، سرعة، بيانات",
  execute,
};

export default tool;
