'use client';
import { useEffect, useState } from 'react';
export default function ModelsPage() {
  const [models, setModels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetchModels(); }, []);
  const fetchModels = async () => {
    try { const res = await fetch('/api/draix/v1/models'); if (res.ok) { const d = await res.json(); setModels(d.data || d.models || []); } } catch(e){} finally { setLoading(false); }
  };
  return (
    <div style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', marginBottom: '24px' }}>🤖 Models</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
        {loading ? <p>Loading...</p> : models.map(m => (
          <div key={m.id} className="drx-card">
            <h3 style={{ fontWeight: 'bold', fontSize: '16px' }}>{m.id || m.name}</h3>
            {m.owned_by && <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{m.owned_by}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
