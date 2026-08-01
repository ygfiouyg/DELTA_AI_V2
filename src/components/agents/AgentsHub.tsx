'use client';

import { useEffect, useState, useRef, useCallback } from 'react';

// ─── Types ──────────────────────────────────────────
interface UnifiedAgent {
  id: string;
  name: string;
  nameAr?: string;
  description: string;
  descriptionAr?: string;
  icon: string;
  color: string;
  category: 'external' | 'custom' | 'builtin' | 'specialized';
  type: 'hermes' | 'anzaro' | 'massive-tools' | 'custom' | 'specialized' | 'recipe';
  available: boolean;
  endpoint: string;
  features?: string[];
  stats?: Record<string, any>;
  config?: Record<string, any>;
}

interface PlatformModel {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  category: string;
  provider: string;
  realChatModel: string;
  maxTokens: number;
  openSource: boolean;
  capabilities: Record<string, boolean>;
  skills: string[];
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  agentId?: string;
  error?: boolean;
  loading?: boolean;
}

// ─── Component ──────────────────────────────────────
export function AgentsHub({ onBack }: { onBack: () => void }) {
  const [agents, setAgents] = useState<UnifiedAgent[]>([]);
  const [models, setModels] = useState<PlatformModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<UnifiedAgent | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'builtin' | 'external' | 'custom' | 'specialized'>('all');
  const [view, setView] = useState<'agents' | 'models'>('agents');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load agents list
  useEffect(() => {
    loadAgents();
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadAgents = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/agents-list');
      const data = await res.json();
      if (data.success) {
        setAgents(data.agents || []);
        setModels(data.models || []);
      } else {
        setError(data.error || 'Failed to load agents');
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredAgents = agents.filter(a => {
    if (filter === 'all') return true;
    return a.category === filter;
  });

  const handleSelectAgent = (agent: UnifiedAgent) => {
    setSelectedAgent(agent);
    setMessages([]);
    setError(null);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !selectedAgent || sending) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
      agentId: selectedAgent.id,
    };

    const loadingMessage: ChatMessage = {
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      agentId: selectedAgent.id,
      loading: true,
    };

    setMessages(prev => [...prev, userMessage, loadingMessage]);
    setInput('');
    setSending(true);
    setError(null);

    try {
      let response: Response;

      if (selectedAgent.type === 'hermes') {
        // Hermes endpoint
        response = await fetch('/api/hermes/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: userMessage.content,
            yolo: true,
          }),
        });
      } else if (selectedAgent.type === 'massive-tools') {
        // Massive tools — treat as tool execution query
        response = await fetch('/api/massive-tools/exec', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tool: 'sentiment_analysis',
            args: { text: userMessage.content, language: 'auto' },
          }),
        });
      } else {
        // Anzaro AI / custom agents — use chat/agent endpoint
        response = await fetch('/api/chat/agent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: userMessage.content,
            agentId: selectedAgent.type === 'custom' ? selectedAgent.id : undefined,
          }),
        });
      }

      const data = await response.json();

      // Remove loading message and add real response
      setMessages(prev => {
        const withoutLoading = prev.filter(m => !m.loading);
        const responseContent =
          selectedAgent.type === 'hermes'
            ? data.response || data.error || 'No response'
            : selectedAgent.type === 'massive-tools'
            ? JSON.stringify(data.output || data, null, 2).slice(0, 2000)
            : data.response || data.message || JSON.stringify(data).slice(0, 2000);

        return [
          ...withoutLoading,
          {
            role: 'assistant',
            content: responseContent,
            timestamp: Date.now(),
            agentId: selectedAgent.id,
            error: !data.success && !response.ok,
          },
        ];
      });
    } catch (e: any) {
      setMessages(prev => {
        const withoutLoading = prev.filter(m => !m.loading);
        return [
          ...withoutLoading,
          {
            role: 'assistant',
            content: `Error: ${e.message}`,
            timestamp: Date.now(),
            agentId: selectedAgent.id,
            error: true,
          },
        ];
      });
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // ─── Agent Selection View ───────────────────────────
  if (!selectedAgent) {
    return (
      <div className="min-h-screen bg-background" dir="rtl">
        {/* Header */}
        <div className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm"
            >
              <span>→</span>
              <span>رجوع</span>
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold flex items-center gap-2">
                <span className="text-2xl">🤖</span>
                مركز الوكلاء والنماذج
              </h1>
              <p className="text-xs text-muted-foreground">
                {agents.length} وكيل + {models.length} نموذج — اختر المناسب لمهمتك
              </p>
            </div>
            <button
              onClick={loadAgents}
              className="px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm"
              title="تحديث"
            >
              🔄
            </button>
          </div>
        </div>

        {/* View tabs: Agents | Models */}
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setView('agents')}
              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                view === 'agents'
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'bg-muted/50 hover:bg-muted'
              }`}
            >
              🤖 الوكلاء ({agents.length})
            </button>
            <button
              onClick={() => setView('models')}
              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                view === 'models'
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'bg-muted/50 hover:bg-muted'
              }`}
            >
              🧠 النماذج ({models.length})
            </button>
          </div>

          {/* ─── Agents View ─── */}
          {view === 'agents' && (
            <>
              {/* Filter tabs */}
              <div className="flex gap-2 mb-6 flex-wrap">
                {([
                  { id: 'all', label: 'الكل', icon: '🌐' },
                  { id: 'builtin', label: 'مدمج', icon: '⚡' },
                  { id: 'specialized', label: 'متخصص', icon: '🎯' },
                  { id: 'external', label: 'خارجي', icon: '🔌' },
                  { id: 'custom', label: 'مخصص', icon: '✨' },
                ] as const).map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setFilter(tab.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      filter === tab.id
                        ? 'bg-primary text-primary-foreground shadow-lg'
                        : 'bg-muted/50 hover:bg-muted'
                    }`}
                  >
                    <span className="ml-1">{tab.icon}</span>
                    {tab.label}
                    <span className="mr-2 text-xs opacity-60">
                      {tab.id === 'all'
                        ? agents.length
                        : agents.filter(a => a.category === tab.id).length}
                    </span>
                  </button>
                ))}
              </div>

              {/* Error */}
              {error && (
                <div className="mb-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  ⚠️ {error}
                </div>
              )}

              {/* Loading */}
              {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="h-64 rounded-2xl bg-muted/30 animate-pulse" />
                  ))}
                </div>
              )}

              {/* Agents grid */}
              {!loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredAgents.map(agent => (
                    <AgentCard
                      key={agent.id}
                      agent={agent}
                      onSelect={() => handleSelectAgent(agent)}
                    />
                  ))}
                </div>
              )}

              {!loading && filteredAgents.length === 0 && (
                <div className="text-center py-20 text-muted-foreground">
                  <div className="text-5xl mb-4">🔍</div>
                  <p>لا توجد وكلاء في هذه الفئة</p>
                </div>
              )}
            </>
          )}

          {/* ─── Models View ─── */}
          {view === 'models' && !loading && (
            <ModelsGrid models={models} />
          )}
        </div>
      </div>
    );
  }

  // ─── Chat View ──────────────────────────────────────
  return (
    <div className="min-h-screen bg-background flex flex-col" dir="rtl">
      {/* Header */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSelectedAgent(null)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm"
          >
            <span>→</span>
            <span>الوكلاء</span>
          </button>
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${selectedAgent.color} flex items-center justify-center text-xl shadow-lg`}>
            {selectedAgent.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-sm truncate flex items-center gap-2">
              {selectedAgent.nameAr || selectedAgent.name}
              {!selectedAgent.available && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                  غير متاح
                </span>
              )}
            </h2>
            <p className="text-xs text-muted-foreground truncate">
              {selectedAgent.type === 'hermes' && selectedAgent.stats?.version
                ? `Hermes v${selectedAgent.stats.version}`
                : selectedAgent.type === 'massive-tools' && selectedAgent.stats?.total_tools
                ? `${selectedAgent.stats.total_tools.toLocaleString()} أداة`
                : selectedAgent.descriptionAr?.slice(0, 60) || selectedAgent.description.slice(0, 60)}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-20">
              <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${selectedAgent.color} flex items-center justify-center text-4xl shadow-xl mb-4`}>
                {selectedAgent.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">
                {selectedAgent.nameAr || selectedAgent.name}
              </h3>
              <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
                {selectedAgent.descriptionAr || selectedAgent.description}
              </p>
              {/* Features */}
              {selectedAgent.features && selectedAgent.features.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center max-w-lg mx-auto mb-6">
                  {selectedAgent.features.slice(0, 6).map((f, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-muted/50 text-xs">
                      {f}
                    </span>
                  ))}
                </div>
              )}
              {/* Hermes not ready warning */}
              {selectedAgent.type === 'hermes' && selectedAgent.config?.needs_api_key && (
                <div className="max-w-md mx-auto p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 text-sm text-right">
                  <p className="font-bold mb-1">⚠️ يحتاج إعداد</p>
                  <p>Hermes مثبت لكن محتاج API key. أضف مفتاح في:</p>
                  <code className="block mt-2 p-2 rounded bg-muted text-xs" dir="ltr">
                    ~/.hermes/.env
                  </code>
                  <p className="mt-2 text-xs">مثال: OPENAI_API_KEY=sk-... أو ANTHROPIC_API_KEY=sk-...</p>
                </div>
              )}
              {/* Suggestions */}
              <div className="flex flex-col gap-2 max-w-md mx-auto">
                {getSuggestions(selectedAgent).map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(s)}
                    className="px-4 py-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors text-sm text-right"
                  >
                    💡 {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : msg.error
                    ? 'bg-destructive/10 border border-destructive/20'
                    : 'bg-muted'
                }`}
              >
                {msg.loading ? (
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-xs text-muted-foreground">يفكر...</span>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap text-sm break-words" dir="auto">
                    {msg.content}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="sticky bottom-0 backdrop-blur-xl bg-background/80 border-t border-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex gap-2 items-end">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`اكتب رسالة لـ ${selectedAgent.nameAr || selectedAgent.name}...`}
                disabled={sending || !selectedAgent.available}
                rows={1}
                className="w-full resize-none rounded-2xl bg-muted/50 border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 max-h-32 disabled:opacity-50"
                style={{ minHeight: '48px' }}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || sending || !selectedAgent.available}
              className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50 hover:bg-primary/90 transition-colors flex-shrink-0"
            >
              {sending ? '⏳' : '➤'}
            </button>
          </div>
          {selectedAgent.type === 'hermes' && (
            <p className="text-xs text-muted-foreground mt-2 text-center">
              ⚡ مدعوم بـ Hermes Agent — قد يستغرق 30-90 ثانية للرد
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Agent Card Component ───────────────────────────
function AgentCard({ agent, onSelect }: { agent: UnifiedAgent; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      disabled={!agent.available}
      className={`relative overflow-hidden rounded-2xl p-5 text-right transition-all hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group ${
        agent.available ? 'cursor-pointer' : ''
      }`}
    >
      {/* Gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${agent.color} opacity-10 group-hover:opacity-20 transition-opacity`} />

      {/* Border */}
      <div className={`absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary/30 transition-colors`} />

      {/* Content */}
      <div className="relative z-10">
        {/* Icon + Name */}
        <div className="flex items-start gap-3 mb-3">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center text-2xl shadow-lg flex-shrink-0`}>
            {agent.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base truncate">
              {agent.nameAr || agent.name}
            </h3>
            <p className="text-xs text-muted-foreground">
              {agent.category === 'external' ? '🌐 خارجي' : agent.category === 'builtin' ? '⚡ مدمج' : '✨ مخصص'}
              {agent.type === 'hermes' && agent.stats?.version && ` · v${agent.stats.version}`}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
          {agent.descriptionAr || agent.description}
        </p>

        {/* Stats */}
        {agent.stats && Object.keys(agent.stats).length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {agent.type === 'hermes' && (
              <>
                {agent.stats.is_ready ? (
                  <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 text-xs font-medium">
                    ✓ جاهز
                  </span>
                ) : agent.stats.version ? (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-xs font-medium">
                    ⚠ يحتاج إعداد
                  </span>
                ) : null}
                {agent.stats.providers_count > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-muted text-xs">
                    {agent.stats.providers_count} مزود
                  </span>
                )}
                {agent.stats.skills_count > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-muted text-xs">
                    {agent.stats.skills_count} مهارة
                  </span>
                )}
              </>
            )}
            {agent.type === 'massive-tools' && agent.stats.total_tools > 0 && (
              <>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 text-xs font-medium">
                  {agent.stats.total_tools.toLocaleString()} أداة
                </span>
                <span className="px-2 py-0.5 rounded-full bg-muted text-xs">
                  {agent.stats.callable} قابل للاستدعاء
                </span>
              </>
            )}
            {agent.type === 'anzaro' && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-medium">
                {agent.stats.tools} أداة
              </span>
            )}
            {agent.type === 'custom' && agent.stats?.tools > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-muted text-xs">
                {agent.stats.tools} أداة
              </span>
            )}
          </div>
        )}

        {/* Features */}
        {agent.features && agent.features.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {agent.features.slice(0, 3).map((f, i) => (
              <span key={i} className="px-2 py-0.5 rounded bg-muted/50 text-xs text-muted-foreground">
                {f}
              </span>
            ))}
            {agent.features.length > 3 && (
              <span className="px-2 py-0.5 rounded bg-muted/50 text-xs text-muted-foreground">
                +{agent.features.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </button>
  );
}

// ─── Suggestions per agent type ─────────────────────
function getSuggestions(agent: UnifiedAgent): string[] {
  if (agent.type === 'hermes') {
    return [
      'اكتب script بايثون يحسب أرقام فيبوناتشي',
      'ابحث في الويب عن أحدث أخبار الذكاء الاصطناعي',
      'أنشئ skill جديدة لتلخيص المقالات',
      'شوف إيه الـ tools المتاحة عندك',
    ];
  }
  if (agent.type === 'massive-tools') {
    return [
      'حلل مشاعر النص: "أنا سعيد جداً اليوم"',
      'حل المعادلة: x^2 - 9 = 0',
      'ترجم "Hello World" للعربية',
      'اعمل QR code للرابط https://github.com',
    ];
  }
  if (agent.type === 'anzaro') {
    return [
      'ازيك؟ إيه أخبارك؟',
      'ساعدني أكتب كود بايثون',
      'اشرحلي مفهوم الذكاء الاصطناعي',
      'ترجم النص ده للإنجليزي',
    ];
  }
  if (agent.type === 'specialized') {
    return [
      'ساعدني في مهمتي',
      'إيه اللي تقدر تعمله؟',
      'اعمللي بحث عن موضوع',
    ];
  }
  return [
    'مرحباً!',
    'ساعدني في مهمة',
    'إيه اللي تقدر تعمله؟',
  ];
}

// ─── Models Grid Component ──────────────────────────
function ModelsGrid({ models }: { models: PlatformModel[] }) {
  const [filter, setFilter] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(models.map(m => m.category)))];
  const filtered = filter === 'all' ? models : models.filter(m => m.category === filter);

  return (
    <>
      {/* Category filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === cat
                ? 'bg-primary text-primary-foreground shadow-lg'
                : 'bg-muted/50 hover:bg-muted'
            }`}
          >
            {cat === 'all' ? '🌐 الكل' : getCategoryLabel(cat)}
            <span className="mr-2 text-xs opacity-60">
              {cat === 'all' ? models.length : models.filter(m => m.category === cat).length}
            </span>
          </button>
        ))}
      </div>

      {/* Models grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(model => (
          <ModelCard key={model.id} model={model} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <div className="text-5xl mb-4">🔍</div>
          <p>لا توجد نماذج في هذه الفئة</p>
        </div>
      )}
    </>
  );
}

// ─── Model Card Component ───────────────────────────
function ModelCard({ model }: { model: PlatformModel }) {
  const [expanded, setExpanded] = useState(false);

  const caps = model.capabilities || {};
  const activeCaps = Object.entries(caps).filter(([_, v]) => v).map(([k]) => k);

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="p-4 flex items-center gap-3 border-b border-border">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-2xl flex-shrink-0">
          {model.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm truncate">{model.name}</h3>
          <p className="text-xs text-muted-foreground truncate">{model.nameEn}</p>
        </div>
        {model.openSource && (
          <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 text-xs font-medium">
            مفتوح
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        {/* Provider + Category */}
        <div className="flex flex-wrap gap-2">
          <span className="px-2 py-0.5 rounded-full bg-muted text-xs">
            {getProviderLabel(model.provider)}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-muted text-xs">
            {getCategoryLabel(model.category)}
          </span>
        </div>

        {/* Max tokens */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>📊</span>
          <span>{(model.maxTokens / 1000).toFixed(0)}K tokens</span>
        </div>

        {/* Capabilities */}
        <div className="flex flex-wrap gap-1">
          {activeCaps.slice(0, 5).map(cap => (
            <span key={cap} className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs">
              {getCapabilityIcon(cap)} {getCapabilityLabel(cap)}
            </span>
          ))}
          {activeCaps.length > 5 && (
            <span className="px-2 py-0.5 rounded bg-muted text-xs">
              +{activeCaps.length - 5}
            </span>
          )}
        </div>

        {/* Expand button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-primary hover:underline w-full text-right"
        >
          {expanded ? 'إخفاء التفاصيل' : 'عرض التفاصيل'}
        </button>

        {/* Expanded details */}
        {expanded && (
          <div className="space-y-2 pt-2 border-t border-border">
            <div>
              <p className="text-xs text-muted-foreground mb-1">المعرف:</p>
              <code className="block p-2 rounded bg-muted text-xs" dir="ltr">{model.id}</code>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">النموذج الفعلي:</p>
              <code className="block p-2 rounded bg-muted text-xs" dir="ltr">{model.realChatModel}</code>
            </div>
            {model.skills.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">المهارات:</p>
                <div className="flex flex-wrap gap-1">
                  {model.skills.slice(0, 8).map((s, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-muted/50 text-xs">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Helper functions ───────────────────────────────
function getCategoryLabel(cat: string): string {
  const labels: Record<string, string> = {
    fast: '⚡ سريع',
    smart: '🧠 ذكي',
    creative: '🎨 مبدع',
    specialized: '🎯 متخصص',
    professional: '💼 مهني',
    global: '🌍 عالمي',
    dark: '🌑 مظلم',
    'hf-chat': '💬 HF Chat',
    'hf-image': '🖼️ HF Image',
    'hf-video': '🎬 HF Video',
    huggingface: '🤗 HuggingFace',
  };
  return labels[cat] || cat;
}

function getProviderLabel(provider: string): string {
  const labels: Record<string, string> = {
    openrouter: 'OpenRouter',
    gemini: 'Google Gemini',
    zhipuai: 'ZhipuAI',
    github: 'GitHub Models',
    groq: 'Groq',
    cerebras: 'Cerebras',
    pollinations: 'Pollinations',
    hf: 'HuggingFace',
    huggingface: 'HuggingFace',
    openai: 'OpenAI',
    ovh: 'OVHcloud',
    anthropic: 'Anthropic',
    cloudflare: 'Cloudflare',
  };
  return labels[provider] || provider;
}

function getCapabilityIcon(cap: string): string {
  const icons: Record<string, string> = {
    chat: '💬',
    vision: '👁️',
    imageGeneration: '🖼️',
    videoGeneration: '🎬',
    codeGeneration: '💻',
    pdfAnalysis: '📄',
    webSearch: '🔍',
    audioTTS: '🔊',
    functionCalling: '🔧',
    reasoning: '🧠',
    rag: '📚',
    largeContext: '📊',
    translation: '🌐',
    summarization: '📝',
  };
  return icons[cap] || '✨';
}

function getCapabilityLabel(cap: string): string {
  const labels: Record<string, string> = {
    chat: 'محادثة',
    vision: 'رؤية',
    imageGeneration: 'توليد صور',
    videoGeneration: 'توليد فيديو',
    codeGeneration: 'أكواد',
    pdfAnalysis: 'تحليل PDF',
    webSearch: 'بحث ويب',
    audioTTS: 'صوت',
    functionCalling: 'استدعاء دوال',
    reasoning: 'استدلال',
    rag: 'RAG',
    largeContext: 'سياق كبير',
    translation: 'ترجمة',
    summarization: 'تلخيص',
  };
  return labels[cap] || cap;
}
