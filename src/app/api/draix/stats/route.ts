import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const HERMES_API = 'http://localhost:8000';

export async function GET() {
  try {
    // محاولة جلب البيانات الحقيقية من Hermes
    const [healthRes, sessionsRes, jobsRes] = await Promise.allSettled([
      fetch(`${HERMES_API}/health/detailed`, { signal: AbortSignal.timeout(5000) }),
      fetch(`${HERMES_API}/api/sessions`, { signal: AbortSignal.timeout(5000) }),
      fetch(`${HERMES_API}/api/jobs`, { signal: AbortSignal.timeout(5000) }),
    ]);

    let agents = 0;
    let success = 0;
    let tasks = 0;

    if (healthRes.status === 'fulfilled' && healthRes.value.ok) {
      const health = await healthRes.value.json();
      agents = health.agents_online || health.active_agents || 0;
      success = health.success_rate || 0;
    }

    if (sessionsRes.status === 'fulfilled' && sessionsRes.value.ok) {
      const sessions = await sessionsRes.value.json();
      tasks = Array.isArray(sessions) ? sessions.length : (sessions.total || 0);
    }

    if (jobsRes.status === 'fulfilled' && jobsRes.value.ok) {
      const jobs = await jobsRes.value.json();
      tasks += Array.isArray(jobs) ? jobs.length : (jobs.total || 0);
    }

    return NextResponse.json({
      agents: agents || 1,
      success: success || 100,
      tasks: tasks || 0,
      source: 'hermes',
    });
  } catch (e: any) {
    return NextResponse.json({
      agents: 0,
      success: 0,
      tasks: 0,
      error: e.message,
      source: 'fallback',
    });
  }
}
