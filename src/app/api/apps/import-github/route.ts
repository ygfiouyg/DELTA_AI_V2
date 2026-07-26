/**
 * POST /api/apps/import-github
 * ============================
 * V.88 — NO-AI version.
 *
 * قبل كده: كان الـ AI (glm-4-flash) بيحلل الـ repo ويولّد HTML + backend.
 * المشكلة: الـ AI بيطلع كود ناقص/مكسور → التطبيق "زينة فاضي" مش شغّال.
 *
 * دلوقتي: بنسحب ملف index.html (أو أي HTML) من الـ repo ونـ inline كل
 * الـ CSS و JS المرتبطة بيه → HTML self-contained يشتغل في iframe من غير AI.
 *
 * - 0 تكلفة AI
 * - التطبيق بيشتغل فعلياً (نفس كود الـ repo الأصلي)
 * - لو ملقيناش HTML → بنبني صفحة بسيطة من README
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromToken, extractBearerToken } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

interface GitHubFile {
  name: string;
  path: string;
  content: string;
  size: number;
}

function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  const m = url.match(/github\.com\/([^/]+)\/([^/?#]+)/);
  if (!m) return null;
  return { owner: m[1], repo: m[2].replace(/\.git$/, "") };
}

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50);
}

/**
 * بتجيب شجرة الـ repo كاملة من GitHub API.
 * بترمي errors واضحة: rate limit / not found / private repo.
 */
async function fetchRepoTree(owner: string, repo: string): Promise<{ tree: any[]; defaultBranch: string }> {
  let lastError = "مش قادر أقرا الـ repo — تأكد إنه public";

  // لو فيه GITHUB_TOKEN، استخدمه (rate limit أعلى: 5000/ساعة بدل 60)
  const githubToken = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "Anzaro-Apps",
  };
  if (githubToken) headers.Authorization = `Bearer ${githubToken}`;

  for (const branch of ["main", "master"]) {
    const treeUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;
    const resp = await fetch(treeUrl, { headers });
    if (resp.ok) {
      const data = await resp.json();
      return { tree: data.tree || [], defaultBranch: branch };
    }
    if (resp.status === 403) {
      const remaining = resp.headers.get("x-ratelimit-remaining");
      const resetEpoch = resp.headers.get("x-ratelimit-reset");
      if (remaining === "0") {
        const resetIn = resetEpoch ? Math.ceil((Number(resetEpoch) * 1000 - Date.now()) / 60000) : 60;
        lastError = `GitHub API rate limit اتخدّم (60 طلب/ساعة للـ unauthenticated). جرّب تاني بعد ~${resetIn} دقيقة${githubToken ? "" : "، أو ضيف GITHUB_TOKEN لرفع الحد لـ 5000/ساعة"}.`;
      } else {
        lastError = "الـ repo مش متاح (403 Forbidden). ممكن يكون private.";
      }
    } else if (resp.status === 404) {
      lastError = `الـ repo ${owner}/${repo} مش موجود (404). اتأكد من الاسم.`;
    } else {
      lastError = `GitHub API error ${resp.status}.`;
    }
  }
  throw new Error(lastError);
}

/**
 * بتجيب محتوى ملف واحد من raw.githubusercontent.
 */
