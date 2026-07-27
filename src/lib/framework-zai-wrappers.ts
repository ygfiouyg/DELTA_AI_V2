/**
 * Framework LLM Wrappers — V.97
 * ═══════════════════════════════════════════════════════════════════════
 *
 * المشكلة: LangChain, CrewAI, AutoGen, Semantic Kernel كلها بتشتغل بـ OpenAI
 * بس إحنا عندنا ZAI (GLM-5.2) — مش محتاجين OpenAI API!
 *
 * الحل: عملنا OpenAI-compatible proxy endpoint على /api/ai/zai-openai
 * الـ frameworks تـ call ده كأنه OpenAI، بس في الحقيقة بيستخدم ZAI (مجاني!).
 *
 * الـ wrappers دي بتـ:
 * 1. تـ point الـ frameworks لـ /api/ai/zai-openai (proxy)
 * 2. تستخدم glm-4-flash كـ default (مجاني)
 * 3. مفيش API key محتاج — الـ proxy بيـ handle الـ auth
 */

import { promises as fs } from "fs";
import path from "path";

const ZAI_PROXY_URL = "http://localhost:3000/api/ai/zai-openai";
const ZAI_DEFAULT_MODEL = "glm-4-flash";

/**
 * بيرجع ZAI proxy config.
 */
export function getZAIConfig(): { apiKey: string; baseUrl: string; model: string } {
  return {
    apiKey: "not-needed",
    baseUrl: ZAI_PROXY_URL,
    model: ZAI_DEFAULT_MODEL,
  };
}

export function getLangChainZAIWrapper(): string {
  return `# LangChain + ZAI
from langchain_openai import ChatOpenAI
llm = ChatOpenAI(model="glm-4-flash", api_key="not-needed", base_url="http://localhost:3000/api/ai/zai-openai")
`;
}

export function getAutoGenZAIWrapper(): string {
  return `# AutoGen + ZAI
from autogen_ext.models.openai import OpenAIChatCompletionClient
client = OpenAIChatCompletionClient(model="glm-4-flash", api_key="not-needed", base_url="http://localhost:3000/api/ai/zai-openai")
`;
}

export function getCrewAIZAIWrapper(): string {
  return `# CrewAI + ZAI
from crewai import LLM
llm = LLM(model="glm-4-flash", api_key="not-needed", base_url="http://localhost:3000/api/ai/zai-openai")
`;
}

export function getSemanticKernelZAIWrapper(): string {
  return `# Semantic Kernel + ZAI
import semantic_kernel as sk
from semantic_kernel.connectors.ai.open_ai import OpenAIChatCompletion
kernel = sk.Kernel()
kernel.add_service(OpenAIChatCompletion(service_id="zai", ai_model_id="glm-4-flash", api_key="not-needed", base_url="http://localhost:3000/api/ai/zai-openai"))
`;
}

export async function writeZAIWrappersToFile(): Promise<string> {
  const wrappersDir = path.join(process.cwd(), "frameworks_wrappers");
  const wrapperPath = path.join(wrappersDir, "zai_wrappers.py");

  const content = `"""
ZAI Framework Wrappers — V.97
==============================
دي wrappers لكل frameworks عشان تستخدم ZAI (GLM-5.2) بدل OpenAI.
مش محتاج OpenAI API key! بنستخدم proxy محلي.

Usage:
  from zai_wrappers import get_llm, get_model_client, get_zai_llm, get_kernel_with_zai
"""

ZAI_BASE_URL = "http://localhost:3000/api/ai/zai-openai"

try:
    from langchain_openai import ChatOpenAI
    def get_llm(model="glm-4-flash", temperature=0.7, max_tokens=4096):
        return ChatOpenAI(model=model, api_key="not-needed", base_url=ZAI_BASE_URL, temperature=temperature, max_tokens=max_tokens)
except ImportError:
    pass

try:
    from autogen_ext.models.openai import OpenAIChatCompletionClient
    def get_model_client(model="glm-4-flash"):
        return OpenAIChatCompletionClient(model=model, api_key="not-needed", base_url=ZAI_BASE_URL)
except ImportError:
    pass

try:
    from crewai import LLM
    def get_zai_llm(model="glm-4-flash"):
        return LLM(model=model, api_key="not-needed", base_url=ZAI_BASE_URL)
except ImportError:
    pass

try:
    import semantic_kernel as sk
    from semantic_kernel.connectors.ai.open_ai import OpenAIChatCompletion
    def get_kernel_with_zai(model="glm-4-flash"):
        kernel = sk.Kernel()
        kernel.add_service(OpenAIChatCompletion(service_id="zai", ai_model_id=model, api_key="not-needed", base_url=ZAI_BASE_URL))
        return kernel
except ImportError:
    pass
`;

  try {
    await fs.mkdir(wrappersDir, { recursive: true });
    await fs.writeFile(wrapperPath, content, "utf-8");
    return wrapperPath;
  } catch (err) {
    console.warn("[ZAI Wrappers] Failed to write:", err);
    return "";
  }
}

export function getFrameworksZAIContext(): string {
  return `

## 🚀 AI Frameworks + ZAI (GLM-5.2) — NO OpenAI API needed!

انت تقدر تستخدم الـ frameworks دي مع ZAI (GLM-5.2/Flash) — **مجاني، من غير OpenAI API key**!

عملنا OpenAI-compatible proxy على \`http://localhost:3000/api/ai/zai-openai\`.
كل اللي محتاجه تغير \`base_url\` لـ الـ proxy ده.

### 📝 LangChain:
\`\`\`python
from langchain_openai import ChatOpenAI
llm = ChatOpenAI(
    model="glm-4-flash",
    api_key="not-needed",
    base_url="http://localhost:3000/api/ai/zai-openai",
)
response = llm.invoke("مرحبا")
print(response.content)
\`\`\`

### 🤖 AutoGen:
\`\`\`python
from autogen_ext.models.openai import OpenAIChatCompletionClient
client = OpenAIChatCompletionClient(
    model="glm-4-flash",
    api_key="not-needed",
    base_url="http://localhost:3000/api/ai/zai-openai",
)
\`\`\`

### 👥 CrewAI:
\`\`\`python
from crewai import LLM
llm = LLM(
    model="glm-4-flash",
    api_key="not-needed",
    base_url="http://localhost:3000/api/ai/zai-openai",
)
\`\`\`

### 🧠 Semantic Kernel:
\`\`\`python
import semantic_kernel as sk
from semantic_kernel.connectors.ai.open_ai import OpenAIChatCompletion
kernel = sk.Kernel()
kernel.add_service(OpenAIChatCompletion(
    service_id="zai",
    ai_model_id="glm-4-flash",
    api_key="not-needed",
    base_url="http://localhost:3000/api/ai/zai-openai",
))
\`\`\`

**مهم:** \`api_key="not-needed"\` — الـ proxy بيـ handle الـ auth لـ ZAI.
استخدم \`glm-4-flash\` كـ default (مجاني). لو محتاج model أقوى استخدم \`glm-5.2\`.
`;
}
