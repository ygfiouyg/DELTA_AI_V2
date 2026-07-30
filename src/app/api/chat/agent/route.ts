/**
 * POST /api/chat/agent
 * بيـ ربط الـ chat بالـ Agent — لما المستخدم يكتب، الـ agent بيقرر هل يحتاج أداة ولا لأ
 *
 * body: { message: string, conversationHistory?: [] }
 * response: { response: string, tools_used: [], iterations: number }
 */

import { NextResponse } from "next/server";
import { runAgent, type AgentMessage } from "@/lib/agent/agent-engine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, conversationHistory } = body;

    if (!message) {
      return NextResponse.json({ error: "message required" }, { status: 400 });
    }

    // Run agent — it decides whether to call tools
    const result = await runAgent(
      message,
      undefined, // uses default system prompt with tools
      (conversationHistory || []) as AgentMessage[]
    );

    // Build response — compatible with chat UI
    const toolsUsed = result.tool_calls_made.map(tc => tc.name);
    const toolResults = result.tool_calls_made.map(tc => ({
      tool: tc.name,
      args: tc.args,
      result: tc.result.slice(0, 500),
    }));

    // If tools were used, append tool summary to response
    let finalResponse = result.response;
    if (toolsUsed.length > 0 && !finalResponse.includes("✅")) {
      const toolSummary = toolsUsed.map(t => `✅ ${t}`).join("\n");
      finalResponse = `${finalResponse}\n\n---\n**الأدوات المستخدمة:**\n${toolSummary}`;
    }

    return NextResponse.json({
      content: finalResponse,
      response: finalResponse,
      tools_used: toolsUsed,
      tool_calls: toolResults,
      iterations: result.iterations,
      model: "agent-glm-4-flash",
      emotion: "neutral",
      language: "ar",
    });
  } catch (e: any) {
    console.error("[Chat Agent] Error:", e);
    return NextResponse.json(
      { error: e.message, content: "عذراً، حدث خطأ في معالجة طلبك." },
      { status: 500 }
    );
  }
}
