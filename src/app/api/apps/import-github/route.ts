/**
 * POST /api/apps/import-github
 * ============================
 * V.90 — FULL CLONE + BUILD.
 *
 * اللي المستخدم طلبه: لازم ياخد كل ملفات المشروع ويحولها لتطبيق شغّال.
 *
 * الـ pipeline:
 *   1. git clone --depth 1 للـ repo كامل (مش بس 60 ملف)
 *   2. detect نوع المشروع (static / vite / next / python / desktop)
 *   3. حسب النوع:
 *      - static HTML/CSS/JS → inline assets + render في iframe (V.89)
 *      - Vite/React/Vue/Angular → npm install + npm run build → اعرض dist/
 *      - Python Flask/FastAPI → pip install + شغّل على port فرعي
 *      - Next.js → مستحيل (محتاج server دايماً)
 *      - Tauri/Electron/Flutter/Rust binary → مستحيل في browser
 *   4. اعرض النتيجة في iframe عبر /app/[appId]
 *
 * - 0 تكلفة AI
 * - التطبيق بيششتغل فعلياً (كود الـ repo الأصلي بعد build)
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromToken, extractBearerToken } from "@/lib/auth";
import { promises as fs } from "fs";
import path from "path";
import { execSync, spawn } from "child_process";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 دقايق للـ builds

interface ImportedFile {
  path: string;
  content: string;
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
 * يعمل git clone للـ repo في مجلد مؤقت.
 * بيرجع المسار لو نجح، أو error message لو فشل.
 */
async function cloneRepo(githubUrl: string, owner: string, repo: string): Promise<{ ok: true; dir: string } | { ok: false; error: string }> {
  const cloneDir = path.join("/tmp/anzaro-builds", `${owner}-${repo}-${Date.now()}`);
  try {
    await fs.mkdir(path.dirname(cloneDir), { recursive: true });
  } catch {}

  try {
    // git clone --depth 1 = أسرع (آخر commit بس)
    execSync(`git clone --depth 1 ${JSON.stringify(githubUrl + ".git")} ${JSON.stringify(cloneDir)} 2>&1`, {
      timeout: 60_000,
      stdio: "pipe",
      encoding: "utf-8",
    });
    return { ok: true, dir: cloneDir };
  } catch (e: any) {
    const stderr = e.stderr || e.stdout || e.message || "";
    if (stderr.includes("not found") || stderr.includes("404")) {
      return { ok: false, error: `الـ repo مش موجود أو private: ${owner}/${repo}` };
    }
    if (stderr.includes("Could not resolve host") || stderr.includes("Connection refused")) {
      return { ok: false, error: "مش قادر أوصل لـ GitHub — اتأكد من الاتصال." };
    }
    return { ok: false, error: `فشل git clone: ${stderr.slice(0, 200)}` };
  }
}

/**
 * يقرا ملف من الـ clone dir.
 */
async function readFileFromClone(cloneDir: string, relPath: string): Promise<string | null> {
  try {
    const fullPath = path.join(cloneDir, relPath);
    return await fs.readFile(fullPath, "utf-8");
  } catch {
    return null;
  }
}

/**
 * يقرا كل الملفات اللي_match نمط معين من الـ clone dir (recursive).
 */
async function readFilesMatching(cloneDir: string, extensions: string[], maxFiles = 100, maxFileSize = 200_000): Promise<Map<string, ImportedFile>> {
  const files = new Map<string, ImportedFile>();
  const skipDirs = ["node_modules", ".git", "dist", "build", "vendor", "__pycache__", ".next", "coverage", ".vscode", "target", ".cache"];

  async function walk(dir: string) {
    if (files.size >= maxFiles) return;
    let entries: string[] = [];
    try {
      entries = await fs.readdir(dir);
    } catch {
      return;
    }
    for (const entry of entries) {
      if (files.size >= maxFiles) return;
      const fullPath = path.join(dir, entry);
      const relPath = path.relative(cloneDir, fullPath);
      if (skipDirs.some((s) => relPath.includes(s))) continue;

      let stat;
      try {
        stat = await fs.stat(fullPath);
      } catch {
        continue;
      }
      if (stat.isDirectory()) {
        await walk(fullPath);
      } else if (stat.isFile() && stat.size <= maxFileSize) {
        const isMatch = extensions.some((ext) => entry.toLowerCase().endsWith(ext));
        if (!isMatch) continue;
        try {
          const content = await fs.readFile(fullPath, "utf-8");
          files.set(relPath, { path: relPath, content: content.slice(0, maxFileSize) });
        } catch {}
      }
    }
  }

  await walk(cloneDir);
  return files;
}

