/**
 * Pre-Render Sanitizer — V.57 Master Sanitization Pipeline
 * ═══════════════════════════════════════════════════════════════════════
 *
 * Eliminates ALL data corruption, string leaks, and garbage output from
 * LLM-generated text BEFORE it reaches the HTML renderer.
 *
 * Sanitization stages:
 * 1. Strip system references: [DELTA_PDF_REF:...], [DELTA_IMAGE:...], etc.
 * 2. Strip zero string artifacts: 0000 0000, 00000000
 * 3. Strip raw file variable injections: "000 pdf", ".pdf.pdf", "Lec 2.pdf"
 * 4. Unescape Unicode literals: \u26A1 → ⚡, \u2605 → ★
 * 5. Strip hex dumps and CID artifacts: (cid:0), hex strings
 * 6. Normalize whitespace and dedupe consecutive lines
 * 7. Clean academic titles from raw filenames
 */

// ─── Stage 1: Strip System References ──────────────────────────────────────

/** Remove [DELTA_PDF_REF:...], [DELTA_IMAGE:...], [DELTA_DOCX:...] markers */
function stripSystemRefs(text: string): string {
  return text
    // [DELTA_PDF_REF:fileId:filename:size]
    .replace(/\[DELTA_PDF_REF:[^\]]*\]/gi, '')
    // [DELTA_IMAGE:...]
    .replace(/\[DELTA_IMAGE:[^\]]*\]/gi, '')
    // [DELTA_DOCX:...]
    .replace(/\[DELTA_DOCX:[^\]]*\]/gi, '')
    // [DELTA_PDF:...] (inline base64 markers)
    .replace(/\[DELTA_PDF:[^\]]*\]/gi, '')
    // [📷 صورة: ...]
    .replace(/\[📷[^\]]*\]/g, '')
    // [📄 PDF: ...]
    .replace(/\[📄[^\]]*\]/g, '')
    // Any remaining bracketed system ref
    .replace(/\[DELTA_[A-Z_]+:[^\]]*\]/gi, '');
}

// ─── Stage 2: Strip Zero String Artifacts ──────────────────────────────────

/** Remove 0000 0000 patterns (null byte artifacts from PDF extraction) */
function stripZeroArtifacts(text: string): string {
  return text
    // Sequences of 4+ zeros separated by spaces: 0000 0000 0000
    .replace(/\b0{4,}(\s+0{4,})*\b/g, ' ')
    // Raw null byte sequences
    .replace(/\u0000+/g, ' ')
    // Long runs of zeros without spaces: 00000000
    .replace(/0{8,}/g, ' ')
    // CID artifacts: (cid:0), (cid:123)
    .replace(/\(cid:\d+\)/gi, '')
    // Clean up double spaces left behind
    .replace(/[ \t]{2,}/g, ' ');
}

// ─── Stage 3: Strip Raw File Variable Injections ───────────────────────────

/** Remove "000 pdf", ".pdf.pdf", raw filename leaks in body text */
function stripFileLeaks(text: string): string {
  return text
    // Pattern: number followed by "pdf" (e.g., "000 pdf", "2 pdf")
    .replace(/\b\d+\s*pdf\b/gi, '')
    // Double extensions: .pdf.pdf, .docx.docx
    .replace(/\.pdf\.pdf/gi, '.pdf')
    .replace(/\.docx\.docx/gi, '.docx')
    .replace(/\.txt\.txt/gi, '.txt')
    // Raw file paths: /uploads/..., /tmp/...
    .replace(/\/(upload|tmp|home|app|var|usr|opt|Users)[^\s}]*/gi, '')
    // UUIDs leaking into text
    .replace(/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi, '')
    // Base64 fragments (long alphanumeric strings >40 chars)
    .replace(/\b[A-Za-z0-9+/]{40,}={0,2}\b/g, '')
    // Hex dumps: 4d5a4001, etc.
    .replace(/\b[0-9a-f]{8,}\b/gi, (match) => {
      // Only remove if it looks like a hex dump (no real word is 8+ hex chars)
      if (/^[0-9a-f]+$/i.test(match) && match.length >= 8) return '';
      return match;
    });
}

// ─── Stage 4: Unicode Unescaping ───────────────────────────────────────────

/** Convert \u26A1 → ⚡, \u2605 → ★, etc. */
function unescapeUnicode(text: string): string {
  return text
    // \uXXXX patterns (4 hex digits)
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => {
      try {
        return String.fromCharCode(parseInt(hex, 16));
      } catch {
        return '';
      }
    })
    // \uXXXX\uYYYY surrogate pairs (emoji)
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
    // \xNN patterns
    .replace(/\\x([0-9a-fA-F]{2})/g, (_, hex) => {
      try {
        return String.fromCharCode(parseInt(hex, 16));
      } catch {
        return '';
      }
    });
}

