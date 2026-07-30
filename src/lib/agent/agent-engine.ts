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

/** بيـ run agent loop */
export async function runAgent(
  userMessage: string,
  systemPrompt?: string,
  conversationHistory: AgentMessage[] = []
): Promise<AgentResult> {
  const tools = getToolsSchema();
  const toolDescriptions = ALL_AGENT_TOOLS.map(t => `- ${t.name}: ${t.description}`).join("\n");

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

    // Call model via the existing chat API (internal)
    const modelResponse = await callModelInternal(messages, tools, toolDescriptions);

    if (!modelResponse) {
      finalResponse = "عذراً، حدث خطأ في الاتصال بالنموذج.";
      break;
    }

    // If model wants to call tools
    if (modelResponse.tool_calls && modelResponse.tool_calls.length > 0) {
      const assistantMessage: AgentMessage = {
        role: "assistant",
        content: modelResponse.content || "",
        tool_calls: modelResponse.tool_calls,
      };
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

        messages.push({
          role: "tool",
          content: result,
          tool_call_id: tc.id,
          name: toolName,
        });
      }
      continue;
    }

    // Check if model response contains a tool name to call (fallback for models without native function calling)
    const toolMatch = matchToolFromText(modelResponse.content || "", toolDescriptions);
    if (toolMatch) {
      const result = await executeTool(toolMatch.name, toolMatch.args);
      toolCallsMade.push({ name: toolMatch.name, args: toolMatch.args, result });

      // Feed result back to model
      messages.push({ role: "assistant", content: modelResponse.content || "" });
      messages.push({
        role: "user",
        content: `نتيجة تنفيذ الأداة ${toolMatch.name}:\n${result}\n\nاكتب للمستخدم ملخص النتيجة بالعربية.`,
      });
      continue;
    }

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

/** بيـ call الـ model عبر الـ internal chat API */
async function callModelInternal(messages: AgentMessage[], tools: any[], toolDescriptions: string): Promise<any> {
  try {
    // Build the prompt with tool descriptions injected
    const systemContent = `أنت Anzaro AI — مساعد ذكي قادر على تنفيذ إجراءات.

لديك الأدوات التالية. إذا احتجت أي منها، اكتب:
TOOL_CALL: {"name": "<tool_name>", "args": {...}}

الأدوات المتاحة:
${toolDescriptions}

قواعد:
1. إذا كان الطلب يحتاج أداة، اكتب TOOL_CALL في أول سطر
2. إذا لم يحتج أداة، أجب مباشرة
3. لا تقل "لا أستطيع" — استخدم الأدوات`;

    // Call the internal chat API
    const response = await fetch("http://localhost:3000/api/chat/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: messages[messages.length - 1]?.content || "",
        model: "glm-4-flash-zai",
        systemPrompt: systemContent,
        conversationHistory: messages.slice(0, -1).map(m => ({
          role: m.role,
          content: m.content,
        })),
      }),
    });

    if (!response.ok) {
      console.error(`[Agent] Internal API error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    const content = data.content || data.response || data.message || "";

    // Check if content contains TOOL_CALL
    const toolCallMatch = content.match(/TOOL_CALL:\s*({[^}]+})/);
    if (toolCallMatch) {
      try {
        const tc = JSON.parse(toolCallMatch[1]);
        return {
          content: content.replace(/TOOL_CALL:\s*{[^}]+}/, "").trim(),
          tool_calls: [{
            id: `call_${Date.now()}`,
            function: {
              name: tc.name,
              arguments: JSON.stringify(tc.args || {}),
            },
          }],
        };
      } catch {}
    }

    return { content, tool_calls: [] };
  } catch (e) {
    console.error("[Agent] Model call error:", e);
    return null;
  }
}

/** Fallback: بيـ match tool from text (للنماذج بدون function calling) */
function matchToolFromText(content: string, toolDescriptions: string): { name: string; args: any } | null {
  const match = content.match(/TOOL_CALL:\s*({[^}]+})/);
  if (match) {
    try {
      const tc = JSON.parse(match[1]);
      if (tc.name && ALL_AGENT_TOOLS.find(t => t.name === tc.name)) {
        return { name: tc.name, args: tc.args || {} };
      }
    } catch {}
  }
  return null;
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
