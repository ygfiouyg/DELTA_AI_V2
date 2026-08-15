'use client';
import { useEffect, useState } from 'react';
export default function GitPage() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetchStatus(); }, []);
  const fetchStatus = async () => {
    try { const res = await fetch('/api/draix/git/status'); if (res.ok) { setStatus(await res.json()); } } catch(e){} finally { setLoading(false); }
  };
  return (
    <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' }}>🗂️ Git Integration</h1>
      <div className="draix-card">
        {loading ? <p>Loading...</p> : status ? (
          <div>
            <p style={{ marginBottom: '12px' }}><strong>Branch:</strong> {status.branch || 'main'}</p>
            <p style={{ marginBottom: '12px' }}><strong>Status:</strong> {status.clean ? '✓ Clean' : '⚠ Changes'}</p>
            {status.changes && <pre style={{ fontSize: '13px', fontFamily: 'monospace' }}>{JSON.stringify(status.changes, null, 2)}</pre>}
          </div>
        ) : <p>No Git data</p>}
      </div>
    </div>
  );
}
