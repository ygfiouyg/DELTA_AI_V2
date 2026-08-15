'use client';
import { useEffect, useState } from 'react';
interface Pairing { id: string; status?: string; user?: string; }
export default function PairingPage() {
  const [pairings, setPairings] = useState<Pairing[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetchPairings(); }, []);
  const fetchPairings = async () => {
    try { const res = await fetch('/api/draix/pairing'); if (res.ok) { const d = await res.json(); setPairings(Array.isArray(d) ? d : (d.pairings || [])); } } catch(e){} finally { setLoading(false); }
  };
  const approve = async (id: string) => { try { await fetch(`/api/draix/pairing/approve`, { method: 'POST', body: JSON.stringify({ id }), headers: { 'Content-Type': 'application/json' } }); fetchPairings(); } catch(e){} };
  return (
    <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '16px' }}>🔐 Pairing</h1>
      {loading ? <p>Loading...</p> : pairings.map(p => (
        <div key={p.id} className="draix-card" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div><h3 style={{ fontWeight: 'bold' }}>{p.user || p.id}</h3><p style={{ fontSize: '14px', color: 'var(--draix-muted)' }}>{p.status}</p></div>
          {p.status === 'pending' && <button onClick={() => approve(p.id)} className="draix-btn-primary">Approve</button>}
        </div>
      ))}
    </div>
  );
}
