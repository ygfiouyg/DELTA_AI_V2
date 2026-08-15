'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  loading?: boolean;
  tool?: string;
}

export default function DrAixChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [recording, setRecording] = useState(false);
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || sending) return;

    const userMsg: Message = { role: 'user', content: input.trim(), timestamp: Date.now() };
    const loadingMsg: Message = { role: 'assistant', content: '', timestamp: Date.now(), loading: true };

    setMessages(prev => [...prev, userMsg, loadingMsg]);
    setInput('');
    setSending(true);

    try {
      // استخدام Hermes API مباشرة (عبر proxy)
      const res = await fetch('/api/draix/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.content }),
      });

      const data = await res.json();
      
      setMessages(prev => {
        const withoutLoading = prev.filter(m => !m.loading);
        return [...withoutLoading, {
          role: 'assistant' as const,
          content: data.response || data.error || 'No response',
          timestamp: Date.now(),
          tool: data.tool_used,
        }];
      });
    } catch (e: any) {
      setMessages(prev => {
        const withoutLoading = prev.filter(m => !m.loading);
        return [...withoutLoading, {
          role: 'assistant' as const,
          content: `Error: ${e.message}`,
          timestamp: Date.now(),
        }];
      });
    } finally {
      setSending(false);
    }
  };

  // رفع الملفات
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

      const data = await res.json();
      if (data.success) {
        setMessages(prev => [...prev, {
          role: 'user' as const,
          content: `📎 Uploaded: ${file.name}`,
          timestamp: Date.now(),
        }]);
      }
    } catch (e: any) {
      console.error('Upload error:', e);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // تسجيل صوتي
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        await transcribeAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setRecording(true);
    } catch (e) {
      console.error('Mic error:', e);
      alert('Microphone access denied');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const res = await fetch('/api/draix/audio/transcribe', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.text) {
        setInput(data.text);
      }
    } catch (e) {
      console.error('Transcribe error:', e);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Chat Header */}
      <div className="border-b border-draix-border-light dark:border-draix-border-dark p-4">
        <h1 className="text-xl font-bold">DrAix Chat</h1>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">⬡</div>
              <h3 className="text-2xl font-display font-bold mb-2">How can I help you?</h3>
              <p className="text-draix-muted">Ask me anything, upload a file, or use voice.</p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-draix-gold text-white'
                  : 'bg-draix-surface-light dark:bg-draix-surface-dark border border-draix-border-light dark:border-draix-border-dark'
              }`}>
                {msg.loading ? (
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-xs">Thinking...</span>
                  </div>
                ) : (
                  <>
                    <div className="whitespace-pre-wrap text-sm" dir="auto">{msg.content}</div>
                    {msg.tool && (
                      <div className="mt-2 pt-2 border-t border-white/20 text-xs opacity-75">
                        ⚡ {msg.tool}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-draix-border-light dark:border-draix-border-dark p-4">
        <div className="max-w-3xl mx-auto flex items-center gap-2">
          {/* File Upload Button */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || sending}
            className="p-3 rounded-xl hover:bg-draix-hover-light dark:hover:bg-draix-hover-dark transition-colors"
            title="Upload file"
          >
            {uploading ? '⏳' : '📎'}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            disabled={sending}
            className="flex-1 bg-draix-surface-light dark:bg-draix-surface-dark border border-draix-border-light dark:border-draix-border-dark rounded-xl px-4 py-3 focus:outline-none focus:border-draix-gold"
          />

          {/* Mic Button */}
          <button
            onClick={recording ? stopRecording : startRecording}
            className={`p-3 rounded-xl transition-colors ${recording ? 'bg-red-500 text-white animate-pulse' : 'hover:bg-draix-hover-light dark:hover:bg-draix-hover-dark'}`}
            title={recording ? 'Stop recording' : 'Voice message'}
          >
            {recording ? '⏹️' : '🎤'}
          </button>

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="bg-draix-gold text-white p-3 rounded-xl hover:bg-draix-gold-hover transition-colors disabled:opacity-50"
          >
            {sending ? '⏳' : '➤'}
          </button>
        </div>
      </div>
    </div>
  );
}
