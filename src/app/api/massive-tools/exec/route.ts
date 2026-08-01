/**
 * POST /api/massive-tools/exec
 * body: { tool: string, args: object }
 *
 * V.145: بتستخدم tools/registry الجديد كـ primary executor.
 * الـ tools اللي مش موجودة في الـ registry الجديد، بتـ fallback لـ:
 *   1. callable-tools.ts (القديم)
 *   2. agent custom-tools.ts (الأقدم)
 *
 * ترتيب الأولوية:
 *   1. tools/registry (جديد - files isolated في tools/)
 *   2. callable-tools.ts (قديم - inline)
 *   3. ALL_AGENT_TOOLS (custom-tools.ts + standalone-tools.ts)
 */
import { NextResponse } from "next/server";
import { executeTool as executeRegistryTool, getToolsSchema as getRegistrySchema, findTool as findRegistryTool, getStats as getRegistryStats } from "@/lib/tools-registry";
import { executeCallableTool, getToolsSchema } from "@/lib/massive-tools/callable-tools";
import { ALL_AGENT_TOOLS } from "@/lib/agent/custom-tools";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tool, args } = body;

    if (!tool) {
      return NextResponse.json({ success: false, error: "tool name required" }, { status: 400 });
    }

    let result: { success: boolean; output?: any; error?: string; durationMs: number; source?: string } = {
      success: false,
      error: "not found",
      durationMs: 0,
    };

    // 1) Try new tools/registry first
    const registryTool = findRegistryTool(tool);
    if (registryTool) {
      result = await executeRegistryTool(tool, args || {});
      result.source = "tools/registry";
    }

    // 2) Fallback to old callable-tools.ts
    if (!result.success && (result.error?.includes("not found") || result.error === "not found")) {
      const callableResult = await executeCallableTool(tool, args || {});
      if (callableResult.success || !callableResult.error?.includes("not found")) {
        result = {
          success: callableResult.success,
          output: callableResult.output,
          error: callableResult.error,
          durationMs: callableResult.durationMs,
          source: "callable-tools.ts",
        };
      }
    }

    // 3) Fallback to agent custom-tools (includes standalone)
    if (!result.success && (result.error?.includes("not found") || result.error === "not found")) {
      const agentTool = ALL_AGENT_TOOLS.find(t => t.name === tool);
      if (agentTool) {
        const start = Date.now();
        try {
          const output = await agentTool.execute(args || {});
          result = {
            success: true,
            output,
            durationMs: Date.now() - start,
            source: "agent/custom-tools.ts",
          };
        } catch (e: any) {
          result = {
            success: false,
            output: "",
            error: e.message,
            durationMs: Date.now() - start,
            source: "agent/custom-tools.ts",
          };
        }
      }
    }

    return NextResponse.json({
      success: result.success,
      tool,
      output: result.output,
      error: result.error,
      durationMs: result.durationMs,
      source: result.source,
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

/** GET — بيـ رجّع كل الـ callable tools schema (registry + massive + agent) */
export async function GET() {
  // New registry tools
  const registryTools = getRegistrySchema();
  const registryStats = getRegistryStats();

  // Old callable tools
  const massiveTools = getToolsSchema();

  // Old agent tools
  const agentTools = ALL_AGENT_TOOLS.map(t => ({
    type: "function",
    function: { name: t.name, description: t.description, parameters: { type: "object", properties: t.parameters } },
    category: t.category,
    package: t.package,
  }));

  return NextResponse.json({
    success: true,
    tools: [...registryTools, ...massiveTools, ...agentTools],
    count: registryTools.length + massiveTools.length + agentTools.length,
    sources: {
      "tools/registry (new)": registryTools.length,
      "callable-tools.ts (legacy)": massiveTools.length,
      "agent custom-tools (legacy)": agentTools.length,
    },
    registry_stats: registryStats,
  });
}
