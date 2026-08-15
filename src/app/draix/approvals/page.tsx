'use client';
import { useEffect, useState } from 'react';
export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetchApprovals(); }, []);
  const fetchApprovals = async () => {
    try { const res = await fetch('/api/draix/approvals'); if (res.ok) { const d = await res.json(); setApprovals(Array.isArray(d) ? d : (d.approvals || [])); } } catch(e){} finally { setLoading(false); }
  };
  return (
    <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' }}>🚪 Approvals</h1>
      {loading ? <p>Loading...</p> : approvals.map(a => (
        <div key={a.id} className="draix-card" style={{ marginBottom: '12px' }}>
          <h3 style={{ fontWeight: 'bold' }}>{a.action || a.id}</h3>
          <p style={{ fontSize: '14px', color: 'var(--draix-muted)' }}>{a.status}</p>
        </div>
      ))}
    </div>
  );
}
