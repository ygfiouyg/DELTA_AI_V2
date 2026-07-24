/**
 * PDF Sanitizer — Hardcoded String Sanitization Middleware
 * ═══════════════════════════════════════════════════════════════════════
 *
 * V.58: CRITICAL BACKEND FIX — enforced sanitizer RIGHT BEFORE HTML-to-PDF.
 *
 * Prompt-based rules alone cannot stop LLM variable/metadata leaks.
 * This module is the FINAL hardcoded gate before the render engine.
 *
 * Usage:
 *   import { forceCleanPDFContent } from './lib/pdf-sanitizer';
 *   const sanitized = forceCleanPDFContent(rawLLMOutput);
 *   const pdfBuffer = await renderToPdfEngine(sanitized);
 *
 * This runs AFTER any LLM/AI sanitization and BEFORE Playwright/Puppeteer.
 * It is non-negotiable — even if the LLM "thinks" the text is clean, this
 * function strips every known leak pattern with hardcoded regex.
 */

export function forceCleanPDFContent(htmlOrText: string): string {
  if (!htmlOrText) return '';

  return htmlOrText
    // 1. Strip raw reference IDs
    .replace(/\[DELTA_PDF_REF:[^\]]+\]/g, '')
    // 2. Strip repeated zero artifacts (e.g., 0000 0000 0000)
    .replace(/\b0{4,}(\s+0{4,})*\b/g, '')
    // 3. Strip corrupted variable injections (e.g., '000 pdf', '1000 pdf', 'pdf 000000')
    .replace(/\b\d*\s*pdf\s*\d*\b/gi, '')
    // 4. Clean duplicate file extensions
    .replace(/(\.pdf){2,}/gi, '.pdf')
    .replace(/(\.docx){2,}/gi, '.docx')
    .replace(/(\.txt){2,}/gi, '.txt')
    // 5. Decode unescaped Unicode characters (e.g., \u26A1)
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => {
      try {
        return String.fromCharCode(parseInt(hex, 16));
      } catch {
        return '';
      }
    })
    // 5b. Decode surrogate pairs (\uXXXX\uYYYY for emoji)
    .replace(/\\u([0-9a-fA-F]{4})\\u([0-9a-fA-F]{4})/g, (_, high, low) => {
      try {
        const h = parseInt(high, 16);
        const l = parseInt(low, 16);
        if (h >= 0xd800 && h <= 0xdbff && l >= 0xdc00 && l <= 0xdfff) {
          const codePoint = ((h - 0xd800) << 10) + (l - 0xdc00) + 0x10000;
          return String.fromCodePoint(codePoint);
        }
      } catch {
        // fallthrough
      }
      return '';
    })
    // 6. Remove empty broken markdown syntax left behind
    .replace(/\*\*\s*\*\*/g, '')
    // 7. V.58 bonus: strip CID artifacts that survive PDF text extraction
    .replace(/\(cid:\d+\)/gi, '')
    // 8. V.58 bonus: strip raw null bytes
    .replace(/\u0000+/g, '')
    // 9. V.58 bonus: strip long hex dumps (8+ hex chars with no spaces)
    .replace(/\b[0-9a-f]{8,}\b/gi, (match) => {
      // Only strip if it looks like a hex dump (not a real word)
      if (/^[0-9a-f]+$/i.test(match)) return '';
      return match;
    })
    // 10. V.58 bonus: strip UUIDs leaking into text
    .replace(/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi, '')
    // 11. V.58 bonus: strip base64 fragments (40+ alphanumeric chars)
    .replace(/\b[A-Za-z0-9+/]{40,}={0,2}\b/g, '')
    // 12. V.58 bonus: strip raw file paths
    .replace(/\/(?:upload|tmp|home|app|var|usr|opt|Users)[^\s"'<)]*/gi, '')
    // 13. V.58 bonus: collapse whitespace left behind by stripping
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Sanitize an entire HTML document (preserves tags, cleans text nodes).
 * Use this when you have a full HTML string and want to clean only the
 * text content without breaking the HTML structure.
 */
export function forceCleanHTMLDocument(html: string): string {
  if (!html) return '';

  // Strategy: clean text inside > < boundaries (text nodes between tags)
  // This preserves <tags>, attributes, and CSS while cleaning visible text.
  return html.replace(/>([^<]+)</g, (match, textContent) => {
    const cleaned = forceCleanPDFContent(textContent);
    return `>${cleaned}<`;
  });
}

/**
 * Aggressive title sanitizer for PDF titles and headings.
 * Removes ALL non-printable chars and known garbage patterns.
 */
export function forceCleanTitle(title: string): string {
  if (!title) return '';
  let cleaned = forceCleanPDFContent(title);
  // Remove file extensions entirely from titles
  cleaned = cleaned.replace(/\.(pdf|docx?|txt|html?|csv|xlsx?)$/gi, '');
  // Remove "(N)" patterns
  cleaned = cleaned.replace(/\s*\(\d+\)\s*/g, ' ');
  // Collapse whitespace
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  return cleaned;
}
