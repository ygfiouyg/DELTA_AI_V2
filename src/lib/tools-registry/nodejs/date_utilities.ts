/**
 * Tool: date_utilities.ts
 * Category: utility
 * Package: none (pure TypeScript, uses Intl + Date)
 * Description: أدوات تواريخ شاملة — format, parse, diff, add, timezone convert.
 *
 * Dependencies: none
 *
 * Input:
 *   {
 *     "operation": "format" | "parse" | "diff" | "add" | "timezone" | "now" | "isValid",
 *     "date": "2025-01-15" | ISO string | timestamp,
 *     "format": "YYYY-MM-DD" | "human" | "relative",
 *     "timezone": "Africa/Cairo",
 *     "amount": 5,
 *     "unit": "days" | "months" | "years" | "hours" | "minutes"
 *   }
 *
 * Output:
 *   { success: true, result: "...", iso: "...", timestamp: 1234567890 }
 */

export interface DateToolInput {
  operation: "format" | "parse" | "diff" | "add" | "timezone" | "now" | "isValid" | "weekday" | "startOf" | "endOf";
  date?: string | number;
  format?: string;
  timezone?: string;
  amount?: number;
  unit?: "seconds" | "minutes" | "hours" | "days" | "weeks" | "months" | "years";
  date2?: string | number;
  locale?: string;
}

export interface DateToolOutput {
  success: boolean;
  result?: string;
  iso?: string;
  timestamp?: number;
  error?: string;
  [key: string]: any;
}

function toDate(input?: string | number): Date | null {
  if (!input) return new Date();
  if (typeof input === "number") return new Date(input);
  // Try ISO first
  const d = new Date(input);
  if (!isNaN(d.getTime())) return d;
  // Try common formats
  const m = input.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:[ T](\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/);
  if (m) {
    return new Date(
      parseInt(m[1]),
      parseInt(m[2]) - 1,
      parseInt(m[3]),
      parseInt(m[4] || "0"),
      parseInt(m[5] || "0"),
      parseInt(m[6] || "0")
    );
  }
  return null;
}

function formatDate(d: Date, format: string, timezone?: string): string {
  if (format === "human") {
    return d.toLocaleDateString("en-US", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
      timeZone: timezone,
    });
  }
  if (format === "relative") {
    const now = Date.now();
    const diff = d.getTime() - now;
    const absDiff = Math.abs(diff);
    const minute = 60_000, hour = 60 * minute, day = 24 * hour, week = 7 * day, month = 30 * day, year = 365 * day;
    let unit: string, value: number;
    if (absDiff < hour) { unit = "minute"; value = Math.round(absDiff / minute); }
    else if (absDiff < day) { unit = "hour"; value = Math.round(absDiff / hour); }
    else if (absDiff < week) { unit = "day"; value = Math.round(absDiff / day); }
    else if (absDiff < month) { unit = "week"; value = Math.round(absDiff / week); }
    else if (absDiff < year) { unit = "month"; value = Math.round(absDiff / month); }
    else { unit = "year"; value = Math.round(absDiff / year); }
    const dir = diff > 0 ? "in " : "";
    const suf = diff > 0 ? "" : " ago";
    return `${dir}${value} ${unit}${value !== 1 ? "s" : ""}${suf}`;
  }
  if (format === "YYYY-MM-DD") {
    return d.toISOString().slice(0, 10);
  }
  if (format === "YYYY-MM-DD HH:mm:ss") {
    return d.toISOString().slice(0, 19).replace("T", " ");
  }
  if (format === "ISO") {
    return d.toISOString();
  }
  if (format === "unix") {
    return String(Math.floor(d.getTime() / 1000));
  }
  // Default: full localized
  return d.toLocaleString("en-US", { timeZone: timezone });
}

