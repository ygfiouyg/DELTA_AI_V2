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
    // V.102: تمرير tools + tool_choice للـ ZAI SDK
    const tools = body.tools;
    const toolChoice = body.tool_choice;

    if (stream) {
      // V.104: ZAI SDK streaming مش بيرجع content chunks صح.
      // الحل: non-streaming call + قسم النص لـ chunks صغيرة.
      const encoder = new TextEncoder();
      const streamResponse = new ReadableStream({
        async start(controller) {
          try {
            const params: any = {
              model: useModel,
              messages,
              temperature: temperature ?? 0.7,
              max_tokens: max_tokens ?? 4096,
              stream: false,
            };
            if (tools) params.tools = tools;
            if (toolChoice) params.tool_choice = toolChoice;

            const completion = await zai.chat.completions.create(params);
            const fullContent = completion.choices?.[0]?.message?.content || "";
            const toolCalls = completion.choices?.[0]?.message?.tool_calls;

            // لو فيه tool_calls، ابعتهم كـ chunk واحد
            if (toolCalls && Array.isArray(toolCalls) && toolCalls.length > 0) {
              const toolData = {
                id: `chatcmpl-${Date.now()}`,
                object: "chat.completion.chunk",
                created: Math.floor(Date.now() / 1000),
                model: useModel,
                choices: [{
                  index: 0,
                  delta: { role: "assistant", tool_calls: toolCalls },
                  finish_reason: "tool_calls",
                }],
              };
              controller.enqueue(encoder.encode(`data: ${JSON.stringify(toolData)}\n\n`));
            }

            // قسم الـ content لـ chunks (~20 char كل chunk)
            const chunkSize = 20;
            for (let i = 0; i < fullContent.length; i += chunkSize) {
              const chunk = fullContent.slice(i, i + chunkSize);
              const data = {
                id: `chatcmpl-${Date.now()}`,
                object: "chat.completion.chunk",
                created: Math.floor(Date.now() / 1000),
                model: useModel,
                choices: [{
                  index: 0,
                  delta: { content: chunk },
                  finish_reason: null,
                }],
              };
              controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
            }

            // finish chunk
            const finishData = {
              id: `chatcmpl-${Date.now()}`,
              object: "chat.completion.chunk",
              created: Math.floor(Date.now() / 1000),
              model: useModel,
              choices: [{
                index: 0,
                delta: {},
                finish_reason: "stop",
              }],
            };
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(finishData)}\n\n`));
            controller.enqueue(encoder.encode("data: [DONE]\n\n"));
            controller.close();
          } catch (err: any) {
            const errorData = { error: { message: err?.message || "Stream error" } };
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(errorData)}\n\n`));
            controller.close();
          }
        },
      });

      return new Response(streamResponse, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    // Non-streaming
    const completionParams: any = {
      model: useModel,
      messages,
      temperature: temperature ?? 0.7,
      max_tokens: max_tokens ?? 4096,
    };
    if (tools) completionParams.tools = tools;
    if (toolChoice) completionParams.tool_choice = toolChoice;

    const completion = await zai.chat.completions.create(completionParams);

    // Return OpenAI-compatible response (V.102: pass through tool_calls)
    const choice = completion.choices?.[0];
    const message = choice?.message || {};

    // V.102: لو الـ tool_calls رجعت كـ string "NONE" → undefined
    let toolCalls = message.tool_calls;
    if (toolCalls === "NONE" || toolCalls === "null" || toolCalls === null) {
      toolCalls = undefined;
    }

    const responseMessage: any = {
      role: message.role || "assistant",
      content: message.content || "",
    };
    if (Array.isArray(toolCalls) && toolCalls.length > 0) {
      responseMessage.tool_calls = toolCalls;
    }

    return NextResponse.json({
      id: `chatcmpl-${Date.now()}`,
      object: "chat.completion",
      created: Math.floor(Date.now() / 1000),
      model: useModel,
      choices: [
        {
          index: 0,
          message: responseMessage,
          finish_reason: choice?.finish_reason || (toolCalls ? "tool_calls" : "stop"),
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
