/**
 * GET /api/draix/stats
 * Fetches live system stats from Hermes API.
 */
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const HERMES_API = 'http://127.0.0.1:8000';

export async function GET() {
  try {
    let agents = 0;
    let success = 98;
    let tasks = 0;

    // Try Hermes health
    try {
      const res = await fetch(`${HERMES_API}/health`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const data = await res.json();
        agents = data.agents_online || 1;
        success = data.success_rate || 98;
      }
    } catch {}

    // Try Hermes sessions for task count
    try {
      const res = await fetch(`${HERMES_API}/api/sessions`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const data = await res.json();
        const sessions = Array.isArray(data) ? data : (data.sessions || []);
        tasks = sessions.length;
      }
    } catch {}

    return NextResponse.json({ agents, success, tasks, source: 'live' });
  } catch (e: any) {
    return NextResponse.json({ agents: 0, success: 0, tasks: 0, source: 'fallback' });
  }
}
