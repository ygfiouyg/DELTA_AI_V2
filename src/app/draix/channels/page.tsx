'use client';
import { useEffect, useState } from 'react';
interface Channel { id: string; name: string; status?: string; configured?: boolean; }
export default function ChannelsPage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetchChannels(); }, []);
  const fetchChannels = async () => {
    try { const res = await fetch('/api/draix/channels'); if (res.ok) { const d = await res.json(); setChannels(Array.isArray(d) ? d : (d.channels || d.platforms || [])); } } catch(e){} finally { setLoading(false); }
  };
  return (
    <div style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '16px' }}>📱 Channels</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
        {loading ? <p>Loading...</p> : channels.map(c => (
          <div key={c.id} className="draix-card">
            <h3 style={{ fontWeight: 'bold' }}>{c.name}</h3>
            <p style={{ fontSize: '14px', color: c.configured ? 'var(--draix-gold)' : 'var(--draix-muted)', marginTop: '4px' }}>{c.configured ? '✓ Configured' : 'Not configured'}</p>
            {c.status && <span style={{ fontSize: '12px', marginTop: '8px', display: 'inline-block' }}>{c.status}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
