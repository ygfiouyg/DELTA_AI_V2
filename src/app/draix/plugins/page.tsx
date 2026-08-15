'use client';
import { useEffect, useState } from 'react';

interface Plugin { name: string; description?: string; enabled?: boolean; version?: string; }
export default function PluginsPage() {
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetchPlugins(); }, []);
  const fetchPlugins = async () => {
    try { const res = await fetch('/api/draix/plugins'); if (res.ok) { const d = await res.json(); setPlugins(Array.isArray(d) ? d : (d.plugins || [])); } } catch(e){} finally { setLoading(false); }
  };
  const togglePlugin = async (name: string, enable: boolean) => {
    try { await fetch(`/api/draix/plugins/${name}/${enable ? 'enable' : 'disable'}`, { method: 'POST' }); fetchPlugins(); } catch(e){}
  };
  return (
    <div style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '16px' }}>🔌 Plugins</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {loading ? <p>Loading...</p> : plugins.map(p => (
          <div key={p.name} className="draix-card">
            <h3 style={{ fontWeight: 'bold' }}>{p.name}</h3>
            <p style={{ fontSize: '14px', color: 'var(--draix-muted)', marginTop: '4px' }}>{p.description || 'No description'}</p>
            {p.version && <p style={{ fontSize: '12px', color: 'var(--draix-muted)', marginTop: '8px' }}>v{p.version}</p>}
            <button onClick={() => togglePlugin(p.name, !p.enabled)} className={p.enabled ? 'draix-btn-secondary' : 'draix-btn-primary'} style={{ marginTop: '12px', fontSize: '14px' }}>{p.enabled ? 'Disable' : 'Enable'}</button>
          </div>
        ))}
      </div>
    </div>
  );
}
