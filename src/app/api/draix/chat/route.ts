/**
 * POST /api/draix/chat
 * Sends a message to Hermes API and returns the response.
 */
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 120;

const HERMES_API = 'http://127.0.0.1:8000';

export async function POST(req: NextRequest) {
  try {
    const { message, session_id, model } = await req.json();

    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'message required' }, { status: 400 });
    }

    const startTime = Date.now();

    // Try Hermes /v1/chat/completions
    try {
      const res = await fetch(`${HERMES_API}/v1/chat/completions`, {
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
          source: 'hermes',
          duration_ms: Date.now() - startTime,
        });
      }
    } catch (e: any) {
      console.log('[DrAix] Hermes /v1 failed, trying /api/sessions:', e.message);
    }

    // Fallback: /api/sessions/{id}/chat
    try {
      let sid = session_id;
      if (!sid) {
        const sessionRes = await fetch(`${HERMES_API}/api/sessions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: 'Dr. AIX Chat' }),
        });
        if (sessionRes.ok) {
          const sessionData = await sessionRes.json();
          sid = sessionData.id || sessionData.session_id;
        }
      }

      if (sid) {
        const chatRes = await fetch(`${HERMES_API}/api/sessions/${sid}/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message }),
          signal: AbortSignal.timeout(90000),
        });

        if (chatRes.ok) {
          const chatData = await chatRes.json();
          return NextResponse.json({
            success: true,
            response: chatData.response || chatData.message || 'No response',
            session_id: sid,
            source: 'hermes-session',
            duration_ms: Date.now() - startTime,
          });
        }
      }
    } catch (e: any) {
      console.log('[DrAix] Session chat failed:', e.message);
    }

    return NextResponse.json({
      success: false,
      error: 'Hermes API unavailable. Make sure "hermes serve" is running on port 8000.',
    }, { status: 502 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
