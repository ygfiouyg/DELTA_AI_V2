/**
 * POST /api/draix/chat
 * بيـ send message لـ Hermes Agent (على port 8000) ويرجّع الـ response.
 */
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 120;

const HERMES_API = 'http://localhost:8000';

export async function POST(req: NextRequest) {
  try {
    const { message, session_id, model } = await req.json();

    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'message required' }, { status: 400 });
    }

    // Try Hermes API first
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
          tool_used: data.choices?.[0]?.message?.tool_calls?.[0]?.function?.name || null,
          source: 'hermes',
        });
      }
    } catch (e: any) {
      console.log('[DrAix] Hermes API failed, trying fallback:', e.message);
    }

    // Fallback: try /api/sessions/{id}/chat
    try {
      const sessionRes = await fetch(`${HERMES_API}/api/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'DrAix Chat' }),
      });

      let sid = session_id;
      if (sessionRes.ok) {
        const sessionData = await sessionRes.json();
        sid = sessionData.id || sessionData.session_id;
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
          });
        }
      }
    } catch (e: any) {
      console.log('[DrAix] Session chat failed:', e.message);
    }

    // Last fallback: platform models
    try {
      const platformRes = await fetch(`http://localhost:${process.env.PORT || 3000}/api/chat/agent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, enableThinking: false }),
        signal: AbortSignal.timeout(60000),
      });

      if (platformRes.ok) {
        const data = await platformRes.json();
        return NextResponse.json({
          success: true,
          response: data.response || data.message || 'No response',
          source: 'platform',
        });
      }
    } catch (e: any) {
      console.log('[DrAix] Platform failed:', e.message);
    }

    return NextResponse.json({
      success: false,
      error: 'All backends failed. Check if Hermes is running on port 8000.',
    }, { status: 502 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
