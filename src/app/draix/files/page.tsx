'use client';
import { useEffect, useState } from 'react';
export default function FilesPage() {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetchFiles(); }, []);
  const fetchFiles = async () => {
    try { const res = await fetch('/api/draix/api/files'); if (res.ok) { const d = await res.json(); setFiles(Array.isArray(d) ? d : (d.files || [])); } } catch(e){} finally { setLoading(false); }
  };
  return (
    <div style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', marginBottom: '24px' }}>📁 Files</h1>
      {loading ? <p>Loading...</p> : files.length > 0 ? (
        <div className="drx-card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="drx-table"><thead><tr><th>Name</th><th>Size</th></tr></thead>
          <tbody>{files.map((f, i) => (<tr key={i}><td>{f.name || f.path}</td><td>{f.size || '-'}</td></tr>))}</tbody>
          </table>
        </div>
      ) : <p style={{ color: 'var(--text-muted)' }}>No files found.</p>}
    </div>
  );
}
