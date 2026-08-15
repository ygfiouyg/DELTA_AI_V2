'use client';
import { useEffect, useState } from 'react';
interface Key { provider: string; status?: string; key_preview?: string; }
export default function KeysPage() {
  const [keys, setKeys] = useState<Key[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetchKeys(); }, []);
  const fetchKeys = async () => {
    try { const res = await fetch('/api/draix/keys'); if (res.ok) { const d = await res.json(); setKeys(Array.isArray(d) ? d : (d.keys || d.credentials || [])); } } catch(e){} finally { setLoading(false); }
  };
  return (
    <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '16px' }}>🔑 API Keys</h1>
      {loading ? <p>Loading...</p> : keys.map(k => (
        <div key={k.provider} className="draix-card" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div><h3 style={{ fontWeight: 'bold' }}>{k.provider}</h3>{k.key_preview && <p style={{ fontSize: '14px', color: 'var(--draix-muted)' }}>{k.key_preview}</p>}</div>
          <span style={{ fontSize: '14px', color: k.status === 'active' ? 'var(--draix-gold)' : 'var(--draix-muted)' }}>{k.status || 'Unknown'}</span>
        </div>
      ))}
    </div>
  );
}
