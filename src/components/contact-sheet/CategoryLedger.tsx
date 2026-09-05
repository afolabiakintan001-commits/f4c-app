'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function CategoryLedger() {
  const [categories, setCategories] = useState<{name: string, count: number}[]>([]);
  const [active, setActive] = useState('All');

  useEffect(() => {
    const fetchCounts = async () => {
      // Assuming categories are tags or a specific column.
      // This query needs to be adapted to your schema.
      const { data } = await supabase
        .from('images')
        .select('category');
      
      const counts: Record<string, number> = { 'All': data?.length || 0 };
      data?.forEach(item => {
        counts[item.category] = (counts[item.category] || 0) + 1;
      });
      
      setCategories(Object.entries(counts).map(([name, count]) => ({name, count})));
    };
    fetchCounts();
  }, []);

  return (
    <div className="flex gap-4 p-4 font-mono text-xs">
        {categories.map(c => (
            <button key={c.name} onClick={() => setActive(c.name)} className={active === c.name ? 'text-black' : 'text-neutral-400'}>
                {c.name} [{c.count}]
            </button>
        ))}
    </div>
  );
}
