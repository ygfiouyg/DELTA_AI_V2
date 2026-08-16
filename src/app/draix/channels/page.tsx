'use client';
import { useEffect, useState } from 'react';
export default function ChannelsPage() {
  const [channels, setChannels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetchChannels(); }, []);
  const fetchChannels = async () => {
    try { const res = await fetch('/api/draix/api/messaging/platforms'); if (res.ok) { const d = await res.json(); setChannels(Array.isArray(d) ? d : (d.platforms || [])); } } catch(e){} finally { setLoading(false); }
  };
  return (
    <div style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', marginBottom: '24px' }}>📱 Channels</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
        {loading ? <p>Loading...</p> : channels.map(c => (
          <div key={c.id || c.name} className="drx-card">
            <h3 style={{ fontWeight: 'bold' }}>{c.name || c.id}</h3>
            <span className={`drx-badge ${c.configured ? 'drx-badge-success' : 'drx-badge-muted'}`}>{c.configured ? 'Connected' : 'Not configured'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
