'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  loading?: boolean;
  source?: string;
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
          source: data.source,
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/draix/files/upload', { method: 'POST', body: formData });
      if (res.ok) {
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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        try {
          const formData = new FormData();
          formData.append('audio', audioBlob, 'recording.webm');
          const res = await fetch('/api/draix/audio/transcribe', { method: 'POST', body: formData });
          const data = await res.json();
          if (data.text) setInput(data.text);
        } catch (e) { console.error('Transcribe error:', e); }
        stream.getTracks().forEach(track => track.stop());
      };
      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setRecording(true);
    } catch (e) {
      alert('Microphone access denied');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Header */}
      <div style={{ padding: '20px 32px', borderBottom: '1px solid var(--draix-border)' }}>
        <h1 style={{ fontSize: '22px' }}>Chat</h1>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>⬡</div>
              <h2 style={{ fontSize: '28px', marginBottom: '8px' }}>How can I help you?</h2>
              <p style={{ color: 'var(--draix-muted)', fontSize: '15px' }}>Ask me anything, upload a file, or use voice.</p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className="draix-fade-in" style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              {msg.loading ? (
                <div className="draix-bubble-ai" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className="draix-dots"><span></span><span></span><span></span></div>
                  <span style={{ fontSize: '13px', color: 'var(--draix-muted)' }}>Thinking...</span>
                </div>
              ) : (
                <div className={msg.role === 'user' ? 'draix-bubble-user' : 'draix-bubble-ai'}>
                  <div style={{ whiteSpace: 'pre-wrap' }} dir="auto">{msg.content}</div>
                  {msg.source && (
                    <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--draix-border)', fontSize: '11px', color: 'var(--draix-muted)' }}>
                      ⚡ {msg.source}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div style={{ padding: '20px 32px', borderTop: '1px solid var(--draix-border)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} style={{ display: 'none' }} />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || sending}
            style={{ background: 'none', border: '1px solid var(--draix-border)', borderRadius: '12px', padding: '12px', cursor: 'pointer', fontSize: '18px', color: 'var(--draix-text)' }}
          >
            {uploading ? '⏳' : '📎'}
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            disabled={sending}
            className="draix-input"
            style={{ flex: 1 }}
          />

          <button
            onClick={recording ? stopRecording : startRecording}
            style={{
              background: recording ? '#EF4444' : 'none',
              border: '1px solid var(--draix-border)',
              borderRadius: '12px',
              padding: '12px',
              cursor: 'pointer',
              fontSize: '18px',
              color: recording ? '#FFFFFF' : 'var(--draix-text)',
            }}
          >
            {recording ? '⏹️' : '🎤'}
          </button>

          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="draix-btn-primary"
            style={{ padding: '12px 20px' }}
          >
            {sending ? '⏳' : '➤'}
          </button>
        </div>
      </div>
    </div>
  );
}