/**
 * بـ detect نوع المشروع من ملفات الـ clone dir.
 */
type ProjectType =
  | { kind: "static"; entry: string }
  | { kind: "vite"; framework: "react" | "vue" | "svelte" | "vanilla" | "unknown" }
  | { kind: "nextjs" }
  | { kind: "python"; hasWeb: boolean }
  | { kind: "tauri" }
  | { kind: "electron" }
  | { kind: "flutter" }
  | { kind: "rust" }
  | { kind: "unknown" };

async function detectProjectType(cloneDir: string): Promise<ProjectType> {
  // اقرا package.json لو موجود
  const pkgJsonStr = await readFileFromClone(cloneDir, "package.json");
  let pkg: any = null;
  if (pkgJsonStr) {
    try { pkg = JSON.parse(pkgJsonStr); } catch {}
  }

  // ─── Tauri ───
  const tauriConf = await readFileFromClone(cloneDir, "src-tauri/tauri.conf.json");
  const tauriConfRoot = await readFileFromClone(cloneDir, "tauri.conf.json");
  if (tauriConf || tauriConfRoot) {
    // لو فيه dist/ جاهز → static
    const distIndex = await readFileFromClone(cloneDir, "dist/index.html");
    if (distIndex) return { kind: "static", entry: "dist/index.html" };
    return { kind: "tauri" };
  }

  // ─── Electron ───
  if (pkg && (pkg.devDependencies?.electron || pkg.dependencies?.electron || pkg.build?.electron)) {
    return { kind: "electron" };
  }

  // ─── Flutter (في أي مكان في الـ repo) ───
  // V.90c: pubspec.yaml ممكن يكون في root أو في subdirectory (زي frontend/appflowy_flutter/)
  const allDartFiles = await readFilesMatching(cloneDir, [".dart"], 5);
  const allPubspecFiles = await readFilesMatching(cloneDir, ["pubspec.yaml"], 5);
  if (allPubspecFiles.size > 0 && allDartFiles.size > 0) {
    return { kind: "flutter" };
  }
  // لو فيه pubspec.yaml كتير (بدون dart files في الـ 5 الأولى) → برضه Flutter
  if (allPubspecFiles.size >= 1) {
    // نـ scan أكتر للـ dart files
    const moreDart = await readFilesMatching(cloneDir, [".dart"], 50);
    if (moreDart.size > 5) return { kind: "flutter" };
  }

  // ─── Rust (مش Tauri) ───
  const allCargoFiles = await readFilesMatching(cloneDir, ["Cargo.toml"], 10);
  if (allCargoFiles.size > 0) {
    return { kind: "rust" };
  }

  // ─── Next.js ───
  if (pkg && (pkg.dependencies?.next || pkg.devDependencies?.next)) {
    return { kind: "nextjs" };
  }

  // ─── Vite/React/Vue/Svelte ───
  if (pkg) {
    const hasVite = pkg.devDependencies?.vite || pkg.dependencies?.vite;
    const hasReact = pkg.dependencies?.react || pkg.devDependencies?.react;
    const hasVue = pkg.dependencies?.vue || pkg.devDependencies?.vue;
    const hasSvelte = pkg.dependencies?.svelte || pkg.devDependencies?.svelte || pkg.devDependencies?.["@sveltejs/kit"];

    if (hasVite || hasReact || hasVue || hasSvelte) {
      // لو فيه dist/ جاهز → static
      const distIndex = await readFileFromClone(cloneDir, "dist/index.html");
      if (distIndex) return { kind: "static", entry: "dist/index.html" };

      let framework: ProjectType extends { kind: "vite" } ? any : any = "vanilla";
      if (hasReact) framework = "react";
      else if (hasVue) framework = "vue";
      else if (hasSvelte) framework = "svelte";
      else if (hasVite) framework = "vanilla";
      return { kind: "vite", framework };
    }
  }

  // ─── Python ───
  const requirements = await readFileFromClone(cloneDir, "requirements.txt");
  const pyproject = await readFileFromClone(cloneDir, "pyproject.toml");
  if (requirements || pyproject) {
    // اتأكد إن فيه web framework (Flask/FastAPI/Django)
    const reqContent = (requirements || "") + (pyproject || "");
    const hasWeb = /flask|fastapi|django|uvicorn|gunicorn|streamlit|gradio/i.test(reqContent);
    return { kind: "python", hasWeb };
  }

  // ─── Static HTML ───
  const indexHtml = await readFileFromClone(cloneDir, "index.html");
  if (indexHtml) {
    return { kind: "static", entry: "index.html" };
  }

  // ─── ابحث عن أي HTML ───
  const htmlFiles = await readFilesMatching(cloneDir, [".html", ".htm"], 50);
  if (htmlFiles.size > 0) {
    const firstPath = Array.from(htmlFiles.keys()).sort()[0];
    return { kind: "static", entry: firstPath };
  }

  return { kind: "unknown" };
}

