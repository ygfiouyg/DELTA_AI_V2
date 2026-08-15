'use client';
import { useEffect, useState } from 'react';
interface KanbanTask { id: string; title: string; status?: string; assignee?: string; priority?: string; }
export default function KanbanPage() {
  const [tasks, setTasks] = useState<KanbanTask[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetchTasks(); }, []);
  const fetchTasks = async () => {
    try { const res = await fetch('/api/draix/kanban'); if (res.ok) { const d = await res.json(); setTasks(Array.isArray(d) ? d : (d.tasks || [])); } } catch(e){} finally { setLoading(false); }
  };
  const columns = ['todo', 'in_progress', 'done'];
  const colLabels: Record<string,string> = { todo: '📋 To Do', in_progress: '🔄 In Progress', done: '✅ Done' };
  return (
    <div style={{ padding: '32px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' }}>📋 Kanban Board</h1>
      <div style={{ display: 'flex', gap: '24px', overflowX: 'auto' }}>
        {columns.map(col => (
          <div key={col} style={{ minWidth: '300px', flex: 1 }}>
            <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: 'bold' }}>{colLabels[col]}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {loading ? <p>Loading...</p> : tasks.filter(t => (t.status || 'todo') === col).map(t => (
                <div key={t.id} className="draix-card" style={{ padding: '16px' }}>
                  <h4 style={{ fontWeight: 'bold', fontSize: '14px' }}>{t.title}</h4>
                  {t.assignee && <p style={{ fontSize: '12px', color: 'var(--draix-muted)', marginTop: '4px' }}>@{t.assignee}</p>}
                  {t.priority && <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '8px', backgroundColor: t.priority === 'high' ? 'rgba(239,68,68,0.2)' : 'var(--draix-hover)', marginTop: '8px', display: 'inline-block' }}>{t.priority}</span>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
