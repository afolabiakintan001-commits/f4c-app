'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';

// Types derived from schema
type AccessType = 'FREE' | 'FULLY_FREE' | 'MONEY';

interface Asset {
  id: string;
  title: string;
  category: string;
  file_type: string;
  preview_url: string;
  resolution: string;
  access_type: AccessType;
  price_gbp: number | null;
  created_at: string;
  tags: string[];
}

export default function HomePage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const CATEGORIES = ['ALL', 'Frames & Stills', 'Textures & Overlays', 'Presets & Project Files', '3D & Graphics'];

  useEffect(() => {
    async function fetchAssets() {
      setLoading(true);
      let query = supabase
        .from('images')
        .select('*')
        .order('created_at', { ascending: false });

      if (activeCategory !== 'ALL') {
        query = query.eq('category', activeCategory);
      }

      const { data, error } = await query;
      if (data) setAssets(data);
      setLoading(false);
    }
    fetchAssets();
  }, [activeCategory]);

  const filteredAssets = assets.filter(asset => 
    asset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
    asset.file_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ background: '#fdfdfc', minHeight: '100vh', fontFamily: 'monospace' }}>
      <Header />
      
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        {/* 1. Hero Vault Index Banner */}
        <div style={{ border: '1px solid #0a0a0a', padding: '32px', marginBottom: '40px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '32px', marginBottom: '20px', fontWeight: 'bold' }}>[ F4CREATORS VAULT_INDEX ]</h1>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '11px', color: '#71716b', justifyContent: 'center' }}>
            <span>[ TOTAL_INDEXED: {assets.length} ]</span>
            <span>[ CATEGORIES: 4 ]</span>
            <span>[ STATUS: ONLINE ]</span>
          </div>
        </div>

        {/* 2 & 3. Search Bar and Category Buttons */}
        <div style={{ marginBottom: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <input 
            type="text" 
            placeholder="[ SEARCH_ASSETS... ]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '12px', border: '1px solid #dcdcd7', fontFamily: 'monospace', outline: 'none' }}
          />
          
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} 
                style={{ 
                  padding: '8px 12px', 
                  border: activeCategory === cat ? '1px solid #0a0a0a' : '1px solid #dcdcd7', 
                  background: activeCategory === cat ? '#0a0a0a' : '#fff', 
                  color: activeCategory === cat ? '#fff' : '#0a0a0a', 
                  fontSize: '11px', 
                  cursor: 'pointer',
                  borderRadius: 0
                }}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Vault Grid & Empty State */}
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>[ LOADING_VAULT... ]</div>
        ) : filteredAssets.length === 0 ? (
          <div style={{ padding: '80px', textAlign: 'center', border: '1px solid #dcdcd7', color: '#71716b' }}>[ NO_RECORDS_FOUND_IN_VAULT ]</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {filteredAssets.map(asset => (
              <div key={asset.id} style={{ border: '1px solid #dcdcd7', background: '#fff', boxShadow: '4px 4px 0px #0a0a0a', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <img src={asset.preview_url} alt={asset.title} style={{ width: '100%', height: '200px', objectFit: 'cover', border: '1px solid #dcdcd7' }} />
                <h3 style={{ fontSize: '14px', margin: 0 }}>{asset.title}</h3>
                <div style={{ fontSize: '10px', color: '#71716b' }}>
                  {asset.file_type} | {asset.resolution} | {asset.access_type === 'MONEY' ? `£${asset.price_gbp}` : asset.access_type}
                </div>
                <Link href={`/asset/${asset.id}`} style={{ marginTop: 'auto', display: 'block', textAlign: 'center', padding: '10px', border: '1px solid #0a0a0a', color: '#0a0a0a', textDecoration: 'none', fontSize: '11px', fontWeight: 'bold' }}>
                  [ INSPECT_ASSET ]
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
