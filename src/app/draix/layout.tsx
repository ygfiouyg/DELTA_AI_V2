'use client';

import { useState, useEffect } from 'react';
import './globals.css';

export default function DrAixLayout({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(true);
  const [stats, setStats] = useState({ agents: 0, success: 0, tasks: 0 });

  useEffect(() => {
    const saved = localStorage.getItem('draix-theme');
    if (saved) setDarkMode(saved === 'dark');
    
    fetchStats();
    const interval = setInterval(fetchStats, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/draix/stats');
      if (res.ok) setStats(await res.json());
    } catch {}
  };

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('draix-theme', newMode ? 'dark' : 'light');
  };

  const navItems = [
    { icon: '💬', label: 'Chat', path: '/draix/chat' },
    { icon: '📜', label: 'Sessions', path: '/draix/sessions' },
    { icon: '📁', label: 'Files', path: '/draix/files' },
    { icon: '🤖', label: 'Models', path: '/draix/models' },
    { icon: '📋', label: 'Logs', path: '/draix/logs' },
    { icon: '⏰', label: 'Cron', path: '/draix/cron' },
    { icon: '🧠', label: 'Skills', path: '/draix/skills' },
    { icon: '🔌', label: 'Plugins', path: '/draix/plugins' },
    { icon: '🔗', label: 'MCP', path: '/draix/mcp' },
    { icon: '📱', label: 'Channels', path: '/draix/channels' },
    { icon: '🪝', label: 'Webhooks', path: '/draix/webhooks' },
    { icon: '🔐', label: 'Pairing', path: '/draix/pairing' },
    { icon: '👤', label: 'Profiles', path: '/draix/profiles' },
    { icon: '⚙️', label: 'Config', path: '/draix/config' },
    { icon: '🔑', label: 'Keys', path: '/draix/keys' },
    { icon: '🖥️', label: 'System', path: '/draix/system' },
    { icon: '📚', label: 'Docs', path: '/draix/docs' },
    { icon: '📋', label: 'Kanban', path: '/draix/kanban' },
    { icon: '🏆', label: 'Achievements', path: '/draix/achievements' },
  ];

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div style={{ display: 'flex', height: '100vh', backgroundColor: 'var(--draix-bg)', color: 'var(--draix-text)', overflow: 'hidden' }}>
        
        {/* ─── Left Navigation ─── */}
        <aside style={{ width: '260px', flexShrink: 0, borderRight: '1px solid var(--draix-border)', backgroundColor: 'var(--draix-surface)', display: 'flex', flexDirection: 'column' }}>
          {/* Logo */}
          <div style={{ height: '72px', display: 'flex', alignItems: 'center', paddingLeft: '24px', borderBottom: '1px solid var(--draix-border)' }}>
            <span style={{ fontFamily: '"Playfair Display", serif', fontSize: '28px', fontWeight: 700, color: 'var(--draix-gold)', letterSpacing: '-0.03em' }}>DrAix</span>
          </div>
          
          {/* Nav */}
          <nav style={{ padding: '16px 12px', flex: 1, overflowY: 'auto' }}>
            {navItems.map((item) => (
              <a key={item.path} href={item.path} className="draix-nav-item">
                <span className="draix-nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </a>
            ))}
          </nav>

          {/* Bottom */}
          <div style={{ padding: '16px', borderTop: '1px solid var(--draix-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--draix-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1A1A1A', fontWeight: 700, fontSize: '14px' }}>A</div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>Admin</div>
                  <div style={{ fontSize: '11px', color: 'var(--draix-muted)' }}>Pro Plan</div>
                </div>
              </div>
              <button onClick={toggleTheme} style={{ background: 'none', border: '1px solid var(--draix-border)', borderRadius: '8px', padding: '8px', cursor: 'pointer', color: 'var(--draix-text)', fontSize: '14px' }}>
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </aside>

        {/* ─── Main Content ─── */}
        <main style={{ flex: 1, overflowY: 'auto' }}>
          {children}
        </main>

        {/* ─── Right Panel ─── */}
        <aside style={{ width: '300px', flexShrink: 0, borderLeft: '1px solid var(--draix-border)', backgroundColor: 'var(--draix-surface)', padding: '28px 24px', overflowY: 'auto' }} className="hidden lg:block">
          <h3 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--draix-muted)', marginBottom: '20px' }}>System Overview</h3>
          
          <div style={{ marginBottom: '32px' }}>
            <div className="draix-stat-value">{stats.agents}</div>
            <div className="draix-stat-label">Agents Online</div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <div className="draix-stat-value">{stats.success}%</div>
            <div className="draix-stat-label">Success Rate</div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <div className="draix-stat-value">{stats.tasks}</div>
            <div className="draix-stat-label">Tasks Today</div>
          </div>

          <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: '1px solid var(--draix-border)' }}>
            <h3 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--draix-muted)', marginBottom: '16px' }}>Activity</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--draix-gold)' }} className="draix-pulse" />
              <span style={{ fontSize: '13px', color: 'var(--draix-text)' }}>{stats.tasks > 0 ? 'Processing' : 'Idle'}</span>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
