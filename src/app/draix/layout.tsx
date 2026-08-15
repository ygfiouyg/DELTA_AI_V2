'use client';

import { useState, useEffect } from 'react';
import './globals.css';

export default function DrAixLayout({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState({ agents: 0, success: 0, tasks: 0 });
  const [activity, setActivity] = useState('Idle');

  useEffect(() => {
    const saved = localStorage.getItem('draix-theme');
    if (saved) setDarkMode(saved === 'dark');
    
    // Fetch stats every 10 seconds
    fetchStats();
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
      <div className="flex h-screen bg-draix-bg-light dark:bg-draix-bg-dark text-draix-text-light dark:text-draix-text-dark overflow-hidden">
        
        {/* Left Navigation */}
        <aside className={`w-64 flex-shrink-0 border-l border-draix-border-light dark:border-draix-border-dark bg-draix-surface-light dark:bg-draix-surface-dark transition-all duration-300 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-20'}`}>
          {/* Logo */}
          <div className="h-16 flex items-center justify-center border-b border-draix-border-light dark:border-draix-border-dark flex-shrink-0">
            <span className="text-2xl font-bold text-draix-gold">DrAix</span>
          </div>
          
          {/* Nav Items */}
          <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
            {navItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-draix-hover-light dark:hover:bg-draix-hover-dark transition-colors"
              >
                <span className="text-xl">{item.icon}</span>
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </a>
            ))}
          </nav>

          {/* Bottom: User & Theme */}
          <div className="p-4 border-t border-draix-border-light dark:border-draix-border-dark flex-shrink-0">
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

        {/* Right Panel (System Overview + Activity) */}
        <aside className="w-80 flex-shrink-0 border-r border-draix-border-light dark:border-draix-border-dark bg-draix-surface-light dark:bg-draix-surface-dark hidden lg:block">
          <div className="p-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-draix-muted mb-4">System Overview</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-sm text-draix-muted">Agents Online</span>
                <span className="text-lg font-bold text-draix-gold">{stats.agents} / 250</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-draix-muted">Success Rate</span>
                <span className="text-lg font-bold text-draix-gold">{stats.success}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-draix-muted">Tasks Today</span>
                <span className="text-lg font-bold text-draix-gold">{stats.tasks}</span>
              </div>
            </div>

            {/* Activity */}
            <h3 className="text-xs font-bold uppercase tracking-wider text-draix-muted mb-4">Activity</h3>
            <div className="space-y-2">
              <div className={`flex items-center gap-2 p-2 rounded-lg ${activity !== 'Idle' ? 'bg-draix-gold/10' : ''}`}>
                <span className={`w-2 h-2 rounded-full ${activity !== 'Idle' ? 'bg-draix-gold animate-pulse' : 'bg-draix-muted'}`}></span>
                <span className="text-sm">{activity}</span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="mt-8 pt-8 border-t border-draix-border-light dark:border-draix-border-dark">
              <h3 className="text-xs font-bold uppercase tracking-wider text-draix-muted mb-4">Quick Links</h3>
              <div className="space-y-1">
                <a href="/draix/settings" className="block text-sm hover:text-draix-gold transition-colors">⚙️ Settings</a>
                <a href="/draix/appearance" className="block text-sm hover:text-draix-gold transition-colors">🎨 Appearance</a>
                <a href="/draix/billing" className="block text-sm hover:text-draix-gold transition-colors">💳 Billing</a>
              </div>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
