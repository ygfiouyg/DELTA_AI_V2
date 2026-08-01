/**
 * GET /api/hermes/models
 * بيـ رجّع الـ models المتاحة في Hermes Agent.
 */

import { NextResponse } from "next/server";
import { execSync } from "child_process";
import { existsSync, readFileSync } from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HERMES_BIN = path.join(process.env.HOME || "/home/z", ".local", "bin", "hermes");
const HERMES_HOME = process.env.HERMES_HOME || path.join(process.env.HOME || "/home/z", ".hermes");

// Curated list of popular models per provider
const POPULAR_MODELS: Record<string, Array<{ id: string; name: string; description: string }>> = {
  openai: [
    { id: "openai:gpt-4o", name: "GPT-4o", description: "Most capable OpenAI model" },
    { id: "openai:gpt-4o-mini", name: "GPT-4o Mini", description: "Fast and affordable" },
    { id: "openai:gpt-4-turbo", name: "GPT-4 Turbo", description: "Previous generation flagship" },
  ],
  anthropic: [
    { id: "anthropic:claude-opus-4.6", name: "Claude Opus 4.6", description: "Most capable Anthropic model" },
    { id: "anthropic:claude-sonnet-4", name: "Claude Sonnet 4", description: "Balanced performance" },
    { id: "anthropic:claude-3.5-haiku", name: "Claude 3.5 Haiku", description: "Fast and efficient" },
  ],
  openrouter: [
    { id: "openrouter:anthropic/claude-sonnet-4", name: "Claude Sonnet 4 (OpenRouter)", description: "Via OpenRouter" },
    { id: "openrouter:openai/gpt-4o", name: "GPT-4o (OpenRouter)", description: "Via OpenRouter" },
    { id: "openrouter:google/gemini-pro-1.5", name: "Gemini Pro 1.5 (OpenRouter)", description: "Via OpenRouter" },
    { id: "openrouter:meta-llama/llama-3.1-70b-instruct", name: "Llama 3.1 70B", description: "Open source" },
  ],
  fireworks: [
    { id: "fireworks:accounts/fireworks/models/kimi-k2p6", name: "Kimi K2", description: "Fireworks AI" },
    { id: "fireworks:accounts/fireworks/models/glm-5p2", name: "GLM 5.2", description: "Fireworks AI" },
  ],
  xai: [
    { id: "xai:grok-4", name: "Grok 4", description: "xAI's flagship model" },
    { id: "xai:grok-3", name: "Grok 3", description: "Previous generation" },
  ],
  google: [
    { id: "google:gemini-2.0-flash", name: "Gemini 2.0 Flash", description: "Fast and capable" },
    { id: "google:gemini-1.5-pro", name: "Gemini 1.5 Pro", description: "Most capable" },
  ],
  deepinfra: [
    { id: "deepinfra:meta-llama/Llama-3.3-70B-Instruct", name: "Llama 3.3 70B", description: "DeepInfra" },
  ],
  groq: [
    { id: "groq:llama-3.3-70b-versatile", name: "Llama 3.3 70B (Groq)", description: "Ultra-fast inference" },
  ],
};

export async function GET() {
  try {
    if (!existsSync(HERMES_BIN)) {
      return NextResponse.json({
        success: false,
        error: "Hermes not installed",
        models: [],
      });
    }

    // Check which providers are configured
    const envPath = path.join(HERMES_HOME, ".env");
    const configuredProviders: string[] = [];

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
          configuredProviders.push(provider);
        }
      }
    }

    // Read current model from config
    let currentModel = "anthropic/claude-opus-4.6";
    try {
      const configPath = path.join(HERMES_HOME, "config.yaml");
      if (existsSync(configPath)) {
        const config = readFileSync(configPath, "utf-8");
        const modelMatch = config.match(/default:\s*["']?([^"'\n]+)["']?/);
        if (modelMatch) currentModel = modelMatch[1];
      }
    } catch {}

    // Build models list
    const models: Array<{ provider: string; id: string; name: string; description: string; available: boolean }> = [];
    for (const [provider, providerModels] of Object.entries(POPULAR_MODELS)) {
      const isAvailable = configuredProviders.includes(provider);
      for (const m of providerModels) {
        models.push({
          provider,
          id: m.id,
          name: m.name,
          description: m.description,
          available: isAvailable,
        });
      }
    }

    return NextResponse.json({
      success: true,
      current_model: currentModel,
      configured_providers: configuredProviders,
      models,
      total: models.length,
      available_count: models.filter(m => m.available).length,
    });
  } catch (e: any) {
    return NextResponse.json({
      success: false,
      error: e.message,
      models: [],
    });
  }
}
