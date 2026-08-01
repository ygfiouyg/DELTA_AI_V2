/**
 * Tool: cron_utilities.ts
 * Category: utility
 * Description: أدوات cron — parse, validate, describe, next_run, list schedule.
 *
 * Dependencies: none
 */

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export async function execute(input: {
  operation: "parse" | "validate" | "describe" | "next_run" | "schedule";
  cron?: string;
  count?: number;
  from?: string; // ISO date for next_run start
}): Promise<any> {
  const { operation, cron, count = 5, from } = input;

  if (operation === "validate") {
    if (!cron) return { success: false, error: "cron required" };
    const valid = validateCron(cron);
    return { success: true, valid, cron };
  }

  if (operation === "parse") {
    if (!cron) return { success: false, error: "cron required" };
    const parts = parseCron(cron);
    if (!parts) return { success: false, error: `invalid cron: ${cron}` };
    return { success: true, cron, parts };
  }

  if (operation === "describe") {
    if (!cron) return { success: false, error: "cron required" };
    const parts = parseCron(cron);
    if (!parts) return { success: false, error: `invalid cron: ${cron}` };
    const description = describeCron(parts);
    return { success: true, cron, description, parts };
  }

  if (operation === "next_run") {
    if (!cron) return { success: false, error: "cron required" };
    const parts = parseCron(cron);
    if (!parts) return { success: false, error: `invalid cron: ${cron}` };
    const start = from ? new Date(from) : new Date();
    if (isNaN(start.getTime())) return { success: false, error: `invalid from date: ${from}` };
    const next = computeNextRun(parts, start);
    return { success: true, cron, from: start.toISOString(), next_run: next?.toISOString() };
  }

  if (operation === "schedule") {
    if (!cron) return { success: false, error: "cron required" };
    const parts = parseCron(cron);
    if (!parts) return { success: false, error: `invalid cron: ${cron}` };
    const start = from ? new Date(from) : new Date();
    if (isNaN(start.getTime())) return { success: false, error: `invalid from date: ${from}` };
    const runs: string[] = [];
    let current = start;
    for (let i = 0; i < count; i++) {
      const next = computeNextRun(parts, current);
      if (!next) break;
      runs.push(next.toISOString());
      current = new Date(next.getTime() + 1000); // advance 1s to find next
    }
    return { success: true, cron, schedule: runs, count: runs.length };
  }

  return { success: false, error: `unknown operation: ${operation}` };
}

interface CronParts {
  minute: number[];
  hour: number[];
  dayOfMonth: number[];
  month: number[]; // 1-12
  dayOfWeek: number[]; // 0-6 (0 = Sunday)
}

function validateCron(cron: string): boolean {
  return parseCron(cron) !== null;
}

function parseCron(cron: string): CronParts | null {
  const parts = cron.trim().split(/\s+/);
  if (parts.length < 5 || parts.length > 6) return null;

  try {
    return {
      minute: parseField(parts[0], 0, 59),
      hour: parseField(parts[1], 0, 23),
      dayOfMonth: parseField(parts[2], 1, 31),
      month: parseField(parts[3], 1, 12),
      dayOfWeek: parseField(parts[4], 0, 6),
    };
  } catch {
    return null;
  }
}

function parseField(field: string, min: number, max: number): number[] {
  if (field === "*") {
    return Array.from({ length: max - min + 1 }, (_, i) => min + i);
  }
  const result = new Set<number>();
  for (const part of field.split(",")) {
    if (part.includes("/")) {
      // Step: e.g. */15 or 0-30/5
      const [range, stepStr] = part.split("/");
      const step = parseInt(stepStr);
      if (isNaN(step) || step <= 0) throw new Error("invalid step");
      let lo = min, hi = max;
      if (range !== "*") {
        if (range.includes("-")) {
          const [a, b] = range.split("-").map(Number);
          lo = a; hi = b;
        } else {
          lo = parseInt(range);
          hi = max;
        }
      }
      for (let i = lo; i <= hi; i += step) {
        if (i >= min && i <= max) result.add(i);
      }
    } else if (part.includes("-")) {
      const [a, b] = part.split("-").map(Number);
      for (let i = a; i <= b; i++) {
        if (i >= min && i <= max) result.add(i);
      }
    } else {
      const n = parseInt(part);
      if (!isNaN(n) && n >= min && n <= max) result.add(n);
    }
  }
  return Array.from(result).sort((a, b) => a - b);
}

function describeCron(parts: CronParts): string {
  const m = parts.minute, h = parts.hour, dom = parts.dayOfMonth, mon = parts.month, dow = parts.dayOfWeek;

  // Common patterns
  if (m.length === 60 && h.length === 24 && dom.length === 31 && mon.length === 12 && dow.length === 7) {
    return "Every minute";
  }
  if (m.length === 1 && h.length === 24) {
    return `Every hour at minute ${m[0]}`;
  }
  if (m.length === 1 && h.length === 1) {
    return `Every day at ${String(h[0]).padStart(2, "0")}:${String(m[0]).padStart(2, "0")}`;
  }
  if (m.length === 1 && h.length === 1 && dow.length === 1) {
    return `Every ${DAY_NAMES[dow[0]]} at ${String(h[0]).padStart(2, "0")}:${String(m[0]).padStart(2, "0")}`;
  }
  if (m.length === 1 && h.length === 1 && dom.length === 1 && mon.length === 1) {
    return `Every ${MONTH_NAMES[mon[0] - 1]} ${dom[0]} at ${String(h[0]).padStart(2, "0")}:${String(m[0]).padStart(2, "0")}`;
  }

  // Generic description
  const parts_str = [];
  if (m.length < 60) parts_str.push(`minute: ${m.join(",")}`);
  if (h.length < 24) parts_str.push(`hour: ${h.join(",")}`);
  if (dom.length < 31) parts_str.push(`day-of-month: ${dom.join(",")}`);
  if (mon.length < 12) parts_str.push(`month: ${mon.map((m) => MONTH_NAMES[m - 1]).join(",")}`);
  if (dow.length < 7) parts_str.push(`day-of-week: ${dow.map((d) => DAY_NAMES[d]).join(",")}`);
  return `Runs when: ${parts_str.join(" | ")}`;
}

function computeNextRun(parts: CronParts, from: Date): Date | null {
  // Brute-force search (next 1 year max)
  const next = new Date(from);
  next.setSeconds(0, 0);
  next.setMinutes(next.getMinutes() + 1);

  for (let i = 0; i < 525600; i++) { // up to 1 year in minutes
    if (
      parts.minute.includes(next.getMinutes()) &&
      parts.hour.includes(next.getHours()) &&
      parts.dayOfMonth.includes(next.getDate()) &&
      parts.month.includes(next.getMonth() + 1) &&
      parts.dayOfWeek.includes(next.getDay())
    ) {
      return next;
    }
    next.setMinutes(next.getMinutes() + 1);
  }
  return null;
}

export const tool = {
  name: "cron_utilities",
  description: "أدوات cron — parse, validate, describe, next_run, schedule",
  execute,
};

export default tool;
