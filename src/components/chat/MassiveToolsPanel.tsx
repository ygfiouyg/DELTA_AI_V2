'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  X, Search, Wrench, Package, Database, Star, CheckCircle2,
  Download, ExternalLink, Loader2, TrendingUp, Boxes, Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ToolEntry {
  id: string;
  name: string;
  source: string;
  summary: string;
  category: string;
  installCmd: string;
  homepage: string;
  repository: string;
  keywords: string;
  author: string;
  license: string;
  version: string;
  stars: number;
  isVerified: boolean;
  isInstalled: boolean;
}

interface ToolStats {
  tools: {
    total: number;
    verified: number;
    installed: number;
    bySource: { source: string; count: number }[];
    byCategory: { category: string; count: number }[];
  };
  skills: {
    total: number;
    bySource: { source: string; count: number }[];
  };
}

interface MassiveToolsPanelProps {
  open: boolean;
  onClose: () => void;
}

const SOURCE_COLORS: Record<string, string> = {
  pypi: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  npm: 'bg-red-500/15 text-red-300 border-red-500/30',
  github: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
  mcp: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  local: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
};

const CATEGORY_ICONS: Record<string, string> = {
  ai: '🤖', ml: '🧠', data: '📊', media: '🎬', web: '🌐',
  utility: '🔧', dev: '⚡', science: '🔬', general: '📦',
};

