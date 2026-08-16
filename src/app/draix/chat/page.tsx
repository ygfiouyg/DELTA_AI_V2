'use client';
import { useState, useRef, useEffect } from 'react';

interface Message { role: 'user' | 'assistant'; content: string; timestamp: number; loading?: boolean; source?: string; }

export default function DrAixChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [recording, setRecording] = useState(false);
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || sending) return;
    const userMsg: Message = { role: 'user', content: input.trim(), timestamp: Date.now() };
    const loadingMsg: Message = { role: 'assistant', content: '', timestamp: Date.now(), loading: true };
    setMessages(prev => [...prev, userMsg, loadingMsg]);
    setInput(''); setSending(true);

    try {
      const res = await fetch('/api/draix/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: userMsg.content }) });
      const data = await res.json();
      setMessages(prev => {
        const withoutLoading = prev.filter(m => !m.loading);
        return [...withoutLoading, { role: 'assistant' as const, content: data.response || data.error || 'No response', timestamp: Date.now(), source: data.source }];
      });
    } catch (e: any) {
      setMessages(prev => { const w = prev.filter(m => !m.loading); return [...w, { role: 'assistant' as const, content: `Error: ${e.message}`, timestamp: Date.now() }]; });
    } finally { setSending(false); }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return; setUploading(true);
    try {
      const formData = new FormData(); formData.append('file', file);
      const res = await fetch('/api/draix/files/upload', { method: 'POST', body: formData });
      if (res.ok) setMessages(prev => [...prev, { role: 'user' as const, content: `📎 Uploaded: ${file.name}`, timestamp: Date.now() }]);
    } catch (e: any) {} finally { setUploading(false); if (fileInputRef.current) fileInputRef.current.value = ''; }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream); const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        try { const formData = new FormData(); formData.append('audio', audioBlob, 'recording.webm'); const res = await fetch('/api/draix/audio/transcribe', { method: 'POST', body: formData }); const data = await res.json(); if (data.text) setInput(data.text); } catch (e) {}
        stream.getTracks().forEach(track => track.stop());
      };
      mediaRecorder.start(); mediaRecorderRef.current = mediaRecorder; setRecording(true);
    } catch (e) { alert('Microphone access denied'); }
  };

  const stopRecording = () => { if (mediaRecorderRef.current) { mediaRecorderRef.current.stop(); setRecording(false); } };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}><h1 style={{ fontSize: '20px' }}>Chat</h1></div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ fontSize: '44px', marginBottom: '12px' }}>⬡</div>
              <h2 style={{ fontSize: '24px', marginBottom: '6px' }}>How can I help you?</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Ask me anything, upload a file, or use voice.</p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className="drx-fade-in" style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              {msg.loading ? (
                <div className="drx-bubble-ai" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className="drx-dots"><span></span><span></span><span></span></div>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Thinking...</span>
                </div>
              ) : (
                <div className={msg.role === 'user' ? 'drx-bubble-user' : 'drx-bubble-ai'}>
                  <div style={{ whiteSpace: 'pre-wrap' }} dir="auto">{msg.content}</div>
                  {msg.source && <div style={{ marginTop: '6px', paddingTop: '6px', borderTop: '1px solid var(--border)', fontSize: '11px', color: 'var(--text-muted)' }}>⚡ {msg.source}</div>}
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} style={{ display: 'none' }} />
          <button onClick={() => fileInputRef.current?.click()} disabled={uploading || sending} className="drx-btn-ghost" style={{ padding: '12px', fontSize: '18px' }}>{uploading ? '⏳' : '📎'}</button>
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Type a message..." disabled={sending} className="drx-input" style={{ flex: 1 }} />
          <button onClick={recording ? stopRecording : startRecording} className={recording ? 'drx-btn-primary' : 'drx-btn-ghost'} style={{ padding: '12px', fontSize: '18px', background: recording ? '#D4645A' : undefined }}>{recording ? '⏹️' : '🎤'}</button>
          <button onClick={handleSend} disabled={!input.trim() || sending} className="drx-btn-primary" style={{ padding: '12px 18px', fontSize: '16px' }}>{sending ? '⏳' : '➤'}</button>
        </div>
      </div>
    </div>
  );
}
