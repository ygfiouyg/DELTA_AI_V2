'use client';

import { useEffect, useState, useRef } from 'react';

interface FileItem {
  name: string;
  path?: string;
  size?: number;
  type?: string;
  modified?: string;
}

export default function FilesPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const res = await fetch('/api/draix/files');
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.files || data.data || []);
        setFiles(list);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/draix/files/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        fetchFiles();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return '-';
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">📁 Files</h1>
          <p className="text-draix-muted">Upload, download, and manage files</p>
        </div>
        <div>
          <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" />
          <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="draix-btn-primary">
            {uploading ? 'Uploading...' : '↑ Upload File'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="h-16 rounded-xl bg-draix-hover-light dark:bg-draix-hover-dark animate-pulse"></div>
          ))}
        </div>
      ) : files.length > 0 ? (
        <div className="draix-card overflow-hidden p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-draix-border-light dark:border-draix-border-dark">
                <th className="text-right p-4 text-xs font-bold uppercase text-draix-muted">Name</th>
                <th className="text-right p-4 text-xs font-bold uppercase text-draix-muted">Size</th>
                <th className="text-right p-4 text-xs font-bold uppercase text-draix-muted">Modified</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {files.map((file, i) => (
                <tr key={i} className="border-b border-draix-border-light dark:border-draix-border-dark hover:bg-draix-hover-light dark:hover:bg-draix-hover-dark">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span>{file.type?.startsWith('image') ? '🖼️' : file.type?.startsWith('audio') ? '🎵' : file.type?.startsWith('video') ? '🎬' : '📄'}</span>
                      <span className="font-medium">{file.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-draix-muted">{formatSize(file.size)}</td>
                  <td className="p-4 text-sm text-draix-muted">{file.modified ? new Date(file.modified).toLocaleDateString() : '-'}</td>
                  <td className="p-4">
                    <button className="text-draix-gold hover:underline text-sm">Download</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-4xl mb-4">📁</div>
          <p className="text-draix-muted">No files yet</p>
          <button onClick={() => fileInputRef.current?.click()} className="draix-btn-primary mt-4">Upload First File</button>
        </div>
      )}
    </div>
  );
}
