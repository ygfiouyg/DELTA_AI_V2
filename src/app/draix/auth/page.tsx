'use client';
import { useEffect, useState } from 'react';
export default function AuthPage() {
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetchProviders(); }, []);
  const fetchProviders = async () => {
    try { const res = await fetch('/api/draix/providers/oauth'); if (res.ok) { const d = await res.json(); setProviders(Array.isArray(d) ? d : (d.providers || [])); } } catch(e){} finally { setLoading(false); }
  };
  return (
    <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' }}>🔐 Authentication</h1>
      <div className="draix-card">
        <h3 style={{ fontWeight: 'bold', marginBottom: '16px' }}>OAuth Providers</h3>
        {loading ? <p>Loading...</p> : providers.map(p => (
          <div key={p.id || p.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--draix-border)' }}>
            <span>{p.name || p.id}</span>
            <span style={{ color: p.connected ? 'var(--draix-gold)' : 'var(--draix-muted)' }}>{p.connected ? '✓ Connected' : 'Not connected'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
