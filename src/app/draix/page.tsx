'use client';

import { useEffect, useState } from 'react';

interface Session {
  id: string;
  title: string;
  model?: string;
  updated_at?: string;
}

export default function DrAixWorkspace() {
  const [stats, setStats] = useState({ agents: 0, success: 0, tasks: 0 });
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [activity, setActivity] = useState<string>('Idle');

  useEffect(() => {
    fetchStats();
    fetchSessions();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/draix/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
        setActivity(data.tasks > 0 ? 'Processing' : 'Idle');
      }
    } catch (e) {}
  };

  const fetchSessions = async () => {
    try {
      const res = await fetch('/api/draix/sessions');
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.sessions || data.data || []);
        setSessions(list.slice(0, 5));
      }
    } catch (e) {}
    finally { setLoading(false); }
  };

  const quickActions = [
    { icon: '🔍', title: 'Research', desc: 'Deep insights', path: '/draix/chat?action=research' },
    { icon: '📊', title: 'Analyze', desc: 'Smart analysis', path: '/draix/chat?action=analyze' },
    { icon: '⚙️', title: 'Automate', desc: 'Workflows', path: '/draix/cron' },
    { icon: '✨', title: 'Generate', desc: 'Content & more', path: '/draix/chat?action=generate' },
    { icon: '🧪', title: 'Explore', desc: 'AI tools', path: '/draix/skills' },
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-display font-bold mb-3 text-draix-gold">DrAix Agent</h1>
        <p className="text-draix-muted text-lg">Excellence in Every Interaction.</p>
      </div>

      {/* Composer */}
      <div className="mb-8">
        <form onSubmit={(e) => { e.preventDefault(); window.location.href = '/draix/chat'; }} className="relative">
          <input
            type="text"
            placeholder="Ask DrAix anything..."
            className="w-full bg-draix-surface-light dark:bg-draix-surface-dark border border-draix-border-light dark:border-draix-border-dark rounded-2xl px-6 py-4 text-lg focus:outline-none focus:border-draix-gold transition-colors"
          />
          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-draix-gold text-white p-3 rounded-xl hover:bg-draix-gold-hover transition-colors">
            ➤
          </button>
        </form>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
        {quickActions.map((action) => (
          <a
            key={action.title}
            href={action.path}
            className="draix-card hover:border-draix-gold transition-all text-center cursor-pointer"
          >
            <div className="text-3xl mb-2">{action.icon}</div>
            <h3 className="font-bold text-sm mb-1">{action.title}</h3>
            <p className="text-xs text-draix-muted">{action.desc}</p>
          </a>
        ))}
      </div>

      {/* Recent Conversations */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Recent Conversations</h2>
          <a href="/draix/sessions" className="text-sm text-draix-gold hover:underline">View all →</a>
        </div>
        
        {loading ? (
          <div className="space-y-2">
            {[1,2,3].map(i => (
              <div key={i} className="h-16 rounded-xl bg-draix-hover-light dark:bg-draix-hover-dark animate-pulse"></div>
            ))}
          </div>
        ) : sessions.length > 0 ? (
          <div className="space-y-2">
            {sessions.map((session) => (
              <a
                key={session.id}
                href={`/draix/chat?session=${session.id}`}
                className="block p-4 rounded-xl border border-draix-border-light dark:border-draix-border-dark hover:border-draix-gold transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{session.title || 'Untitled'}</span>
                  {session.model && <span className="text-xs text-draix-muted">{session.model}</span>}
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-draix-muted">
            <p>No conversations yet. Start a new chat!</p>
          </div>
        )}
      </div>

      {/* System Stats (for Right Panel injection) */}
      <div className="hidden" id="system-stats" data-agents={stats.agents} data-success={stats.success} data-tasks={stats.tasks} data-activity={activity}></div>
    </div>
  );
}
