'use client';

import '../../app/globals.css';

interface TelemetryMetrics {
  totalDownloads: number;
  uniqueDownloaders: number;
  avgDownloadTime: number;
  errorRate: number;
}

export default function DeliveryTelemetry() {
  // TODO: Fetch from Supabase analytics table
  const metrics: TelemetryMetrics = {
    totalDownloads: 342,
    uniqueDownloaders: 156,
    avgDownloadTime: 12.4,
    errorRate: 0.2,
  };

  return (
    <div className="card">
      <div className="mono" style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '12px' }}>
        delivery_telemetry
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
          <span>Total downloads</span>
          <span className="mono" style={{ fontWeight: 600 }}>
            {metrics.totalDownloads}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
          <span>Unique downloaders</span>
          <span className="mono" style={{ fontWeight: 600 }}>
            {metrics.uniqueDownloaders}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
          <span>Avg download time</span>
          <span className="mono" style={{ fontWeight: 600 }}>
            {metrics.avgDownloadTime}s
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
          <span>Error rate</span>
          <span className="mono" style={{ fontWeight: 600, color: metrics.errorRate > 1 ? '#a00' : 'var(--muted)' }}>
            {metrics.errorRate}%
          </span>
        </div>
      </div>
    </div>
  );
}
