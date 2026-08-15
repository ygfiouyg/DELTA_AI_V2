'use client';

import { useState, useEffect } from 'react';
import './globals.css';

export default function DrAixLayout({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('draix-theme');
    if (saved) setDarkMode(saved === 'dark');
  }, []);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('draix-theme', newMode ? 'dark' : 'light');
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="flex h-screen bg-draix-bg-light dark:bg-draix-bg-dark text-draix-text-light dark:text-draix-text-dark overflow-hidden">
        
        {/* Left Navigation */}
        <aside className={`w-64 flex-shrink-0 border-l border-draix-border-light dark:border-draix-border-dark bg-draix-surface-light dark:bg-draix-surface-dark transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-20'}`}>
          {/* Logo */}
          <div className="h-16 flex items-center justify-center border-b border-draix-border-light dark:border-draix-border-dark">
            <span className="text-2xl font-bold text-draix-gold">DrAix</span>
          </div>
          
          {/* Nav Items */}
          <nav className="p-4 space-y-1">
            {[
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
            ].map((item) => (
              <a
                key={item.path}
                href={item.path}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-draix-hover-light dark:hover:bg-draix-hover-dark transition-colors group"
              >
                <span className="text-xl">{item.icon}</span>
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </a>
            ))}
          </nav>

          {/* Bottom: User & Theme */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-draix-border-light dark:border-draix-border-dark">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-draix-gold/20 flex items-center justify-center text-draix-gold font-bold">A</div>
                {sidebarOpen && <span className="text-sm">Admin</span>}
              </div>
              <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-draix-hover-light dark:hover:bg-draix-hover-dark">
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>

        {/* Right Panel (Context/Activity) */}
        <aside className={`w-80 flex-shrink-0 border-r border-draix-border-light dark:border-draix-border-dark bg-draix-surface-light dark:bg-draix-surface-dark transition-all duration-300 ${rightPanelOpen ? 'translate-x-0' : 'translate-x-full'} hidden lg:block`}>
          <div className="p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-draix-muted mb-4">System Overview</h3>
            {/* Stats will be injected here */}
            <div id="right-panel-content" className="space-y-4"></div>
          </div>
        </aside>

      </div>
    </div>
  );
}
