'use client';
import { useEffect, useState } from 'react';
interface Achievement { id: string; name: string; description?: string; unlocked?: boolean; date?: string; }
export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetchAchievements(); }, []);
  const fetchAchievements = async () => {
    try { const res = await fetch('/api/draix/achievements'); if (res.ok) { const d = await res.json(); setAchievements(Array.isArray(d) ? d : (d.achievements || [])); } } catch(e){} finally { setLoading(false); }
  };
  return (
    <div style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' }}>🏆 Achievements</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
        {loading ? <p>Loading...</p> : achievements.map(a => (
          <div key={a.id} className="draix-card" style={{ opacity: a.unlocked ? 1 : 0.5, textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '8px' }}>{a.unlocked ? '🏆' : '🔒'}</div>
            <h3 style={{ fontWeight: 'bold', fontSize: '16px' }}>{a.name}</h3>
            {a.description && <p style={{ fontSize: '12px', color: 'var(--draix-muted)', marginTop: '4px' }}>{a.description}</p>}
            {a.date && <p style={{ fontSize: '11px', color: 'var(--draix-gold)', marginTop: '8px' }}>{new Date(a.date).toLocaleDateString()}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
