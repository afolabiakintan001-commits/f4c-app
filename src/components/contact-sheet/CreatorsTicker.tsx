'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function CreatorsTicker() {
  const [creators, setCreators] = useState<any[]>([]);

  useEffect(() => {
    const fetchCreators = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('is_verified', true)
        .order('download_count', { ascending: false })
        .limit(10);
      setCreators(data || []);
    };
    fetchCreators();
  }, []);

  return (
    <div className="flex gap-4 overflow-x-auto p-4 border-y border-neutral-200">
      {creators.map(c => (
        <div key={c.username} className="flex items-center gap-2 border border-neutral-200 rounded-full px-3 py-1 text-xs">
          <img src={c.avatar_url} className="w-5 h-5 rounded-full" />
          <span>@{c.username}</span>
        </div>
      ))}
    </div>
  );
}
