'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Creator {
  profile_id: string;
  username: string;
  avatar_url: string;
  total_downloads: number;
}

interface FeaturedAsset {
  id: string;
  title: string;
  url: string;
  access_type: 'MONEY' | 'FREE' | 'FULLY_FREE';
  point_cost: number;
  profiles: { username: string };
}

export function Hero() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [featuredAsset, setFeaturedAsset] = useState<FeaturedAsset | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: topCreators } = await supabase.rpc('get_top_creators_this_week');
      setCreators(topCreators || []);

      const { data: asset } = await supabase
        .from('images')
        .select('id, title, url, access_type, point_cost, profiles(username)')
        .order('download_count', { ascending: false })
        .limit(1)
        .single();
      setFeaturedAsset(asset as unknown as FeaturedAsset);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <section className="grid grid-cols-12 gap-8 px-6 pt-12 pb-16">
      {/* Left Column (2/3) */}
      <div className="col-span-8 flex flex-col justify-center">
        <h1 className="text-6xl font-extrabold text-black mb-6 tracking-tighter">
          High-Fidelity Assets for Creators
        </h1>
        <p className="text-xl text-neutral-600 mb-8 max-w-lg">
          Direct access to uncompressed 4K PNGs, wallpapers, and design presets hosted by top social creators.
        </p>
        <div className="flex gap-4">
          <button className="bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-neutral-800 transition">
            Submit Work
          </button>
          <button className="bg-white text-black border border-neutral-300 px-8 py-3 rounded-full font-semibold hover:bg-neutral-50 transition">
            Explore Assets
          </button>
        </div>
      </div>

      {/* Right Column (1/3) */}
      <div className="col-span-4 border border-neutral-200 rounded-3xl p-6 bg-white">
        <h3 className="font-semibold text-neutral-400 text-sm uppercase tracking-wider mb-6">
          Top Creators This Week
        </h3>
        {loading ? (
            <div className="space-y-4">
                {[1,2,3,4].map(i => <div key={i} className="h-12 w-full bg-neutral-100 rounded-xl animate-pulse" />)}
            </div>
        ) : creators.length > 0 ? (
          <div className="space-y-4">
            {creators.map((c) => (
              <div key={c.profile_id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={c.avatar_url} alt={c.username} className="w-10 h-10 rounded-full bg-neutral-100" />
                  <span className="font-semibold text-sm">@{c.username}</span>
                </div>
                <span className="text-xs text-neutral-500">{c.total_downloads} downloads</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-neutral-500">No top creators this week</p>
        )}
      </div>
    </section>
  );
}
