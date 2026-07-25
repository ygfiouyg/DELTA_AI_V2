/**
 * LLM Capability Detector — V.69
 * ═══════════════════════════════════════════════════════════════════════
 *
 * بدل regex، الموديل نفسه بيحلل الطلب ويقرر:
 * 1. هل المحتوى المطلوب محتاج أداة خاصة؟
 * 2. لو أيه، إيه الأداة المطلوبة؟
 * 3. هل الأداة متاحة محلياً؟
 * 4. لو مش متاحة → ابحث وثبتها
 *
 * ده "thinking outside the box" — الموديل بيفكر مش بيـ pattern match
 */

import { getAvailableTools } from './autonomous-agent';

export interface LLMCapabilityAnalysis {
  needsSpecialTool: boolean;
  toolName: string;
  toolType: 'pip' | 'npm' | 'docker' | 'local' | 'system';
  installCommand: string;
  githubSearchQuery: string;
  reason: string;
  hasToolLocally: boolean;
  // V.72: Multi-tool support
  allTools?: Array<{
    name: string;
    type: string;
    purpose: string;
    available: boolean;
  }>;
}

/**
 * Ask the LLM to analyze a user request and determine if a special tool is needed
 */
export async function analyzeCapabilityWithLLM(
  userMessage: string,
  language: 'ar' | 'en' = 'ar'
): Promise<LLMCapabilityAnalysis> {
  // First, get available tools
  const availableTools = await getAvailableTools();

  const prompt = `أنت محلل قدرات ذكي. حلل طلب المستخدم التالي وحدد:

1. هل الطلب يحتاج أداة خاصة غير المحادثة العادية؟
2. لو أيه، إيه **كل** الأدوات المطلوبة (ممكن يكون أكثر من أداة)؟
3. إيه نوع التثبيت لكل أداة؟ (pip, npm, docker, local, system)
4. إيه أمر التثبيت لكل أداة؟
5. إيه استعلام البحث في GitHub؟

الأدوات المتاحة حالياً: ${availableTools.join(', ')}

طلب المستخدم: "${userMessage}"

أجب بصيغة JSON فقط:
{
  "needsSpecialTool": true/false,
  "toolName": "الأداة الرئيسية أو فارغ",
  "toolType": "pip|npm|docker|local|system",
  "installCommand": "أمر التثبيت الرئيسي أو فارغ",
  "githubSearchQuery": "استعلام البحث أو فارغ",
  "reason": "السبب",
  "hasToolLocally": true/false,
  "allTools": [
    {"name": "pytube", "type": "pip", "purpose": "تنزيل الفيديو", "available": false},
    {"name": "pydub", "type": "pip", "purpose": "استخراج الصوت", "available": false},
    {"name": "SpeechRecognition", "type": "pip", "purpose": "تحويل الصوت لنص", "available": false}
  ]
}

قواعد مهمة:
- لو الطلب معقد ويحتاج خطوات متعددة → حط كل الأدوات في allTools
- مثلاً "حمّل فيديو من يوتيوب وحول الصوت لنص" يحتاج: pytube + pydub + SpeechRecognition
- مثلاً "اقرأ صورة وحولها لـ PDF" يحتاج: pytesseract + pillow + pymupdf
- مثلاً "استخرج صور من PDF واعمل عرض تقديمي" يحتاج: pymupdf + pillow + python-pptx
- لو الأداة في قائمة الأدوات المتاحة → available: true
- لو الأداة Python stdlib (مثل os, json, smtplib) → available: true, type: "system"
- لو الطلب محادثة عادية → needsSpecialTool: false, allTools: []
- toolName = الأداة الأولى في allTools (الأهم)`;

  try {
    const { getZAIClient } = await import('./chat-utils');
    const zai = await getZAIClient();

    const result = await zai.chat.completions.create({
      model: 'glm-4-flash',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.0,
      max_tokens: 600,
    });

    const content = result.choices?.[0]?.message?.content || '';

    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return defaultAnalysis();
    }

    const parsed = JSON.parse(jsonMatch[0]);

    const toolName = parsed.toolName || '';

    // V.71: Check if tool is actually a Python stdlib module
    // stdlib modules (smtplib, zipfile, os, json, etc.) are BUILT-IN — no pip needed
    let hasToolLocally = parsed.hasToolLocally || availableTools.includes(toolName);

    if (!hasToolLocally && toolName) {
      // Try importing it as a stdlib module
      try {
        const { exec } = await import('child_process');
        const { promisify } = await import('util');
        const execAsync = promisify(exec);
        const moduleName = toolName.replace(/-/g, '_').toLowerCase();
        const { stdout } = await execAsync(`python3 -c "import ${moduleName}; print('OK')"`, { timeout: 5_000 });
        if (stdout.includes('OK')) {
          hasToolLocally = true;
          console.log(`[LLMCapability] V.71: ${toolName} is a stdlib module — available!`);
        }
      } catch {
        // Not a stdlib module — needs pip install
      }
    }

    // V.71: If toolType is "system" (like smtplib, zipfile), mark as available
    if (!hasToolLocally && (parsed.toolType === 'system' || parsed.toolType === 'stdlib')) {
      hasToolLocally = true;
      console.log(`[LLMCapability] V.71: ${toolName} is system/stdlib — marking as available`);
    }

    return {
      needsSpecialTool: parsed.needsSpecialTool || false,
      toolName,
      toolType: parsed.toolType || 'pip',
      installCommand: parsed.installCommand || '',
      githubSearchQuery: parsed.githubSearchQuery || '',
      reason: parsed.reason || '',
      hasToolLocally,
      allTools: parsed.allTools || [],
    };
  } catch (error) {
    console.warn('[LLMCapability] Analysis failed:', error instanceof Error ? error.message : String(error));
    return defaultAnalysis();
  }
}

