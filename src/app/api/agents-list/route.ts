/**
 * GET /api/agents-list
 * بيـ list كل الـ agents المتاحة في المنصة (Hermes + Custom + Massive Tools + Anzaro AI).
 *
 * V.147: Unified agents hub — كل الـ agents في مكان واحد.
 */

import { NextResponse } from "next/server";
import { existsSync, readFileSync, readdirSync } from "fs";
import path from "path";
import { execSync } from "child_process";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HERMES_BIN = path.join(process.env.HOME || "/home/z", ".local", "bin", "hermes");
const HERMES_HOME = process.env.HERMES_HOME || path.join(process.env.HOME || "/home/z", ".hermes");

export interface UnifiedAgent {
  id: string;
  name: string;
  nameAr?: string;
  description: string;
  descriptionAr?: string;
  icon: string;
  color: string;
  category: "external" | "custom" | "builtin";
  type: "hermes" | "anzaro" | "massive-tools" | "custom";
  available: boolean;
  endpoint: string;
  features?: string[];
  stats?: Record<string, any>;
  config?: Record<string, any>;
}

export async function GET() {
  try {
    const agents: UnifiedAgent[] = [];

    // ── 1. Hermes Agent ──────────────────────────────────
    let hermesVersion: string | null = null;
    let hermesProviders: string[] = [];
    let hermesSkillsCount = 0;

    try {
      const versionOutput = execSync(`${HERMES_BIN} --version 2>&1`, {
        timeout: 10000,
        encoding: "utf-8",
        env: { ...process.env, HERMES_HOME },
      });
      const versionMatch = versionOutput.match(/Hermes Agent v([\d.]+)/);
      hermesVersion = versionMatch ? versionMatch[1] : null;
    } catch {}

    // Check configured providers
    const envPath = path.join(HERMES_HOME, ".env");
    if (existsSync(envPath)) {
      const envContent = readFileSync(envPath, "utf-8");
      const keyMap: Record<string, string> = {
        OPENAI_API_KEY: "openai",
        OPENROUTER_API_KEY: "openrouter",
        ANTHROPIC_API_KEY: "anthropic",
        FIREWORKS_API_KEY: "fireworks",
        XAI_API_KEY: "xai",
        GOOGLE_API_KEY: "google",
        DEEPINFRA_API_KEY: "deepinfra",
        GROQ_API_KEY: "groq",
      };
      for (const [envKey, provider] of Object.entries(keyMap)) {
        const regex = new RegExp(`^${envKey}=.+`, "m");
        if (regex.test(envContent)) {
          hermesProviders.push(provider);
        }
      }
    }

    // Count skills
    const skillsPath = path.join(HERMES_HOME, "skills");
    if (existsSync(skillsPath)) {
      try {
        hermesSkillsCount = readdirSync(skillsPath).filter((d) =>
          !d.startsWith(".") && existsSync(path.join(skillsPath, d, "SKILL.md"))
        ).length;
      } catch {}
    }

    agents.push({
      id: "hermes-agent",
      name: "Hermes Agent",
      nameAr: "هيرمس",
      description: "Self-improving AI agent by NousResearch. Creates skills from experience, searches past conversations, builds user models. 70+ tools, 28 toolsets, 7 terminal backends.",
      descriptionAr: "وكيل ذكاء اصطناعي ذاتي التحسين من NousResearch. ينشئ مهارات من التجربة، يبحث في المحادثات السابقة، يبني نموذج مستخدم. 70+ أداة، 28 مجموعة أدوات.",
      icon: "☤",
      color: "from-purple-600 to-indigo-600",
      category: "external",
      type: "hermes",
      available: hermesVersion !== null,
      endpoint: "/api/hermes/chat",
      features: [
        "Self-improving skills",
        "70+ built-in tools",
        "Terminal (7 backends)",
        "Browser automation",
        "Memory & session search",
        "Cron scheduling",
        "Messaging gateway",
        "MCP integration",
      ],
      stats: {
        version: hermesVersion,
        providers: hermesProviders,
        providers_count: hermesProviders.length,
        skills_count: hermesSkillsCount,
        is_ready: hermesVersion !== null && hermesProviders.length > 0,
      },
      config: {
        hermes_home: HERMES_HOME,
        needs_api_key: hermesVersion !== null && hermesProviders.length === 0,
      },
    });

    // ── 2. Anzaro AI (built-in) ──────────────────────────
    agents.push({
      id: "anzaro-ai",
      name: "Anzaro AI",
      nameAr: "أنزارو",
      description: "The built-in Arabic AI assistant with tool-calling capabilities. Powered by ZAI. Supports 67+ agent tools, voice chat, and massive tool registry.",
      descriptionAr: "المساعد الذكي العربي المدمج مع إمكانية استدعاء الأدوات. مدعوم بـ ZAI. يدعم 67+ أداة، دردشة صوتية، وسجل أدوات ضخم.",
      icon: "🤖",
      color: "from-emerald-600 to-teal-600",
      category: "builtin",
      type: "anzaro",
      available: true,
      endpoint: "/api/chat/agent",
      features: [
        "67+ agent tools",
        "Arabic-first",
        "Voice chat",
        "Tool execution",
        "Streaming responses",
        "Guest mode",
      ],
      stats: {
        tools: 67,
        type: "zai-powered",
      },
    });

    // ── 3. Massive Tools Agent ───────────────────────────
    let massiveToolsCount = 0;
    let massiveInstalledCount = 0;
    try {
      const response = await fetch("http://localhost:3000/api/massive-tools/stats", {
        signal: AbortSignal.timeout(5000),
      });
      if (response.ok) {
        const data = await response.json();
        massiveToolsCount = data.tools?.total || 0;
        massiveInstalledCount = data.tools?.installed || 0;
      }
    } catch {}

    agents.push({
      id: "massive-tools-agent",
      name: "Massive Tools Agent",
      nameAr: "وكيل الأدوات الضخمة",
      description: "Agent with access to 861K+ tools registry. 73 callable implementations, 40 from GitHub repos, 410 installed packages. Dynamic package caller for any PyPI package.",
      descriptionAr: "وكيل مع وصول لـ 861 ألف+ أداة. 73 تطبيق قابل للاستدعاء، 40 من GitHub، 410 حزم مثبتة. مستدعي ديناميكي لأي حزمة PyPI.",
      icon: "🛠️",
      color: "from-orange-600 to-red-600",
      category: "builtin",
      type: "massive-tools",
      available: true,
      endpoint: "/api/massive-tools/exec",
      features: [
        "861K+ tools registry",
        "73 callable implementations",
        "40 GitHub-harvested tools",
        "Dynamic package caller",
        "Python + Node.js tools",
        "Real-time execution",
      ],
      stats: {
        total_tools: massiveToolsCount,
        installed: massiveInstalledCount,
        callable: 73,
      },
    });

    // ── 4. Custom Agents from DB ─────────────────────────
    try {
      const { db } = await import("@/lib/db");
      const customAgents = await db.customAgent.findMany({
        where: { isPublic: true },
        orderBy: [{ createdAt: "desc" }],
        take: 50,
      });

      for (const ca of customAgents) {
        const tools = JSON.parse(ca.toolsJson || "[]");
        const suggestions = ca.suggestionsJson ? JSON.parse(ca.suggestionsJson) : [];
        agents.push({
          id: ca.id,
          name: ca.name,
          nameAr: ca.nameEn || ca.name,
          description: ca.description,
          icon: ca.icon || "🤖",
          color: ca.color || "from-blue-600 to-purple-600",
          category: "custom",
          type: "custom",
          available: true,
          endpoint: "/api/chat/agent",
          features: tools,
          stats: {
            tools: tools.length,
            suggestions: suggestions.length,
          },
        });
      }
    } catch (dbError) {
      // DB might not be available
    }

    // ── Summary ──────────────────────────────────────────
    const summary = {
      total: agents.length,
      available: agents.filter(a => a.available).length,
      by_category: {
        external: agents.filter(a => a.category === "external").length,
        builtin: agents.filter(a => a.category === "builtin").length,
        custom: agents.filter(a => a.category === "custom").length,
      },
      by_type: agents.reduce((acc, a) => {
        acc[a.type] = (acc[a.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };

    return NextResponse.json({
      success: true,
      agents,
      summary,
    });
  } catch (e: any) {
    return NextResponse.json({
      success: false,
      error: e.message,
      agents: [],
    });
  }
}
