'use client';

import { useEffect, useState } from 'react';

export default function DrAixWorkspace() {
  const [stats, setStats] = useState({ agents: 0, success: 0, tasks: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/draix/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      // Fallback to zeros if API not ready
      setStats({ agents: 0, success: 0, tasks: 0 });
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { icon: '🔍', title: 'Research', desc: 'Deep insights', action: 'research' },
    { icon: '📊', title: 'Analyze', desc: 'Smart analysis', action: 'analyze' },
    { icon: '⚙️', title: 'Automate', desc: 'Workflows', action: 'automate' },
    { icon: '✨', title: 'Generate', desc: 'Content & more', action: 'generate' },
    { icon: '🧪', title: 'Explore', desc: 'AI tools', action: 'explore' },
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-display font-bold mb-3">DrAix Agent</h1>
        <p className="text-draix-muted text-lg">Excellence in Every Interaction.</p>
      </div>

      {/* Composer */}
      <div className="mb-8">
        <form onSubmit={(e) => { e.preventDefault(); window.location.href = '/draix/chat'; }} className="relative">
          <input
            type="text"
            placeholder="Ask DrAix anything..."
            className="w-full bg-draix-surface-light dark:bg-draix-surface-dark border border-draix-border-light dark:border-draix-border-dark rounded-2xl px-6 py-4 pl-16 text-lg focus:outline-none focus:border-draix-gold transition-colors"
          />
          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-draix-gold text-white p-3 rounded-xl hover:bg-draix-gold-hover transition-colors">
            ➤
          </button>
        </form>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
        {quickActions.map((action) => (
          <button
            key={action.action}
            onClick={() => window.location.href = `/draix/chat?action=${action.action}`}
            className="draix-card hover:border-draix-gold transition-all text-right"
          >
            <div className="text-3xl mb-2">{action.icon}</div>
            <h3 className="font-bold mb-1">{action.title}</h3>
            <p className="text-xs text-draix-muted">{action.desc}</p>
          </button>
        ))}
      </div>

      {/* Recent Conversations */}
      <div>
        <h2 className="text-xl font-bold mb-4">Recent Conversations</h2>
        <div id="recent-conversations" className="space-y-2">
          <p className="text-draix-muted text-sm">Loading conversations...</p>
        </div>
      </div>
    </div>
  );
}
