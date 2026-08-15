'use client';

import { useEffect, useState } from 'react';

export default function DrAixWorkspace() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await fetch('/api/draix/sessions');
      if (res.ok) {
        const data = await res.json();
        setSessions(Array.isArray(data) ? data.slice(0, 5) : []);
      }
    } catch {}
    finally { setLoading(false); }
  };

  const quickActions = [
    { icon: '🔍', title: 'Research', desc: 'Deep insights' },
    { icon: '📊', title: 'Analyze', desc: 'Smart analysis' },
    { icon: '⚙️', title: 'Automate', desc: 'Workflows' },
    { icon: '✨', title: 'Generate', desc: 'Content & more' },
    { icon: '🧪', title: 'Explore', desc: 'AI tools' },
  ];

  return (
    <div style={{ padding: '48px 48px', maxWidth: '900px', margin: '0 auto' }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: '56px' }}>
        <h1 style={{ fontSize: '52px', lineHeight: 1.1, marginBottom: '12px' }}>
          DrAix Agent
        </h1>
        <p style={{ fontSize: '18px', color: 'var(--draix-muted)', fontWeight: 300, letterSpacing: '0.01em' }}>
          Excellence in Every Interaction.
        </p>
      </div>

      {/* Composer */}
      <div style={{ marginBottom: '48px' }}>
        <form onSubmit={(e) => { e.preventDefault(); window.location.href = '/draix/chat'; }} style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Ask DrAix anything..."
            style={{
              width: '100%',
              background: 'var(--draix-surface)',
              border: '1px solid var(--draix-border)',
              borderRadius: '16px',
              padding: '20px 64px 20px 24px',
              fontSize: '17px',
              color: 'var(--draix-text)',
              outline: 'none',
              transition: 'all 0.3s',
              fontFamily: 'inherit',
              boxShadow: 'var(--draix-shadow)',
            }}
            onFocus={(e) => { e.target.style.borderColor = 'var(--draix-gold)'; e.target.style.boxShadow = '0 0 0 4px rgba(197, 165, 114, 0.1)'; }}
            onBlur={(e) => { e.target.style.borderColor = 'var(--draix-border)'; e.target.style.boxShadow = 'var(--draix-shadow)'; }}
          />
          <button type="submit" style={{
            position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
            background: 'var(--draix-gold)', color: '#1A1A1A', border: 'none',
            borderRadius: '12px', padding: '12px', cursor: 'pointer', fontSize: '18px',
            transition: 'all 0.2s',
          }}>
            ➤
          </button>
        </form>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '56px' }}>
        {quickActions.map((action) => (
          <a
            key={action.title}
            href={`/draix/chat?action=${action.title.toLowerCase()}`}
            className="draix-card"
            style={{ textAlign: 'center', textDecoration: 'none', color: 'inherit', padding: '20px 12px' }}
          >
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>{action.icon}</div>
            <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '2px' }}>{action.title}</div>
            <div style={{ fontSize: '11px', color: 'var(--draix-muted)' }}>{action.desc}</div>
          </a>
        ))}
      </div>

      {/* Recent Conversations */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '22px' }}>Recent Conversations</h2>
          <a href="/draix/sessions" style={{ fontSize: '13px', color: 'var(--draix-gold)', textDecoration: 'none' }}>View all →</a>
        </div>
        
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[1,2,3].map(i => (
              <div key={i} style={{ height: '64px', borderRadius: '12px', background: 'var(--draix-hover)', animation: 'draix-pulse 1.5s ease-in-out infinite' }} />
            ))}
          </div>
        ) : sessions.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {sessions.map((s) => (
              <a key={s.id} href={`/draix/chat?session=${s.id}`} className="draix-card" style={{ padding: '16px 20px', textDecoration: 'none', color: 'inherit' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 500, fontSize: '15px' }}>{s.title || `Session ${s.id.slice(0, 8)}`}</span>
                  {s.model && <span style={{ fontSize: '12px', color: 'var(--draix-muted)' }}>{s.model}</span>}
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--draix-muted)' }}>
            <p style={{ fontSize: '15px' }}>No conversations yet. Start a new chat!</p>
          </div>
        )}
      </div>
    </div>
  );
}
