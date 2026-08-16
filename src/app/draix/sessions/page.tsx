'use client';
import { useEffect, useState } from 'react';
export default function SessionsPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetchSessions(); }, []);
  const fetchSessions = async () => {
    try { const res = await fetch('/api/draix/sessions'); if (res.ok) { const d = await res.json(); setSessions(Array.isArray(d) ? d : (d.sessions || [])); } } catch(e){} finally { setLoading(false); }
  };
  return (
    <div style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', marginBottom: '24px' }}>📜 Sessions</h1>
      {loading ? <p>Loading...</p> : sessions.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {sessions.map(s => (
            <a key={s.id} href={`/draix/chat?session=${s.id}`} className="drx-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 500 }}>{s.title || `Session ${s.id.slice(0,8)}`}</span>
              {s.model && <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{s.model}</span>}
            </a>
          ))}
        </div>
      ) : <p style={{ color: 'var(--text-muted)' }}>No sessions found.</p>}
    </div>
  );
}
