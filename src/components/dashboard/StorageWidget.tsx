'use client';

import '../../app/globals.css';

interface StorageMetrics {
  usedGB: number;
  totalGB: number;
  bandwidthThisMonth: number;
}

export default function StorageWidget() {
  // TODO: Fetch from Supabase user metrics
  // Query: SELECT storage_used_gb, storage_limit_gb, bandwidth_this_month_gb FROM creator_metrics WHERE user_id = user.id
  const metrics: StorageMetrics = {
    usedGB: 45.2,
    totalGB: 100,
    bandwidthThisMonth: 1240,
  };

  const percentUsed = (metrics.usedGB / metrics.totalGB) * 100;

  return (
    <div className="card">
      <div className="mono" style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '12px' }}>
        storage_bandwidth
      </div>

      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
          <span>Storage</span>
          <span className="mono" style={{ fontWeight: 600 }}>
            {metrics.usedGB} GB / {metrics.totalGB} GB
          </span>
        </div>
        <div
          style={{
            height: '4px',
            background: 'var(--hover-fill)',
            borderRadius: 'var(--radius)',
            overflow: 'hidden',
            border: '1px solid var(--border)',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${percentUsed}%`,
              background: 'var(--ink)',
              transition: 'width 0.3s ease',
            }}
          ></div>
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
          <span>Bandwidth (this month)</span>
          <span className="mono" style={{ fontWeight: 600 }}>
            {metrics.bandwidthThisMonth} GB
          </span>
        </div>
        <div style={{ fontSize: '11px', color: 'var(--muted)' }} className="mono">
          monthly_limit: 5000 GB
        </div>
      </div>
    </div>
  );
}
