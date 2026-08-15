'use client';

import { useEffect, useState } from 'react';

interface CronJob {
  id: string;
  name?: string;
  schedule?: string;
  status?: string;
  next_run?: string;
  last_run?: string;
}

export default function CronPage() {
  const [jobs, setJobs] = useState<CronJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/draix/cron');
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.jobs || data.data || []);
        setJobs(list);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleJob = async (id: string, action: 'pause' | 'resume') => {
    try {
      await fetch(`/api/draix/cron/${id}/${action}`, { method: 'POST' });
      fetchJobs();
    } catch (e) {}
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">⏰ Cron Jobs</h1>
          <p className="text-draix-muted">Scheduled tasks and automations</p>
        </div>
        <button className="draix-btn-primary">+ New Job</button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="h-20 rounded-xl bg-draix-hover-light dark:bg-draix-hover-dark animate-pulse"></div>
          ))}
        </div>
      ) : jobs.length > 0 ? (
        <div className="space-y-3">
          {jobs.map((job) => (
            <div key={job.id} className="draix-card flex items-center justify-between">
              <div>
                <h3 className="font-bold">{job.name || `Job ${job.id.slice(0, 8)}`}</h3>
                <div className="flex gap-4 mt-1 text-xs text-draix-muted">
                  {job.schedule && <span>📅 {job.schedule}</span>}
                  {job.next_run && <span>⏭️ Next: {new Date(job.next_run).toLocaleString()}</span>}
                  {job.last_run && <span>✅ Last: {new Date(job.last_run).toLocaleString()}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs ${job.status === 'running' ? 'bg-green-500/20 text-green-500' : job.status === 'paused' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-draix-muted/20 text-draix-muted'}`}>
                  {job.status || 'unknown'}
                </span>
                {job.status === 'running' ? (
                  <button onClick={() => toggleJob(job.id, 'pause')} className="draix-btn-secondary text-sm">Pause</button>
                ) : (
                  <button onClick={() => toggleJob(job.id, 'resume')} className="draix-btn-secondary text-sm">Resume</button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-4xl mb-4">⏰</div>
          <p className="text-draix-muted">No scheduled jobs</p>
          <button className="draix-btn-primary mt-4">Create First Job</button>
        </div>
      )}
    </div>
  );
}
