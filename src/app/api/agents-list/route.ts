/**
 * GET /api/agents-list
 * بيـ list كل الـ agents المتاحة في المنصة + كل الـ models.
 *
 * V.148: Updated — كل الـ agents (Hermes + Anzaro + Massive + Specialized + Recipes) + 32 models.
 */

import { NextResponse } from "next/server";
import { existsSync, readFileSync, readdirSync } from "fs";
import path from "path";
import { execSync } from "child_process";
import { models as PLATFORM_MODELS } from "@/lib/models";

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
  category: "external" | "custom" | "builtin" | "specialized";
  type: "hermes" | "anzaro" | "massive-tools" | "custom" | "specialized" | "recipe";
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
      descriptionAr: "وكيل ذكاء اصطناعي ذاتي التحسين من NousResearch. ينشئ مهارات من التجربة، يبحث في المحادثات السابقة. 70+ أداة، 28 مجموعة أدوات.",
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
      description: "The built-in Arabic AI assistant with tool-calling capabilities. Supports 67+ agent tools, voice chat, and massive tool registry.",
      descriptionAr: "المساعد الذكي العربي المدمج مع إمكانية استدعاء الأدوات. يدعم 67+ أداة، دردشة صوتية، وسجل أدوات ضخم.",
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
      descriptionAr: "وكيل مع وصول لـ 861 ألف+ أداة. 73 تطبيق قابل للاستدعاء، 40 من GitHub، 410 حزم مثبتة.",
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

    // ── 4. Specialized Agents ────────────────────────────
    const specializedAgents = [
      {
        id: "content_creator",
        name: "Content Creator",
        nameAr: "وكيل صناعة المحتوى",
        description: "Specialized agent for content creation — articles, social posts, scripts, marketing copy.",
        icon: "✍️",
        color: "from-pink-600 to-rose-600",
      },
      {
        id: "research_analyst",
        name: "Research Analyst",
        nameAr: "وكيل البحث والتحليل",
        description: "Specialized agent for research and analysis — data gathering, synthesis, insights.",
        icon: "🔬",
        color: "from-cyan-600 to-blue-600",
      },
      {
        id: "developer_helper",
        name: "Developer Helper",
        nameAr: "وكيل مساعدة المطور",
        description: "Specialized agent for development help — code review, debugging, architecture.",
        icon: "💻",
        color: "from-violet-600 to-purple-600",
      },
    ];

    for (const sa of specializedAgents) {
      agents.push({
        id: `specialized-${sa.id}`,
        name: sa.name,
        nameAr: sa.nameAr,
        description: sa.description,
        icon: sa.icon,
        color: sa.color,
        category: "specialized",
        type: "specialized",
        available: true,
        endpoint: "/api/agent/specialized",
        features: [
          "Tool-calling enabled",
          "MCP integration",
          "Streaming responses",
          "Multi-iteration reasoning",
        ],
        stats: {
          agentId: sa.id,
          maxIterations: 8,
        },
      });
    }

    // ── 5. Agent Recipes (10 preset agents) ──────────────
    const recipes = [
      { id: "video-pipeline", name: "Video Pipeline", nameAr: "خط إنتاج الفيديو", icon: "🎬", color: "from-red-600 to-orange-600" },
      { id: "content-marketing", name: "Content Marketing", nameAr: "وكيل التسويق بالمحتوى", icon: "📢", color: "from-amber-600 to-yellow-600" },
      { id: "research-analysis", name: "Research & Analysis", nameAr: "وكيل البحث والتحليل", icon: "📊", color: "from-blue-600 to-indigo-600" },
      { id: "code-review", name: "Code Review", nameAr: "وكيل مراجعة وتطوير الكود", icon: "🔍", color: "from-gray-600 to-slate-600" },
      { id: "email-automation", name: "Email Automation", nameAr: "وكيل أتمتة الإيميلات", icon: "📧", color: "from-green-600 to-emerald-600" },
      { id: "data-analysis", name: "Data Analysis", nameAr: "وكيل تحليل البيانات", icon: "📈", color: "from-purple-600 to-pink-600" },
      { id: "social-media-manager", name: "Social Media Manager", nameAr: "مدير السوشيال ميديا", icon: "📱", color: "from-fuchsia-600 to-pink-600" },
      { id: "customer-support", name: "Customer Support", nameAr: "وكيل دعم العملاء", icon: "🎧", color: "from-teal-600 to-cyan-600" },
      { id: "educational-content", name: "Educational Content", nameAr: "وكيل المحتوى التعليمي", icon: "📚", color: "from-lime-600 to-green-600" },
      { id: "youtube-automation", name: "YouTube Automation", nameAr: "وكيل أتمتة يوتيوب", icon: "▶️", color: "from-red-700 to-rose-700" },
    ];

    for (const r of recipes) {
      agents.push({
        id: `recipe-${r.id}`,
        name: r.name,
        nameAr: r.nameAr,
        description: `Preset agent recipe: ${r.nameAr}. Pre-configured with relevant tools and prompts.`,
        icon: r.icon,
        color: r.color,
        category: "builtin",
        type: "recipe",
        available: true,
        endpoint: "/api/agents/recipes",
        features: [
          "Pre-configured tools",
          "Optimized prompts",
          "One-click setup",
        ],
      });
    }

    // ── 6. Custom Agents from DB ─────────────────────────
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
    } catch {}

    // ── 7. Platform Models (32 models) ──────────────────
    const platformModels = PLATFORM_MODELS.map(m => ({
      id: m.id,
      name: m.name,
      nameEn: m.nameEn,
      icon: m.icon,
      category: m.category,
      provider: m.provider,
      realChatModel: m.realChatModel,
      maxTokens: m.maxTokens,
      openSource: m.openSource,
      capabilities: {
        chat: m.capabilities.chat,
        vision: m.capabilities.vision,
        imageGeneration: m.capabilities.imageGeneration,
        videoGeneration: m.capabilities.videoGeneration,
        codeGeneration: m.capabilities.codeGeneration,
        webSearch: m.capabilities.webSearch,
        functionCalling: m.capabilities.functionCalling,
        reasoning: m.capabilities.reasoning,
        largeContext: m.capabilities.largeContext,
      },
      skills: m.skills,
    }));

    // ── Summary ──────────────────────────────────────────
    const summary = {
      total_agents: agents.length,
      available_agents: agents.filter(a => a.available).length,
      by_category: {
        external: agents.filter(a => a.category === "external").length,
        builtin: agents.filter(a => a.category === "builtin").length,
        specialized: agents.filter(a => a.category === "specialized").length,
        custom: agents.filter(a => a.category === "custom").length,
      },
      by_type: agents.reduce((acc, a) => {
        acc[a.type] = (acc[a.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      models: {
        total: platformModels.length,
        by_category: platformModels.reduce((acc, m) => {
          acc[m.category] = (acc[m.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        by_provider: platformModels.reduce((acc, m) => {
          acc[m.provider] = (acc[m.provider] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
      },
    };

    return NextResponse.json({
      success: true,
      agents,
      models: platformModels,
      summary,
    });
  } catch (e: any) {
    return NextResponse.json({
      success: false,
      error: e.message,
      agents: [],
      models: [],
    });
  }
}
