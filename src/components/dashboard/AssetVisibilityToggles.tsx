'use client';

import { useState, useEffect } from 'react';
import '../../app/globals.css';

interface Asset {
  id: string;
  title: string;
  preview_url: string;
  visibility: 'PUBLIC' | 'PRIVATE_VAULT';
}

interface AssetVisibilityTogglesProps {
  onAssetSelect: (asset: Asset) => void;
}

export default function AssetVisibilityToggles({ onAssetSelect }: AssetVisibilityTogglesProps) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [activeTab, setActiveTab] = useState<'PUBLIC' | 'PRIVATE_VAULT'>('PUBLIC');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // TODO: Fetch from Supabase images table filtered by user_id
    setLoading(true);
    setTimeout(() => {
      setAssets([
        { id: '1', title: 'Asset 001', preview_url: 'https://via.placeholder.com/300x400', visibility: 'PUBLIC' },
        { id: '2', title: 'Asset 002', preview_url: 'https://via.placeholder.com/300x400', visibility: 'PRIVATE_VAULT' },
        { id: '3', title: 'Asset 003', preview_url: 'https://via.placeholder.com/300x400', visibility: 'PUBLIC' },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const filteredAssets = assets.filter((a) => a.visibility === activeTab);

  return (
    <div>
      {/* LEDGER TABS */}
      <div
        style={{
          display: 'flex',
          gap: '24px',
          borderBottom: '1px solid var(--border)',
          marginBottom: '20px',
          paddingBottom: '12px',
          overflowX: 'auto',
        }}
      >
        {(['PUBLIC', 'PRIVATE_VAULT'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '13px',
              fontWeight: activeTab === tab ? 600 : 400,
              color: activeTab === tab ? 'var(--ink)' : 'var(--muted)',
              cursor: 'pointer',
              paddingBottom: '8px',
              borderBottom: activeTab === tab ? '2px solid var(--ink)' : '2px solid transparent',
              fontFamily: 'Space Grotesk',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
            }}
          >
            {tab.toLowerCase()}
          </button>
        ))}
      </div>

      {/* ASSET GRID */}
      {loading ? (
        <div className="mono" style={{ fontSize: '12px', color: 'var(--muted)', textAlign: 'center', padding: '40px 0' }}>
          [ loading assets... ]
        </div>
      ) : filteredAssets.length === 0 ? (
        <div className="mono" style={{ fontSize: '12px', color: 'var(--muted)', textAlign: 'center', padding: '40px 0' }}>
          [ no assets in {activeTab.toLowerCase()} yet ]
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }}>
          {filteredAssets.map((asset) => (
            <div
              key={asset.id}
              onClick={() => onAssetSelect(asset as any)}
              style={{
                position: 'relative',
                aspectRatio: '3/4',
                background: '#f1f1ef',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
                overflow: 'hidden',
                transition: 'box-shadow 0.15s ease, transform 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = 'inset 0 0 0 1px var(--ink)';
                e.currentTarget.style.transform = 'scale(1.01)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <img src={asset.preview_url} alt={asset.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'rgba(10, 10, 10, 0.6)',
                  color: '#fff',
                  padding: '6px 8px',
                  fontSize: '10px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                className="mono"
              >
                {asset.title}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
