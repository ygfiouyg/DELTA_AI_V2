'use client';
import { useEffect, useState } from 'react';
export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetchData(); }, []);
  const fetchData = async () => {
    try { const res = await fetch('/api/draix/analytics/usage'); if (res.ok) { const d = await res.json(); setData(d); } } catch(e){} finally { setLoading(false); }
  };
  const stats = data ? [
    { label: 'Total Requests', value: data.total_requests || 0 },
    { label: 'Tokens Used', value: data.tokens_used || 0 },
    { label: 'Avg Response Time', value: `${data.avg_response_ms || 0}ms` },
    { label: 'Success Rate', value: `${data.success_rate || 0}%` },
  ] : [];
  return (
    <div style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' }}>📊 Analytics</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {loading ? <p>Loading...</p> : stats.map(s => (
          <div key={s.label} className="draix-card">
            <p style={{ fontSize: '12px', color: 'var(--draix-muted)', textTransform: 'uppercase' }}>{s.label}</p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--draix-gold)', marginTop: '8px' }}>{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