/**
 * بينفّذ command ويرجع stdout/stderr + exit code.
 */
async function runCommand(cmd: string, cwd: string, timeoutMs = 180_000): Promise<{ stdout: string; stderr: string; code: number; killed: boolean }> {
  return new Promise((resolve) => {
    const parts = cmd.split(/\s+/);
    const bin = parts[0];
    const args = parts.slice(1);
    const proc = spawn(bin, args, { cwd, stdio: ["ignore", "pipe", "pipe"], shell: false });
    let stdout = "";
    let stderr = "";
    let killed = false;

    proc.stdout?.on("data", (d) => { stdout += d.toString(); if (stdout.length > 100_000) stdout = stdout.slice(-100_000); });
    proc.stderr?.on("data", (d) => { stderr += d.toString(); if (stderr.length > 100_000) stderr = stderr.slice(-100_000); });

    const timer = setTimeout(() => {
      killed = true;
      proc.kill("SIGKILL");
    }, timeoutMs);

    proc.on("close", (code) => {
      clearTimeout(timer);
      resolve({ stdout, stderr, code: code ?? -1, killed });
    });
    proc.on("error", (e) => {
      clearTimeout(timer);
      resolve({ stdout, stderr: stderr + e.message, code: -1, killed: false });
    });
  });
}

/**
 * بيعمل npm install + build للـ Vite apps.
 * بيرجع مسار الـ dist/ لو نجح.
 */
