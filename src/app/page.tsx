'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import AssetModal from '@/components/AssetModal';

interface Asset {
  id: string;
  title: string;
  preview_url: string;
  master_file_url: string;
  resolution: string;
  category: string;
  access_type: 'FREE' | 'FULLY_FREE' | 'MONEY';
  price_gbp?: number;
  profiles: {
    username: string;
    is_verified: boolean;
  };
}

interface Creator {
  username: string;
  avatar_url: string;
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [totalFiles, setTotalFiles] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);

      // Query live assets joined with profiles
      let assetQuery = supabase
        .from('images')
        .select(`
          id, title, preview_url, resolution, category, access_type, price_gbp,
          profiles:user_id ( username, is_verified )
        `);

      if (searchTerm) {
        assetQuery = assetQuery.or(
          `title.ilike.%${searchTerm}%`
        );
      }

      if (activeTab !== 'ALL') {
        assetQuery = assetQuery.eq('category', activeTab);
      }

      const { data: assetData } = await assetQuery
        .order('created_at', { ascending: false })
        .limit(24);

      if (assetData) {
        setAssets(assetData as unknown as Asset[]);
      }

      // Query total files count
      const { count } = await supabase
        .from('images')
        .select('*', { count: 'exact', head: true });

      setTotalFiles(count || 0);

      // Query top verified creators
      const { data: creatorData } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .limit(8);

      if (creatorData) {
        setCreators(creatorData);
      }

      setLoading(false);
    }

    loadData();
  }, [activeTab, searchTerm]);

  const categories = ['ALL', 'RAW', '4K', 'PORTRAIT', 'LANDSCAPE', 'MONOCHROME', 'EDITORIAL'];

  return (
    <>

      <div className="wrap">
        {/* Search & Filter Bar */}
        <section style={{ marginBottom: '32px' }}>
          <div className="search-shell" style={{ marginBottom: '16px' }}>
            <span className="prompt mono">&gt;</span>
            <input
              type="text"
              placeholder="search asset title or creator handle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className="mono"
                style={{
                  padding: '4px 12px',
                  border: `1px solid ${activeTab === cat ? 'var(--ink)' : 'var(--border)'}`,
                  background: activeTab === cat ? 'var(--hover-fill)' : 'transparent',
                  fontSize: '11px',
                  cursor: 'pointer',
                }}
              >
                [{cat}]
              </button>
            ))}
          </div>
        </section>

        <section className="hero">
          <div className="hero-left">
            <div className="eyebrow"><span className="sq"></span><span>ONE-OF-ONE ASSET VAULT</span></div>
            <h1>Full resolution.<br />Zero compression.</h1>
            <p>Verified creators host original PNGs, overlays and 4K wallpapers here, untouched by platform compression or watermarks. Find any linked handle, pull the master file.</p>   
            <div className="hero-ctas">
              <a href="/submit" className="btn-solid">Submit work</a>
              <a href="#sheet" className="btn-outline">Explore vault</a>
            </div>
          </div>
          <div className="readout">
            <div className="readout-title">vault status</div>
            <div className="readout-row"><span className="k">files indexed</span><span className="v">{totalFiles.toLocaleString()}</span></div>
            <div className="readout-row"><span className="k">min. resolution</span><span className="v">4096×2304</span></div>
            <div className="readout-row"><span className="k">formats</span><span className="v">PNG · PSD · MOV</span></div>
            <div className="readout-row"><span className="k">watermarks</span><span className="v">0<span className="cursor-blink"></span></span></div>
          </div>
        </section>

        <div className="creators-strip">
          <span className="cs-label">trending —</span>
          {creators.length > 0 ? (
            creators.map((c) => (
              <div className="creator-chip" key={c.username}>
                <div className="avatar" style={{ backgroundImage: `url(${c.avatar_url || '/default-avatar.png'})` }}></div>
                <span className="handle">@{c.username}</span>
                <span className="sq-verified"></span>
              </div>
            ))
          ) : (
            <span className="mono" style={{ fontSize: '12px', color: 'var(--muted)' }}>[ waiting for verified creators... ]</span>
          )}
        </div>

        <div className="ruler">
          <span>showing 001–{String(assets.length).padStart(3, '0')} of {totalFiles}</span>  
          <div className="ruler-ticks">
            {Array.from({ length: 16 }).map((_, idx) => (
              <div className="tick" key={idx}></div>
            ))}
          </div>
          <span>sorted by newest</span>
        </div>

        <div className="contact-sheet" id="sheet">
          {loading ? (
            <div style={{ padding: '60px', gridColumn: 'span 6', textAlign: 'center' }} className="mono">
              [ querying live database... ]
            </div>
          ) : assets.length > 0 ? (
            assets.map((item, i) => {
              const code = 'F' + String(i + 1).padStart(3, '0');
              const tierBadge = item.access_type === 'MONEY'
                ? `£${item.price_gbp}`
                : item.access_type === 'FULLY_FREE'
                ? 'FULLY FREE'
                : 'FREE';

              return (
                <div className="frame" key={item.id} onClick={() => setSelectedAsset(item)} style={{ cursor: 'pointer' }}>
                  <div className="frame-img-wrap">
                    <img src={item.preview_url} alt={item.title || 'Vault Asset'} />
                    <span className="frame-code">[{code}]</span>
                    <span className="frame-tier">{tierBadge}</span>
                  </div>
                  <div className="frame-caption">
                    <div className="handle-row">
                      <span className="handle">@{item.profiles?.username || 'creator'}</span>
                      {item.profiles?.is_verified && <span className="sq-verified"></span>}  
                    </div>
                    <span className="res">{item.resolution || '4096×2304'}</span>
                  </div>
                </div>
              );
            })
          ) : (
            <div
              style={{
                gridColumn: 'span 6',
                padding: '80px 20px',
                textAlign: 'center',
                background: '#fff',
                border: '1px solid var(--border)'
              }}
              className="mono"
            >
              <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>       
                [ INDEX EMPTY — NO PUBLISHED ASSETS YET ]
              </div>
              <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '20px' }}>
                Be the first verified creator to host uncompressed 4K assets on F4C.
              </div>
              <a href="/become-creator" className="btn-bracket" style={{ display: 'inline-block' }}>
                [ become a creator — £5 ]
              </a>
            </div>
          )}
        </div>
      </div>

      <AssetModal asset={selectedAsset} onClose={() => setSelectedAsset(null)} />

      <footer>
        <div className="wrap" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <span>[ uncompressed · unwatermarked · verified creators only ]</span>
          <span>F4C © 2026</span>
        </div>
      </footer>
    </>
  );
}
