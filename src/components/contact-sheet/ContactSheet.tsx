'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function ContactSheet({ searchQuery }: { searchQuery: string }) {
  const [images, setImages] = useState<any[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      let query = supabase
        .from('images')
        .select('*, profiles(username)');

      if (searchQuery) {
        query = query.or(`profiles.username.ilike.%${searchQuery}%,creator_handle.ilike.%${searchQuery}%`);
      }

      const { data } = await query;
      setImages(data || []);
    };
    fetchImages();
  }, [searchQuery]);

  return (
    <div className="grid grid-cols-6 gap-2 p-4">
      {images.map(img => (
        <div key={img.id} className="border border-neutral-200 p-2 text-[10px] font-mono">
          <div>{img.id.slice(0, 8)}</div>
          <div>{img.resolution}</div>
          <div className="font-bold">{img.access_type}</div>
          <div>@{img.profiles?.username}</div>
          {img.is_verified && <div className="w-2 h-2 bg-black" />}
        </div>
      ))}
    </div>
  );
}
