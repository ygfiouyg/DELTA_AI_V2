/**
 * Tool: network_utilities.ts
 * Category: web/utility
 * Description: أدوات شبكة — DNS lookup, ping, port check, IP info, URL parser.
 *
 * Dependencies: built-in Node.js modules (dns, net, http, url)
 */

import * as dns from "dns";
import * as net from "net";
import * as url from "url";

export async function execute(input: {
  operation: "dns_lookup" | "dns_reverse" | "port_check" | "url_parse" | "ip_info" | "get_headers" | "validate_url" | "get_my_ip";
  hostname?: string;
  ip?: string;
  url?: string;
  port?: number;
  timeout?: number;
}): Promise<any> {
  const { operation, hostname, ip, url: urlStr, port, timeout = 5000 } = input;

  if (operation === "dns_lookup") {
    if (!hostname) return { success: false, error: "hostname required" };
    try {
      const records = await dns.promises.lookup(hostname, { all: true });
      return {
        success: true,
        hostname,
        addresses: records.map((r) => ({ address: r.address, family: r.family === 4 ? "IPv4" : "IPv6" })),
        count: records.length,
      };
    } catch (e: any) {
      return { success: false, error: `DNS lookup failed: ${e.message}` };
    }
  }

  if (operation === "dns_reverse") {
    if (!ip) return { success: false, error: "ip required" };
    try {
      const hostnames = await dns.promises.reverse(ip);
      return { success: true, ip, hostnames };
    } catch (e: any) {
      return { success: false, error: `reverse DNS failed: ${e.message}` };
    }
  }

  if (operation === "port_check") {
    if (!hostname || !port) return { success: false, error: "hostname and port required" };
    return new Promise((resolve) => {
      const socket = new net.Socket();
      const t = setTimeout(() => {
        socket.destroy();
        resolve({ success: true, hostname, port, open: false, error: "timeout" });
      }, timeout);
      socket.setTimeout(timeout);
      socket.on("connect", () => {
        clearTimeout(t);
        socket.destroy();
        resolve({ success: true, hostname, port, open: true });
      });
      socket.on("timeout", () => {
        clearTimeout(t);
        socket.destroy();
        resolve({ success: true, hostname, port, open: false, error: "timeout" });
      });
      socket.on("error", (e) => {
        clearTimeout(t);
        resolve({ success: true, hostname, port, open: false, error: e.message });
      });
      socket.connect(port, hostname);
    });
  }

  if (operation === "url_parse") {
    if (!urlStr) return { success: false, error: "url required" };
    try {
      const parsed = new URL(urlStr);
      return {
        success: true,
        href: parsed.href,
        protocol: parsed.protocol,
        hostname: parsed.hostname,
        port: parsed.port,
        pathname: parsed.pathname,
        search: parsed.search,
        hash: parsed.hash,
        username: parsed.username,
        password: parsed.password,
        search_params: Object.fromEntries(parsed.searchParams.entries()),
      };
    } catch (e: any) {
      return { success: false, error: `invalid URL: ${e.message}` };
    }
  }

  if (operation === "validate_url") {
    if (!urlStr) return { success: false, error: "url required" };
    try {
      const parsed = new URL(urlStr);
      return {
        success: true,
        valid: true,
        protocol: parsed.protocol,
        hostname: parsed.hostname,
        is_secure: parsed.protocol === "https:",
      };
    } catch {
      return { success: true, valid: false, url: urlStr };
    }
  }

  if (operation === "ip_info") {
    const targetIp = ip || hostname;
    if (!targetIp) return { success: false, error: "ip or hostname required" };
    const isIp = net.isIP(targetIp) > 0;
    let resolvedIp = targetIp;
    if (!isIp && hostname) {
      try {
        const records = await dns.promises.lookup(hostname, { all: true });
        if (records.length > 0) resolvedIp = records[0].address;
      } catch (e: any) {
        return { success: false, error: `failed to resolve: ${e.message}` };
      }
    }
    const isPrivate = net.isIP(resolvedIp) === 4 && (
      resolvedIp.startsWith("10.") ||
      resolvedIp.startsWith("192.168.") ||
      /^172\.(1[6-9]|2\d|3[01])\./.test(resolvedIp) ||
      resolvedIp.startsWith("127.")
    );
    return {
      success: true,
      ip: resolvedIp,
      version: net.isIP(resolvedIp) === 4 ? "IPv4" : net.isIP(resolvedIp) === 6 ? "IPv6" : "invalid",
      is_private: isPrivate,
      is_loopback: resolvedIp.startsWith("127."),
    };
  }

  if (operation === "get_headers") {
    if (!urlStr) return { success: false, error: "url required" };
    try {
      const parsed = new URL(urlStr);
      const lib = parsed.protocol === "https:" ? await import("https") : await import("http");
      return new Promise((resolve) => {
        const req = lib.request(parsed, { method: "HEAD", timeout }, (res) => {
          resolve({
            success: true,
            status: res.statusCode,
            status_text: res.statusMessage,
            headers: res.headers,
          });
          res.destroy();
        });
        req.on("error", (e) => resolve({ success: false, error: e.message }));
        req.on("timeout", () => { req.destroy(); resolve({ success: false, error: "timeout" }); });
        req.end();
      });
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  if (operation === "get_my_ip") {
    return new Promise((resolve) => {
      const req = require("https").request("https://api.ipify.org?format=json", (res: any) => {
        let data = "";
        res.on("data", (c: any) => (data += c));
        res.on("end", () => {
          try {
            const j = JSON.parse(data);
            resolve({ success: true, ip: j.ip });
          } catch {
            resolve({ success: false, error: "could not parse response" });
          }
        });
      });
      req.on("error", (e: any) => resolve({ success: false, error: e.message }));
      req.on("timeout", () => { req.destroy(); resolve({ success: false, error: "timeout" }); });
      req.setTimeout(timeout);
      req.end();
    });
  }

  return { success: false, error: `unknown operation: ${operation}` };
}

export const tool = {
  name: "network_utilities",
  description: "أدوات شبكة — DNS, port check, URL parser, IP info, headers",
  execute,
};

export default tool;
