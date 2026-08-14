'use client';

import { useEffect, useState, useRef } from 'react';

// ─── Types ──────────────────────────────────────────
interface HermesMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  error?: boolean;
  loading?: boolean;
  toolUsed?: string;
  durationMs?: number;
}

interface HermesStatus {
  installed: boolean;
  version: string | null;
  is_ready: boolean;
  configured_providers: string[];
  skills_count: number;
}

interface HermesSkill {
  name: string;
  description: string;
  has_skill_md: boolean;
}

// ─── Component ──────────────────────────────────────
export default function HermesPage() {
  const [status, setStatus] = useState<HermesStatus | null>(null);
  const [skills, setSkills] = useState<HermesSkill[]>([]);
  const [messages, setMessages] = useState<HermesMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [activeTab, setActiveTab] = useState<'chat' | 'skills' | 'tools'>('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load status
  useEffect(() => {
    loadStatus();
    loadSkills();
  }, []);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadStatus = async () => {
    try {
      const res = await fetch('/api/hermes/status');
      const data = await res.json();
      setStatus(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingStatus(false);
    }
  };

  const loadSkills = async () => {
    try {
      const res = await fetch('/api/hermes/skills');
      const data = await res.json();
      setSkills(data.skills || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || sending) return;

    const userMsg: HermesMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    };

    const loadingMsg: HermesMessage = {
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      loading: true,
    };

    setMessages(prev => [...prev, userMsg, loadingMsg]);
    setInput('');
    setSending(true);

    try {
      const res = await fetch('/api/hermes/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.content,
          yolo: true,
        }),
      });

      const data = await res.json();
      const responseContent = data.response || data.error || 'No response';
      const toolUsed = data.source === 'platform-models' ? 'Platform Bridge' : 'Hermes Native';

      setMessages(prev => {
        const withoutLoading = prev.filter(m => !m.loading);
        return [
          ...withoutLoading,
          {
            role: 'assistant',
            content: responseContent,
            timestamp: Date.now(),
            error: !data.success,
            toolUsed,
            durationMs: data.duration_ms,
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
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col" dir="rtl">
      {/* Header */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <a href="/" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm">
            <span>→</span>
            <span>الرئيسية</span>
          </a>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-2xl shadow-lg">
            ☤
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Hermes Agent</h1>
            <p className="text-xs text-muted-foreground">
              {loadingStatus ? 'جارٍ التحميل...' : status?.is_ready ? `جاهز • v${status.version}` : 'غير جاهز'}
            </p>
          </div>
          {status?.configured_providers && status.configured_providers.length > 0 && (
            <div className="hidden md:flex gap-2">
              {status.configured_providers.map(p => (
                <span key={p} className="px-2 py-1 rounded-full bg-muted text-xs">
                  {p}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="max-w-5xl mx-auto px-4 pb-2 flex gap-2">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'chat' ? 'bg-primary text-primary-foreground' : 'bg-muted/50'}`}
          >
            💬 محادثة
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'skills' ? 'bg-primary text-primary-foreground' : 'bg-muted/50'}`}
          >
            🧠 المهارات ({skills.length})
          </button>
          <button
            onClick={() => setActiveTab('tools')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'tools' ? 'bg-primary text-primary-foreground' : 'bg-muted/50'}`}
          >
            🛠️ الأدوات
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 py-6">
          {/* ─── Status Banner ─── */}
          {status && !status.is_ready && (
            <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600">
              <p className="font-bold mb-1">⚠️ Hermes مش جاهز</p>
              <p className="text-sm">Hermes مثبت بس محتاج API key. أضف مفتاح في السيرفر:</p>
              <code className="block mt-2 p-2 rounded bg-muted text-xs" dir="ltr">
                echo 'OPENROUTER_API_KEY=xxx' >> ~/.hermes/.env
              </code>
            </div>
          )}

          {/* ─── Chat Tab ─── */}
          {activeTab === 'chat' && (
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-20">
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-4xl shadow-xl mb-4">
                    ☤
                  </div>
                  <h3 className="text-xl font-bold mb-2">Hermes Agent</h3>
                  <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
                    وكيل ذكاء اصطناعي ذاتي التحسين. بينشئ مهارات من التجربة، بيبحث في المحادثات السابقة، وبيبني نموذج مستخدم.
                  </p>
                  <div className="flex flex-col gap-2 max-w-md mx-auto">
                    {['اكتبلي سكريبت بايثون', 'ابحث في الويب عن أحدث الأخبار', 'لخصلي مقالة طويلة'].map(s => (
                      <button
                        key={s}
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
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : msg.error
                      ? 'bg-destructive/10 border border-destructive/20'
                      : 'bg-muted'
                  }`}>
                    {msg.loading ? (
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <span className="text-xs text-muted-foreground">Hermes يفكر...</span>
                      </div>
                    ) : (
                      <>
                        <div className="whitespace-pre-wrap text-sm break-words" dir="auto">{msg.content}</div>
                        {msg.toolUsed && (
                          <div className="mt-2 pt-2 border-t border-border/50 text-xs text-muted-foreground flex justify-between">
                            <span>⚡ {msg.toolUsed}</span>
                            {msg.durationMs && <span>{(msg.durationMs / 1000).toFixed(1)}s</span>}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* ─── Skills Tab ─── */}
          {activeTab === 'skills' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {skills.map(skill => (
                <div key={skill.name} className="rounded-xl border border-border bg-card p-4">
                  <h3 className="font-bold text-sm mb-1">{skill.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{skill.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* ─── Tools Tab ─── */}
          {activeTab === 'tools' && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">الأدوات اللي Hermes بيستخدمها:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {['terminal', 'web_search', 'browser', 'file_edit', 'memory', 'delegate_task', 'cron', 'vision'].map(tool => (
                  <div key={tool} className="rounded-lg border border-border bg-card p-3 text-center">
                    <div className="text-2xl mb-1">
                      {tool === 'terminal' ? '⌨️' : tool === 'web_search' ? '🔍' : tool === 'browser' ? '🌐' : tool === 'file_edit' ? '📝' : tool === 'memory' ? '🧠' : tool === 'delegate_task' ? '🤖' : tool === 'cron' ? '⏰' : '👁️'}
                    </div>
                    <div className="text-xs font-medium">{tool}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input (only show on chat tab) */}
      {activeTab === 'chat' && (
        <div className="sticky bottom-0 backdrop-blur-xl bg-background/80 border-t border-border">
          <div className="max-w-5xl mx-auto px-4 py-4">
            <div className="flex gap-2 items-end">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="اكتب رسالة لـ Hermes..."
                disabled={sending}
                rows={1}
                className="flex-1 resize-none rounded-2xl bg-muted/50 border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 max-h-32"
                style={{ minHeight: '48px' }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || sending}
                className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50"
              >
                {sending ? '⏳' : '➤'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
