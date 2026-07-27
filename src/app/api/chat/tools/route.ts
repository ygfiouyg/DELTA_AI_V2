/**
 * POST /api/chat/tools
 * V.102: Native Function Calling endpoint using llm_loop.py
 */

import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken, extractBearerToken } from "@/lib/auth";
import { spawn } from "child_process";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function POST(request: NextRequest) {
  try {
    const token = extractBearerToken(request.headers.get("Authorization"));
    const user = token ? await getUserFromToken(token) : null;
    if (!user) {
      return NextResponse.json({ error: "مطلوب تسجيل الدخول" }, { status: 401 });
    }

    const body = await request.json();
    const { message, systemPrompt, conversationHistory } = body as {
      message: string;
      systemPrompt?: string;
      conversationHistory?: Array<{ role: string; content: string }>;
    };

    if (!message) {
      return NextResponse.json({ error: "message required" }, { status: 400 });
    }

    const scriptPath = path.join(process.cwd(), "scripts", "llm_loop.py");
    const exists = await fs.access(scriptPath).then(() => true).catch(() => false);
    if (!exists) {
      return NextResponse.json({ error: "llm_loop.py not found" }, { status: 404 });
    }

    const pythonInput = JSON.stringify({
      message,
      system_prompt: systemPrompt || "أنت مساعد ذكي. عندك tools متاحة (text_to_speech, text_to_speech_neural, speech_to_text, execute_python, generate_chart, web_search, read_pdf, write_file, scrape_web, calculate_math, text_to_speech_cloning). استخدمها لما المستخدم يطلب. متقولش لا اقدر.",
      conversation_history: conversationHistory || [],
    });

    const result = await new Promise<string>((resolve, reject) => {
      // V.102: استخدم python3 من الـ venv الصح (اللي فيه كل packages)
      const pythonBin = process.env.PYTHON_BIN || "/home/z/.venv/bin/python3";
      const proc = spawn(pythonBin, [scriptPath], {
        cwd: process.cwd(),
        env: { ...process.env, PYTHONUNBUFFERED: "1" },
      });
      let stdout = "";
      let stderr = "";
      proc.stdout.on("data", (d) => { stdout += d.toString(); });
      proc.stderr.on("data", (d) => { stderr += d.toString(); });
      proc.stdin.write(pythonInput);
      proc.stdin.end();
      const timeout = setTimeout(() => {
        proc.kill("SIGKILL");
        reject(new Error("Timeout (110s)"));
      }, 110_000);
      proc.on("close", (code) => {
        clearTimeout(timeout);
        if (code === 0) resolve(stdout);
        else reject(new Error(stderr || `Exit ${code}`));
      });
      proc.on("error", (err) => { clearTimeout(timeout); reject(err); });
    });

    const events: any[] = [];
    for (const line of result.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith("{")) continue;
      try { events.push(JSON.parse(trimmed)); } catch {}
    }

    return NextResponse.json({ success: true, events, raw: result.substring(0, 5000) });
  } catch (error: any) {
    console.error("[Chat Tools] Error:", error);
    return NextResponse.json({ error: error?.message || "Internal error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    service: "chat-tools",
    version: "V.102",
    tools: [
      "web_search", "read_pdf", "write_file", "execute_python",
      "generate_chart", "text_to_speech", "text_to_speech_neural",
      "text_to_speech_cloning", "speech_to_text", "scrape_web", "calculate_math"
    ],
  });
}
