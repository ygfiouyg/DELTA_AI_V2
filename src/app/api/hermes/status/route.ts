/**
 * GET /api/hermes/status
 * بيـ check لو Hermes Agent متثبت و configured.
 */

import { NextResponse } from "next/server";
import { execSync } from "child_process";
import { existsSync, readFileSync, readdirSync } from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const hermesHome = process.env.HERMES_HOME || path.join(process.env.HOME || "/home/z", ".hermes");
    const hermesBin = path.join(process.env.HOME || "/home/z", ".local", "bin", "hermes");

    // Check if hermes binary exists and get version
    let hermesVersion: string | null = null;
    let hermesPath: string | null = null;
    try {
      const versionOutput = execSync(`${hermesBin} --version 2>&1`, {
        timeout: 10000,
        encoding: "utf-8",
        env: { ...process.env, HERMES_HOME: hermesHome },
      });
      const versionMatch = versionOutput.match(/Hermes Agent v([\d.]+)/);
      hermesVersion = versionMatch ? versionMatch[1] : null;
      hermesPath = hermesBin;
    } catch {
      hermesVersion = null;
    }

    // Check config files
    const configPath = path.join(hermesHome, "config.yaml");
    const envPath = path.join(hermesHome, ".env");
    const hasConfig = existsSync(configPath);
    const hasEnvFile = existsSync(envPath);

    // Check for configured API keys
    let configuredProviders: string[] = [];
    if (hasEnvFile) {
      const envContent = readFileSync(envPath, "utf-8");
      const keyMap: Record<string, string> = {
        OPENAI_API_KEY: "openai",
        OPENROUTER_API_KEY: "openrouter",
        ANTHROPIC_API_KEY: "anthropic",
        FIREWORKS_API_KEY: "fireworks",
        XAI_API_KEY: "xai",
        GOOGLE_API_KEY: "google",
        DEEPINFRA_API_KEY: "deepinfra",
        TOGETHER_API_KEY: "together",
        GROQ_API_KEY: "groq",
      };
      for (const [envKey, provider] of Object.entries(keyMap)) {
        const regex = new RegExp(`^${envKey}=.+`, "m");
        if (regex.test(envContent) && !envContent.match(new RegExp(`^${envKey}=\\s*$`, "m"))) {
          configuredProviders.push(provider);
        }
      }
    }

    // Check code installation
    const codePath = path.join(hermesHome, "hermes-agent");
    const hasCode = existsSync(codePath);

    // Count skills
    const skillsPath = path.join(hermesHome, "skills");
    let skillsCount = 0;
    if (existsSync(skillsPath)) {
      try {
        skillsCount = readdirSync(skillsPath).filter((d) =>
          !d.startsWith(".") && existsSync(path.join(skillsPath, d, "SKILL.md"))
        ).length;
      } catch {}
    }

    return NextResponse.json({
      success: true,
      installed: hermesVersion !== null,
      version: hermesVersion,
      path: hermesPath,
      hermes_home: hermesHome,
      has_config: hasConfig,
      has_env: hasEnvFile,
      has_code: hasCode,
      configured_providers: configuredProviders,
      providers_count: configuredProviders.length,
      is_ready: hermesVersion !== null && configuredProviders.length > 0,
      skills_count: skillsCount,
      message: hermesVersion
        ? configuredProviders.length > 0
          ? `Hermes ${hermesVersion} ready with ${configuredProviders.length} provider(s)`
          : `Hermes ${hermesVersion} installed but no API key configured`
        : "Hermes not installed",
    });
  } catch (e: any) {
    return NextResponse.json({
      success: false,
      installed: false,
      error: e.message,
    });
  }
}
