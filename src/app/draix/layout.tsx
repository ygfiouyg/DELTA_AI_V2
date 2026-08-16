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
    { icon: '🧠', label: 'Skills', path: '/draix/skills' },
    { icon: '⏰', label: 'Cron', path: '/draix/cron' },
    { icon: '🔌', label: 'Plugins', path: '/draix/plugins' },
    { icon: '🔗', label: 'MCP', path: '/draix/mcp' },
    { icon: '📱', label: 'Channels', path: '/draix/channels' },
    { icon: '⚙️', label: 'Config', path: '/draix/config' },
    { icon: '🔑', label: 'Keys', path: '/draix/keys' },
    { icon: '🖥️', label: 'System', path: '/draix/system' },
  ];

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div style={{ display: 'flex', height: '100vh', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', overflow: 'hidden' }}>
        
        <aside style={{ width: '250px', flexShrink: 0, borderRight: '1px solid var(--border)', backgroundColor: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ height: '64px', display: 'flex', alignItems: 'center', paddingLeft: '20px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
            <span style={{ fontFamily: '"Playfair Display", serif', fontSize: '26px', fontWeight: 700, color: 'var(--accent)', letterSpacing: '-0.03em' }}>Dr. AIX</span>
          </div>
          
          <nav style={{ padding: '12px 10px', flex: 1, overflowY: 'auto' }}>
            {navItems.map((item) => (
              <a key={item.path} href={item.path} className="drx-nav-item">
                <span className="drx-nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </a>
            ))}
          </nav>

          <div style={{ padding: '12px', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1A1A1A', fontWeight: 700, fontSize: '13px' }}>A</div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>Admin</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ANOVA Ventures</div>
                </div>
              </div>
              <button onClick={toggleTheme} style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '6px 8px', cursor: 'pointer', color: 'var(--text-primary)', fontSize: '13px' }}>
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </aside>

        <main style={{ flex: 1, overflowY: 'auto' }}>
          {children}
        </main>

        <aside style={{ width: '280px', flexShrink: 0, borderLeft: '1px solid var(--border)', backgroundColor: 'var(--bg-secondary)', padding: '24px 20px', overflowY: 'auto' }} className="hidden lg:block">
          <h3 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '20px', fontWeight: 600 }}>System Overview</h3>
          
          <div style={{ marginBottom: '28px' }}>
            <div className="drx-stat-value">{stats.agents}</div>
            <div className="drx-stat-label">Agents Online</div>
          </div>
          <div style={{ marginBottom: '28px' }}>
            <div className="drx-stat-value">{stats.success}%</div>
            <div className="drx-stat-label">Success Rate</div>
          </div>
          <div style={{ marginBottom: '28px' }}>
            <div className="drx-stat-value">{stats.tasks}</div>
            <div className="drx-stat-label">Tasks Today</div>
          </div>

          <hr className="drx-divider" />
          <h3 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '12px', fontWeight: 600 }}>Activity</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="drx-pulse" style={{ width: '8px', height: '8px', borderRadius: '50%', background: stats.tasks > 0 ? 'var(--accent)' : 'var(--text-muted)' }} />
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{stats.tasks > 0 ? 'Processing' : 'Idle'}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
