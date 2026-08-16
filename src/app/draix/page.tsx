'use client';
import { useEffect, useState } from 'react';

export default function DrAixWorkspace() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchSessions(); }, []);

  const fetchSessions = async () => {
    try {
      const res = await fetch('/api/draix/sessions');
      if (res.ok) {
        const data = await res.json();
        setSessions(Array.isArray(data) ? data.slice(0, 5) : (data.sessions || []).slice(0, 5));
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
    <div style={{ padding: '48px 32px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h1 style={{ fontSize: '48px', lineHeight: 1.1, marginBottom: '12px' }}>Dr. AIX Agent</h1>
        <p style={{ fontSize: '17px', color: 'var(--text-secondary)', fontWeight: 300 }}>Excellence in Every Interaction.</p>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <form onSubmit={(e) => { e.preventDefault(); window.location.href = '/draix/chat'; }} style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Ask Dr. AIX anything..."
            style={{
              width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border)',
              borderRadius: '14px', padding: '18px 60px 18px 22px', fontSize: '16px', color: 'var(--text-primary)',
              outline: 'none', transition: 'all 0.2s', fontFamily: 'inherit', boxShadow: 'var(--shadow-sm)',
            }}
            onFocus={(e) => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-soft)'; }}
            onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'var(--shadow-sm)'; }}
          />
          <button type="submit" style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'var(--accent)', color: '#1A1A1A', border: 'none', borderRadius: '10px', padding: '10px 14px', cursor: 'pointer', fontSize: '16px' }}>➤</button>
        </form>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '48px' }}>
        {quickActions.map((action) => (
          <a key={action.title} href={`/draix/chat?action=${action.title.toLowerCase()}`} className="drx-card" style={{ textAlign: 'center', padding: '18px 8px' }}>
            <div style={{ fontSize: '26px', marginBottom: '6px' }}>{action.icon}</div>
            <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '2px' }}>{action.title}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{action.desc}</div>
          </a>
        ))}
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '20px' }}>Recent Conversations</h2>
          <a href="/draix/sessions" style={{ fontSize: '13px', color: 'var(--accent)', fontWeight: 500 }}>View all →</a>
        </div>
        {loading ? <p>Loading...</p> : sessions.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {sessions.map((s) => (
              <a key={s.id} href={`/draix/chat?session=${s.id}`} className="drx-card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 500 }}>{s.title || `Session ${s.id.slice(0, 8)}`}</span>
                {s.model && <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{s.model}</span>}
              </a>
            ))}
          </div>
        ) : <p style={{ color: 'var(--text-muted)' }}>No conversations yet.</p>}
      </div>
    </div>
  );
}
