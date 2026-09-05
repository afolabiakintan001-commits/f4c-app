'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function ReadoutPanel() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      const { count } = await supabase
        .from('images')
        .select('*', { count: 'exact', head: true });
      setCount(count || 0);
    };
    fetchCount();
  }, []);

  return (
    <div className="font-mono text-sm p-4 border-b border-neutral-200">
      INDEX_COUNT: {count.toString().padStart(6, '0')}
    </div>
  );
}