async function fetchRawFile(owner: string, repo: string, branch: string, filePath: string): Promise<string | null> {
  try {
    const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`;
    const resp = await fetch(rawUrl, { headers: { "User-Agent": "Anzaro-Apps" } });
    if (!resp.ok) return null;
    return await resp.text();
  } catch {
    return null;
  }
}

/**
 * بتجيب أهم الملفات من الـ repo (HTML, CSS, JS, README).
 */
async function fetchImportantFiles(owner: string, repo: string): Promise<{ files: Map<string, GitHubFile>; defaultBranch: string; repoMeta: any; tree: any[] }> {
  const { tree, defaultBranch } = await fetchRepoTree(owner, repo);

  // جرّب نجيب معلومات الـ repo (وصف، الخ)
  let repoMeta: any = { description: "", homepage: "" };
  try {
    const metaResp = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: { Accept: "application/vnd.github.v3+json", "User-Agent": "Anzaro-Apps" },
    });
    if (metaResp.ok) repoMeta = await metaResp.json();
  } catch {}

  // V.89: بنجيب ملفات الـ config كمان (package.json, tauri.conf.json, pubspec.yaml, Cargo.toml)
  // عشان نقدر نكشف نوع الـ repo.
  const importantExts = [".html", ".htm", ".css", ".js", ".mjs", ".md", ".markdown", ".txt", ".json"];
  const configFiles = [
    "package.json", "tauri.conf.json", "pubspec.yaml", "Cargo.toml",
    "electron-builder.json", "forge.config.js", "vite.config.js", "vite.config.ts",
    "next.config.js", "next.config.mjs", "webpack.config.js",
  ];
  // V.89: ما تـskipش dist/ و build/ — ممكن يكون فيه build جاهز يشتغل!
  const skipPaths = ["node_modules", ".git", "vendor", "__pycache__", ".next", "coverage", ".vscode", "test", "tests", "__tests__", "docs/assets"];
  const maxFiles = 60;
  const maxFileSize = 200_000;

  const files = new Map<string, GitHubFile>();
  let count = 0;

  // Phase 1: ملفات الـ config الأول (صغيرة وعشان الكشف)
  for (const item of tree) {
    if (item.type !== "blob") continue;
    const baseName = item.path.split("/").pop() || "";
    if (!configFiles.includes(baseName)) continue;
    if (item.path.includes("node_modules") || item.path.includes("vendor")) continue;
    const content = await fetchRawFile(owner, repo, defaultBranch, item.path);
    if (content === null) continue;
    files.set(item.path, {
      name: baseName,
      path: item.path,
      content: content.slice(0, maxFileSize),
      size: content.length,
    });
  }

  // Phase 2: باقي الملفات المهمة
  for (const item of tree) {
    if (item.type !== "blob") continue;
    if (count >= maxFiles) break;
    if (skipPaths.some((p) => item.path.toLowerCase().includes(p.toLowerCase()))) continue;
    if (files.has(item.path)) continue; // اتـ fetch في Phase 1
    const isImportant = importantExts.some((ext) => item.path.toLowerCase().endsWith(ext));
    if (!isImportant) continue;
    if ((item.size || 0) > maxFileSize) continue;

    const content = await fetchRawFile(owner, repo, defaultBranch, item.path);
    if (content === null) continue;

    files.set(item.path, {
      name: item.path.split("/").pop() || item.path,
      path: item.path,
      content: content.slice(0, maxFileSize),
      size: content.length,
    });
    count++;
  }

  return { files, defaultBranch, repoMeta, tree };
}

/**
 * بتبحث عن أفضل HTML file يكون entry point.
 * V.89: بتدور في الـ tree كله (مش بس الـ files map) عشان تلاقي index.html حتى لو مش اتـ fetch.
 * لو لقت entry في الـ tree بس مش في الـ files map → بترجع المسار ونتـ fetchه بعدين.
 */
function findEntryHtmlPath(tree: any[]): string | null {
  const htmlEntries = tree.filter((t) => t.type === "blob" && /\.html?$/i.test(t.path));
  if (htmlEntries.length === 0) return null;

  // 1. index.html في الـ root
  let entry = htmlEntries.find((t) => t.path.toLowerCase() === "index.html");
  if (entry) return entry.path;

  // 2. أي HTML في الـ root (مستوى واحد)
  entry = htmlEntries.find((t) => !t.path.includes("/"));
  if (entry) return entry.path;

  // 3. index.html في public/ أو docs/ أو www/
  entry = htmlEntries.find((t) => /^(public|docs|www)\//i.test(t.path) && /index\.html?$/i.test(t.path));
  if (entry) return entry.path;

  // 4. أي HTML في public/ أو docs/
  entry = htmlEntries.find((t) => /^(public|docs|www)\//i.test(t.path));
  if (entry) return entry.path;

  // 5. أكبر HTML file
  return htmlEntries.sort((a, b) => (b.size || 0) - (a.size || 0))[0].path;
}

/**
 * بتبحث عن أفضل HTML file يكون entry point — من الـ files map بس.
 */
function findEntryHtml(files: Map<string, GitHubFile>): GitHubFile | null {
  const htmlFiles = Array.from(files.values()).filter((f) => /\.html?$/i.test(f.path));
  if (htmlFiles.length === 0) return null;

  // 1. index.html في الـ root
  let entry = htmlFiles.find((f) => f.path.toLowerCase() === "index.html");
  if (entry) return entry;

  // 2. أي HTML في الـ root (مستوى واحد)
  entry = htmlFiles.find((f) => !f.path.includes("/"));
  if (entry) return entry;

  // 3. index.html في public/ أو docs/ أو src/
  entry = htmlFiles.find((f) => /^(public|docs|src|app|www)\//i.test(f.path) && /index\.html?$/i.test(f.path));
  if (entry) return entry;

  // 4. أي HTML في public/ أو docs/
  entry = htmlFiles.find((f) => /^(public|docs|www)\//i.test(f.path));
  if (entry) return entry;

  // 5. أكبر HTML file
  return htmlFiles.sort((a, b) => b.size - a.size)[0];
}

/**
 * بتـ inline كل الـ CSS و JS المرتبطة في الـ HTML عشان يبقى self-contained.
 * - `<link rel="stylesheet" href="...">` → `<style>...</style>`
 * - `<script src="...">` → `<script>...</script>`
 * بتحلّ relative paths جوه الـ repo.
 */
function inlineAssets(html: string, files: Map<string, GitHubFile>, owner: string, repo: string): string {
  let result = html;

  // 1. inline <link rel="stylesheet" href="...">
  result = result.replace(/<link\b[^>]*rel=["']stylesheet["'][^>]*>/gi, (tag) => {
    const hrefMatch = tag.match(/href=["']([^"']+)["']/i);
    if (!hrefMatch) return tag;
    const href = hrefMatch[1];

    // external URLs — سيبها زي ما هي (CDN وغيره)
    if (/^https?:\/\//i.test(href) || href.startsWith("//") || href.startsWith("data:")) return tag;

    // internal path — دور على الملف
    const cssFile = resolveAssetPath(href, files, owner, repo);
    if (!cssFile) return `<!-- missing css: ${href} -->`;

    return `<style data-src="${href}">\n${cssFile.content}\n</style>`;
  });

  // 2. inline <script src="...">
  result = result.replace(/<script\b([^>]*)\bsrc=["']([^"']+)["']([^>]*)><\/script>/gi, (tag, before, src, after) => {
    // external URLs — سيبها (CDN: React, Tailwind, etc.)
    if (/^https?:\/\//i.test(src) || src.startsWith("//") || src.startsWith("data:")) return tag;

    const jsFile = resolveAssetPath(src, files, owner, repo);
    if (!jsFile) return `<!-- missing js: ${src} -->`;

    // نحافظ على attributes زي type="module"
    const attrs = `${before}${after}`.replace(/\s+/g, " ").trim();
    return `<script ${attrs} data-src="${src}">\n${jsFile.content}\n</script>`;
  });

  // 3. inline <img src="...">  كـ data URI لو الملف صورة (ملفات صغيرة فقط)
  // (تخطّي — الصور الكبيرة هتكسر الـ HTML size)

  return result;
}

/**
 * بتحوّل relative path (زي "./style.css" أو "../js/app.js") لـ file path جوه الـ repo
 * وتبحث عن الملف في الـ files map.
 */
function resolveAssetPath(href: string, files: Map<string, GitHubFile>, owner: string, repo: string): GitHubFile | null {
  // نظّف الـ path
  let clean = href
    .replace(/^\.?\//, "") // شيل ./ أو /
    .replace(/^\.\//, "")
    .split("?")[0] // شيل query params
    .split("#")[0]; // شيل hash

  // لو فيه ../ نحلها بشكل بسيط (نحاول نلاقي الملف باسمه)
  clean = clean.replace(/^(\.\.\/)+/, "");

  // جرّب المطابقة المباشرة
  if (files.has(clean)) return files.get(clean)!;

  // جرّب المطابقة باسم الملف بس (آخر جزء)
  const baseName = clean.split("/").pop() || clean;
  const byBaseName = Array.from(files.values()).find((f) => f.name === baseName && f.path.endsWith(clean));
  if (byBaseName) return byBaseName;

  // جرّب أي ملف ينتهي بالـ path ده
  const bySuffix = Array.from(files.values()).find((f) => f.path.endsWith(clean));
  if (bySuffix) return bySuffix;

  return null;
}

/**
 * استخرج أول صورة emoji من نص (للأيقونة).
 */
function extractEmoji(text: string): string {
  const match = text.match(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u);
  return match ? match[0] : "📦";
}

/**
 * استخرج أول عنوان h1 من HTML.
 */
function extractTitle(html: string): string | null {
  const m = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (m) return m[1].replace(/<[^>]+>/g, "").trim().slice(0, 60);
  const titleM = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (titleM) return titleM[1].replace(/<[^>]+>/g, "").trim().slice(0, 60);
  return null;
}

/**
 * لو ملقيناش HTML، نبني صفحة بسيطة من README (بدون AI).
 */
function buildFromReadme(files: Map<string, GitHubFile>, repoName: string, repoOwner: string, repoMeta: any): { frontendHtml: string; description: string; icon: string; displayName: string } {
  const readme = Array.from(files.values()).find((f) => /^readme/i.test(f.name));

  let readmeHtml = "";
  let description = repoMeta?.description || `تطبيق من ${repoOwner}/${repoName}`;
  let icon = extractEmoji(readme?.content || repoName) || "📦";

  if (readme) {
    // تحويل بسيط جداً من Markdown لـ HTML (بدون مكتبات)
    const lines = readme.content.split("\n");
    let html = "";
    let inList = false;
    for (const line of lines.slice(0, 120)) {
      const trimmed = line.trim();
      if (!trimmed) {
        if (inList) { html += "</ul>\n"; inList = false; }
        continue;
      }
      // headings
      const h = trimmed.match(/^(#{1,6})\s+(.*)/);
      if (h) {
        if (inList) { html += "</ul>\n"; inList = false; }
        const level = h[1].length;
        html += `<h${level}>${escapeHtml(h[2])}</h${level}>\n`;
        continue;
      }
      // list items
      const li = trimmed.match(/^[-*+]\s+(.*)/);
      if (li) {
        if (!inList) { html += "<ul>\n"; inList = true; }
        html += `<li>${escapeHtml(li[1])}</li>\n`;
        continue;
      }
      // code blocks
      const code = trimmed.match(/^```/);
      if (code) continue;
      // paragraphs
      if (inList) { html += "</ul>\n"; inList = false; }
      html += `<p>${escapeHtml(trimmed)}</p>\n`;
    }
    if (inList) html += "</ul>\n";
    readmeHtml = html;

    // استخدم أول سطر من README كـ description
    const firstLine = lines.find((l) => l.trim() && !l.trim().startsWith("#"));
    if (firstLine) description = firstLine.trim().slice(0, 200);

    const h1 = readme.content.match(/^#\s+(.+)$/m);
    if (h1) {
      // استخدم أول h1 كـ displayName
    }
  }

  const displayName = repoName.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const frontendHtml = `<div style="max-width:760px;margin:0 auto;padding:24px;font-family:-apple-system,Segoe UI,sans-serif;line-height:1.7;color:#e4e4e7;">
  <div style="border-bottom:1px solid #27272a;padding-bottom:16px;margin-bottom:20px;">
    <h1 style="font-size:24px;margin:0 0 8px 0;">${escapeHtml(displayName)}</h1>
    <p style="color:#71717a;font-size:13px;margin:0;">${escapeHtml(description)}</p>
    <p style="color:#52525b;font-size:11px;margin:4px 0 0 0;">المصدر: ${escapeHtml(repoOwner)}/${escapeHtml(repoName)}</p>
  </div>
  <div style="font-size:14px;">
    ${readmeHtml || "<p>مفيش README متاح. ده repo من غير صفحة HTML.</p>"}
  </div>
</div>`;

  return { frontendHtml, description, icon, displayName };
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/**
 * V.89: بتصنّف نوع الـ repo عشان نعرف هل هو web app حقيقي ولا لأ.
 *
 * أنواع repos اللي بتشتغل:
 *   - "static-web": فيه index.html حقيقي في root أو docs/ → ✅ شغّال
 *   - "prebuilt": فيه dist/index.html أو build/index.html → ✅ شغّال (build جاهز)
 *
 * أنواع repos اللي مش بتشتغل (مستحيل من الـ repo بس):
 *   - "tauri": Tauri desktop app (Rust + web frontend، لازم build)
 *   - "electron": Electron desktop app (لازم build)
 *   - "flutter": Flutter app (لازم Flutter SDK + build)
 *   - "react-build": React/Vue/Angular/Svelte مصدر بس (لازم npm install + build)
 *   - "nextjs": Next.js app (لازم server + build)
 *   - "rust": Rust binary (لازم cargo build)
 *   - "python": Python app (لازم runtime + deps)
 *   - "unknown": مش قادر نحدد
 */