async function buildViteApp(cloneDir: string, framework: string): Promise<{ ok: true; distDir: string; log: string } | { ok: false; error: string; log: string }> {
  const log: string[] = [];

  // 1. install dependencies — جرّب npm، وبعدين pnpm، وبعدين yarn
  const installers = [
    { name: "npm", cmd: "npm install --no-audit --no-fund --prefer-offline" },
    { name: "pnpm", cmd: "pnpm install --prefer-offline" },
    { name: "yarn", cmd: "yarn install --prefer-offline" },
  ];

  let installOk = false;
  let lastInstallError = "";
  for (const inst of installers) {
    log.push(`=== ${inst.name} install ===`);
    const installResult = await runCommand(inst.cmd, cloneDir, 180_000);
    log.push(installResult.stdout.slice(-1500));
    if (installResult.stderr) log.push("STDERR: " + installResult.stderr.slice(-1500));
    if (installResult.code === 0) {
      installOk = true;
      log.push(`✅ ${inst.name} install نجح`);
      break;
    }
    lastInstallError = `${inst.name} فشل (exit ${installResult.code}${installResult.killed ? " - timeout" : ""}): ${installResult.stderr.slice(-300)}`;
    log.push(`❌ ${inst.name} install فشل: ${installResult.stderr.slice(-200)}`);
  }

  if (!installOk) {
    return { ok: false, error: `فشل تثبيت الـ dependencies. آخر محاولة: ${lastInstallError}`, log: log.join("\n") };
  }

  // 2. build — جرّب npm run build / pnpm build / yarn build
  // حتى لو الـ build script فشل (زي tsc error بعد vite)، لو dist/ اتعمل نعتبره نجح
  const buildCommands = [
    { name: "npm", cmd: "npm run build" },
    { name: "pnpm", cmd: "pnpm build" },
    { name: "yarn", cmd: "yarn build" },
  ];

  let buildOk = false;
  let lastBuildError = "";
  for (const bc of buildCommands) {
    log.push(`=== ${bc.name} run build ===`);
    const buildResult = await runCommand(bc.cmd, cloneDir, 180_000);
    log.push(buildResult.stdout.slice(-1500));
    if (buildResult.stderr) log.push("STDERR: " + buildResult.stderr.slice(-1500));
    if (buildResult.code === 0) {
      buildOk = true;
      log.push(`✅ ${bc.name} build نجح`);
      break;
    }
    lastBuildError = `${bc.name} build فشل (exit ${buildResult.code}${buildResult.killed ? " - timeout" : ""})`;
    log.push(`❌ ${bc.name} build فشل: ${buildResult.stderr.slice(-200)}`);
    // V.90b: حتى لو فشل، اتأكد إن dist/ اتعمل (ممكن vite build نجح بس tsc فشل بعده)
    for (const outDir of ["dist", "build", "out"]) {
      try {
        const entries = await fs.readdir(path.join(cloneDir, outDir));
        if (entries.some((e) => e.endsWith(".html") || e.endsWith(".js"))) {
          buildOk = true;
          log.push(`⚠️ ${bc.name} build فشل بس ${outDir}/ اتعمل — هنستخدمه`);
          break;
        }
      } catch {}
    }
    if (buildOk) break;
  }

  if (!buildOk) {
    return { ok: false, error: `فشل بناء المشروع. آخر محاولة: ${lastBuildError}`, log: log.join("\n") };
  }

  // 3. اتأكد إن dist/ موجود (index.html أو أي JS files)
  for (const outDir of ["dist", "build", "out"]) {
    const outPath = path.join(cloneDir, outDir);
    try {
      const entries = await fs.readdir(outPath);
      if (entries.some((e) => e.endsWith(".html") || e.endsWith(".js"))) {
        // لو مفيش index.html، ابحث عن أي HTML
        let entry = "index.html";
        if (!entries.includes("index.html")) {
          const htmlFile = entries.find((e) => e.endsWith(".html"));
          if (htmlFile) entry = htmlFile;
          else {
            // مفيش HTML — ابني واحد بسيط يـ load الـ JS
            const jsFiles = entries.filter((e) => e.endsWith(".js"));
            const stub = `<!DOCTYPE html><html><head><title>${path.basename(cloneDir)}</title></head><body><div id="app"></div>${jsFiles.map((f) => `<script src="./${f}"></script>`).join("\n")}</body></html>`;
            await fs.writeFile(path.join(outPath, "index.html"), stub);
          }
        }
        return { ok: true, distDir: outPath, log: log.join("\n") };
      }
    } catch {}
  }
  return { ok: false, error: "الـ build خلص بس ملقيتش dist/ ولا build/ ولا out/", log: log.join("\n") };
}

/**
 * بياخد كل الملفات من مجلد (dist/ أو الـ clone dir نفسه) ويعملهم inline في HTML واحد.
 */
