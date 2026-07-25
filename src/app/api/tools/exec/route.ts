import { NextRequest, NextResponse } from 'next/server';
import { executePythonCode, extractPythonCode } from '@/lib/local-tool-executor';

/**
 * POST /api/tools/exec
 * Execute Python code on the server and return the result.
 *
 * Body: { code: string } or { text: string } (extracts code from text)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let code = body.code;

    // If no code but text provided, extract code from text
    if (!code && body.text) {
      code = extractPythonCode(body.text);
    }

    if (!code) {
      return NextResponse.json(
        { success: false, error: 'No Python code found' },
        { status: 400 }
      );
    }

    console.log(`[Exec] Running Python code (${code.length} chars)...`);

    const result = await executePythonCode(code, body.timeout || 30_000);

    console.log(`[Exec] Result: success=${result.success}, output=${result.output.substring(0, 100)}`);

    return NextResponse.json({
      success: result.success,
      output: result.output,
      error: result.error,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Execution failed' },
      { status: 500 }
    );
  }
}
