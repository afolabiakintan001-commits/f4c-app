'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function FeaturedCreators() {
  const [creators, setCreators] = useState<any[]>([]);

  useEffect(() => {
    const fetchCreators = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('is_creator', true)
        .limit(6);
      setCreators(data || []);
    };
    fetchCreators();
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
      {creators.map((c) => (
        <div key={c.username} className="flex flex-col items-center text-center">
          <img src={c.avatar_url} alt={c.username} className="w-20 h-20 rounded-full mb-3 bg-gray-200" />
          <div className="font-semibold text-sm">@{c.username}</div>
        </div>
      ))}
    </div>
  );
}
