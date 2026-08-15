'use client';
import { useEffect, useState } from 'react';
export default function HooksPage() {
  const [hooks, setHooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetchHooks(); }, []);
  const fetchHooks = async () => {
    try { const res = await fetch('/api/draix/ops/hooks'); if (res.ok) { const d = await res.json(); setHooks(Array.isArray(d) ? d : (d.hooks || [])); } } catch(e){} finally { setLoading(false); }
  };
  const deleteHook = async (name: string) => { try { await fetch(`/api/draix/ops/hooks?name=${name}`, { method: 'DELETE' }); fetchHooks(); } catch(e){} };
  return (
    <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' }}>🪝 Hooks</h1>
      {loading ? <p>Loading...</p> : hooks.map(h => (
        <div key={h.name} className="draix-card" style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
          <div><h3 style={{ fontWeight: 'bold' }}>{h.name}</h3><p style={{ fontSize: '14px', color: 'var(--draix-muted)' }}>{h.event || ''}</p></div>
          <button onClick={() => deleteHook(h.name)} className="draix-btn-secondary" style={{ fontSize: '12px' }}>Delete</button>
        </div>
      ))}
    </div>
  );
}
