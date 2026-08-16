'use client';
import { useEffect, useState } from 'react';
export default function PluginsPage() {
  const [plugins, setPlugins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetchPlugins(); }, []);
  const fetchPlugins = async () => {
    try { const res = await fetch('/api/draix/api/dashboard/plugins'); if (res.ok) { const d = await res.json(); setPlugins(Array.isArray(d) ? d : (d.plugins || [])); } } catch(e){} finally { setLoading(false); }
  };
  return (
    <div style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', marginBottom: '24px' }}>🔌 Plugins</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
        {loading ? <p>Loading...</p> : plugins.map(p => (
          <div key={p.name} className="drx-card">
            <h3 style={{ fontWeight: 'bold' }}>{p.name}</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{p.description || ''}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
