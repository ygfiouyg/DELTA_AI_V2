/**
 * POST /api/hermes/chat
 * بيـ send message لـ Hermes Agent ويرجّع الـ response.
 *
 * Body:
 *   {
 *     "message": "string",       // required — user message
 *     "session_id"?: "string",   // optional — for conversation continuity
 *     "model"?: "string",        // optional — override model
 *     "toolsets"?: "string",     // optional — comma-separated toolsets
 *     "skills"?: "string",       // optional — comma-separated skills
 *   }
 *
 * Response:
 *   {
 *     "success": true,
 *     "response": "string",
 *     "session_id": "string",
 *     "duration_ms": number
 *   }
 */

import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import { existsSync, mkdirSync } from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

const HERMES_BIN = path.join(process.env.HOME || "/home/z", ".local", "bin", "hermes");
const HERMES_HOME = process.env.HERMES_HOME || path.join(process.env.HOME || "/home/z", ".hermes");

interface HermesChatRequest {
  message: string;
  session_id?: string;
  model?: string;
  toolsets?: string;
  skills?: string;
  yolo?: boolean;
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

    // Check if Hermes is installed
    if (!existsSync(HERMES_BIN)) {
      return NextResponse.json({
        success: false,
        error: "Hermes Agent not installed. Run the installer first.",
        install_command: "curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash",
      }, { status: 503 });
    }

    // Build Hermes CLI arguments
    const args: string[] = ["-z", message];

    // Model override
    if (model) {
      args.push("-m", model);
    }

    // Toolsets
    if (toolsets) {
      args.push("-t", toolsets);
    }

    // Skills
    if (skills) {
      args.push("--skills", skills);
    }

    // YOLO mode (no approval prompts)
    if (yolo) {
      args.push("--yolo");
    }

    // Session resume
    if (session_id) {
      args.push("--resume", session_id);
    }

    // Execute Hermes
    const startTime = Date.now();
    const result = await runHermes(args);

    return NextResponse.json({
      success: result.success,
      response: result.output,
      error: result.error,
      session_id: session_id || `hermes_${Date.now()}`,
      duration_ms: Date.now() - startTime,
      hermes_version: result.version,
    });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 500 }
    );
  }
}

async function runHermes(args: string[], timeoutMs: number = 90000): Promise<{
  success: boolean;
  output: string;
  error?: string;
  version?: string;
}> {
  return new Promise((resolve) => {
    const env = {
      ...process.env,
      HERMES_HOME,
      PATH: `${HERMES_HOME}/bin:${process.env.PATH}`,
      // Ensure non-interactive mode
      HERMES_NONINTERACTIVE: "1",
      TERM: "dumb",
    };

    const proc = spawn(HERMES_BIN, args, {
      cwd: HERMES_HOME,
      env,
      stdio: ["pipe", "pipe", "pipe"],
      timeout: timeoutMs,
    });

    let stdout = "";
    let stderr = "";

    proc.stdout.on("data", (d) => {
      stdout += d.toString();
    });

    proc.stderr.on("data", (d) => {
      stderr += d.toString();
    });

    const timer = setTimeout(() => {
      proc.kill("SIGKILL");
      resolve({
        success: false,
        output: "",
        error: `Hermes timed out after ${timeoutMs}ms`,
      });
    }, timeoutMs);

    proc.on("close", (code) => {
      clearTimeout(timer);

      // Extract version from stderr if present
      const versionMatch = stderr.match(/Hermes Agent v([\d.]+)/);
      const version = versionMatch ? versionMatch[1] : undefined;

      if (code === 0) {
        // Clean output — remove ANSI codes and spinner artifacts
        const cleaned = cleanOutput(stdout);
        resolve({
          success: true,
          output: cleaned,
          version,
        });
      } else {
        // Check for common errors
        const errorText = stderr || stdout;
        let errorMsg = `Hermes exited with code ${code}`;

        if (errorText.includes("No inference provider configured")) {
          errorMsg = "Hermes has no API key configured. Set an API key in ~/.hermes/.env (e.g. OPENAI_API_KEY, OPENROUTER_API_KEY, ANTHROPIC_API_KEY)";
        } else if (errorText.includes("rate limit")) {
          errorMsg = "Rate limit hit. Please try again in a moment.";
        } else if (errorText.includes("authentication") || errorText.includes("unauthorized")) {
          errorMsg = "Authentication failed. Check your API key in Hermes config.";
        } else if (errorText.trim()) {
          errorMsg = errorText.slice(-500);
        }

        resolve({
          success: false,
          output: cleanOutput(stdout),
          error: errorMsg,
          version,
        });
      }
    });

    proc.on("error", (e) => {
      clearTimeout(timer);
      resolve({
        success: false,
        output: "",
        error: `Failed to spawn Hermes: ${e.message}`,
      });
    });
  });
}

function cleanOutput(text: string): string {
  // Remove ANSI escape codes
  let cleaned = text.replace(/\x1b\[[0-9;]*[a-zA-Z]/g, "");
  // Remove spinner characters
  cleaned = cleaned.replace(/[⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏]/g, "");
  // Remove carriage returns
  cleaned = cleaned.replace(/\r/g, "");
  // Collapse multiple newlines
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n");
  // Trim
  return cleaned.trim();
}
