'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ImageGrid } from '@/components/ImageGrid';
import { ImageGridSkeleton } from '@/components/ImageGridSkeleton';

export function TrendingAssets() {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssets = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('images')
        .select('id, url, title, download_count, access_type, profiles(username)')
        .order('created_at', { ascending: false });
      
      setAssets(data?.map(a => ({
        id: a.id,
        url: a.url,
        author_handle: a.profiles?.username,
        download_count: a.download_count,
        access_type: a.access_type
      })) || []);
      setLoading(false);
    };
    fetchAssets();
  }, []);

  if (loading) return <ImageGridSkeleton />;

  return <ImageGrid assets={assets} />;
}