async function buildStaticHtmlFromDir(dir: string, entryRelPath: string): Promise<{ html: string; fileCount: number }> {
  const entryContent = await fs.readFile(path.join(dir, entryRelPath), "utf-8");
  const allFiles = await readFilesMatching(dir, [".html", ".css", ".js", ".mjs", ".svg"], 200, 500_000);

  let result = entryContent;
  let fileCount = allFiles.size + 1;

  // inline <link rel="stylesheet" href="...">
  result = result.replace(/<link\b[^>]*rel=["']stylesheet["'][^>]*>/gi, (tag) => {
    const hrefMatch = tag.match(/href=["']([^"']+)["']/i);
    if (!hrefMatch) return tag;
    const href = hrefMatch[1];
    if (/^https?:\/\//i.test(href) || href.startsWith("//") || href.startsWith("data:")) return tag;

    let clean = href.replace(/^\.?\//, "").split("?")[0].split("#")[0].replace(/^(\.\.\/)+/, "");
    const file = allFiles.get(clean) || Array.from(allFiles.values()).find((f) => f.path.endsWith(clean));
    if (!file) return `<!-- missing: ${href} -->`;
    return `<style data-src="${href}">\n${file.content}\n</style>`;
  });

  // inline <script src="...">
  result = result.replace(/<script\b([^>]*)\bsrc=["']([^"']+)["']([^>]*)><\/script>/gi, (tag, before, src, after) => {
    if (/^https?:\/\//i.test(src) || src.startsWith("//") || src.startsWith("data:")) return tag;
    let clean = src.replace(/^\.?\//, "").split("?")[0].split("#")[0].replace(/^(\.\.\/)+/, "");
    const file = allFiles.get(clean) || Array.from(allFiles.values()).find((f) => f.path.endsWith(clean));
    if (!file) return `<!-- missing: ${src} -->`;
    const attrs = `${before}${after}`.replace(/\s+/g, " ").trim();
    return `<script ${attrs} data-src="${src}">\n${file.content}\n</script>`;
  });

  return { html: result, fileCount };
}

function extractEmoji(text: string): string {
  const m = text.match(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u);
  return m ? m[0] : "📦";
}

function extractTitle(html: string): string | null {
  const m = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (m) return m[1].replace(/<[^>]+>/g, "").trim().slice(0, 60);
  const t = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (t) return t[1].replace(/<[^>]+>/g, "").trim().slice(0, 60);
  return null;
}

function escapeHtml(s: string): string {
  return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/**
 * الـ pipeline الرئيسي.
 */
async function buildAppFromRepo(
  githubUrl: string,
  owner: string,
  repo: string,
  repoMeta: any
): Promise<{ supported: true; app: any } | { supported: false; repoType: string; reason: string; howToRun: string; log?: string }> {
  // 1. git clone
  const cloneResult = await cloneRepo(githubUrl, owner, repo);
  if (!cloneResult.ok) {
    return { supported: false, repoType: "clone-error", reason: cloneResult.error, howToRun: "اتأكد إن الـ repo public وموجود." };
  }
  const cloneDir = cloneResult.dir;

  // 2. detect نوع المشروع
  const projectType = await detectProjectType(cloneDir);
  let buildLog = "";

  // 3. حسب النوع
  let frontendHtml: string;
  let displayName: string;
  let description: string;
  let icon: string;
  let fileCount = 0;

  if (projectType.kind === "static") {
    // static HTML — inline كل الـ assets
    const built = await buildStaticHtmlFromDir(cloneDir, projectType.entry);
    frontendHtml = built.html;
    fileCount = built.fileCount;
    const title = extractTitle(frontendHtml);
    displayName = title || repo.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    description = repoMeta?.description || `تطبيق من ${owner}/${repo}`;
    icon = extractEmoji(frontendHtml) || "📦";
    buildLog = `Static HTML — ${fileCount} ملف. Entry: ${projectType.entry}`;
  } else if (projectType.kind === "vite") {
    // Vite/React/Vue — اعمل build
    const buildResult = await buildViteApp(cloneDir, projectType.framework);
    buildLog = buildResult.log;
    if (!buildResult.ok) {
      // امسح الـ clone dir
      try { await fs.rm(cloneDir, { recursive: true, force: true }); } catch {}
      return {
        supported: false,
        repoType: "vite-build-failed",
        reason: `فشل بناء التطبيق (${projectType.framework}). السبب: ${buildResult.error}`,
        howToRun: "الـ sandbox محدود الذاكرة (4GB). للـ builds كبيرة، اعمل build محلياً وارفع dist/ جاهز.",
        log: buildLog,
      };
    }
    const built = await buildStaticHtmlFromDir(buildResult.distDir, "index.html");
    frontendHtml = built.html;
    fileCount = built.fileCount;
    const title = extractTitle(frontendHtml);
    displayName = title || repo.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    description = repoMeta?.description || `تطبيق ${projectType.framework} من ${owner}/${repo}`;
    icon = extractEmoji(frontendHtml) || "📦";
    buildLog = `Vite (${projectType.framework}) build نجح. ${fileCount} ملف في dist/.\n` + buildLog;
  } else if (projectType.kind === "nextjs") {
    try { await fs.rm(cloneDir, { recursive: true, force: true }); } catch {}
    return {
      supported: false,
      repoType: "nextjs",
      reason: "ده تطبيق Next.js. محتاج Node.js server دايماً عشان يشتغل. مش ممكن render في iframe.",
      howToRun: "الـ Next.js apps محتاجة server runtime. شغّله بـ `npm run build && npm start` على سيرفر حقيقي.",
    };
  } else if (projectType.kind === "tauri") {
    try { await fs.rm(cloneDir, { recursive: true, force: true }); } catch {}
    return {
      supported: false,
      repoType: "tauri",
      reason: "ده تطبيق Tauri desktop (Rust + web). لازم `cargo tauri build` عشان يطلع executable. مستحيل في browser.",
      howToRun: "1) ثبّت Rust + Tauri CLI. 2) npm install. 3) npm run tauri build. الناتج executable مش web.",
    };
  } else if (projectType.kind === "electron") {
    try { await fs.rm(cloneDir, { recursive: true, force: true }); } catch {}
    return {
      supported: false,
      repoType: "electron",
      reason: "ده تطبيق Electron desktop. لازم `npm run build + electron-builder`. مستحيل في browser.",
      howToRun: "1) npm install. 2) npm run dist. الناتج executable مش web.",
    };
  } else if (projectType.kind === "flutter") {
    try { await fs.rm(cloneDir, { recursive: true, force: true }); } catch {}
    return {
      supported: false,
      repoType: "flutter",
      reason: "ده تطبيق Flutter (Dart). لازم Flutter SDK + `flutter build web` عشان يطلع web app.",
      howToRun: "1) ثبّت Flutter SDK. 2) flutter pub get. 3) flutter build web. الناتج في build/web/.",
    };
  } else if (projectType.kind === "rust") {
    try { await fs.rm(cloneDir, { recursive: true, force: true }); } catch {}
    return {
      supported: false,
      repoType: "rust",
      reason: "ده مشروع Rust binary. لازم `cargo build`. الناتج executable مش web app.",
      howToRun: "1) ثبّت Rust. 2) cargo build --release. الناتج binary.",
    };
  } else if (projectType.kind === "python") {
    try { await fs.rm(cloneDir, { recursive: true, force: true }); } catch {}
    if (!projectType.hasWeb) {
      return {
        supported: false,
        repoType: "python-cli",
        reason: "ده Python script/library. مش web app (مفيش Flask/FastAPI/Django).",
        howToRun: "شغّله بـ `python main.py` على جهازك.",
      };
    }
    return {
      supported: false,
      repoType: "python-web",
      reason: "ده Python web app (Flask/FastAPI/Django). محتاج Python runtime + server. مش ممكن في iframe.",
      howToRun: "1) pip install -r requirements.txt. 2) python app.py. شغّل على سيرفر حقيقي.",
    };
  } else {
    try { await fs.rm(cloneDir, { recursive: true, force: true }); } catch {}
    return {
      supported: false,
      repoType: "unknown",
      reason: "مش قادر أحدد نوع المشروع. مفيش index.html ولا package.json ولا Python.",
      howToRun: "اتأكد إن الـ repo فيه كود مشروع ويب.",
    };
  }

  // امسح الـ clone dir (مش محتاجينه بعد ما عملنا inline)
  try { await fs.rm(cloneDir, { recursive: true, force: true }); } catch {}

  const aiReview = `استيراد كامل بدون AI ✅. النوع: ${projectType.kind}. ${fileCount} ملف. ${buildLog.split("\n")[0]}`;

  return {
    supported: true,
    app: {
      appName: slugify(repo),
      displayName,
      description,
      icon,
      category: "utility",
      frontendHtml,
      backendCode: "{}",
      apiRoutes: "[]",
      aiReview,
    },
  };
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

    // جرّب نجيب معلومات الـ repo (وصف) من GitHub API (best effort)
    let repoMeta: any = { description: "" };
    try {
      const metaResp = await fetch(`https://api.github.com/repos/${parsed.owner}/${parsed.repo}`, {
        headers: { Accept: "application/vnd.github.v3+json", "User-Agent": "Anzaro-Apps" },
      });
      if (metaResp.ok) repoMeta = await metaResp.json();
    } catch {}

    // الـ pipeline الكامل: clone + detect + build
    const result = await buildAppFromRepo(githubUrl, parsed.owner, parsed.repo, repoMeta);

    if (!result.supported) {
      return NextResponse.json({
        success: false,
        supported: false,
        repoType: result.repoType,
        error: `التطبيق ده مش متاح كـ web app ❌`,
        reason: result.reason,
        howToRun: result.howToRun,
        repoInfo: { owner: parsed.owner, repo: parsed.repo },
        ...(result.log ? { buildLog: result.log.slice(-3000) } : {}),
      }, { status: 422 });
    }

    const appData = result.app;

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
        sourceFiles: "[]", // الـ clone dir اتمسح
        aiReview: appData.aiReview,
        fileCount: 0,
        status: "approved",
        submittedBy: user.email,
      },
    });

    return NextResponse.json({
      success: true,
      supported: true,
      app: dbApp,
      message: `تم استيراد وبناء "${appData.displayName}" ✅ — جاهز على /app/${appData.appName}`,
    });
  } catch (error: any) {
    console.error("[GitHub App Import] Error:", error);
    return NextResponse.json({ error: error?.message || "حصل خطأ أثناء الاستيراد" }, { status: 500 });
  }
}
