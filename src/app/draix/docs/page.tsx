'use client';
export default function DocsPage() {
  const docs = [
    { title: 'Getting Started', url: 'https://hermes-agent.nousresearch.com/docs/getting-started/quickstart', icon: '🚀' },
    { title: 'CLI Usage', url: 'https://hermes-agent.nousresearch.com/docs/user-guide/cli', icon: '⌨️' },
    { title: 'Configuration', url: 'https://hermes-agent.nousresearch.com/docs/user-guide/configuration', icon: '⚙️' },
    { title: 'Messaging Gateway', url: 'https://hermes-agent.nousresearch.com/docs/user-guide/messaging', icon: '📱' },
    { title: 'Security', url: 'https://hermes-agent.nousresearch.com/docs/user-guide/security', icon: '🔒' },
    { title: 'Tools & Toolsets', url: 'https://hermes-agent.nousresearch.com/docs/user-guide/features/tools', icon: '🛠️' },
    { title: 'Skills System', url: 'https://hermes-agent.nousresearch.com/docs/user-guide/features/skills', icon: '🧠' },
    { title: 'Memory', url: 'https://hermes-agent.nousresearch.com/docs/user-guide/features/memory', icon: '💾' },
    { title: 'MCP Integration', url: 'https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp', icon: '🔗' },
    { title: 'Cron Scheduling', url: 'https://hermes-agent.nousresearch.com/docs/user-guide/features/cron', icon: '⏰' },
    { title: 'Architecture', url: 'https://hermes-agent.nousresearch.com/docs/developer-guide/architecture', icon: '🏗️' },
    { title: 'Contributing', url: 'https://hermes-agent.nousresearch.com/docs/developer-guide/contributing', icon: '🤝' },
  ];
  return (
    <div style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' }}>📚 Documentation</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
        {docs.map(d => (
          <a key={d.title} href={d.url} target="_blank" rel="noopener" className="draix-card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>{d.icon}</div>
            <h3 style={{ fontWeight: 'bold' }}>{d.title}</h3>
            <p style={{ fontSize: '12px', color: 'var(--draix-gold)', marginTop: '4px' }}>Read →</p>
          </a>
        ))}
      </div>
    </div>
  );
}
