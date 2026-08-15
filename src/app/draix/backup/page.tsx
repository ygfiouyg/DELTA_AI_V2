'use client';
import { useState } from 'react';
export default function BackupPage() {
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState('');
  const createBackup = async () => {
    setCreating(true); setMessage('');
    try { const res = await fetch('/api/draix/ops/backup', { method: 'POST' }); if (res.ok) { const d = await res.json(); setMessage('✅ Backup created!'); } else { setMessage('❌ Failed'); } } catch(e: any) { setMessage(`❌ ${e.message}`); } finally { setCreating(false); }
  };
  return (
    <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' }}>🔄 Backup & Import</h1>
      <div className="draix-card" style={{ marginBottom: '16px' }}>
        <h3 style={{ fontWeight: 'bold', marginBottom: '12px' }}>Create Backup</h3>
        <p style={{ color: 'var(--draix-muted)', marginBottom: '16px', fontSize: '14px' }}>Create a full backup of your Hermes Agent data, sessions, and configuration.</p>
        <button onClick={createBackup} disabled={creating} className="draix-btn-primary">{creating ? 'Creating...' : '💾 Create Backup'}</button>
        {message && <p style={{ marginTop: '12px' }}>{message}</p>}
      </div>
      <div className="draix-card">
        <h3 style={{ fontWeight: 'bold', marginBottom: '12px' }}>Download</h3>
        <a href="/api/draix/ops/backup/download" className="draix-btn-secondary" style={{ display: 'inline-block', textDecoration: 'none' }}>⬇️ Download Last Backup</a>
      </div>
    </div>
  );
}
