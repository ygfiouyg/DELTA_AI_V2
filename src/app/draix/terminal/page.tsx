'use client';
export default function TerminalPage() {
  return (
    <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' }}>🧪 Terminal Backend</h1>
      <div className="draix-card">
        <h3 style={{ fontWeight: 'bold', marginBottom: '16px' }}>Backend Configuration</h3>
        <p style={{ color: 'var(--draix-muted)', marginBottom: '16px' }}>Configure the terminal backend used by the agent for command execution.</p>
        <select className="draix-input" defaultValue="local">
          <option value="local">Local (default)</option>
          <option value="docker">Docker</option>
          <option value="ssh">SSH</option>
          <option value="modal">Modal (Cloud)</option>
        </select>
      </div>
    </div>
  );
}
