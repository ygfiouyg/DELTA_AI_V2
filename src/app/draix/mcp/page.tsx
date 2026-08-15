'use client';
import { useEffect, useState } from 'react';
interface McpServer { name: string; status?: string; url?: string; tools_count?: number; }
export default function McpPage() {
  const [servers, setServers] = useState<McpServer[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetchServers(); }, []);
  const fetchServers = async () => {
    try { const res = await fetch('/api/draix/mcp'); if (res.ok) { const d = await res.json(); setServers(Array.isArray(d) ? d : (d.servers || [])); } } catch(e){} finally { setLoading(false); }
  };
  return (
    <div style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '16px' }}>🔗 MCP Servers</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {loading ? <p>Loading...</p> : servers.map(s => (
          <div key={s.name} className="draix-card">
            <h3 style={{ fontWeight: 'bold' }}>{s.name}</h3>
            {s.url && <p style={{ fontSize: '14px', color: 'var(--draix-muted)' }}>{s.url}</p>}
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              {s.status && <span style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '12px', backgroundColor: s.status === 'connected' ? 'rgba(16,185,129,0.2)' : 'var(--draix-hover)' }}>{s.status}</span>}
              {s.tools_count !== undefined && <span style={{ fontSize: '12px', color: 'var(--draix-muted)' }}>{s.tools_count} tools</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
