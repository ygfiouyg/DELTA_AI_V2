/**
 * V.133: Agent Engine — بيـ run الـ agent loop (model → tool call → execute → return)
 *
 * الـ flow:
 * 1. User message → Model (with bind_tools)
 * 2. Model decides → tool_calls
 * 3. Execute tool_calls
 * 4. Feed results back → Model
 * 5. Model generates final answer
 */

import { getToolsSchema, executeTool } from "./custom-tools";

export interface AgentMessage {
  role: "user" | "assistant" | "tool" | "system";
  content: string;
  tool_calls?: any[];
  tool_call_id?: string;
  name?: string;
}

export interface AgentResult {
  response: string;
  tool_calls_made: { name: string; args: any; result: string }[];
  messages: AgentMessage[];
  iterations: number;
}

const MAX_ITERATIONS = 5;
const MODEL = "glm-4-flash-zai";
const API_KEY = process.env.ZAI_API_KEY || process.env.OPENAI_API_KEY || "";
const API_BASE = process.env.ZAI_API_BASE || "https://api.z.ai/api/paas/v4";

/** بيـ run agent loop */
export async function runAgent(
  userMessage: string,
  systemPrompt?: string,
  conversationHistory: AgentMessage[] = []
): Promise<AgentResult> {
  const tools = getToolsSchema();
  const messages: AgentMessage[] = [
    ...(systemPrompt ? [{ role: "system" as const, content: systemPrompt }] : []),
    ...conversationHistory,
    { role: "user" as const, content: userMessage },
  ];

  const toolCallsMade: { name: string; args: any; result: string }[] = [];
  let iterations = 0;
  let finalResponse = "";

  while (iterations < MAX_ITERATIONS) {
    iterations++;

    // Call model with tools
    const modelResponse = await callModel(messages, tools);

    if (!modelResponse) {
      finalResponse = "عذراً، حدث خطأ في الاتصال بالنموذج.";
      break;
    }

    const assistantMessage: AgentMessage = {
      role: "assistant",
      content: modelResponse.content || "",
    };

    // If model wants to call tools
    if (modelResponse.tool_calls && modelResponse.tool_calls.length > 0) {
      assistantMessage.tool_calls = modelResponse.tool_calls;
      messages.push(assistantMessage);

      // Execute each tool call
      for (const tc of modelResponse.tool_calls) {
        const toolName = tc.function.name;
        let toolArgs: any = {};
        try {
          toolArgs = JSON.parse(tc.function.arguments || "{}");
        } catch {}

        console.log(`[Agent] Tool call: ${toolName} with args:`, toolArgs);
        const result = await executeTool(toolName, toolArgs);
        console.log(`[Agent] Tool result: ${result.slice(0, 200)}`);

        toolCallsMade.push({ name: toolName, args: toolArgs, result });

        // Add tool result to messages
        messages.push({
          role: "tool",
          content: result,
          tool_call_id: tc.id,
          name: toolName,
        });
      }

      // Continue loop — model will process tool results
      continue;
    }

    // No tool calls — model gave final answer
    finalResponse = modelResponse.content || "";
    break;
  }

  if (iterations >= MAX_ITERATIONS && !finalResponse) {
    finalResponse = "وصلت للحد الأقصى من التكرارات. " + (toolCallsMade.length > 0 ? `تم تنفيذ ${toolCallsMade.length} أداة.` : "");
  }

  return {
    response: finalResponse,
    tool_calls_made: toolCallsMade,
    messages,
    iterations,
  };
}

/** بيـ call الـ model عبر OpenAI-compatible API (ZAI/GLM) */
async function callModel(messages: AgentMessage[], tools: any[]): Promise<any> {
  try {
    const body: any = {
      model: MODEL,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content,
        ...(m.tool_calls ? { tool_calls: m.tool_calls } : {}),
        ...(m.tool_call_id ? { tool_call_id: m.tool_call_id } : {}),
        ...(m.name ? { name: m.name } : {}),
      })),
      temperature: 0.7,
      max_tokens: 4000,
    };

    if (tools && tools.length > 0) {
      body.tools = tools;
      body.tool_choice = "auto";
    }

    const response = await fetch(`${API_BASE}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.error(`[Agent] Model API error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    const choice = data.choices?.[0];
    if (!choice) return null;

    return {
      content: choice.message?.content || "",
      tool_calls: choice.message?.tool_calls || [],
    };
  } catch (e) {
    console.error("[Agent] Model call error:", e);
    return null;
  }
}

/** بيـ run audio workflow (transcribe → clean → analyze) */
export async function runAudioWorkflow(audioPath: string): Promise<any> {
  const steps: { step: string; result: any }[] = [];

  // Step 1: Clean audio
  console.log("[Audio Workflow] Step 1: Cleaning audio...");
  const cleanResult = await executeTool("clean_audio", { input_path: audioPath, output_path: "cleaned.wav" });
  steps.push({ step: "clean_audio", result: cleanResult });

  // Step 2: Transcribe
  console.log("[Audio Workflow] Step 2: Transcribing...");
  const transcribeResult = await executeTool("transcribe_audio", { file_path: "cleaned.wav", language: "auto" });
  steps.push({ step: "transcribe_audio", result: transcribeResult });

  // Step 3: Analyze sentiment
  let text = "";
  try {
    const t = JSON.parse(transcribeResult.split("\n").find((l: string) => l.startsWith("{")) || "{}");
    text = t.text || "";
  } catch {}

  if (text) {
    console.log("[Audio Workflow] Step 3: Analyzing sentiment...");
    const sentimentResult = await executeTool("analyze_sentiment", { text });
    steps.push({ step: "analyze_sentiment", result: sentimentResult });
  }

  return {
    workflow: "audio_processing",
    steps,
    transcribed_text: text,
  };
}