type RepoClassification =
  | { kind: "static-web"; entry: GitHubFile; confidence: "high" | "low" }
  | { kind: "prebuilt"; entry: GitHubFile; folder: string }
  | { kind: "unsupported"; reason: string; type: string; howToRun: string };

function classifyRepo(
  files: Map<string, GitHubFile>,
  tree: any[],
  repoName: string,
  repoOwner: string,
  defaultBranch: string
): RepoClassification {
  const allPaths = new Set<string>();
  for (const item of tree) {
    if (item.type === "blob") allPaths.add(item.path.toLowerCase());
  }
  const fileValues = Array.from(files.values());

  // ─── 1. كشف Tauri (Rust + web) ───
  const hasTauriConf = fileValues.some((f) => f.path.toLowerCase().endsWith("tauri.conf.json"));
  const hasSrcTauri = Array.from(allPaths).some((p) => p.includes("src-tauri/"));
  if (hasTauriConf || hasSrcTauri) {
    // Tauri apps ممكن يكون ليها frontend web في dist/ أو في الـ src
    // لو فيه dist/index.html جاهز → نقدر نشغّله
    const prebuilt = findPrebuiltHtml(files, tree);
    if (prebuilt) return prebuilt;
    return {
      kind: "unsupported",
      type: "tauri",
      reason: "ده تطبيق Tauri desktop (Rust + web). لازم يتعمل build بـ `cargo tauri build` عشان يطلع web app.",
      howToRun: "1) ثبّت Rust + Tauri CLI. 2) npm install. 3) npm run tauri build. 4) الناتج في dist/.",
    };
  }

  // ─── 2. كشف Electron ───
  const hasElectron = fileValues.some((f) =>
    /electron[-]?(builder|forge|config)/i.test(f.path) ||
    (f.path.toLowerCase().endsWith("package.json") && f.content.includes("\"electron\""))
  );
  if (hasElectron) {
    const prebuilt = findPrebuiltHtml(files, tree);
    if (prebuilt) return prebuilt;
    return {
      kind: "unsupported",
      type: "electron",
      reason: "ده تطبيق Electron desktop. لازم يتعمل build بـ `npm run build` + `electron-builder`.",
      howToRun: "1) npm install. 2) npm run build. 3) npm run dist. الناتج executable مش web.",
    };
  }

  // ─── 3. كشف Flutter (أي مكان في الـ repo) ───
  const hasPubspec = fileValues.some((f) => f.path.toLowerCase().endsWith("pubspec.yaml"));
  // V.89: dart files ممكن في lib/ root أو في أي subfolder (زي frontend/appflowy_flutter/lib/)
  const dartCount = Array.from(allPaths).filter((p) => /\.dart$/i.test(p)).length;
  if (hasPubspec && dartCount > 10) {
    return {
      kind: "unsupported",
      type: "flutter",
      reason: `ده تطبيق Flutter (Dart). فيه ${dartCount} ملف .dart + pubspec.yaml. لازم Flutter SDK + \`flutter build web\` عشان يطلع web app.`,
      howToRun: "1) ثبّت Flutter SDK. 2) flutter pub get. 3) flutter build web. 4) الناتج في build/web/.",
    };
  }

  // ─── 4. كشف Rust (مش Tauri) ───
  const cargoCount = fileValues.filter((f) => f.path.toLowerCase().endsWith("cargo.toml")).length;
  if (cargoCount > 0 && !hasSrcTauri) {
    return {
      kind: "unsupported",
      type: "rust",
      reason: `ده مشروع Rust (${cargoCount} Cargo.toml). لازم \`cargo build\` عشان يطلع binary. مش web app.`,
      howToRun: "1) ثبّت Rust. 2) cargo build --release. الناتج executable مش web.",
    };
  }

  // ─── 5. كشف Next.js (محتاج server) ───
  const hasNextConfig = fileValues.some((f) => /next\.config\.(js|mjs|ts)/i.test(f.path));
  const hasNextInPkg = fileValues.some((f) => f.path.toLowerCase() === "package.json" && f.content.includes("\"next\""));
  if (hasNextConfig || hasNextInPkg) {
    const prebuilt = findPrebuiltHtml(files, tree);
    if (prebuilt) return prebuilt;
    return {
      kind: "unsupported",
      type: "nextjs",
      reason: "ده تطبيق Next.js. محتاج Node.js server عشان يشتغل. مش static HTML.",
      howToRun: "1) npm install. 2) npm run build. 3) npm start. محتاج server دايماً.",
    };
  }

  // ─── 6. كشف React/Vue/Angular/Svelte (مصدر بس) ───
  const pkgJson = fileValues.find((f) => f.path.toLowerCase() === "package.json");
  if (pkgJson) {
    let pkg: any = {};
    try { pkg = JSON.parse(pkgJson.content); } catch {}

    const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
    const isReactSrc = deps["react"] || deps["react-dom"];
    const isVueSrc = deps["vue"] || deps["@vue/runtime-dom"];
    const isAngularSrc = deps["@angular/core"];
    const isSvelteSrc = deps["svelte"] || deps["@sveltejs/kit"];
    const hasBuildScript = pkg.scripts && (pkg.scripts.build || pkg.scripts["build:web"]);

    if ((isReactSrc || isVueSrc || isAngularSrc || isSvelteSrc) && hasBuildScript) {
      // لو فيه dist/ أو build/ جاهز → نقدر نشغّله
      const prebuilt = findPrebuiltHtml(files, tree);
      if (prebuilt) return prebuilt;

      // لو فيه index.html في root + script type=module (Vite) → ممكن يشتغل في الـ iframe? لأ، لازم build
      return {
        kind: "unsupported",
        type: "react-build",
        reason: `ده مصدر ${isReactSrc ? "React" : isVueSrc ? "Vue" : isAngularSrc ? "Angular" : "Svelte"} (JSX/TSX). لازم \`npm install && npm run build\` عشان يطلع HTML.`,
        howToRun: "1) npm install. 2) npm run build. 3) الناتج في dist/ — اعمل استيراد تاني هيشتغل.",
      };
    }
  }

  // ─── 7. كشف Python ───
  const hasPythonOnly = fileValues.some((f) => f.path.toLowerCase().endsWith("requirements.txt") || f.path.toLowerCase().endsWith("setup.py") || f.path.toLowerCase().endsWith("pyproject.toml"));
  const hasHtml = fileValues.some((f) => /\.html?$/i.test(f.path));
  if (hasPythonOnly && !hasHtml) {
    return {
      kind: "unsupported",
      type: "python",
      reason: "ده تطبيق Python. محتاج Python runtime + dependencies. مش static web app.",
      howToRun: "1) pip install -r requirements.txt. 2) python main.py. محتاج server.",
    };
  }

  // ─── 8. موجود index.html حقيقي؟ (ندور في الـ tree كله) ───
  const entryPath = findEntryHtmlPath(tree);
  if (entryPath) {
    // لو الـ entry مش في الـ files map، نرجع معلومة إنه موجود
    // (الـ caller هيتـ fetchه بعدين)
    const entryFile = files.get(entryPath);
    if (entryFile) {
      // اتأكد إنه مش مجرد placeholder
      const content = entryFile.content.toLowerCase();
      const isRealApp =
        content.includes("<script") || content.includes("<link") ||
        content.includes("<div") || content.includes("<body") ||
        entryFile.size > 500;
      return { kind: "static-web", entry: entryFile, confidence: isRealApp ? "high" : "low" };
    }
    // الـ entry موجود في الـ tree بس مش اتـ fetch — نرجع static-web بنوعية مختلفة
    return { kind: "static-web", entry: { name: entryPath.split("/").pop() || entryPath, path: entryPath, content: "", size: 0 }, confidence: "low" };
  }

  // ─── 9. unknown ───
  return {
    kind: "unsupported",
    type: "unknown",
    reason: "مش قادر أحدد نوع الـ repo. مفيش index.html أو build جاهز.",
    howToRun: "اتأكد إن الـ repo فيه index.html أو dist/ جاهز.",
  };
}

