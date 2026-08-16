'use client';
import { useEffect, useState } from 'react';
export default function McpPage() {
  const [servers, setServers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetchServers(); }, []);
  const fetchServers = async () => {
    try { const res = await fetch('/api/draix/api/mcp'); if (res.ok) { const d = await res.json(); setServers(Array.isArray(d) ? d : (d.servers || [])); } } catch(e){} finally { setLoading(false); }
  };
  return (
    <div style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', marginBottom: '24px' }}>🔗 MCP Servers</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
        {loading ? <p>Loading...</p> : servers.map(s => (
          <div key={s.name} className="drx-card">
            <h3 style={{ fontWeight: 'bold' }}>{s.name}</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{s.url || ''}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
