'use client';
import { useEffect, useState } from 'react';
export default function InsightsPage() {
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetchInsights(); }, []);
  const fetchInsights = async () => {
    try { const res = await fetch('/api/draix/curator'); if (res.ok) { setInsights(await res.json()); } } catch(e){} finally { setLoading(false); }
  };
  return (
    <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' }}>📡 Insights & Monitoring</h1>
      <div className="draix-card">
        {loading ? <p>Loading...</p> : insights ? (
          <div>
            <p style={{ marginBottom: '12px' }}><strong>Curator:</strong> {insights.paused ? 'Paused' : 'Active'}</p>
            <p style={{ marginBottom: '12px' }}><strong>Insights:</strong> {insights.count || 0}</p>
            <p><strong>Last Run:</strong> {insights.last_run ? new Date(insights.last_run).toLocaleString() : 'Never'}</p>
          </div>
        ) : <p>No insights data</p>}
      </div>
    </div>
  );
}
