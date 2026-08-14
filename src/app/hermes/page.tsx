'use client';

import { useEffect, useState, useRef } from 'react';

interface NovaMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  error?: boolean;
  loading?: boolean;
  source?: string;
  durationMs?: number;
}

export default function NovaAgentPage() {
  const [messages, setMessages] = useState<NovaMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'info'>('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || sending) return;

    const userMsg: NovaMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    };

    const loadingMsg: NovaMessage = {
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      loading: true,
    };

    setMessages(prev => [...prev, userMsg, loadingMsg]);
    setInput('');
    setSending(true);

    try {
      // محاولة استخدام Nova Agent API المباشر
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
            source: data.source === 'hermes-native' ? 'Nova Engine' : 'Platform Models',
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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-xl shadow-lg">⬡</div>
          <div className="flex-1">
            <h1 className="font-bold text-sm">Nova Agent</h1>
            <p className="text-xs text-muted-foreground">Self-improving AI Engine</p>
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
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-3xl shadow-xl mb-4">⬡</div>
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
                        <span className="text-xs">Nova يفكر...</span>
                      </div>
                    ) : (
                      <>
                        <div className="whitespace-pre-wrap text-sm break-words" dir="auto">{msg.content}</div>
                        {msg.source && (
                          <div className="mt-2 pt-2 border-t border-border/50 text-xs text-muted-foreground flex justify-between">
                            <span>⚡ {msg.source}</span>
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
                <h2 className="font-bold text-lg mb-4">حالة Nova Agent</h2>
                <div className="space-y-3 text-sm">
                  <p>Nova Agent هو محرك ذكاء اصطناعي مستقل بيعمل في Docker container منفصل.</p>
                  <p>بيـ integrate مع منصة Anzaro وبيـ provide:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                    <li>15+ مهارة جاهزة (research, coding, email, ...)</li>
                    <li>ذاكرة دائمة (persistent memory)</li>
                    <li>تقفي أثر المحادثات (session search)</li>
                    <li>جدولة المهام (cron scheduling)</li>
                    <li>أتمتة المهام (task automation)</li>
                  </ul>
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
                placeholder="اكتب رسالة لـ Nova..."
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
