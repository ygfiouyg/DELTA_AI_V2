'use client';
import { useEffect, useState } from 'react';
export default function KeysPage() {
  const [keys, setKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetchKeys(); }, []);
  const fetchKeys = async () => {
    try { const res = await fetch('/api/draix/api/credentials/pool'); if (res.ok) { const d = await res.json(); setKeys(Array.isArray(d) ? d : (d.credentials || [])); } } catch(e){} finally { setLoading(false); }
  };
  return (
    <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', marginBottom: '24px' }}>🔑 API Keys</h1>
      {loading ? <p>Loading...</p> : keys.map(k => (
        <div key={k.provider} className="drx-card" style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 'bold' }}>{k.provider}</span>
          <span className={`drx-badge ${k.status === 'active' ? 'drx-badge-success' : 'drx-badge-muted'}`}>{k.status || 'Unknown'}</span>
        </div>
      ))}
    </div>
  );
}
