'use client';
import { useEffect, useState } from 'react';
export default function PetsPage() {
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetchPets(); }, []);
  const fetchPets = async () => {
    try { const res = await fetch('/api/draix/pets'); if (res.ok) { const d = await res.json(); setPets(Array.isArray(d) ? d : (d.pets || [])); } } catch(e){} finally { setLoading(false); }
  };
  return (
    <div style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' }}>🐾 Pets</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
        {loading ? <p>Loading...</p> : pets.map(p => (
          <div key={p.id} className="draix-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '8px' }}>{p.emoji || '🐾'}</div>
            <h3 style={{ fontWeight: 'bold' }}>{p.name}</h3>
            <p style={{ fontSize: '12px', color: 'var(--draix-muted)' }}>{p.type || 'Pet'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