/**
 * بتبحث عن HTML جاهز في dist/ أو build/ (prebuilt web app).
 */
function findPrebuiltHtml(files: Map<string, GitHubFile>, tree: any[]): { kind: "prebuilt"; entry: GitHubFile; folder: string } | null {
  // priority: dist/index.html > build/index.html > docs/index.html > _site/index.html > out/index.html
  const candidates = [
    { folder: "dist", test: (p: string) => /^dist\/index\.html?$/i.test(p) },
    { folder: "build", test: (p: string) => /^build\/index\.html?$/i.test(p) },
    { folder: "docs", test: (p: string) => /^docs\/index\.html?$/i.test(p) },
    { folder: "_site", test: (p: string) => /^_site\/index\.html?$/i.test(p) },
    { folder: "out", test: (p: string) => /^out\/index\.html?$/i.test(p) },
  ];

  for (const c of candidates) {
    const found = Array.from(files.values()).find((f) => c.test(f.path));
    if (found) return { kind: "prebuilt", entry: found, folder: c.folder };
  }
  return null;
}

/**
 * بيبني الـ Anzaro App بدون AI — من ملفات الـ repo مباشرةً.
 * V.89: بترجع نتيجة فيها حالة واضحة (supported / unsupported).
 * V.89b: بتـ fetch الـ entry HTML وكل الـ assets المرتبطة لو مش موجودة.
 */
