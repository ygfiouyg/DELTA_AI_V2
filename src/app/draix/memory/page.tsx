'use client';
import { useEffect, useState } from 'react';
export default function MemoryPage() {
  const [memory, setMemory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetchMemory(); }, []);
  const fetchMemory = async () => {
    try { const res = await fetch('/api/draix/memory'); if (res.ok) { setMemory(await res.json()); } } catch(e){} finally { setLoading(false); }
  };
  return (
    <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' }}>🧠 Memory</h1>
      <div className="draix-card">
        {loading ? <p>Loading...</p> : memory ? (
          <div>
            <p style={{ marginBottom: '12px' }}><strong>Provider:</strong> {memory.provider || 'Default'}</p>
            <p style={{ marginBottom: '12px' }}><strong>Status:</strong> {memory.status || 'Active'}</p>
            <p style={{ marginBottom: '12px' }}><strong>Entries:</strong> {memory.entries || 0}</p>
            {memory.last_updated && <p><strong>Last Updated:</strong> {new Date(memory.last_updated).toLocaleString()}</p>}
          </div>
        ) : <p>No memory data</p>}
      </div>
    </div>
  );
}
