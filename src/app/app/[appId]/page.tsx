/**
 * /app/[appId]
 * ============
 * صفحة بـ render أي Anzaro App في iframe sandboxed.
 *
 * V.88: الـ frontendHtml بقى self-contained (CSS + JS inline من الـ repo الأصلي).
 * بنتعامل مع حالتين:
 *   1. fragment (HTML جزئي) → بنحقنه في wrapper div
 *   2. مستند كامل (فيه <html>/<body>) → بنستخرج head + body وندمجهم
 */

import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function AppPage({ params }: { params: Promise<{ appId: string }> }) {
  const { appId } = await params;

  let app: any = null;
  try {
    app = await db.anzaroApp.findFirst({
      where: {
        OR: [{ appName: appId }, { id: appId }],
        status: "approved",
      },
    });
  } catch {
    // DB مش متاح
  }

  if (!app) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-400">
        <div className="text-center">
          <p className="text-2xl mb-2">🔍</p>
          <p className="text-sm">التطبيق غير موجود أو مش منشور</p>
          <a href="/" className="text-blue-500 text-xs mt-2 inline-block">العودة للرئيسية</a>
        </div>
      </div>
    );
  }

  const appDbId = app.id;
  let frontendHtml: string = app.frontendHtml || "<p>محتوى التطبيق غير متاح</p>";

  // لو الـ frontendHtml مستند HTML كامل، استخرج head + body
  let extraHead = "";
  const isFullDoc = /<html[\s>]/i.test(frontendHtml) && /<body[\s>]/i.test(frontendHtml);

  if (isFullDoc) {
    // استخرج محتوى الـ <head> (styles, meta, links)
    const headMatch = frontendHtml.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
    if (headMatch) {
      // خد بس <style>, <link>, <meta> — تجاهل <title> و <script> (الـ scripts هتاخدها من body)
      extraHead = headMatch[1]
        .replace(/<title[\s\S]*?<\/title>/gi, "")
        .replace(/<script[\s\S]*?<\/script>/gi, "")
        .trim();
    }
    // استخرج محتوى الـ <body>
    const bodyMatch = frontendHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch) {
      frontendHtml = bodyMatch[1].trim();
    }
  }

  // بـني الـ HTML الكامل.
  const fullHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(app.displayName)}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Cairo', 'Segoe UI', system-ui, sans-serif; background: #0a0a0a; color: #e4e4e7; }
    .anzaro-app-header {
      display: flex; align-items: center; gap: 8px;
      padding: 8px 16px; background: #18181b; border-bottom: 1px solid #27272a;
      position: sticky; top: 0; z-index: 10;
    }
    .anzaro-app-header .anzaro-icon { font-size: 16px; }
    .anzaro-app-header .anzaro-title { font-size: 14px; font-weight: 600; color: #e4e4e7; }
    .anzaro-app-header .anzaro-badge {
      margin-inline-start: auto; font-size: 10px; color: #52525b;
      background: #27272a; padding: 2px 8px; border-radius: 999px;
    }
    .anzaro-app-content { min-height: calc(100vh - 41px); }
  </style>
  ${extraHead}
  <script>
    // ── Communication Layer (في الـ head عشان يتعرف قبل أي script تاني) ──
    // مفيش AI هنا — مجرد fetch عادي للـ backend.
    window.anzaroCall = async function(functionName, args) {
      try {
        const resp = await fetch('/api/apps/${appDbId}/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ function: functionName, args: args || {} }),
        });
        const data = await resp.json();
        return data;
      } catch (e) {
        return { success: false, error: e.message };
      }
    };
  </script>
</head>
<body>
  <div class="anzaro-app-header">
    <span class="anzaro-icon">${app.icon || "📱"}</span>
    <span class="anzaro-title">${escapeHtml(app.displayName)}</span>
    <span class="anzaro-badge">Anzaro App</span>
  </div>
  <div class="anzaro-app-content">
    ${frontendHtml}
  </div>
</body>
</html>`;

  return (
    <div className="min-h-screen bg-zinc-950">
      <iframe
        srcDoc={fullHtml}
        className="w-full h-screen border-0"
        sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-modals"
        title={app.displayName}
      />
    </div>
  );
}

function escapeHtml(s: string): string {
  return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
