/**
 * Tool: regex_tester.ts
 * Category: utility
 * Description: اختبار regular expressions — match, extract, replace, validate.
 *
 * Dependencies: none
 */

export interface RegexToolInput {
  operation: "match" | "extract" | "replace" | "split" | "validate" | "explain";
  pattern: string;
  text: string;
  flags?: string;
  replacement?: string;
}

export async function execute(input: RegexToolInput): Promise<any> {
  const { operation, pattern, text, flags = "g", replacement = "" } = input;

  if (!pattern) return { success: false, error: "pattern required" };
  if (!text && operation !== "validate") return { success: false, error: "text required" };

  let re: RegExp;
  try {
    re = new RegExp(pattern, flags);
  } catch (e: any) {
    return { success: false, error: `invalid regex: ${e.message}` };
  }

  if (operation === "match") {
    const matches: any[] = [];
    let m: RegExpExecArray | null;
    const globalRe = new RegExp(pattern, flags.includes("g") ? flags : flags + "g");
    let count = 0;
    while ((m = globalRe.exec(text)) !== null && count < 100) {
      matches.push({
        match: m[0],
        index: m.index,
        groups: m.slice(1),
        named_groups: (m as any).groups || {},
      });
      if (m.index === globalRe.lastIndex) globalRe.lastIndex++;
      count++;
    }
    return {
      success: true,
      matches,
      count: matches.length,
      tested_pattern: pattern,
      flags,
    };
  }

  if (operation === "extract") {
    const matches = text.match(re) || [];
    return {
      success: true,
      extracted: [...new Set(matches)],
      count: matches.length,
      unique_count: new Set(matches).size,
    };
  }

  if (operation === "replace") {
    let count = 0;
    const globalRe = new RegExp(pattern, flags.includes("g") ? flags : flags + "g");
    const result = text.replace(globalRe, () => {
      count++;
      return replacement;
    });
    return { success: true, result, replacements_made: count };
  }

  if (operation === "split") {
    const parts = text.split(re);
    return { success: true, parts, count: parts.length };
  }

  if (operation === "validate") {
    return {
      success: true,
      valid: re instanceof RegExp,
      pattern,
      flags,
      source: re.source,
    };
  }

  if (operation === "explain") {
    // Simple regex explanation (basic patterns)
    const explanations: string[] = [];
    let p = pattern;
    if (p.includes("^")) explanations.push("^ → بداية النص");
    if (p.includes("$")) explanations.push("$ → نهاية النص");
    if (/\\d/.test(p)) explanations.push("\\d → رقم (0-9)");
    if (/\\w/.test(p)) explanations.push("\\w → حرف أو رقم أو _");
    if (/\\s/.test(p)) explanations.push("\\s → مسافة فارغة");
    if (/\[.*\]/.test(p)) explanations.push("[...] → مجموعة أحرف");
    if (/\+/.test(p)) explanations.push("+ → مرة أو أكثر");
    if (/\*/.test(p)) explanations.push("* → صفر أو أكثر");
    if (/\?[^?]/.test(p)) explanations.push("? → صفر أو مرة واحدة");
    if (/\{(\d+),?(\d*)\}/.test(p)) explanations.push("{n,m} → عدد محدد من المرات");
    if (/\(.*\)/.test(p)) explanations.push("(...) → مجموعة التقاط");
    return {
      success: true,
      pattern,
      explanations: explanations.length > 0 ? explanations : ["No standard patterns recognized"],
      flags: flags || "none",
      note: flags.includes("g") ? "g: global (all matches)" : flags.includes("i") ? "i: case-insensitive" : "",
    };
  }

  return { success: false, error: `unknown operation: ${operation}` };
}

export const tool = {
  name: "regex_tester",
  description: "اختبار regular expressions — match, extract, replace, split, explain",
  execute,
};

export default tool;
