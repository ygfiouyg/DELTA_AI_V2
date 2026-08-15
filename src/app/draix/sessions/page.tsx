'use client';

import { useEffect, useState } from 'react';

interface Session {
  id: string;
  title?: string;
  model?: string;
  updated_at?: string;
  created_at?: string;
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await fetch('/api/draix/sessions');
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.sessions || data.data || []);
        setSessions(list);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = sessions.filter(s => 
    s.title?.toLowerCase().includes(search.toLowerCase()) || s.id.includes(search)
  );

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold mb-2">📜 Sessions</h1>
        <p className="text-draix-muted">All conversation sessions</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search sessions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="draix-input"
        />
      </div>

      {/* Sessions List */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="h-20 rounded-xl bg-draix-hover-light dark:bg-draix-hover-dark animate-pulse"></div>
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-2">
          {filtered.map((session) => (
            <a
              key={session.id}
              href={`/draix/chat?session=${session.id}`}
              className="block p-4 rounded-xl border border-draix-border-light dark:border-draix-border-dark hover:border-draix-gold transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{session.title || `Session ${session.id.slice(0, 8)}`}</h3>
                  {session.model && <p className="text-xs text-draix-muted mt-1">Model: {session.model}</p>}
                </div>
                <div className="text-left">
                  {session.updated_at && (
                    <p className="text-xs text-draix-muted">
                      {new Date(session.updated_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-4xl mb-4">📜</div>
          <p className="text-draix-muted">No sessions found</p>
          <a href="/draix/chat" className="draix-btn-primary mt-4 inline-block">Start New Chat</a>
        </div>
      )}
    </div>
  );
}
