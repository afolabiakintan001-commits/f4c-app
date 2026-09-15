'use client';

import '../../app/globals.css';

interface TransactionLog {
  id: string;
  type: 'purchase' | 'redeem' | 'refund' | 'bonus';
  amount: number;
  date: Date;
  description: string;
}

export default function PointsAuditLog() {
  // TODO: Fetch from Supabase profiles table (points_balance column)
  const balance = 1250;
  const transactions: TransactionLog[] = [
    { id: '1', type: 'redeem', amount: -50, date: new Date('2024-09-10'), description: 'Asset redeem' },
    { id: '2', type: 'bonus', amount: 100, date: new Date('2024-09-08'), description: 'Welcome bonus' },
    { id: '3', type: 'purchase', amount: -100, date: new Date('2024-09-05'), description: 'Stripe purchase' },
  ];

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div className="mono" style={{ fontSize: '12px', color: 'var(--muted)' }}>
          points_balance
        </div>
        <div className="mono" style={{ fontSize: '16px', fontWeight: 600 }}>
          {balance} PTS
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
        <div className="mono" style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '8px' }}>
          recent_activity
        </div>
        <div style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {transactions.slice(0, 3).map((tx) => (
            <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--muted)' }} className="mono">
              <span>{tx.description}</span>
              <span style={{ color: tx.amount > 0 ? 'var(--ink)' : 'var(--muted)', fontWeight: 500 }}>
                {tx.amount > 0 ? '+' : ''}{tx.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
