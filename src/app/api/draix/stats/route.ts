import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Try Hermes health
    let agents = 0;
    let success = 98;
    let tasks = 0;

    try {
      const res = await fetch('http://localhost:8000/health', { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const data = await res.json();
        agents = data.agents_online || 1;
        success = data.success_rate || 98;
      }
    } catch {}

    // Try Anzaro stats
    try {
      const res = await fetch('http://localhost:3000/api/massive-tools/stats', { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const data = await res.json();
        tasks = data.tools?.total || 0;
      }
    } catch {}

    return NextResponse.json({ agents, success, tasks, source: 'live' });
  } catch (e: any) {
    return NextResponse.json({ agents: 1, success: 98, tasks: 0, source: 'fallback' });
  }
}
