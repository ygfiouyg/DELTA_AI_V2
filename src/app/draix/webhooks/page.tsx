'use client';
import { useEffect, useState } from 'react';
interface Webhook { name: string; url?: string; enabled?: boolean; }
export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetchWebhooks(); }, []);
  const fetchWebhooks = async () => {
    try { const res = await fetch('/api/draix/webhooks'); if (res.ok) { const d = await res.json(); setWebhooks(Array.isArray(d) ? d : (d.webhooks || [])); } } catch(e){} finally { setLoading(false); }
  };
  const toggleWebhook = async (name: string, enabled: boolean) => {
    try { await fetch(`/api/draix/webhooks/${name}/enabled`, { method: 'PUT', body: JSON.stringify({ enabled: !enabled }), headers: { 'Content-Type': 'application/json' } }); fetchWebhooks(); } catch(e){}
  };
  return (
    <div style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '16px' }}>🪝 Webhooks</h1>
      {loading ? <p>Loading...</p> : webhooks.map(w => (
        <div key={w.name} className="draix-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div><h3 style={{ fontWeight: 'bold' }}>{w.name}</h3>{w.url && <p style={{ fontSize: '14px', color: 'var(--draix-muted)' }}>{w.url}</p>}</div>
          <button onClick={() => toggleWebhook(w.name, !!w.enabled)} className={w.enabled ? 'draix-btn-secondary' : 'draix-btn-primary'}>{w.enabled ? 'Disable' : 'Enable'}</button>
        </div>
      ))}
    </div>
  );
}
