/**
 * POST /api/hermes/chat
 * بيـ send message لـ Hermes Agent ويرجّع الـ response.
 *
 * V.162: Default = Platform Models (always works)
 * If Hermes is installed + has API key, use Hermes.
 * Otherwise, fallback to platform models (ZAI, OpenRouter).
 */

import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import { existsSync } from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

const HERMES_BIN = path.join(process.env.HOME || "/root", ".local", "bin", "hermes");
const HERMES_HOME = process.env.HERMES_HOME || path.join(process.env.HOME || "/root", ".hermes");

interface HermesChatRequest {
  message: string;
  session_id?: string;
  model?: string;
  toolsets?: string;
  skills?: string;
  yolo?: boolean;
  use_platform_model?: boolean;
}

export async function POST(req: NextRequest) {
  try {
    const body: HermesChatRequest = await req.json();
    const { message, session_id, model, toolsets, skills, yolo } = body;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { success: false, error: "message required" },
        { status: 400 }
      );
    }

    const startTime = Date.now();

    // ─── 1. Try Hermes first (if installed) ──────────
    const hermesInstalled = existsSync(HERMES_BIN);

    if (hermesInstalled) {
      try {
        const result = await runHermes(message, {
          model,
          toolsets,
          skills,
          yolo: yolo ?? true,
          session_id,
        });

        if (result.success && result.output) {
          return NextResponse.json({
            success: true,
            response: result.output,
            error: result.error,
            session_id: session_id || `hermes_${Date.now()}`,
            duration_ms: Date.now() - startTime,
            hermes_version: result.version,
            source: "hermes-native",
          });
        }
      } catch (hermesErr: any) {
        console.log("[Hermes] Native failed, trying platform:", hermesErr.message);
      }
    }

    // ─── 2. Fallback: Use Platform Models (always works) ──
    try {
      const platformResponse = await fetch(
        `http://localhost:${process.env.PORT || 3000}/api/chat/agent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: message,
            model: model || undefined,
            enableThinking: false,
          }),
          signal: AbortSignal.timeout(60000),
        }
      );

      if (platformResponse.ok) {
        const data = await platformResponse.json();
        return NextResponse.json({
          success: true,
          response: data.response || data.message || data.output || "No response",
          session_id: session_id || `hermes_platform_${Date.now()}`,
          duration_ms: Date.now() - startTime,
          hermes_version: "platform-bridge",
          model_used: model || "default",
          source: "platform-models",
          hermes_installed: hermesInstalled,
        });
      }
    } catch (platformErr: any) {
      console.log("[Hermes] Platform also failed:", platformErr.message);
    }

    // ─── 3. Last resort: return error ────────────────
    return NextResponse.json({
      success: false,
      error: hermesInstalled
        ? "Hermes installed but failed to respond. Check API keys in ~/.hermes/.env"
        : "Hermes not installed and platform models also failed. Check ZAI_API_KEY in .env",
      hermes_installed: hermesInstalled,
      duration_ms: Date.now() - startTime,
    }, { status: 500 });

  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 500 }
    );
  }
}

// ─── Hermes runner ─────────────────────────────────
async function runHermes(
  message: string,
  options: {
    model?: string;
    toolsets?: string;
    skills?: string;
    yolo?: boolean;
    session_id?: string;
  }
): Promise<{ success: boolean; output: string; error?: string; version?: string }> {
  const args: string[] = ["-z", message];

  if (options.model) args.push("-m", options.model);
  if (options.toolsets) args.push("-t", options.toolsets);
  if (options.skills) args.push("--skills", options.skills);
  if (options.yolo) args.push("--yolo");
  if (options.session_id) args.push("--resume", options.session_id);

  return new Promise((resolve) => {
    const env = {
      ...process.env,
      HERMES_HOME,
      PATH: `${HERMES_HOME}/bin:${process.env.PATH}`,
      HERMES_NONINTERACTIVE: "1",
      TERM: "dumb",
    };

    const proc = spawn(HERMES_BIN, args, {
      cwd: HERMES_HOME,
      env,
      stdio: ["pipe", "pipe", "pipe"],
      timeout: 90000,
    });

    let stdout = "";
    let stderr = "";

    proc.stdout.on("data", (d) => (stdout += d.toString()));
    proc.stderr.on("data", (d) => (stderr += d.toString()));

    const timer = setTimeout(() => {
      proc.kill("SIGKILL");
      resolve({ success: false, output: "", error: "Timeout" });
    }, 90000);

    proc.on("close", (code) => {
      clearTimeout(timer);
      const versionMatch = stderr.match(/Hermes Agent v([\d.]+)/);
      const version = versionMatch ? versionMatch[1] : undefined;

      if (code === 0 && stdout.trim()) {
        resolve({
          success: true,
          output: cleanOutput(stdout),
          version,
        });
      } else {
        resolve({
          success: false,
          output: "",
          error: stderr.slice(-300) || `Exit code ${code}`,
          version,
        });
      }
    });

    proc.on("error", (e) => {
      clearTimeout(timer);
      resolve({ success: false, output: "", error: e.message });
    });
  });
}

function cleanOutput(text: string): string {
  let cleaned = text.replace(/\x1b\[[0-9;]*[a-zA-Z]/g, "");
  cleaned = cleaned.replace(/[⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏]/g, "");
  cleaned = cleaned.replace(/\r/g, "");
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n");
  return cleaned.trim();
}
