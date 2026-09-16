'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function ImageGrid() {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function fetchAssets() {
      const { data, error } = await supabase
        .from('images')
        .select('id, title, preview_url')
        .order('created_at', { ascending: false });

      if (data) setAssets(data);
      setLoading(false);
    }
    fetchAssets();
  }, [supabase]);

  if (loading) return <div className="mono" style={{ fontSize: '13px' }}>[ loading_vault... ]</div>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
      {assets.map((asset) => (
        <div 
          key={asset.id} 
          onClick={() => router.push(`/asset/${asset.id}`)}
          style={{ cursor: 'pointer', border: '1px solid var(--border)', padding: '8px' }}
        >
          <img src={asset.preview_url} alt={asset.title} style={{ width: '100%', height: 'auto' }} />
          <div className="mono" style={{ fontSize: '12px', marginTop: '8px' }}>{asset.title}</div>
        </div>
      ))}
    </div>
  );
}
