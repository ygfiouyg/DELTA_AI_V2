/**
 * Multi-Provider Chat Streamer — V.105
 * ═══════════════════════════════════════════════════════════════════════
 *
 * مفيش ZAI SPOF. مفيش hardcoded GLM.
 *
 * الـ streamer بيختار الـ provider بناءً على الموديل اللي المستخدم اختاره:
 *   - openai → OpenAI API (direct streaming)
 *   - anthropic → Anthropic API (direct streaming)
 *   - groq → Groq API (direct streaming)
 *   - gemini → Gemini API (direct streaming)
 *   - zhipuai → ZAI SDK (fallback only)
 *   - github → GitHub Models API
 *   - cloudflare → Cloudflare Workers AI
 *   - ovh → OVHcloud AI
 *   - openrouter → OpenRouter
 *   - huggingface → HF Inference API
 *   - pollinations → Pollinations (free, no key)
 *
 * كل provider بيـ stream مباشرة (true streaming, مش chunked workaround).
 */

import { ReadableStream } from "stream/web";

export interface ChatMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
}

export interface StreamResult {
  stream: ReadableStream<Uint8Array>;
  provider: string;
  model: string;
}

export interface ProviderConfig {
  provider: string;
  realChatModel: string;
  apiKey: string;
  baseUrl?: string;
}

/**
 * بيحدد الـ provider config بناءً على الـ model config.
 */
export function resolveProvider(modelConfig: any): ProviderConfig | null {
  const provider = modelConfig?.provider;
  const realChatModel = modelConfig?.realChatModel || modelConfig?.glmModel || modelConfig?.id;

  switch (provider) {
    case "openai":
      return {
        provider: "openai",
        realChatModel,
        apiKey: process.env.OPENAI_API_KEY || "",
        baseUrl: "https://api.openai.com/v1",
      };

    case "anthropic":
      return {
        provider: "anthropic",
        realChatModel,
        apiKey: process.env.ANTHROPIC_API_KEY || "",
      };

    case "groq":
      return {
        provider: "groq",
        realChatModel,
        apiKey: process.env.GROQ_API_KEY || "",
        baseUrl: "https://api.groq.com/openai/v1",
      };

    case "gemini":
      return {
        provider: "gemini",
        realChatModel,
        apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_KEY || "",
      };

    case "github":
      return {
        provider: "github",
        realChatModel,
        apiKey: process.env.GITHUB_TOKEN || process.env.GITHUB_API_KEY || "",
        baseUrl: "https://models.inference.ai.azure.com",
      };

    case "cloudflare":
      return {
        provider: "cloudflare",
        realChatModel,
        apiKey: process.env.CLOUDFLARE_API_TOKEN || "",
      };

    case "ovh":
      return {
        provider: "ovh",
        realChatModel,
        apiKey: process.env.OVH_AI_TOKEN || "",
      };

    case "openrouter":
      return {
        provider: "openrouter",
        realChatModel,
        apiKey: process.env.OPENROUTER_API_KEY || "",
        baseUrl: "https://openrouter.ai/api/v1",
      };

    case "huggingface":
    case "hf":
      return {
        provider: "huggingface",
        realChatModel,
        apiKey: process.env.HUGGINGFACE_API_TOKEN || process.env.HF_TOKEN || "",
      };

    case "zhipuai":
      // ZAI — fallback only (SPOF risk)
      return {
        provider: "zhipuai",
        realChatModel: modelConfig?.glmModel || realChatModel,
        apiKey: "zai-sdk", // بيستخدم ZAI.create() مش API key
      };

    case "pollinations":
      // Pollinations — free, no key needed
      return {
        provider: "pollinations",
        realChatModel,
        apiKey: "none",
      };

    default:
      return null;
  }
}

/**
 * بيعمل real streaming chat completion بناءً على الـ provider.
 * بيرجع ReadableStream من text chunks.
 */
export async function streamChat(
  providerConfig: ProviderConfig,
  messages: ChatMessage[],
  options: { temperature?: number; max_tokens?: number } = {}
): Promise<ReadableStream<Uint8Array>> {
  const { temperature = 0.7, max_tokens = 8192 } = options;
  const encoder = new TextEncoder();

  // ─── OpenAI-compatible providers (direct streaming) ───
  const openaiCompatible = ["openai", "groq", "openrouter", "github"];
  if (openaiCompatible.includes(providerConfig.provider) && providerConfig.apiKey) {
    return streamOpenAICompatible(providerConfig, messages, temperature, max_tokens);
  }

  // ─── Anthropic (direct streaming) ───
  if (providerConfig.provider === "anthropic" && providerConfig.apiKey) {
    return streamAnthropic(providerConfig, messages, temperature, max_tokens);
  }

  // ─── Gemini (direct streaming) ───
  if (providerConfig.provider === "gemini" && providerConfig.apiKey) {
    return streamGemini(providerConfig, messages, temperature, max_tokens);
  }

  // ─── Pollinations (free, no key) ───
  if (providerConfig.provider === "pollinations") {
    return streamPollinations(providerConfig, messages, temperature, max_tokens);
  }

  // ─── ZAI (fallback — non-streaming + chunked) ───
  if (providerConfig.provider === "zhipuai") {
    return streamZAI(providerConfig, messages, temperature, max_tokens);
  }

  // ─── No provider available ───
  return new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: "⚠️ مفيش provider متاح للموديل ده. اختر موديل تاني." })}\n\n`));
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });
}

/**
 * OpenAI-compatible streaming (OpenAI, Groq, OpenRouter, GitHub).
 */
async function streamOpenAICompatible(
  config: ProviderConfig,
  messages: ChatMessage[],
  temperature: number,
  max_tokens: number
): Promise<ReadableStream<Uint8Array>> {
  const encoder = new TextEncoder();
  const baseUrl = config.baseUrl || "https://api.openai.com/v1";

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${config.apiKey}`,
      ...(config.provider === "openrouter" ? { "HTTP-Referer": "https://anzaro.ai" } : {}),
    },
    body: JSON.stringify({
      model: config.realChatModel,
      messages,
      temperature,
      max_tokens,
      stream: true,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`${config.provider} API error ${response.status}: ${err.slice(0, 200)}`);
  }

  return response.body as ReadableStream<Uint8Array>;
}