async function buildAppFromRepo(
  files: Map<string, GitHubFile>,
  tree: any[],
  repoName: string,
  repoOwner: string,
  repoMeta: any,
  defaultBranch: string
): Promise<{ supported: true; app: any } | { supported: false; classification: Extract<RepoClassification, { kind: "unsupported" }> }> {
  const classification = classifyRepo(files, tree, repoName, repoOwner, defaultBranch);

  if (classification.kind === "unsupported") {
    return { supported: false, classification };
  }

  let entryHtml: GitHubFile;
  let buildFolder = "";

  if (classification.kind === "prebuilt") {
    entryHtml = classification.entry;
    buildFolder = classification.folder;
  } else {
    entryHtml = classification.entry;
    // V.89b: لو الـ entry مش اتـ fetch (content فاضي)، نـ fetchه دلوقتي
    if (!entryHtml.content && entryHtml.path) {
      const content = await fetchRawFile(repoOwner, repoName, defaultBranch, entryHtml.path);
      if (content) {
        entryHtml = { ...entryHtml, content: content.slice(0, 200_000), size: content.length };
        files.set(entryHtml.path, entryHtml);
      }
    }
  }

  // V.89b: نتـ fetch كل الـ assets المرتبطة بالـ HTML عشان نـ inline-هم
  // نـ parse الـ HTML ونـ collect كل الـ hrefs و srcs الداخلية
  const assetPaths = collectAssetPaths(entryHtml.content);
  for (const assetPath of assetPaths) {
    if (files.has(assetPath)) continue; // موجود فعلاً
    const content = await fetchRawFile(repoOwner, repoName, defaultBranch, assetPath);
    if (content) {
      const file: GitHubFile = {
        name: assetPath.split("/").pop() || assetPath,
        path: assetPath,
        content: content.slice(0, 200_000),
        size: content.length,
      };
      files.set(assetPath, file);
    }
  }

  // inline كل الـ assets
  const frontendHtml = inlineAssets(entryHtml.content, files, repoOwner, repoName);

  // استخرج العنوان من HTML
  const title = extractTitle(entryHtml.content);
  const displayName = title || repoName.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const description = repoMeta?.description || `تطبيق من ${repoOwner}/${repoName}`;
  const icon = extractEmoji(entryHtml.content) || "📦";

  const backendCode = "{}";
  const apiRoutes = "[]";

  const htmlCount = Array.from(files.values()).filter((f) => /\.html?$/i.test(f.path)).length;
  const cssCount = Array.from(files.values()).filter((f) => /\.css$/i.test(f.path)).length;
  const jsCount = Array.from(files.values()).filter((f) => /\.m?js$/i.test(f.path)).length;
  const sourceLabel = classification.kind === "prebuilt" ? `build جاهز من ${buildFolder}/` : "HTML مباشر من الـ root";
  const aiReview = `استيراد مباشر بدون AI ✅. ${sourceLabel}. الملفات: ${files.size} (${htmlCount} HTML، ${cssCount} CSS، ${jsCount} JS). التطبيق شغّال زي ما هو في الـ repo.`;

  return {
    supported: true,
    app: {
      appName: slugify(repoName),
      displayName,
      description,
      icon,
      category: "utility",
      frontendHtml,
      backendCode,
      apiRoutes,
      aiReview,
    },
  };
}

