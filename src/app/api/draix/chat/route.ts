/**
 * POST /api/draix/chat
 * بيـ send message لـ Anzaro/Hermes ويرجّع الـ response.
 * V.174: يدعم Hermes (port 8000) AND Anzaro (port 3000) fallback
 */
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 120;

export async function POST(req: NextRequest) {
  try {
    const { message, session_id, model } = await req.json();

    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'message required' }, { status: 400 });
    }

    const startTime = Date.now();

    // 1. Try Hermes API (port 8000)
    try {
      const res = await fetch('http://localhost:8000/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: model || 'default',
          messages: [{ role: 'user', content: message }],
          stream: false,
        }),
        signal: AbortSignal.timeout(90000),
      });

      if (res.ok) {
        const data = await res.json();
        const response = data.choices?.[0]?.message?.content || 'No response';
        return NextResponse.json({
          success: true,
          response,
          tool_used: data.choices?.[0]?.message?.tool_calls?.[0]?.function?.name || null,
          source: 'hermes',
          duration_ms: Date.now() - startTime,
        });
      }
    } catch (e: any) {
      console.log('[DrAix] Hermes (8000) failed, trying Anzaro (3000):', e.message);
    }

    // 2. Fallback: Anzaro AI (port 3000) - نفس الـ app
    try {
      const res = await fetch('http://localhost:3000/api/chat/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, enableThinking: false }),
        signal: AbortSignal.timeout(60000),
      });

      if (res.ok) {
        const data = await res.json();
        return NextResponse.json({
          success: true,
          response: data.response || data.message || 'No response',
          source: 'anzaro',
          duration_ms: Date.now() - startTime,
        });
      }
    } catch (e: any) {
      console.log('[DrAix] Anzaro (3000) failed:', e.message);
    }

    // 3. Last resort: try /api/chat/send
    try {
      const res = await fetch('http://localhost:3000/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
        signal: AbortSignal.timeout(60000),
      });

      if (res.ok) {
        const data = await res.json();
        return NextResponse.json({
          success: true,
          response: data.response || data.message || data.output || 'No response',
          source: 'anzaro-chat',
          duration_ms: Date.now() - startTime,
        });
      }
    } catch (e: any) {
      console.log('[DrAix] /api/chat/send failed:', e.message);
    }

    return NextResponse.json({
      success: false,
      error: 'All backends failed. Check if the app is running.',
    }, { status: 502 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
