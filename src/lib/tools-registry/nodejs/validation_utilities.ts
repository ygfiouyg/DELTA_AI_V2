/**
 * Tool: validation_utilities.ts
 * Category: utility
 * Description: أدوات تحقق شاملة — email, phone, URL, IP, credit card, ISBN, UUID, JWT.
 *
 * Dependencies: none
 */

export async function execute(input: {
  operation: "email" | "phone" | "url" | "ip" | "credit_card" | "isbn" | "uuid" | "jwt" | "password_strength" | "username";
  value: string;
  params?: { strict?: boolean };
}): Promise<any> {
  const { operation, value = "", params = {} } = input;

  if (operation === "email") {
    const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    const valid = re.test(value);
    const result: any = { success: true, valid, value };
    if (valid) {
      const [local, domain] = value.split("@");
      result.parts = { local, domain };
      result.has_subdomain = domain.split(".").length > 2;
      result.tld = domain.split(".").pop();
    }
    return result;
  }

  if (operation === "phone") {
    // International phone format: +CC-NNNNNNNNN
    const cleaned = value.replace(/[\s\-().]/g, "");
    const re = /^\+?(\d{1,3})(\d{4,14})$/;
    const valid = re.test(cleaned);
    const result: any = { success: true, valid, value, cleaned };
    if (valid) {
      const m = cleaned.match(re);
      if (m) {
        result.country_code = "+" + m[1];
        result.number = m[2];
      }
    }
    return result;
  }

  if (operation === "url") {
    try {
      const parsed = new URL(value);
      return {
        success: true,
        valid: true,
        value,
        protocol: parsed.protocol,
        hostname: parsed.hostname,
        is_secure: parsed.protocol === "https:",
        has_path: parsed.pathname !== "/",
        has_query: parsed.search !== "",
      };
    } catch {
      return { success: true, valid: false, value };
    }
  }

  if (operation === "ip") {
    const v4 = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const v6 = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
    if (v4.test(value)) {
      const parts = value.split(".").map(Number);
      const valid = parts.every((p) => p >= 0 && p <= 255);
      return {
        success: true,
        valid,
        value,
        version: "IPv4",
        is_private: valid && (parts[0] === 10 || (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) || (parts[0] === 192 && parts[1] === 168) || parts[0] === 127),
        is_loopback: valid && parts[0] === 127,
      };
    }
    if (v6.test(value)) {
      return { success: true, valid: true, value, version: "IPv6" };
    }
    return { success: true, valid: false, value };
  }

  if (operation === "credit_card") {
    const cleaned = value.replace(/\D/g, "");
    if (!/^\d{13,19}$/.test(cleaned)) {
      return { success: true, valid: false, value, reason: "Invalid length" };
    }
    // Luhn algorithm
    let sum = 0;
    let isEven = false;
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned[i]);
      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      isEven = !isEven;
    }
    const valid = sum % 10 === 0;
    // Detect card type
    let type = "unknown";
    if (/^4/.test(cleaned)) type = "visa";
    else if (/^5[1-5]/.test(cleaned) || /^2[2-7]/.test(cleaned)) type = "mastercard";
    else if (/^3[47]/.test(cleaned)) type = "amex";
    else if (/^6(?:011|5)/.test(cleaned)) type = "discover";
    else if (/^(?:2131|1800|35)/.test(cleaned)) type = "jcb";
    return { success: true, valid, value, cleaned, type, length: cleaned.length };
  }

  if (operation === "isbn") {
    const cleaned = value.replace(/[-\s]/g, "");
    if (/^\d{10}$/.test(cleaned)) {
      let sum = 0;
      for (let i = 0; i < 9; i++) sum += parseInt(cleaned[i]) * (10 - i);
      const last = cleaned[9] === "X" ? 10 : parseInt(cleaned[9]);
      sum += last;
      return { success: true, valid: sum % 11 === 0, value, cleaned, version: "ISBN-10" };
    }
    if (/^\d{13}$/.test(cleaned)) {
      let sum = 0;
      for (let i = 0; i < 12; i++) sum += parseInt(cleaned[i]) * (i % 2 === 0 ? 1 : 3);
      const check = (10 - (sum % 10)) % 10;
      return { success: true, valid: check === parseInt(cleaned[12]), value, cleaned, version: "ISBN-13" };
    }
    return { success: true, valid: false, value, reason: "Invalid ISBN format" };
  }

  if (operation === "uuid") {
    const re = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const valid = re.test(value);
    const result: any = { success: true, valid, value };
    if (valid) {
      const version = parseInt(value[14], 16);
      const variant = parseInt(value[19], 16);
      result.version = version;
      result.variant = variant >= 8 ? (variant >= 12 ? "RFC 4122" : "Microsoft") : "NCS";
    }
    return result;
  }

  if (operation === "jwt") {
    const parts = value.split(".");
    if (parts.length !== 3) {
      return { success: true, valid: false, value, reason: "JWT must have 3 parts" };
    }
    try {
      const decode = (s: string) => JSON.parse(Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString());
      const header = decode(parts[0]);
      const payload = decode(parts[1]);
      const result: any = {
        success: true,
        valid: true,
        value,
        header,
        payload,
      };
      if (payload.exp) {
        const expDate = new Date(payload.exp * 1000);
        result.expires_at = expDate.toISOString();
        result.is_expired = Date.now() > payload.exp * 1000;
      }
      if (payload.iat) {
        result.issued_at = new Date(payload.iat * 1000).toISOString();
      }
      return result;
    } catch (e: any) {
      return { success: true, valid: false, value, error: e.message };
    }
  }

  if (operation === "password_strength") {
    const password = value;
    const checks = {
      length_8: password.length >= 8,
      length_12: password.length >= 12,
      has_lowercase: /[a-z]/.test(password),
      has_uppercase: /[A-Z]/.test(password),
      has_digit: /\d/.test(password),
      has_special: /[^a-zA-Z0-9]/.test(password),
      no_common_patterns: !/password|123456|qwerty|admin|letmein/i.test(password),
      no_repeating: !/(.)\1{2,}/.test(password),
    };
    const score = Object.values(checks).filter(Boolean).length;
    let strength = "very_weak";
    if (score >= 7) strength = "very_strong";
    else if (score >= 5) strength = "strong";
    else if (score >= 3) strength = "medium";
    else if (score >= 2) strength = "weak";
    return {
      success: true,
      value: "*".repeat(password.length),
      length: password.length,
      score,
      max_score: 8,
      strength,
      checks,
    };
  }

  if (operation === "username") {
    const strict = params.strict;
    const re = strict ? /^[a-zA-Z][a-zA-Z0-9_]{3,15}$/ : /^[a-zA-Z0-9_]{3,20}$/;
    const valid = re.test(value);
    return {
      success: true,
      valid,
      value,
      length: value.length,
      has_valid_chars: /^[a-zA-Z0-9_]+$/.test(value),
      starts_with_letter: /^[a-zA-Z]/.test(value),
    };
  }

  return { success: false, error: `unknown operation: ${operation}` };
}

export const tool = {
  name: "validation_utilities",
  description: "أدوات تحقق — email, phone, URL, IP, credit card, ISBN, UUID, JWT, password",
  execute,
};

export default tool;
