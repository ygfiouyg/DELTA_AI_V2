'use client';

import { useState, useEffect } from 'react';
import './globals.css';

export default function DrAixLayout({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('draix-theme');
    if (saved) setDarkMode(saved === 'dark');
  }, []);

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
    <div className={darkMode ? 'dark' : ''} style={{ minHeight: '100vh' }}>
      <div style={{ display: 'flex', height: '100vh', backgroundColor: 'var(--draix-bg)', color: 'var(--draix-text)', overflow: 'hidden' }}>
        
        {/* Left Navigation */}
        <aside style={{ width: '250px', flexShrink: 0, borderLeft: '1px solid var(--draix-border)', backgroundColor: 'var(--draix-surface)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid var(--draix-border)' }}>
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--draix-gold)' }}>DrAix</span>
          </div>
          
          <nav style={{ padding: '16px', overflowY: 'auto', flex: 1 }}>
            {navItems.map((item) => (
              <a key={item.path} href={item.path} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '8px', textDecoration: 'none', color: 'var(--draix-text)', transition: 'background-color 0.2s' }} 
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--draix-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                <span style={{ fontSize: '20px' }}>{item.icon}</span>
                <span style={{ fontSize: '14px', fontWeight: 500 }}>{item.label}</span>
              </a>
            ))}
          </nav>

          <div style={{ padding: '16px', borderTop: '1px solid var(--draix-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--draix-gold)', opacity: 0.2, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--draix-gold)', fontWeight: 'bold' }}>A</div>
              <span style={{ fontSize: '14px' }}>Admin</span>
            </div>
            <button onClick={toggleTheme} style={{ padding: '8px', borderRadius: '8px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '16px' }}>
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, overflowY: 'auto' }}>
          {children}
        </main>

      </div>
    </div>
  );
}
