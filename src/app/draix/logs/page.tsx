'use client';
import { useEffect, useState } from 'react';

export default function LogsPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/draix/logs');
      if (res.ok) {
        const data = await res.json();
        setLogs(Array.isArray(data) ? data : (data.logs || []));
      }
    } catch (e) {} finally { setLoading(false); }
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '16px' }}>📋 Logs</h1>
      <div className="draix-card" style={{ fontFamily: 'monospace', fontSize: '13px', maxHeight: '600px', overflowY: 'auto' }}>
        {loading ? <p>Loading...</p> : logs.length > 0 ? logs.map((log, i) => <div key={i} style={{ padding: '4px 0', borderBottom: '1px solid var(--draix-border)' }}>{log}</div>) : <p>No logs available</p>}
      </div>
    </div>
  );
}
