'use client';
import { useEffect, useState } from 'react';
export default function NotificationsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetchSettings(); }, []);
  const fetchSettings = async () => {
    try { const res = await fetch('/api/draix/notifications'); if (res.ok) { setSettings(await res.json()); } } catch(e){} finally { setLoading(false); }
  };
  return (
    <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' }}>🔔 Notifications</h1>
      <div className="draix-card">
        {loading ? <p>Loading...</p> : settings ? <pre style={{ fontSize: '14px' }}>{JSON.stringify(settings, null, 2)}</pre> : <p>No notification settings</p>}
      </div>
    </div>
  );
}
