/**
 * Tool: text_utilities.ts
 * Category: utility
 * Description: أدوات نصوص شاملة — case conversion, count, extract, replace, slugify.
 *
 * Dependencies: none
 *
 * Input:
 *   {
 *     "operation": "uppercase" | "lowercase" | "title" | "camel" | "snake" | "kebab" |
 *                   "word_count" | "char_count" | "line_count" | "extract_emails" |
 *                   "extract_urls" | "extract_phones" | "slugify" | "reverse" |
 *                   "truncate" | "strip_html" | "encode_url" | "decode_url",
 *     "text": "...",
 *     "params": {...}
 *   }
 */

export interface TextToolInput {
  operation: string;
  text: string;
  params?: {
    length?: number;
    suffix?: string;
    separator?: string;
  };
}

export interface TextToolOutput {
  success: boolean;
  result?: string | string[] | object;
  error?: string;
  [key: string]: any;
}

export async function execute(input: TextToolInput): Promise<TextToolOutput> {
  const { operation, text = "", params = {} } = input;

  if (operation === "uppercase") return { success: true, result: text.toUpperCase() };
  if (operation === "lowercase") return { success: true, result: text.toLowerCase() };
  if (operation === "title") {
    return { success: true, result: text.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()) };
  }
  if (operation === "camel") {
    const words = text.toLowerCase().split(/[^a-zA-Z0-9]+/).filter(Boolean);
    const result = words.map((w, i) => i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)).join("");
    return { success: true, result };
  }
  if (operation === "snake") {
    return { success: true, result: text.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_|_$/g, "") };
  }
  if (operation === "kebab") {
    return { success: true, result: text.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "") };
  }
  if (operation === "word_count") {
    const words = text.trim().split(/\s+/).filter(Boolean);
    return { success: true, count: words.length };
  }
  if (operation === "char_count") {
    return {
      success: true,
      count: text.length,
      count_no_spaces: text.replace(/\s/g, "").length,
      count_letters: (text.match(/[a-zA-Z\u0600-\u06FF]/g) || []).length,
      count_digits: (text.match(/\d/g) || []).length,
    };
  }
  if (operation === "line_count") {
    return { success: true, count: text.split(/\n/).length };
  }
  if (operation === "extract_emails") {
    const emails = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
    return { success: true, emails: [...new Set(emails)], count: emails.length };
  }
  if (operation === "extract_urls") {
    const urls = text.match(/https?:\/\/[^\s<>"']+/g) || [];
    return { success: true, urls: [...new Set(urls)], count: urls.length };
  }
  if (operation === "extract_phones") {
    // International + local phone patterns
    const phones = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/g) || [];
    return { success: true, phones, count: phones.length };
  }
  if (operation === "slugify") {
    const slug = text
      .toString()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return { success: true, slug };
  }
  if (operation === "reverse") {
    return { success: true, result: text.split("").reverse().join("") };
  }
  if (operation === "truncate") {
    const len = params.length || 100;
    const suffix = params.suffix || "...";
    if (text.length <= len) return { success: true, result: text };
    return { success: true, result: text.slice(0, len - suffix.length) + suffix };
  }
  if (operation === "strip_html") {
    return {
      success: true,
      result: text
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .trim(),
    };
  }
  if (operation === "encode_url") {
    try {
      return { success: true, result: encodeURIComponent(text) };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }
  if (operation === "decode_url") {
    try {
      return { success: true, result: decodeURIComponent(text) };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }
  if (operation === "stats") {
    const words = text.trim().split(/\s+/).filter(Boolean);
    const sentences = text.split(/[.!?؟]+/).filter((s) => s.trim().length > 0);
    const paragraphs = text.split(/\n\n+/).filter((p) => p.trim().length > 0);
    const readingTime = Math.max(1, Math.round(words.length / 200));
    return {
      success: true,
      characters: text.length,
      characters_no_spaces: text.replace(/\s/g, "").length,
      words: words.length,
      sentences: sentences.length,
      paragraphs: paragraphs.length,
      reading_time_minutes: readingTime,
      avg_word_length: words.length ? (words.reduce((a, w) => a + w.length, 0) / words.length).toFixed(2) : 0,
    };
  }
  if (operation === "find_replace") {
    const find = params.find || "";
    const replace = params.replace || "";
    const useRegex = params.regex || false;
    try {
      if (useRegex) {
        const re = new RegExp(find, "g");
        const matches = (text.match(re) || []).length;
        return { success: true, result: text.replace(re, replace), matches_replaced: matches };
      } else {
        const parts = text.split(find);
        return { success: true, result: parts.join(replace), matches_replaced: parts.length - 1 };
      }
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  return { success: false, error: `unknown operation: ${operation}` };
}

export const tool = {
  name: "text_utilities",
  description: "أدوات نصوص شاملة — case, count, extract, slugify, replace",
  execute,
};

export default tool;
