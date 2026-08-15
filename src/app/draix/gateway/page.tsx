'use client';
import { useEffect, useState } from 'react';
export default function GatewayPage() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetchStatus(); }, []);
  const fetchStatus = async () => {
    try { const res = await fetch('/api/draix/gateway'); if (res.ok) { setStatus(await res.json()); } } catch(e){} finally { setLoading(false); }
  };
  const toggleGateway = async (action: string) => { try { await fetch(`/api/draix/gateway/${action}`, { method: 'POST' }); fetchStatus(); } catch(e){} };
  return (
    <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' }}>🌐 Gateway</h1>
      <div className="draix-card" style={{ marginBottom: '16px' }}>
        {loading ? <p>Loading...</p> : status ? (
          <div>
            <p style={{ marginBottom: '12px' }}><strong>Status:</strong> <span style={{ color: status.running ? 'var(--draix-gold)' : 'var(--draix-muted)' }}>{status.running ? '● Running' : '○ Stopped'}</span></p>
            {status.uptime && <p style={{ marginBottom: '12px' }}><strong>Uptime:</strong> {status.uptime}</p>}
          </div>
        ) : <p>No gateway data</p>}
      </div>
      <div style={{ display: 'flex', gap: '12px' }}>
        <button onClick={() => toggleGateway('start')} className="draix-btn-primary">Start</button>
        <button onClick={() => toggleGateway('stop')} className="draix-btn-secondary">Stop</button>
        <button onClick={() => toggleGateway('restart')} className="draix-btn-secondary">Restart</button>
      </div>
    </div>
  );
}