export async function execute(input: DateToolInput): Promise<DateToolOutput> {
  const { operation, date, format = "human", timezone, amount = 0, unit = "days", date2, locale = "en-US" } = input;

  if (operation === "now") {
    const d = new Date();
    return {
      success: true,
      iso: d.toISOString(),
      timestamp: d.getTime(),
      result: formatDate(d, format, timezone),
      timezone: timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  }

  if (operation === "isValid") {
    const d = toDate(date);
    return { success: true, valid: d !== null && !isNaN(d.getTime()), input: String(date) };
  }

  const d = toDate(date);
  if (!d || isNaN(d.getTime())) {
    return { success: false, error: `invalid date: ${date}` };
  }

  if (operation === "format") {
    return {
      success: true,
      result: formatDate(d, format, timezone),
      iso: d.toISOString(),
      timestamp: d.getTime(),
    };
  }

  if (operation === "parse") {
    return {
      success: true,
      iso: d.toISOString(),
      timestamp: d.getTime(),
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      day: d.getDate(),
      hour: d.getHours(),
      minute: d.getMinutes(),
      second: d.getSeconds(),
      weekday: d.toLocaleDateString(locale, { weekday: "long" }),
    };
  }

  if (operation === "diff") {
    const d2 = toDate(date2);
    if (!d2) return { success: false, error: "date2 required for diff" };
    const diffMs = d2.getTime() - d.getTime();
    const abs = Math.abs(diffMs);
    return {
      success: true,
      milliseconds: diffMs,
      seconds: Math.round(diffMs / 1000),
      minutes: Math.round(diffMs / 60_000),
      hours: Math.round(diffMs / 3_600_000),
      days: Math.round(diffMs / 86_400_000),
      weeks: Math.round(diffMs / 604_800_000),
      direction: diffMs > 0 ? "future" : diffMs < 0 ? "past" : "same",
    };
  }

  if (operation === "add") {
    const newDate = new Date(d);
    const u = unit;
    if (u === "seconds") newDate.setSeconds(newDate.getSeconds() + amount);
    else if (u === "minutes") newDate.setMinutes(newDate.getMinutes() + amount);
    else if (u === "hours") newDate.setHours(newDate.getHours() + amount);
    else if (u === "days") newDate.setDate(newDate.getDate() + amount);
    else if (u === "weeks") newDate.setDate(newDate.getDate() + amount * 7);
    else if (u === "months") newDate.setMonth(newDate.getMonth() + amount);
    else if (u === "years") newDate.setFullYear(newDate.getFullYear() + amount);
    return {
      success: true,
      original: d.toISOString(),
      result: newDate.toISOString(),
      timestamp: newDate.getTime(),
      added: `${amount} ${unit}`,
    };
  }

  if (operation === "timezone") {
    try {
      const localized = d.toLocaleString("en-US", { timeZone: timezone });
      return {
        success: true,
        original_iso: d.toISOString(),
        timezone,
        localized,
        timestamp: d.getTime(),
      };
    } catch (e: any) {
      return { success: false, error: `invalid timezone: ${timezone}` };
    }
  }

  if (operation === "weekday") {
    return {
      success: true,
      weekday: d.toLocaleDateString(locale, { weekday: "long" }),
      weekday_short: d.toLocaleDateString(locale, { weekday: "short" }),
      day_of_week: d.getDay(),
      is_weekend: d.getDay() === 0 || d.getDay() === 6,
    };
  }

  if (operation === "startOf" || operation === "endOf") {
    const unit_start = input.unit || "day";
    const newDate = new Date(d);
    if (unit_start === "day") {
      if (operation === "startOf") {
        newDate.setHours(0, 0, 0, 0);
      } else {
        newDate.setHours(23, 59, 59, 999);
      }
    } else if (unit_start === "month") {
      if (operation === "startOf") {
        newDate.setDate(1);
        newDate.setHours(0, 0, 0, 0);
      } else {
        newDate.setMonth(newDate.getMonth() + 1, 0);
        newDate.setHours(23, 59, 59, 999);
      }
    } else if (unit_start === "year") {
      if (operation === "startOf") {
        newDate.setMonth(0, 1);
        newDate.setHours(0, 0, 0, 0);
      } else {
        newDate.setMonth(11, 31);
        newDate.setHours(23, 59, 59, 999);
      }
    }
    return { success: true, iso: newDate.toISOString(), timestamp: newDate.getTime() };
  }

  return { success: false, error: `unknown operation: ${operation}` };
}

export const tool = {
  name: "date_utilities",
  description: "أدوات تواريخ شاملة — format, parse, diff, add, timezone convert",
  execute,
};

export default tool;
