/**
 * POST /api/ai/zai-openai/chat/completions
 * ========================================
 * V.97: OpenAI-compatible endpoint بيـ proxy لـ ZAI SDK.
 *
 * كل الـ frameworks (LangChain, CrewAI, AutoGen, Semantic Kernel) تقدر
 * تـ call ده كأنه OpenAI API، بس في الحقيقة بيستخدم ZAI (GLM-5.2).
 *
 * Usage:
 *   base_url = "http://localhost:3000/api/ai/zai-openai"
 *   POST /chat/completions with OpenAI-compatible body
 */

import { NextRequest, NextResponse } from "next/server";
import { getZAIClient } from "@/lib/chat-utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { model, messages, temperature, max_tokens, stream } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "messages required" },
        { status: 400 }
      );
    }

    const zai = await getZAIClient();
    const useModel = model || "glm-4-flash";

    if (stream) {
      // Streaming response
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          try {
            const completion = await zai.chat.completions.create({
              model: useModel,
              messages,
              temperature: temperature ?? 0.7,
              max_tokens: max_tokens ?? 4096,
              stream: true,
            });

            for await (const chunk of completion) {
              const content = chunk.choices?.[0]?.delta?.content || "";
              if (content) {
                const data = {
                  id: chunk.id || `chatcmpl-${Date.now()}`,
                  object: "chat.completion.chunk",
                  created: chunk.created || Math.floor(Date.now() / 1000),
                  model: useModel,
                  choices: [
                    {
                      index: 0,
                      delta: { content },
                      finish_reason: chunk.choices?.[0]?.finish_reason || null,
                    },
                  ],
                };
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
              }
            }
            controller.enqueue(encoder.encode("data: [DONE]\n\n"));
            controller.close();
          } catch (err: any) {
            const errorData = { error: { message: err?.message || "Stream error" } };
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(errorData)}\n\n`));
            controller.close();
          }
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    // Non-streaming
    const completion = await zai.chat.completions.create({
      model: useModel,
      messages,
      temperature: temperature ?? 0.7,
      max_tokens: max_tokens ?? 4096,
    });

    // Return OpenAI-compatible response
    return NextResponse.json({
      id: `chatcmpl-${Date.now()}`,
      object: "chat.completion",
      created: Math.floor(Date.now() / 1000),
      model: useModel,
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content: completion.choices?.[0]?.message?.content || "",
          },
          finish_reason: "stop",
        },
      ],
      usage: {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0,
      },
    });
  } catch (error: any) {
    console.error("[ZAI OpenAI Proxy] Error:", error);
    return NextResponse.json(
      { error: { message: error?.message || "Internal error" } },
      { status: 500 }
    );
  }
}

/**
 * GET — بيرجع معلومات الـ endpoint (للـ frameworks تـ verify).
 */
export async function GET() {
  return NextResponse.json({
    service: "zai-openai-proxy",
    version: "1.0",
    models: ["glm-4-flash", "glm-5.2"],
    endpoints: ["/chat/completions"],
    note: "OpenAI-compatible proxy to ZAI (GLM-5.2). No API key needed.",
  });
}
