'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import AssetModal from '@/components/AssetModal';

interface Asset {
  id: string;
  title: string;
  preview_url: string;
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
  const [activeTab, setActiveTab] = useState('All');
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

      if (activeTab !== 'All') {
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

  return (
    <>
      <style jsx global>{`
        :root {
          --ink: #0a0a0a;
          --paper: #ffffff;
          --border: #dcdcd7;
          --grid-line: rgba(10, 10, 10, 0.045);
          --muted: #71716b;
          --radius: 2px;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'Space Grotesk', sans-serif;
          color: var(--ink);
          background:
            linear-gradient(var(--grid-line) 1px, transparent 1px),
            linear-gradient(90deg, var(--grid-line) 1px, transparent 1px),
            var(--paper);
          background-size: 28px 28px;
          -webkit-font-smoothing: antialiased;
        }

        .mono { font-family: 'IBM Plex Mono', monospace; }
        .wrap { max-width: 1440px; margin: 0 auto; padding: 0 32px; }

        header {
          border-bottom: 1px solid var(--border);
          position: sticky; top: 0; background: rgba(255,255,255,0.94);
          backdrop-filter: blur(8px);
          z-index: 10;
        }
        .header-row {
          display: flex; align-items: center; justify-content: space-between;
          height: 64px; gap: 32px;
        }
        .logo {
          display: flex; align-items: center; gap: 8px;
          font-weight: 700; font-size: 19px; letter-spacing: -0.02em; flex: 0 0 auto;
        }
        .logo .mark { width: 14px; height: 14px; background: var(--ink); display: inline-block; }

        .search-shell {
          flex: 1 1 auto; max-width: 420px;
          display: flex; align-items: center; gap: 8px;
          border-bottom: 1px solid var(--border);
          padding: 8px 2px;
        }
        .search-shell .prompt { font-size: 13px; color: var(--muted); flex: 0 0 auto; }
        .search-shell input {
          border: none; outline: none; font-size: 13px; width: 100%;
          color: var(--ink); background: transparent;
        }

        .nav-right { display: flex; align-items: center; gap: 18px; flex: 0 0 auto; }
        .link-plain { font-size: 13.5px; color: var(--ink); text-decoration: none; font-weight: 500; }
        .btn-bracket {
          display: inline-flex; align-items: center; gap: 2px;
          background: var(--ink); color: #fff;
          font-size: 12.5px; font-weight: 500; padding: 9px 12px; border-radius: var(--radius);
          text-decoration: none; white-space: nowrap;
        }

        .ledger {
          display: flex; gap: 26px; padding: 16px 0; overflow-x: auto;
          border-bottom: 1px solid var(--border); font-size: 13px;
        }
        .ledger-item {
          white-space: nowrap; cursor: pointer; color: var(--muted);
          padding-bottom: 12px; border-bottom: 2px solid transparent;
          display: flex; align-items: baseline; gap: 5px;
        }
        .ledger-item.active { color: var(--ink); font-weight: 600; border-bottom-color: var(--ink); }

        .hero {
          padding: 52px 0 40px;
          display: grid; grid-template-columns: 1.3fr 0.9fr; gap: 48px; align-items: stretch;
        }
        @media (max-width: 860px) { .hero { grid-template-columns: 1fr; } }

        .hero-left { display: flex; flex-direction: column; justify-content: center; }
        .eyebrow { display: flex; align-items: center; gap: 8px; margin-bottom: 18px; }
        .eyebrow .sq { width: 7px; height: 7px; background: var(--ink); }
        .eyebrow span { font-size: 12.5px; color: var(--muted); font-weight: 500; font-family: 'IBM Plex Mono', monospace; }
        h1 {
          font-weight: 600; font-size: clamp(38px, 4.6vw, 58px);
          line-height: 0.98; letter-spacing: -0.03em; margin-bottom: 20px;
        }
        .hero p { font-size: 15.5px; color: var(--muted); line-height: 1.55; max-width: 440px; margin-bottom: 26px; }
        .hero-ctas { display: flex; gap: 10px; }
        .btn-solid { background: var(--ink); color: #fff; font-size: 13.5px; font-weight: 500; padding: 11px 18px; border-radius: var(--radius); text-decoration: none; }
        .btn-outline { border: 1px solid var(--border); color: var(--ink); background: transparent; font-size: 13.5px; font-weight: 500; padding: 10px 18px; border-radius: var(--radius); text-decoration: none; }

        .readout { border: 1px solid var(--border); border-radius: var(--radius); padding: 20px 22px; background: #fff; display: flex; flex-direction: column; }
        .readout-title { font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: var(--muted); padding-bottom: 12px; margin-bottom: 12px; border-bottom: 1px solid var(--border); }
        .readout-row { display: flex; justify-content: space-between; align-items: center; padding: 9px 0; border-bottom: 1px solid var(--border); font-family: 'IBM Plex Mono', monospace; font-size: 12.5px; }
        .readout-row:last-of-type { border-bottom: none; }
        .readout-row .k { color: var(--muted); }
        .readout-row .v { font-weight: 600; }
        .cursor-blink { display: inline-block; width: 7px; height: 13px; background: var(--ink); margin-left: 6px; animation: blink 1s step-end infinite; vertical-align: -2px; }
        @keyframes blink { 50% { opacity: 0; } }

        .creators-strip { display: flex; align-items: center; gap: 22px; overflow-x: auto; padding: 14px 0; border-bottom: 1px solid var(--border); font-family: 'IBM Plex Mono', monospace; }
        .creators-strip .cs-label { font-size: 11.5px; color: var(--muted); flex: 0 0 auto; padding-right: 16px; border-right: 1px solid var(--border); margin-right: 2px; }
        .creator-chip { display: flex; align-items: center; gap: 7px; flex: 0 0 auto; }
        .creator-chip .avatar { width: 20px; height: 20px; border-radius: 50%; background-size: cover; background-position: center; border: 1px solid var(--border); }
        .creator-chip .handle { font-size: 12.5px; font-weight: 500; white-space: nowrap; }
        .creator-chip .sq-verified { width: 5px; height: 5px; background: var(--ink); flex: 0 0 auto; }

        .ruler { display: flex; justify-content: space-between; align-items: flex-end; padding: 22px 0 10px; font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--muted); }
        .ruler-ticks { flex: 1; display: flex; justify-content: space-between; margin: 0 20px; }
        .ruler-ticks .tick { width: 1px; height: 8px; background: var(--border); }

        .contact-sheet { display: grid; grid-template-columns: repeat(6, 1fr); gap: 1px; background: var(--border); border: 1px solid var(--border); margin-bottom: 80px; }
        @media (max-width: 1100px) { .contact-sheet { grid-template-columns: repeat(4, 1fr); } }
        @media (max-width: 680px) { .contact-sheet { grid-template-columns: repeat(2, 1fr); } }

        .frame { background: #fff; position: relative; display: flex; flex-direction: column; transition: box-shadow .15s ease; }
        .frame:hover { box-shadow: inset 0 0 0 1px var(--ink); z-index: 1; }
        .frame-img-wrap { position: relative; aspect-ratio: 4/5; overflow: hidden; background: #f1f1ef; }
        .frame-img-wrap img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .frame-code { position: absolute; top: 8px; left: 8px; font-family: 'IBM Plex Mono', monospace; font-size: 10.5px; color: #fff; background: rgba(10,10,10,0.6); padding: 2px 6px; border-radius: 2px; }
        .frame-tier { position: absolute; top: 8px; right: 8px; font-family: 'IBM Plex Mono', monospace; font-size: 10px; font-weight: 600; color: var(--ink); background: rgba(255,255,255,0.92); padding: 2px 6px; border-radius: 2px; }
        .frame-caption { padding: 8px 10px; border-top: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; gap: 6px; }
        .frame-caption .handle-row { display: flex; align-items: center; gap: 5px; min-width: 0; }
        .frame-caption .handle { font-size: 12px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .frame-caption .sq-verified { width: 5px; height: 5px; background: var(--ink); flex: 0 0 auto; }
        .frame-caption .res { font-family: 'IBM Plex Mono', monospace; font-size: 10px; color: var(--muted); flex: 0 0 auto; }

        footer { border-top: 1px solid var(--border); padding: 22px 0; font-family: 'IBM Plex Mono', monospace; font-size: 11.5px; color: var(--muted); }
      `}</style>

      <header>
        <div className="wrap header-row">
          <div className="logo"><span className="mark"></span>F4C</div>
          <div className="search-shell">
            <span className="prompt mono">&gt;</span>
            <input 
              type="text" 
              placeholder="search creator handle — any linked platform" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="nav-right">
            <a href="/login" className="link-plain">Log in</a>
            <a href="/become-creator" className="btn-bracket mono">[ become a creator — £5 ]</a>
          </div>
        </div>
        <div className="wrap ledger">
          {['All', 'Frames & Stills', 'Textures & Overlays', 'Presets & Project Files', '3D & Graphics'].map((cat) => (
            <div
              key={cat}
              className={`ledger-item ${activeTab === cat ? 'active' : ''}`}
              onClick={() => setActiveTab(cat)}
            >
              {cat}
            </div>
          ))}
        </div>
      </header>

      <div className="wrap">
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
