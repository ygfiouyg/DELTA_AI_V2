'use client';
import { useEffect, useState } from 'react';
export default function SystemPage() {
  const [info, setInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetchInfo(); }, []);
  const fetchInfo = async () => {
    try { const res = await fetch('/api/draix/api/health'); if (res.ok) { setInfo(await res.json()); } } catch(e){} finally { setLoading(false); }
  };
  return (
    <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', marginBottom: '24px' }}>🖥️ System</h1>
      <div className="drx-card">
        {loading ? <p>Loading...</p> : info ? <pre style={{ fontSize: '14px', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>{JSON.stringify(info, null, 2)}</pre> : <p>No system info available.</p>}
      </div>
    </div>
  );
}
