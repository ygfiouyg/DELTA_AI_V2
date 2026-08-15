'use client';
import { useEffect, useState } from 'react';
export default function ConfigPage() {
  const [config, setConfig] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetchConfig(); }, []);
  const fetchConfig = async () => {
    try { const res = await fetch('/api/draix/config'); if (res.ok) { const d = await res.json(); setConfig(d); } } catch(e){} finally { setLoading(false); }
  };
  return (
    <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '16px' }}>⚙️ Config</h1>
      <div className="draix-card">
        {loading ? <p>Loading...</p> : <pre style={{ fontSize: '14px', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>{JSON.stringify(config, null, 2)}</pre>}
      </div>
    </div>
  );
}
