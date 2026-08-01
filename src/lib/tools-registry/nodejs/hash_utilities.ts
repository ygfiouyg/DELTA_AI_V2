/**
 * Tool: hash_utilities.ts
 * Category: utility/security
 * Description: أدوات hash شاملة — MD5, SHA-1, SHA-256, SHA-512, HMAC, bcrypt-style.
 *
 * Dependencies: built-in Node.js crypto module
 */

import * as crypto from "crypto";

export async function execute(input: {
  operation: "hash" | "hmac" | "uuid" | "random_bytes" | "pbkdf2" | "scrypt" | "cipher_info";
  data?: string;
  algorithm?: string;
  secret?: string;
  encoding?: "hex" | "base64" | "latin1";
  length?: number;
  iterations?: number;
  salt?: string;
}): Promise<any> {
  const {
    operation,
    data = "",
    algorithm = "sha256",
    secret = "",
    encoding = "hex",
    length = 32,
    iterations = 100000,
    salt,
  } = input;

  if (operation === "hash") {
    try {
      const hash = crypto.createHash(algorithm);
      hash.update(data, "utf8");
      return {
        success: true,
        hash: hash.digest(encoding),
        algorithm,
        encoding,
        input_length: data.length,
      };
    } catch (e: any) {
      return { success: false, error: `invalid algorithm: ${e.message}` };
    }
  }

  if (operation === "hmac") {
    try {
      const hmac = crypto.createHmac(algorithm, secret);
      hmac.update(data, "utf8");
      return {
        success: true,
        hmac: hmac.digest(encoding),
        algorithm,
        secret_length: secret.length,
        input_length: data.length,
      };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  if (operation === "uuid") {
    return {
      success: true,
      uuid_v4: crypto.randomUUID(),
      uuid_v1: generateUUIDv1(),
    };
  }

  if (operation === "random_bytes") {
    const bytes = crypto.randomBytes(length);
    return {
      success: true,
      bytes,
      hex: bytes.toString("hex"),
      base64: bytes.toString("base64"),
      length,
    };
  }

  if (operation === "pbkdf2") {
    const actualSalt = salt || crypto.randomBytes(16).toString("hex");
    const keyLength = 64;
    return new Promise((resolve) => {
      crypto.pbkdf2(data, actualSalt, iterations, keyLength, algorithm, (err, key) => {
        if (err) {
          resolve({ success: false, error: err.message });
          return;
        }
        resolve({
          success: true,
          derived_key: key.toString("hex"),
          salt: actualSalt,
          iterations,
          key_length: keyLength,
          algorithm,
        });
      });
    });
  }

  if (operation === "scrypt") {
    const actualSalt = salt || crypto.randomBytes(16).toString("hex");
    const keyLength = 64;
    return new Promise((resolve) => {
      crypto.scrypt(data, actualSalt, keyLength, (err, key) => {
        if (err) {
          resolve({ success: false, error: err.message });
          return;
        }
        resolve({
          success: true,
          derived_key: key.toString("hex"),
          salt: actualSalt,
          key_length: keyLength,
          algorithm: "scrypt",
        });
      });
    });
  }

  if (operation === "cipher_info") {
    const ciphers = crypto.getCiphers();
    const hashes = crypto.getHashes();
    return {
      success: true,
      cipher_count: ciphers.length,
      hash_count: hashes.length,
      common_hashes: hashes.filter((h) => ["md5", "sha1", "sha256", "sha512"].includes(h)),
      common_ciphers: ciphers.filter((c) => ["aes-256-cbc", "aes-256-gcm", "aes-128-cbc"].includes(c)),
    };
  }

  return { success: false, error: `unknown operation: ${operation}` };
}

function generateUUIDv1(): string {
  // Simple v1 UUID (timestamp-based)
  const now = Date.now();
  const hex = now.toString(16).padStart(12, "0");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-1${Math.floor(Math.random() * 16).toString(16)}${Math.floor(Math.random() * 16).toString(16)}-${Math.floor(Math.random() * 16).toString(16)}${Math.floor(Math.random() * 16).toString(16)}${Math.floor(Math.random() * 16).toString(16)}${Math.floor(Math.random() * 16).toString(16)}${Math.floor(Math.random() * 16).toString(16)}${Math.floor(Math.random() * 16).toString(16)}${Math.floor(Math.random() * 16).toString(16)}${Math.floor(Math.random() * 16).toString(16)}${Math.floor(Math.random() * 16).toString(16)}`;
}

export const tool = {
  name: "hash_utilities",
  description: "أدوات hash — MD5, SHA, HMAC, PBKDF2, scrypt, UUID",
  execute,
};

export default tool;
