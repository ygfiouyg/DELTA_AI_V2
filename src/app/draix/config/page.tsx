'use client';
import { useEffect, useState } from 'react';
export default function ConfigPage() {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetchConfig(); }, []);
  const fetchConfig = async () => {
    try { const res = await fetch('/api/draix/api/config'); if (res.ok) { setConfig(await res.json()); } } catch(e){} finally { setLoading(false); }
  };
  return (
    <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', marginBottom: '24px' }}>⚙️ Config</h1>
      <div className="drx-card">
        {loading ? <p>Loading...</p> : config ? <pre style={{ fontSize: '14px', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>{JSON.stringify(config, null, 2)}</pre> : <p>No config available.</p>}
      </div>
    </div>
  );
}