// ─── Stage 5: Strip Hex/CID/Encoding Artifacts ─────────────────────────────

/** Remove residual encoding artifacts */
function stripEncodingArtifacts(text: string): string {
  return text
    // FontBBox artifacts
    .replace(/FontBBox[^"']*/gi, '')
    // Raw escaped backslashes before quotes
    .replace(/\\+"/g, '"')
    // Markdown code fence leaks
    .replace(/```[a-z]*\n?/gi, '')
    // Stray JSON brackets
    .replace(/^\s*[\{\[]\s*$|\s*[\}\]]\s*$/gm, '');
}

// ─── Stage 6: Normalize & Dedupe ───────────────────────────────────────────

/** Normalize whitespace and remove consecutive duplicate lines/paragraphs */
function normalizeAndDedupe(text: string): string {
  const lines = text.split('\n');
  const seen = new Set<string>();
  const result: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      // Keep single blank lines for paragraph separation
      if (result.length > 0 && result[result.length - 1] !== '') {
        result.push('');
      }
      continue;
    }

    // Dedupe: check if this line is identical to the previous (case-insensitive)
    const key = trimmed.toLowerCase().replace(/\s+/g, ' ');
    if (seen.has(key) && result.length > 0) {
      const prevTrimmed = result[result.length - 1].trim().toLowerCase().replace(/\s+/g, ' ');
      if (prevTrimmed === key) {
        // Skip duplicate consecutive line
        continue;
      }
    }
    seen.add(key);
    result.push(trimmed);
  }

  // Join and clean up excessive blank lines
  return result.join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// ─── Stage 7: Clean Academic Titles ────────────────────────────────────────

/**
 * Extract a clean academic topic title from a raw filename.
 * "Lec 2.pdf (8).pdf" → "Lecture 2"
 * "Chapter 3 - NMR Spectroscopy.pdf" → "NMR Spectroscopy"
 */
export function cleanAcademicTitle(filename: string): string {
  let title = filename;

  // Remove file extensions (handle double extensions)
  title = title.replace(/\.\w+$/i, '').replace(/\.\w+$/i, '');

  // Remove common prefixes: Lec, Lecture, Chapter, Ch, Unit, Mod
  const prefixMatch = title.match(/^(?:lec(?:ture)?|ch(?:apter)?|unit|mod(?:ule)?|part|محاضرة|فصل|وحدة|جزء)\s*(\d+)?\s*[-:—]?\s*(.*)/i);
  if (prefixMatch) {
    const num = prefixMatch[1];
    const rest = prefixMatch[2]?.trim();
    if (rest && rest.length > 2) {
      // Use the descriptive part
      title = rest;
    } else if (num) {
      title = `Lecture ${num}`;
    }
  }

  // Remove parenthetical notes: (8), (1), (copy)
  title = title.replace(/\s*\([^)]*\)\s*/g, ' ').trim();

  // Remove trailing/leading separators
  title = title.replace(/^[-—:\s]+|[-—:\s]+$/g, '').trim();

  // Capitalize first letter
  if (title.length > 0) {
    title = title.charAt(0).toUpperCase() + title.slice(1);
  }

  return title || 'Document';
}

// ─── Main Sanitizer Entry Point ─────────────────────────────────────────────

/**
 * Master sanitization pipeline — passes ALL text through every stage.
 * Use this on LLM output BEFORE it reaches the HTML renderer.
 */
export function sanitizeRenderText(text: string): string {
  if (!text || typeof text !== 'string') return '';

  let result = text;

  // Stage 1: Strip system references
  result = stripSystemRefs(result);

  // Stage 2: Strip zero artifacts
  result = stripZeroArtifacts(result);

  // Stage 3: Strip file leaks
  result = stripFileLeaks(result);

  // Stage 4: Unicode unescaping
  result = unescapeUnicode(result);

  // Stage 5: Strip encoding artifacts
  result = stripEncodingArtifacts(result);

  // Stage 6: Normalize & dedupe
  result = normalizeAndDedupe(result);

  return result;
}

/**
 * Sanitize a title for use as a document title or section heading.
 * More aggressive than body text sanitization.
 */
export function sanitizeTitle(text: string): string {
  if (!text) return '';
  let result = sanitizeRenderText(text);
  // Remove any remaining non-printable chars
  result = result.replace(/[^\x20-\x7E\u0600-\u06FF\u0080-\u024F\u2000-\u206F\u2600-\u27BF]/g, '');
  // Collapse whitespace
  result = result.replace(/\s+/g, ' ').trim();
  return result;
}

/**
 * Sanitize a filename for display.
 * "Lec 2.pdf (8).pdf" → "Lec 2"
 */
export function sanitizeFileName(filename: string): string {
  if (!filename) return 'document';
  return cleanAcademicTitle(filename);
}
