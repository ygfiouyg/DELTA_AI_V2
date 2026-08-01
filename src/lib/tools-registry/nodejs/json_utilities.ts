/**
 * Tool: json_utilities.ts
 * Category: utility
 * Description: أدوات JSON شاملة — format, validate, minify, query (JSONPath), diff, merge, transform.
 *
 * Dependencies: none
 */

export interface JsonToolInput {
  operation: "format" | "minify" | "validate" | "query" | "flatten" | "unflatten" | "merge" | "diff" | "keys" | "size" | "convert_csv";
  json?: string | object;
  json2?: string | object;
  params?: {
    indent?: number;
    path?: string; // dot-notation: a.b.c
  };
}

export async function execute(input: JsonToolInput): Promise<any> {
  const { operation, params = {} } = input;

  // Parse input JSON
  let parsed: any;
  if (typeof input.json === "string") {
    try {
      parsed = JSON.parse(input.json);
    } catch (e: any) {
      if (operation === "validate") {
        return { success: false, valid: false, error: e.message };
      }
      return { success: false, error: `invalid JSON: ${e.message}` };
    }
  } else {
    parsed = input.json;
  }

  if (operation === "validate") {
    return { success: true, valid: true };
  }

  if (operation === "format") {
    const indent = params.indent || 2;
    try {
      return { success: true, result: JSON.stringify(parsed, null, indent) };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  if (operation === "minify") {
    try {
      return { success: true, result: JSON.stringify(parsed), size: JSON.stringify(parsed).length };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  if (operation === "size") {
    const str = JSON.stringify(parsed);
    return {
      success: true,
      bytes: Buffer.byteLength(str, "utf8"),
      characters: str.length,
      keys_count: _countKeys(parsed),
    };
  }

  if (operation === "keys") {
    return { success: true, keys: _getAllKeys(parsed) };
  }

  if (operation === "query") {
    const path = params.path || "";
    if (!path) return { success: false, error: "path required for query" };
    const result = _queryPath(parsed, path);
    return { success: true, path, result };
  }

  if (operation === "flatten") {
    return { success: true, result: _flatten(parsed) };
  }

  if (operation === "unflatten") {
    return { success: true, result: _unflatten(parsed) };
  }

  if (operation === "merge") {
    let parsed2: any;
    if (typeof input.json2 === "string") {
      try {
        parsed2 = JSON.parse(input.json2);
      } catch (e: any) {
        return { success: false, error: `invalid json2: ${e.message}` };
      }
    } else {
      parsed2 = input.json2;
    }
    return { success: true, result: _deepMerge(parsed, parsed2) };
  }

  if (operation === "diff") {
    let parsed2: any;
    if (typeof input.json2 === "string") {
      try {
        parsed2 = JSON.parse(input.json2);
      } catch (e: any) {
        return { success: false, error: `invalid json2: ${e.message}` };
      }
    } else {
      parsed2 = input.json2;
    }
    const diffs = _diff(parsed, parsed2, "");
    return { success: true, diffs, diff_count: diffs.length };
  }

  if (operation === "convert_csv") {
    if (!Array.isArray(parsed)) {
      return { success: false, error: "JSON must be an array of objects for CSV" };
    }
    if (parsed.length === 0) {
      return { success: true, csv: "" };
    }
    const headers = Object.keys(parsed[0]);
    const rows = parsed.map((obj) => headers.map((h) => {
      const v = obj[h];
      if (v === null || v === undefined) return "";
      const s = typeof v === "object" ? JSON.stringify(v) : String(v);
      return s.includes(",") || s.includes('"') || s.includes("\n") ? `"${s.replace(/"/g, '""')}"` : s;
    }).join(","));
    return { success: true, csv: [headers.join(","), ...rows].join("\n") };
  }

  return { success: false, error: `unknown operation: ${operation}` };
}

function _countKeys(obj: any): number {
  if (typeof obj !== "object" || obj === null) return 0;
  if (Array.isArray(obj)) return obj.reduce((acc, item) => acc + _countKeys(item), 0);
  return Object.keys(obj).length + Object.values(obj).reduce((acc: number, v: any) => acc + _countKeys(v), 0);
}

function _getAllKeys(obj: any, prefix = ""): string[] {
  if (typeof obj !== "object" || obj === null) return [];
  if (Array.isArray(obj)) {
    return obj.length > 0 ? _getAllKeys(obj[0], prefix + "[0]") : [];
  }
  const keys: string[] = [];
  for (const [k, v] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${k}` : k;
    keys.push(fullKey);
    if (typeof v === "object" && v !== null) {
      keys.push(..._getAllKeys(v, fullKey));
    }
  }
  return keys;
}

function _queryPath(obj: any, path: string): any {
  const parts = path.split(".").filter(Boolean);
  let current = obj;
  for (const part of parts) {
    if (current === null || current === undefined) return undefined;
    const arrMatch = part.match(/^([^\]]+)\[(\d+)\]$/);
    if (arrMatch) {
      current = current[arrMatch[1]]?.[parseInt(arrMatch[2])];
    } else {
      current = current[part];
    }
  }
  return current;
}

function _flatten(obj: any, prefix = ""): Record<string, any> {
  const result: Record<string, any> = {};
  if (typeof obj !== "object" || obj === null) {
    result[prefix] = obj;
    return result;
  }
  if (Array.isArray(obj)) {
    obj.forEach((item, i) => {
      Object.assign(result, _flatten(item, prefix ? `${prefix}[${i}]` : `[${i}]`));
    });
  } else {
    for (const [k, v] of Object.entries(obj)) {
      const newKey = prefix ? `${prefix}.${k}` : k;
      if (typeof v === "object" && v !== null) {
        Object.assign(result, _flatten(v, newKey));
      } else {
        result[newKey] = v;
      }
    }
  }
  return result;
}

function _unflatten(obj: Record<string, any>): any {
  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const parts = key.split(".");
    let current = result;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      const arrMatch = part.match(/^([^\]]+)\[(\d+)\]$/);
      if (arrMatch) {
        const arrKey = arrMatch[1];
        const idx = parseInt(arrMatch[2]);
        if (!current[arrKey]) current[arrKey] = [];
        if (!current[arrKey][idx]) current[arrKey][idx] = {};
        current = current[arrKey][idx];
      } else {
        if (typeof current[part] !== "object" || current[part] === null) current[part] = {};
        current = current[part];
      }
    }
    const lastPart = parts[parts.length - 1];
    const arrMatch = lastPart.match(/^([^\]]+)\[(\d+)\]$/);
    if (arrMatch) {
      const arrKey = arrMatch[1];
      const idx = parseInt(arrMatch[2]);
      if (!current[arrKey]) current[arrKey] = [];
      current[arrKey][idx] = value;
    } else {
      current[lastPart] = value;
    }
  }
  return result;
}

function _deepMerge(a: any, b: any): any {
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) {
    return b !== undefined ? b : a;
  }
  if (Array.isArray(a) && Array.isArray(b)) return [...a, ...b];
  const result: any = { ...a };
  for (const [k, v] of Object.entries(b)) {
    if (k in result) {
      result[k] = _deepMerge(result[k], v);
    } else {
      result[k] = v;
    }
  }
  return result;
}

function _diff(a: any, b: any, path: string): Array<{path: string; type: string; a?: any; b?: any}> {
  const diffs: Array<{path: string; type: string; a?: any; b?: any}> = [];
  if (typeof a !== typeof b) {
    diffs.push({ path: path || "(root)", type: "type_change", a, b });
    return diffs;
  }
  if (typeof a !== "object" || a === null || b === null) {
    if (a !== b) diffs.push({ path: path || "(root)", type: "value_change", a, b });
    return diffs;
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    const maxLen = Math.max(a.length, b.length);
    for (let i = 0; i < maxLen; i++) {
      if (i >= a.length) diffs.push({ path: `${path}[${i}]`, type: "added", b: b[i] });
      else if (i >= b.length) diffs.push({ path: `${path}[${i}]`, type: "removed", a: a[i] });
      else diffs.push(..._diff(a[i], b[i], `${path}[${i}]`));
    }
    return diffs;
  }
  const allKeys = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const k of allKeys) {
    const p = path ? `${path}.${k}` : k;
    if (!(k in a)) diffs.push({ path: p, type: "added", b: b[k] });
    else if (!(k in b)) diffs.push({ path: p, type: "removed", a: a[k] });
    else diffs.push(..._diff(a[k], b[k], p));
  }
  return diffs;
}

export const tool = {
  name: "json_utilities",
  description: "أدوات JSON شاملة — format, validate, minify, query, diff, merge, transform",
  execute,
};

export default tool;
