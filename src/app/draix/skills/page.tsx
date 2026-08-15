'use client';

import { useEffect, useState } from 'react';

interface Skill {
  name: string;
  description?: string;
  installed?: boolean;
  category?: string;
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'installed' | 'available'>('all');

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await fetch('/api/draix/skills');
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.skills || data.data || []);
        setSkills(list);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = skills.filter(s => {
    const matchesSearch = s.name?.toLowerCase().includes(search.toLowerCase()) || s.description?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || (filter === 'installed' && s.installed) || (filter === 'available' && !s.installed);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold mb-2">🧠 Skills</h1>
        <p className="text-draix-muted">Browse and manage AI skills</p>
      </div>

      {/* Search + Filter */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search skills..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="draix-input flex-1"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="draix-input w-40"
        >
          <option value="all">All</option>
          <option value="installed">Installed</option>
          <option value="available">Available</option>
        </select>
      </div>

      {/* Skills Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-32 rounded-xl bg-draix-hover-light dark:bg-draix-hover-dark animate-pulse"></div>
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((skill) => (
            <div key={skill.name} className="draix-card hover:border-draix-gold transition-all">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold">{skill.name}</h3>
                {skill.installed && <span className="text-xs px-2 py-0.5 rounded-full bg-draix-gold/20 text-draix-gold">Installed</span>}
              </div>
              {skill.description && <p className="text-sm text-draix-muted line-clamp-3">{skill.description}</p>}
              {skill.category && <p className="text-xs text-draix-muted mt-2">Category: {skill.category}</p>}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-4xl mb-4">🧠</div>
          <p className="text-draix-muted">No skills found</p>
        </div>
      )}
    </div>
  );
}
