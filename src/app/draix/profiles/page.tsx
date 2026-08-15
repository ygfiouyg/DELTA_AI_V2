'use client';
import { useEffect, useState } from 'react';
interface Profile { id: string; name: string; active?: boolean; }
export default function ProfilesPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetchProfiles(); }, []);
  const fetchProfiles = async () => {
    try { const res = await fetch('/api/draix/profiles'); if (res.ok) { const d = await res.json(); setProfiles(Array.isArray(d) ? d : (d.profiles || [])); } } catch(e){} finally { setLoading(false); }
  };
  return (
    <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '16px' }}>👤 Profiles</h1>
      {loading ? <p>Loading...</p> : profiles.map(p => (
        <div key={p.id} className="draix-card" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h3 style={{ fontWeight: 'bold' }}>{p.name}</h3>
          {p.active && <span style={{ color: 'var(--draix-gold)', fontSize: '14px' }}>● Active</span>}
        </div>
      ))}
    </div>
  );
}
