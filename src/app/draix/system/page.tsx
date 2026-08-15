'use client';

import { useEffect, useState } from 'react';

interface SystemInfo {
  status?: string;
  version?: string;
  uptime?: string;
  memory?: { used: number; total: number };
  disk?: { used: number; total: number };
  cpu?: number;
}

export default function SystemPage() {
  const [info, setInfo] = useState<SystemInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSystemInfo();
    const interval = setInterval(fetchSystemInfo, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchSystemInfo = async () => {
    try {
      const res = await fetch('/api/draix/system');
      if (res.ok) {
        const data = await res.json();
        setInfo(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon, label, value, unit }: { icon: string; label: string; value: string | number; unit?: string }) => (
    <div className="draix-card">
      <div className="text-3xl mb-2">{icon}</div>
      <p className="text-xs text-draix-muted uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}{unit && <span className="text-sm text-draix-muted ml-1">{unit}</span>}</p>
    </div>
  );

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold mb-2">🖥️ System</h1>
        <p className="text-draix-muted">System health and diagnostics</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-32 rounded-xl bg-draix-hover-light dark:bg-draix-hover-dark animate-pulse"></div>
          ))}
        </div>
      ) : info ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon="💓" label="Status" value={info.status || 'Running'} />
            <StatCard icon="🔢" label="Version" value={info.version || 'N/A'} />
            <StatCard icon="⏱️" label="Uptime" value={info.uptime || 'N/A'} />
            <StatCard icon="🧠" label="CPU" value={info.cpu || 0} unit="%" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="draix-card">
              <h3 className="font-bold mb-4">Memory Usage</h3>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-draix-muted">{info.memory ? `${(info.memory.used / 1024 / 1024 / 1024).toFixed(1)}GB / ${(info.memory.total / 1024 / 1024 / 1024).toFixed(1)}GB` : 'N/A'}</span>
              </div>
              <div className="w-full bg-draix-hover-light dark:bg-draix-hover-dark rounded-full h-3">
                <div className="bg-draix-gold h-3 rounded-full transition-all" style={{ width: info.memory ? `${(info.memory.used / info.memory.total) * 100}%` : '0%' }}></div>
              </div>
            </div>

            <div className="draix-card">
              <h3 className="font-bold mb-4">Disk Usage</h3>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-draix-muted">{info.disk ? `${(info.disk.used / 1024 / 1024 / 1024).toFixed(1)}GB / ${(info.disk.total / 1024 / 1024 / 1024).toFixed(1)}GB` : 'N/A'}</span>
              </div>
              <div className="w-full bg-draix-hover-light dark:bg-draix-hover-dark rounded-full h-3">
                <div className="bg-draix-gold h-3 rounded-full transition-all" style={{ width: info.disk ? `${(info.disk.used / info.disk.total) * 100}%` : '0%' }}></div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button onClick={() => fetch('/api/draix/doctor', { method: 'POST' }).then(() => alert('Doctor check started'))} className="draix-btn-secondary">🩺 Run Doctor</button>
            <button onClick={() => fetch('/api/draix/security-audit', { method: 'POST' }).then(() => alert('Security audit started'))} className="draix-btn-secondary">🔒 Security Audit</button>
            <button onClick={() => window.open('/api/draix/backup/download', '_blank')} className="draix-btn-secondary">💾 Download Backup</button>
          </div>
        </>
      ) : (
        <div className="text-center py-20">
          <div className="text-4xl mb-4">🖥️</div>
          <p className="text-draix-muted">Unable to fetch system info</p>
          <p className="text-xs text-draix-muted mt-2">Make sure Hermes is running on port 8000</p>
        </div>
      )}
    </div>
  );
}