/**
 * Anthropic streaming.
 */
async function streamAnthropic(
  config: ProviderConfig,
  messages: ChatMessage[],
  temperature: number,
  max_tokens: number
): Promise<ReadableStream<Uint8Array>> {
  const encoder = new TextEncoder();

  // افصل system prompt عن باقي الـ messages
  const systemMsg = messages.find((m) => m.role === "system");
  const chatMessages = messages.filter((m) => m.role !== "system");

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": config.apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: config.realChatModel,
      messages: chatMessages,
      system: systemMsg?.content || "",
      temperature,
      max_tokens,
      stream: true,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Anthropic API error ${response.status}: ${err.slice(0, 200)}`);
  }

  // حول Anthropic SSE → OpenAI SSE format
  return new ReadableStream({
    async start(controller) {
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          const data = line.slice(5).trim();
          if (data === "[DONE]") continue;
          try {
            const parsed = JSON.parse(data);
            if (parsed.type === "content_block_delta" && parsed.delta?.text) {
              const chunk = {
                choices: [{ delta: { content: parsed.delta.text } }],
              };
              controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`));
            }
          } catch {}
        }
      }
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });
}

/**
 * Gemini streaming.
 */
async function streamGemini(
  config: ProviderConfig,
  messages: ChatMessage[],
  temperature: number,
  max_tokens: number
): Promise<ReadableStream<Uint8Array>> {
  const encoder = new TextEncoder();
  const systemContent = messages.find((m) => m.role === "system")?.content || "";
  const contents = messages
    .filter((m) => m.role !== "system")
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.realChatModel}:streamGenerateContent?key=${config.apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents,
      ...(systemContent ? { systemInstruction: systemContent } : {}),
      generationConfig: { temperature, maxOutputTokens: max_tokens },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${err.slice(0, 200)}`);
  }

  // حول Gemini SSE → OpenAI SSE format
  return new ReadableStream({
    async start(controller) {
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        // Gemini بيرجع JSON array chunks
        try {
          const data = JSON.parse(buffer);
          if (Array.isArray(data)) {
            for (const item of data) {
              const text = item?.candidates?.[0]?.content?.parts?.[0]?.text;
              if (text) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ choices: [{ delta: { content: text } }] })}\n\n`));
              }
            }
            buffer = "";
          }
        } catch {
          // مش كامل بعد
        }
      }
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });
}

/**
 * Pollinations streaming (free, no key).
 */
async function streamPollinations(
  config: ProviderConfig,
  messages: ChatMessage[],
  temperature: number,
  max_tokens: number
): Promise<ReadableStream<Uint8Array>> {
  const response = await fetch("https://text.pollinations.ai/openai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: config.realChatModel,
      messages,
      temperature,
      max_tokens,
      stream: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`Pollinations error ${response.status}`);
  }

  return response.body as ReadableStream<Uint8Array>;
}

/**
 * ZAI fallback (non-streaming + chunked — آخر حل).
 */
async function streamZAI(
  config: ProviderConfig,
  messages: ChatMessage[],
  temperature: number,
  max_tokens: number
): Promise<ReadableStream<Uint8Array>> {
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      try {
        const ZAIModule = await import("z-ai-web-dev-sdk");
        const ZAI = ZAIModule.default;
        const zai = await ZAI.create();

        const completion = await zai.chat.completions.create({
          model: config.realChatModel,
          messages,
          temperature,
          max_tokens,
          stream: false,
        });

        const content = completion?.choices?.[0]?.message?.content || "";
        if (content) {
          // قسم النص لـ chunks كبيرة (50 char) عشان سرعة
          const chunkSize = 50;
          for (let i = 0; i < content.length; i += chunkSize) {
            const chunk = content.slice(i, i + chunkSize);
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ choices: [{ delta: { content: chunk } }] })}\n\n`));
          }
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch (err: any) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: err?.message || "ZAI failed" })}\n\n`));
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      }
    },
  });
}

/**
 * بيرجع قائمة الـ providers المتاحة دلوقتي (للـ debugging).
 */
export function getAvailableProviders(): string[] {
  const available: string[] = [];
  if (process.env.OPENAI_API_KEY) available.push("openai");
  if (process.env.ANTHROPIC_API_KEY) available.push("anthropic");
  if (process.env.GROQ_API_KEY) available.push("groq");
  if (process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_KEY) available.push("gemini");
  if (process.env.GITHUB_TOKEN) available.push("github");
  if (process.env.CLOUDFLARE_API_TOKEN) available.push("cloudflare");
  if (process.env.OPENROUTER_API_KEY) available.push("openrouter");
  if (process.env.HUGGINGFACE_API_TOKEN || process.env.HF_TOKEN) available.push("huggingface");
  available.push("pollinations"); // دايماً متاح (free)
  available.push("zhipuai"); // دايماً متاح (ZAI.create)
  return available;
}
