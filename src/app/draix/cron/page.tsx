'use client';
import { useEffect, useState } from 'react';
export default function CronPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetchJobs(); }, []);
  const fetchJobs = async () => {
    try { const res = await fetch('/api/draix/api/jobs'); if (res.ok) { const d = await res.json(); setJobs(Array.isArray(d) ? d : (d.jobs || [])); } } catch(e){} finally { setLoading(false); }
  };
  return (
    <div style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', marginBottom: '24px' }}>⏰ Cron Jobs</h1>
      {loading ? <p>Loading...</p> : jobs.length > 0 ? jobs.map(j => (
        <div key={j.id} className="drx-card" style={{ marginBottom: '12px' }}>
          <h3 style={{ fontWeight: 'bold' }}>{j.name || j.id}</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{j.schedule || 'No schedule'}</p>
        </div>
      )) : <p style={{ color: 'var(--text-muted)' }}>No scheduled jobs.</p>}
    </div>
  );
}
