import { NextRequest, NextResponse } from 'next/server';
import { analyzeCapabilityWithLLM } from '@/lib/llm-capability-detector';

/**
 * POST /api/agent/analyze
 * Test the LLM capability analysis
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json({ error: 'message required' }, { status: 400 });
    }

    const analysis = await analyzeCapabilityWithLLM(message, 'ar');

    return NextResponse.json({
      message,
      analysis,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'failed' },
      { status: 500 }
    );
  }
}
