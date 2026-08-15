'use client';
import { useState, useEffect } from 'react';
export default function AppearancePage() {
  const [theme, setTheme] = useState('dark');
  const [font, setFont] = useState('Inter');
  useEffect(() => { const saved = localStorage.getItem('draix-theme'); if (saved) setTheme(saved); }, []);
  const changeTheme = (t: string) => { setTheme(t); localStorage.setItem('draix-theme', t); };
  const themes = [
    { id: 'dark', name: 'Dark', preview: '#1A1A1A' },
    { id: 'light', name: 'Light', preview: '#FAF9F6' },
  ];
  const fonts = ['Inter', 'Playfair Display', 'monospace'];
  return (
    <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' }}>🎨 Appearance</h1>
      <div className="draix-card" style={{ marginBottom: '24px' }}>
        <h3 style={{ fontWeight: 'bold', marginBottom: '16px' }}>Theme</h3>
        <div style={{ display: 'flex', gap: '16px' }}>
          {themes.map(t => (
            <div key={t.id} onClick={() => changeTheme(t.id)} style={{ cursor: 'pointer', border: theme === t.id ? '2px solid var(--draix-gold)' : '2px solid var(--draix-border)', borderRadius: '12px', padding: '16px', flex: 1 }}>
              <div style={{ width: '100%', height: '60px', borderRadius: '8px', backgroundColor: t.preview, marginBottom: '8px' }}></div>
              <p style={{ textAlign: 'center', fontWeight: 500 }}>{t.name}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="draix-card">
        <h3 style={{ fontWeight: 'bold', marginBottom: '16px' }}>Font</h3>
        <select value={font} onChange={(e) => setFont(e.target.value)} className="draix-input">
          {fonts.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>
    </div>
  );
}
