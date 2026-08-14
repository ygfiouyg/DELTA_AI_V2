'use client';

import { useEffect, useState, useRef } from 'react';

interface HermesMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  error?: boolean;
  loading?: boolean;
  source?: string;
  durationMs?: number;
}

interface HermesStatus {
  installed: boolean;
  version: string | null;
  is_ready: boolean;
  configured_providers: string[];
  skills_count: number;
}

export default function HermesPage() {
  const [status, setStatus] = useState<HermesStatus | null>(null);
  const [messages, setMessages] = useState<HermesMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [activeTab, setActiveTab] = useState<'chat' | 'info'>('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadStatus();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadStatus = async () => {
    try {
      const res = await fetch('/api/hermes/status');
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
      }
    } catch (e) {
      // Silent fail
    } finally {
      setLoadingStatus(false);
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

      setMessages(prev => {
        const withoutLoading = prev.filter(m => !m.loading);
        return [
          ...withoutLoading,
          {
            role: 'assistant' as const,
            content: data.response || data.error || 'No response received',
            timestamp: Date.now(),
            error: !data.success,
            source: data.source || 'unknown',
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
            role: 'assistant' as const,
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
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <a href="/" className="px-3 py-2 rounded-lg hover:bg-muted text-sm">→ رجوع</a>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-xl shadow-lg">☤</div>
          <div className="flex-1">
            <h1 className="font-bold text-sm">Nova Agent</h1>
            <p className="text-xs text-muted-foreground">
              {loadingStatus ? '...' : status?.is_ready ? `✅ جاهز v${status.version}` : '⚠️ يستخدم موديلات المنصة'}
            </p>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 pb-2 flex gap-2">
          <button onClick={() => setActiveTab('chat')} className={`px-4 py-2 rounded-lg text-sm ${activeTab === 'chat' ? 'bg-primary text-primary-foreground' : 'bg-muted/50'}`}>💬 محادثة</button>
          <button onClick={() => setActiveTab('info')} className={`px-4 py-2 rounded-lg text-sm ${activeTab === 'info' ? 'bg-primary text-primary-foreground' : 'bg-muted/50'}`}>ℹ️ معلومات</button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {activeTab === 'chat' && (
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-20">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-3xl shadow-xl mb-4">☤</div>
                  <h3 className="text-lg font-bold mb-2">Nova Agent</h3>
                  <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
                    وكيل ذكاء اصطناعي ذاتي التحسين. بينشئ مهارات من التجربة وبيبحث في المحادثات السابقة.
                  </p>
                  <div className="flex flex-col gap-2 max-w-md mx-auto">
                    {['اكتبلي كود بايثون', 'ابحث في الويب', 'لخصلي موضوع'].map(s => (
                      <button key={s} onClick={() => setInput(s)} className="px-4 py-3 rounded-xl bg-muted/50 hover:bg-muted text-sm text-right">💡 {s}</button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : msg.error ? 'bg-destructive/10 border border-destructive/20' : 'bg-muted'}`}>
                    {msg.loading ? (
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <span className="text-xs">يفكر...</span>
                      </div>
                    ) : (
                      <>
                        <div className="whitespace-pre-wrap text-sm break-words" dir="auto">{msg.content}</div>
                        {msg.source && (
                          <div className="mt-2 pt-2 border-t border-border/50 text-xs text-muted-foreground flex justify-between">
                            <span>⚡ {msg.source === 'hermes-native' ? 'Hermes مباشر' : 'موديلات المنصة'}</span>
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

          {activeTab === 'info' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="font-bold text-lg mb-4">حالة Hermes</h2>
                {loadingStatus ? (
                  <p className="text-muted-foreground">جارٍ التحميل...</p>
                ) : status ? (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">مثبت:</span>
                      <span className="text-sm font-medium">{status.installed ? '✅ نعم' : '❌ لا'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">الإصدار:</span>
                      <span className="text-sm font-medium">{status.version || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">جاهز:</span>
                      <span className="text-sm font-medium">{status.is_ready ? '✅ نعم' : '⚠️ يستخدم موديلات المنصة'}</span>
                    </div>
                    {status.configured_providers && status.configured_providers.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">المزودين:</span>
                        <span className="text-sm font-medium">{status.configured_providers.join(', ')}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground">تعذر تحميل الحالة</p>
                )}
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="font-bold text-lg mb-4">كيف يعمل؟</h2>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>1. <strong>Hermes مباشر:</strong> لو Hermes مثبت ولديه API key، بيستخدم providers الخاصة بيه.</p>
                  <p>2. <strong>موديلات المنصة:</strong> لو Hermes مش جاهز، بيستخدم موديلات المنصة (GLM, OpenRouter, إلخ) كـ fallback.</p>
                  <p>3. <strong>النتيجة:</strong> الصفحة بتشتغل دائماً — حتى لو Hermes مش متثبت!</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      {activeTab === 'chat' && (
        <div className="sticky bottom-0 backdrop-blur-xl bg-background/80 border-t border-border">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex gap-2 items-end">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="اكتب رسالة..."
                disabled={sending}
                rows={1}
                className="flex-1 resize-none rounded-2xl bg-muted/50 border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 max-h-32"
                style={{ minHeight: '48px' }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || sending}
                className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50 flex-shrink-0"
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
