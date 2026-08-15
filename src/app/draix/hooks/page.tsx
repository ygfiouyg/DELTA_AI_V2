'use client';

import { useEffect, useState } from 'react';

export default function HooksPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/draix/hooks');
      if (res.ok) {
        const result = await res.json();
        setData(Array.isArray(result) ? result : (result.data || []));
      }
    } catch (e) {
      console.error('Failed to fetch hooks:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold mb-2">🪝 Hooks الخطاطيف</h1>
        <p className="text-draix-muted"></p>
      </div>

      <div className="draix-card">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-draix-gold"></div>
          </div>
        ) : data.length > 0 ? (
          <div className="space-y-3">
            {data.map((item, i) => (
              <div key={i} className="p-4 border border-draix-border-light dark:border-draix-border-dark rounded-lg hover:border-draix-gold transition-colors">
                <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(item, null, 2)}</pre>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">🪝 Hooks</div>
            <p className="text-draix-muted">No data available</p>
            <p className="text-xs text-draix-muted mt-2">Connected to: /api/draix/hooks</p>
          </div>
        )}
      </div>
    </div>
  );
}