/**
 * V.89b: بتـ collect كل الـ internal asset paths (CSS + JS) من الـ HTML.
 * بترجع الـ paths المنظفة (بدون ./ أو query params).
 */
function collectAssetPaths(html: string): string[] {
  const paths = new Set<string>();
  const cleanPath = (href: string) => {
    if (/^https?:\/\//i.test(href) || href.startsWith("//") || href.startsWith("data:")) return null;
    let clean = href.replace(/^\.?\//, "").split("?")[0].split("#")[0].replace(/^(\.\.\/)+/, "");
    return clean || null;
  };

  // <link rel="stylesheet" href="...">
  for (const m of html.matchAll(/<link\b[^>]*rel=["']stylesheet["'][^>]*>/gi)) {
    const href = m[0].match(/href=["']([^"']+)["']/i)?.[1];
    if (href) {
      const clean = cleanPath(href);
      if (clean) paths.add(clean);
    }
  }

  // <script src="...">
  for (const m of html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*><\/script>/gi)) {
    const src = m[1];
    if (src) {
      const clean = cleanPath(src);
      if (clean) paths.add(clean);
    }
  }

  return Array.from(paths);
}

export async function POST(request: NextRequest) {
  try {
    const token = extractBearerToken(request.headers.get("Authorization"));
    const user = token ? await getUserFromToken(token) : null;
    if (!user) return NextResponse.json({ error: "مطلوب تسجيل الدخول" }, { status: 401 });

    const body = await request.json();
    const { githubUrl } = body as { githubUrl: string };
    if (!githubUrl || !githubUrl.includes("github.com")) {
      return NextResponse.json({ error: "أدخل رابط GitHub صحيح" }, { status: 400 });
    }

    const parsed = parseGitHubUrl(githubUrl);
    if (!parsed) return NextResponse.json({ error: "صيغة الرابط غلط" }, { status: 400 });

    // لو التطبيق موجود فعلاً — رجّعه
    const existing = await db.anzaroApp.findUnique({ where: { githubUrl } });
    if (existing) {
      if (existing.status !== "approved") {
        await db.anzaroApp.update({ where: { id: existing.id }, data: { status: "approved" } });
      }
      return NextResponse.json({
        success: true,
        app: existing,
        message: "التطبيق موجود وجاهز ✅",
      });
    }

    // 1. نزل ملفات الـ repo (مع الـ tree للكشف)
    const { files, repoMeta, tree, defaultBranch } = await fetchImportantFiles(parsed.owner, parsed.repo);
    if (files.size === 0) {
      return NextResponse.json({ error: "ملقتش ملفات قابلة للقراءة في الـ repo" }, { status: 404 });
    }

    // 2. صنّف الـ repo وابنِ التطبيق (بدون AI)
    const result = await buildAppFromRepo(files, tree, parsed.repo, parsed.owner, repoMeta, defaultBranch);

    // 3. لو الـ repo مش web app — ارجع رسالة واضحة
    if (!result.supported) {
      const c = result.classification;
      return NextResponse.json({
        success: false,
        supported: false,
        repoType: c.type,
        error: `التطبيق ده مش static web app ❌`,
        reason: c.reason,
        howToRun: c.howToRun,
        repoInfo: {
          owner: parsed.owner,
          repo: parsed.repo,
          fileCount: files.size,
        },
      }, { status: 422 });
    }

    const appData = result.app;

    // 4. احفظ في DB
    const dbApp = await db.anzaroApp.create({
      data: {
        githubUrl,
        repoName: parsed.repo,
        repoOwner: parsed.owner,
        appName: appData.appName,
        displayName: appData.displayName,
        description: appData.description,
        icon: appData.icon,
        category: appData.category,
        frontendHtml: appData.frontendHtml,
        backendCode: appData.backendCode,
        apiRoutes: appData.apiRoutes,
        sourceFiles: JSON.stringify(Array.from(files.values()).map((f) => ({ path: f.path, content: f.content.slice(0, 5000) }))),
        aiReview: appData.aiReview,
        fileCount: files.size,
        status: "approved",
        submittedBy: user.email,
      },
    });

    return NextResponse.json({
      success: true,
      supported: true,
      app: dbApp,
      message: `تم سحب ${files.size} ملف وتحويلها لتطبيق "${appData.displayName}" ✅ (بدون AI) — جاهز على /app/${appData.appName}`,
    });
  } catch (error: any) {
    console.error("[GitHub App Import] Error:", error);
    return NextResponse.json({ error: error?.message || "حصل خطأ أثناء السحب" }, { status: 500 });
  }
}