function defaultAnalysis(): LLMCapabilityAnalysis {
  return {
    needsSpecialTool: false,
    toolName: '',
    toolType: 'pip',
    installCommand: '',
    githubSearchQuery: '',
    reason: '',
    hasToolLocally: true,
  };
}

/**
 * Full autonomous flow:
 * 1. LLM analyzes request
 * 2. If needs tool and doesn't have it → search GitHub
 * 3. Install tool
 * 4. Return result
 */
export async function autonomousAcquireAndExecute(
  userMessage: string,
  language: 'ar' | 'en' = 'ar'
): Promise<{
  analysis: LLMCapabilityAnalysis;
  installed: boolean;
  installMessage: string;
  steps: string[];
}> {
  const steps: string[] = [];

  // Step 1: LLM analyzes the request
  steps.push('🧠 الموديل بيحلل طلبك...');
  const analysis = await analyzeCapabilityWithLLM(userMessage, language);
  steps.push(`التحليل: ${analysis.reason}`);

  if (!analysis.needsSpecialTool) {
    steps.push('لا يحتاج أداة خاصة');
    return { analysis, installed: false, installMessage: '', steps };
  }

  if (analysis.hasToolLocally) {
    steps.push(`✅ الأداة "${analysis.toolName}" متاحة محلياً`);
    return { analysis, installed: false, installMessage: 'متاح', steps };
  }

  // Step 2: Need to install the tool
  steps.push(`⚠️ الأداة "${analysis.toolName}" غير متاحة`);
  steps.push(`🔍 البحث في GitHub عن: ${analysis.githubSearchQuery}`);

  // Step 3: Search and install
  const { searchGitHubTools, installTool } = await import('./autonomous-agent');
  const searchResults = await searchGitHubTools(analysis.githubSearchQuery, 3);

  if (searchResults.length === 0) {
    // Try direct install with the command from LLM
    if (analysis.installCommand) {
      steps.push(`📦 محاولة التثبيت المباشر: ${analysis.installCommand}`);
      const tool = {
        repo: analysis.toolName,
        name: analysis.toolName,
        description: analysis.reason,
        url: '',
        installType: analysis.toolType as any,
        installCommand: analysis.installCommand,
        score: 0,
      };
      const result = await installTool(tool);
      steps.push(result.message);
      return { analysis, installed: result.success, installMessage: result.message, steps };
    }

    steps.push('❌ لم أجد الأداة');
    return { analysis, installed: false, installMessage: 'لم أجد الأداة', steps };
  }

  // Install best match
  const bestMatch = searchResults[0];
  steps.push(`📦 تثبيت ${bestMatch.name}...`);
  const installResult = await installTool(bestMatch);
  steps.push(installResult.message);

  return {
    analysis,
    installed: installResult.success,
    installMessage: installResult.message,
    steps,
  };
}
