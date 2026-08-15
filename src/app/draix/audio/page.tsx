'use client';
import { useEffect, useState } from 'react';
export default function AudioPage() {
  const [voices, setVoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetchVoices(); }, []);
  const fetchVoices = async () => {
    try { const res = await fetch('/api/draix/audio/elevenlabs/voices'); if (res.ok) { const d = await res.json(); setVoices(Array.isArray(d) ? d : (d.voices || [])); } } catch(e){} finally { setLoading(false); }
  };
  return (
    <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' }}>🎙️ Audio</h1>
      <div className="draix-card">
        <h3 style={{ fontWeight: 'bold', marginBottom: '16px' }}>Available Voices</h3>
        {loading ? <p>Loading...</p> : voices.length > 0 ? voices.map(v => (
          <div key={v.id} style={{ padding: '12px 0', borderBottom: '1px solid var(--draix-border)', display: 'flex', justifyContent: 'space-between' }}>
            <div><strong>{v.name}</strong>{v.labels && <span style={{ fontSize: '12px', color: 'var(--draix-muted)', marginRight: '8px' }}> {v.labels.gender || ''}</span>}</div>
            <button className="draix-btn-secondary" style={{ fontSize: '12px', padding: '4px 12px' }}>▶ Preview</button>
          </div>
        )) : <p>No voices available</p>}
      </div>
    </div>
  );
}
