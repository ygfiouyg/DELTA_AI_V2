/**
 * POST /api/agent
 * body: { message: string, system_prompt?: string, history?: [] }
 *
 * بيستقبل طلب المستخدم، يمرره للـ Agent، ينفذ الـ tool calls، ويرجع النتيجة.
 */

import { NextResponse } from "next/server";
import { runAgent, runAudioWorkflow, type AgentMessage } from "@/lib/agent/agent-engine";
import { getToolsSchema, ALL_AGENT_TOOLS } from "@/lib/agent/custom-tools";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

/** GET — بيـ رجّع كل الأدوات المتاحة */
export async function GET() {
  const tools = ALL_AGENT_TOOLS.map(t => ({
    name: t.name,
    description: t.description,
    parameters: t.parameters,
  }));
  return NextResponse.json({
    success: true,
    tools_count: tools.length,
    tools,
  });
}

/** POST — بيـ run الـ agent */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, system_prompt, history, workflow } = body;

    // ── Audio Workflow ──
    if (workflow === "audio" && body.audio_path) {
      const result = await runAudioWorkflow(body.audio_path);
      return NextResponse.json({
        success: true,
        workflow: "audio_processing",
        result,
      });
    }

    // ── Agent Loop ──
    if (!message) {
      return NextResponse.json(
        { success: false, error: "message required" },
        { status: 400 }
      );
    }

    const defaultSystemPrompt = `أنت Anzaro AI — مساعد ذكي قادر على اتخاذ إجراءات.
لديك أدوات متاحة. استخدمها عند الحاجة لتنفيذ طلبات المستخدم.
لا تقل "لا أستطيع" — استخدم الأدوات المتاحة لتنفيذ الطلب.

الأدوات المتاحة:
${ALL_AGENT_TOOLS.map(t => `- ${t.name}: ${t.description}`).join("\n")}

قواعد:
1. فكر أولاً: هل يحتاج الطلب لأداة؟
2. لو نعم: استدعي الأداة المناسبة
3. لو لا: أجب مباشرة
4. اشرح ما فعلته بإيجاز بعد تنفيذ الأداة`;

    const result = await runAgent(
      message,
      system_prompt || defaultSystemPrompt,
      (history || []) as AgentMessage[]
    );

    return NextResponse.json({
      success: true,
      response: result.response,
      tool_calls: result.tool_calls_made,
      iterations: result.iterations,
      tools_used: result.tool_calls_made.map(tc => tc.name),
    });
  } catch (e: any) {
    console.error("[Agent API] Error:", e);
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 500 }
    );
  }
}
