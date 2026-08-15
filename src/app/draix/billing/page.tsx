'use client';
import { useEffect, useState } from 'react';
export default function BillingPage() {
  const [billing, setBilling] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetchBilling(); }, []);
  const fetchBilling = async () => {
    try { const res = await fetch('/api/draix/billing'); if (res.ok) { setBilling(await res.json()); } } catch(e){} finally { setLoading(false); }
  };
  return (
    <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' }}>💳 Billing</h1>
      <div className="draix-card">
        {loading ? <p>Loading...</p> : billing ? (
          <div>
            <p style={{ marginBottom: '12px' }}><strong>Plan:</strong> {billing.plan || 'Free'}</p>
            <p style={{ marginBottom: '12px' }}><strong>Tokens Used:</strong> {billing.tokens_used || 0} / {billing.tokens_limit || '∞'}</p>
            <p><strong>Renewal:</strong> {billing.renewal_date ? new Date(billing.renewal_date).toLocaleDateString() : 'N/A'}</p>
          </div>
        ) : <p>No billing info</p>}
      </div>
    </div>
  );
}