export function MassiveToolsPanel({ open, onClose }: MassiveToolsPanelProps) {
  const [stats, setStats] = useState<ToolStats | null>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ToolEntry[]>([]);
  const [searching, setSearching] = useState(false);
  const [installing, setInstalling] = useState<string | null>(null);
  const [activeSource, setActiveSource] = useState<string>('all');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // load stats on open
  const loadStats = useCallback(async () => {
    try {
      const res = await fetch('/api/massive-tools/stats');
      const data = await res.json();
      if (data.success) setStats(data);
    } catch (e) {
      console.error('stats error', e);
    }
  }, []);

  useEffect(() => {
    if (open) loadStats();
  }, [open, loadStats]);

  // debounced search
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([]);
      return;
    }
    const t = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/massive-tools/search?q=${encodeURIComponent(query)}&limit=50`);
        const data = await res.json();
        if (data.success) setResults(data.results);
      } catch (e) {
        console.error('search error', e);
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  const handleInstall = async (tool: ToolEntry) => {
    setInstalling(tool.id);
    try {
      const res = await fetch('/api/massive-tools/install', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: tool.name, source: tool.source }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`✅ تم تثبيت ${tool.name} بنجاح!`, {
          description: `${tool.source} • ${data.durationMs}ms`,
        });
        // update local state
        setResults(prev => prev.map(t =>
          t.id === tool.id ? { ...t, isInstalled: true } : t
        ));
        loadStats();
      } else {
        toast.error(`فشل تثبيت ${tool.name}`, {
          description: data.error || 'غير معروف',
        });
      }
    } catch (e: any) {
      toast.error(`خطأ: ${e.message}`);
    } finally {
      setInstalling(null);
    }
  };

  const filtered = useMemo(() => {
    return results.filter(t => {
      if (activeSource !== 'all' && t.source !== activeSource) return false;
      if (activeCategory !== 'all' && t.category !== activeCategory) return false;
      return true;
    });
  }, [results, activeSource, activeCategory]);

  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800 bg-gradient-to-r from-emerald-950/40 to-zinc-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
              <Boxes className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Massive Tool Registry
                <Badge variant="outline" className="text-emerald-400 border-emerald-500/40">V.108</Badge>
              </h2>
              <p className="text-xs text-zinc-400">
                {stats ? `${stats.tools.total.toLocaleString()} أداة • ${stats.skills.total.toLocaleString()} مهارة` : 'جاري التحميل...'}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Stats Bar */}
        {stats && (
          <div className="px-5 py-3 border-b border-zinc-800 bg-zinc-900/50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard icon={<Package className="w-4 h-4" />} label="إجمالي الأدوات" value={stats.tools.total} color="emerald" />
              <StatCard icon={<Star className="w-4 h-4" />} label="موثقة" value={stats.tools.verified} color="amber" />
              <StatCard icon={<CheckCircle2 className="w-4 h-4" />} label="مثبتة" value={stats.tools.installed} color="sky" />
              <StatCard icon={<Sparkles className="w-4 h-4" />} label="المهارات" value={stats.skills.total} color="violet" />
            </div>
            {/* Source breakdown */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {stats.tools.bySource.map(s => (
                <button
                  key={s.source}
                  onClick={() => setActiveSource(activeSource === s.source ? 'all' : s.source)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                    activeSource === s.source
                      ? SOURCE_COLORS[s.source] || 'bg-zinc-700 text-white border-zinc-600'
                      : 'bg-zinc-800/50 text-zinc-400 border-zinc-700/50 hover:bg-zinc-700/50'
                  }`}
                >
                  {s.source}: {s.count.toLocaleString()}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search */}
        <div className="p-4 border-b border-zinc-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث في 100,000+ أداة... (مثال: pdf, tts, scraper, ml, vision)"
              className="pl-10 bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500"
            />
            {searching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-emerald-500" />}
          </div>
          {/* Category filter */}
          {results.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              <button
                onClick={() => setActiveCategory('all')}
                className={`text-xs px-2 py-0.5 rounded-full border transition-all ${
                  activeCategory === 'all' ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-zinc-800/50 text-zinc-400 border-zinc-700/50'
                }`}
              >الكل</button>
              {stats?.tools.byCategory.slice(0, 8).map(c => (
                <button
                  key={c.category}
                  onClick={() => setActiveCategory(activeCategory === c.category ? 'all' : c.category)}
                  className={`text-xs px-2 py-0.5 rounded-full border transition-all ${
                    activeCategory === c.category ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-zinc-800/50 text-zinc-400 border-zinc-700/50'
                  }`}
                >
                  {CATEGORY_ICONS[c.category] || '📦'} {c.category}: {c.count.toLocaleString()}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2">
            {!query.trim() && (
              <div className="text-center py-16 text-zinc-500">
                <Boxes className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium">ابحث عن أي أداة من {stats?.tools.total.toLocaleString() || '100,000+'} أداة</p>
                <p className="text-sm mt-1">جرّب: pdf, tts, scraper, ml, vision, chart, nlp, ocr</p>
              </div>
            )}
            {query.trim() && filtered.length === 0 && !searching && (
              <div className="text-center py-16 text-zinc-500">
                <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>مفيش نتائج لـ "{query}"</p>
              </div>
            )}
            {filtered.map((tool) => (
              <motion.div
                key={tool.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="group flex items-start gap-3 p-3 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900 hover:border-zinc-700 transition-all"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-white">{tool.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${SOURCE_COLORS[tool.source] || 'bg-zinc-700 text-zinc-300 border-zinc-600'}`}>
                      {tool.source}
                    </span>
                    <span className="text-[10px] text-zinc-500 flex items-center gap-0.5">
                      {CATEGORY_ICONS[tool.category] || '📦'} {tool.category}
                    </span>
                    {tool.isVerified && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
                    {tool.isInstalled && (
                      <span className="text-[10px] text-emerald-400 flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" /> مثبتة
                      </span>
                    )}
                    {tool.stars > 0 && (
                      <span className="text-[10px] text-zinc-500 flex items-center gap-0.5">
                        <TrendingUp className="w-3 h-3" /> {tool.stars.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-zinc-400 mt-1 line-clamp-2">{tool.summary || 'لا يوجد وصف'}</p>
                  {tool.keywords && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {tool.keywords.split(',').slice(0, 4).map((k, i) => (
                        <span key={i} className="text-[10px] px-1.5 py-0.5 bg-zinc-800/60 text-zinc-400 rounded">{k}</span>
                      ))}
                    </div>
                  )}
                  <p className="text-[10px] text-zinc-600 mt-1 font-mono">{tool.installCmd}</p>
                </div>
                <div className="flex flex-col gap-1.5 shrink-0">
                  {!tool.isInstalled && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleInstall(tool)}
                      disabled={installing === tool.id}
                      className="h-7 text-xs border-emerald-600/50 text-emerald-400 hover:bg-emerald-600/10"
                    >
                      {installing === tool.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
                      تثبيت
                    </Button>
                  )}
                  {tool.homepage && (
                    <a
                      href={tool.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center h-7 px-2 text-xs text-zinc-400 hover:text-white border border-zinc-700 rounded-md hover:bg-zinc-800"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-3 border-t border-zinc-800 bg-zinc-900/50 text-center">
          <p className="text-xs text-zinc-500">
            💡 في الشات، اكتب <code className="text-emerald-400 bg-zinc-800 px-1 rounded">ثبّت أداة: &lt;name&gt;</code> لتثبيت أي أداة فوراً
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  const colors: Record<string, string> = {
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    sky: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    violet: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
  };
  return (
    <div className={`flex items-center gap-2 p-2 rounded-lg border ${colors[color]}`}>
      {icon}
      <div>
        <p className="text-[10px] text-zinc-400">{label}</p>
        <p className="text-sm font-bold">{value.toLocaleString()}</p>
      </div>
    </div>
  );
}
